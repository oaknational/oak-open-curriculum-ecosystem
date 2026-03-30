# Pre-Merge Divergence Analysis

When merging branches that have diverged significantly (100+ files changed
on either side, or 10+ conflicts in a dry-run merge), follow the
[Pre-Merge Divergence Analysis](../../docs/engineering/pre-merge-analysis.md)
guide before attempting the merge.

Standard text-level conflict resolution misses:

- **Deleted-file import cascades** — a file auto-merges from your branch but
  imports a module the other branch deleted
- **Signature mismatches in auto-merged files** — the other branch changed a
  function signature in a file you didn't touch, but your callers use the old
  signature
- **Required parameter gaps** — your branch adds a required parameter to a
  shared interface, breaking the other branch's new test files that auto-merge
  cleanly
- **Numbering collisions** — both branches create an ADR or plan with the
  same number but different content and different filenames

Always run `pnpm type-check` immediately after resolving text conflicts —
this catches the silent breaks that Git cannot detect.
