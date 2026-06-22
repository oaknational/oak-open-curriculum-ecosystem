# Deep Plan-Estate Survey — Coverage Ledger (living)

## ▶ WINDOW STATE (live, 2026-06-22)

**Survey RESUMED (window 4) — sole; estate now FROZEN by owner until this work completes.** **Cinder
holds Warmth** (`2a2142`, orchestrator claim `ff06c744`) resumed after a clean stand-down; owner declared
the plan estate frozen, so the delta scan below is **definitive** (no recurring drift gate needed).
**Phase A (estate-delta completeness gate):** definitive frozen-estate scan = live non-archive
`*.plan.md` **291** vs frozen worklist **286** → **5 new `agent-tooling` plans, 0 removed** (authored
2026-06-21 post-Pass-0). Worklist reconciled to 291 (agent-tooling now 64). **Phase B (full Pass-1 on the
5 new plans):** `pass1-agent-tooling-delta-01.json` — 5/5 read, 0 unreadable, 5 keep, 58 ideas (54 good /
3 speculative / 1 bad), 3 high-stakes verdicts all survive, spot-audit passed first-hand. → **▶ PASS-1
COMPLETE over the full live estate: 291/291.**

**Coverage audit (no silent truncation — see the Coverage-bounds section below).** Documented exclusions:
archive (168), non-`*.plan.md` adjacents (~279, Pass-2 relational scope), `.cursor/plans/` (26 ephemeral),
`templates/`, `compliance/` (collection scaffold, 0 plans), `notes/` + `upstream-feature-requests/`
(not Oak plans). **Two owner-decision candidates that carry real ideas the survey never read** (both named
with no-hedging-guard-blocked tokens — literal names in the session chat): (1) a deferred-ideas directory
under `.agent/plans/` holding 13 idea-bearing docs; (2) a glob-missed observability plan,
`observability/future/replace-sentry-mode-with-observability-sinks.plan.<guard-blocked-suffix>.md`.

**Next: Phase C — the AEE idea-granular back-fill (all 70 — confirmed first-hand: even 1b-04 has empty
`salvage_value`).** Owner indicated C will likely split across this session and the next. Awaiting owner
steer on the two coverage candidates before fixing the back-fill's exact target set. Watcher armed
pipe-less; heartbeat OFF. Owner resets the budget window; owner controls push.

---

**Survey RAN (window 3) — sole (Cinder).** **Cinder holds Warmth** (`2a2142`, orchestrator claim
`<opened 21:01Z>`) picked up the sole survey lane from Cosmos calls Infinity (who closed out cleanly
20:52Z; claim `3a5e8798` archived) per doc 08 §10. Grounded first-hand on doc 08 + ledger + instrument
+ worklist TSV + git + registry; coverage re-derived from scratch = **228/286 (6 collections), 20
conserved JSONs reconcile**. FIVE clean increments this window (58 plans, at the proven-safe ~59 hold
point, under the ~63 depletion line — 0 unreadable, no account-window depletion): **sector-engagement (12)**
`2b306a202`, **semantic-search (11)** `9f6b5cf03`, **connecting-oak-resources (10)** `3b1e35134`,
**discovery (9)** `37d03d307`, **final-6 (16: user-experience + developer-experience + 4 singletons)**.
Every spot-audit passed first-hand; the Opus adversarial gate caught three real false-completion / stale
claims (`search-contract-followup`, `graph-stack` WS4.5, `devx-strictness-convergence` Object.assign),
each confirmed first-hand. → **▶ PASS-1 COMPLETE: 286/286 (all 16 collections)**, 2,935 ideas (AEE
undercount pending back-fill), 65 locked-contradictions, 240 high-stakes verdicts (210 survive / 25 refuted
/ 5 uncertain). Peer **Oyster weaves Surf** (`d16a4a`) STOOD DOWN — WS-3 F-41 complete (`4fd640089`),
singleton whole-repo `pnpm check` GREEN at `f8fa33cad` (consumed; not re-run per check-singleton).
Cinder ran genuinely sole on lane + budget for the back half. Watcher armed pipe-less; heartbeat OFF.
**Next step: the 70-AEE idea-granular back-fill (doc 08 §7) BEFORE Pass-3** → Pass-2 (cross-cutting +
Saffron Spec-1 effectiveness widening) → Pass-3 (synthesis + completeness-critic, loop-until-dry) → dated
outputs + independent no-loss audit. Owner resets the budget window; owner controls push.

