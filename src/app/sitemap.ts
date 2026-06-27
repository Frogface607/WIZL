import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { routing } from "@/i18n/routing";
import { strains as staticStrains } from "@/data/strains";

const baseUrl = "https://wizl.space";

const corePaths = [
  "",
  "/about",
  "/scan",
  "/strains",
  "/map",
  "/checkin",
  "/pro",
  "/shop",
  "/privacy",
  "/terms",
  "/refund",
];

async function getStrainIds() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return staticStrains.map((strain) => strain.id);
  }

  try {
    const client = createClient(supabaseUrl, supabaseAnonKey);
    const ids: string[] = [];
    const pageSize = 1000;

    for (let page = 0; ; page += 1) {
      const { data, error } = await client
        .from("strains")
        .select("id")
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (error) throw error;
      if (!data || data.length === 0) break;

      ids.push(...data.map((row: { id: string }) => row.id));
      if (data.length < pageSize) break;
    }

    return ids.length > 0 ? ids : staticStrains.map((strain) => strain.id);
  } catch {
    return staticStrains.map((strain) => strain.id);
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const strainIds = await getStrainIds();

  const coreEntries = routing.locales.flatMap((locale) =>
    corePaths.map((path) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
      priority: path === "" ? 1 : path === "/scan" || path === "/strains" ? 0.9 : 0.7,
    }))
  );

  const strainEntries = routing.locales.flatMap((locale) =>
    strainIds.map((id) => ({
      url: `${baseUrl}/${locale}/strains/${encodeURIComponent(id)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [...coreEntries, ...strainEntries];
}
