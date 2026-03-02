---
name: "Search Dispatch Type Safety"
overview: "Eliminate ScopeDispatcher type erasure (B1) and rename aggregated-search-sdk directory fossil (W1). Merge-blocking — compile-time safety for all consumers."
todos:
  - id: b1-dispatch-types
    content: "B1: Eliminate ScopeDispatcher type erasure — dispatch table must preserve per-scope result types through to formatting. TDD."
    status: completed
  - id: w1-rename
    content: "W1: Rename aggregated-search-sdk/ to aggregated-search/, update SEARCH_SDK_* exports to SEARCH_*."
    status: completed
  - id: dispatch-quality-gates
    content: "Full quality gate chain after all changes."
    status: completed
  - id: dispatch-review
    content: "Specialist reviews (code-reviewer, type-reviewer, architecture-reviewer-barney)."
    status: completed
isProject: false
---

# Search Dispatch Type Safety

**Last Updated**: 2026-02-22
**Status**: COMPLETE
**Scope**: Eliminate type erasure in the search dispatch table (B1)
and rename the directory fossil (W1). Both are SDK-level concerns
affecting all consumers at compile time.
**Merge-blocking**: Yes — completed. Type erasure eliminated,
directory renamed, all quality gates pass.

---

## Context

Post-WS5 adversarial reviews (Barney + Betty) surfaced 4 blockers
and 8 warnings. This plan addresses the two SDK-level items:

- **B1**: `ScopeDispatcher` type erasure — affects all consumers
  at compile time (not runtime)
- **W1**: Directory naming fossil — code organisation issue

The remaining items (B3, B4, B2) are ChatGPT widget-specific and
are addressed in a separate plan:
[widget-search-rendering.md](widget-search-rendering.md).

**Source**: [Phase 3a archived plan](../archive/completed/phase-3a-mcp-search-integration.md)
(Adversarial Review Findings section)

---

## Why This Matters

1. **Immediate value**: Compile-time safety for all consumers.
   New scopes or shape changes fail at compile time, not runtime.
2. **System-level impact**: Eliminates a self-inflicted
   type-erasure/recovery cycle that masked B3 (widget field
   mismatch) at compile time.
3. **Risk of inaction**: The `ScopeDispatcher` pattern sets a
   precedent for widening types in dispatch tables. W1 rename
   becomes harder after SDK workspace separation moves files.

---

## B1: `ScopeDispatcher` Erases Per-Scope Result Types

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/execution.ts`

**Problem**: The dispatch table widens five distinct result types
to `Result<unknown, SearchRetrievalError>`:

```typescript
type ScopeDispatcher = (
  args: SearchSdkArgs,
  retrieval: SearchRetrievalService,
) => Promise<Result<unknown, SearchRetrievalError>>;
```

Each scope's retrieval method returns a specific type:

| Scope | Return type |
|-------|------------|
| `lessons` | `Result<LessonsSearchResult, SearchRetrievalError>` |
| `units` | `Result<UnitsSearchResult, SearchRetrievalError>` |
| `threads` | `Result<ThreadsSearchResult, SearchRetrievalError>` |
| `sequences` | `Result<SequencesSearchResult, SearchRetrievalError>` |
| `suggest` | `Result<SuggestionResponse, SearchRetrievalError>` |

But `ScopeDispatcher` forces all five to `unknown`. Then
`formatting.ts` receives `unknown` and partially recovers via
runtime guards:

- `isSuggestionResponse`: narrows to `SuggestionResponse`
- `isScopedSearchResult`: narrows only to `ScopedSearchData`
  with `results: readonly unknown[]` — the per-scope result
  types (`LessonResult[]`, `UnitResult[]`, etc.) are never
  recovered

**Impact**: Compile-time safety lost at dispatch boundary. The
`ScopedSearchData` interface with `results: readonly unknown[]`
is the exact mechanism that masked B3 at compile time.

**Fix**: Replace the homogeneous dispatch table with a `switch`
statement that returns a discriminated union
`SearchDispatchResult = ScopedSearchResult | SuggestionResponse`.
The `scope` field on each scoped result type is the natural
discriminant. `SuggestionResponse` lacks `scope` but is
structurally distinct — discriminate via
`'suggestions' in result` property check. Include a
`default: never` exhaustiveness guard in the switch and a
compile-time `AssertNoSuggestions` type to protect the
discrimination invariant against future drift.

## W1: Directory Naming Fossil

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/`

**Problem**: Directory still named `aggregated-search-sdk/`
(transitional name from WS5 when old and new search tools
coexisted). Three exports use `SEARCH_SDK_*` prefix:
`SEARCH_SDK_TOOL_DEF`, `SEARCH_SDK_INPUT_SCHEMA`,
`SEARCH_SDK_SCOPES`.

**Scope**: 9 files in the directory, 3 external importers
(`definitions.ts`, `executor.ts`, `universal-tools.unit.test.ts`),
5 total references to `SEARCH_SDK_*`.

**Fix**: Rename directory to `aggregated-search/`, update exports
to `SEARCH_TOOL_DEF`, `SEARCH_INPUT_SCHEMA`, `SEARCH_SCOPES`.
Function and type names (`SearchSdkArgs`, `SearchSdkScope`,
`runSearchSdkTool`, etc.) are intentionally deferred — cosmetic
naming debt, not type erasure. Can be folded into SDK workspace
separation (3e) if desired.

---

## Execution Plan

