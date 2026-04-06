"use client";

import { useState } from "react";
import type { BaselineData, WeeklyEntryData } from "@/lib/types/progress";
import { SCORE_MARKERS } from "@/lib/types/progress";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getDate().toString().padStart(2, "0")}/${d.getFullYear()}`;
}

interface ProgressOverviewProps {
  baseline: BaselineData | null;
  entries: WeeklyEntryData[];
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
    if (typeof val === "number") { sum += val; count++; }
  }
  return count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
}

// ─── Sparkline component (pure CSS) ───────────────────────────────
function Sparkline({ values, height = 60 }: { values: number[]; height?: number }) {
  if (values.length === 0) return null;
  const max = 10;
  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {values.map((v, i) => (
        <div key={i} className="flex-1 rounded-t-sm bg-yellow-600"
          style={{ height: `${(v / max) * 100}%`, opacity: i === values.length - 1 ? 1 : 0.5 }} />
      ))}
    </div>
  );
}

// ─── Trend line chart (pure CSS) ──────────────────────────────────
function TrendChart({ points, labels }: { points: number[]; labels: string[] }) {
  if (points.length === 0) return <p className="py-8 text-center text-sm text-zinc-500">Complete your first weekly check-in to see your trend.</p>;
  const max = 10;
  const chartH = 160;
  return (
    <div className="relative" style={{ height: chartH + 40 }}>
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 flex h-[160px] flex-col justify-between text-[10px] text-zinc-600">
        <span>10</span><span>5</span><span>0</span>
      </div>
      {/* Chart area */}
      <div className="ml-6 relative" style={{ height: chartH }}>
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2].map((i) => <div key={i} className="border-b border-zinc-800" />)}
        </div>
        {/* Gold gradient fill */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${points.length - 1 || 1} ${max}`}>
          <defs>
            <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ca8a04" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
            </linearGradient>
          </defs>
          {points.length > 1 && (
            <polygon
              fill="url(#goldFill)"
              points={`0,${max} ${points.map((p, i) => `${i},${max - p}`).join(" ")} ${points.length - 1},${max}`}
            />
          )}
          {points.length > 1 && (
            <polyline fill="none" stroke="#ca8a04" strokeWidth="0.15"
              points={points.map((p, i) => `${i},${max - p}`).join(" ")} />
          )}
        </svg>
        {/* Data points */}
        <div className="absolute inset-0 flex items-end">
          {points.map((p, i) => (
            <div key={i} className="relative flex-1 flex justify-center" style={{ height: "100%" }}>
              <div className="absolute w-3 h-3 rounded-full bg-yellow-600 border-2 border-zinc-950"
                style={{ bottom: `${(p / max) * 100}%`, transform: "translateY(50%)" }} />
            </div>
          ))}
        </div>
      </div>
      {/* X-axis labels */}
      <div className="ml-6 mt-2 flex">
        {labels.map((l, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-zinc-600">{l}</div>
        ))}
      </div>
    </div>
  );
}

