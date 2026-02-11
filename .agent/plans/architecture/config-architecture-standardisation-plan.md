# Config Architecture Standardisation Plan

**Status**: 📋 READY TO START (Analysis Complete)  
**Priority**: High - Blocks global state elimination work  
**Estimated Effort**: 8-12 hours  
**Created**: 2025-12-16  
**Updated**: 2025-12-17

---

## Guiding Principles

> **"Could it be simpler without compromising quality?"** — First Question

This plan prioritises:

1. **Architectural Excellence** - Build the right foundation once, not twice
2. **Developer Experience** - Consistent patterns reduce cognitive load
3. **Best Practice** - DI-compatible, testable, maintainable code
4. **No Compatibility Layers** - Replace old approaches cleanly, never patch

---

## Related Plans

- **Parent**: [Global State Elimination and Testing Discipline Plan](../quality-and-maintainability/global-state-elimination-and-testing-discipline-plan.md) - This plan unblocks Phase 3 and subsequent phases
- **ADR**: [ADR-078: Dependency Injection for Testability](../../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md)

---

## Foundation Documents (Re-read Before Starting)

- [rules.md](../../directives/rules.md) - No compatibility layers, clean breaks
- [testing-strategy.md](../../directives/testing-strategy.md) - DI for testability
- [schema-first-execution.md](../../directives/schema-first-execution.md) - Generator is source of truth

---

## Analysis: Current State

### Apps Inventory

| App                                   | Config Pattern                      | Zod? | DI-Compatible?                 | Quality           |
| ------------------------------------- | ----------------------------------- | ---- | ------------------------------ | ----------------- |
| `oak-curriculum-mcp-streamable-http`  | `env.ts` + `runtime-config.ts`      | ✅   | ✅ `readEnv(source)`           | **Canonical**     |
| `oak-curriculum-mcp-stdio`            | `runtime-config.ts` only            | ❌   | ✅ `loadRuntimeConfig(source)` | **Good**          |
| `oak-search-cli` | `env.ts` (private `readProcessEnv`) | ✅   | ❌ `env()` reads directly      | **Mixed**         |
| `oak-notion-mcp`                      | `env-utils.ts` + `environment.ts`   | ❌   | ❌ Module-level const          | **Non-compliant** |

### Existing Shared Package: `@oaknational/mcp-env`

**Location**: `packages/libs/env/`

| Export                        | Used By              | Status                 |
| ----------------------------- | -------------------- | ---------------------- |
| `loadRootEnv()`               | 5+ files across apps | ✅ Actively used       |
| `findRepoRoot()`              | `loadRootEnv()`      | ✅ Internal dependency |
| `createAdaptiveEnvironment()` | Only its own tests   | ❌ **DEAD CODE**       |
| `EnvironmentProvider` type    | None                 | ❌ **DEAD CODE**       |

### Common Patterns Across Apps

**Environment Variables Used Everywhere:**

| Variable               | Apps Using | Current Handling              |
| ---------------------- | ---------- | ----------------------------- |
| `LOG_LEVEL`            | All 4      | Each app parses independently |
| `ENABLE_DEBUG_LOGGING` | 3/4        | Each app parses independently |
| `NODE_ENV`             | All 4      | Ad-hoc checks                 |

**Parsing Utilities Duplicated:**

```typescript
// Boolean flag parsing - duplicated in 3 places
function toBooleanFlag(value: string | undefined): boolean {
  return value === 'true';
}

// CSV parsing - duplicated in 2 places
function parseCsv(value: string | undefined): string[] | undefined {
  return value
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
```

---

## Analysis: Problems

### Problem 1: No Shared Config Infrastructure

Each app implements its own:

- Zod schemas for common env vars
- Boolean/number parsing utilities
- Error message formatting
- DI-compatible function signatures

**Impact**: Inconsistency, duplication, maintenance burden, cognitive overhead for developers switching between apps.

### Problem 2: Dead Code in `@oaknational/mcp-env`

`createAdaptiveEnvironment()` (177 lines) is unused by any product code. It was designed for Edge/Browser/Node runtime detection but never adopted.

**Impact**: Maintenance burden, confusion about what the package provides, misleading documentation.

