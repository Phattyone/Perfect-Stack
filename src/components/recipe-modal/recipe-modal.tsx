"use client";

import { useEffect, useState, useCallback } from "react";
import { useRecipeModal } from "./recipe-modal-context";
import { RECIPES } from "@/lib/data/recipes";
import type { RecipeCategory } from "@/lib/data/recipes";

const CATEGORY_BADGE: Record<RecipeCategory, string> = {
  smoothie: "bg-yellow-600/20 text-yellow-500 border-yellow-600/30",
  shot: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  meal: "bg-green-500/20 text-green-400 border-green-500/30",
  drink: "bg-teal-500/20 text-teal-400 border-teal-500/30",
};

export default function RecipeModal() {
  const { activeRecipeId, closeRecipe } = useRecipeModal();
  const [show, setShow] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Entrance animation — set show=true one double-rAF after mount so CSS transition fires
  useEffect(() => {
    if (activeRecipeId !== null) {
      const outer = requestAnimationFrame(() => {
        const inner = requestAnimationFrame(() => setShow(true));
        return () => cancelAnimationFrame(inner);
      });
      return () => cancelAnimationFrame(outer);
    } else {
      setShow(false);
      setImgError(false);
    }
  }, [activeRecipeId]);

  // Body scroll lock
  useEffect(() => {
    if (activeRecipeId !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeRecipeId]);

  // Escape key
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRecipe();
    },
    [closeRecipe]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (activeRecipeId === null) return null;

  const recipe = RECIPES.find((r) => r.id === activeRecipeId);
  if (!recipe) return null;

  const hasPhoto = !!recipe.photoUrl && !imgError;

  return (
    <>
      {/* Backdrop — clicking outside closes modal */}
      <div
        className="fixed inset-0 z-50 bg-black/70"
        style={{ opacity: show ? 1 : 0, transition: "opacity 200ms ease" }}
        onClick={closeRecipe}
      />

      {/* Modal panel */}
      <div
        className="fixed inset-4 z-[60] flex flex-col overflow-hidden rounded-2xl bg-zinc-900 md:inset-8 lg:inset-16"
        style={{
          opacity: show ? 1 : 0,
          transform: show ? "scale(1)" : "scale(0.97)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeRecipe}
          aria-label="Close recipe"
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/80 text-yellow-500 transition hover:text-yellow-400"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Photo header — fixed height, not scrollable */}
        <div className="relative h-52 shrink-0 overflow-hidden bg-zinc-800 sm:h-64">
          {hasPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={recipe.photoUrl}
              alt={recipe.name}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${CATEGORY_BADGE[recipe.category]}`}>
                {recipe.category}
              </span>
            </div>
          )}
          {/* Gradient + name overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pb-4 pt-10">
            <h2 className="text-xl font-bold leading-tight text-white drop-shadow">{recipe.name}</h2>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Meta pills */}
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs">
              <span className="font-medium text-yellow-500">{recipe.prepTime}</span>
              <span className="text-zinc-400">min</span>
            </span>
            <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs">
              <span className="font-medium text-yellow-500">{recipe.servings}</span>
              <span className="text-zinc-400">serving{recipe.servings > 1 ? "s" : ""}</span>
            </span>
            <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
              {recipe.bestTiming}
            </span>
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${CATEGORY_BADGE[recipe.category]}`}>
              {recipe.category}
            </span>
          </div>

          {/* Why it works */}
          {recipe.performanceBenefits && (
            <div className="mb-5 border-l-2 border-yellow-600/60 pl-4">
              <p className="text-sm italic leading-relaxed text-zinc-400">{recipe.performanceBenefits}</p>
            </div>
          )}

          {/* Ingredients */}
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white">Ingredients</h3>
          <ul className="mb-5 space-y-1.5">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex gap-2 text-sm text-zinc-200">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-600/70" />
                <span>
                  {ing.amount && `${ing.amount} `}
                  {ing.unit && `${ing.unit} `}
                  {ing.item}
                </span>
              </li>
            ))}
          </ul>

          {/* Instructions */}
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white">Instructions</h3>
          <ol className="mb-5 list-none space-y-2">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-yellow-600/20 text-xs font-bold text-yellow-500">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>

          {/* Amazon ingredients */}
          {recipe.amazonIngredients && recipe.amazonIngredients.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-white">Shop on Amazon</h3>
              <div className="flex flex-wrap gap-2">
                {recipe.amazonIngredients.map((ai) => (
                  <a
                    key={ai.item}
                    href={ai.searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded border border-zinc-700 px-2 py-1 text-[10px] text-yellow-600 transition hover:border-yellow-600"
                  >
                    {ai.item} →
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.tags.map((tag) => (
                <span key={tag} className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-500">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="h-6" />
        </div>
      </div>
    </>
  );
}
