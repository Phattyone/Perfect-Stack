/*
  ============================================================
  SUPABASE MIGRATION — run once in the SQL editor before use
  ============================================================

  CREATE TABLE IF NOT EXISTS public.meal_maker_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    day_number INTEGER NOT NULL,
    week_number INTEGER NOT NULL,
    week_phase TEXT NOT NULL,
    day_theme TEXT NOT NULL,
    breakfast_id INTEGER NOT NULL,
    lunch_id INTEGER NOT NULL,
    dinner_id INTEGER NOT NULL,
    drink_id INTEGER,
    smoothie_id INTEGER,
    breakfast_swapped BOOLEAN DEFAULT false,
    lunch_swapped BOOLEAN DEFAULT false,
    dinner_swapped BOOLEAN DEFAULT false,
    drink_swapped BOOLEAN DEFAULT false,
    smoothie_swapped BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, day_number)
  );

  ALTER TABLE public.meal_maker_log ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can manage their own meal maker log"
  ON public.meal_maker_log FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

  ============================================================
*/

"use server";

import { createClient } from "@/lib/supabase/server";
import { isFoundation, isUltimate } from "@/lib/subscription";
import {
  getDayTheme,
  getWeekNumber,
  getWeekPhase,
  selectRecipe,
  MEAL_IDS,
  DRINK_IDS,
  SMOOTHIE_IDS,
  WEEK_PHASE_TAGS,
} from "@/lib/data/meal-maker";

export interface MealMakerRow {
  id: string;
  user_id: string;
  day_number: number;
  week_number: number;
  week_phase: string;
  day_theme: string;
  breakfast_id: number;
  lunch_id: number;
  dinner_id: number;
  drink_id: number | null;
  smoothie_id: number | null;
  breakfast_swapped: boolean;
  lunch_swapped: boolean;
  dinner_swapped: boolean;
  drink_swapped: boolean;
  smoothie_swapped: boolean;
  created_at: string;
}

type RecentRow = Pick<
  MealMakerRow,
  "breakfast_id" | "lunch_id" | "dinner_id" | "drink_id" | "smoothie_id"
>;

// Starter plan recipe IDs to seed "recently used" so the first generated
// days don't immediately repeat what the user just ate in Days 1-7.
const STARTER_MEAL_SEED  = [16, 18, 19, 20, 21, 22, 23, 24, 25, 26];
const STARTER_DRINK_SEED = [1, 9, 10, 11, 12, 13];

export async function getMealMakerLog(
  userId: string
): Promise<{ data: MealMakerRow[]; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("meal_maker_log")
      .select("*")
      .eq("user_id", userId)
      .order("day_number", { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: (data ?? []) as MealMakerRow[], error: null };
  } catch (err) {
    return { data: [], error: String(err) };
  }
}

