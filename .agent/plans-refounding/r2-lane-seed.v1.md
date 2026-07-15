# r2 — Top-down lane seed (v1, DRAFT for Director review)

Authored 2026-07-15 by Aurora guards Penumbra (2226bf), team Mango, S2 seat,
under the Director r2 remit (wake event `72687e20`; claim `a1e8fa1a`; plan
todo `r2-lanes-and-walk-a` in
`.agent/plans/product-development-governance/active/plan-corpus-refounding.plan.md`).
Status: **DRAFT — a Walk-A sitting input.** Nothing here binds until Walk A
rules; the priors it grounds in
(`.agent/plans-refounding/walk-a-structure-priors.md`) are owner-reacted
priors, not rulings.

Sources read first-hand for this derivation: `VISION.md`; `docs/strategy/`
(README, diagnosis, alignment-and-streams, the three stream docs, measures);
the structure priors; the controlling plan (P1–P14, J-map, owner-gate
register); the S2 divergence report + per-area ledgers (bottom-up
calibration only, per the design-from-impact discipline — the cowpath checks
coverage, it never drives the derivation).

## Derivation method

Top-down, three steps:

1. **Vision** names two parts (Oak's curriculum AI-native; agent-first
   product creation and curation) and one cross-cutting capabilities layer.
2. **Strategy** organises part one into three owner-signed value streams
   (MCP app `APP-*`, engineering tools `TOOLS-*`, agentic framework
   `FRAME-*`), holds cross-stream cohesion at a portfolio tier, names
   capabilities beneath the streams (knowledge-as-graphs; the Oak
   Innovation Kit — fourth-stream decision OPEN), and carries a
   production-blocking compliance/readiness surface as first-class related
   scope.
3. **The priors** bound the shape: 6–8 intent lanes; a conserving holding
   lane included; lanes are the top of the three-layer hierarchy (lane
   roadmap → strategic plan → implementation plan, implementation always
   parented); lanes and threads are different axes (a lane is a strategic
   front; continuity is a property of plans).

## The seed: seven lanes

| # | Lane (proposed id) | Derivation edge | Oak goal | Walk-A status proposed |
| --- | --- | --- | --- | --- |
| 1 | `mcp-app` | Vision part 1 (teachers) → stream MCP app → `APP-1..4`, K1–K3 | Teachers | candidate (pilot evidence indirect) |
| 2 | `engineering-tools` | Vision part 1 (ecosystem) → stream engineering tools → `TOOLS-1..4` | Ecosystem | candidate; **pilot lane** (see pilot design) |
| 3 | `agentic-framework` | Vision part 2 (outward face) → stream agentic framework → `FRAME-2`, `FRAME-4` | Ecosystem | candidate |
| 4 | `practice-and-governance` | Vision part 2 (inward face) → `FRAME-1`, `FRAME-3` + the strategy's measured-delivery shape (ADR-207/TAU) + plan-estate governance | Inward delivery capability (maps to external goals per the settled 2026-06-20 alignment rationale) | candidate |
| 5 | `capabilities` | Vision §Building capabilities → knowledge-as-graphs + the Oak Innovation Kit (strategy README, owner-named 2026-07-02; fourth-stream decision OPEN) | Both, via reuse | candidate, carrying the open fourth-stream decision as its promotion question |
| 6 | `compliance-and-readiness` | Stream mcp-app §Release-readiness (ATRS, DPIA, ICO, safeguarding, evals — production blockers) + the compliance roadmap the strategy README names as related first-class scope | Teachers (gates the app), org-statutory | candidate |
| 7 | `conservatory` | Priors §Homeless concepts cure 2 + invariant P14 (conserving holding lane) | — (conservation) | **registered at Walk A** (the holding lane must exist from day one; the r2 todo names it explicitly) |

### Lane definitions and boundaries

