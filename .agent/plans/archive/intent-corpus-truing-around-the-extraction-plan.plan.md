---
id: intent-corpus-truing-around-the-extraction-plan
node_type: delivery
name: "True the planning and intent corpus around the extraction plan"
overview: >-
  Make every surface that states the repository's strategy, shape or
  ordering agree with the merged extraction plan or say, dated, which part
  of it the plan supersedes — so that anyone choosing work here reads one
  consistent intent, and the owner's single word over an enumerated list of
  acts closes the loop.
status: archived
ratified_by: "Jim Cresswell"
ratified_date: 2026-09-03
ratified_where: >-
  In-session owner decision card at the MCP-673 implementing seat (Chinook seeks Cloud,
  661556), 2026-09-03 ~11:4xZ, answer verbatim "Ratify all thirteen" over PR #959's
  numbered list (item 12, the node itself); recorded in the pull request body and in the estate-coordination
  thread record's entry of the same day.
serves: toolkit-re-architecture
impact_areas:
  - practice-and-estate
tickets:
  - MCP-673
depends_on: []
owner_gates: []
last_updated: 2026-09-03
---

# True the planning and intent corpus around the extraction plan

## Disposition (archived 2026-09-03)

Completed at the owner's word "Ratify all thirteen" over PR #959's numbered list
(2026-09-03): AC1, AC2, AC3 and AC5 proven on that pull request (the greps and the
validators quoted in its body and comments), AC4 by the word itself. T5's factual
true-ups landed on the plan's second pull request (#961). Archived on the same pull
request at the owner's word that no further pull request opens for the closer. Three
deviations from the text below, each ruled during execution: the vision's frontmatter
carries `last_reviewed`, the owner's stamp, not `last_updated`, so it was left
untouched; the strategy index's reading-path line names no plan node by id — the
citation-directionality rule (PDR-105) and the owner's ruling that plans are ephemeral
bind the owner-signed tier, so AC3's "by id" was met by describing the lane — and the
decision itself gained a durable home the plan had not foreseen, ADR-227, which every
permanent page cites instead of the extraction plan.

## Goal

The third and last step of the owner's objective of 2026-09-02 ("merge 915,
then provide a plan, then make sure that the repo strategy is consistent and
cohesive around that plan"). When this lands, every surface in the planning
and intent corpus that states the repository's strategy, structure or
ordering — the vision and strategy pages, the strategic nodes, the delivery
nodes that touch repository shape, the Oak Toolkit Atlas, and the lane's
records — either agrees with the merged extraction plan
(`oak-open-curriculum-mcp-extraction`, the lane's design step) or carries a
dated note saying which part of it the plan supersedes. Owner-signed pages
are never rewritten: change arrives dated beside the signed text. The
ratified strategic node takes the schema's in-place form: the passage is
restated and the dated note beside it names what it replaced. The owner's
one word over the first pull request's numbered list is the act that binds
every item it covers. A reader who starts at the strategy index finds the
strategic node named there and, in its delivery order, the extraction plan
as the lane's first step.

This plan discharges the extraction plan's own amendment item A2 (the
strategic node's ordering amendment, the Atlas's lexeme-gate amendment, and
`public-packages-release`'s alignment and delivery sections), so that the
design step D0a mints no amendments node of its own; the extraction plan's
ledger records the discharge. The extraction plan is on main and is cited
here by id; a dependency edge would encode provenance and never clear.

It serves `toolkit-re-architecture` because that node enumerates its lane's
delivery plans by a search for `serves:`, and a plan that carries the lane's
ordering amendment, its Atlas amendment and the discharge of the lane's A2
must appear in that enumeration; every surface amended here belongs to the
re-architecture's lane. (The alternative parent, the planning estate, owns
graph, ledger and consolidation machinery, and its enumeration would omit
this plan from the lane it serves.)

## User groups and value

- **The owner.** One consistent statement of intent across the corpus, so
  the order of the lane's work and the intent behind it are read from the
  estate rather than held in his memory; his word is asked for once, over
  one numbered list, for every owner-signed or ratified surface the truing
  touches — and nowhere else.
