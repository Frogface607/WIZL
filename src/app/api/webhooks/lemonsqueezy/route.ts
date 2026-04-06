import { NextRequest, NextResponse } from "next/server";

// LemonSqueezy sends webhooks for subscription events
// In production, you'd update a database.
// For now we log events — the client checks subscription status
// via LemonSqueezy customer portal or local state.

interface WebhookEvent {
  meta: {
    event_name: string;
    custom_data?: Record<string, string>;
  };
  data: {
    id: string;
    type: string;
    attributes: {
      status: string;
      user_email: string;
      variant_id: number;
      product_id: number;
      customer_id: number;
      order_id: number;
      renews_at: string | null;
      ends_at: string | null;
      created_at: string;
      updated_at: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-signature") || "";
    const rawBody = await request.text();

    // Verify signature in production
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (secret && !signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const event: WebhookEvent = JSON.parse(rawBody);
    const eventName = event.meta.event_name;

    console.log(`[WIZL Webhook] ${eventName}:`, {
      email: event.data.attributes.user_email,
      status: event.data.attributes.status,
      customerId: event.data.attributes.customer_id,
    });

    switch (eventName) {
      case "subscription_created":
        // New subscriber — activate PRO
        console.log("[WIZL] New PRO subscriber:", event.data.attributes.user_email);
        break;

      case "subscription_updated":
        // Status changed (active, paused, cancelled, etc.)
        console.log("[WIZL] Subscription updated:", event.data.attributes.status);
        break;

      case "subscription_cancelled":
        // User cancelled — still active until period ends
        console.log("[WIZL] Subscription cancelled:", event.data.attributes.user_email);
        break;

      case "subscription_expired":
        // Subscription ended — deactivate PRO
        console.log("[WIZL] PRO expired:", event.data.attributes.user_email);
        break;

      case "subscription_payment_success":
        console.log("[WIZL] Payment received:", event.data.attributes.user_email);
        break;

      case "subscription_payment_failed":
        console.log("[WIZL] Payment failed:", event.data.attributes.user_email);
        break;

      default:
        console.log("[WIZL] Unknown event:", eventName);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WIZL Webhook] Error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
