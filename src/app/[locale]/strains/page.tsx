"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { strains } from "@/data/strains";
import StrainCard from "@/components/StrainCard";
import { StrainType } from "@/types";

type FilterType = "all" | StrainType;

const sortKeys = ["rating", "reviews", "thc", "name"] as const;
type SortValue = (typeof sortKeys)[number];

export default function StrainsPage() {
  const t = useTranslations("strains");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortValue>("rating");
  const [search, setSearch] = useState("");

  const filters: { label: string; value: FilterType; icon: string }[] = [
    { label: t("all"), value: "all", icon: "🌿" },
    { label: t("sativa"), value: "sativa", icon: "☀️" },
    { label: t("indica"), value: "indica", icon: "🌙" },
    { label: t("hybrid"), value: "hybrid", icon: "⚡" },
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
      <h1 className="text-2xl font-black mt-6 mb-4">🌿 {t("title")}</h1>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-bg-card border border-border rounded-2xl px-4 py-3 pl-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green/50 transition-colors"
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.value
                ? "bg-accent-green text-black"
                : "bg-bg-card text-text-secondary border border-border hover:bg-bg-card-hover"
            }`}
          >
            <span>{f.icon}</span>
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

      <div className="flex flex-col gap-3">
        {filtered.map((strain) => (
          <StrainCard key={strain.id} strain={strain} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🤷</div>
          <p className="text-text-secondary">{t("nothingFound")}</p>
          <p className="text-text-muted text-sm">{t("tryDifferent")}</p>
        </div>
      )}
    </div>
  );
}
