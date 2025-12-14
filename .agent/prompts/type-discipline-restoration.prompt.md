# Type Discipline Restoration — Full Repository

**Status**: ❌ BLOCKED — Quality Gates Failing (2 lint errors remain)
**Last Updated**: 2025-12-14
**Purpose**: Restore **all workspaces** to disciplined correctness per foundation documents

---

## BLOCKING: Current Quality Gate Failures

> **All quality gate issues are blocking at all times, regardless of location, cause, or context. There is no such thing as "someone else's problem" or "pre-existing issue."**

| Gate              | Status      | Action Required                                        |
| ----------------- | ----------- | ------------------------------------------------------ |
| type-gen          | ✅ PASS     |                                                        |
| build             | ✅ PASS     |                                                        |
| type-check        | ✅ PASS     |                                                        |
| lint:fix          | ❌ 2 errors | Fix remaining `Record<string, unknown>` (see below)    |
| format:root       | ✅ PASS     |                                                        |
| markdownlint:root | ✅ PASS     |                                                        |
| test              | ❓ Unknown  | Re-run to verify status                                |
| test:e2e          | ✅ PASS     |                                                        |
| test:e2e:built    | ✅ PASS     |                                                        |
| test:ui           | ❓ Unknown  | Run `pnpm exec playwright install` then `pnpm test:ui` |
| smoke:dev:stub    | ✅ PASS     |                                                        |

### Issues Requiring Immediate Attention

1. **Lint Errors (2 remaining)**: Just two `Record<string, unknown>` violations left:
   - `sandbox-fixture-data.ts:44` — needs Zod schemas for fixture file parsing
   - `sequence-facet-utils.ts:4` — needs SDK types for sequence data

2. **Test Status**: Re-run `pnpm test` to verify current status after code changes.

3. **UI Test Status**: Run `pnpm exec playwright install` then `pnpm test:ui` to verify.

### How to Fix the 2 Remaining Files

#### 1. `sequence-facet-utils.ts` — Consider DELETING

This file exports generic "unsafe object utilities" that bypass the type system:

```typescript
// CURRENT (BAD): Generic utilities that destroy type info
export type IndexableObject = Readonly<Record<string, unknown>>;
export function isUnknownObject(value: unknown): value is IndexableObject { ... }
export function ensureSequenceRecord(value: unknown, context: string): IndexableObject { ... }
```

**Fix approach**:

1. **Check if this file has any consumers** — run `grep -r "sequence-facet-utils" apps/`
2. If consumers exist, they should be refactored to use SDK types directly
3. If no consumers remain, **DELETE the entire file** (it's likely dead code now)

#### 2. `sandbox-fixture-data.ts` — Use SDK Types + Zod

This file loads fixture JSON files and has maps with `unknown` values:

```typescript
// CURRENT (BAD): Maps to unknown destroy type info
export interface FixtureData {
  readonly unitSummaries: ReadonlyMap<string, unknown>;
  readonly lessonSummaries: ReadonlyMap<string, unknown>;
  readonly sequenceUnits: ReadonlyMap<string, unknown>;
}
```

**Fix approach**:

1. Replace `ReadonlyMap<string, unknown>` with SDK types:
   - `unitSummaries: ReadonlyMap<string, SearchUnitSummary>`
   - `lessonSummaries: ReadonlyMap<string, SearchLessonSummary>`
   - `sequenceUnits: ReadonlyMap<string, SequenceUnit>` (check SDK for exact type)

2. Remove the `IndexableObject` type alias at line 44

3. Use Zod validation when parsing fixture JSON files at the boundary (where `JSON.parse` happens)

4. Use SDK type guards (`isUnitSummary`, `isLessonSummary`) after parsing

**SDK types to import:**

```typescript
import type {
  SearchUnitSummary,
  SearchLessonSummary,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

import { isUnitSummary, isLessonSummary } from '@oaknational/oak-curriculum-sdk/public/search.js';
```

---

## Current `pnpm lint:fix` Output (semantic-search app)

> **Last captured**: 2025-12-14

```
/Users/jim/.../src/lib/indexing/sandbox-fixture-data.ts
  44:33  error  Don't use `Record<string,unknown>` as a type  @typescript-eslint/no-restricted-types

/Users/jim/.../src/lib/indexing/sequence-facet-utils.ts
  4:40  error  Don't use `Record<string,unknown>` as a type  @typescript-eslint/no-restricted-types

✖ 2 problems (2 errors, 0 warnings)
```

**Significant progress**: Down from 13 errors to 2 errors in this session.

---

## The Source of Truth

**The OpenAPI schema defines exactly what data is available:**

```text
packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json
```

Before extracting, deriving, or transforming any data, **check the schema first**. If a field isn't in the schema, it either:

1. Doesn't exist (don't try to extract it)
2. Is derivable from fields that DO exist (document and add to upstream wishlist)
3. Should be added to the upstream API (add to wishlist)

