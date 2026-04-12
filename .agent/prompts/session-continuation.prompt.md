---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-12
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

## Live Continuity Contract

- **Workstream**: MCP App UI regression — the gate-hardening
  branch (`feat/gate_hardening_part1`) broke the MCP App
  widget rendering on ALL environments (local, preview, prod-
  equivalent). This is the highest priority bug fix.
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-ui-preview-regression.plan.md`
    (**ACTIVE** — Phase 0 investigation in progress, Tasks
    0.1–0.3 complete, Task 0.4 is next)
  - `.agent/plans/architecture-and-infrastructure/current/quality-gate-hardening.plan.md`
    (**PARENT** — `enable-knip` complete; `enable-depcruise`
    complete; remaining: ESLint config standardisation,
    eslint-disable remediation, max-files-per-dir, type
    assertion promotion)
- **Current state**: MCP App UI widget does not render when
  calling `get-curriculum-model` on any server running this
  branch's code. The tool call succeeds (returns 41.5 KB
  data) but no widget appears. `oak-prod` (running `main`)
  works fine in the same Cursor client. Investigation has
  narrowed the issue:
  - Local reproduction confirmed (not Vercel-specific)
  - All existing tests pass (581/582, 1 unrelated timeout)
  - Tool definition has correct `_meta.ui.resourceUri`
  - Widget HTML is identical between prod and preview
  - Cursor is not a variable (works on `oak-prod`)
  - Remaining hypothesis: MCP SDK's SSE serialisation path
    strips `_meta` due to a code/type change on this branch
- **Current objective**: Write and run the composition test
  (Task 0.4 / Task 2.1) that uses the real MCP client SDK
  (`Client` + `StreamableHTTPClientTransport`) against a
  running server. This will either pinpoint the root cause
  (if `_meta` is absent) or narrow it further (if present).
- **Hard invariants / non-goals**:
  - Never weaken gates to solve testing problems
  - The fix must address the root cause, not paper over it
  - No `unknown`, no `Record<string, unknown>`, no type erasure
  - Never edit generated files — edit the generators
  - Cursor client is NOT a variable — `oak-prod` works fine
- **Recent surprises / corrections** (2026-04-12):
  - MCP App UI regression reproduces locally — not a Vercel
    or deployment issue; definitively a branch code change
  - All existing E2E tests pass despite the feature being
    broken — the "pieces vs composition" test gap from
    `distilled.md` materialised exactly as predicted
  - Cursor's MCP tool descriptor files (`mcps/*/tools/*.json`)
    do NOT store `_meta` — they are not diagnostic for this
  - `register-prompts.integration.test.ts` timeout is a
    pre-existing issue, not related to this regression
- **Open questions / low-confidence areas**:
  - Whether the `Omit<Tool, '_meta'>` type change (commit
    `a03f3b32`) has runtime side-effects via the MCP SDK's
    schema validation during SSE serialisation
  - Whether the MCP SDK `StreamableHTTPServerTransport`
    strips unknown `_meta` fields during SSE event emission
  - Which specific commit (of `a03f3b32`, `23360be7`,
    `d74c0b5d`) introduced the regression
- **Next safe step**: Write the composition test in
  `e2e-tests/mcp-app-composition.e2e.test.ts` using
  `Client` + `StreamableHTTPClientTransport` against
  `createStubbedHttpApp()` on a random port. Run it and
  observe whether `_meta.ui.resourceUri` is present in
  `listTools()`. The test result will identify the root cause.
- **Deep consolidation status**: not due — active
  investigation in progress; no milestone closed this session.

## Active Workstreams (2026-04-12)

### 1. MCP App UI Regression — INVESTIGATING (HIGHEST PRIORITY)

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-ui-preview-regression.plan.md`

The gate-hardening branch broke MCP App UI rendering. Reproduces
locally. Phase 0 investigation narrowed: all tests pass, tool def
is correct, widget HTML is identical, Cursor is not a variable.
Next: write composition test with real MCP client SDK to pinpoint
whether `_meta` survives the SSE transport path.

### 2. Quality Gate Hardening — static analysis complete

**Parent plan**: `.agent/plans/architecture-and-infrastructure/current/quality-gate-hardening.plan.md`

Both knip (904 → 0) and depcruise (87 → 0) complete and blocking
on all four gate surfaces. Remaining items are ESLint-focused.
Note: this workstream's changes caused the MCP App UI regression.

### 3. Workspace Topology Exploration — FUTURE

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md`

Four-tier layered architecture. Lifecycle classification complete.
Phase 2 pending.

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
  push/merge. It now includes `pnpm knip`. After depcruise Phase 4,
  it will also include `pnpm depcruise`.
- Keep this prompt concise and operational; do not duplicate plan
  authority.