### Problem 3: Inconsistent DI Patterns

Some apps use DI-compatible signatures:

```typescript
// Good - accepts explicit source parameter
function readEnv(source: NodeJS.ProcessEnv): Env;
```

Others don't:

```typescript
// Bad - always reads process.env internally
function env(): Env {
  return parseEnv(readProcessEnv()); // private function reads process.env
}
```

**Impact**: Tests require `vi.doMock` or `process.env` mutations, causing flaky tests and race conditions.

### Problem 4: Module-Level Constants

`oak-notion-mcp/environment.ts` evaluates at import time:

```typescript
export const env: NotionEnvironment = {
  NOTION_API_KEY: getString('NOTION_API_KEY'), // Called at import!
  // ...
};
```

**Impact**: Cannot test without mocking the module itself; test isolation impossible.

---

## Analysis: The Opportunity

### A Unified Config Architecture

**Target State**: Every app follows the same pattern:

```typescript
// apps/*/src/env.ts
import { BaseEnvSchema, createEnvReader } from '@oaknational/mcp-config';
import { z } from 'zod';

const AppEnvSchema = BaseEnvSchema.extend({
  APP_SPECIFIC_VAR: z.string(),
});

export interface Env {
  APP_SPECIFIC_VAR: string;
}

export const readEnv = createEnvReader(AppEnvSchema);
```

**Developer Experience Benefits:**

1. **Consistency** - Same pattern everywhere, zero mental context-switching
2. **Discoverability** - One place to find all config utilities
3. **Testability** - Every config function accepts a source parameter
4. **Type Safety** - Zod schemas provide runtime validation and static types
5. **Error Messages** - Consistent, helpful validation errors across all apps

---

## Options Considered

### Option A: Minimal - Fix `oak-notion-mcp` Only ❌

**Scope**: Create `env.ts` and `runtime-config.ts` in `oak-notion-mcp` only.

**Why Not**:

- Creates the 4th implementation of the same patterns
- Continues duplication across apps
- Dead code in `@oaknational/mcp-env` remains
- "Quick fix now, proper fix later" often means the proper fix never happens

**Verdict**: ❌ Creates technical debt; contradicts architectural principles.

---

### Option B: New Shared Package in `packages/core/` ✅

**Scope**: Create `packages/core/mcp-config/` with shared utilities, then migrate all apps.

**Why This Option**:

1. **Single Source of Truth** - One place for config patterns
2. **Correct Location** - `core/` is for foundational infrastructure
3. **Complete Solution** - Addresses all 4 apps, not just one
4. **Clean Deletion** - Enables removal of dead code and obsolete package

**Verdict**: ✅ **Recommended** - Best practice, architectural excellence.

---

### Option C: Refactor `@oaknational/mcp-env` In Place ❌

**Scope**: Expand `packages/libs/env/` with new functionality, delete dead code.

**Why Not**:

- `libs/` location is wrong for foundational infrastructure
- Package name (`mcp-env`) is too narrow for expanded scope
- Carries baggage of dead code history

**Verdict**: ❌ Wrong location, wrong name.

---

### Option D: Hybrid - Fix One App, Share Later ❌

**Scope**: Two-phase approach with temporary duplication.

**Why Not**:

- "Phase 2" work often gets deprioritised
- Creates temporary duplication that may become permanent
- Two PRs instead of one cohesive change
- Contradicts "no compatibility layers" principle

**Verdict**: ❌ False economy; shortcuts become permanent.

---

## Recommended Approach: Option B

### Rationale

1. **Do it right, do it once** - Proper architecture upfront is faster than fixing twice
2. **Developer experience** - Consistent patterns across all apps from day one
3. **Architectural excellence** - Clean package in correct location
4. **Complete solution** - All apps benefit, all dead code removed

### Estimated Effort Breakdown

