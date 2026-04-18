import { RECIPES } from "./recipes";

export const WEEK_PHASES: Record<number, string> = {
  1: "Foundation & Detox",
  2: "Foundation & Detox",
  3: "Nitric Oxide Load",
  4: "Nitric Oxide Load",
  5: "Testosterone Support",
  6: "Testosterone Support",
  7: "Optimization & Habit Lock",
  8: "Optimization & Habit Lock",
};

export const DAY_THEMES = [
  { name: "Energize & Circulate",      tags: ["nitric-oxide", "vascular", "energy"] },
  { name: "Strengthen & Build",        tags: ["strengthen", "testosterone", "zinc"] },
  { name: "Anti-Inflammatory Reset",   tags: ["anti-inflammatory", "omega-3", "recovery"] },
  { name: "Testosterone Focus",        tags: ["testosterone", "zinc", "libido"] },
  { name: "Vascular Performance",      tags: ["vascular", "nitric-oxide", "omega-3"] },
  { name: "Longevity & Recovery",      tags: ["anti-inflammatory", "recovery", "omega-3"] },
  { name: "Full Protocol Day",         tags: ["testosterone", "nitric-oxide", "vascular", "zinc"] },
];

export const WEEK_PHASE_TAGS: Record<string, string[]> = {
  "Foundation & Detox":          ["anti-inflammatory", "testosterone", "nitric-oxide"],
  "Nitric Oxide Load":           ["nitric-oxide", "vascular", "omega-3"],
  "Testosterone Support":        ["testosterone", "zinc", "strengthen", "libido"],
  "Optimization & Habit Lock":   ["testosterone", "nitric-oxide", "vascular", "zinc", "anti-inflammatory"],
};

export const MEAL_IDS     = [16,17,18,19,20,21,22,23,24,25,26,31,32,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68];
export const SMOOTHIE_IDS = [1,2,3,4,5,6,7,8,38,39,40,41];
export const SHOT_IDS     = [9,10,11,12,13,33,34,35];
export const DRINK_IDS    = [14,15,27,28,29,30,36,37,42,43,44,45,46,47];

export function getWeekNumber(dayNumber: number): number {
  return Math.ceil(dayNumber / 7);
}

export function getDayTheme(dayNumber: number) {
  return DAY_THEMES[(dayNumber - 1) % 7];
}

export function getWeekPhase(dayNumber: number): string {
  const week = Math.min(getWeekNumber(dayNumber), 8);
  return WEEK_PHASES[week];
}

export function selectRecipe(
  pool: number[],
  themeTags: string[],
  weekPhaseTags: string[],
  usedIds: number[]
): number {
  let candidates = pool.filter((id) => !usedIds.includes(id));
  // If the entire pool is exhausted, reset and allow repeats
  if (candidates.length === 0) candidates = [...pool];

  const scored = candidates.map((id) => {
    const recipe = RECIPES.find((r) => r.id === id);
    const tags = recipe?.tags ?? [];
    let score = 0;
    for (const t of themeTags) if (tags.includes(t)) score += 2;
    for (const t of weekPhaseTags) if (tags.includes(t)) score += 1;
    return { id, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const maxScore = scored[0]?.score ?? 0;
  const topGroup = scored.filter((s) => s.score === maxScore);
  // Shuffle within the top-scoring group for variety
  topGroup.sort(() => Math.random() - 0.5);
  return topGroup[0].id;
}
