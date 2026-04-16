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
  with parent-plan orchestration split across child and companion plans.
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
  - Execution plan for this session:
    `~/.claude/plans/federated-exploring-fern.md`
- **Current state**: Native MCP wrapping fully adopted. Cleanup commit 2
  done and committed. `wrapMcpServerWithSentry()` wired in per-request
  factory. All custom `@oaknational/sentry-mcp` handler wrappers removed.
  Circular justification chain broken. `HttpObservability` no longer extends
  `McpObservationRuntime`. Dead members removed. `@oaknational/sentry-mcp`
  removed from HTTP app dependencies (zero imports). `WithActiveSpanOptions`
  tracer-field fix applied (`Omit<..., 'tracer'>`). `@oaknational/type-helpers`
  unused devDep removed (knip fix). 611 tests pass. `pnpm check` 88/88 green.
  knip clean. depcruise clean. 4 specialist reviewers approved/compliant.
  Parent plan updated with explicit "Road to Provably Working Sentry" table.
- **Current objective**: `@oaknational/sentry-mcp` deleted. Branch is
  deployment-ready for the MCP server. Remaining: Vercel credential
  provisioning (human action) and deployment evidence bundle. This PR is
  scoped to the MCP server only. Follow-on: CLI Sentry enablement,
  Elastic search operations observability.
- **Hard invariants / non-goals**:
  - `sendDefaultPii: false`, `SENTRY_MODE=off`, DI/testability, and redaction
    invariants are non-negotiable.
  - No duplicate custom MCP tracing system on the authoritative live path.
  - Scope moves must update the translation crosswalk in the same change set.
  - Tests must prove product behaviour, not removed logic.
  - All gates are blocking at all times. No "pre-existing" exceptions.
- **Recent surprises / corrections**:
  - `getActiveSpanContext` and `withActiveSpan` ARE load-bearing (logging +
    span propagation) but do NOT need `McpObservationRuntime` as type source.
    Both types come from `@oaknational/observability`, already a dependency.
  - `WithActiveSpanOptions<T>` includes a `tracer` field that
    `HttpObservability.withActiveSpan` ignores (tracer captured via closure).
    Fixed with `Omit<WithActiveSpanOptions<T>, 'tracer'>` per Barney.
  - Test-reviewer correctly identified that the initial wrapping-order test
    claimed to detect ordering regressions but could not. Rewritten to
    honestly document what it proves (inertness without init).
  - knip caught `@oaknational/type-helpers` as unused devDependency after
    removing the `typeSafeKeys` import. Removed — all gates must pass.
- **Open questions / low-confidence areas**:
  - Ordering and depth decisions for EXP/CLI follow-on tracks.
  - Whether a new plan is needed for Elastic search operations
    observability or whether it belongs in the existing expansion plan.
- **Next safe step**: Vercel credential provisioning (human action),
  then deployment evidence bundle.
- **Deep consolidation status**: due — napkin has accumulated 10+ session
  entries since last rotation, and a significant plan has been updated.

## Active Workstreams (2026-04-16)

### 1. Sentry + OTel Alignment — NEAR COMPLETION (same branch/PR)

**Plans**:

- `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
  (16 todos done, 7 dropped — child plan complete)
- `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
  (parent authority — "Road to Provably Working Sentry" table added;
  Vercel credential provisioning and deployment evidence still pending)

**No remaining code work for this PR.** Branch is deployment-ready
for the MCP server. Vercel credential provisioning and deployment
evidence bundle are human actions. Follow-on plans: CLI Sentry,
Elastic search operations observability (plan needed).

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
