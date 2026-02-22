---
name: Search Dispatch Type Safety
overview: Eliminate ScopeDispatcher type erasure (B1) by replacing the homogeneous dispatch table with a switch-based discriminated union, then rename the directory fossil (W1). Both are SDK-level compile-time concerns.
todos:
  - id: b1-types
    content: Define ScopedSearchResult and SearchDispatchResult union types in types.ts
    status: completed
  - id: b1-tests-red
    content: Update formatting unit test calls to match new signature (remove scope param, simplify mocks) -- tests fail
    status: completed
  - id: b1-execution
    content: Replace ScopeDispatcher + dispatch table with switch in execution.ts, return Result<SearchDispatchResult, ...>
    status: completed
  - id: b1-formatting
    content: Remove ScopedSearchData, isScopedSearchResult, isSuggestionResponse from formatting.ts. Accept SearchDispatchResult, use 'suggestions' in result discrimination
    status: completed
  - id: b1-verify
    content: "Run SDK tests, grep for removed artefacts (ScopeDispatcher, ScopedSearchData, isScopedSearchResult, isSuggestionResponse, result: unknown)"
    status: completed
  - id: w1-rename
    content: Rename aggregated-search-sdk/ to aggregated-search/, rename SEARCH_SDK_* constants to SEARCH_*, update all import sites
    status: completed
  - id: w1-verify
    content: Grep for stale aggregated-search-sdk and SEARCH_SDK_ references
    status: completed
  - id: quality-gates
    content: "Full quality gate chain: type-gen, build, type-check, lint:fix, format:root, markdownlint:root, test, test:e2e"
    status: completed
  - id: reviews
    content: "Specialist reviews: code-reviewer, type-reviewer, architecture-reviewer-barney"
    status: completed
isProject: false
---

# Search Dispatch Type Safety

## Problem

The dispatch table in `[execution.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/execution.ts)` widens five distinct result types to `Result<unknown, SearchRetrievalError>` via the `ScopeDispatcher` type alias. Then `[formatting.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/formatting.ts)` partially recovers types via runtime guards, but `ScopedSearchData` with `results: readonly unknown[]` means per-scope result types are never recovered. This is compile-time type erasure -- the directory naming fossil (`aggregated-search-sdk/`) is a separate mechanical cleanup.

## Design Decision: Switch Over Dispatch Table

The four scoped result types already have literal `scope` fields (`'lessons'`, `'units'`, `'threads'`, `'sequences'`), and `SuggestionResponse` is structurally distinct (has `suggestions`, no `scope`). A `switch` statement is simpler than trying to type a heterogeneous dispatch table via mapped types:

```mermaid
flowchart TD
    subgraph current [Current: Type Erasure]
        A["SCOPE_DISPATCHERS Record"] -->|"Result of unknown"| B["dispatchByScope"]
        B -->|"data: unknown"| C["formatSearchResults"]
        C -->|"runtime guards"| D["isScopedSearchResult / isSuggestionResponse"]
        D -->|"ScopedSearchData.results: unknown[]"| E["Per-scope types LOST"]
    end
    subgraph target [Target: Type-Safe Dispatch]
        F["switch on args.scope"] -->|"Result of SearchDispatchResult"| G["runSearchSdkTool"]
        G -->|"SearchDispatchResult"| H["formatSearchResults"]
        H -->|"'suggestions' in result"| I["Per-scope types PRESERVED"]
    end
```

## Phase 1: B1 -- Type-Safe Dispatch

### New Types in `[types.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/types.ts)`

Define the discriminated union from imported result types:

```typescript
import type {
  LessonsSearchResult,
  UnitsSearchResult,
  ThreadsSearchResult,
  SequencesSearchResult,
  SuggestionResponse,
} from '../search-retrieval-types.js';

type ScopedSearchResult =
  | LessonsSearchResult
  | UnitsSearchResult
  | ThreadsSearchResult
  | SequencesSearchResult;

type SearchDispatchResult = ScopedSearchResult | SuggestionResponse;
```

### Changes to `[execution.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/execution.ts)`