| Task                           | Effort    |
| ------------------------------ | --------- |
| Create package structure       | 1 hour    |
| Implement base schemas         | 1 hour    |
| Implement parsing utilities    | 1 hour    |
| Migrate `loadRootEnv`          | 0.5 hours |
| Migrate `oak-notion-mcp`       | 2 hours   |
| Migrate `oak-curriculum-stdio` | 1 hour    |
| Migrate `oak-semantic-search`  | 1.5 hours |
| Migrate `oak-streamable-http`  | 0.5 hours |
| Delete `@oaknational/mcp-env`  | 0.5 hours |
| Quality gates                  | 2 hours   |
| **Total**                      | **11 hours** |

---

## Phase 1: Create Shared Package

### Goal

Create `@oaknational/mcp-config` in `packages/core/` as the single source of truth for configuration patterns.

### Intended Impact

- Foundation for consistent config across all apps
- Elimination of code duplication
- Improved developer experience through standardisation

### Package Structure

```text
packages/core/mcp-config/
├── src/
│   ├── index.ts                    # Public exports
│   ├── schemas/
│   │   ├── base-env.ts             # BaseEnvSchema with LOG_LEVEL, NODE_ENV, etc.
│   │   ├── log-level.ts            # Re-export from @oaknational/mcp-logger
│   │   └── index.ts
│   ├── parsers/
│   │   ├── boolean-flag.ts         # toBooleanFlag()
│   │   ├── boolean-flag.unit.test.ts
│   │   ├── csv-list.ts             # parseCsv()
│   │   ├── csv-list.unit.test.ts
│   │   └── index.ts
│   ├── factories/
│   │   ├── create-env-reader.ts    # Factory for DI-compatible readEnv()
│   │   ├── create-env-reader.unit.test.ts
│   │   └── index.ts
│   ├── repo-root.ts                # Migrated from @oaknational/mcp-env
│   ├── repo-root.unit.test.ts
│   └── load-root-env.ts            # Migrated from @oaknational/mcp-env
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── tsconfig.lint.json
├── tsup.config.ts
├── eslint.config.ts
└── vitest.config.ts
```

### Tasks

#### 1.1 Create Package Scaffold

Create the package with standard monorepo configuration.

**Acceptance Criteria**:

- [ ] Package builds with `pnpm build`
- [ ] Package lints with `pnpm lint`
- [ ] ESLint config extends monorepo base

#### 1.2 Implement Base Env Schema

**File**: `src/schemas/base-env.ts`

```typescript
import { z } from 'zod';

/**
 * Base environment schema with common variables shared across all apps.
 *
 * Apps extend this schema with app-specific variables:
 *
 * @example
 * ```typescript
 * const AppEnvSchema = BaseEnvSchema.extend({
 *   MY_APP_VAR: z.string().min(1),
 * });
 * ```
 */
export const BaseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).optional(),
  ENABLE_DEBUG_LOGGING: z.enum(['true', 'false']).optional(),
});

export interface BaseEnv {
  NODE_ENV?: 'development' | 'production' | 'test';
  LOG_LEVEL?: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  ENABLE_DEBUG_LOGGING?: 'true' | 'false';
}
```

**Acceptance Criteria**:

- [ ] Schema validates common env vars
- [ ] Schema is extendable via `.extend()`
- [ ] Unit tests prove validation behaviour
- [ ] TSDoc with usage example

#### 1.3 Implement `createEnvReader` Factory

**File**: `src/factories/create-env-reader.ts`

```typescript
import type { z } from 'zod';

/**
 * Creates a DI-compatible environment reader function.
 *
 * The returned function validates environment variables against the schema
 * and accepts an explicit source parameter for DI and testing.
 *
 * @example
 * ```typescript
 * const AppEnvSchema = BaseEnvSchema.extend({ API_KEY: z.string() });
 * const readEnv = createEnvReader(AppEnvSchema);
 *
 * // Production: entry point passes process.env once
 * const env = readEnv(process.env);
 *
 * // Testing: reads from explicit source
 * const env = readEnv({ API_KEY: 'test-key' });
 * ```
 */
export function createEnvReader<T extends z.ZodType>(
  schema: T,
): (source: NodeJS.ProcessEnv) => z.infer<T> {
  return (source: NodeJS.ProcessEnv): z.infer<T> => {
    const result = schema.safeParse(source);
    if (!result.success) {
      const messages = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`);
      throw new Error(`Invalid environment configuration:\n  ${messages.join('\n  ')}`);
    }
    return result.data;
  };
}
```

**Acceptance Criteria**:

- [ ] Factory returns DI-compatible function
- [ ] Returned function validates against schema
- [ ] Error messages include field paths
- [ ] Unit tests with various schemas

#### 1.4 Implement Parsing Utilities

**Files**: `src/parsers/*.ts`

```typescript
// boolean-flag.ts
/**
 * Parses a string environment variable as a boolean flag.
 *
 * @param value - The environment variable value
 * @returns true if value is exactly 'true', false otherwise
 */
