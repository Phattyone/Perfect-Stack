"use client";

import { useState } from "react";
import type { FactorScores } from "@/lib/stack-builder/types";

interface FactorScoresProps {
  factors: FactorScores;
}

const SCORE_INFO: Record<string, string> = {
  hormone:
    "Your Hormone Factor reflects how well your age, training style, and health status support natural testosterone production. A score above 80% means your profile is well-positioned for hormone optimization. Your supplement doses in Stacks A and B are scaled to this score. To improve it: lift heavy 3x per week, optimize sleep, and reduce alcohol.",
  noVascular:
    "Your Nitric Oxide and Vascular Factor measures blood flow optimization potential based on your profile and medications. This directly affects erection quality, workout performance, and cardiovascular health. If you are on a PDE5 inhibitor like Cialis or Viagra, doses in Stack C are automatically reduced for safety. A score of 0% means nitrate medication was detected and Stack C is excluded entirely.",
  stressSleep:
    "Your Stress and Sleep Factor reflects how much your goal and health status indicate a need for cortisol management and sleep optimization. A higher score means your protocol emphasizes adaptogens like Ashwagandha and sleep-supporting supplements more heavily. Chronic stress and poor sleep are among the top suppressors of testosterone.",
  overall:
    "Your Overall Score is the average of your three factors. Think of it as your starting optimization baseline. As you follow the protocol, track your weekly scores in the Progress Tracker. Most men see meaningful improvement in 4-8 weeks. The protocol is calibrated to your current score and adjusts automatically when you update your profile.",
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

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-zinc-300">
          {label}
          <button
            type="button"
            onClick={() => onToggle(infoKey)}
            className={`text-xs transition ${isOpen ? "text-yellow-500" : "text-zinc-600 hover:text-zinc-400"}`}
            title="What does this mean?"
          >
            &#9432;
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
      {isOpen && (
        <p className="mt-2 text-xs leading-relaxed text-zinc-400">
          {SCORE_INFO[infoKey]}
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
