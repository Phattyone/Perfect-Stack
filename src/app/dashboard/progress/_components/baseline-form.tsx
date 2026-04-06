"use client";

import { useState, useTransition } from "react";
import type { BaselineData } from "@/lib/types/progress";
import { DEFAULT_BASELINE, SCORE_MARKERS, MARKER_COLORS } from "@/lib/types/progress";
import { saveBaseline } from "../actions";
import ScoreSlider from "./score-slider";

interface BaselineFormProps {
  existing: BaselineData | null;
  userId: string;
  onSaved: (data: BaselineData) => void;
}

const inputClass =
  "mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder-zinc-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600";

export default function BaselineForm({ existing, userId, onSaved }: BaselineFormProps) {
  const [data, setData] = useState<BaselineData>(existing ?? DEFAULT_BASELINE);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function update<K extends keyof BaselineData>(field: K, value: BaselineData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  function handleSave() {
    if (!data.weight_lbs || !data.waist_inches) {
      setError("Weight and waist circumference are required.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await saveBaseline(userId, data);
      if ("error" in result) {
        setError(result.error);
      } else {
        setSuccess(true);
        onSaved(data);
      }
    });
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Baseline saved successfully!
        </div>
      )}

      {/* Lab referral card */}
      <div className="rounded-lg border-l-4 border-yellow-600 bg-zinc-900 p-4">
        <h4 className="text-sm font-bold text-white">
          <span className="mr-1">🩸</span> Get Your Baseline Labs
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-zinc-400">
          Before starting the protocol, get a baseline blood panel. Dr. Ravi
          Kacker at MWU Urology (Boston area) offers comprehensive testosterone
          and hormone panels through insurance or self-pay.
        </p>
        <a
          href="https://mwurology.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs font-medium text-yellow-600 hover:text-yellow-500"
        >
          Book with Dr. Kacker →
        </a>
      </div>

      {/* Body Measurements */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Body Measurements
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-300">Weight (lbs) *</label>
            <input type="number" value={data.weight_lbs || ""} onChange={(e) => update("weight_lbs", Number(e.target.value))} className={inputClass} placeholder="185" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300">
              Waist (inches) *
              <span className="ml-1 text-xs text-yellow-600">most important</span>
            </label>
            <input type="number" step="0.1" value={data.waist_inches || ""} onChange={(e) => update("waist_inches", Number(e.target.value))} className={inputClass} placeholder="36.5" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300">Hip (inches) <span className="text-xs text-zinc-500">optional</span></label>
            <input type="number" step="0.1" value={data.hip_inches ?? ""} onChange={(e) => update("hip_inches", e.target.value ? Number(e.target.value) : null)} className={inputClass} placeholder="40" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300">Neck (inches) <span className="text-xs text-zinc-500">optional</span></label>
            <input type="number" step="0.1" value={data.neck_inches ?? ""} onChange={(e) => update("neck_inches", e.target.value ? Number(e.target.value) : null)} className={inputClass} placeholder="16" />
          </div>
        </div>
      </section>

      {/* Performance Markers */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Performance Markers
        </h3>
        <div className="space-y-5">
          {SCORE_MARKERS.map((m) => (
            <ScoreSlider
              key={m.key}
              label={m.label}
              description={m.description}
              value={(data[m.key as keyof BaselineData] as number) ?? 5}
              onChange={(v) => update(m.key as keyof BaselineData, v as never)}
              color={MARKER_COLORS[m.key]?.hex}
            />
          ))}
        </div>
      </section>

      {/* Current Habits */}
      <section>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Current Habits
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-zinc-300">Sleep (hours/night)</label>
            <input type="number" step="0.5" value={data.sleep_hours} onChange={(e) => update("sleep_hours", Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300">Drinks/week</label>
            <input type="number" value={data.alcohol_drinks_per_week} onChange={(e) => update("alcohol_drinks_per_week", Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300">Training days/week</label>
            <input type="number" value={data.training_days_per_week} onChange={(e) => update("training_days_per_week", Number(e.target.value))} className={inputClass} />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-zinc-300">Training type</label>
          <input type="text" value={data.training_type} onChange={(e) => update("training_type", e.target.value)} className={inputClass} placeholder="e.g. Heavy lifting 4x/week" />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-300">Current medications <span className="text-xs text-zinc-500">optional</span></label>
            <textarea value={data.current_medications} onChange={(e) => update("current_medications", e.target.value)} rows={2} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300">Current supplements <span className="text-xs text-zinc-500">optional</span></label>
            <textarea value={data.current_supplements} onChange={(e) => update("current_supplements", e.target.value)} rows={2} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Notes */}
      <section>
        <label className="block text-sm font-medium text-zinc-300">Notes <span className="text-xs text-zinc-500">optional</span></label>
        <textarea value={data.notes} onChange={(e) => update("notes", e.target.value)} rows={3} className={inputClass} placeholder="Any other context about your starting point..." />
      </section>

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="w-full rounded-md bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-500 disabled:opacity-50"
      >
        {isPending ? "Saving..." : existing ? "Update Baseline" : "Save Baseline"}
      </button>
    </div>
  );
}
