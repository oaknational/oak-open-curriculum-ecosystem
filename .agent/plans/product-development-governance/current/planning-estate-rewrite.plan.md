---
id: planning-estate-rewrite
node_type: plan
kind: executable
serves_strategic_choice: pending
derives_from:
  - ../../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md
last_updated: 2026-06-30
todos:
  - id: ws1-verify-graph-core-api
    content: "RESEARCH — DONE 2026-06-22 (first-hand graph-stack survey; result recorded in ADR-200 §Open). WORKING substrate: graph-core (term/quad, DatasetCore, DataFactory, JSON-LD 1.1 processor, RDFC-1.0 canon, 7-vocab registry, GraphView interface); graph-ingest/jsonld-compatible + turtle + source-path; graph-project (RDF<->property-graph projection + adjacency); graph-corpus-sdk as the domain-instance model. JSON-LD bridge LANDED (jsonld-compatible). UN-built — the idea-graph's genuine new work: idea-node JSON Schema + id-minting + store layout; a new idea-graph domain SDK (sibling to graph-corpus-sdk); evolution tooling (supersede/split/merge/redirect with reference-rewrite + history — graph-core has only dataset CRUD); frontmatter<->store validator; harvest pipeline."
    status: completed
  - id: ws2-idea-schema-structure
    content: "DECIDE+DESIGN: author the idea-node JSON Schema STRUCTURE (fields/edges per ADR-200 §5; vocabularies left open as $comment DISCOVERED) and decide id-minting (stable assigned, IRI-able, NOT content-derived). Output: idea-node.schema.json skeleton + an id-minting note. Acceptance: validates a hand-written sample idea-node; ids are stable across an edit to statement."
    status: pending
    depends_on: [ws1-verify-graph-core-api]
  - id: ws3-broad-shallow-discovery
    content: "SURVEY: a broad-shallow pass over the 570-doc live corpus to ground the OPEN vocabularies (value facets, domain, edge-types) + test whether scale earns its place. Screen → enhance → normalise → close the V1 vocabularies → finalise the JSON Schema. Output: the closed vocabularies + the finalised schema. Acceptance: vocabularies derived from corpus evidence (not templated); every retained facet meets a minimum-instance floor set from the observed WS3 distribution and recorded with the closed vocabularies (a facet appearing once is rejected as templating residue unless owner-ratified); the coverage of the shallow pass is logged (no silent truncation)."
    status: pending
    depends_on: [ws2-idea-schema-structure]
  - id: ws4-thin-slice-proof
    content: "BUILD (the gate): prove the architecture end-to-end on a thin vertical slice — harvest a handful of ideas from a few docs → store as JSON-LD idea-nodes in graph-core → author ONE new plan referencing them by frontmatter edge → exercise BOTH drift mechanisms (deterministic frontmatter->store validator; semantic prose<->frontmatter reconciliation — the ADR-200 §8 workflow) + TWO evolution ops: supersede/redirect AND merge (the n:1 reference-rewrite WS6/WS7 depend on — graph-core has no merge; it is new). Acceptance: the loop runs end-to-end; the deterministic validator catches a deliberately-broken edge; the merge op rewrites referencing edges and the validator catches a deliberately-left-dangling inbound edge; both ops preserve history. GATE: do not proceed to ws6 until this passes."
    status: pending
    depends_on: [ws1-verify-graph-core-api, ws2-idea-schema-structure]
  - id: ws5-projection-types-and-dedup
    content: "DESIGN+ANALYSIS: design the projection-type schemas (vision/strategy/stream/thread/high-level-plan/implementation-plan frontmatter-edge schemas, or a unified projection-node schema) AND the de-duplication/merge mechanism (how 'same idea' is determined + merged via duplicates/same_as + a merge op). Output: the projection-type schemas + the dedup/merge spec. Acceptance: each projection-type's frontmatter contract is stated; the dedup rule is deterministic-or-clearly-semantic."
    status: pending
    depends_on: [ws2-idea-schema-structure]
  - id: ws6-deep-harvest
    content: "GATED on ws4 + ws3: deep harvest of every .agent/plans/ doc (count re-derived at harvest, NOT frozen) PLUS VISION.md + docs/strategy/ (owner-ratified 2026-06-22) to the finalised schema -> the preserved idea-graph spanning all altitudes (the existing thin Pass-1 idea data is re-derived/enriched, not relied on). Acceptance: every in-scope doc harvested; every idea has provenance + class; coverage logged; the graph validates against the schema; vocabulary-friction logged as a first-class output (forced-misfit ideas, missing facets/domains/edges, scale-misfit) -> feeds ws6b."
    status: pending
    depends_on: [ws3-broad-shallow-discovery, ws4-thin-slice-proof]
  - id: ws6b-vocabulary-reassessment
    content: "GATED on ws6: V2 vocabulary reassessment at the highest-signal moment (full data + logged friction). Consolidate ws6's friction log + the values the full harvest surfaced -> additively refine the value/domain/edge vocabularies (V1 -> V2; structure stays LOCKED per ADR-200 §5, only values extend) -> re-tag/re-validate the friction-affected nodes against V2. Acceptance: every logged friction item is dispositioned (absorbed into V2, or recorded out-of-vocabulary with reason); V2 is additive over V1 (no structural change); affected nodes re-validate against V2; ONE bounded pass (not a V2->V3 loop — further evolution is the living graph's normal operation per ADR-200 §7). Re-tag mechanics (sampled vs full; friction threshold) decided here from the observed friction volume."
    status: pending
    depends_on: [ws6-deep-harvest]
  - id: ws7-synthesise-and-rewrite
    content: "GATED on ws6b + ws5: analyse the idea-graph (cluster by strategic choice; surface duplications/contradictions/gaps) -> synthesise -> CO-AUTHOR (human + agent, owner-ratified 2026-06-22) the new stream->thread->plan corpus UNDER the existing vision+strategy (which stand, tweaks only — not re-authored); under-served choices get authored plans -> two-direction independent no-loss audit (harvest-recall vs re-read sources + re-expression vs the preserved graph + bad-pile re-screen), by a fresh-context reviewer that did not perform the harvest -> route permanent knowledge to ADRs/PDRs/docs -> retire the old plan estate. Acceptance: two-direction no-loss audit GO; per-choice effectiveness reviewer-confirmed; human-navigability confirmed."
    status: pending
    depends_on: [ws6b-vocabulary-reassessment, ws5-projection-types-and-dedup]
