#!/usr/bin/env bash
set -Eeuo pipefail
: "${ELASTICSEARCH_URL:?Set ELASTICSEARCH_URL}"
: "${ELASTICSEARCH_API_KEY:?Set ELASTICSEARCH_API_KEY}"

auth=(-H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" -H "Content-Type: application/json")

echo "Upserting synonyms set oak-syns..."
curl -sS -X PUT "${ELASTICSEARCH_URL}/_synonyms/oak-syns" "${auth[@]}" --data-binary @"$(dirname "$0")/synonyms.json" >/dev/null

echo "Creating indices (ignore if exist)..."
for idx in oak_lessons oak_unit_rollup oak_units oak_sequences; do
  body="$(dirname "$0")/mappings/${idx//_/-}.json"
  curl -sS -o /dev/null -w "%{http_code}" -X PUT "${ELASTICSEARCH_URL}/${idx}" "${auth[@]}" --data-binary @"${body}" || true
done
echo "Done."
