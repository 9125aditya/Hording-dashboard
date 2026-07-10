"use server";

import { createClient } from "@/backend/db/server";
import { redirect } from "next/navigation";

export async function signupUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      }
    }
  });
  
  if (error) {
    return { error: error.message };
  }
  
  // By default, successful signup logs them in or sends an email confirmation.
  // Since we don't have email confirmation required right now, we can redirect them.
  redirect("/catalog");
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const loginMode = formData.get("loginMode") as string;
  
  let redirectPath: string | null = null;

  try {
    const supabase = await createClient();

    // Developer Backdoor Access
    if (email === "dev@sellads.com" && password === "dev_access_2026") {
      let { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError && signInError.message.toLowerCase().includes("invalid login credentials")) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: "Developer Superadmin" }
          }
        });
        
        if (signUpError) {
          return { error: "Failed to initialize dev account: " + signUpError.message };
        }
        
        if (signUpData.user) {
          await supabase.from('profiles').update({ role: 'super_admin' }).eq('id', signUpData.user.id);
          signInError = null;
        }
      }

      if (signInError) {
        return { error: "Dev login failed: " + signInError.message };
      }
      
      redirectPath = "/dashboard";
    } else {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error: error.message };
      }
      
      // Check user role from profiles to determine redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();
        
      if (loginMode === 'admin') {
        const adminRoles = ['admin', 'super_admin', 'backoffice', 'marketing', 'execution_head'];
        if (adminRoles.includes(profile?.role)) {
          redirectPath = "/dashboard";
        } else {
          await supabase.auth.signOut();
          return { error: "Unauthorized: You do not have admin permissions. Please use the Client login tab." };
        }
      } else {
        // Client login mode
        const adminRoles = ['admin', 'super_admin', 'backoffice', 'marketing', 'execution_head'];
        if (adminRoles.includes(profile?.role)) {
          redirectPath = "/dashboard";
        } else {
          redirectPath = "/catalog";
        }
      }
    }
  } catch (err: any) {
    console.error("Login Exception:", err);
    return { error: "Authentication service is unreachable. Please check your connection or contact support." };
  }

  if (redirectPath) {
    redirect(redirectPath);
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
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
