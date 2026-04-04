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
  onChange: (field: keyof ProfileFormData, value: string) => void;
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

      {/* Health Status */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-300">
          Health Status
        </label>
        <div className="space-y-2">
          {HEALTH_STATUSES.map((opt) => (
            <label
              key={opt}
              className={`flex cursor-pointer items-center rounded-md border px-3 py-2.5 text-sm transition ${
                data.health_status === opt
                  ? "border-yellow-600 bg-yellow-600/10 text-white"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              <input
                type="radio"
                name="health_status"
                value={opt}
                checked={data.health_status === opt}
                onChange={(e) => onChange("health_status", e.target.value)}
                className="sr-only"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
