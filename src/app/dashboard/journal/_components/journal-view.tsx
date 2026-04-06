"use client";

import { useState, useRef, useTransition } from "react";
import {
  saveJournalEntry,
  uploadJournalPhoto,
  deleteJournalPhoto,
  getSignedPhotoUrls,
  type JournalEntryData,
} from "../actions";

interface JournalViewProps {
  entries: JournalEntryData[];
  userId: string;
  initialSignedUrls: Record<string, string>;
}

const SCORES = [
  { key: "energy_score", label: "Energy Levels", color: "#3B82F6" },
  { key: "libido_score", label: "Libido / Sex Drive", color: "#EC4899" },
  { key: "erection_quality_score", label: "Erection Quality", color: "#EAB308" },
  { key: "sleep_quality_score", label: "Sleep Quality", color: "#8B5CF6" },
  { key: "mood_score", label: "Mood & Motivation", color: "#14B8A6" },
  { key: "workout_performance_score", label: "Workout Performance", color: "#22C55E" },
] as const;

const EMPTY_ENTRY = (week: number): JournalEntryData => ({
  week_number: week,
  entry_date: new Date().toISOString().split("T")[0],
  energy_score: 5, libido_score: 5, erection_quality_score: 5,
  sleep_quality_score: 5, mood_score: 5, workout_performance_score: 5,
  wins_this_week: "", challenges: "", body_energy_notes: "", sex_drive_notes: "",
  supplements_consistent: "", meals_diet_notes: "", training_done: "", sleep_details: "",
  weight_lbs: null, waist_inches: null, body_fat_percent: null,
  bench_press_max: null, squat_max: null, free_reflection: "", photo_paths: [],
});

const sliderClass =
  "w-full cursor-pointer appearance-none rounded-full bg-zinc-800 h-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-600 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-yellow-600 [&::-moz-range-thumb]:border-0";

const textareaClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600 min-h-[80px]";

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600";

