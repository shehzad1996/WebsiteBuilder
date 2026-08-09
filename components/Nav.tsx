import Link from "next/link";
import { BRAND } from "@/lib/brand";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-night/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold text-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand text-xs font-bold">P</span>
          {BRAND.name}
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-white/50 sm:flex">
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
          className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-night transition hover:bg-white/90"
        >
          Get a free quote
        </Link>
      </div>
    </header>
  );
}
