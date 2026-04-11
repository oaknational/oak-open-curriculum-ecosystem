---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-10
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
  (`feat/otel_sentry_enhancements`). Merge complete, Search CLI
  adoption is next.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
    (**authoritative** — phases 0-3 HTTP complete, Search CLI next)
  - `.agent/prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md`
    (**entry point** — restart sequence, current state, authority rule)
- **Current state**: Main merged into branch (commits `da26c4bf`,
  `9e6ed327`). PR #76 (React MCP App, 977 files), PR #78 (open
  education, ADR-157), releases 1.3.0-1.5.0 all integrated. ADR-144
  renumbered to ADR-158. Rate limiting re-applied with extracted
  `CoreEndpointOptions` (breaks circular import). `pnpm check` passes.
  6 specialist reviewers complete, all findings addressed. Integration
  sweep confirms no main work lost.
- **Current objective**: Search CLI observability adoption — 6 critical
  gaps (no Sentry init, no sinks, no env config, no command spans,
  no flush, no error capture).
- **Hard invariants / non-goals**:
  - `SENTRY_MODE=off` is the default and kill switch
  - No `vi.mock`, no `process.env` mutation in tests
  - TDD at all levels, Result pattern for config/init
  - ADR-078 DI everywhere, ADR-143 observability architecture
  - CLI observability is lighter than HTTP (no MCP wrapping needed)
  - Owner configures real Sentry DSN after all code foundations land
  - `apps/oak-curriculum-mcp-stdio` is NOT an adoption target
- **Recent surprises / corrections** (2026-04-11):
  - `sed` sweep for ADR renumbering caught main's ADR-144 (Two-Threshold)
    references — must use targeted file lists, not blanket sweeps
  - `mcp-rate-limit.integration.test.ts` timed out because it lacked
    `upstreamMetadata` DI — `createApp` tries to fetch Clerk metadata
    over the network without it
  - Prettier reformats compact function calls, so `max-lines-per-function`
    compliance must be checked after formatting, not before
  - `max-lines: 250` is enforced via shared `recommended` config in
    `@oaknational/eslint-plugin-standards`, not workspace-level config
- **Open questions / low-confidence areas**:
  - CLI observability: whether `SearchCliEnvLoader` should carry the
    `observability` instance (convenient) or whether it should be
    passed separately (more explicit). Plan recommends loader approach.
  - `app/` directory still lacks barrel `index.ts` (Barney finding) —
    acceptable as fast-follow, not blocking
- **Next safe step**: Search CLI adoption per Part 2 of the session
  plan. Start with Step 0 (add `@oaknational/sentry-node` dep) and
  Step 1 (extend env schema with `SentryEnvSchema`, TDD).
- **Deep consolidation status**: not due — session was merge execution
  and reviewer fixes, no new doctrine or patterns to graduate. Napkin
  is 160 lines (well under threshold).

## Active Workstreams (2026-04-11)

### 1. Vercel Widget Crash Fix — COMPLETE

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/archive/completed/embed-widget-html-at-build-time.plan.md`

All phases executed. Widget HTML is now a committed TypeScript
constant (`src/generated/widget-html-content.ts`), consumed via
DI (ADR-156). Filesystem-based code deleted. All quality gates
green. ADR-156 created and indexed. The branch is 4 commits ahead
of origin locally; next step is push plus Vercel preview
verification.

### 2. WS3 MCP App Rebuild — MERGE PENDING

**Parent plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`

Local gates green on `feat/mcp_app_ui`. Widget crash fix complete
locally and committed. Next: push, verify Vercel preview, then
merge.
Phase 5 (interactive user search view) queued post-merge.

### 3. Frontend Practice Integration — COMPLETE

**Plan**: `.agent/plans/agentic-engineering-enhancements/archive/completed/frontend-practice-integration-and-specialist-agents.plan.md`

Complete. Three ADR-129 agent triplets (accessibility-reviewer,
design-system-reviewer, react-component-reviewer) with full platform
adapters. Three review rounds passed. Design token infrastructure
cancelled as out of scope — belongs in WS3 or a dedicated plan.

### 4. Continuity Adoption — COMPLETE

**Plan**: `.agent/plans/agentic-engineering-enhancements/archive/completed/continuity-and-surprise-practice-adoption.plan.md`

Wave 1 closed with an explicit `promote` decision on 3 April 2026. The
outgoing continuity note landed and the same-day Practice Core promotion is
recorded separately in `.agent/practice-core/*`.

### 5. Assumptions Reviewer — COMPLETE

ADR-146 accepted, triplet deployed, platform adapters created.

### 6. URL Naming Collision Remediation — COMPLETE

Completed 2026-04-01.

### 7. Workspace Topology Exploration — FUTURE

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md`

Four-tier layered architecture (primitives, infrastructure, codegen-time,
runtime). Lifecycle classification of all workspaces complete. Phase 2
(function-level analysis with knip + dependency-cruiser) pending.
Informed by the Oak Surface Isolation Programme
(`.agent/plans/architecture-and-infrastructure/future/oak-surface-isolation-and-generic-foundation-programme.plan.md`).

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
- Run `pnpm check` as the canonical aggregate readiness gate before push/merge.
- Keep this prompt concise and operational; do not duplicate plan authority.
