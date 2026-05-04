# No Hedging Vocabulary on Doctrine Surfaces

Operationalises [PDR-044 §Carve-out vocabulary](../practice-core/decision-records/PDR-044-memetic-immune-system.md)
and [`principles.md` §Architectural Excellence Over Expediency](../directives/principles.md).

Language that means *"I know the rule applies, but this situation is
special"* is rejected on doctrine surfaces. Every wording — *carve
out*, *exception to*, *for these arcs*, *honest framing for X*,
*permitted variant*, *land it then iterate*, *cheap cure*,
*good enough*, *quick fix* — is the same failure shape in different
dressing. Vocabulary is not the trigger; *intent* is. If the
substance reads "the rule doesn't apply here", the candidate is
suspect regardless of vocabulary.

## The Rule

When authoring on doctrine surfaces (PDRs, plans, ADRs, governance
docs), do not introduce hedging vocabulary. The Edit/Write hook
(`.agent/hooks/policy.json` `preToolUseContent.scoped_blocks`)
catches the literal trip-list at write-time and surfaces a deny
payload with the citation *"PDR-044; principles.md §Architectural
Excellence Over Expediency"* so the doctrinal anchor travels with
the refusal.

## Trip-List (literals)

```text
carve out
carve-out
carve around
an exception to
with the exception of
make an exception
for these arcs
honest framing for
permitted variant
land it then iterate
cheap cure
good enough
quick fix
```

The list is not exhaustive. New shapes graduate when observed.

## In-Scope Surfaces

- `.agent/practice-core/`
- `.agent/plans/`
- `docs/architecture/`
- `docs/governance/`
- any `**/*.plan.md` anywhere in the tree

## Excluded Surfaces (Why)

- `principles.md` and `distilled.md` — these documents *catalogue*
  the trip-list and must reference its members.
- `PDR-043` and `PDR-044` — define the rush-impulse vocabulary and
  the memetic-immune-system pathogens; same reason.
- `archive/` — historical material, not live doctrine.
- `fixtures/`, `/tests/`, `.test.ts` — test corpora that demonstrate
  the rule by example.

The recursive-exclusion pattern is structural: any structural
enforcer that names its own pathogen must exclude the documents
that define the pathogen.

## False Positives Are A Design Property

Per PDR-044 §Innate immunity, the broad-fast layer "produces some
false positives by design; it never silently misses a known
pathogen." Technical-term references to ADR-documented architectural
exceptions (composition-root carve-outs per ADR-078, NO-TRACER
carve-outs in graph-query plans, etc.) trip the surface and are
dispositioned by the agent — usually by recognising that the term
is naming a previously-ratified structural decision and proceeding
with awareness, or by rephrasing to avoid the carry-over of
hedging shape into new doctrine.

## What to Do Instead

When the impulse to hedge surfaces:

1. **Re-apply the first-question.** Is there a simpler, principled
   shape that does not need an exception?
2. **Fix the surface, not the discipline.** If the rule doesn't fit
   here, the rule itself may need refinement — through PDR or ADR
   amendment, not local hedging.
3. **Sequence honestly.** A *sequenced deferral* names the plan and
   phase that resolves the work; a hidden hedge is the failure mode.

## Doctrinal Anchors

- PDR-044 §Carve-out vocabulary; §Innate immunity
- principles.md §Architectural Excellence Over Expediency
- distilled.md §"The rule applies, always — no hedging, no carve-outs, no exceptions"
- PDR-038 §2026-05-04 amendment (stated principles require structural enforcement)

## Source Landing

WS3 of `doctrine-enforcement-quick-wins.plan` (2026-05-04). The
trip-list will grow as new shapes graduate from napkin
observations.
