"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 glass-card border-b border-border">
      <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.png" alt="WIZL" className="w-8 h-8" />
          <span className="text-xl font-brand font-bold tracking-widest" style={{color: "#e8e4df"}}>{t("brand.name")}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/about" className="text-text-muted hover:text-text-secondary transition-colors text-xs font-medium">
            Story
          </Link>
          <LanguageSwitcher />
          <Link href="/pro" className="pro-badge px-2.5 py-0.5 rounded-full text-[10px] font-bold text-black">
            {t("common.pro")}
          </Link>
          <Link href="/profile" className="w-8 h-8 rounded-full overflow-hidden border border-accent-purple/30" aria-label="Profile">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mascot.png" alt="Profile" className="w-full h-full object-cover object-top" />
          </Link>
        </div>
      </div>
    </header>
  );
}
