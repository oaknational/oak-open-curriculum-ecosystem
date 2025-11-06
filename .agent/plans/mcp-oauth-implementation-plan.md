<!-- markdownlint-disable -->

# MCP Observability Plan

**Status:** Phase 1 – logging consolidation complete (Tranche 1.5 delivered 2025-11-05, including rescue)  
**Last Reviewed:** 2025-11-05 (post-rescue, all quality gates green)  
**Scope:** `apps/oak-curriculum-mcp-streamable-http`, `apps/oak-curriculum-mcp-stdio`, `packages/libs/logger`

## Purpose

Deliver a single, type-safe logging strategy across the Oak MCP servers so future transport instrumentation (Phase 2) and rollout (Phase 3) build on a stable foundation.

## Snapshot

### Completed Foundations

- [x] Legacy trace system removed (`[TRACE]` literals eliminated, trace modules deleted)
- [x] `@oaknational/mcp-logger` provides adaptive multi-sink logging, JSON sanitisation, and Express middleware
- [x] Shared logger documentation published (`README.md`, migration guidance, `.env` sample)

### Outstanding Focus Areas

- [x] Logger consumers: audit every workspace to ensure browser runtimes import `@oaknational/mcp-logger` and Node runtimes import `@oaknational/mcp-logger/node`; update configs/tests where needed (Tranche 1.2.6)
- [x] Documentation: extend README and wider observability docs with entry-point guidance and migration notes (Tranche 1.2.6)
- [x] HTTP server: finish integration tidy-up once audit confirms imports, then validate logging behaviour and scrub legacy references (Tranche 1.3)
- [x] Stdio server: migrate to shared logger with file-only sink, prove stdout is clean, document configuration (Tranche 1.4)
- [x] Integration: maintain green quality gates after subsequent tranches, update cross-repo documentation, capture results in context files (Tranche 1.5)
- [x] Runtime configuration consolidation for HTTP/stdio servers (complete 2025-11-05)
- [ ] Phase 2 instrumentation design and Phase 3 rollout planning (ready to begin)

## Constraints & Guidance

- Apply TDD (Red → Green → Refactor) for every code change; write tests first.
- **No compatibility layers or type shortcuts** — import shared types directly, remove `as`, `any`, `Record<string, unknown>`, and bespoke wrappers.
- Preserve strict typing: all logged values must flow through validated `JsonValue` helpers.
- Keep code in dedicated boundaries (`src/logging/` for app wiring, shared logic in the package).
- Every exported symbol requires tsdoc suitable for Typedoc.
- Quality gates to remain green: `format → type-check → lint → test → build`.
- **Tree-shakeable architecture** — logger must provide separate entry points to prevent Node.js APIs from reaching browser/edge contexts.
- **Public API only** — all workspace imports MUST use package exports (`@oaknational/mcp-logger`), NEVER deep imports (`@oaknational/mcp-logger/src/...`).

## Critical Architectural Requirements

### Tree-Shakeable Logger Design

The logger package MUST support multiple runtime environments:

1. **Browser/Edge contexts** (HTTP server on Vercel, Semantic Search Next.js app)
   - NO Node.js APIs allowed (no `fs`, `path`, etc.)
   - Stdout-only logging via console
   - Express middleware (types only, no file operations)

2. **Node.js contexts** (Stdio MCP server)
   - File sink support requires Node.js `fs` APIs
   - File-only logging (stdout reserved for MCP protocol)
   - Full multi-sink capabilities

### Solution: Multiple Entry Points

**Main entry point** (`@oaknational/mcp-logger`):

- Browser-safe exports only
- Core logger types and console logging
- Express middleware (no file operations)
- JSON sanitisation, error normalization
- NO Node.js built-in imports

**Node.js entry point** (`@oaknational/mcp-logger/node`):

- Re-exports everything from main entry
- Adds file sink functionality
- Adds multi-sink logger with file support
- Imports Node.js `fs`, `path` modules
- Used ONLY by stdio server

This architecture ensures:

- Next.js can import logger without pulling Node.js APIs into client bundles
- HTTP server gets browser-safe logging
- Stdio server gets full Node.js file capabilities
- Tree-shaking works correctly
- All imports use public package API

## Validation Commands

Each tranche has a specific validation checklist. Commands must be run in the order specified.

### Per-Package Validation Pattern

For individual packages (Tranches 1.3, 1.4):

1. Build (catches compilation errors first)
2. Type-check (validates types)
3. Lint (enforces code standards)
4. Test (unit tests)
5. E2E/Smoke tests (integration validation)

### Full Quality Gate (Tranche 1.5)

Matches `pnpm check` pipeline:

```bash
pnpm format-check:root
pnpm markdownlint-check:root
pnpm build
pnpm type-check
pnpm lint
pnpm doc-gen
pnpm test
pnpm test:e2e
pnpm smoke:dev:stub
pnpm smoke:dev:live
pnpm qg
```

Document all outcomes in context files.

---

## Phase 1 – Logging Consolidation

