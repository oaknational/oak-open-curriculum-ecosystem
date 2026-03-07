# Type Discipline Restoration Plan — Full Repository

**Status**: ✅ QUALITY GATES PASSING — Ongoing Refinement
**Last Updated**: 2025-12-14
**Prompt**: `.agent/prompts/type-discipline-restoration.prompt.md`

---

## Cardinal Rule

> **All quality gate issues are blocking at all times, regardless of location, cause, or context. There is no such thing as an acceptable failure. There is no such thing as "someone else's problem".**

See: `.agent/directives/principles.md`

---

## Source of Truth

**The OpenAPI schema is the single source of truth for all types:**

```text
packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json
```

All work in this plan must be verified against the schema. When extracting or deriving data:

1. **Check the schema first** — Does the field actually exist?
2. **Document derivations** — If deriving from other fields, add to upstream wishlist
3. **Add to wishlist** — Fields needed but not in schema go to `.agent/plans/external/upstream-api-metadata-wishlist.md`

---

## Change Control: Core SDK Type-Gen (Ask Jim First)

Changes under `packages/sdks/oak-curriculum-sdk/type-gen/**` and changes to SDK exports can have **repo-wide blast radius**.

- **Do not modify SDK type-gen or generator templates to "make lint green"** without explicit review.
- If an SDK/type-gen change seems necessary, pause and write a proposal describing:
  - **The problem** (and why it belongs in the SDK/type-gen layer)
  - **The value** (who benefits and how)
  - **The impact radius** (which workspaces will change)
  - **Schema-first compliance** (OpenAPI → generated artefacts → consumers)
  - **Proof** (tests + full quality gate sweep)

---

## Quality Gate Status

> **Last checked**: 2025-12-14

| Gate                     | Status     | Notes                                  |
| ------------------------ | ---------- | -------------------------------------- |
| `pnpm type-gen`          | ✅ Passing |                                        |
| `pnpm build`             | ✅ Passing |                                        |
| `pnpm type-check`        | ✅ Passing |                                        |
| `pnpm lint:fix`          | ✅ Passing |                                        |
| `pnpm format:root`       | ✅ Passing |                                        |
| `pnpm markdownlint:root` | ✅ Passing |                                        |
| `pnpm test`              | ✅ Passing | With `isolate: true` + `pool: 'forks'` |
| `pnpm test:e2e`          | ✅ Passing |                                        |
| `pnpm test:e2e:built`    | ✅ Passing |                                        |
| `pnpm test:ui`           | ✅ Passing |                                        |
| `pnpm smoke:dev:stub`    | ✅ Passing |                                        |

### Test Infrastructure Notes

Test isolation settings (`isolate: true`, `pool: 'forks'`) were added to vitest configs to prevent race conditions from global state mutations (`process.env`, `vi.doMock`). See `.agent/plans/quality-and-maintainability/global-state-test-refactoring.md` for the proper fix (dependency injection).

Turbo concurrency limited to 2 in `check:turbo` to prevent resource starvation on dev machines.

### Understanding the Lint Errors

These are NOT style violations. They are **fundamental architectural failures** where code:

- Destroys type information after validation (`const x: unknown = validatedData`)
- Accesses ghost concepts that don't exist in the schema (`programmeFactors`, `pathway`)
- Bypasses the type system with `as`, `any`, `Record<string, unknown>`
- Violates schema-first-execution.md by hand-authoring types instead of deriving from schema

**Current errors (2025-12-14): 2 remaining**

| Error Type                               | Count | Root Cause                                   |
| ---------------------------------------- | ----- | -------------------------------------------- |
| `@typescript-eslint/no-restricted-types` | 2     | `Record<string, unknown>` (type destruction) |

**By file (all in `apps/oak-search-cli`):**

| File                                                  | Status       | Notes                                                  |
| ----------------------------------------------------- | ------------ | ------------------------------------------------------ |
| `app/ui/global/Fixture/FixtureModeToggle.tsx`         | ✅ FIXED     | Refactored for `max-lines-per-function`                |
| `scripts/ingest-all-combinations.ts`                  | ✅ FIXED     | Removed unused types                                   |
| `src/lib/indexing/extraction-primitives.ts`           | ✅ DELETED   | Dead code                                              |
| `src/lib/indexing/sandbox-fixture-data.ts`            | ❌ REMAINING | Needs Zod schemas for fixture files                    |
| `src/lib/indexing/sandbox-harness-filtering.ts`       | ✅ FIXED     | Specific `BulkIndexAction` interface                   |
| `src/lib/indexing/sandbox-harness-ops.ts`             | ✅ FIXED     | Zod `BulkResponseSchema` + extracted to new file       |
| `src/lib/indexing/sandbox-harness.ts`                 | ✅ FIXED     | Real client with mock transport                        |
| `src/lib/indexing/sequence-facet-utils.ts`            | ❌ REMAINING | Needs SDK types for sequence data                      |
| `src/lib/observability/api/zero-hit-api.ts`           | ✅ FIXED     | Zod `WebhookPayloadSchema`                             |
| `src/lib/observability/zero-hit-persistence-index.ts` | ✅ FIXED     | Zod `EsErrorSchema`                                    |
| `src/lib/search-index-target.ts`                      | ✅ FIXED     | Specific `IndexAction` interface                       |
| `src/lib/indexing/summary-reader-helpers.ts`          | ✅ DELETED   | Dead code                                              |
| `src/adapters/oak-adapter-cached.unit.test.ts`        | ✅ DELETED   | Tested types not behaviour (violated testing-strategy) |

