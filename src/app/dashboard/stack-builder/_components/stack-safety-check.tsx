"use client";

import { useMemo } from "react";
import {
  SUPPLEMENT_INTERACTIONS,
  type InteractionSeverity,
} from "@/lib/data/supplement-interactions";

interface StackSafetyCheckProps {
  activeSupplementIds: number[];
}

const SEVERITY_PRIORITY: Record<InteractionSeverity, number> = {
  conflict: 0,
  caution: 1,
  note: 2,
};

const DOT_COLOR: Record<InteractionSeverity, string> = {
  conflict: "bg-red-500",
  caution: "bg-amber-500",
  note: "bg-blue-500",
};

const BORDER_COLOR: Record<InteractionSeverity, string> = {
  conflict: "border-l-red-500",
  caution: "border-l-yellow-500",
  note: "border-l-blue-500",
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
      ).sort(
        (a, b) =>
          SEVERITY_PRIORITY[a.severity] - SEVERITY_PRIORITY[b.severity]
      ),
    [activeSet]
  );

  const conflictCount = matchingInteractions.filter(
    (i) => i.severity === "conflict"
  ).length;
  const cautionCount = matchingInteractions.filter(
    (i) => i.severity === "caution"
  ).length;

  const n = activeSupplementIds.length;
  const totalPairs = (n * (n - 1)) / 2;
  const safeCount = Math.max(0, totalPairs - matchingInteractions.length);

  const hasInteractions = matchingInteractions.length > 0;

  return (
    <div id="stack-safety-check" className="rounded-lg bg-zinc-900 p-4">
      {/* Header */}
      <h3 className="text-lg font-semibold text-yellow-500">
        Stack Safety Check
      </h3>

      {/* Summary badges */}
      <div className="mt-2 flex flex-wrap gap-2">
        {conflictCount > 0 && (
          <span className="rounded-full border border-red-700/50 bg-red-900/30 px-3 py-1 text-xs font-medium text-red-400">
            {conflictCount} conflict{conflictCount !== 1 ? "s" : ""}
          </span>
        )}
        {cautionCount > 0 && (
          <span className="rounded-full border border-yellow-700/50 bg-yellow-900/30 px-3 py-1 text-xs font-medium text-yellow-400">
            {cautionCount} caution{cautionCount !== 1 ? "s" : ""}
          </span>
        )}
        <span className="rounded-full border border-green-700/50 bg-green-900/30 px-3 py-1 text-xs font-medium text-green-400">
          {safeCount} safe
        </span>
      </div>

      {/* Interaction cards */}
      <div className="mt-4 space-y-2">
        {!hasInteractions && (
          /* All-clear state */
          <div className="rounded-lg border-l-4 border-l-green-500 bg-zinc-800/50 px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium text-zinc-300">
                  All supplement combinations are safe
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  No interactions detected across your current stack selection.
                </p>
              </div>
            </div>
          </div>
        )}

        {hasInteractions &&
          matchingInteractions.map((interaction) => (
            <div
              key={interaction.id}
              className={`rounded-lg border-l-4 ${BORDER_COLOR[interaction.severity]} bg-zinc-800/50 px-4 py-3`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${DOT_COLOR[interaction.severity]}`}
                />
                <div>
                  <p className="text-sm font-medium text-white">
                    {interaction.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                    {interaction.message}
                  </p>
                </div>
              </div>
            </div>
          ))}

        {/* Partial clear: green card after flagged interactions */}
        {hasInteractions && (
          <div className="rounded-lg border-l-4 border-l-green-500 bg-zinc-800/50 px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium text-zinc-300">
                  All other supplement combinations are safe
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  No additional interactions detected across your current stack
                  selection.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
