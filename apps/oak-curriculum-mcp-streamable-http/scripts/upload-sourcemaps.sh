#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Upload source maps to Sentry for the current tsup build output.
# ---------------------------------------------------------------------------
#
# WHY THIS SCRIPT EXISTS
# ----------------------
# tsup (esbuild-backed) emits `.js` and `.js.map` files into `dist/`.
# Sentry's current source-map model matches artefacts to runtime events
# via *Debug IDs* embedded in the deployed JS (`//# debugId=…`) and the
# accompanying `.map` (`debug_id` field). Release strings are a
# convenience, not the key.
#
# Because esbuild does not (yet) inject deterministic Debug IDs, the
# canonical upstream workflow for Oak is a two-step CLI pipeline:
#   1. `sentry-cli sourcemaps inject <dist>` — rewrites each `.js` to
#      embed `//# debugId=…` and mirrors the id into each `.map`.
#   2. `sentry-cli sourcemaps upload --release <rel> <dist>` — assembles
#      an artefact bundle keyed by those Debug IDs and ships it.
#
# Without step 1, step 2 still succeeds but the uploaded bundle has
# nothing to match against at event time, and symbolication silently
# fails. See docs/operations/sentry-cli-usage.md §"Upload source maps"
# and upstream at
# https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/cli/
#
# This script is the bridge between runtime release resolution
# (`resolveSentryRelease` in `@oaknational/sentry-node`) and Sentry's
# server-side symbolication store.
#
# CLI
# ---
# Uses `sentry-cli` (the automation/CI CLI, shipped as the `@sentry/cli`
# npm package) via `pnpm exec`, not the dev-interactive `sentry` CLI.
# The distinction and rationale are documented in
# [docs/operations/sentry-cli-usage.md](../../../docs/operations/sentry-cli-usage.md).
#
# Scoping (org/project/URL) comes from the workspace-local `.sentryclirc`
# that sits next to this script's workspace root. That file pins the
# Sentry project this workspace is allowed to touch; running this script
# from another workspace cannot accidentally cross-target a different
# project.
#
# WHEN TO RUN
# -----------
# - Locally, when generating Sentry evidence for the HTTP MCP server:
#     pnpm build
#     RELEASE=<session-tag> pnpm sourcemaps:upload
#     pnpm start
#
# - In CI / Vercel pre-deploy (future): invoke immediately after `pnpm build`
#   with `RELEASE=$VERCEL_GIT_COMMIT_SHA` (or the root package.json version,
#   matching the resolution precedence documented in
#   `packages/libs/sentry-node/src/config-resolution.ts`).
#
# REQUIRED ENVIRONMENT
# --------------------
# - `SENTRY_AUTH_TOKEN`  An organization auth token for
#                        `oak-national-academy/oak-open-curriculum-mcp`.
#                        `sentry-cli` accepts this via env only in CI-safe
#                        use; do not commit tokens to `.sentryclirc`.
# - `RELEASE`            The release string events will be tagged with at
#                        runtime. Must match whatever
#                        `resolveSentryRelease` produces for the process
#                        that will generate the events.
#
# REFERENCES
# ----------
# - docs/operations/sentry-cli-usage.md
# - https://docs.sentry.io/cli/
# - https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/sentry-cli/
# ---------------------------------------------------------------------------

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DIST_DIR="$APP_DIR/dist"

# Fail fast if a required external tool or prerequisite is missing.
require_command() {
  local command_name="$1"
  local install_url="$2"

  if command -v "${command_name}" >/dev/null 2>&1; then
    return 0
  fi

  echo "Error: required command '${command_name}' is not installed." >&2
  echo "Install instructions: ${install_url}" >&2
  exit 1
}

# `pnpm` is the gate for `pnpm exec sentry-cli`. If `pnpm` is missing this
# is almost certainly an unbootstrapped checkout.
require_command "pnpm" "https://pnpm.io/installation"

# Confirm the workspace has @sentry/cli installed and the binary resolves.
# This catches a common failure mode: somebody skipped `pnpm install` and
# the postinstall that downloads the sentry-cli native binary.
if ! ( cd "$APP_DIR" && pnpm exec sentry-cli --version >/dev/null 2>&1 ); then
  echo "[upload-sourcemaps] 'sentry-cli' is not resolvable via 'pnpm exec' in $APP_DIR." >&2
  echo "[upload-sourcemaps] Run 'pnpm install' in the repo root to install @sentry/cli and let its postinstall fetch the binary." >&2
  exit 1
fi

if [[ -z "${RELEASE:-}" ]]; then
  echo "[upload-sourcemaps] RELEASE is not set. Aborting." >&2
  exit 1
fi

if [[ ! -d "$DIST_DIR" ]]; then
  echo "[upload-sourcemaps] No dist/ directory at $DIST_DIR. Run 'pnpm build' first." >&2
  exit 1
fi

if [[ -z "${SENTRY_AUTH_TOKEN:-}" ]]; then
  echo "[upload-sourcemaps] SENTRY_AUTH_TOKEN is not set." >&2
  echo "[upload-sourcemaps] Export an org auth token for oak-national-academy before retrying (see docs/operations/sentry-cli-usage.md)." >&2
  exit 1
fi

echo "[upload-sourcemaps] release=$RELEASE dist=$DIST_DIR"

# Run from $APP_DIR so the workspace-local .sentryclirc supplies org / project / url.
#
# Step 1: inject Debug IDs into built .js and .map files. This is the
# load-bearing step under the esbuild/tsup build used here; skipping it
# would mean uploaded artefacts have no Debug IDs to match against at
# event time and symbolication would silently fail. Injection is
# idempotent, so re-running this script is safe.
echo "[upload-sourcemaps] Step 1/2: injecting Debug IDs into $DIST_DIR"
( cd "$APP_DIR" && pnpm exec sentry-cli sourcemaps inject "$DIST_DIR" )

# Step 2: upload the artefact bundle keyed by those Debug IDs.
# `--release` is a convenience tag (surfaces the bundle in the release
# UI); the match key is the Debug ID, not the release string.
echo "[upload-sourcemaps] Step 2/2: uploading artefact bundle"
( cd "$APP_DIR" && pnpm exec sentry-cli sourcemaps upload --release "$RELEASE" "$DIST_DIR" )

# Verify at least one deployed .js in $DIST_DIR carries a Debug ID
# comment. This is a load-bearing post-condition: without it the
# "upload succeeded" log line is a necessary but not sufficient signal
# for working symbolication.
if ! grep -rlE "^//# debugId=" "$DIST_DIR" >/dev/null 2>&1; then
  echo "[upload-sourcemaps] ERROR: No '//# debugId=' comment found in $DIST_DIR after inject." >&2
  echo "[upload-sourcemaps] Symbolication will fail at event time. Check that tsup emitted .js files and that sentry-cli sourcemaps inject ran." >&2
  exit 1
fi

echo "[upload-sourcemaps] Done."