### Tranche 1.1 – Shared Logger Foundations ✅

All work complete. No further action required.

- [x] Trace code removed and references eliminated
- [x] Base logger functionality confirmed via existing unit tests
- [x] Context files updated to reflect completion

### Tranche 1.2 – Shared Logger Enhancements ✅

Existing implementation covers plan objectives.

- [x] `pure-functions.ts` refactored into semantic modules with re-exports for compatibility
- [x] `express-middleware.ts` implemented with integration tests
- [x] Documentation added to sink configuration and package README
- [x] `.env` sample produced with migration notes

### Tranche 1.2.5 – Logger Package Restructuring ✅ COMPLETE (2025-11-03)

**Goal:** Ship a browser-safe main entry and Node-specific subpath so bundlers can tree-shake `fs` access out of web builds.

#### Delivered Changes

- [x] Added `packages/libs/logger/src/node.ts` with Node-only exports (`MultiSinkLogger`, file sink helpers, sink configs, filesystem types)
- [x] Trimmed `packages/libs/logger/src/index.ts` to browser-safe symbols and added runtime guardrails in `adaptive.ts`
- [x] Updated `package.json` exports to publish `./node` subpath and ship only `dist`
- [x] Switched `tsup.config.ts` to multi-entry build, externalised Node built-ins, enabled tree-shaking, and set neutral target (`es2022`)
- [x] Added `adaptive-node.ts` and integration tests proving browser vs Node entry behaviour
- [x] Refined JSON sanitisation helpers/tests to satisfy lint rules without type loosening

#### Validation Summary

- [x] `pnpm --filter @oaknational/mcp-logger build`
- [x] `pnpm --filter @oaknational/mcp-logger type-check`
- [x] `pnpm --filter @oaknational/mcp-logger lint`
- [x] `pnpm --filter @oaknational/mcp-logger test`
- [x] `grep -E "require.*['\"](fs|node:fs)['\"]" packages/libs/logger/dist/index.js` → **no matches**
- [x] `grep -E "require.*['\"](fs|node:fs)['\"]" packages/libs/logger/dist/node.js` → **fs imports present as expected**
- [x] `pnpm --filter @oaknational/open-curriculum-semantic-search build`
- [x] Full repository gates: `pnpm format-check:root`, `pnpm markdownlint-check:root`, `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm doc-gen`, `pnpm test`, `pnpm test:e2e`, `pnpm smoke:dev:stub`, `pnpm smoke:dev:live`, `pnpm qg`

#### Follow-up Items Rolled Forward

- Communicate entry-point split in README and downstream docs
- Audit every consumer to ensure correct subpath usage (see Tranche 1.2.6)

**State:** All quality gates green; workstream unblocked.

### Tranche 1.2.6 – Logger Consumer Audit & Docs ✅ COMPLETE (2025-11-03)

**Goal:** Ensure every workspace uses the correct logger entry point, refresh documentation, and capture outcomes for future agents.

#### Code & Config Checklist

- [x] Catalogue all imports of `@oaknational/mcp-logger` across the repo, classify runtime (browser/edge vs Node)
- [x] Update browser/edge code to use main entry and avoid file sinks or stdout-disabled configs
- [x] Update Node runtimes (CLI, stdio, background workers) to import from `@oaknational/mcp-logger/node`
- [x] Adjust tests/configs to exercise the new Node entry where applicable

#### Documentation Checklist

- [x] Expand `packages/libs/logger/README.md` with entry-point guidance and migration notes
- [x] Add a short migration summary to affected app/service docs (HTTP, stdio, semantic search)
- [x] Update `.agent/context` files with audit outcomes and remaining follow-up work

#### Validation Checklist

- [x] Spot-check builds/tests for any updated workspace (`pnpm --filter <workspace> lint test build` as appropriate)
- [x] Re-run `pnpm qg` once all import adjustments land
- [x] Document results in the continuation prompt so future agents know the audit is complete

**Exit Criteria:** All consumers aligned to correct entry points, documentation refreshed, quality gates green.

### Tranche 1.3 – HTTP Server Clean-up ✅ COMPLETE (2025-11-03)

**Goal:** Collapse all bespoke HTTP logging code into thin wiring that delegates to `@oaknational/mcp-logger` (browser-safe main entry point only).

**Prerequisite:** Tranche 1.2.6 completes the import audit. HTTP server MUST import from `@oaknational/mcp-logger` (NOT `/node`) since it runs on Vercel edge and must be browser-compatible.

#### Code Checklist

- [x] Remove the locally defined `Logger` interface in `src/logging/index.ts`; import the shared `Logger` from `@oaknational/mcp-logger`
- [x] Replace the wrapper returned by `createLoggerFromEnv` with the shared logger instance (no `error` signature adaptation)
- [x] Delete `src/logging/middleware.ts` and consume `createRequestLogger` / `createErrorLogger` directly from `@oaknational/mcp-logger`
- [x] Ensure request logging only activates when debug level enabled by checking `logger.isLevelEnabled?.('DEBUG')` on the shared logger
- [x] Remove any local re-exports of shared middleware
- [x] Confirm all logging code lives within `src/logging/` and that `index.ts` only wires configuration
- [x] Verify NO imports from `@oaknational/mcp-logger/node` (browser context forbids Node.js APIs)
- [x] Remove file sink configuration code (HTTP server uses stdout only, configured via `createAdaptiveLogger` without file sink)

