---
id: semantic-search-showcase
node_type: delivery
name: Semantic-search showcase
overview: >-
  Build the Innovation Kit's first proposition: a discovery-to-resource semantic-search
  showcase that reveals the search capability honestly and produces the Kit's first
  gap-and-seam register.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: innovation-kit
impact_areas:
  - innovation-kit
tickets: []
depends_on:
  - plan: innovation-kit-capability-architecture-definition
    kind: beneficial
owner_gates:
  - awaiting: owner-decision
    clears_when: >-
      The owner reviews this plan shape and the Stage-0 composition declaration (proposition,
      claim boundary, activated and omitted capabilities, decision-budget seed) and says build.
    expires: 2026-09-21
last_updated: 2026-08-31
---

# Semantic-search showcase

## Authority anchors

The owner selected this direction on 2026-08-31 (session `Dahlia tracks Blossom`), verbatim:
"Semantic search, making use of what we have where appropriate and changing what we should
change. The goal is not to prove we need the Innovation Kit, that is the settled, the goal is
to build the best and most useful Innovation Kit." Same session, two shaping rulings: search
results primarily have discovery value, so the demo links out to equivalent teacher-journey or
curriculum pages on `www.thenational.academy` rather than growing into a curriculum app; and
planning must determine what resources are needed, what the Kit provides, where the gaps are,
and what seams those gaps reveal. The Kit's necessity is settled — the
[definition corpus](../../research/innovation-kit/definition/README.md)'s instruments
(composition declaration, decision budget, placement rule) apply here as build discipline, not
as a verdict gate on the Kit itself. The owner gate's expiry derives from the governing
strategic node's `gate_expiry_default` (P21D from authoring).

A third ruling (same day, on reviewing the first sketch): the plan is incomplete until key user
journeys are defined in terms of user experience and value, for three user groups — "devs
working with the Innovation Kit, stakeholders who should be wowed and educated in what is
possible and inspired by the demo, and the somewhat pretend end users of a search service who
in this case would be teachers". The journeys below carry that ruling.

Ratification state: the owner ratified an earlier shape of this plan on 2026-08-31 ("Ratify
now" at the decision round, napkin entry "~7"). The plan then changed materially under the
PR #28 review-finding cures (linkability rewritten around result-carried URLs, criterion
re-scoping, evidence taxonomy, extraction-as-outcome), so per the plan schema's scope-change
rule it returns to `sketch` until the owner re-ratifies the amended shape — the intended
moment is the joint Stage-0/definition review.

## Goal

Two outcomes, both first-class. (1) Oak's deepest capability becomes honestly legible: a
teacher-recognisable discovery loop — intent, meaningful results with provenance and relevance
legibility, hand-off to the real resource on `www.thenational.academy` — that reveals the
depth, behaviour and limits of search by meaning, including its zero-hit, degraded and
limit states. (2) The Kit grows through a real consumer: the build produces the estate's first
decision-budget record and a gap-and-seam register naming what the proposition needed, what
the Kit provided, what was missing, and which seams the gaps reveal. Both outcomes are held to
three defined user journeys — teacher, stakeholder, developer — each with its own experience
arc, value statement, measure and losing condition.

## Mechanism

