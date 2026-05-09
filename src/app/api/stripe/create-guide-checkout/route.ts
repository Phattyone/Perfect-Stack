// src/app/api/stripe/create-guide-checkout/route.ts
//
// Creates a Stripe Checkout session for the Digital Guide one-time purchase.
// Uses mode: "payment" (not "subscription") since this is a one-time $19 add-on.
//
// Required env vars:
//   NEXT_PUBLIC_STRIPE_DIGITAL_GUIDE_PRICE_ID — price ID from Stripe Dashboard
//   NEXT_PUBLIC_APP_URL — base URL for success/cancel redirects

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";

export async function POST(request: Request) {
  try {
    const { userId, userEmail } = await request.json();

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const priceId = process.env.NEXT_PUBLIC_STRIPE_DIGITAL_GUIDE_PRICE_ID;
    if (!priceId) {
      console.error("NEXT_PUBLIC_STRIPE_DIGITAL_GUIDE_PRICE_ID is not set");
      return NextResponse.json(
        { error: "Digital Guide is not available for purchase at this time." },
        { status: 503 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: userEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/guide?purchase=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/guide?canceled=true`,
      metadata: { userId, type: "digital_guide" },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create checkout session";
    console.error("Guide checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
