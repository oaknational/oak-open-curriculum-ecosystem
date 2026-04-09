---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-09
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

- **Workstream**: PR #76 production-startup closeout + Phase 5 queue
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-6-docs-gates-review-commit.plan.md`
    (**ACTIVE** — merge-handoff closeout reopened by the post-CI Vercel startup
    failure; targeted recovery is green locally, final aggregate rerun pending)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-5-interactive-user-search-view.plan.md`
    (**QUEUED** — post-merge interactive user-search UI)
  - `.agent/plans/sdk-and-mcp-enhancements/active/misconception-graph-mcp-surface.plan.md`
    (post-merge)
- **Current state**: Branch `feat/mcp_app_ui` is carrying the post-CI
  production-startup recovery for PR #76 after the Vercel preview built
  successfully but crashed on startup. The root cause was a dev-vs-built
  resolver mismatch: `tsx` tolerated extensionless MCP SDK subpath imports that
  plain Node ESM rejected in built code. The HTTP app imports were corrected,
  the code generator was fixed and regenerated so emitted MCP SDK imports use
  `.js` suffixes, and a built-artifact E2E proof now imports
  `dist/application.js` under plain Node. The follow-on lint false negative on
  those correct `.js` imports was then fixed by standardising active workspace
  ESLint configs on `import-x/resolver-next` with chained TypeScript + Node
  resolvers. Targeted recovery evidence is green:
  - `pnpm --filter @oaknational/sdk-codegen test -- --run ...generate-execute-file.unit.test.ts ...stub-modules.unit.test.ts ...generate-tool-descriptor-file.unit.test.ts`
  - `pnpm exec turbo run build --filter=@oaknational/oak-curriculum-mcp-streamable-http --continue --force`
  - plain-Node import of `apps/oak-curriculum-mcp-streamable-http/dist/application.js`
  - `pnpm --dir apps/oak-curriculum-mcp-streamable-http exec vitest run --config vitest.e2e.config.ts e2e-tests/built-artifact-import.e2e.test.ts e2e-tests/built-server.e2e.test.ts`
  - `pnpm --dir apps/oak-curriculum-mcp-streamable-http type-check`
  - targeted lint/type-check sweeps for `@oaknational/eslint-plugin-standards`,
    `@oaknational/sdk-codegen`,
    `@oaknational/oak-curriculum-mcp-streamable-http`,
    `@oaknational/search-cli`, `@oaknational/oak-search-sdk`, and
    `@oaknational/curriculum-sdk`
  PR #76 status remains otherwise unchanged:
  - Phase 4.5 archived complete with T7-T9 closure evidence
  - 24 generated + 10 aggregated = 34 total live tools
  - Phase 5 remains post-merge
  - Potentially flaky E2E test noted (see napkin)
- **Current objective**: Finish the Phase 6 closeout by rerunning the final
  aggregate gate on the resolver-standardised merge candidate, then
  commit/push the production-startup recovery, recheck the deployed
  preview/smoke path, and merge PR #76. Phase 5 stays on a fresh post-merge
  branch.
- **Hard invariants / non-goals**:
  - No compatibility shims or invented optionality on the tool-shape contract
  - `inputSchema` always present (empty `{}` for no-input, per MCP spec)
  - Title and description required on `UniversalToolListEntry`
  - Do not make source-imported unit/integration tests depend on build
    artefacts; prove production startup by executing built code separately
  - Do not loosen or disable lint/import/dependency checks to hide config or
    manifest problems; make resolver settings and workspace manifests tell the
    truth
  - Dark theme page bg is green-700 (#008237), NOT ink-950
  - Light theme page bg is mint-300 (#bef2bd)
  - CSS media query governs dark mode, not JS
  - Widget URI uses `ui://` scheme per spec
  - `readBuiltWidgetHtml` is async (`node:fs/promises`)
- **Recent surprises / corrections**:
  - `tsx` masked a built-runtime defect: source execution worked while deployed
    Node ESM crashed on extensionless `@modelcontextprotocol/sdk/*` subpaths.
  - Fixing the app imports alone was insufficient; generated MCP SDK runtime
    files also needed `.js` suffixes at the generator source of truth.
  - `import-x/no-unresolved` was disagreeing with both TypeScript and Node on
    correct `.js` MCP SDK subpath imports; the fix was resolver standardisation
    (`import-x/resolver-next` + TypeScript + Node), not backing out the
    runtime-correct specifiers.
- **Open questions / low-confidence areas**:
  - Need one final aggregate `pnpm check` rerun after the repo-wide ESLint
    resolver standardisation; targeted sweeps are green but the full merge
    candidate has not been replayed yet
  - Need post-push confirmation that the Vercel preview now starts cleanly under
    the deployed build/runtime path
  - Potentially flaky E2E test: `get-curriculum-model.e2e.test.ts`
    (passed in isolation, failed once during `pnpm check`)
- **Next safe step**: Review the remaining dirty tree, rerun `pnpm check` on
  the merge candidate, then commit/push the branch and rerun the deployed
  preview/smoke path before merging PR #76.
- **Deep consolidation status**: not due — the resolver-standardisation lesson
  was already captured in the quality-gate hardening plan and this handoff only
  needed continuity sync plus napkin capture.

## Active Workstreams (2026-04-09)

### 1. WS3 MCP App Rebuild — P3 MERGE HANDOFF

**Parent plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`
**Umbrella**: `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`

**Completed phases**: Phase 0-4 (infrastructure, scaffold, contracts, brand
banner). P0-P2 branding/SDK work on `feat/mcp_app_ui` branch.

**Branch status**: Phase 4.5 wrap-up is archived complete on
`feat/mcp_app_ui`. Phase 6 pre-merge closure was reopened by a post-CI Vercel
startup failure; the recovery and built-artifact proof are green locally, and
the remaining work is closeout commit/push plus preview confirmation before
merge.

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
