---
name: Citation as Reasoning at the Moment of Verdict
polarity: anti-pattern
category: process
status: provisional
discovered: 2026-05-21
proven_in: "Single owner-flagged instance 2026-05-21 during a multi-rule convergence on a verdict: three of four 'reasons' offered for the verdict were citations to plans / memory / prior agreements rather than substantive reasoning. Each citation was truthful but truthfulness is orthogonal to reasoning; reference closes inquiry by pointing at past closure, reasoning continues inquiry by pointing at current substance. Second instance in another agent's output or own work would strengthen the pattern."
---

> **POLARITY: ANTI-PATTERN.** Citation feels like reasoning at the moment of producing a verdict; it is reference, not evidence.

# Citation as Reasoning at the Moment of Verdict

At the moment of producing a verdict on a decision — should we do
X, is Y safe, does Z violate a rule — citing a plan body, a memory
entry, a prior agreement, or a reviewer's earlier finding as a
"reason" feels like reasoning. It is reference. The citation is
truthful (the plan really does say X; the memory really does record
Y), but truthfulness is orthogonal to whether the citation is
**evidence** for the verdict on the current question.

## The Anti-Pattern

A verdict appears with reasons formatted like:

- *"Per PDR-N §X, the answer is …"*
- *"As distilled.md notes …"*
- *"This was already settled at … on … — the answer is …"*
- *"The plan body says … — therefore …"*

Each citation may be load-bearing context, but none constitutes
**reasoning on the current question**. Reference points at past
closure; reasoning points at current substance and explains why
the substance forces the verdict.

## Why It Feels Like Reasoning

- **Citations are authoritative.** A PDR-citation carries the
  weight of a ratified decision; the verdict inherits that weight.
- **Citations are concise.** They compress past reasoning into a
  short pointer; the verdict appears terse and confident.
- **Citations close inquiry.** Once cited, the path back to the
  underlying substance feels redundant — "we already decided
  this".

The compression hides the active step: **does the cited substance
apply to the current situation, or is it being analogised?** That
question is the reasoning step the citation skips.

## The Diagnostic Test

For each "reason" in a verdict, ask:

- Could this reason be auditored as **substantive reasoning** that
  explains why the current substance forces the verdict?
- Or is it a **reference** that points at past closure without
  re-explaining?

If reference, the reason must be either:

- **Recharacterised as a flag-to-verify** — "this looks similar to
  PDR-N's situation; need to confirm the structural match before
  applying its verdict";
- **Substituted with substantive reasoning** — re-derive why the
  current substance forces the verdict, using the citation only as
  optional context;
- **Removed** — if the citation cannot be turned into reasoning,
  the verdict was not actually grounded in substance.

A verdict whose reasons cannot survive this audit is **dogma-
shaped**.

## Cross-References

- `.agent/rules/no-hedging-vocabulary.md` — sibling rule targeting
  vocabulary that *softens* claims; this pattern targets vocabulary
  that *closes inquiry*.
- [`patterns/breadth-as-evasion.md`](breadth-as-evasion.md) —
  sibling failure mode: more words arranged to appear answer-shaped
  without containing the answer; citation-as-reasoning is a
  compressed form of the same shape.
- This pattern now carries the live trigger: a second observed instance, or
  owner direction, promotes this to either a formal rule or a PDR with
  `pdr_kind: pattern`. The duplicate pending-register body was drained on
  2026-05-24 after this home was verified.
