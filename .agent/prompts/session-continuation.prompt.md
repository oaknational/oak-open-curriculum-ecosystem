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
2. Find the current active plan:
   - `ci-green-for-merge.plan.md` — **P0 BLOCKER**: all fixes applied,
     needs push and CI verification on PR #70
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

## Active Work

1. **CI green for merge** (BLOCKING): Root cause found and fixed.
   Turbo task-specific overrides for sdk-codegen were missing `outputs`
   and `inputs` (Turbo replaces, does not merge). `sdk-codegen#build`
   had `outputs: []` — cache restored zero files, downstream type-check
   failed. All 5 overrides now have full field sets. `pnpm check`
   passes locally (64/64). Next: push and verify CI green. See
   `ci-green-for-merge.plan.md` for full evidence trail.

## Completed This Session

- **Root cause diagnosed**: Turbo task overrides replace (not merge)
  generic definitions. `sdk-codegen#build` had `outputs: []` — empty
  cache restoration. Three prior sessions misdiagnosed this as cache
  invalidation.
- **All 5 sdk-codegen overrides** now have explicit `outputs`, `inputs`,
  `cache` matching their generic parent tasks.
- Deleted process-spawning E2E tests + orphaned harness + dead code
- Created GO skill SKILL.md + Cursor adapter (portability fix)
- Replaced 14 Clerk skill symlinks with real adapter files
- Created no-symlinks rule, adapters, and principle
- Updated test audit plan with full process-spawning inventory (7 files)
- `pnpm check` passes locally (exit code 0, 64/64 tasks)

## Scope Boundaries (do NOT)

- Do not open new workstreams outside the active plan's scope.
- Do not refactor `apps/oak-curriculum-mcp-stdio` — it is outside the
  current workspace graph.
- Do not rely on ephemeral git state (stashes, reflogs) as
  continuation state; use the plan and branch state instead.

## Durable Guidance

- **Run `pnpm check` before every push.** This is the decisive
  full-repo verification (includes clean, build, all gates).
- **Run `pnpm qg` before every commit** as a quick read-only check.
- `pnpm fix` auto-fixes format, markdownlint, lint.
- If `pnpm check` fails, diagnose by running individual gates.
- Use sub-agents for review before completing significant changes.
- Download CI logs once to a temp file; do not make repeated network
  calls for the same data.
- Turbo task-specific overrides (`@package#task`) REPLACE generic
  tasks entirely. Always verify with `turbo run <task> --dry=json` and
  check `resolvedTaskDefinition`.

## Quality Gates

Full verification: `pnpm check`
Read-only check: `pnpm qg`
Auto-fix: `pnpm fix`
