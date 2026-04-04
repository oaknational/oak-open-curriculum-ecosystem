---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-04
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
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md` (WS3 parent — Phase 4 section MUST be corrected, see below)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-4-curriculum-model-view.plan.md` (companion — MUST rename to `ws3-phase-4-brand-banner.plan.md` and correct)
  - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md` (umbrella)
- **Current state**: WS3 Phase 4 Slice 1 is COMPLETE. Slice 2 is pending.
  Phase 4 delivers: when `get-curriculum-model` fires, the MCP App shows
  the Oak brand banner — logo + "Oak National Academy" link. No content
  area. Just branding. `get-curriculum-model` is a session-start proxy;
  the data serves the agent; the banner serves the human.
  - ✅ Slice 1 code: 4 contrast pairings (accent text), `font.size-400`,
    7 banner component tokens, inline SVG logo with `currentColor`,
    `BrandBanner.tsx`, CSS, wired into `App.tsx`, diagnostic scaffold
    deleted, 17 widget tests passing, build + type-check + lint + test green.
  - ⬜ Slice 2 pending: `pnpm check`, correct parent/companion plans,
    3 targeted specialist reviewers (design-system, accessibility, mcp),
    documentation updates, session learnings.
- **Current objective**: Complete Phase 4 Slice 2 — quality gates, plan
  corrections, targeted review, documentation.
- **Hard invariants / non-goals**:
  - Clean-break replacement of the out-of-date OpenAI-era app integration
  - Keep `search` as the model-facing, agent-facing search interface
  - Add `user-search` as the UI-first MCP App tool
  - Do not introduce custom tool-discovery, visibility, or presentation shims
  - The banner is NOT a "curriculum model view" — it is the brand banner
  - `get-curriculum-model` is a session-start proxy; the banner is not a
    view of that tool's data
  - No content area below the banner — just the branding
  - No routing infrastructure in Phase 4 (Phase 5 adds when needed)
- **Recent surprises / corrections**:
  - User corrected Phase 4 framing THREE times to nail precision:
    (1) It is a brand banner, NOT a data renderer. (2) The banner is NOT
    "the curriculum model view" — `get-curriculum-model` is a session-start
    proxy. (3) The banner is displayed when the tool fires, with NO content
    area — just the branding, centred.
  - Parent plan Phase 4 section says "Curriculum Model View" — this is
    WRONG and must be corrected in Slice 2.
  - 5 specialist reviewers consulted pre-implementation: design-system,
    accessibility, MCP, assumptions, architecture-barney. Key decisions:
    SVG with `currentColor`, `<a href onClick>` not `<button>`, combined
    link (H2), accent text-context pairings, callback props not SDK.
  - Assumptions reviewer simplified plan from 5 to 4 then 3 to 2 slices.
    Architecture-barney eliminated ToolRouter and OakLogo as separate files
    (single-consumer rule).
  - ESLint `lint:fix` merged value imports with type imports, breaking
    type-check. Fixed by using inline `type` keyword in the combined import.
- **Open questions / low-confidence areas**:
  - `prefers-color-scheme` CSS fallback — progressive enhancement, not
    blocking. To be tracked as follow-up.
  - Logo SVG fidelity — the inline SVG is a geometric approximation of
    the original PNG. Visual verification in `basic-host` needed.
- **Remaining tracked items** (not blocking Slice 2):
  - `fakes.ts` assertion — accepted, follow-up for codegen partial type
  - ESLint config suppressions not yet ADR-recorded
  - `appInfo.version` wired to build constant
- **Next safe step**: Complete Phase 4 Slice 2. Run `pnpm check`. Correct
  parent plan (rename "Curriculum Model View" → "Brand Banner" throughout).
  Rename companion plan file. Invoke 3 targeted reviewers (design-system,
  accessibility, mcp). Update documentation. Capture napkin learnings.
- **Deep consolidation status**: Not due — Slice 2 work (plan corrections,
  reviewer pass) will handle the parent plan drift. Napkin updated this
  session. No new practice-box incoming. No plan closure yet.

## Active Workstreams (2026-04-04)

### 1. WS3 MCP App Rebuild — ACTIVE (Phase 4 Slice 2 next)

**Parent plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`
**Umbrella**: `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`

**Completed phases**: Phase 0 (baseline/RED specs), Phase 2 (scaffold),
Phase 3 (canonical contracts + fallback proof).
**Phase 4 Slice 1**: COMPLETE — brand banner implemented. Tokens (4
contrast pairings, `font.size-400`, 7 component tokens), inline SVG logo
with `currentColor`, `BrandBanner.tsx`, CSS, wired into `App.tsx`,
diagnostic scaffold deleted, all gates green.

**Phase 4 Slice 2**: PENDING — `pnpm check`, correct parent/companion
plans (rename "Curriculum Model View" → "Brand Banner"), 3 targeted
specialist reviewers, documentation.

**Pending after Phase 4**: Phase 5 (user search), Phase 6
(docs/gates/review).

**Next action**: Complete Slice 2 — quality gates, plan corrections,
targeted review.

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
