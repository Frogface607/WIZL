import { Strain } from "@/types";

// ── Types ──
export interface UserCheckin {
  id: string;
  strainId: string;
  strainName: string;
  strainImage: string;
  strainType: string;
  rating: number;
  mood: string;
  review: string;
  createdAt: string;
}

export interface UserData {
  checkins: UserCheckin[];
  favorites: string[]; // strain IDs
  scansToday: number;
  scansDate: string; // YYYY-MM-DD
  isPro: boolean;
  joinedAt: string;
  totalScans: number;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  condition: (data: UserData) => boolean;
  category: "checkins" | "strains" | "social" | "special";
}

// ── Achievements ──
export const achievements: Achievement[] = [
  {
    id: "first-scan",
    name: "First Scan",
    icon: "🔍",
    description: "Made your first check-in",
    condition: (d) => d.checkins.length >= 1,
    category: "checkins",
  },
  {
    id: "five-alive",
    name: "Five Alive",
    icon: "🖐",
    description: "5 check-ins total",
    condition: (d) => d.checkins.length >= 5,
    category: "checkins",
  },
  {
    id: "double-digits",
    name: "Double Digits",
    icon: "🔟",
    description: "10 check-ins",
    condition: (d) => d.checkins.length >= 10,
    category: "checkins",
  },
  {
    id: "quarter-century",
    name: "Quarter Century",
    icon: "🎯",
    description: "25 check-ins",
    condition: (d) => d.checkins.length >= 25,
    category: "checkins",
  },
  {
    id: "centurion",
    name: "Centurion",
    icon: "💯",
    description: "100 check-ins — legend status",
    condition: (d) => d.checkins.length >= 100,
    category: "checkins",
  },
  {
    id: "strain-hunter",
    name: "Strain Hunter",
    icon: "🏹",
    description: "Tried 5 unique strains",
    condition: (d) => new Set(d.checkins.map((c) => c.strainId)).size >= 5,
    category: "strains",
  },
  {
    id: "connoisseur",
    name: "Connoisseur",
    icon: "🎩",
    description: "Tried 15 unique strains",
    condition: (d) => new Set(d.checkins.map((c) => c.strainId)).size >= 15,
    category: "strains",
  },
  {
    id: "encyclopedia",
    name: "Encyclopedia",
    icon: "📚",
    description: "Tried 30 unique strains",
    condition: (d) => new Set(d.checkins.map((c) => c.strainId)).size >= 30,
    category: "strains",
  },
  {
    id: "sativa-lover",
    name: "Sativa Lover",
    icon: "☀️",
    description: "5 sativa check-ins",
    condition: (d) => d.checkins.filter((c) => c.strainType === "sativa").length >= 5,
    category: "strains",
  },
  {
    id: "indica-lover",
    name: "Indica Lover",
    icon: "🌙",
    description: "5 indica check-ins",
    condition: (d) => d.checkins.filter((c) => c.strainType === "indica").length >= 5,
    category: "strains",
  },
  {
    id: "hybrid-master",
    name: "Hybrid Master",
    icon: "⚡",
    description: "5 hybrid check-ins",
    condition: (d) => d.checkins.filter((c) => c.strainType === "hybrid").length >= 5,
    category: "strains",
  },
  {
    id: "night-owl",
    name: "Night Owl",
    icon: "🦉",
    description: "Check-in after midnight",
    condition: (d) => d.checkins.some((c) => new Date(c.createdAt).getHours() >= 0 && new Date(c.createdAt).getHours() < 5),
    category: "special",
  },
  {
    id: "early-bird",
    name: "Early Bird",
    icon: "🐦",
    description: "Check-in before 8am",
    condition: (d) => d.checkins.some((c) => new Date(c.createdAt).getHours() >= 5 && new Date(c.createdAt).getHours() < 8),
    category: "special",
  },
  {
    id: "reviewer",
    name: "Top Reviewer",
    icon: "✍️",
    description: "Wrote 10 reviews with text",
    condition: (d) => d.checkins.filter((c) => c.review.length > 10).length >= 10,
    category: "social",
  },
  {
    id: "critic",
    name: "Tough Critic",
    icon: "🧐",
    description: "Gave a 1-star rating",
    condition: (d) => d.checkins.some((c) => c.rating === 1),
    category: "special",
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    icon: "⭐",
    description: "Gave a 5-star rating",
    condition: (d) => d.checkins.some((c) => c.rating === 5),
    category: "special",
  },
  {
    id: "collector",
    name: "Collector",
    icon: "💎",
    description: "Added 5 favorites",
    condition: (d) => d.favorites.length >= 5,
    category: "social",
  },
  {
    id: "scanner-pro",
    name: "Scanner Pro",
    icon: "📸",
    description: "Used AI scan 10 times",
    condition: (d) => d.totalScans >= 10,
    category: "special",
  },
];

// ── Storage helpers ──
const STORAGE_KEY = "wizl-user-data";

function getDefaultData(): UserData {
  return {
    checkins: [],
    favorites: [],
    scansToday: 0,
    scansDate: new Date().toISOString().split("T")[0],
    isPro: false,
    joinedAt: new Date().toISOString(),
    totalScans: 0,
  };
}

export function getUserData(): UserData {
  if (typeof window === "undefined") return getDefaultData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultData();
    return { ...getDefaultData(), ...JSON.parse(raw) };
  } catch {
    return getDefaultData();
  }
}

export function saveUserData(data: UserData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ── Actions ──
export function addCheckin(
  strain: Strain,
  rating: number,
  mood: string,
  review: string
): { data: UserData; newAchievements: Achievement[] } {
  const data = getUserData();
  const oldUnlocked = getUnlockedAchievements(data);

  const checkin: UserCheckin = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    strainId: strain.id,
    strainName: strain.name,
    strainImage: strain.image,
    strainType: strain.type,
    rating,
    mood,
    review,
    createdAt: new Date().toISOString(),
  };

  data.checkins.unshift(checkin);
  saveUserData(data);

  const newUnlocked = getUnlockedAchievements(data);
  const newAchievements = newUnlocked.filter(
    (a) => !oldUnlocked.find((o) => o.id === a.id)
  );

  return { data, newAchievements };
}

export function toggleFavorite(strainId: string): UserData {
  const data = getUserData();
  const idx = data.favorites.indexOf(strainId);
  if (idx === -1) {
    data.favorites.push(strainId);
  } else {
    data.favorites.splice(idx, 1);
  }
  saveUserData(data);
  return data;
}

export function incrementScans(): { allowed: boolean; data: UserData } {
  const data = getUserData();
  const today = new Date().toISOString().split("T")[0];

  if (data.scansDate !== today) {
    data.scansToday = 0;
    data.scansDate = today;
  }

  const limit = data.isPro ? Infinity : 5;
  if (data.scansToday >= limit) {
    return { allowed: false, data };
  }

  data.scansToday++;
  data.totalScans++;
  saveUserData(data);
  return { allowed: true, data };
}

export function getUnlockedAchievements(data: UserData): Achievement[] {
  return achievements.filter((a) => a.condition(data));
}

export function getUniqueStrainCount(data: UserData): number {
  return new Set(data.checkins.map((c) => c.strainId)).size;
}

export function getScansRemaining(data: UserData): number {
  if (data.isPro) return Infinity;
  const today = new Date().toISOString().split("T")[0];
  if (data.scansDate !== today) return 5;
  return Math.max(0, 5 - data.scansToday);
}
