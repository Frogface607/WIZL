import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { strains, recentCheckins } from "@/data/strains";
import StrainCard from "@/components/StrainCard";
import CheckinCard from "@/components/CheckinCard";

export default function Home() {
  const t = useTranslations();
  const topStrains = strains.slice(0, 5);

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      {/* Hero */}
      <section className="py-10 text-center">
        <div className="text-5xl mb-4 animate-float">🔍</div>
        <h1 className="text-3xl font-black gradient-text mb-1">{t("brand.name")}</h1>
        <p className="text-sm gradient-love font-medium mb-3">{t("brand.tagline")}</p>
        <p className="text-text-secondary text-sm max-w-xs mx-auto mb-6">
          {t("brand.description")}
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/checkin"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent-green text-black font-bold hover:brightness-110 transition-all glow-green"
          >
            🔍 {t("home.scanBtn")}
          </Link>
          <Link
            href="/strains"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-bg-card border border-border text-text-secondary font-medium hover:bg-bg-card-hover transition-all"
          >
            🌿 {t("home.browseBtn")}
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-3 gap-3 mb-8">
        <div className="glass-card rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-accent-green">{strains.length}</p>
          <p className="text-text-muted text-xs">{t("home.strains")}</p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-accent-purple">2.4K</p>
          <p className="text-text-muted text-xs">{t("home.checkins")}</p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-accent-orange">891</p>
          <p className="text-text-muted text-xs">{t("home.explorers")}</p>
        </div>
      </section>

      {/* AI Scanner Promo */}
      <section className="glass-card rounded-2xl p-5 mb-8 glow-purple relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📸</span>
            <span className="pro-badge px-2 py-0.5 rounded-full text-[10px] font-bold text-black">
              {t("common.pro")}
            </span>
          </div>
          <h3 className="font-bold text-lg mb-1">{t("home.aiScanner")}</h3>
          <p className="text-text-secondary text-sm mb-3">{t("home.aiScannerDesc")}</p>
          <Link
            href="/checkin"
            className="inline-flex items-center gap-1.5 text-accent-purple text-sm font-semibold"
          >
            {t("home.tryNow")} →
          </Link>
        </div>
      </section>

      {/* Trending */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">🔥 {t("home.trending")}</h2>
          <Link href="/strains" className="text-accent-green text-sm font-medium">
            {t("home.seeAll")} →
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {topStrains.map((strain) => (
            <StrainCard key={strain.id} strain={strain} />
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">⚡ {t("home.recentCheckins")}</h2>
        <div className="flex flex-col gap-3">
          {recentCheckins.map((checkin) => (
            <CheckinCard key={checkin.id} checkin={checkin} />
          ))}
        </div>
      </section>

      {/* PRO CTA */}
      <section className="glass-card rounded-2xl p-6 mb-8 text-center border border-accent-green/20">
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
          className="block w-full py-3 rounded-2xl bg-accent-green text-black font-bold hover:brightness-110 transition-all glow-green text-center"
        >
          {t("home.startTrial")}
        </Link>
        <p className="text-text-muted text-xs mt-2">{t("home.trialNote")}</p>
      </section>
    </div>
  );
}