#### Test Checklist

- [x] Delete `middleware.integration.test.ts` that inspects Express internals
- [x] Create focused unit tests that spy on `app.use` to assert middleware registration without peeking into `app._router`
- [x] Update `logging.unit.test.ts` to assert interactions against the shared logger API
- [x] Maintain coverage for sink configuration (stdout forced `true`, optional file sink respected)

#### Documentation Checklist

- [x] Update application README logging section if interfaces change
- [x] Confirm no references to legacy HTTP variables remain outside historical notes
- [x] Capture outcomes in `.agent/context/context.md` and `.agent/context/continuation.prompt.md`

#### Validation Checklist

Run in order; each must pass before proceeding to next:

- [x] `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build`
- [x] `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check`
- [x] `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint`
- [x] `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`
- [x] `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live`

Note: Build must pass first as it's more fundamental than type-check. Format and markdownlint checks run at repo level in Tranche 1.5. Auth-required smoke remains a manual checklist item (documented in the workspace README).

### Tranche 1.4 – Stdio Server Migration ✅ COMPLETE (2025-11-05, via rescue)

**Goal:** Adopt the shared logger in the stdio server with a guaranteed file-only sink using Node.js-specific entry point.

**Note:** This tranche was completed via the rescue plan (`.agent/plans/rescue-plan-2025-11-05.md`) following a git disaster that left the stdio server in an inconsistent state. The rescue successfully completed the migration.

**Prerequisite:** Tranche 1.2.6 completes the import audit. Stdio server MUST import from `@oaknational/mcp-logger/node` to access file sink functionality. Main entry point lacks file sink support.

#### Code Checklist

- [x] Create `apps/oak-curriculum-mcp-stdio/src/logging/` containing:
  - `config.ts` (processes env, forces file sink using imports from `@oaknational/mcp-logger/node`)
  - `index.ts` (exports `createStdioLogger` and a default `logger`, imports from `@oaknational/mcp-logger/node`)
  - `logging.unit.test.ts`
- [x] Replace bespoke logger in `app/wiring.ts` with shared logger from `@oaknational/mcp-logger/node`
- [x] Ensure stdout is never used; pipe logs to file sink only (file sink only available via `/node` entry)
- [x] Delete redundant logging helpers once shared logger is in place
- [x] Import `parseSinkConfigFromEnv`, `DEFAULT_STDIO_SINK_CONFIG`, `FileSinkConfig` from `@oaknational/mcp-logger/node`
- [x] Verify NO direct imports from `@oaknational/mcp-logger` for sink config (use `/node` subpath)

#### Test Checklist

- [x] Add tests covering sink configuration (default path, custom path, append flag)
- [x] Add tests verifying stdout remains unused (spy on `process.stdout.write`)
- [x] Update existing wiring tests to assert shared logger integration

#### Documentation Checklist

- [x] Update stdio README with logging configuration, including mandatory file sink guidance
- [x] Provide `.env.example` values for stdio logging
- [x] Capture migration notes in context documents

#### Validation Checklist

Run in order; each must pass before proceeding to next:

- [x] `pnpm --filter @oaknational/oak-curriculum-mcp-stdio build`
- [x] `pnpm --filter @oaknational/oak-curriculum-mcp-stdio type-check`
- [x] `pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint`
- [x] `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test`
- [x] `pnpm --filter @oaknational/oak-curriculum-mcp-stdio test:e2e`
- [x] Manual verification: run stdio server and confirm no stdout logs; verify log file written

Note: Build must pass first as it's more fundamental than type-check. Format and markdownlint checks run at repo level in Tranche 1.5.

### Tranche 1.5 – Integration & Quality Gates ✅ COMPLETE (2025-11-04)

**Goal:** Prove the consolidated logging solution and update shared documentation.

#### Quality Gates Checklist

Run in order; each must pass before proceeding to next:

- [x] `pnpm format-check:root`
- [x] `pnpm markdownlint-check:root`
- [x] `pnpm build`
- [x] `pnpm type-check`
- [x] `pnpm lint`
- [x] `pnpm doc-gen`
- [x] `pnpm test`
- [x] `pnpm test:e2e`
- [x] `pnpm smoke:dev:stub`
- [x] `pnpm smoke:dev:live`
- [x] `pnpm qg` (runs all of the above in one command)

Note: This is the full quality gate pipeline matching `pnpm check`. Auth smoke (`smoke:dev:live:auth`) is manual-only and documented separately.

#### Documentation & Context Checklist

