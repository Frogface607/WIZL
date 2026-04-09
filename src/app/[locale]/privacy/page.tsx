import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — WIZL",
  description: "Privacy Policy for WIZL, the AI-powered cannabis strain scanner.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black gradient-text mb-1">Privacy Policy</h1>
        <p className="text-text-secondary text-xs">Last updated: April 9, 2026</p>
      </div>

      <div className="glass-card rounded-3xl p-6 mb-6 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">What We Collect</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            We collect only what&apos;s needed to make WIZL work for you:
          </p>
          <ul className="text-text-secondary text-sm leading-relaxed space-y-1 list-disc list-inside">
            <li>Email address (for account and communication)</li>
            <li>Usage data (how you interact with the app)</li>
            <li>Scan history (your strain scans and results)</li>
            <li>Check-ins and reviews you create</li>
            <li>Device information (for app optimization)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">How We Use Your Data</h2>
          <ul className="text-text-secondary text-sm leading-relaxed space-y-1 list-disc list-inside">
            <li>To provide and improve the WIZL service</li>
            <li>To personalize your experience and recommendations</li>
            <li>To process payments and manage subscriptions</li>
            <li>To send important service updates (not spam, we promise)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">We Don&apos;t Sell Your Data</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Period. Your data is yours. We will never sell, rent, or trade your personal
            information to third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Third-Party Services</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            We use a few trusted services to keep things running:
          </p>
          <ul className="text-text-secondary text-sm leading-relaxed space-y-1 list-disc list-inside">
            <li><strong className="text-text-primary">Paddle</strong> — payment processing (they handle your payment data securely)</li>
            <li><strong className="text-text-primary">Supabase</strong> — database and authentication</li>
            <li><strong className="text-text-primary">Analytics</strong> — anonymous usage statistics to improve the app</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Cookies</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            We use essential cookies for authentication and session management. No tracking
            cookies, no creepy ad stuff. Just what&apos;s needed to keep you logged in.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Your Rights (GDPR-friendly)</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            You have the right to:
          </p>
          <ul className="text-text-secondary text-sm leading-relaxed space-y-1 list-disc list-inside">
            <li>Access your personal data</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data in a portable format</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="text-text-secondary text-sm leading-relaxed mt-3">
            To exercise any of these rights, contact us and we&apos;ll handle it within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Data Security</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            We use industry-standard security measures to protect your data, including encryption
            in transit and at rest. However, no method of transmission over the internet is 100%
            secure — we do our best, but can&apos;t guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Contact</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Privacy questions or data requests? Email us at{" "}
            <a href="mailto:wizl.space.app@gmail.com" className="text-accent-green hover:underline">
              wizl.space.app@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
