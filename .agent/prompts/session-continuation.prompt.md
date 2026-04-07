---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-06
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
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-branding-alignment-and-merge.plan.md` (**PRIMARY** — plan-review gate passed, P1 ready)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-mcp-apps-sdk-audit.plan.md` (**SDK AUDIT** — items phased between P2 and Phase 5)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md` (WS3 parent)
  - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md` (umbrella)
- **Current state**: P0 DONE. P1 DONE + REVIEWED.
  P1 implemented and reviewed by 5 specialist reviewers (code,
  design-system, accessibility, react-component, architecture-barney).
  All findings addressed in-scope. Dark theme accent changed from
  gold (sun-300/sun-400) to Oak green family per user direction.
  Dev scripts hardened (port conflict detection, bun dependency check).
- **Current objective**: P2 SDK fixes (isConnected/error, capability
  checks, CSP, prefersBorder, TSDoc, README, governance doc),
  then P3 gates + merge.
- **Hard invariants / non-goals**:
  - No fallbacks — app brand defaults are correct on their own
  - ink-950 (#102033) stays UNCHANGED for dark surface-page
  - SDK variable bridge in widget CSS, NOT in token build pipeline
  - B4 downloadFile deferred to Phase 5 (scope creep)
  - `getUiCapability` deferred (incompatible with per-request server)
  - Reviewer sign-off required before each phase transition
- **P1 implementation summary (2026-04-07)**:
  - Palette: added oak-black, oak-green-500/600, mint-300, green-700
    (#008237 old Oak Green), oak-green-300/200 (dark accent).
    Removed fern-500/600, sun-300/400, paper-200.
  - Semantic: light accent = mint-300, dark accent links = oak-green-300
    (#78c85a), dark surface-accent = green-700 (#008237).
    focus-ring-on-accent added both themes. attention removed.
  - Font: Lexend via @import. weight-light (300), weight-bold (700).
  - Logo: real Oak acorn SVG from Oak-Web-Application sprite sheet.
  - Layout: compact top-aligned (removed 100vh centring).
  - A11y: visually-hidden new-tab warning, forced-colours focus ring.
  - Dev: port conflict detection, bun check, npm install path fix.
  - All contrast pairings pass WCAG AA in both themes.
  - Vite singlefile @import survives (BLOCKING check passed).
- **Open questions / low-confidence areas**:
  - oakGreen (#287c34) on paper-100 (#f4efe8) = ~4.58:1 — marginal
    for 4.5:1 text. Build validates exact ratio.
  - Dev tooling (dev:widget, dev:basic-host) needs user evaluation.
  - Pre-existing: portability:check fails on 4 vendor skill adapters
    (MCP Apps SDK skills without canonical counterparts).
- **Next safe step**: Session opens with user evaluation of dev
  tooling (dev:widget visual check in browser, dev:basic-host with
  bun installed). User confirms branding looks correct in both themes
  before P2 SDK fixes begin. Dev tooling evaluation is BLOCKING —
  do not start P2 until the user has validated the visual output.
- **Deep consolidation status**: completed this handoff — napkin
  updated (399 lines, below rotation threshold), plans synced,
  no graduation candidates, fitness informational (all pre-existing),
  no practice exchange needed

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