- [x] Update root `README.md` to reference `@oaknational/mcp-logger`
- [x] Update architecture documentation with the consolidated logging design
- [x] Record gate results in `.agent/context/context.md`
- [x] Refresh `.agent/context/continuation.prompt.md` with latest state
- [x] Note completion in this plan (Phase 1 section)

---

## Transition Workstream – Runtime Config Consolidation ✅ COMPLETE (2025-11-05)

### Objective

Centralise all environment access behind explicit modules so application code and tests consume injected configuration instead of mutating `process.env`.

### Scope

- `apps/oak-curriculum-mcp-streamable-http`
- `apps/oak-curriculum-mcp-stdio`
- Shared test utilities touching MCP server configuration

### Deliverables

- [x] HTTP server exports a single `runtime-config` module that owns parsing and validation of environment variables (`src/runtime-config.ts` + `applyRuntimeEnvironment` hook)
- [x] Stdio server mirrors the pattern with its own runtime config module (`src/runtime-config.ts`, updated wiring/logger/stub resolvers)
- [x] All application entry points accept configuration objects (via DI) rather than reading `process.env`
  - HTTP `createApp`/handlers and stdio `createServer` now inject `RuntimeConfig`
- [x] Tests construct configuration via helpers/mocks without mutating global env state
  - HTTP and stdio unit/integration suites now build configs via helpers
  - E2E/smoke flows use sanctioned env configuration patterns
- [x] Documentation updated to describe the configuration injection boundary and how to mock it in tests

### Completion Notes (2025-11-05)

- Added `applyRuntimeEnvironment` to centralise Clerk-required env writes when bootstrapping the HTTP transport.
- Introduced stdio `RuntimeConfig` with derived `logLevel`/`useStubTools`, cascading through logging, wiring, and stub executor resolution.
- Updated unit tests across both transports to consume helpers instead of mutating `process.env`, eliminating intermittent Vitest pollution.
- Refactored HTTP server handlers to accept `RuntimeConfig` and `Logger` via dependency injection.
- Completed during rescue operations following git disaster (see `.agent/plans/rescue-plan-2025-11-05.md`).

### Validation Results

- [x] Repo-wide `pnpm qg` ✅ (all 438+ tests passing)
- [x] HTTP server: 45 e2e tests passing with injected config
- [x] Stdio server: 12 e2e tests passing with injected config
- [x] Zero `process.env` mutations in production code outside sanctioned config modules

---

## Phase 2 – Transport Instrumentation (Ready to Begin)

Focus on structured transport logs to diagnose production timeouts and errors, leveraging the consolidated logging infrastructure from Phase 1.

**Goal**: Add correlation IDs, timing metrics, and enriched error contexts to both HTTP and stdio servers to enable production debugging and performance analysis.

**Prerequisites**: ✅ Phase 1 complete, all quality gates green

---

### Session 2.1 – HTTP Server Correlation IDs

**Duration Estimate**: 4-6 hours  
**Complexity**: Medium  
**Risk**: Low (isolated to HTTP server, no protocol changes)

#### Objectives

Implement request correlation IDs in the HTTP server to enable request tracing across the system.

#### Tasks

**Task 2.1.1 – Create Correlation ID Module**

- [ ] Create `apps/oak-curriculum-mcp-streamable-http/src/correlation/index.ts`
- [ ] Implement `generateCorrelationId(): string` function
  - Use format: `req_{timestamp}_{randomHex}` (e.g., `req_1699123456789_a3f2c9`)
  - Ensure collision resistance (timestamp + 6-char random hex)
  - Add TSDoc documentation
- [ ] Export `CorrelationContext` type with `correlationId` property
- [ ] Write unit tests verifying ID format and uniqueness
  - Test: generates IDs with correct format
  - Test: generates unique IDs across multiple calls
  - Test: IDs are URL-safe (no special characters)

**Acceptance Criteria**:

- Module exports `generateCorrelationId()` function
- Function returns IDs matching pattern `/^req_\d+_[a-f0-9]{6}$/`
- Unit tests pass with >95% coverage
- TSDoc complete and accurate

**Validation Steps**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
# Should see correlation/index.unit.test.ts passing
```

---

**Task 2.1.2 – Add Correlation Middleware**

- [ ] Create `apps/oak-curriculum-mcp-streamable-http/src/correlation/middleware.ts`
- [ ] Implement Express middleware that:
  - Generates correlation ID for each request
  - Checks for `X-Correlation-ID` header (reuse if present)
  - Stores ID in `req.correlationId` property
  - Adds `X-Correlation-ID` to response headers
  - Logs request start with correlation ID
- [ ] Extend Express Request type to include `correlationId?: string`
- [ ] Write integration tests:
  - Test: middleware generates ID when header absent
  - Test: middleware reuses ID when header present
  - Test: response includes X-Correlation-ID header
  - Test: concurrent requests get different IDs

**Acceptance Criteria**:

- Middleware function exported and typed correctly
- All requests get correlation IDs
- IDs propagate to response headers
- Type augmentation works without errors
- Integration tests pass

**Validation Steps**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
# Should see correlation/middleware.integration.test.ts passing
```

---

