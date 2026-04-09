---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-07
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

- **Workstream**: Phase 4.5 tool metadata shape + PR #76 merge readiness
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-4.5-live-react-and-metadata-shape.plan.md`
    (**ACTIVE** — eliminate projection layer, SDK-ready tool shapes)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-6-docs-gates-review-commit.plan.md`
    (**PENDING** — pre-merge docs/gates)
  - `.agent/plans/sdk-and-mcp-enhancements/active/misconception-graph-mcp-surface.plan.md`
    (post-merge)
- **Current state**: Branch `feat/mcp_app_ui` with uncommitted changes.
  All quality gates passing. PR #76. Phase 4.5 T0-T6 complete:
  - T0: All deps updated (MCP SDK 1.29, ext-apps 1.5, Vite 8,
    happy-dom, .js suffix removal, deprecated API migration)
  - T1-T2: RED tests written (inputSchema rename, empty shape assertions)
  - T3: `satisfies` replaces widening structural check
  - T4: `flatZodSchema` → `inputSchema` across ~26 files
  - T5: No-input tools use `{}` (empty ZodRawShape, MCP spec compliant)
  - T6: `projections.ts` deleted, registration inlined in `handlers.ts`,
    `isAppToolEntry` relocated to `type-guards.ts`, `AppToolListEntry`
    to `types.ts`, title/description made required with fail-fast
  - T7-T9 remaining: TSDoc cleanup, final review, final gates
  - Potentially flaky E2E test noted (see napkin)
- **Current objective**: Complete Phase 4.5 (T7-T9), then Phase 6a
  pre-merge docs/gates, then commit and merge PR #76.
- **Hard invariants / non-goals**:
  - No fallbacks, no invented optionality
  - `inputSchema` always present (empty `{}` for no-input, per MCP spec)
  - Title and description required on `UniversalToolListEntry`
  - Dark theme page bg is green-700 (#008237), NOT ink-950
  - Light theme page bg is mint-300 (#bef2bd)
  - CSS media query governs dark mode, not JS
  - Widget URI uses `ui://` scheme per spec
  - `readBuiltWidgetHtml` is async (`node:fs/promises`)
- **Resolved this session**:
  - Projection layer eliminated (projections.ts deleted)
  - `as const satisfies` pattern replaces widening assignment
  - MCP spec checked: `inputSchema` MUST be valid JSON Schema object
  - SDK handler signature: 2-arg when inputSchema truthy, 1-arg when falsy
  - `securitySchemes` confirmed: auth checker uses direct lookup
  - `annotations?.title` dead fallback removed (title required)
  - Generated tool titles — still deferred (codegen template change)
- **Open questions / low-confidence areas**:
  - Potentially flaky E2E test: `get-curriculum-model.e2e.test.ts`
    (passed in isolation, failed once during `pnpm check`)
- **Next safe step**: T7 (TSDoc/docs), T8 (final gates), T9 (final
  review). Then Phase 6a pre-merge docs/gates. Then commit/merge #76.
- **Deep consolidation status**: completed this handoff — distilled.md
  updated (addEventListener migration), napkin at 217 lines (no rotation),
  no patterns met barrier, graduation candidates deferred to T7 TSDoc work

## Active Workstreams (2026-04-08)

### 1. WS3 MCP App Rebuild — P3 MERGE READINESS

**Parent plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`
**Umbrella**: `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`

**Completed phases**: Phase 0-4 (infrastructure, scaffold, contracts, brand
banner). P0-P2 branding/SDK work on `feat/mcp_app_ui` branch.

**Branch status**: 5 commits, all reviewed (14 specialist passes),
`pnpm check` passing. PR #76 updated. Ready for pre-merge review
and merge to `main`.

**Next after merge**: Phase 5 (interactive user search view) on a new branch.

### 2. Frontend Practice Integration — COMPLETE

**Plan**: `.agent/plans/agentic-engineering-enhancements/archive/completed/frontend-practice-integration-and-specialist-agents.plan.md`

Complete. Three ADR-129 agent triplets (accessibility-reviewer,
design-system-reviewer, react-component-reviewer) with full platform
adapters. Three review rounds passed. Design token infrastructure
cancelled as out of scope — belongs in WS3 or a dedicated plan.

### 3. Continuity Adoption — COMPLETE

**Plan**: `.agent/plans/agentic-engineering-enhancements/archive/completed/continuity-and-surprise-practice-adoption.plan.md`

Wave 1 closed with an explicit `promote` decision on 3 April 2026. The
outgoing continuity note landed and the same-day Practice Core promotion is
recorded separately in `.agent/practice-core/*`.

### 4. Assumptions Reviewer — COMPLETE

ADR-146 accepted, triplet deployed, platform adapters created.

### 5. URL Naming Collision Remediation — COMPLETE

Completed 2026-04-01.

### 6. Oak Surface Isolation Programme — FUTURE

**Plan**:
`.agent/plans/architecture-and-infrastructure/future/oak-surface-isolation-and-generic-foundation-programme.plan.md`

Strategic umbrella for separating generic foundations from Oak leaves across
runtime, design system, tooling/governance, SDK/codegen, search, and app
surfaces. Not yet promoted. First promotion requires the authoritative
workspace matrix, agreed tranche target states plus rename map, and a
deterministic validation set for tranche 1.

## Core Invariant (WS3)

This workstream is a clean-break replacement:

- replace the out-of-date OpenAI-era app integration with a brand-new MCP App
- keep `search` as the model-facing, agent-facing search interface
- add `user-search` as a UI-first, user-first MCP App tool
- do not introduce custom tool-discovery, visibility, or presentation shims

## Durable Guidance

- Run the required gates one at a time while iterating.
- Run `pnpm fix` to apply auto-fixes.
- Run `pnpm check` as the canonical aggregate readiness gate before push/merge.
- Keep this prompt concise and operational; do not duplicate plan authority.
