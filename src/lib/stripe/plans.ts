// To grant test account access: go to Supabase Table Editor -> profiles table
// Find the user row and set subscription_status to 'foundation' or 'ultimate'
// This bypasses Stripe payment for testing purposes

export const PLANS = {
  free: {
    name: "Free",
    description: "Get started with the essentials",
    monthlyPrice: 0,
    annualPrice: 0,
    monthlyPriceId: null as string | null,
    annualPriceId: null as string | null,
    features: [
      "Stack A: Foundation Protocol preview",
      "Last 2 Stack A supplements blurred - upgrade to unlock",
      "Days 1-3 of the 7-day meal plan only",
      "First recipe preview per tab",
      "Baseline health checklist",
      "Dashboard overview with upgrade prompts",
    ],
    limits: {
      stackAccess: ["stack_a"],
      guideAccess: false,
      progressTracking: false,
      recipes: false,
    },
  },
  foundation: {
    name: "Foundation Protocol",
    description: "The full system personalized to you",
    monthlyPrice: 14,
    annualPrice: 120,
    monthlyPriceId: null as string | null,
    annualPriceId: null as string | null,
    features: [
      "Full Stack Builder with personalized dosing",
      "Stack Safety Check - supplement interaction alerts",
      "Multivitamin safety adjustments - NIH upper limit protection",
      "Supplement cycling tracker with phase reminders",
      "All 5 stacks unlocked (Stacks A through E)",
      "Performance recipe library - meals, smoothies, shots, and drinks",
      "7-day starter meal plan with shopping list",
      "Meal Maker - personalized daily meals for weeks 2 through 8 (7 days)",
      "Exercise and training program",
      "Sleep and recovery protocols",
      "Progress tracker with weekly check-ins and trend charts",
      "Equipment guide with Amazon links",
      "Reminders and notifications",
      "Perfect Chat - 7 messages per day",
    ],
    limits: {
      stackAccess: [
        "stack_a",
        "stack_ab",
        "stack_abc",
        "stack_abcd",
        "stack_abcde",
      ],
      guideAccess: false,
      progressTracking: true,
      recipes: true,
    },
  },
  complete: {
    name: "Ultimate Protocol",
    description: "Every edge. The full system.",
    monthlyPrice: 24,
    annualPrice: 199,
    monthlyPriceId: null as string | null,
    annualPriceId: null as string | null,
    features: [
      "Everything in Foundation Protocol",
      "My Journal - 8-week photo journal with progress scores",
      "Pelvic floor and Kegels 8-week program",
      "Your Medical Team - specialist referrals and telehealth",
      "Meal Maker - full 8-week meal generator (days 8 through 56)",
      "Perfect Chat - 50 messages per day",
      "Digital Guide add-on available for purchase",
      "Early access to new features and advanced content",
    ],
    limits: {
      stackAccess: [
        "stack_a",
        "stack_ab",
        "stack_abc",
        "stack_abcd",
        "stack_abcde",
      ],
      guideAccess: true,
      progressTracking: true,
      recipes: true,
    },
  },
};

export type PlanKey = keyof typeof PLANS;
