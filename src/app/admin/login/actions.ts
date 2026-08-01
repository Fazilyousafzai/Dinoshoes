"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error: string | null };

export async function login(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const requested = String(formData.get("next") ?? "/admin");
  const next = requested.startsWith("/admin") && !requested.startsWith("//") ? requested : "/admin";

  if (!email || !email.includes("@") || password.length < 8) {
    return { error: "Enter a valid email and a password of at least 8 characters." };
  }

  const supabase = await createClient();
  if (!supabase) return { error: "Supabase is not configured. Open the demo admin panel instead." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "The email or password is incorrect." };

  redirect(next);
}
