"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Home, Leaf, MapPin, User } from "lucide-react";

export default function Navigation() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const navItems = [
    { href: "/" as const, icon: Home, label: t("home") },
    { href: "/strains" as const, icon: Leaf, label: t("strains") },
    { href: "/scan" as const, icon: null, label: t("scan") },
    { href: "/map" as const, icon: MapPin, label: t("map") },
    { href: "/profile" as const, icon: User, label: t("profile") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-card border-t border-border">
        <div className="max-w-lg mx-auto flex items-center justify-around py-2 px-4">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const isScan = item.href === "/scan";
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                  isActive ? "text-accent-green" : "text-text-muted hover:text-text-secondary"
                }`}>
                <span className={`${isScan ? "bg-accent-green text-black w-10 h-10 rounded-full flex items-center justify-center -mt-5 shadow-lg" : ""}`}>
                  {isScan ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src="/logo-wizl.svg" alt="" className="w-6 h-6" />
                  ) : (
                    Icon && <Icon className="w-5 h-5" />
                  )}
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
