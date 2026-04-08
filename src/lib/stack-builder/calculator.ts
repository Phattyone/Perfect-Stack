import type { ProfileFormData } from "@/lib/types/profile";
import type { CalculatedSupplement, FactorScores, StackResult } from "./types";
import { SUPPLEMENTS } from "@/lib/data/supplements";

// ─── Lookup helpers ──────────────────────────────────────────────────

const AGE_HORMONE: Record<string, number> = {
  "30 to 39": 1.0,
  "40 to 49": 0.95,
  "50 to 59": 0.9,
  "60 and over": 0.8,
};

const TRAIN_HORMONE: Record<string, number> = {
  "Heavy Resistance / Lifting": 1.1,
  "Cardio / Endurance": 0.95,
  "Mixed / Moderate": 1.0,
  "Light / Sedentary": 0.85,
};

const HEALTH_HORMONE: Record<string, number> = {
  "No significant conditions": 1.0,
  "High stress / Poor sleep": 0.9,
  "Metabolic / Blood sugar issues": 0.95,
  "Heart health / BP concerns": 0.9,
  "Active TRT or HRT user": 0.8,
  "Post-cardiac / Stent / High CV risk": 0.85,
};

const AGE_NO: Record<string, number> = {
  "30 to 39": 1.0,
  "40 to 49": 1.0,
  "50 to 59": 0.9,
  "60 and over": 0.85,
};

const TRAIN_NO: Record<string, number> = {
  "Heavy Resistance / Lifting": 1.1,
  "Cardio / Endurance": 1.1,
  "Mixed / Moderate": 1.0,
  "Light / Sedentary": 0.9,
};

const GOAL_STRESS: Record<string, number> = {
  "Stress + Sleep Recovery": 1.3,
  "Longevity + Energy": 1.1,
};

const HEALTH_STRESS: Record<string, number> = {
  "High stress / Poor sleep": 1.2,
};

// ─── Factor calculators ──────────────────────────────────────────────

// Get the most conservative (lowest) multiplier from an array of health statuses
function minHealthMultiplier(statuses: string[], lookup: Record<string, number>): number {
  if (!statuses || statuses.length === 0) return 1;
  return Math.min(...statuses.map((s) => lookup[s] ?? 1));
}

function calcHormoneFactor(p: ProfileFormData): number {
  return (
    (AGE_HORMONE[p.age_group] ?? 1) *
    (TRAIN_HORMONE[p.training_style] ?? 1) *
    minHealthMultiplier(p.health_status, HEALTH_HORMONE)
  );
}

function calcNOFactor(p: ProfileFormData): number {
  if (p.nitrate_meds) return 0;
  let f =
    (AGE_NO[p.age_group] ?? 1) * (TRAIN_NO[p.training_style] ?? 1);
  if (p.pde5_inhibitor !== "None") f *= 0.5;
  if (p.bp_meds) f *= 0.8;
  if (p.alpha_blockers) f *= 0.8;
  return f;
}

function calcStressFactor(p: ProfileFormData): number {
  return (
    (GOAL_STRESS[p.primary_goal] ?? 1) *
    minHealthMultiplier(p.health_status, HEALTH_STRESS)
  );
}

// ─── Stack inclusion ─────────────────────────────────────────────────

const STACK_MAP: Record<string, string[]> = {
  stack_a: ["A"],
  stack_ab: ["A", "B"],
  stack_abc: ["A", "B", "C"],
  stack_abcd: ["A", "B", "C", "D"],
  stack_abcde: ["A", "B", "C", "D", "E"],
};

function includedStacks(p: ProfileFormData): Set<string> {
  const stacks = new Set(STACK_MAP[p.stack_selection] ?? ["A"]);
  if (p.nitrate_meds) stacks.delete("C");
  return stacks;
}

// ─── NO-boosting supplement dose reduction ───────────────────────────

