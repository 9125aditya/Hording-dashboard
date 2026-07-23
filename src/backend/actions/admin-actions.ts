"use server";

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// This client uses the Service Role Key to bypass RLS and Auth restrictions.
// IT MUST ONLY BE USED ON THE SERVER.
const getAdminSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

export async function addStaffMemberWithAuth(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const department = formData.get("department") as string;
  const payType = formData.get("payType") as string;
  const salary = formData.get("salary") as string;
  const email = formData.get("email") as string; // We need an email for login
  const password = formData.get("password") as string; // We need a temp password

  if (!email || !password) {
    return { error: "Email and password are required to create a staff account." };
  }

  const supabase = getAdminSupabase();

  // 1. Create Auth User
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, role: 'admin' }
  });

  if (authError) {
    return { error: authError.message };
  }

  const userId = authData.user.id;

  // 2. Ensure Profile exists and is set to 'admin' 
  // (Supabase triggers might do this, but let's be explicit)
  await supabase.from('profiles').upsert({
    id: userId,
    email,
    name,
    role: 'admin'
  });

  // 3. Add to Staff Table
  const { error: dbError } = await supabase.from("staff").insert([
    {
      name,
      role,
      department,
      pay_type: payType,
      salary: parseInt(salary) || 0,
    }
  ]);

  if (dbError) {
    return { error: dbError.message };
  }

  revalidatePath("/admin/staff");
  return { success: true };
}

import { createClient as createServerClient } from "@/backend/db/server";

export async function updateUserDetails(targetUserId: string, name: string, role: string, permissions: string[]) {
  const normalClient = await createServerClient();
  const { data: { user } } = await normalClient.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  
  const { data: profile } = await normalClient.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin') {
    return { error: "Insufficient permissions" };
  }

  const adminClient = getAdminSupabase();
  const { error } = await adminClient
    .from('profiles')
    .update({ name, role, permissions })
    .eq('id', targetUserId);

  if (error) return { error: error.message };
  
  // Also try to update auth metadata for name if possible
  await adminClient.auth.admin.updateUserById(targetUserId, {
    user_metadata: { full_name: name }
  });

  revalidatePath('/admin/permissions');
  return { success: true };
}

export async function createAdminUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!email || !password || !name) {
    return { error: "Name, email, and password are required." };
  }

  const normalClient = await createServerClient();
  const { data: { user } } = await normalClient.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  
  const { data: profile } = await normalClient.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin') {
    return { error: "Insufficient permissions to create users." };
  }

  const supabase = getAdminSupabase();

  // 1. Create Auth User
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, role: role }
  });

  if (authError) {
    console.error("Create User Error:", authError);
    return { error: authError.message };
  }

  const userId = authData.user.id;

  // 2. Create Profile
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    email,
    name,
    role: role
  });

  if (profileError) {
    console.error("Profile Upsert Error:", profileError);
    // Continue anyway as the auth user was created
  }

  revalidatePath("/admin/permissions");
  return { success: true };
}

export async function deleteAdminUser(targetUserId: string) {
  const normalClient = await createServerClient();
  const { data: { user } } = await normalClient.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  
  const { data: profile } = await normalClient.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'super_admin') {
    return { error: "Insufficient permissions to delete users." };
  }
  
  if (user.id === targetUserId) {
    return { error: "You cannot delete your own account." };
  }

  const supabase = getAdminSupabase();

  // 1. Delete Auth User First (this often cascades to profiles)
  const { error: authError } = await supabase.auth.admin.deleteUser(targetUserId);
  if (authError) {
    console.error("Delete Auth User Error:", authError);
    return { error: authError.message };
  }

  // 2. Try to delete from profiles table just in case it didn't cascade
  const { error: dbError } = await supabase.from('profiles').delete().eq('id', targetUserId);
  if (dbError) {
    console.warn("Profile delete warning (may have cascaded already):", dbError.message);
  }

  revalidatePath("/admin/permissions");
  return { success: true };
}
