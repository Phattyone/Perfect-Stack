"use client";

import { useState } from "react";
import Link from "next/link";
import { MEAL_PLAN } from "@/lib/data/meal-plan";
import { RECIPES } from "@/lib/data/recipes";
import { isFree, FREE_MEAL_PLAN_DAYS } from "@/lib/subscription";

function InlineRecipe({ recipeId }: { recipeId: number | null }) {
  const [open, setOpen] = useState(false);
  if (!recipeId) return null;
  const recipe = RECIPES.find((r) => r.id === recipeId);
  if (!recipe) return null;

  return (
    <div>
      <button type="button" onClick={() => setOpen(!open)} className="text-[10px] text-yellow-600 hover:text-yellow-500">
        {open ? "Hide recipe" : "View recipe"}
      </button>
      {open && (
        <div className="mt-2 rounded-lg bg-zinc-800 p-4">
          <h5 className="mb-2 text-xs font-semibold text-zinc-300">Ingredients</h5>
          <ul className="mb-3 space-y-0.5">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="text-xs text-zinc-400">{ing.amount} {ing.unit} {ing.item}</li>
            ))}
          </ul>
          <h5 className="mb-2 text-xs font-semibold text-zinc-300">Instructions</h5>
          <ol className="list-inside list-decimal space-y-1">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="text-xs text-zinc-400">{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function MealRow({ label, name, recipeId }: { label: string; name: string; recipeId: number | null }) {
  return (
    <div className="py-1.5">
      <div className="flex items-start gap-3">
        <span className="w-20 shrink-0 text-xs font-medium text-zinc-500">{label}</span>
        <div>
          <span className="text-sm text-zinc-300">{name}</span>
          <InlineRecipe recipeId={recipeId} />
        </div>
      </div>
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
          <div key={day.dayNumber} className={`rounded-lg border border-zinc-800${isLocked ? " opacity-50" : ""}`}>
            {isLocked ? (
              <Link
                href="/pricing"
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <span className="text-sm font-bold text-yellow-600">Day {day.dayNumber}</span>
                  <span className="ml-2 text-sm text-zinc-400"> - {day.theme}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-yellow-500">🔒 Upgrade to unlock</span>
                </div>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setOpenDay(isOpen ? null : day.dayNumber)}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <div>
                  <span className="text-sm font-bold text-yellow-600">Day {day.dayNumber}</span>
                  <span className="ml-2 text-sm text-zinc-400"> - {day.theme}</span>
                </div>
                <svg className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}

            {isOpen && !isLocked && (
              <div className="border-t border-zinc-800 px-4 py-3">
                <MealRow label="Breakfast" name={day.breakfast.name} recipeId={day.breakfast.recipeId} />
                <MealRow label="Lunch" name={day.lunch.name} recipeId={day.lunch.recipeId} />
                <MealRow label="Dinner" name={day.dinner.name} recipeId={day.dinner.recipeId} />
                <MealRow label="Smoothie" name={day.smoothie.name} recipeId={day.smoothie.recipeId} />
                <MealRow label="Shot" name={day.shot.name} recipeId={day.shot.recipeId} />

                {day.notes && <p className="mt-2 text-xs italic text-zinc-500">{day.notes}</p>}

                <div className="mt-3 rounded border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-500">
                  <span className="font-medium text-yellow-600">Daily drinks:</span>{" "}
                  1 performance shot AM - infused water throughout day - green tea before noon
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
