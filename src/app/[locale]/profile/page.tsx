"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getRandomWisdom, type WisdomLocale } from "@/lib/wizl-wisdoms";
import { Link } from "@/i18n/navigation";
import {
  ChevronRight,
  Crown,
  Download,
  HardDrive,
  Heart,
  Leaf,
  Shield,
  Star,
  Trophy,
  User,
} from "lucide-react";
import {
  achievements,
  getTasteProfile,
  getUniqueStrainCount,
  getUnlockedAchievements,
  getUserData,
  type Achievement,
  type TasteProfile,
  type UserData,
} from "@/lib/store";
import { strains } from "@/data/strains";
import { trackEvent } from "@/lib/analytics";

const INITIAL_USER_DATA: UserData = {
  checkins: [],
  favorites: [],
  wishlist: [],
  scansToday: 0,
  scansDate: "",
  isPro: false,
  joinedAt: "2026-06-01T00:00:00.000Z",
  totalScans: 0,
};

export default function ProfilePage() {
  const t = useTranslations("profile");
  const locale = useLocale() as WisdomLocale;
  const [emptyWisdom] = useState(() => getRandomWisdom("empty", { locale, seed: 0 }));
  const [data, setData] = useState<UserData>(INITIAL_USER_DATA);
  const unlocked: Achievement[] = getUnlockedAchievements(data);
  const taste: TasteProfile = getTasteProfile(data, strains);
  const localizedTypes = t.raw("types") as Record<string, string>;
  const achievementNames = t.raw("achievements") as Record<string, string>;

  useEffect(() => {
    queueMicrotask(() => setData(getUserData()));
  }, []);

  const uniqueStrains = getUniqueStrainCount(data);
  const unlockedIds = new Set(unlocked.map((achievement) => achievement.id));
  const strainFrequency: Record<string, { name: string; count: number }> = {};

  data.checkins.forEach((checkin) => {
    if (!strainFrequency[checkin.strainId]) {
      strainFrequency[checkin.strainId] = { name: checkin.strainName, count: 0 };
    }
    strainFrequency[checkin.strainId].count += 1;
  });

  const topStrains = Object.values(strainFrequency)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const averageRating =
    data.checkins.length > 0
      ? (data.checkins.reduce((sum, checkin) => sum + checkin.rating, 0) / data.checkins.length).toFixed(1)
      : "—";

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "wizl-field-notes-" + new Date().toISOString().slice(0, 10) + ".json";
    anchor.click();
    URL.revokeObjectURL(url);
    trackEvent("field_notes_exported", { checkin_count: data.checkins.length });
  };

  const settingsItems = [
    { icon: Crown, label: t("subscription"), href: "/pro" as const },
    { icon: Shield, label: t("privacy"), href: "/privacy" as const },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      <div className="glass-card rounded-3xl p-6 mt-6 mb-6 text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-accent-purple/30 mx-auto mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mascot.webp" alt={t("traveler")} className="w-full h-full object-cover object-top" />
        </div>
        <h1 className="text-xl font-black">{t("traveler")}</h1>
        <p className="text-text-muted text-xs mt-2">
          {t("started", { date: new Date(data.joinedAt).toLocaleDateString(locale, { month: "short", year: "numeric" }) })}
        </p>
      </div>

      <div className="border-y border-border py-4 mb-6 flex items-start gap-3">
        <HardDrive className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-bold text-sm">{t("privateTitle")}</p>
          <p className="text-text-muted text-xs leading-relaxed mt-1">
            {t("privateBody")}
          </p>
          <button
            type="button"
            onClick={handleExport}
            className="text-accent-green text-xs font-semibold inline-flex items-center gap-1.5 mt-3 hover:underline"
          >
            <Download className="w-3.5 h-3.5" />
            {t("exportData")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6">
        <div className="glass-card rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-accent-green">{data.checkins.length}</p>
          <p className="text-text-muted text-[10px]">{t("checkins")}</p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-accent-purple">{uniqueStrains}</p>
          <p className="text-text-muted text-[10px]">{t("uniqueStrains")}</p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-accent-orange">{averageRating}</p>
          <p className="text-text-muted text-[10px]">{t("avgRating")}</p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-accent-love">{unlocked.length}</p>
          <p className="text-text-muted text-[10px]">{t("badges")}</p>
        </div>
      </div>

      {taste.favoriteType && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-accent-green" />
            {t("tasteTrail")}
          </h2>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={
                  "w-12 h-12 rounded-2xl flex items-center justify-center " +
                  (taste.favoriteType.type === "sativa"
                    ? "bg-yellow-500/20"
                    : taste.favoriteType.type === "indica"
                      ? "bg-purple-500/20"
                      : "bg-emerald-500/20")
                }
              >
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">{t("typeNotes", { type: localizedTypes[taste.favoriteType.type] || taste.favoriteType.type })}</p>
                <p className="text-text-muted text-xs">{t("fieldNotesShare", { pct: taste.favoriteType.pct })}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-accent-green font-bold text-lg">{taste.avgRating}</p>
                <p className="text-text-muted text-[10px]">{t("avgRatingShort")}</p>
              </div>
            </div>

            {taste.topEffects.length > 0 && (
              <div className="mb-3">
                <p className="text-text-muted text-[10px] font-medium uppercase mb-2">{t("referenceEffects")}</p>
                <div className="flex flex-col gap-1.5">
                  {taste.topEffects.slice(0, 3).map((effect) => (
                    <div key={effect.name} className="flex items-center gap-2">
                      <span className="text-sm text-text-primary w-20 truncate">{effect.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent-green"
                          style={{ width: String(Math.min(100, (effect.count / (taste.topEffects[0]?.count || 1)) * 100)) + "%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {taste.topFlavors.length > 0 && (
              <div>
                <p className="text-text-muted text-[10px] font-medium uppercase mb-2">{t("referenceFlavors")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {taste.topFlavors.slice(0, 5).map((flavor) => (
                    <span key={flavor.name} className="px-2 py-1 rounded-lg bg-accent-purple/10 text-accent-purple text-[10px] font-medium border border-accent-purple/20">
                      {flavor.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {data.wishlist.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent-love" />
            {t("wantExplore")}
          </h2>
          <div className="flex flex-col gap-2">
            {data.wishlist.map((id) => {
              const strain = strains.find((item) => item.id === id);
              if (!strain) return null;

              return (
                <Link
                  key={id}
                  href={"/strains/" + id}
                  className="glass-card rounded-xl p-3 flex items-center gap-3 hover:bg-bg-card-hover transition-all"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-white"
                    style={{ background: "linear-gradient(135deg, " + strain.color + ", " + strain.color + "99)" }}
                  >
                    {strain.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{strain.name}</p>
                    <span className={"strain-" + strain.type + " px-2 py-0.5 rounded-full text-[9px] font-bold uppercase text-white"}>
                      {strain.type}
                    </span>
                  </div>
                  <span className="text-accent-green text-xs font-bold">{t("referenceThc", { thc: strain.thc })}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent-orange" />
            {t("badges")}
          </h2>
          <span className="text-text-muted text-xs">{unlocked.length}/{achievements.length}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {achievements.map((achievement) => {
            const earned = unlockedIds.has(achievement.id);
            return (
              <div
                key={achievement.id}
                className={
                  "glass-card rounded-xl p-3 text-center transition-all " +
                  (earned ? "border border-accent-green/20" : "opacity-30 grayscale")
                }
              >
                <span className="text-2xl">{achievement.icon}</span>
                <p className="text-[9px] text-text-muted mt-1 leading-tight">{achievementNames[achievement.id] || achievement.name}</p>
              </div>
            );
          })}
        </div>
      </section>

      {topStrains.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-accent-green" />
            {t("mostLogged")}
          </h2>
          <div className="flex flex-col gap-2">
            {topStrains.map((strain, index) => (
              <div key={strain.name} className="glass-card rounded-xl p-3 flex items-center gap-3">
                <span className="text-text-muted text-xs font-bold w-5">#{index + 1}</span>
                <span className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center text-sm font-bold text-accent-green">
                  {strain.name.charAt(0)}
                </span>
                <span className="flex-1 font-semibold text-sm">{strain.name}</span>
                <span className="text-accent-green text-xs font-bold">{t("loggedCount", { count: strain.count })}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-6">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-accent-purple" />
          {t("recentActivity")}
        </h2>
        {data.checkins.length > 0 ? (
          <div className="flex flex-col gap-2">
            {data.checkins.slice(0, 10).map((checkin) => (
              <div key={checkin.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center text-sm font-bold text-accent-purple">
                  {checkin.strainName.charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{checkin.strainName}</p>
                  {checkin.review && <p className="text-text-muted text-xs line-clamp-1">{checkin.review}</p>}
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: checkin.rating }).map((_, index) => (
                      <span key={index} className="text-accent-green text-[10px]">★</span>
                    ))}
                  </div>
                  <span className="text-text-muted text-[10px]">
                    {new Date(checkin.createdAt).toLocaleDateString(locale, { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-3 animate-float">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/wizl-book.webp" alt="WIZL Book" className="w-full h-full object-contain" />
            </div>
            <p className="text-text-secondary text-sm italic mb-3">{emptyWisdom}</p>
            <Link href="/checkin" className="text-accent-green text-sm font-semibold">
              {t("firstScan")} →
            </Link>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <User className="w-5 h-5 text-text-muted" />
          {t("settings")}
        </h2>
        <div className="flex flex-col gap-2">
          {settingsItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="glass-card rounded-xl p-3 flex items-center gap-3 text-left hover:bg-bg-card-hover transition-all"
            >
              <item.icon className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-text-secondary">{item.label}</span>
              <ChevronRight className="ml-auto w-4 h-4 text-text-muted" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