The showcase is an independently scoped peer demo at the `demos/` tier, built through the
Kit's declared path: a Stage-0 composition declaration (proposition, audience, claim boundary,
activation facts, capability states) precedes the build; every creator decision lands in the
decision budget, distinguishing proposition-shaped from machinery-shaped decisions; recurring
machinery-shaped burden is the seam-correction signal and routes to the Kit-placement inquiry
rather than being absorbed locally. The demo consumes public capability surfaces only —
`@oaknational/oak-search-sdk/read`, `@oaknational/curriculum-sdk`, the generated Oak URL
helpers, and the Oak Design System — so any private import it turns out to need is itself a
gap finding. Estate defaults (demos tier, Next.js, the hub's live-stack wiring precedents)
enter the decision budget as reopenable defaults-from-precedent, not baked assumptions.
Link-out is the structural guard against curriculum-app drift, and the split is by scope
(owner ruling, 2026-08-31): **anything at unit level or below — units and lessons — links out
to its `www.thenational.academy` page** via its result-carried URL field. **Sequence and
thread results open in-demo layouts** — a programme layout for sequences and a threads
layout for threads — because meaningful link-out is what makes the search wow real, and OWA
has no thread-addressed page to link to (first-hand verification, sequencing survey
2026-08-31). Each in-demo layout itself links out at unit level and below. A result whose
expected URL field is absent takes the declared truthful-absence path — never a fabricated
link.

Dependency note (minimum shippable shape without the `beneficial` definition-plan edge): if
the definition corpus is not yet owner-accepted, Stage 0 instantiates the composition
declaration, decision budget and ledger entry from the proposed corpus as-is, marked
provisional; the joint review gate is where amendment risk lands, and no other part of this
plan consumes the definition. The edge stays `beneficial` because that shape ships.

## User groups and key journeys

Three user groups, three journeys — each defined in experience and value terms with its own
measure and losing condition (owner ruling, 2026-08-31). The journeys are plan content, not
build-time discoveries; Stage 0 carries them into the composition declaration and every slice
is testable against them.

### Teachers — the declared (honestly proxy) end users

**Journey.** A teacher arrives with a real intent in their own professional language
("fractions unlike denominators", "algebra progression") → search understands meaning, not
just keywords → results carry enough curriculum context to judge fit — what it is, where it
sits, why it matched → a lesson or unit result lands them on the real resource at
`www.thenational.academy` in one step; a sequence or thread result opens its in-demo layout
(the programme layout, the threads layout — those scopes' destination, since OWA has no
thread page), which links out at unit level and below → dead ends are honest: zero hits say
so and help reframe; a degraded backend says what it is.

**Value.** Found the right thing quickly, judged its fit without leaving the results, and
finished on the actual resource — or, for sequences and threads, on the layout that renders
what `www` cannot show — discovery, not another destination.

**Experience.** Professional vocabulary in, curriculum-shaped results out; relevance and
provenance legible at the result; one-interaction hand-off at lesson and unit scope
(layout-then-link-out for sequences and threads); truthful difficult states; every
step keyboard- and screen-reader-complete.

**Grounding and claim boundary.** Journeys are seeded from the search estate's ground-truth
corpus — realistic teacher queries with expected results, built to answer "does search help
teachers find what they need?" — so the proxy is honest and example searches can be real.
The corpus seeds all four result scopes — lessons deeply (about thirty known-answer
entries) and units, sequences and threads more thinly (two, one and eight entries at
authoring) — so seeded expected-result journeys exist for every searchable scope, with
declared depth variance. Subjects are not a search-result type (the retrieval surface
exposes lessons, units, sequences and threads; subjects act as filters), so no subject
journey is claimed.
"Somewhat pretend" is a declared claim boundary: the journey is designed from the teacher
perspective; no teacher-value claim is made without separate research.

**Measure / losing condition.** Each seeded journey completes end-to-end in the
fixture-backed e2e suite, and the live-index confirmation of the same journeys is a recorded
operator evidence run. Losing: a journey needs insider knowledge, a fabricated link, or a
curated golden path to complete.

### Stakeholders — wowed, educated, inspired

**Journey.** Encounter the demo with minimal preamble → an immediate "I didn't know Oak could
do this" moment on a real query → the surface teaches the mechanism honestly through
progressive disclosure — why these results, what the index knows, what it cannot know → they
leave with an accurate, memorable model of the capability and new questions or ideas.

**Value.** Accurate expanded understanding of what Oak's open capability makes possible, and
raised ambition for what could be built on it.

**Experience.** An excellence bar worthy of the public asset; impressive because real — no
staged behaviour; the wow degrades gracefully into education (a mechanism-legibility layer
over live data, not a technology label parade).

**Measure / losing condition.** The strategy's possibility chain, states kept separate:
reception, comprehension, generativity; activation only at a mutually agreed next action.
Losing: the audience remembers only "a nice search box", misunderstands what the system can
do, or the impressive behaviour turns out staged.

### Developers — working with the Innovation Kit

**Journey.** A developer (or agent) meets the demo as the Kit's reference consumer → discovers
from its records what the Kit supplied versus what is demo-local — the composition declaration
and decision budget read as working artefacts, not ceremony → recomposes: runs it from a fresh
checkout, changes a binding or the results surface, or starts their own composition down the
same path → routes findings back through the register.

**Value.** From seeing to building without repository archaeology — the demo is the worked
example the Kit definition promises its consumers.

**Experience.** The definition's consumer journey (discover → declare → compose → inspect)
made concrete: the shortest route for a real proposition is visible, defaults explain their
guarantee and omission, and what the Kit supplies versus what the product owns is legible.

**Measure / losing condition.** A cold-consumer probe: someone not involved in the build
reaches a useful recomposition from the documented path alone; the decision budget shows
machinery-shaped burden trending into the Kit. Losing: only the build seat can operate it, or
hidden policy is needed to succeed.

## First-pass determination: resources, Kit provision, gaps, seams

The owner's ruling places this determination at planning time. This table is the first pass —
dated 2026-08-31, grounded in the
[current-estate evidence](../../research/innovation-kit/evidence/current-estate-2026-08-30.md)
and first-hand reads of the generated URL helpers, search SDK surfaces and demo tier — and it
shapes the slices below. The build-time register (criterion 6) verifies and extends it; it
does not replace it.

| Resource the proposition needs | Kit/estate provides today | Gap | Seam the gap reveals |
| --- | --- | --- | --- |
| Hybrid retrieval: lessons, units, threads, sequences, suggest, facets | `oak-search-sdk/read` — demonstrated, typed capability surface (ADR-134) | None for retrieval itself | Capability-surface pattern is the reusable seam; the showcase tests it cold |
| Result → resource URL on `www.thenational.academy` | Search index documents carry their own URLs: `lesson_url`, `unit_url` and `sequence_url` required, `thread_url` optional (generated index contracts; the Curriculum Hub already consumes `unit_url`) | Whether every live document's URL resolves, and what `thread_url` carries when present, is unverified | The audit starts from the result-carried URL fields; generated-helper derivation is fallback for genuinely missing cases only — never link fabrication. Sequences and threads resolve to the in-demo programme/threads layouts (owner ruling 2026-08-31); missing expected URLs take the truthful-absence path |
| Search-by-meaning claim holds per result type | Lessons/units 4-way RRF; threads 2-way RRF; the current ingestion populates `sequence_semantic` and sequence retrieval always combines BM25 with a semantic retriever over it | The deployed index's actual state is unverified from source alone; the search SDK README still describes sequences as lexical-only (ADR-110's historical state) — routed as a stale-doc finding to the search stream | Stage 0 verifies the deployed retrieval state first-hand and the mechanism-legibility layer describes what is measured, not what a document says |
| Web host composition: routing, env, error envelope, live-stack wiring | Curriculum Hub precedent — app-specific (evidence row: no reusable host profile exists) | The wiring would be rebuilt app-locally a second time | Second consumer met: extract the recurring demo-host composition as Kit-owned capability (consolidate-at-second-consumer) |
| Design language | Oak Design System — demonstrated; both consumption paths proven (Tailwind-mapped, plain-CSS) | None blocking | Path choice is a decision-budget entry, not a fork |
| Composition declaration and profile | Proposed only (definition corpus) | No concrete record instrument exists | First instantiation of the record interfaces — the Kit's first real declaration artefact |
| Decision-budget record | Proposed only | No instrument | Lightweight Kit-owned record format, seeded here |
| Evidence-ledger entry | Proposed only (strategy names the minimum fields) | Ledger absent | First entry authored by this demo, to the strategy's minimum record shape. Named readers and the decisions the reading changes: the joint owner review (Stage-0/definition gate verdict) and the next demo's Stage 0 (its reuse choices). Completion is criterion 6's proof — a completed record, never a write-only stub |
| Observability for a public read-only demo | Reusable observability/logger packages; zero-hit recording in the search SDK | Whole-Kit health contracts absent — not activated by this profile | Register only if build observes recurring burden |
| Typed environment and bindings | `@oaknational/env` + `env-resolution` | Provider composition and capability discovery absent (evidence row) | Candidate seam; confirm through the decision budget rather than pre-build |
| Deployment of a public demo | App-specific Vercel path (MCP app) exists | No demo-tier host/release profile | Candidate seam, observed at the deploy slice |
| Identity, persistence, jobs, payments | — | Not gaps: this profile activates none of them | Declared omissions — the profile's honest smaller shape |

