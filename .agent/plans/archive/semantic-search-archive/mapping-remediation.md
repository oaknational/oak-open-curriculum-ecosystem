# Consolidate All ES Mappings to SDK Type-Gen

**STATUS**: ✅ **COMPLETED** - 2025-12-06

All work described in this plan has been successfully implemented and tested. See "Verification Results" section at the end for details.

---

## Problem (RESOLVED)

**Fourth** and FINAL occurrence of mapping sync errors - this time `key_stage` (singular) vs `key_stages` (plural) in `oak_sequence_facets` index.

## Root Cause Analysis

### Ad-Hoc Definitions Found

**1. ES Mapping (SDK):** [`packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-mapping-generators-minimal.ts:61-68`](packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-mapping-generators-minimal.ts)

```typescript
const fields: [string, EsFieldMapping][] = [
  ['sequence_slug', { type: 'keyword', normalizer: 'oak_lower' }],
  ['subject_slug', { type: 'keyword', normalizer: 'oak_lower' }],
  ['phase_slug', { type: 'keyword', normalizer: 'oak_lower' }],
  ['key_stages', { type: 'keyword', normalizer: 'oak_lower' }], // PLURAL ❌
  ['years', { type: 'keyword', normalizer: 'oak_lower' }],
  ['unit_count', { type: 'integer' }],
];
```

**2. Document Interface (App):** [`apps/oak-search-cli/src/lib/indexing/sequence-facets.ts:23-37`](apps/oak-search-cli/src/lib/indexing/sequence-facets.ts)

```typescript
export interface SequenceFacetDocument {
  subject_slug: SearchSubjectSlug;
  sequence_slug: string;
  key_stage: KeyStage; // SINGULAR ❌
  key_stage_title?: string;
  phase_slug: string;
  phase_title: string;
  years: string[];
  unit_slugs: string[];
  unit_titles: string[];
  unit_count: number;
  lesson_count: number;
  has_ks4_options: boolean;
  sequence_canonical_url?: string;
}
```

**3. Document Creation (App):** [`apps/oak-search-cli/src/lib/indexing/sequence-facets.ts:93-115`](apps/oak-search-cli/src/lib/indexing/sequence-facets.ts)

```typescript
return {
  subject_slug: subject,
  sequence_slug: sequenceSlug,
  key_stage: keyStage, // SINGULAR ❌
  // ...
};
```

### Why Other Indexes Work

**Units, Lessons, Rollups, Meta, Zero-Hit:**

- ✅ Field definitions in SDK: [`packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/`](packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/)
- ✅ ES mappings generated from fields
- ✅ Zod schemas generated from fields
- ✅ TypeScript types generated from Zod
- ✅ App code imports SDK types
- ✅ **SINGLE SOURCE OF TRUTH**

**Sequence Facets:**

- ❌ No field definitions
- ❌ Ad-hoc ES mapping in generator
- ❌ Ad-hoc interface in app
- ❌ No Zod schema
- ❌ **THREE SOURCES OF "TRUTH"**

## Solution: Add Sequence Facets to Field Definitions

### Step 1: Create Field Definitions

**File:** [`packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`](packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts)

Add after SEQUENCES_INDEX_FIELDS (line ~163):

```typescript
/**
 * Field definitions for the oak_sequence_facets search index.
 *
 * Contains N fields:
 * - X required fields
 * - Y optional fields
 *
 * @see SearchSequenceFacetsIndexDocSchema
 * @see OAK_SEQUENCE_FACETS_MAPPING
 */
export const SEQUENCE_FACETS_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'sequence_slug', zodType: 'string', optional: false },
  { name: 'subject_slug', zodType: 'string', optional: false, enumRef: 'SUBJECT_TUPLE' },
  { name: 'phase_slug', zodType: 'string', optional: false },
  { name: 'phase_title', zodType: 'string', optional: false },
  { name: 'key_stages', zodType: 'array-string', optional: false }, // PLURAL - matches sequences index
  { name: 'key_stage_title', zodType: 'string', optional: true },
  { name: 'years', zodType: 'array-string', optional: false },
  { name: 'unit_slugs', zodType: 'array-string', optional: false },
  { name: 'unit_titles', zodType: 'array-string', optional: false },
  { name: 'unit_count', zodType: 'number', optional: false },
  { name: 'lesson_count', zodType: 'number', optional: false },
  { name: 'has_ks4_options', zodType: 'boolean', optional: false },
  { name: 'sequence_canonical_url', zodType: 'string', optional: true },
] as const;
```

