"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileFormData } from "@/lib/types/profile";

export async function saveProfile(
  userId: string,
  data: ProfileFormData
): Promise<{ error: string } | void> {
  const supabase = await createClient();

  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    age_group: data.age_group,
    primary_goal: data.primary_goal,
    training_style: data.training_style,
    health_status: data.health_status,
    pde5_inhibitor: data.pde5_inhibitor,
    pde5_dose: data.pde5_inhibitor !== "None" ? data.pde5_dose : null,
    pde5_frequency: data.pde5_inhibitor !== "None" ? data.pde5_frequency : null,
    bp_meds: data.bp_meds,
    nitrate_meds: data.nitrate_meds,
    alpha_blockers: data.alpha_blockers,
    diabetes_meds: data.diabetes_meds,
    trt_hrt: data.trt_hrt,
    thyroid_meds: data.thyroid_meds,
    blood_thinners: data.blood_thinners,
    other_ed_meds: data.other_ed_meds,
    stack_selection: data.stack_selection,
    nitrate_warning_acknowledged: data.nitrate_warning_acknowledged,
    blood_thinner_warning_acknowledged: data.blood_thinner_warning_acknowledged,
    trt_warning_acknowledged: data.trt_warning_acknowledged,
    pde5_warning_acknowledged: data.pde5_warning_acknowledged,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
