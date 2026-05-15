"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// ─── Personalization progress steps ──────────────────────────────────────────
const PERSONALIZE_STEPS = [
  "Saving your details...",
  "Preparing your guide...",
  "Adding your personalization to every page...",
  "Finalizing your guide...",
  "Almost done - your guide will load shortly...",
];

interface GuideViewProps {
  hasGuide: boolean;
  guideName: string | null;
  licenseId: string | null;
  userId: string;
  userEmail: string;
}

// ─── State 1: Not purchased ──────────────────────────────────────────────────

function NotPurchasedView({
  userId,
  userEmail,
  showCanceled,
}: {
  userId: string;
  userEmail: string;
  showCanceled: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePurchase() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/create-guide-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to start checkout");
      if (data.url) window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {showCanceled && (
        <div className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-300">
          Purchase canceled. Your card was not charged.
        </div>
      )}

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        {/* Book icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-600/10 text-2xl">
          📖
        </div>

        <h2 className="text-xl font-bold text-white">
          Perfect Stack Digital Guide
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          The complete 200+ page Perfect Stack protocol guide, personalized with
          your name and licensed to you. Download and read on any device:
          phone, tablet, or computer.
        </p>

        {/* Feature list */}
        <ul className="mt-5 space-y-2">
          {[
            "Personalized with your name on every page",
            "Download and read offline on any device",
            "Complete supplement protocols, meal plans, and 8-week program",
            "Includes all recipes, drinks, shots, and smoothies",
            "Lifetime access - re-download anytime",
          ].map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-zinc-300">
              <span className="mt-0.5 shrink-0 text-yellow-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>

        {/* Price and CTA */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-2xl font-bold text-white">$19</span>
          <span className="text-sm text-zinc-500">one-time purchase</span>
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}

        <button
          type="button"
          onClick={handlePurchase}
          disabled={loading}
          className="mt-4 w-full rounded-md bg-yellow-600 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Redirecting to checkout..." : "Purchase Digital Guide - $19"}
        </button>

        <p className="mt-3 text-center text-xs text-zinc-500">
          Available as an add-on for Foundation and Ultimate subscribers.
        </p>
      </div>
    </div>
  );
}

// ─── State 2: Purchased, not yet personalized ────────────────────────────────

