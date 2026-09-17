# Capability architecture, web-app deconstruction, survey programme: a three-body comparison

**Created**: 2026-08-14
**Status**: Complete comparison record, owner-agreed
**Provenance**: Owner-invoked comparison at the Director seat
(Smith hunts Obsidian, e98f17), 2026-08-14, from first-hand reads of all
three corpora that day. Owner agreement verbatim: "Thank you, I agree",
with the direction to record the findings everywhere they matter. The
session harvest preceding this record is the napkin entry committed at
`2ef203c1b`.

## The three bodies

- **PR #886 — provider-independent capability architecture** (authored
  2026-08-13; Proposed at the time of this record, mid merge-drive, so its
  artefacts are cited by path, not linked — they land on main at the merge):
  `.agent/research/provider-independent-capability-architecture.md`,
  `.agent/practice-core/decision-records/PDR-139-provider-independent-capability-composition.md`,
  `docs/architecture/architectural-decisions/225-provider-independent-capability-contracts.md`.
  Forward gaze: decides the shape of a runtime-service boundary
  (PostgreSQL, Neon candidate) before any implementation exists.
- **Web-app deconstruction**
  ([relocated research corpus](./innovation-kit/web-app-deconstruction/docs/README.md);
  corpus pinned to 2026-07-19 snapshots; moved into this repository
  2026-07 with content-only history): backward-and-outward gaze — recovers
  purpose from mechanism in OWA, Oak Components and the
  Database-Tools → API → OCE chain. Its crown deliverable is a basis,
  deliberately not an architecture: seven primitives, seven coordinates,
  and the seam rule in the
  [meta-analysis](./innovation-kit/web-app-deconstruction/docs/synthesis/meta-analysis.md).
- **The survey programme** (opener nodes
  [survey-machinery-deconstruction](../plans/delivery/survey-machinery-deconstruction.plan.md)
  and
  [workspace-classification-census](../plans/delivery/workspace-classification-census.plan.md),
  both ratified 2026-08-12, gated on the owner's word, gates expire
  2026-09-02): inward gaze at the present estate — classify every surface
  on the Oak-specificity axis, measure leakage depth, then build a
  reference corpus of foundational patterns and measure the estate against
  it, spined on PDR-135's cost-of-change gradient.

Composition: the deconstruction supplies the semantic test for where a
seam should be (the seam rule); PR #886 supplies the evidential test for
when a claimed seam is real (an exercised independent composition); the
survey supplies the measurement instrument for where existing seams are
violated (leakage, depth-classified). Should-be, is-proven, is-measured —
three organs of one method.

## Finding 1 — convergent evolution, and the missed stitch

The deconstruction meta-analysis's negative-space table names what static
source can never establish about providers: "tested semantic portability,
exit, restoration and retained options". Its lens 30 (supply chain and
vendor choice) states "adapters do not establish artefact identity or
semantic substitutability". The working model's candidate-property-2
invalidator names "pass-through indirection" as the failure of a
contract that adds no policy or substitution value.

A month later, PR #886's PDR-139/ADR-225 answered that precise gap — the
provider-independence floor, "an unexercised interface does not satisfy
the test", the behaviour-vs-state portability split, and the losing
condition for abstractions that merely rename one SDK — without either
corpus citing the other in either direction (verified against both texts,
2026-08-14).

Reading: convergent evolution. The same generator produced the same law
twice, which is strong evidence the generator is real and shared — and
equally strong evidence of a missed stitch between the estate's richest
prior thinking and its newest doctrine. Stitches are routed in the final
section.

## Finding 2 — capability polysemy, three live senses

"Capability" now carries at least three distinct meanings in the estate:

1. an outcome-owned product capability (deconstruction H001 —
   teacher resource use, pupil learning);
2. a runtime service capability (PDR-139/ADR-225 — transactional state,
   object storage, telemetry sink);
3. the meta-analysis's derived semantic Capability/Contract ("a principal
   can achieve an outcome under the applicable norms and typed scoping
   relationships").

The meta-analysis's own warning — "sharing a word does not make them one
primitive" (stated there about the chain kernel's four uses of
"capability") — now applies to the estate's own vocabulary. Adjudicating
the terms belongs to the fresh survey design before the pattern corpus
inherits the ambiguity.

## Finding 3 — placement-doctrine tension, carried not resolved

