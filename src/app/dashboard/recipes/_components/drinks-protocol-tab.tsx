"use client";

const PROTOCOL = [
  {
    time: "Morning",
    action: "One performance shot before eating",
    why: "Concentrated hormonal and vascular compounds hit hardest on an empty stomach. Ginger, pomegranate, and beet nitrates absorb faster without competing food. This primes your hormonal cascade for the day.",
    icon: "☀️",
  },
  {
    time: "Throughout Day",
    action: "One fruit-infused performance water, minimum 1.5 liters",
    why: "Watermelon provides a gentle continuous stream of L-Citrulline for ongoing nitric oxide support. Staying hydrated keeps blood flowing and supplements absorbing. Think of this as your background vascular support.",
    icon: "💧",
  },
  {
    time: "Before Noon",
    action: "Green tea, 1-2 cups",
    why: "EGCG in green tea inhibits the enzyme that breaks down norepinephrine, extending your natural energy and focus. L-Theanine balances the caffeine with calm alertness. Also supports metabolic rate and fat oxidation.",
    icon: "🍵",
  },
  {
    time: "Evening (Training Days)",
    action: "Sleep Optimizer Smoothie  -  at least 3 nights per week",
    why: "Tart cherry provides natural melatonin precursors. Magnesium glycinate promotes deep sleep and muscle relaxation. Chamomile lowers cortisol. Sleep is when testosterone production peaks  -  poor sleep directly suppresses it.",
    icon: "🌙",
  },
  {
    time: "All Day",
    action: "Minimum 80 oz plain water",
    why: "Every supplement you take requires water for absorption and transport. Dehydration reduces blood volume, impairs circulation, and blunts the entire protocol. Water is the foundation everything else sits on.",
    icon: "🥤",
  },
];

export default function DrinksProtocolTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Your daily drinks protocol works alongside the supplement stacks and meal
        plan to maximize blood flow, hormone production, and recovery.
      </p>

      {PROTOCOL.map((item) => (
        <div
          key={item.time}
          className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{item.icon}</span>
            <div>
              <span className="text-sm font-bold text-yellow-600">{item.time}</span>
              <p className="text-sm text-white">{item.action}</p>
            </div>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-zinc-400">{item.why}</p>
        </div>
      ))}
    </div>
  );
}