- **People and agents choosing work in this repository.** No two surfaces
  give contradictory orders (the strategic node's banked "seam migration
  first" against the plan's "extraction first"; the Atlas's re-home of every
  census row against the plan's per-box decision; the vision and a strategy
  page that say the app is delivered from this repository; two parents that
  call the extraction a rehearsal). The strategy index names the strategic
  node whose delivery order says what comes first in this lane. Ranking
  this lane against the estate's other lanes stays the owner's: his ranking
  word of 2026-09-03 (the card: "Also state it as the current priority") is
  carried on the strategy index as his dated line, and this plan propagates
  it, never makes it.
- **The next implementer of the extraction lane** (D0b and D0a). The
  instruments and design record they produce sit under a strategic node
  whose delivery order names their lane first, and the publish-mechanism
  node they depend on is named by its own parent.
- **The product squad, later.** The vision and the strategy pages say where
  the MCP app is delivered from once the extraction executes, so the
  handover is not a surprise to anyone reading Oak's strategy for this work.
- **The planning estate itself.** Its loss guarantee holds: the four
  conserved planning corpora are untouched, and the scan that finds the
  surfaces is recorded in this node so the truing is recomputable without a
  ledger.

## Mechanism

### What the corpus is, for this plan

Three tiers, each with its own carrier and its own authority:

| Tier | Surfaces | Authority | How it is amended |
| --- | --- | --- | --- |
| Vision and strategy pages | `VISION.md`, `docs/strategy/*.md` | Owner-signed (the streams' choices and boundaries 2026-06-20; the Kit 2026-08-30); the strategy index calls itself a living strategy and iterates by dated change | A dated additive note beside the signed text, one numbered item each; `last_updated` bumped where the page carries the field (the vision carries `last_reviewed`, the owner's stamp, which stays) |
| Ratified nodes | `toolkit-re-architecture`, the ratified runbooks | Bind | The schema's in-place form: the passage restated, a dated note naming what it replaced, a ledger row, one numbered item; `last_updated` bumped |
| Sketch nodes | `public-packages-release`, `oak-open-curriculum-mcp-extraction`, `toolkit-publish-mechanism`, `workspace-taxonomy-landscape-survey` | Bind nothing | Edited in place with `last_updated` bumped; archival at the owner's word with a one-line disposition note |
| Design reports and lane records | The Oak Toolkit Atlas; the readiness record; the estate-coordination thread record | Reports are the design authority the nodes cite; records are contemporaneous capture | A dated amendments block in the report (one numbered item); a true-up entry in the record |

Out of the corpus for this plan, by the estate's own rules: the four
conserved planning corpora (`.agent/plans-backlog-2026-07/`,
`.agent/plans-old-archive/`, `.agent/plans-refounding/`,
`.agent/plans-v0-sketch-2026-07-21/` — `planning-and-intent-estate` keeps
them untouched as the loss guarantee; their dispositions live in the
migration ledger, not here); the architectural decision records the
extraction lane amends at its own later steps (ADR-041 and ADR-108 at the
retirement and first-pack slices); and the onboarding and operations pages,
which describe the tree as it stands and change when the tree changes — with
one exception: a statement in them that is false today is corrected to
today's truth, never to a future state.

### The instrument — a pinned scan, recorded here, no ledger

The denominator is produced, not remembered, and it is not accounted for: the
amendments and their commits are the record (the estate's rule that the
permanent document plus the commit is the consolidation record; disposition
ledgers and count proofs are the forms it forbids). The scan is pinned so a
re-run is the same scan, and it is the sweep AC1 is scoped to, never a
closure claim over the whole repository:

