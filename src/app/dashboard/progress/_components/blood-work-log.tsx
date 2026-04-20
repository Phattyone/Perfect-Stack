"use client";

import { useState } from "react";
import {
  BLOOD_WORK_MARKERS,
  MARKER_CATEGORIES,
  type BloodWorkMarker,
} from "@/lib/data/blood-work-markers";
import {
  saveBloodWorkEntry,
  deleteBloodWorkEntry,
  type BloodWorkEntry,
} from "../blood-work-actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BloodWorkLogProps {
  userId: string;
  initialEntries: BloodWorkEntry[];
}

type MarkerStatus = "optimal" | "normal" | "high" | "low" | "none";

// ─── Status helpers ───────────────────────────────────────────────────────────

function getStatus(marker: BloodWorkMarker, value: number | null | undefined): MarkerStatus {
  if (value == null) return "none";
  const { lowRange, highRange, optimalLow, optimalHigh } = marker;

  // Check if within optimal range
  const aboveOptimalLow = optimalLow === null || value >= optimalLow;
  const belowOptimalHigh = optimalHigh === null || value <= optimalHigh;
  if (aboveOptimalLow && belowOptimalHigh) return "optimal";

  // Check if within normal range
  const aboveNormalLow = lowRange === null || value >= lowRange;
  const belowNormalHigh = highRange === null || value <= highRange;
  if (aboveNormalLow && belowNormalHigh) return "normal";

  // Outside normal range
  if (highRange !== null && value > highRange) return "high";
  return "low";
}

const STATUS_DOT: Record<MarkerStatus, string> = {
  optimal: "bg-green-500",
  normal: "bg-yellow-500",
  high: "bg-red-500",
  low: "bg-red-500",
  none: "bg-zinc-600",
};

const STATUS_PILL: Record<MarkerStatus, string> = {
  optimal: "border border-green-500/40 bg-green-500/15 text-green-400",
  normal:  "border border-yellow-500/40 bg-yellow-500/15 text-yellow-400",
  high:    "border border-red-500/40 bg-red-500/15 text-red-400",
  low:     "border border-red-500/40 bg-red-500/15 text-red-400",
  none:    "border border-zinc-700 bg-zinc-800 text-zinc-500",
};

const STATUS_LABEL: Record<MarkerStatus, string> = {
  optimal: "Optimal",
  normal:  "Normal",
  high:    "High",
  low:     "Low",
  none:    "",
};

// ─── Range formatting ─────────────────────────────────────────────────────────

function formatRange(marker: BloodWorkMarker): string {
  const parts: string[] = [];

  if (marker.lowRange !== null && marker.highRange !== null) {
    parts.push(`Normal: ${marker.lowRange}–${marker.highRange}`);
  } else if (marker.lowRange !== null && marker.highRange === null) {
    parts.push(`Normal: ≥${marker.lowRange}`);
  } else if (marker.lowRange === null && marker.highRange !== null) {
    parts.push(`Normal: <${marker.highRange}`);
  }

  if (marker.optimalLow !== null && marker.optimalHigh !== null) {
    parts.push(`Optimal: ${marker.optimalLow}–${marker.optimalHigh}`);
  } else if (marker.optimalLow !== null && marker.optimalHigh === null) {
    parts.push(`Optimal: ≥${marker.optimalLow}`);
  } else if (marker.optimalLow === null && marker.optimalHigh !== null) {
    parts.push(`Optimal: <${marker.optimalHigh}`);
  }

  return parts.join(" | ");
}

