import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { BRAND } from "@/lib/brand";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

let cachedKnowledge: string | null = null;

async function loadKnowledge(): Promise<string> {
  if (cachedKnowledge) return cachedKnowledge;
  const filePath = path.join(process.cwd(), "docs", "website-knowledge.md");
  cachedKnowledge = await readFile(filePath, "utf-8");
  return cachedKnowledge;
}

function isChatMessage(value: unknown): value is ChatMessage {
  return (
    typeof value === "object" &&
    value !== null &&
    (("role" in value && (value as any).role === "user") ||
      (value as any).role === "assistant") &&
    typeof (value as any).content === "string"
  );
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Chat isn't set up yet. Use the WhatsApp button below to reach us instead.",
      },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const messages: ChatMessage[] = Array.isArray(body?.messages)
    ? body.messages.filter(isChatMessage)
    : [];

  if (messages.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  // Keep the payload small — only the recent turns matter for a support chat.
  const trimmed = messages.slice(-12);
  const knowledge = await loadKnowledge().catch(() => "");

  const systemPrompt = `You are the on-site assistant for ${BRAND.name}, a website-building agency. Answer visitor questions using ONLY the information below. Keep replies short — a few sentences, friendly and direct, not an essay. If someone wants a firm quote, wants to talk to a real person, or asks something you can't answer from this information, tell them to use the "Chat with a human on WhatsApp" button in this chat window. Never invent pricing, timelines, or policies that aren't in the information below.

---
${knowledge}
---`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: systemPrompt,
        messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Anthropic chat request failed", res.status, detail);
      return NextResponse.json(
        {
          error:
            "The assistant is having trouble right now. Use the WhatsApp button instead.",
        },
        { status: 502 }
      );
    }

    const data = await res.json();
    const reply: string =
      data?.content?.find((block: { type: string }) => block.type === "text")
        ?.text ??
      "Sorry, I couldn't put together an answer to that — try WhatsApp and a person will help.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat route error", err);
    return NextResponse.json(
      {
        error:
          "The assistant is having trouble right now. Use the WhatsApp button instead.",
      },
      { status: 500 }
    );
  }
}
