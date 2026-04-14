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

- **Workstream**: Sentry + Build Tooling on
  `feat/otel_sentry_enhancements`. Build tooling complete,
  Sentry items in progress. 9 items remain before PR.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
    (12 of 20 todos done; 8 remaining — includes 3 new items
    added 2026-04-14c)
  - `.agent/plans/architecture-and-infrastructure/active/build-tooling-composability.plan.md`
    (**COMPLETE** — all 7 todos done 2026-04-14c)
  - `~/.claude/plans/cuddly-swinging-ocean.md` (Track 1
    complete, Track 2 complete)
  - `.agent/plans/compliance/current/claude-and-chatgpt-app-submission-compliance.plan.md`
    (reviewed, ready for promotion to `active/`)
  - `.agent/plans/sdk-and-mcp-enhancements/active/schema-resilience-and-response-architecture.plan.md`
    (**PENDING** — open questions, owner decisions needed)
- **Current state**: **Session 2026-04-14c completed build
  tooling and 2 Sentry items.** `tsup.config.base.ts` with 3
  factory functions, 16 workspace configs migrated, turbo.json
  updated, ADR-010 revised, 37 tsconfig `$schema` annotations
  added. `describeConfigError` extracted to sentry-node (TDD).
  Preload `--import` moved to documented shell script.
  Holistic Sentry review (Barney + sentry-reviewer) completed:
  native `wrapMcpServerWithSentry()` is highest-value next item.
  `SENTRY_AUTH_TOKEN` provisioned (org-level, one per app).
- **Current objective**: Complete 9 remaining items on this
  branch before PR. Highest priority: `wrapMcpServerWithSentry()`
  adoption, then metrics, trace propagation, source maps, and
  reviewer-gated items.
- **Hard invariants / non-goals**:
  - All Sentry invariants unchanged (SENTRY_MODE=off, ADR-078,
    no `as` casts, provider-neutral types, sendDefaultPii: false)
  - `wrapMcpServerWithSentry()` compatible with
    `sendDefaultPii: false` (confirmed by reading SDK source)
  - `@oaknational/sentry-mcp` retained for fixture mode only;
    native wrapper replaces per-handler wrapping in sentry mode
  - `--import @sentry/node/preload` is canonical ESM
    requirement (Node.js, not Sentry) — lives in documented
    shell script, not bare package.json
- **Recent surprises / corrections** (2026-04-14c):
  - **`--import` flag is the canonical approach for ESM.** No
    pure-code alternative preserves full auto-instrumentation.
    The user accepted the flag but requires it in a documented
    shell script, not a bare package.json entry.
  - **`wrapMcpServerWithSentry()` is a superset.** The native
    wrapper provides transport-level correlation, JSON-RPC error
    classification, session tracking, and 20+ OTel MCP semantic
    convention attributes. Our custom sentry-mcp wrappers are
    now custom plumbing (Barney: "a violation").
  - **`sendDefaultPii: true` in Sentry MCP docs is example,
    not requirement.** Security-reviewer: LOW RISK. The flag
    controls `recordInputs`/`recordOutputs` fallback defaults
    only. Structural span data works regardless.
  - **`esbuild` types not accessible in pnpm strict hoisting.**
    `import type { Plugin } from 'esbuild'` in repo root config
    failed type-check across all workspaces. Fix: inline plugin
    definition, no esbuild type import. `tsup` added as root
    devDependency for `defineConfig`/`Options` types.
  - **Barney: "3 items not 8" but sentry-reviewer disagrees.**
    Custom metrics are NOT redundant (spans ≠ metrics, different
    Sentry UI surface). User decision: defer nothing, all items
    in this PR, split across sessions for focus.
  - Prior corrections (unchanged): warning severity,
    `@ts-expect-error`, self-justifying eslint-disable,
    complexity in tests, `vi.fn()` leaks `any`.
- **Open questions / low-confidence areas**:
  - OQ1-OQ3 from prior sessions unchanged
  - getsentry/sentry-javascript#19233: transport-level session
    correlation may fail with certain transport abstractions.
    Streamable HTTP transport needs testing.
  - Double-span risk when native wrapper + per-handler wrappers
    both active — must gate wrapping on mode
- **Next safe step**: Adopt `wrapMcpServerWithSentry()` at the
  composition root. Mode-conditional: sentry mode uses native
  wrapper (skip per-handler `wrapToolHandler`), fixture mode
  keeps existing per-handler wrappers. Then: custom metrics (3),
  CLI metrics (4), trace propagation (5), `mcp_request` context
  (10), source maps spike (1), Betty (8) and Wilma (9) reviews.
- **Deep consolidation status**: completed this handoff —
  build tooling plan marked complete, 2 patterns extracted
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

### 2. Compliance — PLAN COMPLETE, READY FOR EXECUTION

**Plan**: `.agent/plans/compliance/current/claude-and-chatgpt-app-submission-compliance.plan.md`

Ready for promotion to `active/`. Not on this branch.

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
