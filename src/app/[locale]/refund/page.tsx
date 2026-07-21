import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Status — WIZL",
  robots: { index: false, follow: true },
};

export default function RefundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-8">
      <h1 className="text-2xl font-black gradient-text mb-3">Payment status</h1>
      <p className="text-text-secondary text-sm leading-relaxed mb-4">
        WIZL is not accepting payments or running a paid subscription at this time. The checkout is paused, so there is nothing to cancel or refund through the app.
      </p>
      <p className="text-text-muted text-sm leading-relaxed">
        If you believe you were charged through an older external link, email{" "}
        <a href="mailto:wizl.space.app@gmail.com" className="text-accent-green hover:underline">
          wizl.space.app@gmail.com
        </a>{" "}
        with the payment provider and transaction date.
      </p>
    </div>
  );
}