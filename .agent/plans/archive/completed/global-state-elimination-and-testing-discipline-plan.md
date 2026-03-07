# Global State Elimination and Testing Discipline Plan

**Status**: 🔄 IN PROGRESS  
**Priority**: High - Causing flaky test failures in CI + test quality issues  
**Estimated Effort**: 20-24 hours across multiple sessions  
**Created**: 2025-12-16  
**Updated**: 2025-12-22  
**Audit Reference**: [vi-mock-audit-report.md](../../research/vi-mock-audit-report.md)

---

## Progress Summary

| Phase                       | Status       | Notes                                                                                                       |
| --------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------- |
| Phase 0                     | ✅ COMPLETE  | Pre-push reliability improvements                                                                           |
| Phase 1A                    | ✅ COMPLETE  | Unit test quick wins (3 files)                                                                              |
| Phase 2A                    | ✅ COMPLETE  | `vi.stubGlobal` eliminated                                                                                  |
| Phase 2B                    | ✅ COMPLETE  | `vi.doMock` eliminated                                                                                      |
| **Phase 2C**                | 🔄 90% DONE  | `window.matchMedia` DI refactoring (completing quality gates)                                               |
| Phase 3                     | 🔗 DELEGATED | See [Config Architecture Standardisation Plan](../../architecture-and-infrastructure/config-architecture-standardisation-plan.md) |
| Phase 1B                    | ⏳ BLOCKED   | Requires Phase 3                                                                                            |
| Phase 4A-7                  | ⏳ PENDING   | Requires Phase 3                                                                                            |
| **NEW: Testing Discipline** | ⏳ PENDING   | Quick wins available                                                                                        |

### Completed Work (2025-12-16 & 2025-12-17)

**Phase 0: Pre-Push Reliability**

- ✅ Added `export TURBO_CONCURRENCY=4` to `.husky/pre-push`
- ✅ Added `--only` flag to `test:e2e` and `test:e2e:built` to skip dependency re-runs
- ✅ Increased `testTimeout` to 60000ms in `vitest.e2e.config.base.ts`
- ✅ Validated with 3 consecutive successful pre-push runs

**Turbo Dependency Graph Fix (2025-12-17)**

- ✅ Fixed race condition: `lint` and `build` running in parallel caused `ENOENT: tsup.config.bundled_*.mjs` errors
- ✅ Added `build` dependency to `lint`, `lint:fix`, `test:ui`, and smoke tests in `turbo.json`
- ✅ Added `type-gen` dependency to `doc-gen` and `mutate` tasks
- ✅ 8 task definitions corrected - ensures tasks wait for own package's build to complete

**Phase 1A: Unit Test Quick Wins**

- ✅ `fixture-toggle.unit.test.ts` - removed `process.env` mutation
- ✅ `env-utils.unit.test.ts` - removed `process.env` mutation
- ✅ `fixture-mode.unit.test.ts` - removed `process.env` mutation

**Phase 2: Global Mocks**

- ✅ `vi.stubGlobal` eliminated from all unit tests (0 remaining)
- ✅ `vi.doMock` eliminated from all unit tests (0 remaining)
- 🔄 **Phase 2C: `window.matchMedia` DI Refactoring (~90% complete)**
  - ✅ Created `MediaQueryContext` with provider, hook, SSR-safe fallback
  - ✅ Refactored 4 product files to use injected `matchMedia`
  - ✅ Refactored 3 test files to inject mocks via Context
  - ✅ Deleted 3 obsolete mock-match-media files
  - ✅ Fixed type discipline violations (`unknown[]` → `BulkOperations`) in 15+ files
  - ⏳ Completing quality gates (type-check, lint:fix in progress)

**Testing Discipline Audit (2025-12-17)**

- ✅ Comprehensive audit completed - see [vi-mock-audit-report.md](../../research/vi-mock-audit-report.md)
- ✅ Identified ~1000 lines of test code for deletion
- ✅ Categorised 33 files with `vi.mock()` usage

### Current Measurements

