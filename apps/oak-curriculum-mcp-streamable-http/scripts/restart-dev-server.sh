#!/usr/bin/env bash
#
# Restart Dev Server - Clean port and start fresh server
#
# This script ensures clean dev server restarts by:
# 1. Killing any existing process on port 3333
# 2. Verifying the port is free
# 3. Starting the dev server with specified mode
#
# Usage:
#   ./scripts/restart-dev-server.sh          # Start with auth (default)
#   ./scripts/restart-dev-server.sh observe  # Start with auth + logging
#   ./scripts/restart-dev-server.sh noauth   # Start without auth (for testing)
#

# The bash floor: the shellcheck gate holds it once and requires this guard first.
if ((BASH_VERSINFO[0] < 5 || (BASH_VERSINFO[0] == 5 && BASH_VERSINFO[1] < 2))); then
  echo "bash 5.2 or later is required, found ${BASH_VERSION}: install it (brew install bash on macOS, apt-get install bash on Debian 12 or Ubuntu 24.04 and later) and put it first on PATH" >&2
  exit 1
fi

set -euo pipefail

PORT=${PORT:-3333}
MODE=${1:-dev}

if ! command -v lsof >/dev/null 2>&1; then
  echo "❌ ERROR: required command 'lsof' is not installed." >&2
  echo "   macOS: lsof is usually pre-installed." >&2
  echo "   Linux (Debian/Ubuntu): sudo apt install lsof" >&2
  echo "   Source/build instructions: https://github.com/lsof-org/lsof" >&2
  exit 1
fi

echo "🔍 Checking for existing processes on port $PORT..."

# Kill any existing process on the port
if lsof -ti:"$PORT" >/dev/null 2>&1; then
  echo "⚠️  Found process on port $PORT, killing it..."
  lsof -ti:"$PORT" | xargs kill -9 2>/dev/null || true
  sleep 1
else
  echo "✅ Port $PORT is free"
fi

# Verify port is free
if lsof -i:"$PORT" >/dev/null 2>&1; then
  echo "❌ ERROR: Failed to free port $PORT" >&2
  echo "   Please manually kill the process and try again:" >&2
  echo "   lsof -i:$PORT" >&2
  exit 1
fi

# Start server based on mode
case "$MODE" in
  dev)
    echo "🚀 Starting dev server with auth enabled..."
    pnpm dev
    ;;
  observe)
    echo "🚀 Starting dev server with auth enabled + logging..."
    pnpm dev:observe
    ;;
  noauth)
    echo "⚠️  Starting dev server with auth DISABLED (for testing only)..."
    pnpm dev:observe:noauth
    ;;
  *)
    echo "❌ ERROR: Invalid mode '$MODE'" >&2
    echo "   Usage: $0 [dev|observe|noauth]" >&2
    exit 1
    ;;
esac
