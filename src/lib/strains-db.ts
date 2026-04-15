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
    rating: s.rating ? Math.round(s.rating * 10) / 10 : 4.0,
    reviewCount: s.rating_count || 0,
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
  try {
    const { data, error } = await supabase
      .from("strains")
      .select("*")
      .order("rating", { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return staticStrains;

    return data.map(mapSupabaseToStrain);
  } catch (e) {
    console.error("Failed to fetch strains from Supabase, using static data:", e);
    return staticStrains;
  }
}

/**
 * Fetch a single strain by ID from Supabase.
 */
export async function fetchStrainById(id: string): Promise<Strain | null> {
  try {
    const { data, error } = await supabase
      .from("strains")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) return staticStrains.find((s) => s.id === id) || null;

    return mapSupabaseToStrain(data);
  } catch (e) {
    console.error("Failed to fetch strain by ID, using static fallback:", e);
    return staticStrains.find((s) => s.id === id) || null;
  }
}

/**
 * Search strains using Supabase full-text search (fts column).
 */
export async function searchStrains(query: string): Promise<Strain[]> {
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
