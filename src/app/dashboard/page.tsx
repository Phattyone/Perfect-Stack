import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/(auth)/actions";
import { isFree, isUltimate } from "@/lib/subscription";

type LockTier = "foundation" | "ultimate" | null;

// Digital Guide tile is dynamic — rendered separately below the cards grid
const cards: {
  title: string;
  description: string;
  href: string;
  startHere?: boolean;
  lockTier: LockTier;
}[] = [
  {
    title: "My Profile",
    description: "Set up your health profile first. Everything else personalizes to you.",
    href: "/dashboard/profile",
    startHere: true,
    lockTier: null,
  },
  {
    title: "Stack Builder",
    description: "Build and customize your personalized supplement stack based on your goals and health profile.",
    href: "/dashboard/stack-builder",
    lockTier: null, // partial access for free users
  },
  {
    title: "Progress Tracker",
    description: "Log daily check-ins and track your progress over time with visual charts and streaks.",
    href: "/dashboard/progress",
    lockTier: null, // partial access for free users
  },
  {
    title: "Recipes & Meal Plan",
    description: "Performance recipes, 7-day starter plan, shopping list, and daily drinks protocol.",
    href: "/dashboard/recipes",
    lockTier: null, // partial access for free users
  },
  {
    title: "Exercise & Training",
    description: "Testosterone-boosting resistance training, mobility work, and the 3-day protocol built around compound movements.",
    href: "/dashboard/exercise",
    lockTier: "foundation",
  },
  {
    title: "My Journal",
    description: "Weekly 8-week progress journal with performance scores, protocol notes, and progress photos.",
    href: "/dashboard/journal",
    lockTier: "ultimate",
  },
  {
    title: "Sleep & Recovery",
    description: "Sleep optimization, recovery protocols, and stress management for testosterone and peak performance.",
    href: "/dashboard/sleep-recovery",
    lockTier: "foundation",
  },
  {
    title: "Pelvic Floor & Kegels",
    description: "A guided pelvic floor training program with progressive sets, reps, and a structured 8-week plan.",
    href: "/dashboard/pelvic-floor",
    lockTier: "ultimate",
  },
  {
    title: "Reminders & Notifications",
    description: "Set daily reminders for supplements, meals, drinks, and wellness habits. Syncs with the mobile app.",
    href: "/dashboard/reminders",
    lockTier: "foundation",
  },
  {
    title: "Equipment Guide",
    description: "Kitchen tools and home gym setup with Amazon links.",
    href: "/dashboard/equipment",
    lockTier: "foundation",
  },
  {
    title: "Your Medical Team",
    description: "Connect with physicians and labs for blood work, hormone panels, and TRT consultation.",
    href: "/dashboard/medical-team",
    lockTier: "ultimate",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status, has_digital_guide")
    .eq("id", user.id)
    .single();

  const subscriptionStatus = profile?.subscription_status ?? null;
  const hasDigitalGuide = profile?.has_digital_guide ?? false;
  const userIsFree = isFree(subscriptionStatus);
  const userIsUltimate = isUltimate(subscriptionStatus);

  /** True when a card's content is locked for this user */
  function isCardLocked(lockTier: LockTier): boolean {
    if (lockTier === null) return false;
    if (lockTier === "foundation") return userIsFree;
    if (lockTier === "ultimate") return !userIsUltimate;
    return false;
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-yellow-600 no-underline hover:no-underline transition-all duration-200 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgba(234,179,8,0.5)]">
            Perfect Stack
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-zinc-400 transition-all duration-200 hover:text-yellow-400 hover:drop-shadow-[0_0_6px_rgba(234,179,8,0.5)]">Pricing</Link>
            <span className="hidden text-sm text-zinc-400 sm:inline">{user.email}</span>
            <form action={signout}>
              <button type="submit" className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition hover:border-yellow-600 hover:text-white sm:px-3 sm:py-1.5 sm:text-sm">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-zinc-400">Here&apos;s your dashboard. Pick up where you left off.</p>

        {/* ─── Tier-aware upsell banners ───────────────────────────────── */}
        {userIsFree ? (
          <div className="mt-6 flex flex-col gap-3 rounded-lg border border-yellow-600/50 bg-yellow-600/5 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-yellow-600">You are on the free plan.</p>
              <p className="mt-0.5 text-sm text-zinc-400">
                Upgrade to Foundation to unlock your full supplement protocol, meal plan, training program, and more.
              </p>
            </div>
            <Link
              href="/pricing"
              className="shrink-0 rounded-md bg-yellow-600 px-5 py-2 text-center text-sm font-semibold text-black transition hover:bg-yellow-500"
            >
              Upgrade Now
            </Link>
          </div>
        ) : !userIsUltimate ? (
          <div className="mt-6 flex flex-col gap-3 rounded-lg border border-zinc-700 bg-zinc-900 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-300">
              Limited Perfect Chat, Journal, Pelvic Floor training, and your Medical Team - upgrade to Ultimate.
            </p>
            <Link
              href="/pricing"
              className="shrink-0 rounded-md border border-yellow-600 px-5 py-2 text-center text-sm font-semibold text-yellow-600 transition hover:bg-yellow-600/10"
            >
              Upgrade to Ultimate
            </Link>
          </div>
        ) : null}

        {/* ─── Feature cards ───────────────────────────────────────────── */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const locked = isCardLocked(card.lockTier);
            return (
              <Link
                key={card.title}
                href={card.href}
                className={`relative rounded-lg border bg-zinc-900 p-6 transition-all duration-200 hover:border-yellow-500/50 hover:shadow-[0_0_12px_rgba(234,179,8,0.15)] ${
                  card.startHere ? "border-yellow-600/60" : "border-yellow-600/40"
                }`}
              >
                {card.startHere && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-yellow-600 px-2.5 py-0.5 text-[10px] font-bold uppercase text-black">
                    Start Here
                  </span>
                )}
                {/* Lock badge */}
                {locked && (
                  <span
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-600/15 text-sm"
                    title={card.lockTier === "ultimate" ? "Ultimate plan required" : "Foundation plan required"}
                  >
                    🔒
                  </span>
                )}
                <h2 className="text-lg font-semibold text-yellow-600">{card.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{card.description}</p>
              </Link>
            );
          })}

          {/* ─── Digital Guide tile (dynamic based on purchase status) ─── */}
          <Link
            href="/dashboard/guide"
            className="relative rounded-lg border border-yellow-600/40 bg-zinc-900 p-6 transition-all duration-200 hover:border-yellow-500/50 hover:shadow-[0_0_12px_rgba(234,179,8,0.15)]"
          >
            {/* Badge: purchased = none, not purchased = "Add-on" */}
            {!hasDigitalGuide && (
              <span className="absolute right-3 top-3 rounded-full bg-yellow-600/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-yellow-500">
                Add-on
              </span>
            )}
            {hasDigitalGuide && (
              <span className="absolute right-3 top-3 rounded-full bg-green-900/40 px-2.5 py-0.5 text-[10px] font-bold uppercase text-green-400">
                Owned
              </span>
            )}
            <h2 className="text-lg font-semibold text-yellow-600">Digital Guide</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {hasDigitalGuide
                ? "Your personalized Perfect Stack guide is ready to download."
                : "The complete Perfect Stack protocol guide, personalized with your name. Available for $19."}
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
