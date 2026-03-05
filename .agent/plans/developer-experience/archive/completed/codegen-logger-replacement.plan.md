---
name: "Replace console.* with Logger across the monorepo"
overview: "Replace all no-console violations across the monorepo with proper logger instances to restore quality gate compliance."
todos:
  - id: phase-0-approach
    content: "Phase 0: Select logger approach and verify console call inventory."
    status: completed
  - id: task-1-0-dependency
    content: "Task 1.0: Add @oaknational/logger devDependency and create shared factory."
    status: completed
  - id: task-1-1-codegen-chain
    content: "Task 1.1: codegen.ts chain (15 calls across 3 files)."
    status: completed
  - id: task-1-2-zodgen-chain
    content: "Task 1.2: zodgen.ts chain (8 calls across 2 files, plus 3 test files)."
    status: completed
  - id: task-1-3-bulkgen-chain
    content: "Task 1.3: bulkgen.ts chain (4 calls across 2 files)."
    status: completed
  - id: task-1-4-standalone
    content: "Task 1.4: Standalone entry points (7 calls across 4 files)."
    status: completed
  - id: task-1-5-vocab-gen
    content: "Task 1.5: vocab-gen (15 calls in 1 file)."
    status: completed
  - id: task-3-1-stdio
    content: "Task 3.1: oak-curriculum-mcp-stdio (8 errors, 3 files)."
    status: completed
  - id: task-3-2-search-cli
    content: "Task 3.2: search-cli (35 errors, 11 files)."
    status: completed
  - id: phase-4-validate
    content: "Phase 4: Full quality gate verification and documentation."
    status: completed
---

# Replace console.\* with Logger across the monorepo

**Last Updated**: 2026-03-03
**Status**: ✅ ALL PHASES COMPLETE
**Scope**: Replace all `no-console` ESLint violations across the monorepo with
proper logger instances. Quality gates currently **fail** on `no-console` errors
in two workspaces.

---

## Current State (after `pnpm lint`)

| Workspace | Errors | Files | Status |
|-----------|--------|-------|--------|
| `@oaknational/sdk-codegen` | 0 | — | ✅ COMPLETE (Phase 1) |
| `@oaknational/oak-curriculum-mcp-stdio` | 0 | — | ✅ COMPLETE (Task 3.1) |
| `@oaknational/search-cli` | 0 | — | ✅ COMPLETE (Task 3.2) |
| All other workspaces | 0 | — | ✅ Clean |

---

## Phase 1: sdk-codegen ✅ COMPLETE

Replaced 49 `console.*` calls across 12 product files + updated 3 test files.

### What was done

1. Added `@oaknational/logger` as `devDependency` in sdk-codegen `package.json`
2. Created `code-generation/create-codegen-logger.ts` — shared factory for 7
   entry points
3. Replaced all console calls in 5 call chains:
   - **codegen.ts chain** (15 calls, 3 files): codegen.ts,
     generate-widget-constants.ts, generate-subject-hierarchy.ts
   - **zodgen.ts chain** (8 calls, 2 files + 3 tests): zodgen.ts,
     zodgen-core.ts, zodgen e2e/unit/integration tests
   - **bulkgen.ts chain** (4 calls, 2 files): bulkgen.ts,
     generate-bulk-schemas.ts
   - **Standalone entry points** (7 calls, 4 files): generate-markdown-docs.ts,
     verify-docs.ts, generate-ai-doc.ts, run-typedoc.ts
   - **vocab-gen** (15 calls, 1 file): run-vocab-gen.ts (inline logger)

### Reviewer findings and fixes applied

**Mid-point code review** (code-reviewer):

- Error objects must be preserved in catch blocks — fixed all catch handlers
  to pass error as 2nd arg to `logger.error(message, error)`
- `result.error` in vocab-gen is a string, not an Error — inlined into
  message instead of passing as error parameter
- `verify-docs.ts` guard function was inconsistent (not passing `err` to
  `logger.error`) — fixed
- `run-typedoc.ts` child process error handler was swallowing errors — added
  `logger.error('typedoc spawn failed', err)`
