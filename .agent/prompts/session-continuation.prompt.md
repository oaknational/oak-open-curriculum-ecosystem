---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-15
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
  with parent-plan orchestration now split cleanly across child and companion
  plans.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
    (parent authority + integrated execution order + mirrored metadata todos)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
    (remaining HTTP MCP live-path runtime alignment)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-observability-expansion.plan.md`
    (full post-baseline Sentry capability expansion)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-cli-observability-extension.plan.md`
    (CLI-specific expansion and ADR-078 hygiene)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-observability-translation-crosswalk.plan.md`
    (lossless recovery mapping for removed scope)
- **Current state**: Plan architecture has been reconciled and made
  metadata-complete. Parent plan now includes both integrated prose execution
  order and `integrated-*` frontmatter todos for all planned lanes. No Sentry
  implementation code has been added in this handoff cycle.
- **Current objective**: Begin execution of integrated step 1 by starting RED
  work on authoritative HTTP live-path alignment (`wrap-mcp-server-adopt`
  branch of the child plan), while preserving the now-established plan/prompt
  restart contract.
- **Hard invariants / non-goals**:
  - Native Sentry remains the baseline; Oak adds only minimum missing
    `register*` failure signal.
  - `sendDefaultPii: false`, `SENTRY_MODE=off`, DI/testability, and redaction
    invariants are non-negotiable.
  - No duplicate custom MCP tracing system on the authoritative live path.
  - Scope moves must update the translation crosswalk in the same change set.
- **Recent surprises / corrections**:
  - Narrowing without explicit companion ownership caused ambiguity; resolved by
    adding expansion + CLI plans and a crosswalk.
  - Prose-only orchestration was insufficient; user correction required every
    planned lane to exist in metadata too (`integrated-*` todos now in parent).
  - Parent/README status drift can misroute execution; corrected to reflect CLI
    adoption complete and current blockers accurately.
- **Open questions / low-confidence areas**:
  - Exact minimal app-local `register*` gap-closure shape on the real server
    path.
  - Whether prompt/resource thrown failures require explicit capture beyond
    native protocol-error handling.
  - Final re-homing destination for recorder/types fixtures before
    `@oaknational/sentry-mcp` collapse.
  - Ordering and depth decisions for EXP/CLI follow-on tracks after step 1.
- **Next safe step**: Start RED tests for child-plan HTTP live-path adoption
  and `register*` failure signal parity, then implement the minimum app-local
  closure needed to satisfy child-plan acceptance criteria.
- **Deep consolidation status**: not due — no plan closed this handoff, no
  practice-box incoming files, napkin remains below rotation trigger, and
  session corrections are captured.

## Active Workstreams (2026-04-15)

### 1. Sentry + OTel Alignment — IN PROGRESS (same branch/PR)

**Plans**:

- `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
  (13 todos done, 1 dropped, 9 pending — investigation complete,
  next step is live-path implementation)
- `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
  (shared foundation authoritative; Vercel credential provisioning and
  deployment evidence still pending)

Highest priority next: commit the current docs/plan changes, then
start RED for HTTP live-path alignment on the real server path:
native baseline adoption plus the minimal app-local `register*` gap
closure.

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
