"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SHOPPING_LIST,
  CATEGORY_LABELS,
  type ShoppingCategory,
} from "@/lib/data/shopping-list";
import { isFree } from "@/lib/subscription";

const CATEGORY_ORDER: ShoppingCategory[] = [
  "proteins",
  "produce",
  "pantry",
  "dairy-eggs",
];

const PRIORITY_DOT: Record<string, string> = {
  essential: "bg-red-500",
  recommended: "bg-yellow-500",
  optional: "bg-zinc-500",
};

interface ShoppingListTabProps {
  subscriptionStatus: string;
}

export default function ShoppingListTab({ subscriptionStatus }: ShoppingListTabProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const userIsFree = isFree(subscriptionStatus);

  if (userIsFree) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-600/10 text-3xl">
          🔒
        </span>
        <h3 className="mt-4 text-lg font-semibold text-white">Shopping List</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm text-zinc-400">
          The curated Week 1 shopping list is included with the Foundation plan.
        </p>
        <Link
          href="/pricing"
          className="mt-6 rounded-lg bg-yellow-500 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
        >
          Upgrade to Foundation
        </Link>
      </div>
    );
  }

  function toggle(id: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Delivery services */}
      <div className="flex flex-wrap gap-2">
        {[
          { name: "Order on Instacart", url: "https://www.instacart.com" },
          { name: "Order on DoorDash", url: "https://www.doordash.com" },
          { name: "Order on Uber Eats", url: "https://www.ubereats.com" },
        ].map((svc) => (
          <a
            key={svc.name}
            href={svc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-yellow-600 hover:text-white"
          >
            {svc.name}
          </a>
        ))}
      </div>

      <p className="text-xs text-zinc-500">
        Prefer to shop local? Print this list or screenshot it. Buying online?
        Use the Amazon links for pantry items and delivery services for fresh
        ingredients.
      </p>

      {/* Category sections */}
      {CATEGORY_ORDER.map((cat) => {
        const items = SHOPPING_LIST.filter((i) => i.category === cat);
        return (
          <div key={cat}>
            <h3 className="mb-2 text-sm font-bold text-yellow-600">
              <span className="text-[1.25em]">{CATEGORY_LABELS[cat]}</span>
            </h3>
            <div className="space-y-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 rounded px-3 py-2 ${
                    checked.has(item.id) ? "bg-zinc-800/50 opacity-50" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked.has(item.id)}
                    onChange={() => toggle(item.id)}
                    className="h-4 w-4 shrink-0 rounded border-zinc-600 bg-zinc-800 accent-yellow-600"
                  />
                  <div className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[item.priority]}`} />
                  <span
                    className={`flex-1 text-sm ${
                      checked.has(item.id) ? "text-zinc-500 line-through" : "text-zinc-300"
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="shrink-0 text-xs text-zinc-500">
                    {item.quantity} {item.unit}
                  </span>
                  {item.amazonUrl && (
                    <a
                      href={item.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[10px] font-medium text-yellow-600 hover:text-yellow-500"
                    >
                      Amazon
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Legend + print */}
      <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
        <div className="flex gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-500" /> Essential
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-yellow-500" /> Recommended
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-zinc-500" /> Optional
          </span>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-md border border-yellow-600/50 px-4 py-2 text-xs font-semibold text-yellow-600 transition hover:bg-yellow-600/10"
        >
          Print Shopping List
        </button>
      </div>
    </div>
  );
}
