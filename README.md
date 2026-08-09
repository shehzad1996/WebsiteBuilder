# PixelHuman — Website Builder Inquiry Platform

> Website builder prices. Human-built quality.

A marketing site + inquiry pipeline for a website agency: visitors describe
what they want in their own words, a human developer builds it for free,
and they only pay once they see the real thing.

## What's in here

- **Landing page** (`app/page.tsx`) — value proposition, pricing tiers
  ($50 starter through $1,000–$5,000 custom), testimonials, and the
  how-it-works flow.
- **Inquiry form** (`app/inquiry/page.tsx` + `app/api/inquiry/route.ts`) —
  a free-text description plus project type, budget, and timeline, and
  stores each submission (tagged to the signed-in user, if any).
- **Customer login** (`app/login`, `app/signup`, `app/account`) — visitors
  can create an account and see the status of the inquiries they've
  submitted at `/account`.
- **Admin login + dashboard** (`app/admin/login`, `app/admin/page.tsx`) —
  a real, role-gated login (no more `?key=` in the URL) for your team to
  see every submitted inquiry.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit `http://localhost:3000`. The landing page and inquiry form work
immediately with zero setup — inquiries fall back to a temp-file store
when Supabase isn't configured (see Storage below). Login/signup and the
admin dashboard require a real Supabase project (auth needs somewhere to
keep accounts), so set one up when you're ready:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard's **SQL Editor**, run, in order:
   - `supabase/migrations/0001_inquiries.sql` — creates the `inquiries` table.
   - `supabase/migrations/0002_auth_and_profiles.sql` — adds the `profiles`
     table, links inquiries to the submitting user, and sets up RLS so
     users only ever see their own inquiries while admins see everything.
3. In **Settings → API**, copy the **Project URL**, the **anon public**
   key, and the **service_role** key.
4. Set all four in `.env.local` (or your Vercel project's Environment
   Variables): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Sign up at `/signup` with the email in `lib/brand.ts`'s
   `contactEmail` (`shehzaddarbar1996@gmail.com` by default) — the
   `0002` migration automatically grants that email the `admin` role on
   first signup. Everyone else who signs up gets a plain `user` account.
   Promote further admins later with:
   ```sql
   update profiles set role = 'admin' where email = 'someone@example.com';
   ```

## Storage

`lib/inquiries.ts` picks its backend at call time: **Supabase Postgres**
when `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are set, otherwise a JSON
file in the OS temp dir. The file fallback keeps the landing page and
inquiry form working with no setup, but doesn't persist reliably across
serverless instances (treat it as a demo mode) — and login, `/account`,
and `/admin` need real Supabase auth regardless, so they show a short
setup message instead of trying to fall back.

`SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security and is used
**server-only** — it's read in `lib/supabase.ts`, which is never imported
from a `"use client"` file, so it's not exposed to the browser bundle.
Login, signup, `/account`, and `/admin` use the **anon key** instead
(`lib/supabase/client.ts`, `lib/supabase/server.ts`), scoped by the RLS
policies in `supabase/migrations/0002_auth_and_profiles.sql` — a signed-in
user only ever sees their own inquiries; only an `admin`-role profile sees
all of them.

## Roadmap / not yet built

This is a first working version of the platform. Suggested next steps:

- **Email notifications** — notify your team and the customer on
  submission (e.g. via Resend). Hook point is marked with a `TODO` in
  `app/api/inquiry/route.ts`.
- **Quoting workflow** — a way for your team to turn an inquiry into a
  quote plus a live preview link the customer can review.
- **Payments** — Stripe (or similar) once a customer approves their quote.
- **Retroactive linking** — inquiries submitted anonymously before a
  visitor creates an account aren't linked to it automatically; only
  inquiries submitted while signed in show up on `/account`.

## Rebranding

The brand name, tagline, and contact email live in `lib/brand.ts` — change
them there and they update across the whole site.
