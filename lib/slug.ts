import { randomBytes } from "crypto";

/**
 * Builds the base of a preview slug from whatever the visitor gave us —
 * their project/business name first (most recognizable), falling back to
 * the description, then their email's local part. Always ends with a short
 * random suffix so slugs aren't guessable from a business name alone (the
 * slug doubles as the "no login required" access token for /preview).
 */
export function buildPreviewSlug(input: {
  projectName?: string;
  description: string;
  email: string;
}): string {
  const source =
    input.projectName?.trim() ||
    input.description.trim().slice(0, 40) ||
    input.email.split("@")[0];

  const base =
    slugify(source).slice(0, 40) || "project";

  const suffix = randomBytes(4).toString("hex"); // 8 hex chars, ~4 billion combos

  return `${base}-${suffix}`;
}

/**
 * The base URL of wherever this app is currently deployed
 * (VERCEL_URL / NEXT_PUBLIC_SITE_URL, falling back to localhost). Shared by
 * buildPreviewLink() below and anything else that needs to link back to the
 * site from outside a request (e.g. an email notification).
 */
export function buildSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

/**
 * The link customers actually get. Domain isn't decided yet, so this
 * defaults to a path on whatever domain the app is running on. Once a real
 * domain with wildcard DNS is pointed at Vercel, set
 * NEXT_PUBLIC_PREVIEW_DOMAIN to it and middleware.ts will start serving
 * `<slug>.yourdomain.com` as a true subdomain — this function's output
 * switches over automatically, no code changes needed elsewhere.
 */
export function buildPreviewLink(slug: string): string {
  const previewDomain = process.env.NEXT_PUBLIC_PREVIEW_DOMAIN;
  if (previewDomain) {
    return `https://${slug}.${previewDomain}`;
  }

  return `${buildSiteUrl()}/preview/${slug}`;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents (post-NFKD combining marks)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
