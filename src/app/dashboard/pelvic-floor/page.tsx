import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/(auth)/actions";
import PelvicFloorView from "./_components/pelvic-floor-view";

export default async function PelvicFloorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-lg font-bold text-yellow-600 transition hover:text-yellow-500">PerfectStack</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">{user.email}</span>
            <form action={signout}><button type="submit" className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-yellow-600 hover:text-white">Sign Out</button></form>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-zinc-300">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white">Pelvic Floor & Kegels</h1>
        <p className="mt-1 text-zinc-400">Progressive 8-week pelvic floor training for erection quality, control, and urinary health.</p>
        <div className="mt-6"><PelvicFloorView /></div>
      </main>
    </div>
  );
}
