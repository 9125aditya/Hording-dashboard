"use server";

import { createClient } from "@/backend/db/server";
import { getAdminSupabase } from "@/backend/db/admin";
import { requireRole, getUserAndRole } from "./actions";
import { revalidatePath } from "next/cache";
import { sendBookingConfirmationEmail } from "@/backend/services/email-service";
import crypto from "crypto";

export interface SiteBooking {
  id: string; // admin_request row ID
  booking_id: string;
  site_id: string;
  site_name: string;
  client_name: string;
  client_email: string;
  booking_period?: string;
  booked_by_staff_id?: string;
  booked_by_staff_name: string;
  created_at: string;
  expires_at: string;
  extended_count: number;
  status: "ACTIVE" | "RELEASED" | "EXPIRED" | "CONFIRMED";
  confirmation_token: string;
  confirmation_email_status?: string;
  notes?: string;
  is_expired?: boolean;
}

export interface StaffOption {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Fetch staff and admin profiles for booking assignment dropdown
 */
export async function getStaffList(): Promise<StaffOption[]> {
  try {
    const adminClient = getAdminSupabase();
    
    // 1. Fetch from profiles
    const { data: profiles } = await adminClient
      .from("profiles")
      .select("id, name, email, role")
      .order("name", { ascending: true });

    // 2. Fetch from staff table if any
    const { data: staffMembers } = await adminClient
      .from("staff")
      .select("id, name, role")
      .order("name", { ascending: true });

    const staffMap = new Map<string, StaffOption>();

    (profiles || []).forEach((p: any) => {
      if (p.name || p.email) {
        staffMap.set(p.id, {
          id: p.id,
          name: p.name || p.email,
          email: p.email || "",
          role: p.role || "staff",
        });
      }
    });

    (staffMembers || []).forEach((s: any) => {
      if (!staffMap.has(s.id)) {
        staffMap.set(s.id, {
          id: s.id,
          name: s.name,
          email: "",
          role: s.role || "staff",
        });
      }
    });

    return Array.from(staffMap.values());
  } catch (err) {
    console.error("getStaffList error:", err);
    return [];
  }
}

/**
 * Get all active and recent site bookings indexed by site_id
 */
export async function getAllSiteBookings(): Promise<{
  bookingsBySite: Record<string, SiteBooking[]>;
  activeCountBySite: Record<string, number>;
}> {
  try {
    const adminClient = getAdminSupabase();
    const { data, error } = await adminClient
      .from("admin_requests")
      .select("*")
      .eq("action_type", "SITE_BOOKING")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getAllSiteBookings error:", error);
      return { bookingsBySite: {}, activeCountBySite: {} };
    }

    const bookingsBySite: Record<string, SiteBooking[]> = {};
    const activeCountBySite: Record<string, number> = {};
    const now = new Date();

    for (const row of data || []) {
      const p = row.payload || {};
      const siteId = String(p.site_id || row.entity_id || "");
      if (!siteId) continue;

      const expiresAt = new Date(p.expires_at || row.created_at);
      const isPastExpiry = expiresAt < now;
      let computedStatus: SiteBooking["status"] = p.status || "ACTIVE";

      if (computedStatus === "ACTIVE" && isPastExpiry) {
        computedStatus = "EXPIRED";
      }

      const booking: SiteBooking = {
        id: row.id,
        booking_id: p.booking_id || row.id,
        site_id: siteId,
        site_name: p.site_name || "Unknown Site",
        client_name: p.client_name || "Client",
        client_email: p.client_email || "",
        booking_period: p.booking_period || "",
        booked_by_staff_id: p.booked_by_staff_id || row.requested_by,
        booked_by_staff_name: p.booked_by_staff_name || "Staff",
        created_at: p.created_at || row.created_at,
        expires_at: p.expires_at || new Date(Date.now() + 5 * 86400000).toISOString(),
        extended_count: p.extended_count || 0,
        status: computedStatus,
        confirmation_token: p.confirmation_token || "",
        confirmation_email_status: p.confirmation_email_status || "SENT",
        notes: p.notes || "",
        is_expired: isPastExpiry,
      };

      if (!bookingsBySite[siteId]) {
        bookingsBySite[siteId] = [];
      }
      bookingsBySite[siteId].push(booking);

      // Count active non-expired bookings
      if (computedStatus === "ACTIVE" || computedStatus === "CONFIRMED") {
        activeCountBySite[siteId] = (activeCountBySite[siteId] || 0) + 1;
      }
    }

    return { bookingsBySite, activeCountBySite };
  } catch (err) {
    console.error("getAllSiteBookings exception:", err);
    return { bookingsBySite: {}, activeCountBySite: {} };
  }
}

