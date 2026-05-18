import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: ({ request, url }: { request: Request; url: URL }) =>
        request.mode === "navigate" && url.pathname.startsWith("/trek"),
      handler: "NetworkFirst",
      options: {
        cacheName: "trek-pages",
        networkTimeoutSeconds: 5,
        expiration: { maxEntries: 20, maxAgeSeconds: 604800 },
      },
    },
    {
      urlPattern: /\/api\/trek\//,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "trek-api",
        expiration: { maxEntries: 20, maxAgeSeconds: 604800 },
      },
    },
    {
      urlPattern: /^https:\/\/tile\.opentopomap\.org\//,
      handler: "CacheFirst",
      options: {
        cacheName: "map-tiles",
        expiration: { maxEntries: 5000, maxAgeSeconds: 2592000 },
      },
    },
    {
      urlPattern: /\/_next\/static\//,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: { maxEntries: 200, maxAgeSeconds: 31536000 },
      },
    },
  ],
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/ihu6bwun/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

module.exports = withPWA(nextConfig);