---

## Session Progress: Indexing Pipeline (2025-12-14)

### ✅ Significant Progress — 2 lint errors remain

The **core architectural fix** is in place for the indexing pipeline. Lint errors reduced from 13 to 2:

```
BEFORE:
SDK API → isUnitSummary() → const summary: unknown = validated ← TYPE DESTROYED
                                        ↓
                              extraction utilities to access fields

AFTER:
SDK API → isUnitSummary() → summary: SearchUnitSummary ← TYPE PRESERVED
                                        ↓
                              direct property access (summary.unitSlug)
```

#### Core Pipeline Updated

| File                             | Change                                                  |
| -------------------------------- | ------------------------------------------------------- |
| `document-transforms.ts`         | Params accept `SearchUnitSummary`/`SearchLessonSummary` |
| `index-bulk-helpers-internal.ts` | Removed `unknown` widening, returns typed summaries     |
| `index-bulk-support.ts`          | `validateSummary` is type guard, typed returns          |
| `index-bulk-helpers.ts`          | Uses `Map<string, SearchUnitSummary>`                   |
| `index-oak-helpers.ts`           | Uses typed summaries throughout                         |
| `rebuild-rollup/route.ts`        | Removed `unknown` widening after validation             |

#### Tests Updated

- `document-transforms.unit.test.ts` - Uses SDK type aliases
- `index-bulk-helpers.unit.test.ts` - Uses `Map<string, SearchUnitSummary>`

#### Zero-Hit Observability Fixed

- `zero-hit-persistence-search.ts` - Uses `estypes` from ES SDK
- `zero-hit-persistence.ts` - Uses typed `ZeroHitSearchResponse`
- Zod validation at external boundary (ES top_hits `_source`)

#### Dead Code Removal (Complete)

- `createUnitDocument` now accesses typed fields directly
- Removed imports of `extractUnitLessons`, `extractSequenceIds`, `extractUnitTopics`
- `resolveUnitSummaryIdentifiers` no longer needed for unit documents
- ✅ `extraction-primitives.ts` — DELETED (dead code)
- ✅ `summary-reader-helpers.ts` — DELETED (dead code; was importing from deleted file)
- ✅ `oak-adapter-cached.unit.test.ts` — DELETED (tested types not behaviour)

#### New Files Created (2025-12-14)

- `sandbox-bulk-response.ts` — Extracted Zod schemas for ES bulk response validation

### ⏳ Remaining Indexing Work

#### Helper Functions Still Accept `unknown` (Lower Priority)

| File                                   | Functions                                                                                   | Notes           |
| -------------------------------------- | ------------------------------------------------------------------------------------------- | --------------- |
| `document-transform-helpers.ts`        | `extractLessonDocumentFields`, `extractRollupDocumentFields`, `extractLessonPlanningFields` | Update to typed |
| `thread-and-pedagogical-extractors.ts` | `extractPedagogicalData`, `extractThreadInfo`                                               | Update to typed |
| `lesson-planning-snippets.ts`          | `selectLessonPlanningSnippet`, `collectLessonPlanningSections`                              | Update to typed |

#### Files with `Record<string, unknown>` — MOSTLY COMPLETE

| File                            | Status       | Fix Applied / Notes                              |
| ------------------------------- | ------------ | ------------------------------------------------ |
| `sequence-facet-utils.ts`       | ❌ REMAINING | Needs SDK types for sequence data                |
| `sandbox-fixture-data.ts`       | ❌ REMAINING | Needs Zod schemas for fixture file parsing       |
| `sandbox-harness-filtering.ts`  | ✅ FIXED     | Specific `BulkIndexAction` interface             |
| `sandbox-harness-ops.ts`        | ✅ FIXED     | Zod `BulkResponseSchema` (extracted to new file) |
| `sandbox-harness.ts`            | ✅ FIXED     | Real client with mock transport                  |
| `search-index-target.ts`        | ✅ FIXED     | Specific `IndexAction` interface                 |
| `zero-hit-api.ts`               | ✅ FIXED     | Zod `WebhookPayloadSchema`                       |
| `zero-hit-persistence-index.ts` | ✅ FIXED     | Zod `EsErrorSchema`                              |

### How to Continue Indexing Work

**Pattern for updating helper functions:**

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

**Steps:**

1. Update `extractLessonDocumentFields(summary: unknown)` to accept `SearchLessonSummary`
2. Update `extractRollupDocumentFields(summary: unknown)` to accept `SearchUnitSummary`
3. Update `extractPedagogicalData(summary: unknown)` to accept `SearchUnitSummary`
4. ✅ `extractPathway()` removed (ghost field; never existed in the schema)
5. ✅ `extractTier()` derives from slugs (parse "foundation"/"higher" from slug)
6. If exam board filtering is required, either (a) enrich ingestion with `LessonSearchResponseSchema` data, or (b) request upstream to flatten `examBoardTitle` onto lesson/unit summaries
7. After each change, run quality gates

**Test Update Strategy:**

When changing function signatures from `unknown` to typed:

1. **Update test builders** — `buildLessonSummary()`, `buildUnitSummary()` must return typed objects
2. **Remove invalid test cases** — Tests for "handles unknown data" become type errors
3. **Add type assertions in tests if needed** — For edge cases, use `satisfies` not `as`

