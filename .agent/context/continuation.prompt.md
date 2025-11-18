# Continuation Prompt: Oak MCP Observability Implementation

**Last Updated**: 2025-11-14 (Header redaction test coverage complete)  
**Status**: ✅ Phase 1 Complete · ✅ Phase 2 Complete · ✅ Session 3.A Complete · ✅ Session 3.B Complete · ✅ Runtime Diagnostics Complete · ✅ Middleware Chain Complete · ✅ Header Redaction Tests Complete  
**Audience**: AI assistants in fresh contexts (optimized for complete context restoration)

---

## I'm Working On...

I've completed the Oak MCP Ecosystem observability implementation Phase 2 and Session 3.A. This is a multi-phase project:

1. **Phase 1 (✅ Complete)**: Consolidate logging across HTTP and stdio MCP servers into a unified, type-safe foundation
2. **Phase 2 (✅ Complete)**: Add transport instrumentation (correlation IDs, timing, error enrichment)
   - ✅ Session 2.1: HTTP Server Correlation IDs (Complete 2025-11-06)
   - ✅ Session 2.2: Stdio Server Correlation IDs (Complete 2025-11-06)
   - ✅ Session 2.3: Request Timing Instrumentation (Complete 2025-11-06)
   - ✅ Session 2.4: Error Context Enrichment (Complete 2025-11-07)
   - ✅ Session 2.5: Phase 2 Integration & Validation (Complete 2025-11-08)
3. **Phase 3 (In Progress)**: Production rollout with monitoring and dashboards
   - ✅ Session 3.A: Documentation Finalization (Complete 2025-11-08)
   - ✅ Session 3.B: Logger Architecture Verification (Complete 2025-11-10)
   - 🚀 Session 3.C: Staging Deployment & Validation (Ready - No Repo Changes Required)
   - [ ] Session 3.D: Production Rollout & Observation

**Current status**: Session 3.B complete. Logger architecture verified. Runtime diagnostics Phases 1-2 complete (2025-11-13): instrumentation and built-server harness delivered. Middleware chain documentation and reordering complete (2025-11-14). SECURITY BLOCKER RESOLVED (2025-11-14): Comprehensive header redaction test coverage implemented - 69 tests added (53 unit, 10 integration, 6 E2E). All quality gates passing: build ✅, type-check ✅, lint ✅, test:all ✅ (287 tests: 218 baseline + 69 new). Session 3.C staging deployment READY - security blocker resolved, all sensitive header redaction verified.

---

## Startup Checklist

When resuming work, read these documents in order:

1. **`.agent/context/HANDOFF.md`** – Big picture orientation, architecture overview
2. **This file (`continuation.prompt.md`)** – Complete technical context and history
3. **`.agent/context/context.md`** – Recent changes and current status
4. **`.agent/plans/mcp-oauth-implementation-plan.md`** – Detailed Phase 2 sessions with acceptance criteria
5. **`.agent/directives-and-memory/rules.md`** – Cardinal rules (MUST follow)
6. **`docs/agent-guidance/testing-strategy.md`** – TDD workflow (Red → Green → Refactor)

**Before starting work**:

- Confirm understanding of logger entry-point split (`@oaknational/mcp-logger` vs `/node`)
- Verify all quality gates are green
- Review Phase 2 session objectives and acceptance criteria
- Understand runtime config dependency injection pattern

---

## Historical Record (Complete Session History)

### Pre-Phase 1: Legacy State

**Problem**: Multiple MCP servers (HTTP, stdio, Notion) had inconsistent logging:

- Bespoke `[TRACE]` system with string literals scattered across codebase
- Direct `process.env` access making testing difficult
- No type safety in log data
- HTTP server mixing logging concerns with business logic
- Stdio server logging to stdout (corrupting MCP protocol JSON-RPC stream)

**Decision**: Build unified logging foundation before attempting OAuth instrumentation.

---

### Phase 1.1-1.2: Foundation Work (2025-10-15 to 2025-10-28)

**Objectives**: Remove legacy trace system, create shared logger package

**Key Decisions**:

1. **Created `@oaknational/mcp-logger` package**
   - Adaptive multi-sink logging (console, file)
   - JSON sanitization for structured logs
   - Express middleware for request/error logging
   - Type-safe log levels and metadata

2. **Removed legacy trace system**
   - Deleted `[TRACE]` string literals across all servers
   - Removed trace modules and utilities
   - Updated all consumers to use shared logger

**Deliverables**:

- `packages/libs/logger/` with full unit test coverage
- Migration guide and documentation
- `.env` samples for logger configuration

---

### Phase 1.2.5: Logger Package Restructuring (2025-11-03)

**Problem**: HTTP server runs on Vercel Edge (browser context) and cannot use Node.js `fs` API for file logging. Stdio server needs file logging to keep stdout clean for MCP protocol.

**Decision**: Split logger into two entry points for tree-shaking

**Architecture**:

```text
@oaknational/mcp-logger       → Browser-safe (no fs, console only)
@oaknational/mcp-logger/node  → Full Node.js (fs + file sink)
```

**Why**: Vercel's bundler would fail if Node.js `fs` imports were present in browser code. This dual-entry approach allows HTTP server to use logger without pulling in Node.js APIs, while stdio server gets full file logging capabilities.

**Implementation**:

- Created `src/node.ts` entry point exporting Node-only features
- Updated `package.json` exports map with `/node` subpath
- Modified `tsup.config.ts` for multi-entry build
- Added `adaptive-node.ts` with Node-specific logger creation
- Added integration tests proving browser vs Node separation
- Externalized Node built-ins in bundler config

**Trade-offs Accepted**:

- Two entry points add complexity (but necessary for runtime compatibility)
- Consumers must use correct entry point for their runtime
- Build system slightly more complex (but automated)

**Validation**:

- Verified `dist/index.js` contains NO `fs` imports
- Verified `dist/node.js` contains `fs` imports as expected
- Semantic search app builds successfully (browser context)
- All quality gates pass

---

### Phase 1.2.6: Logger Consumer Audit (2025-11-03)

**Objectives**: Ensure every workspace uses correct logger entry point

**Audit Results**:

- HTTP server: Uses main entry (`@oaknational/mcp-logger`) ✅ Correct
- Stdio server: Uses `/node` entry (`@oaknational/mcp-logger/node`) ✅ Correct
- Semantic search: Uses main entry ✅ Correct
- SDK: Uses main entry ✅ Correct

**Documentation Updates**:

- Expanded logger README with entry-point guidance
- Added migration notes to affected app READMEs
- Updated context docs with audit results

---

### Phase 1.3: HTTP Server Clean-up (2025-11-03)

**Objectives**: Remove HTTP server's bespoke logging and use shared logger exclusively

**Changes**:

- Deleted local `Logger` interface, imported from `@oaknational/mcp-logger`
- Replaced `createLoggerFromEnv` wrapper with direct `createAdaptiveLogger`
- Deleted `src/logging/middleware.ts`, imported middleware from shared logger
- Removed file sink configuration (HTTP server stdout-only)
- Deleted integration test that inspected Express internals
- Created focused unit tests for middleware registration

**Why These Changes**:

- Reduces duplication and maintenance burden
- Forces stdout-only logging for Vercel compatibility
- Improves type safety (uses shared types directly)
- Simplifies testing (no Express internal inspection)

**Validation**:

- HTTP server builds successfully
- 45 e2e tests pass
- Smoke tests (stub + live) pass
- Logs appear in stdout with correct structure

---

### Phase 1.4: Stdio Server Migration (2025-11-05, via Rescue)

**Context**: Git disaster occurred during stdio migration, requiring rescue operation

**Problem**: After partial git recovery:

- Stdio server missing `runtime-config.ts`
- Dual logger implementations (shared + bespoke)
- Stale build artifacts and test files
- Some `process.env` accesses restored accidentally

**Rescue Executed**: `.agent/plans/rescue-plan-2025-11-05.md` (Tranches R.1-R.6)

**Rescue Deliverables**:

1. **Created stdio runtime config** (`apps/oak-curriculum-mcp-stdio/src/runtime-config.ts`)
   - Centralized environment variable parsing
   - Zod schemas for validation
   - Derived properties (`logLevel`, `useStubTools`)
   - Type-safe config object for dependency injection

2. **Migrated stdio logging** (`apps/oak-curriculum-mcp-stdio/src/logging/`)
   - Uses `@oaknational/mcp-logger/node` for file sink support
   - Forces file-only logging (stdout reserved for MCP protocol)
   - Configuration via env vars (`OAK_CURRICULUM_MCP_LOG_LEVEL`, etc.)
   - Default log path: `.logs/oak-curriculum-mcp/server.log`

3. **Updated stdio wiring** (`apps/oak-curriculum-mcp-stdio/src/app/wiring.ts`)
   - Injects runtime config and logger into all components
   - No direct `process.env` access in app code
   - Stub resolver uses injected config

4. **Fixed stdio tests**
   - Created config builders for test setup
   - Removed `process.env` mutations from tests
   - Updated tool response handlers to accept injected config

**Validation**:

- Stdio server builds successfully
- 12 e2e tests pass
- Manual verification: logs go to file, stdout clean
- No `process.env` access outside config module

---

### Runtime Config Consolidation (2025-11-05)

**Objectives**: Eliminate direct `process.env` access, enable dependency injection for testing

**Why This Matters**:

- Direct `process.env` access makes testing hard (global state mutations)
- Dependency injection allows mocking config without env pollution
- Centralized validation ensures config correctness
- Type safety throughout application code

**Pattern Established**:

