---
lineage:
  serves_thread: agentic-engineering-enhancements
  serves_stream: continuity-memory-and-knowledge-flow
  strategic_choice: agent-as-thinker capabilities are Practice substance (PDR-035)
  derives_from: .agent/reports/agentic-engineering/large-corpus-analysis-v2-rerun-result-2026-06-30.md
todos:
  - id: author-grain-and-longitudinal-prompts
    content: "PROMPT-ONLY (cheap) edit of map-reduce-validate-meta.workflow.mjs. MAP: each leaf names its ACTUATOR (file/command/lifecycle-moment/template/tuple) and anchors shift/trajectory signals to their time-point. REDUCE: delete the 'Aim for 15-25 candidates' cap and the 'single-window signal is usually NOT a candidate' clause; cluster BY MECHANISM not theme (distinct actuators stay separable); actively surface trajectory/regime/relational-lagged candidates. VOTE: add a kind-conditional longitudinal falsifier (mirror the isAbsenceClaim conditional) — for kind in {trajectory,regime,relational-lagged,distributional}, grounded/notArtefact require the grounding to separate into early/late corpus sets that DIFFER in the claimed direction; uniform-across-windows = artefact, fail. Fires at every tier (stronger + safer than a Tier-2 lens-swap, which would touch the routing mirror; lens-swap is the fallback only if the probe shows longitudinal grounding still weak). Re-run workflow-routing-mirror.conformance.test.ts (39 cases). NO change to aggregation-recall/adjudication/verdict."
    status: done
  - id: harden-run-orchestration
    content: "TDD code work on the workflow templates + cost call (NOT the frozen aggregation math). (a) validate-meta.workflow.template.mjs: accept an already-resolved candidate-id set and filter CANDIDATES_SEED before runCapped, so a re-seed re-runs only the unresolved tail (candidate-granular resume); add per-voter jitter to flatten burst rate; extend the completeness guard to assert validated.length === candidates.length AND no retry-cap/held-for-review before meta. (b) Wire the post-reduce validateStagePlan re-gate to HARD-ABORT on !withinCeiling (currently only logs). (c) Calibration fix: tokensPerVoter ~= 50k at the validateStagePlan/estimatePipelineCost call sites (the v2 5x-low estimate) without double-applying the high multiplier. Test-first for each. DONE 974c8fa04; PLUS probe-iteration-1 (91ee28474): split the combined map+reduce template into map.workflow (commit leaves) + reduce.workflow (resume from leaves) so a reduce failure does not lose the map spend; bound reduce output (<=10 representative supportingLeafIds) + disambiguate candidate-kind from leaf-category."
    status: done
  - id: cheap-grain-probe
    content: "Run the cheap probe (~1.2M; map+reduce only over the re-derived w08/w10/w11). PRECONDITION: derive the baseline -> source-napkin -> window provenance trace and re-confirm each of the 5 failing baselines' sources falls in the probe windows against the freshly re-derived partition. Execution action (bounded; execution-authorised session). DONE 2026-06-30 — first attempt (combined template) stalled in reduce (truncation + kind-confusion); salvaged 167 leaves; re-ran reduce-only over the hardened reduce prompt. Evidence: data/probe-w08-w10-w11-{leaves,candidates}-2026-06-30.json."
    status: done
    depends_on: [author-grain-and-longitudinal-prompts]
  - id: probe-gate
    content: "Tests SURFACING only (survival is re-checked at the full run; a probe PASS is never a graduation pre-confirmation). PASS = the 5 failing baselines appear as distinct actuator-naming candidates AND >=1 longitudinal candidate surfaces with a real early/late split AND the broad C01-C03 cluster stays coherent (each retains a candidate; total count within a stated band). FAIL -> iterate author-grain-and-longitudinal-prompts; loop-exit at 3 iterations -> escalate to owner with the probe evidence. PASS 2026-06-30 (1 iteration): all 5 failing baselines as distinct actuator candidates (cron-template MISS -> C65; repo-wide-autofix -> C01/C02/C07/C31; coordinator-amplifies -> C54/C55/C16; compaction -> C57/C13; peer-primary -> C75/C01/C41); >=4 longitudinal with real cross-window splits (C02/C19/C20/C22); broad clusters coherent. PASS surfaces the grain fix, NOT a graduation pre-confirmation."
    status: done
    depends_on: [cheap-grain-probe]
  - id: launch-preflight-and-cost-reconciliation
    content: "Fill the SPLIT templates' placeholders — they carry NO default (the 16M literal lived ONLY in the now-retired combined map-reduce-validate-meta.workflow.mjs; do not look for a default to 'raise'). PARTITION: the corpus file-set is byte-identical to the frozen PARTITION_WINDOWS (verified 2026-06-30), so the 15-window partition inlined in map-reduce-validate-meta.workflow.mjs is still valid to reuse as map.workflow's __PARTITION__; re-derive (token-balanced greedy-walk) ONLY if the corpus grew — method in large-corpus-analysis-v2-rerun-runbook-2026-06-29.md. CEILING: project candidate count from the PROBE calibration, NOT v2's 50 — 75 candidates / 3 dense windows ⇒ ~80-120 for 15. Set __VALIDATE_TOKEN_CEILING__ = worst-case x headroom, worst-case = candidateCount x MAX_VOTERS_PER_CANDIDATE(=5, cost-and-coverage.ts) x ~50k (OBSERVED_VALIDATE_TOKENS_PER_VOTER, run-orchestration.ts) ⇒ ~25-30M for ~120 (NOT the pre-probe ~16-18M, which would falsely hard-abort) and/or moderate count. Confirm the routing-mirror conformance test (39) is green, the post-reduce re-gate hard-aborts, and re-diff the .mjs ORCH_MIRROR / MAP_PROMPT / REDUCE_PROMPT blocks (no machine pin yet). DONE 2026-07-01 (Flare hunts Obsidian): instantiated `map.workflow.run-2026-07-01.mjs` (partition filled, node --check clean); ceiling 30M (120 x 5 x 50k — admits <=120, hard-aborts 121+); a 4th unpinned block surfaced — metaPrompt had drifted (ASCII 'in' vs source ∈), reconciled to source + added to the README re-diff list. Adversarial launch-readiness verification (7 dims, finder+skeptic, resumed after a quota trip) = GO_WITH_CONDITIONS (6/7 PASS; resume-completeness CONCERN; 0 blockers). Corpus byte-identical to 194fdc704. Launch sequence + gating conditions live in the tooling README launch-card. PRE-META HARD GATE carried forward: port assessValidateCompleteness + a merged-set count/dup/missing-id assertion into meta.workflow.template.mjs before the meta stage is instantiated."
    status: done
    depends_on: [probe-gate, harden-run-orchestration]
  - id: full-discovery-run
    content: "OWNER-AUTHORISED ACTION (one-way; likely >13M given the ~80-120-candidate projection). Four checkpointed stages on the REBUILT TypeScript tooling, each seeded from committed checkpoints by `pnpm build-run-artefact` (zod-validated; typed-envelope results committed back to the tooling data/ dir): (a) map (throttled MAP_CONCURRENCY=4 + jitter; result carries mapComplete — a partial map cannot seed reduce) -> commit map-result; (b) reduce from the map-result -> commit reduce-result (a reduce failure re-runs from the SAME checkpoint, no map re-spend); (c) validate --ceiling 30000000 (hard-abort is a typed pre-dispatch refusal; candidate-granular resume derives resolved ids from prior committed validate-results) -> commit validate-result(s); (d) meta over the merged dispositions (the merged-set completeness gate is structural in the builder) -> commit meta-result. Runbook: the tooling README."
    status: pending
    depends_on: [launch-preflight-and-cost-reconciliation]
  - id: post-run-driver
    content: "Deterministic post-run driver (reconstructed from the module; FROZEN math, calls only). Strict re-parse (parseVoterOutcome/parseCandidate/parseMetaOutput) -> findRecallIntegrityViolations (must be empty) -> recallReport -> meetsGraduateGate({minStrictWithinRemit:0.6,minLooseWithinRemit:0.85}) -> checkMapCoverage -> ADDITIVE temporal-coverage check (each longitudinal candidate's supportingWindows actually span the breadth it claims) -> corroborateAgainstHomes -> independently recompute every disposition by replaying adjudicate."
    status: pending
    depends_on: [full-discovery-run]
  - id: discovery-artefacts
    content: "Substance report (napkin-discovery-pass-1-2026-06-29.md shape) WITH novelty stratification — separate the novel-and-uncorroborated kept candidates (the actual discovery yield) from those re-confirming existing homes. Plus a curator-pass run-record (2026-06-29-wren-napkin-discovery-pass.md metadata shape)."
    status: pending
    depends_on: [post-run-driver]
  - id: build-conservation-buffer
    content: "The named hand-off step: one entry per kept/rerouted candidate carrying its grounding, its corroborateAgainstHomes result (does a durable home exist?), and a routing hint (new home vs enrich existing). Makes the conservation hand-off a step, not a hope."
    status: pending
    depends_on: [post-run-driver]
  - id: conserve-and-graduate-or-decide
    content: "Feed the buffer to consolidate-until-done — THAT conservation is the run's success. Read the Choice-B verdict as confidence-in-the-instrument: PASS -> graduate the method as a corpus-parameterised capability (PDR-120 runbook + PDR-035 adopting PDR; the capability travels to the comms-events corpus next, possibly planning). A recall MISS does NOT auto-trigger a re-run — assess whether the tuning gap cost real discovery; re-tune-and-rerun only if it did, else graduate with the gap named. No holding state."
    status: pending
    depends_on: [discovery-artefacts, build-conservation-buffer]
