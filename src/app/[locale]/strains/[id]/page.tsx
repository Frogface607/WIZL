import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { strains, recentCheckins } from "@/data/strains";
import { shops } from "@/data/shops";
import CheckinCard from "@/components/CheckinCard";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return strains.map((s) => ({ id: s.id }));
}

const typeEmoji: Record<string, string> = {
  sativa: "☀️",
  indica: "🌙",
  hybrid: "⚡",
};

export default async function StrainPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const strain = strains.find((s) => s.id === id);
  if (!strain) return notFound();

  const t = await getTranslations("strains");
  const strainCheckins = recentCheckins.filter((c) => c.strainId === id);
  const availableAt = shops.filter((s) =>
    "topStrains" in s && Array.isArray((s as any).topStrains)
      ? (s as any).topStrains.some((ts: string) => ts.toLowerCase() === strain.name.toLowerCase())
      : false
  );

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      <Link
        href="/strains"
        className="inline-flex items-center gap-1 text-text-muted text-sm mt-4 mb-4 hover:text-text-secondary transition-colors"
      >
        ← {t("backToStrains")}
      </Link>

      {/* Hero Card with type gradient bar */}
      <div className="glass-card rounded-3xl overflow-hidden mb-6">
        <div className={`h-1.5 strain-${strain.type}`} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="text-6xl w-20 h-20 flex items-center justify-center bg-bg-primary rounded-2xl flex-shrink-0">
              {strain.image}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black leading-tight">{strain.name}</h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`strain-${strain.type} px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-white`}>
                  {typeEmoji[strain.type]} {strain.type}
                </span>
                <span className="text-text-muted text-sm font-medium">THC {strain.thc}%</span>
                {strain.cbd > 0.1 && (
                  <span className="text-text-muted text-sm">CBD {strain.cbd}%</span>
                )}
              </div>
            </div>
          </div>

          {/* Rating bar */}
          <div className="flex items-center gap-3 bg-bg-primary/50 rounded-2xl p-4 mb-5">
            <div className="text-center">
              <p className="text-4xl font-black text-accent-green leading-none">{strain.rating}</p>
              <div className="flex gap-0.5 mt-1.5 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-sm ${i < Math.round(strain.rating) ? "text-accent-green" : "text-text-muted/30"}`}>★</span>
                ))}
              </div>
            </div>
            <div className="flex-1 border-l border-border pl-3">
              <p className="text-text-primary text-sm font-semibold">{strain.reviewCount.toLocaleString()} {t("reviews")}</p>
              <p className="text-text-muted text-xs">{t("fromCommunity")}</p>
            </div>
            <Link href="/checkin" className="px-4 py-2.5 rounded-xl bg-accent-green text-black font-bold text-sm hover:brightness-110 transition-all">
              {t("rateIt")} 🔍
            </Link>
          </div>

          {/* Description */}
          <p className="text-text-secondary text-sm leading-relaxed">{strain.description}</p>
        </div>
      </div>

      {/* Effects & Flavors side by side on small, stacked on narrow */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-text-muted">⚡ {t("effects")}</h2>
          <div className="flex flex-wrap gap-2">
            {strain.effects.map((effect) => (
              <span key={effect} className="px-3 py-1.5 rounded-full bg-accent-green/10 text-accent-green text-sm font-medium border border-accent-green/20">
                {effect}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-text-muted">👅 {t("flavors")}</h2>
          <div className="flex flex-wrap gap-2">
            {strain.flavors.map((flavor) => (
              <span key={flavor} className="px-3 py-1.5 rounded-full bg-accent-purple/10 text-accent-purple text-sm font-medium border border-accent-purple/20">
                {flavor}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-lg font-black text-accent-green">{strain.thc}%</p>
          <p className="text-text-muted text-[10px]">THC</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-lg font-black text-accent-purple">{strain.cbd}%</p>
          <p className="text-text-muted text-[10px]">CBD</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-lg font-black text-accent-orange">{strain.reviewCount}</p>
          <p className="text-text-muted text-[10px]">{t("reviews")}</p>
        </div>
      </div>

      {/* Available at shops */}
      {availableAt.length > 0 && (
        <section className="mb-6">
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-text-muted">📍 Available at</h2>
          <div className="flex flex-col gap-2">
            {availableAt.map((s) => (
              <Link key={s.id} href="/map"
                className="glass-card rounded-xl p-3 flex items-center gap-3 hover:bg-bg-card-hover transition-all">
                <span className="text-lg">🏪</span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{s.name}</p>
                  <p className="text-text-muted text-xs">{s.city}, {s.country}{s.hours ? ` • ${s.hours}` : ""}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-accent-green text-xs font-bold">{s.rating}</span>
                  <span className="text-accent-green text-[10px]">★</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      {strainCheckins.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4">💬 {t("recentReviews")}</h2>
          <div className="flex flex-col gap-3">
            {strainCheckins.map((checkin) => (
              <CheckinCard key={checkin.id} checkin={checkin} />
            ))}
          </div>
        </section>
      )}

      {strainCheckins.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-text-secondary text-sm mb-1">{t("noReviews")}</p>
          <Link href="/checkin" className="text-accent-green text-sm font-semibold">
            {t("writeReview")} →
          </Link>
        </div>
      )}
    </div>
  );
}
