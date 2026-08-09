import Link from "next/link";
import PricingCard from "@/components/PricingCard";
import ComparisonReel from "@/components/ComparisonReel";
import TestimonialCard from "@/components/TestimonialCard";

const steps = [
  {
    title: "Submit your inquiry",
    body: "Tell us what you want built, in your own words. A few minutes, no payment, no commitment.",
  },
  {
    title: "We build it, for free",
    body: "Our human developers build a real, working version of your site before you pay anything.",
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
    title: "Need changes later?",
    body: "Just tell your developer what to change. No builder tools to learn — a person handles the update directly.",
  },
];

const testimonials = [
  {
    quote:
      "I tried building it myself with an AI tool for two weekends and got nowhere. Sent one message here and had a working site by Thursday.",
    name: "Maria Gomez",
    role: "Owner, Coastline Coffee",
  },
  {
    quote:
      "No back-and-forth prompting, no broken layouts. Just a developer who read what I wrote and built exactly that.",
    name: "David Okafor",
    role: "Founder, Okafor Consulting",
  },
  {
    quote:
      "We needed a booking form and a real menu page, not another builder to learn. Easiest website project we've ever done.",
    name: "Priya Shah",
    role: "Manager, Shah's Kitchen",
  },
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
              <h3 className="text-sm font-semibold text-white">Describe your project</h3>
              <span className="rounded-full bg-brand/15 px-2.5 py-1 text-[11px] font-medium text-brand-light">
                Free quote
              </span>
            </div>
            <p className="mt-1 text-xs text-white/40">
              One prompt is enough. A developer takes it from there.
            </p>

            <div className="mt-4 rounded-lg border border-white/10 bg-night p-3">
              <p className="text-xs leading-relaxed text-white/60">
                &ldquo;A clean website for my coffee shop &mdash; menu page,
                opening hours, and a way for people to find us.&rdquo;
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/20 text-[10px] text-brand-light">
                &#10003;
              </span>
              <span className="text-xs text-white/50">Picked up and built by a real developer</span>
            </div>
          </div>

          <div className="mt-14 text-center">
            <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
              Stop prompting. Let a developer build it for you.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-white/50">
              Going back and forth tweaking prompts wastes your time. Our
              team has shipped hundreds of projects &mdash; describe what
              you want once, and a real developer builds your website for
              free. You only pay when you like it.
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
              100s of projects delivered &middot; Free to build, pay when you like it &middot; Hosting &amp; maintenance from $150/yr
            </p>
          </div>
        </div>
      </section>

      {/* Prompting alone vs. us */}
      <section className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-brand-light">Sound familiar?</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Prompting an AI builder is a slow way to lose money
            </h2>
            <p className="mt-3 text-white/50">
              Every fix is another prompt. Every prompt costs tokens &mdash;
              whether it works or not.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-night-soft/50 shadow-2xl">
            <video
              className="aspect-video w-full"
              controls
              muted
              playsInline
              preload="metadata"
            >
              <source
                src="https://raw.githubusercontent.com/shehzad1996/websitebuilder/claude/website-builder-platform-ewy4or/public/videos/ai-website-trap.mp4"
                type="video/mp4"
              />
            </video>
          </div>

          <div className="mt-12">
            <ComparisonReel />
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
              <h3 className="text-base font-semibold text-white">Say it once, not ten times</h3>
              <p className="mt-2 text-sm text-white/50">
                No back-and-forth tweaking a prompt until it looks right.
                Tell us what you want once, in plain language, and a
                developer takes it from there.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-night-soft/50 p-6">
              <h3 className="text-base font-semibold text-white">A team behind every project</h3>
              <p className="mt-2 text-sm text-white/50">
                We&apos;ve shipped hundreds of projects. Yours is written and
                reviewed by a real developer, not generated and handed to
                you unchecked.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-night-soft/50 p-6">
              <h3 className="text-base font-semibold text-white">See it before you pay</h3>
              <p className="mt-2 text-sm text-white/50">
                You get a real, working preview first. You only pay once
                you&apos;re happy with what you see.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-white/5 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-medium uppercase tracking-widest text-brand-light">Testimonials</span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              What people say after they&apos;ve seen it
            </h2>
            <p className="mt-3 text-white/50">
              Real feedback from people who described what they wanted and got a real website back.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
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
                "Content updates after launch",
                "Direct support from your developer",
              ]}
            />
            <PricingCard
              title="Custom"
              price="$1,000-$5,000"
              description="Something bigger or more complex &mdash; we'll scope it with you."
              features={[
                "E-commerce & online payments",
                "Custom integrations & dashboards",
                "Multi-language / multi-location sites",
                "1:1 consultation on what you need",
                "Priority developer support",
              ]}
            />
          </div>
          <p className="mt-8 text-center text-sm text-white/35">
            Not sure where you fall? Submit an inquiry and we&apos;ll quote you exactly, for free.
          </p>
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
