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
      .select("subscription_status, age_group, primary_goal, stack_selection, trt_hrt, pde5_inhibitor, nitrate_meds, blood_thinners")
      .eq("id", user.id)
      .single();

    if (profile) {
      subscriptionStatus = profile.subscription_status ?? "free";
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
      <ChatBubble
        subscriptionStatus={subscriptionStatus}
        userProfile={userProfile}
      />
    </>
  );
}
