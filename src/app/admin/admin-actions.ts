"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function resetMealMakerLog(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin
    .from("meal_maker_log")
    .delete()
    .eq("user_id", userId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
