"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveReminderPreferences(
  userId: string,
  preferences: Record<string, unknown>
): Promise<{ error: string } | { success: true }> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("reminder_settings")
    .upsert(
      {
        user_id: userId,
        preferences,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) return { error: error.message };
  return { success: true };
}

export async function getReminderPreferences(
  userId: string
): Promise<Record<string, unknown> | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reminder_settings")
    .select("preferences")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data.preferences as Record<string, unknown>;
}
