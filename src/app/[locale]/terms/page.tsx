import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — WIZL",
  description: "Terms of Service for WIZL, the AI-powered cannabis strain scanner.",
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black gradient-text mb-1">Terms of Service</h1>
        <p className="text-text-secondary text-xs">Last updated: April 9, 2026</p>
      </div>

      <div className="glass-card rounded-3xl p-6 mb-6 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">1. What is WIZL</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            WIZL (wizl.space) is an AI-powered cannabis strain identification app. We provide
            strain scanning, check-ins, reviews, and a community-driven strain guide. The service
            is operated by Sergei Orlov, Individual, based in Thailand.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">2. Age Requirement</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            You must be at least 21 years old to use WIZL. By using the app, you confirm that you
            meet this age requirement. We have an age verification gate, and providing false
            information about your age is grounds for account termination.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">3. AI Scan Accuracy</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Our AI-powered strain identification is for informational and entertainment purposes
            only. We do not guarantee the accuracy of scan results. WIZL is not a substitute for
            professional testing or lab analysis. Always verify strain identity through trusted
            sources before making decisions based on scan results.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">4. Subscription</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            WIZL PRO is available for $4.20/month. The subscription includes a 7-day free trial.
            You can cancel anytime through your account settings or by contacting us. Cancellation
            takes effect at the end of your current billing period. No partial refunds are issued
            for unused portions of a billing cycle.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">5. Your Content</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Any content you upload (photos, reviews, check-ins) remains yours. By uploading content,
            you grant WIZL a non-exclusive license to display it within the app and for service
            improvement. You can delete your content at any time. We will not sell your content to
            third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">6. Acceptable Use</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Don&apos;t use WIZL to share illegal content, spam, harass others, or attempt to
            reverse-engineer the service. We reserve the right to terminate accounts that violate
            these terms or engage in abusive behavior.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">7. Limitation of Liability</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            WIZL is provided &quot;as is&quot; without warranties of any kind. We are not liable for
            any damages arising from the use of our service, including but not limited to
            inaccurate scan results. Our total liability is limited to the amount you paid for the
            service in the past 12 months.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">8. Changes to Terms</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            We may update these terms from time to time. We&apos;ll notify you of significant changes
            via email or in-app notification. Continued use of WIZL after changes constitutes
            acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">9. Contact</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Questions? Reach out at{" "}
            <a href="mailto:wizl.space.app@gmail.com" className="text-accent-green hover:underline">
              wizl.space.app@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
