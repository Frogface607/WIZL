import type { Metadata } from "next";
import { BookOpen, MapPinned, NotebookPen, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "WIZL Atlas",
  description: "The WIZL venue atlas is paused while every listing is re-verified.",
  robots: { index: false, follow: true },
};

export default function MapPage() {
  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-8">
      <div className="w-16 h-16 rounded-2xl bg-accent-green/10 border border-accent-green/20 flex items-center justify-center mb-5">
        <MapPinned className="w-8 h-8 text-accent-green" />
      </div>

      <p className="text-accent-green text-xs font-bold uppercase mb-2">WIZL Atlas</p>
      <h1 className="text-3xl font-black gradient-text mb-3">The map is being re-verified.</h1>
      <p className="text-text-secondary text-sm leading-relaxed mb-8">
        Venue details change quickly, and cannabis rules differ by location. Public listings are paused until WIZL can verify legal status, ownership, and freshness.
      </p>

      <div className="border-y border-border py-5 mb-8 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
        <p className="text-text-muted text-xs leading-relaxed">
          WIZL does not publish menus, prices, purchase links, or unverified ratings. Always follow local law and licensed medical guidance where required.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-10">
        <Link
          href="/strains"
          className="glass-card rounded-2xl p-4 hover:bg-bg-card-hover transition-all"
        >
          <BookOpen className="w-5 h-5 text-accent-purple mb-3" />
          <p className="font-bold text-sm">Open the Book</p>
          <p className="text-text-muted text-xs mt-1">Explore strain notes</p>
        </Link>
        <Link
          href="/checkin"
          className="glass-card rounded-2xl p-4 hover:bg-bg-card-hover transition-all"
        >
          <NotebookPen className="w-5 h-5 text-accent-orange mb-3" />
          <p className="font-bold text-sm">Log a moment</p>
          <p className="text-text-muted text-xs mt-1">Keep it on device</p>
        </Link>
      </div>

      <section>
        <h2 className="text-lg font-bold mb-2">Bangkok partner pilot</h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          WIZL is open to conversations with licensed education, lab, cultivation-quality, and responsible-use partners. Inclusion is never promised and every collaboration requires a compliance review.
        </p>
        <a
          href="mailto:wizl.space.app@gmail.com?subject=WIZL%20Bangkok%20partner%20pilot"
          className="text-accent-green text-sm font-semibold hover:underline"
        >
          Contact the founder
        </a>
      </section>
    </div>
  );
}