"use client";

import { useState } from "react";
import RecipesTab from "./recipes-tab";
import MealPlanTab from "./meal-plan-tab";
import ShoppingListTab from "./shopping-list-tab";
import DrinksProtocolTab from "./drinks-protocol-tab";

type Tab = "recipes" | "plan" | "shopping" | "drinks";

const TABS: { key: Tab; label: string }[] = [
  { key: "plan", label: "7-Day Plan" },
  { key: "recipes", label: "Recipes" },
  { key: "drinks", label: "Daily Drinks" },
  { key: "shopping", label: "Shopping List" },
];

interface RecipesViewProps {
  subscriptionStatus: string;
}

export default function RecipesView({ subscriptionStatus }: RecipesViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("plan");

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex gap-6 border-b border-zinc-800">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-medium transition ${
              activeTab === tab.key
                ? "border-b-2 border-yellow-600 text-yellow-500"
                : "text-zinc-400 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        {activeTab === "recipes" && <RecipesTab subscriptionStatus={subscriptionStatus} />}
        {activeTab === "plan" && <MealPlanTab subscriptionStatus={subscriptionStatus} />}
        {activeTab === "drinks" && <DrinksProtocolTab />}
        {activeTab === "shopping" && <ShoppingListTab subscriptionStatus={subscriptionStatus} />}
      </div>
    </div>
  );
}
