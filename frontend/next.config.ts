import type { NextConfig } from "next";
// Upstream's next.config.ts, renamed by Dockerfile.ui. Everything it sets is
// kept; this only adds standalone output (HDRUK/cohort-discovery-service-web#246).
import upstreamConfig from "./next.config.upstream";

const nextConfig: NextConfig = {
  ...upstreamConfig,
  output: "standalone",
  // Upstream traces from the parent dir, which nests server.js under
  // .next/standalone/<dir>/ instead of the root the runner stage copies.
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
