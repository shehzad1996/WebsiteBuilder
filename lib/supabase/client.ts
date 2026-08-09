"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client, authenticated as the signed-in user (or
 * anonymous). Uses the public anon key, so it's safe to call from client
 * components. Subject to the RLS policies in supabase/migrations.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
