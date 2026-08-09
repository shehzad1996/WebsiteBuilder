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
          {profile && (
            <Link
              href={profile.role === "admin" ? "/admin" : "/account"}
              className="hover:text-white"
            >
              {profile.role === "admin" ? "Admin" : "My account"}
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {profile ? (
            <form action="/auth/signout" method="POST">
              <button
                type="submit"
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/30"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/30"
            >
              Log in
            </Link>
          )}
          <Link
            href="/inquiry"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-night transition hover:bg-white/90"
          >
            Get a free quote
          </Link>
        </div>
      </div>
    </header>
  );
}
