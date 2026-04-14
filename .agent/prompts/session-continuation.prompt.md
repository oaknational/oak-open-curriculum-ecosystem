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
  (`feat/otel_sentry_enhancements`). Main merged (PR #80).
  Sentry last mile committed (3962b5d0, 2026-04-14). Build
  tooling evaluated and decided. Type assertion enforcement
  hardened.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
    (**authoritative** — phases 0-3 complete, phase 4 pending
    Vercel credentials)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
    (10 of 15 todos done; 5 remaining: source-maps-automation,
    custom-metrics, cli-metrics, trace-propagation-es/oak-api,
    profiling-evaluation)
  - `~/.claude/plans/cuddly-swinging-ocean.md` (**approved** —
    Track 1: build tooling composability pending. Track 2: Sentry
    last mile complete and committed.)
  - `.agent/plans/sdk-and-mcp-enhancements/active/schema-resilience-and-response-architecture.plan.md`
    (**PENDING** — open questions, owner decisions needed)
  - `.agent/plans/sdk-and-mcp-enhancements/active/upstream-api-reference-metadata.plan.md`
    (**PENDING** — design complete, 7 todos, user-requested)
- **Current state**: **Sentry last mile committed 2026-04-14**
  (3962b5d0, 33 files, +1126/-263). All reviewer findings
  addressed. Provider-neutral types in `core/observability`.
  HttpObservability: `close()` + `setUser`/`setTag`/`setContext`.
  All 3 shutdown paths use `close()`. MCP handler enriches Sentry
  scope with `mcp.method` tag + user from Clerk (via shared Zod
  `authInfoExtraSchema`). Tool handlers set `mcp.tool_name` tag.
  CLI `withLoadedCliEnv` refactored to options bag, 5 call sites
  with `cli.command` tags. Error mappers extracted to
  `@oaknational/sentry-node`. Sentry delegation bridge extracted
  to `sentry-observability-delegates.ts`. Type assertion lint rule
  promoted from `warn` to `error` in `testRules`. Nonsense
  `@ts-expect-error` tests deleted. All gates green: build,
  type-check, lint (0 errors), knip, depcruise (1913 modules,
  0 violations), tests across 19 packages.
- **Current objective**: Complete all 11 remaining items on this
  branch before raising the PR. See Next safe step for the full
  numbered list. Covers Sentry alignment (5), build tooling (2),
  reviewer-gated items (3), and doc consolidation (1).
- **Hard invariants / non-goals**:
  - `SENTRY_MODE=off` is the default and kill switch
  - ADR-078 DI everywhere, ADR-143 observability architecture
  - `apps/oak-curriculum-mcp-stdio` is NOT an adoption target
  - MCP App UIs are NOT covered by Sentry (browser context)
  - `sendDefaultPii: false` hardcoded — no override path
  - Adapter pattern preserved (redaction hooks + fixture mode)
  - No `as` casts, no `@ts-expect-error` — zero exceptions
  - Search schemas stay `.strict()` (we control the index)
  - Provider-neutral types at app boundaries (not Sentry-specific)
- **Recent surprises / corrections** (2026-04-14b):
  - **Warning severity hides violations.** `testRules` had
    `consistent-type-assertions` at `'warn'`, effectively
    disabling the rule. 13 violations accumulated across 4
    workspaces. Any rule at `'warn'` is a rule that's off.
  - **`@ts-expect-error` is the smell, not the solution.** Tests
    for removed tool names used `@ts-expect-error` to bypass the
    type system — these tested the absence of things. Deleted.
  - **Self-justifying eslint-disable comments embed incorrect
    assumptions.** "Unavoidable: partial test fake" rationalises
    the violation. The right question: WHY are types incompatible?
  - **Complexity in tests = architectural problem or bad test.**
    The handlers `setTag` test required type predicate hacks to
    work around MCP SDK unexported generics. Correct answer:
    delete the test — trivial delegation proven at adapter level.
  - **`vi.fn()` leaks `any` through `mock.calls`.** Use
    `toHaveBeenCalledWith` with matchers or typed capture arrays.
  - Prior session findings (unchanged): Fred provider-neutral
    types, Fred neutralise both error types, assumptions Track 1
    ≠ Track 2, Barney 3 functions, tsconfig `$schema`, file
    length limits drive extraction.
- **Open questions / low-confidence areas**:
  - OQ1: `.strip()` vs `.passthrough()` for upstream response
    schemas — recommended `.strip()`, awaiting owner decision
  - OQ2: should `additionalProperties: false` be removed from
    JSON Schema output for response schemas?
  - OQ3: awaiting specific lesson slugs from third-party consumer
  - `fakes.ts` type guard (`isPartialClient`) — should functions
    accept `Pick<>` instead of full generated type?
  - Does `@sentry/profiling-node` native addon work on Vercel?
- **Next safe step**: All 11 items below are required on this
  branch (`feat/otel_sentry_enhancements`) before the PR is
  raised. Work through sequentially; items 1-2 are unblocked,
  items 3-5 depend on adapter surface, items 6-7 are independent,
  items 8-10 are review-gated, item 11 is doc consolidation.
  **Sentry alignment (5 remaining plan todos):**
  (1) Source maps spike: `sentry-cli sourcemaps inject` against
  tsup ESM output (5-minute test, needs `SENTRY_AUTH_TOKEN`)
  (2) Extract `describeConfigError` to `sentry-node` (Fred W-2)
  (3) Custom metrics: expose `Sentry.metrics` on the adapter
  with `beforeSendMetric` hook
  (4) CLI metrics: wire CLI command execution counts via
  `Sentry.metrics.count`
  (5) Trace propagation: ES host (low-ceremony) + Oak API
  (security review required)
  **Build tooling (same branch, same PR):**
  (6) `tsup.config.base.ts` with 3 factory functions, migrate 17
  configs, turbo.json, ADR-010 amendment
  (7) tsconfig `$schema` cleanup: add to ~37 files
  **Reviewer-gated items:**
  (8) Betty review: common interface for HttpObservability/
  CliObservability (growing shared surface) — implement findings
  (9) Wilma review: CLI without `@sentry/node/preload` — verify
  no failure modes, implement fixes if any
  (10) `mcp_request` structured context alongside tags for richer
  error detail view (sentry-reviewer suggestion) — implement
  **Documentation:**
  (11) Consolidate docs: extract build tooling decision to
  ADR-010 amendment, move non-repo plan content to repo plan
- **Deep consolidation status**: due — build tooling decision
  exists only in `~/.claude/plans/cuddly-swinging-ocean.md` and
  napkin, needs extraction to ADR-010 amendment (item 11 above).
  Non-repo plan contains Track 1 detail not captured in any repo
  plan.

## Active Workstreams (2026-04-14)

### 1. Sentry + Build Tooling — IN PROGRESS (same branch/PR)

**Plans**:

- `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
  (10 of 15 todos done; 5 remaining on this branch)
- `~/.claude/plans/cuddly-swinging-ocean.md` (Track 1 + Track 2)

Last mile committed (3962b5d0). 11 items remain on this branch
before the PR is raised — see Next safe step above. Covers all
Sentry alignment todos (source maps, metrics, trace propagation),
build tooling composability (`tsup.config.base.ts`, 17 config
migrations, turbo.json, ADR-010, tsconfig `$schema`), 3 reviewer-
gated items (Betty common interface, Wilma CLI preload,
`mcp_request` context), and doc consolidation (ADR-010 amendment,
non-repo plan extraction).

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
