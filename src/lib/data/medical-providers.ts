export type ProviderType = "local" | "telehealth";
export type ProviderTag =
  | "blood-work"
  | "hormone-therapy"
  | "trt"
  | "mens-health"
  | "urology"
  | "lab-testing";

export interface MedicalProvider {
  id: number;
  name: string;
  practice: string;
  type: ProviderType;
  specialty: string;
  location?: string;
  description: string;
  services: string[];
  website: string;
  referralUrl: string;
  bookingUrl: string;
  tags: ProviderTag[];
  featured: boolean;
  comingSoon?: boolean;
  notes?: string;
}

export const PROVIDERS: MedicalProvider[] = [
  // ─── LOCAL PROVIDERS ───────────────────────────────────────────────
  {
    id: 1,
    name: "Dr. Ravi Kacker",
    practice: "MWU Urology",
    type: "local",
    specialty: "Urology and Men's Health",
    location: "Boston, MA area",
    description:
      "Dr. Kacker is a well-renowned urologist in the Boston area specializing in men's health, sexual health, and hormone optimization. MWU Urology offers comprehensive testosterone panels, hormone evaluation, and treatment options through insurance or self-pay.",
    services: [
      "Testosterone blood panel",
      "Free and total testosterone testing",
      "SHBG and estradiol evaluation",
      "Hormone therapy consultation",
      "Sexual health evaluation",
      "PSA and prostate screening",
      "ED evaluation and treatment",
    ],
    website: "https://mwurology.com",
    referralUrl: "https://mwurology.com",
    bookingUrl: "https://mwurology.com",
    tags: ["blood-work", "hormone-therapy", "trt", "mens-health", "urology"],
    featured: true,
    notes:
      "Most major insurance plans accepted. Self-pay options available. Located in the greater Boston MA area.",
  },

  // ─── TELEHEALTH PROVIDERS (Coming Soon) ────────────────────────────
  {
    id: 2,
    name: "Marek Health",
    practice: "Marek Health",
    type: "telehealth",
    specialty: "Men's Health and Hormone Optimization",
    description:
      "Comprehensive men's health platform offering detailed lab panels, hormone optimization, and ongoing medical supervision. One of the most thorough telehealth options for men serious about optimization.",
    services: [
      "Comprehensive hormone panels",
      "TRT consultation and management",
      "Thyroid evaluation",
      "Metabolic health",
      "Ongoing physician supervision",
    ],
    website: "https://marekhealth.com",
    referralUrl: "https://marekhealth.com",
    bookingUrl: "https://marekhealth.com",
    tags: ["blood-work", "hormone-therapy", "trt", "mens-health", "lab-testing"],
    featured: false,
    comingSoon: true,
  },
  {
    id: 3,
    name: "Defy Medical",
    practice: "Defy Medical",
    type: "telehealth",
    specialty: "Hormone Therapy and Men's Health",
    description:
      "Specialized telehealth clinic focused on TRT, hormone optimization, and men's health. Known for personalized protocols and thorough follow-up care.",
    services: [
      "TRT protocols",
      "HGH therapy",
      "Peptide therapy",
      "Comprehensive lab work",
      "Ongoing monitoring",
    ],
    website: "https://defymedical.com",
    referralUrl: "https://defymedical.com",
    bookingUrl: "https://defymedical.com",
    tags: ["hormone-therapy", "trt", "mens-health"],
    featured: false,
    comingSoon: true,
  },
  {
    id: 4,
    name: "Maximus",
    practice: "Maximus",
    type: "telehealth",
    specialty: "Men's Performance and Hormone Health",
    description:
      "Modern men's health platform focused on testosterone optimization and peak performance. Streamlined process from lab testing to treatment.",
    services: [
      "Testosterone optimization",
      "Lab testing",
      "Physician consultation",
      "Ongoing care",
    ],
    website: "https://maximustribe.com",
    referralUrl: "https://maximustribe.com",
    bookingUrl: "https://maximustribe.com",
    tags: ["hormone-therapy", "trt", "mens-health"],
    featured: false,
    comingSoon: true,
  },
  {
    id: 5,
    name: "Ulta Lab Tests",
    practice: "Ulta Lab Tests",
    type: "telehealth",
    specialty: "Direct Lab Testing",
    description:
      "Order your own lab panels without a physician referral. Get the exact tests recommended in the Perfect Stack guide at transparent prices.",
    services: [
      "Total and free testosterone",
      "SHBG",
      "Estradiol",
      "Complete hormone panel",
      "Thyroid panel",
      "Metabolic panel",
      "PSA",
    ],
    website: "https://ultalabtests.com",
    referralUrl: "https://ultalabtests.com",
    bookingUrl: "https://ultalabtests.com",
    tags: ["blood-work", "lab-testing"],
    featured: false,
    comingSoon: true,
  },
  {
    id: 6,
    name: "Roman Health",
    practice: "Ro",
    type: "telehealth",
    specialty: "Men's Health and ED Treatment",
    description:
      "Online men's health platform for ED treatment, testosterone evaluation, and general men's health. Fast and discreet consultations.",
    services: [
      "ED treatment",
      "Testosterone evaluation",
      "General men's health",
      "Prescription delivery",
    ],
    website: "https://ro.co",
    referralUrl: "https://ro.co",
    bookingUrl: "https://ro.co",
    tags: ["mens-health", "hormone-therapy"],
    featured: false,
    comingSoon: true,
  },
];