1. **`mcp-app`** — everything whose outcome is the teacher-facing MCP app:
   host UX, submission standards, tool taxonomy, launch readiness (K1–K3),
   GA path. Boundary: statutory/compliance work it depends on lives in
   lane 6 (the dependency is an edge, not containment); the tools it
   stands on live in lane 2.
2. **`engineering-tools`** — the SDK(s), semantic search, curriculum graph
   services, and the evidence surfaces (EEF convening). One lane at seed
   despite the strategy's own note that `TOOLS-*` may decompose
   (SDK/SEARCH/GRAPH/EEF): decomposition is additive granularity along the
   settled layering, so it is a Walk-A option with a named trigger (below),
   not a seed decision.
3. **`agentic-framework`** — the OUTWARD face only: the openly documented
   framework as an adoptable product, the exemplar posture, dispersal
   across Oak (`FRAME-4`).
4. **`practice-and-governance`** — the INWARD face: the Practice
   meta-learning loop, agent tooling, plan-estate governance (this
   refounding), the idea graph (ADR-200) and delivery-measures projection
   (ADR-207, TAU). Split from lane 3 because the work kinds, consumers,
   and attention profiles differ (outward: adopters and credibility;
   inward: our own delivery capability) — while the strategy correctly
   holds them as one stream, a LANE is a working-front, and 40% of the
   current corpus by ledger rows (agent-tooling 12,482 +
   agentic-engineering-enhancements 15,276 of 69,661) is inward-face work.
   This split is the seed's most falsifiable choice; its falsifier is
   named below and the pilot measures it.
5. **`capabilities`** — cross-product capabilities that outlast single
   products: knowledge-as-graphs applied beyond the curriculum domain, and
   the Oak Innovation Kit (rapid production-standard product creation;
   Curriculum Hub as first worked instance). Carries the strategy's open
   decision (capability vs fourth stream) as its own candidate→registered
   promotion question, with the strategy's stated graduation trigger (a
   committed family of user-facing products with their own audience and
   measures).
6. **`compliance-and-readiness`** — the statutory, externally-coupled
   production-blocking set and the named release-readiness hand-offs.
   A lane (not a sub-lane of `mcp-app`) at seed because the work is
   externally owned/coupled, has its own cadence and accountability
   table, and gates any future public surface, not only the app.
7. **`conservatory`** — the holding lane: valuable-but-unplaced intent, in
   destination-quality form, each entry carrying provenance to the frozen
   source and a PLACEMENT TRIGGER naming what future lane or decision
   would home it. Not a dumping ground: the pilot measures holding-share,
   and Walk-C reviews it (priors).

### Structural rules the seed assumes (priors; Walk A ratifies)

- Three layers below each lane: lane roadmap (one per lane + one estate
  roadmap) → strategic plans (~20 total, WIP 5 in execution, 2–3
  owner-hot) → implementation plans (always parented).
- Lanes are REGISTERED axis values with validation once Walk A rules: no
  free-text lane value can enter the destination corpus; non-pilot lanes
  sit at candidate status with named promotion mechanics (evidence carried
  by ruling batches).
- Lanes ≠ threads: continuity is a section of the strategic plan (priors
  recommend thread dissolution; Walk A decides).

## Bottom-up coverage check (calibration, not derivation)

