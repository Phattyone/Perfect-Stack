"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PLANS, type PlanKey } from "@/lib/stripe/plans";

interface PricingViewProps {
  currentPlan: string;
  userId: string;
  userEmail: string;
  isLoggedIn: boolean;
}

const PLAN_ORDER: PlanKey[] = ["free", "foundation", "complete"];

export default function PricingView({
  currentPlan,
  userId,
  userEmail,
  isLoggedIn,
}: PricingViewProps) {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const success = searchParams.get("subscription") === "success";
  const canceled = searchParams.get("canceled") === "true";

  const PRICE_IDS: Record<string, Record<string, string>> = {
    foundation: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_FOUNDATION_MONTHLY ?? "",
      annual: process.env.NEXT_PUBLIC_STRIPE_FOUNDATION_ANNUAL ?? "",
    },
    complete: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_COMPLETE_MONTHLY ?? "",
      annual: process.env.NEXT_PUBLIC_STRIPE_COMPLETE_ANNUAL ?? "",
    },
  };

  async function handleSubscribe(planKey: PlanKey) {
    const priceId = PRICE_IDS[planKey]?.[billing];

    if (!priceId) {
      setError("Price configuration error  -  please contact support.");
      return;
    }
    if (!isLoggedIn) {
      setError("Please sign in to subscribe.");
      return;
    }

    setLoading(planKey);
    setError(null);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, userId, userEmail }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to create checkout session.");
        setLoading(null);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(null);
    }
  }

  return (
    <div>
      {/* Success / canceled banners */}
      {success && (
        <div className="mb-8 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-center text-sm text-green-400">
          Subscription activated! Welcome to Perfect Stack.
        </div>
      )}
      {canceled && (
        <div className="mb-8 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-center text-sm text-zinc-400">
          Checkout was canceled. No charges were made.
        </div>
      )}
      {error && (
        <div className="mb-8 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">
          Choose Your Protocol
        </h1>
        <p className="mt-2 text-zinc-400">
          Unlock the full Perfect Stack system. Cancel anytime.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setBilling("monthly")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            billing === "monthly"
              ? "bg-yellow-600 text-black"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setBilling("annual")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            billing === "annual"
              ? "bg-yellow-600 text-black"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          Annual
          <span className="ml-1 text-xs opacity-70">save up to 30%</span>
        </button>
      </div>

      {/* Plan cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {PLAN_ORDER.map((planKey) => {
          const plan = PLANS[planKey];
          const isCurrent = currentPlan === planKey || (planKey === "complete" && currentPlan === "ultimate");
          const isPopular = planKey === "foundation";
          const price =
            billing === "monthly" ? plan.monthlyPrice : plan.annualPrice;
          const monthlyEquiv =
            billing === "annual" && plan.annualPrice > 0
              ? Math.round((plan.annualPrice / 12) * 100) / 100
              : null;
          const annualSavings =
            plan.monthlyPrice > 0
              ? plan.monthlyPrice * 12 - plan.annualPrice
              : 0;

          return (
            <div
              key={planKey}
              className={`relative rounded-lg border p-6 ${
                isPopular
                  ? "border-yellow-600/50 bg-zinc-900"
                  : "border-zinc-800 bg-zinc-900"
              }`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-600 px-3 py-0.5 text-[10px] font-bold uppercase text-black">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <p className="mt-1 text-xs text-zinc-400">{plan.description}</p>

              {/* Price */}
              <div className="mt-4">
                {price === 0 ? (
                  <span className="text-3xl font-bold text-white">Free</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-yellow-500">
                      ${billing === "monthly" ? price : monthlyEquiv}
                    </span>
                    <span className="text-sm text-zinc-500">/mo</span>
                    {billing === "annual" && (
                      <div className="mt-1 text-xs text-zinc-500">
                        ${plan.annualPrice}/year · Save ${annualSavings}/yr
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Features */}
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs text-zinc-300"
                  >
                    <svg
                      className="mt-0.5 h-3 w-3 shrink-0 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-6">
                {isCurrent ? (
                  <button
                    disabled
                    className="w-full rounded-md bg-yellow-600/20 px-4 py-2 text-sm font-semibold text-yellow-600"
                  >
                    Current Plan
                  </button>
                ) : planKey === "free" ? (
                  <a
                    href={isLoggedIn ? "/dashboard" : "/signup"}
                    className="block w-full rounded-md border border-zinc-700 px-4 py-2 text-center text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                  >
                    {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSubscribe(planKey)}
                    disabled={loading === planKey || !isLoggedIn}
                    className="w-full rounded-md bg-yellow-600 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500 disabled:opacity-50"
                  >
                    {loading === planKey
                      ? "Redirecting..."
                      : !isLoggedIn
                        ? "Sign in to subscribe"
                        : billing === "monthly"
                          ? `Subscribe $${plan.monthlyPrice}/mo`
                          : `Subscribe $${plan.annualPrice}/yr`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
