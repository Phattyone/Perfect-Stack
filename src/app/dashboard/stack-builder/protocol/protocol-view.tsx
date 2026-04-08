"use client";

import type { ProfileFormData } from "@/lib/types/profile";
import type { StackResult, CalculatedSupplement } from "@/lib/stack-builder/types";

interface ProtocolViewProps {
  profile: ProfileFormData;
  result: StackResult;
}

const ALERT_COLOR: Record<string, string> = {
  "not-recommended": "text-red-400 print:text-red-700",
  caution: "text-orange-400 print:text-orange-700",
  "dose-reduced": "text-yellow-400 print:text-yellow-700",
  note: "text-blue-400 print:text-blue-700",
};

const STACK_NAMES: Record<string, string> = {
  A: "Stack A - Foundation",
  B: "Stack B - Testosterone Support",
  C: "Stack C - Nitric Performance",
  D: "Stack D - Libido Amplifier",
  E: "Stack E - Full Performance",
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm text-zinc-300 print:text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-yellow-500 print:text-gray-900">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800 print:bg-gray-200">
        <div className="h-full rounded-full bg-yellow-600 print:bg-gray-700" style={{ width: `${Math.min(value, 130) / 1.3}%` }} />
      </div>
    </div>
  );
}

function SupplementRow({ s }: { s: CalculatedSupplement }) {
  const product = s.products[0];
  const cost = s.calculatedDose === 0 ? 0 : Math.round(((product.price / product.servings) * s.dailyServings * 30) * 100) / 100;

  return (
    <div className={`rounded-lg border bg-zinc-900 p-4 print:bg-white print:border-gray-200 ${s.alertLevel === "not-recommended" ? "border-zinc-800 opacity-50" : "border-zinc-800"}`}>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white print:text-black">{s.name}</h4>
          <p className="text-xs text-zinc-500 print:text-gray-500">{s.whatItSupports}</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-yellow-500 print:text-gray-900">
            {s.calculatedDose === 0 ? "Excluded" : `${s.calculatedDose} ${s.unit}`}
          </span>
        </div>
      </div>

      {s.alertLevel !== "none" && s.alertMessage && (
        <p className={`mt-1 text-xs ${ALERT_COLOR[s.alertLevel] ?? "text-zinc-400"}`}>
          {s.alertMessage}
        </p>
      )}

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 print:text-gray-500">
        <span>{s.dailyServings}x daily</span>
        <span>{s.bestTiming}</span>
        {cost > 0 && <span>~${cost.toFixed(2)}/mo</span>}
      </div>

      {s.calculatedDose > 0 && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-zinc-500 print:text-gray-500">{product.name} - ${product.price}/{product.servings}ct</span>
          <a href={product.url} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-yellow-600 hover:text-yellow-500 print:text-gray-700 print:no-underline">
            Buy on Amazon
          </a>
        </div>
      )}
    </div>
  );
}

