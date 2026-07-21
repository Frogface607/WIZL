"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AskWizl from "@/components/AskWizl";
import { BookOpen, NotebookPen, ScanLine } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function Home() {
  const t = useTranslations();
  const home = useTranslations("home");

  return (
    <div className="max-w-lg mx-auto pb-24 overflow-x-visible">
      <section
        className="relative text-center overflow-hidden"
        style={{ background: "#10181f" }}
      >
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none z-10"
            style={{
              width: String(2 + (i % 3) * 2) + "px",
              height: String(2 + (i % 3) * 2) + "px",
              left: String(8 + (i * 7.5) % 85) + "%",
              top: String(10 + (i * 13) % 75) + "%",
              background: "#fbbf24",
              boxShadow: "0 0 6px 2px rgba(251,191,36,0.4)",
              opacity: 0.5,
              filter: "blur(" + String(0.5 + (i % 2) * 0.5) + "px)",
              animation: "firefly " + String(4 + (i % 4) * 2) + "s ease-in-out infinite",
              animationDelay: String((i * 0.7) % 5) + "s",
            }}
          />
        ))}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-wizl.webp"
          alt="WIZL the weasel wizard with his magic Book"
          className="w-[91%] max-w-[442px] h-auto block mx-auto select-none relative z-0"
          draggable={false}
        />

        <div className="px-5 -mt-2 relative z-10">
          <h1 className="text-2xl font-black text-text-primary">
            {home("heroTitle")}
          </h1>
          <p className="text-text-secondary text-sm mt-2 max-w-[330px] mx-auto">
            {home("heroBody")}
          </p>
        </div>

        <div className="px-4 pb-4 pt-4 relative z-10">
          <Link
            href="/scan"
            onClick={() => trackEvent("home_primary_cta_clicked", { destination: "scan" })}
            className="inline-flex items-center gap-2.5 px-9 py-3 rounded-2xl bg-accent-neon text-black font-bold text-base hover:brightness-110 transition-all"
            style={{ boxShadow: "0 0 24px rgba(153,247,136,0.3)" }}
          >
            <ScanLine className="w-5 h-5" />
            {t("brand.slogan")}
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2 px-4 pt-3">
        {[
          { href: "/scan" as const, icon: ScanLine, label: home("readLabel"), sub: home("labelClues"), destination: "scan" },
          { href: "/strains" as const, icon: BookOpen, label: home("bookLabel"), sub: "3,000+", destination: "book" },
          { href: "/checkin" as const, icon: NotebookPen, label: home("logLabel"), sub: home("fieldNotes"), destination: "log" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => trackEvent("home_quick_link_clicked", { destination: item.destination })}
            className="glass-card rounded-2xl p-3 text-left hover:bg-bg-card-hover transition-all"
          >
            <item.icon className="w-4 h-4 text-accent-green mb-2" />
            <p className="text-sm font-bold text-text-primary">{item.label}</p>
            <p className="text-[10px] text-text-muted">{item.sub}</p>
          </Link>
        ))}
      </section>

      <section className="px-4 pt-4">
        <AskWizl />
      </section>
    </div>
  );
}