- Empty-string log messages (`logger.info('')`) wasteful with structured
  logger — cleaned up vocab-gen `printHeader`

**Final code review** (code-reviewer):

- Approved with no blocking issues after mid-point fixes applied
- Noted e2e test logger writes structured JSON to stdout during test runs
  (low priority, acceptable for E2E tests)

**Architecture review** (architecture-reviewer-barney):

- **Critical find**: `zodgen-core.ts` unit and integration tests still passed
  `fakeIO` as 3rd argument after `logger` was inserted as 3rd positional
  parameter — would have caused runtime type mismatch. **Fixed immediately.**
- Dependency direction `libs/logger` → `sdks/sdk-codegen` is acceptable
  (matches workspace rules, dev-only)
- Suggested options object for `generateZodSchemas` to avoid positional
  coupling (deferred — refactoring is separate work in eslint-override-removal
  plan)
- Noted config drift risk between shared factory and vocab-gen inline logger
  (accepted — single file, same configuration, not worth cross-directory
  import)

### Pattern established

- Entry points create loggers via factory or inline
- Callees accept `Logger` via DI parameter
- `Logger.error(message, error?, context?)` — 2nd arg for Error objects only,
  not plain strings
- When inserting a required parameter before an existing optional parameter,
  all callers must be updated (including test files)

---

## Phase 3: Remaining workspaces — IN PROGRESS

### Task 3.1: oak-curriculum-mcp-stdio (8 errors, 3 files) — ✅ COMPLETE

**Workspace**: `apps/oak-curriculum-mcp-stdio/`

#### What was done

1. Replaced all `console.*` calls in `bin/oak-curriculum-mcp.ts`, `src/index.ts`,
   `src/app/file-reporter.ts`, and `src/app/startup.ts` with proper Logger usage.
2. Used existing `createStdioLogger(runtimeConfig)` from `src/logging/index.ts`
   (stderr-only sink, file sink). No new logger factory created.
3. For pre-config early errors (before `RuntimeConfig` is available), used
   `writeStderrLine()` helper writing directly to `process.stderr`.
4. Updated `StartupLoggerDependencies` to accept `Logger` instead of `Console`.
5. Refactored `appendToLogFile` to accept `fs`/`path` via DI
   (`AppendToLogFileDeps` interface with production defaults).

#### Reviewer findings and fixes applied

**Code review** (code-reviewer): Identified issues with error normalisation and
logger instantiation patterns. Fixed.

**Test review** (test-reviewer) — CRITICAL findings:

- `file-reporter.unit.test.ts` used prohibited `vi.mock('node:fs')` (ADR-078).
  Root cause: `appendToLogFile` hard-imported `node:fs`. **Fix**: Refactored
  product code for DI, rewrote as `file-reporter.integration.test.ts`.
- Both test files were misnamed (testing IO integration points, not pure
  functions). **Fix**: Renamed to `*.integration.test.ts`.
- Duplicate test invocations and conditional assertions that silently skipped.
  **Fix**: Single proof per test, unconditional assertions.

**Type review** (type-reviewer) — CRITICAL findings:

- `loggerMock` missing 4 of 6 required `Logger` methods (TS2739). **Fix**:
  `createLoggerMock()` with all 6 methods + `satisfies Logger`.
- `startup.ts` silently dropped non-Error thrown values. **Fix**: Pass `error`
  directly to `logger.error()`.
- `index.ts` lost cause chain in `new Error(String(error))`. **Fix**: Added
  `{ cause: error }`.

All 58 tests pass, zero linter errors.

---

### Task 3.2: search-cli (35 errors, 11 files) — ✅ COMPLETE

**Workspace**: `apps/oak-search-cli/`

#### What was done

Replaced all 35 `no-console` violations across 11 files using two strategies:

1. **CLI user-facing output** → `process.stdout.write`/`process.stderr.write`.
   These are formatting functions and CLI tools where structured logging would
   add unwanted timestamps/JSON to user-facing output. Using raw I/O primitives
   preserves exact behavior while satisfying the `no-console` rule.
