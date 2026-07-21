import type { Metadata } from "next";
import { ArrowLeft, FlaskConical, GraduationCap, Mail, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "WIZL Partner Pilot",
  description: "A compliance-first partner pilot for licensed cannabis education and quality work.",
  robots: { index: false, follow: true },
};

export default function ShopPage() {
  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-8">
      <Link href="/" className="text-text-muted text-sm inline-flex items-center gap-2 mb-6 hover:text-text-secondary">
        <ArrowLeft className="w-4 h-4" />
        Back to WIZL
      </Link>

      <p className="text-accent-green text-xs font-bold uppercase mb-2">Partner pilot</p>
      <h1 className="text-3xl font-black gradient-text mb-3">Build something responsible together.</h1>
      <p className="text-text-secondary text-sm leading-relaxed mb-8">
        WIZL is exploring small, documented collaborations with licensed organizations. This is not a paid listing form and it does not add a venue to the public map.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="glass-card rounded-2xl p-4">
          <GraduationCap className="w-5 h-5 text-accent-purple mb-3" />
          <p className="font-bold text-sm">Education</p>
          <p className="text-text-muted text-xs mt-1">Responsible-use and label-literacy projects</p>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <FlaskConical className="w-5 h-5 text-accent-orange mb-3" />
          <p className="font-bold text-sm">Quality</p>
          <p className="text-text-muted text-xs mt-1">Lab, cultivation, and traceability stories</p>
        </div>
      </div>

      <div className="border-y border-border py-5 mb-8 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
        <p className="text-text-muted text-xs leading-relaxed">
          WIZL does not sell cannabis, publish menus or prices, guarantee exposure, or accept payment for unverified placement. Local legal review comes first.
        </p>
      </div>

      <a
        href="mailto:wizl.space.app@gmail.com?subject=WIZL%20licensed%20partner%20pilot"
        className="w-full py-3.5 px-5 rounded-2xl bg-accent-green text-black font-bold inline-flex items-center justify-center gap-2 hover:brightness-110 transition-all"
      >
        <Mail className="w-5 h-5" />
        Start a conversation
      </a>
    </div>
  );
}