**Keep** (use what we have): search SDK read surface, generated URL helpers, design system,
demos-tier standards, existing a11y and fidelity machinery. **Change** (what we should
change): the app-local host/env/search wiring becomes Kit-owned at this second consumer; the
definition's record interfaces move from prose to first concrete instruments (declaration,
decision budget, ledger entry). The proposition licenses no other change: no relevance
retuning, no new search features, no admin surfaces.

## Acceptance criteria (each with a proof — required)

1. **Every result type resolves meaningfully.** Lesson and unit results resolve via their
   result-carried URL fields to `www.thenational.academy`; sequence and thread results
   resolve to their in-demo layouts (the programme layout, the threads layout — owner
   ruling 2026-08-31), whose unit-and-below content links out the same way; a result whose
   expected URL field is absent surfaces a declared, truthful absence. (Subjects are
   filters, not results.) Proof: **repo-safe** — a linkability audit instrument over a real
   index sample plus tests on the truthful-absence path and the two layout routes; the
   live URL-resolution check runs as a standalone operator evidence script (never in
   the e2e suite), its record committed with the audit.
2. **The discovery loop is complete and truthful.** Intent → results with source, relevance
   and provenance legibility → hand-off link; zero-hit, error and degraded states are
   first-class truthful content, not hidden failure. Proof: **repo-safe** — e2e and unit
   coverage of the loop including the difficult states.
