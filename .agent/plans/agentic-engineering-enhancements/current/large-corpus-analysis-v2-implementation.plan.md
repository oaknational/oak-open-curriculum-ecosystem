---
lineage:
  serves_thread: agentic-engineering-enhancements
  serves_stream: continuity-memory-and-knowledge-flow
  strategic_choice: agent-as-thinker capabilities are Practice substance (PDR-035)
  derives_from: .agent/reports/agentic-engineering/large-corpus-analysis-runbook-v2-design-2026-06-29.md
todos:
  - id: contract-schemas-in-agent-tools
    content: "FIRST (closes the cold-reader's load-bearing gap). Author the atomic-judgment schemas — LEAF / VERDICT (each of the four tests emits {pass, confidence}) / BASELINE / META — as proper TypeScript + zod in the agent-tools workspace, under all repo gates. This is the single contract the aggregation module and the Workflow orchestrator both bind to (the sandbox cannot import repo code, so the schema is mirrored into the script and conformance-tested). Nothing downstream can be TDD'd before this schema is pinned."
    status: pending
  - id: deterministic-aggregation-module
    content: "Build the deterministic aggregation as gated TypeScript IN THE agent-tools WORKSPACE (never inline in the workflow script — owner task 3). Pure functions over the atomic judgments: recall (strict/lenient, stratified within the emergent subset), the keep/kill/reroute verdict predicate, the Tier-0/1/2 quorum + borderline-detection (borderline = any kept-candidate test passing at low/med confidence), grounding/window counts, the cost estimate. Query-shaped names (countReFoundEdges, distinctGroundingWindows) for a future graph swap. TDD — the recall-counter unit test (feed 10 re-found verdicts, assert strict=5) is the fix for the v1 bug."
    status: pending
    depends_on: [contract-schemas-in-agent-tools]
  - id: typed-baseline-fixture
    content: "Author the version-controlled typed recall fixture (18 baselines — the original ~16 was a floor — each {id, statement, kind, population:emergent|single-window, sourceCitations}), population hand-pinned as reviewed data. Lives in the agent-tools workspace beside the aggregation module so the module imports + tests against it. The within-remit recall denominator = the emergent subset."
    status: pending
    depends_on: [contract-schemas-in-agent-tools]
  - id: adversary-tier-ensemble
    content: "Build the full Tier 0+1+2 adversary (owner-chosen) — kill-final-on-one; single blind confirmer on clean keeps; 3-lens diverse ensemble on borderline keeps. Each of the four tests emits {pass, confidence}; borderline (the Tier-2 trigger) = any kept-candidate test at low/med confidence — computed deterministically in the aggregation module's quorum. Schema-robustness + repair-retry on the validator (the C06 cause); one 'unresolved → human-review' terminal state with a reason field (retry-cap | quorum-tie)."
    status: pending
    depends_on: [contract-schemas-in-agent-tools, deterministic-aggregation-module]
  - id: real-world-signal-close
    content: Deterministic check that each kept pattern maps to an on-disk graduated home (pattern/rule file) where one exists — first-class corroboration input (Agentic Quality real-world-signal close).
    status: pending
    depends_on: [deterministic-aggregation-module]
  - id: cost-estimate-gate-and-coverage
    content: Pre-spend deterministic cost estimate over the whole pipeline (effort tiered as data, never inherited) with an abort gate; map-coverage check (no window silently under-extracts); absence-probe validation shape.
    status: pending
  - id: human-review-run-record
    content: Run-record (curator-passes shape) presenting kept / unadjudicated / held-for-review / out-of-remit / discounted candidates + stratified recall — the human-review assurance leg.
    status: pending
    depends_on: [deterministic-aggregation-module]
  - id: rerun-and-assess
    content: "Re-run Discovery on the napkin corpus with v2 — runs FRESH (the Workflow journal is session-scoped, so no cross-session cache; fresh is cheap at the corrected effort tiering, ~1.3M not ~4.4M). Set the within-remit threshold at calibration with rationale (default 0.85, re-evaluated for the smaller emergent-subset denominator; owner-confirmable). Assess strict ∩ emergent recall against it; confirm the recall counter, the consistency tripwires, and the real-world-signal close all pass."
    status: pending
    depends_on: [deterministic-aggregation-module, typed-baseline-fixture, adversary-tier-ensemble, real-world-signal-close, cost-estimate-gate-and-coverage, human-review-run-record]
  - id: graduate-or-decide
    content: On a passing within-remit recall + clean apophenia gate, graduate the method to a reference runbook (PDR-120 runbook index) + author the adopting PDR (PDR-035). On defect, name and route. No holding state.
    status: pending
    depends_on: [rerun-and-assess]
---

# Large-corpus analysis v2 — implementation

> **STATUS: DONE / SUPERSEDED (2026-06-30).** v2 ran end to end — verdict **REFINE**. Every todo below
> is complete (the aggregation module, typed fixture, cost gate, and tiered adversary all landed). **The
> `adversary-tier-ensemble` todo's "kill-final-on-one" design was OVERTURNED** — a kill now requires the
> diverse-lens quorum (conserve by default), homed in
> [PDR-122](../../../practice-core/decision-records/PDR-122-agentic-judgment-pipelines.md). Outcome and
> next steps (v3 extraction-grain) live in
> [`reports/agentic-engineering/large-corpus-analysis-v2-rerun-result-2026-06-30.md`](../../../reports/agentic-engineering/large-corpus-analysis-v2-rerun-result-2026-06-30.md)
> and the `agentic-engineering-enhancements` thread record §NEXT-SESSION PICKUP. Retained as executed history.