/**
 * Create a new booking for a site (Max 3 simultaneous active bookings)
 */
export async function createSiteBooking(formData: FormData) {
  try {
    const supabase = await createClient();
    const { user } = await getUserAndRole(supabase);
    await requireRole(supabase, ["admin", "super_admin", "backoffice", "marketing", "execution_head"]);

    const siteId = formData.get("site_id") as string;
    const clientName = (formData.get("client_name") as string)?.trim();
    const clientEmail = (formData.get("client_email") as string)?.trim().toLowerCase();
    const bookingPeriod = (formData.get("booking_period") as string)?.trim() || "";
    const bookedByStaffId = (formData.get("booked_by_staff_id") as string) || user.id;
    const bookedByStaffName = (formData.get("booked_by_staff_name") as string)?.trim() || user.user_metadata?.name || user.email || "Staff";
    const notes = (formData.get("notes") as string)?.trim() || "";
    const sendEmail = formData.get("send_email") === "true" || formData.get("send_email") === "on";

    if (!siteId) return { error: "Site ID is required." };
    if (!clientName) return { error: "Client Name is required." };
    if (!clientEmail || !clientEmail.includes("@")) return { error: "Valid Client Email is required for booking confirmation." };

    const adminClient = getAdminSupabase();

    // 1. Fetch site details
    let query = adminClient.from("sites").select("*");
    if (/^\d+$/.test(siteId)) {
      query = query.eq("id", parseInt(siteId, 10));
    } else {
      query = query.eq("site_id", siteId);
    }
    const { data: site, error: siteErr } = await query.single();
    if (siteErr || !site) {
      return { error: "Selected site could not be found." };
    }

    const actualSiteId = site.site_id || String(site.id);

    // 2. Check current active bookings for this site (Simultaneous Limit: 3)
    const { data: existingBookings } = await adminClient
      .from("admin_requests")
      .select("*")
      .eq("action_type", "SITE_BOOKING");

    const now = new Date();
    const activeBookings = (existingBookings || []).filter((row: any) => {
      const p = row.payload || {};
      const matchSite = String(p.site_id || row.entity_id) === actualSiteId || String(p.site_id || row.entity_id) === String(site.id);
      const isPast = new Date(p.expires_at || row.created_at) < now;
      return matchSite && (p.status === "ACTIVE" || p.status === "CONFIRMED") && !isPast;
    });

    if (activeBookings.length >= 3) {
      return {
        error: `This site already has 3 active bookings (${activeBookings.length}/3 slots occupied). Maximum simultaneous booking limit reached. Please extend, release, or wait for an existing hold to expire.`,
      };
    }

    // 3. Prepare 5-day expiration and confirmation token
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(); // 5 days
    const confirmationToken = crypto.randomBytes(24).toString("hex");
    const bookingId = crypto.randomUUID();

    const bookingPayload: Record<string, any> = {
      booking_id: bookingId,
      site_id: actualSiteId,
      site_numeric_id: site.id,
      site_name: site.name || "Site",
      client_name: clientName,
      client_email: clientEmail,
      booking_period: bookingPeriod,
      booked_by_staff_id: bookedByStaffId,
      booked_by_staff_name: bookedByStaffName,
      created_at: createdAt,
      expires_at: expiresAt,
      extended_count: 0,
      status: "ACTIVE",
      confirmation_token: confirmationToken,
      confirmation_email_status: sendEmail ? "PENDING" : "SKIPPED",
      notes: notes,
    };

    // 4. Insert booking record into admin_requests
    const { data: newRequest, error: insertErr } = await adminClient
      .from("admin_requests")
      .insert([
        {
          action_type: "SITE_BOOKING",
          entity_id: null,
          payload: bookingPayload,
          requested_by: user.id,
          status: "APPROVED",
          resolved_at: createdAt,
          resolved_by: user.id,
        },
      ])
      .select("id")
      .single();

    if (insertErr) {
      console.error("Booking insert error:", insertErr);
      return { error: `Failed to create booking: ${insertErr.message}` };
    }

    // 5. Update site status if now fully booked (3/3)
    const newActiveCount = activeBookings.length + 1;
    if (newActiveCount >= 3) {
      await adminClient
        .from("sites")
        .update({ status: "Booked" })
        .eq("site_id", actualSiteId);
    }

    // 6. Send Automated Confirmation Email to Client
    let emailResult = null;
    if (sendEmail) {
      emailResult = await sendBookingConfirmationEmail({
        clientName,
        clientEmail,
        siteName: site.name || "Hoarding Site",
        siteCity: site.city || "",
        siteArea: site.area || "",
        siteType: site.type || "Billboard",
        siteSize: site.size || "",
        siteLitType: site.lit_type || "",
        bookingPeriod: bookingPeriod,
        expiresAt: expiresAt,
        staffName: bookedByStaffName,
        confirmationToken: confirmationToken,
      });

      // Update email dispatch status in payload
      bookingPayload.confirmation_email_status = emailResult.success ? (emailResult.simulated ? "SIMULATED" : "SENT") : "FAILED";
      if (newRequest?.id) {
        await adminClient
          .from("admin_requests")
          .update({ payload: bookingPayload })
          .eq("id", newRequest.id);
      }
    }

    revalidatePath("/status");
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    revalidatePath("/admin-map");
    revalidatePath("/", "layout");

    return {
      success: true,
      bookingId,
      expiresAt,
      activeSlotCount: newActiveCount,
      emailSent: sendEmail && emailResult?.success,
    };
  } catch (err: any) {
    console.error("createSiteBooking exception:", err);
    return { error: err?.message || "Failed to process booking." };
  }
}

