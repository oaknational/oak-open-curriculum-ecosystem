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
- **Current state**: Gap analysis (2026-04-12c) identified 6 deviations
  between our Sentry adapter layer and canonical Sentry practices.
  Canonical alignment plan created and reviewed by 5 specialists
  (Fred, Wilma, Betty, sentry-reviewer, config-reviewer). Key findings:
  early init missing (HIGH), Express error handler not canonical
  (MEDIUM), adapter surface too narrow (MEDIUM). Sentry reviewer
  corrected two architecture assumptions: Express handler ordering and
  isolation scope model. Local credentials provisioned in 2026-04-12b.
- **Current objective**: Two parallel tracks: (1) Vercel credential
  provisioning + deployment evidence (closes parent plan), (2) Sentry
  canonical alignment implementation (new plan, can follow or parallel).
- **Hard invariants / non-goals**:
  - `SENTRY_MODE=off` is the default and kill switch
  - ADR-078 DI everywhere, ADR-143 observability architecture
  - `apps/oak-curriculum-mcp-stdio` is NOT an adoption target
  - MCP App UIs are NOT covered by Sentry (browser context, not server)
  - `sendDefaultPii: false` hardcoded — no override path
  - Adapter pattern preserved (redaction hooks + fixture mode justify it)
- **Recent surprises / corrections** (2026-04-12c):
  - Sentry Express error handler ordering: Sentry handler goes BEFORE
    custom error middleware (corrects Wilma's terminal-handler
    assumption — verified against official Sentry docs)
  - `@sentry/node` v8+ isolation scopes: per-request scope forking
    makes ambient `setUser()`/`setTag()` safe in concurrent Express
    (corrects Betty's `withScope` redesign — verified against official
    Sentry docs)
  - `tracePropagationTargets: []` is an active opt-out of the SDK
    default (propagate to everything), not a neutral default
  - Sentry now uses Debug IDs for source map matching, not
    release-based matching — mitigates release ID consistency risk
  - `Sentry.close()` is more appropriate than `flush()` for CLI
    (drains transport AND prevents further sends)
  - `instrument.ts` needs explicit tsup entry point and `--import` in
    both start script and dev runner
- **Open questions / low-confidence areas**:
  - Does tsup support `@sentry/bundler-plugin` for Debug ID injection?
  - Does `@sentry/profiling-node` native addon work on Vercel's ABI?
  - Trace propagation to ES and Oak API — security review needed
- **Next safe step**: Set Vercel credentials, then deployment evidence.
  Canonical alignment can begin in parallel (Gap 1 early init is
  highest priority).
- **Deep consolidation status**: completed this handoff — Search CLI
  adoption plan closed, canonical alignment plan created. Sentry
  corrections graduated to deployment runbook. Pattern extracted
  (domain-specialist-final-say). Stale auto-memory cleaned.

## Active Workstreams (2026-04-12)

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
