#!/bin/bash
# Session-hook PREFLIGHT — the read-only twin of cloud-session-setup.sh
# under the hook-preflight contract (cloud-environment.md § Validating and
# diagnosing): this repo's session hook downloads the pinned Playwright
# Chromium, so this file falsifies the reachability of the hosts that
# download contacts, without downloading anything. Invoked as a probe by
# cloud-environment-preflight.sh; non-zero exit fails that probe with this
# output as the finding.
set -uo pipefail

# These are host-root probes: the real download paths are version-bound
# (playwright-core/browsers.json names the build, and that file does not
# exist before pnpm install runs), and pinning a build number here would
# reintroduce the hard-coded version the environment scripts deliberately
# avoid. So origin-served 4xx codes are expected and prove reachability;
# the failure signal is transport-level only — a proxy denial fails the
# CONNECT tunnel itself, so curl exits non-zero (measured 2026-08-24),
# while any completed HTTP exchange means the egress path is open. The
# output states this bound so a card reader knows what was NOT proven.
failed=0
for url in \
  "https://cdn.playwright.dev/" \
  "https://playwright.download.prss.microsoft.com/"; do
  if code=$(curl -sS -o /dev/null -m 30 -w '%{http_code}' "$url" 2>/dev/null) ||
    { sleep 2 && code=$(curl -sS -o /dev/null -m 30 -w '%{http_code}' "$url" 2>/dev/null); }; then
    echo "HTTP ${code:-000} (origin responded — reachable): ${url}"
  else
    echo "TRANSPORT FAILURE (proxy CONNECT denial, DNS, or timeout): ${url}"
    failed=1
  fi
done
echo "bound: egress reachability proven only — the versioned browser download itself is exercised by the session hook after install"
exit $failed
