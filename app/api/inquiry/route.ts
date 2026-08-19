import { NextRequest, NextResponse } from "next/server";
import { addInquiry } from "@/lib/inquiries";
import { createClient } from "@/lib/supabase/server";
import { buildPreviewLink, buildSiteUrl } from "@/lib/slug";
import { emailConfigured, sendNewInquiryNotification } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The signed-in user's id, if any — or undefined if signed out or if
 * Supabase auth isn't configured. Submitting stays open either way. */
async function currentUserId(): Promise<string | undefined> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id;
  } catch {
    return undefined;
  }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const description = String(body.description ?? "").trim();

  if (!name || !email || !description) {
    return NextResponse.json(
      { error: "Name, email, and a description of the project are required." },
      { status: 400 }
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  let inquiry;
  try {
    inquiry = await addInquiry({
      name,
      email,
      phone: body.phone ? String(body.phone).trim() : undefined,
      projectName: body.projectName ? String(body.projectName).trim() : undefined,
      projectType: String(body.projectType ?? "Not sure"),
      budget: String(body.budget ?? "Not sure"),
      timeline: String(body.timeline ?? "Not sure"),
      description,
      userId: await currentUserId(),
    });
  } catch (err) {
    console.error("Failed to save inquiry:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your inquiry. Please email us directly and we'll pick it up from there." },
      { status: 500 }
    );
  }

  // Notify the team the moment a new inquiry comes in, so it doesn't rely
  // on someone remembering to check /admin. Best-effort: the inquiry is
  // already saved above, so a broken notification email never loses the
  // submission — it's just not surfaced until /admin is checked manually.
  // (Distinct from the customer-facing "your preview is ready" email,
  // which is sent later from /admin once a human has actually built it.)
  if (emailConfigured()) {
    try {
      await sendNewInquiryNotification({
        name,
        email,
        phone: body.phone ? String(body.phone).trim() : undefined,
        projectName: body.projectName ? String(body.projectName).trim() : undefined,
        projectType: String(body.projectType ?? "Not sure"),
        budget: String(body.budget ?? "Not sure"),
        timeline: String(body.timeline ?? "Not sure"),
        description,
        adminUrl: `${buildSiteUrl()}/admin`,
      });
    } catch (err) {
      console.error("Failed to send new-inquiry notification:", err);
    }
  }

  return NextResponse.json(
    { ok: true, id: inquiry.id, previewUrl: buildPreviewLink(inquiry.slug) },
    { status: 201 }
  );
}