3. **The composition declaration exists and matches the built thing.** Activated, reduced,
   omitted and unavailable capability states, claim boundary and profile are declared before
   build and reverified at completion. Proof: **repo-safe** for the declaration and its
   conformance; **owner-held** for accepting the declared claim boundary.
4. **Accessibility is intrinsic.** WCAG 2.2 AA in the composed host; every core task
   keyboard- and screen-reader-complete. Proof: **repo-safe** — the demos-tier a11y gates
   plus recorded manual verification.
5. **The decision budget is recorded.** Every creator decision captured and classified
   proposition-shaped or machinery-shaped. Proof: **repo-safe** for the record;
   **owner-held** for the review that reads it as the Kit's seam evidence.
6. **The gap-and-seam register verifies and extends the first-pass determination, and the
   evidence-ledger entry completes.** Each planning-time row confirmed, corrected or retired
   by build evidence; new gaps appended; each gap carrying a disposition routed to its
   legitimate owner (Kit-placement inquiry, owning stream, or demo-local). The ledger entry
   is a completed record to the strategy's minimum shape, read by its named readers (the
   joint owner review; the next demo's Stage 0) — a write-only stub fails this criterion.
   Proof: **repo-safe** for the register and the completed entry; **owner-held** for
   placement rulings.
7. **Public-surface-only consumption held.** No deep imports into SDK internals or admin
   surfaces from the demo. Proof: **repo-safe** — dependency-cruiser/import rules.
8. **Each key journey is completable and evidenced at its declared measure.** Teacher:
   ground-truth-seeded journeys complete end-to-end in the fixture-backed e2e suite, with
   the live-index confirmation as recorded operator evidence. Stakeholder: the
   mechanism-legibility layer exists over live data and the possibility-chain states are
   recorded separately at a real showing. Developer: a cold-consumer probe reaches a useful
   recomposition from the documented path alone. Proof: **repo-safe** for the teacher e2e
   suite, the legibility layer and the documented fresh-checkout path; **owner-held** for the
   stakeholder showing and the cold-probe verdict.

## Execution preparation (named, from the 2026-08-31 readiness review)

The plan-readiness review (assumptions-expert, 2026-08-31) returned
READY-WITH-NAMED-PREPARATION. The preparation, so the build seat's first hour is not
archaeology:

- **Base**: implementation starts from `engraph` after this plan's PR merges; the plan
  governs nothing from a feature branch.
- **Live-backend access**: the demo needs `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`,
  `OAK_API_KEY` and `SEARCH_INDEX_TARGET` (Curriculum Hub env precedent); these are present
  in the cloud session environment. Live-index proofs are **operator evidence scripts** —
  deliberately outside the smoke tier: under the repository's test taxonomy
  (testing-strategy §Smoke Tests; ADR-161) a smoke test proves shipped-artefact viability,
  must be reachable from a CI-run task, and never carries feature assertions, none of which
  a network-backed feature confirmation can satisfy. Network-backed runs never sit in the
  e2e suite. CI stays IO-free per the standing no-test-IO ruling (2026-08-25) — the e2e
  suite proves the loop over fixtures; the operator scripts' recorded outputs are the
  committed live evidence.
