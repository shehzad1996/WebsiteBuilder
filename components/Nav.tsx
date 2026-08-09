import Link from "next/link";
import { BRAND } from "@/lib/brand";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {BRAND.name}
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 sm:flex">
          <Link href="/#how-it-works" className="hover:text-slate-900">
            How it works
          </Link>
          <Link href="/#pricing" className="hover:text-slate-900">
            Pricing
          </Link>
          <Link href="/#ai" className="hover:text-slate-900">
            AI &amp; automation
          </Link>
        </nav>
        <Link
          href="/inquiry"
          className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Get a free quote
        </Link>
      </div>
    </header>
  );
}
