/*
 * ─────────────────────────────────────────────────────────────────────────────
 * SUPABASE MIGRATION — run in Supabase SQL editor before using rate limiting
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * CREATE TABLE IF NOT EXISTS public.chat_usage (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
 *   message_date DATE NOT NULL DEFAULT CURRENT_DATE,
 *   message_count INTEGER NOT NULL DEFAULT 0,
 *   UNIQUE(user_id, message_date)
 * );
 *
 * ALTER TABLE public.chat_usage ENABLE ROW LEVEL SECURITY;
 *
 * CREATE POLICY "Users can read their own chat usage"
 * ON public.chat_usage FOR SELECT
 * USING (auth.uid() = user_id);
 *
 * CREATE POLICY "Service role can manage chat usage"
 * ON public.chat_usage FOR ALL
 * USING (true);
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isFoundation, isUltimate } from "@/lib/subscription";

export const FOUNDATION_DAILY_LIMIT = 7;
export const ULTIMATE_DAILY_LIMIT = 50;

export async function POST(request: Request) {
  try {
    // ── Auth + subscription check ──────────────────────────────────────────
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

    // ── Parse and validate request body ───────────────────────────────────
    const { message, userProfile, conversationHistory } = await request.json();
    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // ── Daily rate limiting (server-side, uses service role) ───────────────
    const limit = isUltimate(status) ? ULTIMATE_DAILY_LIMIT : FOUNDATION_DAILY_LIMIT;
    const today = new Date().toISOString().split("T")[0]; // UTC date YYYY-MM-DD

    const admin = createAdminClient();
    const { data: usageRow } = await admin
      .from("chat_usage")
      .select("message_count")
      .eq("user_id", user.id)
      .eq("message_date", today)
      .maybeSingle();

    const currentCount = usageRow?.message_count ?? 0;

    if (currentCount >= limit) {
      return NextResponse.json(
        { error: "Daily message limit reached", limit, resetAt: "midnight tonight" },
        { status: 429 }
      );
    }

    // Increment usage count before calling the AI (best-effort; failure doesn't block)
    await admin
      .from("chat_usage")
      .upsert(
        { user_id: user.id, message_date: today, message_count: currentCount + 1 },
        { onConflict: "user_id,message_date" }
      );
    // ── End rate limiting ──────────────────────────────────────────────────

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not set");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Build system prompt with user context
    let systemPrompt = `You are the Perfect Stack AI assistant, a knowledgeable and supportive men's health guide built into the Perfect Stack app. You help users understand and get the most out of their personalized supplement protocol.

Your knowledge covers:
- The Perfect Stack supplement system: Stacks A through E covering Foundation, Testosterone Support, Nitric Performance, Libido Amplifier, and Full Performance
- All 31 supplements in the protocol with their doses, timing, benefits, and interactions
- The 8-week performance protocol including diet, training, sleep, and recovery
- Hormone health, testosterone optimization, blood flow, and sexual performance
- Medication interactions and safety considerations
- Progress tracking and what the optimization scores mean

Guidelines:
- Be direct, knowledgeable, and masculine in tone. No fluff.
- Always recommend consulting a physician for medical decisions, prescription changes, or concerning symptoms
- Never diagnose conditions or recommend changing prescription medications
- If the user shares their profile data, personalize your answers to their specific stack and goals
- Keep responses concise and actionable, under 150 words unless a detailed explanation is genuinely needed
- Use plain language, not medical jargon`;

    if (userProfile) {
      systemPrompt += `\n\nUser profile: Age group: ${userProfile.age_group}, Primary goal: ${userProfile.primary_goal}, Stack selection: ${userProfile.stack_selection}`;
      if (userProfile.trt_hrt) systemPrompt += ", On TRT/HRT";
      if (userProfile.pde5_inhibitor !== "None") systemPrompt += `, PDE5: ${userProfile.pde5_inhibitor}`;
      if (userProfile.nitrate_meds) systemPrompt += ", Nitrate medications (Stack C excluded)";
      if (userProfile.blood_thinners) systemPrompt += ", On blood thinners";
    }

    // Build conversation history for Anthropic (must start with user, alternating user/assistant)
    const history = ((conversationHistory ?? []) as { role: string; content: string }[])
      .slice(-10)
      .filter((msg) => msg.role && msg.content && msg.content.trim() !== "")
      .reduce((acc: { role: "user" | "assistant"; content: string }[], msg) => {
        if (acc.length === 0 && msg.role === "assistant") return acc;
        acc.push({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        });
        return acc;
      }, []);

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        ...history,
        { role: "user", content: message },
      ],
    });

    const responseText = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ response: responseText });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    console.error("Anthropic API error:", err?.message, err?.status, JSON.stringify(error));

    if (
      err?.status === 429 ||
      err?.message?.includes("429") ||
      err?.message?.includes("rate limit") ||
      err?.message?.includes("Too Many Requests")
    ) {
      return NextResponse.json(
        { error: "The AI assistant is temporarily unavailable due to high demand. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process request", details: err?.message },
      { status: 500 }
    );
  }
}
