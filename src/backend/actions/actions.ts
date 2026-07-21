"use server";

import { createClient } from "@/backend/db/server";
import { revalidatePath } from "next/cache";

// ==========================================
// RBAC HELPER
// ==========================================

async function getUserAndRole(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: profile } = await supabase.from('profiles').select('role, permissions').eq('id', user.id).single();
  const role = profile?.role || 'public';
  const permissions = profile?.permissions || [];
  return { user, role, permissions };
}

async function requireRole(supabase: any, allowedRoles: string[]) {
  const { role } = await getUserAndRole(supabase);
  
  if (!allowedRoles.includes(role)) {
    throw new Error("Insufficient permissions");
  }
}

export async function requirePermission(supabase: any, permission: string) {
  const { role, permissions } = await getUserAndRole(supabase);
  if (role === 'super_admin') return true;
  
  if (!permissions.includes(permission)) {
    throw new Error(`Insufficient permissions: requires ${permission}`);
  }
  return true;
}

// ==========================================
// PUBLIC ENQUIRIES ACTIONS
// ==========================================

export async function addEnquiry(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;
  const phone = formData.get("phone") as string;
  let message = formData.get("message") as string;
  const preferredSite = formData.get("preferredSite") as string;

  if (preferredSite) {
    message = `[Preferred Site: ${preferredSite}]\n\n${message}`;
  }

  const supabase = await createClient();

  const { error } = await supabase.from("enquiries").insert([
    {
      name: `${firstName} ${lastName}`.trim(),
      email,
      company,
      phone,
      message,
      status: "New"
    }
  ]);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function addApplication(formData: FormData) {
  const name = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const experience = formData.get("experience") as string;
  const portfolio = formData.get("portfolio") as string;
  const whyJoin = formData.get("whyJoin") as string;

  const message = `[CAREER APPLICATION: ${role}]\nExperience: ${experience}\nPortfolio: ${portfolio}\n\nWhy they want to join:\n${whyJoin}`;

  const supabase = await createClient();

  const { error } = await supabase.from("enquiries").insert([
    {
      name,
      email,
      company: "Career Application",
      phone,
      message,
      status: "New"
    }
  ]);

  if (error) return { error: error.message };
  return { success: true };
}

// ==========================================
// ADMIN ENQUIRIES ACTIONS
// ==========================================

export async function updateEnquiryStatus(id: number, status: string) {
  const supabase = await createClient();
  await requireRole(supabase, ['admin', 'super_admin']);

  const { error } = await supabase
    .from("enquiries")
    .update({ status })
    .eq("id", id);
    
  if (error) return { error: error.message };
  revalidatePath("/admin/enquiries");
  return { success: true };
}

export async function addEnquiryNote(id: number, currentMessage: string, noteText: string, isReply: boolean = false) {
  const supabase = await createClient();
  await requireRole(supabase, ['admin', 'super_admin']);

  const timestamp = new Date().toLocaleString('en-IN');
  const prefix = isReply ? "SENT REPLY" : "INTERNAL NOTE";
  const updatedMessage = `${currentMessage}\n\n[${prefix} - ${timestamp}]\n${noteText}`;

  const { error } = await supabase
    .from("enquiries")
    .update({ message: updatedMessage })
    .eq("id", id);
    
  if (error) return { error: error.message };
  revalidatePath("/admin/enquiries");
  return { success: true };
}

// ==========================================
// ADMIN INVENTORY ACTIONS
// ==========================================

export async function addSite(formData: FormData) {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const size = formData.get("size") as string;
  const city = formData.get("city") as string;
  const status = formData.get("status") as string;
  const price = formData.get("price") as string;

  const supabase = await createClient();
  const { user, role, permissions } = await getUserAndRole(supabase);
  
  const hasEditPermission = role === 'super_admin' || permissions.includes('edit_site_details');
  if (!hasEditPermission && role !== 'admin') {
    return { error: "Insufficient permissions: requires edit_site_details" };
  }

  const payload = {
    name,
    type,
    size,
    city,
    status,
    price: parseInt(price) || 0,
    image_url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",
    lat: 21.1458,
    lng: 79.0882
  };

  // Log the action for history
  await supabase.from("admin_requests").insert([
    {
      action_type: 'ADD_SITE',
      payload,
      requested_by: user.id,
      status: 'APPROVED',
      resolved_at: new Date().toISOString(),
      resolved_by: user.id
    }
  ]);

  const { error } = await supabase.from("sites").insert([payload]);

  if (error) return { error: error.message };
  revalidatePath("/inventory");
  return { success: true };
}

export async function updateSiteStatus(id: string, status: string) {
  const supabase = await createClient();
  const { user, role, permissions } = await getUserAndRole(supabase);
  
  const hasEditPermission = role === 'super_admin' || permissions.includes('edit_site_details');
  if (!hasEditPermission && role !== 'admin') {
    return { error: "Insufficient permissions: requires edit_site_details" };
  }

  // Log the action for history
  await supabase.from("admin_requests").insert([
    {
      action_type: 'UPDATE_STATUS',
      entity_id: id,
      payload: { site_id: id, status },
      requested_by: user.id,
      status: 'APPROVED',
      resolved_at: new Date().toISOString(),
      resolved_by: user.id
    }
  ]);

  const { error } = await supabase
    .from("sites")
    .update({ status })
    .eq("site_id", id);

  // Fallback: try matching by numeric id if site_id match affected 0 rows
  if (error) {
    const { error: error2 } = await supabase
      .from("sites")
      .update({ status })
      .eq("id", id);
    if (error2) return { error: error2.message };
  }
  revalidatePath("/inventory");
  revalidatePath("/status");
  return { success: true };
}

export async function deleteSite(id: string) {
  const supabase = await createClient();
  const { user, role, permissions } = await getUserAndRole(supabase);
  
  const hasEditPermission = role === 'super_admin' || permissions.includes('edit_site_details');
  if (!hasEditPermission && role !== 'admin') {
    return { error: "Insufficient permissions: requires edit_site_details" };
  }

  // Log the action for history
  await supabase.from("admin_requests").insert([
    {
      action_type: 'DELETE_SITE',
      entity_id: id,
      payload: { site_id: id },
      requested_by: user.id,
      status: 'APPROVED',
      resolved_at: new Date().toISOString(),
      resolved_by: user.id
    }
  ]);

  const { error } = await supabase
    .from("sites")
    .delete()
    .eq("site_id", id);
    
  if (error) return { error: error.message };
  revalidatePath("/inventory");
  return { success: true };
}

// ==========================================
// ADMIN STAFF ACTIONS
// ==========================================

export async function addStaff(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const department = formData.get("department") as string;
  const payType = formData.get("payType") as string;
  const salary = formData.get("salary") as string;

  const supabase = await createClient();
  await requireRole(supabase, ['super_admin']);

  const { error } = await supabase.from("staff").insert([
    {
      name,
      role,
      department,
      pay_type: payType,
      salary: parseInt(salary) || 0,
      status: "Active"
    }
  ]);

  if (error) return { error: error.message };
  revalidatePath("/admin/staff");
  return { success: true };
}

export async function deleteStaff(id: number) {
  const supabase = await createClient();
  await requireRole(supabase, ['super_admin']);

  const { error } = await supabase
    .from("staff")
    .delete()
    .eq("id", id);
    
  if (error) return { error: error.message };
  revalidatePath("/admin/staff");
  return { success: true };
}

// ==========================================
// ADVANCED INVENTORY ACTIONS
// ==========================================

export async function saveSiteDetails(siteId: string | null, formData: FormData) {
  try {
    const supabase = await createClient();
    const { user, role, permissions } = await getUserAndRole(supabase);
    
    const hasEditPermission = role === 'super_admin' || permissions.includes('edit_site_details');
    if (!hasEditPermission && role !== 'admin') {
      return { error: "Insufficient permissions: requires edit_site_details" };
    }

    // ---- Handle image uploads ----
    const existingImagesRaw = formData.get("existing_images") as string;
    let existingImages: string[] = [];
    try {
      existingImages = existingImagesRaw ? JSON.parse(existingImagesRaw) : [];
    } catch { existingImages = []; }

    const newImageFiles = formData.getAll("images") as File[];
    const uploadedUrls: string[] = [];

    for (const file of newImageFiles) {
      if (!file || file.size === 0) continue;
      // Enforce 2MB limit server-side too
      if (file.size > 2 * 1024 * 1024) {
        return { error: `Image ${file.name} exceeds the 2MB size limit.` };
      }
      const ext = file.name.split('.').pop() || 'jpg';
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `sites/${uniqueName}`;

      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        return { error: `Failed to upload image: ${uploadError.message}` };
      }

      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }

    // Merge existing + new, cap at 5
    const finalImages = [...existingImages, ...uploadedUrls].slice(0, 5);

    // If updating, delete removed images from storage
    if (siteId) {
      const { data: oldSite } = await supabase.from('sites').select('images').eq('site_id', siteId).single();
      if (oldSite && oldSite.images) {
        const oldImages: string[] = oldSite.images;
        const removedUrls = oldImages.filter(url => !finalImages.includes(url));
        if (removedUrls.length > 0) {
          const pathsToRemove = removedUrls.map(url => {
            // Extract the relative path after the bucket name
            const parts = url.split('/site-images/');
            return parts.length > 1 ? parts[1] : null;
          }).filter(Boolean) as string[];
          
          if (pathsToRemove.length > 0) {
            await supabase.storage.from('site-images').remove(pathsToRemove);
          }
        }
      }
    }
    // ---- End image uploads ----

    const payload = {
      name: formData.get("name") as string,
      city: formData.get("city") as string,
      area: formData.get("area") as string || '',
      address: formData.get("address") as string || null,
      maps_link: formData.get("maps_link") as string || null,
      lat: parseFloat(formData.get("lat") as string) || null,
      lng: parseFloat(formData.get("lng") as string) || null,
      size: formData.get("size") as string,
      type: formData.get("type") as string,
      lit_type: formData.get("lit_type") as string,
      status: (formData.get("status") as string) || 'Available',
      
      // Additional metrics
      is_metro: formData.get("is_metro") === "true",
      qty: parseInt(formData.get("qty") as string) || 1,
      total_sq_ft: parseFloat(formData.get("total_sq_ft") as string) || 0,
      printable_size: formData.get("printable_size") as string || null,
      
      // Metro specific
      metro_line: formData.get("metro_line") as string || null,
      metro_pillars: formData.get("metro_pillars") as string || null,
      no_of_pillars: parseInt(formData.get("no_of_pillars") as string) || null,
      no_of_displays: parseInt(formData.get("no_of_displays") as string) || null,
      
      // Electricity
      electricity_consumer_no: formData.get("electricity_consumer_no") as string || null,
      electricity_consumer_name: formData.get("electricity_consumer_name") as string || null,
      electricity_bill_date: formData.get("electricity_bill_date") as string || null,
      electricity_due_date: formData.get("electricity_due_date") as string || null,
      
      // Landlord
      landlord: formData.get("landlord") as string || null,
      landlord_contact: formData.get("landlord_contact") as string || null,
      rent: parseFloat(formData.get("rent") as string) || 0,
      
      // Rationale
      rationale: formData.get("rationale") as string || null,
      
      // Rates
      net_rate: parseFloat(formData.get("net_rate") as string) || 0,
      dcpm_rate: parseFloat(formData.get("dcpm_rate") as string) || 0,
      agency_rate: parseFloat(formData.get("agency_rate") as string) || 0,
      
      // Images array
      images: finalImages,
    };

    // Log the action for history
    await supabase.from("admin_requests").insert([
      {
        action_type: siteId ? 'UPDATE_SITE' : 'ADD_SITE',
        entity_id: siteId,
        payload: { ...payload, site_id: siteId },
        requested_by: user.id,
        status: 'APPROVED',
        resolved_at: new Date().toISOString(),
        resolved_by: user.id
      }
    ]);

    // Direct save
    if (siteId) {
      const { error } = await supabase.from("sites").update(payload).eq("site_id", siteId);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase.from("sites").insert([payload]);
      if (error) return { error: error.message };
    }

    revalidatePath("/inventory");
    return { success: true };
  } catch (err: any) {
    console.error("saveSiteDetails Error:", err);
    return { error: err.message || "An unexpected error occurred" };
  }
}

// ==========================================
// FLEX INVENTORY ACTIONS
// ==========================================

export async function addFlexTransaction(formData: FormData) {
  const type = formData.get("type") as string;
  const size = formData.get("size") as string;
  const quantity = parseInt(formData.get("quantity") as string, 10);
  const notes = formData.get("notes") as string;

  const supabase = await createClient();
  const { role } = await getUserAndRole(supabase);
  if (role === 'public') {
    return { error: "Insufficient permissions" };
  }

  const { error } = await supabase.from("flex_transactions").insert([
    {
      type,
      size,
      quantity,
      notes
    }
  ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/flex-inventory");
  return { success: true };
}
