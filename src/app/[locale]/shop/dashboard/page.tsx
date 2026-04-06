"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  getShopData,
  saveShopData,
  addMenuItem,
  removeMenuItem,
  ShopProfile,
  MenuItem,
} from "@/lib/shop-store";

export default function ShopDashboard() {
  const t = useTranslations();
  const router = useRouter();
  const [shop, setShop] = useState<ShopProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [addingItem, setAddingItem] = useState(false);

  // Edit form
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editHours, setEditHours] = useState("");
  const [editVibe, setEditVibe] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editInsta, setEditInsta] = useState("");

  // Add menu item form
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState<"sativa" | "indica" | "hybrid">("hybrid");
  const [itemThc, setItemThc] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  useEffect(() => {
    const data = getShopData();
    if (!data) {
      router.replace("/shop");
      return;
    }
    setShop(data);
    setEditName(data.name);
    setEditDesc(data.description);
    setEditHours(data.hours);
    setEditVibe(data.vibe);
    setEditAddress(data.address);
    setEditPhone(data.phone);
    setEditInsta(data.instagram);
  }, [router]);

  if (!shop) return null;

  const handleSaveProfile = () => {
    shop.name = editName;
    shop.description = editDesc;
    shop.hours = editHours;
    shop.vibe = editVibe;
    shop.address = editAddress;
    shop.phone = editPhone;
    shop.instagram = editInsta;
    saveShopData(shop);
    setShop({ ...shop });
    setEditing(false);
  };

  const handleAddItem = () => {
    if (!itemName.trim()) return;
    const item: MenuItem = {
      strainName: itemName.trim(),
      strainType: itemType,
      thc: parseInt(itemThc) || 0,
      price: itemPrice || undefined,
      inStock: true,
      featured: false,
    };
    const updated = addMenuItem(item);
    if (updated) setShop({ ...updated });
    setItemName("");
    setItemThc("");
    setItemPrice("");
    setAddingItem(false);
  };

  const handleRemoveItem = (index: number) => {
    const updated = removeMenuItem(index);
    if (updated) setShop({ ...updated });
  };

  const handleToggleStock = (index: number) => {
    shop.menu[index].inStock = !shop.menu[index].inStock;
    saveShopData(shop);
    setShop({ ...shop });
  };

  const handleToggleFeatured = (index: number) => {
    shop.menu[index].featured = !shop.menu[index].featured;
    saveShopData(shop);
    setShop({ ...shop });
  };

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black">🏪 {shop.name || "Your Shop"}</h1>
          <p className="text-text-muted text-xs">{shop.district}</p>
        </div>
        <div className="flex items-center gap-2">
          {shop.verified ? (
            <span className="bg-accent-green/20 text-accent-green text-[10px] font-bold px-2 py-1 rounded-full border border-accent-green/30">
              ✓ Verified
            </span>
          ) : (
            <span className="bg-accent-orange/20 text-accent-orange text-[10px] font-bold px-2 py-1 rounded-full border border-accent-orange/30">
              Pending
            </span>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-xl font-black text-accent-green">{shop.menu.length}</p>
          <p className="text-text-muted text-[10px]">Strains</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-xl font-black text-accent-purple">{shop.menu.filter((m) => m.inStock).length}</p>
          <p className="text-text-muted text-[10px]">In Stock</p>
        </div>
        <div className="glass-card rounded-xl p-3 text-center">
          <p className="text-xl font-black text-accent-orange">{shop.menu.filter((m) => m.featured).length}</p>
          <p className="text-text-muted text-[10px]">Featured</p>
        </div>
      </div>

      {/* Shop Profile */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">📋 Shop Info</h2>
          <button onClick={() => setEditing(!editing)} className="text-accent-green text-xs font-medium">
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {editing ? (
          <div className="glass-card rounded-2xl p-4 flex flex-col gap-3">
            <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Shop name"
              className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-green/50" />
            <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Describe your shop..." rows={2}
              className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-green/50 resize-none" />
            <input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} placeholder="📍 Address"
              className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-green/50" />
            <input value={editHours} onChange={(e) => setEditHours(e.target.value)} placeholder="🕐 Hours (e.g. 10:00 - 22:00)"
              className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-green/50" />
            <input value={editVibe} onChange={(e) => setEditVibe(e.target.value)} placeholder="✨ Vibe (e.g. Chill rooftop, great music)"
              className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-green/50" />
            <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="📞 Phone"
              className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-green/50" />
            <input value={editInsta} onChange={(e) => setEditInsta(e.target.value)} placeholder="📸 Instagram handle"
              className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-green/50" />
            <button onClick={handleSaveProfile}
              className="w-full py-2.5 rounded-xl bg-accent-green text-black font-bold text-sm hover:brightness-110 transition-all">
              Save Changes
            </button>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-4">
            {shop.description && <p className="text-text-secondary text-sm mb-3">{shop.description}</p>}
            <div className="flex flex-col gap-2 text-sm">
              {shop.address && <p className="text-text-muted">📍 {shop.address}</p>}
              <p className="text-text-muted">🕐 {shop.hours}</p>
              {shop.vibe && <p className="text-text-muted">✨ {shop.vibe}</p>}
              {shop.phone && <p className="text-text-muted">📞 {shop.phone}</p>}
              {shop.instagram && <p className="text-text-muted">📸 @{shop.instagram}</p>}
            </div>
          </div>
        )}
      </section>

      {/* Menu */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">🌿 Menu ({shop.menu.length})</h2>
          <button onClick={() => setAddingItem(!addingItem)} className="text-accent-green text-xs font-medium">
            {addingItem ? "Cancel" : "+ Add strain"}
          </button>
        </div>

        {/* Add form */}
        {addingItem && (
          <div className="glass-card rounded-2xl p-4 mb-3 border border-accent-green/20">
            <input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Strain name"
              className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2 text-sm text-text-primary mb-2 focus:outline-none focus:border-accent-green/50" />
            <div className="flex gap-2 mb-2">
              {(["sativa", "indica", "hybrid"] as const).map((type) => (
                <button key={type} onClick={() => setItemType(type)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    itemType === type ? `strain-${type} text-white` : "bg-bg-primary text-text-muted border border-border"
                  }`}>
                  {type}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mb-3">
              <input value={itemThc} onChange={(e) => setItemThc(e.target.value)} placeholder="THC %" type="number"
                className="flex-1 bg-bg-primary border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-green/50" />
              <input value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder="Price (opt)"
                className="flex-1 bg-bg-primary border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-green/50" />
            </div>
            <button onClick={handleAddItem} disabled={!itemName.trim()}
              className={`w-full py-2 rounded-xl font-bold text-sm transition-all ${
                itemName.trim() ? "bg-accent-green text-black" : "bg-bg-card text-text-muted border border-border"
              }`}>
              Add to Menu
            </button>
          </div>
        )}

        {/* Menu list */}
        {shop.menu.length > 0 ? (
          <div className="flex flex-col gap-2">
            {shop.menu.map((item, i) => (
              <div key={i} className={`glass-card rounded-xl p-3 flex items-center gap-3 ${!item.inStock ? "opacity-50" : ""}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{item.strainName}</p>
                    {item.featured && <span className="text-accent-orange text-[10px]">⭐</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`strain-${item.strainType} px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase text-white`}>
                      {item.strainType}
                    </span>
                    {item.thc > 0 && <span className="text-text-muted text-[10px]">THC {item.thc}%</span>}
                    {item.price && <span className="text-accent-green text-[10px] font-medium">{item.price}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleToggleFeatured(i)} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${item.featured ? "bg-accent-orange/20 border border-accent-orange/30" : "bg-bg-primary border border-border"}`}>
                    ⭐
                  </button>
                  <button onClick={() => handleToggleStock(i)} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all ${item.inStock ? "bg-accent-green/20 border border-accent-green/30" : "bg-bg-primary border border-border"}`}>
                    {item.inStock ? "✓" : "✕"}
                  </button>
                  <button onClick={() => handleRemoveItem(i)} className="w-7 h-7 rounded-lg flex items-center justify-center text-xs bg-bg-primary border border-border text-text-muted hover:text-red-400 transition-all">
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="text-3xl mb-2">🌿</div>
            <p className="text-text-secondary text-sm">No strains yet</p>
            <p className="text-text-muted text-xs">Add your menu to attract customers</p>
          </div>
        )}
      </section>

      {/* Map preview */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-3">📍 Your Location</h2>
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="text-text-muted text-sm mb-3">
            {shop.district} area • Shown on WIZL map
          </p>
          <Link href="/map" className="text-accent-green text-sm font-medium">
            View on Map →
          </Link>
        </div>
      </section>

      {/* Tips */}
      <section className="glass-card rounded-2xl p-5 border border-accent-purple/20 glow-purple">
        <h3 className="font-bold text-sm mb-2">💡 Tips to get more visitors</h3>
        <ul className="flex flex-col gap-1.5 text-text-secondary text-xs">
          <li>• Keep your menu updated — mark out-of-stock items</li>
          <li>• Feature your best strains — they show first</li>
          <li>• Add a vibe description — tourists love this</li>
          <li>• Place WIZL stickers at your entrance</li>
        </ul>
      </section>
    </div>
  );
}
