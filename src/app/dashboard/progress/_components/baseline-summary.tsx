"use client";

import type { BaselineData } from "@/lib/types/progress";
import { SCORE_MARKERS } from "@/lib/types/progress";

interface BaselineSummaryProps {
  baseline: BaselineData;
  onEdit: () => void;
}

export default function BaselineSummary({ baseline, onEdit }: BaselineSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">
          Recorded {baseline.recorded_at}
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition hover:border-yellow-600 hover:text-white"
        >
          Edit
        </button>
      </div>

      {/* Measurements */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Weight", value: `${baseline.weight_lbs} lbs` },
          { label: "Waist", value: `${baseline.waist_inches}"` },
          { label: "Hip", value: baseline.hip_inches ? `${baseline.hip_inches}"` : " - " },
          { label: "Neck", value: baseline.neck_inches ? `${baseline.neck_inches}"` : " - " },
        ].map((item) => (
          <div key={item.label} className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3 text-center">
            <span className="block text-xs text-zinc-500">{item.label}</span>
            <span className="text-lg font-bold text-yellow-500">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Score markers */}
      <div className="grid gap-3 sm:grid-cols-3">
        {SCORE_MARKERS.map((m) => {
          const val = baseline[m.key as keyof BaselineData] as number;
          return (
            <div key={m.key} className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3">
              <span className="block text-xs text-zinc-500">{m.label}</span>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-yellow-600" style={{ width: `${val * 10}%` }} />
                </div>
                <span className="text-sm font-bold text-yellow-500">{val}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Habits */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3 text-center">
          <span className="block text-xs text-zinc-500">Sleep</span>
          <span className="text-lg font-bold text-white">{baseline.sleep_hours} hrs</span>
        </div>
        <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3 text-center">
          <span className="block text-xs text-zinc-500">Drinks/week</span>
          <span className="text-lg font-bold text-white">{baseline.alcohol_drinks_per_week}</span>
        </div>
        <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3 text-center">
          <span className="block text-xs text-zinc-500">Training</span>
          <span className="text-lg font-bold text-white">{baseline.training_days_per_week} days</span>
        </div>
      </div>
    </div>
  );
}