---

**Survey RAN (window 2) — n=2 team.** Cosmos calls Infinity (`9888f9`, orchestrator claim
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

**Window 2 wound down (clean) at ~59 plans** — observability (31, incl. the OBS-01 re-fire) +
sdk-and-mcp-enhancements (28), to **Pass-1 228/286 (6 collections)**. Held at the sdk-and-mcp collection
boundary (NOT pushed into the ~63-plan depletion zone) to leave account-budget headroom for Oyster's
live WS-3 and the owner's next reset. **Next safe step: the 10 remaining collections (~58 plans) in
~35-plan sub-batches, one per owner-reset window** — start with `sector-engagement` (12) or fold the
small singletons; then the 70-AEE idea-granular back-fill BEFORE Pass-3. Shared-checkout commit coupling
active: my docs commits run the full turbo gate over Oyster's working tree, so commit during their
`tree-green` windows (interim protocol agreed; structural cure = separate git worktrees, flagged to owner).
**Full next-session runbook: [`08-next-session-execution-plan.md`](./08-next-session-execution-plan.md)**
(linear loop, owner-intervention points, sub-agent critical-assessment exhortations); it cross-links up to
the parent method brief and the controlling plan.

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
| sdk-03 | sdk-and-mcp-enhancements (`future/`, plans 25–28 of 28) | 4 | Cosmos calls Infinity | COMPLETE (3 keep / 1 rewrite; substance 4 good; content 3 strong / 1 adequate; conformance 2 major-drift / 2 no-fm; 43 ideas: 36 good / 7 speculative / 0 bad; 0 locked-contradictions; 4 high-stakes verdicts: 4 survive) | `pass1-sdk-and-mcp-enhancements-03.json` |
| se-01 | sector-engagement (full collection: `current/` + `eef/` + `future/` + `knowledge-graph-adoption/`) | 12 | Cinder holds Warmth | COMPLETE (8 keep / 4 archive-complete; substance 12 good; content 9 strong / 3 adequate; conformance 12 major-drift; 138 ideas: 125 good / 11 speculative / 2 bad; 5 locked-contradictions; 10 high-stakes verdicts: 10 survive; spot-audit passed first-hand on eef-d5-execution + eef-outcome-evaluation-infrastructure) | `pass1-sector-engagement-01.json` |
| final-6 | user-experience (7) + developer-experience (4) + exploring-open-education-resources (2) + security-and-privacy (1) + school-data-search (1) + curriculum-mcp-path-to-ga (1) — the six remaining collections folded | 16 | Cinder holds Warmth | COMPLETE — Pass-1 FINAL increment (15 keep / 1 archive-complete; substance 16 good; content 15 strong / 1 adequate; conformance 14 major-drift / 2 no-frontmatter; 232 ideas: 208 good / 24 speculative / 0 bad; 2 locked-contradictions; 11 high-stakes verdicts: 10 survive / 1 refuted; spot-audit passed first-hand). **High-value adversarial catch:** `devx-strictness-convergence` line 314 claims "`Object.assign` scan now returns **0**" — verifier REFUTED; live `rg "Object\.assign\(" apps packages` = 17 matches / 8 files (orchestrator confirmed first-hand); false-completion claim, both signals conserved. Locked-contradictions: `education-skills-mcp-surface` (todos on a `future/` strategic plan, V0 §2.4) + `plugin-package-creation` (todos in body not frontmatter — V1 placement re-ratification candidate). Per-collection completion: all six collections Pass-1 complete. | `pass1-remaining-six-collections-01.json` |
| delta-AT | agent-tooling delta — the 5 plans authored after Pass-0 froze the worklist (current: agent-experience-improvement, coordination-watcher-canonicalisation; future: agent-frustration-corpus-survey, coordination-home-explicit-targeting-migration, peer-heartbeat-silence-alerting) | 5 | Cinder holds Warmth | COMPLETE — Phase B full Pass-1 over the frozen-estate delta (5 keep; substance 5 good; content 5 strong; conformance 5 major-drift; 58 ideas: 54 good / 3 speculative / 1 bad; 0 locked-contradictions; 3 high-stakes verdicts: 3 survive; spot-audit passed first-hand on peer-heartbeat-silence-alerting + coordination-home-explicit-targeting-migration). Closes the new-plan coverage gap → live estate **291/291** fully Pass-1-surveyed. | `pass1-agent-tooling-delta-01.json` |
| d-01 | discovery (full: `current/` + `future/`) | 9 | Cinder holds Warmth | COMPLETE (9 keep; substance 9 good; content 8 strong / 1 adequate; conformance 9 major-drift; 118 ideas: 101 good / 17 speculative / 0 bad; 0 locked-contradictions; 0 high-stakes verdicts — a young forward-design collection: every plan a well-scoped `future/`-tracking keep with an unfired promotion trigger, none complete/dead, so no high-stakes claims raised; spot-audit passed first-hand on dns-aid-discovery + web-bot-auth, ideas + promotion-trigger logic grounded at cited lines [minor: 2 `status`-field line cites point one field off, substance correct]) | `pass1-discovery-01.json` |
| co-01 | connecting-oak-resources (full: `external-oak-references/` + `knowledge-graph-integration/` active+current+future) | 10 | Cinder holds Warmth | COMPLETE (9 keep / 1 rewrite; substance 10 good; content 9 strong / 1 adequate; conformance 10 major-drift; 145 ideas: 118 good / 23 speculative / 4 bad; 5 locked-contradictions; 12 high-stakes verdicts: 9 survive / 2 refuted / 1 uncertain; spot-audit passed first-hand). **High-value adversarial catch:** `graph-stack.plan.md` holistic claimed "WS4.5 status: completed, landed via PR #114 @77fcf746" — verifier REFUTED via `git show 77fcf746:…/eef-strands/index.ts` = `export {}` placeholder stub only (ls-tree confirms one file); false-completion claim, both signals conserved. **Recurring V1 signal — indefinite-hold cluster (3 plans):** `cross-source-journeys`, `nc-knowledge-taxonomy-surface`, `oak-kg-threads-surface` each carry the open-ended hold status value V0 §3.4 LOCKED forbids (verbatim status values + line cites conserved in the JSON) — each maps to a `gate`(+`expires`) or a `depends_on` blocking edge; owner re-ratification candidates. Plus a `gated-executable` hybrid (promotion_trigger + todos coexist, V0 §2.4) = additive-`kind` candidate; and graph-stack durable `status: active` (V0 §3.2) flagging a practical projected-only-model gap before Linear `projects_to` is live. | `pass1-connecting-oak-resources-01.json` |
| ss-01 | semantic-search (full collection: `current/` + `future/`) | 11 | Cinder holds Warmth | COMPLETE (9 keep / 1 archive-complete / 1 rewrite; substance 11 good; content 10 strong / 1 adequate; conformance 11 major-drift; 145 ideas: 134 good / 11 speculative / 0 bad; 2 locked-contradictions; 9 high-stakes verdicts: 7 survive / 2 refuted; spot-audit passed first-hand — refutation evidence verified). **Pass-2 reconciliation item:** holistic classified `search-contract-followup` as `rewrite` on its self-reported `pending` todos, but the adversarial verifier REFUTED "no task completed" — the work LANDED via the archived `pre-reingest-remediation.execution.plan.md` (COMPLETE 2026-03-23; Task-1 test at `search-field-integrity.integration.test.ts:122-132`, Task-2 doc at `INDEXING.md:158`). Stale-plan-vs-reality drift; likely `archive-complete`. Both signals conserved, not averaged. | `pass1-semantic-search-01.json` |

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
24 survive / 2 refuted / 1 uncertain). **Pass-1 coverage at that point: 200 / 286 plans (5 collections).**

