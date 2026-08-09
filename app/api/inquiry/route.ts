import { NextRequest, NextResponse } from "next/server";
import { addInquiry } from "@/lib/inquiries";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const aiFeatures = Array.isArray(body.aiFeatures)
    ? body.aiFeatures.map((v) => String(v))
    : [];

  const inquiry = await addInquiry({
    name,
    email,
    phone: body.phone ? String(body.phone).trim() : undefined,
    projectName: body.projectName ? String(body.projectName).trim() : undefined,
    projectType: String(body.projectType ?? "Not sure"),
    budget: String(body.budget ?? "Not sure"),
    timeline: String(body.timeline ?? "Not sure"),
    aiFeatures,
    description,
  });

  // TODO: send a notification email (e.g. via Resend) to the team and a
  // confirmation email to the customer once an email provider is wired up.

  return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
}
