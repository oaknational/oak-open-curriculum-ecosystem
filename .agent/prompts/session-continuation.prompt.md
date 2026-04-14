---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-13
---

# Session Continuation

## Ground First

1. Read and internalise:
   - `.agent/directives/AGENT.md`
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Read `.agent/memory/distilled.md` and `.agent/memory/napkin.md`
3. Read the active plan for your workstream (see below)
4. Re-establish live branch state:

```bash
git status --short
git log --oneline --decorate -10
```

## This Prompt's Role

- Operational entry point only.
- Active plans are authoritative for scope, sequencing, acceptance criteria,
  and validation.
- If prompt text conflicts with active plans, active plans win.

## Future Strategic Watchlist

- Strategic only, not active for the current workstream:
  [cross-vendor-session-sidecars.plan.md](../plans/agentic-engineering-enhancements/future/cross-vendor-session-sidecars.plan.md)
  tracks a local-first, cross-vendor sidecar model for durable session
  metadata beyond vendor-native session titles.
- Strategic only, not active for the current workstream:
  [graphify-and-graph-memory-exploration.plan.md](../plans/agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md)
  tracks a pure-exploration lane for Graphify-inspired graph memory. No
  implementation path is chosen; explicit attribution with direct upstream
  links is required for any future adoption.

## Live Continuity Contract

