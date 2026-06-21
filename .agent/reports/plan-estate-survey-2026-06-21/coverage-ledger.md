# Deep Plan-Estate Survey — Coverage Ledger (living)

## ▶ WINDOW STATE (live, 2026-06-21 ~17:10 UTC)

**Survey RUNNING — account budget CONFIRMED for this owner-reset window.** Cosmos calls Infinity
(`9888f9`), the SOLE survey orchestrator (successor to Anvil lifts Solder; claim `3a5e8798`), fired the
`product-development-governance` probe increment (4 plans) which returned 4/4 readable — confirming the
window has compute. Continuing Pass-1 in conservable ~8–12-plan increments (next: `agent-tooling`),
each conserved+committed the instant its Workflow call returns (the "do not lose intermediate results"
constraint — conservation granularity kept smaller than the session-death loss-event granularity).

Recorded lesson (one wasted attempt, no findings lost): a *fresh session* is NOT a *fresh window* —
the session limit is account-level, shared across the rotating cast. The first 1b attempt (12 plans,
same already-spent window as Hobby's 1a) hit the limit and returned all-`unreadable` (HALT-don't-
fabricate held; zero fabricated findings). Pace **one ~35-plan sub-batch per owner-reset window** per
`04`. If the limit recurs mid-1b, completed plans are conserved per-increment; resume the remaining
increments from this ledger after the next reset.



> Running record of survey coverage across the multi-window rotating-cast effort. Output #4 of
> the survey (per `04-orchestration-state-and-successor-handoff.md`). **No silent truncation** —
> every coverage bound is logged here. Updated by the survey orchestrator as each sub-batch lands.
> Discipline: each sub-batch's full per-plan findings are conserved to a `pass1-<...>.json` in this
> dir the instant the Workflow call returns (the owner's "record findings in the repo, do not lose
> intermediate results" constraint — conservation granularity is kept smaller than the
> session-death loss-event granularity).

## ⚑ SUBSTANCE RE-AIM (owner-ratified, 2026-06-21)

The survey is re-aimed from form toward SUBSTANCE: per-choice effectiveness/adequacy, content-quality, the
good/bad/speculative trichotomy, and a provable no-loss audit. Owner correction (12:53Z): curate at the
**IDEA level**, not the plan. The instrument now captures `substance_class` (per-plan summary:
good/mixed/bad/speculative), `content_quality`, and `salvage_value` as an **idea-granular inventory**
(`[{idea, class, file_line}]`). 1b-04 ran with the COARSE fields; 1a/1b-01..03 carry none. OBLIGATION: a
focused holistic-only **BACK-FILL of the idea-granular inventory across ALL 70 AEE plans** before Pass-3.
Two-pass consolidation is restructure-side (Ganymede), owner-confirmation pending. Full state + division +
routing: [`05-orchestration-state-and-successor-handoff.md`](./05-orchestration-state-and-successor-handoff.md).

## Plan universe (Phase 0, re-derived first-hand)

286 non-archive `*.plan.md` across 16 collections. Lanes: `current/` 145, `future/` 121,
`active/` 16, other 4. 38/286 (13%) no frontmatter. (Archive: 168 plans — OUT of the ≥3-reads
scope; not surveyed.) Source: `worklist-plans.tsv`.

## Pass 1 — per-document pipeline (holistic + conformance + conditional specialist + scoped verify)

