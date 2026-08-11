import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "www.thedailystar.net" },
      { protocol: "https", hostname: "www.tbsnews.net" },
      { protocol: "https", hostname: "ecdn.dhakatribune.net" },
      { protocol: "https", hostname: "cdn.banglatribune.net" },
      { protocol: "https", hostname: "media.prothomalo.com" },
      { protocol: "https", hostname: "cdn.jagonews24.com" },
      { protocol: "https", hostname: "cdn.jugantor.com" },
      { protocol: "https", hostname: "thumbnews.nateimg.co.kr" },
    ],
  },
};

export default nextConfig;
