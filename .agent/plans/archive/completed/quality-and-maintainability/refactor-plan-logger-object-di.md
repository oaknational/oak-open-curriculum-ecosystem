# Refactor Plan: Logger Types, Object.\* Methods, and Test DI

**Status**: ✅ PHASES 1-4 COMPLETE | ⏳ Phase 5 (Global State DI) DEFERRED
**Created**: 2025-12-14
**Completed**: 2025-12-14 (Phases 1-4)
**Parent Plan**: `.agent/plans/quality-and-maintainability/type-discipline-restoration-plan.md`
**Scope**: Items 1, 2, 3 from type-discipline-restoration remaining work

## Summary of Completed Work

- **Phase 1**: Deleted 3 unused packages (transport, storage, mcp-providers-node), reducing workspace count from 14 to 11
- **Phase 2**: Added `LogContext` type, documented legitimate `WeakSet<object>` and `object` usage in logger
- **Phase 3**: Exported type-safe helpers from SDK, refactored log-levels.ts to use static keys
- **Phase 4**: Documented legitimate `extends object` generic constraints in response augmentation
- **Result**: REFACTOR comments reduced from ~100 to 73 (27% reduction)
- **Phase 5**: Deferred - see `global-state-test-refactoring.md` for the full plan

---

## Pre-Flight: Read Foundation Documents (MANDATORY)

Before ANY work, read and internalize:

```bash
cat .agent/directives/rules.md
cat .agent/directives/testing-strategy.md
cat .agent/directives/schema-first-execution.md
```

**Cardinal Rules**:

> "No type shortcuts - Never use `as`, `any`, `!`, or `Record<string, unknown>`"

> "All quality gate issues are blocking at all times, regardless of location, cause, or context"

> "NEVER create complex mocks" — tests use simple fakes passed as arguments

---

## Pre-Flight: Verify Current State

```bash
cd /Users/jim/code/oak/ai_experiments/oak-notion-mcp
pnpm check:turbo  # Must pass (uses --concurrency=2)
```

**Current workaround in place**: Test configs have `isolate: true` + `pool: 'forks'` to prevent race conditions from global state mutations. Task 2 eliminates the need for this.

---

## Overview

Four related refactoring tasks to eliminate `REFACTOR` comments:

1. **Logger/Transport `object` type** (26 comments) → Define `LogContext` interface
2. **Global state test refactoring** (documented separately) → Dependency injection
3. **Object.\* methods** (~30 comments) → Use SDK type-safe helpers
4. **Response augmentation generics** (2 comments) → Define `AugmentableResponse` constraint

---

## Task 1: Logger/Transport `object` Type

### Problem

The `Logger` interface uses `object` which is too broad:

```typescript
// packages/libs/transport/src/types.ts
export interface Logger {
  trace(message: string, context?: Error | object): void; // object = any non-null object
  // ... 6 methods
}
```

The logger internals use `WeakSet<object>` for circular reference detection:

```typescript
// packages/libs/logger/src/json-sanitisation.ts
interface SanitiserContext {
  readonly seen: WeakSet<object>; // Inherent to circular detection
}
```

### Solution

**Step 1: Define `LogContext` in logger package**

```typescript
// packages/libs/logger/src/types.ts (or log-context.ts)

import type { JsonValue } from './types.js';

/**
 * Structured context data for log entries.
 * All values must be JSON-serialisable.
 */
export interface LogContext {
  readonly [key: string]: JsonValue;
}
```

**Step 2: Update Logger interface in transport**

```typescript
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

**Step 3: Handle `WeakSet<object>` in json-sanitisation**

The `WeakSet<object>` for circular detection is **inherent** to the algorithm—you can't track reference identity without object types. Options:

- **Option A**: Accept the `eslint-disable` with proper documentation (legitimate use)
- **Option B**: Use a `Map` with serialised paths instead (more complex, slower)
- **Option C**: Define a type alias: `type CircularTrackable = { readonly [key: string]: unknown }`

**Recommendation**: Option A with documentation—`WeakSet<object>` is correct here.

### Files to Change

| File                                              | Change                                       |
| ------------------------------------------------- | -------------------------------------------- |
| `packages/libs/logger/src/types.ts`               | Add `LogContext` interface                   |
| `packages/libs/logger/src/index.ts`               | Export `LogContext`                          |
| `packages/libs/transport/src/types.ts`            | Import `LogContext`, replace `object`        |
| `packages/libs/logger/src/json-sanitisation.ts`   | Document `WeakSet<object>` as legitimate     |
| `packages/libs/logger/src/error-normalisation.ts` | Update to use `LogContext` where appropriate |

### Estimated Comments Removed

- Transport: 6 (all)
- Logger json-sanitisation: ~5 (some legitimate `WeakSet<object>` remain)
- Logger error-normalisation: ~3
- **Total: ~14-20 of 26**

---

## Task 2: Global State Test Refactoring

### Problem

98 tests manipulate global state (`process.env`, `vi.doMock`, `vi.stubGlobal`) causing race conditions.

### Solution

Already documented in: `.agent/plans/quality-and-maintainability/global-state-test-refactoring.md`

**Summary**:

1. Refactor product code to accept config as parameters
2. Entry points read `process.env` once, pass config down
3. Tests pass config directly, no global state mutation

### Priority Order

1. Unit tests with `vi.doMock` (2 files)
2. Unit tests with `process.env` mutation (7 files)
3. Integration tests with `process.env` mutation (3 files)
4. E2E tests (lower priority - process isolation helps)

---

## Task 3: Object.\* Methods

### Problem

~30 uses of `Object.keys`, `Object.values`, `Object.entries` widen types to `string[]` or `unknown[]`.

### Solution

SDK already provides type-safe helpers:

```typescript
// packages/sdks/oak-curriculum-sdk/src/types/helpers/type-helpers.ts
export function typeSafeKeys<T extends object>(obj: T): Extract<keyof T, string>[];
export function typeSafeValues<T extends object>(obj: T): T[keyof T][];
export function typeSafeEntries<T extends object>(
  obj: T,
): [Extract<keyof T, string>, T[Extract<keyof T, string>]][];
```

**Pattern**:

```typescript
// BEFORE
const keys = Object.keys(config); // string[]