---

# Planning-Estate Rewrite — execution plan (on the living idea-graph)

**Architecture: [ADR-200](../../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md)**
(graph-authoritative, dual human/machine embodiment, frontmatter connection, two-mechanism drift,
living-graph-on-`graph-core`). This plan is the **executable** projection of ADR-200's sequence. It is
authored to the V0 plan-schema (the V0-bridge): it is itself a forward-compatible plan that will gain
idea-node edges additively when the graph lands.

> **Decision-completeness honesty.** WS1–WS5 are decision-complete **as tasks** (clear inputs, outputs,
> acceptance) and execution-ready now. WS6–WS7 are **deliberately gated** on the thin-slice proof (WS4)
> and the discovery pass (WS3) — they **cannot** be decision-complete before those land, and pretending
> otherwise would be the over-claim this plan exists to avoid. The genuine uncertainties are in
> §Uncertainties, marked unmissably.

## End goal · mechanism · means

- **End goal.** A new, strategy-aligned, human-navigable plan corpus (`stream → thread → plan`) that
  projects a preserved, authoritative idea-graph — every valuable idea from the current estate
  re-expressed in service of the strategy, no useful idea lost (proven independently), permanent
  knowledge routed to permanent homes, the old estate retired. (ADR-200 §Goals.)
- **Mechanism.** Build the idea-graph foundation (schema + SDK over `graph-core` + the two drift
  mechanisms), prove it end-to-end on a thin slice, ground the open vocabularies empirically, then
  harvest → synthesise → rewrite. The graph is the connective tissue and the no-loss audit substrate.
