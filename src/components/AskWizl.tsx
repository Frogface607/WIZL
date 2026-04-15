"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const MAX_MESSAGES_PER_SESSION = 10;

export default function AskWizl() {
  const locale = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
          content:
            "You've reached the message limit for this session. Refresh the page to start a new conversation!",
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
        { role: "assistant", content: data.reply, sources: data.sources },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            err instanceof Error
              ? `Oops: ${err.message}`
              : "Something went wrong. Try again!",
        },
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
    <div className="glass-card rounded-2xl overflow-hidden mb-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="w-7 h-7 rounded-full overflow-hidden border border-accent-purple/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/mascot.png" alt="WIZL" className="w-full h-full object-cover object-top" />
        </div>
        <span className="font-semibold text-sm text-text-primary">
          Ask WIZL
        </span>
        <span className="text-xs text-text-muted ml-auto">
          {MAX_MESSAGES_PER_SESSION - messageCount} left
        </span>
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
                <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-0.5 border border-accent-purple/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/mascot.png" alt="WIZL" className="w-full h-full object-cover object-top" />
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
                    <p className="text-[10px] text-text-muted mb-1">Sources:</p>
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

          {isLoading && (
            <div className="flex justify-start gap-2">
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-0.5 border border-accent-purple/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/mascot.png" alt="WIZL" className="w-full h-full object-cover object-top" />
              </div>
              <div className="bg-bg-primary rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-accent-green" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick suggestions — only when no messages */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 px-4 py-3">
          {[
            "Best for sleep?",
            "Tell me about OG Kush",
            "Sativa vs Indica?",
          ].map((q) => (
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
            placeholder="Ask about any strain..."
            maxLength={1000}
            disabled={isLoading}
            className="flex-1 bg-bg-primary border border-border rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent-green/50 transition-colors disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-xl bg-accent-green text-white hover:bg-accent-green/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