/**
 * Manually extend a booking by 5 days (or custom days)
 */
export async function extendSiteBooking(bookingRequestId: string, additionalDays: number = 5) {
  try {
    const supabase = await createClient();
    const { user } = await getUserAndRole(supabase);
    await requireRole(supabase, ["admin", "super_admin", "backoffice", "marketing", "execution_head"]);

    const adminClient = getAdminSupabase();

    const { data: request, error: fetchErr } = await adminClient
      .from("admin_requests")
      .select("*")
      .eq("id", bookingRequestId)
      .single();

    if (fetchErr || !request) {
      return { error: "Booking record not found." };
    }

    const payload = request.payload || {};
    const currentExpiry = new Date(payload.expires_at || Date.now());
    // If already expired in past, extend from now; otherwise extend from current expiry
    const baseDate = currentExpiry > new Date() ? currentExpiry : new Date();
    const newExpiresAt = new Date(baseDate.getTime() + additionalDays * 24 * 60 * 60 * 1000).toISOString();

    const updatedPayload = {
      ...payload,
      expires_at: newExpiresAt,
      extended_count: (payload.extended_count || 0) + 1,
      last_extended_at: new Date().toISOString(),
      last_extended_by: user.id,
      status: "ACTIVE",
    };

    const { error: updateErr } = await adminClient
      .from("admin_requests")
      .update({ payload: updatedPayload })
      .eq("id", bookingRequestId);

    if (updateErr) {
      return { error: updateErr.message };
    }

    revalidatePath("/status");
    revalidatePath("/inventory");
    revalidatePath("/dashboard");

    return { success: true, newExpiresAt };
  } catch (err: any) {
    console.error("extendSiteBooking exception:", err);
    return { error: err?.message || "Failed to extend booking." };
  }
}

/**
 * Manually unbook / release a booking slot immediately
 */
