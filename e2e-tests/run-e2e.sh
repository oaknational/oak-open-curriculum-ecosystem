#!/bin/bash

# Script to run E2E tests with proper setup

set -e

echo "🧪 Running E2E tests..."
echo "⚠️  These tests require a valid NOTION_API_KEY in your .env file"
echo ""

# Check if NOTION_API_KEY is set
if [ -z "$NOTION_API_KEY" ]; then
    source .env 2>/dev/null || true
fi

if [ -z "$NOTION_API_KEY" ]; then
    echo "❌ NOTION_API_KEY not found. Please set it in your .env file."
    echo "   E2E tests will be skipped."
    exit 0
fi

# Build the project first
echo "📦 Building project..."
pnpm build

# Run E2E tests
echo "🚀 Starting E2E tests..."
RUN_E2E=true pnpm vitest run --config vitest.e2e.config.ts

echo "✅ E2E tests completed!"