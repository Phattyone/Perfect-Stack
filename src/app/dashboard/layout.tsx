import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ChatBubble from "@/components/ai-chat/chat-bubble";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let subscriptionStatus = "free";
  let userProfile = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status, stripe_subscription_id, age_group, primary_goal, stack_selection, trt_hrt, pde5_inhibitor, nitrate_meds, blood_thinners")
      .eq("id", user.id)
      .single();

    if (profile) {
      // Use subscription_status, but also allow access if stripe_subscription_id exists
      subscriptionStatus = profile.subscription_status ?? "free";
      if (subscriptionStatus === "free" && profile.stripe_subscription_id) {
        subscriptionStatus = "active";
      }
      userProfile = {
        age_group: profile.age_group ?? "",
        primary_goal: profile.primary_goal ?? "",
        stack_selection: profile.stack_selection ?? "",
        trt_hrt: profile.trt_hrt ?? false,
        pde5_inhibitor: profile.pde5_inhibitor ?? "None",
        nitrate_meds: profile.nitrate_meds ?? false,
        blood_thinners: profile.blood_thinners ?? false,
      };
    }
  }

  return (
    <>
      {children}
      <footer className="border-t border-zinc-800 py-6 print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          <span className="text-xs text-zinc-600">&copy; 2026 Perfect Stack</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-zinc-600 hover:text-zinc-400">Privacy</Link>
            <Link href="/terms" className="text-xs text-zinc-600 hover:text-zinc-400">Terms</Link>
          </div>
        </div>
      </footer>
      <ChatBubble
        subscriptionStatus={subscriptionStatus}
        userProfile={userProfile}
      />
    </>
  );
}