---

## Change Control: Core SDK Type-Gen (Ask Jim First)

This workstream is **not** a free-for-all in `packages/sdks/oak-curriculum-sdk/type-gen/**`.

- **Do not change SDK type-gen, generator templates, or SDK exports “just to make lint pass”**.
- If you believe an SDK/type-gen change is required, pause and write a short proposal for Jim covering:
  - **Why** (what problem, at what layer)
  - **Who benefits / what value**
  - **Impact radius** (what packages/apps will be affected)
  - **How it stays schema-first** (OpenAPI → generated artefacts → consumers)
  - **How it’s proven** (tests + quality gates)

---

## Quick Start for Fresh Chat

### 1. Review Foundation Documents (MANDATORY)

Before ANY code changes, read and internalize these documents:

```bash
# These define what "correct" means - read them FIRST
cat .agent/directives-and-memory/rules.md
cat .agent/directives-and-memory/schema-first-execution.md
cat .agent/directives-and-memory/testing-strategy.md

# The schema is the source of truth for all types
cat packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json
```

Key principles from foundation documents:

> "All quality gate issues are blocking at all times, regardless of location, cause, or context"

> "No type shortcuts - Never use `as`, `any`, `!`, or `Record<string, unknown>`"

> "NEVER create complex mocks" (testing-strategy.md)

### 2. Run ALL Quality Gates

```bash
pnpm clean
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix          # ❌ Failing (re-run to get current count/output)
pnpm format:root
pnpm markdownlint:root
pnpm test              # ❌ Currently 2 failures
pnpm test:e2e
pnpm test:e2e:built
pnpm exec playwright install  # Required for UI tests
pnpm test:ui           # ❌ Currently 17 failures
pnpm smoke:dev:stub
```

**ALL gates must pass. No exceptions. No workarounds.**

### 3. Review the Plan

```bash
cat .agent/plans/quality-and-maintainability/type-discipline-restoration-plan.md
```

### 4. Immediate Priorities (in order)

1. **Make `pnpm lint:fix` green** — This is the current day-to-day blocker.
   - Focus on eliminating remaining `Record<string, unknown>` usage and type assertions in the semantic-search app (see “Last Known `pnpm lint:fix` Output” above).
   - Prefer architectural fixes (typed data flows + DI) over local “type workaround” logic.

2. **Make `pnpm test` green** — Fix (or delete) `search-service.unit.test.ts` failures.
   - The current tests violate `testing-strategy.md` by using complex `vi.doMock` patterns.
   - Refactor the product code to accept dependencies as arguments, then use **simple fakes** in tests.

3. **Make `pnpm test:ui` green** — Install Playwright browsers, then fix deterministic UI failures.
   - `pnpm exec playwright install`
   - `pnpm test:ui`

4. **Delete dead code when proven unused** — after consumers are updated:
   - `apps/oak-open-curriculum-semantic-search/src/lib/indexing/summary-reader-helpers.ts`

---

## Current Progress (2025-12-14)

### ✅ What's Been Fixed

