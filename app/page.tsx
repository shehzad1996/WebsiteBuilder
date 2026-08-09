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

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-night-border bg-night px-6 pb-20 pt-20 sm:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-light">
            Built free. You only pay if you love it.
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-6xl">
            Website-builder prices.
            <br />
            <span className="text-brand">Human-built</span> quality.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            We use AI to build fast and keep costs down, like an AI website
            builder, but every site is built and checked by a real developer.
            Submit your idea, and our team builds it before you ever pay a cent.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/inquiry"
              className="rounded-md bg-brand px-8 py-3.5 text-base font-bold text-white transition hover:bg-brand-light"
            >
              Submit your inquiry, it&apos;s free
            </Link>
            <Link
              href="#pricing"
              className="rounded-md border border-white/20 px-8 py-3.5 text-base font-bold text-white transition hover:border-white/50"
            >
              See pricing
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 divide-y divide-night-border overflow-hidden rounded-xl border border-night-border bg-night-soft sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="p-6 text-center">
            <div className="font-display text-2xl font-black text-brand">$50&ndash;$5,000</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wide text-white/40">Price range</div>
          </div>
          <div className="p-6 text-center">
            <div className="font-display text-2xl font-black text-brand">$150&ndash;$200/yr</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wide text-white/40">Hosting &amp; maintenance</div>
          </div>
          <div className="p-6 text-center">
            <div className="font-display text-2xl font-black text-brand">100%</div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wide text-white/40">Human-reviewed builds</div>
          </div>
        </div>
      </section>

      {/* Why it works — light band */}
      <section className="bg-white px-6 py-20 text-night">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">Why it works</span>
            <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Three things happening at once
            </h2>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold">AI-speed pricing</h3>
              <p className="mt-2 text-sm text-slate-600">
                We build with AI tooling on the backend, so you get
                website-builder prices, not agency prices.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold">Human-built quality</h3>
              <p className="mt-2 text-sm text-slate-600">
                A real developer builds and reviews every site. No generic
                templates, no broken AI output shipped straight to you.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold">Real-time AI editing + human support</h3>
              <p className="mt-2 text-sm text-slate-600">
                Once your site is live, use our integrated AI editor to make
                changes, and reach a human whenever you get stuck.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="how-it-works" className="border-t border-night-border bg-night px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Our process</span>
            <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-white/50">You see your website built before you decide anything.</p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((step, i) => (
              <div key={step.title} className="rounded-xl border border-night-border bg-night-soft p-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-display text-sm font-black text-white">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-white/50">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-night-border bg-night-soft px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-brand">Priceboard</span>
            <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Flexible pricing for every project
            </h2>
            <p className="mt-3 text-white/50">
              Every quote is based on what you actually need &mdash; these are typical ranges.
            </p>
          </div>
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
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
          <p className="mt-8 text-center text-sm text-white/40">
            Not sure where you fall? Submit an inquiry and we&apos;ll quote you exactly, for free.
          </p>
        </div>
      </section>

      {/* AI & Custom */}
      <section id="ai" className="border-t border-night-border bg-night px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand">AI &amp; custom</span>
              <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                Want AI on your site, or as your product?
              </h2>
              <p className="mt-4 text-white/60">
                We&apos;re not just putting AI on the backend as a shortcut. If
                you want your customers to interact with AI directly, or you
                want to build your own AI-powered service, we can design and
                build that with you.
              </p>
              <ul className="mt-6 space-y-3">
                {aiExtras.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                    <span className="mt-0.5 text-brand">&#10003;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-night-border bg-night-soft p-8">
              <h3 className="font-bold text-white">Built on modern AI infrastructure</h3>
              <p className="mt-3 text-sm text-white/60">
                Under the hood, our team uses fast, cost-efficient AI models
                (like DeepSeek) and AI-assisted development tooling to build
                your site quickly &mdash; which is exactly how we offer
                AI-website-builder prices while still having a human build and
                check every project.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["DeepSeek API", "OpenCode", "Local models", "Human review"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-night-border bg-night px-3 py-1 text-xs font-medium text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
            Let&apos;s build something great together
          </h2>
          <p className="mt-4 text-white/85">
            Submit your inquiry, and our team gets to work. You only pay when
            you&apos;ve seen it and you&apos;re ready to buy.
          </p>
          <Link
            href="/inquiry"
            className="mt-8 inline-block rounded-md bg-white px-8 py-3.5 text-base font-bold text-brand-dark transition hover:bg-white/90"
          >
            Submit your inquiry
          </Link>
        </div>
      </section>
    </>
  );
}