// AFTER
import { typeSafeKeys } from '@oaknational/oak-curriculum-sdk';
// Or for internal SDK code:
// import { typeSafeKeys } from '../types/helpers/type-helpers.js';

const keys = typeSafeKeys(config); // Extract<keyof typeof config, string>[]
```

**Available helpers** (all in `packages/sdks/oak-curriculum-sdk/src/types/helpers/type-helpers.ts`):

- `typeSafeKeys<T>(obj)` → `Extract<keyof T, string>[]`
- `typeSafeValues<T>(obj)` → `T[keyof T][]`
- `typeSafeEntries<T>(obj)` → `[Extract<keyof T, string>, T[...]][]`
- `typeSafeFromEntries<K, V>(entries)` → `Record<K, V>`

### Files to Update

| File                               | Count | Notes                  |
| ---------------------------------- | ----- | ---------------------- |
| `theme-factory.unit.test.ts`       | 8     | Test file              |
| `suggestions/index.ts`             | 4     | Production code        |
| `suggestions/index.unit.test.ts`   | 3     | Test file              |
| `scope-config.ts`                  | 2     | Production code        |
| `search-index-target.unit.test.ts` | 3     | Test file              |
| `log-levels.ts`                    | 3     | Logger production code |
| `elastic-http.ts`                  | 1     | Production code        |
| `sandbox-harness-ops.ts`           | 1     | Production code        |
| `env.unit.test.ts`                 | 1     | Test file              |
| `zero-hit-api.unit.test.ts`        | 1     | Test file              |
| Other scattered files              | ~5    | Various                |

### Estimated Comments Removed

~30 (all `no-restricted-properties` for Object.\*)

---

## Task 4: Response Augmentation Generic Constraints

### Problem

The response augmentation functions use `object` as a generic constraint:

```typescript
// packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts

// Line 182
export function augmentArrayResponseWithCanonicalUrl<TItem extends object>(
  response: TItem[],
  path: string,
  method: HttpMethod,
): (TItem & { canonicalUrl?: string | null })[] { ... }

// Line 201
export function augmentResponseWithCanonicalUrl<T extends object>(
  response: T,
  path: string,
  method: HttpMethod,
): T & { canonicalUrl?: string | null } { ... }
```

The `extends object` constraint is too broad—it accepts any non-null, non-primitive value.

### Solution

Define an interface that represents the actual contract:

```typescript
// packages/sdks/oak-curriculum-sdk/src/types/response-augmentation.ts

/**
 * Base constraint for responses that can be augmented with canonical URLs.
 *
 * Responses must be non-null objects with string-keyed properties.
 * The augmentation adds a `canonicalUrl` property.
 */
export interface AugmentableResponse {
  readonly [key: string]: unknown;
}
```

Then update the functions:

```typescript
// packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts
import type { AugmentableResponse } from './types/response-augmentation.js';

export function augmentArrayResponseWithCanonicalUrl<TItem extends AugmentableResponse>(
  response: TItem[],
  path: string,
  method: HttpMethod,
): (TItem & { canonicalUrl?: string | null })[] { ... }

