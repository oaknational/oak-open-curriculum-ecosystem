---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-03
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

## Live Continuity Contract

- **Workstream**: MCP App migration (WS3 widget rebuild)
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md` (WS3 parent)
  - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md` (umbrella)
  - `.agent/plans/sdk-and-mcp-enhancements/current/ws3-oak-url-augmentable-codegen-fix.plan.md`
  - `.agent/plans/sdk-and-mcp-enhancements/current/ws3-contrast-validation-prerequisite.plan.md`
- **Completed plans** (prior sessions):
  - `.agent/plans/agentic-engineering-enhancements/archive/completed/continuity-and-surprise-practice-adoption.plan.md` — COMPLETE
  - `.agent/plans/agentic-engineering-enhancements/archive/completed/frontend-practice-integration-and-specialist-agents.plan.md` — COMPLETE
  - `.agent/plans/sdk-and-mcp-enhancements/archive/completed/ws3-design-token-prerequisite.plan.md` — COMPLETE
  - `.agent/plans/sdk-and-mcp-enhancements/archive/completed/ws3-merge-main-into-branch.plan.md` — COMPLETE
- **Current state**: WS3 Phase 3 canonical contracts are COMPLETE, including
  the non-UI host fallback proof. The merge-main plan is archived as COMPLETE
  at
  `.agent/plans/sdk-and-mcp-enhancements/archive/completed/ws3-merge-main-into-branch.plan.md`.
  Phases 4-6 are still pending. The design-token prerequisite is archived as
  COMPLETE at
  `.agent/plans/sdk-and-mcp-enhancements/archive/completed/ws3-design-token-prerequisite.plan.md`
  (all 6 work slices done, `pnpm check` green, adversarial review cycle
  passed). The frontend practice plan is archived as COMPLETE, so the
  specialist agents are available for widget UI work. Continuity adoption is
  also archived as COMPLETE at
  `.agent/plans/agentic-engineering-enhancements/archive/completed/continuity-and-surprise-practice-adoption.plan.md`
  after the 2026-04-03 `promote` decision; the outgoing note and Practice Core
  promotion both landed. OakUrl remediation is now active as prerequisite 1 of
  2 before Phase 4: `GetResponseBody`/`ValidGetPath` are generated, but the
  remaining build fixes are still open.
- **Current objective**: Complete two ordered prerequisites, then start
  Phase 4. The three pre-Phase-4 gates are COMPLETE:
  1. ✅ Portability validator extended (Check 11: skill permissions)
  2. ✅ Deferred review findings resolved (threadSlug removed,
     bulk-rollup-builder→Result, OakUrlAugmentable tracked as codegen fix,
     fakes.ts accepted with justification)
  3. ✅ Design conversation held — Phase 4 is a brand banner (not a data
     renderer), Phase 5 is user-first search with `callServerTool` +
     `updateModelContext`. ADR-151 records the styling independence decision.
  Two ordered prerequisites remain before Phase 4:
  1. **OakUrlAugmentable codegen fix** — plan at
     `.agent/plans/sdk-and-mcp-enhancements/current/ws3-oak-url-augmentable-codegen-fix.plan.md`.
     Partial progress: `GetResponseBody`/`ValidGetPath` generated, build errors
     pending (array spread, middleware guard, test fixtures). Key unlock:
     `schemaPath` from openapi-fetch middleware context enables honest validation
     with `isResponseJsonBody200`. Includes ADR-152 (Constant-Type-Predicate
     Pattern).
  2. **Contrast validation** — plan at
     `.agent/plans/sdk-and-mcp-enhancements/current/ws3-contrast-validation-prerequisite.plan.md`.
     WCAG contrast ratio validation + fix two blocking token violations.
- **Hard invariants / non-goals**:
  - Clean-break replacement of the out-of-date OpenAI-era app integration
  - Keep `search` as the model-facing, agent-facing search interface
  - Add `user-search` as the UI-first MCP App tool
  - Do not introduce custom tool-discovery, visibility, or presentation shims
  - Treat continuity as repo practice, not consciousness language
