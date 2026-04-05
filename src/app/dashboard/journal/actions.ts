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
  photo_paths: string[]; // storage paths, not full URLs
}

export async function saveJournalEntry(
  userId: string,
  data: JournalEntryData
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();

  // Save journal entry
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
      photo_urls: data.photo_paths, // column name is photo_urls, stores paths
    },
    { onConflict: "user_id,week_number" }
  );

  if (error) return { error: error.message };

  // Sync scores to weekly_entries (Progress Tracker)
  await supabase.from("weekly_entries").upsert(
    {
      user_id: userId,
      week_number: data.week_number,
      entry_date: data.entry_date,
      energy_score: data.energy_score,
      libido_score: data.libido_score,
      erection_quality_score: data.erection_quality_score,
      sleep_quality_score: data.sleep_quality_score,
      mood_score: data.mood_score,
      strength_recovery_score: data.workout_performance_score,
      weight_lbs: data.weight_lbs,
      waist_inches: data.waist_inches,
    },
    { onConflict: "user_id,week_number" }
  );

  return { success: true };
}

export async function getJournalEntries(userId: string): Promise<JournalEntryData[]> {
  const supabase = await createClient();

  // Fetch journal entries and weekly entries
  const [journalResult, weeklyResult] = await Promise.all([
    supabase.from("journal_entries").select("*").eq("user_id", userId).order("week_number"),
    supabase.from("weekly_entries").select("*").eq("user_id", userId).order("week_number"),
  ]);

  const journalRows = journalResult.data ?? [];
  const weeklyRows = weeklyResult.data ?? [];
  const weeklyMap = new Map(weeklyRows.map((r) => [r.week_number, r]));

  // Merge: journal entries take priority, but fill in scores from weekly if journal is missing
  const journalMap = new Map(journalRows.map((r) => [r.week_number, r]));

  // Also add weeks that only exist in weekly_entries
  for (const wr of weeklyRows) {
    if (!journalMap.has(wr.week_number)) {
      journalMap.set(wr.week_number, null); // marker for weekly-only
    }
  }

  const entries: JournalEntryData[] = [];

  for (const [weekNum] of journalMap) {
    const jr = journalRows.find((r) => r.week_number === weekNum);
    const wr = weeklyMap.get(weekNum);

    entries.push({
      week_number: weekNum,
      entry_date: jr?.entry_date ?? wr?.entry_date ?? new Date().toISOString().split("T")[0],
      energy_score: jr?.energy_score ?? wr?.energy_score ?? 5,
      libido_score: jr?.libido_score ?? wr?.libido_score ?? 5,
      erection_quality_score: jr?.erection_quality_score ?? wr?.erection_quality_score ?? 5,
      sleep_quality_score: jr?.sleep_quality_score ?? wr?.sleep_quality_score ?? 5,
      mood_score: jr?.mood_score ?? wr?.mood_score ?? 5,
      workout_performance_score: jr?.workout_performance_score ?? wr?.strength_recovery_score ?? 5,
      wins_this_week: jr?.wins_this_week ?? "",
      challenges: jr?.challenges ?? "",
      body_energy_notes: jr?.body_energy_notes ?? "",
      sex_drive_notes: jr?.sex_drive_notes ?? "",
      supplements_consistent: jr?.supplements_consistent ?? "",
      meals_diet_notes: jr?.meals_diet_notes ?? "",
      training_done: jr?.training_done ?? "",
      sleep_details: jr?.sleep_details ?? "",
      weight_lbs: jr?.weight_lbs ?? wr?.weight_lbs ?? null,
      waist_inches: jr?.waist_inches ?? wr?.waist_inches ?? null,
      body_fat_percent: jr?.body_fat_percent ?? null,
      bench_press_max: jr?.bench_press_max ?? null,
      squat_max: jr?.squat_max ?? null,
      free_reflection: jr?.free_reflection ?? "",
      photo_paths: jr?.photo_urls ?? [],
    });
  }

  return entries.sort((a, b) => a.week_number - b.week_number);
}

export async function getSignedPhotoUrls(
  paths: string[]
): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  const supabase = await createClient();
  const result: Record<string, string> = {};

  for (const path of paths) {
    const { data } = await supabase.storage
      .from("journal-photos")
      .createSignedUrl(path, 3600);
    if (data?.signedUrl) {
      result[path] = data.signedUrl;
    }
  }

  return result;
}

export async function uploadJournalPhoto(
  formData: FormData
): Promise<{ path: string } | { error: string }> {
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

  return { path }; // return storage path, not URL
}

export async function deleteJournalPhoto(
  storagePath: string,
  userId: string
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();

  if (!storagePath.startsWith(userId)) return { error: "Unauthorized" };

  const { error } = await supabase.storage
    .from("journal-photos")
    .remove([storagePath]);

  if (error) return { error: error.message };
  return { success: true };
}
