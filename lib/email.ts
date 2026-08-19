import { BRAND } from "./brand";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Sends the "your preview is ready" email via Resend's HTTP API (no SDK
 * needed — one fetch call). Throws if Resend isn't configured or the send
 * fails; callers decide how to surface that (the admin route below still
 * saves the preview link either way, so a broken email never blocks the
 * link from existing).
 */
export async function sendPreviewReadyEmail(input: {
  to: string;
  name: string;
  previewUrl: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set.");
  }

  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${BRAND.name} <${from}>`,
      to: [input.to],
      subject: `Your website preview is ready — ${BRAND.name}`,
      html: renderPreviewEmail(input),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend request failed (${res.status}): ${detail}`);
  }
}

function renderPreviewEmail({ name, previewUrl }: { name: string; previewUrl: string }): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
      <p>Hi ${escapeHtml(name)},</p>
      <p>Your website is ready to look at — no payment required to view it.</p>
      <p style="margin: 24px 0;">
        <a href="${previewUrl}" style="background:#ff5a1f;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600;">
          Review your website
        </a>
      </p>
      <p>If it's not quite right yet, just reply to this email and tell us what to change — still free.</p>
      <p>— ${BRAND.name}</p>
    </div>
  `;
}

/**
 * Sends the internal "new inquiry" notification to the team the moment
 * someone submits at /inquiry, so it doesn't rely on checking /admin.
 * Same throw-on-failure contract as sendPreviewReadyEmail — the inquiry is
 * already saved by the time this is called, so a broken email never loses
 * the submission itself.
 */
export async function sendNewInquiryNotification(input: {
  name: string;
  email: string;
  phone?: string;
  projectName?: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  adminUrl: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set.");
  }

  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${BRAND.name} <${from}>`,
      to: [BRAND.contactEmail],
      reply_to: input.email,
      subject: `New inquiry — ${input.projectName || input.name}`,
      html: renderNewInquiryEmail(input),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend request failed (${res.status}): ${detail}`);
  }
}

function renderNewInquiryEmail(input: {
  name: string;
  email: string;
  phone?: string;
  projectName?: string;
  projectType: string;
  budget: string;
  timeline: string;
  description: string;
  adminUrl: string;
}): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; color: #111;">
      <p>New inquiry from <strong>${escapeHtml(input.name)}</strong>${
        input.projectName ? ` (${escapeHtml(input.projectName)})` : ""
      }.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 4px 0; color: #666;">Email</td><td style="padding: 4px 0;">${escapeHtml(input.email)}</td></tr>
        ${input.phone ? `<tr><td style="padding: 4px 0; color: #666;">Phone</td><td style="padding: 4px 0;">${escapeHtml(input.phone)}</td></tr>` : ""}
        <tr><td style="padding: 4px 0; color: #666;">Project type</td><td style="padding: 4px 0;">${escapeHtml(input.projectType)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Budget</td><td style="padding: 4px 0;">${escapeHtml(input.budget)}</td></tr>
        <tr><td style="padding: 4px 0; color: #666;">Timeline</td><td style="padding: 4px 0;">${escapeHtml(input.timeline)}</td></tr>
      </table>
      <p style="white-space: pre-wrap; background: #f5f5f5; border-radius: 8px; padding: 12px;">${escapeHtml(input.description)}</p>
      <p style="margin: 24px 0;">
        <a href="${input.adminUrl}" style="background:#ff5a1f;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600;">
          Open in admin
        </a>
      </p>
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
