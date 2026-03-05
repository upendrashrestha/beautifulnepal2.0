import type { NextConfig } from "next";
import withPWABase from "next-pwa";

const withPWA = withPWABase({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
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
  /* config options here */
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
      // You can add more domains or patterns here
    ],
  },
};

module.exports = withPWA(nextConfig);

export default nextConfig;
