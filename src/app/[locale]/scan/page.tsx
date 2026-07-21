"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { getUserData, incrementScans, getScansRemaining } from "@/lib/store";
import { fetchStrains } from "@/lib/strains-db";
import { Strain } from "@/types";
import { ArrowLeft, Search, Camera, Zap, Droplets, Link2, ScanLine, ShieldCheck } from "lucide-react";
import { getRandomWisdom, type WisdomLocale } from "@/lib/wizl-wisdoms";
import { trackEvent } from "@/lib/analytics";

interface ScanResult {
  name: string;
  confidence: "high" | "medium" | "low";
  type: "sativa" | "indica" | "hybrid" | "unknown";
  thc_range: string;
  cbd_range: string;
  effects: string[];
  flavors: string[];
  description: string;
  best_for: string;
  similar_strains: string[];
  _demo?: boolean;
  _provider?: "openai" | "openrouter";
}

const confidenceColors = {
  high: "text-accent-green",
  medium: "text-accent-orange",
  low: "text-text-muted",
};

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1600;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("This image format could not be read."));
    image.src = url;
  });
}

async function prepareScanImage(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large. Choose one under 15 MB.");
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Your browser could not prepare this image.");
    }

    canvas.width = width;
    canvas.height = height;
    context.fillStyle = "#10181f";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
