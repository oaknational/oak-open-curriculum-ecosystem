---
name: "De-serialise a Dependent PR by Cherry-picking the Dependency's Exact Commit"
polarity: pattern
category: process
use_this_when: "One open PR is paused behind another because it needs a fix the other carries, and the dependency is an ORDER (wait for a merge), not content the paused branch would author differently."
proven_in: "PR #945 was paused behind the MCP-655 fix on PR #946; at owner word (\"option 2\", 2026-09-02) the exact fix commit was cherry-picked onto the paused branch, its preview rebuilt and validated in parallel with the fix PR's own proofs, and the second merge of main reconciled the identical hunks trivially — only the four files the fix line moved AFTER the pick needed a decision, all resolved to main's side because the dependent branch had no edits of its own there. Conserved in .agent/memory/active/archive/napkin-2026-09-02.md."
proven_date: 2026-09-02
related_patterns:
  - verification-method-must-answer-the-question
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Serialising two PRs on an order dependency makes every review round's tail risk multiplicative — an hour per PR, twice, compounding with the dependency — when the dependency was one commit the paused branch could carry itself."
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a
> failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

## The shape

When a paused PR depends on a fix another PR carries, ask whether the
dependency is an **order** (the paused work waits for a merge) or
**content** (the paused branch would author the change differently). An
order dependency dissolves without a merge:

1. **Cherry-pick the dependency's exact commit** onto the paused branch —
   the one fix commit, self-contained; never the whole fix branch, which
   drags its records, guards and plan node along and manufactures an
   add/add conflict at the next merge of `main`. (The three options
   weighed on 2026-09-02: wait for the fix to merge, blocking on the
   owner's proofs and a reviewer; pick the one commit; merge the whole
   branch. The pick was chosen; the plan node was left out for exactly the
   conflict reason.)
2. **Validate both branches in parallel.** The paused branch's preview
   rebuilds with the fix and its own validation runs while the fix PR
   completes its own owner-held proofs; neither seat waits on the other.
3. **Expect the reconciliation at the second merge of `main`.** Identical
   hunks reconcile trivially. Files the fix line moved AFTER the pick are
   the only decision points: where the dependent branch has no edits of
   its own, take `main`'s side — `git diff --quiet <fix-sha> <branch> --
   <file>` decides each without reading its content.
4. **Union the memory files as memory files** (the semantic-merge skill):
   both branches carry napkin, continuity and thread-record entries, and
   the second merge is where the union is proved.

## The falsifier

A dependent branch that ALSO edits the files the dependency line moves
after the pick — then the second merge is a real content merge, not a
reconciliation, and the order framing was wrong. State the falsifier at
the pick so the second merge's conflict shape is expected rather than
discovered.

## Why this is a pattern and not a merge trick

The owner's ruling (2026-09-01, verbatim: "treat the risk of long tails in
PRs as multiplicative, and we are now dealing with two PRs with a dependency
between them") prices the serialised shape: every review round on the
upstream PR delays the downstream PR's every round. The pick converts the
dependency from an order into content that the downstream branch already
holds, and the tail risk stops compounding.

## Related

- [`verification-method-must-answer-the-question`](verification-method-must-answer-the-question.md)
  — carries the stale-capture-wins marker probe, the class the memory-file
  union at the second merge exists to defeat.
- The `semantic-merge` skill — the union procedure and its second-reader
  step.
