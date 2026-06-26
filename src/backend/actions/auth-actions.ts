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
  
  const supabase = await createClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return { error: error.message };
  }
  
  const loginMode = formData.get("loginMode") as string;
  
  // Check user role from profiles to determine redirect
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();
    
  if (loginMode === 'admin') {
    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
      redirect("/dashboard");
    } else {
      await supabase.auth.signOut();
      return { error: "Unauthorized: You do not have admin permissions. Please use the Client login tab." };
    }
  } else {
    // Client login mode
    if (profile?.role === 'admin' || profile?.role === 'super_admin') {
      redirect("/dashboard");
    } else {
      redirect("/catalog");
    }
  }
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