- **Recent surprises / corrections**:
  - User corrected Phase 4 framing: it is a brand banner (logo + "Oak
    National Academy" link), NOT a data renderer. The curriculum-model data
    serves the agent; the view serves the human with orientation.
  - User corrected OakUrlAugmentable reasoning: `Record<string, unknown>`
    is widening, full stop. The schema-first principle means we know every
    response type at codegen time. Fix is codegen-level (generate union of
    GET response body types), not an exception.
  - Contrast validation needs triadic model: button text + button surface +
    page background form a triad where all three pairwise ratios must pass.
  - Wider trawl of 7 repos found no reusable contrast/token/styling code.
    Nothing meets the bar for this repo. Build from W3C spec directly.
  - User corrected `unknown` usage: `unknown` is not a convenience — it is
    the destruction of hard-won understanding. Only permitted at incoming
    external boundaries. The generated type system is exhaustive; use it.
  - User corrected boundary-function proposal: don't create new plumbing.
    The existing constant → type → predicate infrastructure already has
    everything needed. Look harder before proposing new functions.
- **Open questions / low-confidence areas**:
  - Token set expansion for Phase 4/5: design-system reviewer identified
    gaps (link colours, hover surfaces, result-item tokens, font-size-400)
  - Focus ring contrast (2.08:1 light) and dark error colour (2.84:1) are
    blocking WCAG AA violations — must fix in contrast validation prereq
  - Whether `prefers-color-scheme` media query fallback is needed when
    the MCP host does not set `data-theme`
- **Remaining tracked items** (not blocking Phase 4 directly):
  - `fakes.ts` assertion — accepted, follow-up for codegen partial type
  - ESLint config suppressions not yet ADR-recorded
- **Next safe step**: Two ordered prerequisites before Phase 4:
  1. OakUrlAugmentable codegen fix (plan at
     `.agent/plans/sdk-and-mcp-enhancements/current/ws3-oak-url-augmentable-codegen-fix.plan.md`)
  2. Contrast validation prerequisite (plan at
     `.agent/plans/sdk-and-mcp-enhancements/current/ws3-contrast-validation-prerequisite.plan.md`)
- **Deep consolidation status**: Continuity rollout is closed and promoted.
  The completed continuity and design-token plans are now archived, SDK/MCP
  indexes expose OakUrl plus contrast as the live prerequisites, and this
  prompt has been reconciled to the new plan paths. Practice box empty.

## Active Workstreams (2026-04-03)

### 1. WS3 MCP App Rebuild — ACTIVE (OakUrl fix, contrast validation, then Phase 4)

**Parent plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`
**Umbrella**: `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`

**Completed phases**: Phase 0 (baseline/RED specs), Phase 2 (scaffold),
Phase 3 (canonical contracts + fallback proof).
**Completed prerequisites**:

- Design-token prerequisite — all 6 work slices, `pnpm check` green
- Three pre-Phase-4 gates — portability validator, deferred review
  findings, design conversation (ADR-151 written)

**Current prerequisites** (ordered):

1. `.agent/plans/sdk-and-mcp-enhancements/current/ws3-oak-url-augmentable-codegen-fix.plan.md`
   — replace `Record<string, unknown>` with schema-derived union + ADR-152.
   Partial progress: codegen types generated, build errors pending.
2. `.agent/plans/sdk-and-mcp-enhancements/current/ws3-contrast-validation-prerequisite.plan.md`
   — WCAG contrast ratio validation + fix two blocking token violations.
   Confirmed by Betty, Fred, and design-system reviewers.

**Pending**: Phase 4 (brand banner), Phase 5 (user search), Phase 6
(docs/gates/review).

**Next action**: Complete OakUrlAugmentable codegen fix, then contrast
validation, then Phase 4.

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
