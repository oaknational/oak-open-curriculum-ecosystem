---
name: complex-merge
classification: active
description: >-
  Structured workflow for merging significantly diverged branches. Use when
  either branch has changed 100+ files, a dry-run merge produces 10+ conflicts,
  or the other branch refactored core interfaces your branch consumes.
---

# Complex Merge

## Goal

Load `.agent/skills/change-custody/complex-merge/shared/complex-merge.md` and enforce its
7-phase process in the current session.

## When to Use

- Either branch has changed more than ~100 files
- A dry-run merge produces more than ~10 conflicts
- The other branch refactored core interfaces your branch consumes
- The other branch deleted files your branch imports
- Both branches touched the same workspace's production code

## Workflow

1. Read `.agent/skills/change-custody/complex-merge/shared/complex-merge.md`.
2. Resolve and read the referenced documents:
   - `.agent/rules/pre-merge-divergence-analysis.md`
   - `.agent/reference/pre-merge-analysis.md`
   - [`semantic-merge` skill](../semantic-merge/SKILL-CANONICAL.md) — MANDATORY for any
     diverged agent memory/state file in the set (`napkin.md`, `repo-continuity.md`, thread
     `*.next-session.md` records, registers, anything with a `merge_class:` key). Git
     line-merges corrupt their meaning even with no conflict marker, and both git and the
     merging agent can be "confident and wrong"; reconcile those by concept, not lines.
     Where the set is a STACK of pull requests over the same continuity files, no merge
     order lands the later ones unchanged: preserve each PR's accepted outcome, prove
     custody, and rebuild the story as one change on fresh `main`
     (`pre-merge-divergence-analysis` §stacked pull requests).
3. Execute the 7-phase process from the shared workflow:
   - Phase 1: Measure divergence
   - Phase 2: Identify all conflicts (text and structural)
   - Phase 3: Categorise each conflict
   - Phase 4: Gap analysis (silent breaks)
   - Phase 5: Create characterisation tests
   - Phase 6: Execute the merge
   - Phase 7: Verify and review
4. Invoke specialist reviewers before and after the merge:
   - **Before**: Have reviewers validate the merge plan (intentions, not code)
   - **After**: Full code review of the merge result
5. Run `pnpm check` as the final verification gate.

## Failure Handling

If type-check fails after merge, do not proceed to further phases. Diagnose
the break using the gap analysis findings. If the break was not predicted by
gap analysis, add it to the session napkin as a process improvement.

## Handoff-Safe Abort

When a session must close mid-merge (owner-directed close, budget boundary),
a fragile mid-merge index is the worst possible handoff. The deliberate move:
conserve the authored resolution artefacts and the full conflict analysis to
`.agent/state/collaboration/handoffs/` (with reusable resolution content under
`handoffs/assets/`), then `git merge --abort` to a clean tree. The successor
replays the conserved resolution against a recomputed merge — remembering that
conserved enumerated sets are the generating commands, not cached results
(`substrate-pointer-read-as-current-state`, analysis-artefact variants).
Worked instance 2026-07-07: a mid-merge close conserved a union README
resolution + analysis, aborted clean, and the successor reused the resolution
verbatim after recomputing the semantic sets (which had drifted by one commit).
