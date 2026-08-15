import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request, and — once a real
 * domain is set (NEXT_PUBLIC_PREVIEW_DOMAIN) — rewrites
 * `<slug>.yourdomain.com` to `/preview/<slug>` so preview links can be true
 * subdomains instead of a path. Until then, buildPreviewLink() (lib/slug.ts)
 * hands out path-based links on the current deployment domain, and this
 * rewrite simply never matches.
 */
// Subdomains that belong to the main site itself, never to a customer's
// preview slug. Without this, "www.<domain>" (which Vercel points at the
// same production deployment as the apex domain) gets misread as a
// preview link for a slug literally named "www" and 404s the whole
// homepage — that's the bug this list exists to prevent.
const RESERVED_SUBDOMAINS = new Set(["www"]);

export async function middleware(request: NextRequest) {
  const previewDomain = process.env.NEXT_PUBLIC_PREVIEW_DOMAIN;
  const host = request.headers.get("host") ?? "";

  if (previewDomain && host !== previewDomain && host.endsWith(`.${previewDomain}`)) {
    const slug = host.slice(0, -(previewDomain.length + 1));
    if (!RESERVED_SUBDOMAINS.has(slug)) {
      const url = request.nextUrl.clone();
      url.pathname = `/preview/${slug}`;
      return NextResponse.rewrite(url);
    }
  }

  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase auth isn't configured — let requests through unchanged
  // rather than breaking the whole site.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|videos).*)"],
};
