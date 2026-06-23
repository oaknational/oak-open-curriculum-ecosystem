---
name: "Delivering a Reframing Is a Consumer-Walk, Not a Phrase-Sweep"
polarity: pattern
use_this_when: "Delivering a reframing, supersession, rename, or any conceptual change across a documentation / plan estate — especially after a foundational doc moves or a controlling decision changes."
category: process
proven_in: "2026-06-17/18 strategy-and-plan-estate reconception (Tempest spins Spire, Ocelot binds Curfew): a reframing declared 'purged' by phrase-grep three times still had residue — a differently-worded 'Step A (align on impact)', a vestigial 2A/2B/2C structure (not a phrase), a stale duplicate continuity bullet, the old 'modular building blocks' goal on the docs entry page; the owner found each. A foundational-doc move (git mv of the root vision doc) touched dozens of referrers."
proven_date: 2026-06-18
related_pdr: PDR-103
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A reframing/change declared done by phrase-grep leaves residue: differently-worded restatements, structural residue (todos, decompositions, frontmatter), and entry-point surfaces the sweeper never opened — so the next reader still meets the old model."
  stable: true
---

> **POLARITY: PATTERN.** A shape to repeat. See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# Delivering a Reframing Is a Consumer-Walk, Not a Phrase-Sweep

A reframing is a unit of delivery, not a find-replace. Phrase-greps are
content-scoped and reactive: they miss residue worded differently, structural
residue (todos, decompositions, frontmatter), and surfaces you never thought to
open. Deliver a reframing by walking every **entry point** a reader arrives
through and verifying each lands on the new model.

## Pattern

1. **Walk every entry point, not every phrase.** The session-open reading order,
   plan/docs index chains, the reachability invariant, frontmatter and structure
   (todos, decompositions, status lines), and downstream-body inputs.
   **Completeness criterion:** *no consumer, arriving through any entry point,
   encounters the old model.* Deriving that entry-point set from the goal (not from
   the surface you were pointed at) is the trigger — see
   [`scope-from-goal-before-approach`](../../../rules/scope-from-goal-before-approach.md) (PDR-103).
2. **Partition LIVE vs HISTORICAL before sweeping.** Update live navigational refs
   — and the display-text labels, not only the link targets; leave archives, raw
   data, evidence, napkins, and other-platform surfaces untouched (archive
   discipline). A foundational-doc move has a large reference blast radius;
   partition first so the sweep does not churn history.
3. **Extract-and-archive, don't banner-and-keep.** When a doc is superseded,
   extract its useful content to the live home, **archive the file** (the archive
   IS the preservation), and state the present design positively. A "superseded"
   banner left on a live doc is a hazard — a reader skims past the banner and the
   wrong content still has gravity. Rationale and lessons belong in the napkin and
   on the archived artefact's supersession mapping, never as a tombstone in the
   live doc.

## Anti-pattern

Declaring a reframing delivered after grepping its known phrases. Residue survives
worded differently, as structure (a vestigial decomposition, stale frontmatter),
and on surfaces the sweeper never opened; the next reader arrives through one of
those entry points and meets the old model — and the author cannot feel the gap,
because the phrases they checked are gone.

## Related

- [`no-tombstones-for-removed-ideas`](../../../rules/no-tombstones-for-removed-ideas.md)
  — the extract-and-archive corollary; the live doc states only the present design.
- [`passive-guidance-loses-to-artefact-gravity.md`](passive-guidance-loses-to-artefact-gravity.md)
  — a live wrong doc has gravity a banner cannot fix.
- [`scope-from-goal-before-approach`](../../../rules/scope-from-goal-before-approach.md)
  (PDR-103) — derive the full entry-point set from the goal, not the pointer; the trigger
  that finds the surfaces to walk.
- [`audit-sweep-filters-against-live-referent.md`](audit-sweep-filters-against-live-referent.md)
  — sibling at the tooling surface: a quiet grep result read as confirmed absence is the
  same fluent move this pattern names at the delivery surface.
- [`fluency-is-a-failure-vector.md`](fluency-is-a-failure-vector.md) — "I grepped the
  phrases, it's done" is the fluent move that skips the consumer-walk.
