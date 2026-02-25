#!/usr/bin/env bash
set -euo pipefail

# Verify that working tree changes are confined to generator templates,
# generated outputs, or context logging. This enforces the Stage 3 scope.

CHANGES=$(git status --short)

if [[ -z "${CHANGES}" ]]; then
  echo "Working tree clean."
  exit 0
fi

while IFS= read -r line; do
  # Strip leading status markers (e.g., ' M')
  path="${line:3}"
case "${path}" in
    scripts/check-generator-scope.sh) ;;
    packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/*) ;;
    packages/sdks/oak-sdk-codegen/src/types/generated/*) ;;
    *)
      echo "❌ Disallowed change detected: ${path}"
      exit 1
      ;;
  esac
done <<< "${CHANGES}"

echo "✅ Changes confined to generator scope."
