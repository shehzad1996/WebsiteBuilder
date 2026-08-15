import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { setInquiryPreview } from "@/lib/inquiries";
import { buildPreviewLink } from "@/lib/slug";
import { emailConfigured, sendPreviewReadyEmail } from "@/lib/email";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin" ? user : null;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin auth isn't configured." }, { status: 503 });
  }
  if (!admin) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}) as Record<string, unknown>);
  const rawUrl = typeof body.previewUrl === "string" ? body.previewUrl.trim() : "";

  if (rawUrl) {
    try {
      new URL(rawUrl);
    } catch {
      return NextResponse.json({ error: "That doesn't look like a valid URL." }, { status: 400 });
    }
  }

  let inquiry;
  try {
    inquiry = await setInquiryPreview(params.id, rawUrl || null);
  } catch (err) {
    console.error("Failed to save preview:", err);
    return NextResponse.json({ error: "Couldn't save the preview link." }, { status: 500 });
  }

  const previewUrl = inquiry.previewUrl || buildPreviewLink(inquiry.slug);

  if (!emailConfigured()) {
    return NextResponse.json({ ok: true, previewUrl, emailed: false, emailError: null });
  }

  try {
    await sendPreviewReadyEmail({ to: inquiry.email, name: inquiry.name, previewUrl });
    return NextResponse.json({ ok: true, previewUrl, emailed: true, emailError: null });
  } catch (err) {
    // The link is saved either way — email failing shouldn't undo that.
    console.error("Failed to email preview link:", err);
    const message = err instanceof Error ? err.message : "Email failed to send.";
    return NextResponse.json({ ok: true, previewUrl, emailed: false, emailError: message });
  }
}
