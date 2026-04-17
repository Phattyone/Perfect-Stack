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
 *   Add to .env.local:
 *     SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
 *   (Supabase Dashboard → Project Settings → API → service_role secret)
 *
 * ──────────────────────────────────────────────────────────────────────────
 *
 * All data fetching is server-side only. The service role key is never sent
 * to the browser. The layout already verified is_admin = true before this
 * page renders.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import AdminTable, { type AdminUserRow } from "./_components/admin-table";

// Safely compute the average of score fields from a weekly entry row.
// Scores are integers 1–10; returns null if all are null.
function avgScores(entry: Record<string, number | null>): number | null {
  const fields = [
    "energy_score",
    "libido_score",
    "erection_quality_score",
    "sleep_quality_score",
    "mood_score",
    "strength_recovery_score",
  ];
  const vals = fields.map((f) => entry[f]).filter((v): v is number => v !== null && v !== undefined);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export default async function AdminPage() {
  try {
    const admin = createAdminClient();

    // ── 1. All auth users (up to 1 000; paginate further if needed) ──────────
    const {
      data: { users: authUsers },
      error: authErr,
    } = await admin.auth.admin.listUsers({ perPage: 1000 });

    if (authErr) {
      console.error("[admin] listUsers error:", authErr);
      return (
        <div className="p-8 text-red-400">
          Failed to load users: {authErr.message}
        </div>
      );
    }

    // ── 2. All profiles ──────────────────────────────────────────────────────
    const { data: profiles, error: profilesErr } = await admin
      .from("profiles")
      .select(
        "id, subscription_status, age_group, stack_selection, health_status, updated_at"
      );

    if (profilesErr) {
      console.error("[admin] profiles query error:", profilesErr);
    }

    const profileMap = new Map(
      (profiles ?? []).map((p: {
        id: string;
        subscription_status: string | null;
        age_group: string | null;
        stack_selection: string[] | null;
        health_status: string[] | null;
        updated_at: string | null;
      }) => [p.id, p])
    );

    // ── 3. Latest weekly check-in per user ───────────────────────────────────
    const { data: weeklyEntries, error: weeklyErr } = await admin
      .from("weekly_entries")
      .select(
        "user_id, week_number, energy_score, libido_score, erection_quality_score, sleep_quality_score, mood_score, strength_recovery_score"
      );

    if (weeklyErr) {
      console.error("[admin] weekly_entries query error:", weeklyErr);
    }

    // Keep only the highest week_number entry per user
    const latestWeekly = new Map<string, Record<string, number | null>>();
    for (const entry of weeklyEntries ?? []) {
      const existing = latestWeekly.get(entry.user_id);
      if (!existing || entry.week_number > (existing.week_number as number)) {
        latestWeekly.set(entry.user_id, entry);
      }
    }

    // ── 4. Journal entry counts per user ─────────────────────────────────────
    const { data: journalRows, error: journalErr } = await admin
      .from("journal_entries")
      .select("user_id");

    if (journalErr) {
      console.error("[admin] journal_entries query error:", journalErr);
    }

    const journalCounts = new Map<string, number>();
    for (const row of journalRows ?? []) {
      journalCounts.set(row.user_id, (journalCounts.get(row.user_id) ?? 0) + 1);
    }

    // ── 5. Merge everything ──────────────────────────────────────────────────
    const rows: AdminUserRow[] = authUsers.map((u) => {
      const profile = profileMap.get(u.id);
      const weeklyEntry = latestWeekly.get(u.id);
      const checkinScore = weeklyEntry ? avgScores(weeklyEntry) : null;

      return {
        id: u.id,
        email: u.email ?? "(no email)",
        full_name:
          (u.user_metadata?.full_name as string | undefined) ??
          (u.user_metadata?.name as string | undefined) ??
          null,
        subscription_status: profile?.subscription_status ?? "free",
        age_group: profile?.age_group ?? null,
        stack_selection: profile?.stack_selection ?? null,
        health_status: profile?.health_status ?? null,
        latest_checkin_score:
          checkinScore !== null ? Math.round(checkinScore * 10) / 10 : null,
        journal_count: journalCounts.get(u.id) ?? 0,
        created_at: u.created_at,
        updated_at: profile?.updated_at ?? null,
      };
    });

    // Sort newest users first
    rows.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return (
      <div className="mx-auto max-w-screen-2xl px-6 py-10">
        {/* Header */}
        <div className="mb-8 border-b border-zinc-800 pb-6">
          <h1 className="text-2xl font-bold text-white">
            Perfect Stack{" "}
            <span className="text-yellow-500">Admin</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Internal user overview — server-rendered, service role only.
          </p>
        </div>

        {/* Table */}
        <AdminTable rows={rows} />
      </div>
    );
  } catch (error) {
    console.error("[admin] Admin panel error:", error);
    return (
      <div className="p-8 text-red-400">
        Error: {String(error)}
      </div>
    );
  }
}