**Task 2.1.3 – Integrate Correlation with Logger**

- [ ] Update `apps/oak-curriculum-mcp-streamable-http/src/logging/index.ts`
- [ ] Modify logger creation to accept optional `correlationId` parameter
- [ ] Add correlation ID to all log metadata when present
- [ ] Update request/error logging middleware to include correlation ID
- [ ] Write integration tests:
  - Test: logs include correlationId field when set
  - Test: all logs for a request share same correlation ID
  - Test: logs without correlation context don't error

**Acceptance Criteria**:

- Logger accepts correlation ID in context
- All logs for a request contain matching correlation ID
- Log format includes `correlationId` field
- No breaking changes to existing logging
- Integration tests validate correlation in logs

**Validation Steps**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
# Check test output for log entries with correlationId
```

---

**Task 2.1.4 – Update Handlers to Use Correlation**

- [ ] Update `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`
- [ ] Extract correlation ID from request in `createMcpHandler`
- [ ] Pass correlation ID to logger calls
- [ ] Ensure correlation ID flows through SDK calls
- [ ] Write e2e tests:
  - Test: MCP tool call logs include correlation ID
  - Test: error responses include correlation ID
  - Test: validation failures log with correlation ID

**Acceptance Criteria**:

- All handler logs include correlation ID
- SDK operations inherit correlation ID
- Error scenarios maintain correlation ID
- E2E tests verify end-to-end correlation

**Validation Steps**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
# All tests pass, e2e logs show correlation IDs
```

---

**Task 2.1.5 – Update Documentation**

- [ ] Update `apps/oak-curriculum-mcp-streamable-http/README.md` with correlation ID docs
- [ ] Document X-Correlation-ID header usage
- [ ] Add examples of using correlation IDs for debugging
- [ ] Update TESTING.md with correlation ID test patterns
- [ ] Run markdownlint

**Acceptance Criteria**:

- README documents correlation ID feature
- Examples show header usage and log filtering
- TESTING.md shows how to test correlation
- Markdown lint passes

**Validation Steps**:

```bash
pnpm markdownlint-check:root
```

---

#### Session 2.1 Definition of Done

**Required**:

- [x] All tasks (2.1.1 through 2.1.5) complete
- [x] Correlation module created and tested
- [x] Middleware generates and propagates IDs
- [x] Logger includes correlation IDs in all entries
- [x] Handlers use correlation throughout request lifecycle
- [x] Documentation updated with examples
- [x] All quality gates pass:
  ```bash
  pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build
  pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check
  pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
  pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
  pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
  pnpm markdownlint-check:root
  ```
- [x] Manual verification:
  - Start HTTP server locally
  - Make request without X-Correlation-ID header → logs show generated ID
  - Make request with X-Correlation-ID: test-123 → logs show test-123
  - All log entries for one request show same correlation ID
- [x] Code committed with message: "feat(http): add request correlation IDs"

**Optional** (if time permits):

- [ ] Add correlation ID to error response payloads
- [ ] Add correlation metrics (IDs per minute, reused IDs)
- [ ] Add correlation ID visualization in smoke tests

---

### Session 2.2 – Stdio Server Correlation IDs

**Duration Estimate**: 3-5 hours  
**Complexity**: Medium  
**Risk**: Low (similar to HTTP, isolated changes)

#### Objectives

Implement request correlation IDs in the stdio server to enable request tracing in local development.

#### Tasks

**Task 2.2.1 – Create Correlation ID Module**

- [ ] Create `apps/oak-curriculum-mcp-stdio/src/correlation/index.ts`
- [ ] Implement `generateCorrelationId(): string` function (same format as HTTP)
- [ ] Export `CorrelationContext` type
- [ ] Write unit tests verifying ID format and uniqueness

**Acceptance Criteria**:

- Module matches HTTP server pattern
- Function returns IDs matching pattern `/^req_\d+_[a-f0-9]{6}$/`
- Unit tests pass with >95% coverage
- TSDoc complete

**Validation Steps**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-stdio type-check
pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test
```

---

**Task 2.2.2 – Integrate Correlation in Server**

- [ ] Update `apps/oak-curriculum-mcp-stdio/src/app/server.ts`
- [ ] Generate correlation ID for each incoming MCP request
- [ ] Store in request context/metadata
- [ ] Pass to logger for all operations in request scope
- [ ] Write integration tests:
  - Test: each request gets unique correlation ID
  - Test: correlation ID included in file logs
  - Test: concurrent requests have different IDs

**Acceptance Criteria**:

- Correlation ID generated per request
- ID available throughout request lifecycle
- File logs include correlationId field
- Integration tests verify correlation

**Validation Steps**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-stdio type-check
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test
```

---

**Task 2.2.3 – Update Tool Handlers**

- [ ] Update `apps/oak-curriculum-mcp-stdio/src/app/tool-response-handlers.ts`
- [ ] Pass correlation ID through tool execution
- [ ] Ensure SDK calls inherit correlation ID
- [ ] Write e2e tests:
  - Test: tool execution logs include correlation ID
  - Test: validation errors log with correlation ID
  - Test: all logs for one tool call share same ID

