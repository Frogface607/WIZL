"use client";

import {
  ArrowRight,
  BookOpen,
  Heart,
  Mail,
  NotebookPen,
  ScanLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";

const freeFeatures = [
  {
    icon: BookOpen,
    title: "The full Book",
    description: "Explore more than 3,000 strain reference notes.",
  },
  {
    icon: ScanLine,
    title: "Five AI reads a day",
    description: "Best for clear package labels and strain names.",
  },
  {
    icon: NotebookPen,
    title: "Private field notes",
    description: "Ratings, moods, favorites, and your taste trail stay on this device.",
  },
  {
    icon: ShieldCheck,
    title: "No account required",
    description: "Start using WIZL without giving us an email.",
  },
];

export default function ProPage() {
  const interestHref =
    "mailto:wizl.space.app@gmail.com?subject=WIZL%20Club%20interest&body=Hey%20Sergey%2C%20I%20want%20to%20hear%20when%20the%20WIZL%20Club%20opens.";

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-8">
      <div className="flex items-center gap-2 text-accent-green text-xs font-bold uppercase mb-3">
        <Heart className="w-4 h-4" />
        Built with love
      </div>
      <h1 className="text-3xl font-black gradient-text mb-3">WIZL Club</h1>
      <p className="text-text-secondary text-sm leading-relaxed mb-6">
        WIZL is free while the core experience earns your trust. The supporter club is being designed in public, with honest benefits and a payment provider that explicitly approves the project.
      </p>

      <div className="border-y border-border py-5 mb-8 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm">Payments are paused</p>
          <p className="text-text-muted text-xs leading-relaxed mt-1">
            No card is collected and no paid feature is active. Existing app features remain free.
          </p>
        </div>
      </div>

      <section className="mb-9">
        <h2 className="text-lg font-bold mb-1">Free today</h2>
        <p className="text-text-muted text-xs mb-4">The useful part is not waiting behind a paywall.</p>
        <div className="grid grid-cols-2 gap-3">
          {freeFeatures.map((feature) => (
            <div key={feature.title} className="glass-card rounded-2xl p-4">
              <feature.icon className="w-5 h-5 text-accent-green mb-3" />
              <p className="font-bold text-sm">{feature.title}</p>
              <p className="text-text-muted text-xs leading-relaxed mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-accent-purple" />
          <h2 className="text-lg font-bold">Planned for founding supporters</h2>
        </div>
        <div className="flex flex-col divide-y divide-border border-y border-border">
          <p className="py-3 text-sm text-text-secondary">A permanent founding supporter mark</p>
          <p className="py-3 text-sm text-text-secondary">Early access to collectible drops and field-test features</p>
          <p className="py-3 text-sm text-text-secondary">A vote on the next chapters, cities, and WIZL artifacts</p>
        </div>
        <p className="text-text-muted text-xs leading-relaxed mt-4">
          The working founder price is a symbolic $4.20 per year. It is an idea, not an active offer, until compliance and delivery are ready.
        </p>
      </section>

      <a
        href={interestHref}
        onClick={() => trackEvent("club_interest_clicked", { channel: "email" })}
        className="w-full py-3.5 px-5 rounded-2xl bg-accent-green text-black font-bold inline-flex items-center justify-center gap-2 hover:brightness-110 transition-all"
      >
        <Mail className="w-5 h-5" />
        Tell Sergey you are interested
      </a>
      <p className="text-text-muted text-[11px] text-center mt-2">This opens an email. No payment and no automatic signup.</p>

      <Link
        href="/scan"
        className="mt-6 text-accent-green text-sm font-semibold inline-flex items-center gap-2 hover:underline"
      >
        Continue exploring
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}