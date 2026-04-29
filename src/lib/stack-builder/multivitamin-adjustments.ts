import type { CalculatedSupplement } from "./types";

export function applyMultivitaminAdjustments(
  supplements: CalculatedSupplement[],
  selectedMultivitaminName: string | null
): CalculatedSupplement[] {
  if (!selectedMultivitaminName) return supplements;

  return supplements.map((s) => {
    if (
      s.multivitaminAdjustment?.[selectedMultivitaminName] &&
      s.calculatedDose !== 0
    ) {
      const adj = s.multivitaminAdjustment[selectedMultivitaminName];
      if (adj.adjustedDose < s.calculatedDose) {
        return {
          ...s,
          calculatedDose: adj.adjustedDose,
          alertLevel: adj.alertLevel,
          alertMessage: adj.alertMessage,
        };
      }
    }
    return s;
  });
}

export function getSelectedMultivitaminName(
  supplements: CalculatedSupplement[],
  productIndex: number = 0
): string | null {
  const multi = supplements.find((s) => s.id === 1);
  return multi?.products[productIndex]?.name ?? null;
}
