"use client";

import { useState } from "react";
import { CYCLING_PROTOCOLS } from "@/lib/data/supplement-cycling";
import {
  saveCyclingSettings,
  type CyclingSettings,
} from "../cycling-actions";

interface CyclingRemindersProps {
  userId: string;
  initialSettings: CyclingSettings | null;
}

interface CyclePosition {
  phase: "on" | "off";
  dayInPhase: number;
  totalPhaseDays: number;
  daysRemaining: number;
}

function getCyclePosition(
  startDateStr: string,
  onWeeks: number,
  offWeeks: number
): CyclePosition | null {
  const startDate = new Date(startDateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  const daysSinceStart = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceStart < 0) return null; // Start date is in the future

  const totalCycleDays = (onWeeks + offWeeks) * 7;
  const dayInCycle = daysSinceStart % totalCycleDays;
  const onDays = onWeeks * 7;

  if (dayInCycle < onDays) {
    return {
      phase: "on",
      dayInPhase: dayInCycle,
      totalPhaseDays: onDays,
      daysRemaining: onDays - dayInCycle,
    };
  }

  const dayInOff = dayInCycle - onDays;
  const offDays = offWeeks * 7;
  return {
    phase: "off",
    dayInPhase: dayInOff,
    totalPhaseDays: offDays,
    daysRemaining: offDays - dayInOff,
  };
}

export default function CyclingReminders({
  userId,
  initialSettings,
}: CyclingRemindersProps) {
  const [settings, setSettings] = useState<CyclingSettings>(
    initialSettings ?? {}
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function setStartDate(supplementId: number, date: string) {
    setSettings((prev) => ({
      ...prev,
      [String(supplementId)]: { startDate: date },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const result = await saveCyclingSettings(userId, settings);
    setSaving(false);
    if ("error" in result) {
      setSaveError(result.error);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="overflow-hidden rounded-lg bg-zinc-800">
      {/* Header */}
      <div className="border-b border-zinc-700 px-5 py-3">
        <h3 className="text-sm font-semibold text-zinc-200">
          🔄&nbsp;&nbsp;Supplement Cycling Reminders
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500">
          Track on/off cycles for supplements that require periodic breaks to
          maintain effectiveness.
        </p>
      </div>

      {/* Protocol rows */}
      <div className="divide-y divide-zinc-700/50">
        {CYCLING_PROTOCOLS.map((protocol) => {
          const key = String(protocol.supplementId);
          const startDate = settings[key]?.startDate ?? "";
          const position = startDate
            ? getCyclePosition(startDate, protocol.onWeeks, protocol.offWeeks)
            : null;
          const totalCycleDays = (protocol.onWeeks + protocol.offWeeks) * 7;
          const onFraction = protocol.onWeeks / (protocol.onWeeks + protocol.offWeeks);

          // Marker position as percentage of total cycle bar
          const markerPct =
            position !== null
              ? position.phase === "on"
                ? (position.dayInPhase / totalCycleDays) * 100
                : ((protocol.onWeeks * 7 + position.dayInPhase) / totalCycleDays) * 100
              : null;

          return (
            <div key={protocol.supplementId} className="px-5 py-4">
              {/* Supplement name + stack badge */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-200">
                    {protocol.shortName}
                  </span>
                  <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400">
                    Stack {protocol.stack}
                  </span>
                </div>
                <span className="text-xs text-zinc-500">
                  {protocol.onWeeks}wk on / {protocol.offWeeks}wk off
                </span>
              </div>

              {/* Reason */}
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">
                {protocol.reason}
              </p>

              {/* Start date picker */}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="text-xs text-zinc-400">
                  Cycle start date:
                </label>
                <input
                  type="date"
                  value={startDate}
                  max={today}
                  onChange={(e) =>
                    setStartDate(protocol.supplementId, e.target.value)
                  }
                  className="rounded border border-zinc-600 bg-zinc-700 px-2 py-1 text-xs text-zinc-200 focus:border-yellow-500 focus:outline-none"
                />
              </div>

              {/* Future start date notice */}
              {startDate && position === null && (
                <p className="mt-2 text-xs text-zinc-500">
                  Start date is in the future — cycle tracking begins on that
                  date.
                </p>
              )}

              {/* Cycle position */}
              {position && (
                <div className="mt-3">
                  {/* Phase label + days remaining */}
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1">
                    <span
                      className={`text-xs font-semibold ${
                        position.phase === "on"
                          ? "text-yellow-400"
                          : "text-zinc-400"
                      }`}
                    >
                      {position.phase === "on" ? "🟢 ON phase" : "⏸️ OFF phase"}
                      {" — "}day {position.dayInPhase + 1} of{" "}
                      {position.totalPhaseDays}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {position.daysRemaining} day
                      {position.daysRemaining !== 1 ? "s" : ""} remaining
                    </span>
                  </div>

                  {/* Progress bar: ON segment + OFF segment */}
                  <div className="relative">
                    <div className="flex h-3 w-full overflow-hidden rounded-full">
                      <div
                        className="h-full bg-yellow-600"
                        style={{ width: `${onFraction * 100}%` }}
                      />
                      <div
                        className="h-full bg-zinc-600"
                        style={{ width: `${(1 - onFraction) * 100}%` }}
                      />
                    </div>

                    {/* Position marker */}
                    {markerPct !== null && (
                      <div
                        className="absolute top-0 h-3 w-0.5 rounded-full bg-white shadow"
                        style={{ left: `calc(${markerPct}% - 1px)` }}
                      />
                    )}
                  </div>

                  {/* Bar labels */}
                  <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
                    <span>ON ({protocol.onWeeks}wk)</span>
                    <span>OFF ({protocol.offWeeks}wk)</span>
                  </div>
                </div>
              )}

              {/* Prompt if no date set */}
              {!startDate && (
                <p className="mt-2 text-xs italic text-zinc-600">
                  Set a start date to track your cycle position.
                </p>
              )}

              {/* Notes */}
              {protocol.notes && (
                <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">
                  💡 {protocol.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Save button */}
      <div className="border-t border-zinc-700 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-yellow-500 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Cycling Settings"}
          </button>
          {saved && (
            <span className="text-sm font-medium text-yellow-500">✓ Saved</span>
          )}
          {saveError && (
            <span className="text-sm text-red-400">Error: {saveError}</span>
          )}
        </div>
        <p className="mt-2 text-xs text-zinc-600">
          Cycling dates are saved to your profile and sync with the Perfect
          Stack mobile app.
        </p>
      </div>
    </div>
  );
}