// ─── Milestone badge ──────────────────────────────────────────────
function Milestone({ name, desc, unlocked }: { name: string; desc: string; unlocked: boolean }) {
  return (
    <div className={`rounded-lg border p-3 text-center ${unlocked ? "border-yellow-600/40 bg-yellow-600/5" : "border-zinc-800 bg-zinc-900 opacity-40"}`}>
      <div className="mb-1 text-lg">
        {unlocked ? (
          <svg className="mx-auto h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="mx-auto h-5 w-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
      </div>
      <span className={`block text-xs font-semibold ${unlocked ? "text-yellow-600" : "text-zinc-600"}`}>{name}</span>
      <span className="block text-[10px] text-zinc-500">{desc}</span>
    </div>
  );
}

// ─── Blood work log ───────────────────────────────────────────────
interface LabResult { date: string; test: string; result: string; units: string; reference: string; notes: string; }
const LAB_TESTS = ["Total Testosterone", "Free Testosterone", "SHBG", "Estradiol", "Vitamin D", "Fasting Glucose", "PSA (if 45+)"];

function BloodWorkLog() {
  const [results, setResults] = useState<LabResult[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<LabResult>({ date: new Date().toISOString().split("T")[0], test: LAB_TESTS[0], result: "", units: "", reference: "", notes: "" });

  function addResult() {
    if (!form.result) return;
    setResults((prev) => [...prev, form]);
    setForm({ date: new Date().toISOString().split("T")[0], test: LAB_TESTS[0], result: "", units: "", reference: "", notes: "" });
    setAdding(false);
  }

  const inputCls = "w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1.5 text-xs text-white focus:border-yellow-600 focus:outline-none";

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Blood Work Log</h3>
        <button type="button" onClick={() => setAdding(!adding)}
          className="text-xs font-medium text-yellow-600 hover:text-yellow-500">{adding ? "Cancel" : "Add Lab Result"}</button>
      </div>

      {adding && (
        <div className="mt-3 grid grid-cols-2 gap-2 rounded border border-zinc-700 bg-zinc-800/50 p-3 sm:grid-cols-3">
          <div><label className="mb-0.5 block text-[10px] text-zinc-500">Date</label><input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={inputCls} /></div>
          <div><label className="mb-0.5 block text-[10px] text-zinc-500">Test</label>
            <select value={form.test} onChange={(e) => setForm((f) => ({ ...f, test: e.target.value }))} className={inputCls}>
              {LAB_TESTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div><label className="mb-0.5 block text-[10px] text-zinc-500">Result</label><input value={form.result} onChange={(e) => setForm((f) => ({ ...f, result: e.target.value }))} className={inputCls} /></div>
          <div><label className="mb-0.5 block text-[10px] text-zinc-500">Units</label><input value={form.units} onChange={(e) => setForm((f) => ({ ...f, units: e.target.value }))} className={inputCls} placeholder="ng/dL" /></div>
          <div><label className="mb-0.5 block text-[10px] text-zinc-500">Ref. Range</label><input value={form.reference} onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))} className={inputCls} placeholder="300-1000" /></div>
          <div><label className="mb-0.5 block text-[10px] text-zinc-500">Notes</label><input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className={inputCls} /></div>
          <div className="col-span-2 sm:col-span-3">
            <button type="button" onClick={addResult} className="w-full rounded bg-yellow-600 px-3 py-1.5 text-xs font-semibold text-black hover:bg-yellow-500">Save Result</button>
          </div>
        </div>
      )}

      {results.length > 0 ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-zinc-800">
              <th className="px-2 py-1 text-left text-zinc-500">Date</th>
              <th className="px-2 py-1 text-left text-zinc-500">Test</th>
              <th className="px-2 py-1 text-right text-zinc-500">Result</th>
              <th className="px-2 py-1 text-right text-zinc-500">Ref.</th>
              <th className="px-2 py-1 text-left text-zinc-500">Notes</th>
            </tr></thead>
            <tbody>{results.map((r, i) => (
              <tr key={i} className="border-b border-zinc-800/50">
                <td className="px-2 py-1 text-zinc-400">{r.date}</td>
                <td className="px-2 py-1 text-zinc-300">{r.test}</td>
                <td className="px-2 py-1 text-right font-semibold text-yellow-500">{r.result} {r.units}</td>
                <td className="px-2 py-1 text-right text-zinc-500">{r.reference}</td>
                <td className="px-2 py-1 text-zinc-500">{r.notes}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <p className="mt-3 text-xs text-zinc-600">No lab results logged yet. Get your baseline blood panel before starting the protocol.</p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────
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
  const waistDelta = baseline && latest?.waist_inches ? Number((latest.waist_inches - baseline.waist_inches).toFixed(1)) : 0;
  const baselineAvg = baseline ? avgScore(baseline) : 0;
  const latestAvg = latest ? avgScore(latest) : baselineAvg;

  // Build score history for charts
  const allPoints: { label: string; data: BaselineData | WeeklyEntryData }[] = [];
  if (baseline) allPoints.push({ label: "Base", data: baseline });
  entries.forEach((e) => allPoints.push({ label: `Wk${e.week_number}`, data: e }));

  const overallScores = allPoints.map((p) => avgScore(p.data));
  const overallLabels = allPoints.map((p) => p.label);

  // Milestones
  const weekNums = new Set(entries.map((e) => e.week_number));
  const milestones = [
    { name: "First Check-In", desc: "Week 1 entry complete", unlocked: weekNums.has(1) },
    { name: "Halfway There", desc: "Week 4 reached", unlocked: weekNums.has(4) },
    { name: "Protocol Complete", desc: "All 8 weeks logged", unlocked: weekNums.has(8) },
    { name: "Energy Improved", desc: "Energy above baseline", unlocked: baseline && latest ? (latest.energy_score ?? 0) > baseline.energy_score : false },
    { name: "Sleep Optimized", desc: "Sleep score 8+", unlocked: latest ? (latest.sleep_quality_score ?? 0) >= 8 : false },
    { name: "Consistent Tracker", desc: "4+ weekly entries", unlocked: entries.length >= 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-yellow-600/40 bg-zinc-900 p-4 text-center">
          <span className="block text-xs text-zinc-500">Starting Weight</span>
          <span className="mt-1 block text-xl font-bold text-yellow-500">{startWeight} lbs</span>
        </div>
        <div className="rounded-lg border border-yellow-600/40 bg-zinc-900 p-4 text-center">
          <span className="block text-xs text-zinc-500">Current Weight</span>
          <span className="mt-1 block text-xl font-bold text-yellow-500">{currentWeight} lbs</span>
          {currentWeight !== startWeight && (
            <span className={`text-xs ${currentWeight < startWeight ? "text-green-400" : "text-red-400"}`}>
              {currentWeight > startWeight ? "+" : ""}{(currentWeight - startWeight).toFixed(1)}
            </span>
          )}
        </div>
        <div className="rounded-lg border border-yellow-600/40 bg-zinc-900 p-4 text-center">
          <span className="block text-xs text-zinc-500">Waist Change</span>
          <span className="mt-1 block text-xl font-bold text-yellow-500">{waistDelta > 0 ? "+" : ""}{waistDelta}&quot;</span>
        </div>
        <div className="rounded-lg border border-yellow-600/40 bg-zinc-900 p-4 text-center">
          <span className="block text-xs text-zinc-500">Overall Score</span>
          <span className="mt-1 block text-xl font-bold text-yellow-500">{latestAvg}</span>
          {latestAvg !== baselineAvg && (
            <span className={`text-xs ${latestAvg > baselineAvg ? "text-green-400" : "text-red-400"}`}>
              {latestAvg > baselineAvg ? "+" : ""}{(latestAvg - baselineAvg).toFixed(1)}
            </span>
          )}
        </div>
      </div>

      {/* Overall trend chart */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Overall Score Trend</h3>
        <TrendChart points={overallScores} labels={overallLabels} />
      </div>

      {/* Six marker sparklines */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SCORE_MARKERS.map((m) => {
          const values = allPoints.map((p) => getScore(p.data, m.key) ?? 0);
          const baseVal = baseline ? getScore(baseline, m.key) ?? 0 : 0;
          const currentVal = latest ? getScore(latest, m.key) ?? 0 : baseVal;
          const delta = currentVal - baseVal;

          return (
            <div key={m.key} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{m.label}</span>
                <span className="text-xl font-bold text-yellow-500">{currentVal}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                {delta > 0 && <span className="text-xs text-green-400">+{delta} pts</span>}
                {delta < 0 && <span className="text-xs text-red-400">{delta} pts</span>}
                {delta === 0 && <span className="text-xs text-zinc-500">no change</span>}
                <span className="text-xs text-zinc-500">Started at {baseVal}</span>
              </div>
              <div className="mt-3">
                <Sparkline values={values} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestones */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">Milestones</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {milestones.map((m) => (
            <Milestone key={m.name} name={m.name} desc={m.desc} unlocked={m.unlocked} />
          ))}
        </div>
      </div>

      {/* Week-by-week table */}
      {entries.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-zinc-800 bg-zinc-900">
              <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Week</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500">Date</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-zinc-500">Weight</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-zinc-500">Waist</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-zinc-500">Avg Score</th>
            </tr></thead>
            <tbody>{entries.map((e, i) => {
              const isLatest = i === entries.length - 1;
              return (
                <tr key={e.week_number} className={`border-b border-zinc-800 ${isLatest ? "border-yellow-600/40 bg-yellow-600/5" : ""}`}>
                  <td className="px-4 py-2 text-zinc-300">Week {e.week_number}</td>
                  <td className="px-4 py-2 text-zinc-400">{formatDate(e.entry_date)}</td>
                  <td className="px-4 py-2 text-right text-zinc-300">{e.weight_lbs ?? "-"}</td>
                  <td className="px-4 py-2 text-right text-zinc-300">{e.waist_inches ? `${e.waist_inches}"` : "-"}</td>
                  <td className="px-4 py-2 text-right font-semibold text-yellow-500">{avgScore(e)}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}

      {/* Blood work log */}
      <BloodWorkLog />
    </div>
  );
}
