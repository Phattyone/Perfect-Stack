"use client";

import { useMemo } from "react";
import {
  SUPPLEMENT_INTERACTIONS,
  type InteractionSeverity,
} from "@/lib/data/supplement-interactions";
import { isUltimate } from "@/lib/subscription";

interface StackSafetyCheckProps {
  activeSupplementIds: number[];
  subscriptionStatus: string;
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

// Left border + colored background per severity
const CARD_STYLE: Record<InteractionSeverity, string> = {
  conflict: "border-l-4 border-l-red-500 bg-red-900/20",
  caution: "border-l-4 border-l-yellow-500 bg-yellow-900/20",
  note: "border-l-4 border-l-blue-500 bg-blue-900/20",
};

export default function StackSafetyCheck({
  activeSupplementIds,
  subscriptionStatus,
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
  const noteCount = matchingInteractions.filter(
    (i) => i.severity === "note"
  ).length;

  // Build the set of supplement IDs involved in any detected interaction
  const flaggedIds = useMemo(() => {
    const ids = new Set<number>();
    for (const i of matchingInteractions) {
      ids.add(i.supplementIds[0]);
      ids.add(i.supplementIds[1]);
    }
    return ids;
  }, [matchingInteractions]);

  // Safe count = active supplements with no flagged interaction
  const safeCount = activeSupplementIds.length - flaggedIds.size;

  const hasInteractions = matchingInteractions.length > 0;
  const userIsUltimate = isUltimate(subscriptionStatus);

  return (
    <div id="stack-safety-check" className="rounded-lg bg-zinc-900 p-4">
      {/* Header */}
      <h3 className="text-lg font-semibold text-yellow-500">
        Stack Safety Check
      </h3>

      {/* Summary badges — conflict always shown; cautions/notes only when > 0; safe always shown */}
      <div className="mt-2 flex flex-wrap gap-2">
        {/* Red conflict badge — always rendered */}
        <span className="rounded-full border border-red-700/50 bg-red-900/30 px-3 py-1 text-xs font-medium text-red-400">
          {conflictCount} conflict{conflictCount !== 1 ? "s" : ""}
        </span>
        {/* Yellow caution badge — only when > 0 */}
        {cautionCount > 0 && (
          <span className="rounded-full border border-yellow-700/50 bg-yellow-900/30 px-3 py-1 text-xs font-medium text-yellow-400">
            {cautionCount} caution{cautionCount !== 1 ? "s" : ""}
          </span>
        )}
        {/* Blue note badge — only when > 0 */}
        {noteCount > 0 && (
          <span className="rounded-full border border-blue-700/50 bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-400">
            {noteCount} note{noteCount !== 1 ? "s" : ""}
          </span>
        )}
        {/* Green safe badge — always rendered */}
        <span className="rounded-full border border-green-700/50 bg-green-900/30 px-3 py-1 text-xs font-medium text-green-400">
          {safeCount} safe
        </span>
      </div>

      {/* Interaction cards */}
      <div className="mt-4 space-y-2">
        {!hasInteractions && (
          /* All-clear state — visible to all plans */
          <div className="rounded-lg border-l-4 border-l-green-500 bg-green-900/20 px-4 py-3">
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

        {hasInteractions && userIsUltimate &&
          matchingInteractions.map((interaction) => (
            <div
              key={interaction.id}
              className={`rounded-lg px-4 py-3 ${CARD_STYLE[interaction.severity]}`}
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

        {/* Non-Ultimate: locked overlay card when interactions exist */}
        {hasInteractions && !userIsUltimate && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800 p-6 text-center">
            <p className="text-2xl">🔒</p>
            <p className="mt-2 text-sm font-semibold text-white">
              Full Interaction Details
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {conflictCount + cautionCount + noteCount} interaction{conflictCount + cautionCount + noteCount !== 1 ? "s" : ""} detected. Upgrade to Ultimate to see full details and timing guidance.
            </p>
            <a
              href="/pricing"
              className="mt-4 inline-block rounded-md bg-yellow-600 px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500"
            >
              Upgrade to Ultimate
            </a>
            <p className="mt-3 text-xs text-zinc-500">Available in the Ultimate Protocol</p>
          </div>
        )}

        {/* Partial clear: green card after flagged interactions (Ultimate only) */}
        {hasInteractions && userIsUltimate && (
          <div className="rounded-lg border-l-4 border-l-green-500 bg-green-900/20 px-4 py-3">
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
