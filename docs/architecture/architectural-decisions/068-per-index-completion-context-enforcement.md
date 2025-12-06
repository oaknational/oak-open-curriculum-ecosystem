# ADR-068: Per-Index Completion Context Enforcement

## Status

Accepted

## Context

During Elasticsearch ingestion, a `strict_dynamic_mapping_exception` error occurred because lesson documents were being sent with a `sequence` context in their `title_suggest` completion field, but the ES mapping for `oak_lessons` only defined `subject` and `key_stage` contexts.

The root cause was that:

1. A single, permissive `SearchCompletionSuggestPayloadSchema` allowed all contexts (`subject`, `key_stage`, `sequence`, `phase`)
2. Document transform functions could include any context without compile-time enforcement
3. ES field overrides defined contexts separately from the Zod schemas
4. There was no single source of truth for per-index completion contexts

This allowed a mismatch where runtime code sent contexts that the ES mapping didn't expect.

## Decision

We implement **per-index completion context enforcement** via a single source of truth:

### 1. Source of Truth: `completion-contexts.ts`

A new module defines per-index completion contexts as readonly tuples:

```typescript
export const LESSONS_COMPLETION_CONTEXTS = ['subject', 'key_stage'] as const;
export const UNITS_COMPLETION_CONTEXTS = ['subject', 'key_stage', 'sequence'] as const;
export const SEQUENCES_COMPLETION_CONTEXTS = ['subject', 'phase'] as const;
// etc.
```

### 2. Generated Per-Index Zod Schemas

The type generator produces strict per-index completion context schemas:

```typescript
export const SearchLessonsCompletionContextsSchema = z
  .object({
    subject: z.array(z.string().min(1)).optional(),
    key_stage: z.array(z.string().min(1)).optional(),
  })
  .strict(); // Rejects extra contexts
```

### 3. ES Overrides Consume Same Source

ES field overrides import from the source of truth:

```typescript
import { LESSONS_COMPLETION_CONTEXTS } from './completion-contexts.js';

export const LESSONS_FIELD_OVERRIDES = {
  title_suggest: {
    type: 'completion',
    contexts: createCompletionContexts(LESSONS_COMPLETION_CONTEXTS),
  },
};
```

### 4. Typed Document Transforms

Document transform functions use per-index completion payload types, so adding an undeclared context fails TypeScript:

```typescript
// This would fail to compile if 'sequence' were added:
title_suggest: {
  input: [lesson.lessonTitle],
  contexts: {
    subject: [subject],
    key_stage: [keyStage],
    // sequence: unitSequenceIds, // TS Error: 'sequence' does not exist
  },
},
```

## Consequences

### Positive

- **Compile-time safety**: Type errors occur immediately if code tries to use undeclared contexts
- **Single source of truth**: One place defines all contexts; both Zod schemas and ES mappings derive from it
- **Deterministic detection**: The bug that previously required runtime ES errors is now caught by `pnpm build`
- **Self-documenting**: The context definitions clearly show what each index supports
- **Regression prevention**: Unit tests verify context alignment between Zod and ES

### Negative

- **More generated code**: Per-index schemas increase the size of generated files
- **Migration cost**: Existing code referencing the old permissive schema needs updating
- **Complexity**: Developers must understand the per-index context model

### Neutral

- The legacy `SearchCompletionSuggestPayloadSchema` is preserved (deprecated) for backwards compatibility

## Related Documents

- ADR-067: SDK Generated Elasticsearch Mappings
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/completion-contexts.ts`
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/completion-context-alignment.unit.test.ts`
