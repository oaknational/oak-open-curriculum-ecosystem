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

Load `.agent/skills/complex-merge/shared/complex-merge.md` and enforce its
7-phase process in the current session.

## When to Use

- Either branch has changed more than ~100 files
- A dry-run merge produces more than ~10 conflicts
- The other branch refactored core interfaces your branch consumes
- The other branch deleted files your branch imports
- Both branches touched the same workspace's production code

## Workflow

1. Read `.agent/skills/complex-merge/shared/complex-merge.md`.
2. Resolve and read the referenced documents:
   - `.agent/rules/pre-merge-divergence-analysis.md`
   - `docs/engineering/pre-merge-analysis.md`
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
