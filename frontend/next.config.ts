import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    authInterrupts: true,
    // Mirrors upstream v1.11.2. Next 16.4 defaults this to true, which
    // type-checks the whole project (incl. test files that don't compile).
    useTypeScriptCli: false,
  },
  transpilePackages: ["@faker-js/faker"],
  output: "standalone",
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {},
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
