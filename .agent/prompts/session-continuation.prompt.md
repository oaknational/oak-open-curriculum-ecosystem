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
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-branding-alignment-and-merge.plan.md` (**PRIMARY** — P1b dev DX in progress)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-mcp-apps-sdk-audit.plan.md` (**SDK AUDIT** — items phased between P2 and Phase 5)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md` (WS3 parent)
  - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md` (umbrella)
- **Current state**: P0 DONE. P1 DONE + REVIEWED. P1b IN PROGRESS.
  P1b reworked dev DX and theme system during user visual evaluation:
  - Widget HTML renamed `mcp-app.html` → `index.html` (serves at `/`)
  - Vite plugin watches design token sources and rebuilds CSS on change
  - Token build has dev mode (`OAK_TOKEN_DEV=1`) — contrast warnings not errors
  - Dark theme CSS now via `@media (prefers-color-scheme: dark)` — no JS required
  - Inline theme script removed — CSS media query handles initial theme
  - Light theme: mint-300 page bg, oak-black text AND accent (matching Oak website)
  - Dark theme: green-700 (#008237) page bg, paper-050 (white) text and accent
  - Contrast pairings updated: removed accent-strong text checks, accent surface
    changed to oak-green-600 in dark for text-primary contrast
  - `dev:widget-in-host` (renamed from `dev:basic-host`) confirmed to require bun
    — prerequisite checks, pinned to ext-apps v1.3.2, uses /healthz for server check
  - Both colour schemes validated by user; widget verified working in basic-host
- **Current objective**: Complete P1b validation (user confirms both
  themes visually), then P2 SDK fixes.
  BLOCKING PREREQUISITE: playwright+axe-core a11y tests must be in
  place before building a second widget/view.
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
  - User still evaluating light/dark colour schemes — may need further adjustments
  - dev:widget-in-host validated by user — widget renders correctly in sandboxed host
  - 4 contrast violations existed before this session's fix; all now resolved
    but theme may change further based on user feedback
  - Pre-existing: portability:check fails on 4 vendor skill adapters
- **Next safe step**: User confirms both themes look correct visually.
  If adjustments needed, iterate using the live token watch dev loop.
  After visual sign-off, run `pnpm check` full quality gate, then
  proceed to P2 SDK fixes. Playwright+axe-core tests needed before
  second widget.
- **Deep consolidation status**: completed this handoff — napkin
  updated with 2026-04-07b session, memories saved, patterns extracted

## Active Workstreams (2026-04-06, updated end of session)

### 1. WS3 MCP App Rebuild — ACTIVE (SDK adoption + host verification COMPLETE)

**Parent plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`
**Umbrella**: `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`
**Adoption plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-off-the-shelf-mcp-sdk-adoption.plan.md`

**Completed phases**: Phase 0 (baseline/RED specs), Phase 2 (scaffold),
Phase 3 (canonical contracts + fallback proof), Phase 4 (brand banner).

**Off-the-shelf SDK adoption progress**:

- **Phase 1 COMPLETE** (2026-04-05): codegen `.meta({ examples })`.
  7 unit tests + 3 integration tests. 5 specialist reviews passed.
- **Phase 2 COMPLETE** (2026-04-05): all 10 aggregated tools have
  `flatZodSchema`. `flatZodSchema` required on `UniversalToolListEntry`.
  Dead fallback removed. Structural equivalence test. Fetch promoted
  to directory. 5 specialist reviews passed. 19 new tests (726 total).
- **Phase 3 COMPLETE** (2026-04-05): `registerAppTool` for UI tools,
  `registerAppResource` for widget. Shim deleted (pulled forward from
  Phase 4). `toProtocolEntry` deleted. `isAppToolEntry` type guard
  and `toAppToolRegistrationConfig` projection added. Generator
  `readonly` visibility fix. 5 specialist reviews passed. 8 new
  tests with guard assertions.
- **Phase 4 COMPLETE** (2026-04-05): deleted all dual-schema dead
  code. `zod-input-schema.ts` eliminated. `inputSchema` removed from
  `UniversalToolListEntry`. All `*_INPUT_SCHEMA` constants deleted.
  Structural equivalence test removed (purpose fulfilled).
- **Phase 5 COMPLETE** (2026-04-06): E2E pipeline test committed.
  5 assertions prove tools/list → _meta → resources/read → HTML.
  Reviewed by code-reviewer, test-reviewer, mcp-reviewer,
  type-reviewer.

**Host verification**: COMPLETE (2026-04-06). Server-side pipeline
verified correct. Claude Code does not support MCP Apps rendering —
use MCPJam or basic-host. 8 specialist reviewers passed with zero
critical issues. Legacy compatibility tests removed.

**Next action**: Oak branding update for banner, then merge
`feat/mcp_app_ui` to `main`. Phase 5 (interactive user search view)
and local widget dev infrastructure deferred to next branch.

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
