"use server";

import { createClient } from "@/backend/db/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export async function signupUser(formData: FormData) {
  // Public customer self-registration is disabled.
  return { 
    error: "Customer self-registration is disabled. Staff accounts must be created by the Super Administrator." 
  };
}

export async function loginUser(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const loginType = (formData.get("loginType") as string) || "admin";
  let redirectPath: string | null = null;

  try {
    const supabase = await createClient();

    let authDataResult = null;
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Auto-heal "Email not confirmed" error using service role key
      if (error.message.toLowerCase().includes("email not confirmed") && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const adminSupabase = createAdminClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          { auth: { autoRefreshToken: false, persistSession: false } }
        );
        const { data: usersData } = await adminSupabase.auth.admin.listUsers();
        const foundUser = usersData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (foundUser) {
          await adminSupabase.auth.admin.updateUserById(foundUser.id, { email_confirm: true });
          // Retry sign-in now that email is confirmed
          const retry = await supabase.auth.signInWithPassword({ email, password });
          if (retry.error) {
            return { error: retry.error.message };
          }
          authDataResult = retry.data;
        } else {
          return { error: error.message };
        }
      } else {
        return { error: error.message };
      }
    } else {
      authDataResult = authData;
    }

    if (!authDataResult?.user) {
      return { error: "Authentication failed. Please check your credentials." };
    }

    // Check user role from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authDataResult.user.id)
      .single();

    const userRole = profile?.role || 'public';
    const adminRoles = ['admin', 'super_admin', 'backoffice', 'marketing', 'execution_head'];

    // Enforce Admin and Super Admin authentication only — reject public customer logins
    if (userRole === 'public' || !adminRoles.includes(userRole)) {
      await supabase.auth.signOut({ scope: 'local' });
      return {
        error: "Access Denied: Only authorized Admin and Super Administrator accounts can log in."
      };
    }

    // Role-specific login portal constraints
    if (loginType === 'super_admin') {
      if (userRole !== 'super_admin') {
        await supabase.auth.signOut({ scope: 'local' });
        return {
          error: "Access Denied: This account is not authorized as a Super Administrator. Only the primary Super Admin can access this portal."
        };
      }
      redirectPath = "/dashboard";
    } else {
      // Standard Admin / Staff portal
      if (!adminRoles.includes(userRole)) {
        await supabase.auth.signOut({ scope: 'local' });
        return {
          error: "Access Denied: Authorized Admin or Staff credentials required."
        };
      }
      redirectPath = "/dashboard";
    }
  } catch (err: any) {
    if (err?.message?.includes("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("Login Exception:", err);
    return { error: "Authentication service is unreachable. Please check your connection or contact support." };
  }

  if (redirectPath) {
    redirect(redirectPath);
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: 'local' });
  redirect("/");
}

export async function updateProfile(name: string, avatarBase64?: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  // Update profile in database (name only for profiles table)
  const { error } = await supabase
    .from('profiles')
    .update({ name })
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  // Update auth metadata (name and avatar)
  const metadataUpdate: any = { full_name: name };
  if (avatarBase64) {
    metadataUpdate.avatar_base64 = avatarBase64;
  }

  await supabase.auth.updateUser({
    data: metadataUpdate
  });

  return { success: true };
}
