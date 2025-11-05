# Repository Rescue Plan – 2025-11-05

**Status**: 🚨 ACTIVE  
**Created**: 2025-11-05  
**Trigger**: Git disaster recovery resulted in inconsistent state  
**Goal**: Restore stdio server to working state, validate logging consolidation, then resume Phase 2 work

## Executive Summary

Following a destructive git operation and partial recovery from dangling blobs, the stdio server is in a **broken state**. The logging modules were partially migrated to the new runtime-config pattern but critical files are missing and the old logger is still in use. The HTTP server is intact. This plan restores consistency and validates the Phase 1 logging consolidation baseline before resuming the main implementation plan.

---

## What Went Wrong

### Discovered Issues

1. **Missing Module**: `apps/oak-curriculum-mcp-stdio/src/runtime-config.ts` does not exist but is imported by 3 files
2. **Dual Logger**: Stdio server has a new shared-logger implementation in `src/logging/` (unused) and old bespoke logger in `src/app/wiring.ts` (active)
3. **Stale Build**: `dist/` folder contains old artifacts that don't match current source signatures
4. **Planning Docs Out of Sync**: Tranche 1.4 marked complete but stdio migration never finished
5. **Type System Broken**: Type-check and build will fail due to missing imports

### Root Cause

Git disaster recovery restored:

- ✅ New logging modules expecting RuntimeConfig
- ✅ Updated tests expecting new pattern
- ❌ Missing runtime-config.ts that ties it together
- ❌ Old wiring.ts still using bespoke logger
- ❌ Planning docs incorrectly marked complete

The recovery got **newer** code (logging modules) mixed with **older** code (wiring.ts), creating an inconsistent intermediate state that was never meant to exist.

---

## Recovery Strategy

We will:

1. Create the missing `runtime-config.ts` for stdio server
2. Complete the stdio logger migration by updating `wiring.ts`
3. Clean and rebuild to clear stale artifacts
4. Validate the complete logging consolidation baseline
5. Update planning documents to reflect actual state
6. Hand off back to main plan for Phase 2 work

**Principle**: Fix forward, don't revert. The new logging modules are correct; we just need to complete the migration.

---

## Rescue Tranches

### Tranche R.1 – Create Missing Runtime Config Module

**Goal**: Restore the missing `runtime-config.ts` that stdio logging modules depend on.

#### Tasks

- [ ] Create `apps/oak-curriculum-mcp-stdio/src/runtime-config.ts` with:
  - `RuntimeConfig` interface matching usage in `logging/` modules
  - Required properties: `logLevel: string`, `env: { MCP_LOGGER_STDOUT?: string, MCP_LOGGER_FILE_PATH?: string, MCP_LOGGER_FILE_APPEND?: string, LOG_LEVEL?: string }`
  - Optional properties: `useStubTools: boolean` (for future use)
  - `loadRuntimeConfig(source?: NodeJS.ProcessEnv): RuntimeConfig` function
  - Validate LOG_LEVEL against allowed values
  - Parse environment variables without throwing (use defaults)
- [ ] Ensure no Zod dependency if not already in stdio package.json (keep it simple, manual validation OK)
- [ ] Match HTTP server's pattern but adapted for stdio needs (no auth config)

#### Acceptance Criteria

- File exists at `apps/oak-curriculum-mcp-stdio/src/runtime-config.ts`
- Exports `RuntimeConfig` interface
- Exports `loadRuntimeConfig()` function
- Properties match what `logging/config.ts` and `logging/index.ts` expect
- No type errors in logging modules

#### Validation Steps

```bash
# Run in order, each must pass
pnpm --filter @oaknational/oak-curriculum-mcp-stdio type-check
```

---

### Tranche R.2 – Complete Stdio Logger Migration

**Goal**: Replace bespoke logger in `wiring.ts` with shared logger from `@oaknational/mcp-logger/node`.

#### Tasks

- [ ] Update `src/app/wiring.ts`:
  - Import `Logger` from `@oaknational/mcp-logger/node` (NOT local definition)
  - Import `createStdioLogger` from `../logging/index.js`
  - Import `loadRuntimeConfig` from `../runtime-config.js`
  - Remove lines 14-113 (bespoke logger implementation: `mapLogLevelToIndex`, `formatLogMessage`, `makeLoggerMethods`, `createLogger`)
  - Update `wireDependencies()` to call `createStdioLogger(runtimeConfig)` instead of `createLogger()`
  - Keep the `coreLogger` adapter (lines 162-181) that wraps for SDK - this is correct
