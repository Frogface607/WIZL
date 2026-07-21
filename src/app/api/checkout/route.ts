import { NextResponse } from "next/server";

export const dynamic = "force-static";

const response = {
  error: "Checkout is paused while WIZL completes payment-provider and compliance review.",
  code: "CHECKOUT_PAUSED",
};

export async function POST() {
  return NextResponse.json(response, {
    status: 410,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET() {
  return NextResponse.json(response, {
    status: 410,
    headers: { "Cache-Control": "no-store" },
  });
}