**Acceptance Criteria**:

- Tool handlers log with correlation ID
- SDK operations inherit correlation ID
- Error scenarios maintain correlation ID
- E2E tests verify end-to-end correlation

**Validation Steps**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-stdio type-check
pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test:e2e
```

---

**Task 2.2.4 – Update Documentation**

- [ ] Update `apps/oak-curriculum-mcp-stdio/README.md` with correlation ID docs
- [ ] Document how to filter logs by correlation ID
- [ ] Add debugging examples using correlation IDs
- [ ] Run markdownlint

**Acceptance Criteria**:

- README documents correlation feature
- Examples show log filtering by correlation ID
- Markdown lint passes

**Validation Steps**:

```bash
pnpm markdownlint-check:root
```

---

#### Session 2.2 Definition of Done

**Required**:

- [x] All tasks (2.2.1 through 2.2.4) complete
- [x] Correlation module created and tested
- [x] Server generates and propagates IDs
- [x] Logger includes correlation IDs in file logs
- [x] Tool handlers use correlation throughout execution
- [x] Documentation updated with examples
- [x] All quality gates pass:
  ```bash
  pnpm --filter @oaknational/oak-curriculum-mcp-stdio build
  pnpm --filter @oaknational/oak-curriculum-mcp-stdio type-check
  pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint
  pnpm --filter @oaknational/oak-curriculum-mcp-stdio test
  pnpm --filter @oaknational/oak-curriculum-mcp-stdio test:e2e
  ```
- [x] Manual verification:
  - Run stdio server with MCP Inspector
  - Execute tool call → check `.logs/oak-curriculum-mcp/server.log`
  - Verify all log entries for one request share same correlation ID
  - Execute multiple tool calls → verify different correlation IDs
- [x] Code committed with message: "feat(stdio): add request correlation IDs"

---

### Session 2.3 – Request Timing Instrumentation

**Duration Estimate**: 4-6 hours  
**Complexity**: Medium  
**Risk**: Low (additive changes, no breaking changes)

#### Objectives

Add request timing metrics to both HTTP and stdio servers to identify slow requests and timeouts.

#### Tasks

**Task 2.3.1 – Create Timing Utilities**

- [ ] Create `packages/libs/logger/src/timing.ts`
- [ ] Implement `startTimer(): Timer` function that returns:
  - `elapsed(): number` - milliseconds since start
  - `end(): Duration` - final duration with formatted string
- [ ] Export `Duration` type with `ms: number` and `formatted: string`
- [ ] Write unit tests:
  - Test: timer tracks elapsed time accurately
  - Test: duration format matches "123ms" or "1.23s"
  - Test: end() returns final duration

**Acceptance Criteria**:

- Timing utilities exported from logger package
- Timer works with sub-millisecond precision
- Duration formatting is human-readable
- Unit tests pass

**Validation Steps**:

```bash
pnpm --filter @oaknational/mcp-logger type-check
pnpm --filter @oaknational/mcp-logger lint
pnpm --filter @oaknational/mcp-logger test
```

---

**Task 2.3.2 – Add Timing to HTTP Server**

- [ ] Update HTTP correlation middleware to start timer
- [ ] Log request duration on response finish
- [ ] Log slow request warnings (>2s)
- [ ] Add timing to error logs
- [ ] Write integration tests:
  - Test: normal requests log duration
  - Test: slow requests log warning
  - Test: errors include timing

**Acceptance Criteria**:

- All HTTP requests log duration
- Slow requests (>2s) log warnings
- Timing included in all request logs
- Integration tests verify timing

**Validation Steps**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
```

---

**Task 2.3.3 – Add Timing to Stdio Server**

- [ ] Update stdio server to start timer on request
- [ ] Log request duration on response
- [ ] Log slow request warnings (>5s)
- [ ] Add timing to error logs
- [ ] Write integration tests:
  - Test: tool calls log duration
  - Test: slow operations log warning
  - Test: errors include timing

**Acceptance Criteria**:

- All stdio requests log duration
- Slow operations (>5s) log warnings
- Timing included in all operation logs
- Integration tests verify timing

