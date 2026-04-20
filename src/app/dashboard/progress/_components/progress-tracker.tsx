"use client";

import { useState } from "react";
import Link from "next/link";
import type { BaselineData, WeeklyEntryData, ProgressData } from "@/lib/types/progress";
import BaselineForm from "./baseline-form";
import BaselineSummary from "./baseline-summary";
import WeeklyForm from "./weekly-form";
import ProgressOverview from "./progress-overview";
import { isFree } from "@/lib/subscription";

function LockedTabContent({ featureName }: { featureName: string }) {
  return (
    <Link
      href="/pricing"
      className="flex flex-col items-center justify-center py-16 text-center transition hover:opacity-90"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-600/10 text-3xl">
        🔒
      </span>
      <h3 className="mt-4 text-lg font-semibold text-white">{featureName}</h3>
      <p className="mx-auto mt-2 max-w-xs text-sm text-zinc-400">
        Foundation plan required to access this feature.
      </p>
      <span className="mt-6 rounded-lg bg-yellow-500 px-6 py-2.5 text-sm font-semibold text-black">
        Upgrade to Foundation
      </span>
    </Link>
  );
}

type Tab = "baseline" | "weekly" | "progress";

const TABS: { key: Tab; label: string }[] = [
  { key: "baseline", label: "Baseline" },
  { key: "weekly", label: "Weekly Check-In" },
  { key: "progress", label: "My Progress" },
];

interface ProgressTrackerProps {
  initialData: ProgressData;
  userId: string;
  subscriptionStatus: string;
}

export default function ProgressTracker({ initialData, userId, subscriptionStatus }: ProgressTrackerProps) {
  const userIsFree = isFree(subscriptionStatus);
  const [activeTab, setActiveTab] = useState<Tab>("baseline");
  const [baseline, setBaseline] = useState<BaselineData | null>(initialData.baseline);
  const [entries, setEntries] = useState<WeeklyEntryData[]>(initialData.weeklyEntries);
  const [editing, setEditing] = useState(false);

  function handleBaselineSaved(data: BaselineData) {
    setBaseline(data);
    setEditing(false);
  }

  function handleWeeklySaved(entry: WeeklyEntryData) {
    setEntries((prev) => {
      const filtered = prev.filter((e) => e.week_number !== entry.week_number);
      return [...filtered, entry].sort((a, b) => a.week_number - b.week_number);
    });
  }

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
        {activeTab === "baseline" && (
          <>
            {baseline && !editing ? (
              <BaselineSummary baseline={baseline} onEdit={() => setEditing(true)} />
            ) : (
              <BaselineForm
                existing={baseline}
                userId={userId}
                onSaved={handleBaselineSaved}
              />
            )}
          </>
        )}

        {activeTab === "weekly" && (
          userIsFree
            ? <LockedTabContent featureName="Weekly Check-In" />
            : <WeeklyForm
                baseline={baseline}
                existingEntries={entries}
                userId={userId}
                onSaved={handleWeeklySaved}
              />
        )}

        {activeTab === "progress" && (
          userIsFree
            ? <LockedTabContent featureName="My Progress" />
            : <ProgressOverview baseline={baseline} entries={entries} subscriptionStatus={subscriptionStatus} />
        )}
      </div>
    </div>
  );
}
