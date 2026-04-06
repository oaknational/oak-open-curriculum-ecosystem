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
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-branding-alignment-and-merge.plan.md` (**PRIMARY** — P0-P3)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md` (WS3 parent)
  - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md` (umbrella)
- **Current state**: Branding plan REVIEWED by 5 specialists. All
  blocking findings resolved in the plan. Design decisions confirmed:
  mint `#bef2bd` (surface), `#222222` (text), Lexend (embedded
  @font-face), real Oak logo SVG, minimal banner height. Canonical
  MCP App styling doc written (`docs/governance/mcp-app-styling.md`).
  Official upstream MCP App skills installed. Custom skills removed.
  Host context pattern aligned with official SDK docs (imperative
  `applyDocumentTheme`/`applyHostStyleVariables`/`applyHostFonts`
  in `useEffect`). No code changes to product files yet — plan only.
- **Current objective**: Execute P0 (dev infra), P1 (branding), P2
  (host context alignment), P3 (quality gates + merge to `main`).
- **Hard invariants / non-goals**:
  - No fallbacks — app brand defaults are correct on their own; host
    overrides are optional via CSS specificity
  - Use off-the-shelf SDK patterns, not custom plumbing
  - `getUiCapability` deferred (incompatible with per-request server)
  - Dark theme: minimal adjustment only, #222222 is LIGHT-THEME-ONLY
- **Recent surprises / corrections**:
  - basic-host is NOT an npm package — must clone ext-apps repo
  - Single-callback-slot: disputed between reviewers (v1.3.2 bundle
    vs GitHub source). Resolved: use imperative functions in useEffect
    per official patterns, not convenience hooks.
  - `getUiCapability` incompatible with per-request stateless server
    (ADR-112) — text content[] already provides the correct behaviour
  - "Fallback" language corrected to "app brand defaults"
- **Open questions / low-confidence areas**:
  - Whether `fern-500`/`fern-600` can be removed after semantic
    remapping or are still referenced elsewhere
- **Next safe step**: Execute P0 — add `dev:widget` and
  `dev:basic-host` scripts, verify banner renders in basic-host.
- **Deep consolidation status**: due — new governance doc created,
  plans consolidated, custom skills removed, official skills
  installed, 5 reviewer findings addressed

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
