"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "training" | "mobility" | "gym";
const TABS: { key: Tab; label: string }[] = [
  { key: "training", label: "Training Protocol" },
  { key: "mobility", label: "Mobility Work" },
  { key: "gym", label: "Home Gym Setup" },
];

interface Exercise {
  name: string;
  sets: string;
  rest: string;
  cue: string;
}

const DAYS: { name: string; subtitle: string; exercises: Exercise[] }[] = [
  {
    name: "Day A - Lower Body Strength",
    subtitle: "Testosterone Focus",
    exercises: [
      { name: "Barbell or Dumbbell Squat", sets: "4 x 6-8 reps", rest: "2-3 min", cue: "Drive through heels, chest tall, depth to parallel or below." },
      { name: "Romanian Deadlift", sets: "3 x 8-10 reps", rest: "2 min", cue: "Hinge at hips, soft knee, feel the hamstring stretch." },
      { name: "Dumbbell Reverse Lunge", sets: "3 x 10 each leg", rest: "90 sec", cue: "Knee tracks over toe, torso upright." },
      { name: "Hip Thrust or Glute Bridge", sets: "3 x 12-15 reps", rest: "90 sec", cue: "Full hip extension at top, squeeze glutes hard." },
      { name: "Calf Raise", sets: "3 x 15-20 reps", rest: "60 sec", cue: "Slow eccentric, full range of motion." },
    ],
  },
  {
    name: "Day B - Upper Body Push and Pull",
    subtitle: "Strength and Balance",
    exercises: [
      { name: "Dumbbell Bench Press or Push-Up Variation", sets: "4 x 8-10 reps", rest: "2 min", cue: "Controlled descent, press through chest." },
      { name: "Dumbbell Row", sets: "4 x 8-10 each side", rest: "2 min", cue: "Elbow drives back, not up." },
      { name: "Overhead Press", sets: "3 x 8-10 reps", rest: "2 min", cue: "Core braced, press straight overhead." },
      { name: "Pull-Up or Inverted Row", sets: "3 x max reps", rest: "2 min", cue: "Dead hang start, chin over bar." },
      { name: "Dumbbell Curl", sets: "2 x 12 reps", rest: "60 sec", cue: "No swinging, controlled tempo." },
      { name: "Tricep Dip or Overhead Extension", sets: "2 x 12 reps", rest: "60 sec", cue: "Full range of motion." },
    ],
  },
  {
    name: "Day C - Full Body Power and Conditioning",
    subtitle: "Compound Power",
    exercises: [
      { name: "Deadlift (conventional or sumo)", sets: "4 x 5 reps", rest: "3 min", cue: "Bar over mid-foot, lat engagement before the pull." },
      { name: "Dumbbell Clean and Press", sets: "3 x 8 reps", rest: "2 min", cue: "Explosive hip drive, catch at shoulder." },
      { name: "Weighted Pull-Up or Pull-Up", sets: "3 x 6-8 reps", rest: "2 min", cue: "Add weight when bodyweight feels easy." },
      { name: "Goblet Squat", sets: "3 x 12 reps", rest: "90 sec", cue: "Elbows inside knees at bottom." },
      { name: "Farmer Carry", sets: "3 x 40 yards", rest: "90 sec", cue: "Shoulders packed, core tight, fast walk." },
    ],
  },
];

const MOBILITY = [
  { name: "Hip 90/90 Stretch", time: "2 min each side", cue: "Sit on floor, both legs at 90 degrees, lean into front hip." },
  { name: "World's Greatest Stretch", time: "5 reps each side, 2 min total", cue: "Lunge position, rotate thoracic spine toward front knee." },
  { name: "Thoracic Spine Rotation", time: "10 reps each side, 2 min", cue: "On all fours, hand behind head, rotate elbow to ceiling." },
  { name: "Hip Flexor Stretch", time: "90 sec each side", cue: "Half kneeling, posterior pelvic tilt, drive hip forward." },
  { name: "Hamstring Stretch", time: "60 sec each side", cue: "Supine, single leg pull toward chest, knee soft." },
  { name: "Ankle Circles and Calf Stretch", time: "60 sec", cue: "Standing calf stretch against wall." },
];