```bash
# After Phase 0, 1A, 2A, 2B, 2C (in progress)
vi.stubGlobal in unit tests:     0  (was 2) ✅
vi.doMock in unit tests:         0  (was 2) ✅
process.env in unit tests:      22  (was 25, reduced by 3)
vi.mock in tests:               33  files (20 need refactoring)
window.matchMedia mutations:     0  files (was 5, eliminated via DI) 🔄

# Testing Discipline Violations (from audit)
Type testing instances:       ~700  (toBeDefined, typeof, Array.isArray)
Implementation testing:       ~200  (mock call assertions)
Negative type tests:          ~150  (toBeUndefined for types)
Bug fix verification tests:    ~50  (should be one-time checks)

# Quality Gates Status (Phase 2C)
type-gen:                        ✅  PASSED
build:                           ✅  PASSED
type-check:                      ⏳  3 errors in search-index-target.unit.test.ts
lint:fix:                        ⏳  5 errors in index-oak-helpers.ts
```

---

## Phase 2C: window.matchMedia Global State Mutation (90% COMPLETE)

**Status**: 🔄 IN PROGRESS (completing quality gates)  
**Impact**: Was causing 2 test failures when tests run without process isolation  
**Priority**: Critical work ~90% done  
**Updated**: 2025-12-22

### Problem (RESOLVED)

~~Tests mutate `window.matchMedia` globally via `Object.defineProperty`.~~

**Fix Applied**: Created `MediaQueryContext` provider with DI pattern, refactored all product code and tests.

### Solution Implemented

✅ Created `MediaQueryContext.tsx` with provider, hook, and SSR-safe fallback  
✅ Refactored product code:
- `SearchSecondary.tsx` - now uses `useMediaQuery()` hook
- `theme-utils.ts` - functions accept `matchMedia` parameter with SSR fallback
- `ThemeContext.tsx` - injects `matchMedia` from context
- `Providers.tsx` - wraps app with `MediaQueryProvider`

✅ Refactored tests:
- `SearchPageClient.test-helpers.tsx` - uses `mediaMatches` option to inject mock
- `ThemeSystemPreference.integration.test.tsx` - uses local `MediaQueryAPI` mock
- All tests inject mocks via Context, no global mutations

✅ Deleted obsolete files:
- `mock-match-media.ts`
- `mock-match-media-registries.ts`
- `SearchPageClient.test-helpers.unit.test.tsx`

### Remaining Work

⏳ Fix type errors in `search-index-target.unit.test.ts` (user changed `as any` to `as unknown`, needs proper `BulkOperations` typing)  
⏳ Fix lint errors in `index-oak-helpers.ts` (unsafe assignment + file too long)  
⏳ Complete quality gate suite

See: [test-isolation-architecture-fix.md](../semantic-search/test-isolation-architecture-fix.md) for detailed status

### Affected Files (COMPLETED)

```bash
# Files deleted ✅
apps/oak-search-cli/app/ui/search/mock-match-media.ts
apps/oak-search-cli/app/ui/search/mock-match-media-registries.ts
apps/oak-search-cli/app/ui/search/SearchPageClient.test-helpers.unit.test.tsx

# Product code refactored ✅
apps/oak-search-cli/app/ui/search/layout/SearchSecondary.tsx
apps/oak-search-cli/app/lib/theme/theme-utils.ts
apps/oak-search-cli/app/lib/theme/ThemeContext.tsx
apps/oak-search-cli/app/lib/Providers.tsx

# Test files refactored ✅
apps/oak-search-cli/app/ui/search/SearchPageClient.test-helpers.tsx
apps/oak-search-cli/app/lib/theme/ThemeSystemPreference.integration.test.tsx
apps/oak-search-cli/app/ui/search/SearchPageClient.integration.test.tsx

# New files created ✅
apps/oak-search-cli/app/lib/media-query/MediaQueryContext.tsx
apps/oak-search-cli/app/lib/media-query/MediaQueryContext.test-helpers.tsx
apps/oak-search-cli/app/lib/media-query/MediaQueryContext.unit.test.tsx
```

---

## Critical Notes and Decisions