---

# Napkin corpus discovery run

> **STATUS: tooling REBUILT as standard TypeScript (2026-07-01/02, Perseus wakes Oblivion) on the
> owner's direction; `full-discovery-run` is the next (owner-authorised) action.** The hand-authored
> `.mjs` templates, mirrors, and launch-time splicing are deleted: the four stages compile from
> `agent-tools/src/corpus-analysis/workflows/` and are seeded from committed checkpoint JSONs by
> `pnpm build-run-artefact` (zod-validated at the boundary; the partial-map refusal, the resume-id
> derivation, and the pre-meta merged-set gate are now structural code, not operator discipline).
> The old preflight's GO_WITH_CONDITIONS evidence carries over: corpus pin `194fdc704`, ceiling
> 30,000,000 (`--ceiling`, no default anywhere), probe PASS (all 5 v2-failing baselines as distinct
> actuator candidates; ≥4 longitudinal with real splits) — a PASS SURFACES the grain fix, it is NOT
> a graduation pre-confirmation. Migration equivalence was proven before deletion: prompts
> byte-identical to the ran-and-proven text, schemas identical modulo two named strengthenings,
> baselines corrected for two lossy apostrophes. Runbook: the tooling README. **Supersedes**
> [`large-corpus-analysis-v3-extraction-grain.plan.md`](./large-corpus-analysis-v3-extraction-grain.plan.md).
> **WS `full-discovery-run` is the one one-way, separately owner-authorised action**, not gated on plan readiness.

