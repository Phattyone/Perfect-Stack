"use client";

import Link from "next/link";

interface LockedFeatureProps {
  featureName: string;
  description: string;
  requiredPlan: "foundation" | "ultimate";
}

export default function LockedFeature({ featureName, description, requiredPlan }: LockedFeatureProps) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-10 max-w-md mx-auto mt-20 text-center">
      <div className="flex justify-center mb-4">
        <svg
          className="h-8 w-8 text-yellow-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">{featureName}</h2>
      <p className="text-sm text-zinc-400 mb-2">{description}</p>
      <p className="text-sm text-zinc-500 mb-6">You are currently on the free plan</p>
      <Link
        href="/dashboard/pricing"
        className="inline-block rounded-lg bg-yellow-500 px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-400"
      >
        {requiredPlan === "foundation" ? "Upgrade to Foundation" : "Upgrade to Ultimate"}
      </Link>
    </div>
  );
}