```bash
git grep -l -i -E \
  'workspace-reorganisation-programme|seam migration|toolkit-re-architecture|oak-open-curriculum-mcp|public-packages-release|extraction test|extraction rehears|extracted squad|one release version|demonstration ladder|rung 2|rung-2|thinnest possible|lexeme|@oaknational (scope|npm)|npm publishing|npmPublish' \
  -- 'VISION.md' 'README.md' 'CONTRIBUTING.md' '.agent/directives' 'docs/strategy' \
     'docs/architecture/architectural-decisions' '.agent/plans/strategic' \
     '.agent/plans/delivery' '.agent/plans/runbooks' '.agent/plans/README.md' \
     '.agent/plans/plan-node-schema.md' '.agent/reports/repo-architecture' \
     '.agent/reports/workspace-classification-census' \
     '.agent/practice-core/decision-records' \
  ':!**/archive/**'
```

The scan cannot see a page that describes the app's home or the publishing
state without any of those words, so the reading adds a judged list: the
vision, the strategy index and its four stream pages, the alignment page,
the directions register, the engineering pages on release and publishing
and on tooling, the operations index, and the curriculum SDK's README. Each
surface either agrees, is amended, or is silent by design; what this node
records is the reasoning behind the amendments (§Inventory at authoring),
never a row per file.

### The amendment class, and the fallback