// ─── Date formatting ──────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  // Parse as local date to avoid timezone offset issues
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year}`;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function TrashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ─── Entry card ───────────────────────────────────────────────────────────────

function EntryCard({
  entry,
  onDelete,
  deleting,
}: {
  entry: BloodWorkEntry;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  const numberMarkers = BLOOD_WORK_MARKERS.filter(
    (m) => m.type === "number" && (entry as unknown as Record<string, unknown>)[m.key] != null
  );
  const booleanMarkers = BLOOD_WORK_MARKERS.filter(
    (m) => m.type === "boolean" && (entry as unknown as Record<string, unknown>)[m.key] != null
  );
  const hasAnyMarker = numberMarkers.length > 0 || booleanMarkers.length > 0;

  return (
    <div className="border-b border-zinc-800 last:border-b-0">
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-white">{entry.label}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{formatDate(entry.entry_date)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {confirming ? (
            <>
              <button
                type="button"
                onClick={() => { onDelete(entry.id!); setConfirming(false); }}
                disabled={deleting}
                className="rounded bg-red-700/30 px-2.5 py-1 text-xs font-medium text-red-400 transition hover:bg-red-700/50 disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded bg-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-300 transition hover:bg-zinc-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="text-zinc-500 transition hover:text-red-400"
              title="Delete entry"
            >
              <TrashIcon />
            </button>
          )}
        </div>
      </div>

      {/* Marker results */}
      {hasAnyMarker ? (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
            {numberMarkers.map((marker) => {
              const value = (entry as unknown as Record<string, unknown>)[marker.key] as number;
              const status = getStatus(marker, value);
              return (
                <div key={marker.key} className="flex items-center gap-2 border-b border-zinc-800/50 py-1.5 last:border-0">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_DOT[status]}`} />
                  <span className="min-w-0 flex-1 truncate text-xs text-zinc-400">{marker.label}</span>
                  <span className="shrink-0 text-xs font-medium text-zinc-200">
                    {value} {marker.unit}
                  </span>
                </div>
              );
            })}
            {booleanMarkers.map((marker) => {
              const value = (entry as unknown as Record<string, unknown>)[marker.key] as boolean;
              return (
                <div key={marker.key} className="flex items-center gap-2 border-b border-zinc-800/50 py-1.5 last:border-0">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${value ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="min-w-0 flex-1 truncate text-xs text-zinc-400">{marker.label}</span>
                  <span className={`shrink-0 text-xs font-medium ${value ? "text-green-400" : "text-red-400"}`}>
                    {value ? "Normal" : "Abnormal"}
                  </span>
                </div>
              );
            })}
          </div>
          {entry.notes && (
            <p className="mt-2 text-xs italic text-zinc-500">{entry.notes}</p>
          )}
        </div>
      ) : (
        <p className="px-4 pb-4 text-xs text-zinc-600">No markers entered for this panel.</p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BloodWorkLog({ userId, initialEntries }: BloodWorkLogProps) {
  const today = new Date().toISOString().split("T")[0];

  const [view, setView] = useState<"log" | "form">("log");
  const [entries, setEntries] = useState<BloodWorkEntry[]>(initialEntries);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formLabel, setFormLabel] = useState("Blood Work Entry");
  const [formDate, setFormDate] = useState(today);
  const [formNotes, setFormNotes] = useState("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formBooleans, setFormBooleans] = useState<Record<string, boolean | null>>({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(Object.keys(MARKER_CATEGORIES))
  );
  const [expandedInfo, setExpandedInfo] = useState<Set<string>>(new Set());

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function toggleSection(cat: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function toggleInfo(key: string) {
    setExpandedInfo((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function resetForm() {
    setFormLabel("Blood Work Entry");
    setFormDate(today);
    setFormNotes("");
    setFormValues({});
    setFormBooleans({});
    setExpandedSections(new Set(Object.keys(MARKER_CATEGORIES)));
    setExpandedInfo(new Set());
    setError(null);
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────

  async function handleSave() {
    setSaving(true);
    setError(null);

    const entry: BloodWorkEntry = {
      entry_date: formDate,
      label: formLabel.trim() || "Blood Work Entry",
      notes: formNotes.trim() || null,
    };

    for (const marker of BLOOD_WORK_MARKERS) {
      if (marker.type === "number") {
        const str = formValues[marker.key];
        if (str && str.trim() !== "") {
          const num = parseFloat(str);
          (entry as unknown as Record<string, unknown>)[marker.key] = isNaN(num) ? null : num;
        } else {
          (entry as unknown as Record<string, unknown>)[marker.key] = null;
        }
      } else {
        const bool = formBooleans[marker.key];
        (entry as unknown as Record<string, unknown>)[marker.key] = bool ?? null;
      }
    }

    const result = await saveBloodWorkEntry(userId, entry);
    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.data) {
      setEntries((prev) =>
        [...prev, result.data!].sort(
          (a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime()
        )
      );
      resetForm();
      setView("log");
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteBloodWorkEntry(id, userId);
    setDeletingId(null);

    if (result.error) {
      setError(result.error);
      return;
    }
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  // ── LOG VIEW ──────────────────────────────────────────────────────────────────

  if (view === "log") {
    const sorted = [...entries].reverse();

    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <h3 className="text-sm font-semibold text-yellow-500">Blood Work Log</h3>
          <button
            type="button"
            onClick={() => setView("form")}
            className="rounded-md bg-yellow-600 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-yellow-500"
          >
            Add Entry
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-3 rounded border border-red-500/30 bg-red-500/10 px-3 py-2">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-zinc-500">
              No blood work entries yet. Add your first entry to start tracking your markers over time.
            </p>
          </div>
        ) : (
          <div>
            {sorted.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onDelete={handleDelete}
                deleting={deletingId === entry.id}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── FORM VIEW ─────────────────────────────────────────────────────────────────

  const categoryKeys = Object.keys(MARKER_CATEGORIES) as Array<keyof typeof MARKER_CATEGORIES>;

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        type="button"
        onClick={() => { resetForm(); setView("log"); }}
        className="inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-zinc-300"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blood Work Log
      </button>

      {/* Medical disclaimer */}
      <div className="rounded border-l-4 border-yellow-500 bg-zinc-800 p-3">
        <p className="text-xs text-zinc-400">
          Blood work values are for personal tracking only. Always consult your healthcare
          provider to interpret your results and make medical decisions.
        </p>
      </div>

      {/* Entry metadata */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Entry Label</label>
            <input
              type="text"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              placeholder="e.g. Baseline - Week 1"
              className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-yellow-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-400">Date</label>
            <input
              type="date"
              value={formDate}
              max={today}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-yellow-600 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Marker sections */}
      {categoryKeys.map((cat) => {
        const markers = BLOOD_WORK_MARKERS.filter((m) => m.category === cat);
        const isExpanded = expandedSections.has(cat);

        return (
          <div key={cat} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
            {/* Section header */}
            <button
              type="button"
              onClick={() => toggleSection(cat)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-zinc-800/50"
            >
              <span className="text-sm font-semibold text-zinc-200">
                {MARKER_CATEGORIES[cat]}
              </span>
              <ChevronIcon expanded={isExpanded} />
            </button>

            {/* Marker rows */}
            {isExpanded && (
              <div className="divide-y divide-zinc-800 border-t border-zinc-800">
                {markers.map((marker) => {
                  const isInfo = expandedInfo.has(marker.key);
                  const rangeText = marker.type === "number" ? formatRange(marker) : "";

                  if (marker.type === "boolean") {
                    const boolVal = formBooleans[marker.key];
                    return (
                      <div key={marker.key} className="px-4 py-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          {/* Label + info */}
                          <div className="flex min-w-0 items-center gap-1.5">
                            <span className="text-sm text-zinc-300">{marker.label}</span>
                            <button
                              type="button"
                              onClick={() => toggleInfo(marker.key)}
                              className="shrink-0 text-zinc-600 transition hover:text-zinc-400"
                              title="Why it matters"
                            >
                              <InfoIcon />
                            </button>
                          </div>
                          {/* Boolean toggle */}
                          <div className="flex shrink-0 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setFormBooleans((prev) => ({
                                  ...prev,
                                  [marker.key]: boolVal === true ? null : true,
                                }))
                              }
                              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                boolVal === true
                                  ? "bg-green-600 text-white"
                                  : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                              }`}
                            >
                              Normal
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setFormBooleans((prev) => ({
                                  ...prev,
                                  [marker.key]: boolVal === false ? null : false,
                                }))
                              }
                              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                                boolVal === false
                                  ? "bg-red-700 text-white"
                                  : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                              }`}
                            >
                              Abnormal
                            </button>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-zinc-600">{marker.description}</p>
                        {isInfo && (
                          <p className="mt-1.5 rounded bg-zinc-800 px-3 py-2 text-xs leading-relaxed text-zinc-400">
                            {marker.whyItMatters}
                          </p>
                        )}
                      </div>
                    );
                  }

                  // Number marker
                  const strVal = formValues[marker.key] ?? "";
                  const numVal = strVal !== "" ? parseFloat(strVal) : null;
                  const status = getStatus(marker, numVal);
                  const showPill = strVal !== "" && !isNaN(numVal ?? NaN);

                  return (
                    <div key={marker.key} className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* Label + unit + info */}
                        <div className="flex min-w-0 items-center gap-1.5">
                          <span className="text-sm text-zinc-300">{marker.label}</span>
                          {marker.unit && (
                            <span className="shrink-0 text-xs text-zinc-600">{marker.unit}</span>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleInfo(marker.key)}
                            className="shrink-0 text-zinc-600 transition hover:text-zinc-400"
                            title="Why it matters"
                          >
                            <InfoIcon />
                          </button>
                        </div>
                        {/* Input + status pill */}
                        <div className="flex shrink-0 items-center gap-2">
                          {showPill && (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_PILL[status]}`}>
                              {STATUS_LABEL[status]}
                            </span>
                          )}
                          <input
                            type="number"
                            value={strVal}
                            onChange={(e) =>
                              setFormValues((prev) => ({
                                ...prev,
                                [marker.key]: e.target.value,
                              }))
                            }
                            step="any"
                            placeholder="—"
                            className="w-28 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1.5 text-right text-sm text-white placeholder-zinc-700 focus:border-yellow-600 focus:outline-none"
                          />
                        </div>
                      </div>
                      {/* Reference range */}
                      {rangeText && (
                        <p className="mt-1 text-right text-[10px] text-zinc-600">{rangeText}</p>
                      )}
                      {/* Why it matters */}
                      {isInfo && (
                        <p className="mt-1.5 rounded bg-zinc-800 px-3 py-2 text-xs leading-relaxed text-zinc-400">
                          {marker.whyItMatters}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Notes */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
        <label className="mb-1.5 block text-xs font-medium text-zinc-400">Notes (optional)</label>
        <textarea
          value={formNotes}
          onChange={(e) => setFormNotes(e.target.value)}
          rows={3}
          placeholder="Additional context, lab name, symptoms, protocol changes..."
          className="w-full resize-none rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-yellow-600 focus:outline-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 pb-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-yellow-600 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Entry"}
        </button>
        <button
          type="button"
          onClick={() => { resetForm(); setView("log"); }}
          className="rounded-lg bg-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