function calcNOSupplementDose(
  baseDose: number,
  p: ProfileFormData,
  noFactor: number
): { dose: number; alertLevel: "none" | "dose-reduced" | "not-recommended"; alertMessage: string } {
  if (p.nitrate_meds || noFactor === 0) {
    return {
      dose: 0,
      alertLevel: "not-recommended",
      alertMessage:
        "Absolute contraindication  -  you take nitrate medications. All nitric oxide supplements set to zero.",
    };
  }

  const hasPDE5 = p.pde5_inhibitor !== "None";
  const hasBP = p.bp_meds;
  const hasAlpha = p.alpha_blockers;

  if (hasPDE5 && (hasBP || hasAlpha)) {
    return {
      dose: Math.round(baseDose * 0.3 * 100) / 100,
      alertLevel: "dose-reduced",
      alertMessage:
        "Dose reduced 70%  -  PDE5 inhibitor combined with BP medication or alpha-blocker.",
    };
  }
  if (hasPDE5) {
    return {
      dose: Math.round(baseDose * 0.5 * 100) / 100,
      alertLevel: "dose-reduced",
      alertMessage:
        "Dose reduced 50%  -  PDE5 inhibitor detected. Start low and monitor blood pressure.",
    };
  }
  if (hasBP) {
    return {
      dose: Math.round(baseDose * 0.7 * 100) / 100,
      alertLevel: "dose-reduced",
      alertMessage:
        "Dose reduced 30%  -  BP medication detected. Monitor blood pressure closely.",
    };
  }

  return { dose: baseDose, alertLevel: "none", alertMessage: "" };
}

// ─── Per-supplement special rules ────────────────────────────────────