Every current collection has a receiving lane; ambiguity is named honestly
rather than force-fit. Collections marked † split at CONCEPT level (the
priors' judgement unit) rather than mapping whole:

| Receiving lane | Collections (26 + proposals) |
| --- | --- |
| `mcp-app` | curriculum-mcp-path-to-ga, sdk-and-mcp-enhancements†, slack-assistants, user-experience† |
| `engineering-tools` | semantic-search, connecting-oak-resources, exploring-open-education-resources, school-data-search, sdk-and-mcp-enhancements†, upstream-feature-requests†, proposals/upstream-api-endpoint-additions, proposals/kg-ont-mcp-strat† |
| `agentic-framework` | sector-engagement, parts of agentic-engineering-enhancements† (outward-facing docs/exemplar) |
| `practice-and-governance` | agent-tooling, agentic-engineering-enhancements†, product-development-governance, telemetry-and-understanding†, observability†, developer-experience, templates |
| `capabilities` | curriculum-hub-demo, discovery†, proposals/kg-ont-mcp-strat† |
| `compliance-and-readiness` | compliance, security-and-privacy† |
| `conservatory` | notes, speculative, discovery† residue, effectiveness-and-impact (placement trigger: measures grounding), anything the pilot cannot place |

Observability† and security-and-privacy† straddle product lanes and the
inward lane; the pilot's within-file split flag measures exactly this
class. Telemetry-and-understanding† was corrected during canary-key
authoring (2026-07-15): its delivery plan carries
`serves_strategic_choice: APP-1` and derives from the mcp-app stream doc
first-hand, so the collection splits (product telemetry → `mcp-app`; the
ADR-207 DORA/Practice projection → `practice-and-governance`) — a worked
instance of why lane assignment reads the file, never the collection name.
`high-level-plan.md` (an estate-level index, one status row) maps to
the estate roadmap, not to any lane.

## Falsifiers — what evidence would show a seed lane is wrong-grained

Measured by the pilot evidence pass (companion design doc); thresholds are
proposals for Walk A to set or adjust:

1. **Empty lane**: a lane receiving <2% of sampled assignment rows while
   the estate is fully sampled at collection level → the lane is
   speculative; demote or merge at Walk A. (Prime candidate this could
   fire on: `capabilities`.) **Judged against expected reach, never raw
   share** (Director review condition 1, 2026-07-15): the evidence report
   carries, per lane, the rows the sample draw could have reached —
   computed from the coverage-check table below and the S-B draw
   parameters — because small collections feeding a lane contribute few
   files under the ceil-10%/min-2/cap-8 draw, and a <2% raw share can mean
   the SAMPLE under-reached the lane, not that the lane is speculative.
   Falsifier 1 fires only when received-share is low RELATIVE to the
   lane's expected reach.
2. **Indistinct pair**: two lanes whose assignments co-occur inside the
   same source plan in >40% of the files touching either → grain too fine;
   merge candidate. (Prime candidate: `agentic-framework` vs
   `practice-and-governance` — if the two-face split cannot be assigned
   reliably at plan level, the seed re-merges them into one stream-lane.)
3. **Holding-share**: >25% of sampled rows landing in `conservatory` → the
   seed misses a real lane; the holding lane is masking a taxonomy gap.
4. **Concentrated disagreement**: 2-lens disagreement concentrated on one
   lane pair (>50% of all escalations) → boundary definition defect;
   re-spec that boundary at Walk A rather than trusting either lens.
5. **Decomposition trigger** (`engineering-tools`): within-lane churn — if
   a majority of its assignments need a sub-lane qualifier to be usable by
   the assigning lens (recorded free-text), the SDK/SEARCH/GRAPH/EEF
   decomposition fires at Walk A as additive granularity.
6. **The global falsifier** (r2 todo): >20% of rows unassignable to any
   seed lane → the taxonomy re-derives; alongside the per-batch refit
   triggers (holding-share trend + lane-churn rate) once batches run.

## Open decisions routed to Walk A

- Tools decomposition (falsifier 5) — additive, never a fork (settled
  layering, owner 2026-06-20).
- The two-face split (falsifier 2) — this seed's proposal; the merged
  alternative is one `agentic-framework` lane with inward/outward as
  roadmap sections.
- Oak Innovation Kit: capability (as seeded, inside `capabilities`) vs
  fourth stream — the strategy's own open decision; the lane carries it.
- `compliance-and-readiness`: lane (as seeded) vs sub-lane of `mcp-app` —
  falsified toward sub-lane if pilot rows show it ~all app-scoped.
- Thread semantics: dissolve vs 1:1 (priors §Thread semantics) — not a
  lane question, but the same sitting should rule it since the lane
  roadmaps assume the dissolution shape.
