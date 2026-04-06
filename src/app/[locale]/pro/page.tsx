"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getUserData, saveUserData } from "@/lib/store";

export default function ProPage() {
  const t = useTranslations("pro");
  const tb = useTranslations("brand");
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Check if returning from successful checkout
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      const data = getUserData();
      data.isPro = true;
      saveUserData(data);
      setSubscribed(true);
    } else {
      const data = getUserData();
      setSubscribed(data.isPro);
    }
  }, [searchParams]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();

      if (data.url && data.url !== "#demo-checkout") {
        // Real checkout — redirect to LemonSqueezy
        window.location.href = data.url;
      } else {
        // Demo mode — activate PRO locally
        const userData = getUserData();
        userData.isPro = true;
        saveUserData(userData);
        setSubscribed(true);
      }
    } catch {
      // Fallback: activate demo PRO
      const userData = getUserData();
      userData.isPro = true;
      saveUserData(userData);
      setSubscribed(true);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: "📸", title: t("aiScanner"), desc: t("aiScannerDesc") },
    { icon: "🔓", title: t("unlimitedScans"), desc: t("unlimitedScansDesc") },
    { icon: "🧠", title: t("smartInsights"), desc: t("smartInsightsDesc") },
    { icon: "📊", title: t("fullHistory"), desc: t("fullHistoryDesc") },
    { icon: "🏆", title: t("exclusiveBadges"), desc: t("exclusiveBadgesDesc") },
    { icon: "🌍", title: t("globalMap"), desc: t("globalMapDesc") },
  ];

  const freeVsPro = [
    { feature: t("browseStrains"), free: true, pro: true },
    { feature: t("dailyScans"), free: t("freeScans"), pro: t("unlimited") },
    { feature: "Check-ins", free: true, pro: true },
    { feature: t("aiScannerFeature"), free: false, pro: true },
    { feature: t("fullHistoryFeature"), free: false, pro: true },
    { feature: t("smartInsightsFeature"), free: false, pro: true },
    { feature: t("rareBadges"), free: false, pro: true },
    { feature: t("noAds"), free: false, pro: true },
  ];

  if (subscribed) {
    return (
      <div className="max-w-lg mx-auto px-4 pb-24 pt-8">
        <div className="text-center py-16">
          <div className="text-7xl mb-4 animate-float">💚</div>
          <h2 className="text-2xl font-black gradient-text mb-1">{t("welcomePro")}</h2>
          <p className="text-sm gradient-love font-medium mb-4">{tb("tagline")}</p>
          <p className="text-text-secondary text-sm mb-8">{t("youreIn")}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/scan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent-green text-black font-bold hover:brightness-110 transition-all glow-green">
              🔍 {t("startScanning")}
            </Link>
            <Link href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-bg-card border border-border text-text-secondary font-medium hover:bg-bg-card-hover transition-all">
              🏪 Add Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3 animate-float">🔍</div>
        <h1 className="text-3xl font-black gradient-text mb-1">{t("title")}</h1>
        <p className="text-sm gradient-love font-medium mb-3">{tb("tagline")}</p>
        <p className="text-text-secondary text-sm">{t("subtitle")}</p>
      </div>

      <div className="glass-card rounded-3xl p-8 mb-8 text-center glow-green border border-accent-green/20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-text-muted line-through text-lg">$9.99</span>
        </div>
        <div className="text-6xl font-black price-420 mb-1">$4.20</div>
        <p className="text-text-muted text-sm">{t("perMonth")}</p>
        <p className="text-text-muted text-xs mt-2">{t("onPurpose")}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {features.map((f) => (
          <div key={f.title} className="glass-card rounded-2xl p-4">
            <span className="text-2xl">{f.icon}</span>
            <p className="font-bold text-sm mt-2">{f.title}</p>
            <p className="text-text-muted text-xs mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* For shops */}
      <div className="glass-card rounded-2xl p-5 mb-8 border border-accent-orange/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🏪</span>
          <h3 className="font-bold text-sm">Shop owners</h3>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          PRO also lets you add your shop to the WIZL map with a full menu, hours, and reviews. Same price — $4.20/mo.
        </p>
        <Link href="/shop" className="text-accent-orange text-xs font-semibold">
          Learn more →
        </Link>
      </div>

      <div className="glass-card rounded-2xl p-5 mb-8">
        <h3 className="font-bold mb-4">{t("freeVsPro")}</h3>
        <div className="flex flex-col gap-3">
          {freeVsPro.map((row) => (
            <div key={row.feature} className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">{row.feature}</span>
              <div className="flex items-center gap-6">
                <span className="text-xs w-16 text-center text-text-muted">
                  {row.free === true ? "✓" : row.free === false ? "—" : row.free}
                </span>
                <span className="text-xs w-16 text-center text-accent-green font-medium">
                  {row.pro === true ? "✓" : row.pro}
                </span>
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-6 mt-1 border-t border-border pt-2">
            <span className="text-[10px] w-16 text-center text-text-muted">{t("free")}</span>
            <span className="text-[10px] w-16 text-center text-accent-green font-bold">PRO</span>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5 mb-8 text-center border border-accent-love/20 glow-love">
        <p className="text-accent-love font-bold text-sm mb-2">💚 {t("supportJourney")}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{t("supportDesc")}</p>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-accent-green text-black font-bold text-lg hover:brightness-110 transition-all glow-green mb-3 disabled:opacity-50"
      >
        {loading ? "Loading..." : t("startTrial")}
      </button>
      <p className="text-text-muted text-xs text-center mb-2">{t("trialNote")}</p>
      <p className="text-text-muted text-[10px] text-center">{t("noTricks")}</p>
    </div>
  );
}
