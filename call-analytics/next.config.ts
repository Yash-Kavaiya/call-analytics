import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages for server-side
  serverExternalPackages: ['@elevenlabs/elevenlabs-js'],
  
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
