---
classification: situational
description: Loads for EVERY merge. Any merge that changes a fact a document states as a premise owes the premise sweep (guide §4i) whatever its size; merges with 100+ files changed on either side, 10+ conflicts in a dry-run merge, or a core-interface refactor follow the full pre-merge divergence analysis guide.
trigger: "ceremony:merge — every merge: the premise sweep at any size; the full workflow past thresholds"
---

# Pre-Merge Divergence Analysis

Operationalises [`principles.md` §Code Quality](../directives/principles.md#code-quality) — pre-merge type-check is a canonical gate — and the plan-node estate (its README under `.agent/plans/`) — plan-level merge strategy lives in the governing delivery plan.

When merging branches that have diverged significantly (100+ files changed
on either side, or 10+ conflicts in a dry-run merge), follow the
[Pre-Merge Divergence Analysis](../reference/pre-merge-analysis.md)
guide before attempting the merge. This rule loads for EVERY merge: the
premise sweep it carries (§Derive Merge Risk, last paragraph) has no size
threshold; the thresholds above select the full divergence workflow only.

The scope is set by the trigger above, not by branch topology: two
long-lived diverged branches (feature-vs-feature, or a stale branch against a
fast-moving `main`) that trip the thresholds. A routine feature-vs-main
ready-check that trips no threshold is a standard pre-merge sanity check
(enumerate the branch's unique commits, check what landed on `main` since the
cut, dry-run the merge) — call it that, and reserve "divergence analysis" for
the threshold-tripping scenario this rule and the `complex-merge` skill own.

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
- **Premise cascades in prose** — the other branch changes a fact (a served
  shape, a published field, a version) that documents and plans on your
  branch state as a premise; their text merges untouched and their meaning
  is now false

Always run `pnpm type-check` immediately after resolving text conflicts —
this catches the silent breaks that Git cannot detect. Type-check proves
code; the generators' own checks prove generated surfaces; nothing proves
prose. Documents and plans are kept true by semantic analysis at every
integration, and this obligation does NOT wait for the thresholds above:
a merge of any size that changes a fact some document states as a premise
owes the sweep. Derive the sweep terms from the incoming change's claims
and read the surfaces the other branch could not have edited (the
[cross-fork integration skill](../skills/change-custody/cross-fork-integration/SKILL-CANONICAL.md)
§6 for a lineage sync, which loads for every sync regardless of size; the
guide's §4i for any other merge that alters a stated premise).

## Derive Merge Risk From Content, Not From Raw Name-Status

Merge and divergence **risk** is content-derived, never read off a raw
`HEAD..origin` (or branch-vs-branch) `--name-status` count. A long
name-status list can be a zero-risk merge (identical content, pure
fast-forward, or already-applied changes) and a short one can hide a
breaking signature change. Prove the risk from the merge algorithm itself
(a dry-run merge, the conflict set) or from an **empty content diff**, not
from how many files appear in a name-status listing. The raw list is a
discovery hint; the verdict comes from the content.

For the full agent-executable workflow, use the
[complex-merge skill](../skills/change-custody/complex-merge/SKILL-CANONICAL.md).

For **agent memory and state files** (`napkin.md`, `repo-continuity.md`, thread
`*.next-session.md` records, registers — anything carrying a `merge_class:`
frontmatter key), the hazard is different in kind: git line-merges silently
corrupt the *meaning* even when no conflict marker appears, and both git AND the
merging agent can be "confident and wrong". Reconcile those by CONCEPT via the
[semantic-merge skill](../skills/change-custody/semantic-merge/SKILL-CANONICAL.md), never by
trusting the conflict count.

Stacked pull requests over the same continuity files have no safe merge order
in which the later ones land unchanged: each merge re-truths the files the next
one also edits, so the second and third carry stale line-merges of the first
whatever the order. Preserve the accepted outcomes (the settled text of each),
prove custody of every commit, then rebuild the bounded story as one change on
fresh `main`; never merge the stack in sequence and reconcile afterwards
(2026-08-12: a three-PR records closeout was rebuilt this way).
