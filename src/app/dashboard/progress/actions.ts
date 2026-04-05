"use server";

import { createClient } from "@/lib/supabase/server";
import type { BaselineData, WeeklyEntryData, ProgressData } from "@/lib/types/progress";

export async function saveBaseline(
  userId: string,
  data: BaselineData
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();

  const { error } = await supabase.from("baseline_checklists").upsert(
    {
      user_id: userId,
      recorded_at: data.recorded_at,
      weight_lbs: data.weight_lbs,
      waist_inches: data.waist_inches,
      hip_inches: data.hip_inches,
      neck_inches: data.neck_inches,
      energy_score: data.energy_score,
      libido_score: data.libido_score,
      erection_quality_score: data.erection_quality_score,
      sleep_quality_score: data.sleep_quality_score,
      mood_score: data.mood_score,
      strength_recovery_score: data.strength_recovery_score,
      sleep_hours: data.sleep_hours,
      alcohol_drinks_per_week: data.alcohol_drinks_per_week,
      training_days_per_week: data.training_days_per_week,
      training_type: data.training_type,
      current_medications: data.current_medications || null,
      current_supplements: data.current_supplements || null,
      notes: data.notes || null,
    },
    { onConflict: "user_id" }
  );

  if (error) return { error: error.message };
  return { success: true };
}

export async function saveWeeklyEntry(
  userId: string,
  data: WeeklyEntryData
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();

  const { error } = await supabase.from("weekly_entries").upsert(
    {
      user_id: userId,
      week_number: data.week_number,
      entry_date: data.entry_date,
      weight_lbs: data.weight_lbs,
      waist_inches: data.waist_inches,
      energy_score: data.energy_score,
      libido_score: data.libido_score,
      erection_quality_score: data.erection_quality_score,
      sleep_quality_score: data.sleep_quality_score,
      mood_score: data.mood_score,
      strength_recovery_score: data.strength_recovery_score,
      sleep_hours: data.sleep_hours,
      alcohol_drinks: data.alcohol_drinks,
      training_days: data.training_days,
      notes: data.notes || null,
    },
    { onConflict: "user_id,week_number" }
  );

  if (error) return { error: error.message };

  // Sync scores to journal_entries (Journal)
  // Only update score fields - leave text fields untouched if entry exists
  await supabase.from("journal_entries").upsert(
    {
      user_id: userId,
      week_number: data.week_number,
      entry_date: data.entry_date,
      energy_score: data.energy_score,
      libido_score: data.libido_score,
      erection_quality_score: data.erection_quality_score,
      sleep_quality_score: data.sleep_quality_score,
      mood_score: data.mood_score,
      workout_performance_score: data.strength_recovery_score,
      weight_lbs: data.weight_lbs,
      waist_inches: data.waist_inches,
    },
    { onConflict: "user_id,week_number" }
  );

  return { success: true };
}

export async function getProgressData(
  userId: string
): Promise<ProgressData> {
  const supabase = await createClient();

  const [baselineResult, weeklyResult] = await Promise.all([
    supabase
      .from("baseline_checklists")
      .select("*")
      .eq("user_id", userId)
      .single(),
    supabase
      .from("weekly_entries")
      .select("*")
      .eq("user_id", userId)
      .order("week_number", { ascending: true }),
  ]);

  const baseline: BaselineData | null = baselineResult.data
    ? {
        recorded_at: baselineResult.data.recorded_at,
        weight_lbs: baselineResult.data.weight_lbs,
        waist_inches: baselineResult.data.waist_inches,
        hip_inches: baselineResult.data.hip_inches,
        neck_inches: baselineResult.data.neck_inches,
        energy_score: baselineResult.data.energy_score,
        libido_score: baselineResult.data.libido_score,
        erection_quality_score: baselineResult.data.erection_quality_score,
        sleep_quality_score: baselineResult.data.sleep_quality_score,
        mood_score: baselineResult.data.mood_score,
        strength_recovery_score: baselineResult.data.strength_recovery_score,
        sleep_hours: baselineResult.data.sleep_hours,
        alcohol_drinks_per_week: baselineResult.data.alcohol_drinks_per_week,
        training_days_per_week: baselineResult.data.training_days_per_week,
        training_type: baselineResult.data.training_type,
        current_medications: baselineResult.data.current_medications ?? "",
        current_supplements: baselineResult.data.current_supplements ?? "",
        notes: baselineResult.data.notes ?? "",
      }
    : null;

  const weeklyEntries: WeeklyEntryData[] = (weeklyResult.data ?? []).map(
    (row) => ({
      week_number: row.week_number,
      entry_date: row.entry_date,
      weight_lbs: row.weight_lbs,
      waist_inches: row.waist_inches,
      energy_score: row.energy_score,
      libido_score: row.libido_score,
      erection_quality_score: row.erection_quality_score,
      sleep_quality_score: row.sleep_quality_score,
      mood_score: row.mood_score,
      strength_recovery_score: row.strength_recovery_score,
      sleep_hours: row.sleep_hours,
      alcohol_drinks: row.alcohol_drinks,
      training_days: row.training_days,
      notes: row.notes ?? "",
    })
  );

  return { baseline, weeklyEntries };
}
