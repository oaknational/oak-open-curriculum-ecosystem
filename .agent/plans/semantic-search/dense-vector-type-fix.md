# Dense Vector Type Fix

**Status**: Ready to implement  
**Priority**: Blocking - must be fixed before Phase 1A can proceed  
**Estimated effort**: 15 minutes

---

## Problem

The `EsFieldMapping` interface does not include `'dense_vector'` as a valid field type, causing 9 type errors when we added dense vector field overrides.

### Error Summary

```text
error TS2322: Type '"dense_vector"' is not assignable to type
'"boolean" | "object" | "keyword" | "text" | "search_as_you_type" |
"integer" | "semantic_text" | "completion" | "date" | "long"'.
```

### Affected Files

| File                           | Errors | Description                             |
| ------------------------------ | ------ | --------------------------------------- |
| `es-field-overrides.ts`        | 2      | Where `type: 'dense_vector'` is defined |
| `es-mapping-generators.ts`     | 2      | Where overrides are consumed            |
| `field-alignment.unit.test.ts` | 5      | Tests using the overrides               |

---

## Root Cause

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-config.ts`

The `EsFieldMapping` interface (lines 43-63) defines a union type for `type` that excludes `'dense_vector'`:

```typescript
export interface EsFieldMapping {
  readonly type:
    | 'keyword'
    | 'text'
    | 'integer'
    | 'long'
    | 'boolean'
    | 'date'
    | 'semantic_text'
    | 'completion'
    | 'search_as_you_type'
    | 'object';
  // ... other properties (normalizer, analyzer, etc.)
}
```

When we added dense vector overrides in `es-field-overrides.ts`:

```typescript
lesson_dense_vector: {
  type: 'dense_vector',  // ← Not in union
  dims: 384,
  index: true,
  similarity: 'cosine',
},
```

TypeScript correctly rejects this.

---

## Solution

Update `EsFieldMapping` to support dense vector fields.

### Change 1: Add `'dense_vector'` to type union

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-config.ts`

```typescript
export interface EsFieldMapping {
  readonly type:
    | 'keyword'
    | 'text'
    | 'integer'
    | 'long'
    | 'boolean'
    | 'date'
    | 'semantic_text'
    | 'completion'
    | 'search_as_you_type'
    | 'object'
    | 'dense_vector';  // ← ADD THIS
```

### Change 2: Add dense_vector-specific properties

Add these optional properties to the interface:

```typescript
  // Existing properties...
  readonly enabled?: boolean;

  // Dense vector properties (used when type === 'dense_vector')
  readonly dims?: number;
  readonly index?: boolean;
  readonly similarity?: 'cosine' | 'dot_product' | 'l2_norm';
}
```

---

## Verification Steps

After making changes:

```bash
cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp

# 1. Type check should pass
pnpm type-check

# 2. Tests should pass
pnpm test

# 3. Full quality gates
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix
```

---

## Foundation Document Alignment

This fix follows:

- **Schema-first**: The type definition is the single source of truth for ES field configurations
- **No type shortcuts**: Adding proper types, not using `as` or `any` to work around the issue
- **TDD**: Fix enables the tests to compile and run

---

## After Fix

Delete this file once the fix is implemented and verified.
