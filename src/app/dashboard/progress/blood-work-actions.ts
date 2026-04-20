/*
  ============================================================
  SUPABASE MIGRATION — run once in the SQL editor before use
  ============================================================

  CREATE TABLE IF NOT EXISTS public.blood_work_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    label TEXT NOT NULL DEFAULT 'Blood Work Entry',
    -- Hormone Panel
    total_testosterone DECIMAL(8,2),
    free_testosterone DECIMAL(8,2),
    shbg DECIMAL(8,2),
    lh DECIMAL(8,2),
    fsh DECIMAL(8,2),
    estradiol DECIMAL(8,2),
    dhea_s DECIMAL(8,2),
    -- Metabolic and Cardiovascular
    psa DECIMAL(8,3),
    fasting_glucose DECIMAL(8,2),
    hba1c DECIMAL(5,2),
    total_cholesterol DECIMAL(8,2),
    hdl DECIMAL(8,2),
    ldl DECIMAL(8,2),
    triglycerides DECIMAL(8,2),
    hs_crp DECIMAL(8,3),
    -- Nutrient and Safety Markers
    vitamin_d DECIMAL(8,2),
    zinc DECIMAL(8,2),
    selenium DECIMAL(8,2),
    magnesium_rbc DECIMAL(8,2),
    -- General flags
    cbc_normal BOOLEAN,
    cmp_normal BOOLEAN,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );

  ALTER TABLE public.blood_work_entries ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Users can manage their own blood work entries"
  ON public.blood_work_entries FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

  ============================================================
*/

"use server";

import { createClient } from "@/lib/supabase/server";

export interface BloodWorkEntry {
  id?: string;
  user_id?: string;
  entry_date: string;
  label: string;
  // Hormone Panel
  total_testosterone?: number | null;
  free_testosterone?: number | null;
  shbg?: number | null;
  lh?: number | null;
  fsh?: number | null;
  estradiol?: number | null;
  dhea_s?: number | null;
  // Metabolic and Cardiovascular
  psa?: number | null;
  fasting_glucose?: number | null;
  hba1c?: number | null;
  total_cholesterol?: number | null;
  hdl?: number | null;
  ldl?: number | null;
  triglycerides?: number | null;
  hs_crp?: number | null;
  // Nutrient and Safety Markers
  vitamin_d?: number | null;
  zinc?: number | null;
  selenium?: number | null;
  magnesium_rbc?: number | null;
  // General flags
  cbc_normal?: boolean | null;
  cmp_normal?: boolean | null;
  notes?: string | null;
  created_at?: string;
}

export async function getBloodWorkEntries(
  userId: string
): Promise<BloodWorkEntry[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blood_work_entries")
      .select("*")
      .eq("user_id", userId)
      .order("entry_date", { ascending: true });

    if (error) return [];
    return (data ?? []) as BloodWorkEntry[];
  } catch {
    return [];
  }
}

export async function saveBloodWorkEntry(
  userId: string,
  entry: BloodWorkEntry
): Promise<{ data: BloodWorkEntry | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const payload = { ...entry, user_id: userId };

    let result;
    if (entry.id) {
      // Update existing entry
      result = await supabase
        .from("blood_work_entries")
        .update(payload)
        .eq("id", entry.id)
        .eq("user_id", userId)
        .select("*")
        .single();
    } else {
      // Insert new entry
      result = await supabase
        .from("blood_work_entries")
        .insert(payload)
        .select("*")
        .single();
    }

    if (result.error) return { data: null, error: result.error.message };
    return { data: result.data as BloodWorkEntry, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

export async function deleteBloodWorkEntry(
  entryId: string,
  userId: string
): Promise<{ error: string | null }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("blood_work_entries")
      .delete()
      .eq("id", entryId)
      .eq("user_id", userId);

    if (error) return { error: error.message };
    return { error: null };
  } catch (err) {
    return { error: String(err) };
  }
}
