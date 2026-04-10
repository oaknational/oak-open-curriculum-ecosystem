---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-10
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

- **Workstream**: PR #76 merge-handoff after local production-startup recovery,
  Vercel/bootstrap remediation, and HTTP dev-contract alignment; Phase 5 stays
  queued post-merge
- **Active plans**:
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-6-docs-gates-review-commit.plan.md`
    (**ACTIVE** — local gates, built-runtime proof, and contamination check are
    green; commit/push plus deployed preview recheck remain)
  - `.agent/plans/sdk-and-mcp-enhancements/active/vercel-mcp-build-warnings-and-bootstrap.plan.md`
    (**ACTIVE** — Phase 0 baseline is evidenced from the provided build log;
    local Phase 1/1b/2 fixes and docs are green; deployed preview/build-log
    verification still pending)
  - `.agent/plans/sdk-and-mcp-enhancements/active/ws3-phase-5-interactive-user-search-view.plan.md`
    (**QUEUED** — post-merge interactive user-search UI)
  - `.agent/plans/sdk-and-mcp-enhancements/active/misconception-graph-mcp-surface.plan.md`
    (post-merge)
- **Current state**: Branch `feat/mcp_app_ui` now carries the local merge-ready
  remediation set for the post-CI Vercel startup failure:
  - built runtime reads the widget from `process.cwd()/dist/oak-banner.html`
    and the relocation-style built-artifact proof passes under plain Node
  - the MCP SDK/runtime `.js` import fix, resolver-standardisation, and warning
    cleanup remain in place
  - Vercel-related local follow-up is green: Turbo env pass-through added,
    `canonical-url-map.json` missing-data logging reduced to INFO, and the
    `vite-plugin-singlefile` deprecation removed without changing the widget
    contract
  - HTTP dev orchestration now lives in
    `apps/oak-curriculum-mcp-streamable-http/operations/`; `pnpm dev*`
    auto-builds and watches the canonical widget artefact before booting the
    source server
  - validation is green locally: targeted workspace tests, live
    `dev:observe:noauth` acceptance after deleting `dist/`, canonical runtime
    contamination check (zero hits), targeted built-artifact E2E, and full
    `pnpm check`
- **Current objective**: Commit and push the truthful merge-handoff state,
  recheck the deployed Vercel preview/build logs, and merge PR #76 once the
  preview starts cleanly and the enumerated warnings stay gone. Phase 5 remains
  post-merge on a fresh branch.
- **Hard invariants / non-goals**:
  - No compatibility shims or invented optionality on the tool-shape contract
  - `inputSchema` always present (empty `{}` for no-input, per MCP spec)
  - Title and description required on `UniversalToolListEntry`
  - Do not make source-imported unit/integration tests depend on build
    artefacts; prove production startup by executing built code separately
  - Keep `dist/oak-banner.html` as the single runtime widget contract; no
    `public/` copy, no second source of truth, no runtime `NODE_ENV` /
    `VERCEL` branching for widget loading
  - Complex dev tooling belongs in workspace `operations/`, not `scripts/`
  - Do not loosen or disable lint/import/dependency checks to hide config or
    manifest problems; make resolver settings and workspace manifests tell the
    truth
  - Widget URI uses `ui://` scheme per spec
  - `readBuiltWidgetHtml` is async (`node:fs/promises`)
- **Recent surprises / corrections**:
  - The clean widget bootstrap fix was path anchoring, not a move to `public/`
    or a Vercel-specific asset override: the MCP server loads widget HTML as a
    resource payload, not via `express.static()`
  - "Dev from source, prod from build" belongs in orchestration, not runtime
    branching: keep one runtime contract (`dist/oak-banner.html`) and make the
    dev entrypoint materialise it automatically
  - `pnpm exec` wrappers were insufficient for managed shutdown; direct
    workspace binaries were required to keep the watcher and source server under
    deterministic child-process ownership
- **Open questions / low-confidence areas**:
  - Need post-push confirmation that the Vercel preview now starts cleanly
    under the deployed build/runtime path and that the enumerated warning
    classes are absent from the fresh build log
  - If preview verification still disagrees with local evidence, a human
    dashboard check of the Vercel project root/build settings may still be
    needed; no Vercel CLI usage is allowed on this branch
  - Potentially flaky E2E test: `get-curriculum-model.e2e.test.ts`
    (passed in isolation, failed once during `pnpm check`)
- **Next safe step**: Review the final working tree, commit the Vercel/bootstrap
  and HTTP dev-contract changes, push `feat/mcp_app_ui`, then verify preview
  startup and build logs via the deployed surface before merging PR #76.
- **Deep consolidation status**: completed this handoff — continuity surfaces
  synced, napkin rotated, duplicated distilled entries graduated/pruned, and
  fitness rechecked.

## Active Workstreams (2026-04-10)

### 1. WS3 MCP App Rebuild — P3 MERGE HANDOFF

**Parent plan**: `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`
**Umbrella**: `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`

**Completed phases**: Phase 0-4 (infrastructure, scaffold, contracts, brand
banner). P0-P2 branding/SDK work on `feat/mcp_app_ui` branch.

**Branch status**: Phase 4.5 wrap-up is archived complete on
`feat/mcp_app_ui`. Phase 6 pre-merge closure is now at truthful merge-handoff:
local recovery, warning cleanup, contamination check, and `pnpm check` are
green; remaining work is commit/push plus preview confirmation before merge.
**Parallel**: `vercel-mcp-build-warnings-and-bootstrap.plan.md` remains active
until the deployed preview/build-log path is rechecked.

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