```typescript
// runtime-config.ts
export interface RuntimeConfig {
  readonly logLevel: string;
  readonly useStubTools: boolean;
  readonly env: {
    readonly OAK_API_KEY?: string;
  };
}

export function loadRuntimeConfig(source = process.env): RuntimeConfig {
  // Parse and validate with Zod
  // Return immutable config object
}

// handler.ts
export function createHandler(config: RuntimeConfig, logger: Logger) {
  // Use config.useStubTools instead of process.env.X
  // Pass logger instead of creating new one
}

// test.ts
const config = createTestConfig({ useStubTools: true });
const handler = createHandler(config, mockLogger);
```

**Applied To**:

- ✅ HTTP server (`apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`)
- ✅ Stdio server (`apps/oak-curriculum-mcp-stdio/src/runtime-config.ts`)
- ✅ All handlers accept `RuntimeConfig` via DI
- ✅ All tests use config builders instead of `process.env` mutations

**Special Case: Clerk**:

- Clerk middleware reads `process.env.CLERK_PUBLISHABLE_KEY` directly
- Created `applyRuntimeEnvironment()` to set Clerk env vars at HTTP server startup
- This is the ONE sanctioned place where we write to `process.env`
- Tests explicitly set Clerk env vars in `beforeEach` hooks

**Validation**:

- Zero `process.env` access in production handlers
- All tests pass without env mutations
- Config validation catches misconfiguration early
- Type safety maintained throughout

---

### Phase 1.5: Integration & Validation (2025-11-04 to 2025-11-05)

**Objectives**: Prove complete Phase 1 implementation across all systems

**Quality Gate Sweep Results** (2025-11-05):

```bash
pnpm format-check:root        ✅
pnpm markdownlint-check:root  ✅
pnpm build                    ✅ (10 packages)
pnpm type-check               ✅ (10 workspaces)
pnpm lint                     ✅ (10 workspaces)
pnpm doc-gen                  ✅
pnpm test                     ✅ (438+ tests across 10 workspaces)
pnpm test:e2e                 ✅ (68 tests: HTTP 45, Stdio 12, SDK 11)
pnpm smoke:dev:stub           ✅
pnpm smoke:dev:live           ✅
pnpm qg                       ✅ (runs all above)
```

**Documentation Updates**:

- Updated root README with logger package reference
- Updated architecture docs with logging design
- Recorded results in `.agent/context/context.md`
- Refreshed `.agent/context/continuation.prompt.md`
- Marked Phase 1 complete in plan document

**Repository State**:

- All changes committed with conventional commit messages
- Pushed to remote (`feat/oauth_support` branch)
- Clean working tree
- Ready for Phase 2

---

### Phase 2.1: HTTP Server Correlation IDs (2025-11-06)

**Objectives**: Implement request correlation IDs to enable request tracing across the HTTP server

**Key Decisions**:

1. **Correlation ID Format**: `req_{timestamp}_{6-char-hex}`
   - Chronologically sortable (timestamp first)
   - Collision-resistant (random hex component)
   - URL-safe (no special characters)
   - Example: `req_1699123456789_a3f2c9`

2. **Storage in `res.locals` (not `req`)**
   - More idiomatic Express pattern
   - Passed naturally between middleware
   - Type-safe with TypeScript declaration merging

3. **Child Logger Pattern**
   - `createChildLogger(parentLogger, correlationId)` creates logger with correlation context
   - Preserves parent logger configuration
   - Adds correlation ID to all log entries
   - No mutation of parent logger

4. **X-Correlation-ID Header Propagation**
   - Middleware checks for existing header (reuses if present)
   - Generates new ID if absent
   - Always includes in response headers
   - Enables client-side correlation tracking

**Implementation**:

- Created `correlation/` module with ID generation and middleware
- Updated `logging/` module with `createChildLogger` and `extractCorrelationId`
- Updated handlers to use correlated logger for all operations
- Added comprehensive documentation with examples

**Deliverables**:

- 6 unit tests for correlation ID generation
- 7 integration tests for middleware behavior
- 3 additional logger helper tests
- Documentation in README.md and TESTING.md

**Validation**:

- All existing tests continue to pass (45 e2e tests)
- New tests verify correlation ID format, uniqueness, propagation
- Quality gates remain green

---

### Phase 2.2: Stdio Server Correlation IDs (2025-11-06)

**Objectives**: Implement per-tool-invocation correlation IDs for the stdio server

**Key Decisions**:

1. **Per-Tool-Invocation Correlation** (not per-connection)
   - Stdio transport has no HTTP-style request/response cycle
   - Each tool invocation gets a unique correlation ID
   - Generated in `registerMcpTools` tool handler
   - Enables tracing individual tool executions

2. **File-Only Logging with Correlation**
   - Child logger must respect stdio's file-only constraint
   - Created `createChildLogger(parentLogger, correlationId, config)`
   - Uses `createStdioSinkConfig` to ensure file-only output
   - No stdout contamination (MCP protocol safety)

3. **Reused Correlation Format**
   - Same `req_{timestamp}_{6-char-hex}` format as HTTP
   - Consistency across transports
   - Same collision resistance guarantees

4. **Refactoring for Linter Compliance**
   - Extracted helper functions to reduce `max-lines-per-function`
   - `executeTool` - tool execution logic
   - `createHandlersForTool` - response handler creation
   - `handleToolResult` - result validation and handling
   - Maintains readability and testability

**Implementation**:

- Mirrored HTTP correlation module for consistency
- Updated stdio logger with `createChildLogger` helper
- Integrated correlation ID generation in `registerMcpTools`
- Correlated logger used for all tool execution logging

**Deliverables**:

- 6 unit tests for correlation ID generation
- 3 additional logger helper tests
- Documentation in stdio README.md with grep examples

**Validation**:

- All existing tests continue to pass (12 e2e tests)
- New tests verify correlation ID generation and logger behavior
- Quality gates remain green
- No stdout logging confirmed

---

### Phase 2.3: Request Timing Instrumentation (2025-11-06)

**Objectives**: Add request timing metrics to identify slow requests and timeouts across both servers

**Key Decisions**:

1. **Browser-Safe Timing Implementation**
   - Used `performance.now()` API (available in both browser and Node.js)
   - Created timing utilities in logger package main entry (not `/node`)
   - Ensures HTTP server can use timing without Node.js dependencies
   - Sub-millisecond precision for accurate measurements

2. **Timer Interface Design**
   - `startTimer()` returns Timer object with two methods:
     - `elapsed()` - get current elapsed time (non-destructive)
     - `end()` - get final Duration with formatted string
   - Duration includes both `ms` (number) and `formatted` (string: "123ms" or "1.23s")
   - Functional approach: timer is immutable, end() doesn't modify state

3. **Slow Request Thresholds**
   - HTTP server: 2000ms (2 seconds)
   - Stdio server: 5000ms (5 seconds)
   - Different thresholds reflect transport characteristics
   - Warnings logged at `warn` level for slow operations

4. **Integration Points**
   - HTTP: Timing in correlation middleware, logged on `res.on('finish')`
   - Stdio: Timing per tool invocation in `registerMcpTools`
   - Timing data included in all completion logs
   - Slow operation flag (`slowRequest`, `slowOperation`) for easy filtering

**Implementation**:

- Created `packages/libs/logger/src/timing.ts` with browser-safe timer
- Updated HTTP correlation middleware to track request duration
- Updated stdio server to track tool execution duration
- Enhanced all completion logs with duration, durationMs, and slow flags
- Timing data automatically included in correlated log entries

**Deliverables**:

- 4 unit tests for timing utilities
- 3 integration tests for HTTP request timing
- Documentation in all three READMEs with log filtering examples
- Timing utilities exported from both logger entry points

**Validation**:

- All existing tests continue to pass (726 tests total)
- New timing tests verify accuracy and formatting
- Quality gates remain green
- Manual testing confirms timing appears in logs

---

### Phase 2.4: Error Context Enrichment (2025-11-07)

**Objectives**: Enrich error logs with correlation IDs, timing information, and request context for improved production debugging.

**Key Decisions**:

1. **Error Context Interface Design**
   - Created `ErrorContext` interface with optional fields: `correlationId`, `duration`, `requestMethod`, `requestPath`, `toolName`
   - All fields optional for maximum flexibility
   - Designed for both HTTP (request-oriented) and stdio (tool-oriented) contexts

2. **Non-Enumerable Property Attachment**
   - Used `Object.defineProperty` to attach context as non-enumerable property
   - Prevents pollution of JSON.stringify output by default
   - Allows explicit access when needed for logging
   - Preserves original error properties (message, stack, name)

3. **Middleware Pattern for HTTP**
   - Created `createEnrichedErrorLogger` Express error middleware
   - Extracts context from `res.locals` (correlation ID, timer)
   - Enriches error before logging
   - Passes error to next middleware (maintains Express error handling chain)

4. **Handler Pattern for Stdio**
   - Updated `tool-response-handlers` to accept optional `ErrorContext`
   - Modified `server.ts` to construct and pass error context per tool invocation
   - File-only logging maintains MCP protocol integrity

**Implementation**:

- Created `packages/libs/logger/src/error-context.ts` with `enrichError` function
- Updated HTTP error middleware to use enrichment
- Updated stdio error handlers to use enrichment
- Both servers now log errors with full debugging context

**Deliverables**:

- 5 unit tests for error enrichment (`error-context.unit.test.ts`)
- 7 integration tests for HTTP error enrichment (`error-handling.integration.test.ts`)
- 5 integration tests for stdio error enrichment (`error-enrichment.integration.test.ts`)
- Comprehensive documentation in all three READMEs with debugging examples