export function toBooleanFlag(value: string | undefined): boolean {
  return value === 'true';
}

// csv-list.ts
/**
 * Parses a comma-separated environment variable into an array.
 *
 * @param value - The environment variable value
 * @returns Array of trimmed, non-empty strings, or undefined if input is empty
 */
export function parseCsv(value: string | undefined): string[] | undefined {
  if (!value) return undefined;
  const items = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}
```

**Acceptance Criteria**:

- [ ] All utilities are pure functions
- [ ] All utilities have unit tests
- [ ] All utilities have TSDoc

#### 1.5 Migrate `loadRootEnv` and `findRepoRoot`

**Files**: `src/repo-root.ts`, `src/load-root-env.ts`

Copy from `packages/libs/env/src/repo-root.ts`, adapting as needed.

**Acceptance Criteria**:

- [ ] Functions work identically to originals
- [ ] Unit/integration tests pass
- [ ] TSDoc documentation complete

---

## Phase 2: Migrate All Apps

### Goal

Update all 4 apps to use `@oaknational/mcp-config`, eliminating duplication and establishing consistent patterns.

### Intended Impact

- Every app uses the same config pattern
- Zero `vi.doMock` or `process.env` mutations in unit tests
- Developers experience consistency across the codebase

### Tasks

#### 2.1 Migrate `oak-notion-mcp` (Non-compliant → Canonical)

This is the most work as it requires complete refactoring.

**Files to create**:

- `apps/oak-notion-mcp/src/env.ts`
- `apps/oak-notion-mcp/src/runtime-config.ts`

**Files to delete**:

- `apps/oak-notion-mcp/src/config/notion-config/env-utils.ts`
- `apps/oak-notion-mcp/src/config/notion-config/env-utils.unit.test.ts`
- `apps/oak-notion-mcp/src/config/notion-config/environment.ts`

**Files to update**:

- `apps/oak-notion-mcp/src/index.ts` - Load config once, pass to app
- `apps/oak-notion-mcp/src/app/*.ts` - Accept config as parameter
- All unit tests - Remove `vi.doMock`, use DI

**Example `env.ts`**:

```typescript
import { BaseEnvSchema, createEnvReader } from '@oaknational/mcp-config';
import { z } from 'zod';

const NotionEnvSchema = BaseEnvSchema.extend({
  NOTION_API_KEY: z.string().min(1, 'NOTION_API_KEY is required'),
  MAX_SEARCH_RESULTS: z.coerce.number().min(1).max(1000).default(100),
});

export interface Env {
  NOTION_API_KEY: string;
  MAX_SEARCH_RESULTS: number;
}

export const readEnv = createEnvReader(NotionEnvSchema);
```

**Acceptance Criteria**:

- [ ] Uses `@oaknational/mcp-config` for base schema and factory
- [ ] `readEnv()` accepts optional source parameter
- [ ] Legacy config files deleted
- [ ] Zero `vi.doMock` in unit tests
- [ ] All tests pass

#### 2.2 Migrate `oak-curriculum-mcp-stdio` (Good → Canonical)

Already has DI pattern; add Zod and use shared utilities.

**Acceptance Criteria**:

- [ ] Uses `BaseEnvSchema.extend()` for app schema
- [ ] Uses shared parsing utilities
- [ ] All tests pass

#### 2.3 Migrate `oak-search-cli` (Mixed → Canonical)

Has Zod but lacks DI; refactor to accept source parameter.

**Change `env()` to `readEnv(source)`**:

```typescript
// Before
export function env(): EnvResult {
  return parseEnv(readProcessEnv());
}

// After
export const readEnv = createEnvReader(EnvSchema);
```

**Acceptance Criteria**:

- [ ] Uses `createEnvReader()` factory
- [ ] Deletes private `readProcessEnv()` function
- [ ] All consumers updated to use `readEnv()`
- [ ] All tests pass

#### 2.4 Update `oak-curriculum-mcp-streamable-http` (Canonical → Uses Shared)

Already canonical; just import from shared package.

**Acceptance Criteria**:

- [ ] Uses `@oaknational/mcp-config` for shared utilities
- [ ] Local implementations removed
- [ ] All tests pass

---

## Phase 3: Clean Up

### Goal

Remove obsolete code and packages.

### Tasks

#### 3.1 Delete `@oaknational/mcp-env`

**Delete**: `packages/libs/env/` directory entirely

**Update**: All imports across codebase to use `@oaknational/mcp-config`

**Acceptance Criteria**:

- [ ] Package directory deleted
- [ ] No references in any `package.json`
- [ ] No imports in any source files
- [ ] Build passes

#### 3.2 Delete Dead Code from Apps

After migration, verify and delete any remaining local config utilities.

**Acceptance Criteria**:

- [ ] No duplicate `toBooleanFlag` implementations
- [ ] No duplicate `parseCsv` implementations
- [ ] No duplicate Zod schemas for LOG_LEVEL/NODE_ENV

#### 3.3 Quality Gates

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
```

**Acceptance Criteria**:

- [ ] All quality gates pass
- [ ] Zero `vi.doMock` in any unit test across all apps
- [ ] `process.env` access only in entry points

---

## Acceptance Criteria Summary

### Package

- [ ] `packages/core/mcp-config/` exists with full implementation
- [ ] Exports: `BaseEnvSchema`, `createEnvReader`, `toBooleanFlag`, `parseCsv`, `loadRootEnv`, `findRepoRoot`
- [ ] All exports have comprehensive TSDoc
- [ ] All exports have unit tests

### Apps

- [ ] All 4 apps use `@oaknational/mcp-config`
- [ ] All 4 apps follow canonical `env.ts` + `runtime-config.ts` pattern
- [ ] Zero `vi.doMock` in any unit test
- [ ] Zero `process.env` mutations in any unit test

### Cleanup

- [ ] `packages/libs/env/` deleted
- [ ] No duplicate parsing utilities across apps
- [ ] All quality gates pass

---

## Developer Experience Outcomes

After this work completes:

| Before                                    | After                                              |
| ----------------------------------------- | -------------------------------------------------- |
| 4 different config patterns               | 1 consistent pattern                               |
| Duplicated parsing utilities              | Single source in `@oaknational/mcp-config`         |
| `vi.doMock` / `process.env` mutations     | Pure DI via source parameter                       |
| Dead code in `@oaknational/mcp-env`       | Clean, focused package                             |
| Cognitive overhead switching between apps | Familiar pattern everywhere                        |
| Flaky tests from global state             | Deterministic tests with explicit config injection |

---

## Risk Mitigation

| Risk                            | Likelihood | Impact | Mitigation                       |
| ------------------------------- | ---------- | ------ | -------------------------------- |
| Breaking existing functionality | Low        | High   | Run tests after each change      |
| Missing a consumer              | Medium     | Low    | Grep for imports before deletion |
| Zod schema too strict           | Low        | Medium | Start permissive, tighten later  |
| Scope creep                     | Medium     | Medium | Stay focused on config only      |

---

## Decisions Made

1. **Package location**: `packages/core/mcp-config` (not `libs/`)
2. **Package name**: `@oaknational/mcp-config` (broader scope than `mcp-env`)
3. **Logger integration**: Depend on `@oaknational/mcp-logger` for log level parsing (no duplication)
4. **Approach**: Build shared package first, migrate all apps, delete old package (no temporary duplication)

---

## References

- Foundation: `.agent/directives/rules.md`
- Testing: `.agent/directives/testing-strategy.md`
- ADR: `docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md`
- Canonical example: `apps/oak-curriculum-mcp-streamable-http/src/env.ts`
- Canonical example: `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`
