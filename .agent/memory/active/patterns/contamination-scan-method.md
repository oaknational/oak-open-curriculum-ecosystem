---
name: Contamination Scan Method
polarity: pattern
use_this_when: A plan, report, or memory estate may contain contaminated current-truth claims and needs a repeatable scan that separates live residue from historical mention
category: process
proven_in: .agent/reports/mandate-1-contamination-scan-2026-06-02.md
proven_date: 2026-06-02
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Treating contamination cleanup as a token sweep or as reviewer conclusion-counting instead of an evidence-led current-truth classification pass"
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a
> failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

# Contamination Scan Method

## Pattern

When a plan, report, or memory estate may contain contaminated current-truth
claims, run a contamination scan as a five-part method:

1. Build a token and concept inventory from the suspected contamination.
2. Run a mechanical sweep, but classify each hit as current-truth residue,
   historical mention, evidence, or unrelated text before editing.
3. Send reviewers verifiable facts to check, not conclusions to endorse.
4. Verify every surviving finding and every refutation adversarially.
5. Re-ground the final synthesis at author level, including one withheld
   known-answer probe when reviewer recall needs calibration.

The scan is not finished when searches return zero lines or reviewers return
zero findings. It is finished when the live current-truth claims have been
classified, fixed or retained with evidence, and the refutations have been
tested with the same rigour as the findings.

Dated amendment summaries, changelogs, and evidence ledgers may retain a retired
term as history. Current-tense plan bodies, frontmatter, acceptance criteria,
next steps, and active instructions may not. Record each hit's disposition as
`history-retained`, `current-residue-fixed`, `evidence-retained`, or
`unrelated` so a later reader can see why the token remains or why it changed.

## Anti-Pattern

Treat the scan as a broad text replacement, or as a reviewer vote. Both lose
the point:

- A text sweep cannot distinguish a retired term used as history from a
  current-tense claim that still asserts the retired concept.
- A flat deletion sweep erases useful history at the same time as live residue,
  leaving future readers unable to reconstruct why the correction happened.
- Reviewer agreement can amplify a seeded frame if the prompt gives reviewers
  conclusions instead of facts to verify.
- Zero-finding reviewer output has unknown recall unless at least one known
  answer is withheld as a calibration probe.
- Probes fail in a characteristic way: reviewers verify the underlying fact
  but normalise ambiguous prose toward the charitable reading (observed
  2026-06-02: a lens confirmed a file absent at HEAD yet read the plan text
  naming it as a live site as "to be created later"). File lists mixing live
  and to-be-created artefacts are a reviewer blind class; the author applies
  that standard at synthesis.

## Evidence

The 2026-06-02 mandate-1 scan used this method after earlier D0 ledger sweeps
and estate corrections had already shown the same shape. The scan found and
verified current-truth contamination, kept valid historical mentions, used
refutation-briefed reviewer fan-out, and calibrated reviewer recall with a
withheld known-answer probe.

Method ledger:
[`mandate-1-contamination-scan-2026-06-02.md`](../../../reports/mandate-1-contamination-scan-2026-06-02.md).

The 2026-06-02 ADR-173 `Inc.3` decontamination pass supplied the same
history-vs-live-residue distinction at smaller scale: dated amendment history
could retain the retired term, while current plan bodies and active claims had
to be superseded or removed.

## When To Apply

- Before declaring a plan or memory estate decontaminated.
- When a retired label, model, increment, or design frame may still appear in
  current-tense prose.
- Before a broad text sweep that crosses changelogs, frontmatter, current plans,
  acceptance criteria, next steps, or evidence ledgers.
- When reviewer fleets are checking a suspected contamination set and the prompt
  could seed the conclusion.
- When refutations are high-stakes enough that a false negative would be worse
  than carrying the item for another pass.
