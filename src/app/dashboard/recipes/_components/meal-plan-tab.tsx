"use client";

import { useState } from "react";
import { MEAL_PLAN } from "@/lib/data/meal-plan";

function MealRow({ label, name }: { label: string; name: string }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="w-20 shrink-0 text-xs font-medium text-zinc-500">{label}</span>
      <span className="text-sm text-zinc-300">{name}</span>
    </div>
  );
}

export default function MealPlanTab() {
  const [openDay, setOpenDay] = useState<number | null>(1);

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        This is your Week 1 template. Repeat or swap recipes as you move through
        the 8 weeks.
      </p>

      {MEAL_PLAN.map((day) => {
        const isOpen = openDay === day.dayNumber;
        return (
          <div key={day.dayNumber} className="rounded-lg border border-zinc-800">
            <button
              type="button"
              onClick={() => setOpenDay(isOpen ? null : day.dayNumber)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <span className="text-sm font-bold text-yellow-600">
                  Day {day.dayNumber}
                </span>
                <span className="ml-2 text-sm text-zinc-400"> -  {day.theme}</span>
              </div>
              <svg
                className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="border-t border-zinc-800 px-4 py-3">
                <MealRow label="Breakfast" name={day.breakfast.name} />
                <MealRow label="Lunch" name={day.lunch.name} />
                <MealRow label="Dinner" name={day.dinner.name} />
                <MealRow label="Smoothie" name={day.smoothie.name} />
                <MealRow label="Shot" name={day.shot.name} />

                {day.notes && (
                  <p className="mt-2 text-xs italic text-zinc-500">{day.notes}</p>
                )}

                <div className="mt-3 rounded border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-xs text-zinc-500">
                  <span className="font-medium text-yellow-600">Daily drinks:</span>{" "}
                  1 performance shot AM · infused water throughout day · green tea
                  before noon
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
