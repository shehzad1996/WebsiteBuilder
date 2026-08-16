import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabase } from "@/lib/supabase";

/**
 * Self-service account deletion. Deleting the auth.users row cascades to
 * `profiles` (on delete cascade) and un-links the person's `inquiries`
 * rows (on delete set null) rather than deleting them — see
 * supabase/migrations/0002_auth_and_profiles.sql. The business still has
 * the inquiry to follow up on; it's just no longer tied to an account.
 */
export async function POST() {
  let supabase;
  try {
    supabase = createClient();
  } catch {
    return NextResponse.json({ error: "Accounts aren't configured." }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    const admin = getSupabase();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;
  } catch (err) {
    console.error("Failed to delete account:", err);
    return NextResponse.json(
      { error: "Couldn't delete your account. Please try again." },
      { status: 500 }
    );
  }

  try {
    await supabase.auth.signOut();
  } catch {
    // The session token may already be invalid post-deletion — either way
    // the account is gone, which is what matters.
  }

  return NextResponse.json({ ok: true });
}
