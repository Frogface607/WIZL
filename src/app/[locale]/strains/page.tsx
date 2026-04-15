"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { fetchStrains } from "@/lib/strains-db";
import { strains as staticStrains } from "@/data/strains";
import StrainCard from "@/components/StrainCard";
import AskWizl from "@/components/AskWizl";
import { Strain, StrainType } from "@/types";
import { BookOpen } from "lucide-react";

type FilterType = "all" | StrainType;

const sortKeys = ["rating", "reviews", "thc", "name"] as const;
type SortValue = (typeof sortKeys)[number];

export default function StrainsPage() {
  const t = useTranslations("strains");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortValue>("rating");
  const [search, setSearch] = useState("");
  const [strains, setStrains] = useState<Strain[]>(staticStrains);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchStrains().then((data) => {
      if (!cancelled) {
        setStrains(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const filters: { label: string; value: FilterType; className: string }[] = [
    { label: t("all"), value: "all", className: "strain-hybrid" },
    { label: t("sativa"), value: "sativa", className: "strain-sativa" },
    { label: t("indica"), value: "indica", className: "strain-indica" },
    { label: t("hybrid"), value: "hybrid", className: "strain-hybrid" },
  ];

  const sortOptions: { label: string; value: SortValue }[] = [
    { label: t("topRated"), value: "rating" },
    { label: t("mostReviews"), value: "reviews" },
    { label: t("highestThc"), value: "thc" },
    { label: t("nameAz"), value: "name" },
  ];

  const filtered = strains
    .filter((s) => filter === "all" || s.type === filter)
    .filter(
      (s) =>
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.flavors.some((f) => f.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sort) {
        case "rating": return b.rating - a.rating;
        case "reviews": return b.reviewCount - a.reviewCount;
        case "thc": return b.thc - a.thc;
        case "name": return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      {/* AI Chat */}
      <div className="mt-4">
        <AskWizl />
      </div>

      <div className="flex items-end justify-between mt-2 mb-4">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-accent-green" />
          {t("title")}
        </h1>
        <span className="text-text-muted text-sm font-medium">
          {loading ? "..." : `${strains.length} strains`}
        </span>
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-bg-card border border-border rounded-2xl px-4 py-3 pl-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green/50 transition-colors"
        />
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.value
                ? `${f.className} text-white`
                : "bg-bg-card text-text-secondary border border-border hover:bg-bg-card-hover"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
        {sortOptions.map((s) => (
          <button
            key={s.value}
            onClick={() => setSort(s.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              sort === s.value
                ? "bg-accent-purple/20 text-accent-purple border border-accent-purple/30"
                : "bg-bg-card text-text-muted border border-border hover:text-text-secondary"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="text-text-muted text-xs mb-3">
        {t("found", { count: filtered.length })}
      </p>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-bg-primary" />
                <div className="flex-1">
                  <div className="h-4 bg-bg-primary rounded w-32 mb-2" />
                  <div className="h-3 bg-bg-primary rounded w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((strain) => (
            <StrainCard key={strain.id} strain={strain} />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg font-medium mb-1">{t("nothingFound")}</p>
          <p className="text-text-muted text-sm">{t("tryDifferent")}</p>
        </div>
      )}
    </div>
  );
}
