# ADR-064: Elasticsearch Index Mapping Organization

**Status**: Accepted  
**Date**: 2025-12-04  
**Decision Makers**: Development Team

## Context

The semantic search application uses Elasticsearch with multiple index types (lessons, units, sequences, etc.). Each index requires a mapping definition that specifies field types, analyzers, and other configuration.

Initially, these mapping files were placed in `scripts/mappings/` alongside setup scripts. However, this placement was problematic:

- **Semantic mismatch**: Mappings are not "scripts" - they are data definitions
- **Import difficulty**: Scripts directory is not a natural import target for application code
- **Discoverability**: Developers looking for index definitions wouldn't intuitively check `scripts/`
- **Separation of concerns**: Production configuration mixed with operational tooling

## Problem Statement

Where should Elasticsearch index mapping definition files live within the semantic search application?

## Decision

**Elasticsearch index mapping files live in `src/lib/elasticsearch/definitions/`.**

This location:

1. Places definitions alongside the Elasticsearch client code that uses them
2. Makes them importable as part of the application's library code
3. Clearly identifies them as configuration definitions, not scripts
4. Follows the pattern of "code near related code"

## File Structure

```text
apps/oak-open-curriculum-semantic-search/
├── scripts/
│   ├── setup.sh                    # Operational script (reads from definitions/)
│   ├── generate-synonyms.ts        # Generates synonyms from SDK
│   └── sandbox/
│       └── ingest.ts               # Data ingestion CLI
│
└── src/lib/elasticsearch/
    ├── definitions/                # ← Index mappings live here
    │   ├── oak-lessons.json
    │   ├── oak-units.json
    │   ├── oak-unit-rollup.json
    │   ├── oak-sequences.json
    │   └── oak-sequence-facets.json
    ├── es-client.ts                # Singleton ES client
    └── elastic-http.ts             # Search helpers
```

## Mapping File Naming Convention

| Index Name            | File Name                  |
| --------------------- | -------------------------- |
| `oak_lessons`         | `oak-lessons.json`         |
| `oak_units`           | `oak-units.json`           |
| `oak_unit_rollup`     | `oak-unit-rollup.json`     |
| `oak_sequences`       | `oak-sequences.json`       |
| `oak_sequence_facets` | `oak-sequence-facets.json` |

Note: File names use hyphens (`-`), index names use underscores (`_`).

## Script References

The `setup.sh` script references mappings from the new location:

```bash
DEFINITIONS_DIR="$APP_ROOT/src/lib/elasticsearch/definitions"

for idx in oak_lessons oak_units oak_unit_rollup oak_sequences oak_sequence_facets; do
  body="$DEFINITIONS_DIR/${idx//_/-}.json"
  curl -X PUT "${ES_URL}/${idx}" --data-binary @"${body}"
done
```

## Consequences

### Positive

1. **Logical grouping**: Mappings near ES client code
2. **Importable**: Can be imported in TypeScript if needed
3. **Discoverable**: Natural location for index definitions
4. **Clean scripts/**: Scripts directory contains only operational tools

### Negative

1. **Migration required**: Existing references needed updating
2. **Path length**: Slightly longer path than `scripts/mappings/`

### Migration Notes

The `scripts/mappings/` directory was **deleted**. All mapping files moved to `src/lib/elasticsearch/definitions/`.

## Validation Criteria

This decision is successful when:

1. **All mappings in definitions/**: No mapping files in scripts/
2. **Setup script works**: `setup.sh` successfully creates indexes
3. **Clear organization**: Developers can find mappings intuitively

## Related Documents

- [ADR-063: SDK Domain Synonyms Source of Truth](063-sdk-domain-synonyms-source-of-truth.md)
- Semantic search plans: `.agent/plans/semantic-search/`
- ES deployment guide: `.agent/prompts/semantic-search/elasticsearch-serverless-deployment.prompt.md`

## References

- `apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/definitions/` - Mapping files
- `apps/oak-open-curriculum-semantic-search/scripts/setup.sh` - Setup script
