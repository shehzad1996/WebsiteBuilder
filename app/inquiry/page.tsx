"use client";

import { useState } from "react";

const PROJECT_TYPES = [
  "New website",
  "Redesign of an existing website",
  "AI agent or custom AI service",
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

const AI_FEATURES = [
  "AI chatbot for my website",
  "AI agent / automation",
  "My own AI-powered product",
  "Local / self-hosted models",
  "None of these",
];

export default function InquiryPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
      aiFeatures: formData.getAll("aiFeatures"),
      description: formData.get("description"),
    };

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

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
          Our team will start putting your free preview together. We&apos;ll
          reach out by email with a working site and your quote. You
          don&apos;t pay anything until you&apos;ve seen it and you&apos;re
          happy.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Tell us what you want built</h1>
      <p className="mt-3 text-white/55">
        A couple of minutes now gets you a real, working website built for
        free. No payment, no commitment, you only decide once you&apos;ve
        seen it.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
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

        <fieldset>
          <legend className="text-sm font-medium text-white/70">
            Interested in any AI features?
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {AI_FEATURES.map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm text-white/60">
                <input
                  type="checkbox"
                  name="aiFeatures"
                  value={option}
                  className="h-4 w-4 rounded border-night-border bg-night-alt text-brand"
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Describe what you want" required>
          <textarea
            name="description"
            required
            rows={5}
            className="input"
            placeholder="e.g. A website for my takeaway shop with an online menu and order form..."
          />
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
