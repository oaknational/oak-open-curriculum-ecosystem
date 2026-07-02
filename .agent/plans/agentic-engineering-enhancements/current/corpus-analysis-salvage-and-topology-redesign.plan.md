---
name: "Corpus-Analysis Salvage and Topology Redesign"
plan_id: corpus-analysis-salvage-and-topology-redesign
collection: agentic-engineering-enhancements
lane: current
status: "DRAFT — ws1 (salvage) is executable now; ws2+ (topology redesign) requires a fresh-session readiness review before build. Authored 2026-07-02 by Perseus wakes Oblivion at high context, post-run."
created: 2026-07-02
owner_thread: agentic-engineering-enhancements
overview: >-
  Two coupled deliverables from the 2026-07-02 discovery run: (1) SALVAGE —
  extract the discovery value already paid for from the committed checkpoints
  without re-running anything; (2) REDESIGN — replace the naive
  all-then-calibrate pipeline topology with a cellular, progressively-powered,
  canary-gated design that detects judgment-regime failures inside the first
  ~5% of spend and aborts deterministically.
todos:
  - id: ws1-salvage
    content: "WS1 (executable now): stratified salvage report from committed checkpoints — no new validate spend. Tiers: A = Sonnet-keeps that are corroborated or Opus-quorum-keeps (highest confidence); B = remaining Sonnet keeps (survived the harshest filter); C = Opus-quorum-keep / Sonnet-kill disagreements (18 named candidates); D = killed candidates named in meta recall notes as baseline-matching (proven-real, false kills); E = remaining kills ranked by triage-style evidence (window span, grounding count) for the owner's manual round. Deterministic code over existing JSONs + the banked verdict corpora; fix the post-run driver corroboration cwd bug (existsSync resolved against agent-tools/ — resolve claimed paths against the repo root, TDD) so tier A is computable. Output: discovery report with novelty stratification + the full tier table, conserved per the run plan."
    status: pending
  - id: ws2-readiness-review
    content: "WS2 GATE: fresh-session readiness review of the topology redesign (D1-D6 below are PROPOSED, authored post-peak). Dispatch assumptions-expert + architecture expert; ratify or revise; the burn-analysis report is the evidence base."
    status: pending
  - id: ws3-instrumentation
    content: "WS3: pre-run declaration + burn accounting as first-class tooling. build-run-artefact prints the agent-count bounds (map W; validate min 2C / max 4C; meta 1) and the token/dollar estimate from the measured unit-cost table before seeding; a post-run agent-tools command sums transcript usage per run/agent-type (the ad-hoc script from burn-analysis-2026-07-02.md made permanent). Estimates in raw tokens, meter points (~1M/pt), and API dollars."
    status: pending
    depends_on: [ws2-readiness-review]
  - id: ws4-canary-gate
    content: "WS4: canary-based early abort. Seed the recall baselines' matching candidates (known-real) FIRST in the validate stream, interleaved in the first batch; deterministic circuit breaker: if more than K of the first M canaries are killed, hard-abort the stage with a typed failure before the remaining candidates dispatch. Kill-rate running gate as a second breaker (e.g. batch kill-rate > threshold vs the pilot's calibrated rate). PDR-122-aligned: code computes the gate, agents never see the canary marking."
    status: pending
    depends_on: [ws2-readiness-review]
  - id: ws5-cellular-topology
    content: "WS5: cellular extraction + progressive-power validation per D2/D3 — overlapping windows at extraction (shot-noise reduction), cheap wide pass ranking candidate signals, powerful models re-reading only the top-N / contested cells, batch-sequential validate (batches of ~25 with gate checks between batches) instead of all-at-once fan-out. Pilot-first sizing: every full run is preceded by a 1/10th pilot whose calibration must pass before the remainder is authorised."
    status: pending
    depends_on: [ws2-readiness-review, ws4-canary-gate]
isProject: false
---

# Corpus-Analysis Salvage and Topology Redesign

## Problem (framed before any solution)

- **Gap**: the pipeline spends 100% of its budget before its only calibration
  instrument (the recall gate at meta) reads anything. A judgment-regime
  failure — the exact thing that happened on 2026-07-02 (Sonnet no-tools
  voters killed 11/18 known-real baselines the run had correctly found) — is
  invisible until everything is spent. Power is also allocated uniformly:
  every candidate gets the same voter cost regardless of stake, and every
  window the same extraction cost regardless of signal.
