---
name: "Extract search-args layer into Search SDK"
overview: "Move param builders, scope validation, error formatting, and key type re-exports from MCP layer and CLI into the search SDK so all consumers share one canonical surface."
todos:
  - id: ws1-red
    content: "WS1 (RED): Unit tests for search-args module — param builders, scope validation, error formatting. Tests MUST fail."
    status: pending
  - id: ws2-green
    content: "WS2 (GREEN): Implement search-args module in search SDK. All tests MUST pass."
    status: pending
  - id: ws3-refactor
    content: "WS3 (REFACTOR): Simplify consumers (MCP layer, CLI), remove duplicates, TSDoc, README updates."
    status: pending
  - id: ws4-quality-gates
    content: "WS4: Full quality gate chain (sdk-codegen through test:e2e)."
    status: pending
  - id: ws5-adversarial-review
    content: "WS5: Adversarial specialist reviews. Document findings."
    status: pending
  - id: ws6-doc-propagation
    content: "WS6: Propagate settled outcomes to canonical ADR/directive/reference docs and relevant READMEs."
    status: pending
---

# Extract Search-Args Layer into Search SDK

**Last Updated**: 2026-03-01
**Status**: 🟡 PLANNING
**Scope**: Move param builders, scope validation, error formatting, and selective type re-exports from the MCP layer (curriculum SDK) and CLI into the search SDK, giving all consumers a single canonical search-args surface.

---

## Context

The search SDK (`@oaknational/oak-search-sdk`) provides a substantial retrieval API — RRF query building, ELSER, filtering, score normalisation, suggestions, facets. However, every consumer must independently solve the same problems before calling that API:

1. **Param building** — mapping a generic "search form" shape to scope-specific params (`SearchLessonsParams`, `SearchUnitsParams`, etc.)
2. **Scope validation** — deciding which scopes are valid and narrowing strings to scope types
3. **Error formatting** — turning `RetrievalError` into human-readable messages
4. **Schema type access** — importing types from `@oaknational/sdk-codegen` directly rather than through the SDK

Both the MCP layer (curriculum SDK) and the CLI have independently implemented these. A new consumer (e.g. a demo search UI) would need to implement them a third time.

### Problem Statement

**Duplication across consumers.** The curriculum SDK's `aggregated-search/` module contains param builders, scope validation, and error formatting. The CLI's `src/cli/shared/validators.ts` contains parallel scope/subject/key-stage validation. Neither is reusable outside its own package.

**Evidence:**

- `buildLessonsParams`, `buildUnitsParams`, `buildThreadsParams`, `buildSequencesParams`, `buildSuggestParams` in `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts` (lines 26–96)
- `SEARCH_SCOPES`, `SearchSdkScope`, `isSearchSdkScope` in `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/types.ts` (lines 28–42)
- `formatRetrievalError` in `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts` (lines 100–113)
- `validateSubject`, `validateKeyStage`, `validateScope` in `apps/oak-search-cli/src/cli/shared/validators.ts` (lines 21–62)
- Scope enum mismatch: `sdk-codegen/search` defines `SEARCH_SCOPES = ['lessons', 'units', 'sequences']` (no `threads`, `suggest`), while the curriculum SDK defines `SearchSdkScope` with all five

### Existing Capabilities

The search SDK already exports:

- `RetrievalService` with `searchLessons`, `searchUnits`, `searchSequences`, `searchThreads`, `suggest`, `fetchSequenceFacets`
- All scope-specific param types (`SearchLessonsParams`, `SearchUnitsParams`, `SearchSequencesParams`, `SuggestParams`, `FacetParams`, `SearchParamsBase`)
- All result types (`LessonsSearchResult`, `UnitsSearchResult`, etc.)
- `RetrievalError` discriminated union (`es_error | timeout`)

What it does NOT export: param builders, scope validation, error formatting, or schema types (`SearchScope`, `SearchSubjectSlug`, `KeyStage`).

---

## Design Principles

1. **Single canonical surface** — search consumers import from `@oaknational/oak-search-sdk`, not from `@oaknational/sdk-codegen/search` or internal MCP modules
2. **Pure functions, no framework coupling** — param builders and validators are pure functions, testable without ES or MCP dependencies
3. **Move, don't wrap** — replace the MCP/CLI implementations with SDK imports; no compatibility layers

