---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-12
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

## Live Continuity Contract

- **Workstream**: Sentry + OTel Observability Foundation
  (`feat/otel_sentry_enhancements`). All code foundations complete.
  Local credentials provisioned. Canonical alignment plan created.
  Vercel credentials and deployment evidence remain.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
    (**authoritative** — phases 0-3 complete, phase 4 pending Vercel
    credentials)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
    (**new** — 6 gaps, 10 todos, 5 specialist reviewers, ready for
    implementation)
  - `.agent/plans/architecture-and-infrastructure/active/search-cli-observability-adoption.plan.md`
    (**COMPLETE** — 10 steps executed 2026-04-12)
  - `.agent/prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md`
    (**entry point** — restart sequence, current state, authority rule)
- **Current state**: Main (PR #80) merged. Knip violations from merge
  fixed. All code foundations complete. Local credentials provisioned.
- **Current objective**: Two parallel tracks: (1) Vercel credential
  provisioning + deployment evidence (closes parent plan), (2) Sentry
  canonical alignment implementation.
- **Hard invariants / non-goals**:
  - `SENTRY_MODE=off` is the default and kill switch
  - ADR-078 DI everywhere, ADR-143 observability architecture
  - `apps/oak-curriculum-mcp-stdio` is NOT an adoption target
  - MCP App UIs are NOT covered by Sentry (browser context, not server)
  - `sendDefaultPii: false` hardcoded — no override path
  - Adapter pattern preserved (redaction hooks + fixture mode justify it)
- **Next safe step**: Set Vercel credentials, then deployment evidence.
  Canonical alignment can begin in parallel.
- **Deep consolidation status**: not due.

## Active Workstreams (2026-04-12)

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

### 4. Workspace Topology Exploration — FUTURE

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
