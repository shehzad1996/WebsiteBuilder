import { readInquiries } from "@/lib/inquiries";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const adminKey = process.env.ADMIN_KEY ?? "changeme";
  const providedKey = searchParams.key;

  if (!providedKey || providedKey !== adminKey) {
    return (
      <section className="mx-auto max-w-md px-6 py-24">
        <h1 className="text-2xl font-bold text-white">Admin access</h1>
        <p className="mt-2 text-sm text-white/50">
          Enter the admin key to view submitted inquiries.
        </p>
        <form method="GET" className="mt-6 flex gap-2">
          <input type="password" name="key" placeholder="Admin key" className="input" />
          <button
            type="submit"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-night hover:bg-white/90"
          >
            Enter
          </button>
        </form>
      </section>
    );
  }

  let inquiries: Awaited<ReturnType<typeof readInquiries>> = [];
  let loadError: string | null = null;
  try {
    inquiries = await readInquiries();
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Could not load inquiries.";
  }

  if (loadError) {
    return (
      <section className="mx-auto max-w-xl px-6 py-24">
        <h1 className="text-2xl font-bold text-white">Database not connected</h1>
        <p className="mt-3 text-sm text-white/50">{loadError}</p>
        <p className="mt-3 text-sm text-white/40">
          Set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> in
          your environment, and run the migration in{" "}
          <code>supabase/migrations/0001_inquiries.sql</code> against your
          Supabase project.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-2xl font-bold text-white">Inquiries ({inquiries.length})</h1>
      <p className="mt-2 text-sm text-white/40">
        Backed by Supabase Postgres.
      </p>

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
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-white/30">
                  No inquiries yet.
                </td>
              </tr>
            )}
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td className="whitespace-nowrap px-4 py-3 text-white/50">
                  {new Date(inquiry.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-medium text-white">{inquiry.name}</td>
                <td className="px-4 py-3 text-white/50">
                  <div>{inquiry.email}</div>
                  {inquiry.phone && <div>{inquiry.phone}</div>}
                </td>
                <td className="px-4 py-3 text-white/50">
                  {inquiry.projectName && (
                    <div className="font-medium text-white/80">{inquiry.projectName}</div>
                  )}
                  <div>{inquiry.projectType}</div>
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
