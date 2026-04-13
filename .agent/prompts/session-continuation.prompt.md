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
- **Current state**: Main (PR #80) merged. Schema resilience plan
  created and integrated into discovery surfaces (2026-04-13) —
  awaiting owner decision on OQ1 (`.strip()` vs `.passthrough()`).
  Pre-commit hook fixed: `--output-logs=errors-only` + error guard
  on turbo step. Two commits on `feat/otel_sentry_enhancements`
  ahead of remote. Separate strategic Graphify exploration is now
  parked in a future plan plus research report for later revisit.
- **Current objective**: Three tracks: (1) Vercel credential
  provisioning + deployment evidence (closes parent plan), (2) Sentry
  canonical alignment implementation (15 todos), (3) schema
  resilience plan — OQ1 decision then `.strip()` migration,
  schema drift health endpoint, `additionalContext` flag.
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
  - **`.strict()` on all Zod response schemas is a latent fragility.**
    All generated response schemas use `.strict()` via
    `strictObjects: true` in codegen. Upstream API adding any field
    breaks validation. Not currently reproducible but third-party
    consumer hit it and disabled three tools.
  - **Schema cache version-only comparison is a gap.** The upstream
    API can change response shapes without bumping `info.version`.
    `schema-cache.ts` only diffs the version string.
  - **Third-party consumer bypassed MCP SDK entirely.** They use raw
    `fetch()` + SSE parsing and strip `oakContextHint`, `status`,
    and the `data` envelope — signals that our response wrapper adds
    friction for machine consumers.
  - **Pre-commit hook turbo step lacked output control and error
    guard.** Cached log replay (7000+ lines) overwhelmed git hook
    subprocess pipe. Fixed with `--output-logs=errors-only` and
    `if/fi` guard. Cursor-specific: `git commit` needs `| cat`.
  - `fakes.ts` `as OakApiPathBasedClient` cast: not yet solved.
    Generated type requires all 27 paths, tests provide 1.
- **Open questions / low-confidence areas**:
  - OQ1: `.strip()` vs `.passthrough()` for upstream response schemas
    — recommended `.strip()`, awaiting owner decision
  - OQ2: should `additionalProperties: false` be removed from JSON
    Schema output for response schemas?
  - OQ3: awaiting specific lesson slugs from third-party consumer
  - `fakes.ts` cast — what is the architecturally correct solution?
  - Does tsup support `@sentry/bundler-plugin` for Debug ID injection?
  - Does `@sentry/profiling-node` native addon work on Vercel's ABI?
- **Next safe step**: Three tracks: (1) Sentry canonical alignment
  local priorities: `cli-log-level-di`, `cli-shutdown-ordering`,
  `early-init-http`, `express-error-handler`, `adapter-surface-extension`.
  All local, no Vercel credentials needed. (2) Schema resilience:
  resolve OQ1, then implement `.strip()` migration in codegen. (3)
  Upstream API reference metadata: design complete, 7 todos pending.
  Vercel credential provisioning deferred until local work is complete.
- **Deep consolidation status**: completed this handoff —
  graph-memory future plan added to the session watchlist,
  stable attribution preference graduated to `AGENTS.md`, and
  `pnpm practice:fitness:informational` rerun. Remaining fitness
  debt is still deferred in `.agent/directives/principles.md`,
  `.agent/directives/testing-strategy.md`, and
  `.agent/memory/distilled.md`.

## Active Workstreams (2026-04-13, updated session handoff)

### 1. Interactive User Search MCP App (WS3 Phase 5) — NEXT

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-5-interactive-user-search-view.plan.md`

Build the user-facing interactive search widget. Two new pre-phase
blockers: (a) remove `search` tool's false `_meta.ui` claim,
(b) consolidate to single user-facing search tool.

### 2. `_meta` Namespace Cleanup — NOT STARTED (co-requisite)

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/current/meta-oak-namespace-cleanup.plan.md`

Replace unused `_meta.securitySchemes` with Oak-namespaced `oak-www`
and `oak-guidance` fields. Includes `buildToolMeta()` factory.
Co-requisite for Phase 5 — both address `_meta` architecture.

### 3. Quality Gate Hardening — parked

**Plan**: `.agent/plans/architecture-and-infrastructure/current/quality-gate-hardening.plan.md`

Knip and depcruise complete. Remaining: ESLint config standardisation,
eslint-disable remediation. Parked while MCP Apps work takes priority.

### 4. Schema Resilience and Response Architecture — PENDING (open questions)

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/active/schema-resilience-and-response-architecture.plan.md`

Upstream schema validation fragility exposed by third-party consumer.
OQ1 (`.strip()` vs `.passthrough()`) requires owner decision before
implementation. Schema drift health endpoint (Sentry-monitored),
`additionalContext` flag, and `upstreamApi` metadata are dependent
follow-ons. Vercel deploy hook for auto-rebuild noted as future.

### 5. Workspace Topology Exploration — FUTURE

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md`

Four-tier layered architecture. Lifecycle classification complete.
Phase 2 pending.

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
  push/merge. It now includes `pnpm knip`. After depcruise Phase 4,
  it will also include `pnpm depcruise`.
- Keep this prompt concise and operational; do not duplicate plan
  authority.
