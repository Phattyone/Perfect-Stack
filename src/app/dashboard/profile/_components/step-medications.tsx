"use client";

import { PDE5_OPTIONS, PDE5_FREQUENCIES } from "@/lib/types/profile";
import type { ProfileFormData } from "@/lib/types/profile";

interface StepMedicationsProps {
  data: ProfileFormData;
  onChange: (field: keyof ProfileFormData, value: string | boolean) => void;
}

const selectClass =
  "mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600";

interface ToggleProps {
  label: string;
  hint?: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}

function Toggle({ label, hint, value, onToggle }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-3">
      <div className="min-w-0">
        <span className="text-sm text-white">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-xs text-zinc-500">{hint}</span>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={() => onToggle(true)}
          className={`rounded px-3 py-1 text-xs font-medium transition ${
            value
              ? "bg-yellow-600 text-black"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onToggle(false)}
          className={`rounded px-3 py-1 text-xs font-medium transition ${
            !value
              ? "bg-zinc-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          No
        </button>
      </div>
    </div>
  );
}

export default function StepMedications({ data, onChange }: StepMedicationsProps) {
  const hasPDE5 = data.pde5_inhibitor !== "None";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          Medications &amp; Supplements
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          This information is critical for your safety. Answer honestly.
        </p>
      </div>

      {/* PDE5 Inhibitor */}
      <div>
        <label className="block text-sm font-medium text-zinc-300">
          PDE5 Inhibitor in Use
        </label>
        <select
          value={data.pde5_inhibitor}
          onChange={(e) => onChange("pde5_inhibitor", e.target.value)}
          className={selectClass}
        >
          {PDE5_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Conditional PDE5 dose + frequency */}
      {hasPDE5 && (
        <div className="grid grid-cols-2 gap-4 rounded-md border border-zinc-700 bg-zinc-900/50 p-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300">
              Dose
            </label>
            <input
              type="text"
              placeholder="e.g. 20mg"
              value={data.pde5_dose}
              onChange={(e) => onChange("pde5_dose", e.target.value)}
              className={selectClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300">
              Frequency
            </label>
            <select
              value={data.pde5_frequency}
              onChange={(e) => onChange("pde5_frequency", e.target.value)}
              className={selectClass}
            >
              <option value="">Select</option>
              {PDE5_FREQUENCIES.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Medication toggles */}
      <div className="space-y-3">
        <Toggle
          label="Blood Pressure Medications"
          value={data.bp_meds}
          onToggle={(v) => onChange("bp_meds", v)}
        />
        <Toggle
          label="Nitrate Medications"
          hint="e.g. nitroglycerin, isosorbide mononitrate, isosorbide dinitrate"
          value={data.nitrate_meds}
          onToggle={(v) => onChange("nitrate_meds", v)}
        />
        <Toggle
          label="Alpha-Blockers"
          hint="e.g. tamsulosin, terazosin, doxazosin"
          value={data.alpha_blockers}
          onToggle={(v) => onChange("alpha_blockers", v)}
        />
        <Toggle
          label="Diabetes Medications"
          value={data.diabetes_meds}
          onToggle={(v) => onChange("diabetes_meds", v)}
        />
        <Toggle
          label="TRT or HRT"
          value={data.trt_hrt}
          onToggle={(v) => onChange("trt_hrt", v)}
        />
        <Toggle
          label="Thyroid Medications"
          hint="e.g. levothyroxine, liothyronine"
          value={data.thyroid_meds}
          onToggle={(v) => onChange("thyroid_meds", v)}
        />
        <Toggle
          label="Blood Thinners or Anticoagulants"
          hint="e.g. warfarin, clopidogrel, apixaban"
          value={data.blood_thinners}
          onToggle={(v) => onChange("blood_thinners", v)}
        />
        <Toggle
          label="Other ED Medications"
          value={data.other_ed_meds}
          onToggle={(v) => onChange("other_ed_meds", v)}
        />
      </div>
    </div>
  );
}
