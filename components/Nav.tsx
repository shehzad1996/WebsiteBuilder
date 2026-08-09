import Link from "next/link";
import { BRAND } from "@/lib/brand";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-night-border bg-night/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-black uppercase tracking-tight text-white">
          {BRAND.name}
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/60 sm:flex">
          <Link href="/#how-it-works" className="hover:text-white">
            How it works
          </Link>
          <Link href="/#pricing" className="hover:text-white">
            Pricing
          </Link>
          <Link href="/#ai" className="hover:text-white">
            AI &amp; automation
          </Link>
        </nav>
        <Link
          href="/inquiry"
          className="rounded-md bg-brand px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-light"
        >
          Get a free quote
        </Link>
      </div>
    </header>
  );
}
