export interface BloodWorkMarker {
  key: string;
  label: string;
  unit: string;
  category: "hormone" | "metabolic" | "nutrient" | "general";
  lowRange: number | null;
  highRange: number | null;
  optimalLow: number | null;
  optimalHigh: number | null;
  description: string;
  whyItMatters: string;
  type: "number" | "boolean";
}

export const BLOOD_WORK_MARKERS: BloodWorkMarker[] = [
  // HORMONE PANEL
  {
    key: "total_testosterone",
    label: "Total Testosterone",
    unit: "ng/dL",
    category: "hormone",
    lowRange: 300,
    highRange: 1000,
    optimalLow: 600,
    optimalHigh: 900,
    description: "The primary male sex hormone driving muscle mass, libido, energy, and mood.",
    whyItMatters:
      "Low testosterone is directly linked to fatigue, reduced libido, muscle loss, and mood disorders. The Perfect Stack is designed to optimize this marker.",
    type: "number",
  },
  {
    key: "free_testosterone",
    label: "Free Testosterone",
    unit: "pg/mL",
    category: "hormone",
    lowRange: 50,
    highRange: 210,
    optimalLow: 100,
    optimalHigh: 200,
    description: "The biologically active fraction of testosterone not bound to proteins.",
    whyItMatters:
      "Free testosterone is what your body actually uses. High SHBG can leave total testosterone normal while free testosterone is low.",
    type: "number",
  },
  {
    key: "shbg",
    label: "SHBG",
    unit: "nmol/L",
    category: "hormone",
    lowRange: 10,
    highRange: 57,
    optimalLow: 20,
    optimalHigh: 40,
    description: "Sex Hormone Binding Globulin - binds testosterone and reduces its availability.",
    whyItMatters:
      "High SHBG reduces free testosterone. Boron and zinc in your stack help modulate SHBG levels.",
    type: "number",
  },
  {
    key: "lh",
    label: "LH",
    unit: "mIU/mL",
    category: "hormone",
    lowRange: 1.7,
    highRange: 8.6,
    optimalLow: 2,
    optimalHigh: 6,
    description: "Luteinizing Hormone - signals the testes to produce testosterone.",
    whyItMatters:
      "Low LH suggests pituitary or hypothalamic issues. Fadogia Agrestis and Tongkat Ali in your stack support LH signaling.",
    type: "number",
  },
  {
    key: "fsh",
    label: "FSH",
    unit: "mIU/mL",
    category: "hormone",
    lowRange: 1.5,
    highRange: 12.4,
    optimalLow: 2,
    optimalHigh: 8,
    description: "Follicle Stimulating Hormone - important for sperm production and testicular function.",
    whyItMatters:
      "Abnormal FSH can indicate testicular or pituitary issues and affects fertility.",
    type: "number",
  },
  {
    key: "estradiol",
    label: "Estradiol (E2)",
    unit: "pg/mL",
    category: "hormone",
    lowRange: 10,
    highRange: 40,
    optimalLow: 20,
    optimalHigh: 30,
    description: "The primary estrogen in men - necessary in small amounts but problematic when elevated.",
    whyItMatters:
      "High estradiol causes water retention, mood issues, and reduced libido. DIM from broccoli-based foods and your stack help maintain healthy estrogen balance.",
    type: "number",
  },
  {
    key: "dhea_s",
    label: "DHEA-S",
    unit: "mcg/dL",
    category: "hormone",
    lowRange: 80,
    highRange: 560,
    optimalLow: 200,
    optimalHigh: 450,
    description: "Dehydroepiandrosterone sulfate - adrenal precursor hormone that declines with age.",
    whyItMatters:
      "DHEA is a direct precursor to testosterone. Stack E includes DHEA supplementation for men with declining levels.",
    type: "number",
  },
  // METABOLIC AND CARDIOVASCULAR
  {
    key: "psa",
    label: "PSA",
    unit: "ng/mL",
    category: "metabolic",
    lowRange: 0,
    highRange: 4.0,
    optimalLow: 0,
    optimalHigh: 2.5,
    description: "Prostate Specific Antigen - screens for prostate health and cancer risk.",
    whyItMatters:
      "Testosterone optimization can affect PSA. Lycopene, Saw Palmetto, and zinc in your stack support healthy prostate function.",
    type: "number",
  },
  {
    key: "fasting_glucose",
    label: "Fasting Glucose",
    unit: "mg/dL",
    category: "metabolic",
    lowRange: 70,
    highRange: 99,
    optimalLow: 70,
    optimalHigh: 90,
    description: "Blood sugar level after fasting - primary screen for diabetes and insulin resistance.",
    whyItMatters:
      "High blood sugar suppresses testosterone and accelerates aging. Berberine in Stack E directly supports healthy glucose metabolism.",
    type: "number",
  },
  {
    key: "hba1c",
    label: "HbA1c",
    unit: "%",
    category: "metabolic",
    lowRange: 0,
    highRange: 5.7,
    optimalLow: 0,
    optimalHigh: 5.4,
    description: "3-month average blood sugar level.",
    whyItMatters:
      "Chronic elevated blood sugar damages testosterone-producing cells and vascular health.",
    type: "number",
  },
  {
    key: "total_cholesterol",
    label: "Total Cholesterol",
    unit: "mg/dL",
    category: "metabolic",
    lowRange: 0,
    highRange: 200,
    optimalLow: 150,
    optimalHigh: 180,
    description: "Total blood cholesterol - cholesterol is the raw material for testosterone synthesis.",
    whyItMatters:
      "Too low cholesterol can impair testosterone production. Healthy fats in the Perfect Stack diet support optimal cholesterol levels.",
    type: "number",
  },
  {
    key: "hdl",
    label: "HDL Cholesterol",
    unit: "mg/dL",
    category: "metabolic",
    lowRange: 40,
    highRange: null,
    optimalLow: 60,
    optimalHigh: null,
    description: "High density lipoprotein - the protective cholesterol.",
    whyItMatters:
      "Higher HDL is associated with better testosterone levels and cardiovascular health. Omega-3s and exercise in your protocol support HDL.",
    type: "number",
  },
  {
    key: "ldl",
    label: "LDL Cholesterol",
    unit: "mg/dL",
    category: "metabolic",
    lowRange: 0,
    highRange: 100,
    optimalLow: 0,
    optimalHigh: 80,
    description: "Low density lipoprotein - monitor to assess cardiovascular risk.",
    whyItMatters:
      "Elevated LDL increases cardiovascular risk. CoQ10, Omega-3, and plant-based diet components in your stack support healthy LDL.",
    type: "number",
  },
  {
    key: "triglycerides",
    label: "Triglycerides",
    unit: "mg/dL",
    category: "metabolic",
    lowRange: 0,
    highRange: 150,
    optimalLow: 0,
    optimalHigh: 100,
    description: "Blood fat levels - elevated triglycerides signal metabolic dysfunction.",
    whyItMatters:
      "High triglycerides are associated with insulin resistance and reduced testosterone. Omega-3s and Berberine in your stack directly address this.",
    type: "number",
  },
  {
    key: "hs_crp",
    label: "hsCRP",
    unit: "mg/L",
    category: "metabolic",
    lowRange: 0,
    highRange: 3.0,
    optimalLow: 0,
    optimalHigh: 1.0,
    description: "High sensitivity C-Reactive Protein - the primary inflammation marker.",
    whyItMatters:
      "Chronic inflammation suppresses testosterone and accelerates aging. The anti-inflammatory supplements and diet in your stack directly target this marker.",
    type: "number",
  },
  // NUTRIENT AND SAFETY MARKERS
  {
    key: "vitamin_d",
    label: "Vitamin D (25-OH)",
    unit: "ng/mL",
    category: "nutrient",
    lowRange: 30,
    highRange: 100,
    optimalLow: 50,
    optimalHigh: 80,
    description: "The sunshine vitamin - essential for testosterone production and immune function.",
    whyItMatters:
      "Vitamin D deficiency is directly linked to low testosterone. Stack A includes Vitamin D3+K2 to optimize this marker.",
    type: "number",
  },
  {
    key: "zinc",
    label: "Zinc",
    unit: "mcg/dL",
    category: "nutrient",
    lowRange: 60,
    highRange: 130,
    optimalLow: 80,
    optimalHigh: 120,
    description: "Essential mineral for testosterone synthesis, immune function, and sperm production.",
    whyItMatters:
      "Zinc deficiency directly reduces testosterone production. Stack A includes zinc supplementation with multivitamin-adjusted dosing.",
    type: "number",
  },
  {
    key: "selenium",
    label: "Selenium",
    unit: "mcg/L",
    category: "nutrient",
    lowRange: 70,
    highRange: 150,
    optimalLow: 100,
    optimalHigh: 140,
    description: "Antioxidant mineral critical for thyroid function and sperm health.",
    whyItMatters:
      "Selenium supports testosterone production and protects against oxidative stress. Your multivitamin provides the full daily amount.",
    type: "number",
  },
  {
    key: "magnesium_rbc",
    label: "Magnesium (RBC)",
    unit: "mg/dL",
    category: "nutrient",
    lowRange: 4.2,
    highRange: 6.8,
    optimalLow: 5.5,
    optimalHigh: 6.5,
    description: "Red blood cell magnesium - more accurate than serum magnesium for deficiency detection.",
    whyItMatters:
      "Magnesium is required for over 600 enzymatic reactions including testosterone synthesis. Stack A includes Magnesium Glycinate.",
    type: "number",
  },
  // GENERAL FLAGS
  {
    key: "cbc_normal",
    label: "CBC (Complete Blood Count)",
    unit: "",
    category: "general",
    lowRange: null,
    highRange: null,
    optimalLow: null,
    optimalHigh: null,
    description: "Screens for anemia, infection, and blood cell abnormalities.",
    whyItMatters:
      "Anemia causes fatigue and reduced performance. Iron deficiency can mimic low testosterone symptoms.",
    type: "boolean",
  },
  {
    key: "cmp_normal",
    label: "CMP (Comprehensive Metabolic Panel)",
    unit: "",
    category: "general",
    lowRange: null,
    highRange: null,
    optimalLow: null,
    optimalHigh: null,
    description: "Screens kidney function, liver function, and electrolyte balance.",
    whyItMatters:
      "Kidney and liver health directly affect how your body processes and eliminates hormones and supplements.",
    type: "boolean",
  },
];

export const MARKER_CATEGORIES: Record<BloodWorkMarker["category"], string> = {
  hormone: "Hormone Panel",
  metabolic: "Metabolic and Cardiovascular",
  nutrient: "Nutrient and Safety Markers",
  general: "General Health Flags",
};
