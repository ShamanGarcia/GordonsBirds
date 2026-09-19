import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/GordonsBirds",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
