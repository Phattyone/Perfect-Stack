"use server";

import { createClient } from "@/lib/supabase/server";

export interface JournalEntryData {
  week_number: number;
  entry_date: string;
  energy_score: number;
  libido_score: number;
  erection_quality_score: number;
  sleep_quality_score: number;
  mood_score: number;
  workout_performance_score: number;
  wins_this_week: string;
  challenges: string;
  body_energy_notes: string;
  sex_drive_notes: string;
  supplements_consistent: string;
  meals_diet_notes: string;
  training_done: string;
  sleep_details: string;
  weight_lbs: number | null;
  waist_inches: number | null;
  body_fat_percent: number | null;
  bench_press_max: number | null;
  squat_max: number | null;
  free_reflection: string;
  photo_urls: string[];
}

export async function saveJournalEntry(
  userId: string,
  data: JournalEntryData
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();

  const { error } = await supabase.from("journal_entries").upsert(
    {
      user_id: userId,
      week_number: data.week_number,
      entry_date: data.entry_date,
      energy_score: data.energy_score,
      libido_score: data.libido_score,
      erection_quality_score: data.erection_quality_score,
      sleep_quality_score: data.sleep_quality_score,
      mood_score: data.mood_score,
      workout_performance_score: data.workout_performance_score,
      wins_this_week: data.wins_this_week || null,
      challenges: data.challenges || null,
      body_energy_notes: data.body_energy_notes || null,
      sex_drive_notes: data.sex_drive_notes || null,
      supplements_consistent: data.supplements_consistent || null,
      meals_diet_notes: data.meals_diet_notes || null,
      training_done: data.training_done || null,
      sleep_details: data.sleep_details || null,
      weight_lbs: data.weight_lbs,
      waist_inches: data.waist_inches,
      body_fat_percent: data.body_fat_percent,
      bench_press_max: data.bench_press_max,
      squat_max: data.squat_max,
      free_reflection: data.free_reflection || null,
      photo_urls: data.photo_urls,
    },
    { onConflict: "user_id,week_number" }
  );

  if (error) return { error: error.message };
  return { success: true };
}

export async function getJournalEntries(userId: string): Promise<JournalEntryData[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("week_number", { ascending: true });

  return (data ?? []).map((row) => ({
    week_number: row.week_number,
    entry_date: row.entry_date,
    energy_score: row.energy_score ?? 5,
    libido_score: row.libido_score ?? 5,
    erection_quality_score: row.erection_quality_score ?? 5,
    sleep_quality_score: row.sleep_quality_score ?? 5,
    mood_score: row.mood_score ?? 5,
    workout_performance_score: row.workout_performance_score ?? 5,
    wins_this_week: row.wins_this_week ?? "",
    challenges: row.challenges ?? "",
    body_energy_notes: row.body_energy_notes ?? "",
    sex_drive_notes: row.sex_drive_notes ?? "",
    supplements_consistent: row.supplements_consistent ?? "",
    meals_diet_notes: row.meals_diet_notes ?? "",
    training_done: row.training_done ?? "",
    sleep_details: row.sleep_details ?? "",
    weight_lbs: row.weight_lbs,
    waist_inches: row.waist_inches,
    body_fat_percent: row.body_fat_percent,
    bench_press_max: row.bench_press_max,
    squat_max: row.squat_max,
    free_reflection: row.free_reflection ?? "",
    photo_urls: row.photo_urls ?? [],
  }));
}

export async function uploadJournalPhoto(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;
  const weekNumber = formData.get("weekNumber") as string;

  if (!file || !userId || !weekNumber) {
    return { error: "Missing required fields" };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}.${ext}`;
  const path = `${userId}/week-${weekNumber}/${filename}`;

  const { error } = await supabase.storage
    .from("journal-photos")
    .upload(path, file);

  if (error) return { error: error.message };

  const { data: urlData } = supabase.storage
    .from("journal-photos")
    .getPublicUrl(path);

  return { url: urlData.publicUrl };
}

export async function deleteJournalPhoto(
  url: string,
  userId: string
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();

  // Extract path from URL
  const match = url.match(/journal-photos\/(.+)/);
  if (!match) return { error: "Invalid photo URL" };

  const path = match[1];
  if (!path.startsWith(userId)) return { error: "Unauthorized" };

  const { error } = await supabase.storage
    .from("journal-photos")
    .remove([path]);

  if (error) return { error: error.message };
  return { success: true };
}