## Context

The napkins are the real, only napkin corpus. The job now is to **do the discovery** — surface the
genuine new understanding the corpus holds (recurring *mechanisms* and *longitudinal* cross-napkin
patterns) and conserve it into durable homes. Recall against the 18 hand-pinned golden baselines
([`recall-baseline-fixture.ts`](../../../../agent-tools/src/corpus-analysis/recall-baseline-fixture.ts))
is the **tuning instrument** — it confirms the pipeline is sensitive enough to trust its novel
findings — never the milestone. The v2 rerun (2026-06-30) proved the machinery but landed REFINE on
fidelity (strict within-remit recall 5/10); the residual gap is extraction **altitude**, fixable at
the prompt layer. The design report and the thread record already framed discovery as primary and
recall as calibration — the plan layer had drifted; this plan restores that framing and executes it.

## End goal

The full napkin corpus's understanding, discovered and conserved: every kept/rerouted candidate —
recurring mechanisms **and** grounded longitudinal patterns — homed via `consolidate-until-done`. A
substance report + curator-pass run-record capture the discovery; the Choice-B recall verdict (strict
≥ 0.6 AND lenient ≥ 0.85) confirms the instrument was trustworthy. **Conservation of the findings is
the success criterion; recall is the credibility check on it.**

## Mechanism

