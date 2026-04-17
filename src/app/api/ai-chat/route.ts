import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";
import { isFoundation } from "@/lib/subscription";

export async function POST(request: Request) {
  try {
    // Auth + subscription check
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

    const { message, userProfile, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }
    const apiKey = process.env.GEMINI_API_KEY;

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemPrompt,
    });

    // Build conversation history for Gemini (must start with user, not model)
    const history = ((conversationHistory ?? []) as { role: string; content: string }[])
      .slice(-10)
      .filter((msg) => msg.role && msg.content && msg.content.trim() !== "")
      .reduce((acc: { role: string; parts: { text: string }[] }[], msg) => {
        if (acc.length === 0 && msg.role === "assistant") return acc;
        acc.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
        return acc;
      }, []);

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ response: responseText });
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number };
    console.error("Gemini API error:", err?.message, err?.status, JSON.stringify(error));

    if (
      err?.message?.includes("429") ||
      err?.message?.includes("quota") ||
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
