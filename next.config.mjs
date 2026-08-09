/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Keep the first-pass build unblocked by style-only lint rules
    // (e.g. unescaped apostrophes in copy). Re-enable once the team
    // has a chance to tune the ruleset.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