| Unit | Collection | Plans | Orchestrator | Status | Conserved to |
| --- | --- | --- | --- | --- | --- |
| Smoke | (variety, 5 cross-collection) | 5 | Hobby wakes Halo | pipeline VALIDATED (`wf_71bdbaed-484`) | `03-smoke-run-validation.md` |
| 1a | agentic-engineering-enhancements (`active/` + first `current/`) | 35 | Hobby wakes Halo | COMPLETE | `pass1-agentic-engineering-batch1a.json` |
| 1b (1st attempt) | agentic-engineering-enhancements | 12 | Pinnace hunts Marsh | SESSION-LIMITED, 0 findings (HALT held, no fabrication; same already-spent window) — superseded by the increments below | — |
| 1b-01 | agentic-engineering-enhancements (`current/`) | 4 | Pinnace hunts Marsh | COMPLETE (3 keep / 1 archive-complete; 3 major-drift / 1 no-fm; 4 high-stakes all survive; 1 locked-contradiction) | `pass1-agentic-engineering-batch1b-01.json` |
| 1b-02 | agentic-engineering-enhancements (`current/`+`future/`) | 8 | Pinnace hunts Marsh | COMPLETE (8 keep; 6 major-drift / 2 no-fm; 5 high-stakes all survive; 4 locked-contradictions) | `pass1-agentic-engineering-batch1b-02.json` |
| 1b-03 | agentic-engineering-enhancements (`future/`) | 12 | Pinnace hunts Marsh | COMPLETE (11 keep / 1 archive-complete; 10 no-fm / 2 major-drift; 5 high-stakes 4 survive / 1 refuted; 2 locked-contradictions) | `pass1-agentic-engineering-batch1b-03.json` |
| 1b-04 | agentic-engineering-enhancements (`future/`) | 11 | Pinnace hunts Marsh | COMPLETE (committed `e87ab281f`; COARSE substance fields — joins the back-fill set) | `pass1-agentic-engineering-batch1b-04.json` |
| arch-01 | architecture-and-infrastructure (`active/`+`current/`, plans 1–12 of 36) | 12 | Anvil lifts Solder | COMPLETE (8 keep / 3 archive-complete / 1 rewrite; substance 12 good / content 12 strong; conformance 12 major-drift; 174 ideas inventoried; 4 locked-contradictions; 15 high-stakes verdicts: 14 survive / 1 refuted) | `pass1-architecture-and-infrastructure-01.json` |
| arch-02 | architecture-and-infrastructure (`current/`+`future/`, plans 13–24 of 36) | 12 | Anvil lifts Solder | COMPLETE (12 keep; substance 12 good / content 12 strong; conformance 11 major-drift / 1 no-fm; 175 ideas inventoried; 7 locked-contradictions; 5 high-stakes verdicts: 2 survive / 3 refuted) | `pass1-architecture-and-infrastructure-02.json` |
| arch-03 | architecture-and-infrastructure (`future/`+root, plans 25–36 of 36) | 12 | Anvil lifts Solder | COMPLETE (11 keep / 1 archive-complete; substance 12 good / content 12 strong; conformance 10 major-drift / 2 no-fm; 153 ideas inventoried; 3 locked-contradictions; 8 high-stakes verdicts: 7 survive / 1 uncertain) | `pass1-architecture-and-infrastructure-03.json` |
| pdg-01 | product-development-governance (full: `future/`+`suggestions/`+root) | 4 | Cosmos calls Infinity | COMPLETE (4 keep; substance 4 good / content 4 strong; conformance 4 major-drift; 89 ideas inventoried: 79 good / 10 speculative / 0 bad; 0 locked-contradictions; 2 high-stakes verdicts: 2 survive) | `pass1-product-development-governance-01.json` |
| at-01 | agent-tooling (`active/`+`current/`, plans 1–12 of 59) | 12 | Cosmos calls Infinity | COMPLETE (7 keep / 4 archive-complete / 1 extract-then-archive; substance 12 good / content 12 strong; conformance 12 major-drift; 159 ideas: 149 good / 10 speculative / 0 bad; 1 locked-contradiction; 9 high-stakes verdicts: 8 survive / 1 refuted) | `pass1-agent-tooling-01.json` |
| at-02 | agent-tooling (`current/`, plans 13–24 of 59) | 12 | Cosmos calls Infinity | COMPLETE (9 keep / 2 archive-complete / 1 rewrite; substance 12 good; content 11 strong / 1 adequate; conformance 12 major-drift; 189 ideas: 163 good / 20 speculative / 6 bad; 5 locked-contradictions; 12 high-stakes verdicts: 8 survive / 3 refuted / 1 uncertain) | `pass1-agent-tooling-02.json` |
| at-03 | agent-tooling (`current/`+`future/`, plans 25–36 of 59) | 12 | Cosmos calls Infinity | COMPLETE (8 keep / 3 archive-complete / 1 rewrite; substance 11 good / 1 mixed; content 12 strong; conformance 11 major-drift / 1 no-fm; 175 ideas: 141 good / 34 speculative / 0 bad; 3 locked-contradictions; 14 high-stakes verdicts: 12 survive / 2 refuted) | `pass1-agent-tooling-03.json` |

After 1b: the full **agentic-engineering-enhancements** collection (70 plans) is Pass-1 complete.

After arch-03: the full **architecture-and-infrastructure** collection (36 plans) is Pass-1 complete
(Anvil lifts Solder, 3 conservable increments, 0 unreadable, 502 ideas inventoried, 14
locked-contradictions). **Pass-1 coverage at that point: 106 / 286 plans (2 collections).**

After pdg-01: the full **product-development-governance** collection (4 plans) is Pass-1 complete
(Cosmos calls Infinity, 1 increment, 0 unreadable, 89 ideas inventoried, 0 locked-contradictions; the
small SAFE warm-up that also probed and confirmed account budget for this owner-reset window).
**Pass-1 coverage so far: 110 / 286 plans (3 collections).** 13 collections / ~176 plans remain — see
the linear successor plan [`07-sole-successor-survey-plan.md`](./07-sole-successor-survey-plan.md).

### Remaining Pass-1 collections (~176 plans, ~35-plan atomic sub-batches, one per owner-reset window)

The 13 collections other than the three now complete (`agentic-engineering-enhancements`,
`architecture-and-infrastructure`, `product-development-governance`), derived from `worklist-plans.tsv`
(col `collection`): `agent-tooling` (59), `observability` (31), `sdk-and-mcp-enhancements` (28),
`sector-engagement` (12), `semantic-search` (11), `connecting-oak-resources` (10), `discovery` (9),
`user-experience` (7), `developer-experience` (4), `exploring-open-education-resources` (2),
`security-and-privacy` (1), `school-data-search` (1), `curriculum-mcp-path-to-ga` (1).
Each future sub-batch appends a row above and conserves its own `pass1-<collection>-<range>.json`.

## Pass 2 — cross-cutting relational passes (NOT STARTED)

Barrier after Pass 1. Four angles (across-plans; across-collections; plans↔threads; plans↔adjacent),
each a verified multi-agent sweep. Separate workflow.

## Pass 3 — synthesis + completeness-critic, loop-until-dry (NOT STARTED)

Two consecutive clean rounds. Separate workflow, orchestrator-in-the-loop.

## Four dated outputs (the survey's deliverables)

1. Conformance-and-traceability inventory → Stage-3 restructure work-list — NOT STARTED.
2. Cross-cutting pattern findings — NOT STARTED.
3. Taxonomy grounding → V1 input — NOT STARTED.
4. Coverage ledger — THIS FILE (living).

> Routing: only the SYNTHESIZED outputs (1)–(3), produced after Passes 1–3, route to Ganymede
> herds Penumbra (V1-fold / Stage-3) via Director Birch tracks Arbor. Raw per-plan Pass-1 findings
> are NOT V1 input; Ganymede stays survey-gated until synthesis lands.
