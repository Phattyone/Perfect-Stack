"use client";

import { useState } from "react";
import RecipesTab from "./recipes-tab";
import MealPlanTab from "./meal-plan-tab";
import ShoppingListTab from "./shopping-list-tab";
import DrinksProtocolTab from "./drinks-protocol-tab";
import MealMakerTab from "./meal-maker-tab";
import { isFoundation } from "@/lib/subscription";

type Tab = "recipes" | "plan" | "shopping" | "drinks" | "maker";

const ALL_TABS: { key: Tab; label: string; paidOnly?: boolean }[] = [
  { key: "plan",     label: "7-Day Plan" },
  { key: "maker",    label: "Meal Maker", paidOnly: true },
  { key: "recipes",  label: "Recipes" },
  { key: "drinks",   label: "Daily Drinks" },
  { key: "shopping", label: "Shopping List" },
];

interface RecipesViewProps {
  subscriptionStatus: string;
  userId: string;
}

export default function RecipesView({ subscriptionStatus, userId }: RecipesViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("plan");

  const visibleTabs = ALL_TABS.filter(
    (tab) => !tab.paidOnly || isFoundation(subscriptionStatus)
  );

  return (
    <div>
      {/* Tabs */}
      <div className="mb-6 flex gap-6 overflow-x-auto border-b border-zinc-800">
        {visibleTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`shrink-0 pb-3 text-sm font-medium transition ${
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
        {activeTab === "recipes"  && <RecipesTab subscriptionStatus={subscriptionStatus} />}
        {activeTab === "plan"     && <MealPlanTab subscriptionStatus={subscriptionStatus} />}
        {activeTab === "drinks"   && <DrinksProtocolTab subscriptionStatus={subscriptionStatus} />}
        {activeTab === "shopping" && <ShoppingListTab subscriptionStatus={subscriptionStatus} />}
        {activeTab === "maker"    && isFoundation(subscriptionStatus) && (
          <MealMakerTab subscriptionStatus={subscriptionStatus} userId={userId} />
        )}
      </div>
    </div>
  );
}
