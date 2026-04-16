"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AskWizl from "@/components/AskWizl";
import { ScanLine } from "lucide-react";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      {/* Hero */}
      <section className="pt-6 pb-4 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -top-20 bg-gradient-to-b from-accent-green/8 via-accent-purple/5 to-transparent pointer-events-none rounded-3xl" />

        {/* Fireflies */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${2 + (i % 3) * 2}px`,
              height: `${2 + (i % 3) * 2}px`,
              left: `${8 + (i * 7.5) % 85}%`,
              top: `${10 + (i * 13) % 75}%`,
              background: "#fbbf24",
              boxShadow: "0 0 6px 2px rgba(251,191,36,0.4)",
              opacity: 0.5,
              filter: `blur(${0.5 + (i % 2) * 0.5}px)`,
              animation: `firefly ${4 + (i % 4) * 2}s ease-in-out infinite`,
              animationDelay: `${(i * 0.7) % 5}s`,
            }}
          />
        ))}

        <div className="relative z-10">
          {/* Mascot logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-mark.png"
            alt="WIZL The Wizard"
            className="w-32 h-32 mx-auto mb-2 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]"
          />
          <h1 className="text-4xl font-brand font-bold tracking-[0.25em]" style={{ color: "#e8e4df" }}>
            WIZL
          </h1>
          <p className="text-sm gradient-love font-semibold mt-1 mb-4">
            {t("brand.tagline")}
          </p>

          {/* Scan button */}
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-accent-green text-black font-bold text-sm hover:brightness-110 transition-all mb-2"
            style={{ boxShadow: "0 0 20px rgba(52,211,153,0.25)" }}
          >
            <ScanLine className="w-5 h-5" />
            {t("brand.slogan")}
          </Link>
        </div>
      </section>

      {/* Chat — inline, right on homepage */}
      <section>
        <AskWizl />
      </section>
    </div>
  );
}