function applySpecialRules(
  supp: CalculatedSupplement,
  p: ProfileFormData,
  hormoneFactor: number,
  noFactor: number
): CalculatedSupplement {
  const s = { ...supp };
  const name = s.name.toLowerCase();

  // DHEA  -  excluded on TRT/HRT or age 30-39
  if (s.id === 13) {
    if (p.trt_hrt || p.age_group === "30 to 39") {
      s.calculatedDose = 0;
      s.alertLevel = "not-recommended";
      s.alertMessage = p.trt_hrt
        ? "Not recommended  -  unpredictable hormone fluctuations when combined with TRT/HRT."
        : "Not recommended for age 30-39  -  natural DHEA levels are typically adequate.";
      return s;
    }
  }

  // Tongkat Ali  -  TRT caution
  if (s.id === 10 && p.trt_hrt) {
    s.alertLevel = "caution";
    s.alertMessage =
      "Limited benefit on exogenous hormones  -  targets LH/testosterone signaling suppressed by TRT.";
    return s;
  }

  // Fadogia Agrestis  -  TRT caution
  if (s.id === 11 && p.trt_hrt) {
    s.alertLevel = "caution";
    s.alertMessage =
      "Limited benefit on exogenous hormones  -  targets LH/testosterone signaling suppressed by TRT.";
    return s;
  }

  // Ashwagandha
  if (s.id === 9) {
    if (p.trt_hrt) {
      s.calculatedDose = Math.round(s.baseDose * hormoneFactor * 0.75);
      s.alertLevel = "caution";
      s.alertMessage =
        "Dose adjusted for TRT/HRT. Cortisol-reduction benefits remain relevant.";
    }
    if (p.thyroid_meds) {
      s.alertLevel = "caution";
      s.alertMessage =
        (s.alertMessage ? s.alertMessage + " " : "") +
        "May affect thyroid hormones  -  consult your prescriber.";
    }
    return s;
  }

  // Fenugreek  -  diabetes caution
  if (s.id === 12 && p.diabetes_meds) {
    s.alertLevel = "caution";
    s.alertMessage =
      "May lower blood sugar  -  hypoglycemia risk with diabetes medications. Monitor closely.";
    return s;
  }

  // Berberine  -  excluded with diabetes meds
  if (s.id === 26 && p.diabetes_meds) {
    s.calculatedDose = 0;
    s.alertLevel = "not-recommended";
    s.alertMessage =
      "Not recommended  -  Berberine has potent blood-sugar-lowering effects that compound with diabetes medications.";
    return s;
  }

  // Selenium  -  thyroid note
  if (s.id === 8 && p.thyroid_meds) {
    s.alertLevel = "note";
    s.alertMessage =
      "Monitor thyroid levels  -  selenium affects thyroid hormone conversion.";
    return s;
  }

  // Vitamin D3+K2  -  blood thinner caution (K2 component)
  if (s.id === 2 && p.blood_thinners) {
    s.alertLevel = "caution";
    s.alertMessage =
      "Vitamin K2 affects warfarin clotting cascade  -  monitor INR with your prescriber.";
    return s;
  }

  // Omega-3  -  blood thinner caution
  if (s.id === 4 && p.blood_thinners) {
    s.alertLevel = "caution";
    s.alertMessage =
      "Additive antiplatelet effect with blood thinners at high dose. Monitor with prescriber.";
    return s;
  }

  // Quercetin  -  blood thinner caution
  if (s.id === 19 && p.blood_thinners) {
    s.alertLevel = "caution";
    s.alertMessage =
      "Inhibits warfarin metabolism via CYP3A4  -  consult prescriber before starting.";
    return s;
  }

  // Resveratrol  -  blood thinner caution
  if (s.id === 25 && p.blood_thinners) {
    s.alertLevel = "caution";
    s.alertMessage =
      "Inhibits CYP2C9 (warfarin's primary metabolic pathway)  -  consult prescriber.";
    return s;
  }

  // Horny Goat Weed  -  blood thinner note
  if (s.id === 21 && p.blood_thinners) {
    s.alertLevel = "note";
    s.alertMessage =
      "Mild antiplatelet activity  -  inform your prescriber.";
    return s;
  }

  // Magnesium  -  BP meds note
  if (s.id === 3 && p.bp_meds) {
    s.alertLevel = "note";
    s.alertMessage =
      "May enhance BP-lowering effect of antihypertensives  -  monitor blood pressure.";
    return s;
  }

  // NO-boosting supplements: L-Citrulline, Beet Root, Pine Bark
  if (s.id === 14 || s.id === 15 || s.id === 17) {
    const result = calcNOSupplementDose(s.baseDose, p, noFactor);
    s.calculatedDose = result.dose;
    if (result.alertLevel !== "none") {
      s.alertLevel = result.alertLevel;
      s.alertMessage = result.alertMessage;
    }
    return s;
  }

  return s;
}

// ─── Main calculator ─────────────────────────────────────────────────

export function calculateStack(profile: ProfileFormData): StackResult {
  const hormoneFactor = calcHormoneFactor(profile);
  const noFactor = calcNOFactor(profile);
  const stressFactor = calcStressFactor(profile);
  const overall = (hormoneFactor + noFactor + stressFactor) / 3;

  const factors: FactorScores = {
    hormone: Math.round(hormoneFactor * 100),
    noVascular: Math.round(noFactor * 100),
    stressSleep: Math.round(stressFactor * 100),
    overall: Math.round(overall * 100),
  };

  const included = includedStacks(profile);

  const supplements: CalculatedSupplement[] = SUPPLEMENTS.map((supp) => {
    const isIncluded = included.has(supp.stack);
    const product = supp.products[0];
    const monthlyCost = isIncluded
      ? Math.round(((product.price / product.servings) * supp.dailyServings * 30) * 100) / 100
      : 0;

    let calc: CalculatedSupplement = {
      ...supp,
      calculatedDose: supp.baseDose,
      alertLevel: "none",
      alertMessage: "",
      included: isIncluded,
      monthlyCost,
      selectedProductIndex: 0,
    };

    if (isIncluded) {
      calc = applySpecialRules(calc, profile, hormoneFactor, noFactor);
      // Recalculate monthly cost if dose was zeroed
      if (calc.calculatedDose === 0) {
        calc.monthlyCost = 0;
      }
    }

    return calc;
  });

  return { factors, supplements };
}
