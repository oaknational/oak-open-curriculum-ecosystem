# Elasticsearch Serverless Scripts

Environment:

- `ELASTICSEARCH_URL` (e.g., https://...elastic.cloud)
- `ELASTICSEARCH_API_KEY`

Scripts:

- `setup.sh` — creates synonyms + indices (lessons, units, unit_rollup)
- `alias-swap.sh` — atomic alias re-point (optional)

Other scripts:

- `oak-open-curriculum-semantic-search-scaffolding.sh` — scaffolds a basic version of this app
- `apply-split-search-endpoints.sh` — applies a patch to split the search endpoints into separate files
