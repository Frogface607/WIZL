"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AskWizl from "@/components/AskWizl";
import { ScanLine } from "lucide-react";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="max-w-lg mx-auto pb-24 overflow-x-visible">
      {/* Hero — full-width card with matching bg so PNG blends seamlessly */}
      <section
        className="relative text-center overflow-hidden"
        style={{ background: "#10181f" }}
      >
        {/* Fireflies over the hero */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none z-10"
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

        {/* Hero image — smaller, centered, padded */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-wizl.png"
          alt="WIZL The Wizard — with love"
          className="w-[70%] max-w-[340px] h-auto block mx-auto select-none relative z-0"
          draggable={false}
        />

        {/* Scan button */}
        <div className="px-4 pb-4 pt-1 relative z-10">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-2xl bg-accent-neon text-black font-bold text-sm hover:brightness-110 transition-all"
            style={{ boxShadow: "0 0 24px rgba(153,247,136,0.3)" }}
          >
            <ScanLine className="w-5 h-5" />
            {t("brand.slogan")}
          </Link>
        </div>
      </section>

      {/* Chat — inline, right under hero */}
      <section className="px-4 pt-4">
        <AskWizl />
      </section>
    </div>
  );
}