**File Dependency Order:**

Update in this order to minimize breakage:

```
1. thread-and-pedagogical-extractors.ts (leaf)
2. document-transform-helpers.ts (depends on above)
3. document-transforms.ts (depends on helpers)
4. ✅ extraction-primitives.ts (deleted)
5. Delete summary-reader-helpers.ts (after all consumers updated)
```

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

### 4. Zod Schema Strictness (NEW)

The `openapi-zod-client` generates `.passthrough()` (Zod v3) → `.loose()` (Zod v4), allowing extra fields.

**Decision**: Add optional transformation layer:

- Replace `.loose()` with `.strict()` to reject undefined fields
- Consider `.parse()` instead of `.safeParse()` for fail-fast
- Location: `packages/core/openapi-zod-client-adapter/src/zod-v3-to-v4-transform.ts`

### 5. Derived Fields Documentation (NEW)

**EVERY derived field must be documented**:

1. Add `DERIVED:` comment in extractor explaining source fields
2. Add to upstream wishlist: `.agent/plans/external/upstream-api-metadata-wishlist.md`

**Goal**: Eventually get all derived fields added to upstream API.

### 6. Programme Factors Schema Analysis (NEW)

**What IS in the schema** (verified 2025-12-13):

| Field               | Location                             | Notes                       | Derivable? |
| ------------------- | ------------------------------------ | --------------------------- | ---------- |
| `tiers[]`           | `SequenceUnitsResponseSchema`        | Array of tier objects       | ✅ Yes     |
| `tiers[].tierTitle` | Tier object                          | "Foundation", "Higher"      | ✅ Yes     |
| `tiers[].tierSlug`  | Tier object                          | "foundation", "higher"      | ✅ Yes     |
| `examBoardTitle`    | `LessonSearchResponseSchema.units[]` | `string \| null`            | ✅ Yes     |
| `ks4Options`        | Sequence schemas                     | Contains `title` and `slug` | ✅ Yes     |
| `ks4Options.slug`   | ks4Options                           | KS4 study option identifier | ✅ Yes     |
| `ks4Options.title`  | ks4Options                           | Human-readable option name  | ✅ Yes     |

**What is NOT in the schema**:

| Concept            | Reality                                   | Action     |
| ------------------ | ----------------------------------------- | ---------- |
| `programmeFactors` | **Does NOT exist** — never was in API     | **REMOVE** |
| `pathway`          | **NEVER EXISTED** — pure ghost concept    | **REMOVE** |
| `tier` standalone  | Derivable from slugs or `tiers[]` array   | **DERIVE** |
| `examBoard`        | Available as `examBoardTitle` in searches | **DERIVE** |

### ⚠️ `pathway` is a Ghost Concept — DELETE ALL REFERENCES

The `pathway` field **never existed** in the API. It was a misunderstanding. Remove:

- ✅ `extractPathway()` function (removed)
- Any `pathway` field references
- Any `programmeFactors.pathway` access

What actually exists is `ks4Options` — track that instead.

**Important**: KS4 Options should be indexed — they are essential for KS4 curriculum navigation.

### Programme Factor Implementation

| Field        | Source                             | Action                                     |
| ------------ | ---------------------------------- | ------------------------------------------ |
| `tier`       | Parse from slug or `tiers[]`       | ✅ **DERIVE** from slug suffix             |
| `examBoard`  | `examBoardTitle` in search results | ✅ **DERIVE** once ingestion includes it   |
| `ks4Options` | Sequence schemas                   | ✅ **INDEX** from sequence data            |
| `pathway`    | N/A                                | ❌ **DELETE** — never existed, ghost field |

**Implementation:**

```typescript
// tier: derive from slug
function extractTier(slug: string): 'foundation' | 'higher' | undefined {
  if (slug.includes('-foundation')) return 'foundation';
  if (slug.includes('-higher')) return 'higher';
  return undefined;
}

// ks4Options: track from sequence data (not "pathway")
const ks4OptionSlug = sequence.ks4Options?.slug;

// pathway: DELETE - this function should not exist
// extractPathway() — REMOVE THIS ENTIRELY
```

**Code changes required:**

1. ✅ Delete `extractPathway()` function entirely (done)
2. ✅ `extractTier()` derives from slugs (done)
3. 🔲 If exam board filtering is required, enrich ingestion with `LessonSearchResponseSchema` data (or request upstream flattening)
4. 🔲 Add `ks4Options` handling for KS4 filtering

---

## First Steps for Fresh Chat

### 1. Read Foundation Documents (MANDATORY)

```bash
cat .agent/directives/principles.md
cat .agent/directives/schema-first-execution.md
cat .agent/directives/testing-strategy.md
```

### 2. Run ALL Quality Gates

```bash
pnpm clean
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix          # ❌ Failing (last known: 13 errors; re-run to confirm current output)
pnpm format:root
pnpm markdownlint:root
pnpm test              # ❌ Currently 2 failures
pnpm test:e2e
pnpm test:e2e:built
pnpm exec playwright install
pnpm test:ui           # ❌ Currently 17 failures
pnpm smoke:dev:stub
```

**ALL gates must pass before proceeding with any other work.**

### 3. Priority Order

