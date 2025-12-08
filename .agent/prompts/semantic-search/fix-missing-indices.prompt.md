# Fix Missing Indices Implementation

**Status**: IN PROGRESS  
**Priority**: BLOCKING - Must complete before Phase 1C (Baseline Metrics)  
**Plan**: `.agent/plans/semantic-search/fix-missing-indices-plan.md`  
**Entry Point**: `.agent/prompts/semantic-search/semantic-search.prompt.md`

---

## Context

During the RRF API Update (Phase 1B), an audit revealed two indices have incomplete implementation:

1. **`oak_sequences`** - Mapping exists, but **NO document creation code**
2. **`oak_threads`** - Field definitions exist, but **NO mapping generator** and **NO document creation code**

These gaps were assumed to be working but were never implemented.

---

## Critical Context for Implementation

### SDK Type-Gen Paths (Relative to repo root)

```text
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/
├── field-definitions/
│   └── curriculum.ts          # THREADS_INDEX_FIELDS already exists (7 fields)
├── es-field-overrides/
│   └── threads-overrides.ts   # MUST CREATE
├── es-mapping-generators-minimal.ts  # Add createThreadsMappingModule()
└── generate-es-mappings.ts    # Wire up generator + barrel export
```

### App Ingestion Paths (Relative to repo root)

```text
apps/oak-open-curriculum-semantic-search/src/lib/
├── index-oak-helpers.ts       # buildPairDocuments() - integration point
└── indexing/
    ├── sequence-document-builder.ts     # MUST CREATE
    └── thread-document-builder.ts       # MUST CREATE
```

### Key Insight: Data Sources

- **Sequences**: `context.subjectSequences` is already available in `buildPairDocuments()`
- **Threads**: `unitSummaries` contains `threads[]` field for each unit

### API Data Sources for Index Fields

**`oak_sequences` Fields** (from OpenAPI schema analysis):

| Field | API Source | Notes |
|-------|------------|-------|
| `sequence_slug` | `/subjects/{subject}/sequences` → `sequenceSlug` | Direct |
| `sequence_title` | **Constructed**: `${subjectTitle} ${phaseTitle}` | No `sequenceTitle` in API |
| `subject_slug` | Ingestion context (known at call time) | Direct |
| `subject_title` | `/subjects` → `subjectTitle` | Direct |
| `phase_slug` | `/subjects/{subject}/sequences` → `phaseSlug` | Direct |
| `phase_title` | `/subjects/{subject}/sequences` → `phaseTitle` | Direct |
| `key_stages` | `/subjects/{subject}/sequences` → `keyStages[].keyStageSlug` | Array |
| `years` | `/subjects/{subject}/sequences` → `years[]` | Array |
| `unit_slugs` | `/sequences/{seq}/units` → `units[].unitSlug` | Aggregated |
| `category_titles` | `/sequences/{seq}/units` → `units[].categories[].categoryTitle` | Aggregated from units |

**`oak_threads` Fields** (from OpenAPI schema analysis):

| Field | API Source | Notes |
|-------|------------|-------|
| `thread_slug` | `/threads` → `slug` | Direct |
| `thread_title` | `/threads` → `title` | Direct |
| `unit_count` | Count of `/threads/{slug}/units` OR aggregated from unit extraction | Calculated |
| `subject_slugs` | Unit summaries → `subjectSlug` | Aggregated from units that have this thread |
| `thread_url` | **Constructed**: canonical URL | Derived |

---

## Foundation Documents (Read Before Working)

Before implementing, re-read and commit to:

1. **`.agent/directives-and-memory/rules.md`** - Core rules, TDD, no type shortcuts
2. **`.agent/directives-and-memory/schema-first-execution.md`** - All types flow from generators
3. **`.agent/directives-and-memory/testing-strategy.md`** - TDD at ALL levels

### Key Principles to Apply

| Principle | Application |
|-----------|-------------|
| **TDD** | Write tests FIRST for all new code (Red → Green → Refactor) |
| **Schema-First** | Mapping generators are single source of truth |
| **No Type Shortcuts** | Never use `as`, `any`, `!`, or `Record<string, unknown>` |
| **First Question** | Could it be simpler? Yes - extract from existing data, no new API calls |