const GYM_ESSENTIALS = [
  "Adjustable Dumbbells Set",
  "Pull-Up Bar (Doorframe or Wall-Mounted)",
  "Adjustable Weight Bench",
  "Weighted Vest",
  "Fabric Measuring Tape",
];

function DayCard({ day }: { day: typeof DAYS[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border-l-4 border-yellow-600 bg-zinc-900">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-4 py-3 text-left">
        <div>
          <span className="text-sm font-bold text-white">{day.name}</span>
          <span className="ml-2 text-xs text-zinc-500">{day.subtitle}</span>
        </div>
        <svg className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="space-y-3 px-4 pb-4">
          {day.exercises.map((ex) => (
            <div key={ex.name} className="rounded border border-zinc-800 bg-zinc-900/50 p-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-medium text-white">{ex.name}</span>
                <span className="text-xs font-semibold text-yellow-500">{ex.sets}</span>
              </div>
              <div className="mt-1 flex gap-3 text-xs text-zinc-500">
                <span>Rest: {ex.rest}</span>
              </div>
              <p className="mt-1 text-xs italic text-zinc-400">{ex.cue}</p>
            </div>
          ))}
          <p className="text-xs text-zinc-500">Add weight when you can complete all sets at the top of the rep range with good form. Never sacrifice form for load.</p>
        </div>
      )}
    </div>
  );
}

export default function ExerciseView() {
  const [activeTab, setActiveTab] = useState<Tab>("training");

  return (
    <div>
      <div className="mb-6 flex gap-6 border-b border-zinc-800">
        {TABS.map((tab) => (
          <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-medium transition ${activeTab === tab.key ? "border-b-2 border-yellow-600 text-yellow-500" : "text-zinc-400 hover:text-zinc-300"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "training" && (
        <div className="space-y-6">
          <p className="text-sm text-zinc-400">Resistance training is the most powerful non-pharmaceutical intervention for testosterone. This 3-day program is built around compound movements that maximize hormonal response.</p>
          <div className="rounded-lg border border-yellow-600/30 bg-zinc-900 p-4 text-center">
            <span className="text-xs uppercase tracking-wider text-zinc-500">Weekly Schedule</span>
            <p className="mt-1 text-sm font-semibold text-yellow-500">Monday - Day A &middot; Wednesday - Day B &middot; Friday - Day C</p>
            <p className="mt-0.5 text-xs text-zinc-500">Rest or light activity on other days.</p>
          </div>
          {DAYS.map((day) => <DayCard key={day.name} day={day} />)}
        </div>
      )}

      {activeTab === "mobility" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">Daily 10-minute mobility routine. Perform every morning or as a warm-up before training. Improves range of motion, reduces injury risk, and supports recovery.</p>
          {MOBILITY.map((m, i) => (
            <div key={m.name} className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-600 text-xs font-bold text-black">{i + 1}</span>
              <div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm font-medium text-white">{m.name}</span>
                  <span className="text-xs font-semibold text-yellow-500">{m.time}</span>
                </div>
                <p className="mt-1 text-xs italic text-zinc-400">{m.cue}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "gym" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">You don't need a commercial gym. These five essentials let you run the full 3-day protocol from home.</p>
          {GYM_ESSENTIALS.map((item, i) => (
            <div key={item} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-600/20 text-xs font-bold text-yellow-600">{i + 1}</span>
              <span className="text-sm text-white">{item}</span>
            </div>
          ))}
          <Link href="/dashboard/equipment" className="mt-4 inline-block text-sm font-medium text-yellow-600 hover:text-yellow-500">
            View full Equipment Guide with Amazon links &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