Reversing the ratified node's banked delivery order and re-homing the
release-mechanism responsibility are in-place dated amendments, not a scope
change: the node's outcome (two families, one seam, three gates) and its bet
are unchanged; §Delivery is the projection of order onto delivery plans, and
§Success's "not claimed" clause names where a decision is carried, not what
the decision is. The schema's status axis keeps the node `ratified`, the
restated passage carries the new position and the dated note beside it names
the banked order it replaced; the owner's word over the list is what makes
it binding. The ordering item was the one decision on the list — it rests
on the extraction plan's ordering thesis, which that plan presented for the
owner's word with two named falsifiers — and the owner ruled it on the card
of 2026-09-03, before the first pull request was authored: "Extraction
first. That change of priority is the point of this planning work." The
list therefore presents the item as ruled and the restatement carries that
word; the other items confirm rulings already given (rulings 2, 3, 5 and 10
of the extraction plan's decision log) or true stale facts. The schema's
revert path stays available: if the owner declines any item by number, its
amendment reverts to the standing text before the pull request merges — for
the ordering item that would return the banked order and set the extraction
plan's thesis back to "presented" — and nothing else in this plan depends on
it. (Trued 2026-09-03 at the implementing session's checkpoint; the text
above had called the item "presented".)

### The amendments this plan lands

Each dated and citing the extraction plan by id; each is one numbered item
on the first pull request unless marked as a factual true-up.

- **`VISION.md`** (owner-signed): a dated note beside its statement that
  this repository delivers the AI-assistant side — the app is delivered from
  `oaknational/oak-open-curriculum-mcp` once the extraction plan executes,
  and this repository delivers the platform beneath it (the toolkit and Oak's
  organisation-wide packs) and the app itself until cut-over. The stream
  page below derives from the vision and carries the same sentence, so both
  take the note; amending the child alone would leave the signed tier
  contradicting itself.
- **`docs/strategy/stream-mcp-app.md`** (owner-signed): the same dated note
  after its opening paragraph; the stream's bets and keystones are
  unchanged.
- **`docs/strategy/alignment-and-streams.md`** (owner-signed): one dated
  clause under "The engineering tools are the foundation" — the foundation
  is published as packages the app's own repository installs, which is how
  the app exercises it after the extraction.
- **`docs/strategy/README.md`** (owner-signed index prose): one dated line in
  "How to read this" naming the extraction of the MCP app product into its
  own repository as the current structural commitment and naming the
  strategic node `toolkit-re-architecture` by id, as the index's own
  convention names nodes, whose delivery order says what comes first in
  that lane; this is the reading path AC3 measures. The same line carries
  the owner's ranking word of 2026-09-03 — the extraction is the
  repository's current first priority for structural work — as his dated
  quoted line (the card: "Also state it as the current priority"); the
  ranking is his, propagated here, never made here (trued 2026-09-03; the
  text above had said the line says nothing about ranking).
- **`toolkit-re-architecture`** (ratified; the in-place form): §Delivery
  restated — the extraction lane first (its design step
  `oak-open-curriculum-mcp-extraction`, then the publish mechanism, then the
  lane's steps), the seam migration of the members outside the product's
  closure after it — with the dated note naming the banked order it
  replaced and the thesis's two falsifiers (the decision item); §Success
  looks like restated so that the rung-2 proof is the extraction itself, not
  a rehearsal, and the release mechanism is carried by
  `toolkit-publish-mechanism` (confirmations); one ledger row; `last_updated`.
  The §User groups and value section landed with MCP-661 is on the same
  list.
- **`public-packages-release`** (sketch, edited in place): §Alignment says
  the successor node landed on main on 2026-09-02 and this node's
  clock-group wager binds to its seam by name; the sequencing consequence
  says publishing proceeds behind the per-package finish checks the
  extraction plan defines (the "deliberate per-package equivalent" the
  passage already allows) ahead of the estate-wide seam; §Success names the
  extraction, not a rehearsal, as the rung-2 consumer; §Delivery names
  `toolkit-publish-mechanism` as the first-publish step and states the
  clock-separation decision as this node's, with the two observations the
  extraction plan will contribute; `last_updated`.
- **`workspace-taxonomy-landscape-survey`** (sketch): its `serves` edge points
  at `workspace-reorganisation-programme`, superseded on 2026-08-19 by a node
  that retired the target-inventory search the sketch was built to run.
  One numbered item: `status: archived`, the one-line disposition note
  ("abandoned 2026-09: its instrument, a search for a target workspace
  inventory, was retired by the successor node's seam decision of
  2026-08-19"), and the move to `.agent/plans/archive/`; a decline by number
  re-points it to `toolkit-re-architecture` instead.
- **The Oak Toolkit Atlas**: a new dated block headed "Amendments" at the
  head of §8 (Change proposals), leaving the ruled prose of every change
  intact — the form is stated here because the file has no precedent for
  one, and the owner's word covers it as one numbered item. Three entries:
  Change 3's lexeme gate is scoped per class (toolkit and MCP-family
  sources carry neither Oak nor curriculum vocabulary; curriculum-toolkit
  sources carry curriculum terms but no Oak-instance terms; Oak-org packs
  and products carry both), with a dated exemption list the gate reads;
  Change 3's "census retires into a migration map" paragraph is superseded
  in part by the plan's per-box decision (not every row re-homes, and the
  re-home of the remainder follows the extraction); Change 4's residue — the
  release mechanism riding the seam's migration card — is carried by
  `toolkit-publish-mechanism`, and Change 2's one clock per package is
  reached through one version per repository for now (ruling 3). The
  rendered seam diagram is unchanged.
- **Factual true-ups, no owner word needed** (the second pull request): the
  extraction plan's ledger row recording that A2 is discharged here, with
  `last_updated`; one line on `toolkit-publish-mechanism`'s live-publish
  slice — it amends the ratified release-process runbook's rollback clause,
  which today rests on publishing being disabled, to cover published
  packages — with `last_updated`; the readiness record's verdict sentence
  says both pull-request rounds (the record named only the first, a finding
  of PR #954's third round); the plans index's `archive/` line says
  "completed or abandoned" (the schema keeps superseded nodes in place); the
  publishing statements that are false today say today's truth — the
  contributor guide's release paragraph (version bumps and GitHub releases,
  no registry publishing), the engineering page on release and publishing
  (its published-packages table and first-release steps), the tooling page's
  publishing paragraph, and the curriculum SDK README's install block (the
  registry returns not-found for the package) — each stated as the present
  state, never a future one; and the estate-coordination thread record's
  dated true-up entry — the objective's three steps complete, the lane
  closed, what the owner holds. One pointer line in `.agent/plans/README.md`
  at the strategy index's reading-path line, so both front doors converge.

### Two pull requests, one story each

The first carries the eight surfaces on the numbered list — the vision,
three strategy pages, the ratified strategic node, the sketch sibling, the
archival and the Atlas — and merges only after the owner's word over the
list, with any declined item's amendment reverted first. The second carries
the nine factual true-ups above, which merge at green-and-clean without his
word. Eight and nine files sit inside the small-PR rule's "10 acceptable"
band; the split keeps housekeeping from waiting on a ratification decision.

