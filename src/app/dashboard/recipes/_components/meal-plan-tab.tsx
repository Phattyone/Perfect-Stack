"use client";

import { useState } from "react";
import Link from "next/link";
import { MEAL_PLAN } from "@/lib/data/meal-plan";
import { isFree, FREE_MEAL_PLAN_DAYS } from "@/lib/subscription";
import { useRecipeModal } from "@/components/recipe-modal/recipe-modal-context";

function MealRow({
  label,
  name,
  recipeId,
  locked,
  subscriptionStatus,
  isFirst,
}: {
  label: string;
  name: string;
  recipeId: number | null;
  locked?: boolean;
  subscriptionStatus: string;
  isFirst?: boolean;
}) {
  const { openRecipe } = useRecipeModal();
  const userIsFree = isFree(subscriptionStatus);

  function RecipeButton() {
    if (!recipeId) return null;
    if (!userIsFree || isFirst) {
      return (
        <button
          type="button"
          onClick={() => openRecipe(recipeId)}
          className="mt-1 text-[10px] text-yellow-600 hover:text-yellow-500"
        >
          View recipe
        </button>
      );
    }
    return (
      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          disabled
          className="cursor-not-allowed text-[10px] text-yellow-600 opacity-50"
        >
          View recipe
        </button>
        <span className="text-xs text-yellow-400/70">Available in Foundation plan</span>
      </div>
    );
  }

  const inner = (
    <div className="py-1.5">
      <div className="flex items-start gap-3">
        <span className="w-20 shrink-0 text-xs font-medium text-zinc-500">{label}</span>
        <div className="flex flex-wrap items-center gap-x-1.5">
          <span className="text-sm text-zinc-300">{name}</span>
          {!locked && recipeId && <span className="text-xs text-zinc-600">-</span>}
          {!locked && <RecipeButton />}
        </div>
      </div>
    </div>
  );

  if (!locked) return inner;

  return (
    <div className="relative">
      {/* Blurred recipe row */}
      <div className="pointer-events-none select-none" style={{ filter: "blur(4px)" }}>
        {inner}
      </div>
      {/* Clickable lock overlay */}
      <Link
        href="/pricing"
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="flex items-center gap-1.5 rounded-md bg-zinc-900/90 px-3 py-1.5 shadow ring-1 ring-yellow-600/30">
          <span className="text-sm leading-none">🔒</span>
          <span className="text-xs font-medium text-yellow-400">Upgrade to unlock</span>
        </div>
      </Link>
    </div>
  );
}

interface MealPlanTabProps {
  subscriptionStatus: string;
}

export default function MealPlanTab({ subscriptionStatus }: MealPlanTabProps) {
  const [openDay, setOpenDay] = useState<number | null>(1);
  const userIsFree = isFree(subscriptionStatus);

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        This is your Week 1 template. Repeat or swap recipes as you move through the 8 weeks.
      </p>

      {MEAL_PLAN.map((day) => {
        const isOpen = openDay === day.dayNumber;
        const isLocked = userIsFree && day.dayNumber > FREE_MEAL_PLAN_DAYS;
        return (
          <div key={day.dayNumber} className="rounded-lg border border-zinc-800">
            {/* Day header */}
            <button
              type="button"
              onClick={() => setOpenDay(isOpen ? null : day.dayNumber)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <span className="text-sm font-bold text-yellow-600">Day {day.dayNumber}</span>
                <span className="ml-2 text-sm text-zinc-400"> - {day.theme}</span>
              </div>
              <div className="flex items-center gap-2">
                {isLocked && (
                  <span className="text-xs font-medium text-yellow-500">🔒</span>
                )}
                <svg
                  className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-zinc-800 px-4 py-3">
                <MealRow label="Breakfast" name={day.breakfast.name} recipeId={day.breakfast.recipeId} locked={isLocked} subscriptionStatus={subscriptionStatus} isFirst={day.dayNumber === 1} />
                <MealRow label="Lunch"     name={day.lunch.name}     recipeId={day.lunch.recipeId}     locked={isLocked} subscriptionStatus={subscriptionStatus} />
                <MealRow label="Dinner"    name={day.dinner.name}    recipeId={day.dinner.recipeId}    locked={isLocked} subscriptionStatus={subscriptionStatus} />
                <MealRow label="Smoothie"  name={day.smoothie.name}  recipeId={day.smoothie.recipeId}  locked={isLocked} subscriptionStatus={subscriptionStatus} />
                <MealRow label="Shot"      name={day.shot.name}      recipeId={day.shot.recipeId}      locked={isLocked} subscriptionStatus={subscriptionStatus} />

                {day.notes && !isLocked && (
                  <p className="mt-2 text-xs italic text-zinc-500">{day.notes}</p>
                )}

                <div className={`mt-3 rounded border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-500${isLocked ? " pointer-events-none select-none opacity-30" : ""}`}>
                  <span className="font-medium text-yellow-600">Daily drinks:</span>{" "}
                  1 performance shot AM - infused water throughout day - green tea before noon
                </div>

                {isLocked && (
                  <div className="mt-3 text-center">
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-600 px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500"
                    >
                      Upgrade to Foundation to unlock Day {day.dayNumber}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