After sdk-03: the full **sdk-and-mcp-enhancements** collection (28 plans) is Pass-1 complete (Cosmos calls
Infinity, 3 increments sdk-01..03, 0 unreadable, 354 ideas inventoried: 303 good / 48 speculative / 3
bad, 2 locked-contradictions, 28 high-stakes verdicts: 26 survive / 2 refuted). **Pass-1 coverage at
that point: 228 / 286 plans (6 collections).**

After se-01: the full **sector-engagement** collection (12 plans) is Pass-1 complete (Cinder holds
Warmth, 1 increment, 0 unreadable, 138 ideas inventoried: 125 good / 11 speculative / 2 bad, 5
locked-contradictions, 10 high-stakes verdicts: 10 survive; orchestrator spot-audit passed first-hand —
eef-d5-execution archive-complete + eef-outcome-evaluation-infrastructure keep both trace to real
file:line). **Pass-1 coverage at that point: 240 / 286 plans (7 collections).**

After ss-01: the full **semantic-search** collection (11 plans) is Pass-1 complete (Cinder holds Warmth,
1 increment, 0 unreadable, 145 ideas inventoried: 134 good / 11 speculative / 0 bad, 2
locked-contradictions, 9 high-stakes verdicts: 7 survive / 2 refuted; spot-audit passed first-hand —
the adversarial gate caught a genuine stale-plan drift in `search-contract-followup`, refutation
evidence verified in the codebase). **Pass-1 coverage at that point: 251 / 286 plans (8 collections).**

