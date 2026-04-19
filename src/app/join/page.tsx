/*
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPABASE MIGRATION
 * Run the following SQL in your Supabase SQL editor before using this page:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * CREATE TABLE IF NOT EXISTS public.waitlist_signups (
 *   id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
 *   first_name TEXT        NOT NULL,
 *   email      TEXT        NOT NULL UNIQUE,
 *   created_at TIMESTAMPTZ DEFAULT now()
 * );
 *
 * ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Anyone can join waitlist"
 * ON public.waitlist_signups
 * FOR INSERT
 * WITH CHECK (true);
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "success" | "duplicate" | "error";

const VALUE_PROPS = [
  "Personalized supplement stack based on your health profile",
  "AI-powered guidance and progress tracking",
  "Exclusive early access pricing",
];

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

export default function JoinPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail]         = useState("");
  const [status, setStatus]       = useState<Status>("idle");
  const [errorMsg, setErrorMsg]   = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("waitlist_signups")
      .insert({ first_name: firstName.trim(), email: email.trim().toLowerCase() });

    if (error) {
      if (error.code === "23505") {
        setStatus("duplicate");
      } else {
        setStatus("error");
        setErrorMsg(error.message);
      }
      return;
    }

    setStatus("success");
  }

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

      {/* ─── HERO + FORM ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-2xl px-6 pb-24 pt-20 text-center">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-yellow-600">
          Early Access
        </p>

        {/* Headline */}
        <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
          Be the First to Experience{" "}
          <span className="text-yellow-600">Perfect Stack</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-400">
          Join the waitlist and get early access to the men&apos;s health and
          performance system built around your biology.
        </p>

        {/* Value props */}
        <ul className="mx-auto mt-8 max-w-sm space-y-3 text-left">
          {VALUE_PROPS.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
              <span className="text-sm text-zinc-300">{item}</span>
            </li>
          ))}
        </ul>

        {/* ── Form / Success state ──────────────────────────────────────── */}
        <div className="mx-auto mt-10 max-w-sm">
          {status === "success" ? (
            /* Success confirmation */
            <div className="rounded-lg border border-yellow-600/30 bg-yellow-600/5 px-6 py-8">
              <div className="flex justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-600/20">
                  <CheckIcon className="h-6 w-6 text-yellow-500" />
                </span>
              </div>
              <p className="mt-4 text-lg font-semibold text-yellow-500">
                You&apos;re on the list!
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                We&apos;ll reach out to{" "}
                <span className="font-medium text-zinc-200">{email}</span> when
                early access opens.
              </p>
            </div>
          ) : (
            /* Waitlist form */
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* First name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1.5 block text-sm font-medium text-zinc-300"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alex"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:border-yellow-500 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-zinc-300"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-600 transition focus:border-yellow-500 focus:outline-none"
                />
              </div>

              {/* Inline error messages */}
              {status === "duplicate" && (
                <p className="text-sm text-yellow-500">
                  This email is already on our waitlist.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-400">
                  Something went wrong{errorMsg ? `: ${errorMsg}` : ""}. Please try again.
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-yellow-500 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-60"
              >
                {status === "loading" ? "Joining…" : "Join the Waitlist"}
              </button>

              <p className="text-center text-xs text-zinc-600">
                No spam. We&apos;ll only email you when it&apos;s time.
              </p>
            </form>
          )}
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
