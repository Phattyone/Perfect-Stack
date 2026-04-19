"use client";

import { useMemo } from "react";
import {
  SUPPLEMENT_INTERACTIONS,
  type InteractionSeverity,
} from "@/lib/data/supplement-interactions";

interface StackSafetyCheckProps {
  activeSupplementIds: number[];
}

const SEVERITY_CONFIG: Record<
  InteractionSeverity,
  {
    label: string;
    icon: string;
    borderCls: string;
    bgCls: string;
    labelCls: string;
    textCls: string;
    badgeCls: string;
  }
> = {
  conflict: {
    label: "Conflict",
    icon: "🚫",
    borderCls: "border-red-600",
    bgCls: "bg-red-950/60",
    labelCls: "text-red-400",
    textCls: "text-red-300/80",
    badgeCls: "border-red-600 text-red-400",
  },
  caution: {
    label: "Caution",
    icon: "⚠️",
    borderCls: "border-orange-500",
    bgCls: "bg-orange-950/40",
    labelCls: "text-orange-400",
    textCls: "text-orange-300/80",
    badgeCls: "border-orange-500 text-orange-400",
  },
  note: {
    label: "Note",
    icon: "ℹ️",
    borderCls: "border-blue-600/50",
    bgCls: "bg-blue-950/30",
    labelCls: "text-blue-400",
    textCls: "text-zinc-400",
    badgeCls: "border-blue-600/50 text-blue-400",
  },
};

export default function StackSafetyCheck({
  activeSupplementIds,
}: StackSafetyCheckProps) {
  const activeSet = useMemo(
    () => new Set(activeSupplementIds),
    [activeSupplementIds]
  );

  const matchingInteractions = useMemo(
    () =>
      SUPPLEMENT_INTERACTIONS.filter(
        (i) =>
          activeSet.has(i.supplementIds[0]) && activeSet.has(i.supplementIds[1])
      ),
    [activeSet]
  );

  if (matchingInteractions.length === 0) {
    return (
      <div className="rounded-lg border border-green-700/50 bg-green-950/20 p-4">
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-base">✅</span>
          <div>
            <p className="text-sm font-semibold text-green-400">
              Stack Safety Check Passed
            </p>
            <p className="text-xs text-zinc-500">
              No known interactions detected between your active supplements.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Stack Safety Check —{" "}
        {matchingInteractions.length} interaction
        {matchingInteractions.length !== 1 ? "s" : ""} detected
      </h3>

      {matchingInteractions.map((interaction) => {
        const cfg = SEVERITY_CONFIG[interaction.severity];
        return (
          <div
            key={interaction.id}
            className={`rounded-lg border ${cfg.borderCls} ${cfg.bgCls} p-3`}
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-sm">{cfg.icon}</span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-sm font-semibold ${cfg.labelCls}`}>
                    {interaction.title}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${cfg.badgeCls}`}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className={`mt-1 text-xs leading-relaxed ${cfg.textCls}`}>
                  {interaction.message}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