- **Who it harms**: the owner's quota and money (the 5h window silently
  overflows to API billing — ~$448 spent this session, ~$220 of it on
  regimes later abandoned); the discovery itself (over-kill masks value).
- **Mechanism**: batch-sequential topology with calibration terminal, no
  interleaved known-answer probes, no running kill-rate breaker, no pre-run
  agent/token/dollar declaration, and single-pass disjoint windows at
  extraction (shot noise at window boundaries).
- **Constraints**: PDR-122 (agents judge atomically, code computes and
  routes); the frozen adjudication math; conservation-first (kills are
  conserved, never deleted); owner directives 2026-07-02: NEVER re-run the
  full validate under a changed regime to test it — pilots at ~1/10th corpus
  are the instrument; every run pre-declares its agent count and cost;
  candidate concurrency 8.
- **Success looks like**: a regime failure costs ≤ ~5% of a run's budget
  before a typed abort; every run's cost is predicted before launch within
  ~2x and measured after; extraction noise is reduced by overlap; expensive
  models touch only the candidates whose disposition is contested or
  high-stakes.

## Evidence base

[`../../../reports/agentic-engineering/large-corpus-analysis-tooling/burn-analysis-2026-07-02.md`](../../../reports/agentic-engineering/large-corpus-analysis-tooling/burn-analysis-2026-07-02.md)
— measured unit costs per agent type, meter calibration (~1M raw tokens/point),
counter biases, agent-count formulas. Judgment evidence: the committed
checkpoints (map 580 leaves / reduce 246 candidates / validate 26-keep-220-kill
/ meta 2-subsumes-5-partial-11-missed) plus 202 banked Opus free-tool verdicts
(54 candidates, 47 complete quorums; 40% quorum-level disagreement with the
Sonnet regime, one-directional toward kill).

## PROPOSED design decisions (ratify at ws2)

- **D1 — calibration-first ordering.** The known-answer probes run FIRST, not
  last. The recall baselines map to candidates before validate dispatch (the
  meta agent proved this mapping is computable); those candidates are seeded
  into the first validate batch as canaries and a deterministic breaker
  aborts the stage when canary kills exceed the threshold.
- **D2 — cellular extraction with overlap.** Map windows overlap (e.g. 50%
  stride, the semantic-vector analogy): each corpus region is read by ≥2
  independent cheap extractors; leaves are merged by deterministic dedup.
  Cost control comes from single-turn cells: one file (or one bounded chunk)
  per dispatch so context never accretes across many Read turns (the measured
  mapper burned ~1.27M raw/window because every extra turn re-reads the
  agent's whole context; 12 single-file cells cost less than one 12-turn
  agent and parallelise).
- **D3 — progressive power.** Tier the spend by stake: cheap wide pass
  (Haiku/Sonnet-low) extracts and RANKS; mid pass (Sonnet/high, locked
  single-turn) screens candidates; the expensive model (Opus) touches only
  (a) contested quorums, (b) the top-N ranked candidates, (c) synthesis
  stages. The deterministic state machine stays the sole router.
- **D4 — pilot-first sizing.** A full run is always preceded by a ~1/10th
  pilot (stratified window sample). The pilot's recall-on-canaries and
  kill-rate calibrate the regime; the remainder launches only on a passing
  pilot verdict plus owner go.
- **D5 — pre-run declaration.** Seeding prints: agent-count bounds, expected
  tokens (unit-cost table × counts), meter points, API dollars, and the
  wall-clock estimate at the configured concurrency. The post-run accounting
  command closes the loop against actuals.
- **D6 — batch-sequential validate.** Batches of ~25 candidates with the
  breaker evaluated between batches; candidate-granular resume already
  supports this shape. Concurrency 8 within a batch.

## Non-goals

- Re-running the 2026-07-02 validate under any regime (owner-directed).
- Changing the frozen adjudication math or the four conjunctive tests.
- LLM-emitted scores anywhere (PDR-122).

## Lifecycle

ws1 is conservation work on the current thread and can execute immediately.
ws2+ builds only after the readiness review ratifies D1-D6 in a fresh seat.