1. **Make `pnpm lint:fix` green** — current day-to-day blocker
2. **Make `pnpm test` green** — remove complex mocks; refactor product code for DI + simple fakes
3. **Make `pnpm test:ui` green** — install Playwright browsers, then fix deterministic failures
4. **Delete dead code** — only once proven unused by typed call sites/tests

---

## Scope: Every Workspace

This plan applies to **the entire repository**, not just the semantic search app:

| Workspace                                  | `eslint-disable` Count | Files Affected |
| ------------------------------------------ | ---------------------- | -------------- |
| `apps/oak-search-cli` | 63                     | 35             |
| `packages/*` (SDK, libs, core)             | 59                     | 25             |
| `apps/oak-curriculum-mcp-streamable-http`  | 51                     | 34             |
| `apps/oak-notion-mcp`                      | 12                     | 9              |
| `apps/oak-curriculum-mcp-stdio`            | 3                      | 3              |
| **Total**                                  | **~188**               | **~106**       |

---

## The Real Goal

The surface goal is "pass lint." The real goal is:

> "ALL static data structures, types, type guards, Zod schemas, Zod validators, and other type related information MUST flow from the Open Curriculum OpenAPI schema"

**We're not just fixing lint errors. We're restoring a system where type information is preserved, not destroyed.**

The ~188 `eslint-disable` comments are not obstacles—they're **signals showing where the architecture degraded**. The new lint rules made pre-existing drift visible.

---

## What This Work Actually Is

| Category              | Problem                                 | Fix                                      |
| --------------------- | --------------------------------------- | ---------------------------------------- |
| Scripts               | Read JSON/CLI with `as` assertions      | Zod schemas at boundaries                |
| Elasticsearch         | Use `as` instead of ES SDK types        | Import and use `estypes.*`               |
| Indexing              | `Record<string, unknown>` destroys info | Specific types from schema               |
| Observability         | `Record<string, unknown>` for events    | Discriminated unions with typed payloads |
| Logger/Transport libs | Loose types for flexibility             | Constrained generics or specific types   |
| Notion integration    | Notion API types not used properly      | Use `@notionhq/client` types             |
| Widget code           | HTML string manipulation                | Proper type-safe patterns                |

---

## Prerequisite

Before each work session, re-read and commit to:

- `.agent/directives/principles.md`
- `.agent/directives/schema-first-execution.md`
- `.agent/directives/testing-strategy.md`

---

## Workspace-Specific Issues

### `packages/libs/logger` (21 comments)

| Issue                                | Count | Root Cause                              |
| ------------------------------------ | ----- | --------------------------------------- |
| `object` type in function signatures | 7     | No proper `LogContext` interface        |
| `Object.values`/`Object.entries`     | 4     | Should use type-safe helpers            |
| `WeakSet<object>`                    | 4     | Inherent to circular reference tracking |
| `max-lines`                          | 1     | Split file                              |
| `Reflect.get`                        | 1     | For `toString` prototype lookup         |

**Fix**: Define `LogContext` interface, use type-safe helpers, consider if circular tracking needs `object`.

### `packages/libs/transport` (6 comments)

| Issue                        | Count | Root Cause                  |
| ---------------------------- | ----- | --------------------------- |
| `object` in Logger interface | 6     | No proper `LogContext` type |

**Fix**: Import or define shared `LogContext` interface from logger package.

### `packages/sdks/oak-curriculum-sdk` (26 comments)

| Issue                            | Count | Root Cause                                    |
| -------------------------------- | ----- | --------------------------------------------- |
| `max-lines` in static data files | 5     | Large ontology/guidance data                  |
| Type assertions in type-helpers  | 6     | **Intentional** (these ARE the safe wrappers) |
| `object` in augmentation         | 2     | Should use proper constraint                  |
| Type assertions in generators    | 2     | Generator scripts (lower priority)            |

**Fix**: The type-helpers are intentional. Fix augmentation functions with proper constraints.

### `apps/oak-curriculum-mcp-streamable-http` (51 comments)

| Issue                  | Count | Affected Areas               |
| ---------------------- | ----- | ---------------------------- |
| Widget HTML generation | ~15   | String manipulation for HTML |
| Test helpers           | ~10   | Mock setup patterns          |
| Auth/logging           | ~10   | Type assertions, loose types |
| Scripts                | ~5    | CLI handling                 |

**Fix**: Widget code needs proper typing, test patterns need documentation, auth needs library types.

### `apps/oak-notion-mcp` (12 comments)

| Issue                   | Count | Root Cause                         |
| ----------------------- | ----- | ---------------------------------- |
| Notion API transformers | 4     | Not using `@notionhq/client` types |
| Query building          | 6     | Loose filter types                 |
| Formatters              | 2     | Type assertions                    |

**Fix**: Use Notion SDK types (`@notionhq/client`).

---

## Phase 0: Audit and Documentation (Complete)

### Deliverables

- [x] Catalogue all `eslint-disable` comments (~188 found across 106 files)
- [x] Categorise by workspace and severity
- [x] Document what should be at type-gen time
- [x] Create this plan

---

## Phase 1: Remove Ad-Hoc Type Aliases

**Goal**: Remove all custom type aliases that widen types.

### Files with Type Alias Definitions

