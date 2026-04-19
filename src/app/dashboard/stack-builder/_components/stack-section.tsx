"use client";

import { useState } from "react";
import Link from "next/link";
import type { CalculatedSupplement } from "@/lib/stack-builder/types";
import SupplementCard from "./supplement-card";

const STACK_INFO: Record<string, { name: string; description: string }> = {
  A: { name: "Stack A  -  Foundation", description: "Core vitamins, minerals, and essential cofactors" },
  B: { name: "Stack B  -  Testosterone Support", description: "Adaptogens and natural T-production compounds" },
  C: { name: "Stack C  -  Nitric Performance", description: "Blood flow, erection quality, and NO production" },
  D: { name: "Stack D  -  Libido Amplifier", description: "Sexual desire, energy, and mood enhancers" },
  E: { name: "Stack E  -  Full Performance", description: "Longevity, recovery, and advanced optimization" },
};

interface StackSectionProps {
  stack: string;
  supplements: CalculatedSupplement[];
  isNitrateBlocked: boolean;
  onProductSelect: (supplementId: number, productIndex: number) => void;
  /** Number of trailing supplements to blur for free users (0 = none) */
  freeBlurCount?: number;
  /** Per-supplement interaction severity for dot indicators */
  interactionSeverities?: Record<number, "conflict" | "caution" | "note">;
}

export default function StackSection({
  stack,
  supplements,
  isNitrateBlocked,
  onProductSelect,
  freeBlurCount = 0,
  interactionSeverities,
}: StackSectionProps) {
  const blurStartIndex = freeBlurCount > 0
    ? Math.max(0, supplements.length - freeBlurCount)
    : supplements.length;
  const [open, setOpen] = useState(true);
  const info = STACK_INFO[stack] ?? { name: `Stack ${stack}`, description: "" };

  return (
    <div className="rounded-lg border border-zinc-800">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <h3 className="text-sm font-bold text-yellow-600">{info.name}</h3>
          <p className="text-xs text-zinc-500">{info.description}</p>
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Nitrate block banner */}
      {isNitrateBlocked && open && (
        <div className="mx-4 mb-3 rounded border border-red-500/40 bg-red-950 px-4 py-2 text-xs font-medium text-red-400">
          Stack C excluded  -  nitrate medication contraindication. All NO
          supplement doses set to zero.
        </div>
      )}

      {/* Cards */}
      {open && (
        <div className={`space-y-3 px-4 pb-4 ${isNitrateBlocked ? "opacity-40" : ""}`}>
          {/* Visible (unlocked) supplements */}
          {supplements.slice(0, blurStartIndex).map((supp) => (
            <SupplementCard
              key={supp.id}
              supplement={supp}
              onProductSelect={onProductSelect}
              interactionSeverity={interactionSeverities?.[supp.id] ?? null}
            />
          ))}
          {/* Blurred (locked) supplements for free users */}
          {supplements.slice(blurStartIndex).map((supp) => (
            <Link key={supp.id} href="/pricing" className="relative block">
              <div className="pointer-events-none select-none" style={{ filter: "blur(4px)" }}>
                <SupplementCard supplement={supp} onProductSelect={() => {}} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                <div className="rounded-lg bg-zinc-900/90 px-5 py-3 text-center shadow-lg ring-1 ring-yellow-600/30">
                  <span className="block text-lg leading-none">🔒</span>
                  <span className="mt-1 block text-xs font-medium text-yellow-400">Upgrade to unlock</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
