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

- **Workstream**: MCP App migration (WS3 widget rebuild), with continuity
  adoption running alongside
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md` (WS3 parent)
  - `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md` (umbrella)
  - `.agent/plans/agentic-engineering-enhancements/current/continuity-and-surprise-practice-adoption.plan.md`
- **Completed plans** (this session):
  - `.agent/plans/agentic-engineering-enhancements/archive/completed/frontend-practice-integration-and-specialist-agents.plan.md` — COMPLETE
  - `.agent/plans/sdk-and-mcp-enhancements/archive/completed/ws3-merge-main-into-branch.plan.md` — COMPLETE
- **Current state**: WS3 Phase 3 canonical contracts are COMPLETE, including
  the non-UI host fallback proof. The merge-main plan is archived as COMPLETE
  at
  `.agent/plans/sdk-and-mcp-enhancements/archive/completed/ws3-merge-main-into-branch.plan.md`.
  Phases 4-6 are still pending. The design-token prerequisite plan at
  `.agent/plans/sdk-and-mcp-enhancements/current/ws3-design-token-prerequisite.plan.md`
  is now COMPLETE (all 6 work slices done, `pnpm check` green, adversarial
  review cycle passed). The frontend practice plan is archived as COMPLETE,
  so the specialist agents are available for widget UI work. Continuity
  adoption evidence now includes a real WS3 resumption, a `GO` session
  entry, and a second deep-consolidation entry.
- **Current objective**: Start WS3 Phase 4 (curriculum-model view) using
  the canonical `@oaknational/oak-design-tokens` package CSS and the
  component-tier token system established in the prerequisite. Before
  Phase 4, a follow-up commit addresses widget resilience (StrictMode,
  callback exception isolation, safe dispatch, exhaustive reducer) and
  design token documentation (`$description`, dark theme intent, boundary
  rules). This commit is staged but not yet landed.
- **Hard invariants / non-goals**:
  - Clean-break replacement of the out-of-date OpenAI-era app integration
  - Keep `search` as the model-facing, agent-facing search interface
  - Add `user-search` as the UI-first MCP App tool
  - Do not introduce custom tool-discovery, visibility, or presentation shims
  - Treat continuity as repo practice, not consciousness language
- **Recent surprises / corrections**:
  - Comprehensive review scope creep: 5-reviewer cycle on the full branch
    expanded into fixing pre-existing SDK issues. User correction: separate
    in-scope from pre-existing, fix in-scope, defer pre-existing.
  - `console` ban means "use canonical logger", not "use IO primitives".
  - `Record<string, unknown>` is sometimes the honest structural constraint
    when functions use dynamic property checks across 5+ entity shapes.
  - WAI-ARIA 1.3 Editor's Draft is the preferred working reference.
  - axe-core WCAG 2.1 rules have their own tag family (`wcag21a`, `wcag21aa`)
- **Open questions / low-confidence areas**:
  - Whether the v1 token set needs expansion for Phase 4/5 views
- **Deferred review findings** (next session must evaluate each):
  - **Needs architectural decision**: `OakUrlAugmentable =
    Readonly<Record<string, unknown>>` — investigation proved the type is
    structurally correct for 5+ dynamic entity shapes. The ESLint ban is
    over-broad for this case. Needs an ADR or rule exception, not a type
    change. File: `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`
  - **Needs codegen-level solution**: `as OakApiPathBasedClient` in
    `src/test-helpers/fakes.ts` — 100+ generated path signatures make
    `Partial<>` unviable. Only 2 callers. Config suppression is documented.
  - **Quick fix, was reverted during scope correction**:
    `void threadSlug` in `oak-url-convenience.ts` (no callers, remove param),
    `@security` TSDoc tag in `resource-parameter-validator.ts` (one word)
  - **Real Result-pattern violation**: `throw new Error` in
    `apps/oak-search-cli/src/adapters/bulk-rollup-builder.ts:200` — should
    use `Result<T, Error>`. Cascade through `HybridDataSource` interface.
  - **Documented constraints**: ESLint config-level suppressions for
    `max-lines`, `consistent-type-assertions` (negative tests) in SDK
    workspace — justified in config comments but not yet ADR-recorded
- **Next safe step**: Before starting Phase 4, resolve or close every
  deferred review finding listed below. Each item must be either fixed,
  recorded as an ADR exception, or documented as intentionally accepted
  with a justification. Only then start Phase 4 per
  `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-4-curriculum-model-view.plan.md`.
- **Deep consolidation status**: complete — the WS3 Phase 3/security-closure
  batch has been consolidated, the merge-main plan archived, and the second
  deep-consolidation evidence entry recorded. The broader evidence window
  remains open until the resumption and `GO` thresholds are met.

## Active Workstreams (2026-04-03)

### 1. WS3 MCP App Rebuild — ACTIVE (token prerequisite complete, Phase 4 next)

**Parent plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`
**Umbrella**: `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`

**Completed phases**: Phase 0 (baseline/RED specs), Phase 2 (scaffold),
Phase 3 (canonical contracts + fallback proof).
**Completed prerequisite**:
`.agent/plans/sdk-and-mcp-enhancements/current/ws3-design-token-prerequisite.plan.md`
— all 6 work slices complete, `pnpm check` green, adversarial review passed.
Comprehensive 5-reviewer branch review also done (code, type, fred, security,
wilma). In-scope findings fixed; pre-existing SDK findings deferred.
**Pending**: Phase 4 (curriculum view), Phase 5 (search view), Phase 6
(docs/gates/review). Design token infrastructure is now in place.

**Next action**: Resolve or close every deferred review finding, then
start Phase 4.

### 2. Frontend Practice Integration — COMPLETE

**Plan**: `.agent/plans/agentic-engineering-enhancements/archive/completed/frontend-practice-integration-and-specialist-agents.plan.md`

Complete. Three ADR-129 agent triplets (accessibility-reviewer,
design-system-reviewer, react-component-reviewer) with full platform
adapters. Three review rounds passed. Design token infrastructure
cancelled as out of scope — belongs in WS3 or a dedicated plan.

### 3. Continuity Adoption — WAVE 1 INSTALLED

**Plan**: `.agent/plans/agentic-engineering-enhancements/current/continuity-and-surprise-practice-adoption.plan.md`

Wave 1 surfaces landed. Evidence capture now includes two
deep-consolidation entries, but the evidence window is not yet complete
because the resumption and `GO` quotas are still open.

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

- Run `pnpm qg` as the canonical non-mutating readiness gate before each commit.
- Run `pnpm fix` to apply auto-fixes.
- Run `pnpm check` as the full scrub before push/merge.
- Keep this prompt concise and operational; do not duplicate plan authority.
