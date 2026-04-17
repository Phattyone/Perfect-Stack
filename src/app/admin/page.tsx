/**
 * Perfect Stack — Admin Panel
 *
 * ─── MIGRATION (run once in Supabase SQL editor) ──────────────────────────
 *
 *   ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
 *
 * ─── PROMOTE A USER TO ADMIN ─────────────────────────────────────────────
 *
 *   -- To set yourself as admin, run this in Supabase SQL editor:
 *   -- UPDATE public.profiles SET is_admin = true WHERE id = 'YOUR_USER_UUID_HERE';
 *
 * ─── ENV VAR REQUIRED ─────────────────────────────────────────────────────
 *
 *   Add to .env.local (and Vercel environment variables):
 *     SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
 *   (Supabase Dashboard → Project Settings → API → service_role secret)
 *
 * ──────────────────────────────────────────────────────────────────────────
 *
 * All data fetching is server-side only. The service role key is never sent
 * to the browser. The layout already verified is_admin = true before render.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import AdminTable, { type AdminUserRow } from "./_components/admin-table";

// Average the 6 weekly score fields (1–10 scale). Returns null if all missing.
function avgScores(entry: Record<string, number | null>): number | null {
  const fields = [
    "energy_score",
    "libido_score",
    "erection_quality_score",
    "sleep_quality_score",
    "mood_score",
    "strength_recovery_score",
  ];
  const vals = fields
    .map((f) => entry[f])
    .filter((v): v is number => v !== null && v !== undefined);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export default async function AdminPage() {
  const warnings: string[] = [];

  // ── Top-level error boundary ──────────────────────────────────────────────
  try {
    const admin = createAdminClient();

    // ── 1. Profiles table (primary data source) ───────────────────────────
    const { data: profiles, error: profilesErr } = await admin
      .from("profiles")
      .select(
        "id, full_name, subscription_status, health_status, age_group, stack_selection, created_at, updated_at"
      );

    if (profilesErr) {
      console.error("[admin] profiles query error:", profilesErr);
      warnings.push(`Profiles query failed: ${profilesErr.message}`);
    }

    // ── 2. Auth users (optional — email lookup) ───────────────────────────
    // Wrapped in try/catch: if the auth admin API is unavailable on this
    // runtime, we fall back to showing "N/A" for email rather than crashing.
    const emailMap = new Map<string, string>();
    try {
      const { data: authData, error: authErr } =
        await admin.auth.admin.listUsers({ perPage: 1000 });

      if (authErr) {
        console.error("[admin] listUsers error:", authErr);
        warnings.push(`Auth users unavailable: ${authErr.message}`);
      } else {
        for (const u of authData.users) {
          if (u.email) emailMap.set(u.id, u.email);
        }
      }
    } catch (authEx) {
      const msg = authEx instanceof Error ? authEx.message : String(authEx);
      console.error("[admin] listUsers threw:", msg);
      warnings.push(`Auth admin API unavailable: ${msg}`);
    }

    // ── 3. Latest weekly check-in per user ───────────────────────────────
    const { data: weeklyEntries, error: weeklyErr } = await admin
      .from("weekly_entries")
      .select(
        "user_id, week_number, energy_score, libido_score, erection_quality_score, sleep_quality_score, mood_score, strength_recovery_score"
      );

    if (weeklyErr) {
      console.error("[admin] weekly_entries error:", weeklyErr);
      warnings.push(`Weekly entries unavailable: ${weeklyErr.message}`);
    }

    const latestWeekly = new Map<string, Record<string, number | null>>();
    for (const entry of weeklyEntries ?? []) {
      const existing = latestWeekly.get(entry.user_id);
      if (!existing || entry.week_number > (existing.week_number as number)) {
        latestWeekly.set(entry.user_id, entry);
      }
    }

    // ── 4. Journal entry counts per user ─────────────────────────────────
    const { data: journalRows, error: journalErr } = await admin
      .from("journal_entries")
      .select("user_id");

    if (journalErr) {
      console.error("[admin] journal_entries error:", journalErr);
      warnings.push(`Journal entries unavailable: ${journalErr.message}`);
    }

    const journalCounts = new Map<string, number>();
    for (const row of journalRows ?? []) {
      journalCounts.set(row.user_id, (journalCounts.get(row.user_id) ?? 0) + 1);
    }

    // ── 5. Merge ──────────────────────────────────────────────────────────
    const rows: AdminUserRow[] = (profiles ?? []).map((p: {
      id: string;
      full_name: string | null;
      subscription_status: string | null;
      health_status: string[] | null;
      age_group: string | null;
      stack_selection: string[] | null;
      created_at: string | null;
      updated_at: string | null;
    }) => {
      const weeklyEntry = latestWeekly.get(p.id);
      const checkinScore = weeklyEntry ? avgScores(weeklyEntry) : null;

      return {
        id: p.id,
        email: emailMap.get(p.id) ?? "N/A",
        full_name: p.full_name ?? null,
        subscription_status: p.subscription_status ?? "free",
        age_group: p.age_group ?? null,
        stack_selection: p.stack_selection ?? null,
        health_status: p.health_status ?? null,
        latest_checkin_score:
          checkinScore !== null ? Math.round(checkinScore * 10) / 10 : null,
        journal_count: journalCounts.get(p.id) ?? 0,
        created_at: p.created_at ?? "",
        updated_at: p.updated_at ?? null,
      };
    });

    // Sort newest first
    rows.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return (
      <div className="mx-auto max-w-screen-2xl px-6 py-10">
        {/* Header */}
        <div className="mb-6 border-b border-zinc-800 pb-6">
          <h1 className="text-2xl font-bold text-white">
            Perfect Stack <span className="text-yellow-500">Admin</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Internal user overview — server-rendered, service role only.
          </p>
        </div>

        {/* Partial-failure warnings */}
        {warnings.length > 0 && (
          <div className="mb-6 rounded-lg border border-yellow-700/50 bg-yellow-900/20 p-4">
            <p className="mb-1 text-sm font-semibold text-yellow-400">
              ⚠ Some data sources returned errors — table shows partial data:
            </p>
            <ul className="list-inside list-disc space-y-0.5">
              {warnings.map((w, i) => (
                <li key={i} className="text-xs text-yellow-300/80">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Table */}
        <AdminTable rows={rows} />
      </div>
    );
  } catch (error) {
    // Top-level catch — something fundamental failed (e.g. missing env vars)
    const message = error instanceof Error ? error.message : String(error);
    console.error("[admin] top-level error:", error);
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-lg border border-red-700/50 bg-red-900/20 p-6">
          <h2 className="mb-2 text-lg font-semibold text-red-400">
            Admin Panel Error
          </h2>
          <p className="font-mono text-sm text-red-300">{message}</p>
          <p className="mt-3 text-xs text-zinc-500">
            Check that <code className="text-zinc-300">SUPABASE_SERVICE_ROLE_KEY</code> is
            set in your environment variables and that the{" "}
            <code className="text-zinc-300">is_admin</code> migration has been run.
          </p>
        </div>
      </div>
    );
  }
}
