---
name: "WS6: Search Contract Hardening"
overview: "Address 4 correctness/safety gaps (B1-B4) and 1 rename (W1) surfaced by post-WS5 adversarial review. Type-safe dispatch, widget contract tests, suggest renderer."
todos:
  - id: ws6-b1-dispatch-types
    content: "B1: Eliminate ScopeDispatcher type erasure — dispatch table must preserve per-scope result types through to formatting. TDD."
    status: pending
  - id: ws6-b3-field-mismatch
    content: "B3: Fix widget-to-SDK field mismatch — renderer accesses flat fields but LessonResult wraps data in `lesson` property. TDD."
    status: pending
  - id: ws6-b2-contract-tests
    content: "B2: Add contract tests validating renderer field access against generated index document types. TDD."
    status: pending
  - id: ws6-b4-suggest-renderer
    content: "B4: Handle suggest scope in widget renderer — suggest returns `{ suggestions, cache }`, not `{ results }`. TDD."
    status: pending
  - id: ws6-w1-rename
    content: "W1: Rename aggregated-search-sdk/ to aggregated-search/, update SEARCH_SDK_* exports to SEARCH_*."
    status: pending
  - id: ws6-quality-gates
    content: "Full quality gate chain after all changes."
    status: pending
  - id: ws6-review
    content: "Adversarial specialist reviews. Document findings."
    status: pending
isProject: false
---

# WS6: Search Contract Hardening

**Last Updated**: 2026-02-22
**Status**: 🟡 PLANNING
**Scope**: Fix 4 correctness/safety gaps and 1 naming fossil in the
search tool and widget renderer, surfaced by post-WS5 adversarial review.

---

## Context

After completing WS5 (replace old search with SDK-backed search), Barney
(simplification/boundary) and Betty (cohesion/coupling/change-cost)
performed adversarial sweeps. They identified 4 blockers and 8 warnings.

The blockers are pre-existing architectural debt surfaced by WS5, not
regressions. They are contained within `aggregated-search-sdk/` and the
widget renderer. This plan addresses all 4 blockers plus W1 (directory
rename) as a single focused workstream.

**Source**: [Phase 3a archived plan](../archive/completed/phase-3a-mcp-search-integration.md)
(Adversarial Review Findings section)

---

## Blockers to Address

### B1: `ScopeDispatcher` erases per-scope result types to `unknown`

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/execution.ts`

**Problem**: The dispatch table widens `LessonsSearchResult`,
`UnitsSearchResult`, `ThreadsSearchResult`, `SequencesSearchResult` to
`Result<unknown, SearchRetrievalError>`. `formatting.ts` then recovers
types via runtime guards (`isScopedSearchResult`, `isSuggestionResponse`).
This is a self-inflicted type-erasure/recovery cycle.

**Impact**: Compile-time safety lost at dispatch boundary. New scopes with
unexpected shapes throw at runtime instead of failing at compile time.

**Fix options**:

1. Discriminated-union return from the dispatch table (preferred)
2. Move formatting into each dispatcher so the type is never widened

### B2: Widget renderer has zero compile-time feedback

**Location**: `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/search-renderer.ts`

**Problem**: Raw JS string template accessing index document fields
(`l.lessonTitle`, `l.canonicalUrl`, `l.units[0].subjectSlug`) with no
type checking. Any ES index document schema change silently breaks the
widget.

**Impact**: Schema drift causes silent rendering degradation.

**Fix**: Contract tests validating renderer field access against actual
generated index document types.

### B3: Widget-to-SDK field mismatch

**Location**: Same as B2.

**Problem**: Renderer expects flat fields (`l.lessonTitle`) but
`LessonResult` wraps lesson data inside a nested `lesson` property:
`{ id, rankScore, lesson: SearchLessonsIndexDoc, highlights }`. With
real ES data, cards render as "Untitled" with no metadata.

**Impact**: Functional bug with live Elasticsearch data.

**Fix**: Update renderer to access `l.lesson.lessonTitle`, or flatten
results in `formatting.ts` before they reach the widget.

### B4: `suggest` scope not handled by widget

**Location**: Widget renderer and `widget-script.ts`.

**Problem**: Suggest returns `{ suggestions, cache }` (no `results`
property), so `renderSearch` shows "No results found" for valid output.

**Impact**: Suggest scope silently broken in widget.

**Fix**: Add scope-aware branching in the renderer, or a dedicated
suggest renderer.

### W1: Directory naming fossil

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/`