#### Core Indexing Pipeline

The main document creation flow now uses typed SDK data instead of `unknown`:

| File                             | Change                                                 |
| -------------------------------- | ------------------------------------------------------ |
| `document-transforms.ts`         | `createUnitDocument` uses `SearchUnitSummary` directly |
| `index-bulk-helpers-internal.ts` | Returns typed `SearchUnitSummary` after validation     |
| `index-bulk-support.ts`          | `validateSummary` is proper type guard                 |
| `index-bulk-helpers.ts`          | Uses `Map<string, SearchUnitSummary>`                  |
| `index-oak-helpers.ts`           | Typed summaries throughout                             |
| `rebuild-rollup/route.ts`        | No more `const summary: unknown = validated`           |

#### Zero-Hit Observability

- `zero-hit-persistence-search.ts` - Uses `estypes` from ES SDK
- `zero-hit-persistence.ts` - Uses typed response types
- Zod validation at ES response boundary

#### Recent Fixes (2025-12-14 session)

| File                                 | Fix Applied                                                              |
| ------------------------------------ | ------------------------------------------------------------------------ |
| `scripts/ingest-all-combinations.ts` | Removed unused type aliases (`IndexKind`, `CombinationResult`)           |
| `summary-reader-helpers.ts`          | **DELETED** — was dead code importing from deleted file                  |
| `oak-adapter-cached.unit.test.ts`    | **DELETED** — was testing types not behaviour (violates testing rules)   |
| `sandbox-harness-filtering.ts`       | Replaced `IndexableObject` with specific `BulkIndexAction` interface     |
| `sandbox-harness-ops.ts`             | Zod schema for ES bulk response; extracted to `sandbox-bulk-response.ts` |
| `sandbox-harness.ts`                 | Removed type assertion; use real client with mock transport              |
| `search-index-target.ts`             | Replaced `IndexableObject` with specific `IndexAction` interface         |
| `zero-hit-api.ts`                    | Zod `WebhookPayloadSchema` for external payload validation               |
| `zero-hit-persistence-index.ts`      | Zod `EsErrorSchema` for ES error validation                              |

#### Files Deleted This Session

- `extraction-primitives.ts` — dead code
- `summary-reader-helpers.ts` — dead code (imported from deleted file)
- `oak-adapter-cached.unit.test.ts` — tested types not behaviour

#### New Files Created This Session

- `sandbox-bulk-response.ts` — Extracted Zod schemas for ES bulk response validation

**Example pattern from this file** (use as reference for similar fixes):

```typescript
// sandbox-bulk-response.ts - Zod schema for external ES response
import { z } from 'zod';

export const BulkResponseErrorSchema = z.object({
  type: z.string(),
  reason: z.string(),
});

export const BulkResponseItemSchema = z.object({
  index: z
    .object({
      _index: z.string(),
      status: z.number(),
      error: BulkResponseErrorSchema.optional(),
    })
    .optional(),
});

export const BulkResponseSchema = z.object({
  errors: z.boolean(),
  items: z.array(BulkResponseItemSchema),
});

export type BulkResponse = z.infer<typeof BulkResponseSchema>;
```

This pattern:

1. Defines Zod schemas at the external boundary
2. Infers TypeScript types from Zod schemas (`z.infer<>`)
3. Validates with `.safeParse()` and handles errors appropriately

### ⏳ What Remains (2 lint errors)

#### Immediate Priority: Fix Last 2 Lint Errors

| File                      | Issue                                | Fix Required                                               |
| ------------------------- | ------------------------------------ | ---------------------------------------------------------- |
| `sandbox-fixture-data.ts` | `Record<string, unknown>` at line 44 | Create Zod schemas for fixture file formats                |
| `sequence-facet-utils.ts` | `Record<string, unknown>` at line 4  | Use SDK types for sequence data (`SearchSubjectSequences`) |

#### Lower Priority: Helper Functions

These functions still accept `unknown` (or widen typed values) and should be migrated to typed SDK inputs:

