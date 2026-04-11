---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-11h
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

- **Workstream**: Quality gate hardening — knip triage and
  remediation.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/knip-triage-and-remediation.plan.md`
    (**PRIMARY** — 904 knip findings captured, 5-phase triage plan
    created, all phases pending)
  - `.agent/plans/architecture-and-infrastructure/current/quality-gate-hardening.plan.md`
    (**PARENT** — promoted from future/ to current/, owner decisions
    resolved, ADR-121 reconciled, `enable-knip` item in progress)
  - `.agent/plans/sdk-and-mcp-enhancements/active/open-education-knowledge-surfaces.plan.md`
    (**PARKED** — WS-0/1/2 done, WS-3 next, not current focus)
- **Current state**: Knip plan is in `active/` with verified
  findings. No code changes yet — all 5 phase todos are pending.
  The stdio app (`apps/oak-curriculum-mcp-stdio`) is deprecated;
  removing it is a valid remediation path requiring learning
  extraction first.
- **Current objective**: Execute the knip triage plan phase by
  phase. Phase 0 (unused deps) first, then Phase 1 (unused files),
  etc. End state: `pnpm knip` exits 0, knip added to all four
  gate surfaces (pnpm check, pre-commit, pre-push, CI).
- **Hard invariants / non-goals**:
  - No finding may be labelled as a false positive without
    evidence-based proof
  - Fix consumption patterns to be standard rather than adding
    knip ignores — reducing sensitivity is a gate weakness
  - Never weaken gates to solve testing problems
  - ESLint config standardisation must precede all lint-rule
    promotions (Tier 1, not Tier 3)
  - No `unknown`, no `Record<string, unknown>`, no type erasure
  - stdio app is deprecated — removal valid but requires learning
    extraction and reference cleanup
- **Recent surprises / corrections** (2026-04-11h):
  - Plan initially labelled findings as "false positives" without
    evidence — user corrected: evidence-first, no presumptions
  - Plan initially placed in `current/` — user corrected: it is
    active work, belongs in `active/`
  - Knip must be on ALL FOUR gate surfaces including pre-commit,
    not just pre-push/CI
- **Open questions / low-confidence areas**:
  - Whether ground-truth-archive files are consumed via dynamic
    discovery (open investigation, no conclusion without evidence)
  - Whether removing the stdio app is the right path vs fixing
    its dependencies (owner decision during Phase 0)
  - Whether WS-5 (guidance consolidation) should be a catalogue
    abstraction or simpler validation test approach
- **Tracked follow-ups** (not blocking current work):
  - Consolidate `security-types.ts` with `mcp-protocol-types.ts`
  - Note contract re-export surface change for semver
  - Generated tools have no human-friendly title (no plan)
  - Synonym builders should become codegen-time (no plan)
  - `static-content.ts` `process.cwd()` bug (tracked nowhere)
- **Next safe step**: Begin Phase 0 of the knip triage plan —
  investigate the 2 unused dependencies in the stdio app and the
  9 unused devDependencies across workspaces.
- **Deep consolidation status**: completed this handoff —
  2 entries graduated from distilled.md (gate-surface truth to
  ADR-121, never-weaken-gates to principles.md), 4 stale
  cross-references fixed (roadmap, collection README, eslint
  plan, synthesis plan), new pattern extracted
  (evidence-before-classification), fitness checked
  (principles.md char overrun is pre-existing, deferred to
  dedicated compression pass).

## Active Workstreams (2026-04-11h)

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
