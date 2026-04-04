"use client";

import { useState, useMemo } from "react";
import {
  EQUIPMENT,
  CATEGORY_INFO,
  type EquipmentCategory,
  type EquipmentItem,
  type Priority,
} from "@/lib/data/equipment";

type Tab = EquipmentCategory;

const TABS: { key: Tab; label: string }[] = [
  { key: "kitchen", label: "Kitchen Equipment" },
  { key: "gym", label: "Home Gym Equipment" },
];

const PRIORITY_ORDER: Priority[] = ["essential", "recommended", "optional"];

const PRIORITY_BADGE: Record<Priority, string> = {
  essential: "bg-yellow-600 text-black",
  recommended: "border border-yellow-600 text-yellow-600 bg-transparent",
  optional: "border border-zinc-600 text-zinc-400 bg-transparent",
};

const CARD_BORDER: Record<Priority, string> = {
  essential: "border-yellow-600/30",
  recommended: "border-zinc-700",
  optional: "border-zinc-800",
};

function EquipmentCard({ item }: { item: EquipmentItem }) {
  return (
    <div
      className={`rounded-lg border bg-zinc-900 p-4 ${CARD_BORDER[item.priority]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-sm font-bold text-white">{item.name}</h4>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${PRIORITY_BADGE[item.priority]}`}
        >
          {item.priority}
        </span>
      </div>

      <span className="mt-1 block text-sm font-semibold text-yellow-500">
        {item.estimatedPrice}
      </span>

      <p className="mt-2 text-xs leading-relaxed text-zinc-300">
        {item.description}
      </p>

      {item.notes && (
        <p className="mt-1.5 text-xs italic text-zinc-400">{item.notes}</p>
      )}

      <a
        href={item.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 rounded border border-yellow-600/50 px-3 py-1.5 text-xs font-medium text-yellow-600 transition hover:border-yellow-500 hover:text-yellow-500"
      >
        Buy on Amazon
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  );
}

export default function EquipmentView() {
  const [activeTab, setActiveTab] = useState<Tab>("kitchen");

  const info = CATEGORY_INFO[activeTab];
  const items = useMemo(
    () => EQUIPMENT.filter((e) => e.category === activeTab),
    [activeTab]
  );

  // Essential cost range for display
  const essentialCost = useMemo(() => {
    const essentials = EQUIPMENT.filter((e) => e.priority === "essential");
    // Parse min/max from price strings like "$30 – $50"
    let totalMin = 0;
    let totalMax = 0;
    essentials.forEach((e) => {
      const nums = e.estimatedPrice.match(/\d+/g);
      if (nums && nums.length >= 2) {
        totalMin += Number(nums[0]);
        totalMax += Number(nums[1]);
      } else if (nums && nums.length === 1) {
        totalMin += Number(nums[0]);
        totalMax += Number(nums[0]);
      }
    });
    return { min: totalMin, max: totalMax };
  }, []);

  return (
    <div>
      {/* Essential setup cost */}
      <div className="mb-6 rounded-lg border border-yellow-600/30 bg-zinc-900 p-4 text-center">
        <span className="block text-xs uppercase tracking-wider text-zinc-500">
          Essential Setup Cost
        </span>
        <span className="mt-1 block text-xl font-bold text-yellow-500">
          ${essentialCost.min} – ${essentialCost.max}
        </span>
        <span className="text-xs text-zinc-500">one-time investment</span>
      </div>

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

      {/* Intro */}
      <p className="mb-6 text-sm text-zinc-400">{info.intro}</p>

      {/* Items grouped by priority */}
      <div className="space-y-6">
        {PRIORITY_ORDER.map((priority) => {
          const group = items.filter((i) => i.priority === priority);
          if (group.length === 0) return null;
          return (
            <div key={priority}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-500">
                {priority}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {group.map((item) => (
                  <EquipmentCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
