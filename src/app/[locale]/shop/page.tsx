"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { getShopData, createShop, isShopOwner } from "@/lib/shop-store";

const districts = [
  "Sukhumvit", "Silom", "Sathorn", "Thonglor", "Ari",
  "Nana", "Siam", "Old Town", "Chatuchak", "Khao San",
  "Ratchada", "Ekkamai", "Phra Khanong", "On Nut", "Other",
];

export default function ShopRegisterPage() {
  const t = useTranslations();
  const router = useRouter();
  const [hasShop, setHasShop] = useState(false);
  const [step, setStep] = useState<"intro" | "form">("intro");
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");

  useEffect(() => {
    setHasShop(isShopOwner());
  }, []);

  if (hasShop) {
    router.replace("/shop/dashboard");
    return null;
  }

  const handleCreate = () => {
    if (!name.trim() || !district) return;
    createShop(name.trim(), district);
    router.push("/shop/dashboard");
  };

  if (step === "intro") {
    return (
      <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3 animate-float">🏪</div>
          <h1 className="text-2xl font-black gradient-text mb-1">Add Your Shop</h1>
          <p className="text-sm gradient-love font-medium mb-3">{t("brand.tagline")}</p>
          <p className="text-text-secondary text-sm max-w-xs mx-auto">
            Get your shop on the WIZL map. Customers find you, see your menu, and check in.
          </p>
        </div>

        {/* Benefits */}
        <div className="flex flex-col gap-3 mb-8">
          {[
            { icon: "📍", title: "Be on the map", desc: "Tourists and locals find you instantly" },
            { icon: "📋", title: "Your menu, live", desc: "Show your strains, prices, and what's in stock" },
            { icon: "⭐", title: "Get reviews", desc: "Build reputation through community check-ins" },
            { icon: "📸", title: "AI Scanner", desc: "Customers scan your products — free marketing" },
            { icon: "📊", title: "Insights", desc: "See which strains are trending at your shop" },
          ].map((item) => (
            <div key={item.title} className="glass-card rounded-2xl p-4 flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-text-muted text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="glass-card rounded-2xl p-6 mb-6 text-center border border-accent-green/20 glow-green">
          <p className="text-text-muted text-xs mb-2">All included in</p>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="pro-badge px-3 py-1 rounded-full text-xs font-bold text-black">WIZL PRO</span>
          </div>
          <div className="text-3xl font-black price-420 mb-1">$4.20</div>
          <p className="text-text-muted text-xs">/month — same as everyone</p>
        </div>

        <button
          onClick={() => setStep("form")}
          className="w-full py-4 rounded-2xl bg-accent-green text-black font-bold text-lg hover:brightness-110 transition-all glow-green mb-3"
        >
          🏪 Register Your Shop
        </button>
        <p className="text-text-muted text-xs text-center">
          Free to register. PRO unlocks full features.
        </p>
      </div>
    );
  }

  // Registration form
  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
      <button onClick={() => setStep("intro")} className="text-text-muted text-sm mb-4 hover:text-text-secondary transition-colors">
        ← Back
      </button>

      <h1 className="text-2xl font-black mb-1">🏪 Register Your Shop</h1>
      <p className="text-text-secondary text-sm mb-6">
        Tell us about your place. You can add menu and details later.
      </p>

      {/* Name */}
      <div className="mb-5">
        <label className="text-sm font-medium mb-2 block">Shop Name *</label>
        <input
          type="text"
          placeholder="e.g. Green House BKK"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-bg-card border border-border rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-green/50 transition-colors"
        />
      </div>

      {/* District */}
      <div className="mb-6">
        <label className="text-sm font-medium mb-2 block">District *</label>
        <div className="grid grid-cols-3 gap-2">
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setDistrict(d)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                district === d
                  ? "bg-accent-green text-black"
                  : "bg-bg-card border border-border text-text-secondary hover:bg-bg-card-hover"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleCreate}
        disabled={!name.trim() || !district}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
          name.trim() && district
            ? "bg-accent-green text-black hover:brightness-110 glow-green"
            : "bg-bg-card text-text-muted border border-border"
        }`}
      >
        Create Shop
      </button>
      <p className="text-text-muted text-xs text-center mt-2">
        You can edit everything later from the dashboard.
      </p>
    </div>
  );
}
