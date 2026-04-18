"use client";

import { isFree } from "@/lib/subscription";
import { useRecipeModal } from "@/components/recipe-modal/recipe-modal-context";

const PROTOCOL = [
  {
    time: "Morning",
    action: "One performance shot before eating",
    why: "Concentrated hormonal and vascular compounds hit hardest on an empty stomach. Ginger, pomegranate, and beet nitrates absorb faster without competing food. This primes your hormonal cascade for the day.",
    icon: "\u2600\uFE0F",
    recipeId: 10, // Testosterone Igniter Shot
  },
  {
    time: "Throughout Day",
    action: "One fruit-infused performance water, minimum 1.5 liters",
    why: "Watermelon provides a gentle continuous stream of L-Citrulline for ongoing nitric oxide support. Staying hydrated keeps blood flowing and supplements absorbing. Think of this as your background vascular support.",
    icon: "\uD83D\uDCA7",
    recipeId: 14, // NO Performance Water
  },
  {
    time: "Before Noon",
    action: "Green tea, 1-2 cups",
    why: "EGCG in green tea inhibits the enzyme that breaks down norepinephrine, extending your natural energy and focus. L-Theanine balances the caffeine with calm alertness. Also supports metabolic rate and fat oxidation.",
    icon: "\uD83C\uDF75",
    recipeId: 28, // Pomegranate Green Tea
  },
  {
    time: "Evening (Training Days)",
    action: "Sleep Optimizer Smoothie - at least 3 nights per week",
    why: "Tart cherry provides natural melatonin precursors. Magnesium glycinate promotes deep sleep and muscle relaxation. Chamomile lowers cortisol. Sleep is when testosterone production peaks - poor sleep directly suppresses it.",
    icon: "\uD83C\uDF19",
    recipeId: 8, // Sleep Optimizer Smoothie
  },
  {
    time: "All Day",
    action: "Minimum 80 oz plain water",
    why: "Every supplement you take requires water for absorption and transport. Dehydration reduces blood volume, impairs circulation, and blunts the entire protocol. Water is the foundation everything else sits on.",
    icon: "\uD83E\uDD64",
    recipeId: null,
  },
];

export default function DrinksProtocolTab({ subscriptionStatus }: { subscriptionStatus: string }) {
  const userIsFree = isFree(subscriptionStatus);
  const { openRecipe } = useRecipeModal();

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Your daily drinks protocol works alongside the supplement stacks and meal
        plan to maximize blood flow, hormone production, and recovery.
      </p>

      {PROTOCOL.map((item, index) => (
        <div key={item.time} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{item.icon}</span>
            <div>
              <span className="text-sm font-bold text-yellow-600">{item.time}</span>
              <p className="text-sm text-white">{item.action}</p>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">{item.why}</p>

          {item.recipeId && (
            !userIsFree || index === 0 ? (
              <button
                type="button"
                onClick={() => openRecipe(item.recipeId!)}
                className="mt-1 text-[10px] text-yellow-600 hover:text-yellow-500"
              >
                View recipe
              </button>
            ) : (
              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed text-[10px] text-yellow-600 opacity-50"
                >
                  View recipe
                </button>
                <span className="text-xs text-yellow-400/70">Available in Foundation plan</span>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
}
