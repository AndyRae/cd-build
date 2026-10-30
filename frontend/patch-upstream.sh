#!/bin/sh
# Patches the upstream UI source in place so it can run as a standalone
# container over plain http. Works around HDRUK/cohort-discovery-service-web
# #245 (no standalone output) and #246 (cookie secure flag tied to NODE_ENV).
#
# Each patch targets an upstream pattern rather than replacing whole files,
# so settings upstream adds alongside are kept. Every required patch fails
# the build if its pattern is missing - check upstream when that happens.
set -eu

fail() { echo "patch-upstream: $*" >&2; exit 1; }

# 1. next.config.ts: build standalone output (server.js) for the runner stage.
grep -q '^const nextConfig: NextConfig = {$' next.config.ts \
  || fail "next.config.ts: 'const nextConfig: NextConfig = {' not found"
sed -i 's/^const nextConfig: NextConfig = {$/&\n  output: "standalone",/' next.config.ts
# Upstream traces from the parent dir, which nests server.js under
# .next/standalone/<dir>/ instead of the root the runner stage copies.
sed -i '/outputFileTracingRoot/d' next.config.ts

# 2. Access-token cookie: make the secure flag opt-in via SECURE_COOKIES, so
#    sign-in works over http://localhost (NODE_ENV is always production here).
files=$(grep -rl 'secure: process.env.NODE_ENV === "production"' src) \
  || fail "no 'secure: process.env.NODE_ENV === \"production\"' cookie found in src/"
for f in $files; do
  sed -i 's/secure: process.env.NODE_ENV === "production"/secure: process.env.SECURE_COOKIES === "true"/' "$f"
  echo "patch-upstream: SECURE_COOKIES -> $f"
done

# 3. Optional (<= v1.11.x only): fall back to the server clock rather than
#    epoch 0 when x-request-now is missing, or maxAge comes out as ~decades.
#    Upstream's src/lib/authCookie.ts already does this.
sed -i 's/requestNow !== null ? Math.floor(Number(requestNow)) : 0;/requestNow !== null ? Math.floor(Number(requestNow)) : Math.floor(Date.now() \/ 1000);/' \
  src/actions/standalone/standaloneSignIn.ts 2>/dev/null || true

grep -n 'output: "standalone"' next.config.ts
