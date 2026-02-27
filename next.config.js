import createMDX from "@next/mdx";
import path from "path";
/** @type {import('next').NextConfig} */


const nextConfig = {
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    authInterrupts: true,
  },
  transpilePackages: ["@faker-js/faker"],
  outputFileTracingRoot: path.join(__dirname, "../"),
  // Optimize build performance
  swcMinify: true,
  // Enable build caching
  // onDemandEntries: {
  //   maxInactiveAge: 25 * 1000,
  //   pagesBufferLength: 2,
  // },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {},
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);