export async function releaseSiteBooking(bookingRequestId: string) {
  try {
    const supabase = await createClient();
    const { user } = await getUserAndRole(supabase);
    await requireRole(supabase, ["admin", "super_admin", "backoffice", "marketing", "execution_head"]);

    const adminClient = getAdminSupabase();

    const { data: request, error: fetchErr } = await adminClient
      .from("admin_requests")
      .select("*")
      .eq("id", bookingRequestId)
      .single();

    if (fetchErr || !request) {
      return { error: "Booking record not found." };
    }

    const payload = request.payload || {};
    const updatedPayload = {
      ...payload,
      status: "RELEASED",
      released_at: new Date().toISOString(),
      released_by: user.id,
    };

    const { error: updateErr } = await adminClient
      .from("admin_requests")
      .update({ payload: updatedPayload })
      .eq("id", bookingRequestId);

    if (updateErr) {
      return { error: updateErr.message };
    }

    // Re-check site active bookings count to restore status to Available if it was marked Booked
    const siteId = payload.site_id || request.entity_id;
    if (siteId) {
      const { data: allReqs } = await adminClient
        .from("admin_requests")
        .select("*")
        .eq("action_type", "SITE_BOOKING");

      const now = new Date();
      const activeForSite = (allReqs || []).filter((r: any) => {
        if (r.id === bookingRequestId) return false;
        const p = r.payload || {};
        const match = String(p.site_id || r.entity_id) === String(siteId);
        const notExp = new Date(p.expires_at || r.created_at) > now;
        return match && (p.status === "ACTIVE" || p.status === "CONFIRMED") && notExp;
      });

      if (activeForSite.length < 3) {
        // If site was marked as 'Booked', restore to 'Available'
        await adminClient
          .from("sites")
          .update({ status: "Available" })
          .eq(siteId.includes("-") ? "site_id" : "id", siteId.includes("-") ? siteId : parseInt(siteId, 10));
      }
    }

    revalidatePath("/status");
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (err: any) {
    console.error("releaseSiteBooking exception:", err);
    return { error: err?.message || "Failed to release booking." };
  }
}

/**
 * Client Public Confirmation of their booking reservation
 */
export async function confirmBookingByClient(token: string) {
  try {
    if (!token) return { error: "Invalid confirmation token." };

    const adminClient = getAdminSupabase();
    const { data: allReqs, error } = await adminClient
      .from("admin_requests")
      .select("*")
      .eq("action_type", "SITE_BOOKING");

    if (error || !allReqs) {
      return { error: "Unable to find reservation." };
    }

    const found = allReqs.find((r: any) => r.payload?.confirmation_token === token);
    if (!found) {
      return { error: "Reservation not found or token has expired." };
    }

    const payload = found.payload || {};
    const now = new Date();
    const isPastExpiry = new Date(payload.expires_at) < now;

    if (payload.status === "RELEASED") {
      return { error: "This booking hold has already been released." };
    }

    if (isPastExpiry && payload.status !== "CONFIRMED") {
      return { error: "This 5-day booking hold has expired. Please contact our team to reactivate your reservation." };
    }

    const updatedPayload = {
      ...payload,
      status: "CONFIRMED",
      confirmed_at: new Date().toISOString(),
    };

    await adminClient
      .from("admin_requests")
      .update({ payload: updatedPayload })
      .eq("id", found.id);

    return {
      success: true,
      booking: {
        siteName: payload.site_name,
        clientName: payload.client_name,
        bookingPeriod: payload.booking_period,
        staffName: payload.booked_by_staff_name,
        expiresAt: payload.expires_at,
        confirmedAt: updatedPayload.confirmed_at,
      },
    };
  } catch (err: any) {
    console.error("confirmBookingByClient error:", err);
    return { error: err?.message || "Confirmation failed." };
  }
}

/**
 * Fetch booking details for the client confirmation page
 */
export async function getBookingByConfirmationToken(token: string) {
  try {
    if (!token) return null;
    const adminClient = getAdminSupabase();
    const { data: allReqs } = await adminClient
      .from("admin_requests")
      .select("*")
      .eq("action_type", "SITE_BOOKING");

    const found = (allReqs || []).find((r: any) => r.payload?.confirmation_token === token);
    if (!found) return null;

    const p = found.payload || {};
    const isExpired = new Date(p.expires_at) < new Date();

    return {
      id: found.id,
      siteName: p.site_name || "Hoarding Site",
      siteId: p.site_id,
      clientName: p.client_name,
      clientEmail: p.client_email,
      bookingPeriod: p.booking_period,
      staffName: p.booked_by_staff_name,
      expiresAt: p.expires_at,
      status: p.status,
      isExpired,
      confirmedAt: p.confirmed_at,
    };
  } catch (err) {
    console.error("getBookingByConfirmationToken error:", err);
    return null;
  }
}
