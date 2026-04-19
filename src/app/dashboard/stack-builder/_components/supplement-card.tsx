"use client";

import type { CalculatedSupplement } from "@/lib/stack-builder/types";

interface SupplementCardProps {
  supplement: CalculatedSupplement;
  onProductSelect: (supplementId: number, productIndex: number) => void;
  interactionSeverity?: "conflict" | "caution" | "note" | null;
}

const ALERT_STYLES: Record<
  string,
  { badge: string; text: string; label: string; border: string }
> = {
  "not-recommended": {
    badge: "bg-red-500/20 border-red-500/50 text-red-400",
    text: "text-red-400",
    label: "NOT RECOMMENDED",
    border: "border-red-500/40",
  },
  caution: {
    badge: "bg-orange-500/20 border-orange-500/50 text-orange-400",
    text: "text-orange-400",
    label: "CAUTION",
    border: "border-orange-500/40",
  },
  "dose-reduced": {
    badge: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
    text: "text-yellow-400",
    label: "DOSE REDUCED",
    border: "border-yellow-500/40",
  },
  note: {
    badge: "bg-blue-500/20 border-blue-500/50 text-blue-400",
    text: "text-blue-400",
    label: "NOTE",
    border: "border-zinc-800",
  },
};

const INTERACTION_DOT: Record<"conflict" | "caution" | "note", string> = {
  conflict: "bg-red-500",
  caution: "bg-amber-500",
  note: "bg-blue-500",
};

export default function SupplementCard({
  supplement: s,
  onProductSelect,
  interactionSeverity = null,
}: SupplementCardProps) {
  const alert = s.alertLevel !== "none" ? ALERT_STYLES[s.alertLevel] : null;
  const isExcluded = s.alertLevel === "not-recommended";
  const isDoseReduced = s.alertLevel === "dose-reduced";
  const selectedProduct = s.products[s.selectedProductIndex];
  const pd = s.productDosing?.[selectedProduct?.name ?? ""];
  const monthlyCost =
    s.calculatedDose === 0
      ? 0
      : Math.round(
          ((selectedProduct.price / selectedProduct.servings) *
            s.dailyServings *
            30) *
            100
        ) / 100;

  // Card border color changes with alert level
  const borderClass = alert ? alert.border : "border-zinc-800";

  return (
    <div
      className={`rounded-lg border bg-zinc-900 p-4 ${borderClass} ${
        isExcluded ? "opacity-50" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-white">{s.name}</h4>
          <p className="mt-0.5 text-xs text-zinc-100">{s.whatItSupports}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {alert && (
            <span
              className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${alert.badge}`}
            >
              {alert.label}
            </span>
          )}
          {interactionSeverity && (
            <button
              type="button"
              title="View interaction warning below"
              onClick={() =>
                document
                  .getElementById("stack-safety-check")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={`h-2 w-2 cursor-pointer rounded-full ${INTERACTION_DOT[interactionSeverity]} transition-opacity hover:opacity-75`}
            />
          )}
        </div>
      </div>

      {/* Alert message */}
      {alert && s.alertMessage && (
        <p className={`mt-2 text-xs leading-relaxed ${alert.text}`}>
          {s.alertMessage}
        </p>
      )}

      {/* Dose + timing */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        {isDoseReduced && s.calculatedDose !== s.baseDose ? (
          <span className="flex items-center gap-2">
            <span className="text-sm font-semibold text-yellow-500">
              {s.calculatedDose} {s.unit}
            </span>
            <span className="text-xs text-zinc-600 line-through">
              {s.baseDose} {s.unit}
            </span>
          </span>
        ) : (
          <span className="text-sm font-semibold text-yellow-500">
            {s.calculatedDose === 0
              ? "0"
              : pd
              ? `${pd.servingSize} ${pd.unit}`
              : `${s.calculatedDose} ${s.unit}`}
          </span>
        )}
        <span className="text-xs text-zinc-500">
          {pd ? pd.dailyServings : s.dailyServings}x daily · {pd ? pd.badgeTiming : s.bestTiming}
        </span>
      </div>

      {/* Timing icon + daily total */}
      {(() => {
        const TIMING_LABELS: Record<string, string> = {
          "☀️": "Morning",
          "🌙": "Evening",
          "☀️🌙": "Morning and Evening",
          "⚡": "Pre-activity",
          "☀️🌤️🌙": "Anytime",
          "🌤️": "Afternoon",
        };
        // Detect whether a dose adjustment (multivitamin or medication) is active
        const isAdjusted = s.alertLevel === "dose-reduced" || s.alertLevel === "not-recommended";
        if (pd) {
          // When an adjustment is active, derive daily total from the already-adjusted calculatedDose
          const displayDailyTotal = isAdjusted
            ? s.calculatedDose * s.dailyServings
            : pd.dailyTotal;
          return (
            <div className="mt-2 space-y-0.5">
              <p className="text-xs text-zinc-400">
                {pd.timingIcon} {pd.timing}
                {pd.withMeals ? " · Take with meals" : ""}
              </p>
              {s.calculatedDose > 0 && (
                <p className="text-xs font-medium text-yellow-500">
                  Daily total: {displayDailyTotal.toLocaleString()} {pd.unit}
                </p>
              )}
            </div>
          );
        }
        const icon = s.timingIcon ?? "";
        const label = TIMING_LABELS[icon] ?? "";
        // When an adjustment is active, use calculatedDose; otherwise baseDose
        const dailyTotal = s.calculatedDose * s.dailyServings;
        return (
          <div className="mt-2 space-y-0.5">
            {icon && (
              <p className="text-xs text-zinc-400">
                {icon} {label}
              </p>
            )}
            {s.calculatedDose > 0 && (
              <p className="text-xs font-medium text-yellow-500">
                Daily total: {dailyTotal.toLocaleString()} {s.unit}
              </p>
            )}
          </div>
        );
      })()}

      {/* Products */}
      {!isExcluded && (
        <>
          <div className="mt-3 flex flex-wrap gap-2">
            {s.products.map((product, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onProductSelect(s.id, i)}
                className={`rounded border px-2.5 py-1.5 text-left text-xs transition ${
                  i === s.selectedProductIndex
                    ? "border-yellow-600 bg-yellow-600/10 text-white"
                    : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                <span className="block font-medium">{product.name}</span>
                <span className="text-zinc-500">
                  ${product.price}/{product.servings}ct
                </span>
              </button>
            ))}
          </div>

          {/* Cost + link */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              ~${monthlyCost.toFixed(2)}/mo
            </span>
            <a
              href={selectedProduct.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-yellow-600 hover:text-yellow-500"
            >
              Buy on Amazon →
            </a>
          </div>
        </>
      )}
    </div>
  );
}
