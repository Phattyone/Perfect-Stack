import type { AgeGroup } from "@/lib/types/profile";

export interface Product {
  name: string;
  price: number;
  servings: number;
  url: string;
}

export interface ProductDosing {
  servingSize: number;
  unit: string;
  servingsPerDay: number;
  dailyTotal: number;
  timing: string;
  timingIcon: string;
  withMeals: boolean;
  dailyServings: number;
  badgeTiming: string;
}

export interface Supplement {
  id: number;
  name: string;
  stack: "A" | "B" | "C" | "D" | "E";
  category: string;
  baseDose: number;
  unit: string;
  dailyServings: number;
  bestTiming: string;
  whatItSupports: string;
  timeToNotice: string;
  keyCautions: string;
  ageCautions?: Partial<Record<AgeGroup, string>>;
  timingIcon: string;
  products: Product[];
  productDosing?: { [productName: string]: ProductDosing };
  multivitaminAdjustment?: { [multivitaminProductName: string]: MultivitaminAdjustmentEntry };
}

export type AlertLevel =
  | "none"
  | "note"
  | "caution"
  | "dose-reduced"
  | "not-recommended";

export interface MultivitaminAdjustmentEntry {
  adjustedDose: number;
  alertLevel: AlertLevel;
  alertMessage: string;
}

export interface CalculatedSupplement extends Supplement {
  calculatedDose: number;
  alertLevel: AlertLevel;
  alertMessage: string;
  included: boolean;
  monthlyCost: number;
  selectedProductIndex: number;
}

export interface FactorScores {
  hormone: number;
  noVascular: number;
  stressSleep: number;
  overall: number;
  hormoneMax?: number;
  noMax?: number;
  stressMax?: number;
}

export interface StackResult {
  factors: FactorScores;
  supplements: CalculatedSupplement[];
}