function PersonalizeView({
  onPersonalized,
}: {
  onPersonalized: (name: string, downloadUrl: string) => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [personalizeStep, setPersonalizeStep] = useState(0);

  // Advance the progress step indicator every 15 seconds while loading
  useEffect(() => {
    if (!loading) {
      setPersonalizeStep(0);
      return;
    }
    const interval = setInterval(() => {
      setPersonalizeStep((prev) => {
        if (prev < PERSONALIZE_STEPS.length - 1) {
          return prev + 1;
        } else {
          // All steps complete but still personalizing — refresh to check if guide is ready
          setTimeout(() => {
            window.location.reload();
          }, 3000);
          return prev;
        }
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/guide/personalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to personalize guide");
      onPersonalized(name.trim(), data.downloadUrl ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  // ── Progress UI shown while PDF is being generated ────────────────────────
  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex flex-col items-center gap-6 py-8">
          {/* Spinner */}
          <svg className="animate-spin h-12 w-12 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>

          {/* Current step text */}
          <p className="text-yellow-500 font-semibold text-lg text-center">
            {PERSONALIZE_STEPS[personalizeStep]}
          </p>

          {/* Step dots */}
          <div className="flex gap-2">
            {PERSONALIZE_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  i <= personalizeStep ? "bg-yellow-500" : "bg-zinc-700"
                }`}
              />
            ))}
          </div>

          {/* Warning */}
          <p className="text-zinc-500 text-sm text-center max-w-sm">
            Please do not close or refresh this page. Your personalized guide is being created and may take up to 90 seconds.
          </p>
        </div>
      </div>
    );
  }

  // ── Form shown before submission ──────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-green-700/50 bg-green-900/20 px-4 py-3 text-sm text-green-400">
        <span className="font-semibold">Purchase successful!</span> Personalize
        your guide below.
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-lg font-semibold text-white">
          Personalize Your Guide
        </h2>
        <p className="mt-1 text-sm text-zinc-400">
          Enter your name exactly as you would like it to appear on your guide.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="guide-name"
              className="block text-sm font-medium text-zinc-300"
            >
              Your Full Name
            </label>
            <input
              id="guide-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name as it will appear in your guide"
              maxLength={100}
              required
              className="mt-1.5 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-yellow-600 focus:outline-none"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Your name will be added to every page of your personalized guide.
            </p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-md bg-yellow-600 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Personalize My Guide
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── State 3: Purchased and personalized ────────────────────────────────────

function ReadyView({
  guideName,
  licenseId,
  initialDownloadUrl,
}: {
  guideName: string;
  licenseId: string;
  initialDownloadUrl?: string;
}) {
  const firstName = guideName.split(" ")[0] ?? guideName;
  const shortLicenseId = licenseId.slice(0, 8);

  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // If we just came from personalization, trigger download automatically
  useEffect(() => {
    if (initialDownloadUrl) {
      triggerDownload(initialDownloadUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function triggerDownload(url: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = "Perfect-Stack-Guide.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async function handleDownload() {
    setDownloadLoading(true);
    setDownloadError(null);
    try {
      const res = await fetch("/api/guide/generate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate guide");
      triggerDownload(data.url);
    } catch (err) {
      setDownloadError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setDownloadLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Ready card */}
      <div className="rounded-lg border border-green-700/50 bg-zinc-900 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-900/40 text-xl">
            ✅
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Your guide is ready, {firstName}!
            </h2>
            <p className="mt-0.5 text-sm text-zinc-400">
              Personalized for:{" "}
              <span className="text-zinc-200">{guideName}</span>
            </p>
            <p className="text-sm text-zinc-500">
              License ID:{" "}
              <span className="font-mono text-zinc-400">
                {shortLicenseId}…
              </span>
            </p>
          </div>
        </div>

        {downloadError && (
          <p className="mt-4 text-sm text-red-400">{downloadError}</p>
        )}

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloadLoading}
          className="mt-5 w-full rounded-md bg-yellow-600 px-6 py-3 text-sm font-semibold text-black transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {downloadLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Preparing your download...
            </>
          ) : "Download My Guide"}
        </button>

        {downloadLoading && (
          <p className="text-zinc-500 text-xs italic mt-2 text-center">
            Please wait and do not refresh the page. This may take up to 30 seconds.
          </p>
        )}

        {!downloadLoading && (
          <p className="mt-3 text-center text-xs text-zinc-500">
            Need a fresh copy?{" "}
            <button
              type="button"
              onClick={handleDownload}
              className="underline hover:text-zinc-300"
            >
              Regenerate your personalized guide
            </button>
          </p>
        )}
      </div>

      {/* License notice */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
        <p className="text-xs leading-relaxed text-zinc-500">
          Your guide is licensed to you personally. Please do not share,
          distribute, or reproduce this guide. See our{" "}
          <a href="/terms" className="underline hover:text-zinc-400">
            Terms of Service
          </a>{" "}
          for details.
        </p>
      </div>
    </div>
  );
}

// ─── Orchestrator ────────────────────────────────────────────────────────────

export default function GuideView({
  hasGuide,
  guideName: initialGuideName,
  licenseId,
  userId,
  userEmail,
}: GuideViewProps) {
  const searchParams = useSearchParams();
  const purchaseSuccess = searchParams.get("purchase") === "success";
  const purchaseCanceled = searchParams.get("canceled") === "true";

  // Local state to support client-side transitions without a full page reload
  const [guideName, setGuideName] = useState<string | null>(initialGuideName);
  const [freshDownloadUrl, setFreshDownloadUrl] = useState<string | undefined>(undefined);

  function handlePersonalized(name: string, downloadUrl: string) {
    setGuideName(name);
    setFreshDownloadUrl(downloadUrl);
  }

  // State 3: purchased and personalized
  if (hasGuide && guideName) {
    return (
      <ReadyView
        guideName={guideName}
        licenseId={licenseId ?? ""}
        initialDownloadUrl={freshDownloadUrl}
      />
    );
  }

  // State 2: purchased but not yet personalized
  if (hasGuide || purchaseSuccess) {
    return <PersonalizeView onPersonalized={handlePersonalized} />;
  }

  // State 1: not purchased
  return (
    <NotPurchasedView
      userId={userId}
      userEmail={userEmail}
      showCanceled={purchaseCanceled}
    />
  );
}
