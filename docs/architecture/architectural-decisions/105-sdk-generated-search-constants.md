# ADR-105: SDK-Generated Search Constants for Encoded Domain Knowledge

## Status

Accepted (2026-01-27)

## Context

The Oak curriculum has domain knowledge that is **not present in the OpenAPI schema** but is essential for correct search behaviour. Specifically:

- The OpenAPI schema defines 17 canonical subjects
- Bulk data files contain 4 additional KS4 science variants: `physics`, `chemistry`, `biology`, `combined-science`
- These 21 total subjects require a hierarchical relationship for correct filtering

This domain knowledge was previously scattered across application code, leading to:

1. Inconsistent handling across ingestion and query paths
2. Manual maintenance of mappings in multiple locations
3. No type safety for the expanded subject set

Following [ADR-036](./036-data-driven-type-generation.md) (Data-Driven Type Generation), we prefer generating data structures over imperative code. However, this domain knowledge cannot be derived from the OpenAPI schema.

## Decision

**Generate search constants and types in the SDK for domain knowledge not available in the schema.**

### Generator Location

```text
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/
└── generate-subject-hierarchy.ts   # Subject hierarchy generator
```

### Generated Output

```text
packages/sdks/oak-curriculum-sdk/src/types/generated/search/
└── subject-hierarchy.ts            # Generated constants, types, and guards
```

### Pattern

The generator produces:

1. **Lookup tables** - `SUBJECT_TO_PARENT`, `PARENT_TO_SUBJECTS`
2. **Arrays** - `ALL_SUBJECTS` (21), `KS4_SCIENCE_VARIANTS` (4)
3. **Types** - `AllSubjectSlug`, `ParentSubjectSlug`, `Ks4ScienceVariant`
4. **Type guards** - `isKs4ScienceVariant()`, `isAllSubject()`
5. **Helper functions** - `getSubjectParent()`

```typescript
// Generated output (simplified)
export const SUBJECT_TO_PARENT = {
  physics: 'science',
  chemistry: 'science',
  biology: 'science',
  'combined-science': 'science',
  maths: 'maths',
  // ... all 21 subjects
} as const;

export type AllSubjectSlug = keyof typeof SUBJECT_TO_PARENT;
export type ParentSubjectSlug = (typeof SUBJECT_TO_PARENT)[AllSubjectSlug];

export function isKs4ScienceVariant(s: string): s is Ks4ScienceVariant {
  return KS4_SCIENCE_VARIANTS.includes(s as Ks4ScienceVariant);
}
```

### SDK Public API

Exported from `@oaknational/oak-curriculum-sdk`:

- `SUBJECT_TO_PARENT`, `ALL_SUBJECTS`, `KS4_SCIENCE_VARIANTS`, `PARENT_TO_SUBJECTS`
- `isKs4ScienceVariant()`, `getSubjectParent()`, `isAllSubject()`
- Types: `AllSubjectSlug`, `ParentSubjectSlug`, `Ks4ScienceVariant`

## Rationale

### Why Not Wait for Schema?

The OpenAPI schema may eventually include the full subject hierarchy, but:

1. Upstream schema changes are outside our control
2. Search functionality is blocked until the hierarchy is available
3. Generator approach allows seamless migration when schema is updated

### Relationship to ADR-036

This follows [ADR-036](./036-data-driven-type-generation.md) principles:

- Generate data structures, not imperative code
- Types derived from data using `typeof`
- Type guards validate against the data structure

The difference: **source is hardcoded domain knowledge, not schema extraction**.

### Future Migration Path

When the OpenAPI schema includes subject hierarchy:

1. Update generator to extract from schema instead of hardcoded values
2. Generated output format remains identical
3. Consumers require no changes

## Consequences

### Positive

1. **Single source of truth** - Subject hierarchy defined once in SDK
2. **Type safety** - `AllSubjectSlug` enforces correct usage across codebase
3. **Follows existing patterns** - Uses ADR-036 data-driven approach
4. **Clear migration path** - Can switch to schema extraction later

### Negative

1. **Hardcoded domain knowledge** - Must be manually updated if subjects change
2. **Not schema-derived** - Deviates from cardinal rule temporarily

### Mitigations

- Generator includes comprehensive JSDoc explaining the temporary nature
- Unit tests validate the hardcoded values against expected structure
- Clear TODO for future schema migration

## Related Decisions

- [ADR-036](./036-data-driven-type-generation.md) - Data-driven type generation pattern (parent pattern)
- [ADR-067](./067-sdk-generated-elasticsearch-mappings.md) - SDK-generated ES mappings
- [ADR-101](./101-subject-hierarchy-for-search-filtering.md) - Subject hierarchy for search filtering (consumer)

## Implementation

- Generator: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-subject-hierarchy.ts`
- Output: `packages/sdks/oak-curriculum-sdk/src/types/generated/search/subject-hierarchy.ts`
- Tests: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/generate-subject-hierarchy.unit.test.ts`
