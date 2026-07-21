"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { CircleX, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

const AGE_STORAGE_KEY = "wizl-age-verified";
const AGE_CHANGE_EVENT = "wizl-age-change";

function subscribeToAgeGate(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(AGE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(AGE_CHANGE_EVENT, onStoreChange);
  };
}

function getAgeSnapshot() {
  return localStorage.getItem(AGE_STORAGE_KEY) === "true";
}

function getServerAgeSnapshot() {
  return false;
}

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const t = useTranslations("age");
  const tb = useTranslations("brand");
  const verified = useSyncExternalStore(
    subscribeToAgeGate,
    getAgeSnapshot,
    getServerAgeSnapshot,
  );
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (!verified) document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [verified]);

  const handleVerify = () => {
    localStorage.setItem(AGE_STORAGE_KEY, "true");
    window.dispatchEvent(new Event(AGE_CHANGE_EVENT));
  };

  return (
    <>
      <div
        aria-hidden={!verified}
        className={verified ? "" : "pointer-events-none select-none"}
      >
        {children}
      </div>

      {!verified && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="wizl-age-title"
          className="fixed inset-0 z-[100] min-h-screen bg-bg-primary flex items-center justify-center p-4"
        >
          <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center">
            <Image
              src="/logo-mark-transparent.webp"
              alt=""
              width={96}
              height={96}
              priority
              className="w-24 h-24 object-contain mx-auto mb-3"
            />
            <h1 id="wizl-age-title" className="text-4xl font-black gradient-text mb-1">
              {tb("name")}
            </h1>
            <p className="text-sm gradient-love font-medium mb-1">{tb("tagline")}</p>
            <p className="text-text-muted text-xs mb-8">{tb("slogan")}</p>

            {denied ? (
              <div>
                <CircleX className="w-12 h-12 text-accent-orange mx-auto mb-4" />
                <p className="text-text-secondary mb-2">{t("denied")}</p>
                <p className="text-text-muted text-xs">{t("deniedNote")}</p>
              </div>
            ) : (
              <>
                <div className="bg-bg-primary/50 rounded-2xl p-5 mb-6 border border-border">
                  <ShieldCheck className="w-6 h-6 text-accent-green mx-auto mb-3" />
                  <p className="text-text-primary font-semibold mb-1">{t("question")}</p>
                  <p className="text-text-muted text-xs whitespace-pre-line">{t("note")}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDenied(true)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-bg-card border border-border text-text-secondary font-medium hover:bg-bg-card-hover transition-all"
                  >
                    {t("no")}
                  </button>
                  <button
                    type="button"
                    onClick={handleVerify}
                    className="flex-1 py-3 px-4 rounded-2xl bg-accent-green text-black font-bold hover:brightness-110 transition-all glow-green"
                  >
                    {t("yes")}
                  </button>
                </div>
                <p className="text-text-muted text-[10px] mt-4 leading-relaxed">{t("legal")}</p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
