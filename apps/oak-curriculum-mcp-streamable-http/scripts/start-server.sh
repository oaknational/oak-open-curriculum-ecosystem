#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Production Server Startup
# ---------------------------------------------------------------------------
#
# WHY THIS SCRIPT EXISTS
# ----------------------
# The Sentry SDK requires the `--import @sentry/node/preload` Node.js CLI
# flag to enable auto-instrumentation of ESM modules. This flag registers
# `import-in-the-middle` loader hooks BEFORE any application modules are
# imported, which allows Sentry to transparently instrument:
#
#   - node:http / node:https (outbound HTTP spans)
#   - Express route middleware (request transactions)
#   - Third-party libraries (database clients, ORMs, etc.)
#
# Without this flag, modules loaded before `Sentry.init()` are NOT
# retroactively patched. The `wrapMcpServerWithSentry()` native wrapper
# handles MCP-level instrumentation independently (it monkey-patches the
# McpServer instance directly), but outbound HTTP auto-spans require
# the preload hook.
#
# This is a Node.js ESM requirement, not a Sentry quirk. There is no
# pure-code alternative that preserves full auto-instrumentation for ESM.
# See: https://docs.sentry.io/platforms/javascript/guides/express/install/esm/
#
# WHAT HAPPENS WHEN SENTRY IS OFF
# --------------------------------
# When `SENTRY_MODE=off` (the default), the preloaded modules are wrapped
# but remain inert — no data is emitted, no network calls are made. The
# overhead is minimal (single-digit milliseconds at startup for loader
# hook registration and thin proxy wrappers).
#
# REFERENCES
# ----------
# - Sentry ESM docs: https://docs.sentry.io/platforms/javascript/guides/express/install/esm/
# - Late init docs: https://docs.sentry.io/platforms/javascript/guides/express/install/late-initialization/
# - ESM without flag (reduced capability): https://docs.sentry.io/platforms/javascript/guides/express/install/esm-without-import/
# - ADR-143: Coherent structured fan-out for observability
# ---------------------------------------------------------------------------

# The bash floor: the shellcheck gate holds it once and requires this guard first.
if ((BASH_VERSINFO[0] < 5 || (BASH_VERSINFO[0] == 5 && BASH_VERSINFO[1] < 2))); then
  echo "bash 5.2 or later is required, found ${BASH_VERSION}: install it (brew install bash on macOS, apt-get install bash on Debian 12 or Ubuntu 24.04 and later) and put it first on PATH" >&2
  exit 1
fi

set -euo pipefail

exec node --import @sentry/node/preload dist/index.js "$@"
