import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { strains, recentCheckins } from "@/data/strains";
import { shops } from "@/data/shops";
import CheckinCard from "@/components/CheckinCard";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Star,
  Flame,
  Droplets,
  Clock,
  Gauge,
  Zap,
  Sparkles,
  Lightbulb,
  Dna,
  MapPin,
  Tag,
  TreePine,
  Citrus,
  Flower2,
  Leaf,
  Cherry,
  Wind,
  Store,
} from "lucide-react";

export function generateStaticParams() {
  return strains.map((s) => ({ id: s.id }));
}

const typeGradients: Record<string, string> = {
  sativa: "from-yellow-500/80 to-orange-500/80",
  indica: "from-violet-500/80 to-purple-600/80",
  hybrid: "from-emerald-500/80 to-teal-500/80",
};

const typeBgGradients: Record<string, string> = {
  sativa: "from-yellow-500/10 via-orange-500/5 to-transparent",
  indica: "from-violet-500/10 via-purple-600/5 to-transparent",
  hybrid: "from-emerald-500/10 via-teal-500/5 to-transparent",
};

const difficultyConfig: Record<string, { label: string; color: string; icon: string }> = {
  easy: { label: "Beginner", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", icon: "text-emerald-400" },
  moderate: { label: "Intermediate", color: "text-amber-400 bg-amber-400/10 border-amber-400/20", icon: "text-amber-400" },
  hard: { label: "Advanced", color: "text-red-400 bg-red-400/10 border-red-400/20", icon: "text-red-400" },
};

const terpeneData: Record<string, { description: string; color: string }> = {
  Myrcene: { description: "Earthy, herbal. The couch-lock terpene", color: "#a78bfa" },
  Limonene: { description: "Citrus, uplifting. Mood booster", color: "#facc15" },
  Caryophyllene: { description: "Spicy, anti-inflammatory. The pepper terpene", color: "#f97316" },
  Pinene: { description: "Pine, alertness. Sharp and refreshing", color: "#34d399" },
  Linalool: { description: "Floral, calming. Lavender vibes", color: "#c084fc" },
  Humulene: { description: "Woody, appetite suppressant. Earthy hops", color: "#a3e635" },
  Terpinolene: { description: "Fruity, sedating. Complex and unique", color: "#fb923c" },
  Ocimene: { description: "Sweet, decongestant. Fresh and herbal", color: "#67e8f9" },
};

const TerpeneIcon = ({ terpene, className, style }: { terpene: string; className?: string; style?: React.CSSProperties }) => {
  switch (terpene) {
    case "Myrcene": return <Droplets className={className} style={style} />;
    case "Limonene": return <Citrus className={className} style={style} />;
    case "Caryophyllene": return <Flame className={className} style={style} />;
    case "Pinene": return <TreePine className={className} style={style} />;
    case "Linalool": return <Flower2 className={className} style={style} />;
    case "Humulene": return <Leaf className={className} style={style} />;
    case "Terpinolene": return <Cherry className={className} style={style} />;
    case "Ocimene": return <Wind className={className} style={style} />;
    default: return <Sparkles className={className} style={style} />;
  }
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
    "topStrains" in s && Array.isArray((s as Record<string, unknown>).topStrains)
      ? ((s as Record<string, unknown>).topStrains as string[]).some(
          (ts: string) => ts.toLowerCase() === strain.name.toLowerCase()
        )
      : false
  );

  const diff = difficultyConfig[strain.difficulty] || difficultyConfig.moderate;

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      {/* Back nav */}
      <Link
        href="/strains"
        className="inline-flex items-center gap-1.5 text-text-muted text-sm mt-4 mb-4 hover:text-text-secondary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("backToStrains")}
      </Link>

      {/* ============================================= */}
      {/* HERO SECTION */}
      {/* ============================================= */}
      <section className="glass-card rounded-3xl overflow-hidden mb-5">
        {/* Type gradient banner */}
        <div className={`h-24 bg-gradient-to-r ${typeGradients[strain.type]} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          {/* Large letter watermark */}
          <div className="absolute -right-4 -top-4 text-[120px] font-black text-white/10 leading-none select-none">
            {strain.name.charAt(0)}
          </div>
        </div>

        <div className="p-5 -mt-8 relative">
          {/* Strain initial badge */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black mb-3 border-2 border-bg-primary shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${strain.color}, ${strain.color}99)`,
              color: "white",
            }}
          >
            {strain.name.charAt(0)}
          </div>

          {/* Name & Type */}
          <h1 className="text-3xl font-black text-text-heading leading-tight tracking-tight">
            {strain.name}
          </h1>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`strain-${strain.type} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white`}>
              {strain.type}
            </span>
            {strain.genetics && strain.genetics !== "Unknown" && (
              <span className="text-text-muted text-xs flex items-center gap-1">
                <Dna className="w-3.5 h-3.5" />
                {strain.genetics}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-4 bg-bg-primary/60 rounded-2xl p-4">
            <div className="text-center">
              <p className="text-4xl font-black text-accent-green leading-none">{strain.rating}</p>
              <div className="flex gap-0.5 mt-1.5 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(strain.rating)
                        ? "text-accent-green fill-accent-green"
                        : "text-text-muted/30"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 border-l border-border pl-3">
              <p className="text-text-primary text-sm font-semibold">
                {strain.reviewCount.toLocaleString()} {t("reviews")}
              </p>
              <p className="text-text-muted text-xs">{t("fromCommunity")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= */}
      {/* QUICK STATS */}
      {/* ============================================= */}
      <section className="grid grid-cols-4 gap-2.5 mb-5">
        <div className="glass-card rounded-xl p-3 text-center">
          <Flame className="w-4 h-4 text-accent-green mx-auto mb-1" />
          <p className="text-lg font-black text-accent-green">{strain.thc}%</p>
          <p className="text-text-muted text-[10px] font-medium">THC</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <Droplets className="w-4 h-4 text-accent-purple mx-auto mb-1" />
          <p className="text-lg font-black text-accent-purple">{strain.cbd}%</p>
          <p className="text-text-muted text-[10px] font-medium">CBD</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <Gauge className={`w-4 h-4 ${diff.icon} mx-auto mb-1`} />
          <p className={`text-sm font-bold ${diff.icon}`}>{diff.label}</p>
          <p className="text-text-muted text-[10px] font-medium">Grow</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <Clock className="w-4 h-4 text-accent-orange mx-auto mb-1" />
          <p className="text-sm font-bold text-accent-orange">{strain.floweringTime}</p>
          <p className="text-text-muted text-[10px] font-medium">Flower</p>
        </div>
      </section>

      {/* ============================================= */}
      {/* CHECK-IN BUTTON */}
      {/* ============================================= */}
      <Link
        href="/checkin"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-accent-green text-black font-bold text-sm hover:brightness-110 transition-all mb-5 shadow-lg shadow-accent-green/20"
      >
        <Zap className="w-5 h-5" />
        I&apos;m smoking this
      </Link>

      {/* ============================================= */}
      {/* DESCRIPTION */}
      {/* ============================================= */}
      <section className="glass-card rounded-2xl p-5 mb-5">
        <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-text-muted flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          About this strain
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed">{strain.description}</p>
      </section>

      {/* ============================================= */}
      {/* FUN FACT */}
      {/* ============================================= */}
      {strain.funFact && (
        <section className={`rounded-2xl p-5 mb-5 bg-gradient-to-br ${typeBgGradients[strain.type]} border border-border relative overflow-hidden`}>
          <div className="absolute top-3 right-3 opacity-10">
            <Lightbulb className="w-16 h-16" />
          </div>
          <h2 className="font-bold mb-2 text-sm uppercase tracking-wider text-accent-green flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Did you know?
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed relative z-10">{strain.funFact}</p>
        </section>
      )}

      {/* ============================================= */}
      {/* EFFECTS & FLAVORS */}
      {/* ============================================= */}
      <div className="grid grid-cols-1 gap-4 mb-5">
        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-text-muted flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {t("effects")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {strain.effects.map((effect) => (
              <span
                key={effect}
                className="px-3 py-1.5 rounded-full bg-accent-green/10 text-accent-green text-sm font-medium border border-accent-green/20"
              >
                {effect}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-text-muted flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            {t("flavors")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {strain.flavors.map((flavor) => (
              <span
                key={flavor}
                className="px-3 py-1.5 rounded-full bg-accent-purple/10 text-accent-purple text-sm font-medium border border-accent-purple/20"
              >
                {flavor}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================= */}
      {/* BEST FOR */}
      {/* ============================================= */}
      {strain.bestFor && strain.bestFor.length > 0 && (
        <section className="glass-card rounded-2xl p-5 mb-5">
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-text-muted flex items-center gap-2">
            <Star className="w-4 h-4" />
            Best for
          </h2>
          <div className="flex flex-wrap gap-2">
            {strain.bestFor.map((use) => (
              <span
                key={use}
                className="px-3 py-1.5 rounded-full text-sm font-medium border"
                style={{
                  backgroundColor: `${strain.color}15`,
                  borderColor: `${strain.color}30`,
                  color: strain.color,
                }}
              >
                {use}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ============================================= */}
      {/* TERPENE PROFILE */}
      {/* ============================================= */}
      {strain.terpenes && strain.terpenes.length > 0 && (
        <section className="glass-card rounded-2xl p-5 mb-5">
          <h2 className="font-bold mb-4 text-sm uppercase tracking-wider text-text-muted flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Terpene Profile
          </h2>
          <div className="flex flex-col gap-3">
            {strain.terpenes.map((terp, idx) => {
              const data = terpeneData[terp] || { description: "Unique aromatic compound", color: "#9ca3af" };
              const isFirst = idx === 0;
              return (
                <div
                  key={terp}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isFirst ? "bg-bg-primary/80 border border-border" : "bg-bg-primary/40"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${data.color}20` }}
                  >
                    <TerpeneIcon terpene={terp} className="w-5 h-5" style={{ color: data.color } as React.CSSProperties} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-text-primary">{terp}</p>
                      {isFirst && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-green/10 text-accent-green">
                          Dominant
                        </span>
                      )}
                    </div>
                    <p className="text-text-muted text-xs mt-0.5">{data.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============================================= */}
      {/* GENETICS & ORIGIN */}
      {/* ============================================= */}
      <section className="glass-card rounded-2xl p-5 mb-5">
        <h2 className="font-bold mb-4 text-sm uppercase tracking-wider text-text-muted flex items-center gap-2">
          <Dna className="w-4 h-4" />
          Genetics & Origin
        </h2>
        <div className="space-y-3">
          {strain.genetics && strain.genetics !== "Unknown" && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Dna className="w-4 h-4 text-accent-green" />
              </div>
              <div>
                <p className="text-text-muted text-xs font-medium">Parent Strains</p>
                <p className="text-text-primary text-sm font-semibold">{strain.genetics}</p>
              </div>
            </div>
          )}
          {strain.breeder && strain.breeder !== "Unknown" && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-purple/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-accent-purple" />
              </div>
              <div>
                <p className="text-text-muted text-xs font-medium">Breeder</p>
                <p className="text-text-primary text-sm font-semibold">{strain.breeder}</p>
              </div>
            </div>
          )}
          {strain.origin && strain.origin !== "Unknown" && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-orange/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-accent-orange" />
              </div>
              <div>
                <p className="text-text-muted text-xs font-medium">Origin</p>
                <p className="text-text-primary text-sm font-semibold">{strain.origin}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================= */}
      {/* ALSO KNOWN AS */}
      {/* ============================================= */}
      {strain.aka && strain.aka.length > 0 && (
        <section className="glass-card rounded-2xl p-5 mb-5">
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-text-muted flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Also Known As
          </h2>
          <div className="flex flex-wrap gap-2">
            {strain.aka.map((name) => (
              <span
                key={name}
                className="px-3 py-1.5 rounded-full bg-bg-primary text-text-secondary text-sm font-medium border border-border"
              >
                {name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ============================================= */}
      {/* AVAILABLE AT */}
      {/* ============================================= */}
      {availableAt.length > 0 && (
        <section className="glass-card rounded-2xl p-5 mb-5">
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-text-muted flex items-center gap-2">
            <Store className="w-4 h-4" />
            Available At
          </h2>
          <div className="flex flex-col gap-2">
            {availableAt.map((s) => (
              <Link
                key={s.id}
                href="/map"
                className="flex items-center gap-3 p-3 rounded-xl bg-bg-primary/60 hover:bg-bg-primary transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-text-primary">{s.name}</p>
                  <p className="text-text-muted text-xs">
                    {s.city}, {s.country}
                    {s.hours ? ` \u00B7 ${s.hours}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-accent-green text-xs font-bold">{s.rating}</span>
                  <Star className="w-3 h-3 text-accent-green fill-accent-green" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============================================= */}
      {/* REVIEWS */}
      {/* ============================================= */}
      {strainCheckins.length > 0 && (
        <section className="mb-5">
          <h2 className="font-bold mb-4 text-sm uppercase tracking-wider text-text-muted flex items-center gap-2 px-1">
            <Star className="w-4 h-4" />
            {t("recentReviews")}
          </h2>
          <div className="flex flex-col gap-3">
            {strainCheckins.map((checkin) => (
              <CheckinCard key={checkin.id} checkin={checkin} />
            ))}
          </div>
        </section>
      )}

      {strainCheckins.length === 0 && (
        <div className="glass-card rounded-2xl text-center py-10 px-6 mb-5">
          <Sparkles className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
          <p className="text-text-secondary text-sm font-medium mb-1">{t("noReviews")}</p>
          <Link href="/checkin" className="text-accent-green text-sm font-semibold hover:underline">
            {t("writeReview")} &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