**Non-Goals** (YAGNI):

- Multi-scope parallel orchestration (the `explore-topic` pattern) — consumers can compose `Promise.all` themselves; extract only if the demo UI needs it
- Natural language parsing or intent extraction (per ADR-107)
- Query builder API beyond the existing structured params
- Caching, retries, or circuit breakers

---

## WS1 — Test Specification (RED)

All tests MUST FAIL at the end of WS1.

> See [TDD Phases component](../../templates/components/tdd-phases.md)

### 1.1: Param builder unit tests

**File**: `packages/sdks/oak-search-sdk/src/search-args/build-params.unit.test.ts`

**Tests**:

- `buildLessonsParams` maps `SearchArgs` → `SearchLessonsParams` with text, subject, keyStage, size, from
- `buildUnitsParams` maps `SearchArgs` → `SearchUnitsParams` including `minLessons`
- `buildThreadsParams` maps `SearchArgs` → `SearchParamsBase` (text optional when subject/keyStage present)
- `buildSequencesParams` maps `SearchArgs` → `SearchSequencesParams` including phase, category filters
- `buildSuggestParams` maps `SearchArgs` → `SuggestParams` (text → prefix)
- Each builder omits `undefined` optional fields (no spurious keys)
- Each builder preserves filter fields it doesn't own (pass-through safety)

**Acceptance Criteria**:

1. Tests compile and reference functions from `./build-params.js`
2. All tests fail because `build-params.ts` does not exist yet
3. No existing tests broken

### 1.2: Scope validation unit tests

**File**: `packages/sdks/oak-search-sdk/src/search-args/search-scopes.unit.test.ts`

**Tests**:

- `RETRIEVAL_SCOPES` contains exactly `['lessons', 'units', 'threads', 'sequences', 'suggest']`
- `isRetrievalScope` narrows valid strings to `RetrievalScope`
- `isRetrievalScope` rejects invalid strings
- `validateRetrievalScope` returns the scope for valid input
- `validateRetrievalScope` returns an error result for invalid input

**Naming note**: Use `RetrievalScope` (not `SearchSdkScope`) — we're in the search SDK, so the "search SDK" prefix is redundant. "Retrieval" aligns with the `RetrievalService` naming.

**Acceptance Criteria**:

1. Tests compile and reference functions from `./search-scopes.js`
2. All tests fail because `search-scopes.ts` does not exist yet
3. No existing tests broken

### 1.3: Error formatting unit tests

**File**: `packages/sdks/oak-search-sdk/src/search-args/format-error.unit.test.ts`

**Tests**:

- `formatRetrievalError` produces human-readable string for `es_error` (with and without statusCode)
- `formatRetrievalError` produces human-readable string for `timeout`
- All `RetrievalError` variants are handled (exhaustive switch)

**Acceptance Criteria**:

1. Tests compile and reference `formatRetrievalError` from `./format-error.js`
2. All tests fail because `format-error.ts` does not exist yet
3. No existing tests broken

### 1.4: SearchArgs type compilation test

**File**: `packages/sdks/oak-search-sdk/src/search-args/search-args-types.unit.test.ts`

**Tests**:

- `SearchArgs` type accepts a valid search args object (text, scope, subject, keyStage, size, from)
- Param builders accept `SearchArgs` and return the correct SDK param types
- `satisfies` assertions prove type compatibility at compile time

**Acceptance Criteria**:

1. Tests compile against types from `./types.js`
2. Tests fail because `types.ts` does not exist yet
3. No existing tests broken

---

## WS2 — Implementation (GREEN)

All tests MUST PASS at the end of WS2.

### 2.1: Define `SearchArgs` type

**File**: `packages/sdks/oak-search-sdk/src/search-args/types.ts`

**Changes**:

- Define `SearchArgs` interface: the generic input shape that any consumer (UI form, MCP tool, CLI) can produce
- Fields: `text?: string`, `scope: RetrievalScope`, `subject?: string`, `keyStage?: string`, `size?: number`, `from?: number`, plus scope-specific optional filters (`minLessons`, `phase`, `category`, `tier`, `examBoard`, `threadSlug`)
- Import filter types from existing SDK param types where possible

