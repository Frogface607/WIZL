"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { moods } from "@/data/strains";
import { fetchStrains, fetchStrainById } from "@/lib/strains-db";
import { shops } from "@/data/shops";
import { Strain } from "@/types";
import { addCheckin, Achievement } from "@/lib/store";

export default function CheckinPage() {
  const t = useTranslations("checkin");
  const tc = useTranslations("common");
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("strain");
  const [allStrains, setAllStrains] = useState<Strain[]>([]);
  // If we have a preselected strain from URL, go straight to "rate" step
  const [step, setStep] = useState<"select" | "rate" | "done">(
    preselectedId ? "rate" : "select"
  );
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);
  const [loadingStrain, setLoadingStrain] = useState(!!preselectedId);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [search, setSearch] = useState("");
  const [shopSearch, setShopSearch] = useState("");
  const [selectedShop, setSelectedShop] = useState<{ id: string; name: string } | null>(null);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  // Fast path: fetch ONLY the preselected strain instantly (single query)
  useEffect(() => {
    if (!preselectedId) return;
    fetchStrainById(preselectedId).then((strain) => {
      if (strain) {
        setSelectedStrain(strain);
      } else {
        // Strain not found — fall back to select step
        setStep("select");
      }
      setLoadingStrain(false);
    });
  }, [preselectedId]);

  // Lazy path: fetch all strains only when user lands on "select" step and needs to search
  useEffect(() => {
    if (step === "select" && allStrains.length === 0) {
      fetchStrains().then(setAllStrains);
    }
  }, [step, allStrains.length]);

  const filteredStrains = allStrains.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredShops = shops.filter((s) =>
    s.name.toLowerCase().includes(shopSearch.toLowerCase()) ||
    s.city.toLowerCase().includes(shopSearch.toLowerCase())
  ).slice(0, 5);

  const handleSubmit = () => {
    if (!selectedStrain || rating === 0) return;
    const result = addCheckin(selectedStrain, rating, selectedMood, review, selectedShop || undefined);
    setNewAchievements(result.newAchievements);
    setStep("done");
  };

  if (step === "done") {
    return (
      <div className="max-w-lg mx-auto px-4 pb-24 pt-8">
        <div className="text-center py-12">
          <div className="text-7xl mb-4 animate-float">🔍</div>
          <h2 className="text-2xl font-black gradient-text mb-1">{t("logged")}</h2>
          <p className="text-sm gradient-love font-medium mb-3">with love</p>
          <p className="text-text-secondary mb-2">
            {t("checkinRecorded")}{" "}
            <span className="text-text-primary font-semibold">{selectedStrain?.name}</span>
          </p>
          <div className="flex justify-center gap-1 mb-6">
            {Array.from({ length: rating }).map((_, i) => (
              <span key={i} className="text-2xl">🌿</span>
            ))}
          </div>

          {/* New achievements */}
          {newAchievements.length > 0 && (
            <div className="flex flex-col gap-3 mb-6">
              {newAchievements.map((ach) => (
                <div key={ach.id} className="glass-card rounded-2xl p-5 glow-green">
                  <p className="text-accent-green font-bold text-sm mb-2">🏆 {t("badgeUnlocked")}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ach.icon}</span>
                    <div className="text-left">
                      <p className="font-semibold text-sm">{ach.name}</p>
                      <p className="text-text-muted text-xs">{ach.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="glass-card rounded-2xl p-5 mb-6 text-left">
            <p className="text-xs text-text-muted mb-2">{t("shareCheckin")}</p>
            <div className="flex gap-3">
              {["📱", "📋", "💬"].map((icon) => (
                <button key={icon} className="flex-1 py-3 rounded-xl bg-bg-primary border border-border text-xl hover:bg-bg-card-hover transition-colors">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setStep("select"); setSelectedStrain(null); setRating(0); setReview(""); setSelectedMood(""); setSearch(""); setNewAchievements([]); }}
              className="flex-1 px-6 py-3 rounded-2xl bg-accent-green text-black font-bold hover:brightness-110 transition-all"
            >
              {t("scanAnother")} 🔍
            </button>
            <Link href="/profile" className="flex-1 px-6 py-3 rounded-2xl bg-bg-card border border-border text-text-secondary font-medium text-center hover:bg-bg-card-hover transition-all">
              👤 Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Loading state while fetching preselected strain
  if (step === "rate" && loadingStrain) {
    return (
      <div className="max-w-lg mx-auto px-4 pb-24 pt-20 text-center">
        <div className="inline-block w-10 h-10 rounded-full border-2 border-accent-green border-t-transparent animate-spin mb-4" />
        <p className="text-text-muted text-sm">Loading strain...</p>
      </div>
    );
  }

  if (step === "rate" && selectedStrain) {
    return (
      <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
        <button onClick={() => setStep("select")} className="text-text-muted text-sm mb-4 hover:text-text-secondary transition-colors">
          ← {t("changeStrain")}
        </button>

        <div className="glass-card rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedStrain.image}</span>
            <div>
              <h3 className="font-bold">{selectedStrain.name}</h3>
              <span className={`strain-${selectedStrain.type} px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-white`}>
                {selectedStrain.type}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-3">{t("rateIt")} 🌿</h3>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)}
                className={`text-4xl transition-all hover:scale-125 ${star <= rating ? "opacity-100 scale-110" : "opacity-30"}`}>
                🌿
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-3">{t("howFeeling")}</h3>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((mood) => (
              <button key={mood.value} onClick={() => setSelectedMood(mood.value)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  selectedMood === mood.value ? "bg-accent-green/20 border border-accent-green/30" : "bg-bg-card border border-border hover:bg-bg-card-hover"
                }`}>
                <span className="text-xl">{mood.emoji}</span>
                <span className="text-[10px] text-text-muted">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-3">{t("dropNote")} ✍️</h3>
          <textarea placeholder={t("notePlaceholder")} value={review} onChange={(e) => setReview(e.target.value)} rows={3}
            className="w-full bg-bg-card border border-border rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green/50 transition-colors resize-none" />
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-3">
            {t("addPhoto")} 📸{" "}
            <span className="pro-badge px-2 py-0.5 rounded-full text-[10px] font-bold text-black">{tc("pro")}</span>
          </h3>
          <Link href="/scan" className="block glass-card rounded-2xl p-8 border-2 border-dashed border-border text-center hover:bg-bg-card-hover transition-all">
            <div className="text-3xl mb-2">📷</div>
            <p className="text-text-muted text-sm">{t("tapToScan")}</p>
            <p className="text-text-muted text-xs mt-1">{t("aiRecognize")}</p>
          </Link>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-3">📍 Where are you?</h3>
          {selectedShop ? (
            <div className="glass-card rounded-2xl p-3 flex items-center gap-3">
              <span className="text-xl">🏪</span>
              <div className="flex-1">
                <p className="font-semibold text-sm">{selectedShop.name}</p>
              </div>
              <button onClick={() => setSelectedShop(null)} className="text-text-muted text-xs hover:text-accent-love transition-colors">✕ Remove</button>
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search shop..."
                value={shopSearch}
                onChange={(e) => setShopSearch(e.target.value)}
                className="w-full bg-bg-card border border-border rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green/50 transition-colors mb-2"
              />
              {shopSearch.length > 0 && (
                <div className="flex flex-col gap-1">
                  {filteredShops.map((shop) => (
                    <button
                      key={shop.id}
                      onClick={() => { setSelectedShop({ id: shop.id, name: shop.name }); setShopSearch(""); }}
                      className="glass-card rounded-xl p-2.5 flex items-center gap-2 text-left hover:bg-bg-card-hover transition-all"
                    >
                      <span className="text-sm">🏪</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{shop.name}</p>
                        <p className="text-text-muted text-[10px]">{shop.city}, {shop.country}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {shopSearch.length === 0 && (
                <p className="text-text-muted text-xs text-center py-2">Optional — tag the shop you&apos;re at</p>
              )}
            </>
          )}
        </div>

        <button onClick={handleSubmit} disabled={rating === 0}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
            rating > 0 ? "bg-accent-green text-black hover:brightness-110 glow-green" : "bg-bg-card text-text-muted border border-border"
          }`}>
          {rating > 0 ? `${t("checkIn")} 🔍` : t("rateFirst")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
      <h1 className="text-2xl font-black mb-1">🔍 {t("title")}</h1>
      <p className="text-text-secondary text-sm mb-6">{t("subtitle")}</p>

      <div className="relative mb-4">
        <input type="text" placeholder={t("searchStrains")} value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-bg-card border border-border rounded-2xl px-4 py-3 pl-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green/50 transition-colors" />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
      </div>

      <Link href="/scan" className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-3 glow-purple block">
        <div className="text-2xl">📸</div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{t("scanWithAi")}</p>
          <p className="text-text-muted text-xs">{t("scanDesc")}</p>
        </div>
        <span className="pro-badge px-2 py-0.5 rounded-full text-[10px] font-bold text-black">{tc("pro")}</span>
      </Link>

      <div className="flex flex-col gap-2">
        {filteredStrains.map((strain) => (
          <button key={strain.id} onClick={() => { setSelectedStrain(strain); setStep("rate"); }}
            className="glass-card rounded-2xl p-3 flex items-center gap-3 text-left hover:bg-bg-card-hover transition-all">
            <span className="text-2xl w-10 h-10 flex items-center justify-center bg-bg-primary rounded-xl">{strain.image}</span>
            <div className="flex-1">
              <p className="font-semibold text-sm">{strain.name}</p>
              <div className="flex items-center gap-2">
                <span className={`strain-${strain.type} px-2 py-0.5 rounded-full text-[10px] font-bold uppercase text-white`}>{strain.type}</span>
                <span className="text-text-muted text-xs">THC {strain.thc}%</span>
              </div>
            </div>
            <span className="text-accent-green text-sm font-bold">{strain.rating} ★</span>
          </button>
        ))}
      </div>
    </div>
  );
}
