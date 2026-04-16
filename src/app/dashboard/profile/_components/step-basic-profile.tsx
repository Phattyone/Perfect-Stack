"use client";

import {
  AGE_GROUPS,
  PRIMARY_GOALS,
  TRAINING_STYLES,
  HEALTH_STATUSES,
} from "@/lib/types/profile";
import type { ProfileFormData } from "@/lib/types/profile";

interface StepBasicProfileProps {
  data: ProfileFormData;
  onChange: (field: keyof ProfileFormData, value: string | string[]) => void;
}

const selectClass =
  "mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600";

export default function StepBasicProfile({ data, onChange }: StepBasicProfileProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-white">Basic Profile</h2>

      {/* Age Group */}
      <div>
        <label className="block text-sm font-medium text-zinc-300">
          Age Group
        </label>
        <select
          value={data.age_group}
          onChange={(e) => onChange("age_group", e.target.value)}
          className={selectClass}
        >
          <option value="">Select age group</option>
          {AGE_GROUPS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Goal */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Primary Goal
        </label>
        <div className="space-y-2">
          {PRIMARY_GOALS.map((opt) => (
            <label
              key={opt}
              className={`flex cursor-pointer items-center rounded-md border px-3 py-2.5 text-sm transition ${
                data.primary_goal === opt
                  ? "border-yellow-600 bg-yellow-600/10 text-white"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              <input
                type="radio"
                name="primary_goal"
                value={opt}
                checked={data.primary_goal === opt}
                onChange={(e) => onChange("primary_goal", e.target.value)}
                className="sr-only"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Training Style */}
      <div>
        <label className="block text-sm font-medium text-zinc-300">
          Training Style
        </label>
        <select
          value={data.training_style}
          onChange={(e) => onChange("training_style", e.target.value)}
          className={selectClass}
        >
          <option value="">Select training style</option>
          {TRAINING_STYLES.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Health Status (multi-select) */}
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-300">
          Health Status
        </label>
        <p className="mb-2 text-xs text-zinc-500">Select all that apply.</p>
        <div className="space-y-2">
          {HEALTH_STATUSES.map((opt) => {
            const NO_CONDITIONS = "No significant conditions";
            const selected = data.health_status.includes(opt);
            const hasOtherConditions = data.health_status.some(
              (s: string) => s !== NO_CONDITIONS
            );
            const noConditionsSelected = data.health_status.includes(NO_CONDITIONS);
            // Disable "No significant conditions" when other items are selected;
            // disable all other items when "No significant conditions" is selected.
            const disabled =
              (opt === NO_CONDITIONS && hasOtherConditions) ||
              (opt !== NO_CONDITIONS && noConditionsSelected);
            return (
              <label
                key={opt}
                className={`flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm transition ${
                  disabled
                    ? "cursor-not-allowed border-zinc-800 bg-zinc-900/50 text-zinc-600"
                    : selected
                    ? "cursor-pointer border-yellow-600 bg-yellow-600/10 text-white"
                    : "cursor-pointer border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  disabled={disabled}
                  onChange={() => {
                    if (disabled) return;
                    if (opt === NO_CONDITIONS) {
                      // Selecting "No conditions" clears everything else
                      onChange("health_status", selected ? [] : [NO_CONDITIONS]);
                    } else {
                      // Selecting any other option removes "No conditions"
                      const without = data.health_status.filter(
                        (s: string) => s !== NO_CONDITIONS && s !== opt
                      );
                      const next = selected ? without : [...without, opt];
                      onChange("health_status", next);
                    }
                  }}
                  className="sr-only"
                />
                <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${selected ? "border-yellow-600 bg-yellow-600" : disabled ? "border-zinc-700 bg-zinc-800" : "border-zinc-600"}`}>
                  {selected && <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </span>
                {opt}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