| File                                   | Functions to Update                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| `document-transform-helpers.ts`        | `extractLessonDocumentFields`, `extractRollupDocumentFields`, `extractLessonPlanningFields` |
| `thread-and-pedagogical-extractors.ts` | `extractPedagogicalData`, `extractThreadInfo`                                               |
| `lesson-planning-snippets.ts`          | `selectLessonPlanningSnippet`, `collectLessonPlanningSections`                              |

---

## Programme Factors — Schema Clarification

**CRITICAL**: The schema was analysed on 2025-12-13. Here's what actually exists:

### What IS in the Schema

| Field               | Location in Schema                   | Notes                        | Derivable? |
| ------------------- | ------------------------------------ | ---------------------------- | ---------- |
| `tiers[]`           | `SequenceUnitsResponseSchema`        | Array of tier objects        | ✅ Yes     |
| `tiers[].tierTitle` | Tier object                          | e.g., "Foundation", "Higher" | ✅ Yes     |
| `tiers[].tierSlug`  | Tier object                          | e.g., "foundation", "higher" | ✅ Yes     |
| `examBoardTitle`    | `LessonSearchResponseSchema.units[]` | Can be `string \| null`      | ✅ Yes     |
| `ks4Options`        | Multiple sequence schemas            | Contains `title` and `slug`  | ✅ Yes     |
| `ks4Options.slug`   | ks4Options object                    | KS4 study option identifier  | ✅ Yes     |
| `ks4Options.title`  | ks4Options object                    | Human-readable option name   | ✅ Yes     |

### What is NOT in the Schema

| Concept            | Current Code                 | Schema Reality                                | Action     |
| ------------------ | ---------------------------- | --------------------------------------------- | ---------- |
| `programmeFactors` | Object assumed in extractors | **Does NOT exist** — was never in API         | **REMOVE** |
| `pathway`          | Assumed separate field       | **NEVER EXISTED** — pure ghost concept        | **REMOVE** |
| `tier` standalone  | Derived from various sources | Must derive from `tiers[]` or parse from slug | **DERIVE** |
| `examBoard`        | Derived from examBoardTitle  | Available in search results only              | **DERIVE** |

### ⚠️ `pathway` is a Ghost Concept — REMOVE IT

The `pathway` field **never existed** in the API. It was a misunderstanding. What actually exists is `ks4Options`:

- **`ks4Options.slug`** — The KS4 study option identifier
- **`ks4Options.title`** — Human-readable name

**Action**: Treat `pathway` as a **deleted ghost field** in runtime indexing/search code. Track `ks4Options` instead (sequence-level).

### Correct Approach for Extractors

```typescript
// WRONG: Accessing non-existent fields
const tier = summary.programmeFactors?.tier; // programmeFactors doesn't exist!

// RIGHT: Derive tier from slug or tiers array
function extractTier(slug: string): 'foundation' | 'higher' | undefined {
  if (slug.includes('-foundation')) return 'foundation';
  if (slug.includes('-higher')) return 'higher';
  return undefined;
}

// RIGHT: Track ks4Options (not an invented "pathway" concept)
const ks4OptionSlug = sequence.ks4Options?.slug;
const ks4OptionTitle = sequence.ks4Options?.title;
```

**Action**:

1. ✅ Delete `extractPathway()` (done)
2. ✅ `extractTier()` derives from slug suffix (done)
3. 🔲 If exam board filtering is required, decide between:
   - (a) enrich ingestion so indexing has access to `LessonSearchResponseSchema` results, or
   - (b) request upstream to flatten `examBoardTitle` onto lesson/unit summaries
     Until then: **do not index `exam_board`** (data not available in summaries).
4. 🔲 Add `ks4Options` handling if KS4 filtering is needed (sequence-level field)

### Programme Factor Data Sources