The v2 reduce prompt rewarded consolidation (a hard count cap + a single-window-discard clause) and
the map prompt extracted themes not actuators, so distinct mechanisms dissolved into broad parents
and longitudinal arcs were suppressed (or, when present, indistinguishable from the speculative
"it-all-deepened-over-time" apophenia v1 rightly killed). Re-extracting with actuator-preserving,
mechanism-clustering, longitudinally-eliciting prompts — and a falsifiable longitudinal grounding
test — surfaces the genuine new understanding at the right grain. A cheap probe resolves the key
warrant (grain preserved without shattering breadth; longitudinal claims falsifiable) before the
one-way full-run spend; first-class checkpointing lets the ~13M run complete across a session quota.

## The change boundary (what moves, what is frozen)

- **FROZEN** — recall-counting (`aggregation-recall.ts`) and the quorum-floor adjudication math
  (`aggregation-adjudication.ts`, `aggregation-verdict.ts`). Recompute-validated and settled (PDR-122).
- **PROMPT-ONLY** — the map/reduce/vote prompts (now the single TS home
  `agent-tools/src/corpus-analysis/workflows/prompts.ts`; mechanism grain + longitudinal
  elicitation + the longitudinal falsifier). Per PDR-122 §Non-goals, lenses/prompts are per-pipeline config.
- **ORCHESTRATION** — checkpoint commit-points, candidate-granular resume, concurrency cap + jitter,
  completeness guard, hard-abort wiring of the post-reduce re-gate (stage composition code, not the math).
- **CALIBRATION** — `tokensPerVoter ≈ 50k` at the cost call sites (the v2 5×-low estimate).
- **ADDITIVE** — a deterministic temporal-coverage check + novelty stratification in the post-run
  driver (new checks alongside `checkMapCoverage`; they do not alter recall/adjudication).

## Means

The ten todos above, in dependency order: the prompt refinement and the orchestration hardening run
first (independent of each other); the cheap probe gates the spend; the launch pre-flight reconciles
cost and re-derives the partition; the full run executes (owner-authorised, checkpointed); the
deterministic driver + discovery artefacts + conservation buffer turn the run into homed understanding;
graduate-or-decide reads recall as confidence-in-the-instrument.

## Acceptance criteria

- **Refining (prompt-only) — boundary held.** `git diff --stat` for `author-grain-and-longitudinal-prompts`
  shows **no change** under `aggregation-recall.ts` / `aggregation-adjudication.ts` / `aggregation-verdict.ts`;
  the corpus-analysis unit tests and the in-build harness output contract are green (`pnpm --filter
  @oaknational/agent-tools build`).
- **Orchestration hardened, test-first.** Candidate-granular resume, the completeness assertion, the
  hard-abort re-gate, and the cost calibration each land with a paired unit test (red→green); `pnpm
  agent-tools:test` green.
- **Probe gate met.** The 5 failing baselines + ≥1 grounded longitudinal candidate appear as distinct
  candidates; the broad C01–C03 cluster stays coherent (deterministic floor, not a subjective judgment).
- **Full run completes and is trustworthy.** Survives any quota trip via candidate-granular resume;
  the driver reports `findRecallIntegrityViolations` empty, the recall report, the Choice-B verdict,
  clean coverage + temporal-coverage, and a recompute-vs-recorded disposition diff of **zero**.
- **Discovery delivered and conserved (the end).** Substance report with the novel-uncorroborated set
  named; conservation buffer built; `consolidate-until-done` homes every entry; the distilled buffer
  ends empty or owner-decision-gated.

## Proof contract

| Acceptance id | Proof level | Command / observation |
| --- | --- | --- |
| prompts-only boundary | non-code | `git diff --stat` excludes the three aggregation files; agent-tools tests + in-build output contract green |
| orchestration TDD | unit | paired red→green tests for resume-skip / completeness / hard-abort / calibration; `pnpm agent-tools:test` |
| probe gate | value-proxy | inspection of reduce candidates vs the 5 baselines + a longitudinal split + broad-cluster floor |
| full run trustworthy | integration | driver report: integrity empty, recall, Choice B, coverage, recompute diff = 0 |
| discovery conserved | non-code | substance report + curator-pass record; conservation buffer; `consolidate-until-done` run-record; `distilled.md` empty/gated |

