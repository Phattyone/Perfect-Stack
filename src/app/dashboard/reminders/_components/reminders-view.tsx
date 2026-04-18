"use client";

import { useState } from "react";
import { saveReminderPreferences } from "../actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReminderTime {
  enabled: boolean;
  hour: number;
  minute: number;
  ampm: "AM" | "PM";
}

interface WeeklyReminder extends ReminderTime {
  day: number; // 0 = Sunday … 6 = Saturday
}

interface Prefs {
  morning_supplements: ReminderTime;
  afternoon_supplements: ReminderTime;
  evening_supplements: ReminderTime;
  pre_activity_supplements: ReminderTime;
  breakfast: ReminderTime;
  lunch: ReminderTime;
  dinner: ReminderTime;
  post_workout_nutrition: ReminderTime;
  morning_performance_drink: ReminderTime;
  nitric_oxide_shot: ReminderTime;
  morning_water: ReminderTime;
  midday_water: ReminderTime;
  afternoon_water: ReminderTime;
  daily_journal: ReminderTime;
  weekly_checkin: WeeklyReminder;
  bedtime_winddown: ReminderTime;
  morning_motivation: ReminderTime;
  notification_sound: string;
}

type ReminderKey = Exclude<keyof Prefs, "notification_sound">;

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_PREFS: Prefs = {
  // Supplement Reminders
  morning_supplements:       { enabled: true, hour: 7,  minute: 30, ampm: "AM" },
  afternoon_supplements:     { enabled: true, hour: 1,  minute: 0,  ampm: "PM" },
  evening_supplements:       { enabled: true, hour: 8,  minute: 0,  ampm: "PM" },
  pre_activity_supplements:  { enabled: true, hour: 5,  minute: 0,  ampm: "PM" },
  // Meal & Nutrition Reminders
  breakfast:                 { enabled: true, hour: 7,  minute: 0,  ampm: "AM" },
  lunch:                     { enabled: true, hour: 12, minute: 0,  ampm: "PM" },
  dinner:                    { enabled: true, hour: 6,  minute: 30, ampm: "PM" },
  post_workout_nutrition:    { enabled: true, hour: 6,  minute: 0,  ampm: "PM" },
  // Drink & Hydration Reminders
  morning_water:             { enabled: true, hour: 6,  minute: 30, ampm: "AM" },
  midday_water:              { enabled: true, hour: 12, minute: 0,  ampm: "PM" },
  afternoon_water:           { enabled: true, hour: 3,  minute: 0,  ampm: "PM" },
  morning_performance_drink: { enabled: true, hour: 7,  minute: 0,  ampm: "AM" },
  nitric_oxide_shot:         { enabled: true, hour: 4,  minute: 30, ampm: "PM" },
  // Wellness Reminders
  daily_journal:             { enabled: true, hour: 9,  minute: 0,  ampm: "PM" },
  weekly_checkin:            { enabled: true, hour: 9,  minute: 0,  ampm: "AM", day: 0 },
  bedtime_winddown:          { enabled: true, hour: 10, minute: 0,  ampm: "PM" },
  morning_motivation:        { enabled: true, hour: 6,  minute: 0,  ampm: "AM" },
  notification_sound: "Default Chime",
};

// ─── Section data ─────────────────────────────────────────────────────────────

interface SectionItem {
  key: ReminderKey;
  label: string;
  isWeekly?: true;
}

interface Section {
  title: string;
  icon: string;
  items: SectionItem[];
}

const SECTIONS: Section[] = [
  {
    title: "Supplement Reminders",
    icon: "💊",
    items: [
      { key: "morning_supplements",      label: "Morning supplements" },
      { key: "afternoon_supplements",    label: "Afternoon supplements" },
      { key: "pre_activity_supplements", label: "Pre-activity supplements" },
      { key: "evening_supplements",      label: "Evening supplements" },
    ],
  },
  {
    title: "Meal & Nutrition Reminders",
    icon: "🍽️",
    items: [
      { key: "breakfast",              label: "Breakfast reminder" },
      { key: "lunch",                  label: "Lunch reminder" },
      { key: "post_workout_nutrition", label: "Post-workout nutrition" },
      { key: "dinner",                 label: "Dinner reminder" },
    ],
  },
  {
    title: "Drink & Hydration Reminders",
    icon: "💧",
    items: [
      { key: "morning_water",             label: "Morning water" },
      { key: "morning_performance_drink", label: "Morning performance drink" },
      { key: "midday_water",              label: "Midday water" },
      { key: "afternoon_water",           label: "Afternoon water" },
      { key: "nitric_oxide_shot",         label: "Nitric oxide shot" },
    ],
  },
  {
    title: "Wellness Reminders",
    icon: "🧘",
    items: [
      { key: "morning_motivation", label: "Morning motivation" },
      { key: "daily_journal",      label: "Daily journal check-in" },
      { key: "bedtime_winddown",   label: "Bedtime wind-down" },
      { key: "weekly_checkin",     label: "Weekly progress check-in", isWeekly: true },
    ],
  },
];

const HOURS   = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const DAYS    = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SOUNDS  = ["Default Chime", "Soft Bell", "Power Up", "Nature Tone", "Silent"];

