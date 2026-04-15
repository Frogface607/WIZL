"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { User, Bell, Globe, Shield, Crown, Download, ChevronRight, Star, Search, Trophy, Store, Heart, Leaf, LogOut } from "lucide-react";
import {
  getUserData,
  getUnlockedAchievements,
  getUniqueStrainCount,
  getTasteProfile,
  achievements,
  UserData,
  Achievement,
  TasteProfile,
} from "@/lib/store";
import { useAuth } from "@/lib/auth";
import AuthPrompt from "@/components/AuthPrompt";
import { strains } from "@/data/strains";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tAuth = useTranslations("auth");
  const { user, isAnonymous, signOut } = useAuth();
  const [data, setData] = useState<UserData | null>(null);
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);
  const [taste, setTaste] = useState<TasteProfile | null>(null);

  useEffect(() => {
    const d = getUserData();
    setData(d);
    setUnlocked(getUnlockedAchievements(d));
    setTaste(getTasteProfile(d, strains));
  }, []);

  if (!data) {
    return (
      <div className="max-w-lg mx-auto px-4 pb-24 pt-8 text-center">
        <Search className="w-10 h-10 text-accent-green animate-float mx-auto" />
      </div>
    );
  }

  const uniqueStrains = getUniqueStrainCount(data);
  const unlockedIds = new Set(unlocked.map((a) => a.id));

  // Top strains by frequency
  const strainFreq: Record<string, { name: string; image: string; count: number }> = {};
  data.checkins.forEach((c) => {
    if (!strainFreq[c.strainId]) {
      strainFreq[c.strainId] = { name: c.strainName, image: c.strainImage, count: 0 };
    }
    strainFreq[c.strainId].count++;
  });
  const topStrains = Object.values(strainFreq).sort((a, b) => b.count - a.count).slice(0, 5);

  // Average rating
  const avgRating = data.checkins.length > 0
    ? (data.checkins.reduce((sum, c) => sum + c.rating, 0) / data.checkins.length).toFixed(1)
    : "—";

  const settingsItems = [
    { icon: User, label: t("editProfile"), href: "#" },
    { icon: Bell, label: t("notifications"), href: "#" },
    { icon: Globe, label: t("language"), href: "#" },
    { icon: Shield, label: t("privacy"), href: "/privacy" },
    { icon: Crown, label: t("subscription"), href: "/pro" },
    { icon: Download, label: t("exportData"), href: "#" },
  ];

  return (
    <div className="max-w-lg mx-auto px-4 pb-24">
      {/* Profile Header */}
      <div className="glass-card rounded-3xl p-6 mt-6 mb-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-green/30 to-accent-purple/30 flex items-center justify-center mx-auto mb-3">
          <User className="w-8 h-8 text-accent-green" />
        </div>
        <h1 className="text-xl font-black">
          {!isAnonymous && user?.email ? user.email.split("@")[0] : "WIZL Explorer"}
        </h1>
        {!isAnonymous && user?.email && (
          <p className="text-text-muted text-xs mt-1">{user.email}</p>
        )}
        {data.isPro && (
          <span className="inline-block mt-2 pro-badge px-3 py-1 rounded-full text-xs font-bold text-black">WIZL PRO</span>
        )}
        <p className="text-text-muted text-xs mt-2">
          Joined {new Date(data.joinedAt).toLocaleDateString("en", { month: "short", year: "numeric" })}
        </p>
      </div>

      {/* Auth CTA — show for anonymous users */}
      {isAnonymous && (
        <div className="mb-6">
          <AuthPrompt />
        </div>
      )}

      {/* Sign out — show for authenticated users */}
      {!isAnonymous && (
        <button
          onClick={() => signOut()}
          className="glass-card rounded-xl p-3 mb-6 flex items-center gap-3 w-full text-left hover:bg-bg-card-hover transition-all"
        >
          <LogOut className="w-4 h-4 text-text-muted" />
          <span className="text-sm text-text-secondary">{tAuth("signOut")}</span>
        </button>
      )}

      {/* Stats */}
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
          <p className="text-2xl font-black text-accent-orange">{avgRating}</p>
          <p className="text-text-muted text-[10px]">Avg Rating</p>
        </div>
        <div className="glass-card rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-accent-love">{unlocked.length}</p>
          <p className="text-text-muted text-[10px]">{t("badges")}</p>
        </div>
      </div>

      {/* Taste Profile */}
      {taste && taste.favoriteType && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Leaf className="w-5 h-5 text-accent-green" /> Your Taste</h2>
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                taste.favoriteType.type === "sativa" ? "bg-yellow-500/20" :
                taste.favoriteType.type === "indica" ? "bg-purple-500/20" : "bg-emerald-500/20"
              }`}>
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm capitalize">{taste.favoriteType.type} Lover</p>
                <p className="text-text-muted text-xs">{taste.favoriteType.pct}% of your check-ins</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-accent-green font-bold text-lg">{taste.avgThc}%</p>
                <p className="text-text-muted text-[10px]">avg THC</p>
              </div>
            </div>
            {taste.topEffects.length > 0 && (
              <div className="mb-3">
                <p className="text-text-muted text-[10px] font-medium uppercase tracking-wider mb-2">Your top effects</p>
                <div className="flex flex-col gap-1.5">
                  {taste.topEffects.slice(0, 3).map((e) => (
                    <div key={e.name} className="flex items-center gap-2">
                      <span className="text-sm text-text-primary w-20 truncate">{e.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-accent-green"
                          style={{ width: `${Math.min(100, (e.count / (taste.topEffects[0]?.count || 1)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {taste.topFlavors.length > 0 && (
              <div>
                <p className="text-text-muted text-[10px] font-medium uppercase tracking-wider mb-2">Your top flavors</p>
                <div className="flex flex-wrap gap-1.5">
                  {taste.topFlavors.slice(0, 5).map((f) => (
                    <span key={f.name} className="px-2 py-1 rounded-lg bg-accent-purple/10 text-accent-purple text-[10px] font-medium border border-accent-purple/20">
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Wishlist */}
      {data.wishlist && data.wishlist.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Heart className="w-5 h-5 text-accent-love" /> Want to Try</h2>
          <div className="flex flex-col gap-2">
            {data.wishlist.map((id) => {
              const s = strains.find((st) => st.id === id);
              if (!s) return null;
              return (
                <Link key={id} href={`/strains/${id}`} className="glass-card rounded-xl p-3 flex items-center gap-3 hover:bg-bg-card-hover transition-all">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-white"
                    style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}99)` }}
                  >
                    {s.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{s.name}</p>
                    <span className={`strain-${s.type} px-2 py-0.5 rounded-full text-[9px] font-bold uppercase text-white`}>{s.type}</span>
                  </div>
                  <span className="text-accent-green text-xs font-bold">{s.thc}% THC</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Achievements */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2"><Trophy className="w-5 h-5 text-accent-orange" /> {t("badges")}</h2>
          <span className="text-text-muted text-xs">{unlocked.length}/{achievements.length}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {achievements.map((ach) => {
            const earned = unlockedIds.has(ach.id);
            return (
              <div
                key={ach.id}
                className={`glass-card rounded-xl p-3 text-center transition-all ${
                  earned ? "border border-accent-green/20" : "opacity-30 grayscale"
                }`}
              >
                <span className="text-2xl">{ach.icon}</span>
                <p className="text-[9px] text-text-muted mt-1 leading-tight">{ach.name}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Shop CTA */}
      <Link href="/shop" className="glass-card rounded-2xl p-4 mb-6 flex items-center gap-3 border border-accent-purple/20 hover:bg-bg-card-hover transition-all block">
        <Store className="w-6 h-6 text-accent-purple" />
        <div className="flex-1">
          <p className="font-bold text-sm">Own a shop?</p>
          <p className="text-text-muted text-xs">Add your shop to the WIZL map — $4.20/year</p>
        </div>
        <span className="text-text-muted text-xs">→</span>
      </Link>

      {/* Top Strains */}
      {topStrains.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Star className="w-5 h-5 text-accent-green" /> Top Strains</h2>
          <div className="flex flex-col gap-2">
            {topStrains.map((s, i) => (
              <div key={s.name} className="glass-card rounded-xl p-3 flex items-center gap-3">
                <span className="text-text-muted text-xs font-bold w-5">#{i + 1}</span>
                <span className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center text-sm font-bold text-accent-green">{s.name.charAt(0)}</span>
                <span className="flex-1 font-semibold text-sm">{s.name}</span>
                <span className="text-accent-green text-xs font-bold">{s.count}x</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Check-ins */}
      <section className="mb-6">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><Leaf className="w-5 h-5 text-accent-purple" /> {t("recentActivity")}</h2>
        {data.checkins.length > 0 ? (
          <div className="flex flex-col gap-2">
            {data.checkins.slice(0, 10).map((checkin) => (
              <div key={checkin.id} className="glass-card rounded-xl p-3 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center text-sm font-bold text-accent-purple">{checkin.strainName.charAt(0)}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{checkin.strainName}</p>
                  {checkin.review && (
                    <p className="text-text-muted text-xs line-clamp-1">{checkin.review}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <div className="flex gap-0.5">
                    {Array.from({ length: checkin.rating }).map((_, i) => (
                      <span key={i} className="text-accent-green text-[10px]">★</span>
                    ))}
                  </div>
                  <span className="text-text-muted text-[10px]">
                    {new Date(checkin.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Search className="w-8 h-8 text-accent-green mx-auto mb-2" />
            <p className="text-text-secondary text-sm">{t("noCheckins")}</p>
            <Link href="/checkin" className="text-accent-green text-sm font-semibold">{t("firstScan")} →</Link>
          </div>
        )}
      </section>

      {/* Settings */}
      <section>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><User className="w-5 h-5 text-text-muted" /> {t("settings")}</h2>
        <div className="flex flex-col gap-2">
          {settingsItems.map((item) => (
            <Link key={item.label} href={item.href} className="glass-card rounded-xl p-3 flex items-center gap-3 text-left hover:bg-bg-card-hover transition-all">
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
