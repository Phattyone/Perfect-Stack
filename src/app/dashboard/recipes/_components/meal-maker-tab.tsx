"use client";

import { useState, useEffect, useCallback } from "react";
import { RECIPES } from "@/lib/data/recipes";
import { useRecipeModal } from "@/components/recipe-modal/recipe-modal-context";
import { isUltimate } from "@/lib/subscription";
import { getDayTheme, getWeekPhase, getWeekNumber } from "@/lib/data/meal-maker";
import {
  getMealMakerLog,
  generateDay,
  swapMeal,
  type MealMakerRow,
  type MealType,
} from "../meal-maker-actions";

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch:     "Lunch",
  dinner:    "Dinner",
  drink:     "Drink",
  smoothie:  "Smoothie",
};

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "drink", "smoothie"];

// ─── Recipe thumbnail ──────────────────────────────────────────────────────────

function RecipeThumbnail({ recipeId }: { recipeId: number | null }) {
  const [imgError, setImgError] = useState(false);
  const recipe = recipeId ? RECIPES.find((r) => r.id === recipeId) : null;

  if (!recipe) {
    return <div className="h-10 w-10 shrink-0 rounded bg-zinc-800" />;
  }
  if (recipe.photoUrl && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={recipe.photoUrl}
        alt={recipe.name}
        className="h-10 w-10 shrink-0 rounded object-cover"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-zinc-800 text-[9px] font-semibold text-zinc-500">
      {recipe.category.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ─── Spinner SVG ──────────────────────────────────────────────────────────────

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ─── Swap icon SVG ────────────────────────────────────────────────────────────

function SwapIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

// ─── Meal row ─────────────────────────────────────────────────────────────────

function MealRow({
  label,
  recipeId,
  swapped,
  swapping,
  onSwap,
}: {
  label: string;
  recipeId: number | null;
  swapped: boolean;
  swapping: boolean;
  onSwap: () => void;
}) {
  const { openRecipe } = useRecipeModal();
  const recipe = recipeId ? RECIPES.find((r) => r.id === recipeId) : null;

  return (
    <div className="flex items-center gap-3 py-2.5">
      <span className="w-20 shrink-0 text-xs font-medium text-zinc-500">{label}</span>
      <RecipeThumbnail recipeId={recipeId} />
      <div className="min-w-0 flex-1">
        {recipe ? (
          <button
            type="button"
            onClick={() => openRecipe(recipe.id)}
            className="block max-w-full truncate text-left text-sm text-zinc-200 hover:text-yellow-400 transition-colors duration-200"
          >
            {recipe.name}
          </button>
        ) : (
          <span className="text-sm text-zinc-500">No recipe</span>
        )}
      </div>
      <div className="shrink-0">
        {swapped ? (
          <span className="text-sm text-zinc-600" title="Already swapped">🔒</span>
        ) : (
          <button
            type="button"
            onClick={onSwap}
            disabled={swapping || !recipeId}
            title="Swap recipe"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 text-zinc-400 transition hover:border-yellow-600/50 hover:text-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {swapping ? <Spinner className="h-3.5 w-3.5" /> : <SwapIcon />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton loading card ────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg border border-zinc-800 bg-zinc-900">
      <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3">
        <div className="h-4 w-12 rounded bg-zinc-800" />
        <div className="h-4 w-44 rounded bg-zinc-800" />
        <div className="h-4 w-36 rounded bg-zinc-800" />
      </div>
      <div className="divide-y divide-zinc-800 px-4">
        {MEAL_TYPES.map((t) => (
          <div key={t} className="flex items-center gap-3 py-2.5">
            <div className="h-3 w-20 rounded bg-zinc-800" />
            <div className="h-10 w-10 rounded bg-zinc-800" />
            <div className="h-3 flex-1 rounded bg-zinc-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Day card ─────────────────────────────────────────────────────────────────

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function DayCard({
  row,
  swappingKey,
  onSwap,
  isExpanded,
  onToggle,
}: {
  row: MealMakerRow;
  swappingKey: string | null;
  onSwap: (dayNumber: number, mealType: MealType) => void;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const dateStr = new Date(row.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900">
      {/* Clickable header */}
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full flex-wrap items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-zinc-800/50 ${isExpanded ? "border-b border-zinc-800" : ""}`}
      >
        <span className="text-sm font-bold text-yellow-500">Day {row.day_number}</span>
        <span className="rounded-full bg-yellow-600/20 px-2.5 py-0.5 text-[10px] font-medium text-yellow-500">
          Week {row.week_number} - {row.week_phase}
        </span>
        <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] text-zinc-300">
          {row.day_theme}
        </span>
        <span className="text-[10px] text-zinc-600">{dateStr}</span>
        <span className="ml-auto">
          <ChevronIcon expanded={isExpanded} />
        </span>
      </button>

      {/* Meal rows — animated accordion */}
      <div
        className={`overflow-hidden transition-[max-height] duration-200 ease-in-out ${
          isExpanded ? "max-h-[600px]" : "max-h-0"
        }`}
      >
        <div className="divide-y divide-zinc-800 px-4">
          {MEAL_TYPES.map((type) => {
            const recipeId = row[`${type}_id` as keyof MealMakerRow] as number | null;
            const swapped  = row[`${type}_swapped` as keyof MealMakerRow] as boolean;
            return (
              <MealRow
                key={type}
                label={MEAL_LABELS[type]}
                recipeId={recipeId}
                swapped={swapped}
                swapping={swappingKey === `${row.day_number}-${type}`}
                onSwap={() => onSwap(row.day_number, type)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MealMakerTab({
  subscriptionStatus,
  userId,
}: {
  subscriptionStatus: string;
  userId: string;
}) {
  const [log, setLog] = useState<MealMakerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [swappingKey, setSwappingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const userIsUltimate = isUltimate(subscriptionStatus);
  const dayLimit = userIsUltimate ? 56 : 14;

  const nextDay = log.length > 0
    ? Math.max(...log.map((r) => r.day_number)) + 1
    : 8;

  const showUpgrade   = !userIsUltimate && nextDay > 14;
  const showCompleted = userIsUltimate && nextDay > 56;
  const canGenerate   = nextDay <= dayLimit;

  const nextTheme = getDayTheme(Math.min(nextDay, 56));
  const nextPhase = getWeekPhase(Math.min(nextDay, 56));
  const nextWeek  = getWeekNumber(Math.min(nextDay, 56));

  const fetchLog = useCallback(async () => {
    setLoading(true);
    const result = await getMealMakerLog(userId);
    if (result.error) setError(result.error);
    else setLog(result.data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    const result = await generateDay(userId, nextDay, subscriptionStatus);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setLog((prev) => [...prev, result.data!]);
      setExpandedDay(result.data.day_number);
    }
    setGenerating(false);
  };

  const handleSwap = async (dayNumber: number, mealType: MealType) => {
    const key = `${dayNumber}-${mealType}`;
    setSwappingKey(key);
    setError(null);
    const result = await swapMeal(userId, dayNumber, mealType);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setLog((prev) =>
        prev.map((row) => row.day_number === dayNumber ? result.data! : row)
      );
    }
    setSwappingKey(null);
  };

  const displayedLog = [...log].reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-yellow-500">Meal Maker</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Generate personalized daily meals for your remaining 2 to 8 weeks based on the Perfect Stack framework. Your meals are selected to match each week&apos;s performance phase and daily theme.
        </p>
      </div>

      {/* Foundation plan banner */}
      {!userIsUltimate && (
        <div className="rounded-lg border border-yellow-600/30 bg-yellow-600/10 px-4 py-3">
          <p className="text-sm text-yellow-400">
            <span className="font-semibold">Foundation plan</span> includes 7 generated days (Days 8-14).{" "}
            <a href="/pricing" className="underline hover:text-yellow-300">Upgrade to Ultimate</a>{" "}
            for the full 8-week meal generator.
          </p>
        </div>
      )}

      {/* Next-day generator card */}
      {!showCompleted && (
        <div className="rounded-lg border border-yellow-600/30 bg-zinc-900 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Next</p>
          <h3 className="mt-1 text-lg font-bold text-white">Generate Day {nextDay}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-yellow-600/20 px-3 py-1 text-xs font-medium text-yellow-500">
              Week {nextWeek} - {nextPhase}
            </span>
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
              {nextTheme.name}
            </span>
          </div>
          <div className="mt-4">
            {showUpgrade ? (
              <div className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-4 text-center">
                <p className="text-sm text-zinc-300">
                  You have used all 7 Foundation days (Days 8-14).
                </p>
                <a
                  href="/pricing"
                  className="mt-3 inline-block rounded-md bg-yellow-600 px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500"
                >
                  Upgrade to Ultimate to continue
                </a>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating || !canGenerate}
                className="flex items-center gap-2 rounded-lg bg-yellow-600 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generating && <Spinner className="h-4 w-4" />}
                Generate Day {nextDay}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Program completed */}
      {showCompleted && (
        <div className="rounded-lg border border-yellow-600/30 bg-yellow-600/10 px-5 py-6 text-center">
          <p className="text-2xl">🏆</p>
          <h3 className="mt-2 text-lg font-bold text-yellow-500">
            You have completed the full 8-week program!
          </h3>
          <p className="mt-1 text-sm text-zinc-400">
            Congratulations. You have generated all 56 days of your Perfect Stack meal plan. The protocols are now part of your daily habits.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Log */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : displayedLog.length === 0 ? (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-8 text-center">
          <p className="text-sm text-zinc-500">No meals generated yet. Start with Day 8 above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedLog.map((row) => (
            <DayCard
              key={row.id}
              row={row}
              swappingKey={swappingKey}
              onSwap={handleSwap}
              isExpanded={expandedDay === row.day_number}
              onToggle={() => setExpandedDay(expandedDay === row.day_number ? null : row.day_number)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
