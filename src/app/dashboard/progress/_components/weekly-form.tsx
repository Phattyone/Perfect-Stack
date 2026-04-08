"use client";

import { useState, useTransition } from "react";
import type { BaselineData, WeeklyEntryData } from "@/lib/types/progress";
import { DEFAULT_WEEKLY, SCORE_MARKERS, MARKER_COLORS } from "@/lib/types/progress";
import { saveWeeklyEntry } from "../actions";
import ScoreSlider from "./score-slider";

interface WeeklyFormProps {
  baseline: BaselineData | null;
  existingEntries: WeeklyEntryData[];
  userId: string;
  onSaved: (entry: WeeklyEntryData) => void;
}

const inputClass =
  "mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600";

function Delta({ current, baseline, unit, invert }: { current: number | null; baseline: number; unit: string; invert?: boolean }) {
  if (current === null) return <span className="text-zinc-600"> - </span>;
  const diff = Number((current - baseline).toFixed(1));
  if (diff === 0) return <span className="text-zinc-400">±0 {unit}</span>;
  const isPositive = invert ? diff < 0 : diff > 0;
  return (
    <span className={isPositive ? "text-green-400" : "text-red-400"}>
      {diff > 0 ? "+" : ""}{diff} {unit}
    </span>
  );
}

export default function WeeklyForm({ baseline, existingEntries, userId, onSaved }: WeeklyFormProps) {
  const entryMap = new Map(existingEntries.map((e) => [e.week_number, e]));

  // Find first incomplete week
  const firstIncomplete = Array.from({ length: 8 }, (_, i) => i + 1).find(
    (w) => !entryMap.has(w)
  ) ?? 1;

  const [selectedWeek, setSelectedWeek] = useState(firstIncomplete);
  const [data, setData] = useState<WeeklyEntryData>(
    entryMap.get(firstIncomplete) ?? { ...DEFAULT_WEEKLY, week_number: firstIncomplete }
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [scoresLocked, setScoresLocked] = useState(false);
  const [success, setSuccess] = useState(false);

  function selectWeek(week: number) {
    setSelectedWeek(week);
    setData(entryMap.get(week) ?? { ...DEFAULT_WEEKLY, week_number: week });
    setSuccess(false);
    setError(null);
  }

  function update<K extends keyof WeeklyEntryData>(field: K, value: WeeklyEntryData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await saveWeeklyEntry(userId, data);
      if ("error" in result) {
        setError(result.error);
      } else {
        setSuccess(true);
        onSaved(data);
      }
    });
  }

  const hasExisting = entryMap.has(selectedWeek);

  return (
    <div className="space-y-6">
      {/* Week selector */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 8 }, (_, i) => i + 1).map((week) => {
          const hasEntry = entryMap.has(week);
          const isSelected = week === selectedWeek;
          return (
            <button
              key={week}
              type="button"
              onClick={() => selectWeek(week)}
              className={`flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                isSelected
                  ? "border-yellow-600 bg-yellow-600/10 text-yellow-500"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              Wk {week}
              {hasEntry && (
                <svg className="h-3.5 w-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}
      {success && (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Week {selectedWeek} saved!
        </div>
      )}

      {/* Measurements */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-300">Weight (lbs)</label>
          <input type="number" value={data.weight_lbs ?? ""} onChange={(e) => update("weight_lbs", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300">Waist (inches)</label>
          <input type="number" step="0.1" value={data.waist_inches ?? ""} onChange={(e) => update("waist_inches", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
        </div>
      </div>

      {/* Performance markers */}
      <div className="mb-2 flex items-center gap-3">
        <p className="text-xs text-zinc-500">Scores sync automatically with your Journal.</p>
        <button type="button" onClick={() => setScoresLocked((l) => !l)}
          className="shrink-0 rounded-full border border-yellow-600 px-3 py-1 text-xs text-yellow-600 hover:bg-yellow-600/10">
          {scoresLocked ? "Unlock Scores" : "Lock Scores"}
        </button>
      </div>
      <div className={`space-y-5 ${scoresLocked ? "pointer-events-none opacity-75" : ""}`}>
        {SCORE_MARKERS.map((m) => (
          <ScoreSlider
            key={m.key}
            label={m.label}
            description={m.description}
            value={(data[m.key as keyof WeeklyEntryData] as number) ?? 5}
            onChange={(v) => update(m.key as keyof WeeklyEntryData, v as never)}
            color={MARKER_COLORS[m.key]?.hex}
          />
        ))}
      </div>

      {/* Habits */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-zinc-300">Sleep (hours)</label>
          <input type="number" step="0.5" value={data.sleep_hours ?? ""} onChange={(e) => update("sleep_hours", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300">Drinks this week</label>
          <input type="number" value={data.alcohol_drinks ?? ""} onChange={(e) => update("alcohol_drinks", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300">Training days</label>
          <input type="number" value={data.training_days ?? ""} onChange={(e) => update("training_days", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-zinc-300">Notes</label>
        <textarea value={data.notes} onChange={(e) => update("notes", e.target.value)} rows={3} className={inputClass} placeholder="How did this week go?" />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="w-full rounded-md bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-500 disabled:opacity-50"
      >
        {isPending ? "Saving..." : hasExisting ? "Update Entry" : "Save Entry"}
      </button>

      {/* Baseline comparison */}
      {baseline && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            vs. Your Baseline
          </h4>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Weight</span>
              <Delta current={data.weight_lbs} baseline={baseline.weight_lbs} unit="lbs" invert />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Waist</span>
              <Delta current={data.waist_inches} baseline={baseline.waist_inches} unit="in" invert />
            </div>
            {SCORE_MARKERS.map((m) => (
              <div key={m.key} className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{m.label}</span>
                <Delta
                  current={data[m.key as keyof WeeklyEntryData] as number | null}
                  baseline={baseline[m.key as keyof BaselineData] as number}
                  unit="pts"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
