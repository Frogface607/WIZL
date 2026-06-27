import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile(path) {
  const env = {};
  const text = readFileSync(path, "utf8");

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    env[key] = value;
  }

  return env;
}

const env = loadEnvFile(resolve(".env.local"));
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
  process.exit(1);
}

const endpoint = `${supabaseUrl.replace(/\/$/, "")}/rest/v1/strains?select=id&limit=1`;
const response = await fetch(endpoint, {
  headers: {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    Prefer: "count=exact",
  },
});

const contentRange = response.headers.get("content-range") || "";
const count = Number(contentRange.split("/")[1] || 0);

if (!response.ok || !Number.isFinite(count) || count < 3000) {
  console.error(`Book data verification failed: status=${response.status}, count=${count || "unknown"}`);
  process.exit(1);
}

console.log(`Book data OK: ${count.toLocaleString("en-US")} strains available from Supabase.`);
