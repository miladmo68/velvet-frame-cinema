import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_PAGES === "true" ? "/velvet-frame-cinema" : "",
  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
