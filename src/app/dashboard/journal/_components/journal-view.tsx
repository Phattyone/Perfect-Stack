"use client";

import { useState, useRef, useTransition } from "react";
import {
  saveJournalEntry,
  uploadJournalPhoto,
  deleteJournalPhoto,
  type JournalEntryData,
} from "../actions";

interface JournalViewProps {
  entries: JournalEntryData[];
  userId: string;
}

const SCORES = [
  { key: "energy_score", label: "Energy Levels" },
  { key: "libido_score", label: "Libido / Sex Drive" },
  { key: "erection_quality_score", label: "Erection Quality" },
  { key: "sleep_quality_score", label: "Sleep Quality" },
  { key: "mood_score", label: "Mood & Motivation" },
  { key: "workout_performance_score", label: "Workout Performance" },
] as const;

const EMPTY_ENTRY = (week: number): JournalEntryData => ({
  week_number: week,
  entry_date: new Date().toISOString().split("T")[0],
  energy_score: 5, libido_score: 5, erection_quality_score: 5,
  sleep_quality_score: 5, mood_score: 5, workout_performance_score: 5,
  wins_this_week: "", challenges: "", body_energy_notes: "", sex_drive_notes: "",
  supplements_consistent: "", meals_diet_notes: "", training_done: "", sleep_details: "",
  weight_lbs: null, waist_inches: null, body_fat_percent: null,
  bench_press_max: null, squat_max: null, free_reflection: "", photo_urls: [],
});

const sliderClass =
  "w-full cursor-pointer appearance-none rounded-full bg-zinc-800 h-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-yellow-600 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-yellow-600 [&::-moz-range-thumb]:border-0";

const textareaClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600 min-h-[80px]";

const inputClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-yellow-600 focus:outline-none focus:ring-1 focus:ring-yellow-600";

