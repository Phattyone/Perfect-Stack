"use client";

import type { BaselineData, WeeklyEntryData } from "@/lib/types/progress";
import { SCORE_MARKERS } from "@/lib/types/progress";

interface ProgressOverviewProps {
  baseline: BaselineData | null;
  entries: WeeklyEntryData[];
}

function StatCard({ label, value, delta, invert }: { label: string; value: string; delta?: number; invert?: boolean }) {
  let deltaEl = null;
  if (delta !== undefined && delta !== 0) {
    const isPositive = invert ? delta < 0 : delta > 0;
    deltaEl = (
      <span className={`text-xs font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
        {delta > 0 ? "+" : ""}{delta.toFixed(1)}
      </span>
    );
  }
  return (
    <div className="rounded-lg border border-yellow-600/40 bg-zinc-900 p-4 text-center">
      <span className="block text-xs text-zinc-500">{label}</span>
      <span className="mt-1 block text-xl font-bold text-yellow-500">{value}</span>
      {deltaEl}
    </div>
  );
}

function getScore(data: BaselineData | WeeklyEntryData, key: string): number | null {
  switch (key) {
    case "energy_score": return data.energy_score;
    case "libido_score": return data.libido_score;
    case "erection_quality_score": return data.erection_quality_score;
    case "sleep_quality_score": return data.sleep_quality_score;
    case "mood_score": return data.mood_score;
    case "strength_recovery_score": return data.strength_recovery_score;
    default: return null;
  }
}

function avgScore(data: BaselineData | WeeklyEntryData): number {
  let sum = 0;
  let count = 0;
  for (const m of SCORE_MARKERS) {
    const val = getScore(data, m.key);
    if (typeof val === "number") {
      sum += val;
      count++;
    }
  }
  return count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
}

export default function ProgressOverview({ baseline, entries }: ProgressOverviewProps) {
  if (!baseline && entries.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-8 text-center">
        <p className="text-zinc-400">No data yet. Complete your baseline and weekly check-ins to see your progress.</p>
      </div>
    );
  }

  const latest = entries.length > 0 ? entries[entries.length - 1] : null;
  const startWeight = baseline?.weight_lbs ?? 0;
  const currentWeight = latest?.weight_lbs ?? startWeight;
  const waistDelta = baseline && latest?.waist_inches
    ? Number((latest.waist_inches - baseline.waist_inches).toFixed(1))
    : 0;
  const baselineAvg = baseline ? avgScore(baseline) : 0;
  const latestAvg = latest ? avgScore(latest) : baselineAvg;

  // Build score history: baseline as week 0, then weekly entries
  const scoreHistory: { label: string; scores: Record<string, number | null> }[] = [];
  if (baseline) {
    const scores: Record<string, number | null> = {};
    SCORE_MARKERS.forEach((m) => {
      scores[m.key] = baseline[m.key as keyof BaselineData] as number;
    });
    scoreHistory.push({ label: "Baseline", scores });
  }
  entries.forEach((e) => {
    const scores: Record<string, number | null> = {};
    SCORE_MARKERS.forEach((m) => {
      scores[m.key] = e[m.key as keyof WeeklyEntryData] as number | null;
    });
    scoreHistory.push({ label: `Wk ${e.week_number}`, scores });
  });

  return (
    <div className="space-y-6">
      {/* Summary stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Starting Weight" value={`${startWeight} lbs`} />
        <StatCard
          label="Current Weight"
          value={`${currentWeight} lbs`}
          delta={currentWeight - startWeight}
          invert
        />
        <StatCard
          label="Waist Change"
          value={`${waistDelta > 0 ? "+" : ""}${waistDelta}"`}
          delta={waistDelta}
          invert
        />
        <StatCard
          label="Overall Score"
          value={`${latestAvg}`}
          delta={latestAvg - baselineAvg}
        />
      </div>

      {/* Progress bars for each marker */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Performance Markers Over Time
        </h3>
        <div className="space-y-5">
          {SCORE_MARKERS.map((m) => (
            <div key={m.key}>
              <span className="mb-1 block text-sm font-medium text-zinc-300">{m.label}</span>
              <div className="flex items-center gap-2">
                <div className="flex flex-1 items-end gap-1">
                  {scoreHistory.map((week, i) => {
                    const val = week.scores[m.key];
                    if (val === null || val === undefined) return null;
                    const isLatest = i === scoreHistory.length - 1;
                    return (
                      <div key={week.label} className="flex flex-1 flex-col items-center gap-0.5">
                        <span className="text-[10px] text-zinc-600">{val}</span>
                        <div
                          className={`w-full rounded-sm ${isLatest ? "bg-yellow-600" : "bg-zinc-600"}`}
                          style={{ height: `${val * 3}px` }}
                        />
                        <span className="text-[9px] text-zinc-600">{week.label}</span>
                      </div>
                    );
                  })}
                </div>
                {latest && (
                  <span className="w-8 text-right text-sm font-bold text-yellow-500">
                    {(latest[m.key as keyof WeeklyEntryData] as number) ?? " - "}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Week-by-week summary table */}
      {entries.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900">
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Week</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Date</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-zinc-500">Weight</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-zinc-500">Waist</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-zinc-500">Avg Score</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => {
                const isLatest = i === entries.length - 1;
                return (
                  <tr
                    key={e.week_number}
                    className={`border-b border-zinc-800 ${isLatest ? "border-yellow-600/40 bg-yellow-600/5" : ""}`}
                  >
                    <td className="px-4 py-2 text-zinc-300">Week {e.week_number}</td>
                    <td className="px-4 py-2 text-zinc-400">{e.entry_date}</td>
                    <td className="px-4 py-2 text-right text-zinc-300">{e.weight_lbs ?? " - "}</td>
                    <td className="px-4 py-2 text-right text-zinc-300">{e.waist_inches ? `${e.waist_inches}"` : " - "}</td>
                    <td className="px-4 py-2 text-right font-semibold text-yellow-500">{avgScore(e)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
