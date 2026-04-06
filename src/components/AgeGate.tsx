"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const t = useTranslations("age");
  const tb = useTranslations("brand");
  const [verified, setVerified] = useState<boolean | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("wizl-age-verified");
    setVerified(stored === "true");
  }, []);

  const handleVerify = () => {
    localStorage.setItem("wizl-age-verified", "true");
    setVerified(true);
  };

  if (verified === null) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-4xl animate-float">🔍</div>
      </div>
    );
  }

  if (verified) return <>{children}</>;

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center">
        <div className="text-5xl mb-4 animate-float">🔍</div>
        <h1 className="text-4xl font-black gradient-text mb-1">{tb("name")}</h1>
        <p className="text-sm gradient-love font-medium mb-1">{tb("tagline")}</p>
        <p className="text-text-muted text-xs mb-8">{tb("slogan")}</p>

        {denied ? (
          <div>
            <div className="text-5xl mb-4">🚫</div>
            <p className="text-text-secondary mb-2">{t("denied")}</p>
            <p className="text-text-muted text-xs">{t("deniedNote")}</p>
          </div>
        ) : (
          <>
            <div className="bg-bg-primary/50 rounded-2xl p-5 mb-6 border border-border">
              <p className="text-text-primary font-semibold mb-1">{t("question")}</p>
              <p className="text-text-muted text-xs whitespace-pre-line">{t("note")}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDenied(true)}
                className="flex-1 py-3 px-4 rounded-2xl bg-bg-card border border-border text-text-secondary font-medium hover:bg-bg-card-hover transition-all">
                {t("no")}
              </button>
              <button onClick={handleVerify}
                className="flex-1 py-3 px-4 rounded-2xl bg-accent-green text-black font-bold hover:brightness-110 transition-all glow-green">
                {t("yes")}
              </button>
            </div>
            <p className="text-text-muted text-[10px] mt-4 leading-relaxed">{t("legal")}</p>
          </>
        )}
      </div>
    </div>
  );
}
