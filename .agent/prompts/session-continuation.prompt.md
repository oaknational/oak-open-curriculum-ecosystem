---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-03-29
---

# Session Continuation

## Ground First

1. Read and internalise `.agent/directives/AGENT.md` and
   `.agent/directives/principles.md` — these are authoritative and
   override any conflicting detail in this prompt.
2. Find the current active plan in
   `.agent/plans/architecture-and-infrastructure/active/`. If all phases
   are complete, report completion and ask the user for the next priority.
3. Re-establish live branch state instead of trusting stale document
   snapshots:

```bash
git status --short
git diff --cached --stat
git log --oneline --decorate origin/feat/mcp_app..HEAD
```

## This Prompt's Role

- This file is the operational entry point only.
- The active plan is authoritative for scope, sequencing, acceptance
  criteria, and detailed validation. Consult it before marking any
  priority item complete.
- Do not duplicate volatile git facts, long file inventories, or full
  plan detail here.

## Immediate Priority

1. Finish Phase 3 eslint-disable remediation across the repo (~87
   actionable directives), starting with the generated-data rollout in
   `packages/sdks/oak-sdk-codegen/` and its `oak-curriculum-sdk`
   consumer, then proceeding through the categories listed in the plan
   (logger, test fakes, authored code, miscellaneous).
2. Reuse the shipped prerequisite-graph JSON loader pattern for the
   remaining large generated datasets. Before scaling: extract a generic
   JSON graph writer from the prerequisite-graph implementation (DRY).
3. Promote `@oaknational/no-eslint-disable` from `warn` to `error` when
   the remediation count hits zero.

## Scope Boundaries (do NOT)

- Do not reopen the completed CI consolidation (Phases 4-5) unless fresh
  CI evidence proves a regression.
- Do not modify widget deletion decisions (Phase 2 is settled).
- Do not open new workstreams outside the active plan's scope.
- Do not refactor `apps/oak-curriculum-mcp-stdio` — it is outside the
  current workspace graph.
- Do not rely on ephemeral git state (stashes, reflogs) as continuation
  state; use the plan and branch state instead.

## Durable Guidance

- `pnpm check` is the decisive full-repo verification (includes clean,
  build, all gates). Use package-scoped filters while iterating; `pnpm
  check` is the final gate. `pnpm qg` is the read-only variant (no
  build, no auto-fix). `pnpm fix` auto-fixes format, markdownlint, lint.
- If `pnpm check` fails, diagnose by running individual gates from the
  plan's local loop section.
- Use sub-agents for review before completing significant changes. See
  `.agent/directives/invoke-code-reviewers.md` for the full roster.
- The vocab-gen pipeline generates types from bulk download data, not
  from the OpenAPI schema. The cardinal rule (`pnpm sdk-codegen`) governs
  OpenAPI-derived types only. Do not conflate the two pipelines.

## Key References

- Active plan directory:
  `.agent/plans/architecture-and-infrastructure/active/`
- CI workflow: `.github/workflows/ci.yml`
- Enforcement rule:
  `packages/core/oak-eslint/src/rules/no-eslint-disable.ts`
- Reporter: `scripts/ci-turbo-report.mjs`
- Content hook + tests: `scripts/check-blocked-content.mjs`,
  `scripts/check-blocked-content.unit.test.ts`,
  `scripts/check-blocked-content.integration.test.ts`

## Quality Gates

Full verification: `pnpm check`
Read-only check: `pnpm qg`
Auto-fix: `pnpm fix`