---

## Current Todo List

| ID | Task | Status |
|----|------|--------|
| `fix-threads-mapping` | Phase A: Add `oak_threads` mapping generator to SDK type-gen | `pending` |
| `fix-sequences-docs` | Phase B: Implement `oak_sequences` document creation in ingestion pipeline | `pending` |
| `fix-threads-docs` | Phase C: Implement `oak_threads` document creation from unit thread data | `pending` |
| `verify-indices` | Verify: Re-ingest Maths KS4 and confirm both indices populated | `pending` |
| `resume-1c` | Resume Phase 1C baseline metrics after indices fixed | `pending` |

---

## Phase A: Fix `oak_threads` Mapping Generator

### Objective

Add `createThreadsMappingModule()` to generate `OAK_THREADS_MAPPING` at type-gen time.

### Key Files

| File | Action |
|------|--------|
| `.../type-gen/typegen/search/es-field-overrides/threads-overrides.ts` | **CREATE** - field overrides |
| `.../type-gen/typegen/search/es-field-overrides/index.ts` | Add export for `THREADS_FIELD_OVERRIDES` |
| `.../type-gen/typegen/search/es-mapping-generators-minimal.ts` | Add `createThreadsMappingModule()` |
| `.../type-gen/typegen/search/generate-es-mappings.ts` | Add to barrel export and FileMap |

### Field Definitions Already Exist

```typescript
// In field-definitions/curriculum.ts - these are the 7 fields to map
export const THREADS_INDEX_FIELDS: IndexFieldDefinitions = [
  { name: 'thread_slug', zodType: 'string', optional: false },
  { name: 'thread_title', zodType: 'string', optional: false },
  { name: 'unit_count', zodType: 'number', optional: false },
  { name: 'subject_slugs', zodType: 'array-string', optional: true },
  { name: 'thread_semantic', zodType: 'string', optional: true },
  { name: 'thread_url', zodType: 'string', optional: false },
  { name: 'title_suggest', zodType: 'object', optional: true },
] as const;
```

### Reference Patterns

**Field overrides pattern** (`sequences-overrides.ts`):

```typescript
export const SEQUENCES_FIELD_OVERRIDES = {
  sequence_title: textFieldWithAnalyzers({ ... }),
  title_suggest: { type: 'completion', ... },
  sequence_semantic: { type: 'semantic_text' },
  sequence_url: { type: 'keyword', ignore_above: 1024 },
} as const satisfies Readonly<Record<string, EsFieldMapping>>;
```

**Minimal generator pattern** (`es-mapping-generators-minimal.ts`):

```typescript
export function createUnitsMappingModule(): string {
  const fields = generateEsFieldsFromDefinitions(UNITS_INDEX_FIELDS, UNITS_FIELD_OVERRIDES);
  return HEADER + `export const OAK_UNITS_MAPPING = { ... } as const;`;
}
```

**Wiring pattern** (`generate-es-mappings.ts`):

1. Import `createThreadsMappingModule` from generators
2. Add to barrel export: `export { OAK_THREADS_MAPPING } from './oak-threads.js';`
3. Add to FileMap: `'../search/es-mappings/oak-threads.ts': createThreadsMappingModule()`

### Verification

```bash
pnpm type-gen        # Must generate OAK_THREADS_MAPPING
pnpm build           # Must pass
pnpm type-check      # Zero errors
```

---

## Phase B: Fix `oak_sequences` Document Creation

### Objective

Implement document creation for `oak_sequences` during ingestion.

### Approach

Extract sequence data from already-fetched data during lesson/unit ingestion - **no additional API calls**.

### Data Already Available

In `index-oak-helpers.ts`, `buildPairDocuments()` already has:

```typescript
export async function buildPairDocuments(
  context: PairBuildContext,  // Contains: subjectSequences, sequenceSources
  units: PairUnits,
  groups: PairGroups,
): Promise<unknown[]> {
  const { ks, subject, subjectSequences, sequenceSources } = context;
  // ...
  return [...unitOps, ...lessonOps, ...rollupOps, ...sequenceFacetOps];
  // ❌ Missing: sequenceOps for oak_sequences
}
```

**Available data sources:**