**Problem**: Directory still named `aggregated-search-sdk/` (transitional
name from when old and new search tools coexisted). Exports use
`SEARCH_SDK_*` prefix.

**Fix**: Rename to `aggregated-search/`, update exports to `SEARCH_*`.

---

## Remaining Warnings (Lower Priority, Not in This Plan)

These warnings are documented for completeness but are not addressed by
this workstream. They can be tackled incrementally in future work.

| ID | Finding | Priority | Notes |
|----|---------|----------|-------|
| W2 | Fat interface: `UniversalToolExecutorDependencies` | Medium | ISP concern; deferred to broader refactor |
| W3 | `buildSuggestParams` hardcodes scope to `'lessons'` | Medium | Feature gap; expand when suggest scope is needed |
| W4 | `SearchLessonsParams` has `examSubject`/`ks4Option` not exposed | Low | Silent capability gap; expose when needed |
| W5 | `TOOL_RENDERER_MAP` keys are `string` not `UniversalToolName` | Medium | Type safety; can be done with B2 contract tests |
| W6 | Scope-specific filter params silently dropped | Medium | Fail-fast gap; requires validation changes |
| W7 | `SKIPPED_PATHS` uses exact string equality | Low | Will become dead code when REST endpoints removed |
| W8 | Search retrieval factory duplicated across apps | -- | Addressed by 3c STDIO-HTTP alignment |

---

## Execution Plan

### Phase 1: B1 — Type-Safe Dispatch (RED/GREEN/REFACTOR)

> See [TDD Phases component](../../templates/components/tdd-phases.md)

**RED**: Write tests asserting that the dispatch table preserves
per-scope result types. Tests should demonstrate that
`formatSearchResults` receives typed results, not `unknown`.

**GREEN**: Refactor the dispatch table to use a discriminated-union
return or per-scope formatting. Remove runtime type guards that recover
erased types.

**REFACTOR**: Update TSDoc. Verify `formatting.ts` no longer needs
`isScopedSearchResult` guards.

### Phase 2: B3 + B2 — Widget Field Fix and Contract Tests (RED/GREEN/REFACTOR)

**RED**: Write tests that render search results using the actual
`LessonResult` shape (with nested `lesson` property). Tests should
fail against the current renderer.

**GREEN**: Fix the renderer to access `l.lesson.lessonTitle` (or
flatten results in `formatting.ts`). Add contract tests validating
all renderer field accesses against generated index document types.

**REFACTOR**: Update `widget-preview.html` and Playwright tests.

### Phase 3: B4 — Suggest Renderer (RED/GREEN/REFACTOR)

**RED**: Write tests rendering suggest output
(`{ suggestions, cache }`). Tests should fail against the current
renderer.

**GREEN**: Add suggest-aware branching in the renderer or a dedicated
suggest renderer.

**REFACTOR**: Update Playwright tests, add suggest fixture data.

### Phase 4: W1 — Directory Rename (Mechanical)

Rename `aggregated-search-sdk/` to `aggregated-search/`. Update all
`SEARCH_SDK_*` exports to `SEARCH_*`. Update imports across the
codebase.

### Phase 5: Quality Gates + Adversarial Review

> See [Quality Gates](../../templates/components/quality-gates.md)
> and [Adversarial Review](../../templates/components/adversarial-review.md)

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Mitigation |
|------|------------|
| B1 dispatch refactor breaks existing search tool behaviour | TDD: existing tests serve as regression guard |
| B3 field fix changes widget rendering for all search results | Playwright E2E tests catch rendering regressions |
| W1 rename causes import breakage across codebase | Full quality gate chain; `rg` for stale imports |
| B2 contract tests are brittle against schema changes | Tests derive expectations from generated types, not hardcoded strings |

---

## Dependencies

**Blocking**: None — can start immediately.

**Related Plans**:

- [Phase 3a (archived)](../archive/completed/phase-3a-mcp-search-integration.md) — source of adversarial findings
- [3c STDIO-HTTP alignment](../../architecture/stdio-http-server-alignment.md) — addresses W8

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)
