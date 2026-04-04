export type EquipmentCategory = "kitchen" | "gym";
export type Priority = "essential" | "recommended" | "optional";

export interface EquipmentItem {
  id: number;
  name: string;
  category: EquipmentCategory;
  description: string;
  priority: Priority;
  estimatedPrice: string;
  amazonUrl: string;
  notes?: string;
}

export const EQUIPMENT: EquipmentItem[] = [
  // ─── KITCHEN  -  Essential ───────────────────────────────────────────
  {
    id: 1,
    name: "High-Power Blender",
    category: "kitchen",
    priority: "essential",
    estimatedPrice: "$45 – $400",
    description:
      "Required for daily smoothies and performance drinks. A weak blender won't fully break down beets, frozen fruit, and fibrous ingredients. Vitamix or Ninja are the top picks.",
    amazonUrl:
      "https://www.amazon.com/s?k=high+power+blender+vitamix+ninja&tag=perfectstack-20",
  },
  {
    id: 2,
    name: "Juicer (Centrifugal or Masticating)",
    category: "kitchen",
    priority: "essential",
    estimatedPrice: "$60 – $300",
    description:
      "Needed for fresh beet juice, ginger shots, and turmeric shots. Masticating juicers preserve more nutrients but cost more. Centrifugal juicers are faster and more affordable.",
    amazonUrl:
      "https://www.amazon.com/s?k=cold+press+masticating+juicer&tag=perfectstack-20",
  },
  {
    id: 3,
    name: "Cast Iron Skillet 12-inch",
    category: "kitchen",
    priority: "essential",
    estimatedPrice: "$30 – $50",
    description:
      "The best tool for searing steak, cooking eggs, and building the crust on proteins that preserves flavor and nutrients. Builds testosterone-supporting meals the right way.",
    amazonUrl:
      "https://www.amazon.com/s?k=lodge+cast+iron+skillet+12+inch&tag=perfectstack-20",
  },
  {
    id: 4,
    name: "Large Glass Meal Prep Containers Set",
    category: "kitchen",
    priority: "essential",
    estimatedPrice: "$30 – $50",
    description:
      "Meal prepping is the difference between following the protocol and abandoning it by day 3. Glass containers are safer than plastic for storing hot foods and oils.",
    amazonUrl:
      "https://www.amazon.com/s?k=glass+meal+prep+containers+set&tag=perfectstack-20",
  },
  {
    id: 5,
    name: "Large Glass Water Bottle or Pitcher 2L",
    category: "kitchen",
    priority: "essential",
    estimatedPrice: "$15 – $35",
    description:
      "For your daily infused performance waters. Prep the night before, track your 1.5L minimum intake through the day. Glass keeps flavors clean.",
    amazonUrl:
      "https://www.amazon.com/s?k=glass+water+bottle+2+liter&tag=perfectstack-20",
  },
  {
    id: 6,
    name: "Digital Kitchen Scale",
    category: "kitchen",
    priority: "essential",
    estimatedPrice: "$10 – $25",
    description:
      "For accurately measuring supplement powders like L-Citrulline, maca root, and collagen peptides. Accuracy matters when dosing performance ingredients.",
    amazonUrl:
      "https://www.amazon.com/s?k=digital+kitchen+scale+grams&tag=perfectstack-20",
  },

  // ─── KITCHEN  -  Recommended ─────────────────────────────────────────
  {
    id: 7,
    name: "Instant Read Meat Thermometer",
    category: "kitchen",
    priority: "recommended",
    estimatedPrice: "$15 – $30",
    description:
      "Takes the guesswork out of cooking proteins correctly. Overcooked salmon and steak lose nutrients and flavor. 130-135\u00B0F for medium rare steak, 125\u00B0F for salmon.",
    amazonUrl:
      "https://www.amazon.com/s?k=instant+read+meat+thermometer&tag=perfectstack-20",
  },
  {
    id: 8,
    name: "Immersion Blender",
    category: "kitchen",
    priority: "recommended",
    estimatedPrice: "$25 – $60",
    description:
      "Faster than a full blender for golden milk, protein shakes, and soups. Easier to clean for daily use.",
    amazonUrl:
      "https://www.amazon.com/s?k=immersion+hand+blender&tag=perfectstack-20",
  },
  {
    id: 9,
    name: "Baking Sheet with Wire Rack",
    category: "kitchen",
    priority: "recommended",
    estimatedPrice: "$20 – $40",
    description:
      "For roasting vegetables, asparagus, and sweet potatoes. Wire rack allows air circulation for even cooking without steaming.",
    amazonUrl:
      "https://www.amazon.com/s?k=half+sheet+baking+pan+wire+rack+set&tag=perfectstack-20",
  },
  {
    id: 10,
    name: "Shaker Bottle Set",
    category: "kitchen",
    priority: "recommended",
    estimatedPrice: "$15 – $25",
    description:
      "For mixing performance shots, electrolyte drinks, and protein shakes on the go. BPA-free with a mixing ball.",
    amazonUrl:
      "https://www.amazon.com/s?k=blender+bottle+shaker+bottle+set&tag=perfectstack-20",
  },
  {
    id: 11,
    name: "Mortar and Pestle",
    category: "kitchen",
    priority: "recommended",
    estimatedPrice: "$20 – $40",
    description:
      "For grinding whole spices like black pepper, which activates turmeric absorption. Fresh ground spices have significantly higher bioavailability than pre-ground.",
    amazonUrl:
      "https://www.amazon.com/s?k=mortar+and+pestle+granite&tag=perfectstack-20",
  },

  // ─── KITCHEN  -  Optional ────────────────────────────────────────────
  {
    id: 12,
    name: "Cold Press Shot Machine",
    category: "kitchen",
    priority: "optional",
    estimatedPrice: "$100 – $200",
    description:
      "For men who take their daily performance shots seriously. Makes clean 2oz shots from ginger, beet, and turmeric without the mess of a full juicer.",
    amazonUrl:
      "https://www.amazon.com/s?k=cold+press+shot+juicer+machine&tag=perfectstack-20",
  },
  {
    id: 13,
    name: "Sous Vide Precision Cooker",
    category: "kitchen",
    priority: "optional",
    estimatedPrice: "$80 – $200",
    description:
      "For perfectly cooked proteins every time. Salmon at 125\u00B0F for 45 min produces restaurant-quality results that preserve omega-3s. Worth it for serious protocol followers.",
    amazonUrl:
      "https://www.amazon.com/s?k=sous+vide+precision+cooker+immersion&tag=perfectstack-20",
  },

  // ─── GYM  -  Essential ───────────────────────────────────────────────
  {
    id: 14,
    name: "Adjustable Dumbbells Set",
    category: "gym",
    priority: "essential",
    estimatedPrice: "$150 – $400",
    description:
      "The single most versatile piece of home gym equipment. Covers compound and isolation movements for the testosterone-boosting resistance training protocol.",
    amazonUrl:
      "https://www.amazon.com/s?k=adjustable+dumbbells+set+home+gym&tag=perfectstack-20",
  },
  {
    id: 15,
    name: "Pull-Up Bar (Doorframe or Wall-Mounted)",
    category: "gym",
    priority: "essential",
    estimatedPrice: "$25 – $80",
    description:
      "Pull-ups and chin-ups are among the highest testosterone-stimulating bodyweight movements. One of the best investments per dollar for home training.",
    amazonUrl:
      "https://www.amazon.com/s?k=doorframe+pull+up+bar+home+gym&tag=perfectstack-20",
  },
  {
    id: 16,
    name: "Smart Body Composition Scale",
    category: "gym",
    priority: "essential",
    estimatedPrice: "$30 – $80",
    description:
      "Tracks weight, body fat percentage, muscle mass, and BMI. Essential for monitoring protocol results beyond just the scale number. Syncs to your phone.",
    amazonUrl:
      "https://www.amazon.com/s?k=smart+body+composition+scale+wifi+bluetooth&tag=perfectstack-20",
    notes:
      "Look for models that measure body fat via bioelectrical impedance. Withings and Renpho are top picks.",
  },
  {
    id: 17,
    name: "Weighted Vest",
    category: "gym",
    priority: "essential",
    estimatedPrice: "$50 – $150",
    description:
      "Turns bodyweight movements like pull-ups, push-ups, and stair climbing into serious testosterone-stimulating resistance training. Adds progressive overload without equipment.",
    amazonUrl:
      "https://www.amazon.com/s?k=adjustable+weighted+vest+men&tag=perfectstack-20",
    notes:
      "Start with 10-20 lbs. Look for adjustable weight vests so you can progress.",
  },
  {
    id: 18,
    name: "Fabric Measuring Tape",
    category: "gym",
    priority: "essential",
    estimatedPrice: "$5 – $10",
    description:
      "For tracking waist circumference, the single most important body measurement for hormonal health. Visceral fat directly suppresses testosterone through aromatization.",
    amazonUrl:
      "https://www.amazon.com/s?k=flexible+measuring+tape+body+measurement&tag=perfectstack-20",
  },

  // ─── GYM  -  Recommended ─────────────────────────────────────────────
  {
    id: 19,
    name: "Resistance Bands Set with Handles",
    category: "gym",
    priority: "recommended",
    estimatedPrice: "$25 – $50",
    description:
      "Excellent for warm-up, mobility work, and supplementing dumbbell training. Also useful for travel so the protocol does not get interrupted.",
    amazonUrl:
      "https://www.amazon.com/s?k=resistance+bands+set+handles+home+gym&tag=perfectstack-20",
  },
  {
    id: 20,
    name: "Adjustable Weight Bench",
    category: "gym",
    priority: "recommended",
    estimatedPrice: "$80 – $200",
    description:
      "Opens up chest press, incline, and seated movements with dumbbells. Significantly expands the range of testosterone-building exercises possible at home.",
    amazonUrl:
      "https://www.amazon.com/s?k=adjustable+weight+bench+home+gym&tag=perfectstack-20",
  },
  {
    id: 21,
    name: "Foam Roller",
    category: "gym",
    priority: "recommended",
    estimatedPrice: "$20 – $40",
    description:
      "For recovery and myofascial release between training sessions. Reduces muscle soreness and cortisol, both of which impact testosterone levels.",
    amazonUrl:
      "https://www.amazon.com/s?k=foam+roller+muscle+recovery&tag=perfectstack-20",
  },
  {
    id: 22,
    name: "Jump Rope",
    category: "gym",
    priority: "recommended",
    estimatedPrice: "$15 – $30",
    description:
      "High-intensity cardio that spikes testosterone and burns visceral fat. 10 minutes of jump rope equals 30 minutes of jogging for cardiovascular benefit.",
    amazonUrl:
      "https://www.amazon.com/s?k=weighted+jump+rope+men+fitness&tag=perfectstack-20",
  },

  // ─── GYM  -  Optional ────────────────────────────────────────────────
  {
    id: 23,
    name: "Kettlebell Set",
    category: "gym",
    priority: "optional",
    estimatedPrice: "$60 – $200",
    description:
      "Kettlebell swings are one of the most effective full-body testosterone-stimulating movements. Pairs well with the dumbbell protocol for variety.",
    amazonUrl:
      "https://www.amazon.com/s?k=kettlebell+set+home+gym&tag=perfectstack-20",
  },
  {
    id: 24,
    name: "Pull-Up and Dip Station",
    category: "gym",
    priority: "optional",
    estimatedPrice: "$100 – $300",
    description:
      "Freestanding unit for pull-ups, dips, and hanging leg raises. Dips are one of the highest-output upper body testosterone movements.",
    amazonUrl:
      "https://www.amazon.com/s?k=pull+up+dip+station+freestanding&tag=perfectstack-20",
  },
];

export const CATEGORY_INFO: Record<
  EquipmentCategory,
  { label: string; intro: string }
> = {
  kitchen: {
    label: "Kitchen Equipment",
    intro:
      "One-time setup. These tools make the daily smoothies, shots, and meals in the protocol practical and sustainable. Buy the essentials first and add recommended items as you go.",
  },
  gym: {
    label: "Home Gym Equipment",
    intro:
      "Performance training is the most powerful non-pharmaceutical intervention for testosterone. These tools make the 3-day resistance protocol possible from home with no gym required.",
  },
};
