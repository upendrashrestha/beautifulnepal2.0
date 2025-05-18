import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/ihu6bwun/bn-dataset/**",
      },
      // You can add more domains or patterns here
    ],
  },
};

export default nextConfig;
