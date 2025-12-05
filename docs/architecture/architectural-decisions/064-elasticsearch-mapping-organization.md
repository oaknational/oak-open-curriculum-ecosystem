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
└── src/lib/elasticsearch/
    ├── definitions/                # ← Index mappings live here
    │   ├── index.ts                # Index configuration exports
    │   ├── oak-lessons.json
    │   ├── oak-units.json
    │   ├── oak-unit-rollup.json
    │   ├── oak-sequences.json
    │   ├── oak-sequence-facets.json
    │   └── oak-meta.json           # Index version and ingestion metadata
    ├── setup/
    │   ├── cli.ts                  # Main CLI entry point
    │   ├── index.ts                # Setup logic (create indexes, synonyms)
    │   ├── ingest-live.ts          # Live SDK data ingestion
    │   └── load-app-env.ts         # Environment loading helper
    ├── es-client.ts                # Singleton ES client
    └── elastic-http.ts             # Search helpers
```

## Mapping File Naming Convention

| Index Name            | File Name                  | Purpose                              |
| --------------------- | -------------------------- | ------------------------------------ |
| `oak_lessons`         | `oak-lessons.json`         | Lesson documents with semantic field |
| `oak_units`           | `oak-units.json`           | Basic unit metadata                  |
| `oak_unit_rollup`     | `oak-unit-rollup.json`     | Aggregated unit text for search      |
| `oak_sequences`       | `oak-sequences.json`       | Programme sequence documents         |
| `oak_sequence_facets` | `oak-sequence-facets.json` | Sequence facet navigation            |
| `oak_meta`            | `oak-meta.json`            | Index version and ingestion metadata |

Note: File names use hyphens (`-`), index names use underscores (`_`).

## CLI Usage

The TypeScript CLI creates indexes using mappings from the definitions directory:

```bash
# Create all indexes and deploy synonyms
pnpm es:setup

# Check index status
pnpm es:status

# Ingest live data from SDK
pnpm es:ingest-live --subject maths --verbose
```

The setup code loads mappings directly:

```typescript
// src/lib/elasticsearch/setup/index.ts
import { INDEX_CONFIGS } from '../definitions';

async function createIndex(client: Client, indexName: string): Promise<void> {
  const config = INDEX_CONFIGS[indexName];
  await client.indices.create({ index: indexName, body: config.mapping });
}
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

- The `scripts/mappings/` directory was **deleted**. All mapping files moved to `src/lib/elasticsearch/definitions/`.
- Shell scripts (`setup.sh`) replaced with TypeScript CLI (`pnpm es:setup`).

## Validation Criteria

This decision is successful when:

1. **All mappings in definitions/**: No mapping files in scripts/
2. **TypeScript CLI works**: `pnpm es:setup` successfully creates indexes
3. **Clear organization**: Developers can find mappings intuitively

## Related Documents

- [ADR-063: SDK Domain Synonyms Source of Truth](063-sdk-domain-synonyms-source-of-truth.md)
- Semantic search plans: `.agent/plans/semantic-search/`
- Continuation prompt: `.agent/prompts/semantic-search/semantic-search.prompt.md`

## References

- `apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/definitions/` - Mapping files
- `apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/setup/` - TypeScript CLI