| File                                                                                    | Type Alias                                                 | Fix                         |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------- | --------------------------- |
| ✅ `apps/oak-search-cli/src/lib/indexing/extraction-primitives.ts` | `IndexableObject = Readonly<Record<string, unknown>>`      | **Done** (file deleted)     |
| `search-index-target.ts:110`                                                            | `UnknownObject = Record<string, unknown>`                  | Use `unknown` + type guard  |
| `sandbox-harness-ops.ts:220`                                                            | Function returns `Record<string, unknown>`                 | Use specific type           |
| `zero-hit-persistence-index.ts:12`                                                      | `UnknownRecord = Record<string, unknown>`                  | Use typed event interface   |
| `zero-hit-api.ts:101`                                                                   | `JsonObject = Record<string, unknown>`                     | Use typed request/response  |
| `sequence-facet-utils.ts:1`                                                             | `UnknownObject = Readonly<Record<string, unknown>>`        | Use ES SDK types            |
| `sandbox-fixture-data.ts:41`                                                            | `UnknownFixtureRecord = Readonly<Record<string, unknown>>` | Use typed fixture interface |

### Success Criteria

- [ ] All remaining type-alias violations removed (snapshot list above; re-run `pnpm lint:fix` to confirm)
- [ ] All usages updated to use `unknown` + type guards
- [ ] Zero `@typescript-eslint/no-restricted-types` eslint-disable comments

---

## Phase 2: Replace Object.\_/Reflect.\_ with Type-Safe Helpers

**Goal**: Replace all restricted object operations with type-safe alternatives.

### Files Requiring Changes

| File                               | Operation                       | Count | Fix                        |
| ---------------------------------- | ------------------------------- | ----- | -------------------------- |
| `suggestions/index.unit.test.ts`   | `Reflect.get`                   | 3     | Use typed property access  |
| `suggestions/index.ts`             | `Object.keys`                   | 2     | Use `typeSafeKeys<T>()`    |
| `sandbox-harness-ops.ts`           | `Object.values`                 | 1     | Use `typeSafeValues<T>()`  |
| `elastic-http.ts`                  | `Object.entries`                | 1     | Use `typeSafeEntries<T>()` |
| `sandbox-fixture-data.ts`          | `Object.entries`                | 5     | Use `typeSafeEntries<T>()` |
| `scope-config.ts`                  | `Object.keys`                   | 2     | Use `typeSafeKeys<T>()`    |
| `zero-hit-persistence-search.ts`   | `Object.entries`                | 1     | Use `typeSafeEntries<T>()` |
| `zero-hit-api.unit.test.ts`        | `Object.values`                 | 1     | Use `typeSafeValues<T>()`  |
| `env.unit.test.ts`                 | `Object.entries`                | 1     | Use `typeSafeEntries<T>()` |
| `search-index-target.unit.test.ts` | `Object.keys`, `Object.entries` | 3     | Use type-safe helpers      |
| `theme-factory.unit.test.ts`       | `Object.keys`                   | 8     | Use `typeSafeKeys<T>()`    |

### Type-Safe Helpers (from SDK)

```typescript
// packages/sdks/oak-curriculum-sdk/src/types/helpers/type-helpers.ts
export function typeSafeKeys<T extends object>(obj: T): Extract<keyof T, string>[];
export function typeSafeValues<T extends object>(obj: T): T[keyof T][];
export function typeSafeEntries<T extends object>(
  obj: T,
): [Extract<keyof T, string>, T[Extract<keyof T, string>]][];
```

### Success Criteria

- [ ] All 28 `Object.*`/`Reflect.*` usages replaced
- [ ] Zero `no-restricted-properties` eslint-disable comments
- [ ] All code uses type-safe helpers

---

## Phase 3: Define Shared LogContext Type

**Goal**: Replace `object` in logger/transport with proper `LogContext` interface.

### Current State

```typescript
// packages/libs/transport/src/types.ts
export interface Logger {
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
  trace(message: string, context?: Error | object): void;
  // ... same for debug, info, warn, error, fatal
}
```

### Required Fix

```typescript
// packages/libs/logger/src/types.ts (or shared location)
export interface LogContext {
  readonly [key: string]: JsonValue;
}

// packages/libs/transport/src/types.ts
import type { LogContext } from '@oaknational/mcp-logger';

export interface Logger {
  trace(message: string, context?: Error | LogContext): void;
  debug(message: string, context?: Error | LogContext): void;
  info(message: string, context?: Error | LogContext): void;
  warn(message: string, context?: Error | LogContext): void;
  error(message: string, context?: Error | LogContext): void;
  fatal(message: string, context?: Error | LogContext): void;
}
```

### Success Criteria

- [ ] `LogContext` interface defined in logger package
- [ ] Transport package imports and uses `LogContext`
- [ ] Zero `object` type in logger/transport interfaces

---

## Phase 4: Elasticsearch SDK Types

**Goal**: Use `estypes` from `@elastic/elasticsearch` consistently.

**Status**: Partially complete (zero-hit observability done)

### The Real Issue

We assumed "Elasticsearch inherently requires type assertions." We didn't look for proper types.

The `@elastic/elasticsearch` package provides **complete types for all operations**. If we're using `as` or `Record<string, unknown>`, we're not using the library types.

### Current State

