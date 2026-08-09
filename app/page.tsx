import Link from "next/link";
import PricingCard from "@/components/PricingCard";
import { BRAND } from "@/lib/brand";

const steps = [
  {
    title: "1. Submit your inquiry",
    body: "Tell us what you want built. A few minutes, no payment, no commitment.",
  },
  {
    title: "2. We build it, for free",
    body: "Our human developers, backed by AI tooling, build a real working version of your site before you pay anything.",
  },
  {
    title: "3. See it and get your quote",
    body: "Review the actual live website and the price for it. No mockups, no guesswork.",
  },
  {
    title: "4. Buy it when you're ready",
    body: "Only pay once you're happy with what you see. There is nothing to lose by asking.",
  },
  {
    title: "5. Edit live, anytime",
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
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 text-center sm:pt-28">
        <p className="mx-auto mb-4 w-fit rounded-full bg-brand/10 px-4 py-1 text-sm font-semibold text-brand">
          Built free. You only pay if you love it.
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          {BRAND.tagline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          We use AI to build fast and keep costs down, like an AI website
          builder, but every site is built and checked by a real developer.
          Submit your idea, and our team builds it before you ever pay a cent.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/inquiry"
            className="rounded-full bg-brand px-8 py-3 text-base font-semibold text-white transition hover:bg-brand-dark"
          >
            Submit your inquiry, it&apos;s free
          </Link>
          <Link
            href="#pricing"
            className="rounded-full border border-slate-300 px-8 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400"
          >
            See pricing
          </Link>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          Sites start at $50 · Yearly hosting &amp; maintenance from $150
        </p>
      </section>

      <section className="border-y border-slate-100 bg-slate-50 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">AI-speed pricing</h3>
            <p className="mt-2 text-sm text-slate-600">
              We build with AI tooling on the backend, so you get website
              builder prices, not agency prices.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Human-built quality</h3>
            <p className="mt-2 text-sm text-slate-600">
              A real developer builds and reviews every site. No generic
              templates, no broken AI output shipped straight to you.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Real-time AI editing + human support
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Once your site is live, use our integrated AI editor to make
              changes yourself, and reach a human whenever you get stuck.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-slate-900">How it works</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
          You see your website built before you decide anything.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-slate-900">
            Pricing that scales with your project
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Every quote is based on what you actually need. These are typical
            ranges.
          </p>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
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
          <p className="mt-8 text-center text-sm text-slate-500">
            Not sure where you fall? Submit an inquiry and we&apos;ll quote you
            exactly, for free.
          </p>
        </div>
      </section>

      <section id="ai" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Want AI on your website, or as your product?
            </h2>
            <p className="mt-4 text-slate-600">
              We&apos;re not just putting AI on the backend as a shortcut. If
              you want your customers to interact with AI directly, or you
              want to build your own AI-powered service, we can design and
              build that with you.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              {aiExtras.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand">&#10003;</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
            <h3 className="font-semibold text-slate-900">
              Built on modern AI infrastructure
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Under the hood, our team uses fast, cost-efficient AI models
              (like DeepSeek) and AI-assisted development tooling to build
              your site quickly, which is exactly how we can offer
              AI-website-builder prices while still having a human build and
              check every project.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-brand py-20 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-3xl font-bold">See your website built for free</h2>
          <p className="mt-4 text-white/80">
            Submit your inquiry, and our team gets to work. You only pay when
            you&apos;ve seen it and you&apos;re ready to buy.
          </p>
          <Link
            href="/inquiry"
            className="mt-8 inline-block rounded-full bg-white px-8 py-3 text-base font-semibold text-brand transition hover:bg-white/90"
          >
            Submit your inquiry
          </Link>
        </div>
      </section>
    </>
  );
}
