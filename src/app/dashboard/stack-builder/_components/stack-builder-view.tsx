"use client";

import { useState, useMemo } from "react";
import type { ProfileFormData } from "@/lib/types/profile";
import type { StackResult } from "@/lib/stack-builder/types";
import Link from "next/link";
import ProfileSummary from "./profile-summary";
import FactorScoresDisplay from "./factor-scores";
import StackSection from "./stack-section";
import LockedStackSection from "./locked-stack-section";

interface StackBuilderViewProps {
  profile: ProfileFormData;
  result: StackResult;
}

const STACK_ORDER = ["A", "B", "C", "D", "E"] as const;

// Map stack_selection values to the set of included stack letters.
// This avoids the substring bug where "stack_a".includes("c") matched
// the "c" in the word "stack".
const STACK_MAP: Record<string, Set<string>> = {
  stack_a: new Set(["A"]),
  stack_ab: new Set(["A", "B"]),
  stack_abc: new Set(["A", "B", "C"]),
  stack_abcd: new Set(["A", "B", "C", "D"]),
  stack_abcde: new Set(["A", "B", "C", "D", "E"]),
};

export default function StackBuilderView({
  profile,
  result,
}: StackBuilderViewProps) {
  // Product selection state: { [supplementId]: productIndex }
  const [selectedProducts, setSelectedProducts] = useState<
    Record<number, number>
  >(() => {
    const init: Record<number, number> = {};
    result.supplements.forEach((s) => {
      init[s.id] = 0;
    });
    return init;
  });

  function handleProductSelect(supplementId: number, productIndex: number) {
    setSelectedProducts((prev) => ({ ...prev, [supplementId]: productIndex }));
  }

  // Supplements with current product selection applied
  const supplements = useMemo(
    () =>
      result.supplements.map((s) => ({
        ...s,
        selectedProductIndex: selectedProducts[s.id] ?? 0,
      })),
    [result.supplements, selectedProducts]
  );

  // Group by stack
  const groupedByStack = useMemo(() => {
    const groups: Record<string, typeof supplements> = {};
    for (const s of supplements) {
      if (!groups[s.stack]) groups[s.stack] = [];
      groups[s.stack].push(s);
    }
    return groups;
  }, [supplements]);

  // Stacks the user actually selected (from their profile)
  const selectedStacks = useMemo(
    () => STACK_MAP[profile.stack_selection] ?? new Set(["A"]),
    [profile.stack_selection]
  );

  // Active stacks: selected AND not nitrate-blocked
  const activeStacks = useMemo(() => {
    const active = new Set(selectedStacks);
    if (profile.nitrate_meds) active.delete("C");
    return active;
  }, [selectedStacks, profile.nitrate_meds]);

  // Locked stacks: not selected by user (excludes nitrate-blocked C which gets special treatment)
  const lockedStacks = useMemo(() => {
    return STACK_ORDER.filter((s) => {
      if (selectedStacks.has(s)) return false;
      // Stack C for nitrate users is NOT locked  -  it shows the red contraindication banner
      if (s === "C" && profile.nitrate_meds) return false;
      return true;
    });
  }, [selectedStacks, profile.nitrate_meds]);

  // Nitrate-blocked Stack C: selected by user but blocked by nitrates
  const isNitrateBlockedC = useMemo(
    () => selectedStacks.has("C") && profile.nitrate_meds,
    [selectedStacks, profile.nitrate_meds]
  );

  // Total monthly cost
  const totalMonthlyCost = useMemo(() => {
    return supplements.reduce((sum, s) => {
      if (!s.included || s.calculatedDose === 0) return sum;
      const product = s.products[s.selectedProductIndex];
      const cost =
        (product.price / product.servings) * s.dailyServings * 30;
      return sum + cost;
    }, 0);
  }, [supplements]);

  return (
    <div className="pb-24">
      {/* Profile summary + factor scores */}
      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileSummary profile={profile} />
        <FactorScoresDisplay factors={result.factors} />
      </div>

      {/* Medical referral card  -  shown for TRT/HRT users or those on medications */}
      {(profile.trt_hrt || profile.pde5_inhibitor !== "None") && (
        <div className="mt-4 rounded-lg border-l-4 border-yellow-600 bg-zinc-900 p-4">
          <h4 className="text-sm font-bold text-white">
            <span className="mr-1">{"\uD83D\uDC68\u200D\u2695\uFE0F"}</span> Managing Hormones or Medications?
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-zinc-400">
            Your protocol has been adjusted for your medication profile. For
            personalized medical supervision of your hormone therapy or
            supplement protocol, consult a qualified men&apos;s health physician.
          </p>
          <Link
            href="/dashboard/medical-team"
            className="mt-2 inline-block text-xs font-medium text-yellow-600 hover:text-yellow-500"
          >
            Find a Provider →
          </Link>
        </div>
      )}

      {/* Active stack sections */}
      <div className="mt-6 space-y-4">
        {STACK_ORDER.filter((s) => activeStacks.has(s)).map((stack) => {
          const stackSupps = groupedByStack[stack] ?? [];
          if (stackSupps.length === 0) return null;

          return (
            <StackSection
              key={stack}
              stack={stack}
              supplements={stackSupps}
              isNitrateBlocked={false}
              onProductSelect={handleProductSelect}
            />
          );
        })}

        {/* Nitrate-blocked Stack C (selected but contraindicated) */}
        {isNitrateBlockedC && (groupedByStack["C"] ?? []).length > 0 && (
          <StackSection
            stack="C"
            supplements={groupedByStack["C"]}
            isNitrateBlocked={true}
            onProductSelect={handleProductSelect}
          />
        )}

        {/* Locked stack previews (not selected by user) */}
        {lockedStacks.map((stack) => {
          const stackSupps = groupedByStack[stack] ?? [];
          if (stackSupps.length === 0) return null;

          return (
            <LockedStackSection
              key={stack}
              stack={stack}
              previewSupplements={stackSupps.slice(0, 3)}
            />
          );
        })}
      </div>

      {/* Sticky bottom cost bar */}
      <div className="fixed inset-x-0 bottom-0 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div>
            <span className="text-xs text-zinc-500">Estimated Monthly Cost</span>
            <span className="ml-2 text-lg font-bold text-yellow-500">
              ${totalMonthlyCost.toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            className="rounded-md bg-yellow-600 px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500"
          >
            View My Full Protocol
          </button>
        </div>
      </div>
    </div>
  );
}
