"use client";

import { useState } from "react";

type Tab = "program" | "why";
const TABS: { key: Tab; label: string }[] = [
  { key: "program", label: "The Program" },
  { key: "why", label: "Why It Matters" },
];

interface PFExercise {
  name: string;
  sets: string;
  hold: string;
  rest: string;
  cue: string;
  frequency: string;
  youtubeUrl?: string;
}

const PF_YOUTUBE: Record<string, string> = {
  "Basic Kegel Contraction": "https://www.youtube.com/results?search_query=kegel+exercises+for+men+how+to",
  "Extended Hold Kegel": "https://www.youtube.com/results?search_query=kegel+exercises+for+men+how+to",
  "Long Hold Kegel": "https://www.youtube.com/results?search_query=kegel+exercises+for+men+how+to",
  "Max Hold": "https://www.youtube.com/results?search_query=kegel+exercises+for+men+how+to",
  "Quick Flicks": "https://www.youtube.com/results?search_query=pelvic+floor+quick+contractions+men",
  "Reverse Kegel": "https://www.youtube.com/results?search_query=reverse+kegel+men+how+to",
  "Functional Integration": "https://www.youtube.com/results?search_query=pelvic+floor+functional+training+men",
};

const WEEKS: { label: string; phase: string; exercises: PFExercise[] }[] = [
  {
    label: "Weeks 1-2",
    phase: "Foundation (Learning to Isolate)",
    exercises: [
      { name: "Basic Kegel Contraction", sets: "3 x 10 reps", hold: "Hold 3 sec, release 3 sec", rest: "60 sec between sets", cue: "Imagine you are stopping the flow of urine. Contract only the pelvic floor, not your glutes, abs, or thighs. Breathe normally throughout.", frequency: "Daily" },
      { name: "Quick Flicks", sets: "2 x 20 reps", hold: "Contract and release as fast as possible", rest: "60 sec", cue: "Speed and control. These target fast-twitch pelvic floor fibers.", frequency: "Daily" },
    ],
  },
  {
    label: "Weeks 3-4",
    phase: "Building Endurance",
    exercises: [
      { name: "Extended Hold Kegel", sets: "3 x 10 reps", hold: "Hold 5 sec, release 5 sec", rest: "60 sec", cue: "Focus on maintaining full contraction through the entire hold.", frequency: "Daily" },
      { name: "Quick Flicks", sets: "3 x 20 reps", hold: "Fast contraction/release", rest: "45 sec", cue: "Increase speed while maintaining control.", frequency: "Daily" },
      { name: "Reverse Kegel", sets: "2 x 10 reps", hold: "Hold 5 sec", rest: "60 sec", cue: "Gently bear down and push out, opposite of a contraction. Releases tension and improves control.", frequency: "Daily" },
    ],
  },
  {
    label: "Weeks 5-6",
    phase: "Strength Phase",
    exercises: [
      { name: "Long Hold Kegel", sets: "4 x 8 reps", hold: "Hold 8 sec, release 8 sec", rest: "90 sec", cue: "Maximum sustained contraction.", frequency: "Daily" },
      { name: "Quick Flicks", sets: "3 x 30 reps", hold: "Fast contraction/release", rest: "45 sec", cue: "Higher volume, maintained speed.", frequency: "Daily" },
      { name: "Reverse Kegel", sets: "3 x 10 reps", hold: "Hold 8 sec", rest: "60 sec", cue: "Longer holds, deeper relaxation.", frequency: "Daily" },
      { name: "Functional Integration", sets: "2 x 10 reps", hold: "Standing, walking, or sitting", rest: "As needed", cue: "The goal is real-world control, not just lying-down strength.", frequency: "Daily" },
    ],
  },
  {
    label: "Weeks 7-8",
    phase: "Performance Integration",
    exercises: [
      { name: "Max Hold", sets: "4 x 6 reps", hold: "Hold 10 sec, release 10 sec", rest: "90 sec", cue: "Peak strength and endurance.", frequency: "Daily" },
      { name: "Quick Flicks", sets: "3 x 40 reps", hold: "Fast contraction/release", rest: "30 sec", cue: "Maximum speed and volume.", frequency: "Daily" },
      { name: "Reverse Kegel", sets: "3 x 10 reps", hold: "Hold 10 sec", rest: "60 sec", cue: "Full relaxation control.", frequency: "Daily" },
      { name: "Functional Integration", sets: "3 x 15 reps", hold: "Varied positions", rest: "As needed", cue: "Real-world application across all positions and activities.", frequency: "Daily" },
    ],
  },
];

const WHY_CARDS = [
  { title: "Erection Quality", body: "The bulbocavernosus and ischiocavernosus muscles compress the base of the penis during erection, increasing firmness and duration. Weak pelvic floor muscles directly reduce erection quality." },
  { title: "Ejaculatory Control", body: "Pelvic floor strength and coordination directly govern ejaculatory timing. Both premature ejaculation and delayed ejaculation have pelvic floor components that respond to training." },
  { title: "Urinary Health", body: "Strong pelvic floor muscles support urinary control and reduce the frequency and urgency associated with an overactive bladder, particularly important for men over 45." },
];

export default function PelvicFloorView() {
  const [activeTab, setActiveTab] = useState<Tab>("program");
  const [openWeek, setOpenWeek] = useState(0);

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

      {activeTab === "program" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            The pelvic floor is the most overlooked muscle group in men&apos;s sexual health. Strong pelvic floor muscles directly improve erection quality, ejaculatory control, and urinary function. This is not optional for men serious about sexual performance.
          </p>
          <p className="text-xs text-zinc-500">Track your week in the Progress Tracker.</p>

          {WEEKS.map((week, wi) => {
            const isOpen = openWeek === wi;
            return (
              <div key={week.label} className={`rounded-lg border-l-4 ${isOpen ? "border-yellow-600" : "border-zinc-700"} bg-zinc-900`}>
                <button type="button" onClick={() => setOpenWeek(isOpen ? -1 : wi)} className="flex w-full items-center justify-between px-4 py-3 text-left">
                  <div>
                    <span className={`text-sm font-bold ${isOpen ? "text-yellow-600" : "text-white"}`}>{week.label}</span>
                    <span className="ml-2 text-xs text-zinc-500">{week.phase}</span>
                  </div>
                  <svg className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isOpen && (
                  <div className="space-y-3 px-4 pb-4">
                    {week.exercises.map((ex) => (
                      <div key={ex.name} className="rounded border border-zinc-800 bg-zinc-900/50 p-3">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-sm font-medium text-white">{ex.name}</span>
                          <span className="text-xs font-semibold text-yellow-500">{ex.sets}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-500">
                          <span>{ex.hold}</span>
                          <span>Rest: {ex.rest}</span>
                          <span>Freq: {ex.frequency}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-xs italic text-zinc-400">{ex.cue}</p>
                          {PF_YOUTUBE[ex.name] && (
                            <a href={PF_YOUTUBE[ex.name]} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded border border-red-500 px-2 py-0.5 text-[10px] font-medium text-red-400 hover:bg-red-500/10">
                              &#9654; Watch
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "why" && (
        <div className="grid gap-4 sm:grid-cols-1">
          {WHY_CARDS.map((card) => (
            <div key={card.title} className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="text-sm font-bold text-yellow-600">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{card.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