- **Means.** The seven workstreams in the frontmatter `todos`, gated as declared.

## Acceptance (outcome-level)

Co-equal across three axes (ADR-200 §Goals): **no useful idea lost** — proven by the two-direction audit
(harvest-recall against re-read sources + re-expression against the graph) plus a bad-pile re-screen, run by
a fresh-context reviewer that did not perform the harvest; **per-choice effectiveness** (reviewer-confirmed,
every strategic choice served by adequate plans, gaps closed by authored plans); **human-navigability** (a
person can traverse vision → strategy → stream → thread → plan and understand the intent). Plus: the
deterministic frontmatter↔store validator is green and the prose↔frontmatter reconciliation workflow
(ADR-200 §8) is wired.

## Governing invariant — every organising axis is registered and validated (owner-stated, 2026-06-30)

**No explicit organising layer or axis may be free-text.** Streams, threads, domains, lifecycle
states, value facets, and edge-types each require (a) a **registry** — a controlled, enumerable
source of truth — and (b) **validation** — a hard gate enforcing membership *and*
reference-integrity. This is `schema-first-execution` / `strict-validation-at-boundary` / closed-union
design applied to the estate's organising axes; the in-repo exemplar is the naming-schema registry
(ADR-198: a closed `NamingSchemaId` union plus a digest gate that fails the tree on un-versioned
edits).

This is the **governance face of the graph-convergence** (the graph-approach convergence target;
ADR-200). The [`knowledge-distribution-substrate`](../../agent-tooling/future/knowledge-distribution-substrate.plan.md)
is the *operational-state* face of the same lever — the planning estate and the agent operating
model are two consumers of one schema-governed graph, not two systems. The invariant is **already
structural here** (WS2 = the node registry; WS3 = the facet/domain/edge-type registries; WS5 = the
stream/thread/lifecycle projection-type schemas; WS4 = the deterministic validator gate) — it is
stated as an explicit invariant so no successor leaves a vocabulary open as free-text, a
projection-type unvalidated, or a reference unchecked.

**The defect it cures (worked evidence, 2026-06-30):** in the current pre-graph estate `serves_stream`
is ungoverned free-text — four different labels for one five-plan cluster, plus a template placeholder
(`"[the stream above it]"`) leaking into real frontmatter — and `serves_thread: agent-operability` is
an orphan reference to a thread with no record (there is no plan→thread reference-integrity gate). The
rewrite must not reproduce ungoverned axes.

**Pending naming decision this invariant owns (re-homed from the open-questions register,
2026-07-02):** the five-plan agent-team-operations cluster (`agent-naming-schema-v3`,
`knowledge-distribution-substrate`, `agent-spawn-flow-tool`,
`session-and-team-state-statusline-icons`, `collaboration-substrate-coordination-rightsizing`)
gets its name — and its tier (sub-stream vs thread) — **minted as a registered axis value at
WS2/WS3 and owner-ratified there**, in one act. The owner leaned "agent teams / agent-team
operations" (2026-06-30); "substrate" is avoided in the group name to prevent part/whole
confusion with the member `knowledge-distribution-substrate` plan. Do not mint a free-text
`serves_stream` value ahead of the registry.

**Binds:** WS2 (close the node schema's axis vocabularies; do not leave them free-text), WS3 (the
closed vocabularies *are* the registries), WS5 (projection-type schemas validate stream / thread /
lifecycle membership), WS4 (the validator enforces membership **and** reference-integrity — a
deliberately-orphaned `serves_thread`-class edge must fail the gate, the way the WS4 dangling-inbound
case already does).

## Prerequisites

- **`graph-core` (generic RDF/JSON-LD substrate)** — `blocking` for WS2/WS4 (the idea-graph is an
  instance over it). Confirmed present; exact reuse surface verified in WS1.
