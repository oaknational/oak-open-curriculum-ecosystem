---
name: "When \"Don't Fragment\" Meets New-in-Kind Work, the New Vessel Is the Non-Fragmenting Shape"
polarity: pattern
use_this_when: "The \"consolidate the estate / don't fragment the plan estate\" reflex points at folding new work into an existing plan, doc, or artefact — check first whether the work differs in KIND before folding."
category: process
proven_in: "2026-06-17 owner correction (Phobos turns Singularity); refines consolidate-estate-decouple-execution against no-plan-fragmentation."
proven_date: 2026-06-17
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Reading the anti-fragmentation reflex as 'fold everything into the nearest existing vessel', which couples two distinct kinds of work into one artefact — the dual failure of fragmentation."
  stable: true
---

> **POLARITY: PATTERN.** A shape to repeat: when work is new *in kind*, give it a
> new bounded vessel that depends on — rather than merges into — the existing one.
> See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# When "Don't Fragment" Meets New-in-Kind Work, the New Vessel Is the Non-Fragmenting Shape

## Principle

"Consolidate the estate / don't fragment the plan estate" is a real discipline,
but it is not "fold everything into the nearest existing vessel." Fragmentation
is splitting **one kind of work** across many vessels. Folding **two distinct
kinds of work** into one vessel is the *dual* failure — accidental coupling that
makes both kinds harder to reason about and evolve.

The discriminator is **kind**. When the work in front of you differs in kind from
what an existing plan/doc/artefact owns, the non-fragmenting shape is a **new
bounded vessel with an explicit declared boundary that depends on, but does not
merge into, the existing one** (depend, don't merge). A new vessel for new-in-kind
work is not fragmentation; it is correct decomposition.

## The discrimination

Before folding new work into an existing artefact under the anti-fragmentation
reflex, ask:

1. **Is this the same kind of work** the existing vessel already owns (same
   problem, same lifecycle, same acceptance bar)? → fold; a second vessel here
   *would* be fragmentation.
2. **Or does it differ in kind** (different problem, lifecycle, or owner) but
   share a dependency? → new bounded vessel that declares the dependency
   explicitly; folding here *would* be coupling.

The reflex that fires fluently ("don't fragment → fold it in") skips this check.
The check is cheap and decisive.

## Worked instance — 2026-06-17 (Phobos turns Singularity)

The "don't fragment the plan estate" reflex pointed at folding a new body of work
into an existing plan. The owner corrected: the work differed in kind, so the
non-fragmenting shape was a new bounded vessel that *depended on* the existing
plan rather than merging into it. One clean owner-corrected instance; the
discipline is the discriminator (kind), not a bias toward either folding or
splitting.

## Related

- `consolidate-estate-decouple-execution` (the reflex this refines: consolidating
  the estate does not licence fragmenting it — and does not licence over-folding
  either).
- [`scope-from-goal-before-approach`](../../rules/scope-from-goal-before-approach.md)
  — naming the goal's real shape surfaces whether the work is one kind or two.
- [`fluency-is-a-failure-vector`](fluency-is-a-failure-vector.md) — "don't
  fragment → fold it in" arrives fluently as estate discipline.
