// ── Shop types & storage ──

export interface MenuItem {
  strainName: string;
  strainType: "sativa" | "indica" | "hybrid";
  thc: number;
  price?: string;
  inStock: boolean;
  featured: boolean;
}

export interface ShopProfile {
  id: string;
  name: string;
  description: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  hours: string;
  phone: string;
  instagram: string;
  menu: MenuItem[];
  photos: string[];
  vibe: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

const SHOP_STORAGE_KEY = "wizl-shop-data";

function getDefaultShop(): ShopProfile {
  return {
    id: `shop-${Date.now()}`,
    name: "",
    description: "",
    district: "",
    address: "",
    lat: 13.7445,
    lng: 100.535,
    hours: "10:00 - 22:00",
    phone: "",
    instagram: "",
    menu: [],
    photos: [],
    vibe: "",
    verified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getShopData(): ShopProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SHOP_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveShopData(shop: ShopProfile): void {
  if (typeof window === "undefined") return;
  shop.updatedAt = new Date().toISOString();
  localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(shop));
}

export function createShop(name: string, district: string): ShopProfile {
  const shop = getDefaultShop();
  shop.name = name;
  shop.district = district;
  saveShopData(shop);
  return shop;
}

export function addMenuItem(item: MenuItem): ShopProfile | null {
  const shop = getShopData();
  if (!shop) return null;
  shop.menu.push(item);
  saveShopData(shop);
  return shop;
}

export function updateMenuItem(index: number, item: MenuItem): ShopProfile | null {
  const shop = getShopData();
  if (!shop || index < 0 || index >= shop.menu.length) return null;
  shop.menu[index] = item;
  saveShopData(shop);
  return shop;
}

export function removeMenuItem(index: number): ShopProfile | null {
  const shop = getShopData();
  if (!shop || index < 0 || index >= shop.menu.length) return null;
  shop.menu.splice(index, 1);
  saveShopData(shop);
  return shop;
}

export function isShopOwner(): boolean {
  return getShopData() !== null;
}
