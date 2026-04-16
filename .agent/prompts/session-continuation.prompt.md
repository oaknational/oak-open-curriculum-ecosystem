---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-16
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

- **Workstream**: Report-normalisation workflow hardening and teacher-memory
  strategic planning.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/future/teacher-memory-store-solid-vs-user-keyed-private-store.plan.md`
    (new future strategic brief; not executable yet)
- **Current state**: The Solid distributed filesystem research report was
  normalised into a sibling clean copy and validated for no drift against the
  source markdown. The normalisation skill and command now enforce sibling
  `*-clean.md` output and "never overwrite source". A new future plan was added
  to compare Solid Pods against a user-keyed private store for long-term
  teacher preferences and memory.
- **Current objective**: Keep future planning discoverable and ready for
  promotion by producing an evidence-backed architecture comparison and ADR
  pre-read.
- **Hard invariants / non-goals**:
  - Report normalisation is a faithful repair task, not a rewrite.
  - Always write sibling `*-clean.md` outputs; never overwrite source markdown.
  - Source markdown is structural authority; DOCX/pandoc are citation-recovery
    authority.
  - Future plan remains strategic only; no implementation work in this lane yet.
- **Recent surprises / corrections**:
  - Ambiguous output-contract wording in the normalisation skill allowed
    in-place overwrite by interpretation. The workflow is now explicit:
    sibling-only clean outputs plus mandatory drift proof.
  - Clear distinction between "success signals" and "promotion trigger" was
    needed in the new future plan to reduce governance ambiguity.
- **Open questions / low-confidence areas**:
  - Which memory architecture (Solid vs user-keyed private store) best balances
    teacher control guarantees, operational complexity, and teacher value.
  - Minimum data taxonomy needed across short/medium/long planning horizons.
- **Next safe step**: Build the comparison pack and ADR pre-read from
  `teacher-memory-store-solid-vs-user-keyed-private-store.plan.md`, then
  promote to a `current/` executable plan if promotion triggers are met.
- **Deep consolidation status**: not due — no plan or milestone closure, no
  incoming practice-box content, and no additional consolidation triggers beyond
  this lightweight handoff.

## Active Workstreams (2026-04-16)

### 1. Sentry + OTel Alignment — NEAR COMPLETION (same branch/PR)

**Plans**:

- `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
  (16 todos done, 7 dropped — child plan complete)
- `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
  (parent authority — "Road to Provably Working Sentry" table added;
  Vercel credential provisioning and deployment evidence still pending)

**Immediate code work is paused pending validation.** Branch is
deployment-ready for the MCP server. Vercel credential provisioning
and deployment evidence bundle are the next actions. After that, the
next implementation lane for this branch/PR is
`sentry-observability-expansion.plan.md`. Broader
`search-observability.plan.md` work is deferred to a later session/PR
unless it is explicitly confined to the MCP server.

### 2. User-Facing Search UI — NEXT

Interactive search MCP App widget. Queued after Sentry completes.

### 3. Compliance — READY / PARKED

**Plan**: `.agent/plans/compliance/current/claude-and-chatgpt-app-submission-compliance.plan.md`
**Companion**: `.agent/plans/compliance/current/upstream-api-requests.md`

Plan reviewed by 7 specialists, all findings addressed. Codegen
fixes committed (56e92b0d): silent fallback removed, full-content
cache comparison, dotenv removed, CI drift check added. Upstream
API requests drafted (limit/offset swap + asset pagination).
Ready for promotion to `active/` once Sentry work is no longer the
current branch priority.

### 4. Schema Resilience — PENDING (owner decision)

Blocked on OQ1 (`.strip()` vs `.passthrough()`).

### 5. Other workstreams — PARKED

- Interactive User Search MCP App (WS3 Phase 5)
- `_meta` Namespace Cleanup
- Quality Gate Hardening (knip/depcruise done, ESLint remaining)
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
