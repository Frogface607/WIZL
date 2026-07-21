"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { getAllWisdoms, getRandomWisdom, type WisdomLocale } from "@/lib/wizl-wisdoms";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const MAX_MESSAGES_PER_SESSION = 10;
const AVATAR_SRC = "/logo-mark-transparent.webp";
const AVATAR_CLASS = "w-full h-full object-contain object-center";

/** Strip markdown formatting and Perplexity citation refs from AI replies */
function cleanReply(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(\d+)\]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Rotating thinking-wisdom while the model responds */
function ThinkingBubble({ locale }: { locale: WisdomLocale }) {
  const wisdoms = getAllWisdoms("thinking", locale);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % wisdoms.length);
    }, 1800);
    return () => clearInterval(id);
  }, [wisdoms.length]);

  return (
    <div className="flex justify-start gap-2">
      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-0.5 border border-accent-purple/30">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={AVATAR_SRC}
          alt="WIZL"
          className={`${AVATAR_CLASS} animate-float`}
        />
      </div>
      <div className="bg-bg-primary rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm">
        <span className="text-text-secondary italic">{wisdoms[idx]}</span>
        <span className="inline-flex gap-0.5 ml-2 align-middle">
          <span className="w-1 h-1 rounded-full bg-accent-green animate-pulse-soft" style={{ animationDelay: "0ms" }} />
          <span className="w-1 h-1 rounded-full bg-accent-green animate-pulse-soft" style={{ animationDelay: "200ms" }} />
          <span className="w-1 h-1 rounded-full bg-accent-green animate-pulse-soft" style={{ animationDelay: "400ms" }} />
        </span>
      </div>
    </div>
  );
}

export default function AskWizl() {
  const locale = useLocale() as WisdomLocale;
  const t = useTranslations("ask");
  const quickSuggestions = [t("quick1"), t("quick2"), t("quick3")];
  const inputPlaceholders = [t("placeholder1"), t("placeholder2"), t("placeholder3")];
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholder = inputPlaceholders[placeholderIndex];

  useEffect(() => {
    setPlaceholderIndex(Math.floor(Math.random() * 3));
  }, [locale]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    if (messageCount >= MAX_MESSAGES_PER_SESSION) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: getRandomWisdom("farewell", { locale }),
        },
      ]);
      return;
    }

    const userMessage: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setMessageCount((c) => c + 1);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: cleanReply(data.reply), sources: data.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: getRandomWisdom("error", { locale }) },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messageCount, locale]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative mb-4">
      <div className="glass-card rounded-2xl overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <div className="w-9 h-9 rounded-full overflow-hidden border border-accent-purple/40 bg-bg-primary flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={AVATAR_SRC} alt="WIZL" className={AVATAR_CLASS} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-sm text-text-primary">{t("title")}</span>
          <span className="text-[10px] text-text-muted">{t("subtitle")}</span>
        </div>
      </div>

      {/* Messages area — only shows when there are messages */}
      {messages.length > 0 && (
        <div
          ref={scrollRef}
          className="overflow-y-auto px-4 py-3 space-y-3 hide-scrollbar max-h-[300px]"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } gap-2`}
            >
              {msg.role === "assistant" && (
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-0.5 border border-accent-purple/30 bg-bg-primary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={AVATAR_SRC} alt="WIZL" className={AVATAR_CLASS} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent-green/20 text-text-primary rounded-br-md"
                    : "bg-bg-primary text-text-secondary rounded-bl-md"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <p className="text-[10px] text-text-muted mb-1">{t("sources")}</p>
                    {msg.sources.map((src, j) => (
                      <a
                        key={j}
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-[10px] text-accent-green/70 hover:text-accent-green truncate"
                      >
                        {src}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && <ThinkingBubble locale={locale} />}
        </div>
      )}

      {/* Quick suggestions — only when no messages */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 px-4 py-3">
          {quickSuggestions.map((q) => (
            <button
              key={q}
              onClick={() => {
                setInput(q);
                inputRef.current?.focus();
              }}
              className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-accent-green hover:text-accent-green transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-3 border-t border-border">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={1000}
            disabled={isLoading}
            className="flex-1 bg-bg-primary border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-green/50 transition-colors disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-accent-green text-white hover:bg-accent-green/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label={t("send")}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {messageCount > 0 && (
          <p className="text-[10px] text-text-muted/60 text-center mt-1.5">
            {t("scrollsRemain", { count: MAX_MESSAGES_PER_SESSION - messageCount })}
          </p>
        )}
      </div>
      </div>
    </div>
  );
}
