import createMDX from "@next/mdx";
import path from "path";
import { fileURLToPath } from "url";
/** @type {import('next').NextConfig} */

// __dirname is not available in native ES modules, so we recreate it.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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