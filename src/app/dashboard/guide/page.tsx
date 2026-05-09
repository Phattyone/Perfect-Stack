import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/(auth)/actions";
import GuideView from "./_components/guide-view";

// Retry the profile fetch up to `retries` times with `delayMs` between attempts.
// Used when ?purchase=success is in the URL but has_digital_guide is still false,
// which can happen when the Stripe webhook arrives slightly after the redirect.
async function fetchGuideProfileWithRetry(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  purchaseSuccess: boolean,
  retries = 3,
  delayMs = 1000
) {
  const select =
    "has_digital_guide, digital_guide_name, digital_guide_license_id, subscription_status";

  const { data: initial } = await supabase
    .from("profiles")
    .select(select)
    .eq("id", userId)
    .single();

  if (!purchaseSuccess || initial?.has_digital_guide) return initial;

  // Webhook may still be in flight — retry with delay
  for (let i = 0; i < retries; i++) {
    await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    const { data: retried } = await supabase
      .from("profiles")
      .select(select)
      .eq("id", userId)
      .single();
    if (retried?.has_digital_guide) return retried;
  }

  return initial; // return what we have after exhausting retries
}

export default async function GuidePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = await searchParams;
  const purchaseSuccess = params.purchase === "success";

  const profile = await fetchGuideProfileWithRetry(
    supabase,
    user.id,
    purchaseSuccess
  );

  const guideData = {
    hasGuide: profile?.has_digital_guide ?? false,
    guideName: profile?.digital_guide_name ?? null,
    licenseId: profile?.digital_guide_license_id ?? null,
    userId: user.id,
    userEmail: user.email ?? "",
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold text-yellow-600 no-underline hover:no-underline transition-all duration-200 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgba(234,179,8,0.5)]"
          >
            Perfect Stack
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-zinc-400 sm:inline">
              {user.email}
            </span>
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

      <main className="mx-auto max-w-3xl px-6 py-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-zinc-300"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-white">Digital Guide</h1>
        <p className="mt-1 text-zinc-400">
          The complete Perfect Stack protocol — personalized to you.
        </p>

        <div className="mt-6">
          <GuideView {...guideData} />
        </div>
      </main>
    </div>
  );
}