### Where the first-principles check fires

Shape: dated notes and one restated passage rather than restructuring, so
both pull requests sit within the round budget; the alternative — one pull
request per surface — would multiply the owner's acts without adding review
value. Landing path: the scan and the judged reading, then the first pull
request's amendments and the owner's word, then the second's true-ups; the
plan-corpus, docs and link validators run at every commit. Vendor literals:
none.

## Acceptance criteria (each with a proof — required)

- **AC1 — every found passage carries its amendment.** Each passage the
  pinned scan over the named paths and the judged list found at authoring
  stating a superseded or false-today position — "the seam migration first"
  as the banked order; the release mechanism "carried by the seam delivery
  plan" or riding "the seam's migration card"; the successor "has not yet
  reached either repository's main line"; rung 2 as "extraction-rehearsed"
  or an "extraction rehearsal"; "curriculum terms" in the lexeme list
  without the per-class scope; "the 17 oak-leaf rows re-home under `oak/`"
  without the per-box note; "This repository delivers the AI-assistant"
  side or channel without the delivery note; the four publishing statements
  — carries its dated amendment or true-up, and the scan re-run at the end
  of each pull request finds no listed passage unamended. Proof:
  `repo-safe` — one `git grep` per passage returning only its amended form,
  run and quoted in the pull request. This is a claim about the sweep
  named, not about the repository as a whole.
- **AC2 — the estate validates.** The plan-corpus, docs and markdown-link
  validators are green with every amendment in place. Proof: `repo-safe` —
  `validate-plan-corpus`, `docs-validators:check`, `validate-markdown-links`.
- **AC3 — the reading path exists.** `docs/strategy/README.md` names
  `toolkit-re-architecture` by id in its reading-path line, that node's
  §Delivery names `oak-open-curriculum-mcp-extraction` as the first step of
  its order, and `.agent/plans/README.md` carries the pointer line. Proof:
  `repo-safe` — a `git grep` for the id in the index line, for the plan's id
  in the node's §Delivery, and for the pointer line in the plans index.
- **AC4 — the owner's word has landed.** The first pull request carries his
  one word over the numbered list, each ledger row cites the item number,
  any declines are stated by number and reverted, and the archival and any
  ratification he included are executed. Proof: `owner-held` — the pull
  request's answer, pointed at from MCP-673.
- **AC5 — the loss guarantee holds.** Neither pull request touches a
  conserved corpus. Proof: `repo-safe` —
  `git diff --name-only origin/main...HEAD -- .agent/plans-backlog-2026-07 .agent/plans-old-archive .agent/plans-refounding .agent/plans-v0-sketch-2026-07-21`
  returns nothing, quoted in each pull request.

## Todos

Execution order; each slice is a single commit within the PDR-132 default of
two review rounds. T1–T4 and T6 are the first pull request (eight files);
T5 is the second (nine files). Estimates are authoring minutes for a
session that has read this node; the commit and push gates add about ten
minutes of wall-clock per pull request outside them.

1. **T1** (10 min) Run the pinned scan and read the judged list; confirm or
   extend the amendment set in §The amendments. Proof: the scan's output
   quoted in the first pull request.
2. **T2** (20 min) The node amendments: `toolkit-re-architecture` (§Delivery
   and §Success restated with their dated notes, the ledger row,
   `last_updated`), `public-packages-release` (in place), and the archival of
   `workspace-taxonomy-landscape-survey`. Proof: AC1's greps for the node
   passages; AC2.
