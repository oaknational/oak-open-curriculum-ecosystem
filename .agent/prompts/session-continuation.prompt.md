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

- **Workstream**: MCP App migration (WS3 widget rebuild)
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md` (WS3 parent)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-off-the-shelf-mcp-sdk-adoption.plan.md` (SDK adoption — COMPLETE)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-4-brand-banner.plan.md` (companion — COMPLETE)
  - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md` (umbrella)
- **Current state**: SDK adoption all 5 phases COMPLETE and committed
  on `feat/mcp_app_ui` (2026-04-06). Host verification pending.
  Type-correctness audit completed: new rule
  `unknown-is-type-destruction.md`, type-reviewer upgraded to 12
  Commandments, DRY consolidation of principles/governance docs.
- **Current objective**: Host verification (rebuild, dev:auth:stub,
  get-curriculum-model, verify banner). Then proceed to WS3 Phase 5
  (interactive user search view).
- **Hard invariants / non-goals**:
  - Clean-break replacement of the out-of-date OpenAI-era app integration
  - Keep `search` as the model-facing, agent-facing search interface
  - Add `user-search` as the UI-first MCP App tool
  - Do not introduce custom tool-discovery, visibility, or presentation shims
  - Use off-the-shelf ext-apps SDK functions, not hand-rolled plumbing
- **Remaining tracked items**:
  - `fakes.ts` assertion — accepted, follow-up for codegen partial type
  - ESLint config suppressions not yet ADR-recorded
  - Host verification for SDK adoption Phase 5
- **Recent surprises / corrections**: Type-reviewer recommended
  `z.unknown()` which is type destruction, not type safety. Then
  hand-crafted `JsonSchemaPropertySchema` was entropy (shadow type).
  Both caught by human review. Led to type-correctness audit: new
  canonical rule, 12 Commandments in type-reviewer, DRY
  consolidation. `.merge()` was NOT deprecated in Zod v4 — docs
  claimed otherwise (fixed). `core.$ZodIssue` import path was
  fragile — replaced with `ZodError['issues'][number]`.
- **Open questions / low-confidence areas**: None.
- **Next safe step**: Host verification, then WS3 Phase 5 (user
  search view).
- **Deep consolidation status**: completed this handoff — napkin
  rotated (559→fresh), 1 pattern extracted
  (reviewer-widening-is-always-wrong), 2 distilled entries merged,
  `unknown` graduated to canonical rule. Practice outgoing: the
  `unknown-is-type-destruction` concept may warrant Practice Core
  promotion (deferred — requires user approval).

## Active Workstreams (2026-04-06)

### 1. WS3 MCP App Rebuild — ACTIVE (SDK adoption COMPLETE)

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

**Pending after adoption plan**: Host verification, then WS3 Phase 5
(user search), Phase 6 (docs/gates/review).

**Next action**: Host verification (rebuild, dev:auth:stub, call
get-curriculum-model in Claude Code, verify banner). Then WS3 Phase 5.

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