| Field        | Source                                              | Derivable? | Action                                  |
| ------------ | --------------------------------------------------- | ---------- | --------------------------------------- |
| `tier`       | `tiers[]` array or parse from slug                  | ✅ **YES** | Derive from slug suffix or tiers array  |
| `examBoard`  | `LessonSearchResponseSchema.units[].examBoardTitle` | ✅ **YES** | Use when ingestion includes search data |
| `ks4Options` | Sequence schemas                                    | ✅ **YES** | Track `ks4Options.slug` and `.title`    |
| `pathway`    | N/A                                                 | ❌ **NO**  | **DELETE** — never existed, ghost field |

**Implementation approach:**

1. **`tier`** — Parse from unit/lesson slugs (e.g., slugs containing "foundation" or "higher")
2. **`examBoard`** — Use `examBoardTitle` from search response data (only once ingestion includes it)
3. **`ks4Options`** — Fetch from sequence API or index sequence data separately
4. **`pathway`** — **DELETE ALL REFERENCES** — this was a ghost concept

**Code changes required:**

- ✅ `extractPathway()` removed (ghost field; never existed in the schema)
- ✅ `programme-factor-extractors.ts` derives **tier** only (from slug suffix)
- 🔲 Decide whether to index **`ks4Options`** (sequence-level field) for KS4 filtering, and where it belongs (likely sequence / sequence_facets docs)

#### Phase 5: Other Files with `Record<string, unknown>` — MOSTLY COMPLETE

| File                            | Status       | Notes                                             |
| ------------------------------- | ------------ | ------------------------------------------------- |
| `sequence-facet-utils.ts`       | ❌ REMAINING | Needs SDK types for sequence data                 |
| `sandbox-fixture-data.ts`       | ❌ REMAINING | Needs Zod schemas for fixture file parsing        |
| `sandbox-harness-filtering.ts`  | ✅ FIXED     | Uses specific `BulkIndexAction` interface         |
| `sandbox-harness-ops.ts`        | ✅ FIXED     | Zod `BulkResponseSchema` for ES responses         |
| `search-index-target.ts`        | ✅ FIXED     | Uses specific `IndexAction` interface             |
| `zero-hit-api.ts`               | ✅ FIXED     | Zod `WebhookPayloadSchema` for payload validation |
| `zero-hit-persistence-index.ts` | ✅ FIXED     | Zod `EsErrorSchema` for ES error validation       |

#### Other Workspaces (Estimated)

| Workspace                                 | Remaining Issues |
| ----------------------------------------- | ---------------- |
| `packages/*` (SDK, libs, core)            | ~59              |
| `apps/oak-curriculum-mcp-streamable-http` | ~51              |
| `apps/oak-notion-mcp`                     | ~12              |

---

## Why These Issues Exist

Stricter lint rules surfaced **pre-existing architectural drift**. These aren't new bugs—they're old technical debt that was invisible.

The lint rules are doing exactly what they should: **making invisible problems visible.**

Every `eslint-disable` is entropy. Every `as` destroys type information. Every `Record<string, unknown>` widens types.

---

## Foundation Documents (MUST Read First)

Before any work, re-read and commit to:

1. **`.agent/directives-and-memory/rules.md`** — TDD, quality gates, no type shortcuts
2. **`.agent/directives-and-memory/schema-first-execution.md`** — All types from schema at type-gen time
3. **`.agent/directives-and-memory/testing-strategy.md`** — Test types and TDD approach

Key principles:

> "No type shortcuts - Never use `as`, `any`, `!`, or `Record<string, unknown>`, or `{ [key: string]: unknown }`"

> "Use library types directly where possible"

> "Validate external signals - parse and/or validate external signals"

> "All quality gates are blocking at all times, regardless of location, cause, or context"

---

## Key Decisions Made (2025-12-13)

### 1. Type Predicates vs Zod Validation

- **External boundaries** (data entering system): Use Zod validation
- **Internal type narrowing** (well-typed ES unions): Type predicates are acceptable
- **`isObject`-style predicates**: NEVER - they just say "it's an object" and destroy type info

### 2. No Trivial Aliases, No Compatibility Layers