**Validation Steps**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test:e2e
```

---

**Task 2.3.4 – Update Documentation**

- [ ] Document timing feature in logger README
- [ ] Add timing examples to HTTP server README
- [ ] Add timing examples to stdio server README
- [ ] Document slow request thresholds

**Acceptance Criteria**:

- Documentation explains timing feature
- Examples show how to use timing utilities
- Thresholds are documented

**Validation Steps**:

```bash
pnpm markdownlint-check:root
```

---

#### Session 2.3 Definition of Done

**Required**:

- [x] All tasks (2.3.1 through 2.3.4) complete
- [x] Timing utilities in logger package
- [x] HTTP server logs request durations
- [x] Stdio server logs operation durations
- [x] Slow request warnings implemented
- [x] Documentation updated
- [x] All quality gates pass:
  ```bash
  pnpm build
  pnpm type-check
  pnpm lint
  pnpm test
  pnpm test:e2e
  ```
- [x] Manual verification:
  - HTTP: Make fast request → see duration ~50ms
  - HTTP: Make slow request → see warning with duration
  - Stdio: Execute tool → see duration in file log
- [x] Code committed with message: "feat: add request timing instrumentation"

---

### Session 2.4 – Error Context Enrichment

**Duration Estimate**: 3-5 hours  
**Complexity**: Medium  
**Risk**: Low (enhances existing error handling)

#### Objectives

Enrich error logs with correlation IDs, timing, and additional context to improve debugging.

#### Tasks

**Task 2.4.1 – Create Error Context Module**

- [ ] Create `packages/libs/logger/src/error-context.ts`
- [ ] Implement `enrichError(error, context)` function that:
  - Adds correlation ID to error
  - Adds timing information
  - Adds request context (method, path, etc.)
  - Preserves original error stack
- [ ] Write unit tests for error enrichment

**Acceptance Criteria**:

- Error enrichment preserves original error
- Context data attached to error object
- Stack trace maintained
- Unit tests pass

**Validation Steps**:

```bash
pnpm --filter @oaknational/mcp-logger test
```

---

**Task 2.4.2 – Update HTTP Error Handling**

- [ ] Update error middleware to use enrichError
- [ ] Log enriched errors with full context
- [ ] Ensure correlation ID in error responses
- [ ] Write integration tests for error scenarios

**Acceptance Criteria**:

- All errors logged with full context
- Error logs include correlation ID + timing
- Error responses maintain correlation ID
- Tests verify enriched error logging

**Validation Steps**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
```

---

**Task 2.4.3 – Update Stdio Error Handling**

- [ ] Update error handlers to use enrichError
- [ ] Log enriched errors to file
- [ ] Ensure correlation ID in error responses
- [ ] Write integration tests for error scenarios

**Acceptance Criteria**:

- All errors logged with full context
- File logs include correlation ID + timing
- Error responses maintain correlation ID
- Tests verify enriched error logging

