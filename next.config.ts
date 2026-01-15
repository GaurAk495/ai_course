import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["http://localhost:3000", "https://tunnel.flowton.online"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "store.flowton.online",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