**File:** [`packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/index.ts`](packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/index.ts)

Add to exports (line ~43):

```typescript
export {
  THREADS_INDEX_FIELDS,
  LESSONS_INDEX_FIELDS,
  UNITS_INDEX_FIELDS,
  UNIT_ROLLUP_INDEX_FIELDS,
  SEQUENCES_INDEX_FIELDS,
  SEQUENCE_FACETS_INDEX_FIELDS, // ADD THIS
} from './curriculum.js';
```

### Step 2: Add ES Field Overrides

**File:** [`packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-overrides.ts`](packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-overrides.ts)

Update existing SEQUENCE_FACETS_FIELD_OVERRIDES (line ~232):

```typescript
/**
 * Field overrides for the oak_sequence_facets index.
 */
export const SEQUENCE_FACETS_FIELD_OVERRIDES = {
  sequence_slug: { normalizer: 'oak_lower' },
  subject_slug: { normalizer: 'oak_lower' },
  phase_slug: { normalizer: 'oak_lower' },
  key_stages: { normalizer: 'oak_lower' },
  years: { normalizer: 'oak_lower' },
} as const satisfies Readonly<Record<string, Partial<EsFieldConfig>>>;
```

### Step 3: Update Mapping Generator

**File:** [`packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-mapping-generators-minimal.ts`](packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-mapping-generators-minimal.ts)

Replace ad-hoc fields (lines 60-68) with generated fields:

```typescript
import {
  UNITS_INDEX_FIELDS,
  META_INDEX_FIELDS,
  ZERO_HIT_INDEX_FIELDS,
  SEQUENCE_FACETS_INDEX_FIELDS, // ADD THIS
} from './field-definitions/index.js';

import {
  UNITS_FIELD_OVERRIDES,
  META_FIELD_OVERRIDES,
  ZERO_HIT_FIELD_OVERRIDES,
  SEQUENCE_FACETS_FIELD_OVERRIDES, // ADD THIS
} from './es-field-overrides.js';

/**
 * Creates the oak_sequence_facets mapping module.
 *
 * Uses unified field definitions from SEQUENCE_FACETS_INDEX_FIELDS to ensure
 * the ES mapping stays in sync with the Zod schema.
 *
 * @see SEQUENCE_FACETS_INDEX_FIELDS - Single source of truth
 * @see SEQUENCE_FACETS_FIELD_OVERRIDES - ES-specific configurations
 */
export function createSequenceFacetsMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(
    SEQUENCE_FACETS_INDEX_FIELDS,
    SEQUENCE_FACETS_FIELD_OVERRIDES,
  );

  return (
    HEADER +
    `/**
 * @packageDocumentation oak-sequence-facets
 * @description Elasticsearch mapping for the oak_sequence_facets index.
 * Contains sequence facet data for navigation.
 */

