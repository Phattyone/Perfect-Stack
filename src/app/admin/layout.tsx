/**
 * Admin layout — server-side auth guard.
 *
 * Prerequisites (run in Supabase SQL editor before accessing /admin):
 *
 *   ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
 *
 * To promote yourself to admin:
 *
 *   UPDATE public.profiles SET is_admin = true WHERE id = 'YOUR_USER_UUID_HERE';
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Verify the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/dashboard");
  }

  // 2. Verify is_admin = true on their profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (error || !profile?.is_admin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {children}
    </div>
  );
}
