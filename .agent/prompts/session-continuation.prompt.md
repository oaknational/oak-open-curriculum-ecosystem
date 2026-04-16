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

- **Workstream**: Sentry/OTel completion on `feat/otel_sentry_enhancements`,
  with parent-plan orchestration split across child and companion plans.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
    (parent authority + parent closure order + companion continuation order)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
    (completed HTTP MCP live-path runtime alignment record)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-observability-expansion.plan.md`
    (full post-baseline Sentry capability expansion)
  - `.agent/plans/architecture-and-infrastructure/active/search-observability.plan.md`
    (later-session companion for search observability beyond work
    explicitly confined to the MCP server)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-observability-translation-crosswalk.plan.md`
    (lossless recovery mapping for removed scope)
- **Current state**: Native MCP wrapping fully adopted. `wrapMcpServerWithSentry()`
  is wired in the per-request factory. All custom `@oaknational/sentry-mcp`
  handler wrappers are gone, the package is deleted, the circular justification
  chain is broken, and the parent/child/companion plans now split ownership
  explicitly. Latest recorded aggregate state: `pnpm check` green, knip clean,
  depcruise clean. This session refreshed the continuity surfaces again so the
  collection README, roadmap, architecture prompt, active plan, and session
  prompt all agree on the next sequence: validate current HTTP foundation
  first, then continue with MCP-server-confined expansion, then defer broader
  search follow-on work.
- **Current objective**: Branch is deployment-ready for the MCP server.
  Remaining branch-critical work is Vercel credential provisioning (human
  action) and the deployment evidence bundle. After that validation pass,
  continue with `sentry-observability-expansion.plan.md`. Defer
  `search-observability.plan.md` to a later session/PR unless the work is
  explicitly confined to the MCP server.
- **Hard invariants / non-goals**:
  - `sendDefaultPii: false`, `SENTRY_MODE=off`, DI/testability, and redaction
    invariants are non-negotiable.
  - No duplicate custom MCP tracing system on the authoritative live path.
  - Scope moves must update the translation crosswalk in the same change set.
  - Tests must prove product behaviour, not removed logic.
  - All gates are blocking at all times. No "pre-existing" exceptions.
- **Recent surprises / corrections**:
  - Updating the child plan was not enough; the parent plan, collection index,
    strategic index, and continuation prompts all needed a coordinated sweep
    before the restart story became trustworthy again.
  - I initially over-inferred that search work should be next after validation.
    The user corrected the sequence: validate first, then do the
    MCP-server-confined expansion lane, and defer broader search work to a
    later session and PR.
  - A later consolidation sweep still found stale collection-level index files
    teaching the pre-split "Search CLI adoption next" story. The collection
    README/current/roadmap layer now matches the active plan set.
  - The MCP rate-limit integration proof was stable in isolation but timed out
    under the commit hook's concurrent turbo run. The test now has an explicit
    integration-appropriate timeout instead of relying on the default.
- **Open questions / low-confidence areas**:
  - Exact execution order inside `sentry-observability-expansion.plan.md` once
    validation closes cleanly.
  - Whether any apparently "search-shaped" follow-on task is actually confined
    tightly enough to the MCP server to stay in this branch/PR.
- **Next safe step**: Vercel credential provisioning (human action),
  then deployment evidence bundle, then `sentry-observability-expansion.plan.md`.
- **Deep consolidation status**: completed this handoff — repeated authority
  corrections across plan, prompt, collection-index, and strategic-index
  surfaces were swept together; practice-box incoming is empty; fitness
  validation ran in informational mode and only reported pre-existing
  foundational-doc pressure.

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
