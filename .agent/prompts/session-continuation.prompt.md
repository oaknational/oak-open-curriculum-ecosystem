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

- **Workstream**: Sentry validation closure for the HTTP MCP server, with a
  separate future follow-up for Codex compatibility.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
    (authoritative parent; active closure lane)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-observability-expansion.plan.md`
    (next MCP-server-confined lane after parent closure; still blocked)
  - `.agent/plans/architecture-and-infrastructure/future/codex-mcp-server-compatibility.plan.md`
    (strategic follow-up only; not executable yet)
- **Current state**: Local and Vercel credential prerequisites are now in place
  for the HTTP MCP server, and the branch preview exists. The remaining active
  work is to validate the live Sentry path on the preview deployment, assemble
  the scrubbed evidence bundle, and update the parent-plan closure state.
  Separately, the attempted Codex auth fix was rolled back after it failed to
  unblock Codex and regressed Cursor; that investigation is now isolated in its
  own future plan rather than being mixed into the Sentry lane.
- **Current objective**: Close the HTTP MCP validation lane cleanly:
  confirm the preview deployment evidence, gather the date-stamped Sentry
  bundle, and only then resume MCP-server-confined expansion work.
- **Hard invariants / non-goals**:
  - Parent-plan authority stays with
    `sentry-otel-integration.execution.plan.md` for credential and evidence
    closure.
  - No broader search-observability work unless it is explicitly confined to
    the MCP server.
  - Codex compatibility is a separate follow-up lane; do not reopen shared auth
    configuration speculatively inside the Sentry validation pass.
  - Preserve working-client compatibility while investigating Codex.
- **Recent surprises / corrections**:
  - Broader `scopes_supported` advertising did not fix Codex and did regress
    Cursor, so shared auth metadata is not a safe speculative fix surface.
  - Restart surfaces had drifted and were teaching different priorities; the
    prompt, collection indexes, and plan set needed a coordinated sweep.
- **Open questions / low-confidence areas**:
  - Whether the preview deployment will show the full expected Sentry evidence
    set, including release/source-map proof and kill-switch rehearsal.
  - Whether Codex ultimately needs a server-owned compatibility layer, a Clerk
    configuration change, or an upstream-client escalation.
- **Next safe step**: Run the preview validation flow against the current HTTP
  deployment, capture the scrubbed Sentry evidence bundle, and update the
  parent plan before touching the separate Codex follow-up lane.
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