**Validation**:

- All existing tests continue to pass
- New tests verify error enrichment with correlation ID and timing
- Quality gates remain green (738 tests passing, +12 new tests)
- Manual testing confirms enriched error logs

---

### Phase 2.5: Integration & Validation (2025-11-08)

**Objectives**: Validate complete Phase 2 implementation across all servers, confirm no regressions, and finalize Phase 2 documentation.

**Key Activities**:

1. **Full Quality Gate Validation**
   - Ran complete `pnpm qg` suite to establish baseline
   - All 738 tests passing (700 baseline + 38 Phase 2 instrumentation tests)
   - All 68 e2e tests passing (HTTP 45, Stdio 12, SDK 11)
   - All quality gates green: format, markdownlint, build, type-check, lint, doc-gen, test, test:e2e, smoke tests
   - No regressions detected from Phase 1 or Phase 2 work

2. **Documentation Updates**
   - Updated `.agent/context/context.md` to reflect Phase 2 completion
   - Updated `.agent/context/continuation.prompt.md` with Phase 2 historical record
   - Updated `.agent/context/HANDOFF.md` to mark Phase 2 milestone
   - Updated `.agent/plans/mcp-oauth-implementation-plan.md` with completion status
   - All markdown lint checks passing

3. **Phase 2 Completion Verification**
   - All five sessions (2.1-2.5) complete
   - Correlation IDs implemented and validated for both HTTP and stdio
   - Request timing metrics capturing all operations with slow request warnings
   - Error context enrichment providing full debugging information
   - 38 new instrumentation tests added across Phase 2
   - Zero test failures or regressions

**Deliverables**:

- Complete quality gate validation report (all green)
- Updated documentation reflecting Phase 2 milestone
- Phase 2 completion commit with comprehensive history
- Repository ready for Phase 3 planning

**Validation Results**:

- ✅ Quality gates: 100% passing
- ✅ Test suite: 738 tests passing (no failures)
- ✅ E2E tests: 68 tests passing across all workspaces
- ✅ Smoke tests: Both stub and live modes passing
- ✅ Documentation: All markdown lint checks passing
- ✅ Build: All 10 packages building successfully
- ✅ Type safety: No TypeScript errors across 10 workspaces
- ✅ Code quality: No linter warnings or errors

**Phase 2 Achievement Summary**:

- **Correlation IDs**: Complete request tracing across both transports
- **Timing Metrics**: Sub-millisecond precision with slow request detection
- **Error Enrichment**: Full debugging context in all error scenarios
- **Test Coverage**: 38 new tests proving instrumentation correctness
- **Documentation**: Comprehensive guides for debugging with new features
- **Zero Regressions**: All Phase 1 functionality preserved

---

### Session 3.A: Documentation Finalization & Production Readiness (2025-11-08)

**Objectives**: Finalize all documentation, validate observability features in development, and prepare for production rollout.

**Key Activities**:

1. **Comprehensive Documentation**
   - Created SDK logging guide (`packages/sdks/oak-curriculum-sdk/docs/logging-guide.md`)
   - Updated SDK README with Logging section and code examples
   - Added Production Logging section to HTTP server README
   - Added Log File Management section to stdio server README
   - Created production debugging runbook for operational teams
   - Created AI agent logging guidance
   - Updated development and agent-guidance indexes

2. **Development Server Validation**
   - Configured dev command with `LOG_LEVEL=debug` and observability features
   - Fixed deprecated `REMOTE_MCP_ALLOW_NO_AUTH` → `DANGEROUSLY_DISABLE_AUTH` everywhere
   - Started dev server and validated OAuth authentication via Clerk
   - Confirmed all 28 tools reporting correctly
   - Validated correlation IDs appearing in logs
   - Confirmed timing metrics working (5.47s request logged with slowRequest flag)
   - Verified error enrichment context available

3. **Critical Discovery: Multi-Line Logging Issue**
   - **Problem**: Consola outputs multi-line, pretty-printed logs
   - **Impact**: Incompatible with production log aggregation (Datadog, Kibana, etc.)
   - **Evidence**: Dev server logs showed multi-line output breaking parser compatibility
   - **Root Cause**: Consola designed for development, not production
   - **Solution Required**: Single-line JSON everywhere

4. **OpenTelemetry Research & Decision**
   - Researched canonical log format standards
   - OpenTelemetry Logs Data Model identified as industry standard
   - Supported by all major observability platforms (Datadog, Kibana, Splunk, etc.)
   - Created ADR-051: OpenTelemetry-Compliant Single-Line JSON Logging
   - Updated ADR-017 to mark as superseded
   - Decision: Remove Consola, implement OpenTelemetry format everywhere

**Deliverables**:

Documentation Created/Updated:

- SDK logging guide (628 lines)
- Production debugging runbook
- AI agent logging guidance
- 4 README updates across HTTP, stdio, SDK, and guidance docs
- All markdown lint passing

Configuration Updates:

- Environment variable deprecation fix (REMOTE_MCP_ALLOW_NO_AUTH → DANGEROUSLY_DISABLE_AUTH)
- Dev server command enhanced with observability features
- Log capture working with `tee` to `.logs/http-dev.log`

Architecture Decision:

- ADR-051 created and documented
- Detailed implementation plan prepared for Session 3.B
- Clear rationale for Consola removal (~200KB bundle reduction)
- OpenTelemetry format specification defined

**Validation Results**:

- ✅ All documentation markdown lint passing
- ✅ Dev server running with all observability features working
- ✅ Correlation IDs appearing in logs
- ✅ Timing metrics capturing request durations
- ✅ Error enrichment context available
- ✅ 28 MCP tools correctly registered and available
- ⚠️ Multi-line log format identified as production blocker
- ✅ Solution path identified (OpenTelemetry + single-line JSON)

**Key Insights**:

1. **Consola Trade-off**: Beautiful dev logs vs. production compatibility
   - Consola optimized for human readability (multi-line, colors, emojis)
   - Production needs machine-readable (single-line JSON, parseable)
   - No way to make Consola output single-line JSON
   - Decision: Remove Consola entirely, use native `process.stdout.write()`

2. **OpenTelemetry as Universal Standard**
   - Every major observability platform supports OpenTelemetry
   - Future-proof: ready for full OTel SDK integration later
   - Semantic conventions provide standard attribute names
   - Built-in support for distributed tracing (TraceId, SpanId)

3. **Single-Line JSON Everywhere**
   - Same format in development and production (no environment drift)
   - Works with all Unix tools (`jq`, `grep`, `awk`)
   - Easy to parse and ingest
   - Human readability via `tail -f logs | jq` when needed

**Implementation Decision**:

Approved for Session 3.B:

- Remove Consola dependency completely
- Implement UnifiedLogger with OpenTelemetry format
- Single-line JSON output to all sinks (stdout, file)
- Resource attributes from environment (ENVIRONMENT_OVERRIDE → VERCEL_ENV → 'development')
- No backwards compatibility (per project rules)

---

### Session 3.B: Logger Architecture Verification (2025-11-10)

**Objectives**: Verify logger architecture follows project rules and identify any remaining architectural debt.

**Process**:

During planning for Session 3.B implementation (originally planned as major refactoring), we performed a comprehensive code review to baseline the current state before beginning work.

**Discovery**:

Upon inspection, **all planned architectural improvements were already in place**:

1. **UnifiedLogger Design** ✅
   - Pure constructor accepting only injected dependencies
   - No direct process.env or process.stdout access
   - All methods ≤8 complexity
   - Immutable design with no mutable state

2. **Node.js API Confinement** ✅
   - `process.stdout` only in `createNodeStdoutSink()` in node.ts
   - Properly marked with eslint-disable explaining necessity
   - File system access via injected FileSystem interface
   - NODE_FILE_SYSTEM implementation in node.ts

3. **Entry Point Design** ✅
   - Main entry (`@oaknational/mcp-logger`) browser-safe
   - Node entry (`@oaknational/mcp-logger/node`) with Node.js features
   - Tree-shaking verified (no Node.js APIs in dist/index.js)

4. **Application Wiring** ✅
   - HTTP server uses UnifiedLogger with explicit DI
   - Stdio server uses UnifiedLogger with explicit DI
   - Both applications own environment access
   - Logger receives only processed config

5. **Quality Metrics** ✅
   - Zero lint errors in logger package
   - Zero test failures
   - All functions ≤8 complexity
   - Tree-shaking verified

**Deliverables**:

- Created `.agent/plans/logger-enhancement-plan.md` documenting completion
- Updated context.md with verification results
- Updated continuation.prompt.md with Session 3.B summary
- Updated HANDOFF.md to reflect Phase 3 readiness

**Key Insight**:

The logger architecture improvements happened **organically during Phase 2** implementation rather than requiring a dedicated refactoring session. TDD practices and continuous quality gates prevented architectural violations from accumulating.

**Lessons Learned**:

1. **Continuous Architecture**: Small, incremental improvements during feature work can achieve architectural goals without dedicated refactoring sessions
2. **Quality Gates Work**: Continuous linting and type-checking prevented violations from accumulating
3. **Documentation Lag**: Plans must be regularly verified against actual code state
4. **TDD Drives Design**: Test-first development naturally leads to good DI patterns

**State**: Logger foundation ready for production rollout. No blocking architectural debt.

---

### Runtime Diagnostics: Quality Gate Remediation (2025-11-13)

**Objectives**: Restore quality gates to green status after Phase 1 instrumentation introduced type-check and lint violations.

**Problem**: 2025-11-12 quality gate sweep revealed:

