#!/usr/bin/env bash
# Elasticsearch index setup script
#
# Creates synonyms set and all search indexes.
# Synonyms are generated from SDK ontologyData (single source of truth).
# Mappings are in src/lib/elasticsearch/definitions/.
#
# Usage:
#   ELASTICSEARCH_URL=... ELASTICSEARCH_API_KEY=... ./setup.sh
#
set -Eeuo pipefail

: "${ELASTICSEARCH_URL:?Set ELASTICSEARCH_URL}"
: "${ELASTICSEARCH_API_KEY:?Set ELASTICSEARCH_API_KEY}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEFINITIONS_DIR="$APP_ROOT/src/lib/elasticsearch/definitions"

auth=(-H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" -H "Content-Type: application/json")

echo "Generating synonyms from SDK..."
SYNONYMS_JSON=$(npx tsx "$SCRIPT_DIR/generate-synonyms.ts")

echo "Upserting synonyms set oak-syns..."
echo "$SYNONYMS_JSON" | curl -sS -X PUT "${ELASTICSEARCH_URL}/_synonyms/oak-syns" "${auth[@]}" -d @- >/dev/null

echo "Creating indices (ignore if exist)..."
for idx in oak_lessons oak_unit_rollup oak_units oak_sequences oak_sequence_facets; do
  body="$DEFINITIONS_DIR/${idx//_/-}.json"
  if [[ -f "$body" ]]; then
    curl -sS -o /dev/null -w "%{http_code}" -X PUT "${ELASTICSEARCH_URL}/${idx}" "${auth[@]}" --data-binary @"${body}" || true
  else
    echo "Warning: Missing mapping file $body"
  fi
done

echo "Done."
