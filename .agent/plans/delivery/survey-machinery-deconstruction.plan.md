---
id: survey-machinery-deconstruction
node_type: delivery
name: "Survey machinery deconstruction — harvest the proven instrument before the fresh design"
overview: "Deconstruct the typescript-estate-consolidation-review machinery — frozen detector contract, extractor implementation, calibration and knowledge-safety records, foundational-building-blocks frame — into a disposition ledger of what it proved, what generalises to the multi-scale survey programme, and what dies with the old shape."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-08-12
ratified_where: "Owner decision card at the Director seat (b10c37), 2026-08-12 ~18:05Z, answer 'Ratify' — verbatim card text and answer recorded on the census/survey ARC channel (.agent/collaboration/rapid-comms/2026-08-12-census-survey-nautilus-calls-plankton-and-plover-lifts-troposphere.md, stamp entry 2026-08-12T18:1xZ)"
serves: outcome-informed-practice-learning
impact_areas:
  - practice-and-estate
tickets: [MCP-603]
depends_on:
  - plan: typescript-estate-consolidation-review
    kind: beneficial
last_updated: 2026-08-14
---

# Survey machinery deconstruction

## Why this node exists

The owner ruled (decision cards, 2026-08-12) that the survey programme's
deliverable is a reference corpus of foundational patterns PLUS the estate
measured against it, built as a **fresh unified design** — with the rider,
verbatim: "deeply analyse and deconstruct the proven machinery first". This
node is that rider made executable. The fresh design is out of scope here and
is authored only after this node's ledger exists to feed it.

The machinery under deconstruction, all on main (preserved at safety commit
`c69b0746c`, 125 paths; the implementation subsequently greened by the
foundations-review lane — `d16ba0e7d` and three follow-on cure rounds, with
three boundary smokes wired into `test:e2e`):

- the frozen four-file detector contract (revision 2.6 with the R8/R9/R10
  refreezes): `detector-config.json`, `detector-config.schema.json`,
  `raw-extraction.schema.json`, `evidence.schema.json`;
- the extractor implementation under `agent-tools/src/typescript-estate/`
  (green at main; partial against the frozen contract — the R10
  `refreezeReason` names the held slices);
- `calibration.md`, `handoff-2026-08-03.md`, and both knowledge-safety
  records;
- `foundational-building-blocks-frame.md` (the promotion test, the
  architectural value stack, the responsibility-and-change-path unit) and
  its permanent homes (PDR-135, `docs/foundation/cost-of-change-gradient.md`,
  `docs/architecture/foundations-first.md`).

## Relationship to the ratified review plan

`typescript-estate-consolidation-review.plan.md` is ratified and owns the
corpus this node reads; the `depends_on` edge is beneficial, not blocking —
this node is fully shippable from the corpus as it stands on main. The
ledger **recommends and retires nothing**: marking an element `dies-because`
is a supersession proposal, and supersession of the ratified plan, in whole
or in part, is a separate owner act.

## Goal

The fresh multi-scale survey design can begin from a decision-grade ledger
instead of from re-reading the ~6,200 documentary lines of the preserved
corpus (the extractor's ~14,000 TypeScript lines are read at
contract-coverage granularity, not line-by-line): every element of the
proven machinery has a recorded disposition — what it **proved** (with the
evidence pointer), what **generalises** to the corpus-plus-estate programme
(and to which scale), and what **dies** with the old shape (with the
reason). Nothing is silently dropped; nothing is carried by nostalgia.

## Mechanism

Read-only analysis. No code changes, no contract refreeze, no production
edits. The deliverable is one report under
`.agent/reports/typescript-estate-consolidation-review/` (the corpus's
existing home) carrying:

