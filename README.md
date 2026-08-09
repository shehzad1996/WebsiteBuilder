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

```bash
npm install
cp .env.example .env.local   # set ADMIN_KEY to something private
npm run dev
```

Visit `http://localhost:3000`.

## Storage — read before deploying

Inquiries are currently stored in `data/inquiries.json` via
`lib/inquiries.ts`. This is fine for local development or a small
self-hosted server, but **will not persist reliably on serverless hosting**
(e.g. Vercel), since the filesystem there is read-only/ephemeral outside a
single request.

Before going live, swap `lib/inquiries.ts` for a real database — Postgres
via Supabase is a solid default — while keeping the same
`readInquiries` / `addInquiry` function signatures so nothing else in the
app has to change.

## Roadmap / not yet built

This is a first working version of the platform. Suggested next steps:

- **Real database** for inquiries (see above).
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
