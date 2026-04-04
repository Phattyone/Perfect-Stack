"use client";

import { useState } from "react";
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
}

export default function StackSection({
  stack,
  supplements,
  isNitrateBlocked,
  onProductSelect,
}: StackSectionProps) {
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
          {supplements.map((supp) => (
            <SupplementCard
              key={supp.id}
              supplement={supp}
              onProductSelect={onProductSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
