import Link from "next/link";

const FEATURES = [
  {
    title: "Profile-driven dosing",
    body: "Your age, goals, training style, and health status calculate exact supplement doses automatically. Updated in real time as your profile changes.",
    icon: (
      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    title: "Progress tracking built in",
    body: "Baseline checklist, weekly tracker, blood work log, and an 8-week performance journal  -  all in one place. See your numbers move.",
    icon: (
      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    title: "The complete protocol",
    body: "28 chapters covering hormones, diet, supplements, training, sleep, and the full 8-week roadmap. Backed by research, written in plain language.",
    icon: (
      <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
];

const SCORES = [
  { label: "Hormone", pct: 84 },
  { label: "Blood Flow", pct: 68 },
  { label: "Recovery", pct: 61 },
  { label: "Longevity", pct: 73 },
];

const SUPPLEMENTS_PREVIEW = [
  { name: "Vitamin D3 + K2", desc: "Bone density, immune, testosterone", dose: "5,000 IU", timing: "AM" },
  { name: "Magnesium Glycinate", desc: "Sleep, muscle relaxation, T cofactor", dose: "400 mg", timing: "PM" },
  { name: "Omega-3 EPA+DHA", desc: "Cardiovascular, anti-inflammatory", dose: "2,000 mg", timing: "with meal" },
];

const FREE_FEATURES = [
  "Stack A Foundation preview",
  "Baseline checklist",
  "Quick-start guide",
  "Limited Stack Builder",
];
const FOUNDATION_FEATURES = [
  "Full Stack Builder with dosing",
  "All 5 stacks unlocked",
  "Progress tracker + journal",
  "Recipes and meal plan",
  "Shopping list + Amazon links",
  "Equipment guide",
  "Medical team referrals",
];
const COMPLETE_FEATURES = [
  "Everything in Foundation",
  "Full guide access in-app",
  "Priority new content",
  "Advanced analytics",
  "Timing reminders",
  "Early access features",
];

const STATS = [
  { number: "28", label: "Chapters", desc: "Complete men's health protocol" },
  { number: "31", label: "Supplements", desc: "Researched and vetted with interaction alerts" },
  { number: "8", label: "Weeks", desc: "Structured roadmap with weekly tracking" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ─── NAV ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold text-yellow-600">
            Perfect Stack<sup className="text-[8px]">&trade;</sup>
          </span>
          <div className="flex items-center gap-4">
            <Link href="/products" className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline">
              Products
            </Link>
            <Link href="/login" className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-yellow-600 px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-yellow-500"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-600">
          Men&apos;s Performance System
        </p>
        <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
          Your body was built for more.
          <br />
          <span className="text-yellow-600">Optimize it like you mean it.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-400">
          A men&apos;s health companion app for testosterone, blood flow, hormones, muscle performance, and peak sexual performance.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Tell us your age, goals, training style, and medications. We calculate your exact supplement protocol, doses, timing, and safety alerts - personalized to you. Backed by research, built for results.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-md bg-yellow-600 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-500"
          >
            Build Your Stack  -  Free
          </Link>
          <a
            href="#features"
            className="rounded-md border border-yellow-600/50 px-6 py-3 text-sm font-semibold text-yellow-600 transition hover:bg-yellow-600/10"
          >
            See How It Works
          </a>
          <Link
            href="/join"
            className="rounded-md border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-300"
          >
            Join the Waitlist
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            "Evidence-based protocol",
            "Personalized to your profile",
            "8-week roadmap included",
            "No prescriptions required",
          ].map((item) => (
            <span key={item} className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-600" />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────────────────────────── */}
      <section id="features" className="border-t border-zinc-800 bg-[#0a0a0a] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-600">
            The System
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">
            Everything you need. Nothing you don&apos;t.
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition hover:border-yellow-600/40"
              >
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-sm font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STACK BUILDER PREVIEW ────────────────────────────────────── */}
      <section className="border-t border-zinc-800 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
          {/* Left  -  text */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-600">
              Stack Builder
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Your protocol, calculated for you
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Set your profile once. The system calculates which supplements you
              need, the right doses for your body, and the exact timing  -  grouped
              by stack, linked directly to vetted Amazon products.
            </p>
            <div className="mt-8 space-y-4">
              {SCORES.map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">{s.label}</span>
                    <span className="text-xs font-semibold text-yellow-600">{s.pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-yellow-600"
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right  -  card preview */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">Foundation Stack &middot; Stack A</span>
              <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-400">
                Age 40-49 &middot; Lifting
              </span>
            </div>
            <div className="mt-4 space-y-4">
              {SUPPLEMENTS_PREVIEW.map((s) => (
                <div key={s.name} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-yellow-600" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{s.name}</span>
                      <span className="text-xs font-semibold text-yellow-600">{s.dose} &middot; {s.timing}</span>
                    </div>
                    <p className="text-xs text-zinc-500">{s.desc}</p>
                    <span className="mt-1 text-[10px] text-yellow-600/60">Buy on Amazon &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
              <span className="text-xs text-zinc-500">Monthly est.</span>
              <span className="text-sm font-bold text-yellow-600">$115 - $130</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING PREVIEW ─────────────────────────────────────────── */}
      <section className="border-t border-zinc-800 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-600">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Start free. Go deeper when ready.
            </h2>
            <p className="mt-2 text-sm text-zinc-500">No contracts. Cancel anytime.</p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {/* Free */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="text-lg font-bold text-white">Free</h3>
              <p className="mt-1 text-xs text-zinc-500">Get started with the essentials</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-white">$0</span>
                <span className="text-sm text-zinc-500">/mo</span>
              </div>
              <ul className="mt-4 space-y-2">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-zinc-400">
                    <svg className="mt-0.5 h-3 w-3 shrink-0 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-6 block w-full rounded-md border border-zinc-700 px-4 py-2 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white">
                Get Started Free
              </Link>
            </div>

            {/* Foundation */}
            <div className="relative rounded-lg border border-yellow-600/50 bg-zinc-900 p-6">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-600 px-3 py-0.5 text-[10px] font-bold uppercase text-black">Most Popular</span>
              <h3 className="text-lg font-bold text-white">Foundation Protocol</h3>
              <p className="mt-1 text-xs text-zinc-500">The full system personalized to you</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-yellow-500">$14</span>
                <span className="text-sm text-zinc-500">/mo</span>
              </div>
              <ul className="mt-4 space-y-2">
                {FOUNDATION_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-zinc-300">
                    <svg className="mt-0.5 h-3 w-3 shrink-0 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-6 block w-full rounded-md bg-yellow-600 px-4 py-2 text-center text-sm font-semibold text-black transition hover:bg-yellow-500">
                Start Foundation
              </Link>
            </div>

            {/* Complete */}
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
              <h3 className="text-lg font-bold text-white">Ultimate Protocol</h3>
              <p className="mt-1 text-xs text-zinc-500">Every edge. The full system.</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-yellow-500">$24</span>
                <span className="text-sm text-zinc-500">/mo</span>
              </div>
              <ul className="mt-4 space-y-2">
                {COMPLETE_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-zinc-300">
                    <svg className="mt-0.5 h-3 w-3 shrink-0 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-6 block w-full rounded-md bg-yellow-600 px-4 py-2 text-center text-sm font-semibold text-black transition hover:bg-yellow-500">
                Start Complete
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF ────────────────────────────────────────────── */}
      <section className="border-t border-zinc-800 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-white">
            Built on what actually works
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.number} className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center">
                <span className="text-4xl font-bold text-yellow-600">{s.number}</span>
                <span className="ml-1 text-lg font-bold text-white">{s.label}</span>
                <p className="mt-2 text-xs text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ───────────────────────────────────────────────── */}
      <section className="border-t border-zinc-800 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Your baseline starts today.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-400">
            Five minutes. No blood work required. Just an honest look at where
            you are  -  and a clear path forward.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-md bg-yellow-600 px-8 py-3 text-sm font-semibold text-black transition hover:bg-yellow-500"
          >
            Build Your Stack  -  Free
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <span className="text-xs text-zinc-600">
            &copy; 2026 Perfect Stack. All rights reserved.
          </span>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/products" className="text-xs text-zinc-500 transition hover:text-zinc-400">Products</Link>
            <Link href="/join" className="text-xs text-zinc-500 transition hover:text-zinc-400">Waitlist</Link>
            <Link href="/privacy" className="text-xs text-zinc-500 transition hover:text-zinc-400">Privacy</Link>
            <Link href="/terms" className="text-xs text-zinc-500 transition hover:text-zinc-400">Terms</Link>
            <a href="mailto:hello@getperfectstack.com" className="text-xs text-zinc-500 transition hover:text-zinc-400">Contact</a>
          </div>
        </div>
        <div className="mx-auto mt-2 max-w-6xl px-6 text-center">
          <span className="text-xs text-zinc-500">Perfect Stack v1.0</span>
        </div>
      </footer>
    </div>
  );
}