- Don't create aliases like `type SearchResponse = ZeroHitSearchResponse`
- Update all consumers when types change
- Fail fast with useful error messages

### 3. SDK Types Flow Through

- After `isUnitSummary()` validation, keep `SearchUnitSummary` type
- Never widen: `const summary: unknown = validated` is WRONG
- Access typed fields directly: `summary.unitSlug`

### 4. Zod Schema Strictness (NEW - 2025-12-13)

The `openapi-zod-client` library generates `.passthrough()` (Zod v3) which becomes `.loose()` (Zod v4). This allows extra fields but weakens type safety.

**Decision**: Add an optional transformation layer to replace `.loose()` with `.strict()`:

- `.strict()` rejects any field not defined in the schema
- Consider `.parse()` instead of `.safeParse()` for fail-fast behaviour
- This enforces that we only use what the schema defines

**Implementation**: Post-processing step in `packages/core/openapi-zod-client-adapter/src/zod-v3-to-v4-transform.ts`

### 5. Derived Fields Must Be Documented (NEW - 2025-12-13)

When a field is **derived** from other schema fields (not a direct passthrough):

1. **Document it** in the extractor function with clear comments
2. **Add to upstream wishlist**: `.agent/plans/external/upstream-api-metadata-wishlist.md`
3. **Mark it** with a `DERIVED:` comment explaining the source

Example derived fields:

| Derived Field    | Source in Schema                   | Derivation Logic                        |
| ---------------- | ---------------------------------- | --------------------------------------- |
| `tier`           | Parse from slug or `tiers[]` array | Check slug for "foundation"/"higher"    |
| `examBoard`      | `examBoardTitle` in search results | Direct mapping where available          |
| `ks4OptionSlug`  | `ks4Options.slug`                  | From sequence data                      |
| `ks4OptionTitle` | `ks4Options.title`                 | From sequence data                      |
| ~~`pathway`~~    | N/A                                | **DELETE** — never existed, ghost field |

**Goal**: All derived fields should eventually be added to the upstream API.

---

## Pattern for Updating Helper Functions

When updating helper functions from `unknown` to typed:

```typescript
// BEFORE: Accepts unknown, uses extraction primitives
export function extractLessonDocumentFields(summary: unknown) {
  const { unitSlug } = resolveLessonSummaryIdentifiers(summary);
  const record = ensureRecord(summary, 'lesson summary');
  const keywords = pluckStrings(readUnknownField(record, 'lessonKeywords'), 'keyword');
  // ...
}

// AFTER: Accepts typed data, accesses properties directly
export function extractLessonDocumentFields(summary: SearchLessonSummary) {
  const unitSlug = summary.unitSlug;
  const keywords = summary.lessonKeywords?.map((k) => k.keyword);
  // ...
}
```

The SDK types (`SearchUnitSummary`, `SearchLessonSummary`) have all fields typed. After validation at boundary, use direct property access.

---

## Important SDK Types

### Summary Types (from SDK)

```typescript
import type {
  SearchUnitSummary,
  SearchLessonSummary,
} from '@oaknational/oak-curriculum-sdk/public/search.js';

// Type guards
import { isUnitSummary, isLessonSummary } from '@oaknational/oak-curriculum-sdk/public/search.js';
```

### Elasticsearch Types (from SDK re-export)

```typescript
import type {
  EsSearchResponse,
  EsSearchHit,
  EsHitSource,
} from '@oaknational/oak-curriculum-sdk/elasticsearch.js';

// Or directly from ES client
import type { estypes } from '@elastic/elasticsearch';
```

### Index Document Types (from SDK)

```typescript
import type {
  SearchUnitsIndexDoc,
  SearchLessonsIndexDoc,
  SearchUnitRollupDoc,
} from '@oaknational/oak-curriculum-sdk/public/search.js';
```

---

## File Locations

### Schema (Source of Truth)

- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json` — **The OpenAPI schema**
- `.agent/plans/external/upstream-api-metadata-wishlist.md` — Fields to request from upstream API

### Plans

- `.agent/plans/quality-and-maintainability/type-discipline-restoration-plan.md` — Master plan for all type discipline work

### Foundation Documents

- `.agent/directives-and-memory/rules.md` — Core rules
- `.agent/directives-and-memory/schema-first-execution.md` — Schema-first approach
- `.agent/directives-and-memory/testing-strategy.md` — TDD at all levels

### Key Source Files (Indexing Pipeline)

**Core pipeline (FIXED):**

- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transforms.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-bulk-helpers.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-bulk-helpers-internal.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-bulk-support.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/index-oak-helpers.ts`

**Helper functions (NEED UPDATING):**

- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transform-helpers.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/thread-and-pedagogical-extractors.ts`

**Helper functions (DONE):**

- ✅ `apps/oak-open-curriculum-semantic-search/src/lib/indexing/programme-factor-extractors.ts` (tier derived; ghost fields removed)

**Other files with issues:**

- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/sequence-facet-utils.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/sandbox-*.ts`

### SDK Types

- `packages/sdks/oak-curriculum-sdk/src/types/generated/search/summaries.ts` — `SearchUnitSummary`, `SearchLessonSummary`
- `packages/sdks/oak-curriculum-sdk/src/elasticsearch.ts` — ES type re-exports
- `packages/sdks/oak-curriculum-sdk/src/types/es-types.ts` — ES type definitions

---

## Quality Gates (run after each change)

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

---

## Success Criteria

### IMMEDIATE: All Quality Gates Must Pass

- [ ] `pnpm lint:fix` — 0 errors (currently: **2 errors** — down from 13)
- [ ] `pnpm test` — All tests pass (re-run to verify status)
- [ ] `pnpm test:ui` — All tests pass (re-run to verify status)

### Indexing Pipeline

- [x] Core document creation functions use typed SDK data
- [x] Bulk helpers use `Map<string, SearchUnitSummary>`
- [x] Type destruction (`const summary: unknown`) removed from main flow
- [ ] All tests pass (need to re-run)
- [x] Zero-hit observability uses ES SDK types + Zod validation
- [ ] Helper functions (`extractLessonDocumentFields`, etc.) use typed data
- [x] `extraction-primitives.ts` deleted
- [x] `summary-reader-helpers.ts` deleted
- [ ] No `Record<string, unknown>` lint errors (2 remaining: `sandbox-fixture-data.ts`, `sequence-facet-utils.ts`)
- [x] Ghost concepts removed from **runtime indexing/search data** (`programmeFactors`, `pathway`)

### Full Repository

- [ ] < 20 `eslint-disable` comments repo-wide
- [ ] All lint errors resolved at root cause
- [ ] External boundaries have Zod validation
- [ ] All tests pass consistently (no flaky tests)

---

## Cardinal Rules

1. **All quality gate issues are blocking** — regardless of location, cause, or context. There is no such thing as "someone else's problem" or "pre-existing issue."
2. **Re-read foundation documents** before starting each work session
3. **Every `eslint-disable` is entropy** — remove it by fixing the root cause
4. **The lint rules are doing their job** — making invisible problems visible
5. **Use library types** — ES SDK, Notion SDK, MCP SDK all provide types
6. **After validation, type is KNOWN** — never widen back to `unknown`
7. **Run full quality gates** after each change — ALL must pass
8. **No complex mocks** — per testing-strategy.md, complex mocks must be eliminated

---

## Troubleshooting

| Issue                                | Fix                                                              |
| ------------------------------------ | ---------------------------------------------------------------- |
| Turbo TUI not showing                | Run `pnpm clean` (now clears `.turbo` cache)                     |
| Stale cache after turbo version bump | Same: `pnpm clean`                                               |
| Build passes locally but fails in CI | Ensure `.turbo` isn't committed; check `pnpm-lock.yaml` is fresh |
| Type errors after rebase             | Run `pnpm type-gen` first to regenerate types                    |
