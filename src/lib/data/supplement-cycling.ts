export interface CyclingProtocol {
  supplementId: number;
  supplementName: string;
  shortName: string;
  onWeeks: number;
  offWeeks: number;
  stack: "A" | "B" | "C" | "D" | "E";
  reason: string;
  notes: string;
}

export const CYCLING_PROTOCOLS: CyclingProtocol[] = [
  {
    supplementId: 9,
    supplementName: "Ashwagandha KSM-66",
    shortName: "Ashwagandha",
    onWeeks: 8,
    offWeeks: 4,
    stack: "B",
    reason:
      "Prevents receptor desensitization and maintains adrenal responsiveness. Continuous use may blunt the cortisol-lowering benefit over time.",
    notes:
      "During off weeks, cortisol may temporarily rise — this is normal adaptation. Resume after 4 weeks.",
  },
  {
    supplementId: 10,
    supplementName: "Tongkat Ali Eurycoma Longifolia",
    shortName: "Tongkat Ali",
    onWeeks: 8,
    offWeeks: 4,
    stack: "B",
    reason:
      "Cycling prevents HPG axis accommodation. The LH-stimulating effect diminishes with continuous use.",
    notes:
      "Most practitioners use an 8-week on / 4-week off macro-cycle. Cycle in sync with Fadogia for a unified schedule.",
  },
  {
    supplementId: 11,
    supplementName: "Fadogia Agrestis",
    shortName: "Fadogia",
    onWeeks: 8,
    offWeeks: 4,
    stack: "B",
    reason:
      "Fadogia's LH-stimulating effect is potent. Continuous use may cause Leydig cell fatigue — cycling preserves long-term testicular sensitivity.",
    notes:
      "Blood panel (total T, LH, FSH) recommended every 12 weeks. Cycle in sync with Tongkat Ali.",
  },
  {
    supplementId: 13,
    supplementName: "DHEA Dehydroepiandrosterone",
    shortName: "DHEA",
    onWeeks: 12,
    offWeeks: 4,
    stack: "B",
    reason:
      "Exogenous DHEA can suppress endogenous adrenal DHEA production if taken without breaks.",
    notes:
      "DHEA-S serum test recommended at baseline and every 6 months. Consult a physician if on any hormonal therapy.",
  },
  {
    supplementId: 26,
    supplementName: "Berberine HCl",
    shortName: "Berberine",
    onWeeks: 8,
    offWeeks: 4,
    stack: "E",
    reason:
      "Continuous berberine may suppress gut microbiome diversity and cause GI adaptation. Cycling restores gut flora balance.",
    notes:
      "During off weeks, prioritize dietary fiber and fermented foods to support gut microbiome recovery.",
  },
  {
    supplementId: 21,
    supplementName: "Horny Goat Weed Epimedium",
    shortName: "Horny Goat Weed",
    onWeeks: 8,
    offWeeks: 4,
    stack: "D",
    reason:
      "Icariin (active compound) may exhibit diminishing returns with continuous use. Cycling maintains libido pathway sensitivity.",
    notes:
      "Can be cycled in sync with Tongkat Ali and Fadogia for a unified hormone-cycle schedule.",
  },
];
