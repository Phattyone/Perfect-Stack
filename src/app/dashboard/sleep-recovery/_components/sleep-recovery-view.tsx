"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "sleep" | "recovery" | "stress";
const TABS: { key: Tab; label: string }[] = [
  { key: "sleep", label: "Sleep Protocol" },
  { key: "recovery", label: "Recovery" },
  { key: "stress", label: "Stress Management" },
];

const SLEEP_CHECKLIST = [
  { item: "Consistent bedtime before midnight", why: "Testosterone production peaks during early sleep cycles. Irregular or late bedtimes disrupt this window." },
  { item: "7-9 hours minimum", why: "Below 6 hours, testosterone drops measurably. Below 5 hours, the effect is equivalent to aging 10-15 years hormonally." },
  { item: "Dark room", why: "Complete darkness triggers melatonin production. Use blackout curtains or a sleep mask." },
  { item: "Cool temperature 65-68\u00B0F", why: "Core body temperature must drop to initiate deep sleep. Cooler rooms accelerate this." },
  { item: "No screens 60 min before bed", why: "Blue light suppresses melatonin by up to 50%. Use Night Shift or blue light glasses after 8 PM." },
  { item: "No alcohol within 3 hours of sleep", why: "Alcohol fragments REM sleep and reduces testosterone production during sleep by up to 20%." },
  { item: "No refined sugar after 8 PM", why: "Insulin spikes from late sugar intake interfere with growth hormone release during early sleep." },
  { item: "Magnesium Glycinate 400mg 30-60 min before bed", why: "Promotes muscle relaxation and deep sleep onset.", link: "/dashboard/stack-builder", linkText: "View in Stack Builder" },
  { item: "Sleep Optimizer Smoothie 3+ nights per week", why: "Tart cherry melatonin precursors, magnesium, and chamomile cortisol reduction.", link: "/dashboard/recipes", linkText: "View Recipe" },
];

const RECOVERY_CARDS = [
  { title: "Active Recovery", body: "On non-training days, 20-30 min of light movement: walking, cycling, swimming. Increases blood flow without adding stress. Reduces cortisol and supports testosterone." },
  { title: "Cold and Heat Exposure", body: "Cold shower finishing 2-3 min cold increases norepinephrine and improves mood and focus. Sauna 15-20 min post-workout increases growth hormone. Both reduce inflammation." },
  { title: "Foam Rolling and Stretching", body: "10 min post-workout reduces DOMS and cortisol. Lower cortisol means higher free testosterone.", link: "/dashboard/exercise", linkText: "View Mobility Routine" },
];

const STRESS_CARDS = [
  { title: "Breathwork", body: "4-7-8 breathing: inhale 4 counts, hold 7, exhale 8. Do this 4 cycles before bed or during high stress moments. Activates the parasympathetic nervous system within 90 seconds." },
  { title: "Morning Sunlight", body: "10 minutes of direct sunlight within 60 minutes of waking. Anchors circadian rhythm, boosts serotonin, and sets cortisol to its natural morning peak rather than an extended elevated state." },
  { title: "Training", body: "Resistance training reduces chronic cortisol over time. The acute cortisol spike from training is followed by a sustained reduction. This is the paradox of exercise stress." },
  { title: "Adaptogens", body: "Ashwagandha KSM-66 reduces cortisol by up to 30% in clinical trials. Already in your Stack B.", link: "/dashboard/stack-builder", linkText: "View in Stack Builder" },
  { title: "Social Connection and Purpose", body: "Isolation elevates cortisol chronically. Men with strong social bonds have measurably higher testosterone. This is biological, not motivational." },
];

export default function SleepRecoveryView() {
  const [activeTab, setActiveTab] = useState<Tab>("sleep");

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

      {activeTab === "sleep" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Testosterone is primarily produced during sleep. A single night of poor sleep reduces testosterone by 10-15%. This is the most underrated performance drug available and it is free.
          </p>
          {SLEEP_CHECKLIST.map((item) => (
            <div key={item.item} className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
              <svg className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <span className="text-sm font-medium text-white">{item.item}</span>
                <p className="mt-0.5 text-xs text-zinc-400">{item.why}</p>
                {"link" in item && item.link && (
                  <Link href={item.link} className="mt-1 inline-block text-xs font-medium text-yellow-600 hover:text-yellow-500">{item.linkText} &rarr;</Link>
                )}
              </div>
            </div>
          ))}
          <p className="text-xs text-zinc-500">Track your sleep score each week in the Progress Tracker.</p>
        </div>
      )}

      {activeTab === "recovery" && (
        <div className="space-y-4">
          {RECOVERY_CARDS.map((card) => (
            <div key={card.title} className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="text-sm font-bold text-yellow-600">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{card.body}</p>
              {"link" in card && card.link && (
                <Link href={card.link} className="mt-2 inline-block text-xs font-medium text-yellow-600 hover:text-yellow-500">{card.linkText} &rarr;</Link>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "stress" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-400">
            Cortisol and testosterone have an inverse relationship. When cortisol goes up, testosterone goes down. Chronic stress is one of the most significant suppressors of testosterone in modern men.
          </p>
          {STRESS_CARDS.map((card) => (
            <div key={card.title} className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="text-sm font-bold text-yellow-600">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{card.body}</p>
              {"link" in card && card.link && (
                <Link href={card.link} className="mt-2 inline-block text-xs font-medium text-yellow-600 hover:text-yellow-500">{card.linkText} &rarr;</Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
