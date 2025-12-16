import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase server-side timeout for API routes
  serverExternalPackages: ['@elevenlabs/elevenlabs-js'],
  
  // Experimental features for longer timeouts
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  
  // Allow larger request bodies for audio uploads
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: false,
  },
};

export default nextConfig;
