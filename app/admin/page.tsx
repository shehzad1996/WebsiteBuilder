import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  let supabase;
  try {
    supabase = createClient();
  } catch {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-white">Admin isn&apos;t set up yet</h1>
        <p className="mt-3 text-sm text-white/50">
          Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, then run{" "}
          <code>supabase/migrations/0002_auth_and_profiles.sql</code> (see README).
        </p>
      </section>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <section className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-white">Not authorized</h1>
        <p className="mt-3 text-sm text-white/50">
          {user.email} is signed in but isn&apos;t an admin.
        </p>
        <form action="/auth/signout" method="POST" className="mt-6">
          <button
            type="submit"
            className="rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold text-white/80 hover:border-white/30"
          >
            Sign out
          </button>
        </form>
      </section>
    );
  }

  // RLS ("Admins can view all inquiries") lets this admin see every row.
  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Inquiries ({inquiries?.length ?? 0})</h1>
        <form action="/auth/signout" method="POST">
          <button
            type="submit"
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/60 hover:border-white/30"
          >
            Sign out
          </button>
        </form>
      </div>
      <p className="mt-2 text-sm text-white/40">Signed in as {user.email}</p>

      {error && (
        <p className="mt-6 text-sm text-red-400">
          Couldn&apos;t load inquiries: {error.message}
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl border border-night-border">
        <table className="min-w-full divide-y divide-night-border text-sm">
          <thead className="bg-night-soft text-left text-xs font-semibold uppercase text-white/40">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-night-border bg-night">
            {(!inquiries || inquiries.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-white/30">
                  No inquiries yet.
                </td>
              </tr>
            )}
            {inquiries?.map((inquiry) => (
              <tr key={inquiry.id}>
                <td className="whitespace-nowrap px-4 py-3 text-white/50">
                  {new Date(inquiry.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-medium text-white">{inquiry.name}</td>
                <td className="px-4 py-3 text-white/50">
                  <div>{inquiry.email}</div>
                  {inquiry.phone && <div>{inquiry.phone}</div>}
                </td>
                <td className="px-4 py-3 text-white/50">
                  {inquiry.project_name && (
                    <div className="font-medium text-white/80">{inquiry.project_name}</div>
                  )}
                  <div>{inquiry.project_type}</div>
                  <div className="text-xs text-white/30">{inquiry.timeline}</div>
                </td>
                <td className="px-4 py-3 text-white/50">{inquiry.budget}</td>
                <td className="max-w-xs px-4 py-3 text-white/50">{inquiry.description}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-night-alt px-2 py-1 text-xs font-medium text-white/60">
                    {inquiry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