Some files use ES types correctly (proving it's possible):

```typescript
// Good examples (rrf-query-builders.ts, rrf-query-helpers.ts)
import type { estypes } from '@elastic/elasticsearch';
type QueryContainer = estypes.QueryDslQueryContainer;
function createLessonHighlight(): estypes.SearchHighlight { ... }
```

### Files Requiring ES SDK Types

| File                               | Issue                          | Required ES Types                                         |
| ---------------------------------- | ------------------------------ | --------------------------------------------------------- |
| `elasticsearch/setup/index.ts`     | Uses `object`, `as` assertions | `estypes.IndicesCreateRequest`, `estypes.MappingProperty` |
| `elasticsearch/index-meta.ts`      | Uses `as` assertion            | `estypes.CatIndicesResponse`                              |
| `hybrid-search/sequence-facets.ts` | Uses `as` assertion            | `estypes.SearchResponse<T>`                               |
| `ingest-cli-args.ts`               | Uses `as` assertions           | CLI args should use Zod, not ES types                     |
| `sandbox-harness-ops.ts`           | Uses `as` assertion            | `estypes.BulkResponse`                                    |
| `sandbox-harness.ts`               | Uses `as` assertion            | `estypes.BulkResponse`                                    |

### Success Criteria

- [x] `zero-hit-persistence-search.ts` uses `estypes`
- [ ] All other Elasticsearch operations use `estypes.*`
- [ ] Zero type assertions in ES code
- [ ] Zero ad-hoc types for ES operations

---

## Phase 5: Observability Typed Events

**Goal**: Replace loose event types with discriminated unions.

**Status**: Partially complete (zero-hit persistence done)

### The Real Issue

We assumed "Observability code needs loose types." But telemetry events have defined shapes—they should be typed.

### Required Approach

The idiomatic approach for varying payloads with strict types—discriminated unions:

```typescript
// Event definitions (could be at type-gen time)
interface ZeroHitEvent {
  readonly type: 'zero-hit';
  readonly query: string;
  readonly scope: SearchScope;
  readonly timestamp: string;
  readonly indexVersion: string;
}

interface SearchErrorEvent {
  readonly type: 'search-error';
  readonly query: string;
  readonly error: string;
  readonly timestamp: string;
}

type TelemetryEvent = ZeroHitEvent | SearchErrorEvent;
```

### Files Requiring Changes

| File                             | Change                               | Status      |
| -------------------------------- | ------------------------------------ | ----------- |
| `zero-hit-persistence-search.ts` | Use typed search results             | ✅ Complete |
| `zero-hit-persistence.ts`        | Use typed response                   | ✅ Complete |
| `zero-hit-persistence-index.ts`  | Define `ZeroHitIndexEvent` interface | 🔲 Pending  |
| `zero-hit-api.ts`                | Define request/response interfaces   | 🔲 Pending  |
| `ZeroHitDashboard.events.tsx`    | Use typed event components           | 🔲 Pending  |
| `zero-hit-dashboard.parse.ts`    | Use Zod validation                   | 🔲 Pending  |

### Success Criteria

- [x] Zero-hit persistence uses ES SDK types
- [ ] All telemetry events have typed interfaces
- [ ] Discriminated unions for event types
- [ ] Zod validation at API boundaries
- [ ] Zero `Record<string, unknown>` in observability code

---

## Phase 6: Script Validation at Boundaries

**Goal**: Add Zod validation where scripts read external data.

### Files Requiring Validation

| File                         | External Data           | Validation Needed             |
| ---------------------------- | ----------------------- | ----------------------------- |
| `check-progress.ts`          | JSON file reads         | Zod schema for file structure |
| `discover-lessons.ts`        | API responses           | Already validated by SDK      |
| `ingest-all-combinations.ts` | CLI args, API responses | Zod for CLI args              |
| `ingest-cli-args.ts`         | CLI args                | Zod schema                    |

### Success Criteria

- [ ] All file reads use Zod validation
- [ ] All CLI args use Zod validation
- [ ] Zero type assertions for external data
- [ ] Scripts meet same quality standard as library code

---

## Phase 7: Script Complexity Reduction

**Goal**: Refactor complex scripts to meet quality standards.

### Files Over Limits

| File                         | Issues                                                                | Fix                                       |
| ---------------------------- | --------------------------------------------------------------------- | ----------------------------------------- |
| `ingest-all-combinations.ts` | `max-lines-per-function`, `max-statements`, `complexity`, `max-lines` | Extract pure functions, reduce complexity |
| `check-progress.ts`          | `max-lines-per-function`, `max-statements`                            | Extract pure functions                    |
| `elastic-setup/route.ts`     | `max-statements`, `max-lines-per-function`, `complexity`              | Extract setup steps                       |
| `suggestions/index.ts`       | `max-lines`                                                           | Split into focused modules                |

### Success Criteria

- [ ] All files under line limits
- [ ] All functions under complexity limits
- [ ] Extracted pure functions have unit tests
- [ ] Zero `max-*` eslint-disable comments

---

## Phase 8: React Hooks Patterns

**Goal**: Address React hooks issues with proper patterns.

### Current Issues

| File                         | Issue              | Recommended Fix                                                  |
| ---------------------------- | ------------------ | ---------------------------------------------------------------- |
| `FixtureModeToggle.tsx`      | Prop-to-state sync | Consider key-based reset or controlled component                 |
| `ZeroHitDashboard.tsx`       | Cookie hydration   | Legitimate pattern, eslint-disable acceptable with documentation |
| `SearchSecondary.tsx`        | Media query sync   | Use `useSyncExternalStore` or document why not                   |
| `ThemeCssVars.unit.test.tsx` | Test pattern       | Document test utility pattern                                    |

### Success Criteria

- [ ] Each remaining eslint-disable has clear documentation
- [ ] Alternative patterns evaluated
- [ ] React patterns follow best practices

---

## Phase 9: Return Type Annotations

**Goal**: Add explicit return types where required.

### Current Issues

| File                            | Function                      | Issue                                            |
| ------------------------------- | ----------------------------- | ------------------------------------------------ |
| `document-transform-helpers.ts` | `extractLessonDocumentFields` | Missing return type, inferred to avoid cascading |
| `document-transform-helpers.ts` | `extractRollupDocumentFields` | Missing return type, inferred to avoid cascading |

### Success Criteria

- [ ] All exported functions have explicit return types
- [ ] Types derived from schema where possible
- [ ] Zero `@typescript-eslint/explicit-module-boundary-types` eslint-disable comments

---

## Phase 10: MCP Streamable HTTP

**Goal**: Fix widget, auth, and test typing issues.

### Issues

| Area            | Count | Fix                              |
| --------------- | ----- | -------------------------------- |
| Widget HTML gen | ~15   | Type-safe HTML builders          |
| Test helpers    | ~10   | Document patterns or refactor    |
| Auth/logging    | ~10   | Use MCP SDK and proper log types |
| Scripts         | ~5    | Zod validation at boundaries     |

### Success Criteria

- [ ] Widget code properly typed
- [ ] Test patterns documented
- [ ] Auth uses library types

---

## Phase 11: Notion MCP

**Goal**: Use `@notionhq/client` types throughout.

### Files

| File                      | Issue               |
| ------------------------- | ------------------- |
| `page-transformer.ts`     | Not using SDK types |
| `database-transformer.ts` | Not using SDK types |
| `validators.ts`           | Loose filter types  |
| `field-validators.ts`     | Loose filter types  |
| `builders.ts`             | Type assertions     |
| `formatters.ts`           | Type assertions     |

### Success Criteria

- [ ] All Notion API interactions use `@notionhq/client` types
- [ ] Zero type assertions for Notion data

---

## Phase 12: MCP STDIO

**Goal**: Minor fixes to 3 files.

### Files

| File                             | Issue               |
| -------------------------------- | ------------------- |
| `create-stubbed-stdio-server.ts` | Test helper pattern |
| `tool-response-handlers.ts`      | Type assertion      |
| `server.ts`                      | Type assertion      |

### Success Criteria

- [ ] All 3 files fixed

---

## Phase 13: SDK Augmentation

**Goal**: Fix `object` constraint in augmentation functions.

### Files

| File                       | Issue                    |
| -------------------------- | ------------------------ |
| `response-augmentation.ts` | `object` constraint on T |

### Success Criteria

- [ ] No `object` type in SDK
- [ ] Proper type constraints

---

## Phase 14: Generator Scripts

**Goal**: Fix generator script issues (lower priority).

These are type-gen scripts that run at build time, not runtime code. Lower priority but should still be addressed.

### Success Criteria

- [ ] Generators follow same standards
- [ ] `max-lines` addressed where possible

---

## Phase 15: Standardize Build Configs

**Goal**: Ensure all workspaces use consistent tsup and ESLint config patterns.

### tsup Config Standardization

Current inconsistencies across 12 tsup configs:

| Setting      | Variation                                         |
| ------------ | ------------------------------------------------- |
| `dts`        | `true` vs `false`                                 |
| `external`   | varies per package                                |
| Entry format | `['src/index.ts']` vs `{ index: 'src/index.ts' }` |

### Success Criteria

- [ ] Shared tsup base config created
- [ ] All tsup configs use shared base
- [ ] All ESLint configs follow documented pattern
- [ ] Consistent parser/resolver settings across workspaces

---

## Execution Order

**Foundation (affects all workspaces):**

1. **Phase 1** — Remove ad-hoc type aliases across repo
2. **Phase 2** — Replace Object.\_/Reflect.\_ with type-safe helpers
3. **Phase 3** — Define shared `LogContext` type (logger/transport libs)

**Semantic Search App (partially complete):**

4. **Phase 4** — ES SDK types for Elasticsearch code (partial ✅)
5. **Phase 5** — Observability types (partial ✅)
6. **Phase 6** — Script validation at boundaries
7. **Phase 7** — Script complexity reduction
8. **Phase 8** — React hooks patterns
9. **Phase 9** — Return type annotations

**Other Apps:**

10. **Phase 10** — MCP Streamable HTTP: widget typing, auth patterns
11. **Phase 11** — Notion MCP: Use `@notionhq/client` types
12. **Phase 12** — MCP STDIO: Minor fixes

**SDK:**

13. **Phase 13** — SDK augmentation functions (proper constraints)
14. **Phase 14** — Generator scripts (lower priority)

**Build Infrastructure:**

15. **Phase 15** — Standardize tsup and ESLint configs

---

## Quality Gates

After EACH phase:

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

**All gates must pass before proceeding to next phase.**

---

## Final Success Criteria

1. **< 20 `eslint-disable` comments** repo-wide (down from ~188)

2. **Zero `eslint-disable` comments** for:
   - `@typescript-eslint/no-restricted-types`
   - `@typescript-eslint/consistent-type-assertions`
   - `no-restricted-properties`
   - `max-*` rules

3. **Minimal documented `eslint-disable` comments** for:
   - Legitimate React patterns (with full documentation)
   - Test utilities (with justification)
   - Type-safe helpers (intentional wrappers)

4. **All current lint errors resolved** at root cause

5. **All quality gates pass** with no workarounds

6. **Foundation document compliance** verified

7. **Schema alignment** (NEW):
   - All extractors use actual schema fields
   - No fictional objects like `programmeFactors`
   - Derived fields documented in upstream wishlist
   - Zod .strict() transformation layer available

---

## Progress Tracking

### Foundation Phases

| Phase | Description                  | Status      | Comments Removed |
| ----- | ---------------------------- | ----------- | ---------------- |
| 0     | Audit and Documentation      | ✅ Complete | -                |
| 1     | Remove ad-hoc type aliases   | 🔲 Pending  | -                |
| 2     | Replace Object.\_/Reflect.\_ | 🔲 Pending  | -                |
| 3     | Shared LogContext type       | 🔲 Pending  | -                |

### Semantic Search Phases

| Phase | Description             | Status                              | Comments Removed |
| ----- | ----------------------- | ----------------------------------- | ---------------- |
| 4     | ES SDK types            | 🟢 Nearly complete (2 files remain) | -                |
| 5     | Observability types     | ✅ Complete                         | -                |
| 6     | Script validation       | 🔲 Pending                          | -                |
| 7     | Script complexity       | 🔲 Pending                          | -                |
| 8     | React hooks patterns    | 🔲 Pending                          | -                |
| 9     | Return type annotations | 🔲 Pending                          | -                |

### Indexing Pipeline (Sub-work of Phases 4-5)

| Task                                           | Status                                                                                    |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Core pipeline typed                            | ✅ Complete                                                                               |
| Tests updated                                  | ✅ Complete                                                                               |
| Zero-hit observability                         | ✅ Complete                                                                               |
| Sandbox harness files                          | 🟢 Nearly complete (2 files remain: `sandbox-fixture-data.ts`, `sequence-facet-utils.ts`) |
| Helper functions updated                       | 🔲 Pending                                                                                |
| Programme factor extractors use schema fields  | ✅ Complete                                                                               |
| Derived fields documented in upstream wishlist | ✅ Complete                                                                               |
| Zod .strict() transformation layer             | 🔲 Pending                                                                                |
| Extraction primitives removed                  | ✅ Complete                                                                               |
| Dead code cleanup                              | ✅ Complete                                                                               |

### Other Workspaces

| Phase | Description         | Status     | Comments Removed |
| ----- | ------------------- | ---------- | ---------------- |
| 10    | MCP Streamable HTTP | 🔲 Pending | -                |
| 11    | Notion MCP          | 🔲 Pending | -                |
| 12    | MCP STDIO           | 🔲 Pending | -                |
| 13    | SDK augmentation    | 🔲 Pending | -                |
| 14    | Generator scripts   | 🔲 Pending | -                |

### Build Infrastructure

| Phase | Description                     | Status     | Notes |
| ----- | ------------------------------- | ---------- | ----- |
| 15    | Standardize tsup/ESLint configs | 🔲 Pending | -     |

### Summary

| Metric                 | Current Status     | Target  |
| ---------------------- | ------------------ | ------- |
| Quality Gates          | ✅ ALL PASS        | ✅ DONE |
| Lint errors            | 0                  | 0       |
| Test failures          | 0 (with isolation) | 0       |
| UI test failures       | 0                  | 0       |
| `eslint-disable` total | ~158               | < 20    |
| `REFACTOR` comments    | 98                 | 0       |

**Status: Quality gates green** — Focus shifts to eliminating `REFACTOR` comments.

See `.agent/plans/quality-and-maintainability/global-state-test-refactoring.md` for test refactoring plan.

---

## Key Mindset

### Cardinal Rule

> **All quality gate issues are blocking at all times, regardless of location, cause, or context. There is no such thing as an acceptable failure. There is no such thing as "someone else's problem".**

### Resistance Patterns to Avoid

The instinct to:

- Add `eslint-disable` comments
- Suggest "relaxed standards for scripts"
- Dismiss issues as "pre-existing" or "not my problem"
- Call test failures "flaky" or "environment issues"

...is **resistance to doing the right work**. The foundation documents are unambiguous:

> "No type shortcuts - Never use `as`, `any`, `!`, or `Record<string, unknown>`"

> "All quality gates are blocking at all times, regardless of location, cause, or context"

> "Never work around checks... ALWAYS fix the root cause"

> "NEVER create complex mocks" (testing-strategy.md)

The lint errors and test failures aren't obstacles. They're the quality gates doing exactly what they should: **making invisible problems visible**.

---

## Troubleshooting

| Issue                                | Fix                                                          |
| ------------------------------------ | ------------------------------------------------------------ |
| Turbo TUI not showing                | Run `pnpm clean` (clears `.turbo` cache)                     |
| Stale cache after turbo version bump | Same: `pnpm clean`                                           |
| Build passes locally but fails in CI | Ensure `.turbo` isn't committed; check `pnpm-lock.yaml`      |
| Type errors after rebase             | Run `pnpm type-gen` first to regenerate types                |
| "Cannot find module" errors          | Run `pnpm install` then `pnpm build`                         |
| ESLint plugin not found              | Ensure `@oaknational/eslint-plugin-standards` is built first |
