/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Suppress the warning about params access
    suppressParamsWarning: true,
  },
};

module.exports = nextConfig; 