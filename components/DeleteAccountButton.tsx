"use client";

import { useState } from "react";

export default function DeleteAccountButton() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete your account? This can't be undone. Any inquiries you've submitted stay on file so we can still follow up on them — they just won't be linked to an account anymore."
    );
    if (!confirmed) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Network error — please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-12 rounded-xl border border-red-500/20 bg-red-500/5 p-6">
      <h2 className="text-sm font-semibold text-red-300">Danger zone</h2>
      <p className="mt-2 text-sm text-white/50">
        Deleting your account removes your login for good. Your submitted
        inquiries stay on file so we can still finish or follow up on them.
      </p>
      <button
        onClick={handleDelete}
        disabled={submitting}
        className="mt-4 rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-60"
      >
        {submitting ? "Deleting..." : "Delete my account"}
      </button>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