- `subjectSequences` → `sequenceSlug`, `phaseSlug`, `phaseTitle`, `keyStages[]`, `years[]`
- `sequenceSources` → units from `/sequences/{seq}/units` (includes `categories[]` per unit)
- Ingestion context → `subject` (subjectSlug), `subjectTitle`
- **Note**: `category_titles` must be aggregated from `sequenceSources` → `units[].categories[].categoryTitle`

### Key Files

| File | Action |
|------|--------|
| `apps/oak-open-curriculum-semantic-search/src/lib/indexing/sequence-document-builder.ts` | Create (NEW) |
| `apps/oak-open-curriculum-semantic-search/src/lib/indexing/sequence-document-builder.unit.test.ts` | Create tests FIRST |
| `apps/oak-open-curriculum-semantic-search/src/lib/index-oak-helpers.ts` | Add `buildSequenceOps()` and integrate |

### TDD Sequence

1. **RED**: Write unit test for `createSequenceDocument()` - test MUST fail
2. **GREEN**: Implement minimal `createSequenceDocument()` - test MUST pass
3. **REFACTOR**: Improve implementation, tests remain green
4. **INTEGRATE**: Add to `buildPairDocuments()` return: `[...ops, ...sequenceOps]`

---

## Phase C: Fix `oak_threads` Document Creation

### Objective

Implement document creation for `oak_threads` by extracting thread data from unit responses.

### Approach

Threads are available in unit summary responses. The API returns them as `threads[]` in unit data.

### Data Already Available

The `unitSummaries` map in `buildPairDocuments()` contains unit data with threads:

```typescript
// Unit summary contains threads field:
const sequenceIds = extractSequenceIds(readUnitSummaryValue(summary, 'threads'));
// threads[] is Array<{ slug: string; title: string; order: number }>
```

**Important Note**: In the API, "threads" and "sequences" are related but distinct:

- **Threads** = curriculum progressions (Number, Algebra, etc.) - span multiple units
- **Sequences** = programmes (maths-secondary, english-primary) - contain ordered units

The `threads` field in unit summaries contains thread slugs/titles.

### Key Files

| File | Action |
|------|--------|
| `apps/oak-open-curriculum-semantic-search/src/lib/indexing/thread-document-builder.ts` | Create (NEW) |
| `apps/oak-open-curriculum-semantic-search/src/lib/indexing/thread-document-builder.unit.test.ts` | Create tests FIRST |
| `apps/oak-open-curriculum-semantic-search/src/lib/indexing/thread-extractor.ts` | Create (NEW) - deduplication |
| `apps/oak-open-curriculum-semantic-search/src/lib/index-oak-helpers.ts` | Integrate into pipeline |

### TDD Sequence

1. **RED**: Write unit tests for `createThreadDocument()` and `extractThreadsFromUnits()` - tests MUST fail
2. **GREEN**: Implement both functions - tests MUST pass
3. **REFACTOR**: Improve implementation, tests remain green
4. **INTEGRATE**: Add `buildThreadOps()` to `buildPairDocuments()` return

---

## Quality Gates (Run After Each Phase)

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**Rule**: All gates must pass before moving to next phase.

---

## Success Criteria

| Criterion | Target |
|-----------|--------|
| `OAK_THREADS_MAPPING` generated | ✅ At type-gen time |
| `oak_sequences` has documents | ≥1 after Maths KS4 ingestion |
| `oak_threads` has documents | ≥5 after Maths KS4 ingestion |
| All unit tests pass | ✅ |
| All quality gates pass | ✅ |
| No type shortcuts | ✅ No `as`, `any`, `!` |

---

## After Completion

1. Update todo status: `verify-indices` → `completed`
2. Update todo status: `resume-1c` → `in_progress`
3. Return to Phase 1C baseline metrics work
4. Update `maths-ks4-implementation-plan.md` to mark these gaps as resolved

---

## Related Documents

- **Plan**: `.agent/plans/semantic-search/fix-missing-indices-plan.md`
- **Main Plan**: `.agent/plans/semantic-search/maths-ks4-implementation-plan.md`
- **Entry Point**: `.agent/prompts/semantic-search/semantic-search.prompt.md`
- **Field Definitions**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`

---

**End of Prompt**
