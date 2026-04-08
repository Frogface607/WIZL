import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { strains, recentCheckins } from "@/data/strains";
import StrainCard from "@/components/StrainCard";
import CheckinCard from "@/components/CheckinCard";
import { WizlLogo, IconScan } from "@/components/icons";
import { Camera, TrendingUp, Zap } from "lucide-react";

export default function Home() {
  const t = useTranslations();
  const topStrains = strains.slice(0, 5);

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      {/* Hero */}
      <section className="pt-8 pb-10 text-center relative">
        {/* Background glow */}
        <div className="absolute inset-0 -top-20 bg-gradient-to-b from-accent-green/8 via-accent-purple/5 to-transparent pointer-events-none rounded-3xl" />

        <div className="relative z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="WIZL" className="w-48 h-48 mx-auto mb-3 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]" />
          <h1 className="text-4xl font-black gradient-text tracking-tighter mb-1">WIZL</h1>
          <p className="text-sm gradient-love font-semibold mb-6">{t("brand.tagline")}</p>

          {/* Scan button -- the portal */}
          <Link href="/scan" className="inline-block mb-6 group">
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-accent-green/20 blur-xl group-hover:bg-accent-green/30 transition-all scale-125" />
              {/* Ring */}
              <div className="relative w-28 h-28 rounded-full border-2 border-accent-green/50 flex items-center justify-center group-hover:border-accent-green transition-all"
                   style={{ boxShadow: "0 0 30px rgba(52,211,153,0.3), 0 0 60px rgba(52,211,153,0.1), inset 0 0 30px rgba(52,211,153,0.1)" }}>
                {/* Inner circle */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-green/20 to-accent-purple/20 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:from-accent-green/30 group-hover:to-accent-purple/30 transition-all">
                  <IconScan className="w-8 h-8 text-accent-green group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
            <p className="text-accent-green font-bold text-sm mt-3 uppercase tracking-wider">
              {t("home.scanBtn")}
            </p>
          </Link>

          <p className="text-text-secondary text-sm max-w-xs mx-auto">
            {t("brand.description")}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-3 mb-8">
        {[
          { value: strains.length.toString(), label: t("home.strains"), color: "text-accent-green" },
          { value: "2.4K", label: t("home.checkins"), color: "text-accent-purple" },
          { value: "891", label: t("home.explorers"), color: "text-accent-orange" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-2xl p-3 text-center">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-text-muted text-[10px] uppercase tracking-wider font-medium">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* AI Scanner Promo */}
      <section className="mb-8 relative overflow-hidden rounded-2xl"
               style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(167,139,250,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(52,211,153,0.1) 0%, transparent 50%), rgba(19,19,22,0.85)",
                        border: "1px solid rgba(167,139,250,0.2)",
                        boxShadow: "0 0 30px rgba(167,139,250,0.15)" }}>
        <div className="p-5 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Camera className="w-5 h-5 text-accent-purple" />
            <span className="pro-badge px-2 py-0.5 rounded-full text-[10px] font-bold text-black">
              {t("common.pro")}
            </span>
          </div>
          <h3 className="font-bold text-lg mb-1">{t("home.aiScanner")}</h3>
          <p className="text-text-secondary text-sm mb-3">{t("home.aiScannerDesc")}</p>
          <Link href="/scan" className="inline-flex items-center gap-1.5 text-accent-purple text-sm font-semibold hover:text-accent-purple/80 transition-colors">
            {t("home.tryNow")} →
          </Link>
        </div>
      </section>

      {/* Trending */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold uppercase tracking-wide flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-orange" />
            {t("home.trending")}
          </h2>
          <Link href="/strains" className="text-accent-green text-sm font-medium hover:text-accent-green/80 transition-colors">
            {t("home.seeAll")} →
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {topStrains.map((strain) => (
            <StrainCard key={strain.id} strain={strain} />
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4 uppercase tracking-wide flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent-green" />
          {t("home.recentCheckins")}
        </h2>
        <div className="flex flex-col gap-3">
          {recentCheckins.map((checkin) => (
            <CheckinCard key={checkin.id} checkin={checkin} />
          ))}
        </div>
      </section>

      {/* PRO CTA */}
      <section className="rounded-2xl p-6 mb-8 text-center relative overflow-hidden"
               style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.12) 0%, transparent 60%), rgba(19,19,22,0.85)",
                        border: "1px solid rgba(52,211,153,0.15)" }}>
        <h3 className="text-xl font-bold mb-1">{t("home.unlockPro")}</h3>
        <p className="text-sm gradient-love font-medium mb-3">{t("brand.tagline")}</p>
        <p className="text-text-secondary text-sm mb-4">{t("home.proDesc")}</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-text-muted line-through text-sm">$9.99</span>
          <span className="text-3xl font-black price-420">$4.20</span>
          <span className="text-text-muted text-sm">{t("common.mo")}</span>
        </div>
        <Link
          href="/pro"
          className="block w-full py-3.5 rounded-2xl bg-accent-green text-black font-bold hover:brightness-110 transition-all text-center"
          style={{ boxShadow: "0 0 20px rgba(52,211,153,0.3)" }}
        >
          {t("home.startTrial")}
        </Link>
        <p className="text-text-muted text-xs mt-2">{t("home.trialNote")}</p>
      </section>
    </div>
  );
}
