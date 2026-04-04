export interface BaselineData {
  recorded_at: string;
  weight_lbs: number;
  waist_inches: number;
  hip_inches: number | null;
  neck_inches: number | null;
  energy_score: number;
  libido_score: number;
  erection_quality_score: number;
  sleep_quality_score: number;
  mood_score: number;
  strength_recovery_score: number;
  sleep_hours: number;
  alcohol_drinks_per_week: number;
  training_days_per_week: number;
  training_type: string;
  current_medications: string;
  current_supplements: string;
  notes: string;
}

export const DEFAULT_BASELINE: BaselineData = {
  recorded_at: new Date().toISOString().split("T")[0],
  weight_lbs: 0,
  waist_inches: 0,
  hip_inches: null,
  neck_inches: null,
  energy_score: 5,
  libido_score: 5,
  erection_quality_score: 5,
  sleep_quality_score: 5,
  mood_score: 5,
  strength_recovery_score: 5,
  sleep_hours: 7,
  alcohol_drinks_per_week: 0,
  training_days_per_week: 3,
  training_type: "",
  current_medications: "",
  current_supplements: "",
  notes: "",
};

export interface WeeklyEntryData {
  week_number: number;
  entry_date: string;
  weight_lbs: number | null;
  waist_inches: number | null;
  energy_score: number | null;
  libido_score: number | null;
  erection_quality_score: number | null;
  sleep_quality_score: number | null;
  mood_score: number | null;
  strength_recovery_score: number | null;
  sleep_hours: number | null;
  alcohol_drinks: number | null;
  training_days: number | null;
  notes: string;
}

export const DEFAULT_WEEKLY: WeeklyEntryData = {
  week_number: 1,
  entry_date: new Date().toISOString().split("T")[0],
  weight_lbs: null,
  waist_inches: null,
  energy_score: 5,
  libido_score: 5,
  erection_quality_score: 5,
  sleep_quality_score: 5,
  mood_score: 5,
  strength_recovery_score: 5,
  sleep_hours: 7,
  alcohol_drinks: 0,
  training_days: 3,
  notes: "",
};

export interface ProgressData {
  baseline: BaselineData | null;
  weeklyEntries: WeeklyEntryData[];
}

export const SCORE_MARKERS = [
  { key: "energy_score", label: "Energy", description: "How sustained is your energy through the day?" },
  { key: "libido_score", label: "Libido", description: "Overall sexual desire and drive" },
  { key: "erection_quality_score", label: "Erection Quality", description: "Firmness, reliability, and morning erections" },
  { key: "sleep_quality_score", label: "Sleep Quality", description: "How rested do you feel on waking?" },
  { key: "mood_score", label: "Mood", description: "Overall emotional balance and motivation" },
  { key: "strength_recovery_score", label: "Strength / Recovery", description: "Gym performance and post-workout recovery" },
] as const;

export type ScoreKey = (typeof SCORE_MARKERS)[number]["key"];