- **Remove**: `ScopeDispatcher` type alias (line 115) and `SCOPE_DISPATCHERS` record (lines 118-124)
- **Replace** `dispatchByScope` with a `switch` on `args.scope`, returning `Result<SearchDispatchResult, SearchRetrievalError>` directly
- **Simplify** `runSearchSdkTool`: move error formatting here, call `formatSearchResults(result.value, args.text)` (no `scope` parameter)

The `switch` gives TypeScript exhaustiveness checking and preserves per-case return types. Include a `default: never` guard for precise compile-time errors when a new scope is added (type-reviewer recommendation):

```typescript
async function dispatchByScope(
  args: SearchSdkArgs,
  retrieval: SearchRetrievalService,
): Promise<Result<SearchDispatchResult, SearchRetrievalError>> {
  switch (args.scope) {
    case 'lessons': return retrieval.searchLessons(buildLessonsParams(args));
    case 'units': return retrieval.searchUnits(buildUnitsParams(args));
    case 'threads': return retrieval.searchThreads(buildThreadsParams(args));
    case 'sequences': return retrieval.searchSequences(buildSequencesParams(args));
    case 'suggest': return retrieval.suggest(buildSuggestParams(args));
    default: {
      const exhaustive: never = args.scope;
      throw new Error(`Unhandled search scope: ${String(exhaustive)}`);
    }
  }
}
```

### Changes to `[formatting.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/formatting.ts)`

- **Remove**: `ScopedSearchData` interface (lines 62-67), `isScopedSearchResult` guard (lines 70-80), `isSuggestionResponse` guard (lines 20-25)
- **Change** `formatSearchResults(scope, result: unknown, query)` to `formatSearchResults(result: SearchDispatchResult, query)`
- **Discriminate** using `'suggestions' in result` (per distilled.md: property check for unions without shared discriminant)
- **Change** `formatScopedResult` to accept `ScopedSearchResult` instead of `ScopedSearchData` -- derive scope from `data.scope`

**Discrimination invariant protection** (type-reviewer recommendation): The `'suggestions' in result` check works today because no `ScopedSearchResult` member has a `suggestions` property. To guard against future drift, add a compile-time assertion in `types.ts`:

```typescript
type AssertNoSuggestions<T> = 'suggestions' extends keyof T ? never : T;
type VerifiedScopedSearchResult = AssertNoSuggestions<ScopedSearchResult>;
```

This produces a compile error if the structural invariant is violated.

### Test Updates

`**[formatting.unit.test.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/formatting.unit.test.ts)`**:

- Remove `scope` parameter from all `formatSearchResults(scope, mockResult, query)` calls
- Simplify mock data: use `results: []` where assertions do not inspect individual results (no test currently inspects result items -- they only check `total`, `content`, and `text`)
- The mock objects with `scope: 'lessons' as const` + `results: []` satisfy `LessonsSearchResult` at compile time

**Specific mocks requiring `results: []` simplification** (type-reviewer finding -- partial index doc objects will not satisfy generated types):

- Line 20: `formats a successful lessons result` -- partial `LessonResult.lesson`
- Line 79: `formats a successful units result` -- partial `UnitResult.unit`
- Line 103: `formats a successful threads result` -- partial `ThreadResult.thread`
- Line 125: `formats a successful sequences result` -- partial `SequenceResult.sequence`

Tests already safe (use `results: []` or complete types): lines 42, 60, 149, 175.

`**[execution.integration.test.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/execution.integration.test.ts)`**:

- No structural changes needed -- `createFakeRetrieval()` already returns properly typed results with `results: []`
- Existing assertions (dispatch correctness, filter passthrough, error handling) continue to pass

### TDD Approach

This is a **refactoring** exercise -- runtime behaviour is unchanged. Type-safety improvements are validated by the **compiler** (`pnpm type-check`), not by runtime tests. Runtime tests remain behavioural: they prove dispatch correctness and formatting output, not type assignability (architecture-reviewer recommendation). The cycle:

