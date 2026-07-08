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
  const message = formData.get("message") as string;

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
    throw new Error("Insufficient permissions: requires edit_site_details");
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

  if (!hasEditPermission && role === 'admin') {
    const { error } = await supabase.from("admin_requests").insert([
      {
        action_type: 'ADD_SITE',
        payload,
        requested_by: user.id
      }
    ]);
    if (error) return { error: error.message };
    return { success: true, isPending: true };
  }

  const { error } = await supabase.from("sites").insert([payload]);

  if (error) return { error: error.message };
  revalidatePath("/admin/inventory");
  return { success: true };
}

export async function updateSiteStatus(id: number, status: string) {
  const supabase = await createClient();
  const { user, role, permissions } = await getUserAndRole(supabase);
  
  const hasEditPermission = role === 'super_admin' || permissions.includes('edit_site_details');
  if (!hasEditPermission && role !== 'admin') {
    throw new Error("Insufficient permissions: requires edit_site_details");
  }

  if (!hasEditPermission && role === 'admin') {
    const { error } = await supabase.from("admin_requests").insert([
      {
        action_type: 'UPDATE_STATUS',
        entity_id: id,
        payload: { status },
        requested_by: user.id
      }
    ]);
    if (error) return { error: error.message };
    return { success: true, isPending: true };
  }

  const { error } = await supabase
    .from("sites")
    .update({ status })
    .eq("id", id);
    
  if (error) return { error: error.message };
  revalidatePath("/admin/inventory");
  return { success: true };
}

export async function deleteSite(id: number) {
  const supabase = await createClient();
  const { user, role, permissions } = await getUserAndRole(supabase);
  
  const hasEditPermission = role === 'super_admin' || permissions.includes('edit_site_details');
  if (!hasEditPermission && role !== 'admin') {
    throw new Error("Insufficient permissions: requires edit_site_details");
  }

  if (!hasEditPermission && role === 'admin') {
    const { error } = await supabase.from("admin_requests").insert([
      {
        action_type: 'DELETE_SITE',
        entity_id: id,
        requested_by: user.id
      }
    ]);
    if (error) return { error: error.message };
    return { success: true, isPending: true };
  }

  const { error } = await supabase
    .from("sites")
    .delete()
    .eq("id", id);
    
  if (error) return { error: error.message };
  revalidatePath("/admin/inventory");
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
