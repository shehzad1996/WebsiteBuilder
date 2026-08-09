import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    // Supabase auth not configured — nothing to sign out of.
  }

  return NextResponse.redirect(new URL("/", request.url));
}