export async function generateDay(
  userId: string,
  dayNumber: number,
  subscriptionStatus: string
): Promise<{ data: MealMakerRow | null; error: string | null }> {
  if (!isFoundation(subscriptionStatus)) {
    return { data: null, error: "Meal Maker requires a Foundation plan or higher." };
  }
  if (!isUltimate(subscriptionStatus) && dayNumber > 14) {
    return { data: null, error: "Foundation plan includes Days 8-14. Upgrade to Ultimate for the full program." };
  }
  if (dayNumber < 8 || dayNumber > 56) {
    return { data: null, error: "Invalid day number." };
  }

  try {
    const supabase = await createClient();

    // Return existing row if this day was already generated
    const { data: existing } = await supabase
      .from("meal_maker_log")
      .select("*")
      .eq("user_id", userId)
      .eq("day_number", dayNumber)
      .maybeSingle();

    if (existing) return { data: existing as MealMakerRow, error: null };

    // Build used-ID pools from last 7 generated days
    const { data: recent } = await supabase
      .from("meal_maker_log")
      .select("breakfast_id, lunch_id, dinner_id, drink_id, smoothie_id")
      .eq("user_id", userId)
      .order("day_number", { ascending: false })
      .limit(7);

    const recentRows: RecentRow[] = (recent ?? []) as RecentRow[];

    const usedMealBase = [
      ...STARTER_MEAL_SEED,
      ...recentRows.flatMap((r) => [r.breakfast_id, r.lunch_id, r.dinner_id]),
    ];
    const usedDrinkBase = [
      ...STARTER_DRINK_SEED,
      ...recentRows.filter((r) => r.drink_id != null).map((r) => r.drink_id!),
    ];
    const usedSmoothieBase = [
      ...STARTER_DRINK_SEED,
      ...recentRows.filter((r) => r.smoothie_id != null).map((r) => r.smoothie_id!),
    ];

    const theme    = getDayTheme(dayNumber);
    const weekPhase = getWeekPhase(dayNumber);
    const weekNum  = getWeekNumber(dayNumber);
    const wpTags   = WEEK_PHASE_TAGS[weekPhase] ?? [];

    // Select each meal, excluding already-chosen recipes within the same day
    const breakfast_id = selectRecipe(MEAL_IDS, theme.tags, wpTags, usedMealBase);
    const lunch_id     = selectRecipe(MEAL_IDS, theme.tags, wpTags, [...usedMealBase, breakfast_id]);
    const dinner_id    = selectRecipe(MEAL_IDS, theme.tags, wpTags, [...usedMealBase, breakfast_id, lunch_id]);
    const drink_id     = selectRecipe(DRINK_IDS,   theme.tags, wpTags, usedDrinkBase);
    const smoothie_id  = selectRecipe(SMOOTHIE_IDS, theme.tags, wpTags, usedSmoothieBase);

    const { data: inserted, error: insertError } = await supabase
      .from("meal_maker_log")
      .insert({
        user_id: userId,
        day_number: dayNumber,
        week_number: weekNum,
        week_phase: weekPhase,
        day_theme: theme.name,
        breakfast_id,
        lunch_id,
        dinner_id,
        drink_id,
        smoothie_id,
      })
      .select("*")
      .single();

    if (insertError) return { data: null, error: insertError.message };
    return { data: inserted as MealMakerRow, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

export type MealType = "breakfast" | "lunch" | "dinner" | "drink" | "smoothie";

export async function swapMeal(
  userId: string,
  dayNumber: number,
  mealType: MealType
): Promise<{ data: MealMakerRow | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const { data: current } = await supabase
      .from("meal_maker_log")
      .select("*")
      .eq("user_id", userId)
      .eq("day_number", dayNumber)
      .maybeSingle();

    if (!current) return { data: null, error: "Day not found." };

    const row = current as MealMakerRow;
    const swappedKey = `${mealType}_swapped` as keyof MealMakerRow;
    if (row[swappedKey]) {
      return { data: null, error: "Swap already used for this meal." };
    }

    const currentIdKey = `${mealType}_id` as keyof MealMakerRow;
    const currentRecipeId = row[currentIdKey] as number | null;

    // Build used-ID pools from last 7 days
    const { data: recent } = await supabase
      .from("meal_maker_log")
      .select("breakfast_id, lunch_id, dinner_id, drink_id, smoothie_id")
      .eq("user_id", userId)
      .order("day_number", { ascending: false })
      .limit(7);

    const recentRows: RecentRow[] = (recent ?? []) as RecentRow[];

    const theme    = getDayTheme(dayNumber);
    const weekPhase = getWeekPhase(dayNumber);
    const wpTags   = WEEK_PHASE_TAGS[weekPhase] ?? [];

    let pool: number[];
    let usedBase: number[];

    if (mealType === "breakfast" || mealType === "lunch" || mealType === "dinner") {
      pool = MEAL_IDS;
      usedBase = [
        ...STARTER_MEAL_SEED,
        ...recentRows.flatMap((r) => [r.breakfast_id, r.lunch_id, r.dinner_id]),
      ];
    } else if (mealType === "drink") {
      pool = DRINK_IDS;
      usedBase = [
        ...STARTER_DRINK_SEED,
        ...recentRows.filter((r) => r.drink_id != null).map((r) => r.drink_id!),
      ];
    } else {
      pool = SMOOTHIE_IDS;
      usedBase = [
        ...STARTER_DRINK_SEED,
        ...recentRows.filter((r) => r.smoothie_id != null).map((r) => r.smoothie_id!),
      ];
    }

    // Exclude the current recipe so we always get a different one
    const usedIds = currentRecipeId != null ? [...usedBase, currentRecipeId] : usedBase;
    const newRecipeId = selectRecipe(pool, theme.tags, wpTags, usedIds);

    const { data: updated, error: updateError } = await supabase
      .from("meal_maker_log")
      .update({
        [`${mealType}_id`]: newRecipeId,
        [`${mealType}_swapped`]: true,
      })
      .eq("user_id", userId)
      .eq("day_number", dayNumber)
      .select("*")
      .single();

    if (updateError) return { data: null, error: updateError.message };
    return { data: updated as MealMakerRow, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}
