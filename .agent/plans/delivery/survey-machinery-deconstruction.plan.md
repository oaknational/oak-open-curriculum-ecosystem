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
tickets: []
depends_on:
  - plan: typescript-estate-consolidation-review
    kind: beneficial
owner_gates:
  - awaiting: owner-decision
    clears_when: >-
      Jim gives the explicit go on the survey lane — the 2026-08-12 hold
      ("don't start the survey until I give the word", worded direct to the
      lane seat, Director-concurred broad on both nodes) discharges at his
      word through any seat.
    expires: 2026-09-02
last_updated: 2026-08-12
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
   top-level member of `detector-config.json` (30 members — the contract's
   real knobs), one row per `properties` member of each of the three
   schemas (37 + 15 + 17), with each schema's `$defs` riding the row of the
   property that references them; plus one row per promotion-test gate
   (10), per architectural-value-stack layer (5), and per named calibration
   finding and knowledge-safety constraint. The row sets split by
   derivation class: contract members, schema properties, gates, and
   layers are MECHANICALLY derivable (jq keys; the frame's own tables);
   calibration findings and knowledge-safety constraints are
   PROSE-DERIVED — they enter via a committed enumerated list whose
   derivation is documented row-by-row (source heading + anchor), which
   the instrument then checks coverage against; a reviewer spot-checks
   the list against the prose. Expected ledger size: ~110–130 rows.
   Each row: `proved` / `generalises-to <scale>` /
   `dies-because <reason>`, with pointers. (The disposition-ledger
   discipline: every input gets a recorded decision; work is sized to
   unique substance.)
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
   target scale. Proof: repo-safe — the same committed instrument checks
   the two columns are non-empty on every surviving row (ledger row data
   is a structured artefact, the human table rendered from or
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

## Todos

1. Land the TypeScript enumeration instrument + the documented
   prose-derived row list; derive the ledger's row skeleton from them.
2. Fill the ledger: proved / generalises-to / dies-because per row, with
   evidence pointers into the corpus.
3. Contract-coverage map: fresh gate/smoke runs banked verbatim; held
   slices from the refreezeReason; coverage distance stated.
4. Separation pass: detector-fact vs judged-reading per surviving element;
   target scale per `generalises-to`.
5. Report assembly; enumeration instrument green; validator and gate
   green; PR.
