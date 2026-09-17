#!/bin/bash
# Per-repo cloud-session setup hook for oak-open-curriculum-ecosystem.
#
# Invoked by the shared cloud environment setup script
# (.agent/claude-harness-integrations/cloud-environment-setup.sh) with the
# repo root as the working directory, AFTER `pnpm install` has run. Same
# fail-fast contract as the caller: any failure fails session creation.
set -euo pipefail

# Playwright browsers at the repo's pinned version. PLAYWRIGHT_BROWSERS_PATH
# is deliberately inherited so the install targets the store the cloud image
# presets (/opt/pw-browsers); only the image's download suppression
# (PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD) is unset. Turbo-spawned test:ui /
# test:e2e processes see the same store because turbo.json passes
# PLAYWRIGHT_BROWSERS_PATH through its strict envMode boundary
# (globalPassThroughEnv) — without that passthrough, Playwright inside gate
# tasks fell back to ~/.cache/ms-playwright and reported "Executable doesn't
# exist" while the browsers sat installed here (worked instance 2026-08-26,
# fresh cloud container, pre-push gates).
(cd apps/oak-curriculum-mcp-streamable-http \
  && env -u PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD \
     pnpm exec playwright install --with-deps chromium)

# agent-tools test:e2e spawns pnpm in scratch directories with no
# packageManager pin, so Corepack falls back to its global default — and
# under turbo's strict envMode that spawned Corepack carries neither the
# session proxy's CA nor its proxy env, so a network resolve dies on TLS
# (worked instance 2026-08-26: "self-signed certificate in certificate
# chain" against registry.npmjs.org killed test:e2e). Prime the global
# Corepack default here, where the network works, so in-session resolution
# needs no fetch — pinned to the repository's own packageManager version,
# never `latest`, so a future pnpm release cannot enter the cloud gate
# untested (review finding, PR #20). registry.npmjs.org is already probed
# by the universal preflight — no new host (probe invariant).
pnpm_version="$(node -p "require('./package.json').packageManager.match(/^pnpm@([^+]+)/)[1]")"
corepack install -g "pnpm@${pnpm_version}"
