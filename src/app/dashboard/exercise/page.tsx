import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/(auth)/actions";
import ExerciseView from "./_components/exercise-view";
import { isFree } from "@/lib/subscription";
import LockedFeature from "@/components/locked-feature";

export default async function ExercisePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: subData } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();
  const subscriptionStatus = subData?.subscription_status ?? null;

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-yellow-600 no-underline hover:no-underline transition-all duration-200 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgba(234,179,8,0.5)]">Perfect Stack</Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-zinc-400 sm:inline">{user.email}</span>
            <form action={signout}><button type="submit" className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-yellow-600 hover:text-white">Sign Out</button></form>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Link href="/dashboard" className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-zinc-300">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white">Exercise & Training</h1>
        <p className="mt-1 text-zinc-400">The 3-day resistance protocol, daily mobility, and home gym setup.</p>
        {isFree(subscriptionStatus) ? (
          <LockedFeature
            featureName="Exercise & Training"
            description="Access the 3-day resistance protocol, daily mobility work, and home gym setup."
            requiredPlan="foundation"
          />
        ) : (
          <div className="mt-6"><ExerciseView /></div>
        )}
      </main>
    </div>
  );
}
