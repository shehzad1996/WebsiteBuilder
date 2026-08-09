# PixelHuman — Website Builder Inquiry Platform

> Website builder prices. Human-built quality.

A marketing site + inquiry pipeline for an "AI price, human-built" website
agency: visitors submit what they want, your dev team builds it for free,
and they only pay once they see the real thing.

## What's in here

- **Landing page** (`app/page.tsx`) — value proposition, pricing tiers
  ($50 starter through $1,000–$5,000 AI/custom), how-it-works flow, and an
  AI/automation section.
- **Inquiry form** (`app/inquiry/page.tsx` + `app/api/inquiry/route.ts`) —
  captures project type, budget, timeline, and desired AI features, and
  stores each submission.
- **Admin view** (`app/admin/page.tsx`) — a key-gated page for your team to
  see submitted inquiries. Visit `/admin?key=YOUR_ADMIN_KEY`.

## Getting started

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard's **SQL Editor**, run
   `supabase/migrations/0001_inquiries.sql` to create the `inquiries` table.
3. In **Settings → API**, copy the **Project URL** and the **service_role**
   key (not the anon key — the service role key is required server-side).

```bash
npm install
cp .env.example .env.local
# set ADMIN_KEY, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY in .env.local
npm run dev
```

Visit `http://localhost:3000`. Set the same three variables in your Vercel
project's Environment Variables before deploying.

## Storage

Inquiries are stored in Supabase Postgres via `lib/inquiries.ts`
(`readInquiries` / `addInquiry`). `SUPABASE_SERVICE_ROLE_KEY` bypasses Row
Level Security and is used **server-only** — it's read in `lib/supabase.ts`,
which is never imported from a `"use client"` file, so it's not exposed to
the browser bundle. Don't add a public/anon RLS policy to the `inquiries`
table; it should only be reachable through the service role key.

## Roadmap / not yet built

This is a first working version of the platform. Suggested next steps:

- **Real admin auth** — the current `/admin?key=...` gate is a placeholder,
  not real authentication.
- **Email notifications** — notify your team and the customer on
  submission (e.g. via Resend). Hook point is marked with a `TODO` in
  `app/api/inquiry/route.ts`.
- **Quoting workflow** — a way for your team to turn an inquiry into a
  quote plus a live preview link the customer can review.
- **Live AI editor** — the "edit your site in real time with AI" experience
  described on the landing page (e.g. backed by the DeepSeek API or your own
  agent tooling) is not implemented yet; this repo currently covers the
  marketing site and inquiry intake.
- **Payments** — Stripe (or similar) once a customer approves their quote.

## Rebranding

The brand name, tagline, and contact email live in `lib/brand.ts` — change
them there and they update across the whole site.
