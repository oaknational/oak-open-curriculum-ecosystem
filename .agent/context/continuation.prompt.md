# Continuation Prompt: Oak MCP Observability Implementation

**Last Updated**: 2025-11-06 (Phase 2 Session 2.3 Complete)  
**Status**: ✅ Phase 1 Complete · ✅ Phase 2 Sessions 2.1, 2.2 & 2.3 Complete · 🚀 Ready for Session 2.4  
**Audience**: AI assistants in fresh contexts (optimized for complete context restoration)

---

## I'm Working On...

I'm continuing work on the Oak MCP Ecosystem observability implementation. This is a multi-phase project to:

1. **Phase 1 (✅ Complete)**: Consolidate logging across HTTP and stdio MCP servers into a unified, type-safe foundation
2. **Phase 2 (🚀 In Progress)**: Add transport instrumentation (correlation IDs, timing, error enrichment)
   - ✅ Session 2.1: HTTP Server Correlation IDs (Complete 2025-11-06)
   - ✅ Session 2.2: Stdio Server Correlation IDs (Complete 2025-11-06)
   - ✅ Session 2.3: Request Timing Instrumentation (Complete 2025-11-06)
   - 🔄 Session 2.4: Error Context Enrichment (Next)
3. **Phase 3 (Queued)**: Production rollout with monitoring and dashboards

**Current objective**: Execute Phase 2, Session 2.4 (Error Context Enrichment) with complete context from Sessions 2.1, 2.2 & 2.3.

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

```
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

```
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

**Current Status**: ✅ ALL GREEN (2025-11-06, Post Sessions 2.1, 2.2 & 2.3)

```bash
pnpm format-check:root        ✅ (Prettier)
pnpm markdownlint-check:root  ✅ (Markdown lint)
pnpm build                    ✅ (10 packages)
pnpm type-check               ✅ (10 workspaces)
pnpm lint                     ✅ (10 workspaces)
pnpm doc-gen                  ✅ (Typedoc)
pnpm test                     ✅ (726 tests, +26 instrumentation tests)
pnpm test:e2e                 ✅ (68 tests: HTTP 45, Stdio 12, SDK 11)
pnpm smoke:dev:stub           ✅ (Stub tools)
pnpm smoke:dev:live           ✅ (Live API)
pnpm qg                       ✅ (Runs all above)
```

**Test Count Breakdown**:

- **Phase 1 Baseline**: 700 tests
- **Session 2.1 Added**: +13 tests (HTTP correlation: 6 unit + 7 integration)
- **Session 2.2 Added**: +9 tests (Stdio correlation: 6 unit + 3 logger helpers)
- **Session 2.3 Added**: +4 tests (Logger timing: 4 unit) + 3 HTTP timing integration tests
- **Current Total**: 726 tests

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

- ✅ All quality gates green
- ✅ 726 tests passing across 10 workspaces (+26 instrumentation tests)
- ✅ Phase 1 complete and delivered
- ✅ Phase 2 Sessions 2.1, 2.2 & 2.3 complete
- ✅ Runtime config consolidated
- ✅ Correlation IDs implemented in both servers
- ✅ Request timing instrumentation complete
- ✅ All changes committed and pushed
- ✅ Branch: `feat/oauth_support`
- 🚀 Ready for Phase 2, Session 2.4 (Error Context Enrichment)

**Phase 1 Deliverables** (Complete 2025-11-05):

- ✅ Unified logger package with browser/Node entry points
- ✅ HTTP server migrated to shared logger (stdout-only)
- ✅ Stdio server migrated to shared logger (file-only)
- ✅ Runtime config centralized with DI pattern
- ✅ All tests updated to use config injection
- ✅ Full documentation suite updated

**Phase 2 Sessions 2.1, 2.2 & 2.3 Deliverables** (Complete 2025-11-06):

- ✅ Correlation ID module with `req_{timestamp}_{hex}` format
- ✅ HTTP middleware for correlation ID lifecycle management
- ✅ Stdio per-tool-invocation correlation
- ✅ Child logger pattern for correlation context
- ✅ X-Correlation-ID header propagation (HTTP)
- ✅ File-only correlated logging (stdio)
- ✅ Timing utilities with browser-safe `performance.now()`
- ✅ Request duration tracking for both HTTP and stdio
- ✅ Slow request warnings (2s HTTP, 5s stdio)
- ✅ 26 new tests (13 HTTP correlation + 9 stdio correlation + 4 timing)
- ✅ Comprehensive documentation with timing and filtering examples

**Next Steps**:

1. Begin Phase 2, Session 2.4: Error Context Enrichment
   - Create error context enrichment module
   - Add correlation ID and timing to error logs
   - Enhance error responses with debugging context
   - Update documentation with error debugging patterns
2. Follow plan document session breakdown
3. Maintain TDD discipline
4. Keep quality gates green

---

**Next Review**: Before beginning Phase 2, Session 2.4

**Last Updated**: 2025-11-06 (Post Phase 2 Sessions 2.1, 2.2 & 2.3 completion)