**Validation Steps**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test:e2e
```

---

**Task 2.4.4 – Documentation**

- [ ] Document error enrichment in logger README
- [ ] Add debugging guide using enriched errors
- [ ] Update server READMEs with error examples

**Acceptance Criteria**:

- Error enrichment documented
- Debugging guide complete
- Markdown lint passes

**Validation Steps**:

```bash
pnpm markdownlint-check:root
```

---

#### Session 2.4 Definition of Done

**Required**:

- [x] All tasks (2.4.1 through 2.4.4) complete
- [x] Error context module in logger package
- [x] HTTP errors enriched with context
- [x] Stdio errors enriched with context
- [x] Documentation updated
- [x] All quality gates pass
- [x] Manual verification:
  - HTTP: Trigger error → log shows correlation ID + timing
  - Stdio: Trigger error → file log shows full context
- [x] Code committed with message: "feat: enrich error context with correlation and timing"

---

### Session 2.5 – Phase 2 Integration & Validation

**Duration Estimate**: 2-4 hours  
**Complexity**: Low  
**Risk**: Low (validation only, no new features)

#### Objectives

Validate complete Phase 2 implementation across all servers and update all documentation.

#### Tasks

**Task 2.5.1 – Full Quality Gate Sweep**

- [ ] Run complete quality gate suite:
  ```bash
  pnpm format-check:root
  pnpm markdownlint-check:root
  pnpm build
  pnpm type-check
  pnpm lint
  pnpm doc-gen
  pnpm test
  pnpm test:e2e
  pnpm smoke:dev:stub
  pnpm smoke:dev:live
  pnpm qg
  ```
- [ ] Fix any issues that arise
- [ ] Document quality gate results

**Acceptance Criteria**:

- All quality gates pass
- No regressions from Phase 1
- Test count maintained or increased

**Validation Steps**: Commands above must all pass

---

**Task 2.5.2 – End-to-End Validation**

- [ ] HTTP server:
  - Start server with debug logging
  - Make multiple requests with/without correlation IDs
  - Verify all logs include correlation + timing
  - Trigger errors and verify enriched context
- [ ] Stdio server:
  - Run server with MCP Inspector
  - Execute multiple tool calls
  - Verify file logs include correlation + timing
  - Trigger errors and verify enriched context
- [ ] Document validation results

**Acceptance Criteria**:

- Manual testing confirms all features working
- Correlation IDs work end-to-end
- Timing appears in all logs
- Errors are properly enriched
- Documentation captures evidence

**Validation Steps**: Manual testing checklist above

---

**Task 2.5.3 – Documentation Finalization**

- [ ] Update `.agent/context/context.md`:
  - Mark Phase 2 complete
  - Update quality gate status
  - Document Phase 2 deliverables
- [ ] Update `.agent/context/continuation_prompt.md`:
  - Add Phase 2 to historical record
  - Document architectural decisions
  - Update patterns and examples
- [ ] Update `.agent/context/HANDOFF.md`:
  - Update phase progress
  - Add Phase 2 deliverables
  - Update architecture diagrams if needed
- [ ] Update main plan document:
  - Mark all Phase 2 sessions complete
  - Add completion dates
  - Record validation results

**Acceptance Criteria**:

- All documentation updated
- Historical record complete
- Phase 2 marked as delivered
- Next phase (Phase 3) clearly defined

**Validation Steps**:

```bash
pnpm markdownlint-check:root
```

---

**Task 2.5.4 – Commit and Push**

- [ ] Review all changes
- [ ] Commit with comprehensive message:

  ```
  feat: complete Phase 2 transport instrumentation

  - Added correlation IDs to HTTP and stdio servers
  - Implemented request timing metrics
  - Enriched error contexts with debugging information
  - Updated all documentation
  - All 438+ tests passing, quality gates green

  Phase 2 complete. Ready for Phase 3 (rollout).
  ```

- [ ] Push to remote

**Acceptance Criteria**:

- All changes committed
- Commit message follows conventional commits
- Changes pushed to remote
- Branch status clean

**Validation Steps**:

```bash
git status # Should show clean working tree
git log -1 # Should show comprehensive commit message
```

---

#### Session 2.5 Definition of Done

**Required**:

- [x] All tasks (2.5.1 through 2.5.4) complete
- [x] Full quality gate sweep passes
- [x] End-to-end validation complete
- [x] All documentation updated and current
- [x] Changes committed and pushed
- [x] Phase 2 marked complete in all docs
- [x] Repository ready for Phase 3

---

### Phase 2 Complete Definition of Done

**Phase 2 is complete when ALL of these are true:**

**Features Delivered**:

- [x] HTTP server has correlation ID support
- [x] Stdio server has correlation ID support
- [x] Request timing captured for all operations
- [x] Error contexts enriched with correlation + timing
- [x] All features tested with integration tests
- [x] All features tested with e2e tests

**Quality**:

- [x] All quality gates pass (build, type-check, lint, test, e2e)
- [x] No regressions from Phase 1 functionality
- [x] Test coverage maintained (438+ tests)
- [x] No linter warnings or errors
- [x] Documentation lint passes

**Documentation**:

- [x] Logger package README updated
- [x] HTTP server README updated
- [x] Stdio server README updated
- [x] TESTING.md guides updated
- [x] Context documents updated (context.md, continuation_prompt.md, HANDOFF.md)
- [x] Plan document updated with completion status

**Validation**:

- [x] Manual testing confirms all features work
- [x] Correlation IDs propagate correctly
- [x] Timing metrics are accurate
- [x] Errors are properly enriched
- [x] No performance degradation observed

**Repository State**:

- [x] All changes committed with good messages
- [x] All changes pushed to remote
- [x] Branch is clean (no uncommitted changes)
- [x] Ready for Phase 3 work

---

## Phase 3 – Documentation & Rollout (Depends on Phase 2)

Ensure deployment readiness and operational confidence.

### Session 3.A – Documentation Finalisation

- [ ] Review and update app READMEs with final logging instructions
- [ ] Document SDK logging patterns and best practices
- [ ] Verify Vercel configuration for stdout logging
- [ ] Run markdown lint across updated docs

### Session 3.B – Staging Deployment & Validation

- [ ] Run quality gates prior to deployment
- [ ] Deploy HTTP server to staging and verify health
- [ ] Execute smoke tests against staging
- [ ] Inspect staging logs for structure, errors, and PII leakage

### Session 3.C – Production Rollout & Observation

- [ ] Complete pre-production checklist and communicate rollout plan
- [ ] Deploy to production and perform immediate validation
- [ ] Monitor for 48 hours, sampling logs for issues
- [ ] Document findings, costs, and follow-up actions

---

## References

- `.agent/directives-and-memory/rules.md` – repository rules (must follow at all times)
- `docs/agent-guidance/testing-strategy.md` – TDD guidance
- `packages/libs/logger/README.md` – authoritative logger documentation
- `apps/oak-curriculum-mcp-streamable-http/README.md` – HTTP logging configuration
- `apps/oak-curriculum-mcp-stdio/README.md` – stdio logging configuration (pending updates)
- `.agent/context/context.md` & `.agent/context/continuation.prompt.md` – current state snapshots

## Incident Response

### Git Disaster Recovery (2025-11-05)

Following a destructive git operation and partial recovery, the stdio server was left in an inconsistent state. A comprehensive rescue plan was executed to complete the Phase 1 work:

- **Issue**: Missing `runtime-config.ts`, dual logger implementations, stale build artifacts
- **Response**: Executed `.agent/plans/rescue-plan-2025-11-05.md` (Tranches R.1-R.6)
- **Outcome**: ✅ All quality gates green, 438+ tests passing, full e2e validation complete
- **Reference**: See rescue plan for detailed execution log and validation evidence

---

_Last updated: 2025-11-05 (Phase 1 complete including rescue; Phase 2 ready to begin)_