export default function ScanPage() {
  const t = useTranslations("scan");
  const locale = useLocale() as WisdomLocale;
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"idle" | "loading" | "result">("idle");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [description, setDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scansLeft, setScansLeft] = useState(5);
  const [strains, setStrains] = useState<Strain[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      const userData = getUserData();
      setScansLeft(getScansRemaining(userData));
    });
    fetchStrains().then(setStrains);
  }, []);

  const handleScan = async (image?: string, text?: string, source: "photo" | "description" | "name_search_api" | "similar_strain" = image ? "photo" : "description") => {
    if (getScansRemaining(getUserData()) <= 0) {
      trackEvent("scan_limit_reached", { source });
      setError(t("dailyLimit"));
      return;
    }

    trackEvent("scan_started", {
      source,
      locale,
      has_image: Boolean(image),
      text_length: text?.length ?? 0,
    });
    setMode("loading");
    setError(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: image || undefined,
          description: text || undefined,
          locale,
        }),
      });

      const data = await res.json();

      if (data.error) {
        trackEvent("scan_failed", { source, reason: "api_error" });
        setError(data.error);
        setMode("idle");
        return;
      }

      trackEvent("scan_completed", {
        source,
        confidence: data.confidence,
        result_type: data.type,
        demo: Boolean(data._demo),
        provider: data._provider || "fallback",
      });
      if (!data._demo) incrementScans();
      setResult(data);
      setMode("result");
      setScansLeft(getScansRemaining(getUserData()));
    } catch {
      trackEvent("scan_failed", { source, reason: "connection_error" });
      setError("Connection error. Please try again.");
      setMode("idle");
    }
  };

  const handleNameSearch = () => {
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim().toLowerCase();
    trackEvent("strain_search_submitted", {
      surface: "scan",
      query_length: query.length,
    });
    const found = strains.find(
      (s) => s.name.toLowerCase() === query || s.id === query.replace(/\s+/g, "-")
    );

    if (found) {
      trackEvent("scan_completed", {
        source: "name_search_local",
        confidence: "high",
        result_type: found.type,
        demo: false,
      });
      // Found locally -- show as result directly
      setResult({
        name: found.name,
        confidence: "high",
        type: found.type,
        thc_range: `${found.thc}%`,
        cbd_range: `${found.cbd}%`,
        effects: found.effects,
        flavors: found.flavors,
        description: found.description,
        best_for: found.effects.slice(0, 2).join(", "),
        similar_strains: [],
      });
      setMode("result");
    } else {
      // Not found locally -- call API
      handleScan(undefined, searchQuery.trim(), "name_search_api");
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    try {
      const preparedImage = await prepareScanImage(file);
      setPreview(preparedImage);
      trackEvent("scan_photo_selected", {
        file_type: file.type || "unknown",
        file_size_kb: Math.round(file.size / 1024),
      });
      await handleScan(preparedImage, undefined, "photo");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "This image could not be read.");
    } finally {
      event.target.value = "";
    }
  };

  const handleTextScan = () => {
    if (!description.trim()) return;
    handleScan(undefined, description.trim(), "description");
  };

  const reset = () => {
    setMode("idle");
    setResult(null);
    setPreview(null);
    setDescription("");
    setSearchQuery("");
    setError(null);
  };

  const handleSaveCheckin = () => {
    if (!result) return;

    const matched = strains.find(
      (s) => s.name.toLowerCase() === result.name.toLowerCase()
    );
    trackEvent("scan_save_checkin_clicked", {
      matched: Boolean(matched),
      confidence: result.confidence,
      result_type: result.type,
      demo: Boolean(result._demo),
    });

    if (matched) {
      router.push(`/checkin?strain=${matched.id}`);
      return;
    }

    sessionStorage.setItem(
      "wizl-scan-pending",
      JSON.stringify({
        id: `scan-${Date.now()}`,
        name: result.name,
        type: result.type,
        thc_range: result.thc_range,
        cbd_range: result.cbd_range,
        effects: result.effects,
        flavors: result.flavors,
        description: result.description,
      }),
    );
    router.push("/checkin?scan=1");
  };

  // Loading state
  if (mode === "loading") {
    return (
      <div className="max-w-lg mx-auto px-4 pb-24 pt-8">
        <div className="text-center py-20">
          <div className="relative w-24 h-24 mx-auto mb-6 animate-float">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/wizl-book.webp"
              alt="WIZL"
              className="w-full h-full object-contain"
            />
            <span
              className="absolute -top-1 right-2 w-1.5 h-1.5 rounded-full bg-accent-green animate-firefly"
              style={{ animationDelay: "0.3s" }}
            />
            <span
              className="absolute bottom-2 -left-1 w-1 h-1 rounded-full bg-accent-green animate-firefly"
              style={{ animationDelay: "1.1s" }}
            />
          </div>
          <h2 className="text-xl font-black gradient-text mb-2">
            {t("analyzing")}
          </h2>
          <p className="text-text-muted text-sm italic max-w-[260px] mx-auto">
            {getRandomWisdom("scanning", { locale })}
          </p>
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-accent-green animate-pulse-soft"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          {preview && (
            <div className="mt-6 mx-auto w-32 h-32 rounded-2xl overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Scanning" className="w-full h-full object-cover opacity-60" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Result state
  if (mode === "result" && result) {
    return (
      <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
        <button
          onClick={reset}
          className="text-text-muted text-sm mb-4 hover:text-text-secondary transition-colors"
        >
          <ArrowLeft className="inline-block w-4 h-4 mr-1" />
          {t("scanAgain")}
        </button>

        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <ScanLine className="w-5 h-5 text-accent-green" />
          {t("scanResult")}
        </h2>

        {/* Main Result Card */}
        <div className="glass-card rounded-3xl p-6 mb-4 glow-green border border-accent-green/20">
          {preview && (
            <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt={result.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h1 className="text-2xl font-black">{result.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={result.type === "unknown" ? "px-3 py-0.5 rounded-full text-xs font-bold uppercase text-text-muted border border-border" : "strain-" + result.type + " px-3 py-0.5 rounded-full text-xs font-bold uppercase text-white"}>
                  {result.type}
                </span>
                {result.type !== "unknown" && result.thc_range !== "Unknown" && (
                  <span className="text-text-muted text-sm">
                    {t("referenceThc")} {result.thc_range}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className={`text-xs font-medium ${confidenceColors[result.confidence]}`}>
                {t("confidence")}
              </span>
              <p className={`text-sm font-bold ${confidenceColors[result.confidence]}`}>
                {t(
                  result.confidence === "high"
                    ? "confidenceHigh"
                    : result.confidence === "medium"
                      ? "confidenceMedium"
                      : "confidenceLow",
                )}
              </p>
            </div>
          </div>

          <p className="text-text-secondary text-sm leading-relaxed mb-3">
            {result.description}
          </p>

          <div className="bg-accent-green/5 border border-accent-green/15 rounded-xl p-3 mb-3 flex gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-green shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-text-muted">
              {result.type === "unknown"
                ? t("notEnoughEvidence")
                : t("referenceDisclaimer")}
            </p>
          </div>

          <div className="bg-bg-primary/50 rounded-xl p-3">
            <p className="text-xs text-text-muted mb-1">{t("whatToVerify")}</p>
            <p className="text-sm text-text-primary">{result.best_for}</p>
          </div>

          {result._demo && (
            <div className="mt-3 bg-accent-orange/10 rounded-xl p-3 border border-accent-orange/20">
              <p className="text-accent-orange text-xs font-medium">
                {t("readerUnavailable")}
              </p>
            </div>
          )}
        </div>

        {result.effects.length > 0 && (
          <div className="glass-card rounded-2xl p-5 mb-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-green" /> {t("effects")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.effects.map((effect) => (
                <span key={effect} className="px-3 py-1.5 rounded-full bg-accent-green/10 text-accent-green text-sm font-medium border border-accent-green/20">
                  {effect}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.flavors.length > 0 && (
          <div className="glass-card rounded-2xl p-5 mb-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-accent-purple" /> {t("flavors")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.flavors.map((flavor) => (
                <span key={flavor} className="px-3 py-1.5 rounded-full bg-accent-purple/10 text-accent-purple text-sm font-medium border border-accent-purple/20">
                  {flavor}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Similar Strains */}
        {result.similar_strains.length > 0 && (
          <div className="glass-card rounded-2xl p-5 mb-6">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-text-secondary" /> Similar Strains
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.similar_strains.map((strain) => {
                const localStrain = strains.find(
                  (s) => s.name.toLowerCase() === strain.toLowerCase() || s.id === strain.toLowerCase().replace(/\s+/g, "-")
                );
                return (
                  <button
                    key={strain}
                    onClick={() => {
                      if (localStrain) {
                        setResult({
                          name: localStrain.name,
                          confidence: "high",
                          type: localStrain.type,
                          thc_range: `${localStrain.thc}%`,
                          cbd_range: `${localStrain.cbd}%`,
                          effects: localStrain.effects,
                          flavors: localStrain.flavors,
                          description: localStrain.description,
                          best_for: localStrain.effects.slice(0, 2).join(", "),
                          similar_strains: [],
                        });
                      } else {
                        setSearchQuery(strain);
                        handleScan(undefined, strain, "similar_strain");
                      }
                    }}
                    className="px-3 py-1.5 rounded-full bg-accent-green/10 text-accent-green text-sm font-medium border border-accent-green/20 hover:bg-accent-green/20 transition-colors cursor-pointer"
                  >
                    {strain}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {result.type !== "unknown" ? (
            <button
              onClick={handleSaveCheckin}
              className="flex-1 py-3 rounded-2xl bg-accent-green text-black font-bold text-center hover:brightness-110 transition-all glow-green"
            >
              {t("saveCheckin")}
            </button>
          ) : (
            <button
              onClick={reset}
              className="flex-1 py-3 rounded-2xl bg-accent-green text-black font-bold text-center hover:brightness-110 transition-all"
            >
              {t("tryClearerLabel")}
            </button>
          )}
          {result.type !== "unknown" && (
            <button
              onClick={reset}
              className="flex-1 py-3 rounded-2xl bg-bg-card border border-border text-text-secondary font-medium hover:bg-bg-card-hover transition-all flex items-center justify-center gap-2"
            >
              {t("scanAgain")} <ScanLine className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Idle state -- scan input
  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
      <div className="text-center mb-6">
        <ScanLine className="w-12 h-12 text-accent-green mx-auto mb-3 animate-float" />
        <h1 className="text-2xl font-black gradient-text mb-1">{t("title")}</h1>
        <p className="text-text-secondary text-sm">{t("subtitle")}</p>
        <p className="text-text-muted text-xs mt-2 max-w-[310px] mx-auto">
          {t("photoCaution")}
        </p>
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-4 mb-6 border border-red-500/20 bg-red-500/5">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Search by strain name -- PRIMARY */}
      <div className="mb-6">
        <label className="text-text-secondary text-sm font-medium mb-2 block">
          {t("searchByName")}
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNameSearch()}
            className="w-full bg-bg-card border border-border rounded-2xl px-4 py-3.5 pl-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green/50 transition-colors"
          />
        </div>
        <button
          onClick={handleNameSearch}
          disabled={!searchQuery.trim()}
          className={`w-full mt-3 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
            searchQuery.trim()
              ? "bg-accent-green text-black hover:brightness-110 glow-green"
              : "bg-bg-card text-text-muted border border-border"
          }`}
        >
          <Search className="w-4 h-4" /> {t("searchButton")}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-text-muted text-xs">{t("orScan")}</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Photo upload area */}
      <div className="mb-6">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileRef.current?.click()}
          className="w-full glass-card rounded-2xl p-6 border-2 border-dashed border-accent-green/30 text-center hover:bg-bg-card-hover hover:border-accent-green/50 transition-all group"
        >
          <Camera className="w-10 h-10 text-accent-green mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-text-primary font-bold mb-1">{t("takePhoto")}</p>
          <p className="text-text-muted text-xs">{t("uploadPhoto")}</p>
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-text-muted text-xs">{t("orDescribe")}</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Text description */}
      <div className="mb-6">
        <textarea
          placeholder={t("describePlaceholder")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-bg-card border border-border rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green/50 transition-colors resize-none"
        />
        <button
          onClick={handleTextScan}
          disabled={!description.trim()}
          className={`w-full mt-3 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
            description.trim()
              ? "bg-accent-green text-black hover:brightness-110 glow-green"
              : "bg-bg-card text-text-muted border border-border"
          }`}
        >
          <ScanLine className="w-4 h-4" /> {t("scanButton")}
        </button>
      </div>

      <div className="border-y border-border py-4 text-center">
        <p className="text-text-secondary text-sm font-medium">
          {scansLeft} AI read{scansLeft !== 1 ? "s" : ""} left today
        </p>
        <p className="text-text-muted text-xs mt-1">The Book and field notes stay free.</p>
      </div>
    </div>
  );
}