// ─── Helper: build initial prefs from saved JSONB ─────────────────────────────

function buildPrefs(saved: Record<string, unknown> | null): Prefs {
  if (!saved) return { ...DEFAULT_PREFS, weekly_checkin: { ...DEFAULT_PREFS.weekly_checkin } };

  // Assign to a const so TypeScript narrows the type inside closures
  const s = saved;

  function safeRT(key: string, def: ReminderTime): ReminderTime {
    const v = s[key];
    if (typeof v !== "object" || v === null || Array.isArray(v)) return { ...def };
    const o = v as Record<string, unknown>;
    return {
      enabled: typeof o.enabled === "boolean" ? o.enabled : def.enabled,
      hour:    Number.isFinite(o.hour as number)   ? (o.hour as number)   : def.hour,
      minute:  Number.isFinite(o.minute as number) ? (o.minute as number) : def.minute,
      ampm:    o.ampm === "AM" || o.ampm === "PM"  ? o.ampm               : def.ampm,
    };
  }

  const base  = safeRT("weekly_checkin", DEFAULT_PREFS.weekly_checkin);
  const rawWk = s.weekly_checkin;
  const day   =
    typeof rawWk === "object" &&
    rawWk !== null &&
    !Array.isArray(rawWk) &&
    Number.isFinite((rawWk as Record<string, unknown>).day as number)
      ? (rawWk as Record<string, unknown>).day as number
      : DEFAULT_PREFS.weekly_checkin.day;

  return {
    morning_supplements:       safeRT("morning_supplements",       DEFAULT_PREFS.morning_supplements),
    afternoon_supplements:     safeRT("afternoon_supplements",     DEFAULT_PREFS.afternoon_supplements),
    evening_supplements:       safeRT("evening_supplements",       DEFAULT_PREFS.evening_supplements),
    pre_activity_supplements:  safeRT("pre_activity_supplements",  DEFAULT_PREFS.pre_activity_supplements),
    breakfast:                 safeRT("breakfast",                 DEFAULT_PREFS.breakfast),
    lunch:                     safeRT("lunch",                     DEFAULT_PREFS.lunch),
    dinner:                    safeRT("dinner",                    DEFAULT_PREFS.dinner),
    post_workout_nutrition:    safeRT("post_workout_nutrition",    DEFAULT_PREFS.post_workout_nutrition),
    morning_performance_drink: safeRT("morning_performance_drink", DEFAULT_PREFS.morning_performance_drink),
    nitric_oxide_shot:         safeRT("nitric_oxide_shot",         DEFAULT_PREFS.nitric_oxide_shot),
    morning_water:             safeRT("morning_water",             DEFAULT_PREFS.morning_water),
    midday_water:              safeRT("midday_water",              DEFAULT_PREFS.midday_water),
    afternoon_water:           safeRT("afternoon_water",           DEFAULT_PREFS.afternoon_water),
    daily_journal:             safeRT("daily_journal",             DEFAULT_PREFS.daily_journal),
    weekly_checkin:            { ...base, day },
    bedtime_winddown:          safeRT("bedtime_winddown",          DEFAULT_PREFS.bedtime_winddown),
    morning_motivation:        safeRT("morning_motivation",        DEFAULT_PREFS.morning_motivation),
    notification_sound:
      typeof saved.notification_sound === "string"
        ? saved.notification_sound
        : DEFAULT_PREFS.notification_sound,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface RemindersViewProps {
  userId: string;
  initialPrefs: Record<string, unknown> | null;
}

export default function RemindersView({ userId, initialPrefs }: RemindersViewProps) {
  const [prefs, setPrefs] = useState<Prefs>(() => buildPrefs(initialPrefs));
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  // ── State updaters ──────────────────────────────────────────────────────────

  function toggleKey(key: ReminderKey) {
    setPrefs(p => ({
      ...p,
      [key]: { ...(p[key] as ReminderTime), enabled: !(p[key] as ReminderTime).enabled },
    }));
  }

  function setHour(key: ReminderKey, hour: number) {
    setPrefs(p => ({ ...p, [key]: { ...(p[key] as ReminderTime), hour } }));
  }

  function setMinute(key: ReminderKey, minute: number) {
    setPrefs(p => ({ ...p, [key]: { ...(p[key] as ReminderTime), minute } }));
  }

  function setAmpm(key: ReminderKey, ampm: "AM" | "PM") {
    setPrefs(p => ({ ...p, [key]: { ...(p[key] as ReminderTime), ampm } }));
  }

  function setDay(day: number) {
    setPrefs(p => ({ ...p, weekly_checkin: { ...p.weekly_checkin, day } }));
  }

  // ── Save handler ────────────────────────────────────────────────────────────

  async function handleSave() {
    setSaving(true);
    setSaveError(null);

    const result = await saveReminderPreferences(
      userId,
      prefs as unknown as Record<string, unknown>
    );

    setSaving(false);

    if ("error" in result) {
      setSaveError(result.error);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  // ── Reset handler ───────────────────────────────────────────────────────────

  function handleConfirmReset() {
    setPrefs({ ...DEFAULT_PREFS, weekly_checkin: { ...DEFAULT_PREFS.weekly_checkin } });
    setShowResetConfirm(false);
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 3000);
  }

  // ── Select class helper ─────────────────────────────────────────────────────

  const selectCls =
    "rounded border border-zinc-600 bg-zinc-700 px-2 py-1 text-sm text-zinc-200 focus:border-yellow-500 focus:outline-none";

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Mobile-app banner */}
      <div className="rounded-lg border-l-4 border-yellow-500 bg-zinc-800 px-5 py-4">
        <p className="text-sm text-zinc-300">
          🔔{" "}
          <strong className="text-zinc-200">
            Push notifications and reminder sounds are available in the Perfect Stack mobile app.
          </strong>{" "}
          Configure your preferences below and they will sync automatically when you download the app.
        </p>
      </div>

      {/* Reminder sections */}
      {SECTIONS.map(section => (
        <div key={section.title} className="overflow-hidden rounded-lg bg-zinc-800">
          {/* Section header */}
          <div className="border-b border-zinc-700 px-5 py-3">
            <h3 className="text-sm font-semibold text-zinc-200">
              {section.icon}&nbsp;&nbsp;{section.title}
            </h3>
          </div>

          {/* Rows */}
          <div className="divide-y divide-zinc-700/50">
            {section.items.map(item => {
              const rt      = prefs[item.key] as ReminderTime;
              const enabled = rt.enabled;

              return (
                <div
                  key={item.key}
                  className="flex flex-wrap items-center gap-x-3 gap-y-2 px-5 py-3"
                >
                  {/* Toggle */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    onClick={() => toggleKey(item.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
                      enabled ? "bg-yellow-500" : "bg-zinc-600"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 inline-block h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                        enabled ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>

                  {/* Label */}
                  <span
                    className={`min-w-0 flex-1 text-sm transition-colors ${
                      enabled ? "text-zinc-200" : "text-zinc-500"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Time + optional day pickers */}
                  <div
                    className={`flex shrink-0 items-center gap-1 transition-opacity ${
                      enabled ? "opacity-100" : "pointer-events-none opacity-40"
                    }`}
                  >
                    {/* Day-of-week (weekly only) */}
                    {item.isWeekly && (
                      <select
                        value={prefs.weekly_checkin.day}
                        onChange={e => setDay(Number(e.target.value))}
                        className={`${selectCls} text-xs`}
                      >
                        {DAYS.map((d, i) => (
                          <option key={d} value={i}>{d}</option>
                        ))}
                      </select>
                    )}

                    {/* Hour */}
                    <select
                      value={rt.hour}
                      onChange={e => setHour(item.key, Number(e.target.value))}
                      className={selectCls}
                    >
                      {HOURS.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>

                    <span className="text-sm text-zinc-500">:</span>

                    {/* Minute */}
                    <select
                      value={rt.minute}
                      onChange={e => setMinute(item.key, Number(e.target.value))}
                      className={selectCls}
                    >
                      {MINUTES.map(m => (
                        <option key={m} value={m}>
                          {String(m).padStart(2, "0")}
                        </option>
                      ))}
                    </select>

                    {/* AM / PM */}
                    <select
                      value={rt.ampm}
                      onChange={e => setAmpm(item.key, e.target.value as "AM" | "PM")}
                      className={selectCls}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Notification Sound */}
      <div className="overflow-hidden rounded-lg bg-zinc-800">
        <div className="border-b border-zinc-700 px-5 py-3">
          <h3 className="text-sm font-semibold text-zinc-200">🔔&nbsp;&nbsp;Notification Sound</h3>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="min-w-0 flex-1 text-sm text-zinc-200">Reminder sound</span>
            <select
              value={prefs.notification_sound}
              onChange={e =>
                setPrefs(p => ({ ...p, notification_sound: e.target.value }))
              }
              className={selectCls}
            >
              {SOUNDS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Sound selection applies in the mobile app only.
          </p>
        </div>
      </div>

      {/* Save / Reset buttons + feedback */}
      <div className="space-y-3 pb-4">
        {/* Button row */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-yellow-500 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Preferences"}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowResetConfirm(c => !c);
              setResetNotice(false);
            }}
            className="rounded-lg bg-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-600"
          >
            Reset to Defaults
          </button>

          {saved && (
            <span className="text-sm font-medium text-yellow-500">✓ Saved</span>
          )}

          {saveError && (
            <span className="text-sm text-red-400">Error: {saveError}</span>
          )}
        </div>

        {/* Inline reset confirmation */}
        {showResetConfirm && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-4">
            <p className="mb-3 text-sm text-zinc-300">
              This will reset all reminders to the Perfect Stack recommended schedule. Are you sure?
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleConfirmReset}
                className="rounded-md bg-red-700 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-red-600"
              >
                Yes, Reset
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="rounded-md bg-zinc-600 px-4 py-1.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Post-reset notice */}
        {resetNotice && (
          <p className="text-sm font-medium text-yellow-500">
            ↺ Reset to defaults - click Save to apply
          </p>
        )}
      </div>
    </div>
  );
}