- **The strategy corpus (`docs/strategy/`) — the streams + strategic choices** — `blocking` for WS7
  (synthesis organises by them) and for resolving `serves_strategic_choice`. Present.
- **ADR-200** — `blocking` (the architecture). Accepted.
- **A stable harvest universe** — `beneficial`: the harvest scope (everything under `.agent/plans/`
  after the archive relocation) shifts only **additively** as new forward V0-bridge plans land — the
  estate is **not** frozen (ADR-200 §Scope: the count is re-derived at harvest, not frozen; §Consequences:
  forward genuinely-new work is unblocked, the existing-estate rewrite WS6–WS7 is gated). Standing model:
  re-derive the in-scope delta before each harvest pass (WS6).

## Non-goals (ADR-200 §Non-goals — the anti-patterns)

NOT a refactor/relabelling of existing plans; NOT preserving existing plan files because they exist; old
plan conformance/classification is NOT a goal; `*.plan.md` is not the definition of a plan; scope is the
principal's, default-inclusion; do not defer settleable foundations; do not template vocabularies; the
graph and documents are co-equal. The full list and rationale are in ADR-200 §Non-goals — they recurred
this session and a successor must actively resist them.

## ⚠ Uncertainties (marked extremely clearly — resolve before the gated workstreams)

These are NOT "will be handled later" — each names who resolves it and in which workstream:

- **[RESOLVED — owner, 2026-06-22] Harvest-source breadth.** The harvest ingests `VISION.md` +
  `docs/strategy/` **in addition to** everything under `.agent/plans/` — the graph spans all altitudes
  and the no-loss audit is complete end-to-end. (`VISION.md` and the strategy corpus are the
  highest-altitude idea-projections; their ideas become high-altitude nodes.)
- **[RESOLVED — owner, 2026-06-22] Authoring model.** Vision + strategy are **already authored and
  stand** (at most minor tweaks) — the harvest extracts their ideas into the graph, but the documents
  persist as the highest-altitude projections; they are NOT re-authored. The new `stream → thread → plan`
  corpus is **co-authored (human + agent)**: the human owns the higher-altitude shaping, agents draft
  plan-level documents from the synthesised ideas. WS7 is collaborative authoring, not agent-solo.
- **[RESOLVED — first-hand survey, 2026-06-22] `graph-core` API + the JSON→JSON-LD ingestion contract.**
  Surveyed first-hand (ADR-200 §Open + WS1 above): the substrate (`graph-core`), ingestion
  (`graph-ingest/jsonld-compatible` + `turtle`), and projection (`graph-project`) WORK; `graph-corpus-sdk`
  is the instance model. The genuine new build is the idea-node schema + a new idea-graph SDK + evolution
  tooling (supersede/split/merge) + the frontmatter↔store validator + the harvest pipeline.
- **[WS2-RESOLVED] Idea-store physical layout** (one file per node vs consolidated) and **id-minting
  scheme**. Direction set (one JSON-LD file per node; stable assigned IRI-able id) but the exact shape is
  WS2's decision.
- **[WS3-RESOLVED] The value/domain/edge vocabularies + whether `scale` earns its place.** Discovered
  empirically in the broad-shallow pass — not pre-decided.

## Lens-resolved directions for the open design-steps (2026-06-22)

