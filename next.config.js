/** @type {import('next').NextConfig} */


const nextConfig = {
  output: "standalone",
  experimental: {
  },
  // Optimize build performance
  swcMinify: true,
  // Enable build caching
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;