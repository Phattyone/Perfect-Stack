import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/(auth)/actions";

const cards = [
  {
    title: "Stack Builder",
    description:
      "Build and customize your personalized supplement stack based on your goals and health profile.",
    href: "/dashboard/stack-builder",
  },
  {
    title: "Progress Tracker",
    description:
      "Log daily check-ins and track your progress over time with visual charts and streaks.",
    href: "/dashboard/progress",
  },
  {
    title: "Recipes & Meal Plan",
    description:
      "Performance recipes, 7-day starter plan, shopping list, and daily drinks protocol.",
    href: "/dashboard/recipes",
  },
  {
    title: "Equipment Guide",
    description:
      "Kitchen tools and home gym setup with Amazon links.",
    href: "/dashboard/equipment",
  },
  {
    title: "Your Medical Team",
    description:
      "Connect with physicians and labs for blood work, hormone panels, and TRT consultation.",
    href: "/dashboard/medical-team",
  },
  {
    title: "My Profile",
    description:
      "Manage your account settings, health profile, and personal preferences.",
    href: "/dashboard/profile",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check subscription status
  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .single();

  const subscriptionStatus = profile?.subscription_status ?? "free";
  const isFree = subscriptionStatus === "free";

  // Check for subscription success
  // (searchParams handled client-side via the URL)

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="text-lg font-bold text-yellow-600 transition hover:text-yellow-500"
          >
            PerfectStack
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm text-zinc-400 transition hover:text-yellow-500"
            >
              Pricing
            </Link>
            <span className="text-sm text-zinc-400">{user.email}</span>
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

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-zinc-400">
          Here&apos;s your dashboard. Pick up where you left off.
        </p>

        {/* Upgrade banner for free users */}
        {isFree && (
          <Link
            href="/pricing"
            className="mt-6 flex items-center justify-between rounded-lg border border-yellow-600/50 bg-yellow-600/5 px-6 py-4 transition hover:bg-yellow-600/10"
          >
            <div>
              <span className="text-sm font-bold text-yellow-600">
                Unlock the full Perfect Stack system.
              </span>
              <span className="ml-2 text-sm text-zinc-400">
                Starting at $14/month.
              </span>
            </div>
            <span className="shrink-0 rounded-md bg-yellow-600 px-4 py-1.5 text-sm font-semibold text-black">
              View Plans
            </span>
          </Link>
        )}

        {/* Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-lg border border-yellow-600/40 bg-zinc-900 p-6 transition hover:border-yellow-600"
            >
              <h2 className="text-lg font-semibold text-yellow-600">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
