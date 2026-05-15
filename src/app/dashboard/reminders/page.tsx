/*
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPABASE MIGRATION
 * Run the following SQL in your Supabase SQL editor before using this page:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * CREATE TABLE IF NOT EXISTS public.reminder_settings (
 *   id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id    UUID        REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
 *   preferences JSONB      NOT NULL DEFAULT '{}',
 *   created_at TIMESTAMPTZ DEFAULT now(),
 *   updated_at TIMESTAMPTZ DEFAULT now()
 * );
 *
 * ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Users can manage their own reminder settings"
 * ON public.reminder_settings
 * FOR ALL
 * USING (auth.uid() = user_id)
 * WITH CHECK (auth.uid() = user_id);
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/(auth)/actions";
import RemindersView from "./_components/reminders-view";
import { isFree } from "@/lib/subscription";
import LockedFeature from "@/components/locked-feature";
import { getCyclingSettings } from "./cycling-actions";

export default async function RemindersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subData } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();
  const subscriptionStatus = subData?.subscription_status ?? null;

  // Fetch saved preferences — if the table doesn't exist yet or no row exists,
  // initialPrefs will be null and the client will fall back to defaults.
  let initialPrefs: Record<string, unknown> | null = null;
  try {
    const { data } = await supabase
      .from("reminder_settings")
      .select("preferences")
      .eq("user_id", user.id)
      .single();

    if (data?.preferences) {
      initialPrefs = data.preferences as Record<string, unknown>;
    }
  } catch {
    // Table may not exist yet — silently fall back to defaults
  }

  // Fetch cycling settings — silently null if table doesn't exist yet
  const initialCyclingSettings = await getCyclingSettings(user.id);

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold text-yellow-600 no-underline hover:no-underline transition-all duration-200 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgba(234,179,8,0.5)]"
          >
            Perfect Stack
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/account" className="text-zinc-400 hover:text-yellow-500 transition-colors" title="Account Settings">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
            <span className="hidden text-sm text-zinc-400 sm:inline">{user.email}</span>
            <form action={signout}>
              <button
                type="submit"
                className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-yellow-600 hover:text-white"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-zinc-300"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>

        <div className="flex items-center gap-3">
          <svg
            className="h-6 w-6 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <h1 className="text-2xl font-bold text-white">Reminders & Notifications</h1>
        </div>
        <p className="mt-1 text-zinc-400">
          Set daily reminders for your supplements, meals, drinks, and wellness habits.
        </p>

        {isFree(subscriptionStatus) ? (
          <LockedFeature
            featureName="Reminders & Notifications"
            description="Set daily reminders for your supplements, meals, performance drinks, and wellness habits."
            requiredPlan="foundation"
          />
        ) : (
          <div className="mt-6">
            <RemindersView
              userId={user.id}
              initialPrefs={initialPrefs}
              initialCyclingSettings={initialCyclingSettings}
              subscriptionStatus={subscriptionStatus ?? "free"}
            />
          </div>
        )}
      </main>
    </div>
  );
}
