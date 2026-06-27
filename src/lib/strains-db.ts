import { supabase } from "./supabase";
import { Strain, StrainType, Difficulty } from "@/types";
import { strains as staticStrains } from "@/data/strains";

// Color mapping by strain type
const typeColors: Record<string, string> = {
  sativa: "#eab308",
  indica: "#8b5cf6",
  hybrid: "#34d399",
};

interface SupabaseStrain {
  id: string;
  name: string;
  type: string;
  thc_min: number | null;
  thc_max: number | null;
  cbd_min: number | null;
  cbd_max: number | null;
  description: string | null;
  effects: string[] | null;
  flavors: string[] | null;
  terpenes: { name: string; percentage?: number }[] | null;
  genetics: string | null;
  difficulty: string | null;
  flowering_time: string | null;
  yield: string | null;
  image: string | null;
  rating: number | null;
  rating_count: number | null;
  review_summary: string | null;
  source: string | null;
  source_url: string | null;
}

function mapSupabaseToStrain(s: SupabaseStrain): Strain {
  const type = (s.type as StrainType) || "hybrid";
  const thcMin = s.thc_min ?? null;
  const thcMax = s.thc_max ?? null;
  const cbdMin = s.cbd_min ?? null;
  const cbdMax = s.cbd_max ?? null;

  return {
    id: s.id,
    name: s.name || "Unknown",
    type,
    thc: thcMax !== null
      ? thcMin !== null
        ? Math.round(((thcMin + thcMax) / 2) * 10) / 10
        : thcMax
      : 0,
    cbd: cbdMax !== null
      ? cbdMin !== null
        ? Math.round(((cbdMin + cbdMax) / 2) * 10) / 10
        : cbdMax
      : 0,
    description: s.description || "",
    effects: s.effects || [],
    flavors: s.flavors || [],
    // Ratings only reflect real WIZL check-ins. Until the app has its own
    // aggregated ratings, show everything as unrated ("New") instead of
    // surfacing scraped/seeded numbers as if they were community scores.
    rating: 0,
    reviewCount: 0,
    image: s.name ? s.name.charAt(0) : "?",
    color: typeColors[type] || "#34d399",
    genetics: s.genetics || "",
    breeder: "",
    floweringTime: s.flowering_time || "",
    difficulty: (s.difficulty as Difficulty) || "moderate",
    bestFor: [],
    terpenes: Array.isArray(s.terpenes)
      ? s.terpenes.map((t) => t.name)
      : [],
    origin: "",
    aka: [],
    funFact: "",
  };
}

/**
 * Fetch all strains from Supabase, falling back to static data on error.
 */
export async function fetchStrains(): Promise<Strain[]> {
  if (!supabase) return staticStrains;
  try {
    const pageSize = 1000;
    const rows: SupabaseStrain[] = [];

    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase
        .from("strains")
        .select("*")
        .order("rating", { ascending: false })
        .range(from, from + pageSize - 1);

      if (error) throw error;
      if (!data || data.length === 0) break;

      rows.push(...data);
      if (data.length < pageSize) break;
    }

    if (rows.length === 0) return staticStrains;

    return rows.map(mapSupabaseToStrain);
  } catch (e) {
    console.error("Failed to fetch strains from Supabase, using static data:", e);
    return staticStrains;
  }
}

/**
 * Fetch a single strain by ID from Supabase.
 */
export async function fetchStrainById(id: string): Promise<Strain | null> {
  if (!supabase) return staticStrains.find((s) => s.id === id) || null;
  try {
    const idVariants = Array.from(new Set([
      id,
      safeDecodeURIComponent(id),
    ].filter(Boolean)));

    for (const variant of idVariants) {
      const { data, error } = await supabase
        .from("strains")
        .select("*")
        .eq("id", variant)
        .maybeSingle();

      if (error) throw error;
      if (data) return mapSupabaseToStrain(data);
    }

    return staticStrains.find((s) => idVariants.includes(s.id)) || null;
  } catch (e) {
    console.error("Failed to fetch strain by ID, using static fallback:", e);
    return staticStrains.find((s) => s.id === id) || null;
  }
}

function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Search strains using Supabase full-text search (fts column).
 */
export async function searchStrains(query: string): Promise<Strain[]> {
  if (!supabase) return staticStrains.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
  try {
    // Try full-text search first
    const tsQuery = query.trim().split(/\s+/).join(" & ");
    const { data, error } = await supabase
      .from("strains")
      .select("*")
      .textSearch("fts", tsQuery, { type: "websearch" })
      .order("rating", { ascending: false })
      .limit(20);

    if (error) throw error;
    if (!data || data.length === 0) {
      // Fallback to ilike search
      const { data: ilikeData, error: ilikeError } = await supabase
        .from("strains")
        .select("*")
        .ilike("name", `%${query}%`)
        .order("rating", { ascending: false })
        .limit(20);

      if (ilikeError) throw ilikeError;
      return (ilikeData || []).map(mapSupabaseToStrain);
    }

    return data.map(mapSupabaseToStrain);
  } catch (e) {
    console.error("Failed to search strains from Supabase:", e);
    const q = query.toLowerCase();
    return staticStrains.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.flavors.some((f) => f.toLowerCase().includes(q))
    );
  }
}
