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

- **Workstream**: Two concurrent on `feat/otel_sentry_enhancements`.
  (A) Sentry + Build Tooling — build tooling complete, 9 Sentry
  items remain (plan overhauled). (B) Compliance — plan complete,
  codegen fixes committed, upstream API requests drafted, upstream
  offset/limit fix applied locally.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
    (12 of 22 todos done, 1 dropped, 9 pending — plan overhauled
    2026-04-14g)
  - `.agent/plans/compliance/current/claude-and-chatgpt-app-submission-compliance.plan.md`
    (**reviewed by 7 specialists**, ready for promotion)
  - `.agent/plans/sdk-and-mcp-enhancements/active/schema-resilience-and-response-architecture.plan.md`
    (**PENDING** — open questions, owner decisions needed)
- **Current state**: **Metacognitive correction session
  (2026-04-14g).** Discovered sunk-cost rationalisation in the
  `wrapMcpServerWithSentry()` plan item. The prior framing
  ("retain sentry-mcp for fixture mode") kept the old approach
  alongside the new one and invented justifications. Overhauled
  the plan: split `wrap-mcp-server` into investigation +
  adoption todos, added "Native MCP Server Wrapping —
  Investigation Required" section with 6 questions, updated
  sequencing. No code changes — plan correction only.
- **Current objective**: Sentry native wrapper investigation
  (highest priority), then remaining Sentry items, then
  compliance promotion.
- **Hard invariants / non-goals**:
  - All Sentry invariants unchanged
  - Compliance: no `unknown` in filter accessor types
  - Compliance: principles are field-agnostic, rule carries
    MCP specifics
  - Compliance: oakContextHint rationale in ADR only
  - All graph tools must support filtering (factory invariant)
- **Recent surprises / corrections** (2026-04-14g):
  - **Sunk-cost rationalisation in native wrapper plan.** We
    chose `wrapMcpServerWithSentry()` as the better approach,
    kept the old per-handler wrappers, then invented "fixture
    mode needs it" to justify both. Fixture mode tests the
    adapter surface — it doesn't need a parallel wrapping
    mechanism. The correct question is "what survives
    replacement?" not "how do we make both coexist?"
  - **"Gate on mode" was sophistication on a false premise.**
    Building conditional wrapping logic assumed both approaches
    should coexist. The mode-gating was the wrong question —
    it made a sunk-cost decision look like engineering prudence.
  - Prior corrections unchanged.
- **Open questions / low-confidence areas**:
  - OQ1-OQ3 from Sentry workstream unchanged
  - Native wrapper investigation (6 questions in plan section)
  - oakContextHint expiry depends on external MCP SDK feature
  - `principles.md` fitness: 519/525 lines, trimming candidate
    identified but not executed
  - `codegen-once.mock.ts` uses `vi.mock` (prohibited pattern)
    and tests the old cache-fallback path — needs updating
  - Upstream fix branch exists in oak-openapi but not submitted
- **Uncommitted doc changes**: 7 files (6 modified + 1 new
  napkin archive) from sessions 2026-04-14f and 2026-04-14g.
  All are docs/plans/memory — no code changes. Commit these
  first before starting new work.
- **Next safe step**: **(0) Commit** pending doc changes
  (see above). Then choose workstream:
  **(A) Sentry**: run the native wrapper investigation
  (6 questions in plan, code reading + spike, no
  implementation until answered). Then adopt based on
  findings. **(B) Compliance**: promote plan to `active/`,
  begin WS1 (ADR-159, safety-and-security.md, 3 principles,
  1 rule).
- **Deep consolidation status**: completed this handoff —
  new pattern extracted, napkin updated, prompt and plan
  synced.

## Active Workstreams (2026-04-14)

### 1. Sentry + Build Tooling — IN PROGRESS (same branch/PR)

**Plans**:

- `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
  (12 of 22 todos done, 1 dropped, 9 pending — plan overhauled)
- `.agent/plans/architecture-and-infrastructure/active/build-tooling-composability.plan.md`
  (**COMPLETE** — all 7 todos done)

Build tooling complete. 9 Sentry items remain. Highest priority:
native wrapper **investigation** (6 questions, code reading +
spike). Prior "mode-conditional" framing was sunk-cost
rationalisation — corrected 2026-04-14g.

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
