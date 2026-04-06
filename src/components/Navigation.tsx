"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function Navigation() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const navItems = [
    { href: "/" as const, icon: "🏠", label: t("home") },
    { href: "/strains" as const, icon: "🌿", label: t("strains") },
    { href: "/scan" as const, icon: "🔍", label: t("scan") },
    { href: "/map" as const, icon: "📍", label: t("map") },
    { href: "/profile" as const, icon: "👤", label: t("profile") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-card border-t border-border">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const isScan = item.href === "/scan";

            return (
              <Link key={item.href} href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                  isActive ? "text-accent-green" : "text-text-muted hover:text-text-secondary"
                }`}>
                <span className={`text-xl ${isScan ? "bg-accent-green text-black w-10 h-10 rounded-full flex items-center justify-center -mt-5 shadow-lg" : ""}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