## Prerequisites

- **Blocking** — an execution-authorised session for `cheap-grain-probe` (bounded ~1.2M), and a
  **separately** owner-authorised session for `full-discovery-run` (the one-way ~13M). A corpus run is
  an action, not a read; execution authority is confirmed independently of agreeing *what* to run.
- **Launch pre-flight invariant** (not a plan-readiness blocker) — `pnpm --filter
  @oaknational/agent-tools build` green before each launch: it bundles the REAL `adjudicate` into
  every stage artefact and machine-enforces the harness output contract (the routing-mirror
  conformance test is retired with the mirror it pinned; the corpus-analysis unit tests carry the
  routing branches). PDR-122 invariant 3 holds by construction — judgments cross the boundary
  through the zod stage contracts.
- **Superseded** — the conservation plan's WS-C mirror-validator: the rebuild deleted the mirrors
  and prompt copies it would have pinned; the tooling-promotion half of WS-C landed as
  `agent-tools/src/corpus-analysis/workflows/` itself.

## Non-goals

- Touching the recall-counting or quorum-floor adjudication math (FROZEN).
- Changing the Choice-B threshold (owner-confirmed) or treating recall as the milestone (it is tuning).
- Tier reduction to cut cost — forbidden (PDR-122 invariant 4; every tier runs). The only cost levers
  are concurrency/checkpointing and not-re-spending-resolved candidates.
- Trimming grounding passed to voters — rejected for the discovery run (grounding fidelity is what the
  novel mechanism-grained + longitudinal candidates need to survive the adversary). Corollary
  (2026-07-01, now structural): voter grounding is assembled from the map result's leaves via the
  `groundingLeaves` projection, which `validateRunDataSchema` REQUIRES — a validate artefact cannot
  be seeded without it, so the grounding-strip run-collapse a fresh-reader trawl once caught is no
  longer expressible.
- **Writing to `napkin.md` before the run** — it is w15 of the pinned corpus, so any write breaks the
  `194fdc704` byte-pin. Capture session learnings to `distilled.md` / the thread record / memory instead;
  rotate the napkin only AFTER the run.
- The memory event-graph (PDR-119 / ADR-200) — Lens-4 verdict remains defer.

## Risks