2. **Diagnostic/error logging** → existing `ingestLogger` from `src/lib/logger.ts`.
   Where structured logging is appropriate (setup CLI, ingestion CLI), the
   existing child loggers are used.

| File | Violations | Strategy |
|------|-----------|----------|
| `src/cli/shared/output.ts` | 7 | `process.stdout/stderr.write` |
| `src/lib/elasticsearch/setup/cli-output.ts` | 1 | `process.stdout.write` |
| `src/lib/elasticsearch/setup/cli.ts` | 1 | `ingestLogger.error` |
| `src/lib/elasticsearch/setup/ingest-cli-program.ts` | 1 | `process.stderr.write` |
| `src/lib/elasticsearch/setup/ingest.ts` | 1 | `ingestLogger.error` |
| `bin/oaksearch.ts` | 2 | `process.stderr.write` (pre-config) |
| `operations/ingestion/verify-ingestion.ts` | 10 | `process.stdout/stderr.write` |
| `operations/utilities/generate-synonyms.ts` | 1 | `process.stdout.write` |
| `operations/utilities/reset-ttls.ts` | 8 | `process.stdout/stderr.write` |
| `operations/utilities/run-typedoc.ts` | 2 | `process.stdout/stderr.write` |
| `src/lib/logger.ts` | 1 | no-op fallback `() => undefined` |

#### Approach decisions resolved

1. **CLI user-facing output** (output.ts, cli-output.ts): Used
   `process.stdout/stderr.write` — no override needed.
2. **Logger fallback** (logger.ts): Replaced `console.log` with no-op for
   non-Node environments — no override needed.
3. **Operations scripts**: Used `process.stdout/stderr.write` — no override needed.
4. **Entry points** (bin/oaksearch.ts): Used `process.stderr.write` for
   pre-config errors — no override needed.

#### Reviewer findings and fixes applied

**Code review** (code-reviewer) — APPROVED, 4 fixes applied:

- `ingest.ts` catch: Error object was lost (plain object passed as 2nd arg
  to `logger.error` instead of Error). **Fixed**: pass Error directly, context
  as 3rd arg, wrap non-Error with `{ cause: error }`.
- `cli.ts` catch: Non-Error values discarded. **Fixed**: wrap with
  `new Error(String(error), { cause: error })`.
- `run-typedoc.ts` spawn error handler was silent. **Fixed**: write error
  message to stderr.
- `ingest.ts` used `process.exit(1)` in catch (race with file sink flush).
  **Fixed**: use `process.exitCode = 1`.

**Type review** (type-reviewer) — ALL SAFE:

- `logger.ts` `() => undefined` satisfying `StdoutSink.write` — safe.
- All catch block type guards correct.
- Pre-existing Logger interface/implementation `error` param mismatch noted
  (not introduced by this change).

All 970 tests pass, zero lint errors.

---

## Phase 4: Full quality gate verification and documentation — ✅ COMPLETE

All quality gates pass with exit 0:

| Gate | Status |
|------|--------|
| `pnpm sdk-codegen` | ✅ 11 tasks |
| `pnpm build` | ✅ 14 tasks |
| `pnpm type-check` | ✅ 24 tasks |
| `pnpm lint:fix` | ✅ 26 tasks |
| `pnpm format:root` | ✅ |
| `pnpm test` | ✅ 24 tasks |
| `pnpm test:e2e` | ✅ 19 tasks (16 e2e tests) |

**Acceptance Criteria** — all met:

1. ✅ All quality gates pass with exit 0
2. ✅ Zero `no-console` errors in any workspace
3. ✅ This plan's status updated to COMPLETE
4. ✅ `eslint-override-removal.plan.md` updated to note this work is done

---

## Context (Phase 1 — retained for reference)

### What happened

The `no-console` rule was promoted from `'warn'` to `'error'` in the shared
ESLint config (`packages/core/oak-eslint/src/configs/recommended.ts`). Scoped
`no-console: 'off'` overrides were added for genuinely non-product-code
(scripts, smoke tests, CLI entry points, e2e tests, logger fallback).

