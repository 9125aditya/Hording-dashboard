"use server";

import { createClient } from "@/backend/db/server";
import { revalidatePath } from "next/cache";

async function getUserAndRole(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const role = profile?.role || 'public';
  return { user, role };
}

// ==========================================
// SUPER ADMIN APPROVAL ACTIONS
// ==========================================

export async function approveRequest(requestId: string) {
  const supabase = await createClient();
  const { user, role } = await getUserAndRole(supabase);
  
  if (role !== 'super_admin') {
    throw new Error("Only Super Admins can approve requests");
  }

  // 1. Fetch the request
  const { data: request, error: fetchError } = await supabase
    .from("admin_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (fetchError || !request) return { error: "Request not found" };
  if (request.status !== 'PENDING') return { error: "Request already resolved" };

  // 2. Apply the requested action
  if (request.action_type === 'ADD_SITE') {
    const { site_id, ...insertPayload } = request.payload;
    const { error } = await supabase.from("sites").insert([insertPayload]);
    if (error) return { error: error.message };
  } else if (request.action_type === 'UPDATE_STATUS') {
    const { error } = await supabase
      .from("sites")
      .update({ status: request.payload.status })
      .eq("site_id", request.payload.site_id);
    if (error) return { error: error.message };
  } else if (request.action_type === 'DELETE_SITE') {
    const { error } = await supabase
      .from("sites")
      .delete()
      .eq("site_id", request.payload.site_id);
    if (error) return { error: error.message };
  } else if (request.action_type === 'UPDATE_SITE') {
    const { site_id, ...updatePayload } = request.payload;
    const { error } = await supabase
      .from("sites")
      .update(updatePayload)
      .eq("site_id", site_id);
    if (error) return { error: error.message };
  }

  // 3. Mark request as APPROVED
  const { error: updateError } = await supabase
    .from("admin_requests")
    .update({ 
      status: 'APPROVED', 
      resolved_at: new Date().toISOString(),
      resolved_by: user.id
    })
    .eq("id", requestId);
    
  if (updateError) return { error: updateError.message };
  
  revalidatePath("/admin/approvals");
  revalidatePath("/admin/inventory");
  return { success: true };
}

export async function rejectRequest(requestId: string) {
  const supabase = await createClient();
  const { user, role } = await getUserAndRole(supabase);
  
  if (role !== 'super_admin') {
    throw new Error("Only Super Admins can reject requests");
  }

  const { error } = await supabase
    .from("admin_requests")
    .update({ 
      status: 'REJECTED', 
      resolved_at: new Date().toISOString(),
      resolved_by: user.id
    })
    .eq("id", requestId);
    
  if (error) return { error: error.message };
  
  revalidatePath("/admin/approvals");
  return { success: true };
}
