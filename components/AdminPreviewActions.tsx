"use client";

import { useState } from "react";

export default function AdminPreviewActions({
  inquiryId,
  autoPreviewUrl,
  savedPreviewUrl,
}: {
  inquiryId: string;
  /** The auto-generated /preview/<slug> link — always exists. */
  autoPreviewUrl: string;
  /** The human-built override, if one's been set. */
  savedPreviewUrl?: string;
}) {
  const [url, setUrl] = useState(savedPreviewUrl ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previewUrl: url }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      if (data.emailed) {
        setMessage("Saved and emailed to the customer.");
      } else if (data.emailError) {
        setMessage(`Saved, but the email failed: ${data.emailError}`);
      } else {
        setMessage("Saved. (Email isn't configured yet — copy the link below to send it yourself.)");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={autoPreviewUrl}
          className="input !mt-0 !py-1.5 !text-xs"
        />
        <button
          type="submit"
          disabled={submitting}
          className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-night hover:bg-white/90 disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Save & email"}
        </button>
      </div>
      <a
        href={autoPreviewUrl}
        target="_blank"
        rel="noreferrer"
        className="text-[11px] text-white/30 hover:text-white/60"
      >
        View auto-preview ↗
      </a>
      {message && <p className="text-[11px] text-brand-light">{message}</p>}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </form>
  );
}
