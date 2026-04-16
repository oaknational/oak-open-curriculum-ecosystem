#!/usr/bin/env bash
# dev-widget-in-host.sh — Run the widget inside a real MCP Apps host.
#
# This script starts the reference MCP Apps basic-host from
# modelcontextprotocol/ext-apps and connects it to the local Oak MCP
# server. The host renders widgets in sandboxed iframes, matching the
# security model of production MCP clients (Claude Desktop, etc.).
#
# Relationship to other dev scripts:
#   dev:widget          — Widget standalone (fast iteration, no host)
#   dev:widget-in-host  — Widget in sandboxed host (integration testing)
#
# Prerequisites:
#   1. bun (https://bun.sh or `npm install -g bun`)
#   2. The Oak MCP server running on port 3333:
#      pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http dev:observe:noauth
#
# Usage:
#   Terminal 1: pnpm dev:observe:noauth  (or another dev:* server script)
#   Terminal 2: pnpm dev:widget-in-host
#   Browser:    http://localhost:8080

set -euo pipefail

MCP_SERVER_PORT="${MCP_SERVER_PORT:-3333}"
MCP_SERVER_URL="http://localhost:${MCP_SERVER_PORT}/mcp"
EXT_APPS_DIR="${TMPDIR:-/tmp}/mcp-ext-apps"

require_command() {
  local command_name="$1"
  local install_url="$2"

  if command -v "${command_name}" >/dev/null 2>&1; then
    return 0
  fi

  echo "Error: required command '${command_name}' is not installed."
  echo "Install instructions: ${install_url}"
  exit 1
}

# --- Check required external tools ---
require_command "bun" "https://bun.sh/docs/installation"
require_command "curl" "https://curl.se/download.html"
require_command "git" "https://git-scm.com/downloads"
require_command "npm" "https://docs.npmjs.com/downloading-and-installing-node-js-and-npm"

# --- Check MCP server is reachable (healthz, not /mcp which requires POST) ---
HEALTHZ_URL="http://localhost:${MCP_SERVER_PORT}/healthz"
echo "Checking MCP server at ${HEALTHZ_URL}..."
if ! curl -sf --max-time 3 "${HEALTHZ_URL}" >/dev/null 2>&1; then
  echo ""
  echo "Error: No MCP server responding on port ${MCP_SERVER_PORT}."
  echo ""
  echo "Start the server first in a separate terminal:"
  echo "  pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http dev:observe:noauth"
  echo ""
  echo "Then re-run this script."
  exit 1
fi
echo "MCP server is running."

# --- Clone or update ext-apps ---
# Version should track @modelcontextprotocol/ext-apps in package.json
EXT_APPS_VERSION="v1.5.0"

if [ -d "${EXT_APPS_DIR}" ]; then
  echo "Using existing ext-apps at ${EXT_APPS_DIR}"
else
  echo "Cloning modelcontextprotocol/ext-apps@${EXT_APPS_VERSION}..."
  git clone --depth 1 --branch "${EXT_APPS_VERSION}" https://github.com/modelcontextprotocol/ext-apps.git "${EXT_APPS_DIR}"
fi

# --- Install and run ---
cd "${EXT_APPS_DIR}"
npm install --silent 2>&1 | tail -1
cd examples/basic-host

echo ""
echo "=========================================="
echo " MCP Apps Host"
echo "=========================================="
echo ""
echo " Host UI:     http://localhost:8080"
echo " MCP server:  ${MCP_SERVER_URL}"
echo ""
echo " Usage:"
echo "   1. Open http://localhost:8080 in your browser"
echo "   2. Select a tool from the sidebar"
echo "   3. Call the tool — the widget renders in a sandboxed iframe"
echo ""
echo "=========================================="
echo ""

SERVERS="[\"${MCP_SERVER_URL}\"]" npm run dev
