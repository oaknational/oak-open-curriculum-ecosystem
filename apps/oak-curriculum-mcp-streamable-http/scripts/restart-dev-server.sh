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

set -e  # Exit on error

PORT=${PORT:-3333}
MODE=${1:-dev}

echo "🔍 Checking for existing processes on port $PORT..."

# Kill any existing process on the port
if lsof -ti:$PORT >/dev/null 2>&1; then
  echo "⚠️  Found process on port $PORT, killing it..."
  lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
  sleep 1
else
  echo "✅ Port $PORT is free"
fi

# Verify port is free
if lsof -i:$PORT >/dev/null 2>&1; then
  echo "❌ ERROR: Failed to free port $PORT"
  echo "   Please manually kill the process and try again:"
  echo "   lsof -i:$PORT"
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
    echo "❌ ERROR: Invalid mode '$MODE'"
    echo "   Usage: $0 [dev|observe|noauth]"
    exit 1
    ;;
esac












