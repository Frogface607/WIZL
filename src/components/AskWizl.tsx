"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const MAX_MESSAGES_PER_SESSION = 10;

export default function AskWizl() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-accent-green text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all ${
          isOpen ? "hidden" : ""
        }`}
        aria-label="Ask WIZL"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col max-h-[80vh] sm:max-h-[70vh] sm:max-w-md sm:right-4 sm:left-auto sm:bottom-4 sm:rounded-2xl overflow-hidden glass-card border border-border shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-card/80">
            <div className="flex items-center gap-2">
              <span className="text-base">🧙‍♂️</span>
              <span className="font-semibold text-sm text-text-primary">
                WIZL The Wizard
              </span>
              <span className="text-xs text-text-muted">
                {MAX_MESSAGES_PER_SESSION - messageCount} left
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-bg-card-hover transition-colors text-text-muted"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 hide-scrollbar min-h-[200px]"
          >
            {messages.length === 0 && (
              <div className="text-center text-text-muted text-sm py-8 space-y-2">
                <p className="text-3xl">🧙‍♂️</p>
                <p className="text-lg">Welcome to the Space, traveler!</p>
                <p>
                  I&apos;m WIZL The Wizard — ask me about any strain, effects,
                  terpenes, or get a recommendation.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {[
                    "Best strains for creativity?",
                    "Tell me about OG Kush",
                    "Indica vs Sativa?",
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
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } gap-2`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-accent-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm">🧙‍♂️</span>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-accent-green/20 text-text-primary rounded-br-md"
                      : "bg-bg-card text-text-secondary rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-[10px] text-text-muted mb-1">
                        Sources:
                      </p>
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
              <div className="flex justify-start">
                <div className="bg-bg-card rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-accent-green" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-border bg-bg-card/50">
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
      )}
    </>
  );
}
