"use client";

import type { FactorScores } from "@/lib/stack-builder/types";

interface FactorScoresProps {
  factors: FactorScores;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const capped = Math.min(value, 130); // max display
  const width = Math.round((capped / 130) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-zinc-300">{label}</span>
        <span className="text-sm font-semibold text-yellow-500">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-yellow-600 transition-all duration-500"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export default function FactorScoresDisplay({ factors }: FactorScoresProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Optimization Scores
      </h3>
      <div className="space-y-4">
        <ScoreBar label="Hormone Factor" value={factors.hormone} />
        <ScoreBar label="NO / Vascular Factor" value={factors.noVascular} />
        <ScoreBar label="Stress / Sleep Factor" value={factors.stressSleep} />
        <div className="border-t border-zinc-800 pt-4">
          <ScoreBar label="Overall Score" value={factors.overall} />
        </div>
      </div>
    </div>
  );
}