1. **Baseline**: verify all existing tests pass
2. **Update test calls**: remove `scope` parameter from `formatSearchResults` calls, simplify mock data -- tests now fail (function signature mismatch)
3. **Refactor types and implementation**: define union, switch dispatch, remove guards -- tests pass
4. **Verify**: `pnpm type-check` (compiler catches any `unknown` regression), grep for removed artefacts, run full quality gates

### Deterministic Validation

```bash
pnpm test --filter @oaknational/curriculum-sdk

rg "isScopedSearchResult|isSuggestionResponse|ScopedSearchData|ScopeDispatcher" \
  packages/sdks/oak-curriculum-sdk/src/
# Expected: NO MATCHES

rg "result: unknown" \
  packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/formatting.ts
# Expected: NO MATCHES
```

## Phase 2: W1 -- Directory Rename (Mechanical)

### Rename

`aggregated-search-sdk/` to `aggregated-search/`

### Constant Renames

- `SEARCH_SDK_SCOPES` to `SEARCH_SCOPES` (in `types.ts`)
- `SEARCH_SDK_TOOL_DEF` to `SEARCH_TOOL_DEF` (in `tool-definition.ts`)
- `SEARCH_SDK_INPUT_SCHEMA` to `SEARCH_INPUT_SCHEMA` (in `tool-definition.ts`)

Function and type names (`SearchSdkArgs`, `SearchSdkScope`, `runSearchSdkTool`, etc.) are **unchanged** -- only the `SEARCH_SDK_`* constants change.

**Naming scope decision** (architecture-reviewer recommendation): The `SearchSdk`* type and function names are intentionally deferred from this rename. A full de-`Sdk` cleanup would touch type exports (`SearchSdkArgs`, `SearchSdkScope`), function exports (`runSearchSdkTool`, `validateSearchSdkArgs`, `isSearchSdkScope`), and all their import sites. That is a separate scope with no compile-time safety benefit -- it is cosmetic naming debt, not type erasure. If desired, it can be done as a follow-up or folded into SDK workspace separation (3e).

### Files to Update

**Internal** (within the directory):

- `types.ts`: rename `SEARCH_SDK_SCOPES`
- `tool-definition.ts`: rename `SEARCH_SDK_TOOL_DEF`, `SEARCH_SDK_INPUT_SCHEMA`, import of `SEARCH_SDK_SCOPES`
- `validation.ts`: import of `SEARCH_SDK_SCOPES`
- `index.ts`: re-export names + TSDoc example

**External** (import path + constant names):

- `[definitions.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts)` (line 21): path + `SEARCH_SDK_TOOL_DEF`, `SEARCH_SDK_INPUT_SCHEMA`
- `[executor.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts)` (line 24): path only
- `[universal-tools.unit.test.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.unit.test.ts)` (line 7): path + `SEARCH_SDK_INPUT_SCHEMA`

### Deterministic Validation

```bash
rg "aggregated-search-sdk" packages/sdks/oak-curriculum-sdk/src/
# Expected: NO MATCHES

rg "SEARCH_SDK_" packages/sdks/oak-curriculum-sdk/src/
# Expected: NO MATCHES
```

## Phase 3: Quality Gates and Review

Full chain from repo root, then specialist reviews:

- `code-reviewer` (gateway)
- `type-reviewer` (B1 type-safety changes)
- `architecture-reviewer-barney` (dispatch boundary simplification)

## Risk Mitigation

- **B1 `SuggestionResponse` lacks `scope` field**: Use `'suggestions' in result` property check rather than discriminant field -- TypeScript narrows correctly. Compile-time `AssertNoSuggestions` guard protects the invariant against future drift.
- **B1 exhaustiveness**: `default: never` guard in switch catches new scopes at compile time with a precise error message.
- **B1 formatting test mocks with partial result objects**: Simplify to `results: []` at lines 20, 79, 103, 125 -- no test asserts on individual result contents.
- **W1 stale imports**: grep validation catches all references before committing.
- **W1 naming debt**: `SearchSdk`* type/function names intentionally deferred -- documented, not forgotten.
