import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — WIZL",
  description: "Refund Policy for WIZL PRO subscription.",
};

export default function RefundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black gradient-text mb-1">Refund Policy</h1>
        <p className="text-text-secondary text-xs">Last updated: April 9, 2026</p>
      </div>

      <div className="glass-card rounded-3xl p-6 mb-6 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Free Trial</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            WIZL PRO comes with a 7-day free trial. During the trial, you get full access to all
            PRO features. If you cancel before the trial ends, you won&apos;t be charged anything.
            Simple as that.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Cancellation</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            You can cancel your WIZL PRO subscription at any time. When you cancel, you&apos;ll
            continue to have PRO access until the end of your current billing period. After that,
            your account reverts to the free tier. We do not issue refunds for partial months.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Accidental Charges</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            If you were charged by mistake (e.g., forgot to cancel your trial, double charge, or
            technical error), contact us and we&apos;ll issue a full refund. We&apos;re humans too —
            we get it.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">How to Request a Refund</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            Email us at{" "}
            <a href="mailto:wizl.space.app@gmail.com" className="text-accent-green hover:underline">
              wizl.space.app@gmail.com
            </a>{" "}
            with:
          </p>
          <ul className="text-text-secondary text-sm leading-relaxed space-y-1 list-disc list-inside">
            <li>Your account email</li>
            <li>Reason for the refund request</li>
            <li>Any relevant transaction details</li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed mt-3">
            We aim to respond within 48 hours and process refunds within 5-10 business days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">No Questions Asked</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            If you&apos;re within the first 7 days of a paid subscription and genuinely unhappy,
            reach out. We&apos;d rather make it right than lose a fellow explorer.
          </p>
        </section>
      </div>
    </div>
  );
}
