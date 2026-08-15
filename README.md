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
  a free-text description plus project type, budget, and timeline. No
  account required — only an email address, tagged to the signed-in user
  if there is one. Every submission gets a random `slug` and a preview
  link immediately.
- **Auto preview page** (`app/preview/[slug]/page.tsx`) — a public,
  no-login page built from the visitor's own brief (name, description,
  budget, timeline). It's what the emailed link opens to. Once an admin
  attaches a real build URL, the same link redirects there instead — the
  visitor never needs a new link.
- **Customer login** (`app/login`, `app/signup`, `app/account`) — visitors
  can *optionally* create an account to see all their inquiries and
  preview links from `/account` instead of hunting down the email.
- **Admin login + dashboard** (`app/admin/login`, `app/admin/page.tsx`) —
  a real, role-gated login (no more `?key=` in the URL) for your team to
  see every submitted inquiry, paste in the real build URL once it's
  ready, and email the customer the link in one click.
- **WhatsApp + AI chat widget** (`components/ChatWidget.tsx`,
  `app/api/chat/route.ts`) — floating on every page. A WhatsApp button
  gives visitors instant human contact; the chat panel next to it answers
  questions itself using `docs/website-knowledge.md`, and hands off to
  the same WhatsApp number (with the visitor's last question pre-filled)
  the moment they want a person.

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
   - `supabase/migrations/0003_preview_links.sql` — adds the `slug` /
     `preview_url` columns that back `/preview/<slug>`.
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

### Preview links & email

`/preview/<slug>` works with zero setup — it's just a page that reads
straight from Postgres (or the temp-file store), so every inquiry gets a
working link the second it's submitted.

Two things are optional on top of that:

- **Emailing the link automatically.** Create a free account at
  [resend.com](https://resend.com), grab an API key from **API Keys**,
  and set `RESEND_API_KEY` (and `RESEND_FROM_EMAIL`, once you've
  [verified a sending domain](https://resend.com/docs/dashboard/domains/introduction) —
  until then it sends from Resend's shared `onboarding@resend.dev`,
  which is fine for testing but looks unprofessional to real customers).
  Without this set, `/admin` still generates and shows the link — you'd
  just copy-paste it to the customer yourself.
- **True subdomains** (`slug.yourdomain.com` instead of
  `yourdomain.com/preview/slug`). Once you've registered a domain,
  pointed wildcard DNS (`*.yourdomain.com`) at this Vercel project, and
  added it under **Settings → Domains**, set
  `NEXT_PUBLIC_PREVIEW_DOMAIN=yourdomain.com`. `middleware.ts` already
  has the rewrite logic — it just does nothing until this is set.

### WhatsApp + AI chat widget

A floating widget sits in the bottom-right corner on every page — a green
WhatsApp button for instant human contact, next to a chat bubble that opens
an AI assistant.

- **WhatsApp button.** Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to your number,
  digits only with country code (e.g. `15551234567`, no `+`, no spaces).
  Without it, the button still renders but opens a placeholder number —
  set this before going live. It's a plain [click-to-chat
  link](https://faq.whatsapp.com/425247423114725) (`wa.me/<number>`), no
  WhatsApp Business API or app install needed on your end.
- **AI chatbot.** Answers visitor questions using **only**
  `docs/website-knowledge.md` as its source of truth — edit that file to
  change what it knows or how it talks; no code changes needed. It calls
  the Claude API directly (`app/api/chat/route.ts`), so set
  `ANTHROPIC_API_KEY` (get one at
  [console.anthropic.com](https://console.anthropic.com)). Without it, the
  chat panel shows an error and points visitors at the WhatsApp button
  instead — the site still works either way.
- **Handoff to WhatsApp.** The chat panel always shows a "Chat with a
  human on WhatsApp" button. Once the visitor has asked something, that
  link pre-fills the WhatsApp message with their last question, so
  whoever picks it up on WhatsApp can see what was already asked and the
  conversation continues there — no separate system to check.

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

- **New-inquiry notifications** — ping your team (email/Slack) the moment
  someone submits, instead of relying on checking `/admin`. Hook point is
  marked with a `TODO` in `app/api/inquiry/route.ts`.
- **Payments** — Stripe (or similar) once a customer approves their preview.
- **Retroactive linking** — inquiries submitted anonymously before a
  visitor creates an account aren't linked to it automatically; only
  inquiries submitted while signed in show up on `/account` (guests can
  still always reach theirs via the `/preview/<slug>` link).

## Rebranding

The brand name, tagline, and contact email live in `lib/brand.ts` — change
them there and they update across the whole site.
