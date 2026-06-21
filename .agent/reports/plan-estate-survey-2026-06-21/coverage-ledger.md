# Deep Plan-Estate Survey — Coverage Ledger (living)

## ▶ WINDOW STATE (live, 2026-06-21 ~19:15 UTC)

**Survey RUNNING (window 2) — n=2 team.** Cosmos calls Infinity (`9888f9`, orchestrator claim
`3a5e8798`) holds the survey lane; **Oyster weaves Surf** (`d16a4a`, claim `93c58529`) joined on WS-3
(F-41 path-safety, `agent-tools/**`) — boundaries verified first-hand as fully disjoint, no contention.
**Window 1** (this session, ~17:07–19:1xZ) ran 6 clean increments — PDG (4) + agent-tooling (59), to
**Pass-1 169/286** — then **spent at ~63 plans**: the 7th increment (observability OBS-01, 12 plans)
hit the account session limit mid-batch and returned **all-12 `unreadable` / 0 findings** (24
holistic+conformance subagents all `session-limit`; **HALT-don't-fabricate held — 0 fabricated
findings**, nothing conserved). Owner reset → **window 2 open**; OBS-01 **re-fired**, returned 12/12.
Account budget is now **shared with Oyster's concurrent WS-3**, so pacing reverts to the considerate
~one-35-plan-window default (sole-mode "fire until `unreadable`" suspended). Each increment is
conserved+committed the instant its Workflow call returns.

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
| at-04 | agent-tooling (`future/`, plans 37–48 of 59) | 12 | Cosmos calls Infinity | COMPLETE (11 keep / 1 rehome; substance 12 good; content 11 strong / 1 adequate; conformance 7 major-drift / 5 no-fm; 160 ideas: 146 good / 14 speculative / 0 bad; 4 locked-contradictions; 7 high-stakes verdicts: 7 survive) | `pass1-agent-tooling-04.json` |
| at-05 | agent-tooling (`future/`, plans 49–59 of 59) | 11 | Cosmos calls Infinity | COMPLETE (9 keep / 1 archive-complete / 1 rehome; substance 11 good; content 11 strong; conformance 7 major-drift / 4 no-fm; 126 ideas: 107 good / 19 speculative / 0 bad; 2 locked-contradictions; 10 high-stakes verdicts: 9 survive / 1 refuted) | `pass1-agent-tooling-05.json` |
| obs-01 (1st attempt) | observability (`active/`+`current/`, plans 1–12 of 31) | 12 | Cosmos calls Infinity | SESSION-LIMITED, 0 findings — account window 1 spent at ~63 plans this session; all 24 holistic/conformance subagents hit the limit; HALT-don't-fabricate held, 0 fabricated; superseded by the re-fire below after owner reset | — |
| obs-01 | observability (`active/`+`current/`, plans 1–12 of 31) | 12 | Cosmos calls Infinity | COMPLETE (re-fired after owner reset; 9 keep / 3 archive-complete; substance 12 good / content 12 strong; conformance 12 major-drift; 163 ideas: 136 good / 26 speculative / 1 bad; 4 locked-contradictions; 11 high-stakes verdicts: 10 survive / 1 uncertain) | `pass1-observability-01.json` |
| obs-02 | observability (`current/`+`future/`, plans 13–24 of 31) | 12 | Cosmos calls Infinity | COMPLETE (11 keep / 1 archive-complete; substance 12 good; content 10 strong / 2 adequate; conformance 12 major-drift; 153 ideas: 132 good / 17 speculative / 4 bad; 1 locked-contradiction; 9 high-stakes verdicts: 9 survive) | `pass1-observability-02.json` |
| obs-03 | observability (`future/`, plans 25–31 of 31) | 7 | Cosmos calls Infinity | COMPLETE (5 keep / 1 archive-complete / 1 rehome; substance 7 good; content 6 strong / 1 adequate; conformance 7 major-drift; 87 ideas: 70 good / 17 speculative / 0 bad; 1 locked-contradiction; 7 high-stakes verdicts: 5 survive / 2 refuted) | `pass1-observability-03.json` |
| sdk-01 | sdk-and-mcp-enhancements (`active/`+root+`current/`, plans 1–12 of 28) | 12 | Cosmos calls Infinity | COMPLETE (10 keep / 1 archive-complete / 1 rewrite; substance 11 good / 1 mixed; content 11 strong / 1 adequate; conformance 12 major-drift; 152 ideas: 124 good / 25 speculative / 3 bad; 2 locked-contradictions; 10 high-stakes verdicts: 9 survive / 1 refuted) | `pass1-sdk-and-mcp-enhancements-01.json` |
| sdk-02 | sdk-and-mcp-enhancements (`current/`+`future/`, plans 13–24 of 28) | 12 | Cosmos calls Infinity | COMPLETE (8 keep / 4 archive-complete; substance 12 good; content 12 strong; conformance 11 major-drift / 1 no-fm; 159 ideas: 143 good / 16 speculative / 0 bad; 0 locked-contradictions; 14 high-stakes verdicts: 13 survive / 1 refuted) | `pass1-sdk-and-mcp-enhancements-02.json` |

After 1b: the full **agentic-engineering-enhancements** collection (70 plans) is Pass-1 complete.

After arch-03: the full **architecture-and-infrastructure** collection (36 plans) is Pass-1 complete
(Anvil lifts Solder, 3 conservable increments, 0 unreadable, 502 ideas inventoried, 14
locked-contradictions). **Pass-1 coverage at that point: 106 / 286 plans (2 collections).**

After pdg-01: the full **product-development-governance** collection (4 plans) is Pass-1 complete
(Cosmos calls Infinity, 1 increment, 0 unreadable, 89 ideas inventoried, 0 locked-contradictions; the
small SAFE warm-up that also probed and confirmed account budget for this owner-reset window).
**Pass-1 coverage at that point: 110 / 286 plans (3 collections).**

After at-05: the full **agent-tooling** collection (59 plans) is Pass-1 complete (Cosmos calls Infinity,
5 conservable increments at-01..05, 0 unreadable, 809 ideas inventoried: 706 good / 97 speculative / 6
bad, 15 locked-contradictions, 52 high-stakes verdicts: 44 survive / 7 refuted / 1 uncertain).
**Pass-1 coverage at that point: 169 / 286 plans (4 collections).**

After obs-03: the full **observability** collection (31 plans) is Pass-1 complete (Cosmos calls Infinity,
3 increments obs-01..03 — obs-01 re-fired after the window-1 depletion + owner reset — 0 unreadable, 403
ideas inventoried: 338 good / 60 speculative / 5 bad, 6 locked-contradictions, 27 high-stakes verdicts:
24 survive / 2 refuted / 1 uncertain). **Pass-1 coverage so far: 200 / 286 plans (5 collections).** 11
collections / ~86 plans remain — see the linear successor plan
[`07-sole-successor-survey-plan.md`](./07-sole-successor-survey-plan.md).

### Remaining Pass-1 collections (~86 plans, ~35-plan atomic sub-batches, one per owner-reset window)

The 11 collections other than the five now complete (`agentic-engineering-enhancements`,
`architecture-and-infrastructure`, `product-development-governance`, `agent-tooling`, `observability`),
derived from
`worklist-plans.tsv` (col `collection`): `sdk-and-mcp-enhancements` (28),
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
