import type { NextConfig } from "next";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const apiBaseUrl = (configuredApiUrl || "http://localhost:4000/api/").replace(
  /\/+$/,
  "",
);

// Baseline hardening for every response. The CSP below deliberately sets only the
// directives that cannot break Next.js inline bootstrap scripts (clickjacking,
// <base> injection, plugins, form targets). A full script-src policy needs
// per-request nonces and is a separate piece of work.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // Kept off because product images come from arbitrary hosts; remote images
    // are optimised via Cloudinary f_auto/q_auto (see lib/imageUrl.ts) and the
    // local assets are pre-compressed WebP. Re-enable once all hosts are listed.
    unoptimized: true,
    qualities: [75, 85, 90, 95],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "shop-co-1fqm.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "shop-co-jfqp.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      // Refresh and logout must use /api/auth because the backend deliberately
      // scopes its refresh cookie to Path=/api/auth.
      {
        source: "/api/auth/:path*",
        destination: `${apiBaseUrl}/auth/:path*`,
      },
      {
        source: "/api/backend/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
