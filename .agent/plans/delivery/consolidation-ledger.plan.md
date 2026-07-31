---
id: consolidation-ledger
node_type: delivery
name: "The consolidation ledger — stock instrument generalised to flow"
overview: "A distributed, closure-checked ledger over every knowledge-capture surface: computed denominator, authored dispositions, monotone re-integration."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: planning-and-intent-estate
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-07-31
---

# The consolidation ledger — stock instrument generalised to flow

## Goal

Every knowledge item on the estate's capture surfaces — napkin entries,
comms events, handoff records, experience letters — carries exactly one
recorded processing disposition, continuously, across every checkout;
today that state exists only as convention and per-pass reports.
(No Linear ticket by design: this subtree is owner-ruled untracked —
plan-node schema, dated amendment 2026-07-31.)

## Mechanism

The ratified migration-ledger instrument (strategic node §The bet)
applied to the ongoing stream: a **computed denominator** (scan the
capture surfaces at read time — never hand-kept) crossed with
**authored dispositions** (`processed-into-graph` with provenance
pointer / `pending` / `retained-as-evidence`), with a **closure check**
that recomputes both. Distribution comes from the ratified mathematics:
disposition merge across checkouts is monotone union (PDR-134 §The
unifying schema); a same-item disposition conflict is detected and
resolved by evidence-carrying supersession, never overwrite. Comms
events are the worked instance of a **transient local home**: raw
observation whose value crosses the membrane only at processing —
recorded here as design substance and flagged as a PDR-134 amendment
candidate once first-implementation evidence exists (two-speed
learning: the doctrine graduates on evidence, not authoring
enthusiasm).

Prime empirical input (added 2026-07-31, owner-directed relay): the
comms-corpus homeless-set ontological cut —
`.agent/reports/agentic-engineering/comms-corpus-knowledge-transfer/discovery-report-2026-07-31.md`
§"The homeless set" — classifies 130 unhomed candidates into five
failure-mode classes (graduation latency, stale homes, wrong
visibility tier, shattered compounds, orphaned obligations). The
ledger's disposition vocabulary should be checked against those
classes at pickup — with the axis split made explicit
(cross-platform bounce, Dolphin weaves Marsh, 2026-07-31, accepted on
critical assessment): processing disposition stays EXACTLY-ONE per
item; the failure-mode classes are ZERO-OR-MORE tags on a separate
axis, never an exclusive enum — the classes are cure-families that
mix levels and genuinely co-occur (an item can be stale AND
wrong-tier), so folding them into the disposition would force false
single-labels.

## Acceptance criteria (each with a proof — required)

- The denominator is recomputed at every read and matches a first-hand
  scan — `repo-safe`: the ledger's own closure validator, red-first.
- Every item has exactly one disposition state; closure is
  recomputable — `repo-safe`: the same validator.
- Two checkouts' ledgers merge to their union with conflicts surfaced,
  never silently resolved — `repo-safe`: a merge test over fixture
  ledgers.
- A `processed-into-graph` disposition always carries a resolvable
  provenance pointer — `repo-safe`: link-resolution leg.

## Out of scope

The signal surface (its own plan: `consolidation-signal`); any
processing automation (dispositions stay authored); comms-event
retention-policy changes.

## Todos

Sliced at pickup by the implementer; single-story steps within round
budgets (PDR-132).
