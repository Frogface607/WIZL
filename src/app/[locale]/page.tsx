import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { WizlLogo, IconScan } from "@/components/icons";
import { BookOpen, MapPin, ScanLine } from "lucide-react";

export default async function Home() {
  const t = await getTranslations();

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      {/* Hero */}
      <section className="pt-8 pb-10 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -top-20 bg-gradient-to-b from-accent-green/8 via-accent-purple/5 to-transparent pointer-events-none rounded-3xl" />

        {/* Fireflies */}
        {[...Array(12)].map((_, i) => (
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="WIZL" className="w-48 h-48 mx-auto -mb-2 mix-blend-screen drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]" />
          <h1 className="text-5xl font-brand font-bold tracking-[0.25em]" style={{color: "#e8e4df"}}>WIZL</h1>
          <p className="text-sm gradient-love font-semibold mb-6 mt-1">{t("brand.tagline")}</p>

          <p className="text-text-secondary text-sm max-w-xs mx-auto">
            {t("brand.description")}
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="flex flex-col gap-3">
        <Link href="/strains" className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:bg-bg-card-hover transition-all group">
          <div className="w-12 h-12 rounded-xl bg-accent-green/10 flex items-center justify-center group-hover:bg-accent-green/20 transition-colors">
            <BookOpen className="w-6 h-6 text-accent-green" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{t("home.bookTitle")}</p>
            <p className="text-text-muted text-xs">{t("home.bookDesc")}</p>
          </div>
          <span className="text-text-muted text-xs">→</span>
        </Link>

        <Link href="/scan" className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:bg-bg-card-hover transition-all group">
          <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center group-hover:bg-accent-purple/20 transition-colors">
            <ScanLine className="w-6 h-6 text-accent-purple" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{t("home.scanTitle")}</p>
            <p className="text-text-muted text-xs">{t("home.scanDesc")}</p>
          </div>
          <span className="text-text-muted text-xs">→</span>
        </Link>

        <Link href="/map" className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:bg-bg-card-hover transition-all group">
          <div className="w-12 h-12 rounded-xl bg-accent-orange/10 flex items-center justify-center group-hover:bg-accent-orange/20 transition-colors">
            <MapPin className="w-6 h-6 text-accent-orange" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">{t("home.mapTitle")}</p>
            <p className="text-text-muted text-xs">{t("home.mapDesc")}</p>
          </div>
          <span className="text-text-muted text-xs">→</span>
        </Link>
      </section>
    </div>
  );
}