| Risk | Mitigation |
| --- | --- |
| Removing the count cap over-fragments, collapsing broad recall | Probe broad-leg floor (pre-spend) + post-reduce hard-abort on runaway count + the graduate-or-decide regression guard (backstop) |
| ~13M run trips the session quota mid-validate (as v2 did) | First-class checkpoints: commit leaves/candidates after map+reduce; candidate-granular resume re-spends only the unresolved tail (~1M, not ~8.6M) |
| Longitudinal findings are apophenia (v1 killed 9 speculative arcs) | The kind-conditional vote falsifier makes the early/late split falsifiable against window-ordered grounding; the additive temporal-coverage driver check catches narrow-window "regime" claims |
| Cost gate falsely aborts the legitimate run, or under-estimates and overspends | Ceiling **set to 30M at launch-preflight** (120 × 5 × 50k — admits ≤120, hard-aborts 121+; the pre-probe ~16-18M is SUPERSEDED — the probe's 75 candidates / 3 dense windows implies ~80-120 for 15 windows); `tokensPerVoter` corrected to ~50k; the post-reduce re-gate recomputes on the real candidate count and hard-aborts |
| Conservation hand-off is a hope not a step | `build-conservation-buffer` makes it an explicit artefact; novelty stratification focuses scrutiny on the genuinely-new yield |

## Foundation alignment

- [`principles.md`](../../../directives/principles.md) — generated state beats authored state (the
  deterministic aggregation is the spine); architectural excellence over expediency (no tier reduction).
- [`tdd-as-design.md`](../../../directives/tdd-as-design.md) / [`testing-strategy.md`](../../../directives/testing-strategy.md)
  — the orchestration + calibration code changes land test-first, atomically; the frozen aggregation
  tests stay green. The prompt changes are validated empirically by the probe (a value-proxy), not a
  unit test, and the run is an execution — both stated as such, not dressed as TDD.
- [`schema-first-execution.md`](../../../directives/schema-first-execution.md) — judgments cross the
  LLM→code boundary as schema-validated typed values, strict-parsed (PDR-122 invariant 3).
- [PDR-122](../../../practice-core/decision-records/PDR-122-agentic-judgment-pipelines.md) — all four
  invariants; this plan is one feeder into the conservation machinery, never a bespoke graduation.

## Plan-body first-principles check

Per [`plan-body-first-principles-check`](../../../rules/plan-body-first-principles-check.md): the
**shape clause** fires at `author-grain-and-longitudinal-prompts` and `harden-run-orchestration` — if a
fix appears to need `aggregation-recall.ts`/`aggregation-adjudication.ts`/`aggregation-verdict.ts`,
the diagnosis is wrong; stop and re-ground (the math is FROZEN). The **landing-path clause** fires at
`full-discovery-run` — an owner-authorised action gated on a passing probe, never run to "confirm" a
plan. The **vendor-literal clause** fires on the harness Workflow footguns (args-as-JSON-string;
`.output` wraps `.result`; `node --check` false-positives top-level `return`; ~50k tokens/voter at
high effort; effort set explicitly per stage) — verified first-hand and conserved in the tooling
README; re-confirm against the live harness at launch.

## Readiness reviewers

Already run for this plan's design: `Explore` (run-launch mechanics + corpus state) and a `Plan` agent
(execution-robustness stress-test) — both assessed first-hand, their findings integrated, one override
recorded (new plan supersedes v3, not amend-in-place; owner directed a new plan). Before any code lands:
`test-expert` on the orchestration/calibration TDD cycles; `assumptions-expert` is not re-required (the
proportionality was reviewed on the predecessor v3 plan and carried forward).

## Learning loop

`conserve-and-graduate-or-decide` IS a learning-loop execution: the kept/rerouted candidates flow into
`consolidate-until-done` (PDR-014 capture→distil→graduate→enforce), and a PASS graduates the runbook +
adopting PDR. The promoted `oak-corpus-analysis` skill (conservation plan WS-C) makes this run a
repeatable FEEDER whose future runs (incremental on napkin growth; the comms-events corpus next) flow
back into the same machinery.

## Lifecycle triggers

Per [`lifecycle-triggers`](../../templates/components/lifecycle-triggers.md): session-open grounding
reads this plan + the v2 rerun result report + PDR-122; the full run emits a curator-pass run-record;
completion runs the learning loop above and sweeps the discoverability surfaces (this README row, the
thread record, the reference hub).

## Lineage

Serves the `agentic-engineering-enhancements` thread, continuity/memory/knowledge-flow stream. Chain:
[`large-corpus-analysis-runbook-build-and-prove.plan.md`](./large-corpus-analysis-runbook-build-and-prove.plan.md)
(gen 1, chain origin) → [`large-corpus-analysis-v2-implementation.plan.md`](./large-corpus-analysis-v2-implementation.plan.md)
(gen 2, DONE) → [`large-corpus-analysis-v3-extraction-grain.plan.md`](./large-corpus-analysis-v3-extraction-grain.plan.md)
(gen 3, SUPERSEDED by this) → this plan. Derives from the v2 rerun result report and PDR-122. Conserved
tooling + corrected findings: [`.agent/reports/agentic-engineering/large-corpus-analysis-tooling/`](../../../reports/agentic-engineering/large-corpus-analysis-tooling/).
Sibling: [`corpus-analysis-conservation.plan.md`](./corpus-analysis-conservation.plan.md) (the firing
rule + tooling promotion + graduating the v2 buffer; this run's findings flow into the same
`consolidate-until-done` machinery). The capability is corpus-parameterised — comms events are the next
named consumer, the planning corpus a possible one. Discovery lands in the surfaces seeded by
[`agentic-corpus-discoverability-and-deep-dive-hub.plan.md`](./agentic-corpus-discoverability-and-deep-dive-hub.plan.md).
