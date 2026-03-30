---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-03-30
---

# Session Continuation

## Ground First

1. Read and internalise `.agent/directives/AGENT.md` and
   `.agent/directives/principles.md` — these are authoritative and
   override any conflicting detail in this prompt.
2. Find the current active plans in
   `.agent/plans/architecture-and-infrastructure/active/`. Priority
   order:
   - `ci-green-for-merge.plan.md` — **P0 BLOCKER**: fix Turbo cache
     invalidation and delete process-spawning E2E tests so PR #70
     passes CI
   - `build-tools-workspace-extraction.plan.md` — move root scripts
     into a proper workspace
   - `eslint-disable-remediation.plan.md` — remove ~64 remaining
     eslint-disable directives
   The CI consolidation plan is complete and ready to archive after
   branch merge.
3. Re-establish live branch state instead of trusting stale document
   snapshots:

```bash
git status --short
git diff --cached --stat
git log --oneline --decorate origin/feat/mcp_app..HEAD
```

## This Prompt's Role

- This file is the operational entry point only.
- The active plans are authoritative for scope, sequencing, acceptance
  criteria, and detailed validation. Consult them before marking any
  priority item complete.
- Do not duplicate volatile git facts, long file inventories, or full
  plan detail here.

## Active Work

1. **CI green for merge** (BLOCKING): Fix Turbo cache invalidation
   (add `package.json` to build inputs), delete remaining
   process-spawning E2E tests. See `ci-green-for-merge.plan.md`.
2. **Build tools workspace extraction**: Move root `scripts/` tests
   into a proper `build-tools/` workspace. See
   `build-tools-workspace-extraction.plan.md`.
3. **eslint-disable remediation** (~64 directives remain): See
   `eslint-disable-remediation.plan.md`.
4. **MCP App Extension Migration** (WS3/WS4 pending): Widget UI
   temporarily disabled for merge. See
   `sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`.

## Scope Boundaries (do NOT)

- Do not reopen the completed CI consolidation (all phases done)
  unless fresh CI evidence proves a regression.
- Do not re-enable widget UI (`WIDGET_TOOL_NAMES`) until WS3 is ready.
- Do not open new workstreams outside the active plans' scope.
- Do not refactor `apps/oak-curriculum-mcp-stdio` — it is outside the
  current workspace graph.
- Do not rely on ephemeral git state (stashes, reflogs) as
  continuation state; use the plans and branch state instead.

## Durable Guidance

- `pnpm check` is the decisive full-repo verification (includes clean,
  build, all gates). Use package-scoped filters while iterating; `pnpm
  check` is the final gate. `pnpm qg` is the read-only variant (no
  build, no auto-fix). `pnpm fix` auto-fixes format, markdownlint, lint.
- If `pnpm check` fails, diagnose by running individual gates.
- Use sub-agents for review before completing significant changes. See
  `.agent/directives/invoke-code-reviewers.md` for the full roster.
- The vocab-gen pipeline generates types from bulk download data, not
  from the OpenAPI schema. The cardinal rule (`pnpm sdk-codegen`) governs
  OpenAPI-derived types only. Do not conflate the two pipelines.

## Quality Gates

Full verification: `pnpm check`
Read-only check: `pnpm qg`
Auto-fix: `pnpm fix`