**Deterministic Validation**:

```bash
pnpm type-check --filter @oaknational/oak-search-sdk
# Expected: exit 0
```

### 2.2: Implement scope validation

**File**: `packages/sdks/oak-search-sdk/src/search-args/search-scopes.ts`

**Changes**:

- Define `RETRIEVAL_SCOPES` as const tuple
- Derive `RetrievalScope` type
- Implement `isRetrievalScope` type guard
- Implement `validateRetrievalScope` returning `Result<RetrievalScope, string>`

**Deterministic Validation**:

```bash
pnpm test --filter @oaknational/oak-search-sdk -- search-scopes
# Expected: exit 0, all scope tests pass
```

### 2.3: Implement param builders

**File**: `packages/sdks/oak-search-sdk/src/search-args/build-params.ts`

**Changes**:

- Move logic from `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts` (lines 26–96)
- `buildLessonsParams(args: SearchArgs): SearchLessonsParams`
- `buildUnitsParams(args: SearchArgs): SearchUnitsParams`
- `buildThreadsParams(args: SearchArgs): SearchParamsBase`
- `buildSequencesParams(args: SearchArgs): SearchSequencesParams`
- `buildSuggestParams(args: SearchArgs): SuggestParams`
- All pure functions, no side effects

**Deterministic Validation**:

```bash
pnpm test --filter @oaknational/oak-search-sdk -- build-params
# Expected: exit 0, all param builder tests pass
```

### 2.4: Implement error formatting

**File**: `packages/sdks/oak-search-sdk/src/search-args/format-error.ts`

**Changes**:

- Move logic from `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts` (lines 100–113)
- `formatRetrievalError(error: RetrievalError): string`
- Handle all variants of `RetrievalError` with exhaustive switch

**Note**: The MCP layer's `formatRetrievalError` handles `validation_error` and `unknown` variants that don't exist in the search SDK's `RetrievalError` type. Only handle the SDK's actual variants (`es_error`, `timeout`). The MCP layer can extend formatting for its own error variants.

**Deterministic Validation**:

```bash
pnpm test --filter @oaknational/oak-search-sdk -- format-error
# Expected: exit 0, all error formatting tests pass
```

### 2.5: Export from search-args barrel and SDK index

**Files**:

- `packages/sdks/oak-search-sdk/src/search-args/index.ts` — barrel export
- `packages/sdks/oak-search-sdk/src/index.ts` — add search-args re-exports

**Changes**:

- Create barrel file exporting all public symbols from search-args module
- Add `export * from './search-args/index.js'` to SDK index

**Deterministic Validation**:

```bash
pnpm type-check --filter @oaknational/oak-search-sdk
pnpm test --filter @oaknational/oak-search-sdk
# Expected: both exit 0
```

---

## WS3 — Consumer Simplification and Documentation (REFACTOR)

### 3.1: Update curriculum SDK MCP tools to import from search SDK

**Files**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/types.ts`

**Changes**:

- Replace local `buildLessonsParams` etc. with imports from `@oaknational/oak-search-sdk`
- Replace local `SEARCH_SCOPES`, `SearchSdkScope`, `isSearchSdkScope` with `RETRIEVAL_SCOPES`, `RetrievalScope`, `isRetrievalScope` from SDK
- Replace local `formatRetrievalError` with import from SDK (extend locally only for MCP-specific error variants like `validation_error`)
- Delete dead code

**Deterministic Validation**:

```bash
pnpm type-check && pnpm lint && pnpm test
# Expected: all exit 0, no regressions
```

### 3.2: Update CLI validators to import from search SDK

**Files**:

- `apps/oak-search-cli/src/cli/shared/validators.ts`

**Changes**:

- Replace local `validateScope` with `validateRetrievalScope` from SDK (or keep as thin wrapper if CLI scope enum is narrower)
- Evaluate whether `validateSubject` and `validateKeyStage` should also move to SDK (they depend on curriculum SDK types, not search SDK types — may stay in CLI)
- Delete dead code

**Deterministic Validation**:

```bash
pnpm type-check && pnpm lint && pnpm test
# Expected: all exit 0
```

### 3.3: TSDoc and inline documentation

- All new public functions and types in `search-args/` module MUST have exhaustive TSDoc with `@example` tags
- `RetrievalScope` docs should explain the relationship to `SearchScope` from sdk-codegen (which lacks `threads` and `suggest`)
- `SearchArgs` docs should explain the generic-to-specific mapping pattern

### 3.4: README updates

- Update `packages/sdks/oak-search-sdk/README.md` with search-args usage section
- Add code examples showing: (a) building params from a form submission, (b) scope validation, (c) error formatting

---

## WS4 — Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e && pnpm smoke:dev:stub
```

