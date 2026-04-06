import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, userProfile, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
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

    // Build messages from conversation history (last 10)
    const messages = [];
    const history = (conversationHistory ?? []).slice(-10);
    for (const msg of history) {
      messages.push({ role: msg.role, content: msg.content });
    }
    messages.push({ role: "user", content: message });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: `API error: ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "I couldn't generate a response. Please try again.";

    return NextResponse.json({ response: text });
  } catch {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
