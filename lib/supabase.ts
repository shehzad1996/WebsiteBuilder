import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service role key, which bypasses
 * Row Level Security. Never import this from a "use client" component or
 * expose the service role key to the browser bundle.
 */
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
