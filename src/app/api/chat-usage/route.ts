import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isFoundation, isUltimate } from "@/lib/subscription";
import { FOUNDATION_DAILY_LIMIT, ULTIMATE_DAILY_LIMIT } from "@/app/api/ai-chat/route";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_status, stripe_subscription_id")
      .eq("id", user.id)
      .single();

    const status = profile?.subscription_status ?? (profile?.stripe_subscription_id ? "active" : null);

    if (!isFoundation(status)) {
      return NextResponse.json({ error: "Subscription required" }, { status: 403 });
    }

    const limit = isUltimate(status) ? ULTIMATE_DAILY_LIMIT : FOUNDATION_DAILY_LIMIT;
    const today = new Date().toISOString().split("T")[0];

    // RLS policy "Users can read their own chat usage" allows this with the anon client
    const { data: usageRow } = await supabase
      .from("chat_usage")
      .select("message_count")
      .eq("user_id", user.id)
      .eq("message_date", today)
      .maybeSingle();

    const used = usageRow?.message_count ?? 0;
    const remaining = Math.max(0, limit - used);

    return NextResponse.json({ used, limit, plan: status, remaining });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("chat-usage GET error:", err?.message);
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}