3. **T3** (15 min) The Atlas's dated amendments block. Proof: the file's
   diagrams unchanged (the seam diagram's text line identical); AC1's greps
   for the Atlas passages.
4. **T4** (15 min) The vision note and the three strategy-page notes with
   their `last_updated` bumps, and the first pull request's numbered list in
   its body. Proof: AC3; AC2.
5. **T5** (20 min) The factual true-ups as the second pull request. Proof:
   each reads true against its source (the record's own tables; the schema;
   the release configuration; the registry); AC2; AC5.
6. **T6** (5 min) At the owner's word on the first pull request: the ledger
   rows citing item numbers, any declines reverted, the archival executed,
   and the ratification fields on the two sketch nodes if he included them.
   Proof: AC4.

The authoring estimate is 85 minutes, at the top of the owner's 30-to-90
band, with the two gates outside it. If the owner holds the 90-minute line,
the three publishing-truth pages in T5 (the engineering page on release and
publishing, the tooling page, the SDK README) are the drop candidate: they
become a third small pull request in a later session, and T5 shrinks to six
files and ten minutes.

## Out of scope

- Executing the extraction plan — D0b, D0a and every later step are the
  implementer's lane; this plan makes the corpus agree with the plan, not
  the tree.
- ADR-041 and ADR-108 — amended at the extraction lane's own slices (A1 at
  retirement, A3 at the first Oak-org pack), where the tree changes.
- The onboarding and operations pages beyond a false-today statement — they
  describe the tree as it stands and change at the extraction's residue
  slice.
- The release-process runbook — its rollback clause is true today and is
  amended by the publish node's live-publish slice when it stops being true.
- The census matrix's generated prose ("never publish it from here" on the
  MCP app's row) — a generated artefact the extraction plan's design step
  overrides per box and regenerates.
- The directions register (`engineering-directions`) — a chartered outcome
  is not duplicated there by its own rule; its expired gate is a separate
  owner item the drift alert already carries.
- Making any ranking of this lane against the estate's other lanes — the
  ranking is the owner's; his word of 2026-09-03 is propagated to the
  strategy index as his dated line, and this plan delivers order and intent
  within the lane plus that propagation, never a ranking of its own.
- The conserved planning corpora — untouched by the estate's loss guarantee.
- A truing record or disposition ledger — the amendments and their commits
  are the record.
- Any new strategy — this plan propagates a decision already made; it makes
  none.

## Review dispositions

One dated row per routed finding (PDR-140 ledger surface); the picking-up
implementer enumerates and dispositions every row before implementation.

| Date | Source | Finding | Routing |
| --- | --- | --- | --- |
| 2026-09-03 | Corpus survey at authoring | The ratified release-process runbook's rollback clause rests on publishing being disabled | `toolkit-publish-mechanism`'s live-publish slice amends it (this plan adds the line at T5) |
| 2026-09-03 | Corpus survey at authoring | The census matrix's MCP-app row says "never publish it from here" | The extraction plan's D0a per-box override; the matrix regenerates |
| 2026-09-03 | Readiness reviews at authoring (assumptions, docs), then a Cricket suite and an adversarial assumptions review on Fable with two-lens refutation and cross-examination | Cured across the drafts: the instrument without a ledger; the amendment class, its in-place form and fallback; the reading path by id on stable surfaces; one owner word over a numbered list with declines by number; the archival's note and path; the Atlas form as the verdict; the two-pull-request split with file counts; per-todo estimates against the owner's band; the vision added to the amendment set; the parent node settled by the lane's own enumeration rule; AC1 scoped to the sweep; the publishing-truth pages added to the true-ups; "priority" narrowed to order and intent | None routed onward; the run is recorded in the Cricket tally of 2026-09-03 |
| 2026-09-03 | Second reader on PR A (Vesta rides Solstice, 9e26e6; ARC channel 10:07Z) | (1) The node still called the ordering item "presented" and excluded ranking after the owner's two card rulings of the same morning; (2) the alignment page's clause was spliced into the signed sentence in a false-today present tense; (3) VISION carries `last_reviewed`, not `last_updated`; (4) the archival's disposition is written as already ruled | (1) and (2) cured on PR #959 in the same session (this section, §User groups, §The amendments, §Out of scope; the alignment page's note re-formed as a dated future-tensed note beside the bullet); (3) accepted — VISION's frontmatter is untouched and the PR body says so; (4) no cure — true at merge, the revert path stands |
| 2026-09-03 | Owner-refused push of PR A, then an owner-invoked full Cricket suite (eight seats; the adversarial fable seat's finding) and the owner's card | The permanent pages' dated notes cited a delivery-plan id and a ticket, against `no-moving-targets-in-permanent-docs` §Citation directionality, and the decision had no durable home | Owner card: "Fold ADR-227 into PR A and re-point" — ADR-227 (authored by Vesta rides Solstice) cherry-picked onto #959; the vision, the three strategy pages, the Atlas block and the strategic node's note cite the ADR; the strategy index keeps the strategic node by id per its own convention |
| 2026-09-03 | The owner's word on PR #959 | The numbered list of thirteen items (ADR-227; the ten amendments; this node; the two MCP-661 nodes) | "Ratify all thirteen" — every stamp landed in the same session; no declines |

## Inventory at authoring (2026-09-03, main at `b9601ab40`)

The survey's contradictions, each verified against the file:

- `toolkit-re-architecture` §Delivery: "the seam migration first (it carries
  the release-mechanism owner decision and executes the census migration
  map)" — the plan runs the extraction first and presents the reversal with
  two named falsifiers.
