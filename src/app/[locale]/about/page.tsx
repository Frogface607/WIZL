"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function AboutPage() {
  const tb = useTranslations("brand");

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6">
      {/* Hero */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">👋</div>
        <h1 className="text-2xl font-black gradient-text mb-1">The Story</h1>
        <p className="text-sm gradient-love font-medium">{tb("tagline")}</p>
      </div>

      {/* Story */}
      <div className="glass-card rounded-3xl p-6 mb-6">
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          Hey, I&apos;m Sergey. A businessman from Russia who believes in peace,
          love, and good vibes.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          I came to Bangkok and fell in love with the culture — the openness,
          the warmth, the freedom. I started visiting coffee shops, trying
          different strains, and realized there&apos;s no good way to track what
          you&apos;ve tried or discover what&apos;s worth trying.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          So I built <span className="text-text-primary font-semibold">WIZL</span>.
          An AI-powered guide that helps you scan, discover, and remember every strain
          you&apos;ve ever tried. Like Untappd, but for cannabis. With love.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          I&apos;m building this while walking through Bangkok — one shop at a time,
          one sticker at a time, one conversation at a time. If you see me on
          the street — say hi. I probably have stickers.
        </p>
      </div>

      {/* Mission */}
      <div className="glass-card rounded-2xl p-5 mb-6 border border-accent-green/20">
        <h2 className="font-bold mb-3">🌍 The Mission</h2>
        <div className="flex flex-col gap-3 text-text-secondary text-sm">
          <p>
            Cannabis is being legalized around the world. Yet there&apos;s no friendly,
            beautiful tool to help people navigate this world responsibly and joyfully.
          </p>
          <p>
            WIZL is that tool. Not a marketplace. Not a dealer app.
            An <span className="text-text-primary font-medium">education &amp; discovery platform</span> built
            with love, for people who appreciate the plant.
          </p>
        </div>
      </div>

      {/* The Journey */}
      <div className="glass-card rounded-2xl p-5 mb-6 border border-accent-purple/20">
        <h2 className="font-bold mb-3">🚶 The Journey</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="text-accent-green font-bold text-sm mt-0.5">01</span>
            <div>
              <p className="text-text-primary font-semibold text-sm">Bangkok</p>
              <p className="text-text-muted text-xs">Where it all started. Walking the streets, visiting shops, building WIZL.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-text-muted font-bold text-sm mt-0.5">02</span>
            <div>
              <p className="text-text-muted font-semibold text-sm">Next city...</p>
              <p className="text-text-muted text-xs">You decide. Your support helps me reach the next destination.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-text-muted font-bold text-sm mt-0.5">03</span>
            <div>
              <p className="text-text-muted font-semibold text-sm">And the next...</p>
              <p className="text-text-muted text-xs">Amsterdam? Colorado? California? Let&apos;s see where the road goes.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: "☮️", title: "Peace", desc: "No drama, no toxicity" },
          { icon: "💚", title: "Love", desc: "For the plant and the people" },
          { icon: "🤝", title: "Honesty", desc: "No tricks, just vibes" },
          { icon: "🌏", title: "Freedom", desc: "To explore and discover" },
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
        <h3 className="font-bold mb-2">💚 Support the Adventure</h3>
        <p className="text-text-secondary text-xs leading-relaxed mb-4">
          Your $4.20 doesn&apos;t just unlock features — it funds the next walk,
          the next city, the next chapter of this story. You become part of the journey.
        </p>
        <Link
          href="/pro"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent-green text-black font-bold hover:brightness-110 transition-all glow-green"
        >
          Join for $4.20/mo
        </Link>
      </div>

      {/* Social links placeholder */}
      <div className="glass-card rounded-2xl p-5 text-center">
        <h3 className="font-bold text-sm mb-3">📱 Follow the Journey</h3>
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
        <p className="text-text-muted text-xs mt-3">Links coming soon</p>
      </div>
    </div>
  );
}
