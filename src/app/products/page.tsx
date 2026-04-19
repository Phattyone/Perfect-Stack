import Link from "next/link";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

const PERFECT_STACK_FEATURES = [
  "Personalized supplement stack builder",
  "Perfect Chat AI and progress tracking",
  "Recipes, meal plans, and performance drinks",
  "8-week journal and milestone system",
];

const HER_STACK_FEATURES = [
  "Personalized hormone-support stack",
  "Cycle-aware nutrition and supplement timing",
  "Energy, mood, and sleep optimization",
  "Progress tracking and wellness journal",
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ─── NAV ───────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-yellow-600 no-underline hover:no-underline transition hover:text-yellow-500">
            Perfect Stack<sup className="text-[8px]">&trade;</sup>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/products"
              className="hidden text-sm font-medium text-yellow-600 sm:inline"
            >
              Products
            </Link>
            <Link
              href="/login"
              className="hidden text-sm text-zinc-400 transition hover:text-white sm:inline"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-yellow-600 px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-yellow-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-20 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-600">
          The Ecosystem
        </p>
        <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
          The Perfect Stack Ecosystem
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400">
          Science-backed health and wellness systems built for real results.
        </p>
      </section>

      {/* ─── PRODUCT CARDS ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 sm:grid-cols-3">

          {/* ── Card 1: Perfect Stack (Men) ─────────────────────────────── */}
          <div className="flex flex-col rounded-lg border border-zinc-800 border-t-2 border-t-yellow-500 bg-zinc-900 p-6">
            {/* Badge */}
            <span className="inline-flex w-fit items-center rounded-full bg-yellow-600/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-500">
              Available Now
            </span>

            {/* Title */}
            <h2 className="mt-4 text-xl font-bold text-white">Perfect Stack</h2>
            <p className="mt-1 text-sm font-medium text-yellow-600">
              Men&apos;s Health &amp; Performance
            </p>

            {/* Description */}
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              A complete personalized system covering supplements, nutrition,
              training, sleep, and recovery - optimized for testosterone, nitric
              oxide, and sexual health.
            </p>

            {/* Features */}
            <ul className="mt-5 flex-1 space-y-2.5">
              {PERFECT_STACK_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-yellow-500" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/signup"
              className="mt-8 block rounded-lg bg-yellow-500 px-4 py-2.5 text-center text-sm font-semibold text-black transition hover:bg-yellow-400"
            >
              Get Started
            </Link>
          </div>

          {/* ── Card 2: Her Stack (Women) ────────────────────────────────── */}
          <div className="flex flex-col rounded-lg border border-zinc-800 border-t-2 border-t-zinc-600 bg-zinc-900 p-6">
            {/* Badge */}
            <span className="inline-flex w-fit items-center rounded-full bg-zinc-700 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
              Coming Soon
            </span>

            {/* Title */}
            <h2 className="mt-4 text-xl font-bold text-white">Her Stack</h2>
            <p className="mt-1 text-sm font-medium text-zinc-400">
              Women&apos;s Wellness &amp; Vitality
            </p>

            {/* Description */}
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              A women&apos;s health system designed around hormonal balance,
              energy, mood, and long-term vitality. Built with the same
              science-first approach as Perfect Stack.
            </p>

            {/* Features — grayed to signal coming soon */}
            <ul className="mt-5 flex-1 space-y-2.5">
              {HER_STACK_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-500">
                  <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/join"
              className="mt-8 block rounded-lg bg-zinc-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-zinc-600"
            >
              Get Early Access
            </Link>
          </div>

          {/* ── Card 3: Future Products ──────────────────────────────────── */}
          <div className="flex flex-col rounded-lg border border-zinc-800 border-t-2 border-t-zinc-700 bg-zinc-900 p-6">
            {/* Badge */}
            <span className="inline-flex w-fit items-center rounded-full bg-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
              In Development
            </span>

            {/* Title */}
            <h2 className="mt-4 text-xl font-bold text-white">More Coming Soon</h2>
            <p className="mt-1 text-sm font-medium text-zinc-500">
              Expanding the Ecosystem
            </p>

            {/* Description */}
            <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
              We are building additional health systems for specific goals and
              demographics. Stay tuned for what comes next.
            </p>

            {/* CTA */}
            <Link
              href="/join"
              className="mt-8 block rounded-lg bg-zinc-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-zinc-600"
            >
              Join the Waitlist
            </Link>
          </div>

        </div>
      </section>

      {/* ─── BOTTOM CTA ────────────────────────────────────────────────── */}
      <section className="border-t border-zinc-800 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to optimize your health?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-zinc-400">
            Join thousands of men taking a science-backed approach to performance.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-md bg-yellow-600 px-8 py-3 text-sm font-semibold text-black transition hover:bg-yellow-500"
            >
              Get Started
            </Link>
            <Link
              href="/"
              className="rounded-md border border-zinc-700 px-8 py-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <span className="text-xs text-zinc-600">
            &copy; 2026 Perfect Stack. All rights reserved.
          </span>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-zinc-500 transition hover:text-zinc-400">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-zinc-500 transition hover:text-zinc-400">
              Terms
            </Link>
            <a
              href="mailto:hello@getperfectstack.com"
              className="text-xs text-zinc-500 transition hover:text-zinc-400"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