export default function ProtocolView({ profile, result }: ProtocolViewProps) {
  const included = result.supplements.filter((s) => s.included);
  const grouped: Record<string, CalculatedSupplement[]> = {};
  for (const s of included) {
    if (!grouped[s.stack]) grouped[s.stack] = [];
    grouped[s.stack].push(s);
  }

  const totalCost = included.reduce((sum, s) => {
    if (s.calculatedDose === 0) return sum;
    const p = s.products[0];
    return sum + (p.price / p.servings) * s.dailyServings * 30;
  }, 0);

  const medFlags: string[] = [];
  if (profile.nitrate_meds) medFlags.push("Nitrate Meds");
  if (profile.blood_thinners) medFlags.push("Blood Thinners");
  if (profile.trt_hrt) medFlags.push("TRT/HRT");
  if (profile.pde5_inhibitor !== "None") medFlags.push(profile.pde5_inhibitor);
  if (profile.bp_meds) medFlags.push("BP Meds");
  if (profile.alpha_blockers) medFlags.push("Alpha-Blockers");
  if (profile.diabetes_meds) medFlags.push("Diabetes Meds");
  if (profile.thyroid_meds) medFlags.push("Thyroid Meds");

  return (
    <div className="mt-6 space-y-6">
      {/* Profile summary */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 print:bg-white print:border-gray-200">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 print:text-gray-500">Profile</h3>
        <div className="flex flex-wrap gap-2">
          {[profile.age_group, profile.primary_goal, profile.training_style].map((item) => (
            <span key={item} className="rounded-full border border-yellow-600/40 bg-yellow-600/10 px-3 py-1 text-xs text-yellow-500 print:border-gray-300 print:bg-gray-100 print:text-gray-700">{item}</span>
          ))}
          {medFlags.map((flag) => (
            <span key={flag} className="rounded-full border border-orange-500/40 bg-orange-500/10 px-3 py-1 text-xs text-orange-400 print:border-gray-300 print:bg-gray-100 print:text-gray-700">{flag}</span>
          ))}
          {profile.health_status.map((hs: string) => (
            <span key={hs} className="rounded-full border border-yellow-600/40 bg-yellow-600/10 px-3 py-1 text-xs text-yellow-500 print:border-gray-300 print:bg-gray-100 print:text-gray-700">{hs}</span>
          ))}
        </div>

        {/* Medication alerts */}
        {profile.nitrate_meds && (
          <div className="mt-3 rounded-lg border border-red-500 bg-red-950 p-3 text-xs print:bg-red-50 print:border-red-300">
            <span className="font-bold text-red-400 print:text-red-700">Nitrate Medication Detected</span>
            <p className="mt-1 text-red-400/80 print:text-red-600">Stack C excluded. Nitrates + NO supplements can cause life-threatening BP drops.</p>
          </div>
        )}
        {profile.blood_thinners && (
          <div className="mt-3 rounded-lg border border-orange-500 bg-orange-950 p-3 text-xs print:bg-orange-50 print:border-orange-300">
            <span className="font-bold text-orange-400 print:text-orange-700">Blood Thinner Interaction</span>
            <p className="mt-1 text-orange-400/80 print:text-orange-600">K2, Omega-3, Quercetin, Resveratrol flagged. Consult prescriber.</p>
          </div>
        )}
        {profile.trt_hrt && (
          <div className="mt-3 rounded-lg border border-blue-500 bg-blue-950 p-3 text-xs print:bg-blue-50 print:border-blue-300">
            <span className="font-bold text-blue-400 print:text-blue-700">Hormone Therapy Active</span>
            <p className="mt-1 text-blue-400/80 print:text-blue-600">Tongkat Ali, Fadogia, DHEA adjusted. Ashwagandha cortisol benefits remain.</p>
          </div>
        )}
        {!profile.nitrate_meds && !profile.blood_thinners && !profile.trt_hrt && profile.pde5_inhibitor === "None" && (
          <div className="mt-3 rounded-lg border border-green-700 bg-green-950 p-3 text-xs print:bg-green-50 print:border-green-300">
            <span className="font-bold text-green-400 print:text-green-700">No Critical Interactions</span>
            <p className="mt-1 text-green-400/80 print:text-green-600">Protocol optimized for your goals and health status.</p>
          </div>
        )}
      </div>

      {/* Optimization scores */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 print:bg-white print:border-gray-200">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 print:text-gray-500">Optimization Scores</h3>
        <div className="space-y-3">
          <ScoreBar label="Hormone Factor" value={result.factors.hormone} />
          <ScoreBar label="NO / Vascular Factor" value={result.factors.noVascular} />
          <ScoreBar label="Stress / Sleep Factor" value={result.factors.stressSleep} />
          <div className="border-t border-zinc-800 pt-3 print:border-gray-200">
            <ScoreBar label="Overall Score" value={result.factors.overall} />
          </div>
        </div>
      </div>

      {/* Supplements by stack */}
      {(["A", "B", "C", "D", "E"] as const).map((stack) => {
        const supps = grouped[stack];
        if (!supps || supps.length === 0) return null;
        return (
          <div key={stack}>
            <h3 className="mb-3 text-sm font-bold text-yellow-600 print:text-gray-900">{STACK_NAMES[stack]}</h3>
            <div className="space-y-3">
              {supps.map((s) => <SupplementRow key={s.id} s={s} />)}
            </div>
          </div>
        );
      })}

      {/* Total cost */}
      <div className="rounded-lg border border-yellow-600/30 bg-zinc-900 p-4 text-center print:bg-white print:border-gray-300">
        <span className="text-xs uppercase tracking-wider text-zinc-500 print:text-gray-500">Estimated Monthly Cost</span>
        <span className="ml-3 text-xl font-bold text-yellow-500 print:text-gray-900">${totalCost.toFixed(2)}</span>
      </div>

      {/* Print button */}
      <button
        type="button"
        onClick={() => window.print()}
        className="w-full rounded-md bg-yellow-600 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-500 print:hidden"
      >
        Print Protocol
      </button>

      {/* Disclaimer */}
      <p className="text-center text-xs leading-relaxed text-zinc-600 print:text-gray-500">
        This protocol is based on your health profile and is for informational purposes only. Always consult a qualified physician before starting any supplement protocol.
      </p>
    </div>
  );
}
