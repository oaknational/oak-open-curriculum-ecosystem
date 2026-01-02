# Document Builder DRY/SRP Analysis

## Summary

This analysis examines the current document builder architecture for opportunities to improve DRY (Don't Repeat Yourself) and SRP (Single Responsibility Principle) compliance ahead of implementing data completeness features.

## Current Architecture (Positive Patterns)

The codebase already follows strong DRY patterns:

### Shared Core Builders

| Module | Builder Function | Purpose |
|--------|------------------|---------|
| `unit-document-core.ts` | `buildUnitDocument()` | Single source of truth for unit docs |
| `lesson-document-core.ts` | `buildLessonDocument()` | Single source of truth for lesson docs |
| `sequence-document-builder.ts` | `createSequenceDocument()` | Sequence docs |
| `thread-document-builder.ts` | `createThreadDocument()` | Thread docs |
| `sequence-facets.ts` | `createSequenceFacetDoc()` | Sequence facet docs |

### Input-Agnostic Interfaces

Each builder accepts an input-agnostic params interface, allowing both API and bulk paths to provide data:

- `CreateUnitDocParams`
- `CreateLessonDocParams`
- `CreateSequenceDocumentParams`
- `CreateThreadDocumentParams`
- `CreateSequenceFacetDocParams`

### Source Adapters

Extractors transform source-specific types to input-agnostic params:

- `extractUnitParamsFromAPI()` - API path
- `extractUnitParamsFromBulk()` - Bulk path
- Similar pattern for lessons

## Issues Identified

### Issue 1: Duplicated URL Generation Logic

**Problem**: URL generation is scattered across multiple files with hardcoded patterns.

| File | Function/Pattern |
|------|------------------|
| `bulk-transform-helpers.ts` | `generateLessonUrl()`, `generateUnitUrl()`, `generateSubjectProgrammesUrl()` |
| `sequence-document-builder.ts` | Hardcoded: `` `https://www.thenational.academy/teachers/programmes/${sequenceSlug}/units` `` |
| `thread-document-builder.ts` | Hardcoded: `` `https://www.thenational.academy/teachers/curriculum/threads/${threadSlug}` `` |

**Solution**: Consolidate to `canonical-url-generator.ts`.

### Issue 2: Duplicated Subject Derivation from Sequence

**Problem**: Two nearly identical functions exist:

```typescript
// bulk-sequence-transformer.ts
function deriveSubjectSlugFromSequence(sequenceSlug: string): SearchSubjectSlug

// bulk-thread-transformer.ts  
function deriveSubjectFromSequence(sequenceSlug: string): string
```

**Solution**: Consolidate to `slug-derivation.ts`.

### Issue 3: Missing Canonical URL for Sequence Facets (Bulk Path)

**Problem**: In `bulk-sequence-transformer.ts`, the `canonicalUrl` parameter is not passed to `createSequenceFacetDoc()`.

```typescript
// extractSequenceFacetParamsFromBulkFile() does not set canonicalUrl
results.push({
  // ... other params
  // canonicalUrl: ??? <-- MISSING
});
```

**Solution**: Add `canonicalUrl` parameter using shared URL generator.

### Issue 4: Empty Category Titles

**Problem**: In `bulk-sequence-transformer.ts`:

```typescript
return {
  // ...
  categoryTitles: [], // <-- HARDCODED EMPTY
};
```

**Solution**: Categories need API supplementation (Milestone 5 scope).

## Refactoring Plan

### Phase 1: Create Shared URL Generator

Create `lib/indexing/canonical-url-generator.ts`:

```typescript
export const OAK_BASE_URL = 'https://www.thenational.academy/teachers';

export function generateLessonCanonicalUrl(lessonSlug: string): string;
export function generateUnitCanonicalUrl(unitSlug: string, subjectSlug: string, phaseSlug: string): string;
export function generateSequenceCanonicalUrl(sequenceSlug: string): string;
export function generateThreadCanonicalUrl(threadSlug: string): string;
export function generateSubjectProgrammesUrl(subjectSlug: string, keyStageSlug: string): string;
```

### Phase 2: Create Shared Slug Derivation

Create `lib/indexing/slug-derivation.ts`:

```typescript
export function deriveSubjectSlugFromSequence(sequenceSlug: string): string;
export function derivePhaseSlugFromSequence(sequenceSlug: string): string;
```

### Phase 3: Update Consumers

1. Update `bulk-transform-helpers.ts` to re-export from new modules
2. Update `sequence-document-builder.ts` to use shared URL generator
3. Update `thread-document-builder.ts` to use shared URL generator
4. Update `bulk-sequence-transformer.ts` to:
   - Use shared slug derivation
   - Pass canonical URL to facet docs
5. Update `bulk-thread-transformer.ts` to use shared slug derivation

## Files to Create/Modify

### New Files

- `lib/indexing/canonical-url-generator.ts` - URL generation utilities
- `lib/indexing/slug-derivation.ts` - Slug derivation utilities

### Modified Files

- `adapters/bulk-transform-helpers.ts` - Remove duplicates, re-export
- `lib/indexing/sequence-document-builder.ts` - Use shared URL generator
- `lib/indexing/thread-document-builder.ts` - Use shared URL generator
- `adapters/bulk-sequence-transformer.ts` - Use shared utilities, add canonical URL
- `adapters/bulk-thread-transformer.ts` - Use shared utilities

## Impact on Milestone 5

These refactoring improvements will make Milestone 5 (Data Completeness) simpler:

1. **Category Population**: Shared utilities make it easier to enrich documents
2. **Thread Context**: Consolidated slug derivation simplifies thread membership lookup
3. **Canonical URLs**: All URL patterns in one place for consistency