The open design-steps were triaged through the decision lenses (`principles.md` §Decision Lenses). The
**architecture-level** directions live in
[ADR-200 §Open](../../../../docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md#open)
(id-minting, store layout, de-duplication, projection-type schemas, the idea-graph SDK boundary). The
**execution-level** directions, by workstream:

- **WS2 — SDK boundary (L1 + `consolidate-at-second-consumer`):** build the idea-graph SDK as a clean
  parallel instance reusing `graph-core`'s generic substrate; do **not** extract a shared domain-SDK
  abstraction now (the family-of-graphs is the future second-consumer trigger). `architecture-expert`
  confirms the boundary (already in §Readiness reviewers).
- **WS5 — de-duplication (L1 + the no-loss invariant):** semantic-proposes → deterministic-merge-with-
  reference-rewrite → validator-verifies; conservative, reviewer-confirmed, history-preserving.
  **Projection-type schemas (L3):** a unified projection-node schema with a `projection_type` discriminator,
  specialised only where a type genuinely diverges.
- **WS6 — harvest pipeline (L1):** reuse the proven Pass-1 survey mechanics (workflow-orchestrated,
  conserve+commit per increment, HALT-don't-fabricate, budget-window-paced). **Pass-1 data (L1 + L2):**
  re-harvest to the full schema — the thin Pass-1 idea data is a cross-check only, never the basis (cost
  must not dominate architectural excellence — owner).
- **WS7 — no-loss-audit independence (L2 + L1, the clean-room pattern):** the fresh-context auditor is
  **harvest-naive** (a separate session/checkout that did not perform the harvest), reading re-read sources
  against the graph; invertible provenance (node → source `file:line`) enables source-span enumeration.
  **65 locked-contradictions (L1):** triage them through the decision lenses at synthesis and surface only
  the residual genuinely-owner conflicts to the owner (batched, pre-analysed) — never dump the raw set.

These are **directions to confirm** at each workstream, not closures; each workstream's own design or
empirical pass ratifies or revises them (e.g. the WS6 survey-pattern-reuse warrant is verified at WS6). The
owner affirmed this confirm-at-the-workstream approach as good agile practice (2026-06-22).

## Incremental delivery (the boundary — ADR-200 §Consequences)

Forward, genuinely-new high-value work proceeds **now** as V0 plans (unblocked) — they serve strategic
choices via frontmatter and gain idea-edges additively when the graph lands. The estate **rewrite** (WS6–
WS7) is gated on the idea-graph. The two cannot conflict (V0-bridge plans are new and graph-shaped). V0-
bridge is scoped to work that genuinely cannot wait, to bound the idea-edge backfill — not a licence to
pre-author the whole corpus.

## Risks

| Risk | Mitigation |
| --- | --- |
| Building the full harvest on an unvalidated architecture | WS4 thin-slice proof is a hard gate before WS6 |
| Over-claiming decision-completeness on the gated phases | WS6–WS7 explicitly gated; §Uncertainties marked |
| Conservation pull re-corrupting the framing in a later session | ADR-200 §Non-goals + the reframed thread record + this plan's §Non-goals |
| Vocabularies templated rather than discovered | WS3 grounds them in corpus evidence with logged coverage |
| `graph-core` reuse assumed, not verified (placeholder risk — the survey caught one) | WS1 verifies the landed API first-hand before WS2/WS4 commit to it |

## Foundation alignment

`principles.md` (LTAE, the decision lenses); `schema-first-execution.md` (the JSON Schema is the
authoring contract; types flow from it); `testing-strategy.md` + `tdd-as-design.md` (WS4 + WS6 code lands
test-first); ADR-200 (the architecture); V0 plan-schema (the form this plan and the new corpus take).

## Plan-body first-principles check

Fires before executing each gated workstream: re-ask whether the step makes the estate more truthful and
serves the strategy, or merely satisfies the apparatus. WS4 (the proof) is the structural embodiment of
this check — it refuses to let the big build proceed on faith.

## Readiness reviewers

Before any workstream is marked execution-started: `assumptions-expert` (proportionality of the harvest
fan-out + the gating); `architecture-expert` on the idea-graph SDK boundary over `graph-core` (WS1/WS2);
`config-expert` when the deterministic validator joins `repo-validators` (WS4). `docs-adr-expert` reviewed
ADR-200's authoring.

## Lifecycle

This plan lives in `current/` (executable, queued). It is promoted to `active/` when WS1 starts. On
completion of WS7, the old estate is retired and this plan is archived with a reference to the new corpus.
Learning-loop consolidation runs at each workstream close.
