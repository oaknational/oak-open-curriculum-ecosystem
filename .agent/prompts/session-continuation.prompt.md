---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-13
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

- **Workstream**: Sentry + OTel Observability Foundation
  (`feat/otel_sentry_enhancements`). Main merged (PR #80). HTTP
  method constants refactored. All code foundations complete.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
    (**authoritative** — phases 0-3 complete, phase 4 pending Vercel
    credentials)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
    (15 todos — original 12 + 3 from merge session: cli-log-level-di,
    cli-logger-di-audit, cli-shutdown-ordering)
  - `.agent/plans/architecture-and-infrastructure/active/search-cli-observability-adoption.plan.md`
    (**COMPLETE** — 10 steps executed 2026-04-12)
  - `.agent/plans/sdk-and-mcp-enhancements/active/schema-resilience-and-response-architecture.plan.md`
    (**PENDING** — open questions, owner decisions needed)
  - `.agent/plans/sdk-and-mcp-enhancements/active/upstream-api-reference-metadata.plan.md`
    (**PENDING** — design complete, 7 todos, user-requested)
  - `.agent/prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md`
    (**entry point** — restart sequence, current state, authority rule)
- **Current state**: Main (PR #80) merged. All code foundations
  complete. Practice doc finessing done (2026-04-13): testing-
  strategy.md wrapped, 3 distilled.md entries graduated to
  permanent homes (ES gotchas → search-cli README, terminology
  → development-practice.md, Turbo corollary → build-system.md).
  Graphify exploration parked in a future plan. Schema resilience
  plan awaiting owner decision on OQ1.
- **Current objective**: **Sentry canonical alignment** is the
  primary track. 15 todos, all local, no Vercel credentials
  needed. The plan is well-structured with clear sequencing and
  acceptance criteria per gap. Secondary tracks (schema resilience,
  Vercel credential provisioning) are parked pending owner
  decisions or external dependencies.
- **Hard invariants / non-goals**:
  - `SENTRY_MODE=off` is the default and kill switch
  - ADR-078 DI everywhere, ADR-143 observability architecture
  - `apps/oak-curriculum-mcp-stdio` is NOT an adoption target
  - MCP App UIs are NOT covered by Sentry (browser context, not server)
  - `sendDefaultPii: false` hardcoded — no override path
  - Adapter pattern preserved (redaction hooks + fixture mode justify it)
  - No `as` casts — one known exception in `fakes.ts` (not yet solved)
  - Search schemas stay `.strict()` (we control the index)
- **Recent surprises / corrections** (2026-04-13):
  - **`.strict()` on all Zod response schemas is a latent fragility.**
    All generated response schemas use `.strict()` via
    `strictObjects: true` in codegen. Upstream API adding any field
    breaks validation. Not currently reproducible but third-party
    consumer hit it and disabled three tools.
  - **Schema cache version-only comparison is a gap.** The upstream
    API can change response shapes without bumping `info.version`.
    `schema-cache.ts` only diffs the version string.
  - **Third-party consumer bypassed MCP SDK entirely.** They use raw
    `fetch()` + SSE parsing and strip `oakContextHint`, `status`,
    and the `data` envelope — signals that our response wrapper adds
    friction for machine consumers.
  - **Pre-commit hook turbo step lacked output control and error
    guard.** Cached log replay (7000+ lines) overwhelmed git hook
    subprocess pipe. Fixed with `--output-logs=errors-only` and
    `if/fi` guard. Cursor-specific: `git commit` needs `| cat`.
  - `fakes.ts` `as OakApiPathBasedClient` cast: not yet solved.
    Generated type requires all 27 paths, tests provide 1.
- **Open questions / low-confidence areas**:
  - OQ1: `.strip()` vs `.passthrough()` for upstream response schemas
    — recommended `.strip()`, awaiting owner decision
  - OQ2: should `additionalProperties: false` be removed from JSON
    Schema output for response schemas?
  - OQ3: awaiting specific lesson slugs from third-party consumer
  - `fakes.ts` cast — what is the architecturally correct solution?
  - Does tsup support `@sentry/bundler-plugin` for Debug ID injection?
  - Does `@sentry/profiling-node` native addon work on Vercel's ABI?
- **Next safe step**: Read the Sentry canonical alignment plan
  (`.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`)
  and begin with the "NEXT PRIORITIES" block in the frontmatter.
  Recommended sequence: (1) `early-init-http` spike — 2-minute
  local test converts the highest-impact assumption to fact.
  (2) `express-error-handler` — can parallel Gap 1. (3) The two
  small independent fixes (`cli-log-level-di`,
  `cli-shutdown-ordering`) are quick wins. (4) `adapter-surface-
  extension` unblocks 4 downstream items.
- **Deep consolidation status**: not due — graduations completed
  this session, napkin at ~170 lines (well under 500), no new
  patterns or doctrine to extract. Remaining informational fitness:
  principles.md chars 25,628 > 24,000; testing-strategy.md line
  inflation from wrapping (564 > 550, chars well within limit).

## Active Workstreams (2026-04-13)

### 1. Sentry Canonical Alignment — PRIMARY

**Plan**: `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
**Parent**: `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`

15 todos closing 6 gaps between Oak's Sentry integration and
canonical Node.js/Express patterns. All "NEXT PRIORITIES" are
local (no Vercel credentials needed). Sequencing: Gap 1 spike
→ Gap 1 + Gap 2 in parallel → Gap 3 → downstream items. Plan
preserves DI/testability/redaction invariants throughout.

### 2. Schema Resilience — PENDING (owner decision)

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/active/schema-resilience-and-response-architecture.plan.md`

Blocked on OQ1 (`.strip()` vs `.passthrough()`). Not active
until owner decides.

### 3. Other workstreams — PARKED

- Interactive User Search MCP App (WS3 Phase 5)
- `_meta` Namespace Cleanup
- Quality Gate Hardening (knip/depcruise done, ESLint remaining)
- Workspace Topology Exploration
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
