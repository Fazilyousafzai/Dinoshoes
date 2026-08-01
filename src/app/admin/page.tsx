import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin panel", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase.auth.getClaims();
    const userId = data?.claims?.sub;
    if (!userId) redirect("/admin/login");
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
    if (profile?.role !== "admin") redirect("/admin/forbidden");
  }
  return <AdminDashboard />;
}