1. **Type-check failure**: Unused `LoggedEntry` import in `bootstrap.instrumentation.integration.test.ts`
2. **Lint failures** (11 errors):
   - Unsafe `any` assignments from `Reflect.get()` in diagnostics tests
   - `max-statements` violation (22 > 20) in bootstrap integration test
   - `max-lines` violation (278 > 250) in `src/index.ts`
   - `max-lines-per-function` violation (56 > 50) in `createApp` function
   - Catch parameter missing explicit typing
   - Array type syntax (`Array<T>` instead of `T[]`)

**Solution Strategy**:

1. **Remove Unused Import**: Delete `LoggedEntry` type from bootstrap test import
2. **Fix Unsafe Assignments**: Eliminate intermediate variables, use `Reflect.get()` result directly in comparisons
3. **Extract Helper Functions**: Move bootstrap-related logic to separate module
4. **Reduce Function Complexity**: Break down large test functions into smaller helpers

**Implementation**:

**File: `bootstrap.instrumentation.integration.test.ts`**

- Removed unused `LoggedEntry` type import
- Eliminated intermediate variables that captured `Reflect.get()` results (were implicitly `any`)
- Used direct comparison: `return Reflect.get(context, 'phase') === phase;`
- Extracted helper functions `verifyPhaseLogging` and `verifyTotalBootstrapLogging` to reduce main test complexity
- Fixed array type syntax to `T[]` style

**File: `auth-instrumentation.unit.test.ts` and `auth.instrumentation.integration.test.ts`**

- Applied same pattern: eliminated intermediate variables from `Reflect.get()` calls
- Direct comparison approach prevents unsafe `any` assignments

**File: `src/index.ts`**

- Extracted bootstrap-related functions to new `app/bootstrap-helpers.ts` module:
  - `BootstrapPhaseName` type
  - `BootstrapPhaseContext` interface
  - `runBootstrapPhase()` function
  - `setupBaseMiddleware()` function
  - `createMcpReadinessMiddleware()` function
- Updated imports to use new module
- Reduced file from 278 lines to 226 lines (under 250 limit)
- Fixed catch parameter typing with explicit `: unknown`
- Used nullish coalescing operator (`??=`) for cleaner code

**File: `app/bootstrap-helpers.ts` (new)**

- Created dedicated module for bootstrap orchestration
- Exports bootstrap types and helper functions
- Keeps `src/index.ts` focused on app creation and wiring
- All functions properly typed with TSDoc comments

**Benefits**:

1. **Better Separation of Concerns**: Bootstrap logic now isolated in dedicated module
2. **Improved Testability**: Helper functions can be tested independently
3. **Reduced Complexity**: `src/index.ts` now under all linting thresholds
4. **Type Safety Maintained**: No shortcuts taken, all types preserved
5. **Code Quality**: Follows project rules (no `any`, no type assertions)

**Validation Results**:

```bash
pnpm build         ✅ All packages compile
pnpm type-check    ✅ Zero TypeScript errors
pnpm lint          ✅ Zero linting violations
pnpm test:all      ✅ 738 tests passing
```

**Key Insights**:

1. **Reflect.get() Returns Any**: Must handle carefully to avoid unsafe assignments
   - ❌ BAD: `const x = Reflect.get(obj, 'key');` (x is implicitly any)
   - ✅ GOOD: `return Reflect.get(obj, 'key') === expected;` (no intermediate variable)

2. **File Size Matters**: Linting rules enforce modular design
   - Extract related functions to dedicated modules
   - Keep main files focused on orchestration, not implementation

3. **Test Complexity**: Long test functions should extract helpers
   - Reduces statement count
   - Improves readability
   - Makes tests more maintainable

4. **Incremental Quality**: Quality gates catch issues immediately
   - Prevents technical debt accumulation
   - Forces good practices from the start
   - TDD + linting = clean architecture

**Deliverables**:

- ✅ Zero type-check errors across entire codebase
- ✅ Zero linting violations across entire codebase
- ✅ New `app/bootstrap-helpers.ts` module with proper types and documentation
- ✅ All 738 tests passing with no regressions
- ✅ Quality gates ready for Phase 2 diagnostics work or Session 3.C deployment

---

### Runtime Diagnostics: Phase 2 - Built-Server Harness (2025-11-13)

**Objectives**: Create a production-build harness that executes the built HTTP server locally under multiple configuration scenarios with automated request testing to diagnose Vercel deployment hangs.

**Implementation**:

1. **Server Harness Script** (`scripts/server-harness.js`)
   - Loads production bundle (`dist/src/index.js`) with configurable environment
   - Supports `ENV_FILE` configuration (defaults to `.env.harness`)
   - Custom port support via `PORT` environment variable (defaults to 3001)
   - Comprehensive startup logging with timestamps
   - Graceful shutdown handling

2. **Configuration Matrix** (3 scenarios)
   - `config/harness-auth-enabled.env` - Full Clerk OAuth (requires real test keys)
   - `config/harness-auth-disabled.env` - Auth completely disabled via `DANGEROUSLY_DISABLE_AUTH=true`
   - `config/harness-missing-clerk.env` - Invalid Clerk config for error diagnosis
   - All configs include placeholder Clerk keys (required by schema validation)

3. **Request Runner** (`scripts/run-requests.js`)
   - Automated test sequence: `/healthz` → `/` → `/mcp` (initialize)
   - Health check with 30 retries (1s intervals)
   - 10-second timeout per request
   - Pretty-printed summary table with timing and exit codes
   - Environment variable customization (BASE_URL, TIMEOUT_MS, etc.)

4. **Package Scripts**
   - `pnpm prod:harness` - Run harness with ENV_FILE configuration
   - `pnpm prod:requests` - Execute automated request suite
   - `pnpm prod:diagnostics` - Combined: build → harness → requests

5. **Documentation**
   - README.md: "Production Diagnostics" section with quick start guide
   - production-debugging-runbook.md: "Local Production Build Testing" subsection
   - Comprehensive usage examples with expected output

**Validation Results**:

```bash
# Manual validation completed successfully
cd apps/oak-curriculum-mcp-streamable-http
pnpm build                                    ✅
ENV_FILE=.env.harness.auth-disabled pnpm prod:harness  ✅ (server started)
pnpm prod:requests                            ✅ (all 3 requests succeeded)

# Quality gates
pnpm build                ✅
pnpm format:root          ✅
pnpm markdownlint:root    ✅
pnpm type-check           ✅
pnpm lint                 ✅
pnpm test:all             ✅ (738 tests passing)
```

**Key Insights**:

1. **Environment Schema Validation**: Runtime config requires Clerk keys even when auth is disabled, necessitating placeholder values in auth-disabled scenario
2. **Accept Header Requirements**: MCP endpoint requires both `application/json` and `text/event-stream` in Accept header for proper content negotiation
3. **Fast Feedback Loop**: Harness enables rapid iteration on deployment issues without Vercel deployments
4. **Reusable Diagnostic Tool**: Permanent tooling useful for future production debugging and pre-deployment validation

**Deliverables**:

- ✅ `scripts/server-harness.js` - Production build runner (265 lines)
- ✅ `scripts/run-requests.js` - Automated request testing (265 lines)
- ✅ 3 environment configuration files in `config/` directory
- ✅ Package.json scripts: `prod:harness`, `prod:requests`, `prod:diagnostics`
- ✅ README.md updated with "Production Diagnostics" section
- ✅ production-debugging-runbook.md updated with "Local Production Build Testing" section
- ✅ Manual validation complete: all 3 requests succeed
- ✅ All quality gates passing with zero regressions

---

### Runtime Diagnostics: Phase 3 Iteration 2 - Vercel Export Fix Attempt (2025-11-13)

**Objectives**: Address suspected Vercel Express app detection issue by ensuring proper export format per Vercel documentation.

**Problem Diagnosis**:

Based on Vercel logs showing successful bootstrap but no request-level instrumentation logs, initial hypothesis was that Vercel couldn't properly detect/wrap the Express app because `server.ts` was calling `app.listen()` instead of exporting the app instance.

**Implementation**:

Modified `server.ts` to follow canonical Vercel Express pattern:

```typescript
// Export app as default (required by Vercel)
export default app;

// Only call app.listen() when NOT on Vercel
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT ?? 3333);
  app.listen(port, () => {
    console.log(`🚀 Oak Curriculum MCP Server listening on port ${port}`);
    // ...
  });
}
```

**Validation**:

- ✅ Build passed successfully
- ✅ Built artifacts verified (`dist/server.js` exports app as default)
- ✅ Pre-commit checks passed
- ✅ Changes committed and pushed to `feat/oauth_support`
- ✅ Vercel deployment triggered

**Results**:

❌ **FIX FAILED** - Issue persists after deployment

**Vercel Logs Analysis**:

```text
2025-11-13 15:58:10.473 - "Creating app #1"
2025-11-13 15:58:10.475 - "bootstrap.phase.start" (setupBaseMiddleware)
2025-11-13 15:58:10.477 - "bootstrap.phase.finish" (setupBaseMiddleware, 2ms)
2025-11-13 15:58:10.478 - "bootstrap.phase.start" (applySecurity)
2025-11-13 15:58:10.479 - "bootstrap.phase.finish" (applySecurity, 0ms)
2025-11-13 15:58:10.484 - "bootstrap.phase.finish" (initializeCoreEndpoints, 6ms)
2025-11-13 15:58:10.487 - "auth.bootstrap.step.finish" (clerkMiddleware.create, 0ms)
2025-11-13 15:58:10.489 - "bootstrap.complete" (15ms)
... BUT NO REQUEST-LEVEL INSTRUMENTATION LOGS ...
```

