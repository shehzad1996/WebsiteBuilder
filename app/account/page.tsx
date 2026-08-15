import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buildPreviewLink } from "@/lib/slug";

export default async function AccountPage() {
  let supabase;
  try {
    supabase = createClient();
  } catch {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-white">Accounts aren&apos;t set up yet</h1>
        <p className="mt-3 text-sm text-white/50">
          Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable login (see README).
        </p>
      </section>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // RLS ("Users can view own inquiries") scopes this to the signed-in
  // user's own rows automatically.
  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-2xl font-bold text-white">Your inquiries</h1>
      <p className="mt-2 text-sm text-white/40">Signed in as {user.email}</p>

      {error && (
        <p className="mt-6 text-sm text-red-400">
          Couldn&apos;t load your inquiries: {error.message}
        </p>
      )}

      {!error && (!inquiries || inquiries.length === 0) && (
        <div className="mt-8 rounded-xl border border-white/10 bg-night-soft/50 p-8 text-center">
          <p className="text-white/50">You haven&apos;t submitted an inquiry yet.</p>
          <Link
            href="/inquiry"
            className="mt-4 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-night hover:bg-white/90"
          >
            Submit one
          </Link>
        </div>
      )}

      {!error && inquiries && inquiries.length > 0 && (
        <div className="mt-8 space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="rounded-xl border border-white/10 bg-night-soft/50 p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-white">
                  {inquiry.project_name || inquiry.project_type}
                </p>
                <span className="rounded-full bg-night-alt px-2.5 py-1 text-xs font-medium text-white/60">
                  {inquiry.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/50">{inquiry.description}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-white/30">
                  Submitted {new Date(inquiry.created_at).toLocaleString()}
                </p>
                <a
                  href={inquiry.preview_url || buildPreviewLink(inquiry.slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 hover:border-white/30"
                >
                  View preview ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