1. **A disposition ledger** at a defined member granularity: one row per
   top-level member of `detector-config.json` (37 members by fresh
   recount at execution open, 2026-08-14 — 31 contract knobs plus 6
   contract-metadata members, `schemaVersion` `contractRevision`
   `reviewId` `calibrationBaseCommit` `frozenAt` `refreezeReason`, each
   metadata member still taking a row: the metadata fields carry the
   freeze discipline itself, which is exactly the kind of element the
   `survey-method` target exists for), one row per `properties` member
   of each of the three schemas (37 + 15 + 17, recount-confirmed), with
   each schema's `$defs` riding the row of the property that references
   them; plus one row per promotion-test gate (10, recount-confirmed),
   per architectural-value-stack layer (5, recount-confirmed), and per
   named calibration finding and knowledge-safety constraint. The row sets split by
   derivation class: contract members, schema properties, gates, and
   layers are MECHANICALLY derivable (jq keys; the frame's own tables);
   calibration findings and knowledge-safety constraints are
   PROSE-DERIVED — they enter via a committed enumerated list whose
   derivation is documented row-by-row (source heading + anchor), which
   the instrument then checks coverage against; a reviewer spot-checks
   the list against the prose. Expected ledger size: ~125–150 rows
   (121 mechanical + the prose-derived sets).
   Each row: `proved` / `generalises-to <target>` /
   `dies-because <reason>`, with pointers. (The disposition-ledger
   discipline: every input gets a recorded decision; work is sized to
   unique substance.) **Closed `generalises-to` target vocabulary**
   (declared at authoring; owner-approved amendment, 2026-08-14):
   `estate` (cross-workspace programme scale), `workspace`
   (census-subject scale), `module` (within-workspace file/directory
   scale), `construct` (TypeScript-construct / code scale),
   `survey-method` (scale-independent survey machinery and discipline),
   `corpus-design` (elements that generalise into the pattern corpus's
   own schema or batteries). A surviving row whose element resists
   every value takes `needs-scale-adjudication`; the accumulated set
   routes ONCE to the Director/owner at fill completion, mirroring the
   census falsifier's shape. The enumeration instrument validates the
   column against this vocabulary.
2. **Detector-facts vs judged-readings separation** carried forward
   explicitly — the frame's own discipline, named per surviving element.
3. **A contract-coverage map for the extractor**: which frozen-contract
   slices the green implementation covers and smoke-proves at main, and
   which remain contract-held (the R10 `refreezeReason` names them: module
   declarations, module resolution, delivery, graph assembly, candidate
   synthesis, and the estate run) — recorded from fresh first-hand
   instrument runs, never inherited from prior records. The coverage
   distance is the design-relevant number for the fresh design's
   build-vs-reuse decision at the code scale.

## Acceptance criteria

1. Every member of the defined ledger set (mechanism item 1) has a
   disposition row. Proof: repo-safe — a committed TypeScript
   enumeration-and-validation instrument (agent-tools home, one-command
   run, shared with the census node's instrument family; TypeScript
   rather than shell per `source-is-typescript-esm-only` and ADR-168 §5 —
   key extraction, table parsing, and coverage diffing are exactly the
   logic the shell exception excludes) recomputes the MECHANICAL row sets
   (contract keys, schema properties, gate and layer tables) and checks
   ledger coverage of the committed PROSE-DERIVED list; a reviewer runs
   one command for pass/fail and spot-checks the prose-derived list's
   documented anchors.
2. The extractor contract-coverage map is banked from fresh first-hand
   runs: gate status at main, the smoke list from the `test:e2e` wiring,
   held slices from the `refreezeReason`. Proof: repo-safe — the report
   banks the command lines and their output verbatim beside the map.
3. Every surviving (`proved`/`generalises-to`) element is marked
   detector-fact or judged-reading, and every `generalises-to` names its
   target from the closed vocabulary declared in the mechanism. Proof:
   repo-safe — the same committed instrument checks the two columns are
   non-empty and vocabulary-valid on every surviving row (ledger row
   data is a structured artefact, the human table rendered from or
   cross-checked against it, as in the census node).
4. The owner confirms, at this ledger's own review card, that it is
   sufficient design input for the fresh-design node. Proof: owner-held —
   the card answer recorded in this plan's amendment trail.

## Out of scope

- The fresh multi-scale survey design itself (its own node, after this one).
- Any change to the frozen contract files, the extractor, or production
  code — including any green-up or extension work the coverage map might
  invite.
- Retiring or superseding the ratified typescript-estate-consolidation-review
  plan (the ledger proposes; the owner disposes).
- Running the estate census with the extractor (the code-scale run decision
  belongs to the fresh design, informed by this ledger's coverage map).
- The reference pattern corpus (a deliverable of the fresh design).

## Banked inputs for the fresh survey design (pointer-carry, 2026-08-14)

Owner-agreed findings from the three-body comparison (PR #886 capability
architecture / web-app deconstruction / this survey programme), recorded
in full at
`.agent/research/capability-deconstruction-survey-comparison.md`. These
are inputs for the successor fresh-design node, banked here because this
node's ledger feeds that design; they add no work to, and change no scope
of, this node.

1. **Pattern-corpus seeds**: the deconstruction meta-analysis basis
   (seven primitives, seven coordinates, the seam rule) and
   PDR-135/PDR-139 are candidate corpus members; the three existing test
   batteries (meta-analysis survival test, PDR-139 established-pattern
   test, the foundational frame's promotion test) should be reconciled
   into the corpus, not accreted as a fourth.
2. **Capability vocabulary fix**: "capability" carries three live senses
   (product capability, runtime service capability, semantic capability
   contract); fix terms at design time, before the corpus inherits the
   ambiguity.
3. **Placement-doctrine adjudication**: estate placement rules
   (`consolidate-at-second-consumer`, PDR-108, the promotion test) vs the
   deconstruction charter's "boundaries follow meaning" refusal of
   placement doctrines — both stand in their frames; the fresh design
   chooses its placement epistemology visibly, with the owner present.
4. **Candidate instrument**: the deconstruction's premise-record template
   is a candidate instrument for the survey's judged scales.

## Todos

1. Land the TypeScript enumeration instrument + the documented
   prose-derived row list; derive the ledger's row skeleton from them.
2. Fill the ledger: proved / generalises-to / dies-because per row, with
   evidence pointers into the corpus.
3. Contract-coverage map: fresh gate/smoke runs banked verbatim; held
   slices from the refreezeReason; coverage distance stated.
4. Separation pass: detector-fact vs judged-reading per surviving element;
   closed-vocabulary target per `generalises-to`.
5. Report assembly; enumeration instrument green; validator and gate
   green; PR.

## Amendment trail

- **2026-08-14 — execution gate discharged at the owner's word.** The
  2026-08-12 hold (narrowed 2026-08-14 to design-only) discharged at
  Jim's decision-card answer, verbatim "Go — run the survey lane",
  given direct to the lane seat (Nautilus calls Plankton, c6d48b)
  2026-08-14 ~10:44Z. The `owner_gates` entry is removed by this
  amendment. Census executes first per the standing sequencing; this
  node's execution ticket opens at its own start.
- **2026-08-14 — closed `generalises-to` target vocabulary added.** The
  column previously required a target on every surviving row without
  closing the value set — a gap against this node's own
  closed-at-authoring discipline, found by the same-day concept
  exploration (`.agent/research/survey-fresh-design-concept-exploration.md`)
  and proposed on the survey-lane ARC channel. Owner approval, verbatim:
  "I approve the ledger edit" (2026-08-14 ~10:45Z, direct to the lane
  seat). The vocabulary, its escape value, and its route-once semantics
  now live in mechanism item 1; acceptance criterion 3 validates
  against it.
- **2026-08-14 — member counts corrected at the execution-open recount.**
  The authoring-time claim "30 members — the contract's real knobs" for
  `detector-config.json` was wrong: `jq 'keys | length'` over the frozen
  file returns **37** (31 knobs + 6 contract-metadata members, named in
  mechanism item 1). The three schema counts (37 + 15 + 17), the gate
  count (10), and the layer count (5) recount-confirmed against the
  frozen files and the frame's own tables. Expected ledger size revised
  ~110–130 → ~125–150. Technical correction, no scope change: the
  mechanism already declares jq keys as the mechanical derivation — the
  parenthetical was an estimate the derivation now supersedes. This is
  the freeze-entry falsifier ("check the plan's claimed counts before
  filling") firing as designed.
