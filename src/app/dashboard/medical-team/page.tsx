import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/(auth)/actions";
import { PROVIDERS } from "@/lib/data/medical-providers";
import { isUltimate } from "@/lib/subscription";
import LockedFeature from "@/components/locked-feature";

export default async function MedicalTeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: subData } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();
  const subscriptionStatus = subData?.subscription_status ?? null;

  const localProviders = PROVIDERS.filter((p) => p.type === "local");
  const telehealthProviders = PROVIDERS.filter((p) => p.type === "telehealth");

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="text-lg font-bold text-yellow-600 transition-all duration-200 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgba(234,179,8,0.5)]"
          >
            Perfect Stack
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-zinc-400 sm:inline">{user.email}</span>
            <form action={signout}>
              <button
                type="submit"
                className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-yellow-600 hover:text-white"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-zinc-300"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-white">Your Medical Team</h1>
        <p className="mt-1 text-zinc-400">
          Connect with physicians and labs who specialize in men&apos;s health,
          hormone optimization, and the tests that matter.
        </p>

        {!isUltimate(subscriptionStatus) ? (
          <LockedFeature
            featureName="Your Medical Team"
            description="Connect with physicians and labs specializing in men's health, hormone optimization, and the tests that matter."
            requiredPlan="ultimate"
          />
        ) : (
          <>
        {/* Disclaimer */}
        <div className="mt-6 rounded-lg border border-yellow-600/30 bg-yellow-600/5 px-4 py-3 text-xs leading-relaxed text-yellow-500/80">
          This page contains referral links to medical providers. Perfect Stack
          is not a medical practice and does not provide medical advice. Always
          consult a qualified physician before starting hormone therapy or making
          changes to prescription medications.
        </div>

        {/* ─── LOCAL PROVIDERS ──────────────────────────────────────── */}
        <section className="mt-8">
          <h2 className="mb-4 text-lg font-bold text-white">
            <span className="mr-1">📍</span> Local Providers  -  Boston Area
          </h2>

          {localProviders.map((provider) => (
            <div
              key={provider.id}
              className="rounded-lg border border-yellow-600/30 bg-zinc-900 p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="text-lg font-bold text-yellow-600">
                    {provider.name}
                  </span>
                  <span className="ml-2 text-sm text-zinc-400">
                     -  {provider.practice}
                  </span>
                </div>
                <span className="rounded-full bg-yellow-600 px-3 py-0.5 text-[10px] font-bold uppercase text-black">
                  Featured Provider
                </span>
              </div>

              <div className="mt-1 flex flex-wrap gap-3 text-xs text-zinc-400">
                <span>{provider.specialty}</span>
                {provider.location && <span>· {provider.location}</span>}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                {provider.description}
              </p>

              {/* Services */}
              <div className="mt-4">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Services
                </h4>
                <ul className="grid gap-1 sm:grid-cols-2">
                  {provider.services.map((svc) => (
                    <li
                      key={svc}
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
                      {svc}
                    </li>
                  ))}
                </ul>
              </div>

              {provider.notes && (
                <p className="mt-3 text-xs italic text-zinc-400">
                  {provider.notes}
                </p>
              )}

              {/* Buttons */}
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-yellow-600 hover:text-white"
                >
                  Visit Website
                </a>
                <a
                  href={provider.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-500"
                >
                  Book Appointment
                </a>
              </div>

              <p className="mt-2 text-[10px] text-zinc-600">
                Perfect Stack may receive a referral fee when you book through
                this link.
              </p>
            </div>
          ))}
        </section>

        {/* ─── TELEHEALTH PROVIDERS ─────────────────────────────────── */}
        <section className="mt-10">
          <h2 className="mb-2 text-lg font-bold text-white">
            <span className="mr-1">💻</span> Telehealth Providers  -  Available
            Nationwide
          </h2>
          <p className="mb-4 text-sm text-zinc-400">
            Don&apos;t have a local men&apos;s health specialist? These
            telehealth platforms let you get labs, consultations, and treatment
            from home. Referral partnerships coming soon.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {telehealthProviders.map((provider) => (
              <div
                key={provider.id}
                className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 opacity-60"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-zinc-300">
                    {provider.name}
                  </h4>
                  <span className="shrink-0 rounded-full border border-zinc-600 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                    Coming Soon
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-zinc-500">
                  {provider.specialty}
                </p>

                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  {provider.description}
                </p>

                <ul className="mt-2 space-y-0.5">
                  {provider.services.slice(0, 4).map((svc) => (
                    <li key={svc} className="text-[10px] text-zinc-500">
                      · {svc}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-[10px] italic text-zinc-600">
                  Referral link coming soon
                </p>
              </div>
            ))}
          </div>
        </section>
          </>
        )}
      </main>
    </div>
  );
}
