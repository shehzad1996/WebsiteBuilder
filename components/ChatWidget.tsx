"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/lib/brand";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type Message = { role: "user" | "assistant"; content: string };

const GREETING: Message = {
  role: "assistant",
  content: `Hi! I'm the ${BRAND.name} assistant. Ask me about pricing, how it works, or anything else on the site — or jump straight to WhatsApp for a real person.`,
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, sending]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const next = [...messages, { role: "user", content: text } as Message];
    setMessages(next);
    setInput("");
    setError(null);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Try WhatsApp instead.");
        return;
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Couldn't reach the assistant. Try WhatsApp instead.");
    } finally {
      setSending(false);
    }
  }

  // Hand the conversation off to WhatsApp with context, so the human
  // picking it up on the other end can see what was already asked.
  const lastUserQuestion = [...messages].reverse().find((m) => m.role === "user")?.content;
  const whatsappHref = buildWhatsAppLink(
    lastUserQuestion
      ? `Hi, I was chatting on the website and wanted to continue here. My question was: "${lastUserQuestion}"`
      : undefined
  );

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[520px] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-night-soft shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 bg-night px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-white">{BRAND.name} assistant</p>
              <p className="text-[11px] text-white/40">Ask a question, or talk to a human</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-brand text-white"
                    : "bg-white/5 text-white/80"
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="max-w-[85%] rounded-2xl bg-white/5 px-3.5 py-2.5 text-sm text-white/40">
                Typing…
              </div>
            )}
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mx-3 mb-3 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-night transition hover:brightness-105"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Chat with a human on WhatsApp
          </a>

          <form onSubmit={sendMessage} className="flex gap-2 border-t border-white/10 px-3 py-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-full border border-white/10 bg-night px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-night transition hover:bg-white/90 disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <a
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with a human on WhatsApp"
          title="Chat with a human on WhatsApp"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-night shadow-xl transition hover:brightness-105"
        >
          <WhatsAppIcon className="h-6 w-6" />
        </a>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chat" : "Open chat"}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg text-white shadow-xl transition hover:brightness-110"
        >
          {open ? "✕" : "💬"}
        </button>
      </div>
    </div>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M16.04 2.67C8.87 2.67 3.05 8.5 3.05 15.66c0 2.45.68 4.75 1.85 6.72L2.67 29.33l7.14-2.2a13 13 0 0 0 6.23 1.59h.01c7.17 0 12.99-5.83 12.99-13S23.21 2.67 16.04 2.67Zm7.6 18.55c-.32.9-1.86 1.72-2.57 1.79-.68.07-1.42.35-4.77-1.02-4.04-1.65-6.63-5.75-6.83-6.01-.2-.27-1.62-2.16-1.62-4.12s1.02-2.92 1.38-3.32c.35-.4.77-.5 1.03-.5.26 0 .52.002.75.014.24.012.56-.09.87.66.32.77 1.09 2.66 1.19 2.85.1.2.16.42.03.68-.13.26-.2.42-.4.65-.2.23-.42.51-.6.68-.2.2-.41.41-.18.8.24.4 1.05 1.73 2.26 2.8 1.55 1.38 2.86 1.81 3.26 2.02.4.2.63.17.87-.1.24-.27 1-1.17 1.27-1.57.26-.4.53-.33.89-.2.36.13 2.28 1.08 2.67 1.27.4.2.66.3.76.46.1.17.1.97-.22 1.87Z" />
    </svg>
  );
}
