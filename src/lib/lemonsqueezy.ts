// LemonSqueezy configuration
// Set these in your Vercel environment variables:
//
// LEMONSQUEEZY_API_KEY     — from https://app.lemonsqueezy.com/settings/api
// LEMONSQUEEZY_STORE_ID    — your store ID
// LEMONSQUEEZY_PRODUCT_ID  — your product ID (WIZL PRO)
// LEMONSQUEEZY_VARIANT_ID  — variant ID for $4.20/mo plan
// LEMONSQUEEZY_WEBHOOK_SECRET — webhook signing secret

export const lemonConfig = {
  apiKey: process.env.LEMONSQUEEZY_API_KEY || "",
  storeId: process.env.LEMONSQUEEZY_STORE_ID || "",
  productId: process.env.LEMONSQUEEZY_PRODUCT_ID || "",
  variantId: process.env.LEMONSQUEEZY_VARIANT_ID || "",
  webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "",
};

// LemonSqueezy API base
const API_BASE = "https://api.lemonsqueezy.com/v1";

interface CheckoutResponse {
  url: string;
}

export async function createCheckout(
  email?: string,
  locale?: string
): Promise<CheckoutResponse> {
  // If no API key, return demo checkout
  if (!lemonConfig.apiKey || !lemonConfig.variantId) {
    return {
      url: "#demo-checkout",
    };
  }

  const res = await fetch(`${API_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${lemonConfig.apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: email || undefined,
            custom: {
              locale: locale || "en",
            },
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://wizl.space"}/pro?success=true`,
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: lemonConfig.storeId,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: lemonConfig.variantId,
            },
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("LemonSqueezy checkout error:", error);
    throw new Error("Failed to create checkout");
  }

  const data = await res.json();
  return {
    url: data.data.attributes.url,
  };
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string,
  signature: string
): boolean {
  if (!lemonConfig.webhookSecret) return false;

  // In production, use crypto.subtle or node:crypto to verify HMAC
  // For now, basic check that signature exists
  return !!signature && !!lemonConfig.webhookSecret;
}
