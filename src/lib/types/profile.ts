// Step 1 options
export const AGE_GROUPS = [
  "30 to 39",
  "40 to 49",
  "50 to 59",
  "60 and over",
] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

export const PRIMARY_GOALS = [
  "Hormone + Sexual Health",
  "Erection Quality + Blood Flow",
  "Libido + Desire",
  "Stress + Sleep Recovery",
  "Longevity + Energy",
  "Performance + Muscle",
] as const;
export type PrimaryGoal = (typeof PRIMARY_GOALS)[number];

export const TRAINING_STYLES = [
  "Heavy Resistance / Lifting",
  "Cardio / Endurance",
  "Mixed / Moderate",
  "Light / Sedentary",
] as const;
export type TrainingStyle = (typeof TRAINING_STYLES)[number];

export const HEALTH_STATUSES = [
  "No significant conditions",
  "High stress / Poor sleep",
  "Metabolic / Blood sugar issues",
  "Heart health / BP concerns",
  "Active TRT or HRT user",
  "Post-cardiac / Stent / High CV risk",
] as const;
export type HealthStatus = (typeof HEALTH_STATUSES)[number];

// Step 2 options
export const PDE5_OPTIONS = [
  "None",
  "Sildenafil (Viagra)",
  "Tadalafil (Cialis)",
  "Vardenafil (Levitra)",
  "Avanafil (Stendra)",
] as const;
export type PDE5Option = (typeof PDE5_OPTIONS)[number];

export const PDE5_FREQUENCIES = ["Daily", "On-demand"] as const;
export type PDE5Frequency = (typeof PDE5_FREQUENCIES)[number];

// Step 3 options
export const STACK_OPTIONS = [
  { value: "stack_a", label: "Stack A  -  Foundation Protocol" },
  { value: "stack_ab", label: "Stacks A+B  -  Performance Protocol" },
  { value: "stack_abc", label: "Stacks A+B+C  -  Full Performance Protocol" },
  { value: "stack_abcd", label: "Stacks A+B+C+D  -  Advanced Protocol" },
  { value: "stack_abcde", label: "Stacks A+B+C+D+E  -  Complete Protocol" },
] as const;
export type StackSelection = (typeof STACK_OPTIONS)[number]["value"];

// Lookup for protocol display names (keyed by stack_selection value)
export const PROTOCOL_NAMES: Record<string, string> = {
  stack_a: "Stack A  -  Foundation Protocol",
  stack_ab: "Stacks A+B  -  Performance Protocol",
  stack_abc: "Stacks A+B+C  -  Full Performance Protocol",
  stack_abcd: "Stacks A+B+C+D  -  Advanced Protocol",
  stack_abcde: "Stacks A+B+C+D+E  -  Complete Protocol",
};

// Form data shape
export interface ProfileFormData {
  // Step 1
  age_group: string;
  primary_goal: string;
  training_style: string;
  health_status: string;
  // Step 2
  pde5_inhibitor: string;
  pde5_dose: string;
  pde5_frequency: string;
  bp_meds: boolean;
  nitrate_meds: boolean;
  alpha_blockers: boolean;
  diabetes_meds: boolean;
  trt_hrt: boolean;
  thyroid_meds: boolean;
  blood_thinners: boolean;
  other_ed_meds: boolean;
  // Step 3
  stack_selection: string;
  // Acknowledgements
  nitrate_warning_acknowledged: boolean;
  blood_thinner_warning_acknowledged: boolean;
  trt_warning_acknowledged: boolean;
  pde5_warning_acknowledged: boolean;
}

export type ModalVariant = "red" | "orange" | "blue";

export interface SafetyModalConfig {
  id: string;
  variant: ModalVariant;
  title: string;
  body: string;
  acknowledgeText: string;
  acknowledgementKey: keyof ProfileFormData;
}

export const DEFAULT_PROFILE: ProfileFormData = {
  age_group: "",
  primary_goal: "",
  training_style: "",
  health_status: "",
  pde5_inhibitor: "None",
  pde5_dose: "",
  pde5_frequency: "",
  bp_meds: false,
  nitrate_meds: false,
  alpha_blockers: false,
  diabetes_meds: false,
  trt_hrt: false,
  thyroid_meds: false,
  blood_thinners: false,
  other_ed_meds: false,
  stack_selection: "",
  nitrate_warning_acknowledged: false,
  blood_thinner_warning_acknowledged: false,
  trt_warning_acknowledged: false,
  pde5_warning_acknowledged: false,
};
