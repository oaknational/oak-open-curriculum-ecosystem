# Elasticsearch Serverless Scripts

## Environment Variables

- `ELASTICSEARCH_URL` — ES endpoint (e.g., `https://...elastic.cloud`)
- `ELASTICSEARCH_API_KEY` — API key with manage/read/write privileges

## Operational Scripts

### setup.sh

Creates synonyms set and all 5 search indexes:

```bash
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
```

Creates:

- `oak-syns` — Synonym set (generated from SDK ontologyData)
- `oak_lessons` — Lesson documents with semantic embeddings
- `oak_unit_rollup` — Unit documents with aggregated content
- `oak_units` — Basic unit metadata
- `oak_sequences` — Programme sequence documents
- `oak_sequence_facets` — Sequence facet metadata for navigation

## Synonyms (Single Source of Truth)

Synonyms are defined in the SDK at:
`@oaknational/oak-curriculum-sdk` → `ontologyData.synonyms`

The `generate-synonyms.ts` script exports to ES-compatible format.
This ensures synonyms are consistent across MCP tools, search, and other consumers.

### alias-swap.sh

Atomic alias re-pointing for zero-downtime deployments:

```bash
./alias-swap.sh <fromIndex> <toIndex> <alias>
```

## Data Ingestion

### sandbox/ingest.ts

CLI for fixture or live SDK data ingestion:

```bash
pnpm sandbox:ingest --target sandbox --dry-run  # Preview
pnpm sandbox:ingest --target sandbox            # Ingest
```

## Maintenance

### observability/delete-zero-hit-events.ts

Purge old zero-hit telemetry events:

```bash
pnpm zero-hit:purge --target sandbox --older-than-days 30 --force
```

## Mapping Files

All index mappings are in `mappings/`:

- `oak-lessons.json` — Lessons with semantic_text, completion
- `oak-unit-rollup.json` — Unit rollups with semantic_text
- `oak-units.json` — Basic unit metadata
- `oak-sequences.json` — Sequences with semantic_text
- `oak-sequence-facets.json` — Sequence facet navigation data

## Archive

The `archive/scaffolding/` directory contains historical scripts used to bootstrap the app. These are for reference only and should NOT be run.