Build the proving-run-driven v2 of the large-corpus-analysis method, then re-prove it.
The design is authoritative in the v2 design report
([`../../../reports/agentic-engineering/large-corpus-analysis-runbook-v2-design-2026-06-29.md`](../../../reports/agentic-engineering/large-corpus-analysis-runbook-v2-design-2026-06-29.md));
this plan sequences the build. It does not restate the design.

## End goal

A trustworthy large-corpus-analysis capability whose every load-bearing number is
deterministically computed and unit-tested, whose keep-confirmation is ensemble-defended
where the irreversible error (a false keep) lives, whose recall is measured within
Discovery's remit against a version-controlled typed baseline, and which closes against
a real-world signal — proven on the napkin corpus and homed as a reference runbook with
an adopting PDR. If the rerun reveals defects, they are named and routed. No holding
state.

## Mechanism

The v1 proving run's load-bearing meta-result is that the method let an LLM aggregate
(recall) what deterministic code should compute — and it got it wrong. v2's spine is the
separation: **the workflow does LLM judgment (atomic per-item); a tested repo module does
deterministic aggregation.** Re-running with that separation, a typed within-remit
recall, and the owner-chosen full ensemble tests the warrant ("critiqued compression
preserves the insight that matters") on numbers we can trust.

## Means (key architecture decision)

The harness Workflow sandbox cannot import repo modules. Therefore the schemas, the
deterministic aggregation, and the cost-model live in the **`agent-tools` workspace as
proper TypeScript under all repo gates** (ESLint / type-check / vitest-TDD / Result /
schema-first — owner task 3), NOT inline in the workflow script; the workflow is the LLM
layer (orchestration + atomic judgment), the agent-tools module is the deterministic
layer, and the schema is the shared contract (mirrored into the script and
conformance-tested). This satisfies TDD ("the unit test is the fix") and is the cleanest
expression of the v2 principle. Query-shaped function names make a future PDR-119 graph
swap additive.

Sequence: **pin the contract schemas in agent-tools FIRST** → build + test the
aggregation module against them → pin the typed fixture → build the tiered adversary +
quorum (consuming the module) → the real-world-signal + cost-gate + coverage adds → the
human-review run-record → rerun fresh → graduate-or-decide.

## Acceptance criteria

- The recall counter, verdict predicate, and quorum are pure functions with unit tests;
  the v1 recall bug (LLM-claimed 0.72 vs data's 0.28/0.56) is provably impossible because
  the LLM no longer emits the aggregate.
- Within-remit recall (strict, emergent subset) is computed deterministically and meets
  the threshold set at calibration; out-of-remit single-window misses are reported
  separately, not as Discovery misses.
- Every kept pattern carries its four-test verdict and is checked against an on-disk
  graduated home where one exists.
- No candidate is stranded unadjudicated (schema robustness + the Tier-1 confirmer's
  graceful quorum degradation).
- A pre-spend cost estimate gates the run; the rerun does not overspend or trip a limit.
- A human-review run-record presents the full disposition; the graduate-or-decide
  outcome is recorded with evidence.

## Prerequisites

- A writeable, execution-authorised session for the rerun (~1.3M tokens at the corrected
  effort tiering — much less than v1's xhigh-everywhere ~4.4M).
- No cross-session cache: the Workflow journal is session-scoped, so the v2 rerun runs
  fresh (cheap at the corrected effort tiering). The v1 run-id cache-reuse idea is
  dropped.

## Non-goals

- The memory event-graph (PDR-119/ADR-200) — Lens 4 verdict is defer; only the
  query-shaped names are in scope now.
- The 3-lens ensemble is owner-chosen IN; Tiers 0+1 is the pre-identified fallback if
  cost pressure ever bites (not a v2 scope cut).

## Risks

| Risk | Mitigation |
| --- | --- |
| Aggregation module drifts from the workflow's atomic-field shape | Schema is the contract; the module's input type is the workflow's output schema; referential-integrity tripwires |
| The typed-baseline population pin biases recall | Pin once as reviewed data before the rerun, version-controlled and frozen; populations are author-reviewed, not auto-derived |
| Full ensemble cost | Effort tiered as data; pre-spend estimate gates; Tiers 0+1 fallback documented |

## Lineage

Serves the `agentic-engineering-enhancements` thread, continuity/memory/knowledge-flow
stream. Derives from the v2 design report. Successor to
[`large-corpus-analysis-runbook-build-and-prove.plan.md`](./large-corpus-analysis-runbook-build-and-prove.plan.md)
(whose `refine-method` todo this plan discharges in design; `run-discovery` becomes the
v2 rerun here; `graduate-or-decide` stays gated on a passing v2). The deterministic-
aggregation principle is a PDR candidate (`pending-graduations.md`).
