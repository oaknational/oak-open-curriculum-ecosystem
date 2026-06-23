---
pdr_kind: governance
---

# PDR-108: Generalise Where Generalisation Does Not Cost Utility

**Status**: Accepted
**Date**: 2026-06-21
**Adopted**: 2026-06-21
**Related**:
[PDR-101](PDR-101-graduation-requires-quorum.md)
(the graduation gate this discipline raises the output quality of — a candidate
clears the quorum better when pitched at the right level of generality);
[PDR-005](PDR-005-wholesale-practice-transplantation.md)
(transplantation is the downstream cost this discipline pays forward — an
over-specific extraction becomes an ecosystem-specific orphan a transplant must
fix retroactively).

## Context

When the knowledge flow extracts a principle, pattern, rule, or example from the
instances that produced it, the author chooses a level of abstraction. Two
failure modes bracket the choice. **Over-specific**: the extracted form carries
the accidental detail of its first observation — a particular tool, repo, or
situation — so it does not fire in the next context where the same underlying
force is at work, and the lesson has to be re-learned. **Over-general**: the form
is widened until it is vacuous ("be careful", "do the right thing") and carries
no behaviour-change power at all.

The decision is routinely made by reflex rather than tested, which is why
extractions drift toward whichever the author found easier to write.

## Decision

When extracting or restating a principle, pattern, rule, or example, **prefer the
most general form that still carries the behaviour-change power.** Specificity is
a feature when it is doing work, not an accident of where the lesson was first
seen.

The test is mechanical: **state the candidate form against at least three
unrelated contexts.** If it produces correct, action-changing behaviour in all
three, generalise to that form. If it produces vacuous or incorrect behaviour in
any of them, specificity was carrying the utility — keep it, and pitch the
extraction narrower.

A single-instance extraction is **provisional by construction**; a form proven to
change behaviour correctly across multiple unrelated contexts is canonical. This
applies at authoring time, not only at review — the level of generality is part
of the artefact's design, chosen deliberately and recorded.

## Consequences

- The knowledge flow's output is sharper: lessons fire in every context their
  underlying force applies to, and stop being re-learned per surface.
- The transplantation cost falls: fewer ecosystem-specific orphans survive into
  the portable corpus for a later transplant to fix retroactively.
- Authoring is slightly heavier — the three-context test is a real step — but it
  is paid once, by the author who holds the most context, rather than repeatedly
  by every future reader who hits the gap.
- The discipline is self-applying: this PDR is itself stated to pass its own test
  across unrelated extraction kinds (principle, pattern, rule, example).
