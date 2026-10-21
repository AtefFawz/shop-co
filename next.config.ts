import type { NextConfig } from "next";

const configuredApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
const apiBaseUrl = (configuredApiUrl || "http://localhost:4000/api/").replace(
  /\/+$/,
  "",
);

const nextConfig: NextConfig = {
  images: {
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
      {
        source: "/api/backend/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