- [ ] Update `src/app/wiring.ts` imports to remove local `Logger` interface export
- [ ] Update `src/app/server.ts` to import `Logger` from `@oaknational/mcp-logger/node` instead of local `./wiring.js`
- [ ] Update `src/app/tool-response-handlers.ts` to import `Logger` from `@oaknational/mcp-logger/node` instead of `./wiring.js`
- [ ] Keep `ServerConfig` interface in wiring.ts (it's still valid, just logger creation changes)

#### Acceptance Criteria

- `wiring.ts` no longer defines its own `Logger` interface
- `wiring.ts` no longer has bespoke logger implementation functions
- `wiring.ts` calls `createStdioLogger()` from shared logging module
- `server.ts` and `tool-response-handlers.ts` import `Logger` from `@oaknational/mcp-logger/node`
- All logger calls go through shared logger (file-only, no stdout pollution)
- No type errors

#### Validation Steps

```bash
# Run in order, each must pass
pnpm --filter @oaknational/oak-curriculum-mcp-stdio type-check
pnpm --filter @oaknational/oak-curriculum-mcp-stdio lint
```

---

### Tranche R.3 – Clean Build and Unit Tests

**Goal**: Clear stale artifacts and validate stdio server builds and tests pass.

#### Tasks

- [ ] Clean stdio workspace build artifacts
- [ ] Rebuild stdio workspace
- [ ] Run unit tests to validate logger integration
- [ ] Verify no process.env mutations in unit tests (should use config helpers)

#### Acceptance Criteria

- Build produces fresh artifacts in `dist/`
- Build signatures match current source (check `dist/logging/index.d.ts` vs `src/logging/index.ts`)
- All unit tests pass
- No test pollution or flaky failures

#### Validation Steps

```bash
# Run in order, each must pass
pnpm --filter @oaknational/oak-curriculum-mcp-stdio clean
pnpm --filter @oaknational/oak-curriculum-mcp-stdio build
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test
```

---

### Tranche R.4 – Integration and E2E Validation

**Goal**: Validate stdio server works end-to-end with shared logger and file-only output.

#### Tasks

- [ ] Run e2e tests to validate MCP protocol compliance
- [ ] Verify log file is written to expected location
- [ ] Verify stdout is clean (no log pollution in MCP protocol stream)
- [ ] Confirm tool execution works through the integrated logger

#### Acceptance Criteria

- All e2e tests pass
- Log file exists and contains structured log entries
- Stdout contains ONLY MCP protocol JSON-RPC messages
- No console.error/console.warn in stdout during normal operation (startup logger to stderr is OK)

#### Validation Steps

```bash
# Run in order
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test:e2e

# Manual verification
# 1. Run server with: OAK_API_KEY=test LOG_LEVEL=debug node dist/bin/oak-curriculum-mcp.js
# 2. Send test request (via MCP inspector or test client)
# 3. Check .logs/oak-curriculum-mcp/ for log file
# 4. Verify stdout shows only JSON-RPC frames
```

---

### Tranche R.5 – Repository-Wide Quality Gates

**Goal**: Validate the full repository is in a consistent, working state.

#### Tasks

- [ ] Run full quality gate suite from repo root
- [ ] Validate HTTP server still works (regression check)
- [ ] Validate logger package still works (regression check)
- [ ] Confirm no cross-workspace type errors

#### Acceptance Criteria

- All format checks pass
- All type checks pass (entire monorepo)
- All lint checks pass
- All markdownlint checks pass
- All unit tests pass (all workspaces)
- All e2e tests pass (all workspaces)
- All smoke tests pass (stub and live)
- `pnpm qg` succeeds end-to-end

#### Validation Steps

```bash
# Run from repo root
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

# Or all at once
pnpm qg
```

---

### Tranche R.6 – Documentation and Handoff

**Goal**: Update planning documents to reflect actual state and prepare clean handoff.

#### Tasks

- [ ] Update `.agent/context/context.md`:
  - Change "Updated" date to 2025-11-05
  - Add "Recent Milestones" entry documenting the rescue and validation
  - Update "Next Steps" to remove runtime config wrap-up (now complete)
  - Mark rescue plan as complete
- [ ] Update `.agent/context/continuation.prompt.md`:
  - Update "Last Updated" to 2025-11-05
  - Update "Current State" to reflect completed Phase 1 + rescue
  - Update "Immediate Plan" to start with Phase 2 instrumentation
  - Remove runtime config wrap-up section
- [ ] Update `.agent/plans/mcp-oauth-implementation-plan.md`:
  - Mark Tranche 1.4 ✅ COMPLETE with note about rescue (2025-11-05)
  - Mark runtime config consolidation section ✅ COMPLETE (2025-11-05)
  - Update "Last Reviewed" date
  - Add reference to this rescue plan in a new "Incident Response" section
- [ ] Create summary of rescue in context docs for future agent reference

#### Acceptance Criteria

- All context files reflect 2025-11-05 completion state
- Main plan clearly shows Phase 1 complete, Phase 2 ready to begin
- Rescue plan linked from main plan for future reference
- "Next Steps" in context.md begins with Phase 2 work
- No references to incomplete runtime config work

#### Validation Steps

- Manual review: Read updated context docs end-to-end
- Verify dates updated
- Verify status markers correct
- Verify handoff is clear: "Phase 1 complete, begin Phase 2"

---

## Acceptance Criteria (Overall)

The rescue is complete when ALL of these are true:

1. ✅ `apps/oak-curriculum-mcp-stdio/src/runtime-config.ts` exists and exports required types/functions
2. ✅ `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts` uses shared logger from `@oaknational/mcp-logger/node`
3. ✅ Stdio server has zero bespoke logger code
4. ✅ Stdio server imports `Logger` type from shared package, not local definitions
5. ✅ All stdio unit tests pass
6. ✅ All stdio e2e tests pass
7. ✅ Stdio server writes logs to file only (no stdout pollution)
8. ✅ Full repo `pnpm qg` passes
9. ✅ HTTP server still works (regression check)
10. ✅ Logger package still works (regression check)
11. ✅ Planning documents updated to reflect 2025-11-05 completion
12. ✅ No references to incomplete work in context docs

---

## Validation Evidence Log

Record outcomes here as tranches complete:

### Tranche R.1 Evidence

```
[To be filled during execution]
```

### Tranche R.2 Evidence

```
[To be filled during execution]
```

### Tranche R.3 Evidence

```
[To be filled during execution]
```

### Tranche R.4 Evidence

```
[To be filled during execution]
```

### Tranche R.5 Evidence

```
[To be filled during execution]
```

### Tranche R.6 Evidence

```
[To be filled during execution]
```

---

## Handoff Protocol

**When all tranches are complete and validated:**

1. Mark this rescue plan status as `✅ COMPLETE`
2. Update `.agent/context/context.md` to reflect Phase 1 fully complete (2025-11-05)
3. Return to `.agent/plans/mcp-oauth-implementation-plan.md`
4. Begin **Phase 2 – Transport Instrumentation** work
5. The goal (better debug logging in SDK/HTTP, consistency in stdio) is now achieved

**The next agent should:**

- Read `.agent/context/continuation.prompt.md` (will be updated to reflect rescue completion)
- Proceed directly to Phase 2, Session 2.A (Timing & Error Instrumentation)
- NOT revisit logging consolidation or runtime config (it's done)

---

## References

- 🛟 **RECOVERY**: `.agent/RECOVERY.md` – Instructions to restore safety snapshot if rescue fails
- **Main Plan**: `.agent/plans/mcp-oauth-implementation-plan.md`
- **Context Snapshot**: `.agent/context/context.md`
- **Continuation Prompt**: `.agent/context/continuation.prompt.md`
- **Audit Report**: See conversation history 2025-11-05 for detailed findings
- **Logger Docs**: `packages/libs/logger/README.md`
- **HTTP Server**: `apps/oak-curriculum-mcp-streamable-http/` (reference implementation)

---

## Safety Snapshot

Before executing this rescue plan, a complete safety snapshot was created:

- **Branch**: `safety/pre-rescue-2025-11-05`
- **Commit**: `66e6115`
- **Files**: 66 files changed, 5773 insertions, 1479 deletions
- **Recovery**: See `.agent/RECOVERY.md` for restore instructions

If anything goes wrong during rescue operations, you can restore this exact state by running:

```bash
git checkout safety/pre-rescue-2025-11-05
```

---

**Rescue Plan Owner**: Current Agent Session  
**Next Review**: After Tranche R.5 completes (before documentation updates)  
**Escalation**: If any tranche fails validation, stop and reassess before proceeding
