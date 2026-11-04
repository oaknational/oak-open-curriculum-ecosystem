---
name: "Diff-Context Review Misses the Frame Above the Hunk"
polarity: anti-pattern
use_this_when: "Repeatedly editing one long entry, record, or section across a session (status lines, continuity entries, batch records) — before each commit, and when reviewing a diff whose hunks sit inside a larger semantic unit."
category: process
layer: general
proven_in: "Two instances in one session (2026-07-04 tier-E drain): a repo-continuity entry HEADER still scoping 'ranks 26-187' survived four diff-anchored review rounds while the batch lines below it advanced through five updates; then the same entry's executed-batches label went stale AGAIN one edit later and was caught only by a reviewer reading the whole entry. A harness whole-file view, not any diff, exposed the first."
proven_date: 2026-07-04
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A frame sentence (header, scope label, count, executed-range) that earlier edits made true and later edits silently invalidate — it sits above every diff hunk, so hunk-anchored self-review and reviewer passes all read past it, and successors inherit a pointer that contradicts the lines beneath it."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** The diff shows what changed; the defect
> lives in what did NOT change — the unchanged-but-invalidated frame
> above the hunk.

## The failure shape

A long-lived entry (a plan status line, a continuity entry, a batch
record) is updated repeatedly by appending or editing its tail. Each
edit's diff context covers a few lines around the change. The entry's
FRAME — the opening sentence that states its scope, count, range, or
verdict — was written when the entry was young and is invalidated by
the accumulating tail, but it appears in no diff, so:

- the author's self-review never re-reads it (they review the diff);
- reviewers anchored to `file:line` findings never reach it;
- the fitness/lint gates see well-formed prose either way.

The result is an entry whose header contradicts its own body, surviving
multiple review rounds, misdirecting the next reader who (correctly)
trusts the frame as the summary of what follows.

## The cure

Before committing the Nth edit to the same entry, **re-read the entry
from its first line**, not from the edit site. Concretely:

- Treat the semantic unit (the entry, the section, the record row) as
  the review scope, never the hunk.
- When updating a tail repeatedly, grep the entry's frame for the
  now-stale tokens the update obsoletes (the old range, the old count,
  the old batch name) — the stale token is usually literal.
- Reviewer briefs for repeated-edit files should say "read the whole
  entry the diff touches", not just "review the diff".

## Related

- `stage-what-you-commit` — the staging-time sibling (the contract is
  the whole bundle, not the remembered edits).
- `.agent/rules/no-moving-targets-in-permanent-docs.md` — frames that
  state volatile facts are moving targets by construction; where the
  frame can be made derivation-anchored instead, do that.
