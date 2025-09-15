#!/usr/bin/env bash
set -Eeuo pipefail
: "${ELASTICSEARCH_URL:?Set ELASTICSEARCH_URL}"
: "${ELASTICSEARCH_API_KEY:?Set ELASTICSEARCH_API_KEY}"
FROM="${1:?Usage: alias-swap.sh <fromIndex> <toIndex> <alias>}"
TO="${2:?Usage: alias-swap.sh <fromIndex> <toIndex> <alias>}"
ALIAS="${3:?Usage: alias-swap.sh <fromIndex> <toIndex> <alias>}"
auth=(-H "Authorization: ApiKey ${ELASTICSEARCH_API_KEY}" -H "Content-Type: application/json")
json=$(cat <<JSON
{ "actions": [ { "remove": { "index": "${FROM}", "alias": "${ALIAS}" } }, { "add": { "index": "${TO}", "alias": "${ALIAS}", "is_write_index": true } } ] }
JSON
)
curl -sS -X POST "${ELASTICSEARCH_URL}/_aliases" "${auth[@]}" -d "${json}" >/dev/null
echo "Alias '${ALIAS}' moved: ${FROM} -> ${TO}"
