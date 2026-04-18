"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useRouter } from "@/i18n/navigation";
import { shops, Shop, RegionFilter, filterByRegion } from "@/data/shops";
import { Search, MapPin, Star, Clock, Navigation, X, Sparkles } from "lucide-react";

const ShopMap = dynamic(() => import("@/components/ShopMap"), { ssr: false });

const REGION_TABS: { key: RegionFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "nearby", label: "Nearby" },
  { key: "thailand", label: "Thailand" },
  { key: "netherlands", label: "Netherlands" },
  { key: "usa", label: "USA" },
  { key: "canada", label: "Canada" },
];

export default function MapPage() {
  const t = useTranslations();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<RegionFilter>("all");

  const filteredShops = useMemo(() => {
    let result = filterByRegion(shops, region);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q),
      );
    }
    return result;
  }, [region, search]);

  const router = useRouter();
  const handleCheckIn = (shop: Shop) => {
    // Navigate to checkin flow with shop preselected
    router.push(`/checkin?shop=${shop.id}`);
  };

  return (
    <div
      className="max-w-lg mx-auto pb-24 flex flex-col"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* Search bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search shops, cities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-card border border-border rounded-2xl px-4 py-2.5 pl-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green/50 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Region filter tabs */}
      <div className="px-4 pb-2">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          {REGION_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setRegion(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                region === tab.key
                  ? "bg-accent-green text-black"
                  : "bg-bg-card border border-border text-text-muted hover:text-text-primary hover:border-accent-green/30"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shop count */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className="text-accent-green" />
          <p className="text-text-muted text-xs">
            <span className="text-text-primary font-bold">{filteredShops.length}</span>{" "}
            {filteredShops.length === shops.length
              ? "shops worldwide"
              : `shops found`}
            {search && (
              <span className="text-text-muted">
                {" "}for &ldquo;{search}&rdquo;
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 mx-4 rounded-2xl overflow-hidden border border-border relative">
        <ShopMap
          shops={filteredShops}
          selectedShop={selectedShop}
          onSelectShop={setSelectedShop}
          onCheckIn={handleCheckIn}
        />
      </div>

      {/* Shop detail card (slides up when selected) */}
      {selectedShop && (
        <div className="px-4 pt-3 animate-in slide-in-from-bottom-4 duration-200">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-[15px] truncate">
                    {selectedShop.name}
                  </h3>
                  {selectedShop.isPremium && (
                    <Sparkles size={14} className="text-yellow-400 shrink-0" />
                  )}
                </div>
                <p className="text-text-muted text-xs">
                  {selectedShop.city}, {selectedShop.country}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-accent-green/10 border border-accent-green/20 px-2 py-1 rounded-lg ml-2 shrink-0">
                <span className="text-accent-green font-black text-sm">
                  {selectedShop.rating}
                </span>
                <Star size={10} className="text-accent-green fill-accent-green" />
              </div>
            </div>

            <p className="text-text-secondary text-xs mb-1.5">
              {selectedShop.address}
            </p>

            <div className="flex items-center gap-2 mb-3">
              {selectedShop.hours && (
                <span className="text-text-muted text-xs flex items-center gap-1">
                  <Clock size={10} />
                  {selectedShop.hours}
                </span>
              )}
              <span className="text-text-muted text-xs">
                {selectedShop.reviewCount} reviews
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-accent-purple/10 text-accent-purple border border-accent-purple/20 capitalize">
                {selectedShop.type === "coffeeshop" ? "coffee shop" : selectedShop.type}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleCheckIn(selectedShop)}
                className="flex-1 py-2 rounded-xl bg-accent-green text-black font-bold text-sm hover:brightness-110 transition-all text-center flex items-center justify-center gap-1.5"
              >
                <MapPin size={14} />
                Check in here
              </button>
              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${selectedShop.lat},${selectedShop.lng}`,
                    "_blank",
                  );
                }}
                className="py-2 px-3 rounded-xl bg-bg-card border border-border text-text-muted text-sm hover:bg-bg-card-hover transition-all flex items-center gap-1"
              >
                <Navigation size={14} />
              </button>
              <button
                onClick={() => setSelectedShop(null)}
                className="py-2 px-3 rounded-xl bg-bg-card border border-border text-text-muted text-sm hover:bg-bg-card-hover transition-all"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium upsell banner */}
      {!selectedShop && (
        <div className="px-4 pt-2">
          <div className="glass-card rounded-2xl p-3 flex items-center gap-3 border border-yellow-500/20">
            <div className="w-9 h-9 rounded-xl bg-yellow-500/10 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text-primary">
                Own a shop? Get featured
              </p>
              <p className="text-[10px] text-text-muted">
                Gold marker + top placement — $4.20/year
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold hover:bg-yellow-500/20 transition-all shrink-0">
              Learn more
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
