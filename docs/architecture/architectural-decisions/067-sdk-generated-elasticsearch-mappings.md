# ADR-067: SDK-Generated Elasticsearch Mappings

**Status**: Accepted
**Date**: 2025-12-05
**Decision Makers**: Development Team
**Supersedes**: [ADR-064](064-elasticsearch-mapping-organization.md)

## Context

The semantic search application requires Elasticsearch index mappings that define field types, analyzers, and search-specific configurations. Previously (ADR-064), these were stored as static JSON files in `src/lib/elasticsearch/definitions/`.

However, this created a maintenance problem:

1. **Schema drift**: The SDK generates Zod schemas for index documents at type-gen time, but ES mappings were maintained separately as static JSON
2. **Manual synchronisation**: Adding fields (like thread support) required updating both the Zod schemas AND the JSON mappings
3. **No validation**: Nothing prevented the ES mappings from drifting out of sync with the SDK schemas

This violated the cardinal rule: **All static data structures, types, and validators MUST flow from the OpenAPI schema via `pnpm type-gen`**.

## Problem Statement

How do we ensure Elasticsearch index mappings stay synchronised with SDK-generated Zod schemas while supporting ES-specific field configurations?

## Decision

**Elasticsearch index mappings are generated at SDK type-gen time and exported as TypeScript const objects.**

### Architecture

```text
packages/sdks/oak-curriculum-sdk/
├── type-gen/typegen/search/
│   ├── es-field-config.ts           # Core types and Zod→ES mapping functions
│   ├── es-field-overrides.ts        # ES-specific field configurations (source)
│   ├── es-mapping-utils.ts          # Code generation utilities
│   ├── es-mapping-generators.ts     # Primary index generators
│   ├── es-mapping-generators-minimal.ts  # Simple index generators
│   └── generate-es-mappings.ts      # Generator orchestration
└── src/types/generated/search/
    └── es-mappings/                 # GENERATED at type-gen time
        ├── index.ts
        ├── oak-lessons.ts
        ├── oak-units.ts
        ├── oak-unit-rollup.ts
        ├── oak-sequences.ts
        ├── oak-sequence-facets.ts
        └── oak-meta.ts
```

### How It Works

1. **Field overrides** (`es-field-overrides.ts`) define ES-specific configurations that can't be derived from Zod types:
   - `semantic_text` fields for vector search
   - `completion` fields with contexts for suggestions
   - `text` fields with custom analyzers
   - URL fields with `ignore_above` limits

2. **Generator** produces TypeScript modules with const objects:

   ```typescript
   export const OAK_LESSONS_MAPPING = {
     settings: {
       analysis: {
         /* analyzers, normalizers, filters */
       },
     },
     mappings: {
       dynamic: 'strict',
       properties: {
         lesson_id: { type: 'keyword', normalizer: 'oak_lower' },
         lesson_semantic: { type: 'semantic_text' },
         // ...
       },
     },
   } as const;
   ```

3. **Search app** imports mappings from SDK:

   ```typescript
   import {
     OAK_LESSONS_MAPPING,
     OAK_UNITS_MAPPING,
   } from '@oaknational/oak-curriculum-sdk/types/generated/search/index';
   ```

### Hybrid Approach: Zod Types + ES Overrides

Not all ES field types can be derived from Zod:

| Zod Type              | Default ES Type          | Override Examples                                    |
| --------------------- | ------------------------ | ---------------------------------------------------- |
| `z.string()`          | `keyword`                | `semantic_text`, `text` with analyzers, `completion` |
| `z.number()`          | `integer`                | -                                                    |
| `z.boolean()`         | `boolean`                | -                                                    |
| `z.array(z.string())` | `keyword` (multi-valued) | `text` for searchable arrays                         |

The generator uses a two-step process:

1. Map Zod types to basic ES types with default normalizer
2. Apply explicit overrides for ES-specific configurations

## Consequences

### Positive

1. **Single source of truth**: ES mappings derived from SDK schemas at type-gen time
2. **No drift**: Adding thread fields to Zod schema automatically adds them to ES mappings
3. **Type safety**: Mappings exported as `as const` provide compile-time type checking
4. **Validated at build**: Generator failures surface immediately during `pnpm type-gen`
5. **Clean search app**: No static JSON files to maintain

### Negative

1. **ES-specific config in SDK**: Field overrides live in SDK rather than search app
2. **Generator complexity**: More code to maintain than static JSON files
3. **Learning curve**: Developers must understand the generator to add new field types

### Mitigations

- Field overrides are clearly documented and separated into their own file
- Generator has comprehensive unit tests
- The hybrid approach preserves ES flexibility while enforcing schema consistency

## Validation Criteria

This decision is successful when:

1. **No static JSON mappings**: All JSON files deleted from `definitions/`
2. **Type-gen produces mappings**: `pnpm type-gen` generates `es-mappings/*.ts`
3. **Search app imports from SDK**: `setup/index.ts` uses SDK exports
4. **All quality gates pass**: Including build, type-check, and tests

## File Locations

### SDK Generator Files (Source)

```text
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/
├── es-field-config.ts           # Types, Zod→ES mapping functions
├── es-field-overrides.ts        # ES-specific field configurations
├── es-mapping-utils.ts          # Code generation utilities
├── es-mapping-generators.ts     # Primary index generators
├── es-mapping-generators-minimal.ts  # Simple index generators
├── generate-es-mappings.ts      # Generator entry point
└── generate-subject-hierarchy.ts # Subject hierarchy generator (ADR-105)
```

### SDK Generated Files (Output)

```text
packages/sdks/oak-curriculum-sdk/src/types/generated/search/
├── es-mappings/
│   ├── index.ts                 # Barrel exports
│   ├── oak-lessons.ts           # Lessons index mapping
│   ├── oak-units.ts             # Units index mapping
│   ├── oak-unit-rollup.ts       # Unit rollup mapping
│   ├── oak-sequences.ts         # Sequences mapping
│   ├── oak-sequence-facets.ts   # Sequence facets mapping
│   └── oak-meta.ts              # Metadata mapping
└── subject-hierarchy.ts         # Subject hierarchy constants (ADR-105)
```

### Search App (Consumer)

```text
apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/
├── definitions/
│   └── index.ts                 # Documentation only (JSON files deleted)
└── setup/
    └── index.ts                 # Imports mappings from SDK
```

## Related Documents

- [ADR-063: SDK Domain Synonyms Source of Truth](063-sdk-domain-synonyms-source-of-truth.md)
- [ADR-064: Elasticsearch Mapping Organization](064-elasticsearch-mapping-organization.md) (superseded)
- [ADR-105: SDK-Generated Search Constants](105-sdk-generated-search-constants.md) — Subject hierarchy generator
- Cardinal rule: `.agent/directives/rules.md`
- Schema-first execution: `.agent/directives/schema-first-execution.md`

## References

- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/` - Generator source
- `packages/sdks/oak-curriculum-sdk/src/types/generated/search/es-mappings/` - Generated output
- `apps/oak-open-curriculum-semantic-search/src/lib/elasticsearch/setup/index.ts` - Consumer
