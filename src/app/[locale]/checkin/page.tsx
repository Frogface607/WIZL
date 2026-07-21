"use client";

import { Suspense, useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { moods } from "@/data/strains";
import { fetchStrains, fetchStrainById } from "@/lib/strains-db";
import { Strain } from "@/types";
import { addCheckin, Achievement } from "@/lib/store";
import { getRandomWisdom, type WisdomLocale } from "@/lib/wizl-wisdoms";
import { Award, Copy, Leaf, MessageCircle, NotebookPen, Search, Share2, User, Wand2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/** Build a temporary Strain object from a scan result stashed in sessionStorage */
function scanPendingToStrain(): Strain | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem("wizl-scan-pending");
  if (!raw) return null;
  try {
    const p = JSON.parse(raw);
    const parsePct = (s: string | undefined): number => {
      if (!s) return 0;
      const nums = s.match(/[\d.]+/g)?.map(Number) ?? [];
      if (nums.length === 0) return 0;
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    };
    return {
      id: p.id,
      name: p.name,
      type: p.type,
      thc: Math.round(parsePct(p.thc_range) * 10) / 10,
      cbd: Math.round(parsePct(p.cbd_range) * 10) / 10,
      description: p.description || "",
      effects: p.effects || [],
      flavors: p.flavors || [],
      rating: 0,
      reviewCount: 0,
      image: (p.name || "?").charAt(0).toUpperCase(),
      color: "#8C6FB8",
      genetics: "",
      breeder: "",
      floweringTime: "",
      difficulty: "moderate",
      bestFor: [],
      terpenes: [],
      origin: "",
      aka: [],
      funFact: "",
    } as Strain;
  } catch {
    return null;
  }
}

export default function CheckinPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto px-4 py-20 text-center text-text-muted">
          <NotebookPen className="w-8 h-8 text-accent-green mx-auto mb-3" />
          <p className="text-sm">Opening field note...</p>
        </div>
      }
    >
      <CheckinFlow />
    </Suspense>
  );
}

