"use client";

import { STACK_OPTIONS } from "@/lib/types/profile";
import type { ProfileFormData } from "@/lib/types/profile";

const STACK_DESCRIPTIONS: Record<string, string> = {
  stack_a:
    "Core vitamins, minerals, and essential cofactors. The non-negotiable baseline every man should be on.",
  stack_ab:
    "Foundation plus the Testosterone Support stack  -  Ashwagandha, Tongkat Ali, Fadogia, and natural T optimizers.",
  stack_abc:
    "Performance plus the Nitric stack  -  L-Citrulline, Beet Root, and Pine Bark for blood flow and erection quality.",
  stack_abcd:
    "Full Performance plus the Libido Amplifier stack  -  Maca, Horny Goat Weed, Ginseng, and desire-focused compounds.",
  stack_abcde:
    "Every stack. The full system optimized for hormone health, blood flow, libido, longevity, and peak performance.",
};

interface StepStackSelectionProps {
  data: ProfileFormData;
  onChange: (field: keyof ProfileFormData, value: string) => void;
  disabledStacks: string[];
}

export default function StepStackSelection({
  data,
  onChange,
  disabledStacks,
}: StepStackSelectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Stack Selection</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Choose how many stacks to include in your protocol.
        </p>
      </div>

      <div className="space-y-3">
        {STACK_OPTIONS.map((opt) => {
          const isDisabled = disabledStacks.some((d) =>
            opt.value.includes(d.replace("stack_", ""))
          );
          const isSelected = data.stack_selection === opt.value;

          // Disable any stack that includes "c" if stack_c is disabled
          const stackIncludesC =
            opt.value === "stack_abc" ||
            opt.value === "stack_abcd" ||
            opt.value === "stack_abcde";
          const blocked =
            isDisabled || (disabledStacks.includes("stack_c") && stackIncludesC);

          return (
            <button
              key={opt.value}
              type="button"
              disabled={blocked}
              onClick={() => onChange("stack_selection", opt.value)}
              className={`w-full rounded-lg border p-4 text-left transition ${
                blocked
                  ? "cursor-not-allowed border-zinc-800 bg-zinc-900/40 opacity-40"
                  : isSelected
                    ? "border-yellow-600 bg-yellow-600/10"
                    : "border-zinc-700 bg-zinc-900 hover:border-zinc-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-semibold ${
                    blocked
                      ? "text-zinc-600"
                      : isSelected
                        ? "text-yellow-600"
                        : "text-white"
                  }`}
                >
                  {opt.label}
                </span>
                {blocked && (
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
                    Not Available
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                {STACK_DESCRIPTIONS[opt.value]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
