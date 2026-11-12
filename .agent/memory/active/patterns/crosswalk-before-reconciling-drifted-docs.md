---
name: Crosswalk Before Reconciling Drifted Docs
polarity: pattern
use_this_when: Two documents appear to conflict (an older brief vs a ratified plan, two doctrine surfaces describing one mechanism) and the tempting move is a bulk rewrite of one to match the other
category: process
layer: general
status: emerging
discovered: 2026-06-05
proven_in: The 2026-06-05 EEF strategy-brief reconciliation (owner-corrected surgical outcome) — see §Worked Instance
proven_date: 2026-06-05
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Bulk-rewriting an apparently-conflicting document to match the newer model, destroying still-valid shared-intent content and deleting orthogonal work that only looked like conflict"
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

## Principle

When two documents appear to conflict, run a clause-by-clause **crosswalk before
rewriting**, separating three cases per clause:

- **(a) Shared intent** — the same intent expressed in different vocabulary. Adopt;
  do not rewrite for vocabulary's sake.
- **(b) Genuine divergence** — a real contradiction requiring supersession. Mark the
  specific clause superseded, citing what supersedes it.
- **(c) Orthogonal** — concerns that only look like conflict because they share
  vocabulary or surface. Leave untouched.

The default hypothesis to test — not to assume away — is that the tension is
**semantics rather than intent** (owner instinct, 2026-06-05). A blunt "rewrite to
match the new model" destroys still-valid content in case (a) and deletes real work
in case (c).

## The Reconciliation Shape

Reconcile **surgically**: a top banner stating the crosswalk verdict, plus targeted
supersession notes only on the genuinely-divergent clauses; preserve the rest; name
which case each part is. The reader of the reconciled document sees exactly what
was superseded, by what, and why the remainder stands.

## Worked Instance

2026-06-05, the EEF strategy brief vs the ratified plan: clauses R1/R4/R5/R7/R8
were *shared intent* (adopted as-is); only R2/R3's server-side scoring was *genuine*
supersession (by Decision 10); and §5's future ontology crosswalk was *orthogonal*
(a data artefact, not the forbidden situation→strand server mapping). A bulk
rewrite would have wrongly deleted §5.

## Boundary

This pattern governs reconciling two documents' *content*. It is distinct from
`derive-controlled-surface-from-authoritative-data.md`: a *crosswalk artefact* (a
persistent mapping layer) is only legitimate between two surfaces you do not
control — that boundary lives in the sibling pattern. Here "crosswalk" is the
*analysis move* (clause-by-clause comparison), not a built artefact.

## Forward References

- [`derive-controlled-surface-from-authoritative-data.md`](derive-controlled-surface-from-authoritative-data.md)
  — the sibling that bounds when a built crosswalk is ever legitimate.
- [`.agent/rules/no-tombstones-for-removed-ideas.md`](../../../rules/no-tombstones-for-removed-ideas.md)
  — governs the prose left behind by the supersession notes: state the surviving
  design positively.
