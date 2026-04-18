"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { RECIPES, type Recipe, type RecipeCategory } from "@/lib/data/recipes";
import { isFree } from "@/lib/subscription";
import { LOCKED_RECIPE_IDS } from "@/lib/data/locked-recipes";
import { useRecipeModal } from "@/components/recipe-modal/recipe-modal-context";

const CATEGORIES: { key: RecipeCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "smoothie", label: "Smoothies" },
  { key: "shot", label: "Performance Shots" },
  { key: "meal", label: "Meals" },
  { key: "drink", label: "Drinks" },
];

const CATEGORY_BADGE: Record<RecipeCategory, string> = {
  smoothie: "bg-yellow-600/20 text-yellow-500 border-yellow-600/30",
  shot: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  meal: "bg-green-500/20 text-green-400 border-green-500/30",
  drink: "bg-teal-500/20 text-teal-400 border-teal-500/30",
};

function PhotoPlaceholder({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex h-[200px] w-full flex-col items-center justify-center bg-zinc-800">
      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${CATEGORY_BADGE[recipe.category]}`}>
        {recipe.category}
      </span>
      <span className="mt-2 px-4 text-center text-sm font-semibold text-yellow-600">
        {recipe.name}
      </span>
    </div>
  );
}

function RecipeCard({ recipe, locked }: { recipe: Recipe; locked?: boolean }) {
  const { openRecipe } = useRecipeModal();
  const [imgError, setImgError] = useState(false);
  const handleImgError = useCallback(() => setImgError(true), []);

  const card = (
    <div
      className={`overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 transition hover:border-yellow-600/40${!locked ? " cursor-pointer" : ""}`}
      onClick={!locked ? () => openRecipe(recipe.id) : undefined}
    >
      {/* Photo header */}
      {recipe.photoUrl && !imgError ? (
        <div className="relative h-[200px] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={recipe.photoUrl}
            alt={recipe.name}
            className="h-full w-full object-cover"
            onError={handleImgError}
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-900 to-transparent" />
        </div>
      ) : (
        <PhotoPlaceholder recipe={recipe} />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-white">{recipe.name}</h3>
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${CATEGORY_BADGE[recipe.category]}`}>
            {recipe.category}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-1">
          {recipe.tags.map((tag) => (
            <span key={tag} className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
              {tag}
            </span>
          ))}
        </div>

        {/* Meta */}
        <div className="mt-2 flex gap-3 text-xs text-zinc-500">
          <span>{recipe.prepTime} min</span>
          <span>{recipe.servings} serving{recipe.servings > 1 ? "s" : ""}</span>
        </div>

        {/* Benefits */}
        <p className="mt-2 text-xs italic text-yellow-500/80">{recipe.performanceBenefits}</p>
        <p className="mt-1 text-xs text-zinc-500">{recipe.bestTiming}</p>

        {/* View recipe — only shown on unlocked cards */}
        {!locked && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); openRecipe(recipe.id); }}
            className="mt-3 text-xs font-medium text-yellow-600 hover:text-yellow-500"
          >
            View recipe
          </button>
        )}
      </div>
    </div>
  );

  if (!locked) return card;

  return (
    <div className="relative">
      {/* Blurred card — non-interactive */}
      <div className="pointer-events-none select-none" style={{ filter: "blur(4px)" }}>
        {card}
      </div>
      {/* Clickable lock overlay */}
      <Link
        href="/pricing"
        className="pointer-events-auto absolute inset-0 flex items-center justify-center rounded-lg"
      >
        <div className="flex flex-col items-center gap-1.5 rounded-lg bg-zinc-900/90 px-6 py-4 shadow-lg ring-1 ring-yellow-600/30">
          <span className="text-2xl leading-none">🔒</span>
          <span className="text-xs font-medium text-yellow-400">Upgrade to unlock</span>
        </div>
      </Link>
    </div>
  );
}

export default function RecipesTab({ subscriptionStatus }: { subscriptionStatus: string }) {
  const userIsFree = isFree(subscriptionStatus);
  const [category, setCategory] = useState<RecipeCategory | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = RECIPES;
    if (category !== "all") list = list.filter((r) => r.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.tags.some((t) => t.includes(q))
      );
    }
    return list;
  }, [category, search]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setCategory(cat.key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              category === cat.key
                ? "border-yellow-600 bg-yellow-600 text-black"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search recipes or tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600"
      />

      {/* Recipe grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            locked={userIsFree && LOCKED_RECIPE_IDS.includes(recipe.id)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-8 text-center text-sm text-zinc-500">
            No recipes found.
          </p>
        )}
      </div>
    </div>
  );
}
