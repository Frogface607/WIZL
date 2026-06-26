"use client";

import { useState } from "react";
import { getUserData, toggleFavorite, toggleWishlist } from "@/lib/store";
import { Heart, BookmarkPlus, Check } from "lucide-react";

export default function StrainActions({ strainId }: { strainId: string }) {
  const [isFav, setIsFav] = useState(() => {
    const d = getUserData();
    return d.favorites.includes(strainId);
  });
  const [isWish, setIsWish] = useState(() => {
    const d = getUserData();
    return d.wishlist.includes(strainId);
  });

  const handleFav = () => {
    const d = toggleFavorite(strainId);
    setIsFav(d.favorites.includes(strainId));
  };

  const handleWish = () => {
    const d = toggleWishlist(strainId);
    setIsWish(d.wishlist.includes(strainId));
  };

  return (
    <div className="flex gap-2 mb-5">
      <button
        onClick={handleFav}
        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${
          isFav
            ? "bg-accent-love/20 text-accent-love border border-accent-love/30"
            : "glass-card border border-border hover:bg-bg-card-hover text-text-secondary"
        }`}
      >
        <Heart className={`w-4 h-4 ${isFav ? "fill-accent-love" : ""}`} />
        {isFav ? "Favorite" : "Favorite"}
      </button>
      <button
        onClick={handleWish}
        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all ${
          isWish
            ? "bg-accent-purple/20 text-accent-purple border border-accent-purple/30"
            : "glass-card border border-border hover:bg-bg-card-hover text-text-secondary"
        }`}
      >
        {isWish ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
        {isWish ? "On my list" : "Want to try"}
      </button>
    </div>
  );
}
