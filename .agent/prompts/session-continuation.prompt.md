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
  (`feat/otel_sentry_enhancements`). Main merged (PR #80). HTTP
  method constants refactored. All code foundations complete.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
    (**authoritative** — phases 0-3 complete, phase 4 pending Vercel
    credentials)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
    (15 todos — original 12 + 3 from merge session: cli-log-level-di,
    cli-logger-di-audit, cli-shutdown-ordering)
  - `.agent/plans/architecture-and-infrastructure/active/search-cli-observability-adoption.plan.md`
    (**COMPLETE** — 10 steps executed 2026-04-12)
  - `.agent/plans/sdk-and-mcp-enhancements/active/schema-resilience-and-response-architecture.plan.md`
    (**PENDING** — open questions, owner decisions needed)
  - `.agent/plans/sdk-and-mcp-enhancements/active/upstream-api-reference-metadata.plan.md`
    (**PENDING** — design complete, 7 todos, user-requested)
  - `.agent/prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md`
    (**entry point** — restart sequence, current state, authority rule)
- **Current state**: Main (PR #80) merged. **Sentry canonical
  alignment session completed 2026-04-13**: 7 of 15 todos done
  (c8b66648). Gaps 1-3 implemented: preload, Express error handler
  (DI seam on CreateAppOptions, 5-reviewer pre-implementation
  review), adapter surface extension (setUser/setTag/setContext/
  close, 3 modes). CLI: close instead of flush, shutdown reordered,
  log level wired via DI. Logger DI audit: 15 singleton violations
  identified, remediation scoped. 20 new tests, 88/88 turbo tasks
  green. Schema resilience plan still awaiting owner decision OQ1.
- **Current objective**: **Sentry canonical alignment** continues
  with 8 remaining todos. Next priorities are downstream items
  that depend on the adapter extension: cli-context-enrichment,
  custom-metrics, cli-metrics. Secondary: cli-early-init (preload
  for CLI), trace propagation, profiling, source maps. The sentry
  closing reviewer also flagged adding close() to HttpObservability
  for HTTP server shutdown (currently uses flush()).
- **Hard invariants / non-goals**:
  - `SENTRY_MODE=off` is the default and kill switch
  - ADR-078 DI everywhere, ADR-143 observability architecture
  - `apps/oak-curriculum-mcp-stdio` is NOT an adoption target
  - MCP App UIs are NOT covered by Sentry (browser context, not server)
  - `sendDefaultPii: false` hardcoded — no override path
  - Adapter pattern preserved (redaction hooks + fixture mode justify it)
  - No `as` casts — one known exception in `fakes.ts` (not yet solved)
  - Search schemas stay `.strict()` (we control the index)
- **Recent surprises / corrections** (2026-04-13):
  - **`setupExpressErrorHandler` CANNOT go in `setupBaseMiddleware`.**
    5-reviewer pre-implementation review caught this: it runs before
    routes. Sentry docs require error handler AFTER all controllers.
    Moved to end of `setupPostAuthPhases` in `application.ts`.
  - **`@sentry/node` must be a direct dependency** for `--import`
    to resolve. pnpm strict hoisting means transitive deps are not
    accessible from the app workspace. Discovered during spike.
  - **`Logger.warn` does not accept `NormalizedError`** — only
    `Logger.error` has that overload. Catch block uses
    `normalizeError` then extracts `errorName`/`errorMessage`.
  - **Test-reviewer: no supertest for middleware composition tests.**
    Supertest is IO (creates HTTP server) — violates integration
    test rules. Test Express in-memory with mock objects instead.
  - Pre-existing from earlier sessions (unchanged):
    `.strict()` fragility, schema cache gap, third-party MCP
    bypass, `fakes.ts` cast.
- **Open questions / low-confidence areas**:
  - OQ1: `.strip()` vs `.passthrough()` for upstream response
    schemas — recommended `.strip()`, awaiting owner decision
  - OQ2: should `additionalProperties: false` be removed from
    JSON Schema output for response schemas?
  - OQ3: awaiting specific lesson slugs from third-party consumer
  - `fakes.ts` cast — architecturally correct solution?
  - **tsup + @sentry/esbuild-plugin incompatibility**: confirmed
    by assumptions-reviewer. GitHub egoist/tsup#1260. The
    plugin's glob phase runs before tsup writes to disk. Must
    use sentry-cli post-build instead, OR evaluate replacing
    tsup entirely with a standard build tool.
  - **Build tooling evaluation**: user has requested exploration
    of whether tsup should be replaced. Requirements: performant,
    standards-compliant, processes TS directly or via tsc, broad
    adoption, idiomatic. Next session should explore this.
  - Does `@sentry/profiling-node` native addon work on Vercel?
- **Next safe step**: Two parallel tracks for next session:
  (1) **Build tooling evaluation** — should tsup be replaced?
  This affects source maps (blocked by tsup#1260) and long-term
  infrastructure. Explore alternatives: esbuild directly, Rollup,
  tsc + bundler, or other standards-compliant options.
  (2) **Sentry last mile** (approved plan at
  `~/.claude/plans/expressive-zooming-thacker.md`): HTTP close()
  on shutdown, context enrichment (provider-neutral types, MCP
  handler + CLI command tags), source maps (contingent on build
  tooling decision). All 4 reviewers validated the plan.
- **Deep consolidation status**: completed this handoff —
  napkin entries written, distilled.md updated (supertest
  classification, pre-implementation review pattern count),
  plan todos updated, session prompt refreshed, findings
  recorded. Napkin at ~270 lines (under 500).

## Active Workstreams (2026-04-13)

### 1. Sentry Canonical Alignment — PRIMARY

**Plan**: `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
**Parent**: `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`

15 todos closing 6 gaps between Oak's Sentry integration and
canonical Node.js/Express patterns. All "NEXT PRIORITIES" are
local (no Vercel credentials needed). Sequencing: Gap 1 spike
→ Gap 1 + Gap 2 in parallel → Gap 3 → downstream items. Plan
preserves DI/testability/redaction invariants throughout.

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