**Critical Findings**:

1. ✅ Bootstrap **succeeds** - all "Creating app", "bootstrap.\*" logs present
2. ✅ Auth setup **completes** - Clerk middleware registered successfully
3. ❌ Request instrumentation **never fires** - no "→→→ REQUEST ENTRY" logs
4. ❌ Middleware chain **never executes** - no "✓✓✓ BASE MIDDLEWARE COMPLETE" logs
5. ❌ All requests **hang** - `responseStatusCode: -1`, `durationMs: -1`

**Root Cause Analysis**:

The issue is **NOT** about Express export format. Vercel IS successfully:

- Importing our code
- Running bootstrap (app creation)
- Creating the Express app instance

However, requests somehow **never reach the Express middleware chain**. This suggests:

1. **Vercel might be creating the app on every request** (cold start pattern)
   - Bootstrap logs appear multiple times ("Creating app #1", "#2", "#3")
   - Each request might be creating a new app instance
   - But then never routing the request through that instance

2. **There may be a mismatch in how Vercel invokes the handler**
   - Vercel expects a specific function signature for serverless functions
   - Our export might not match what Vercel's Express adapter expects
   - The app is created but never receives the actual HTTP request

**Hypothesis Disproven**:

- ❌ Issue is NOT about missing default export (we added it, issue persists)
- ❌ Issue is NOT about `app.listen()` blocking (we made it conditional, issue persists)

**New Theory**:

Vercel's Express support might require more than just exporting the app. The framework detection might be working (bootstrap runs), but the actual request routing might need additional integration code or specific export patterns we're missing.

**Next Steps**:

1. Research Vercel's Express framework adapter implementation
2. Check if Vercel requires specific environment variables or configuration
3. Investigate whether Vercel needs a request handler function wrapper
4. Consider if the issue is related to ESM vs CommonJS module formats

**Deliverables**:

- ✅ Modified `server.ts` with Vercel-compatible exports
- ✅ Build validation confirming correct structure
- ❌ Fix validation - issue NOT resolved
- 📊 Enhanced understanding: bootstrap works, request routing doesn't

---

### Middleware Chain Documentation & Reordering (2025-11-14)

**Objectives**: Ensure canonical Clerk middleware ordering is properly documented and implemented, with comprehensive middleware chain documentation.

**Problem**: After resolving 401 authentication issues, needed to ensure middleware ordering follows Clerk best practices and is thoroughly documented for future maintenance.

**Implementation**:

1. **Auth Routes Refactoring** (`src/auth-routes.ts`)
   - Split `setupAuthRoutes` into two phases:
     - `setupGlobalAuthContext()` - Registers `clerkMiddleware()` globally (MUST run early)
     - `setupAuthRoutes()` - Registers OAuth metadata endpoints and protected routes
   - Created `auth-middleware-instrumentation.ts` with reusable middleware wrappers
   - Added comprehensive inline comments and TSDoc explaining middleware patterns
   - Preserved all existing functionality while improving architecture

2. **Application Bootstrap Reordering** (`src/application.ts`)
   - Updated `createApp()` to call `setupGlobalAuthContext()` BEFORE `initializeCoreEndpoints()`
   - Ensures Clerk auth context is available throughout request lifecycle
   - Updated bootstrap phase names to reflect new ordering
   - Added inline comments explaining critical ordering requirements

3. **Comprehensive Middleware Documentation**
   - Created `docs/middleware-chain.md` (complete middleware chain reference)
     - ASCII diagrams showing execution order
     - Mermaid flowcharts showing authentication flow
     - Detailed phase-by-phase breakdown
     - Examples of common debugging scenarios
   - Updated `docs/deployment-architecture.md` with middleware chain summary
   - Reviewed and updated all other documentation in `/docs` directory
   - Updated `README.md` with documentation status note

4. **Bootstrap Helpers Module** (`src/app/bootstrap-helpers.ts`)
   - Added `setupGlobalAuthContext` to bootstrap phase names
   - Proper TypeScript types for all bootstrap phases
   - Ensures compile-time validation of phase names

**Key Architectural Principles**:

1. **Global Clerk Middleware**: `clerkMiddleware()` MUST be applied globally to ALL routes, not scoped to `/mcp`. This is the canonical Clerk Express pattern.

2. **Path-Specific Protection**: `mcpAuthClerk` middleware applied ONLY to `/mcp` endpoint to enforce OAuth verification.

3. **Public Metadata Endpoints**: `/.well-known/oauth-protected-resource` and `/.well-known/oauth-authorization-server` MUST be publicly accessible (no auth middleware).

4. **Middleware Execution Order**:

   ```text
   1. DNS rebinding protection
   2. CORS
   3. Correlation ID generation
   4. Global Clerk auth context ← CRITICAL: Must run early
   5. Core endpoints (healthz, landing page)
   6. OAuth metadata endpoints (public)
   7. MCP endpoint with OAuth enforcement
   ```

**Deliverables**:

- ✅ `auth-routes.ts` split into two-phase setup
- ✅ `auth-middleware-instrumentation.ts` with reusable wrappers
- ✅ `application.ts` updated with correct ordering
- ✅ `docs/middleware-chain.md` (comprehensive 400+ line guide)
- ✅ `docs/deployment-architecture.md` updated
- ✅ `docs/BUILD_VERIFICATION.md` marked as historical
- ✅ All quality gates passing (738 tests)

**Validation Results**:

```bash
pnpm i                ✅
pnpm type-gen         ✅
pnpm build            ✅
pnpm type-check       ✅
pnpm lint -- --fix    ✅
pnpm format           ✅
pnpm check            ✅ (runs all steps sequentially)
```

**Test Suite Analysis** (2025-11-14):

Ran all test suites separately to establish baseline before adding header redaction tests:

| Test Suite            | Tests         | Status | Notes                                     |
| --------------------- | ------------- | ------ | ----------------------------------------- |
| `pnpm test`           | 129           | ✅     | 74 streamable-http, 51 stdio, 4 providers |
| `pnpm test:e2e`       | 57            | ✅     | All integration tests passing             |
| `pnpm test:e2e:built` | 5             | ✅     | Built server verification                 |
| `pnpm test:ui`        | 21            | ✅     | UI component tests                        |
| `pnpm smoke:dev:stub` | 6 assertions  | ✅     | Stub mode validation                      |
| **TOTAL**             | **218 tests** | ✅     | All passing, zero regressions             |

**Critical Discovery**: Header redaction code (`src/logging/header-redaction.ts`) has ZERO test coverage despite being security-critical. This is a BLOCKER for Session 3.C staging deployment.

---

### Session 3.C: Staging Deployment & Validation (⏸️ BLOCKED - Test Coverage Required)

**Objectives**: Deploy HTTP server to Vercel staging and validate observability features with real log aggregation platforms.

**Key Discovery**:

Upon reviewing Session 3.C requirements, **all repository work is already complete**. No code changes are needed.

**Session 3.C is Pure Deployment**:

1. **Vercel UI Configuration** (No Repo Changes):
   - Create Vercel project from GitHub repository
   - Configure build settings (Framework: Express, Node 22.x)
   - Set environment variables (Clerk keys, OAK_API_KEY, security settings)
   - Deploy to staging environment

2. **Smoke Test Execution** (From Repository):

   ```bash
   pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:remote \
     --remote-base-url https://staging-url.vercel.app/mcp
   ```

3. **Log Validation** (Via Vercel Dashboard):
   - Inspect staging logs for OpenTelemetry JSON format
   - Verify correlation IDs, timing metrics, error enrichment
   - Check for PII leakage
   - Validate single-line JSON structure

**Required Vercel Environment Variables**:

```bash
# Required
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
OAK_API_KEY=your_oak_api_key_here

# Recommended (auto-derived from VERCEL_URL if not set)
ALLOWED_HOSTS=your-domain.vercel.app,*.vercel.app
ALLOWED_ORIGINS=https://your-domain.vercel.app

# Optional
LOG_LEVEL=debug  # For staging visibility
REMOTE_MCP_MODE=stateless  # Default; see explanation below
```

**REMOTE_MCP_MODE Explained**:

This configures the MCP transport's session management mode:

- **`stateless` (default)**: No session IDs, no state maintenance. Each request is independent. Best for serverless (Vercel).
- **`session`**: Generates and tracks session IDs via `Mcp-Session-Id` header. Requires in-memory state. Not suitable for serverless.

Our implementation uses stateless mode everywhere (sets `sessionIdGenerator: undefined` in `StreamableHTTPServerTransport`). The environment variable exists for potential future session support but should remain at default (`stateless`) for Vercel deployments.

**Session 3.C Success Criteria**:

- ✅ Deployment builds and starts successfully
- ✅ Health endpoint returns 200
- ✅ OAuth discovery endpoint returns correct metadata
- ✅ Unauthenticated requests return 401 with WWW-Authenticate header
- ✅ Smoke tests pass against staging endpoint
- ✅ Logs appear in single-line OpenTelemetry JSON format
- ✅ Correlation IDs present in all log entries
- ✅ Timing metrics captured correctly
- ✅ Error enrichment working
- ✅ No PII leakage detected

**Deliverables**:

- Staging deployment URL
- Smoke test results
- Log format validation report
- Screenshots of observability features in logs

---

## Architectural Decisions (With Rationale)

### Decision 1: Tree-Shakeable Logger with Dual Entry Points

**Problem**: HTTP server (Vercel Edge) is browser context, cannot use Node.js `fs`. Stdio server needs file logging to keep stdout clean.

**Solution**: Two entry points:

