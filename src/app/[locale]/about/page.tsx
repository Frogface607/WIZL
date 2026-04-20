"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function AboutPage() {
  const tb = useTranslations("brand");
  const t = useTranslations("about");

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
      {/* Hero */}
      <div className="text-center mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mascot.png" alt="WIZL" className="w-24 h-24 mx-auto mb-4 rounded-2xl" />
        <h1 className="text-2xl font-black gradient-text mb-1">{t("title")}</h1>
        <p className="text-sm gradient-love font-medium">{tb("tagline")}</p>
      </div>

      {/* Story */}
      <div className="glass-card rounded-3xl p-6 mb-6">
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {t("storyP1")}
        </p>

        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {t("storyP2")}
        </p>

        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {t("storyP3")}
        </p>

        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {t("storyP4a")}
          <span className="text-text-primary font-semibold">WIZL</span>
          {t("storyP4b")}
        </p>

        <div className="my-5 border-t border-border" />

        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {t("meetHim")}
        </p>

        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          <span className="text-text-primary font-semibold">{t("meetIntroA")}</span>
          {t("meetIntroB")}
        </p>

        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {t("strainsCountA")}
          <span className="text-accent-neon font-semibold">{t("strainsCountBold")}</span>
          {t("strainsCountB")}
        </p>

        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          {t("youCan")}
        </p>

        <p className="text-text-primary text-sm leading-relaxed font-medium">
          {t("cta")}
        </p>
      </div>

      {/* Mission */}
      <div className="glass-card rounded-2xl p-5 mb-6 border border-accent-green/20">
        <h2 className="font-bold mb-3">{t("missionTitle")}</h2>
        <div className="flex flex-col gap-3 text-text-secondary text-sm">
          <p>{t("missionP1")}</p>
          <p>
            {t("missionP2a")}
            <span className="text-text-primary font-medium">{t("missionP2b")}</span>
            {t("missionP2c")}
          </p>
        </div>
      </div>

      {/* The Journey */}
      <div className="glass-card rounded-2xl p-5 mb-6 border border-accent-purple/20">
        <h2 className="font-bold mb-3">{t("journeyTitle")}</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="text-accent-green font-bold text-sm mt-0.5">01</span>
            <div>
              <p className="text-text-primary font-semibold text-sm">{t("journey1Title")}</p>
              <p className="text-text-muted text-xs">{t("journey1Desc")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-text-muted font-bold text-sm mt-0.5">02</span>
            <div>
              <p className="text-text-muted font-semibold text-sm">{t("journey2Title")}</p>
              <p className="text-text-muted text-xs">{t("journey2Desc")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-text-muted font-bold text-sm mt-0.5">03</span>
            <div>
              <p className="text-text-muted font-semibold text-sm">{t("journey3Title")}</p>
              <p className="text-text-muted text-xs">{t("journey3Desc")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: "☮️", title: t("valuePeace"), desc: t("valuePeaceDesc") },
          { icon: "💚", title: t("valueLove"), desc: t("valueLoveDesc") },
          { icon: "🤝", title: t("valueHonesty"), desc: t("valueHonestyDesc") },
          { icon: "🌏", title: t("valueFreedom"), desc: t("valueFreedomDesc") },
        ].map((v) => (
          <div key={v.title} className="glass-card rounded-2xl p-4 text-center">
            <span className="text-2xl">{v.icon}</span>
            <p className="font-bold text-sm mt-1">{v.title}</p>
            <p className="text-text-muted text-[10px]">{v.desc}</p>
          </div>
        ))}
      </div>

      {/* Support CTA */}
      <div className="glass-card rounded-2xl p-6 mb-6 text-center border border-accent-love/20 glow-love">
        <h3 className="font-bold mb-2">{t("supportTitle")}</h3>
        <p className="text-text-secondary text-xs leading-relaxed mb-4">
          {t("supportDesc")}
        </p>
        <Link
          href="/pro"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent-green text-black font-bold hover:brightness-110 transition-all glow-green"
        >
          {t("supportCta")}
        </Link>
      </div>

      {/* Social links placeholder */}
      <div className="glass-card rounded-2xl p-5 text-center">
        <h3 className="font-bold text-sm mb-3">{t("followTitle")}</h3>
        <div className="flex justify-center gap-3">
          {[
            { icon: "📸", label: "Instagram" },
            { icon: "🎵", label: "TikTok" },
            { icon: "🎬", label: "YouTube" },
          ].map((social) => (
            <div
              key={social.label}
              className="glass-card rounded-xl px-4 py-3 border border-border"
            >
              <span className="text-xl">{social.icon}</span>
              <p className="text-text-muted text-[10px] mt-1">{social.label}</p>
            </div>
          ))}
        </div>
        <p className="text-text-muted text-xs mt-3">{t("followSoon")}</p>
      </div>
    </div>
  );
}