export function augmentResponseWithCanonicalUrl<T extends AugmentableResponse>(
  response: T,
  path: string,
  method: HttpMethod,
): T & { canonicalUrl?: string | null } { ... }
```

### Why This Works

1. **Schema-first compatible**: The constraint flows from what the API returns (objects with string keys)
2. **Not `Record<string, unknown>`**: It's an interface with index signature, semantically different
3. **Preserves generic behavior**: `TItem` and `T` still capture the full type
4. **Documents intent**: The interface name explains what's required

### Files to Change

| File                                                                  | Change                              |
| --------------------------------------------------------------------- | ----------------------------------- |
| `packages/sdks/oak-curriculum-sdk/src/types/response-augmentation.ts` | Add `AugmentableResponse` interface |
| `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`       | Update generic constraints          |

### Estimated Comments Removed

2 (both `@typescript-eslint/no-restricted-types` in response-augmentation.ts)

---

## Execution Order

### Phase A: Logger/Transport Types (Task 1)

1. Define `LogContext` in logger package
2. Export from logger package
3. Update transport `Logger` interface
4. Update logger internals where applicable
5. Document legitimate `WeakSet<object>` usage
6. Run quality gates (see below)

### Phase B: Object.\* Methods (Task 3)

1. Update production code files first (5-6 files)
2. Update test files (10+ files)
3. Run quality gates (see below)

### Phase C: Test DI Refactoring (Task 2)

1. Start with highest-impact product code changes
2. Update tests to pass config as parameters
3. Remove test isolation settings from vitest configs:
   - `vitest.config.base.ts` — remove `isolate: true` and `pool: 'forks'`
   - `apps/oak-open-curriculum-semantic-search/vitest.config.ts` — remove same
4. Run quality gates (see below)

### Phase D: Response Augmentation Generics (Task 4)

1. Define `AugmentableResponse` interface in `types/response-augmentation.ts`
2. Update `augmentArrayResponseWithCanonicalUrl` and `augmentResponseWithCanonicalUrl`
3. Remove eslint-disable comments
4. Run quality gates (see below)

---

## Quality Gate Commands

Run after EACH significant change:

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

Or use the combined command (slower but comprehensive):

```bash
pnpm check:turbo  # Runs all gates with --concurrency=2
```

**ALL gates must pass before proceeding.**

---

## Success Criteria

| Task   | Metric                                       | Target                             |
| ------ | -------------------------------------------- | ---------------------------------- |
| Task 1 | `object` type in Logger                      | 0 (except documented `WeakSet`)    |
| Task 2 | `process.env` in unit tests                  | 0                                  |
| Task 3 | `Object.*` REFACTOR comments                 | 0                                  |
| Task 4 | `object` constraint in response augmentation | 0                                  |
| All    | Quality gates                                | ✅ PASS without isolation settings |

---

## Dependencies

- Task 1, Task 3, and Task 4 are independent
- Task 2 depends on Task 1 (logger needs DI-friendly interface first)
- Tasks 1, 3, 4 can be parallelised with care

---

## Notes

- **Don't over-engineer**: Some `object` uses (like `WeakSet<object>`) are legitimate
- **Document exceptions**: If an `eslint-disable` must stay, add comprehensive explanation
- **Test incrementally**: Run quality gates after each file change
- **Follow foundation docs**: All changes must align with rules.md and testing-strategy.md

---

## Related Files

### Foundation Documents

- `.agent/directives/rules.md` — Core rules (TDD, no type shortcuts, quality gates blocking)
- `.agent/directives/testing-strategy.md` — Test types, no complex mocks, DI pattern
- `.agent/directives/schema-first-execution.md` — Schema-first approach

### Plans

- `.agent/plans/quality-and-maintainability/type-discipline-restoration-plan.md` — Parent plan
- `.agent/plans/quality-and-maintainability/global-state-test-refactoring.md` — Detailed Task 2 plan

### Key Source Files

**Logger package**:

- `packages/libs/logger/src/types.ts` — Add `LogContext` here
- `packages/libs/logger/src/json-sanitisation.ts` — 11 REFACTOR comments
- `packages/libs/logger/src/error-normalisation.ts` — 5 REFACTOR comments
- `packages/libs/logger/src/log-levels.ts` — 3 REFACTOR comments

**Transport package**:

- `packages/libs/transport/src/types.ts` — `Logger` interface (6 REFACTOR comments)

**SDK type helpers**:

- `packages/sdks/oak-curriculum-sdk/src/types/helpers/type-helpers.ts` — Type-safe Object.\* alternatives

**Response augmentation**:

- `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts` — 2 REFACTOR comments (generic constraints)
- `packages/sdks/oak-curriculum-sdk/src/types/response-augmentation.ts` — Add `AugmentableResponse` interface here

**Vitest configs** (to update after Task 2):

- `vitest.config.base.ts` — Has `isolate: true`, `pool: 'forks'`
- `apps/oak-open-curriculum-semantic-search/vitest.config.ts` — Same

---

## Troubleshooting

| Issue                           | Fix                                                           |
| ------------------------------- | ------------------------------------------------------------- |
| Tests fail with race conditions | Keep `isolate: true` until Task 2 complete                    |
| `Cannot find module` errors     | Run `pnpm install` then `pnpm build`                          |
| Type errors after changes       | Run `pnpm type-gen` first                                     |
| Turbo cache stale               | Run `pnpm clean`                                              |
| SDK exports not found           | Check `packages/sdks/oak-curriculum-sdk/src/index.ts` exports |