- **Workstream**: Sentry + OTel Observability Foundation
  (`feat/otel_sentry_enhancements`). Main merged (PR #80).
  Sentry last mile (context enrichment + clean shutdown)
  implemented 2026-04-14. Build tooling evaluated and decided.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
    (**authoritative** — phases 0-3 complete, phase 4 pending
    Vercel credentials)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
    (10 of 15 todos done; 5 remaining: source-maps-automation,
    custom-metrics, cli-metrics, trace-propagation-es/oak-api,
    profiling-evaluation)
  - `~/.claude/plans/cuddly-swinging-ocean.md` (**approved** —
    Track 1: build tooling composability + Track 2: Sentry last
    mile. Track 2 phases 2A-2D implemented. Track 1 pending.)
  - `.agent/plans/sdk-and-mcp-enhancements/active/schema-resilience-and-response-architecture.plan.md`
    (**PENDING** — open questions, owner decisions needed)
  - `.agent/plans/sdk-and-mcp-enhancements/active/upstream-api-reference-metadata.plan.md`
    (**PENDING** — design complete, 7 todos, user-requested)
- **Current state**: **Sentry last mile session 2026-04-14**:
  3 more todos done (10 of 15 total). Provider-neutral types
  (`ObservabilityUser`, `ObservabilityFlushError`,
  `ObservabilityCloseError`) in `packages/core/observability/`.
  `HttpObservability`: `close()` + `setUser`/`setTag`/`setContext`
  added. All 3 shutdown paths use `close()`. `flush()` return type
  migrated to provider-neutral. MCP handler: `mcp.method` tag +
  user from Clerk. Tool handlers: `mcp.tool_name` tag. CLI:
  `withLoadedCliEnv` refactored to options bag, 5 call sites with
  command names. 14 files changed, ~300 insertions, ~70 deletions.
  All 1600+ tests pass, build + type-check green.
  **Build tooling decision**: keep tsup, add composable base config
  (`tsup.config.base.ts` with 3 factory functions), use sentry-cli
  post-build for source maps. Reviewed by Betty, Barney, Fred,
  assumptions-reviewer. Code-reviewer + sentry-reviewer approved
  implementation.
  **Uncommitted** — changes on disk, not yet committed.
- **Current objective**: Complete remaining items:
  (1) Address code-reviewer findings (enrichment call site tests,
  CLI `setTag` assertion, `close()` CLI test).
  (2) Source maps spike (sentry-cli, needs `SENTRY_AUTH_TOKEN`).
  (3) Build tooling composability (Track 1 — separate PR).
  (4) tsconfig `$schema` cleanup (~37 files).
- **Hard invariants / non-goals**:
  - `SENTRY_MODE=off` is the default and kill switch
  - ADR-078 DI everywhere, ADR-143 observability architecture
  - `apps/oak-curriculum-mcp-stdio` is NOT an adoption target
  - MCP App UIs are NOT covered by Sentry (browser context)
  - `sendDefaultPii: false` hardcoded — no override path
  - Adapter pattern preserved (redaction hooks + fixture mode)
  - No `as` casts — one known exception in `fakes.ts`
  - Search schemas stay `.strict()` (we control the index)
  - Provider-neutral types at app boundaries (not Sentry-specific)
- **Recent surprises / corrections** (2026-04-14):
  - **Fred: provider-neutral types MUST live in
    `packages/core/observability/`, not duplicated per app.** Single
    source of truth principle. Both apps import from
    `@oaknational/observability`.
  - **Fred: neutralise BOTH flush() AND close() error types.**
    Leaving flush() with `SentryFlushError` while adding close()
    with `ObservabilityCloseError` creates a half-neutral interface.
  - **Assumptions-reviewer: Track 1 does NOT block Track 2.**
    `sentry-cli` operates on emitted files, not build configs. The
    tracks are independent — false dependency removed.
  - **Barney: 3 factory functions, not 4.** Merge Pattern A (basic
    libs) and Pattern B (libs with externals) into single
    `createLibConfig(overrides?)`. The externals-vs-no-externals
    distinction is not a pattern boundary.
  - **Barney: turbo.json must add base config to ALL THREE build
    task input arrays** — default `build`, sdk-codegen override,
    HTTP app override. Missing any one causes stale cache hits.
  - **`$schema` in tsconfig.json is NOT inherited via `extends`.**
    Only `agent-tools/` has it. ~37 workspace tsconfig files need
    it added (both `tsconfig.json` and `tsconfig.build.json`).
  - **`buildObservabilityObject` exceeded 50-line limit** after
    adding enrichment methods. Extracted `createSentryDelegates` to
    `sentry-observability-delegates.ts` — delegation bridge is now
    a separately testable module.
  - Pre-existing from earlier sessions (unchanged):
    `.strict()` fragility, schema cache gap, third-party MCP
    bypass, `fakes.ts` cast, `setup-error-handlers` complexity.
- **Open questions / low-confidence areas**:
  - OQ1: `.strip()` vs `.passthrough()` for upstream response
    schemas — recommended `.strip()`, awaiting owner decision
  - OQ2: should `additionalProperties: false` be removed from
    JSON Schema output for response schemas?
  - OQ3: awaiting specific lesson slugs from third-party consumer
  - `fakes.ts` cast — architecturally correct solution?
  - Does `@sentry/profiling-node` native addon work on Vercel?
  - **Code-reviewer gap**: enrichment call sites in
    `mcp-handler.ts` and `handlers.ts` lack targeted test coverage.
    The plumbing is tested at the Sentry layer but the wiring
    (correct values under correct conditions) is not.
- **Next safe step**: Start next session with a decision gate on
  scope, then execute. All items below are included by default;
  trim at session start based on priorities and time.
  **Must fix before commit (5 items from 7-reviewer audit):**
  (1) Add enrichment tests for `mcp-handler.ts` (setTag/setUser)
  (2) Add enrichment test for `handlers.ts` (setTag tool_name)
  (3) Extract error mappers to `@oaknational/sentry-node` (Fred
  W-1 — adapter lib knows both sides of the boundary)
  (4) Unify auth extraction — reuse existing Zod
  `authInfoExtraSchema` in `mcp-handler.ts` instead of manual
  narrowing (assumptions + security reviewers)
  (5) Commit the implementation (protect ~300 insertions)
  **Should fix before commit (5 items):**
  (6) Assert `setTag` in `with-loaded-cli-env.unit.test.ts`
  (7) Add `close()` tests to both app test suites
  (8) Add direct tests for `sentry-observability-delegates.ts`
  (9) Extract `describeConfigError` to `sentry-node` (Fred W-2)
  (10) Add TSDoc on structural compatibility design choice
  **Follow-up items (decide at session start):**
  (11) Betty review: common interface extraction for
  `HttpObservability`/`CliObservability` (growing shared surface)
  (12) Wilma review: CLI without `@sentry/node/preload` — verify
  no failure modes in error capture for module-level code
  (13) Consider `mcp_request` structured context alongside tags
  for richer error detail view (sentry-reviewer suggestion)
  (14) Source maps spike: `sentry-cli sourcemaps inject` against
  tsup ESM output (5-minute test, needs `SENTRY_AUTH_TOKEN`)
  (15) Build tooling composability (Track 1): `tsup.config.base.ts`
  with 3 factory functions, migrate 17 configs, turbo.json, ADR-010
  amendment. Separate PR.
  (16) tsconfig `$schema` cleanup: add to ~37 files
  (17) Consolidate docs: extract build tooling decision to ADR-010,
  move non-repo plan content to repo plan
- **Deep consolidation status**: due — (1) build tooling decision
  exists only in `~/.claude/plans/cuddly-swinging-ocean.md` and
  napkin, needs extraction to ADR-010 amendment; (2) non-repo plan
  (`cuddly-swinging-ocean.md`) contains Track 1 implementation
  detail not captured in any repo plan. Not well-bounded for this
  closeout; next session should run `jc-consolidate-docs`.

## Active Workstreams (2026-04-14)

### 1. Sentry Canonical Alignment — PRIMARY

**Plan**: `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
**Parent**: `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`

10 of 15 todos done. Foundation (7) + last mile (3) complete.
Remaining 5: source-maps-automation (next, needs auth token),
custom-metrics, cli-metrics, trace propagation (2), profiling.
Context enrichment working: `mcp.method`, `mcp.tool_name`, user
from Clerk, `cli.command` tags. Provider-neutral types at
boundary. Build tooling decision: keep tsup + composable config.

### 1b. Build Tooling Composability — PLANNED

**Plan**: `~/.claude/plans/cuddly-swinging-ocean.md` (Track 1)

Keep tsup. Create `tsup.config.base.ts` at repo root with 3
factory functions (`createLibConfig`, `createSdkConfig`,
`createAppConfig`). Migrate 17 workspace configs. Update
turbo.json (3 build input arrays). Amend ADR-010. Separate PR.
Also: tsconfig `$schema` cleanup (~37 files).

### 2. Schema Resilience — PENDING (owner decision)

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/active/schema-resilience-and-response-architecture.plan.md`

Blocked on OQ1 (`.strip()` vs `.passthrough()`). Not active
until owner decides.

### 3. Other workstreams — PARKED

- Interactive User Search MCP App (WS3 Phase 5)
- `_meta` Namespace Cleanup
- Quality Gate Hardening (knip/depcruise done, ESLint remaining)
- Workspace Topology Exploration
- Upstream API Reference Metadata (design complete, 7 todos)

## Core Invariants

- Widget HTML is generated metadata — same codegen constant pattern
  as `WIDGET_URI`, tool descriptions, documentation content
- DI is always used — enables testing with trivial fakes (ADR-078)
- `principles.md` is the source of truth; rules operationalise it
- Separate framework from consumer in all new work
- Decompose at tensions rather than classifying around compromises
- Apps are thin interfaces over SDK/codegen capabilities

## Durable Guidance

- Run the required gates one at a time while iterating.
- Run `pnpm fix` to apply auto-fixes.
- Run `pnpm check` as the canonical aggregate readiness gate before
  push/merge. It includes `pnpm knip` and `pnpm depcruise`.
- Keep this prompt concise and operational; do not duplicate plan
  authority.