The estate's placement rules (`consolidate-at-second-consumer`, PDR-108,
the foundational-frame promotion test) and the deconstruction charter's
governing decision 5 ("Boundaries follow meaning. Semantic authority,
invariants, isolation, lifecycle and assurance determine placement;
product-local, shared-package and extraction doctrines do not") are in
direct tension when read at the same level.

Scope verdict (seat inference, falsifiable): the charter declares its
governing decisions as research policy for the deconstruction frame; the
estate rules bind the estate. Both stand in their frames today. The
collision is unadjudicated at the estate level and is routed to the fresh
survey design node, where the pattern corpus must choose its placement
epistemology visibly rather than averaging the two.

## Finding 4 — method maturity gradient

The three bodies date-stamp the estate's method evolving:

- **2026-07, deconstruction**: falsifiability held by prose discipline —
  evidence labels (Observed/Inferred/Unknown/Hypothesis), hypothesis
  lifecycles, hand-maintained registers.
- **2026-08-12, survey openers**: falsifiability mechanised — committed
  TypeScript enumeration-and-validation instruments, closed column
  vocabularies fixed at authoring time, recorded falsifiers with
  operational triggers.
- **2026-08-13, PR #886**: doctrine records subjected to adversarial
  panels at review, with owner rulings curing an invented premise before
  merge.

Each later work mechanises what the earlier one held by discipline. The
fresh survey design should treat this as the direction of travel:
instruments over vigilance, panels before merge glides on doctrine.

## Finding 5 — the shared generator

Named once: **exercised separability at every scale, with knowledge
preserved over mechanism.** A vendor can leave the system (the #886
floor); Oak identity can leave the foundations (the census leakage axis;
the code-MIT / content-OGL / brand-reserved licence model is the same cut
at the legal scale); a mechanism can die while its learning survives (the
deconstruction preservation rule "extract and revalidate the decision …
do not grant automatic survival to the mechanism which currently contains
it"; the survey ledger's `dies-because` column; the estate's
retention-is-knowledge principle). In all three bodies, independence
claims must be exercised, not declared: falsifiers, invalidators and
losing conditions are mandatory furniture.

## Finding 6 — staleness gradient in the deconstruction

The deconstruction's OWA/Oak-Components corpus ages slowly (those
references move slowly and are pinned). Its OCE-facing claims are pinned
to `bd878a3` (2026-07-19) and predate PDR-135, PDR-139, ADR-225 and the
showcase — the OCE rows are its fastest-aging surface. Consumers of the
corpus should weight its OCE claims by that date.

## Stitches and routing

- **PR #886 research doc**: one Related line citing the deconstruction
  meta-analysis rows (negative space + lens 30) — folded into the task-9
  cure application; recorded in the coordination thread's resume-order
  addendum and as a PR #886 comment so the PR record is self-contained.
- **Deconstruction hypothesis register**: ADR-225/PDR-139 are a genuine
  evidence event for the H004-adjacent provider-boundary claims — log it
  per the register's own review rule after #886 merges, not before
  (Proposed doctrine is not yet evidence).
- **Fresh survey design inputs** (banked at the
  survey-machinery-deconstruction plan, pointer-carry): the meta-analysis
  basis (primitives, coordinates, seam rule) and PDR-135/PDR-139 are
  candidate pattern-corpus seeds; the three test batteries (meta-analysis
  survival test, PDR-139 established-pattern test, the foundational
  frame's promotion test) should be reconciled into the corpus rather
  than accreting a fourth; the capability vocabulary fix (Finding 2) and
  the placement-doctrine adjudication (Finding 3) are design-time work;
  the deconstruction's premise-record template is a candidate instrument
  for the survey's judged readings.
- **Director rulings ledger**: one row records the Finding-3 scope
  verdict so no future seat reads the deconstruction charter as
  estate-wide licence against the estate's placement rules.

## Limits and falsifiers of this comparison

- "Missed stitch" is inferred from mutual non-citation; if PR #886's
  author in fact consulted the deconstruction (unverified), the finding
  narrows to "uncited stitch" — the routing above is unchanged.
- The Finding-3 scope verdict rests on the charter's self-description as
  research policy; if the owner ratifies the charter's governing
  decisions estate-wide, the verdict inverts and the estate placement
  rules become the party under review.
- The maturity-gradient reading (Finding 4) is three points on one line;
  a fourth body of work that regresses to prose-discipline without loss
  would weaken it.
