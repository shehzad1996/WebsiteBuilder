"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/account`,
      },
    });

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    // Email confirmations off on the project → Supabase returns an
    // active session immediately, nothing to wait for.
    if (data.session) {
      window.location.href = "/account";
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <section className="mx-auto max-w-sm px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-white">Check your email</h1>
        <p className="mt-4 text-white/55">
          We sent a confirmation link to {email}. Click it to activate your
          account, then log in.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-sm px-6 py-24">
      <h1 className="text-3xl font-bold text-white">Create an account</h1>
      <p className="mt-3 text-white/55">
        Track the status of your website inquiries in one place.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-white/70">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input mt-1"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-white/70">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mt-1"
          />
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-white px-8 py-3 text-sm font-semibold text-night transition hover:bg-white/90 disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-white/40">
        Already have an account?{" "}
        <Link href="/login" className="text-brand-light hover:underline">
          Log in
        </Link>
      </p>
    </section>
  );
}
