"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAsAdmin() {
  const cookieStore = await cookies();
  cookieStore.set("auth_role", "admin", { secure: true, httpOnly: true, path: "/" });
  redirect("/dashboard");
}

export async function loginAsClient() {
  const cookieStore = await cookies();
  cookieStore.set("auth_role", "client", { secure: true, httpOnly: true, path: "/" });
  redirect("/catalog"); // Clients get redirected to catalog or a specific client portal
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_role");
  redirect("/");
}
