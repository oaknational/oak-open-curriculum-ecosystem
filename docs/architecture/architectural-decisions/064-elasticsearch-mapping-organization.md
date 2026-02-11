# ADR-064: Elasticsearch Index Mapping Organization

**Status**: Superseded by ADR-067
**Date**: 2025-12-04
**Superseded Date**: 2025-12-05
**Decision Makers**: Development Team

## Context

The semantic search application uses Elasticsearch with multiple index types (lessons, units, sequences, etc.). Each index requires a mapping definition that specifies field types, analyzers, and other configuration.

Initially, these mapping files were placed in `scripts/mappings/` alongside setup scripts. This ADR moved them to `src/lib/elasticsearch/definitions/` as static JSON files.

**This ADR has been superseded by [ADR-067: SDK-Generated Elasticsearch Mappings](067-sdk-generated-elasticsearch-mappings.md)**, which moves mapping generation into the SDK's type-gen pipeline.

## Original Decision (Now Superseded)

Elasticsearch index mapping files were stored as static JSON in `src/lib/elasticsearch/definitions/`.

## Current State

ES mappings are now **generated at SDK type-gen time** and imported from:

```typescript
import {
  OAK_LESSONS_MAPPING,
  OAK_UNITS_MAPPING,
  // ...
} from '@oaknational/oak-curriculum-sdk/types/generated/search/index';
```

See [ADR-067](067-sdk-generated-elasticsearch-mappings.md) for the current approach.

## File Structure (Historical)

The following structure existed before ADR-067:

```text
apps/oak-search-cli/
└── src/lib/elasticsearch/
    ├── definitions/                # ← Static JSON files (now deleted)
    │   ├── index.ts                # Documentation only
    │   ├── oak-lessons.json        # DELETED
    │   ├── oak-units.json          # DELETED
    │   └── ...
    └── setup/
        └── index.ts                # Now imports from SDK
```

## Related Documents

- [ADR-063: SDK Domain Synonyms Source of Truth](063-sdk-domain-synonyms-source-of-truth.md)
- [ADR-067: SDK-Generated Elasticsearch Mappings](067-sdk-generated-elasticsearch-mappings.md) - **Current approach**
- Semantic search plans: `.agent/plans/semantic-search/`
- Continuation prompt: `.agent/prompts/semantic-search/semantic-search.prompt.md`
