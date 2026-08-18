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
  const apiKey = process.env.OPENROUTER_API_KEY;
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

  // Free OpenRouter models share a rate-limited pool upstream and 429
  // unpredictably. Rather than depend on one model, try a short list of
  // free general-purpose models in order and use whichever answers first.
  // An env override always goes first; duplicates are dropped.
  const candidateModels = Array.from(
    new Set(
      [
        process.env.OPENROUTER_MODEL,
        "z-ai/glm-5.2:free",
        "nvidia/nemotron-3-super:free",
        "nvidia/nemotron-3.5-lightning:free",
        "google/gemma-4-26b-a4b:free",
        "nvidia/nemotron-nano-9b-v2:free",
        "nvidia/nemotron-3-nano-30b-a3b:free",
      ].filter((m): m is string => Boolean(m))
    )
  );

  const requestMessages = [
    { role: "system", content: systemPrompt },
    ...trimmed.map((m) => ({ role: m.role, content: m.content })),
  ];
  const requestHeaders = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    // Optional but recommended by OpenRouter for attribution/rankings.
    "HTTP-Referer": "https://websitedevelopers.online",
    "X-Title": BRAND.name,
  };

  const attemptErrors: string[] = [];

  for (const model of candidateModels) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({ model, max_tokens: 400, messages: requestMessages }),
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        attemptErrors.push(`${model}: ${res.status} ${detail}`);
        // 401/403 means the API key itself is bad — no other model will
        // succeed either, so stop trying instead of burning through the list.
        if (res.status === 401 || res.status === 403) break;
        continue;
      }

      const data = await res.json();
      const reply: string | undefined = data?.choices?.[0]?.message?.content;
      if (!reply) {
        attemptErrors.push(`${model}: empty response`);
        continue;
      }

      return NextResponse.json({ reply, model });
    } catch (err) {
      attemptErrors.push(`${model}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.error("All OpenRouter chat models failed", attemptErrors.join(" | "));
  return NextResponse.json(
    {
      error:
        "The assistant is having trouble right now. Use the WhatsApp button instead.",
    },
    { status: 502 }
  );
}
