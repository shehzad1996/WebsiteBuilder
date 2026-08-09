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
        <h1 className="text-2xl font-bold text-slate-900">Admin access</h1>
        <p className="mt-2 text-sm text-slate-600">
          Enter the admin key to view submitted inquiries.
        </p>
        <form method="GET" className="mt-6 flex gap-2">
          <input type="password" name="key" placeholder="Admin key" className="input" />
          <button
            type="submit"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Enter
          </button>
        </form>
      </section>
    );
  }

  const inquiries = await readInquiries();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-2xl font-bold text-slate-900">Inquiries ({inquiries.length})</h1>
      <p className="mt-2 text-sm text-slate-500">
        Stored locally in <code>data/inquiries.json</code>. Wire up a real
        database before relying on this in production (see README).
      </p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">AI features</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  No inquiries yet.
                </td>
              </tr>
            )}
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                  {new Date(inquiry.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">{inquiry.name}</td>
                <td className="px-4 py-3 text-slate-500">
                  <div>{inquiry.email}</div>
                  {inquiry.phone && <div>{inquiry.phone}</div>}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {inquiry.projectName && (
                    <div className="font-medium text-slate-700">{inquiry.projectName}</div>
                  )}
                  <div>{inquiry.projectType}</div>
                  <div className="text-xs text-slate-400">{inquiry.timeline}</div>
                </td>
                <td className="px-4 py-3 text-slate-500">{inquiry.budget}</td>
                <td className="px-4 py-3 text-slate-500">
                  {inquiry.aiFeatures.length ? inquiry.aiFeatures.join(", ") : "-"}
                </td>
                <td className="max-w-xs px-4 py-3 text-slate-500">{inquiry.description}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
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
