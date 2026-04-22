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
      "Both potently stimulate LH and free testosterone production. Combined use amplifies androgenic signaling. Monitor for elevated heart rate, aggression, or acne. Cycle both together.",
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
    id: "ashwagandha-tongkat",
    supplementIds: [9, 10],
    severity: "caution",
    title: "Ashwagandha + Tongkat Ali",
    message:
      "Ashwagandha lowers cortisol and supports stress resilience while Tongkat Ali raises androgens via LH stimulation. Together they create a potent hormonal optimization stack. Monitor for excessive stimulation, sleep disruption, or elevated heart rate.",
  },
  {
    id: "ashwagandha-fadogia",
    supplementIds: [9, 11],
    severity: "caution",
    title: "Ashwagandha + Fadogia Agrestis",
    message:
      "Ashwagandha modulates the HPA axis while Fadogia stimulates the HPG axis via LH. Both influence hormonal signaling pathways. Combined use is generally well tolerated, but monitor for hormonal imbalance and cycle both on the same schedule.",
  },
  {
    id: "ashwagandha-dhea",
    supplementIds: [9, 13],
    severity: "caution",
    title: "Ashwagandha + DHEA",
    message:
      "Both influence cortisol and adrenal function. Ashwagandha lowers cortisol while DHEA supports adrenal output. Combining them is generally safe but monitor for fatigue or hormonal imbalance. Take Ashwagandha in the evening and DHEA in the morning.",
  },
  {
    id: "citrulline-beet",
    supplementIds: [14, 15],
    severity: "note",
    title: "L-Citrulline + Beet Root",
    message:
      "Excellent complementary NO pairing. L-Citrulline (arginine pathway) and Beet Root (dietary nitrates) generate nitric oxide via distinct mechanisms. Additive BP-lowering effect, use caution if you have low baseline blood pressure.",
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
      "Both activate AMPK and modulate blood glucose pathways. Combined use may potentiate glucose-lowering effects. Monitor blood sugar if you are prediabetic or on diabetes medications.",
  },
  {
    id: "resveratrol-quercetin",
    supplementIds: [25, 19],
    severity: "caution",
    title: "Resveratrol + Quercetin",
    message:
      "Both inhibit platelet aggregation and share CYP enzyme metabolism. Additive anticoagulant effect. Avoid if on blood thinners. Take with food to reduce GI sensitivity.",
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
    id: "fenugreek-tongkat",
    supplementIds: [12, 10],
    severity: "note",
    title: "Fenugreek + Tongkat Ali",
    message:
      "Fenugreek inhibits 5-alpha reductase (reducing DHT conversion) while Tongkat Ali raises free testosterone. Together they may shift the testosterone-to-DHT ratio favorably, useful if DHT-related side effects are a concern.",
  },
  {
    id: "multi-zinc-conflict",
    supplementIds: [1, 5],
    severity: "conflict",
    title: "Multivitamin + Zinc",
    message:
      "Your multivitamin already provides significant zinc (typically 15–25 mg). Adding a standalone zinc supplement risks exceeding the 40 mg tolerable upper limit, which can suppress copper absorption and impair immune function over time. Remove standalone zinc unless your blood work confirms a deficiency.",
  },
  {
    id: "multi-selenium-conflict",
    supplementIds: [1, 8],
    severity: "conflict",
    title: "Multivitamin + Selenium",
    message:
      "All three recommended multivitamins provide 200 mcg selenium — the exact daily upper intake level. Adding a standalone selenium supplement pushes you into toxicity territory. Selenosis symptoms (hair loss, brittle nails, garlic breath) appear above 400 mcg/day. Remove the standalone selenium supplement.",
  },
  {
    id: "multi-vitd-conflict",
    supplementIds: [1, 2],
    severity: "conflict",
    title: "Multivitamin + Vitamin D3",
    message:
      "Your multivitamin contributes 1,000 to 2,000 IU of Vitamin D. Stacking a separate D3 supplement without knowing your baseline 25(OH)D level risks pushing into hypervitaminosis D territory (>10,000 IU/day chronically). Get your D levels tested before adding standalone D3.",
  },
  {
    id: "fenugreek-dhea",
    supplementIds: [12, 13],
    severity: "caution",
    title: "Fenugreek + DHEA",
    message:
      "Both influence androgen pathways. Fenugreek inhibits 5-alpha reductase and may raise free testosterone, while DHEA provides exogenous androgen precursor. Combined use may push testosterone and DHT levels high. A blood panel is recommended if stacking both long-term.",
  },
  {
    id: "ginseng-tongkat",
    supplementIds: [22, 10],
    severity: "caution",
    title: "Panax Ginseng + Tongkat Ali",
    message:
      "Both stimulate LH production and support testosterone levels via complementary mechanisms. Combined use can produce significant androgenic stimulation. Monitor for sleep disruption, elevated heart rate, or irritability. Cycle both supplements together.",
  },
  {
    id: "berberine-fenugreek",
    supplementIds: [26, 12],
    severity: "caution",
    title: "Berberine + Fenugreek",
    message:
      "Both have blood glucose lowering effects — berberine via AMPK activation and fenugreek via soluble fiber and 4-hydroxyisoleucine. Combined use may produce additive hypoglycemic effects. Monitor blood sugar carefully if diabetic or prediabetic.",
  },
  {
    id: "saw-palmetto-zinc",
    supplementIds: [27, 5],
    severity: "caution",
    title: "Saw Palmetto + Zinc",
    message:
      "Both inhibit 5-alpha reductase, the enzyme that converts testosterone to DHT. Stacking them amplifies DHT suppression. This can be beneficial for prostate health but may interfere with DHT-dependent functions. Monitor if you are also using Fenugreek or Finasteride.",
  },
  {
    id: "coq10-berberine",
    supplementIds: [16, 26],
    severity: "caution",
    title: "CoQ10 + Berberine",
    message:
      "Berberine activates AMPK which may reduce cellular CoQ10 synthesis over time — the same mechanism by which statins deplete CoQ10. Supplementing CoQ10 alongside berberine is a reasonable precaution, but monitor for fatigue or muscle weakness that may indicate mitochondrial insufficiency.",
  },
  {
    id: "collagen-vitc",
    supplementIds: [31, 18],
    severity: "note",
    title: "Collagen + Vitamin C",
    message:
      "An excellent pairing. Vitamin C is required for collagen synthesis — it is the cofactor for prolyl and lysyl hydroxylase enzymes that stabilize the collagen triple helix. Taking Vitamin C alongside collagen peptides maximizes utilization. Aim for at least 250 mg Vitamin C within 30 minutes of your collagen dose.",
  },
  {
    id: "lycopene-vitc",
    supplementIds: [28, 18],
    severity: "note",
    title: "Lycopene + Vitamin C",
    message:
      "Vitamin C protects lycopene from oxidative degradation in the GI tract, improving its stability and bioavailability. Taking these together supports prostate health and antioxidant defense. Both are best absorbed with dietary fat.",
  },
  {
    id: "quercetin-vitc",
    supplementIds: [19, 18],
    severity: "note",
    title: "Quercetin + Vitamin C",
    message:
      "Vitamin C regenerates oxidized quercetin back to its active form, extending its antioxidant activity. This is a synergistic antioxidant pairing. Combined use enhances anti-inflammatory and immune benefits beyond either alone.",
  },
  {
    id: "nmn-vitd",
    supplementIds: [24, 2],
    severity: "note",
    title: "NMN + Vitamin D3",
    message:
      "Both support mitochondrial function and cellular energy production via complementary mechanisms — NMN replenishes NAD+ pools while Vitamin D3 regulates mitochondrial biogenesis genes. No interactions or concerns. Take both in the morning for aligned circadian signaling.",
  },
];