### Phase 1: B1 — Type-Safe Dispatch (RED/GREEN/REFACTOR)

> See [TDD Phases component](../../templates/components/tdd-phases.md)

This is a **refactoring** exercise — runtime behaviour is
unchanged. Type-safety improvements are validated by the
**compiler** (`pnpm type-check`), not by runtime tests. Runtime
tests remain behavioural.

**Baseline**: Verify all existing tests pass.

**RED**: Update `formatting.unit.test.ts` calls to match the
new signature — remove `scope` parameter from
`formatSearchResults` calls. Simplify mock data to
`results: []` at lines 20, 79, 103, 125 (partial index doc
objects will not satisfy generated types; no test asserts on
individual result contents). Tests fail (function signature
mismatch).

**GREEN**: Define `ScopedSearchResult` and
`SearchDispatchResult` union types in `types.ts`. Replace the
dispatch table with a `switch` on `args.scope` returning
`Result<SearchDispatchResult, SearchRetrievalError>` with a
`default: never` exhaustiveness guard. Remove:

- `ScopeDispatcher` type alias (returns `Result<unknown, ...>`)
- `ScopedSearchData` interface (`results: readonly unknown[]`)
- `isScopedSearchResult` type guard
- `isSuggestionResponse` type guard
- `result: unknown` parameter on `formatSearchResults`

Replace `formatSearchResults(scope, result: unknown, query)` with
`formatSearchResults(result: SearchDispatchResult, query)` — the
`scope` is already on the result via the discriminant.
Discriminate using `'suggestions' in result`.

Add compile-time `AssertNoSuggestions` guard to protect the
discrimination invariant. Run tests. They MUST pass.

**REFACTOR**: Update TSDoc. Verify `formatting.ts` has zero
type guards for type recovery.

**Files to change**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/execution.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/formatting.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/execution.integration.test.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/formatting.unit.test.ts`

**Deterministic validation**:

```bash
pnpm test --filter @oaknational/curriculum-sdk
# Expected: all tests pass, no unknown type recovery in formatting.ts

rg "isScopedSearchResult|isSuggestionResponse" packages/sdks/oak-curriculum-sdk/src/
# Expected: NO MATCHES (type guards removed)

rg "result: unknown" packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/formatting.ts
# Expected: NO MATCHES (unknown parameter removed)
```

### Phase 2: W1 — Directory Rename (Mechanical)

Rename `aggregated-search-sdk/` to `aggregated-search/`. Update:

- Barrel file (`index.ts`): `SEARCH_SDK_*` exports to `SEARCH_*`
- `tool-definition.ts`: `SEARCH_SDK_SCOPES` to `SEARCH_SCOPES`
- `types.ts`: `SEARCH_SDK_SCOPES` to `SEARCH_SCOPES`
- `validation.ts`: `SEARCH_SDK_SCOPES` import
- `definitions.ts`: `SEARCH_SDK_TOOL_DEF`, `SEARCH_SDK_INPUT_SCHEMA` imports
- `executor.ts`: `validateSearchSdkArgs`, `runSearchSdkTool` imports (function names unchanged — only the `SEARCH_SDK_*` constants change)
- `universal-tools.unit.test.ts`: `SEARCH_SDK_INPUT_SCHEMA` import

**Deterministic validation**:

```bash
rg "aggregated-search-sdk" packages/sdks/oak-curriculum-sdk/src/
# Expected: NO MATCHES

rg "SEARCH_SDK_" packages/sdks/oak-curriculum-sdk/src/
# Expected: NO MATCHES
```

### Phase 3: Quality Gates + Review

> See [Quality Gates](../../templates/components/quality-gates.md)
> and [Adversarial Review](../../templates/components/adversarial-review.md)

Full quality gate chain from repo root:

```bash
pnpm clean
pnpm type-gen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
```

Invoke specialist reviewers:

- `code-reviewer` (gateway)
- `type-reviewer` (B1 type-safety changes)
- `architecture-reviewer-barney` (dispatch boundary simplification)

---

## Non-Goals (YAGNI)

- **Widget rendering changes** — addressed in
  [widget-search-rendering.md](widget-search-rendering.md)
- **Broader aggregated tool architecture refactor** — deferred
- **Result pattern unification (3b)** — post-merge workstream
- **W2-W8 warnings** — future workstreams

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| B1 dispatch refactor breaks existing search tool behaviour | Low | TDD: existing tests serve as regression guard | Integration tests before refactoring dispatch |
| B1 `'suggestions' in result` discrimination drifts if a scoped result gains `suggestions` | Low | Compile error from `AssertNoSuggestions` type guard catches violation | Compile-time assertion in `types.ts` |
| W1 rename causes import breakage across codebase | Low | Full quality gate chain catches stale imports | `rg` for stale imports before committing |
| W1 rename conflicts with SDK workspace separation (3e) | Low | W1 is simpler to do first, reducing 3e's scope | Do W1 before starting 3e |

---

## Dependencies

**Blocking**: None — can start immediately.
**Blocks**: SDK workspace separation (3e) — W1 simplifies the
directory layout before 3e moves files.

**Related Plans**:

- [widget-search-rendering.md](widget-search-rendering.md) — widget-specific B3+B4+B2
- [SDK workspace separation](sdk-workspace-separation.md) — merge blocker
- [Phase 3a (archived)](../archive/completed/phase-3a-mcp-search-integration.md) — source of adversarial findings

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)
