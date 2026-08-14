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

The sibling class is **validity-asserting** vocabulary — *legitimately X*,
*an honest residual*, *this legitimately stays* — which asserts a validity
the writer has not earned, dressing up not-finishing as principle (owner,
2026-06-27: "any time I see the word legitimate I know you don't actually
believe what you are saying"). As with the class above, the trigger is the
self-defensive use, not the word — a ratified taxonomic label ("legitimate
uses of a tool") is not the pathogen. The word arriving in defence of your
own unfinished state is the tell: ask the real question ("should this be
done now?") and do it, or state what is true plainly. This class is
currently advisory doctrine only — it carries no write-time hook patterns
pending graduation.

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
standing cure
standing workaround
honest bypass
live with it for now
```

The list is not exhaustive. New shapes graduate when observed.

Graduated 2026-08-12 (owner-flagged, first-hand instance the same night):
the **acceptance-shaped euphemism** sub-family — *standing cure*,
*standing workaround*, *honest bypass*, *live with it for now* — labels
that dress a known, recognised defect as handled without a routed fix or
a ratified policy. The owner's words at the flagging, verbatim: "it's a
red flag on par with 'parked' or 'honest bypass', it means something
that is a known and recognised problem has been labelled as not relevant
or something we can live with... and once those cognitive shapes are in
the team they will propagate to other decisions... entropy is always
coming, we have to be strict, everywhere, all the time." The harm is
memetic: the label travels between records and seats faster than any
single instance, so the vocabulary itself is the detection surface. A
mitigation is lawful only while it carries its owning ticket and its
retirement condition in the same breath.

Because the graduating instances lived in OPERATIONAL RECORDS (the
Director handoff and thread records), not doctrine documents, this
sub-family carries its own hook group (`concept: acceptance-euphemism`)
whose scope extends beyond the literal trip-list's doctrine surfaces to
`.agent/memory/operational/` and `.agent/reports/` — mirroring the
indefinite-deferral group's habitat reasoning: continuity and thread
records are where acceptance language hides. The napkin
(`.agent/memory/active/`) is deliberately NOT in scope: it is the
first-capture observation buffer, where pathogen instances are recorded
as observations and owner corrections are quoted verbatim — the same
recursive-exclusion logic that exempts this file as the cataloguing
home.

## Indefinite-Deferral Vocabulary (regex family, added 2026-06-10)

Owner-directed graduation: language that puts work into an
**unagreed holding state** is the same failure shape as hedging —
it defers a decision to nowhere instead of naming a gate or making
the removal decision. Work is either a live deliverable with named
dependencies and an owner-agreed gate, or it is removed by owner
decision. There is no third state, and an owner ratification of a
bundle does not ratify a holding-state clause embedded inside it.

The hook group (`concept: indefinite-deferral`) matches with
word-boundary regex — not literal substrings — so words *containing*
a family member never false-positive (agent display names such as
"Sparking …" contain one; literal matching would block every edit
of the identity tables that carry them):

```text
\bparked\b
\bparking\b
\bpark (?:it|this|that|for now)\b
\bshelv(?:e|ed|ing)\b
\bmothball\w*\b
\bback[- ]?burner\w*\b
\bon hold\b
\bput a pin in\b
\bicebox\w*\b
\binto the long grass\b
```

This group's in-scope surfaces are wider than the literal trip-list's
(the `## In-Scope Surfaces` section below applies to the literal
group): `.agent/practice-core/`, `.agent/plans/`, `.agent/reports/`,
`.agent/memory/operational/`, `docs/architecture/`,
`docs/governance/`, and any `**/*.plan.md` — continuity and thread
records are where holding-state language hides. Inline code is NOT
excluded for this group (a backticked family member in a table row
would otherwise dodge the block); fenced code blocks remain skipped.
The matcher blocks only newly-added instances, so historical dated
records remain editable; cure existing instances by descriptive
substitution on their next legitimate edit (a *sequenced deferral*
names the plan, gate, or owner decision that resolves the work — see
§What to Do Instead). Regression coverage:
`agent-tools/tests/hook-policy/scoped-blocks-indefinite-deferral.unit.test.ts`.

**Rejected patterns (design-time, 2026-06-10) — do not "complete" the
family with these.** Bare `\bpark\b` is excluded: curriculum content
legitimately names parks ("Hyde Park", "visiting the park"), and the
inflected forms cover the deferral usage. `on ice` is excluded:
skating/science lesson content uses it literally. `defer`/`deferred`
are excluded deliberately — a *sequenced deferral to a named gate* is
legitimate repo vocabulary (PDR-026 deferral-honesty); the pathogen is
deferral-to-nowhere, not deferral itself. Adding any of these would
trade a known false-positive flood for no real coverage gain.

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
that define the pathogen. The general form lives at
`structural-enforcer-recursive-exclusion.md`
(agent-tier pattern), which names two further mechanism shapes
beyond `exclude_paths` (per-line context exclusion;
self-exclusion by placement) and the structural distinction from
PDR-047 §Test 3 hedge-as-substance.

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
- This rule: no hedging vocabulary on doctrine surfaces
- PDR-038 §2026-05-04 amendment (stated principles require structural enforcement)

## Source Landing

WS3 of `doctrine-enforcement-quick-wins.plan` (2026-05-04). The
trip-list will grow as new shapes graduate from napkin
observations.