- `@oaknational/mcp-logger` → Browser-safe, console only
- `@oaknational/mcp-logger/node` → Node.js with file sink

**Why Not Alternatives**:

- ❌ Runtime detection: Breaks tree-shaking, pulls Node.js APIs into browser bundles
- ❌ Separate packages: More maintenance, duplication, version drift
- ✅ Dual entry points: Clean separation, tree-shakeable, single source of truth

**Trade-offs**:

- More complex build configuration
- Consumers must know which entry to use
- BUT: Compile-time safety, no runtime overhead, correct tree-shaking

---

### Decision 2: Runtime Config Dependency Injection

**Problem**: Direct `process.env` access makes testing hard, creates hidden dependencies, bypasses validation.

**Solution**: Centralized config modules that parse/validate environment once, then inject config objects.

**Why Not Alternatives**:

- ❌ Global env access: Hard to test, no validation, type unsafe
- ❌ Config singletons: Still hard to test, global state
- ✅ DI with factory functions: Testable, type-safe, validated

**Pattern**:

```typescript
// Config owns environment parsing
export function loadRuntimeConfig(source = process.env): RuntimeConfig;

// App code receives config
export function createServer(config: RuntimeConfig, logger: Logger);

// Tests inject config
const config = createTestConfig({ overrides });
createServer(config, mockLogger);
```

**Benefits**:

- No test env pollution
- Validation happens once at startup
- Type safety throughout
- Easy to mock for testing

---

### Decision 3: Protocol-Aware Logging

**Problem**: Stdio MCP protocol uses stdout for JSON-RPC messages. Any logs to stdout corrupt the protocol stream.

**Solution**: Transport-specific sink configuration:

- HTTP: stdout only (Vercel captures as logs)
- Stdio: file only (`.logs/oak-curriculum-mcp/`)

**Implementation**:

```typescript
// HTTP (browser context)
import { createAdaptiveLogger } from '@oaknational/mcp-logger';
const logger = createAdaptiveLogger({
  sinks: { stdout: true, file: false },
});

// Stdio (Node context)
import { createAdaptiveLogger } from '@oaknational/mcp-logger/node';
const logger = createAdaptiveLogger({
  sinks: { stdout: false, file: { path: '.logs/...' } },
});
```

**Why This Works**:

