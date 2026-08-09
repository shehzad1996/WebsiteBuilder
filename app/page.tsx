import Link from "next/link";
import PricingCard from "@/components/PricingCard";
import { BRAND } from "@/lib/brand";

const steps = [
  {
    title: "Submit your inquiry",
    body: "Tell us what you want built. A few minutes, no payment, no commitment.",
  },
  {
    title: "We build it, for free",
    body: "Our human developers, backed by AI tooling, build a real working version of your site before you pay anything.",
  },
  {
    title: "See it and get your quote",
    body: "Review the actual live website and the price for it. No mockups, no guesswork.",
  },
  {
    title: "Buy it when you're ready",
    body: "Only pay once you're happy with what you see. There is nothing to lose by asking.",
  },
  {
    title: "Edit live, anytime",
    body: "Use our built-in AI editor to make real-time changes yourself, or ask our human support team for a hand.",
  },
];

const aiExtras = [
  "AI chat agents on your website",
  "Your own AI-powered product or service",
  "Local / self-hosted models if you'd rather not use the cloud",
  "Free consultation on what actually fits your business",
];

const siteTypes = [
  { label: "Takeaway shop", on: true },
  { label: "Portfolio", on: true },
  { label: "Online store", on: false },
  { label: "SaaS product", on: false },
];
const budgets = [
  { label: "$50", on: true },
  { label: "$500", on: true },
  { label: "$1,500", on: false },
  { label: "$5,000", on: false },
];
const aiTags = [
  { label: "Chatbot", on: true },
  { label: "AI agent", on: false },
  { label: "Local models", on: false },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-16 sm:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[-80px] -z-10 h-[560px] bg-[radial-gradient(ellipse_55%_50%_at_35%_10%,rgba(124,92,255,0.22),transparent_70%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[-80px] -z-10 h-[560px] bg-[radial-gradient(ellipse_45%_45%_at_70%_15%,rgba(255,90,31,0.16),transparent_70%)]"
        />

        <div className="relative mx-auto max-w-5xl">
          {/* floating mockup */}
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-night-soft/80 p-6 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Tune your project</h3>
              <span className="rounded-full bg-brand/15 px-2.5 py-1 text-[11px] font-medium text-brand-light">
                Free quote
              </span>
            </div>
            <p className="mt-1 text-xs text-white/40">
              Pick what you need. We&apos;ll quote it in minutes.
            </p>

            <div className="mt-4 flex h-9 items-center rounded-lg border border-white/10 bg-night px-3 text-xs text-white/30">
              Search project type, budget, features&hellip;
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-white/30">
                <span>Site type</span>
                <span>10+</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {siteTypes.map((t) => (
                  <span key={t.label} className={`tag-pill ${t.on ? "tag-pill-on" : "tag-pill-off"}`}>
                    {t.label}
                    {t.on && <span aria-hidden>&#10003;</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-white/30">
                <span>Budget</span>
                <span>5 tiers</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {budgets.map((t) => (
                  <span key={t.label} className={`tag-pill ${t.on ? "tag-pill-on" : "tag-pill-off"}`}>
                    {t.label}
                    {t.on && <span aria-hidden>&#10003;</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-white/30">
                <span>AI features</span>
                <span>optional</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {aiTags.map((t) => (
                  <span key={t.label} className={`tag-pill ${t.on ? "tag-pill-on" : "tag-pill-off"}`}>
                    {t.label}
                    {t.on && <span aria-hidden>&#10003;</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-14 text-center">
            <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
              {BRAND.tagline}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/50">
              We use AI to build fast and keep costs down, but every site is
              built and checked by a real developer. Submit your idea, and
              our team builds it before you ever pay a cent.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/inquiry"
                className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-night transition hover:bg-white/90"
              >
                Get your free quote &rarr;
              </Link>
              <Link
                href="#pricing"
                className="rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-white/80 transition hover:border-white/30"
              >
                See pricing
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/30">
              $50&ndash;$5,000 per project &middot; Built free, pay only if you love it &middot; Every site human-reviewed
            </p>
          </div>
        </div>
      </section>

      {/* Why it works */}
      <section className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-brand-light">Why it works</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Three things happening at once
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-night-soft/50 p-6">
              <h3 className="text-base font-semibold text-white">AI-speed pricing</h3>
              <p className="mt-2 text-sm text-white/50">
                We build with AI tooling on the backend, so you get
                website-builder prices, not agency prices.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-night-soft/50 p-6">
              <h3 className="text-base font-semibold text-white">Human-built quality</h3>
              <p className="mt-2 text-sm text-white/50">
                A real developer builds and reviews every site. No generic
                templates, no broken AI output shipped straight to you.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-night-soft/50 p-6">
              <h3 className="text-base font-semibold text-white">Real-time AI editing + human support</h3>
              <p className="mt-2 text-sm text-white/50">
                Once your site is live, use our integrated AI editor to make
                changes, and reach a human whenever you get stuck.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="how-it-works" className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-brand-light">Our process</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">How it works</h2>
            <p className="mt-3 text-white/50">You see your website built before you decide anything.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-2xl border border-white/10 bg-night-soft/50 p-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-brand/40 text-xs font-semibold text-brand-light">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-white/45">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-brand-light">Priceboard</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Flexible pricing for every project
            </h2>
            <p className="mt-3 text-white/50">
              Every quote is based on what you actually need &mdash; these are typical ranges.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <PricingCard
              title="Starter"
              price="$50"
              description="A simple site for a small local business, think takeaway, grocery shop, or a single-page presence."
              features={[
                "One-page or few-page website",
                "Mobile-friendly design",
                "Built and reviewed by a human developer",
                "Yearly hosting & maintenance from $150-$200",
              ]}
            />
            <PricingCard
              title="Growth"
              price="$200-$1,000"
              description="A full business website: multiple pages, forms, and room to grow."
              highlighted
              features={[
                "Multi-page website",
                "Contact / booking forms",
                "Basic SEO setup",
                "Optional AI chat widget",
                "Real-time AI editing after launch",
              ]}
            />
            <PricingCard
              title="AI & Custom"
              price="$1,000-$5,000"
              description="AI agents, your own AI product, or something fully custom."
              features={[
                "AI agents on your website",
                "Custom AI-powered product or service",
                "Local model / self-hosted AI options",
                "1:1 consultation on the right setup",
                "Priority human support",
              ]}
            />
          </div>
          <p className="mt-8 text-center text-sm text-white/35">
            Not sure where you fall? Submit an inquiry and we&apos;ll quote you exactly, for free.
          </p>
        </div>
      </section>

      {/* AI & Custom */}
      <section id="ai" className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-brand-light">AI &amp; custom</span>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Want AI on your site, or as your product?
              </h2>
              <p className="mt-4 text-white/55">
                We&apos;re not just putting AI on the backend as a shortcut. If
                you want your customers to interact with AI directly, or you
                want to build your own AI-powered service, we can design and
                build that with you.
              </p>
              <ul className="mt-6 space-y-3">
                {aiExtras.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/65">
                    <span className="mt-0.5 text-brand-light">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-night-soft/50 p-8">
              <h3 className="text-sm font-semibold text-white">Built on modern AI infrastructure</h3>
              <p className="mt-3 text-sm text-white/55">
                Under the hood, our team uses fast, cost-efficient AI models
                (like DeepSeek) and AI-assisted development tooling to build
                your site quickly &mdash; which is exactly how we offer
                AI-website-builder prices while still having a human build and
                check every project.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["DeepSeek API", "OpenCode", "Local models", "Human review"].map((tag) => (
                  <span key={tag} className="tag-pill tag-pill-off">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-white/5 px-6 py-24 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[400px] bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,rgba(124,92,255,0.18),transparent_70%)]"
        />
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Let&apos;s build something great together
          </h2>
          <p className="mt-4 text-white/55">
            Submit your inquiry, and our team gets to work. You only pay when
            you&apos;ve seen it and you&apos;re ready to buy.
          </p>
          <Link
            href="/inquiry"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-night transition hover:bg-white/90"
          >
            Submit your inquiry
          </Link>
        </div>
      </section>
    </>
  );
}
