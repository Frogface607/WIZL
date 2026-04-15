"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Check, Loader2, Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function AuthPrompt() {
  const t = useTranslations("auth");
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === "sending") return;

    setStatus("sending");
    setErrorMsg("");

    const { error } = await signInWithEmail(email.trim());

    if (error) {
      setStatus("error");
      setErrorMsg(error);
    } else {
      setStatus("sent");
    }
  };

  if (status === "sent") {
    return (
      <div className="glass-card rounded-2xl p-5 text-center">
        <div className="w-12 h-12 rounded-full bg-accent-green/20 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-accent-green" />
        </div>
        <h3 className="font-bold text-sm mb-1">{t("checkEmail")}</h3>
        <p className="text-text-muted text-xs">{t("magicLinkSent")}</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-accent-purple/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-accent-purple" />
        </div>
        <div>
          <h3 className="font-bold text-sm">{t("saveAccount")}</h3>
          <p className="text-text-muted text-xs">{t("saveAccountDesc")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className="w-full pl-9 pr-3 py-2.5 bg-bg-primary rounded-xl text-sm text-text-primary placeholder:text-text-muted border border-white/5 focus:border-accent-green/40 focus:outline-none transition-colors"
            required
            disabled={status === "sending"}
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending" || !email.trim()}
          className="px-4 py-2.5 bg-accent-green text-black font-bold text-sm rounded-xl hover:bg-accent-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === "sending" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t("sendLink")
          )}
        </button>
      </form>

      {status === "error" && errorMsg && (
        <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
      )}

      <p className="text-text-muted text-[10px] mt-3">{t("noPassword")}</p>
    </div>
  );
}
