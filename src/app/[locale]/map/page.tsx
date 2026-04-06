"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { shops, Shop } from "@/data/shops";

const ShopMap = dynamic(() => import("@/components/ShopMap"), { ssr: false });

export default function MapPage() {
  const t = useTranslations();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [search, setSearch] = useState("");

  const filteredShops = shops.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto pb-24 flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
      {/* Search bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search shops, districts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-card border border-border rounded-2xl px-4 py-2.5 pl-10 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green/50 transition-colors"
          />
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">📍</span>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 mx-4 rounded-2xl overflow-hidden border border-border relative">
        <ShopMap
          shops={filteredShops}
          selectedShop={selectedShop}
          onSelectShop={setSelectedShop}
        />
      </div>

      {/* Shop detail card (slides up when selected) */}
      {selectedShop && (
        <div className="px-4 pt-3">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-[15px]">{selectedShop.name}</h3>
                <p className="text-text-muted text-xs">{selectedShop.district}</p>
              </div>
              <div className="flex items-center gap-1 bg-accent-green/10 border border-accent-green/20 px-2 py-1 rounded-lg">
                <span className="text-accent-green font-black text-sm">{selectedShop.rating}</span>
                <span className="text-accent-green text-[10px]">★</span>
              </div>
            </div>

            <p className="text-text-secondary text-xs mb-2">{selectedShop.vibe}</p>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-text-muted text-xs">🕐 {selectedShop.hours}</span>
              <span className="text-text-muted text-xs">•</span>
              <span className="text-text-muted text-xs">{selectedShop.reviewCount} {t("strains.reviews")}</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {selectedShop.topStrains.map((strain) => (
                <span key={strain} className="text-[10px] px-2 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
                  {strain}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${selectedShop.lat},${selectedShop.lng}`,
                    "_blank"
                  );
                }}
                className="flex-1 py-2 rounded-xl bg-accent-green text-black font-bold text-sm hover:brightness-110 transition-all text-center"
              >
                📍 Directions
              </button>
              <button
                onClick={() => setSelectedShop(null)}
                className="py-2 px-4 rounded-xl bg-bg-card border border-border text-text-muted text-sm hover:bg-bg-card-hover transition-all"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shop count */}
      <div className="px-4 pt-2">
        <p className="text-text-muted text-xs text-center">
          {filteredShops.length} shops in Bangkok
        </p>
      </div>
    </div>
  );
}
