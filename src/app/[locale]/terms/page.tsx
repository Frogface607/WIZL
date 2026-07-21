import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — WIZL",
  description: "Terms for using WIZL as an adult educational reference and personal field journal.",
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 pb-24 pt-8">
      <h1 className="text-2xl font-black gradient-text mb-1">Terms of Use</h1>
      <p className="text-text-secondary text-xs mb-8">Last updated: July 21, 2026</p>

      <div className="space-y-8 text-text-secondary text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Adult and lawful use only</h2>
          <p>
            You may use WIZL only if you are of legal age and your access and activity are lawful where you are. Cannabis laws differ by country, state, province, and city and can change quickly. You are responsible for knowing and following the rules that apply to you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">What WIZL is</h2>
          <p>
            WIZL is an educational strain-reference guide, AI-assisted label reader, and private field journal. WIZL does not sell cannabis, arrange transactions, provide delivery, publish product menus or prices, or direct users to obtain controlled substances.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Not medical, laboratory, or legal advice</h2>
          <p>
            WIZL content is general information. It is not medical advice, diagnosis, a prescription, laboratory testing, product certification, or legal advice. A flower image cannot establish strain identity or potency. Strain names and reported effects vary by producer, batch, chemistry, dose, setting, and person. Verify the package and lab report and consult a qualified professional when appropriate.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">AI results</h2>
          <p>
            AI output may be incomplete, outdated, or wrong. Treat every label read and Ask WIZL answer as a clue to verify, not a fact about the item in front of you. Do not rely on WIZL for driving, workplace, medical, emergency, pregnancy, medication, or other safety-critical decisions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Your field notes</h2>
          <p>
            Field notes currently live in browser storage on your device. WIZL does not promise backup, account sync, or recovery. Export your data before clearing browser storage, uninstalling, or changing devices. You are responsible for the content you enter and for avoiding personal or unlawful material.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Club and payments</h2>
          <p>
            WIZL Club payments and paid access are not active. Any displayed future price or benefit is a product idea, not a current sale or guarantee. If a paid offer launches, the provider, price, benefits, renewal terms, and refund policy will be shown before payment.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Acceptable use</h2>
          <p>
            Do not abuse the service, bypass technical limits, automate excessive requests, probe for secrets, upload malicious content, impersonate others, infringe rights, or use WIZL to facilitate an unlawful purchase, sale, promotion, or distribution. WIZL may restrict access needed to protect the service or comply with law.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Intellectual property</h2>
          <p>
            The WIZL name, character, world, original artwork, interface, and original writing belong to WIZL or their respective licensors. Reference facts and third-party names remain subject to their own rights. No partnership or endorsement is implied by mentioning a strain, producer, person, or brand.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Availability and liability</h2>
          <p>
            WIZL is provided on an as-available basis without a guarantee of uninterrupted access, accuracy, fitness for a particular purpose, or preservation of local data. To the extent permitted by law, WIZL is not liable for decisions, losses, injuries, enforcement action, or damages arising from reliance on the service or third-party content.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-text-primary mb-2">Changes and contact</h2>
          <p>
            These terms may change as the product, providers, and legal requirements evolve. Material changes will be dated on this page. Questions:{" "}
            <a href="mailto:wizl.space.app@gmail.com" className="text-accent-green hover:underline">
              wizl.space.app@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