Initial overrides were incorrectly added for `code-generation/` and
`vocab-gen/` — these are product code that builds the SDK. The user removed
those overrides. The `console.*` calls remained, so lint failed.

### Root cause

**Code that generates code is product code.** The `code-generation/` and
`vocab-gen/` directories build the SDK at `pnpm sdk-codegen` time. They must
meet the same quality standards as any other product code.

### sdk-codegen inventory (Phase 1, COMPLETE)

| Directory | File | Calls | Type breakdown | Role |
|-----------|------|-------|----------------|------|
| `code-generation/` | `codegen.ts` | 13 | 9 log, 4 error | Entry point |
| `code-generation/` | `zodgen.ts` | 5 | 4 log, 1 error | Entry point |
| `code-generation/` | `zodgen-core.ts` | 3 | 3 log | Callee of zodgen.ts |
| `code-generation/` | `bulkgen.ts` | 2 | 2 log | Entry point |
| `code-generation/` | `typegen/bulk/generate-bulk-schemas.ts` | 2 | 2 log | Callee of bulkgen.ts |
| `code-generation/` | `typegen/generate-widget-constants.ts` | 1 | 1 log | Callee of codegen.ts |
| `code-generation/` | `typegen/search/generate-subject-hierarchy.ts` | 1 | 1 log | Callee of codegen.ts |
| `code-generation/` | `generate-markdown-docs.ts` | 1 | 1 error | Entry point (standalone) |
| `code-generation/` | `verify-docs.ts` | 3 | 1 log, 2 error | Entry point (standalone) |
| `code-generation/` | `generate-ai-doc.ts` | 1 | 1 error | Entry point (standalone) |
| `code-generation/` | `run-typedoc.ts` | 2 | 1 log, 1 error | Entry point (standalone) |
| `vocab-gen/` | `run-vocab-gen.ts` | 15 | 13 log, 2 error | Entry point |

### Call chain map (Phase 1)

```
pnpm generate:openapi  →  codegen.ts (13)
                              ├─ generateWidgetConstants()    → generate-widget-constants.ts (1)
                              └─ generateSubjectHierarchy()   → generate-subject-hierarchy.ts (1)

pnpm generate:zod      →  zodgen.ts (5)
                              └─ generateZodSchemas()         → zodgen-core.ts (3)

pnpm generate:bulk     →  bulkgen.ts (2)
                              └─ generateBulkSchemas()        → generate-bulk-schemas.ts (2)

Manual/docs pipeline   →  generate-markdown-docs.ts (1)    [standalone]
                       →  verify-docs.ts (3)                [standalone]
                       →  generate-ai-doc.ts (1)            [standalone]
                       →  run-typedoc.ts (2)                [standalone]

pnpm vocab-gen         →  run-vocab-gen.ts (15)             [all calls local]
```

---

## Solution Architecture

### Principle (from rules.md)

> "Never disable any quality gates."
> "Fix the root cause. Never work around it."

### Strategy

Where the consuming code already has a logger instance, use it — thread it
through to the functions that currently call `console.*`. Where no logger
exists in the call chain (i.e. at genuine entry points), create one from
`@oaknational/logger`.

1. Trace each `console.*` call site back to its caller
2. If the caller already has a logger instance, accept it as a parameter
   and use it
3. If the caller is a top-level entry point with no existing logger, create
   a new `@oaknational/logger` instance there
4. Replace `console.log` → `logger.info`, `console.error` → `logger.error`,
   `console.warn` → `logger.warn`
5. Pass the logger down to callees via parameters (DI)

**Exception**: Some CLI output files (`src/cli/shared/output.ts`,
`src/lib/elasticsearch/setup/cli-output.ts`) may be deliberate user-facing
stdout. These need case-by-case assessment — logger or scoped override.

---

## Testing Strategy

### Unit tests

No new unit tests required for the logger replacement itself — this is a
mechanical substitution. Existing tests for generator functions cover
behavioural correctness. Any tests that call functions with updated signatures
must be updated to pass a logger argument (as happened with `zodgen-core`
unit/integration/e2e tests).

### Integration tests

