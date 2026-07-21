import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — WIZL",
  description: "How WIZL handles local field notes, label images, questions, and analytics.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-8">
      <h1 className="text-2xl font-black gradient-text mb-1">Privacy Policy</h1>
      <p className="text-text-secondary text-xs mb-8">Last updated: July 21, 2026</p>

      <div className="space-y-8 text-text-secondary text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Short version</h2>
          <p>
            WIZL does not require an account. Your field notes, ratings, favorites, wishlist, badges, and scan counter are stored in your browser on your device. They are not currently synced to a WIZL account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Data kept on your device</h2>
          <p>
            WIZL uses browser local storage and session storage for the age-gate choice, field notes, preferences, scan limits, and a temporary scan result. This data remains until you clear browser data, remove the app, or overwrite it. Use the export control in Profile before changing devices or clearing storage.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Label reads and Ask WIZL</h2>
          <p className="mb-3">
            When you submit a label image or text for an AI read, it is sent through WIZL&apos;s server to OpenAI or, when that service is unavailable, OpenRouter and its selected model provider. When you send a question to Ask WIZL, the question is sent through WIZL&apos;s server to OpenRouter and the selected model provider.
          </p>
          <p>
            WIZL does not intentionally add those images or questions to your public profile or field-note history. They may still be processed in provider systems under the providers&apos; applicable API terms and privacy policies. Do not submit faces, identity documents, addresses, medical records, or other sensitive personal information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Hosting, catalog, and analytics</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Vercel hosts the web app and provides aggregate product analytics and standard technical request logs.</li>
            <li>Supabase hosts the strain-reference catalog used by The Book.</li>
            <li>OpenAI is the primary processor for label-read requests.</li>
            <li>OpenRouter and its selected model provider process fallback label reads and Ask WIZL questions.</li>
          </ul>
          <p className="mt-3">
            WIZL does not use advertising pixels and does not sell personal information. Basic analytics may include page, referrer, device, region, and interaction events, but WIZL is designed not to send your photos, full questions, or field-note text as analytics properties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Accounts and payments</h2>
          <p>
            Account sync and paid Club access are not active. WIZL does not currently collect account passwords or payment-card details. If either feature launches, this policy and the checkout disclosure will be updated before collection begins.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Your choices</h2>
          <p>
            You can export local field notes from Profile and delete them by clearing this site&apos;s browser storage. You can avoid AI processing by using The Book and local field notes without uploading a photo or asking a question. For a privacy request concerning server-side records, contact WIZL with the approximate date and nature of the request.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Adults only</h2>
          <p>
            WIZL is intended only for adults who are of legal age in their jurisdiction. It is not directed to children, and WIZL does not knowingly collect information from children.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Contact</h2>
          <p>
            Privacy questions:{" "}
            <a href="mailto:wizl.space.app@gmail.com" className="text-accent-green hover:underline">
              wizl.space.app@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
