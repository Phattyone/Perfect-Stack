export interface MealPlanDay {
  dayNumber: number;
  theme: string;
  breakfast: { recipeId: number | null; name: string };
  lunch: { recipeId: number | null; name: string };
  dinner: { recipeId: number | null; name: string };
  smoothie: { recipeId: number | null; name: string };
  shot: { recipeId: number | null; name: string };
  notes: string;
}

export const MEAL_PLAN: MealPlanDay[] = [
  {
    dayNumber: 1,
    theme: "Energize and Circulate",
    breakfast: { recipeId: 16, name: "Egg and Spinach Frittata" },
    lunch: { recipeId: 18, name: "Seared Salmon + Beet Arugula Salad" },
    dinner: { recipeId: 19, name: "Garlic Butter Steak + Asparagus" },
    smoothie: { recipeId: 1, name: "NO Rocket Smoothie" },
    shot: { recipeId: 9, name: "NO Rocket Shot" },
    notes: "Focus on blood flow and nitric oxide today. Drink infused NO Performance Water throughout.",
  },
  {
    dayNumber: 2,
    theme: "Strengthen and Build",
    breakfast: { recipeId: 17, name: "Testosterone Power Bowl (breakfast size)" },
    lunch: { recipeId: 20, name: "Oyster and Shrimp Stir-Fry" },
    dinner: { recipeId: 21, name: "Turkey and Quinoa Stuffed Peppers" },
    smoothie: { recipeId: 2, name: "Testosterone Power Smoothie" },
    shot: { recipeId: 10, name: "Testosterone Igniter Shot" },
    notes: "Zinc-focused day. Oysters deliver more zinc than any supplement.",
  },
  {
    dayNumber: 3,
    theme: "Anti-Inflammatory Reset",
    breakfast: { recipeId: 32, name: "Oatmeal with Flaxseed, Banana and Honey" },
    lunch: { recipeId: 22, name: "Tuna Avocado Lettuce Wraps" },
    dinner: { recipeId: 23, name: "Lamb Chops + Garlic Roasted Vegetables" },
    smoothie: { recipeId: 5, name: "Ginger Warrior Smoothie" },
    shot: { recipeId: 11, name: "Anti-Inflammation Blast Shot" },
    notes: "Reduce inflammation that suppresses testosterone. Turmeric + ginger day.",
  },
  {
    dayNumber: 4,
    theme: "Testosterone Focus",
    breakfast: { recipeId: 26, name: "Scrambled Eggs, Spinach, Avocado" },
    lunch: { recipeId: 25, name: "Sardines on Whole Grain Toast with Tomato and Capers" },
    dinner: { recipeId: 24, name: "Chicken Thighs with Pomegranate Glaze" },
    smoothie: { recipeId: 7, name: "Morning Drive Smoothie" },
    shot: { recipeId: 12, name: "Morning Testosterone Shot" },
    notes: "All-in on testosterone support. Every meal targets hormone production.",
  },
  {
    dayNumber: 5,
    theme: "Vascular Performance",
    breakfast: { recipeId: null, name: "Greek yogurt, mixed berries, pumpkin seeds" },
    lunch: { recipeId: 18, name: "Seared Salmon + Beet Salad" },
    dinner: { recipeId: 31, name: "Grilled Salmon Salad with Beets and Walnuts" },
    smoothie: { recipeId: 3, name: "Watermelon Pump Smoothie" },
    shot: { recipeId: 13, name: "Circulation Kick Shot" },
    notes: "Blood flow and vascular health focus. Stack the watermelon and beet compounds.",
  },
  {
    dayNumber: 6,
    theme: "Longevity and Recovery",
    breakfast: { recipeId: 16, name: "Egg and Spinach Frittata" },
    lunch: { recipeId: null, name: "Grilled chicken, sweet potato, greens" },
    dinner: { recipeId: 20, name: "Oyster and Shrimp Stir-Fry" },
    smoothie: { recipeId: 6, name: "Chocolate Power Smoothie" },
    shot: { recipeId: null, name: "Sleep Optimizer Smoothie (PM)" },
    notes: "Recovery day. Evening focus on sleep quality with tart cherry and magnesium.",
  },
  {
    dayNumber: 7,
    theme: "Full Protocol Day",
    breakfast: { recipeId: 17, name: "Testosterone Power Bowl" },
    lunch: { recipeId: 22, name: "Tuna Avocado Lettuce Wraps" },
    dinner: { recipeId: 19, name: "Garlic Butter Steak + Asparagus" },
    smoothie: { recipeId: 4, name: "Berry Testosterone Blend" },
    shot: { recipeId: 9, name: "NO Rocket Shot + Morning Testosterone Shot" },
    notes: "The full stack. Every pillar hit: testosterone, nitric oxide, anti-inflammatory, and recovery.",
  },
];
