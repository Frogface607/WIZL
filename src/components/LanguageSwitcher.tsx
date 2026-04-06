"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const flags: Record<string, string> = {
  en: "🇬🇧",
  th: "🇹🇭",
  ru: "🇷🇺",
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = () => {
    const idx = routing.locales.indexOf(locale as "en" | "th" | "ru");
    return routing.locales[(idx + 1) % routing.locales.length];
  };

  return (
    <button
      onClick={() => router.replace(pathname, { locale: nextLocale() })}
      className="w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center text-sm hover:bg-bg-card-hover transition-all"
      title={`Switch language (${locale.toUpperCase()})`}
    >
      {flags[locale] || "🌐"}
    </button>
  );
}
