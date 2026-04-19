"use server";

import { createClient } from "@/lib/supabase/server";

export type CyclingSettings = Record<string, { startDate: string }>;

export async function getCyclingSettings(
  userId: string
): Promise<CyclingSettings | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("cycling_settings")
      .select("settings")
      .eq("user_id", userId)
      .single();

    if (data?.settings) {
      return data.settings as CyclingSettings;
    }
    return null;
  } catch {
    // Table may not exist yet — silently return null
    return null;
  }
}

export async function saveCyclingSettings(
  userId: string,
  settings: CyclingSettings
): Promise<{ error: string } | { success: true }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("cycling_settings")
      .upsert({ user_id: userId, settings }, { onConflict: "user_id" });

    if (error) throw error;
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save cycling settings";
    return { error: message };
  }
}
