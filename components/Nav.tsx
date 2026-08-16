import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { createClient } from "@/lib/supabase/server";

export default async function Nav() {
  let profile: { email: string | null; role: string } | null = null;

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      profile = { email: user.email ?? null, role: data?.role ?? "user" };
    }
  } catch {
    // Supabase auth not configured — render the signed-out nav.
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-night/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-white sm:gap-2 sm:text-[15px]"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-brand text-[10px] font-bold sm:h-6 sm:w-6 sm:text-xs">
            W
          </span>
          <span className="truncate">{BRAND.name}</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-white/50 sm:flex">
          <Link href="/#how-it-works" className="hover:text-white">
            How it works
          </Link>
          <Link href="/#pricing" className="hover:text-white">
            Pricing
          </Link>
          {profile && (
            <Link
              href={profile.role === "admin" ? "/admin" : "/account"}
              className="hover:text-white"
            >
              {profile.role === "admin" ? "Admin" : "My account"}
            </Link>
          )}
        </nav>
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {profile ? (
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="whitespace-nowrap rounded-full border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/30 sm:px-4 sm:py-2 sm:text-sm"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="whitespace-nowrap rounded-full border border-white/15 px-2.5 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/30 sm:px-4 sm:py-2 sm:text-sm"
            >
              Log in
            </Link>
          )}
          <Link
            href="/inquiry"
            className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-night transition hover:bg-white/90 sm:px-5 sm:py-2 sm:text-sm"
          >
            <span className="sm:hidden">Free quote</span>
            <span className="hidden sm:inline">Get a free quote</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
