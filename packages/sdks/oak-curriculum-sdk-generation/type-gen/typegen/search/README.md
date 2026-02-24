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
import { MY_NEW_INDEX_FIELD_OVERRIDES } from './es-field-overrides/index.js';

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
import type { SearchMyNewIndexDoc } from '@oaknational/curriculum-sdk/public/search.js';
import { SearchMyNewIndexDocSchema } from '@oaknational/curriculum-sdk/public/search.js';
import { OAK_MY_NEW_INDEX_MAPPING } from '@oaknational/curriculum-sdk/elasticsearch.js';

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
import type { SearchMyIndexDoc } from '@oaknational/curriculum-sdk/public/search.js';
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