### SSR Theme Handling
**Decision**: For SSR, either we know what the theme cookie is, or we don't.
- **If no cookie**: Render light theme with no-preference
- **If cookie exists**: Render the correct theme specified in cookie
- **Rationale**: Prevents hydration mismatches, provides consistent experience

### Type Safety Enforcement Limitation
**Issue**: Banned types (`unknown[]`, `Record<string, unknown>`, etc.) need to be banned BOTH as type declarations AND as inline type annotations.

**Current State**: ESLint rule `@typescript-eslint/no-restricted-types` only catches type alias declarations:
```typescript
// ✅ Caught by ESLint
type Foo = unknown[];

// ❌ NOT caught by ESLint
const x: unknown[] = [];
```

**Requirement**: Need custom ESLint rule to catch inline type annotations, OR accept that manual code review is necessary for inline types during quality gates.

**Tracking**: Added to ESLint enhancement backlog

### Test ESLint Rules Allow Banned Types
**Issue**: The `testRules` configuration in `packages/core/oak-eslint/src/index.ts` (lines 90-104) **disables** critical type safety rules for test files:

```typescript
export const testRules = {
  // ...
  '@typescript-eslint/consistent-type-assertions': ['off', ...],  // Allows `as unknown as X`
  '@typescript-eslint/no-restricted-types': 'off',                // Allows `unknown[]`, `Record<string, unknown>`
  // ...
};
```

**Impact**: 
- 141 instances of `as unknown` in test files are not caught by linting
- 75 instances of `: unknown[]` inline annotations are not caught
- Tests can use type-unsafe patterns freely

**Requirement**: After completing DI refactoring (Phase 10), re-enable these rules for test files:
```typescript
'@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
'@typescript-eslint/no-restricted-types': ['error', { /* same as strict config */ }],
```

**Tracking**: Part of Phase 10 (DI refactoring), cannot be done until tests use proper DI instead of type assertions for mocks

### Generated Files Using Banned Types
**Issue**: 26+ generated MCP tool files in `packages/sdks/oak-curriculum-sdk/src/types/generated/` contain `: unknown[]` inline type annotations.

**Source of Truth**: Generator templates in `type-gen/typegen/mcp-tools/`

**Requirement**: Audit generator templates to produce more specific types where possible.

**Tracking**: Future work - requires analysis of what specific types the generators could use instead

---

## Quick Wins Section

**Session time: 2-4 hours for maximum impact**

### Mandatory Session Workflow (do this every time)

- Re-read and re-commit to:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`
- Pick a **small slice** (preferably one file at a time).
- Make the change.
- From repo root, run the **full quality gate suite one gate at a time** (no filters). Do **not** start analysis until all gates complete:

```bash
pnpm type-gen # Makes changes
pnpm build # Makes changes
pnpm type-check
pnpm lint:fix # Makes changes
pnpm format:root # Makes changes
pnpm markdownlint:root # Makes changes
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

### Quick Win 1: Refactor “Mostly Type-Testing” Files (30-60 mins, high impact)

Do **not** delete whole files unless they are genuinely 100% redundant. Prefer **surgical deletion** of type-only assertions while preserving behavioural coverage.

| File                                                                           | Lines | Action |
| ------------------------------------------------------------------------------ | ----- | ------ |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.integration.test.ts` | 239   | REFACTOR |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.unit.test.ts`     | 187   | TRIM (delete type-only blocks, keep content-quality tests) |

**Refactor guide:**

- Remove: `typeof`, `Array.isArray`, and tautological `toBeDefined` where TypeScript already guarantees the shape.
- Keep: assertions that prove specific values / content (e.g. `readOnlyHint === true`, stable names/descriptions, curated guidance content), especially where they encode product requirements.

### Quick Win 2: Correct Over-Broad Block Deletions (45 mins)

The following items were incorrectly classified as “type testing” and should **not** be blanket-deleted:

| File                                      | Lines   | Reason                              |
| ----------------------------------------- | ------- | ----------------------------------- |
| `aggregated-help.unit.test.ts`            | 12-49   | KEEP (value/content assertions)     |
| `aggregated-knowledge-graph.unit.test.ts` | 26-54   | KEEP; delete only the true type-only checks (e.g. lines 50-52 per audit) |
| `universal-tools.unit.test.ts`            | 243-294 | KEEP (value assertions)             |
| `server.unit.test.ts`                     | 166-178 | Delete only the tautological assertion (e.g. line 169 per audit) |
| `oak-logo-svg.unit.test.ts`               | 10-15   | KEEP (design requirement)           |