No new integration tests. The `pnpm sdk-codegen` command is the integration
verification for Phase 1. For Phase 3, `pnpm lint` is the primary verification.

### E2E tests

`pnpm sdk-codegen` run as part of quality gates serves as the E2E verification
for Phase 1. Phase 3 verification is `pnpm lint` + workspace-specific smoke
tests.

---

## Success Criteria

- Zero `no-console` errors across the entire monorepo (`pnpm lint` exit 0)
- `no-console` ESLint rule fully enforced (no overrides for product code;
  overrides only for genuinely justified cases like CLI user-facing output)
- All quality gates pass
- Logger instances reuse caller's logger where available; new instances only
  at genuine entry points (DI, per ADR-078)

---

## Dependencies

**Blocking**: None — this work is itself blocking quality gates.

**Related Plans**:

- [Developer Experience Strictness Convergence](../../active/devx-strictness-convergence.plan.md) — canonical strictness plan
  to remove all ESLint overrides. The structural overrides in `code-generation/`
  and `vocab-gen/` (complexity, max-lines, etc.) are separate work tracked there.

**Prerequisites**:

- `@oaknational/logger` package available (already exists)
- `no-console` promoted to `'error'` in shared config (already done)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Logger import adds circular dependency | Low | Medium | `@oaknational/logger` has no sdk-codegen dependency; verify with `import-x/no-cycle` |
| CI output format changes break downstream | Low | Low | Logger writes to same streams (stdout/stderr). Output changes from plain text to structured JSON — verify CI log readability |
| Test assertions on console output break | Low | Low | Only one test calls a callee directly (`zodgen.e2e.test.ts`). No `vi.spyOn(console)` anywhere. Update the e2e test to pass a logger |
| `zodgen-core.ts` signature change breaks callers | Materialised | Medium | **Caught by Barney review.** Unit and integration tests were passing `fakeIO` as 3rd arg where `logger` was now expected. Fixed in same session. |
| Stdio app logger writes to stdout | Medium | High | Stdio MCP transport uses stdout for JSON-RPC. Logger MUST be configured to write to stderr only. Verify sink config. |
| search-cli CLI output files are deliberate stdout | Medium | Medium | `output.ts` and `cli-output.ts` may be intentional user-facing output. Assess each file before replacing. |

---

## Notes

### Why this matters

**Immediate value**: Restores quality gate compliance. The monorepo cannot
merge with `no-console` errors.

**System-level impact**: Establishes that build-time code generators and
application code use structured logging with full quality standards. Prevents
future console calls from being added without review.

### Alignment with rules.md

> "Never disable any quality gates."
> "All quality gate issues are always blocking."
> "Fix the root cause. Never work around it."

This plan fixes the root cause (unstructured console output in product code)
rather than working around it (adding `no-console: 'off'` overrides).

---

## References

- `packages/sdks/oak-sdk-codegen/code-generation/` — Phase 1 target (COMPLETE)
- `packages/sdks/oak-sdk-codegen/vocab-gen/` — Phase 1 target (COMPLETE)
- `packages/sdks/oak-sdk-codegen/code-generation/create-codegen-logger.ts` — shared factory (created)
- `apps/oak-curriculum-mcp-stdio/` — Phase 3 target (8 errors, 3 files)
- `apps/oak-search-cli/` — Phase 3 target (35 errors, 11 files)
- `packages/libs/logger/` — logger package (`Logger` interface, `UnifiedLogger` class)
- `packages/libs/logger/src/types.ts` — `Logger` interface definition
- `packages/core/oak-eslint/src/configs/recommended.ts` — shared config (`no-console: 'error'`)
- `apps/oak-curriculum-mcp-streamable-http/src/logging/index.ts` — reference logger creation pattern
- `apps/oak-search-cli/src/lib/logger.ts` — reference logger creation pattern with child loggers
- `apps/oak-search-cli/eslint.config.ts` — search-cli ESLint overrides (evaluation, ground-truths, scripts)
- `apps/oak-curriculum-mcp-stdio/eslint.config.ts` — stdio ESLint config (no console overrides)
