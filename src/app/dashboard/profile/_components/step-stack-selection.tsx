"use client";

import { useMemo } from "react";
import { STACK_OPTIONS } from "@/lib/types/profile";
import type { ProfileFormData } from "@/lib/types/profile";

const STACK_DESCRIPTIONS: Record<string, string> = {
  stack_a:
    "Core vitamins, minerals, and essential cofactors. The non-negotiable baseline every man should be on.",
  stack_ab:
    "Foundation plus the Testosterone Support stack - Ashwagandha, Tongkat Ali, Fadogia, and natural T optimizers.",
  stack_abc:
    "Performance plus the Nitric stack - L-Citrulline, Beet Root, and Pine Bark for blood flow and erection quality.",
  stack_abcd:
    "Full Performance plus the Libido Amplifier stack - Maca, Horny Goat Weed, Ginseng, and desire-focused compounds.",
  stack_abcde:
    "Every stack. The full system optimized for hormone health, blood flow, libido, longevity, and peak performance.",
};

function getRecommendedStack(data: ProfileFormData): string {
  if (data.health_status.includes("Post-cardiac / Stent / High CV risk")) return "stack_a";
  if (data.health_status.includes("Active TRT or HRT user")) return "stack_ab";
  if (data.primary_goal === "Erection Quality + Blood Flow" || data.primary_goal === "Hormone + Sexual Health") return "stack_abc";
  if (data.primary_goal === "Libido + Desire") return "stack_abcd";
  if (data.primary_goal === "Longevity + Energy" || data.primary_goal === "Performance + Muscle") return "stack_abcde";
  if (data.primary_goal === "Stress + Sleep Recovery") return "stack_ab";
  return "stack_abc";
}

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
  const recommended = useMemo(() => getRecommendedStack(data), [data]);

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
          const isRecommended = opt.value === recommended;

          const stackIncludesC =
            opt.value === "stack_abc" ||
            opt.value === "stack_abcd" ||
            opt.value === "stack_abcde";
          const blocked =
            isDisabled || (disabledStacks.includes("stack_c") && stackIncludesC);

          return (
            <div key={opt.value} className="relative">
              {isRecommended && !blocked && (
                <div className="mb-1 flex items-center gap-1 text-xs text-yellow-500">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Recommended based on your profile
                </div>
              )}
              <button
                type="button"
                disabled={blocked}
                onClick={() => onChange("stack_selection", opt.value)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  blocked
                    ? "cursor-not-allowed border-zinc-800 bg-zinc-900/40 opacity-40"
                    : isSelected
                      ? "border-yellow-600 bg-yellow-600/10"
                      : isRecommended
                        ? "border-yellow-500 bg-zinc-900 hover:border-yellow-400"
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