### Quick Win 3: Remove Mechanical Type-Only Patterns (1-2 hours)

Search and remove these patterns from test files:

```bash
# Find likely type-testing violations
rg "expect\(typeof" --glob "*.test.ts*" -l
rg "expect\(Array\.isArray" --glob "*.test.ts*" -l
rg "\.toBeDefined\(\)" --glob "*.test.ts*" -l  # Review each - some legitimate

# Find likely implementation-testing (review; do NOT blanket-delete)
rg "\.not\.toHaveBeenCalled" --glob "*.test.ts*" -l
```

**Decision guide (strict, but not naive):**

- **DELETE (type-only / tautological):**
  - `expect(typeof x).toBe('string')`
  - `expect(Array.isArray(x)).toBe(true)`
  - `expect(x).toBeDefined()` **when** `x` is not optional in the type (i.e. `T`, not `T | undefined`)
- **KEEP (behaviour):**
  - `expect(x.flag).toBe(true)` when proving a required value, not just that it’s a boolean
  - `expect(x.name).toBe('Search')` / content, curated guidance, stable labels
  - `expect(x).toBeDefined()` when proving an **optional** field is actually populated
- **REVIEW (implementation vs boundary behaviour):**
  - `expect(dep).not.toHaveBeenCalled()` is **usually** implementation testing when `dep` is a global mock.
  - It can be a valid behavioural requirement when `dep` is an **injected dependency** at an integration boundary and the behaviour is explicitly “must not perform side effect X”.

### Quick Win 4: Convert vi.mock to DI (2-3 hours for priority files)

Focus on files with both vi.mock AND mock call assertions - they need DI refactoring.

**Priority files (high violation density):**

| File                                       | Violations | Refactor Strategy              |
| ------------------------------------------ | ---------- | ------------------------------ |
| `check-mcp-client-auth.unit.test.ts`       | 25+        | Accept deps as params          |
| `app/api/search/route.integration.test.ts` | 10+        | Inject search function         |
| `zodgen-core.unit.test.ts`                 | 15+        | Inject file system abstraction |

**Pattern:**

```typescript
// ❌ BEFORE: Global mock + mock call assertions
vi.mock('./dependency', () => ({ fn: vi.fn() }));
// later...
expect(mockFn).toHaveBeenCalledWith(...);  // Implementation testing

// ✅ AFTER: DI + behaviour testing
const result = myFunction({ dependency: mockDep });
expect(result).toEqual(expectedOutput);  // Behaviour testing
```

---

## Intention

Eliminate global state manipulation AND improve test quality to achieve **deterministic, parallel-safe tests** that:

1. Pass reliably regardless of execution order or system load
2. Test behaviour, not implementation
3. Prove useful things about code, not types or syntax
4. Survive refactoring

### Two Related Problems

**Problem 1: Global State (Original focus)**
Tests fail intermittently during `git push` when run in parallel. Root cause: tests mutate shared state (`process.env`, module cache, global objects) causing race conditions.

**Problem 2: Test Quality (New from audit)**
Many tests violate the testing strategy:

- ~700 instances test types (TypeScript's job)
- ~200 instances test implementation (mock call assertions)
- ~50 instances verify bug fixes (should be one-time checks)
- 20 files use global vi.mock (needs DI refactoring)

---

## Testing Strategy Reference

From [testing-strategy.md](../../directives/testing-strategy.md):

> - Line 13: ALWAYS test behaviour, NEVER test implementation
> - Line 19: NEVER create complex mocks
> - Line 20: ALL mocks MUST be simple fakes, passed as arguments
> - Line 23: Always ask what a test is proving - it should prove something useful
> - Line 32: No useless tests - Each test must prove something useful
> - Line 37: No global state manipulation

### What Tests Should NOT Prove

| Category                     | Pattern                               | Why It's Wrong / When It's OK |
| ---------------------------- | ------------------------------------- | ------------------------------ |
| **Type-only (delete)**       | `expect(typeof x).toBe('string')`     | TypeScript already proves the type |
| **Type-only (delete)**       | `expect(Array.isArray(x)).toBe(true)` | TypeScript already proves the array shape |
| **Often type-only (review)** | `expect(x).toBeDefined()`             | Delete when `x` is non-optional; keep when proving an optional field is populated |
| **Often implementation (review)** | `expect(mock).toHaveBeenCalled()` | Usually tests HOW, not WHAT; replace with output/effect assertions where possible |
| **Often implementation (review)** | `expect(mock).not.toHaveBeenCalled()` | Usually tests HOW; keep only when it encodes “must not perform side effect X” at a DI boundary |
| **Bug-fix verification**     | `expect(x).not.toContain('/mcp')`     | One-time manual check; replace with a behaviour spec or delete |
| **Syntax**                   | `expect(x.length).toBeGreaterThan(0)` | Prefer ESLint/static checks unless it encodes a real requirement |

---

## Phases Overview (Updated)

| Phase             | Scope                                    | Effort  | Status       |
| ----------------- | ---------------------------------------- | ------- | ------------ |
| **Phase 0**       | Pre-push reliability quick wins          | 30 mins | ✅ COMPLETE  |
| **Phase 1A**      | Unit test env mutations (easy)           | 1 hour  | ✅ COMPLETE  |
| **Phase 2**       | Remove vi.doMock and vi.stubGlobal       | 2 hours | ✅ COMPLETE  |
| **Phase 3**       | Refactor product code for config DI      | 4 hours | 🔗 DELEGATED |
| **Phase 1B**      | Unit tests depending on Phase 3          | 1 hour  | ⏳ BLOCKED   |
| **Phase 4A**      | Refactor integration tests               | 2 hours | ⏳ PENDING   |
| **Phase 4B**      | Refactor E2E tests                       | 3 hours | ⏳ PENDING   |
| **Phase 5**       | Refactor smoke tests                     | 2 hours | ⏳ PENDING   |
| **Phase 6**       | Documentation and ESLint enforcement     | 2 hours | ⏳ PENDING   |
| **Phase 7**       | Remove isolation workarounds             | 2 hours | ⏳ PENDING   |
| **NEW: Phase 8**  | Testing Discipline - Delete type tests   | 2 hours | ⏳ PENDING   |
| **NEW: Phase 9**  | Testing Discipline - Remove impl testing | 4 hours | ⏳ PENDING   |
| **NEW: Phase 10** | Testing Discipline - DI for vi.mock      | 6 hours | ⏳ PENDING   |

---

## Phase 8: Delete Type-Only Assertions and Tautologies (NEW)

### Intention

Remove assertions that only restate what TypeScript already guarantees. Preserve tests that prove **specific values** and product requirements.

### Files to Refactor / Trim (do NOT delete wholesale)

| File                                                                           | Lines | Strategy |
| ------------------------------------------------------------------------------ | ----- | -------- |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.integration.test.ts` | 239   | Delete only type-only assertions; keep value/content checks |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.unit.test.ts`     | 187   | Delete type-only blocks; keep content-quality / requirement tests |

### Test Blocks to Review (most should be kept)

| File                                      | Lines   | Reason                              |
| ----------------------------------------- | ------- | ----------------------------------- |
| `aggregated-help.unit.test.ts`            | 12-49   | Keep (value/content assertions)     |
| `aggregated-knowledge-graph.unit.test.ts` | 26-54   | Keep; delete only true type-only lines |
| `universal-tools.unit.test.ts`            | 243-294 | Keep (value assertions)             |
| `server.unit.test.ts`                     | 166-178 | Delete only the tautological line(s) |
| `oak-logo-svg.unit.test.ts`               | 10-15   | Keep (design requirement)           |

### Patterns to Remove Globally

```bash
# Find and review each - delete when it only restates types
rg "expect\(typeof" --glob "*.test.ts*"
rg "expect\(Array\.isArray" --glob "*.test.ts*"

# Review toBeDefined - delete when type guarantees existence
rg "\.toBeDefined\(\)" --glob "*.test.ts*"
```

### Acceptance Criteria

```bash
# Zero typeof checks in tests (TypeScript's job)
rg "expect\(typeof" --glob "*.test.ts*" | wc -l
# Expected: 0

# Zero Array.isArray checks in tests (TypeScript's job)
rg "expect\(Array\.isArray" --glob "*.test.ts*" | wc -l
# Expected: 0

# Significant reduction in toBeDefined
rg "\.toBeDefined\(\)" --glob "*.test.ts*" | wc -l
# Target: materially reduced (many are deletable; some are legitimate behaviour assertions)
```

---

## Phase 9: Reduce Implementation Testing (keep only boundary-behaviour assertions) (NEW)

### Intention

Prefer proving outcomes (return values, produced commands/requests, or externally visible effects) over asserting internal call details.

Call assertions are **not automatically forbidden**, but they must be treated as a last resort and only used when they encode an explicit behaviour requirement at an integration boundary with injected dependencies.

### Anti-Patterns to Remove (default)

```typescript
// ❌ Usually implementation testing (especially when mock is global via vi.mock)
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(...);
expect(mockFn).toHaveBeenCalledTimes(n);
expect(mockFn).not.toHaveBeenCalled();
```

### When Call Assertions Are Legitimate (exception)

- Only when the asserted call/no-call represents a **behavioural contract** at a boundary (e.g. “must not perform network IO”, “must not require auth for discovery methods”), and the dependency is **injected** (DI), not globally mocked.
- Prefer asserting on produced data/commands (e.g. “no persistence command emitted”) over call counts.

### Files with Most Violations

| File                                       | Violations | Assessment       |
| ------------------------------------------ | ---------- | ---------------- |
| `check-mcp-client-auth.unit.test.ts`       | 15+        | Refactor for DI  |
| `app/api/search/route.integration.test.ts` | 10+        | Refactor for DI  |
| `fixtures.integration.test.ts`             | 8+         | Review necessity |
| `zodgen-core.unit.test.ts`                 | 10+        | Refactor for DI  |
| `zodgen-core.integration.test.ts`          | 8+         | Refactor for DI  |

### Pattern

```typescript
// ❌ BEFORE: Implementation testing
vi.mock('./logger');
const mockLogger = vi.mocked(logger);
// ...
expect(mockLogger.info).toHaveBeenCalledWith('Starting process');

// ✅ AFTER: Behaviour testing
const result = processData(input, { logger: mockLogger });
expect(result).toEqual({ status: 'success', data: expectedOutput });
// The test proves the function returns correct output, not that it logs
```

### Acceptance Criteria

```bash
# Target: near-zero "not.toHaveBeenCalled" and only where it encodes boundary behaviour with DI
rg "\.not\.toHaveBeenCalled" --glob "*.test.ts*" | wc -l
# Target: small number, each with clear justification in the test

# Significant reduction in mock call assertions (aim for outcomes-first testing)
rg "\.toHaveBeenCalled" --glob "*.test.ts*" | wc -l
# Expected: <50 (from ~200)
```

---

## Phase 10: Convert vi.mock to DI (NEW)

### Intention

Refactor product code and tests to use dependency injection instead of global vi.mock. This is the largest effort but has the highest long-term value.

### Files Needing DI Refactoring (20 files)

#### Priority 1: High Violation Density

| File                                 | Mocked Modules              | Refactor To                    |
| ------------------------------------ | --------------------------- | ------------------------------ |
| `check-mcp-client-auth.unit.test.ts` | 5 modules                   | Accept deps object             |
| `zodgen-core.unit.test.ts`           | node:fs, openapi-zod-client | Inject file system abstraction |
| `zodgen-core.integration.test.ts`    | node:fs, openapi-zod-client | Same                           |

#### Priority 2: Route Handlers

| File                                               | Mocked Modules              | Refactor To                  |
| -------------------------------------------------- | --------------------------- | ---------------------------- |
| `app/api/search/route.integration.test.ts`         | runHybridSearch, logZeroHit | Create route handler factory |
| `app/api/search/nl/route.integration.test.ts`      | parseQuery, llmEnabled, env | Create route handler factory |
| `app/api/search/suggest/route.integration.test.ts` | runSuggestions              | Inject suggestions function  |

#### Priority 3: Infrastructure

| File                                | Mocked Modules            | Refactor To                             |
| ----------------------------------- | ------------------------- | --------------------------------------- |
| `zero-hit-persistence.unit.test.ts` | env, es-client            | Inject ES client                        |
| `suggestions/index.unit.test.ts`    | es-client, logger         | Inject ES client                        |
| `hybrid-search/index.unit.test.ts`  | lessons, units, sequences | Create orchestrator accepting functions |
| `elastic-http.unit.test.ts`         | es-client                 | Inject ES client                        |

### Pattern

```typescript
// ❌ BEFORE: Global mock
vi.mock('./elasticsearch-client', () => ({
  esClient: { search: vi.fn() },
}));

export function searchLessons(query: string) {
  return esClient.search({ index: 'lessons', query });
}

// ✅ AFTER: Dependency injection
export function createSearchService(deps: { esClient: ElasticsearchClient }) {
  return {
    searchLessons: (query: string) => deps.esClient.search({ index: 'lessons', query }),
  };
}

// In test:
const mockClient = { search: vi.fn().mockResolvedValue(fixtureData) };
const service = createSearchService({ esClient: mockClient });
const result = await service.searchLessons('maths');
expect(result).toEqual(fixtureData);
```

### Acceptance Criteria

```bash
# Reduced vi.mock usage (11 compliant E2E files remain)
rg "vi\.mock\(" --glob "*.test.ts*" -l | wc -l
# Expected: ~11 (only Clerk mocks in E2E tests)

# All mocks are DI (passed as arguments)
# Manual verification: Each test file's mocks are injected, not global
```

---

## Next Steps

~~The remaining `vi.doMock` and `process.env` issues in
`oak-notion-mcp` required architectural refactoring.~~ The
`oak-notion-mcp` workspace has been removed entirely (see
Item #4 in the [high-level plan](../high-level-plan.md)).
These issues no longer exist.

Remaining config standardisation work for other apps is
tracked in the [Config Architecture Standardisation Plan](../../architecture-and-infrastructure/config-architecture-standardisation-plan.md).

---

## Architecture Target

### Before: Global State + Implementation Testing

```text
┌──────────────────────────────────────────────────────────────┐
│  Functions read process.env directly                         │
│  Tests use vi.mock and assert on mock calls                 │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ function A  │  │ function B  │  │ function C  │          │
│  │ reads env   │  │ reads env   │  │ reads env   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          ▼                                   │
│                   process.env (SHARED MUTABLE STATE)         │
│                                                              │
│  Tests:                                                      │
│  - vi.mock('./module')                                       │
│  - expect(mockFn).toHaveBeenCalled()  ← IMPLEMENTATION      │
│  - expect(x).toBeDefined()            ← TYPE TESTING        │
└──────────────────────────────────────────────────────────────┘
```

### After: DI + Behaviour Testing

```text
┌──────────────────────────────────────────────────────────────┐
│  Entry Point (index.ts / main.ts)                            │
│  ┌────────────────────────────────────────────────────┐      │
│  │  const config = loadConfigFromEnv();  // ONLY HERE │      │
│  │  const deps = { esClient, logger, ... };           │      │
│  └────────────────────────────────────────────────────┘      │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ function A  │  │ function B  │  │ function C  │          │
│  │ (deps)      │──│ (deps)      │──│ (deps)      │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│                                                              │
│  Tests:                                                      │
│  - const result = fn({ dep: mockDep })                       │
│  - expect(result).toEqual(expected)  ← BEHAVIOUR            │
│  - No mock call assertions           ← NO IMPL TESTING      │
│  - No type assertions                ← TYPESCRIPT PROVES     │
└──────────────────────────────────────────────────────────────┘
```

---

## Baseline Measurements (2025-12-22)

```bash
# Global State (improved from baseline)
process.env in unit tests:            22 instances (was 25)
process.env mutations in E2E tests:   25 instances
process.env mutations in integration:  5 instances
vi.doMock in unit tests:               0 instances (was 2) ✅
vi.stubGlobal in unit tests:           0 instances (was 2) ✅
window.matchMedia mutations:           0 files (was 5, fixed via DI) 🔄

# Testing Discipline (new measurements)
vi.mock in tests:                     33 files (20 need refactoring)
Type testing (toBeDefined):          347 instances
Type testing (typeof):                82 instances
Type testing (Array.isArray):         48 instances
Implementation testing:              ~200 instances
Negative assertions:                 ~385 instances (mixed)
```

---

## Success Metrics

### Hard Requirements (All Must Pass)

| Metric                          | Measurement                                           | Target   |
| ------------------------------- | ----------------------------------------------------- | -------- |
| vi.doMock in unit tests         | `rg "vi\.doMock" --glob "*.unit.test.ts"`             | 0 ✅     |
| vi.stubGlobal in unit tests     | `rg "vi\.stubGlobal" --glob "*.unit.test.ts"`         | 0 ✅     |
| window.matchMedia mutations     | `rg "Object\.defineProperty\(window.*matchMedia"`     | 0 🔄     |
| Unit test env mutations         | `rg "process\.env\." --glob "*.unit.test.ts"`         | 0        |
| E2E test env mutations          | `rg "process\.env\.\w+\s*=" --glob "*.e2e.test.ts"`   | 0        |
| typeof in tests                 | `rg "expect\(typeof" --glob "*.test.ts*"`             | 0        |
| Array.isArray in tests          | `rg "expect\(Array\.isArray" --glob "*.test.ts*"`     | 0        |
| not.toHaveBeenCalled            | `rg "\.not\.toHaveBeenCalled" --glob "*.test.ts*"`    | 0        |
| Tests pass without isolation    | `pnpm test` (with isolate: false)                     | All pass |
| Pre-push succeeds first try     | `git push` (no TURBO_CONCURRENCY)                     | Success  |

### Soft Goals

| Metric                     | Current | Target                    |
| -------------------------- | ------- | ------------------------- |
| Test execution time        | ~150s   | <90s                      |
| toBeDefined instances      | ~347    | <50                       |
| toHaveBeenCalled instances | ~200    | <50                       |
| vi.mock files              | 33      | 11 (only E2E Clerk mocks) |
| ADR exists                 | No      | Yes                       |
| Developer guide exists     | No      | Yes                       |

---

## Dependencies

### Prerequisites

- None - can start immediately with Quick Wins

### Blocking Other Work

- None - this is a quality improvement, not blocking features

### Related Plans

- **Delegates to**: [Config Architecture Standardisation Plan](../../architecture-and-infrastructure/config-architecture-standardisation-plan.md)
- **References**: [vi-mock-audit-report.md](../../research/vi-mock-audit-report.md)
- Supersedes: `global-state-test-refactoring.md` → moved to `archive/`
- Supersedes: `di-architecture-consistency.md` → moved to `archive/`
- Supersedes: `global-state-elimination-plan.md` (this file replaces it)

---

## Risk Mitigation

| Risk                     | Likelihood | Impact | Mitigation                             |
| ------------------------ | ---------- | ------ | -------------------------------------- |
| Breaking test behavior   | Low        | Medium | Run tests after each file change       |
| Missing a mutation       | Medium     | Low    | Grep validation in acceptance criteria |
| Product code API changes | Medium     | Medium | Use explicit config/deps objects at integration points; let compile errors drive safe callsite updates (avoid inventing optional defaults) |
| Time overrun             | Medium     | Low    | Phases are independent, can pause      |
| Deleting useful tests    | Low        | Medium | Review each deletion carefully         |

---

## References

- Foundation: `.agent/directives/principles.md`
- Testing: `.agent/directives/testing-strategy.md`
- Audit: `.agent/research/vi-mock-audit-report.md`
- Original analysis: `.agent/plans/archive/completed/resolve-di-digressions.md`
- Previous fix: `.agent/plans/archive/completed/fix-e2e-test-isolation.md`
