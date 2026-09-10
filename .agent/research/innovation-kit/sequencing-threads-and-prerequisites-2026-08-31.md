# Sequencing, threads and prerequisites — first-hand survey

- **Date:** 2026-08-31
- **Status:** dated, source-bounded research evidence; no design or naming decision
- **Commission:** owner word, 2026-08-31 — "the order units are taught in is a completely
  separate concept from a graph of prerequisite units… I wonder if we are conflating them
  under the label 'sequencing'" — with the companion verification of OWA's thread surfaces
- **Evidence pins:** this repository at `a77260ea` (the PR #28 merge commit; the review-cure
  re-verifications ran on this PR's own heads); OWA
  [`oaknational/Oak-Web-Application`](https://github.com/oaknational/Oak-Web-Application)
  shallow clone at `91662d8` (2026-08-31)

## Answer in one paragraph

The owner's suspicion is confirmed, and not only in vocabulary: the conflation is
implemented. The bulk downloads carry teaching order as positional arrays and genuine
prerequisite knowledge as unlinked prose, and the graph corpus then mints its
`prerequisiteFor` edges from **consecutive thread-ordering pairs** — an editorial-choice
ordering wearing a necessary-constraint label — while the real constraint data
(`priorKnowledgeRequirements`) rides along as node content with no edges at all. Teaching
order and prerequisite constraint have different data shapes, different authorities and
different lifecycles everywhere they appear; the one place they merge is exactly the place
that names the merged thing "prerequisite".

## What the bulk downloads actually carry

Per subject-phase file (`packages/sdks/oak-sdk-codegen/src/types/generated/bulk/bulk-schemas.ts`):

| Data | Shape | Concept class | Authority and lifecycle |
| --- | --- | --- | --- |
| `sequence: unit[]` | positional array — "array of units in teaching order" (schema doc, :397) | **Teaching order — editorial choice** | Curriculum design; changes when a sequence is re-authored |
| `unitLessons[].lessonOrder` | number per lesson (:164) | **Teaching order — editorial choice** | Same |
| `threads[]` per unit, with `order` | thread membership plus an `order` number whose meaning is **contested between two in-repo contracts**: `thread-extractor.ts:20,92` treats it as the unit's order *within* the thread and sorts by it, while `graph-corpus-sequences.ts:5-7` documents it as the thread's constant display index and derives progression by `(year, unitId)` instead | The contradiction is unadjudicated — representative bulk records are the discriminating evidence, not yet inspected | If the extractor's reading is right, an authoritative within-thread order **does** exist in bulk data and the corpus's `(year, unitId)` derivation ignores real source ordering; if the generator's is right, within-thread progression is a projection. Either way the resolution belongs to the graph estate's owners |
| `priorKnowledgeRequirements: string[]` | free-text prose statements per unit (:283) | **Prerequisite constraint — the genuine article**, unlinked: no typed references to the units that satisfy them | Curriculum design as domain claims; persists across re-sequencing |
| `whyThisWhyNow?: string` | prose per unit (:289) | **The bridge artefact** — editorial rationale connecting the choice to its constraints | Curriculum design |
| `nationalCurriculumContent: string[]` | prose anchors (:284) | **External statutory constraint** | DfE national curriculum; changes on statutory revision |

## The conflation, located

`graph-corpus-edges.ts:6` — "Builds the typed edge sets: `prerequisiteFor` from
consecutive [thread-ordering pairs]"; `:113` — "Resolves thread-ordering pairs into
prerequisiteFor edges". The `prior-knowledge-view.ts` header then defines "prior knowledge
of unit X" as X's transitive predecessors over those edges. Meanwhile
`graph-corpus-nodes.ts:27` carries `priorKnowledge: string[]` as node content only.

Three consequences:

1. **The edge label over-claims.** A `prerequisiteFor` edge in the corpus is a
   *precedes-in-thread(-by-derived-year-order)* fact. Thread placement is an editorial
   choice informed by prerequisites among many other things (workload, statutory coverage,
   term shape); reading it back as constraint erases that distinction — the same failure
   class the graph-experience landscape names as "force proximity treated as prerequisite
   truth", here produced by an edge name rather than a layout.
2. **The genuine constraint data is not machine-linked.** Mapping each
   `priorKnowledgeRequirements` statement to the unit(s) that satisfy it is an inference
   or authoring task nobody has done; until it is done, no honest typed prerequisite graph
   exists in the estate.
3. **Lifecycles diverge exactly as the owner said — and the edges track neither concept
   faithfully.** `threadOrderingPairs` sorts by `(year, unitId)` and ignores the positional
   `sequence` array entirely (`graph-corpus-edges.ts:65-77`): a within-year re-ordering of
   teaching order moves **no** edges, while a year-placement or membership change moves
   them — so the edges are year-granular placement facts, not teaching order. Between
   same-year units the chain order is unitId-alphabetical, documented in the generator
   itself as "a stated-arbitrary tie-break… within one year the order is not curricular" —
   yet those pairs are emitted under the `prerequisiteFor` label. No prerequisite
   statement is touched by any of these moves.

## OWA thread surfaces (first-hand, `91662d8`)

- The page class the owner linked is `/teachers/programmes/:subjectPhaseSlug/:tab`
  (`src/common-lib/urls/urls.ts:897`), analytics name "Curriculum Unit Sequence" — one
  programme's units in teaching order.
- Threads appear there **only as a query filter** (`?threads=` in the URL contract,
  `urls.ts:305`) rendered by `CurricFiltersThreads` in the curriculum visualiser —
  thread-as-highlight within one programme's year-by-year view — plus sections in the
  downloadable curriculum docx (`4_threadsExplainer.ts`, `9_threadsOverview.ts`).
- **No thread-addressed route exists in OWA's URL registry**: no page whose primary
  subject is a thread's own cross-year progression. OWA has thread-as-filter, not
  thread-as-subject.

## Implications carried forward (not decisions)

- A showcase or graph thread view must not present thread order as prerequisite truth;
  the two relations need visibly different treatment, which is also the honest route to
  the owner's "visceral difference" intent — the difference is real in the data, so a
  faithful rendering can show it rather than assert it.
- Any Kit or demo vocabulary should hold three terms apart: **teaching order** (choice;
  positional arrays), **prior-knowledge constraint** (prose claims; unlinked today), and
  **derived thread progression** (projection with a declared derivation rule). "Sequencing"
  as a cover-term invites exactly the observed conflation.
- The corpus edge name `prerequisiteFor` is a candidate renaming/re-derivation finding for
  the graph estate's owners; routed as a finding, not changed here.

## Falsifiers

- An upstream bulk or API surface that does carry typed unit-to-unit prerequisite edges
  would falsify the "no honest typed prerequisite graph exists" claim; the bounded scan
  covered the generated bulk schemas, the graph generators and the API schema base at the
  pin.
- An OWA route serving a thread as its primary subject (in the app router, a rewrite, or
  a sibling repo) would falsify the thread-as-filter-only claim; the scan covered
  `src/pages`, `src/app` and the URL registry at `91662d8` (shallow clone — no history
  claims).

## Owner disposition (dated note, 2026-08-31)

> **Superseded in part (dated note, 2026-08-31, later the same day).** The
> owner reworked item 1's framing in the pickup session: the repair is
> governed by the `honest-curriculum-structure` strategic node and its
> three delivery plans (`prerequisite-claim-removal`,
> `curriculum-structure-true-views`, `upstream-curriculum-data-exposure`),
> authored from first-hand grounding in the oak-openapi and
> database-tools sources. The `threads[].order` contest is adjudicated
> (it is the thread's display index — `MIN(programme_threads.order)` in
> the sequence view; `thread-extractor.ts`'s reading is wrong), the edge
> minting is removed rather than renamed, and the vocabulary rule is Oak
> names only. Decision record:
> `.agent/research/plan-estate-remediation-node-decision-2026-08-31.md`.

The owner read the findings and ruled:

1. **The `prerequisiteFor` conflation is a serious data defect, not a demo opportunity.**
   Its repair is a separate lane — its own session and its own PR — and that lane's first
   move is grounding in the upstream contract: attach `oaknational/oak-openapi` and
   establish first-hand exactly what the bulk data contains and does not contain, before
   touching the generators. The lane's work, from this survey's findings: adjudicate the
   contested `threads[].order` contract against bulk records and the upstream schema;
   root-cause and repair the edge minting in `graph-corpus-edges.ts` (rename to honest
   teaching-order semantics or remove — the survey's derived-thread-progression framing is
   the candidate); decide whether and how the unlinked `priorKnowledgeRequirements` prose
   is represented; and route any data-vs-published-schema mismatch upstream as a bug
   report (ADR-222 authority ordering). The lane authors its own delivery plan at pickup.
2. **The demo's answer to thread/sequence linkability is in-demo layouts.** The showcase
   includes a programme layout and a threads layout; anything at unit level or below links
   out to `www.thenational.academy`. Carried into the showcase plan (mechanism, criterion
   1, slice 4, out-of-scope) the same day. The layouts render verified bulk fields only
   and never surface the fabricated edges.
