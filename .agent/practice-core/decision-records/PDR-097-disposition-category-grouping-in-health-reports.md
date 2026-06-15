---
pdr_kind: pattern
---

# PDR-097: Disposition-Category Grouping in Substrate Health Reports

**Status**: Accepted
**Date**: 2026-06-15
**Related**:
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(knowledge-flow discipline — disposition categories name where each surface sits
in the flow, so the report routes curation work rather than only measuring it);
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(continuity surfaces — the drainable-buffer category is the flow-control surface
this pipeline drains).

## Context

A health report over a knowledge substrate — size, budget, or other fitness
signals across many files — is commonly organised by _severity_ alone: which
surfaces are over budget, and by how much. Severity answers "how urgent" but not
"what is the right response". A surface that is over budget because it is a
flow-control buffer should be _drained_; a foundational doctrine surface should
be _consolidated with care_; the most stable, highest-care tier should be
touched last and most deliberately. A severity-only ordering interleaves all of
these, so the reader must re-derive each file's disposition before acting.

## Decision

Group a substrate health report by **disposition category** — what kind of
surface each file is, and therefore the correct response when it is over budget
— as an axis _orthogonal_ to severity. Order the categories along a **mutability
gradient**: the most freely-drainable surfaces first, the most stable
change-with-most-care surfaces last. The canonical gradient is:

1. **Drainable buffers** — flow-control surfaces whose content is meant to drain
   into permanent homes; over-budget means _drain it_, never trim to fit.
2. **Operational / continuity memory** — working state and continuity records
   that rotate naturally.
3. **Project documentation** — reference material that consolidates as it grows.
4. **Foundational doctrine** — the rules and directives that govern the work;
   change deliberately.
5. **Practice Core** — the portable doctrine substrate itself; the highest-care
   tier, touched last.

Derive a surface's category from a **declared role plus structural location**: a
surface that declares itself a drainable buffer _is_ one wherever it lives (the
declaration is authoritative); the structural tiers derive from location, with a
catch-all so every surface lands in exactly one category.

The grouping is a presentation of the same measurements, not a change to them:
the severity view remains as a complementary cross-cut. And the category is a
routing _signal_, never a licence to act on a file's content — buffer identity,
drain order, and preservation duties are governed by the knowledge-flow
discipline. Grouping never moves, renames, splits, or trims a surface.

## Consequences

The report speaks the language of the response: a reader sees the drainable
buffers together and drains them first, and sees doctrine and the Core grouped
and treats them with the care those tiers demand. The orthogonal severity view
still answers "how urgent". A repository instantiates this pattern with concrete
category labels, structural path rules, and a single source-of-truth module for
the derivation; those specifics belong in that repository's architecture
records, not in this portable pattern.
