export type InteractionSeverity = "conflict" | "caution" | "note";

export interface SupplementInteraction {
  id: string;
  supplementIds: [number, number];
  severity: InteractionSeverity;
  title: string;
  message: string;
}

export const SUPPLEMENT_INTERACTIONS: SupplementInteraction[] = [
  {
    id: "zinc-selenium",
    supplementIds: [5, 8],
    severity: "caution",
    title: "Zinc + Selenium",
    message:
      "Both are antioxidant minerals. High combined doses (>40 mg zinc + >200 mcg selenium) may stress elimination pathways. Factor in amounts already present in your multivitamin.",
  },
  {
    id: "tongkat-fadogia",
    supplementIds: [10, 11],
    severity: "caution",
    title: "Tongkat Ali + Fadogia Agrestis",
    message:
      "Both potently stimulate LH and free testosterone production. Combined use amplifies androgenic signaling — monitor for elevated heart rate, aggression, or acne. Cycle both together.",
  },
  {
    id: "tongkat-dhea",
    supplementIds: [10, 13],
    severity: "caution",
    title: "Tongkat Ali + DHEA",
    message:
      "Tongkat Ali raises endogenous androgens while DHEA adds exogenous precursor substrate. Combined use may push DHT levels high. A blood panel (total T, DHT, LH) is recommended if stacking both.",
  },
  {
    id: "citrulline-beet",
    supplementIds: [14, 15],
    severity: "note",
    title: "L-Citrulline + Beet Root",
    message:
      "Excellent complementary NO pairing — L-Citrulline (arginine pathway) and Beet Root (dietary nitrates) generate nitric oxide via distinct mechanisms. Additive BP-lowering effect; use caution if you have low baseline blood pressure.",
  },
  {
    id: "quercetin-omega3",
    supplementIds: [19, 4],
    severity: "caution",
    title: "Quercetin + Omega-3",
    message:
      "Both have antiplatelet activity. Combined use increases blood-thinning potential. Consult your prescriber if you are on any anticoagulant or blood-thinning medication.",
  },
  {
    id: "berberine-quercetin",
    supplementIds: [26, 19],
    severity: "note",
    title: "Berberine + Quercetin",
    message:
      "Both activate AMPK and modulate blood glucose pathways. Combined use may potentiate glucose-lowering effects — monitor blood sugar if you are prediabetic or on diabetes medications.",
  },
  {
    id: "resveratrol-quercetin",
    supplementIds: [25, 19],
    severity: "caution",
    title: "Resveratrol + Quercetin",
    message:
      "Both inhibit platelet aggregation and share CYP enzyme metabolism. Additive anticoagulant effect — avoid if on blood thinners. Take with food to reduce GI sensitivity.",
  },
  {
    id: "nmn-resveratrol",
    supplementIds: [24, 25],
    severity: "note",
    title: "NMN/NR + Resveratrol",
    message:
      "Synergistic NAD+ pathway pairing. Resveratrol activates sirtuins (SIRT1) that consume NAD+, while NMN/NR replenishes NAD+ levels. Take together in the morning for optimal activation.",
  },
  {
    id: "berberine-creatine",
    supplementIds: [26, 30],
    severity: "note",
    title: "Berberine + Creatine",
    message:
      "Some evidence suggests berberine may modestly inhibit creatine uptake via AMPK-mediated effects. Separate timing (creatine post-workout, berberine with meals) to minimize any interaction.",
  },
  {
    id: "zinc-magnesium",
    supplementIds: [5, 3],
    severity: "note",
    title: "Zinc + Magnesium",
    message:
      "At high doses, zinc competes with magnesium for absorption. Take zinc in the morning and magnesium in the evening to maximize absorption of both minerals.",
  },
  {
    id: "ashwagandha-dhea",
    supplementIds: [9, 13],
    severity: "caution",
    title: "Ashwagandha + DHEA",
    message:
      "Ashwagandha naturally elevates DHEA-S via adrenal support. Supplemental DHEA on top may push adrenal hormone levels above optimal. A DHEA-S serum test is recommended before combining.",
  },
  {
    id: "fenugreek-tongkat",
    supplementIds: [12, 10],
    severity: "note",
    title: "Fenugreek + Tongkat Ali",
    message:
      "Fenugreek inhibits 5-alpha reductase (reducing DHT conversion) while Tongkat Ali raises free testosterone. Together they may shift the testosterone-to-DHT ratio favorably — useful if DHT-related side effects are a concern.",
  },
];
