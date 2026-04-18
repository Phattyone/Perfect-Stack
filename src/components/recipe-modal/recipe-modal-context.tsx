"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LOCKED_RECIPE_IDS } from "@/lib/data/locked-recipes";
import { isFree } from "@/lib/subscription";

interface RecipeModalContextType {
  activeRecipeId: number | null;
  openRecipe: (id: number) => void;
  closeRecipe: () => void;
}

const RecipeModalContext = createContext<RecipeModalContextType | null>(null);

export function RecipeModalProvider({
  children,
  subscriptionStatus,
}: {
  children: ReactNode;
  subscriptionStatus: string;
}) {
  const [activeRecipeId, setActiveRecipeId] = useState<number | null>(null);
  const router = useRouter();
  const userIsFree = isFree(subscriptionStatus);

  const openRecipe = useCallback(
    (id: number) => {
      if (userIsFree && LOCKED_RECIPE_IDS.includes(id)) {
        router.push("/pricing");
        return;
      }
      setActiveRecipeId(id);
    },
    [userIsFree, router]
  );

  const closeRecipe = useCallback(() => {
    setActiveRecipeId(null);
  }, []);

  return (
    <RecipeModalContext.Provider value={{ activeRecipeId, openRecipe, closeRecipe }}>
      {children}
    </RecipeModalContext.Provider>
  );
}

export function useRecipeModal() {
  const ctx = useContext(RecipeModalContext);
  if (!ctx) throw new Error("useRecipeModal must be used within RecipeModalProvider");
  return ctx;
}
