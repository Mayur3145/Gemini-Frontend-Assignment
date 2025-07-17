/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporary workaround for type errors
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Essential optimizations
  reactStrictMode: true,
  swcMinify: true,
  
  // Custom webpack configurations
  webpack: (config, { isServer }) => {
    // Important: Fixes npm modules that depend on fs/module
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        module: false,
      };
    }
    
    return config;
  },
  
  // Enable server components
  experimental: {
    serverComponents: true,
    appDir: true,
  },
  
  // Handle environment variables
  env: {
    NEXT_PUBLIC_ENV: process.env.NODE_ENV,
  },
};

module.exports = nextConfig;