import { BRAND } from "./brand";

// Digits only, with country code, no "+", no spaces (e.g. "15551234567").
// Set NEXT_PUBLIC_WHATSAPP_NUMBER in Vercel — the button falls back to a
// placeholder number until it's configured, so it never breaks the build.
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
const PLACEHOLDER_NUMBER = "10000000000";

export function whatsappConfigured(): boolean {
  return Boolean(WHATSAPP_NUMBER);
}

const DEFAULT_MESSAGE = `Hi ${BRAND.name}, I'd like to talk to someone about a website.`;

export function buildWhatsAppLink(message?: string): string {
  const number = WHATSAPP_NUMBER || PLACEHOLDER_NUMBER;
  const text = encodeURIComponent(message?.trim() || DEFAULT_MESSAGE);
  return `https://wa.me/${number}?text=${text}`;
}
