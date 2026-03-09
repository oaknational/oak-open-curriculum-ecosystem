---
name: Fix Snags and Bug Report
overview: Fix the two code defects found during the oak-preview smoke test (sequence keyStage filter, suggest url:''), then write a structured bug report for the upstream oak-openapi team covering the three issues that belong there.
todos:
  - id: defect-a-red
    content: "TDD RED: Write search-sequences.unit.test.ts asserting keyStage filter is included in ES query"
    status: completed
  - id: defect-a-green
    content: "TDD GREEN: Add keyStage filter to searchSequences() and verify in CLI rrf-query-builders if applicable"
    status: completed
  - id: defect-b-red
    content: "TDD RED: Write/update test asserting suggestion items validate against SearchSuggestionItemSchema"
    status: completed
  - id: defect-b-green
    content: "TDD GREEN: Fix codegen source for suggestions.ts to allow empty url; verify suggest-completion.ts and suggest-bool-prefix.ts comply"
    status: completed
  - id: quality-gates
    content: Run pnpm type-check, lint, test across all workspaces to confirm no regressions
    status: completed
  - id: bug-report
    content: Write .agent/reports/oak-openapi-bug-report-2026-03-07.md with three upstream issues, reproduction steps, and suggested fixes
    status: completed
isProject: false
---

# Fix Oak-Preview Snags and Write Upstream Bug Report

## Context

The [oak-preview MCP snagging session](bcff5438-4386-4cf6-905a-da01800a8646) identified six issues. Three are our code, three are upstream. The user will handle re-indexing separately.

## Part 1: Fix Our Code (2 defects)

### Defect A: `searchSequences` ignores keyStage filter

**File**: `[packages/sdks/oak-search-sdk/src/retrieval/search-sequences.ts](packages/sdks/oak-search-sdk/src/retrieval/search-sequences.ts)` (lines 45-51)

The function builds filters for `subject` and `phaseSlug` but silently drops `keyStage`. The sibling `sequence-facets.ts` already does this correctly:

```typescript
// sequence-facets.ts line 44 — the working pattern:
filters.push({ term: { key_stages: params.keyStage } });
```

The ES mapping field is `key_stages` (plural, keyword array) in `[oak-sequences.ts](packages/sdks/oak-sdk-codegen/src/types/generated/search/es-mappings/oak-sequences.ts)` line 91. `SearchSequencesParams` already declares `keyStage?: KeyStage` via `SearchParamsBase`.

**Fix** (TDD):

- RED: Write a unit test for `searchSequences` asserting that when `keyStage` is provided, the filter clause includes `{ term: { key_stages: '<value>' } }`
- GREEN: Add the missing filter block after the `phaseSlug` check:

```typescript
if (params.keyStage) {
  filters.push({ term: { key_stages: params.keyStage } });
}
```

- REFACTOR: Confirm no other sequence search paths are missing this filter (the CLI `rrf-query-builders.ts` `createSequenceFilters` has the same gap -- fix there too if it exists)

**Test file**: Create `search-sequences.unit.test.ts` alongside existing retrieval tests.

### Defect B: Suggest pipeline hardcodes `url: ''` (schema violation)

Two files emit `url: ''`:

- `[suggest-completion.ts](packages/sdks/oak-search-sdk/src/retrieval/suggest-completion.ts)` line 121
- `[suggest-bool-prefix.ts](packages/sdks/oak-search-sdk/src/retrieval/suggest-bool-prefix.ts)` line 83

The `SearchSuggestionItemSchema` in `[suggestions.ts](packages/sdks/oak-sdk-codegen/src/types/generated/search/suggestions.ts)` line 32 requires `url: z.string().min(1)` -- so every emitted suggestion technically violates the schema.

**Design decision**: Suggestions are type-ahead labels; they do not have canonical URLs. The correct fix is to relax the schema, not invent URLs.

**Fix** (TDD):

- RED: Write/update tests asserting that suggestion items are valid against `SearchSuggestionItemSchema` -- these should currently fail because `url: ''` violates `.min(1)`
- GREEN: Change the generated schema so `url` allows empty string: `z.string()` (drop `.min(1)`) -- or make `url` optional. Since this is a generated file, the fix goes in the codegen source that produces `suggestions.ts`
- GREEN (runtime): Both `suggest-completion.ts` and `suggest-bool-prefix.ts` can keep `url: ''` if the schema allows it, or switch to omitting `url` if the schema makes it optional
- REFACTOR: Verify the existing `suggestions.integration.test.ts` still passes. Confirm no downstream consumers rely on a non-empty `url`

**Codegen source**: The schema in `suggestions.ts` is generated. Need to trace the codegen generator that emits it to make the schema change at the source.

### Quality gates after both fixes

```bash
pnpm type-check && pnpm lint && pnpm test
```

---

## Part 2: Upstream Bug Report for oak-openapi

Write a markdown file at `.agent/reports/oak-openapi-bug-report-2026-03-07.md` documenting three upstream issues with reproduction steps. This file can be shared directly with the API team.

### Upstream Issue 1: Inconsistent content blocking across lesson sub-resources

- `get-lessons-summary` returns data for lessons in blocked subjects
- `get-lessons-quiz` returns 400 "blocked" for the same lessons
- Root cause: different gating functions applied per sub-resource in `[queryGate.ts](../../oak-openapi/src/lib/queryGate.ts)` -- `blockLessonForCopyrightText` vs `checkLessonAllowedAsset` apply different allow-lists and logic
- Suggested fix: align all lesson sub-resource endpoints to the same gating policy, or document the intentional differences

### Upstream Issue 2: `get-threads` response omits subject context

- `AllThreadsResponseSchema` returns `title`, `slug`, `canonicalUrl` but no `subjectSlug` or `subjectTitle`
- Threads are cross-subject by nature, but each thread belongs to one or more subjects in the data
- Without subject context, consumers cannot filter or group threads meaningfully
- Suggested fix: add `subjects` (array of subject slugs) to the threads response schema

### Upstream Issue 3: Swapped offset/limit descriptions

- In the OpenAPI spec for `get-key-stages-subject-lessons`, the `offset` parameter has the description that belongs to `limit` and vice versa
- Source: `[path-parameters.ts](packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/path-parameters.ts)` lines 1102-1121 (generated from upstream spec)
- `offset` says "Limit the number of lessons returned per unit..." (should be on `limit`)
- `limit` says "Offset applied to lessons within each unit..." (should be on `offset`)
- Suggested fix: swap the two description strings in the upstream spec

---

## Non-goals (YAGNI)

- Re-indexing Elasticsearch data (user-owned, separate task)
- Thread canonical URL changes (threads have no web page -- this is by design)
- Thread search relevance improvements (threads are structural, not topical -- expected behaviour)
- Changes to the CLI `rrf-query-builders.ts` beyond the keyStage filter alignment