- `toolkit-re-architecture` §Success and the Atlas's Change 4: the release
  mechanism "carried by the seam delivery plan" and riding "the seam's
  migration card" — carried by `toolkit-publish-mechanism` now.
- `toolkit-re-architecture` §Success and `public-packages-release` §Success:
  rung 2 as "extraction-rehearsed" and an "extraction rehearsal" — the plan
  makes it the real handover.
- The Atlas's Change 3: the lexeme list "brand names, curriculum terms" and
  "the 17 oak-leaf rows re-home under `oak/`" — the per-class gate and the
  per-box decision.
- `VISION.md` and `docs/strategy/stream-mcp-app.md`: "This repository
  delivers the AI-assistant side" and "This repository delivers the
  AI-assistant channel" — true until cut-over, and the parent and child
  must take the same note.

The stalenesses and false-today statements: `public-packages-release`
§Alignment ("has not yet reached either repository's main line"; "still
carries `workspace-reorganisation-programme` as the standing programme
node") and its sequencing clause (publishing waits on the seam's manifest
gate); `workspace-taxonomy-landscape-survey` serving the superseded
programme; the plans index's `archive/` line; the publishing claims in the
contributor guide, the engineering pages on release and publishing and on
tooling, and the SDK README (the registry returns not-found for the
package; the release configuration disables publishing); the readiness
record's verdict sentence; the repository name doubling as the
error-reporting project name in ADR-159 and ADR-163 (the extraction plan's
gate 2 carries that owner item).

The pinned scan's other hits, judged: `workspace-reorganisation-programme`
(superseded, consistent with its successor, stays in place per the schema);
the census `rows.json` and `decomposition-analysis.json` (generated
artefacts, regenerated at D0a); `tango-identity-pack` (agrees: it defers its
tier's re-home to the seam migration, which now follows the extraction);
PDR-035 (agrees: why all agent tooling stays); ADR-159 and ADR-163 (the name
collision above). Outside the scan but on the judged list: the
`openapi-zod-client-adapter` README names the seam migration as the carrier
of its legacy cell's move — agrees, with the finish-list exemption the
extraction plan names for Castr-deferred packages.

The judged reading list otherwise: the strategy index says nothing about
repository shape and gains the reading-path line; the engineering-tools
stream's layering statement agrees and is silent on publishing (one clause
via the alignment page); the framework and Kit streams, the directives
index, the contributor guide beyond its release paragraph, and the
operations index beyond its link text are silent by design; the directions
register is out of scope by its own rule. Surfaces that agree as written:
`toolkit-publish-mechanism`, `innovation-kit` and its capability definition
(topology-neutral), `design-system-as-configured-framework` (the same thin
Oak the five-class test makes), `reliable-atoms-programme` (cedes the
space), ADR-154 (the gradient the plan maps), ADR-041 and ADR-108 (silent on
the extraction, amended at the lane's later slices).
