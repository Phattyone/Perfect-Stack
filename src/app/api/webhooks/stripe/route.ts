import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

// Service-role client bypasses RLS — used for webhook profile updates where
// there is no user session (Stripe calls have no auth cookies).
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Price ID to plan mapping
function getPlanFromPriceId(priceId: string): { status: string; period: string } | null {
  const foundationMonthly = process.env.NEXT_PUBLIC_STRIPE_FOUNDATION_MONTHLY;
  const foundationAnnual = process.env.NEXT_PUBLIC_STRIPE_FOUNDATION_ANNUAL;
  const completeMonthly = process.env.NEXT_PUBLIC_STRIPE_COMPLETE_MONTHLY;
  const completeAnnual = process.env.NEXT_PUBLIC_STRIPE_COMPLETE_ANNUAL;

  if (priceId === foundationMonthly) return { status: "foundation", period: "monthly" };
  if (priceId === foundationAnnual) return { status: "foundation", period: "annual" };
  if (priceId === completeMonthly) return { status: "ultimate", period: "monthly" };
  if (priceId === completeAnnual) return { status: "ultimate", period: "annual" };
  return null;
}

export async function POST(request: Request) {
  console.log("Webhook received, secret configured:", !!process.env.STRIPE_WEBHOOK_SECRET);

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook verification failed";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = await createClient();

  try {
    switch (event.type) {
      // ─── Checkout completed ────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
          console.error("No userId in checkout session metadata");
          break;
        }

        // Get the price ID from the session line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const priceId = lineItems.data[0]?.price?.id;

        if (!priceId) {
          console.error("No price ID found in checkout session");
          break;
        }

        // ── Digital Guide one-time purchase ─────────────────────
        // Uses supabaseAdmin (service role) because webhook requests have no
        // user session — the regular client would be blocked by RLS.
        if (session.metadata?.type === "digital_guide") {
          const { error: guideError } = await supabaseAdmin
            .from("profiles")
            .update({
              has_digital_guide: true,
              digital_guide_purchased_at: new Date().toISOString(),
              // digital_guide_name is set later when the user personalizes
            })
            .eq("id", userId);

          if (guideError) console.error("Failed to grant digital guide:", guideError.message);
          else console.log(`Digital guide purchased: user ${userId}`);
          break;
        }

        // ── Subscription checkout ────────────────────────────────
        const plan = getPlanFromPriceId(priceId);
        if (!plan) {
          console.error("Unknown price ID:", priceId);
          break;
        }

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: plan.status,
            subscription_period: plan.period,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", userId);

        if (error) console.error("Webhook profile update failed:", error.message, "userId:", userId);
        else console.log(`Checkout completed: user ${userId} -> ${plan.status} (${plan.period})`);
        break;
      }

      // ─── Subscription updated ──────────────────────────────────
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const priceId = subscription.items.data[0]?.price?.id;

        if (!priceId) {
          console.error("No price ID in subscription update");
          break;
        }

        const plan = getPlanFromPriceId(priceId);
        if (!plan) {
          console.error("Unknown price ID on subscription update:", priceId);
          break;
        }

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: plan.status,
            subscription_period: plan.period,
          })
          .eq("stripe_customer_id", customerId);

        if (error) console.error("Failed to update profile on subscription change:", error.message);
        else console.log(`Subscription updated: customer ${customerId} -> ${plan.status} (${plan.period})`);
        break;
      }

      // ─── Subscription deleted ──────────────────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "free",
            stripe_subscription_id: null,
            subscription_period: null,
          })
          .eq("stripe_customer_id", customerId);

        if (error) console.error("Failed to update profile on subscription cancel:", error.message);
        else console.log(`Subscription cancelled: customer ${customerId} -> free`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler error";
    console.error("Webhook handler error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
