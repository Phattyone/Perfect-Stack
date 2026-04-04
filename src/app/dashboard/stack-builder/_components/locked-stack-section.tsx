"use client";

import Link from "next/link";
import type { CalculatedSupplement } from "@/lib/stack-builder/types";
import { PROTOCOL_NAMES } from "@/lib/types/profile";

const STACK_INFO: Record<string, { name: string; description: string }> = {
  A: { name: "Stack A  -  Foundation", description: "Core vitamins, minerals, and essential cofactors" },
  B: { name: "Stack B  -  Testosterone Support", description: "Adaptogens and natural T-production compounds" },
  C: { name: "Stack C  -  Nitric Performance", description: "Blood flow, erection quality, and NO production" },
  D: { name: "Stack D  -  Libido Amplifier", description: "Sexual desire, energy, and mood enhancers" },
  E: { name: "Stack E  -  Full Performance", description: "Longevity, recovery, and advanced optimization" },
};

// Map stack letter to the minimum protocol that includes it
const STACK_TO_PROTOCOL: Record<string, string> = {
  B: "stack_ab",
  C: "stack_abc",
  D: "stack_abcd",
  E: "stack_abcde",
};

interface LockedStackSectionProps {
  stack: string;
  previewSupplements: CalculatedSupplement[];
}

export default function LockedStackSection({
  stack,
  previewSupplements,
}: LockedStackSectionProps) {
  const info = STACK_INFO[stack] ?? { name: `Stack ${stack}`, description: "" };
  const protocolKey = STACK_TO_PROTOCOL[stack] ?? "stack_abcde";
  const protocolName = PROTOCOL_NAMES[protocolKey] ?? "a higher protocol";

  return (
    <div className="relative overflow-hidden rounded-lg border border-zinc-800">
      {/* Header with lock icon */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 shrink-0 text-zinc-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <div>
            <h3 className="text-sm font-bold text-zinc-500">{info.name}</h3>
            <p className="text-xs text-zinc-600">{info.description}</p>
          </div>
        </div>
      </div>

      {/* Blurred real supplement content */}
      <div className="relative px-4 pb-4">
        <div className="space-y-2 opacity-40 blur-sm">
          {previewSupplements.map((supp) => (
            <div
              key={supp.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-white">
                    {supp.name}
                  </h4>
                  <p className="mt-0.5 text-xs text-zinc-400">
                    {supp.whatItSupports}
                  </p>
                </div>
                <span className="text-sm font-semibold text-zinc-500">
                  {supp.baseDose} {supp.unit}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-4">
                <span className="text-sm font-bold text-yellow-600">
                  {supp.baseDose} {supp.unit}
                </span>
                <span className="text-xs text-zinc-400">
                  {supp.dailyServings}x daily · {supp.bestTiming}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Light overlay + sharp upgrade banner */}
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/20">
          <Link
            href="/dashboard/profile"
            className="rounded-lg border border-yellow-600 bg-zinc-900/95 px-6 py-4 text-center shadow-lg shadow-black/30 backdrop-blur-none transition hover:border-yellow-500 hover:bg-zinc-800"
          >
            <span className="block text-sm font-bold text-yellow-600">
              Upgrade Your Stack
            </span>
            <span className="mt-1 block text-xs text-zinc-400">
              Unlock with the {protocolName}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
