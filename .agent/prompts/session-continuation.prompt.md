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

- **Workstream**: MCP App branding alignment + merge
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-branding-alignment-and-merge.plan.md` (**PRIMARY** — P3 merge readiness)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-mcp-apps-sdk-audit.plan.md` (**SDK AUDIT** — P2 items DONE, Phase 5 items deferred)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md` (WS3 parent)
  - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md` (umbrella)
- **Current state**: P0-P2 ALL DONE. P3 (quality gates + merge) is next.
  Branch `feat/mcp_app_ui` has 4 commits ahead of `main`:
  1. P1 branding (logo, Lexend, Oak palette)
  2. P1b theming (CSS-only dark mode, multi-page dev server, Playwright tests)
  3. P2 SDK alignment (76 variable bridges, CSP, capability checks, connection state)
  4. Documentation + infrastructure (onboarding, turbo port isolation, portability gate)
  Widget validated in standalone dev mode, in basic-host sandbox, and via
  Playwright in both light/dark themes. 10 specialist reviewer passes across
  2 rounds. `pnpm check` passes (88 turbo tasks green).
- **Hard invariants / non-goals**:
  - No fallbacks — app brand defaults are correct on their own
  - Dark theme page bg is green-700 (#008237), NOT ink-950
  - Light theme page bg is mint-300 (#bef2bd)
  - CSS media query governs dark mode, not JS — data-theme only for SDK override
  - SDK variable bridge in widget CSS, NOT in token build pipeline
  - B4 downloadFile deferred to Phase 5 (scope creep)
  - `getUiCapability` deferred (incompatible with per-request server)
  - Reviewer sign-off required before each phase transition
- **Open questions / low-confidence areas**:
  - Pre-merge review (release-readiness-reviewer) not yet run
  - Phase 5 (interactive search widget) is unblocked but not started
- **Next safe step**: Run pre-merge review (release-readiness-reviewer),
  then merge `feat/mcp_app_ui` to `main`.
- **Deep consolidation status**: due — napkin at 560+ lines (rotation
  threshold 500), plan statuses updated, consolidation requested by user

## Active Workstreams (2026-04-07)

### 1. WS3 MCP App Rebuild — P3 MERGE READINESS

**Parent plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`
**Umbrella**: `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`

**Completed phases**: Phase 0-4 (infrastructure, scaffold, contracts, brand
banner). P0-P2 branding/SDK work on `feat/mcp_app_ui` branch.

**Branch status**: 4 commits, all reviewed, `pnpm check` passing. Ready
for pre-merge review and merge to `main`.

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
