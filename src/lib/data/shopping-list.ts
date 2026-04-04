const TAG = "perfectstack-20";
const amzSearch = (q: string) =>
  `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${TAG}`;

export type ShoppingCategory = "proteins" | "produce" | "pantry" | "dairy-eggs";
export type Priority = "essential" | "recommended" | "optional";

export interface ShoppingItem {
  id: number;
  name: string;
  category: ShoppingCategory;
  quantity: string;
  unit: string;
  priority: Priority;
  amazonUrl?: string;
  notes?: string;
}

export const SHOPPING_LIST: ShoppingItem[] = [
  // ─── PROTEINS ──────────────────────────────────────────────────────
  { id: 1, name: "Grass-fed ground beef or bison", category: "proteins", quantity: "2", unit: "lbs", priority: "essential" },
  { id: 2, name: "Grass-fed steak (ribeye or sirloin)", category: "proteins", quantity: "1-2", unit: "lbs", priority: "essential" },
  { id: 3, name: "Wild-caught salmon fillets", category: "proteins", quantity: "2", unit: "lbs", priority: "essential" },
  { id: 4, name: "Pastured eggs", category: "proteins", quantity: "2", unit: "dozen", priority: "essential" },
  { id: 5, name: "Canned oysters", category: "proteins", quantity: "2", unit: "tins", priority: "essential", amazonUrl: amzSearch("canned oysters smoked") },
  { id: 6, name: "Large shrimp, peeled", category: "proteins", quantity: "1", unit: "lb", priority: "essential" },
  { id: 7, name: "Wild albacore tuna, canned", category: "proteins", quantity: "4", unit: "tins", priority: "essential", amazonUrl: amzSearch("wild albacore tuna canned") },
  { id: 8, name: "Ground turkey", category: "proteins", quantity: "1", unit: "lb", priority: "essential" },
  { id: 9, name: "Chicken thighs, bone-in", category: "proteins", quantity: "4-6", unit: "pieces", priority: "essential" },
  { id: 10, name: "Lamb chops", category: "proteins", quantity: "4", unit: "chops", priority: "optional" },
  { id: 11, name: "Sardines in olive oil", category: "proteins", quantity: "3-4", unit: "tins", priority: "essential", amazonUrl: amzSearch("sardines olive oil") },

  // ─── PRODUCE ───────────────────────────────────────────────────────
  { id: 12, name: "Baby spinach and kale", category: "produce", quantity: "2", unit: "large bags", priority: "essential" },
  { id: 13, name: "Arugula", category: "produce", quantity: "1", unit: "large bag", priority: "essential" },
  { id: 14, name: "Beets, raw", category: "produce", quantity: "3-4", unit: "medium", priority: "essential" },
  { id: 15, name: "Asparagus", category: "produce", quantity: "1-2", unit: "bunches", priority: "essential" },
  { id: 16, name: "Broccoli", category: "produce", quantity: "1-2", unit: "heads", priority: "essential" },
  { id: 17, name: "Garlic", category: "produce", quantity: "2", unit: "heads", priority: "essential" },
  { id: 18, name: "Fresh ginger root", category: "produce", quantity: "1", unit: "large piece", priority: "essential" },
  { id: 19, name: "Fresh turmeric root (or ground)", category: "produce", quantity: "1", unit: "piece", priority: "recommended" },
  { id: 20, name: "Avocados", category: "produce", quantity: "4-6", unit: "", priority: "essential" },
  { id: 21, name: "Watermelon", category: "produce", quantity: "1", unit: "small", priority: "recommended" },
  { id: 22, name: "Pomegranate juice, 100% pure", category: "produce", quantity: "1", unit: "large bottle", priority: "essential", amazonUrl: amzSearch("pomegranate juice 100 percent pure") },
  { id: 23, name: "Frozen mixed berries", category: "produce", quantity: "2", unit: "large bags", priority: "essential", amazonUrl: amzSearch("frozen mixed berries organic") },
  { id: 24, name: "Bananas", category: "produce", quantity: "1", unit: "bunch", priority: "essential" },
  { id: 25, name: "Lemons and limes", category: "produce", quantity: "4-6", unit: "each", priority: "essential" },
  { id: 26, name: "Bell peppers, mixed", category: "produce", quantity: "4", unit: "", priority: "essential" },
  { id: 27, name: "Cherry tomatoes", category: "produce", quantity: "1", unit: "pint", priority: "recommended" },
  { id: 28, name: "Cucumber", category: "produce", quantity: "2", unit: "", priority: "recommended" },
  { id: 29, name: "Sweet potato", category: "produce", quantity: "2", unit: "", priority: "essential" },

  // ─── PANTRY ────────────────────────────────────────────────────────
  { id: 30, name: "Extra virgin olive oil", category: "pantry", quantity: "1", unit: "liter", priority: "essential", amazonUrl: amzSearch("extra virgin olive oil organic") },
  { id: 31, name: "Coconut oil", category: "pantry", quantity: "1", unit: "jar", priority: "essential", amazonUrl: amzSearch("organic coconut oil") },
  { id: 32, name: "Coconut aminos or low-sodium soy sauce", category: "pantry", quantity: "1", unit: "bottle", priority: "essential", amazonUrl: amzSearch("coconut aminos organic") },
  { id: 33, name: "Raw honey", category: "pantry", quantity: "1", unit: "jar", priority: "essential", amazonUrl: amzSearch("raw honey organic") },
  { id: 34, name: "Raw cacao powder", category: "pantry", quantity: "1", unit: "bag", priority: "essential", amazonUrl: amzSearch("raw cacao powder organic") },
  { id: 35, name: "Maca root powder", category: "pantry", quantity: "1", unit: "bag", priority: "recommended", amazonUrl: amzSearch("maca root powder organic") },
  { id: 36, name: "Ground turmeric and black pepper", category: "pantry", quantity: "1", unit: "each", priority: "essential" },
  { id: 37, name: "Ground cinnamon", category: "pantry", quantity: "1", unit: "jar", priority: "essential" },
  { id: 38, name: "Cayenne pepper", category: "pantry", quantity: "1", unit: "jar", priority: "essential" },
  { id: 39, name: "Sea salt", category: "pantry", quantity: "1", unit: "container", priority: "essential" },
  { id: 40, name: "Quinoa", category: "pantry", quantity: "1", unit: "bag", priority: "essential", amazonUrl: amzSearch("organic quinoa") },
  { id: 41, name: "Whole grain bread", category: "pantry", quantity: "1", unit: "loaf", priority: "essential" },
  { id: 42, name: "Pumpkin seeds", category: "pantry", quantity: "1", unit: "bag", priority: "essential", amazonUrl: amzSearch("raw pumpkin seeds organic") },
  { id: 43, name: "Almonds and almond butter", category: "pantry", quantity: "1", unit: "each", priority: "essential", amazonUrl: amzSearch("almond butter natural") },
  { id: 44, name: "Ground flaxseed", category: "pantry", quantity: "1", unit: "bag", priority: "recommended", amazonUrl: amzSearch("ground flaxseed organic") },
  { id: 45, name: "Tart cherry juice", category: "pantry", quantity: "1", unit: "bottle", priority: "recommended", amazonUrl: amzSearch("tart cherry juice organic") },
  { id: 46, name: "Green tea bags", category: "pantry", quantity: "1", unit: "box", priority: "essential", amazonUrl: amzSearch("green tea organic") },

  // ─── DAIRY & EGGS ──────────────────────────────────────────────────
  { id: 47, name: "Greek yogurt, plain full-fat", category: "dairy-eggs", quantity: "2", unit: "containers", priority: "essential" },
  { id: 48, name: "Whole milk or oat milk", category: "dairy-eggs", quantity: "1", unit: "quart", priority: "essential" },
  { id: 49, name: "Grass-fed butter", category: "dairy-eggs", quantity: "1", unit: "lb", priority: "essential" },
  { id: 50, name: "Feta cheese", category: "dairy-eggs", quantity: "1", unit: "container", priority: "optional" },
];

export const CATEGORY_LABELS: Record<ShoppingCategory, string> = {
  proteins: "\uD83E\uDD69 Proteins",
  produce: "\uD83E\uDD66 Produce",
  pantry: "\uD83E\uDED9 Pantry Staples",
  "dairy-eggs": "\uD83E\uDD5A Dairy & Eggs",
};
