# Handoff — 2026-05-04

The 2026-05-03 session arc closed with three independent replacement
plans, two damaged-plan archives, the destructive-revert safety
hardening, and the closure of collaboration experiment E1. This
directory is the pickup surface for the next session — three agent
prompts, one per plan, designed for parallel dispatch.

## Pickup order

1. **Plan 1 (BLOCKING — primary unblocker)**: dev-boot bug fix.
   Single cycle, tiny diff. Pick up FIRST. See
   [`agent-plan-1-bug-fix.md`](agent-plan-1-bug-fix.md).
2. **Plan 2 (DESIRABLE, parallel-safe)**: atomic config rename.
   See [`agent-plan-2-config-rename.md`](agent-plan-2-config-rename.md).
3. **Plan 3 (DESIRABLE, parallel-safe)**: smoke-test retirement +
   all-Vitest + no-real-IO. See
   [`agent-plan-3-smoke-retirement.md`](agent-plan-3-smoke-retirement.md).

All three plans can run fully in parallel. The earlier sequencing
constraint between plan 1 and plan 3 cycle 1c (the spawning e2e
regression-guard) was resolved upstream in commit `27983ef9`: the
e2e test was deleted as a damaged-plan artefact, so plan 3 cycle 1c
now only adds the replacement unit/integration coverage.

## Background

Read these in order before picking up any of the three plans:

1. **`.agent/memory/active/napkin.md`** from line ~315 onward — the
   2026-05-03 Salty + Tidal entries on the cascade finding,
   rollback-is-amnesia, framing-trap, and arc-level first-question
   application.
2. **`.agent/prompts/agentic-engineering/collaboration/experiments/E1/closure.md`**
   — what E1 confirmed, what it surfaced as a separate concern, and
   the next-hypothesis E6 frame.
3. **`.agent/state/collaboration/comms/events/claude-900b17-salty-handoff-three-plans-and-e1-closed.json`**
   — the operative pickup brief in machine-readable form.
4. **The plan you're picking up** — read it end-to-end, not just the
   YAML todos.

## Hard rules added in the source session

- **`.agent/rules/never-use-git-to-remove-work.md`** is now a load-
  bearing rule. We never use git to remove work. Forward-going
  filesystem changes only (Edit, Write, `rm`). Working-tree-overwrite
  commands (`git checkout HEAD --`, `git restore`, `git stash drop`,
  etc.) are blocked at PreToolUse. If the impulse to "undo what I
  just did" arises, reach for Edit/Write/`rm`, never git.
- The `principles.md` §Code Design bullet referencing the rule is
  the entry point for new agents.

## What the owner expects

- Plan 1 lands first as a small commit. Manual verification of `pnpm dev`
  booting locally is sufficient (no spawn-based automated test).
- Plans 2 and 3 progress in parallel.
- All work on `feat/eef_exploration`. Push and PR after the three plans
  close.
- No resurrection of the damaged-plan content from the archive.
- Apply principles.md §First Question (could it be simpler?) at every
  elaboration boundary, not only at task scope. That is the operative
  E6 discipline.

## After your session

Read [`.agent/skills/jc-session-handoff/SKILL.md`](../../skills/jc-session-handoff/SKILL.md)
and follow the handoff protocol. Update the thread record's identity
table with your row; update the napkin with any insights worth
durable capture; close your active claim explicitly with a summary;
post a comms event naming what you landed and what's next.