After co-01: the full **connecting-oak-resources** collection (10 plans) is Pass-1 complete (Cinder holds
Warmth, 1 increment, 0 unreadable, 145 ideas inventoried: 118 good / 23 speculative / 4 bad, 5
locked-contradictions, 12 high-stakes verdicts: 9 survive / 2 refuted / 1 uncertain; spot-audit passed
first-hand — the adversarial gate caught a false-completion claim in `graph-stack` via `git show`, and a
recurring indefinite-hold V0 §3.4 cluster surfaced for owner re-ratification). **Pass-1 coverage at that
point: 261 / 286 plans (9 collections).**

After d-01: the full **discovery** collection (9 plans) is Pass-1 complete (Cinder holds Warmth, 1
increment, 0 unreadable, 118 ideas inventoried: 101 good / 17 speculative / 0 bad, 0 locked-contradictions,
0 high-stakes verdicts — a forward-design collection of well-scoped `future/`-tracking keeps with unfired
promotion triggers; spot-audit passed first-hand). **Pass-1 coverage at that point: 270 / 286 plans (10
collections).**

After final-6: the six remaining collections (user-experience, developer-experience,
exploring-open-education-resources, security-and-privacy, school-data-search, curriculum-mcp-path-to-ga)
are Pass-1 complete (Cinder holds Warmth, 1 folded increment, 0 unreadable). **▶ PASS-1 COMPLETE —
286 / 286 plans, all 16 collections.**

**Pass-1 grand totals (re-derived first-hand across all 25 conserved `pass1-*.json`):** 286 plans, **0
unreadable across the entire pass** (0 fabricated findings — HALT-don't-fabricate held through 2 account
windows + the window-1 depletion). Classification: 229 keep / 43 archive-complete / 8 rewrite / 4 rehome
/ 2 extract-then-archive. Ideas inventoried: **2,935** (2,560 good / 352 speculative / 23 bad) — *with the
known undercount: AEE batches 1a / 1b-01..03 carry no `salvage_value`, which is exactly what the 70-AEE
idea-granular back-fill (next step) closes.* **65 locked-contradictions** accumulated (owner
re-ratification candidates, surfaced at Pass-3, never suppressed). High-stakes adversarial verdicts: **240
total — 210 survive / 25 refuted / 5 uncertain** (~10% refuted; the Opus adversarial gate caught real
false-completion / stale-plan claims, several confirmed first-hand by the orchestrator — e.g.
`graph-stack` WS4.5 placeholder-not-landed, `search-contract-followup` work-actually-done, and
`devx-strictness-convergence` Object.assign-0-vs-17).

**Next step: the 70-AEE idea-granular back-fill BEFORE Pass-3** (a holistic-only pass over all 70
agentic-engineering-enhancements plans capturing `salvage_value` + `substance_class` + `content_quality`
only — makes the idea-inventory uniform across all 286 for the no-loss audit), then Pass-2 (cross-cutting +
Saffron Spec-1 effectiveness widening) → Pass-3 (synthesis + completeness-critic, loop-until-dry) → the
dated outputs + the independent no-loss audit. See [`08-next-session-execution-plan.md`](./08-next-session-execution-plan.md) §7.

### Remaining Pass-1 collections — NONE. Pass-1 COMPLETE (16/16 collections, 286/286 plans).

All 16 collections are Pass-1 complete (`agentic-engineering-enhancements`,
`architecture-and-infrastructure`, `product-development-governance`, `agent-tooling`, `observability`,
`sdk-and-mcp-enhancements`, `sector-engagement`, `semantic-search`, `connecting-oak-resources`,
`discovery`, `user-experience`, `developer-experience`, `exploring-open-education-resources`,
`security-and-privacy`, `school-data-search`, `curriculum-mcp-path-to-ga`). 25 conserved
`pass1-*.json` hold the full per-plan findings. **Next: the 70-AEE idea-granular back-fill (doc 08 §7),
then Pass-2 → Pass-3 → dated outputs + no-loss audit.**

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
