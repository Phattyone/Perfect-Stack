import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PricingView from "./_components/pricing-view";

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let subscriptionStatus = "free";
  let userEmail = "";
  let userId = "";

  if (user) {
    userId = user.id;
    userEmail = user.email ?? "";

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status")
      .eq("id", user.id)
      .single();

    if (profile?.subscription_status) {
      subscriptionStatus = profile.subscription_status;
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href={user ? "/dashboard" : "/"}
            className="text-lg font-bold text-yellow-600 transition hover:text-yellow-500"
          >
            PerfectStack
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="text-sm text-zinc-400 transition hover:text-zinc-300"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-yellow-600 px-4 py-1.5 text-sm font-semibold text-black transition hover:bg-yellow-500"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <PricingView
          currentPlan={subscriptionStatus}
          userId={userId}
          userEmail={userEmail}
          isLoggedIn={!!user}
        />
      </main>
    </div>
  );
}
