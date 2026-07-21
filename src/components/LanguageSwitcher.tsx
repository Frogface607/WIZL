"use client";

import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const flagIcons: Record<string, { src: string; label: string }> = {
  en: { src: "/flags/us.svg", label: "English" },
  th: { src: "/flags/th.svg", label: "Thai" },
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = () => {
    const idx = routing.locales.indexOf(locale as "en" | "th");
    return routing.locales[(idx + 1) % routing.locales.length];
  };
  const flag = flagIcons[locale] || flagIcons.en;

  return (
    <button
      onClick={() => router.replace(pathname, { locale: nextLocale() })}
      className="w-8 h-8 rounded-full bg-bg-card border border-border flex items-center justify-center overflow-hidden hover:bg-bg-card-hover transition-all"
      title={t("switchLanguage", { language: flag.label })}
      aria-label={t("switchLanguage", { language: flag.label })}
    >
      <Image
        src={flag.src}
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 rounded-full object-cover"
      />
    </button>
  );
}
