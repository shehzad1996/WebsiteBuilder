"use client";

import { useState } from "react";
import Link from "next/link";

const PROJECT_TYPES = [
  "New website",
  "Redesign of an existing website",
  "Something more complex (e-commerce, custom features)",
  "Hosting & maintenance only",
  "Not sure, I'd like a consultation",
];

const BUDGETS = [
  "Under $100",
  "$100 - $500",
  "$500 - $1,500",
  "$1,500 - $5,000",
  "Not sure yet",
];

const TIMELINES = ["ASAP", "Within 2 weeks", "Within a month", "No rush"];

export default function InquiryPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      projectName: formData.get("projectName"),
      projectType: formData.get("projectType"),
      budget: formData.get("budget"),
      timeline: formData.get("timeline"),
      description: formData.get("description"),
    };

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      setPreviewUrl(data.previewUrl ?? null);
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-white">Thanks, we&apos;ve got it!</h1>
        <p className="mt-4 text-white/55">
          A developer will pick this up and start putting your free preview
          together. We&apos;ll email you the link the moment it&apos;s ready.
          You don&apos;t pay anything until you&apos;ve seen it and you&apos;re
          happy.
        </p>

        {previewUrl && (
          <div className="mt-8 rounded-xl border border-white/10 bg-night-soft/50 p-5 text-left">
            <p className="text-xs font-medium uppercase tracking-widest text-brand-light">
              Your link — bookmark it
            </p>
            <p className="mt-2 text-sm text-white/60">
              This link is yours whether or not you make an account. It shows what
              you told us right now, and turns into your real site automatically
              once a developer publishes it.
            </p>
            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block truncate rounded-lg border border-white/10 bg-night px-3 py-2 text-sm text-brand-light hover:underline"
            >
              {previewUrl}
            </a>
          </div>
        )}

        <p className="mt-6 text-sm text-white/40">
          Want to track it from an account instead?{" "}
          <Link href="/signup" className="text-brand-light hover:underline">
            Create an account
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Tell us what you want built</h1>
      <p className="mt-3 text-white/55">
        Describe it in your own words &mdash; that&apos;s the main thing we
        need. A real developer reads it and builds it. No payment, no
        commitment, you only decide once you&apos;ve seen it.
      </p>
      <p className="mt-2 text-sm text-white/35">
        No account needed &mdash; just an email address, so we can send you the
        link to review it.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <Field label="Describe what you want" required>
          <textarea
            name="description"
            required
            rows={5}
            className="input"
            placeholder="e.g. A website for my takeaway shop with an online menu and order form..."
          />
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Your name" required>
            <input name="name" required className="input" />
          </Field>
          <Field label="Email" required>
            <input type="email" name="email" required className="input" />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Phone (optional)">
            <input name="phone" className="input" />
          </Field>
          <Field label="Business / project name (optional)">
            <input name="projectName" className="input" />
          </Field>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="What do you need?">
            <select name="projectType" className="input" defaultValue={PROJECT_TYPES[0]}>
              {PROJECT_TYPES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Budget">
            <select name="budget" className="input" defaultValue={BUDGETS[0]}>
              {BUDGETS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Timeline">
          <select name="timeline" className="input" defaultValue={TIMELINES[0]}>
            {TIMELINES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-white px-8 py-3 text-sm font-semibold text-night transition hover:bg-white/90 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit inquiry, it's free"}
        </button>
      </form>
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-white/70">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
