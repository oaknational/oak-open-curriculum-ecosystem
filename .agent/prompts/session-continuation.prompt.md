---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-14
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

- **Workstream**: Two concurrent on `feat/otel_sentry_enhancements`.
  (A) Sentry + Build Tooling — build tooling complete, 9 Sentry
  items remain. (B) Compliance — plan complete, codegen fixes
  committed, upstream API requests drafted.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
    (12 of 20 todos done; 8 remaining)
  - `.agent/plans/compliance/current/claude-and-chatgpt-app-submission-compliance.plan.md`
    (**reviewed by 7 specialists**, ready for promotion)
  - `.agent/plans/sdk-and-mcp-enhancements/active/schema-resilience-and-response-architecture.plan.md`
    (**PENDING** — open questions, owner decisions needed)
- **Current state**: **Compliance session (2026-04-14e).**
  Audited MCP server against Anthropic + OpenAI directory
  policies. Created `compliance/` plan collection (8 workstreams,
  7 specialist reviews). Fixed codegen: removed silent schema
  cache fallback (fail-fast), removed OAK_API_KEY gate (swagger
  is public), full-content cache comparison (not version-only),
  removed dotenv dependency. Added CI advisory schema drift
  check. Confirmed limit/offset description swap is an upstream
  API bug (live spec verified). Upstream API requests doc
  drafted (limit/offset swap + asset pagination).
- **Current objective**: Promote compliance plan to `active/`
  and begin WS1 (governance docs) when ready. Sentry 9 items
  remain.
- **Hard invariants / non-goals**:
  - All Sentry invariants unchanged
  - Compliance: no `unknown` in filter accessor types
  - Compliance: principles are field-agnostic, rule carries
    MCP specifics
  - Compliance: oakContextHint rationale in ADR only
  - All graph tools must support filtering (factory invariant)
- **Recent surprises / corrections** (2026-04-14e):
  - **Silent fallback is not a fallback, it's a lie.** Codegen
    fell back to stale cache without API key. The swagger
    endpoint is public — no key needed at all. The "fallback"
    hid stale data for months. Fixed: local codegen always
    fetches live; CI uses cache; no middle ground.
  - **Version-only cache comparison misses content fixes.**
    `writeSchemaCacheIfChanged` compared version strings only.
    Upstream can fix descriptions without bumping versions.
    Fixed: full serialised content comparison.
  - **WebFetch model summaries can misreport raw data.**
    First extraction reported the live spec had correct
    descriptions. Subsequent raw verification proved the live
    spec has them swapped. Always verify raw data before
    changing plans based on a model summary.
  - **A function used in tests is not a reason to keep it.**
    Only product-code usage justifies keeping a function.
    Test usage justifies investigating whether the test is
    testing behaviour or implementation.
  - **Tests that constrain implementation, not behaviour.**
    "skips writing when same version" tested the version-only
    comparison mechanism, not the desired behaviour (skip when
    content identical). Replaced with two tests: identical
    content skips, different content writes regardless of
    version.
  - Prior Sentry corrections unchanged.
- **Open questions / low-confidence areas**:
  - OQ1-OQ3 from Sentry workstream unchanged
  - oakContextHint expiry depends on external MCP SDK feature
  - `principles.md` fitness: 519/525 lines, trimming candidate
    identified but not executed
  - `codegen-once.mock.ts` uses `vi.mock` (prohibited pattern)
    and tests the old cache-fallback path — needs updating
- **Next safe step**: Choose workstream:
  **(A) Sentry**: `wrapMcpServerWithSentry()` adoption, then
  metrics, trace propagation, source maps, reviews.
  **(B) Compliance**: promote plan to `active/`, begin WS1
  (ADR-159, safety-and-security.md, 3 principles, 1 rule).
- **Deep consolidation status**: not due — session findings
  captured in napkin and plan. Codegen fixes committed.
  (prefer-native-sdk-over-custom-plumbing, pnpm-strict-
  hoisting-type-resolution), active README updated. Napkin at
  570 lines (rotation due next session). distilled.md at 289
  lines (graduation due next session). 4 pre-existing fitness
  violations unchanged.

## Active Workstreams (2026-04-14)

### 1. Sentry + Build Tooling — IN PROGRESS (same branch/PR)

**Plans**:

- `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
  (12 of 20 todos done; 8 remaining on this branch)
- `.agent/plans/architecture-and-infrastructure/active/build-tooling-composability.plan.md`
  (**COMPLETE** — all 7 todos done)

Build tooling complete. 9 Sentry items remain. Highest priority:
`wrapMcpServerWithSentry()` adoption (native wrapper replaces
custom per-handler wrapping in sentry mode).

### 2. Compliance — PLAN COMPLETE + CODEGEN FIXES COMMITTED

**Plan**: `.agent/plans/compliance/current/claude-and-chatgpt-app-submission-compliance.plan.md`
**Companion**: `.agent/plans/compliance/current/upstream-api-requests.md`

Plan reviewed by 7 specialists, all findings addressed. Codegen
fixes committed (56e92b0d): silent fallback removed, full-content
cache comparison, dotenv removed, CI drift check added. Upstream
API requests drafted (limit/offset swap + asset pagination).
Ready for promotion to `active/`.

### 3. Schema Resilience — PENDING (owner decision)

Blocked on OQ1 (`.strip()` vs `.passthrough()`).

### 4. Other workstreams — PARKED

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