- Transport concerns stay in transport layer
- Logger is transport-agnostic (doesn't know about MCP protocol)
- Configuration enforces correct usage

---

### Decision 5: Correlation ID Implementation Strategy

**Problem**: Need to trace requests across both HTTP (request/response) and stdio (tool invocation) transports.

**Solution**: Universal correlation ID format with transport-specific application.

**Format Choice**: `req_{timestamp}_{6-char-hex}`

**Why This Format**:

- **Sortable**: Timestamp prefix enables chronological ordering in logs
- **Unique**: Random hex component prevents collisions
- **Human-readable**: Easy to copy/paste, grep, and reference
- **URL-safe**: No encoding needed for headers or query params
- **Consistent**: Same format across all transports

**Transport-Specific Application**:

```typescript
// HTTP: Per-request correlation (middleware)
app.use(createCorrelationMiddleware());
// Generates/reuses ID from X-Correlation-ID header
// Stores in res.locals.correlationId
// Adds to response headers

// Stdio: Per-tool-invocation correlation (handler)
const correlationId = generateCorrelationId();
const correlatedLogger = createChildLogger(logger, correlationId, config);
correlatedLogger.debug('Tool execution started', { toolName, correlationId });
```

**Why Different Approaches**:

- HTTP has natural request/response boundaries → middleware works well
- Stdio has no request boundaries → correlation per tool invocation
- Both preserve MCP protocol correctness
- Both enable end-to-end tracing

**Child Logger Pattern**:

```typescript
// Creates new logger with correlation ID in context
export function createChildLogger(
  parentLogger: Logger,
  correlationId: string,
  config?: RuntimeConfig,
): Logger {
  return createAdaptiveLogger(
    {
      name: 'correlated',
      level: parentLogger.level,
      context: { correlationId },
    },
    undefined,
    sinkConfig, // Transport-specific: stdout for HTTP, file for stdio
  );
}
```

**Benefits**:

- All logs for a request/invocation share same correlation ID
- No mutation of parent logger (functional approach)
- Easy to grep logs: `grep "req_1699123456789_a3f2c9" logs/`
- Supports distributed tracing (pass ID between services)

---

### Decision 6: OpenTelemetry-Compliant Single-Line JSON Logging

**Problem**: Consola outputs multi-line, pretty-printed logs that are incompatible with production log aggregation platforms.

**Solution**: Remove Consola and implement OpenTelemetry-compliant single-line JSON logging everywhere.

**Why Not Alternatives**:

- ❌ Configure Consola for JSON: Consola doesn't support single-line JSON output
- ❌ Keep Consola for dev only: Creates environment drift and dual code paths
- ❌ Use pino/winston: Adds unnecessary complexity; we just need simple JSON output
- ✅ Direct stdout writes + OpenTelemetry format: Simple, standard, universal

**Implementation**:

```typescript
// UnifiedLogger writes OpenTelemetry format to any sink
const record = {
  Timestamp: new Date().toISOString(),
  ObservedTimestamp: new Date().toISOString(),
  SeverityNumber: 9, // INFO
  SeverityText: 'INFO',
  Body: 'Request completed',
  Attributes: { correlationId: 'req_123', duration: '1.23s' },
  Resource: {
    'service.name': 'oak-curriculum-mcp-http',
    'service.version': '0.5.0',
    'deployment.environment': 'production',
  },
};
process.stdout.write(JSON.stringify(record) + '\n');
```

**Benefits**:

- Universal compatibility (works with all log aggregation platforms)
- ~200KB smaller bundle (Consola removed)
- Single code path (no environment-specific logic)
- Future-proof (ready for OpenTelemetry SDK integration)
- Standard format (industry best practice)

**For More Details**: See ADR-051 (`docs/architecture/architectural-decisions/051-opentelemetry-compliant-logging.md`)

---

### Decision 7: Logger Architecture Refactoring (Critical - 2025-11-08)

**Problem**: During Session 3.B implementation, discovered critical architecture violations:

- `process.env` accessed directly in logger (violates DI principle)
- `process.stdout` in core files (should be Node-only)
- Tests mutating global `process.stdout.write` (should inject mocks)
- Multiple logger types instead of ONE logger with config variations
- Function complexity >8 (rule violation)

**Solution**: Complete architecture refactor with proper dependency injection

**Correct Architecture**:

```typescript
// Core Logger (Runtime-Agnostic)
packages/libs/logger/src/
├── unified-logger.ts       // ONE logger class, accepts sinks
├── otel-format.ts          // Pure formatting function
├── resource-attributes.ts  // Pure function (takes env object)
├── log-levels.ts          // Pure severity mapping
├── types.ts               // Shared interfaces
└── context-merging.ts     // Pure context merge

// Node Entry Point ONLY
packages/libs/logger/src/node.ts
export { UnifiedLogger, createLogger };
export { createNodeStdoutSink };  // Only place with process.stdout.write
export { createFileSink };         // Already correct

// Browser Entry Point
packages/libs/logger/src/index.ts
export { UnifiedLogger, createLogger };
export { createBrowserStdoutSink }; // Uses console API

// Application Layer (HTTP/Stdio servers)
apps/.../src/
├── runtime-config.ts      // Reads process.env ONCE
├── logging/index.ts       // Creates logger with injected config + sinks
└── handlers/              // Receive logger instance
```

**Key Refactoring Principles**:

1. **ONE Logger, Multiple Configurations**:

   ```typescript
   // Same UnifiedLogger class everywhere
   const logger = new UnifiedLogger({
     minSeverity: 9,
     resourceAttributes: buildResourceAttributes(env, 'my-service', '1.0.0'),
     context: {},
     stdoutSink: createNodeStdoutSink(), // Or null
     fileSink: createFileSink(config), // Or null
   });
   ```

2. **Dependency Injection Throughout**:

   ```typescript
   // ❌ BAD - Direct access
   function formatLog() {
     const version = process.env.npm_package_version;
     process.stdout.write(JSON.stringify(log) + '\n');
   }

   // ✅ GOOD - Injected dependencies
   function formatLog(message: string, resourceAttributes: ResourceAttributes): string {
     return JSON.stringify({ message, ...resourceAttributes });
   }

   // Sink receives formatted string
   stdoutSink.write(formatted);
   ```

3. **Test Safety**:

   ```typescript
   // ❌ BAD - Mutates global
   vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

   // ✅ GOOD - Injects mock
   const mockSink = { write: vi.fn() };
   const logger = new UnifiedLogger({
     /* config */
     stdoutSink: mockSink,
     fileSink: null,
   });
   expect(mockSink.write).toHaveBeenCalledWith(expect.stringContaining('INFO'));
   ```

4. **Node API Confinement**:

   ```typescript
   // packages/libs/logger/src/node.ts - ONLY place with Node APIs
   export function createNodeStdoutSink(): StdoutSink {
     return {
       write(line: string): void {
         process.stdout.write(line);
       },
     };
   }
   ```

5. **Pure Functions**:

   ```typescript
   // All core logic is pure (no side effects)
   export function formatOtelLogRecord(params: FormatParams): OtelLogRecord {
     // Pure transformation, no I/O
     return { Timestamp, SeverityText, Body, Attributes, Resource };
   }

   export function buildResourceAttributes(
     env: Record<string, string | undefined>,
     serviceName: string,
     serviceVersion: string,
   ): ResourceAttributes {
     // Pure function, no process.env access
     return { 'service.name': serviceName /* ... */ };
   }
   ```

**Implementation Impact**:

- Existing OTel format code is correct (pure functions)
- `adaptive.ts` and `adaptive-node.ts` need complete rewrite
- `stdout-sink.ts` needs to move to node.ts as factory function
- All tests updated to inject mocks, never mutate globals
- Applications updated to build config once and inject

**Benefits**:

- Passes all linting rules (no restricted globals)
- Testable without global mutation
- Works in any JS runtime (Deno, Cloudflare Workers, browser, Node)
- Single responsibility (functions ≤8 complexity)
- Clear boundaries (Node APIs only in node.ts)

**Why This Matters**:
The original Session 3.B plan failed because it violated fundamental project rules. This refactoring is MANDATORY before documentation, not optional cleanup. The logger must exemplify correct architecture for the entire project.

---

### Decision 4: No Type System Shortcuts

**Problem**: Type shortcuts (`any`, `as`, `Record<string, unknown>`) disable TypeScript's safety and create maintenance burden.

**Solution**: Strict type discipline with these rules:

1. All incoming data is `unknown`
2. Validate immediately with Zod
3. Never widen types after validation
4. Use specific types from generated SDK
5. Create type guards for runtime checks
6. No `as` casts ever

**Example Pattern**:

```typescript
// ❌ BAD - Type shortcut
function processData(data: any) {
  return data.someField;
}

// ✅ GOOD - Validated types
function processData(data: unknown): ProcessedData {
  const validated = DataSchema.parse(data);
  return {
    field: validated.someField,
  };
}
```

**Why Strict**:

- Catches bugs at compile time
- Enables refactoring confidence
- Self-documenting code
- Works with schema generation

---

## Type System Architecture

### Principle: Schema-First Execution

All types flow from OpenAPI schema in SDK:

```text
OpenAPI Schema (upstream)
  ↓ pnpm type-gen
  ↓
Generated Types & Zod Schemas (SDK)
  ↓ import
  ↓
Application Code (servers, tools)
```

**Rules**:

1. NEVER create ad-hoc types for curriculum data
2. ALL types must be generated from OpenAPI schema
3. If type doesn't exist, add it to schema FIRST
4. Use Zod for runtime validation
5. Type guards must derive from Zod schemas

**Example**:

```typescript
// ✅ GOOD - Uses generated types
import type { LessonPlan } from '@oaknational/oak-curriculum-sdk';
import { LessonPlanSchema } from '@oaknational/oak-curriculum-sdk/validation';

function processLesson(data: unknown): LessonPlan {
  return LessonPlanSchema.parse(data);
}

// ❌ BAD - Ad-hoc type
interface MyLessonType {
  id: string;
  // ... manually defined
}
```

---

## Execution Workflow (Step-by-Step)

### Starting a New Phase 2 Session

1. **Read documentation** (in order):
   - HANDOFF.md → big picture
   - This file → complete context
   - context.md → recent changes
   - Plan document → session details
   - Rules.md → standards

2. **Verify environment**:

   ```bash
   git status          # Should be clean
   git branch          # Should be feat/oauth_support
   pnpm qg             # Should be all green
   ```

3. **Review session objectives**:
   - Read session description in plan
   - Review acceptance criteria
   - Understand validation steps
   - Note dependencies

4. **Create implementation plan**:
   - Break session into tasks
   - Identify tests to write (TDD)
   - Note integration points
   - Estimate effort per task

5. **Execute TDD workflow**:
   - RED: Write failing test
   - GREEN: Minimal implementation
   - REFACTOR: Improve code
   - Repeat for each task

6. **Validate**:
   - Run package-specific quality gates
   - Run e2e tests
   - Manual verification
   - Check acceptance criteria

7. **Document**:
   - Update context.md with changes
   - Update continuation.prompt.md with insights
   - Update plan document (mark complete)
   - Commit with conventional commit message

---

## Non-Negotiables (Must Follow)

### Type Safety

- ❌ NEVER use: `any`, `as`, `Record<string, unknown>`, `Object.*`, `Reflect.*`
- ✅ ALWAYS: Specific types from SDK, type guards, Zod validation
- ✅ ALWAYS: Treat incoming data as `unknown`, validate immediately
- ✅ ALWAYS: Keep types specific (never widen after validation)

### Quality Gates

- ❌ NEVER disable or skip quality gate checks
- ❌ NEVER commit code that breaks quality gates
- ✅ ALWAYS run quality gates before committing
- ✅ ALWAYS fix issues immediately (don't accumulate debt)
- ✅ Order: `format → type-check → lint → test → build`

### Testing

- ✅ ALWAYS follow TDD (Red → Green → Refactor)
- ✅ ALWAYS write test first, then implementation
- ✅ ALWAYS test one thing per test
- ✅ ALWAYS use descriptive test names
- ❌ NEVER skip tests or mark as `.skip()`

### Documentation

- ✅ ALWAYS add TSDoc to every exported symbol
- ✅ ALWAYS update README when adding features
- ✅ ALWAYS update context docs after sessions
- ✅ ALWAYS include examples in documentation
- ✅ ALWAYS run markdownlint before committing

### Imports

- ✅ ALWAYS use public package exports (`@oaknational/mcp-logger`)
- ❌ NEVER use deep imports (`@oaknational/mcp-logger/src/...`)
- ✅ HTTP server: Use main entry (`@oaknational/mcp-logger`)
- ✅ Stdio server: Use Node entry (`@oaknational/mcp-logger/node`)

---

## Critical Patterns (With Examples)

### Pattern 1: Logger Creation (Transport-Specific)

```typescript
// HTTP Server (browser context)
import { createAdaptiveLogger } from '@oaknational/mcp-logger';

const logger = createAdaptiveLogger({
  name: 'http-server',
  level: config.logLevel,
  sinks: {
    stdout: true, // Required for Vercel
    file: false, // Not available in browser
  },
});

// Stdio Server (Node context)
import { createAdaptiveLogger } from '@oaknational/mcp-logger/node';

const logger = createAdaptiveLogger({
  name: 'stdio-server',
  level: config.logLevel,
  sinks: {
    stdout: false, // MUST be false (MCP protocol uses stdout)
    file: {
      path: '.logs/oak-curriculum-mcp/server.log',
      append: true,
    },
  },
});
```

### Pattern 2: Runtime Config with Dependency Injection

```typescript
// runtime-config.ts - Centralized config
import { z } from 'zod';

const EnvSchema = z.object({
  LOG_LEVEL: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR']).default('INFO'),
  USE_STUB_TOOLS: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  OAK_API_KEY: z.string().optional(),
});

export interface RuntimeConfig {
  readonly logLevel: string;
  readonly useStubTools: boolean;
  readonly env: {
    readonly OAK_API_KEY?: string;
  };
}

export function loadRuntimeConfig(source = process.env): RuntimeConfig {
  const env = EnvSchema.parse(source);
  return {
    logLevel: env.LOG_LEVEL,
    useStubTools: env.USE_STUB_TOOLS,
    env: {
      OAK_API_KEY: env.OAK_API_KEY,
    },
  };
}

// handler.ts - Receives config
export function createHandler(config: RuntimeConfig, logger: Logger) {
  if (config.useStubTools) {
    logger.info('Using stub tools');
    return stubHandler;
  }
  return liveHandler;
}

// test.ts - Injects test config
import { describe, it, expect } from 'vitest';

describe('handler', () => {
  it('uses stub tools when configured', () => {
    const config = {
      useStubTools: true,
      logLevel: 'DEBUG',
      env: {},
    };
    const handler = createHandler(config, mockLogger);
    expect(handler).toBe(stubHandler);
  });
});
```

### Pattern 3: TDD Workflow

```typescript
// 1. RED - Write failing test
describe('generateCorrelationId', () => {
  it('generates ID with correct format', () => {
    const id = generateCorrelationId();
    expect(id).toMatch(/^req_\d+_[a-f0-9]{6}$/);
  });
});

// Run test → FAILS (function doesn't exist)

// 2. GREEN - Minimal implementation
export function generateCorrelationId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');
  return `req_${timestamp}_${random}`;
}

// Run test → PASSES

// 3. REFACTOR - Improve without breaking test
import { randomBytes } from 'crypto';

export function generateCorrelationId(): string {
  const timestamp = Date.now();
  const random = randomBytes(3).toString('hex');
  return `req_${timestamp}_${random}`;
}

// Run test → STILL PASSES
// More crypto-secure, same behavior
```

---

## Anti-Patterns (Avoid These)

### ❌ Anti-Pattern 1: Type Shortcuts

```typescript
// ❌ BAD - Disables type safety
function process(data: any) {
  return data.field;
}

// ❌ BAD - Type assertion
const result = getData() as MyType;

// ❌ BAD - Too generic
const config: Record<string, unknown> = getConfig();

// ✅ GOOD - Specific types with validation
function process(data: unknown): ProcessedData {
  const validated = MySchema.parse(data);
  return { field: validated.field };
}
```

### ❌ Anti-Pattern 2: Direct Environment Access

```typescript
// ❌ BAD - Direct process.env in handler
export function handler() {
  const apiKey = process.env.OAK_API_KEY;
  if (process.env.USE_STUBS === 'true') {
    // ...
  }
}

// ✅ GOOD - Config injection
export function handler(config: RuntimeConfig) {
  const apiKey = config.env.OAK_API_KEY;
  if (config.useStubTools) {
    // ...
  }
}
```

### ❌ Anti-Pattern 3: Test Environment Pollution

```typescript
// ❌ BAD - Mutates global env
it('works with stubs', () => {
  process.env.USE_STUBS = 'true';
  const result = handler();
  expect(result).toBe(stubbed);
});

// ✅ GOOD - Config injection
it('works with stubs', () => {
  const config = createTestConfig({ useStubTools: true });
  const result = handler(config);
  expect(result).toBe(stubbed);
});
```

### ❌ Anti-Pattern 4: Skipping Tests

```typescript
// ❌ BAD - Disabled test
it.skip('this test is flaky', () => {
  // ...
});

// ✅ GOOD - Fix the test
it('generates unique correlation IDs', async () => {
  // Use proper async handling
  // Use deterministic mocks
  // Fix race conditions
});
```

---

## Quality Gate Baseline

**Current Status**: ✅ 2025-11-13 all quality gates passing after remediation

**Latest run (2025-11-13):**

- `pnpm build` ✅
- `pnpm format:root` ✅
- `pnpm markdownlint:root` ✅
- `pnpm type-check` ✅
- `pnpm lint` ✅
- `pnpm test:all` ✅ (738 tests passing)

**Remediation Summary (2025-11-13)**:

1. Removed unused `LoggedEntry` import
2. Fixed unsafe `any` assignments by eliminating intermediate variables
3. Refactored `src/index.ts` → extracted `app/bootstrap-helpers.ts` (reduced from 278 to 226 lines)
4. Fixed array type syntax and catch parameter typing
5. All tests passing, zero regressions

**Previous green sweep (2025-11-08, Session 2.5 validation):**

```bash
pnpm format-check:root        ✅ (Prettier)
pnpm markdownlint-check:root  ✅ (Markdown lint)
pnpm build                    ✅ (10 packages)
pnpm type-check               ✅ (10 workspaces)
pnpm lint                     ✅ (10 workspaces)
pnpm doc-gen                  ✅ (Typedoc)
pnpm test                     ✅ (738 tests, +38 instrumentation tests)
pnpm test:e2e                 ✅ (68 tests: HTTP 45, Stdio 12, SDK 11)
pnpm smoke:dev:stub           ✅ (Stub tools)
pnpm smoke:dev:live           ✅ (Live API)
pnpm qg                       ✅ (Runs all above)
```

**Test Count Breakdown**:

- **Phase 1 Baseline**: 700 tests
- **Session 2.1 Added**: +13 tests (HTTP correlation: 6 unit + 7 integration)
- **Session 2.2 Added**: +9 tests (Stdio correlation: 6 unit + 3 logger helpers)
- **Session 2.3 Added**: +7 tests (Logger timing: 4 unit + 3 HTTP timing integration)
- **Session 2.4 Added**: +12 tests (Error enrichment: 5 unit + 7 HTTP integration + 5 stdio integration)
- **Session 2.5 Added**: +0 tests (validation only, no new features)
- **Current Total**: 738 tests (confirmed in Session 2.5)

**Manual-Only Tests** (not in CI):

- `pnpm smoke:dev:live:auth` - Requires Clerk credentials

---

## Quick Reference Links

| Resource         | Path                                                | Purpose                                   |
| ---------------- | --------------------------------------------------- | ----------------------------------------- |
| **Plan**         | `.agent/plans/mcp-oauth-implementation-plan.md`     | Phase 2 sessions with acceptance criteria |
| **Context**      | `.agent/context/context.md`                         | Recent changes and current status         |
| **Handoff**      | `.agent/context/HANDOFF.md`                         | Big picture orientation                   |
| **Rules**        | `.agent/directives-and-memory/rules.md`             | Cardinal rules (MUST follow)              |
| **Testing**      | `docs/agent-guidance/testing-strategy.md`           | TDD workflow                              |
| **Logger**       | `packages/libs/logger/README.md`                    | Logger API and usage                      |
| **HTTP Server**  | `apps/oak-curriculum-mcp-streamable-http/README.md` | HTTP server docs                          |
| **Stdio Server** | `apps/oak-curriculum-mcp-stdio/README.md`           | Stdio server docs                         |
| **Rescue Plan**  | `.agent/plans/rescue-plan-2025-11-05.md`            | Git disaster recovery (historical)        |

---

## Current State Summary

**Repository Status**:

- ✅ Quality gates green (all passing as of 2025-11-13)
- ✅ `pnpm test` / `pnpm test:e2e` passing (738 unit/integration tests; 57 e2e as of 2025-11-12)
- ✅ Phase 1 complete and delivered
- ✅ Phase 2 complete and delivered (all 5 sessions)
- ✅ Runtime config consolidated
- ✅ Correlation IDs implemented in both servers
- ✅ Request timing instrumentation complete
- ✅ Error context enrichment complete
- ✅ Phase 2 validation and integration complete
- ✅ All documentation updated
- ✅ Runtime diagnostics complete (all 3 phases) 2025-11-13
- ✅ Quality gate remediation complete 2025-11-13
- ✅ Branch: `feat/oauth_support`
- 🚀 Ready for Phase 3 (Production Rollout & Monitoring)
- 🚀 Session 3.C staging deployment ready (no repo changes needed)

**Phase 1 Deliverables** (Complete 2025-11-05):

- ✅ Unified logger package with browser/Node entry points
- ✅ HTTP server migrated to shared logger (stdout-only)
- ✅ Stdio server migrated to shared logger (file-only)
- ✅ Runtime config centralized with DI pattern
- ✅ All tests updated to use config injection
- ✅ Full documentation suite updated

**Phase 2 Deliverables** (Complete 2025-11-08):

- ✅ Correlation ID module with `req_{timestamp}_{hex}` format
- ✅ HTTP middleware for correlation ID lifecycle management
- ✅ Stdio per-tool-invocation correlation
- ✅ Child logger pattern for correlation context
- ✅ X-Correlation-ID header propagation (HTTP)
- ✅ File-only correlated logging (stdio)
- ✅ Timing utilities with browser-safe `performance.now()`
- ✅ Request duration tracking for both HTTP and stdio
- ✅ Slow request warnings (2s HTTP, 5s stdio)
- ✅ Error context enrichment with `enrichError` function
- ✅ HTTP error middleware for enriched error logging
- ✅ Stdio error handlers for enriched error logging
- ✅ 38 new tests (13 HTTP correlation + 9 stdio correlation + 7 timing + 12 error enrichment)
- ✅ Comprehensive documentation with timing, error debugging, and filtering examples
- ✅ Full quality gate validation (Session 2.5)
- ✅ All documentation updated for Phase 2 completion

**Next Steps**:

1. ✅ **Runtime Diagnostics Track** (`.agent/plans/mcp-streamable-http-runtime-diagnostics-plan.md`) - **COMPLETE 2025-11-13**
   - ✅ Phase 1 instrumentation (bootstrap/auth timers with integration coverage)
   - ✅ Quality gate remediation complete
   - ✅ Phase 2 harness: built-server harness with config matrix and automated request testing
   - ✅ Phase 3 documentation: README and production-debugging-runbook updated

2. **Middleware Chain Documentation & Reordering** (✅ COMPLETE 2025-11-14)
   - ✅ Split setupAuthRoutes into setupGlobalAuthContext and setupAuthRoutes
   - ✅ Reordered middleware registration to ensure clerkMiddleware runs early
   - ✅ Created comprehensive middleware-chain.md documentation with diagrams
   - ✅ Updated deployment-architecture.md with middleware chain summary
   - ✅ All documentation reviewed and updated
   - ✅ Full quality gates passing (738 tests)

3. ⚠️ **CRITICAL: Header Redaction Test Coverage** (🔴 BLOCKER - Security Gap Identified)
   - **Problem**: Header redaction code (`src/logging/header-redaction.ts`) has ZERO test coverage
   - **Impact**: Security-critical feature protecting sensitive data (auth tokens, cookies, IPs) is unproven
   - **Requirement**: Comprehensive unit, integration, and E2E tests per TDD rules and testing strategy
   - **Priority**: MUST complete before Session 3.C staging deployment
   - **Test Suite Analysis Complete** (2025-11-14):
     - `pnpm test` ✅ 129 tests passing (74 streamable-http, 51 stdio, 4 providers)
     - `pnpm test:e2e` ✅ 57 tests passing
     - `pnpm test:e2e:built` ✅ 5 tests passing
     - `pnpm test:ui` ✅ 21 tests passing
     - `pnpm smoke:dev:stub` ✅ 6 assertions passing
     - **Total**: 218 tests across all suites, ALL PASSING
     - **Gap**: Header redaction code completely untested

4. **Session 3.C: Staging Deployment & Validation** (⏸️ BLOCKED until redaction tests complete)
   - Deploy HTTP server to staging environment
   - Validate log ingestion by observability platforms
   - Execute smoke tests against staging
   - Verify OpenTelemetry format compatibility
   - Validate correlation IDs, timing, error enrichment end-to-end
   - **BLOCKER**: Cannot deploy security-critical feature without comprehensive test coverage

5. **Session 3.D: Production Rollout & Observation** (After 3.C)
   - Gradual production rollout
   - Monitor log volume and costs
   - Establish dashboards and alerts
   - Iterate based on production feedback

**Completed Steps**:

- ✅ **Session 3.B: Logger Architecture** (2025-11-10)
  - Verified UnifiedLogger with OpenTelemetry format already in place
  - Verified Node.js APIs confined to node.ts
  - Verified zero lint errors across all packages
  - Verified tree-shaking working correctly
  - See `.agent/plans/logger-enhancement-plan.md` for full verification details

---

**Next Review**: Before starting Session 3.C staging rollout

**Last Updated**: 2025-11-13 (Runtime diagnostics complete; ready for Session 3.C staging)