export default function JournalView({ entries, userId, initialSignedUrls }: JournalViewProps) {
  const entryMap = new Map(entries.map((e) => [e.week_number, e]));
  const firstIncomplete = Array.from({ length: 8 }, (_, i) => i + 1).find((w) => !entryMap.has(w)) ?? 1;

  const [selectedWeek, setSelectedWeek] = useState(firstIncomplete);
  const [data, setData] = useState<JournalEntryData>(entryMap.get(firstIncomplete) ?? EMPTY_ENTRY(firstIncomplete));
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>(initialSignedUrls);
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  function selectWeek(week: number) {
    setSelectedWeek(week);
    setData(entryMap.get(week) ?? EMPTY_ENTRY(week));
    setSaved(false);
    setError(null);
  }

  function updateField<K extends keyof JournalEntryData>(field: K, value: JournalEntryData[K]) {
    setData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await saveJournalEntry(userId, data);
      if ("error" in result) {
        setError(result.error);
      } else {
        setSaved(true);
        entryMap.set(data.week_number, data);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || data.photo_paths.length >= 3) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    const tempKey = `temp_${Date.now()}`;
    setLocalPreviews((prev) => ({ ...prev, [tempKey]: localUrl }));
    const newPaths = [...data.photo_paths, tempKey];
    updateField("photo_paths", newPaths);

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("userId", userId);
    fd.append("weekNumber", String(selectedWeek));
    const result = await uploadJournalPhoto(fd);
    setUploading(false);

    if ("path" in result) {
      // Replace temp key with real path
      const signed = await getSignedPhotoUrls([result.path]);
      setSignedUrls((prev) => ({ ...prev, ...signed }));
      updateField("photo_paths", data.photo_paths.filter((p) => p !== tempKey).concat(result.path));
      setLocalPreviews((prev) => {
        const next = { ...prev };
        delete next[tempKey];
        URL.revokeObjectURL(localUrl);
        return next;
      });
    } else {
      // Upload failed, remove temp
      updateField("photo_paths", data.photo_paths.filter((p) => p !== tempKey));
      setLocalPreviews((prev) => {
        const next = { ...prev };
        delete next[tempKey];
        URL.revokeObjectURL(localUrl);
        return next;
      });
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handlePhotoDelete(path: string) {
    if (path.startsWith("temp_")) {
      updateField("photo_paths", data.photo_paths.filter((p) => p !== path));
      return;
    }
    const result = await deleteJournalPhoto(path, userId);
    if ("success" in result) {
      updateField("photo_paths", data.photo_paths.filter((p) => p !== path));
    }
  }

  function getPhotoSrc(path: string): string {
    if (localPreviews[path]) return localPreviews[path];
    if (signedUrls[path]) return signedUrls[path];
    return "";
  }

  return (
    <div className="space-y-6">
      {/* Week selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 8 }, (_, i) => i + 1).map((week) => {
          const hasEntry = entryMap.has(week);
          const isSelected = week === selectedWeek;
          return (
            <button key={week} type="button" onClick={() => selectWeek(week)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                isSelected ? "border-yellow-600 bg-yellow-600/10 text-yellow-500"
                : "border-zinc-700 bg-zinc-900 text-zinc-400"
              }`}>
              Week {week}
              {hasEntry && (
                <svg className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

      {/* Section 1 - Performance Scores */}
      <div className="rounded-xl border-l-4 border-yellow-600 bg-zinc-900 p-5">
        <h3 className="mb-1 text-sm font-bold text-yellow-500">Weekly Performance Scores</h3>
        <p className="mb-4 text-xs text-zinc-500">Scores sync automatically with your Progress Tracker.</p>
        <div className="space-y-5">
          {SCORES.map((s) => (
            <div key={s.key}>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm text-white">{s.label}</label>
                <span className="text-lg font-bold" style={{ color: s.color }}>{data[s.key as keyof JournalEntryData] as number}</span>
              </div>
              <style>{`.jslider-${s.key}::-webkit-slider-thumb{background:${s.color} !important}.jslider-${s.key}::-moz-range-thumb{background:${s.color} !important}`}</style>
              <input type="range" min={1} max={10}
                value={data[s.key as keyof JournalEntryData] as number}
                onChange={(e) => updateField(s.key as keyof JournalEntryData, Number(e.target.value) as never)}
                className={`${sliderClass} jslider-${s.key}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Section 2 - How I'm Feeling */}
      <div className="rounded-xl border-l-4 border-yellow-600 bg-zinc-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-yellow-500">How I&apos;m Feeling This Week</h3>
        <div className="space-y-4">
          {[
            { key: "wins_this_week", label: "Wins this week", ph: "What went well? Any improvements you noticed?" },
            { key: "challenges", label: "Challenges or struggles", ph: "What was hard this week? Any setbacks?" },
            { key: "body_energy_notes", label: "What I noticed about my body and energy", ph: "Energy levels, physical changes, how you felt day to day..." },
            { key: "sex_drive_notes", label: "How is my sex drive and performance feeling?", ph: "Be honest with yourself. The trend matters more than any single week." },
          ].map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-sm font-medium text-white">{f.label}</label>
              <textarea value={data[f.key as keyof JournalEntryData] as string} onChange={(e) => updateField(f.key as keyof JournalEntryData, e.target.value as never)} placeholder={f.ph} className={textareaClass} />
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 - Protocol Notes */}
      <div className="rounded-xl border-l-4 border-yellow-600 bg-zinc-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-yellow-500">Protocol Notes</h3>
        <div className="space-y-4">
          {[
            { key: "supplements_consistent", label: "Supplements taken consistently this week", ph: "Which supplements did you take consistently? Any you missed?" },
            { key: "meals_diet_notes", label: "Meals and diet notes", ph: "How was your nutrition this week? Any wins or slips?" },
            { key: "training_done", label: "Training done this week", ph: "What workouts did you complete? Days trained, exercises, how it felt..." },
            { key: "sleep_details", label: "Sleep quality details", ph: "Hours slept, quality, anything affecting sleep this week..." },
          ].map((f) => (
            <div key={f.key}>
              <label className="mb-1 block text-sm font-medium text-white">{f.label}</label>
              <textarea value={data[f.key as keyof JournalEntryData] as string} onChange={(e) => updateField(f.key as keyof JournalEntryData, e.target.value as never)} placeholder={f.ph} className={textareaClass} />
            </div>
          ))}
        </div>
      </div>

      {/* Section 4 - Measurements */}
      <div className="rounded-xl border-l-4 border-yellow-600 bg-zinc-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-yellow-500">Measurements</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "weight_lbs", label: "Weight (lbs)" },
            { key: "waist_inches", label: "Waist (inches)", step: "0.1" },
            { key: "body_fat_percent", label: "Body fat %", opt: true, step: "0.1" },
            { key: "bench_press_max", label: "Bench max (lbs)", opt: true },
            { key: "squat_max", label: "Squat max (lbs)", opt: true },
          ].map((f) => (
            <div key={f.key} className={f.key === "squat_max" ? "col-span-2 sm:col-span-1" : ""}>
              <label className="mb-1 block text-xs text-zinc-400">{f.label} {f.opt && <span className="text-zinc-600">optional</span>}</label>
              <input type="number" step={f.step ?? undefined}
                value={(data[f.key as keyof JournalEntryData] as number | null) ?? ""}
                onChange={(e) => updateField(f.key as keyof JournalEntryData, (e.target.value ? Number(e.target.value) : null) as never)}
                className={inputClass} />
            </div>
          ))}
        </div>
      </div>

      {/* Section 5 - Progress Photos */}
      <div className="rounded-xl border-l-4 border-yellow-600 bg-zinc-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-yellow-500">Progress Photos (up to 3)</h3>
        <div className="grid grid-cols-3 gap-3">
          {data.photo_paths.map((path, i) => (
            <div key={path} className="relative aspect-square overflow-hidden rounded-lg border border-zinc-700">
              {getPhotoSrc(path) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getPhotoSrc(path)} alt={`Week ${selectedWeek} photo ${i + 1}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-xs text-zinc-500">Loading...</div>
              )}
              <button type="button" onClick={() => handlePhotoDelete(path)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white">X</button>
            </div>
          ))}
          {data.photo_paths.length < 3 && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 text-zinc-500 transition hover:border-yellow-600 hover:text-yellow-600">
              {uploading ? (
                <span className="text-xs">Uploading...</span>
              ) : (
                <>
                  <svg className="mb-1 h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                  <span className="text-[10px]">Tap to add</span>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} className="hidden" />
            </label>
          )}
        </div>
        <p className="mt-2 text-[10px] text-zinc-600">Tip: Take front, side, and back photos against the same background each week for accurate comparison.</p>
      </div>

      {/* Section 6 - Free Reflection */}
      <div className="rounded-xl border-l-4 border-yellow-600 bg-zinc-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-yellow-500">Free Reflection</h3>
        <textarea value={data.free_reflection} onChange={(e) => updateField("free_reflection", e.target.value)}
          placeholder="Anything else on your mind this week - mood, stress, relationships, goals, what you want to focus on next week..."
          className={`${textareaClass} min-h-[120px]`} />
      </div>

      {/* Save */}
      <button type="button" onClick={handleSave} disabled={isPending}
        className="w-full rounded-xl bg-yellow-600 px-4 py-4 text-sm font-bold text-black transition hover:bg-yellow-500 disabled:opacity-50">
        {isPending ? "Saving..." : saved ? "\u2713 Saved!" : entryMap.has(selectedWeek) ? "Update Journal Entry" : "Save Journal Entry"}
      </button>
    </div>
  );
}