function CheckinFlow() {
  const t = useTranslations("checkin");
  const locale = useLocale() as WisdomLocale;
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("strain");
  const fromScan = searchParams.get("scan") === "1";
  const [allStrains, setAllStrains] = useState<Strain[]>([]);
  // Lazy-read the scan result once (browser only)
  const [scanStrain] = useState<Strain | null>(() => (fromScan ? scanPendingToStrain() : null));
  // If we have a preselected strain from URL, go straight to "rate" step
  const [step, setStep] = useState<"select" | "rate" | "done">(
    preselectedId || scanStrain ? "rate" : "select"
  );
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(scanStrain);
  const [loadingStrain, setLoadingStrain] = useState(!!preselectedId);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [search, setSearch] = useState("");
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

  useEffect(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [step]);

  const filteredStrains = allStrains.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const showPopular = search.trim().length === 0;
  const displayStrains = showPopular
    ? allStrains.slice(0, 12)
    : filteredStrains.slice(0, 30);

  const handleSubmit = () => {
    if (!selectedStrain || rating === 0) return;
    const result = addCheckin(selectedStrain, rating, selectedMood, review);
    trackEvent("checkin_saved", {
      strain_id: selectedStrain.id,
      strain_type: selectedStrain.type,
      rating,
      mood_selected: Boolean(selectedMood),
      note_length: review.length,
      source: fromScan ? "scan_result" : preselectedId ? "strain_detail" : "checkin_search",
    });
    setNewAchievements(result.newAchievements);
    setStep("done");
    // Clear scan-pending so next checkin flow starts fresh
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("wizl-scan-pending");
    }
  };

  const getShareText = () => {
    const strainName = selectedStrain?.name || "a strain";
    const stars = rating > 0 ? `${rating}/5` : "saved";
    return "I logged " + strainName + " in my WIZL field notes: " + stars + ". Read the label. Remember the experience.";
  };

  const handleShare = async (channel: "native" | "copy" | "message") => {
    if (typeof window === "undefined") return;

    const text = getShareText();
    const url = window.location.origin;
    const shareData = {
      title: "WIZL check-in",
      text,
      url,
    };

    trackEvent("checkin_share_clicked", {
      channel,
      strain_id: selectedStrain?.id,
      rating,
    });

    if (channel === "native" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fall back to copy below when sharing is cancelled or unavailable.
      }
    }

    if (channel === "message") {
      window.open(`sms:?&body=${encodeURIComponent(`${text} ${url}`)}`, "_self");
      return;
    }

    await navigator.clipboard?.writeText(`${text} ${url}`);
  };

  if (step === "done") {
    const successWisdom = getRandomWisdom("success", { locale });
    return (
      <div className="max-w-lg mx-auto px-4 pb-24 pt-8">
        <div className="text-center py-12">
          <div className="relative w-32 h-32 mx-auto mb-5 animate-float">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/wizl-book.webp"
              alt="WIZL"
              className="w-full h-full object-contain"
            />
            <span
              className="absolute -top-2 right-3 w-1.5 h-1.5 rounded-full bg-accent-green animate-firefly"
              style={{ animationDelay: "0.3s" }}
            />
            <span
              className="absolute bottom-2 -left-2 w-1 h-1 rounded-full bg-accent-green animate-firefly"
              style={{ animationDelay: "1.1s" }}
            />
          </div>
          <h2 className="text-2xl font-black gradient-text mb-1">{t("logged")}</h2>
          <p className="text-sm gradient-love font-medium mb-3">with love</p>
          <p className="text-text-secondary mb-2">
            {t("checkinRecorded")}{" "}
            <span className="text-text-primary font-semibold">{selectedStrain?.name}</span>
          </p>
          <div className="flex justify-center gap-1 mb-3">
            {Array.from({ length: rating }).map((_, i) => (
              <Leaf key={i} className="h-5 w-5 text-accent-green" aria-hidden="true" />
            ))}
          </div>
          <p className="text-text-muted italic text-xs mb-6">— {successWisdom}</p>

          {/* New achievements */}
          {newAchievements.length > 0 && (
            <div className="flex flex-col gap-3 mb-6">
              {newAchievements.map((ach) => (
                <div key={ach.id} className="glass-card rounded-2xl p-5 glow-green">
                  <p className="text-accent-green font-bold text-sm mb-2 inline-flex items-center gap-2">
                    <Award className="h-4 w-4" aria-hidden="true" />
                    {t("badgeUnlocked")}
                  </p>
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
              {[
                { icon: Share2, label: "Share", channel: "native" as const },
                { icon: Copy, label: "Copy", channel: "copy" as const },
                { icon: MessageCircle, label: "Message", channel: "message" as const },
              ].map((b) => (
                <button
                  key={b.label}
                  onClick={() => void handleShare(b.channel)}
                  className="flex-1 py-3 rounded-xl bg-bg-primary border border-border text-xs hover:bg-bg-card-hover transition-colors flex flex-col items-center gap-1"
                >
                  <b.icon className="h-5 w-5 text-accent-green" aria-hidden="true" />
                  <span className="text-text-muted">{b.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/scan"
              className="flex-1 px-4 py-3 rounded-2xl bg-accent-green text-black text-sm font-bold hover:brightness-110 transition-all text-center inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {t("scanAnother")} <Search className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/profile" className="flex-1 px-4 py-3 rounded-2xl bg-bg-card border border-border text-text-secondary text-sm font-medium text-center hover:bg-bg-card-hover transition-all">
              <span className="inline-flex items-center justify-center gap-2">
                <User className="h-4 w-4" aria-hidden="true" />
                Profile
              </span>
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
        <div className="w-20 h-20 mx-auto mb-4 animate-float">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/wizl-book.webp"
            alt="WIZL"
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-text-muted text-sm italic">Wizl is finding the scroll…</p>
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
          <h3 className="font-bold mb-3 inline-flex items-center gap-2">
            {t("rateIt")}
            <Leaf className="h-5 w-5 text-accent-green" aria-hidden="true" />
          </h3>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} out of 5`}
                className={`h-12 w-12 rounded-full flex items-center justify-center transition-all hover:scale-110 ${
                  star <= rating
                    ? "bg-accent-green/15 text-accent-green scale-105"
                    : "bg-bg-card text-text-muted/60 border border-border"
                }`}
              >
                <Leaf className="h-7 w-7" aria-hidden="true" />
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
          <h3 className="font-bold mb-3 inline-flex items-center gap-2">
            {t("dropNote")}
            <MessageCircle className="h-5 w-5 text-accent-orange" aria-hidden="true" />
          </h3>
          <textarea placeholder={t("notePlaceholder")} value={review} onChange={(e) => setReview(e.target.value)} rows={3}
            className="w-full bg-bg-card border border-border rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green/50 transition-colors resize-none" />
        </div>

        <button onClick={handleSubmit} disabled={rating === 0}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all inline-flex items-center justify-center gap-2 ${
            rating > 0 ? "bg-accent-green text-black hover:brightness-110 glow-green" : "bg-bg-card text-text-muted border border-border"
          }`}>
          {rating > 0 ? (
            <>
              {t("checkIn")} <NotebookPen className="h-5 w-5" aria-hidden="true" />
            </>
          ) : (
            t("rateFirst")
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
      <h1 className="text-2xl font-black mb-1 flex items-center gap-2">
        <NotebookPen className="w-6 h-6 text-accent-green" aria-hidden="true" />
        {t("title")}
      </h1>
      <p className="text-text-secondary text-sm mb-6">{t("subtitle")}</p>

      <Link
        href="/scan"
        onClick={() => trackEvent("checkin_scan_cta_clicked", { destination: "scan" })}
        className="glass-card rounded-2xl p-4 mb-4 flex items-center gap-3 border border-accent-green/20 hover:bg-bg-card-hover transition-all"
      >
        <span className="w-10 h-10 rounded-xl bg-accent-green text-black flex items-center justify-center font-black">
          <Wand2 className="w-5 h-5" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="font-bold text-sm">{t("scanWithAi")}</p>
          <p className="text-text-muted text-xs">{t("scanDesc")}</p>
        </div>
        <span className="text-accent-green text-sm font-bold">Go</span>
      </Link>

      <div className="relative mb-4">
        <input type="text" placeholder={t("searchStrains")} value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-bg-card border border-border rounded-2xl px-4 py-3 pl-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green/50 transition-colors" />
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
      </div>

      <p className="text-text-muted text-xs mb-3">
        {showPopular ? "Popular starting points" : `${filteredStrains.length} matches - showing the closest 30`}
      </p>

      <div className="flex flex-col gap-2">
        {displayStrains.map((strain) => (
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
            <span className="text-accent-neon text-xs font-bold">
              {strain.rating > 0 ? `${strain.rating} ★` : "New"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