---

## WS5 — Adversarial Review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

Invoke specialist reviewers based on change profile:

- `code-reviewer` — gateway (always)
- `architecture-reviewer-barney` — structural extraction across package boundaries
- `type-reviewer` — type re-exports, generic-to-specific mapping, `SearchArgs` design
- `test-reviewer` — TDD compliance for new search-args tests

Document findings. Create follow-up plan if BLOCKERs found.

---

## WS6 — Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

- Update search SDK README with search-args surface documentation
- Update semantic-search collection README to reference this plan
- Evaluate whether an ADR is warranted for the "SDK as canonical consumer surface" decision (likely yes — this establishes that the search SDK is the boundary, not sdk-codegen)

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Cross-workspace regression when MCP layer switches to SDK imports | Medium | SDK changes break MCP tools | Full quality gate chain after each change; integration tests in curriculum SDK already cover MCP tool behaviour |
| `SearchArgs` type becomes a kitchen sink with every possible filter | Low | Type loses specificity, becomes `Record`-like | Keep `SearchArgs` focused on common fields; scope-specific filters use discriminated union or builder overloads |
| Scope enum divergence between SDK and sdk-codegen | Medium | Consumers confused about which scopes are valid | Document clearly; `RetrievalScope` is authoritative for retrieval operations, `SearchScope` from sdk-codegen is the indexing scope |
| Breaking change to curriculum SDK's internal MCP modules | Low | Downstream MCP apps break | MCP apps import from curriculum SDK's public API, not internal modules; test coverage catches regressions |

### System-Level Thinking

1. **Why are we doing this?** Every new search consumer (demo UI, future apps) currently needs to re-implement param building, scope validation, and error formatting. This is duplicated effort and a consistency risk.
2. **Why does that matter?** The SDK should be a complete consumption boundary. If consumers need to reach past the SDK to sdk-codegen or re-implement logic from the MCP layer, the SDK's abstraction is leaking.
3. **What if we don't?** Each new consumer accumulates its own bespoke search-args logic. Bugs are fixed in one consumer but not others. The demo UI ships with subtly different validation from the MCP tools.

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- **Cardinal Rule**: Types flow from the schema. `SearchArgs` will be defined in terms of types that already flow from sdk-codegen → search SDK. No ad-hoc types.
- **No compatibility layers**: The MCP layer's local implementations are replaced, not wrapped.
- **TDD at all levels**: Tests first (WS1), implementation second (WS2), refactor third (WS3).
- **Pure functions first**: Param builders and validators are pure, no side effects, no I/O.
- **DRY**: One implementation in the SDK, consumed by all.

---

## Dependencies

**Blocking**: None — this is independent of other active work.

**Related Plans**:

- [MCP Result Pattern Unification](../../semantic-search/active/mcp-result-pattern-unification.execution.plan.md) — the `Result<T, E>` migration may affect error formatting; coordinate execution sequencing
- Demo Search UI (future plan) — this extraction is the prerequisite; the UI plan will be created after WS3

**Prerequisites**:

- ✅ Search SDK exists with full retrieval API
- ✅ MCP tools are wired and working
- ✅ CLI search commands are thin wrappers around SDK

---

## Follow-Up: Demo Search UI

This extraction plan is motivated by the need for a demo search UI. Once WS1–WS3 are complete, a follow-up plan will cover:

- New Next.js app in `apps/` (or a route in an existing app)
- End-user search interface using `@oaknational/oak-search-sdk` search-args module
- Search form → `SearchArgs` → param builders → `retrieval.searchLessons` etc.
- Result display, suggestions, faceted filtering
- The UI should demonstrate that the SDK provides everything a consumer needs — no reaching into internal modules

This plan does NOT cover the demo UI. The UI plan will be created separately after the SDK surface is enriched.