export default function JournalView({ entries, userId }: JournalViewProps) {
  const entryMap = new Map(entries.map((e) => [e.week_number, e]));
  const firstIncomplete = Array.from({ length: 8 }, (_, i) => i + 1).find((w) => !entryMap.has(w)) ?? 1;

  const [selectedWeek, setSelectedWeek] = useState(firstIncomplete);
  const [data, setData] = useState<JournalEntryData>(entryMap.get(firstIncomplete) ?? EMPTY_ENTRY(firstIncomplete));
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
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
    if (!file || data.photo_urls.length >= 3) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("userId", userId);
    fd.append("weekNumber", String(selectedWeek));
    const result = await uploadJournalPhoto(fd);
    setUploading(false);
    if ("url" in result) {
      updateField("photo_urls", [...data.photo_urls, result.url]);
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handlePhotoDelete(url: string) {
    const result = await deleteJournalPhoto(url, userId);
    if ("success" in result) {
      updateField("photo_urls", data.photo_urls.filter((u) => u !== url));
    }
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
        <h3 className="mb-4 text-sm font-bold text-yellow-500">Weekly Performance Scores</h3>
        <div className="space-y-5">
          {SCORES.map((s) => (
            <div key={s.key}>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm text-white">{s.label}</label>
                <span className="text-lg font-bold text-yellow-500">{data[s.key as keyof JournalEntryData] as number}</span>
              </div>
              <input type="range" min={1} max={10}
                value={data[s.key as keyof JournalEntryData] as number}
                onChange={(e) => updateField(s.key as keyof JournalEntryData, Number(e.target.value) as never)}
                className={sliderClass} />
            </div>
          ))}
        </div>
      </div>

      {/* Section 2 - How I'm Feeling */}
      <div className="rounded-xl border-l-4 border-yellow-600 bg-zinc-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-yellow-500">How I&apos;m Feeling This Week</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-white">Wins this week</label>
            <textarea value={data.wins_this_week} onChange={(e) => updateField("wins_this_week", e.target.value)} placeholder="What went well? Any improvements you noticed?" className={textareaClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white">Challenges or struggles</label>
            <textarea value={data.challenges} onChange={(e) => updateField("challenges", e.target.value)} placeholder="What was hard this week? Any setbacks?" className={textareaClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white">What I noticed about my body and energy</label>
            <textarea value={data.body_energy_notes} onChange={(e) => updateField("body_energy_notes", e.target.value)} placeholder="Energy levels, physical changes, how you felt day to day..." className={textareaClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white">How is my sex drive and performance feeling?</label>
            <textarea value={data.sex_drive_notes} onChange={(e) => updateField("sex_drive_notes", e.target.value)} placeholder="Be honest with yourself. The trend matters more than any single week." className={textareaClass} />
          </div>
        </div>
      </div>

      {/* Section 3 - Protocol Notes */}
      <div className="rounded-xl border-l-4 border-yellow-600 bg-zinc-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-yellow-500">Protocol Notes</h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-white">Supplements taken consistently this week</label>
            <textarea value={data.supplements_consistent} onChange={(e) => updateField("supplements_consistent", e.target.value)} placeholder="Which supplements did you take consistently? Any you missed?" className={textareaClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white">Meals and diet notes</label>
            <textarea value={data.meals_diet_notes} onChange={(e) => updateField("meals_diet_notes", e.target.value)} placeholder="How was your nutrition this week? Any wins or slips?" className={textareaClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white">Training done this week</label>
            <textarea value={data.training_done} onChange={(e) => updateField("training_done", e.target.value)} placeholder="What workouts did you complete? Days trained, exercises, how it felt..." className={textareaClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-white">Sleep quality details</label>
            <textarea value={data.sleep_details} onChange={(e) => updateField("sleep_details", e.target.value)} placeholder="Hours slept, quality, anything affecting sleep this week..." className={textareaClass} />
          </div>
        </div>
      </div>

      {/* Section 4 - Measurements */}
      <div className="rounded-xl border-l-4 border-yellow-600 bg-zinc-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-yellow-500">Measurements</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Weight (lbs)</label>
            <input type="number" value={data.weight_lbs ?? ""} onChange={(e) => updateField("weight_lbs", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Waist (inches)</label>
            <input type="number" step="0.1" value={data.waist_inches ?? ""} onChange={(e) => updateField("waist_inches", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Body fat % <span className="text-zinc-600">optional</span></label>
            <input type="number" step="0.1" value={data.body_fat_percent ?? ""} onChange={(e) => updateField("body_fat_percent", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-zinc-400">Bench max (lbs) <span className="text-zinc-600">optional</span></label>
            <input type="number" value={data.bench_press_max ?? ""} onChange={(e) => updateField("bench_press_max", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="mb-1 block text-xs text-zinc-400">Squat max (lbs) <span className="text-zinc-600">optional</span></label>
            <input type="number" value={data.squat_max ?? ""} onChange={(e) => updateField("squat_max", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Section 5 - Progress Photos */}
      <div className="rounded-xl border-l-4 border-yellow-600 bg-zinc-900 p-5">
        <h3 className="mb-4 text-sm font-bold text-yellow-500">Progress Photos (up to 3)</h3>
        <div className="grid grid-cols-3 gap-3">
          {data.photo_urls.map((url, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-zinc-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Week ${selectedWeek} photo ${i + 1}`} className="h-full w-full object-cover" />
              <button type="button" onClick={() => handlePhotoDelete(url)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                X
              </button>
            </div>
          ))}
          {data.photo_urls.length < 3 && (
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

      {/* Save button */}
      <button type="button" onClick={handleSave} disabled={isPending}
        className="w-full rounded-xl bg-yellow-600 px-4 py-4 text-sm font-bold text-black transition hover:bg-yellow-500 disabled:opacity-50">
        {isPending ? "Saving..." : saved ? "\u2713 Saved!" : entryMap.has(selectedWeek) ? "Update Journal Entry" : "Save Journal Entry"}
      </button>
    </div>
  );
}
