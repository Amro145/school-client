import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare compatibility: 
  // We can use 'edge' runtime for specific routes using:
  // export const runtime = 'edge' in page/layout files.
};

export default nextConfig;
