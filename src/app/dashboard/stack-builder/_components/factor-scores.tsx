"use client";

import { useState } from "react";
import type { FactorScores } from "@/lib/stack-builder/types";

interface FactorScoresProps {
  factors: FactorScores;
}

const SCORE_META: Record<string, { summary: string; detail: string }> = {
  hormone: {
    summary: "Reflects testosterone optimization potential based on your age, training, and health status.",
    detail: "Your Hormone Factor reflects how well your age, training style, and health status support natural testosterone production. A score above 80% means your profile is well-positioned for hormone optimization. Your supplement doses in Stacks A and B are scaled to this score. To improve it: lift heavy 3x per week, optimize sleep, and reduce alcohol.",
  },
  noVascular: {
    summary: "Reflects blood flow and nitric oxide optimization. Affected by medications and PDE5 inhibitors.",
    detail: "Your Nitric Oxide and Vascular Factor measures blood flow optimization potential based on your profile and medications. This directly affects erection quality, workout performance, and cardiovascular health. If you are on a PDE5 inhibitor like Cialis or Viagra, doses in Stack C are automatically reduced for safety. A score of 0% means nitrate medication was detected and Stack C is excluded entirely.",
  },
  stressSleep: {
    summary: "Reflects cortisol management need based on your goal and health status.",
    detail: "Your Stress and Sleep Factor reflects how much your goal and health status indicate a need for cortisol management and sleep optimization. A higher score means your protocol emphasizes adaptogens like Ashwagandha and sleep-supporting supplements more heavily. Chronic stress and poor sleep are among the top suppressors of testosterone.",
  },
  overall: {
    summary: "Average of your three factors. Track improvement weekly in the Progress Tracker.",
    detail: "Your Overall Score is the average of your three factors. Think of it as your starting optimization baseline. As you follow the protocol, track your weekly scores in the Progress Tracker. Most men see meaningful improvement in 4-8 weeks. The protocol is calibrated to your current score and adjusts automatically when you update your profile.",
  },
};

function ScoreBar({
  label,
  value,
  infoKey,
  openKey,
  onToggle,
}: {
  label: string;
  value: number;
  infoKey: string;
  openKey: string | null;
  onToggle: (key: string) => void;
}) {
  const capped = Math.min(value, 130);
  const width = Math.round((capped / 130) * 100);
  const isOpen = openKey === infoKey;
  const meta = SCORE_META[infoKey];

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-zinc-300">
          {label}
          <button
            type="button"
            onClick={() => onToggle(infoKey)}
            className={`ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-xs font-bold leading-none transition ${
              isOpen
                ? "border-yellow-500 bg-yellow-500 text-zinc-950"
                : "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-zinc-950"
            }`}
            title="More info"
          >
            i
          </button>
        </span>
        <span className="text-sm font-semibold text-yellow-500">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-yellow-600 transition-all duration-500"
          style={{ width: `${width}%` }}
        />
      </div>
      {/* Static one-line summary - always visible */}
      <p className="mt-1 text-xs text-zinc-500">{meta.summary}</p>
      {/* Detailed explanation - toggled by info button */}
      {isOpen && (
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
          {meta.detail}
        </p>
      )}
    </div>
  );
}

export default function FactorScoresDisplay({ factors }: FactorScoresProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  function handleToggle(key: string) {
    setOpenKey((prev) => (prev === key ? null : key));
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Optimization Scores
      </h3>
      <div className="space-y-4">
        <ScoreBar label="Hormone Factor" value={factors.hormone} infoKey="hormone" openKey={openKey} onToggle={handleToggle} />
        <ScoreBar label="NO / Vascular Factor" value={factors.noVascular} infoKey="noVascular" openKey={openKey} onToggle={handleToggle} />
        <ScoreBar label="Stress / Sleep Factor" value={factors.stressSleep} infoKey="stressSleep" openKey={openKey} onToggle={handleToggle} />
        <div className="border-t border-zinc-800 pt-4">
          <ScoreBar label="Overall Score" value={factors.overall} infoKey="overall" openKey={openKey} onToggle={handleToggle} />
        </div>
      </div>
    </div>
  );
}
