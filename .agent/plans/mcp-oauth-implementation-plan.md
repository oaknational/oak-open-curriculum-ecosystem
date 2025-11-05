<!-- markdownlint-disable -->

# MCP Observability Plan

**Status:** Phase 1 – logging consolidation complete (Tranche 1.5 delivered 2025-11-04)  
**Last Reviewed:** 2025-11-04 (post-quality-gate sweep)  
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
- [ ] Runtime configuration consolidation for HTTP/stdio servers (in progress)
- [ ] Phase 2 instrumentation design and Phase 3 rollout planning (now unblocked)

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

### Tranche 1.4 – Stdio Server Migration ✅ COMPLETE (2025-11-03)

**Goal:** Adopt the shared logger in the stdio server with a guaranteed file-only sink using Node.js-specific entry point.

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

## Transition Workstream – Runtime Config Consolidation (In Progress)

### Objective

Centralise all environment access behind explicit modules so application code and tests consume injected configuration instead of mutating `process.env`.

### Scope

- `apps/oak-curriculum-mcp-streamable-http`
- `apps/oak-curriculum-mcp-stdio`
- Shared test utilities touching MCP server configuration

### Deliverables

- [x] HTTP server exports a single `runtime-config` module that owns parsing and validation of environment variables (`src/runtime-config.ts` + `applyRuntimeEnvironment` hook)
- [x] Stdio server mirrors the pattern with its own runtime config module (`src/runtime-config.ts`, updated wiring/logger/stub resolvers)
- [ ] All application entry points accept configuration objects (via DI) rather than reading `process.env`
  - HTTP `createApp`/handlers and stdio `createServer` now inject `RuntimeConfig`; CLI/smoke harnesses still hydrate `process.env` directly (follow-up)
- [ ] Tests construct configuration via helpers/mocks without mutating global env state
  - HTTP and stdio unit/integration suites now build configs via helpers; e2e/smoke flows still mutate env pending refactor
- [ ] Documentation updated to describe the configuration injection boundary and how to mock it in tests

### Progress Notes

- Added `applyRuntimeEnvironment` to centralise Clerk-required env writes when bootstrapping the HTTP transport.
- Introduced stdio `RuntimeConfig` with derived `logLevel`/`useStubTools`, cascading through logging, wiring, and stub executor resolution.
- Updated unit tests across both transports to consume helpers instead of mutating `process.env`, eliminating the intermittent Vitest pollution in `streamable-http`.

### Validation

- [ ] Repo-wide `pnpm qg`
- [ ] Targeted `pnpm --filter <workspace> test` to confirm determinism (Vitest lacks `--runInBand`; single-threaded runs can be forced via config if needed)
- [ ] `rg "process\.env" apps/oak-curriculum-mcp-*` shows only the sanctioned config modules (pending e2e/smoke refactor)

---

## Phase 2 – Transport Instrumentation (Queued)

Focus on structured transport logs once logging foundations are stable.

### Session 2.A – Timing & Error Instrumentation

- [ ] Author integration tests covering normal, slow, and timed-out responses
- [ ] Implement timing hooks in transport layer
- [ ] Emit structured error logs with sanitised context
- [ ] Verify performance impact remains acceptable

### Session 2.B – Session Tracking & Correlation

- [ ] Introduce correlation IDs across request lifecycle
- [ ] Log session lifecycle events (connect, disconnect, errors)
- [ ] Extend integration tests to cover correlation flows
- [ ] Update documentation with tracing guidance

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

_Last updated: 2025-11-04 (Runtime config consolidation underway; Phase 2 queued)_