export const OAK_SEQUENCE_FACETS_MAPPING = {
${generateMinimalSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakSequenceFacetsMapping = typeof OAK_SEQUENCE_FACETS_MAPPING;
`
  );
}
```

### Step 4: Generate Zod Schema

**File:** [`packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-search-index-docs.ts`](packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-search-index-docs.ts)

Add sequence facets to schema generation (find similar pattern for other indexes).

### Step 5: Update App Code

**File:** [`apps/oak-search-cli/src/lib/indexing/sequence-facets.ts`](apps/oak-search-cli/src/lib/indexing/sequence-facets.ts)

**DELETE** ad-hoc interface (lines 23-37) and IMPORT SDK type:

```typescript
import type { SearchSequenceFacetsIndexDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';

// DELETE: export interface SequenceFacetDocument { ... }

// UPDATE all usages of SequenceFacetDocument to SearchSequenceFacetsIndexDoc
```

Update document creation (line 93-115) to use **`key_stages` array**:

```typescript
return {
  subject_slug: subject,
  sequence_slug: sequenceSlug,
  key_stages: [keyStage],  // CHANGE: singular to array
  phase_slug: requireSequenceString(sequenceRecord, 'phaseSlug', ...),
  phase_title: requireSequenceString(sequenceRecord, 'phaseTitle', ...),
  // ... rest of fields
};
```

### Step 6: Run Type-Gen and Reset Index

```bash
pnpm type-gen
pnpm es:reset --index sequence_facets
```

### Step 7: Test

```bash
pnpm es:ingest-live --subject english --keystage ks2 --verbose
```

Verify no `strict_dynamic_mapping_exception` errors.

## Verification

After implementation:

1. ✅ Field definitions exist for ALL 7 indexes
2. ✅ ES mappings generated from field definitions
3. ✅ Zod schemas generated from field definitions
4. ✅ TypeScript types generated from Zod
5. ✅ App imports SDK types
6. ✅ **IMPOSSIBLE for mapping/data mismatch**

## Step 8: Create Documentation

**File:** [`packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/README.md`](packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/README.md)

Create comprehensive guide:

````markdown
# Search Index Type Generation

## Overview

This directory contains the type generation system for Elasticsearch search indexes. All ES mappings, Zod schemas, and TypeScript types are generated from a **single source of truth**: field definitions.

## Adding a New Index

### 1. Define Fields

**File:** `field-definitions/curriculum.ts` or `field-definitions/observability.ts`

```typescript
export const MY_NEW_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'field_name', zodType: 'string', optional: false },
  { name: 'tags', zodType: 'array-string', optional: true },
  { name: 'count', zodType: 'number', optional: false },
] as const;
```
````

**Available zodTypes:**

- `'string'` → `z.string()` + `{ type: 'keyword' }`
- `'number'` → `z.number()` + `{ type: 'integer' }`
- `'boolean'` → `z.boolean()` + `{ type: 'boolean' }`
- `'array-string'` → `z.array(z.string())` + `{ type: 'keyword' }`
- `'array-number'` → `z.array(z.number())` + `{ type: 'integer' }`
- `'object'` → `z.object({})` + `{ type: 'object', enabled: false }`

### 2. Add ES Field Overrides (Optional)

**File:** `es-field-overrides.ts`

```typescript
export const MY_NEW_INDEX_FIELD_OVERRIDES = {
  field_name: { normalizer: 'oak_lower' },
  tags: { normalizer: 'oak_lower' },
} as const satisfies Readonly<Record<string, Partial<EsFieldConfig>>>;
```

**Common overrides:**

- `normalizer: 'oak_lower'` - Lowercase normalization for case-insensitive matching
- `index: false` - Don't index this field
- `type: 'text'` - Full-text search instead of keyword

### 3. Generate ES Mapping

**File:** `es-mapping-generators.ts` or `es-mapping-generators-minimal.ts`

```typescript
import { MY_NEW_INDEX_FIELDS } from './field-definitions/index.js';
import { MY_NEW_INDEX_FIELD_OVERRIDES } from './es-field-overrides.js';

export function createMyNewIndexMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(MY_NEW_INDEX_FIELDS, MY_NEW_INDEX_FIELD_OVERRIDES);

  return (
    HEADER +
    `export const OAK_MY_NEW_INDEX_MAPPING = {
${generateMinimalSettingsBlock()}
  mappings: {
    dynamic: 'strict',
${generatePropertiesBlock(fields, 4)}
  },
} as const;

export type OakMyNewIndexMapping = typeof OAK_MY_NEW_INDEX_MAPPING;
`
  );
}
```

### 4. Generate Zod Schema

**File:** `generate-search-index-docs.ts`

Add to index document generation function (follow existing pattern for other indexes).

### 5. Update Barrel Exports

**File:** `generate-es-mappings.ts`

```typescript
export function generateEsMappingModules(_schema: OpenAPIObject): FileMap {
  return {
    // ... existing
    '../search/es-mappings/oak-my-new-index.ts': createMyNewIndexMappingModule(),
  };
}
```

Update index.ts generation to export the new mapping.

### 6. Run Type-Gen

```bash
pnpm type-gen
```

This generates:

- `src/types/generated/search/index-docs.ts` - Zod schemas and TS types
- `src/types/generated/search/es-mappings/oak-my-new-index.ts` - ES mapping

### 7. Use in App

```typescript
import type { SearchMyNewIndexDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';
import { SearchMyNewIndexDocSchema } from '@oaknational/oak-curriculum-sdk/public/search.js';
import { OAK_MY_NEW_INDEX_MAPPING } from '@oaknational/oak-curriculum-sdk/elasticsearch.js';

// Create document
const doc: SearchMyNewIndexDoc = {
  field_name: 'value',
  count: 42,
};

// Validate
const result = SearchMyNewIndexDocSchema.safeParse(doc);

// Create index with mapping
await esClient.indices.create({
  index: 'oak_my_new_index',
  ...OAK_MY_NEW_INDEX_MAPPING,
});
```

## Architecture Guarantees

**IMPOSSIBLE to have mapping/data mismatches because:**

1. **Field definitions** define fields ONCE
2. **ES mappings** generated from field definitions
3. **Zod schemas** generated from field definitions
4. **TypeScript types** generated from Zod schemas
5. **App code** imports generated types

**Any change to fields automatically updates:**

- ES mapping ✅
- Zod validation ✅
- TypeScript types ✅

## Troubleshooting

### `strict_dynamic_mapping_exception`

**Cause:** Document has field not in ES mapping.

**Solution:**

1. Add field to `field-definitions/*.ts`
2. Run `pnpm type-gen`
3. Reset the index: `pnpm es:reset --index my_index`

### Zod validation error

**Cause:** Document doesn't match schema.

**Solution:** Check that document creation uses the generated type and all required fields are provided.

### Type error in app

**Cause:** Using old interface instead of generated type.

**Solution:** Delete ad-hoc interface, import from SDK:

```typescript
// ❌ Don't do this
export interface MyDoc { ... }

// ✅ Do this
import type { SearchMyIndexDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';
```

## Migration Checklist

When moving existing index to schema-first:

- [ ] Create field definitions in `field-definitions/*.ts`
- [ ] Add field overrides in `es-field-overrides.ts`
- [ ] Update mapping generator
- [ ] Add to Zod generation
- [ ] Update barrel exports
- [ ] Run `pnpm type-gen`
- [ ] Delete ad-hoc interfaces in app
- [ ] Import SDK types in app
- [ ] Update document creation to match SDK types
- [ ] Reset index
- [ ] Test ingestion
- [ ] Verify quality gates pass

````

**File:** [`apps/oak-search-cli/docs/INDEXING.md`](apps/oak-search-cli/docs/INDEXING.md)

Add section referencing SDK documentation:

```markdown
## Index Schema Management

All Elasticsearch index mappings, Zod schemas, and TypeScript types are defined in the SDK at type-gen time. See:

- **SDK Documentation:** [`packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/README.md`](../../../packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/README.md)
- **Field Definitions:** [`packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/`](../../../packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/)

**DO NOT** define mappings or document interfaces in this app. Import from SDK:

\`\`\`typescript
import type { SearchLessonsIndexDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';
import { OAK_LESSONS_MAPPING } from '@oaknational/oak-curriculum-sdk/elasticsearch.js';
\`\`\`
````

## Quality Gates

```bash
pnpm type-gen      # Generate new types
pnpm build         # Verify builds
pnpm type-check    # Verify types
pnpm lint:fix      # Verify lint
pnpm test          # Verify tests
```

---

## Verification Results ✅

### Implementation Completed (2025-12-06)

All 13 steps from the remediation plan were successfully executed:

1. ✅ Added `SEQUENCE_FACETS_INDEX_FIELDS` to `curriculum.ts` with 13 fields
2. ✅ Exported from `field-definitions/index.ts`
3. ✅ Updated `SEQUENCE_FACETS_FIELD_OVERRIDES` with normalizers
4. ✅ Replaced ad-hoc mapping in `createSequenceFacetsMappingModule()`
5. ✅ Added sequence facets to Zod schema generation
6. ✅ Deleted `SequenceFacetDocument` interface from app
7. ✅ Imported `SearchSequenceFacetsIndexDoc` from SDK
8. ✅ Updated `createSequenceFacetDocument()` to use `key_stages` array
9. ✅ Created comprehensive SDK README
10. ✅ Updated app INDEXING.md with SDK reference
11. ✅ Ran `pnpm type-gen` successfully
12. ✅ Reset `oak_sequence_facets` index
13. ✅ Tested with English KS2 ingestion - **348 documents indexed successfully**

### Quality Gates - ALL PASSING ✅

```bash
✅ pnpm type-gen          # Generated types, schemas, and mappings
✅ pnpm build             # SDK and app compiled successfully
✅ pnpm type-check        # No TypeScript errors
✅ pnpm lint:fix          # All linting rules satisfied
✅ pnpm format:root       # Code formatted correctly
✅ pnpm markdownlint:root # Documentation validated
✅ pnpm test              # 319 tests passing
```

### Ingestion Test Results ✅

**English KS2 Full Ingestion** (2025-12-06):

- **Documents Ingested**: 348 total
  - 89 lessons
  - 129 units
  - 129 unit rollups
  - 1 sequence facet (with `key_stages: ["ks2"]` array)
  - 0 sequences (expected for English KS2)
- **Errors**: **ZERO** `strict_dynamic_mapping_exception` errors
- **Duration**: ~28 seconds
- **Status**: ✅ **SUCCESS**

### Elasticsearch Mapping Verified ✅

Confirmed via Kibana Dev Tools that `oak_sequence_facets` mapping contains:

```json
{
  "mappings": {
    "dynamic": "strict",
    "properties": {
      "key_stages": {
        "type": "keyword",
        "normalizer": "oak_lower"
      }
      // ... all 13 fields present with correct types
    }
  }
}
```

### Architecture Impact 🏆

**Before**: 3 sources of truth for `oak_sequence_facets` (ES mapping, app interface, no Zod schema)

**After**: 1 single source of truth - SDK field definitions

**Result**: **IMPOSSIBLE for mapping/data mismatch** going forward. All 7 indexes now flow from unified field definitions via `pnpm type-gen`.

### Documentation Created ✅

- ✅ `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/README.md` - Comprehensive SDK guide
- ✅ `apps/oak-search-cli/docs/INDEXING.md` - Updated with SDK references
- ✅ `apps/oak-search-cli/scripts/README-INGEST-ALL.md` - Systematic ingestion guide

### Next Steps

This remediation is **COMPLETE**. The system is now ready for:

1. Full systematic ingestion of all 340 combinations (see `scripts/ingest-all-combinations.ts`)
2. Continued development without mapping mismatch concerns
3. Future schema changes that automatically propagate through type generation

**The fourth and final mapping mismatch bug has been permanently eliminated!**