- **Record-instrument home**: where the composition declaration, decision budget and ledger
  entry live is precedent-setting for every later Kit consumer; it is Stage 0's first
  decision-budget entry and the owner gate reviews it.
- **Slice sizing pre-commitments**: the host-composition extraction lands as its own PR,
  never bundled with the demo slice; slice 4 is expected to split at pickup (the
  mechanism-legibility layer is its own story).

## Todos

Slices at pickup, each a single-story PR within the default round budget (PDR-132):

1. **Stage 0** — proposition record, composition declaration (carrying the three journeys),
   decision-budget seed, and the evidence-ledger entry stub. Docs only; carries the owner
   gate.
2. **Linkability audit** — the instrument, the real-sample evidence run, and the
   truthful-absence contract.
3. **Smallest vertical slice** — the teacher journey's spine: query → results → link-out at
   the demos tier, consuming the public read surface, design-system styled, accessible from
   the first render; first ground-truth-seeded e2e journeys land here. The host-composition
   **extraction is the slice outcome** (consolidate-at-second-consumer): the recurring
   demo-host composition moves to Kit ownership in its own PR before or alongside this
   slice, and this demo consumes it. The only alternative is Stage 0 falsifying the
   second-consumer premise first-hand, in which case the claim is retracted plan-wide —
   a second app-local copy never lands silently.
4. **Depth, limits and mechanism-legibility surfaces** — relevance and provenance legibility,
   suggestions and facets where they serve discovery, zero-hit/degraded/limit truthfulness,
   and the stakeholder journey's progressive-disclosure "how this works" layer over live
   data. Carries the **programme layout and threads layout** (owner ruling 2026-08-31):
   both render only verified bulk fields — thread membership grouped by year is solid;
   the `threads[].order` field's semantics are CONTESTED between two of our own source
   contracts (sequencing survey 2026-08-31) and stay unrendered until the bulk-data
   investigation lane adjudicates them (a `beneficial`, not blocking, dependency — the
   layouts ship on verified fields alone). Neither layout ever surfaces the graph corpus's
   `prerequisiteFor` edges. **Named data seam for the layouts' unit link-outs**: a thread's
   search document carries no member-unit URLs, so the layouts need an exact unit-lookup
   seam on the public read surface returning canonical `unit_url` values. Whether that seam
   exists is verified first-hand at Stage 0; if it does not, that is a registered gap
   routed to the search stream (the placement rule), and until the seam is proven, a layout
   unit entry without a resolvable URL takes the truthful-absence path — never a
   fabricated or derived-without-context link.
5. **Evidence close** — decision-budget and gap-and-seam consolidation, dispositions routed,
   composition declaration reverified, the developer cold-consumer probe run, owner review.

## Out of scope

- Curriculum-app behaviour — lesson content rendering, downloads, journeys, planning tools;
  `www.thenational.academy` owns the resource experience (owner ruling, 2026-08-31).
- Admin, ingest or index-lifecycle surfaces in the demo; the CLI owns operations.
- The dedicated design-system, graph, chat and Curriculum Studio showcases; embedded reuse
  here is integration evidence only.
- Teacher-value, product or adoption claims; this demo makes possibility and comprehension
  claims only.
- Building Kit capabilities beyond what this proposition activates — gaps are registered and
  routed, never absorbed (the definition's placement rule).
- Repairing the graph corpus's fabricated `prerequisiteFor` edges, adjudicating the
  contested `threads[].order` contract, or any prerequisite representation. The conflation
  is a serious data defect, not demo material (owner ruling, 2026-08-31); it is owned by a
  separate bulk-data-construction investigation lane — its own session and PR, grounded in
  the upstream `oaknational/oak-openapi` contract so what the bulk data does and does not
  contain is known first-hand. The demo never surfaces those edges.
- Search-relevance retuning or provider changes; findings about search quality route to the
  search-owning stream.
