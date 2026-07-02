---
pdr_kind: pattern
---

# PDR-122: Agentic Judgment Pipelines — Atomic Judgment, Deterministic Aggregation, Conserve-by-Default Routing

**Status**: Accepted
**Date**: 2026-06-30
**Amended**: 2026-07-02 — invariants 5–6 and the invariant-4 economics/spend-governance
extension, from the 2026-07-01/02 napkin-corpus discovery-run worked instances.
**Related**:
[PDR-035](PDR-035-agent-work-capabilities-belong-to-the-practice.md)
(agent-work capabilities are Practice substance — this is the construction doctrine for one
class of them);
[PDR-029](PDR-029-perturbation-mechanism-bundle.md)
(metacognition / reason — the reasoning that surfaced the conserve-by-default correction);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
and [PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(the conservation machinery this pipeline feeds — see Consequences);
the host `principles.md` §Agentic Quality (risk-tiered assurance — this PDR applies its
risk-tiering correctly to the irreversible disposition).

## Context

The Practice repeatedly builds the same shape: an agentic pipeline that **fans out** LLM work
over many items, **validates** or judges them, and **synthesises** a result — corpus analysis,
review panels, recall calibration, candidate adjudication, evaluation harnesses. Two failure
modes were discovered empirically across the napkin large-corpus-analysis proving runs and
generalise to every pipeline of this shape:

1. **LLMs judge atomically well, but aggregate faithfully badly.** A meta agent asked to report
   an aggregate (recall) self-reported ~0.72 while its own per-item judgments summed to ~0.28
   strict / ~0.56 lenient. The model is reliable on a single local judgment and unreliable when
   asked to compute a count, fraction, threshold, or verdict that is a function of many items it
   is simultaneously judging.

2. **A single adversary terminally discarding a grounded item is not rigorous.** When a lone
   voter's negative verdict was allowed to terminally kill a candidate, re-validation under a
   diverse-lens quorum showed an ~80% false-kill rate — inside the ~50–83% verifier
   false-negative band the corpus itself had already observed. Discarding grounded knowledge is
   the **irreversible, silent** error: a false keep is visible and prunable and contributes to no
   metric, whereas a false kill vanishes from the findings and silently drops recall. Optimising
   the gate against false keeps (cheap kills, expensive keeps) inverts the risk-tiering.

## Decision

Pipelines of this shape are built to six invariants.

1. **Atomic judgment, deterministic aggregation.** An LLM stage emits *only* local, per-item,
   typed qualitative judgments. **Every count, fraction, threshold, verdict, and routing decision
   is computed in deterministic code** from those judgments. No agent is ever asked to produce a
   number that is a function of more than one item it is also judging. Qualitative synthesis prose
   is welcome from the LLM; aggregates and dispositions are not.

2. **Conserve by default; corroborate the irreversible disposition.** No high-stakes irreversible
   disposition (a discard / kill / withdrawal) rests on a single voter. A discard requires a
   **diverse-lens quorum** — votes from distinct lenses so they are uncorrelated, which is what
   licenses a simple majority. Absent a quorum that confirms the discard, **conserve**: keep, or
   hold for review and surface for human judgment — never silently drop. Rigour is placed where
   the harm is irreversible (the discard), not on the reversible action. This is the host
   `principles.md` §Agentic Quality risk-tiering applied correctly: *highest rigour where harm is
   asymmetric and irreversible*. A terminal discard is neither cheap nor self-correcting, so it
   earns the highest rigour, not the lightest.

3. **The LLM→code boundary is schema-pinned.** Judgments cross the boundary as schema-validated
   typed values, parsed strictly at the boundary (a parse failure is a typed value at the call
   site, never an invisible default). Where the judging stage runs in a sandbox that cannot import
   the deterministic core, the small routing core is **mirrored** and the mirror is **pinned to
   the source by a conformance test** — the mirror is the one permitted duplication, and launching
   on an unverified mirror is forbidden.

4. **Cost and throughput are deterministic, re-gated, and orthogonal to rigour.** Pre-spend cost
   is arithmetic over an explicit per-stage effort table, never inherited from the session. An
   estimate that depends on an earlier stage's output (e.g. the number of items a clustering stage
   produces) is **re-gated after that stage produces the real number** — a pre-spend estimate
   built on a guessed count is blind. **Throughput (concurrency, batching, cross-window
   checkpointing) is tuned independently of volume and rigour**: every item, tier, and test still
   runs; only wall-clock changes. Rate is never traded for rigour.

   The dominant fleet cost lever is **turns × context**, not model tier: every tool call re-reads
   the agent's whole context, so a free-tool voter costs an order of magnitude more than a
   no-tools single-turn voter on the same judgment (measured 7–17× cheaper and ~3× faster,
   2026-07-02) — least-privilege agent types are an *economic* primitive as much as a safety one.
   Budget is declared **pre-run in every denomination that bills** (tokens, meter points,
   dollars): subscription-quota exhaustion can silently overflow a subagent fleet onto API
   billing — a budget decision the operator never made. A cost backstop firing mid-run is a
   **fork, not a failure**: analyse the real number first-hand, prepare the launch-ready forks,
   commit the checkpoints, surface with a brief, and stop the spend. Broad execution authority
   ("whatever you think appropriate") covers execution — it never re-authorises a multiple of an
   owner-set ceiling.

5. **Stages that can fail independently are split and checkpointed.** A multi-stage pipeline
   checkpoints durable intermediate outputs between independently-failing stages, so a downstream
   failure never loses the upstream spend. A sandboxed stage that cannot write files cannot
   self-checkpoint — so a stage pair where the later can fail after the earlier succeeds
   (map→reduce, reduce→validate) is **split** into separately-launched steps whose outputs are
   committed before the next launches. Recovery is **seeded continuation from the committed
   checkpoint** — validated at build with a stage discriminant so wrong-stage seeding is a
   zero-spend typed failure — never a blind resume that depends on cache-on-failure semantics.

6. **Calibrate judgment before scaling spend.** The first spend checkpoint measures **judgment
   quality, not only cost** — a checkpoint that reads burn-rate but not verdict calibration
   ratifies an uncalibrated regime at scale. The cure is structural, not vigilance: seed
   known-answer canaries **first** in the stream behind a deterministic abort breaker, and pilot
   ~1/10th of the corpus before any full run. A judgment-regime change (model tier, tool
   surface, turn budget) is a **design change requiring recalibration**, never a drop-in swap:
   with candidates, prompts, and quorum math held constant, two regimes kept 47% vs 10.6% —
   40% quorum-level disagreement, one-directional toward kill (2026-07-02).

## Consequences

- The aggregate self-report defect (failure mode 1) becomes structurally impossible: the LLM no
  longer emits the aggregate, so it cannot get it wrong.
- The single-voter discard defect (failure mode 2) becomes structurally impossible: no disposition
  rests on one voter, and the irreversible one (discard) clears the diverse-lens quorum.
- Pipelines are **auditable** (the deterministic layer recomputes every disposition from the
  recorded judgments) and **conservation-safe** (grounded knowledge is never silently lost).
- The host operationalises invariant 2 as an always-applied firing rule (see the companion rule,
  `agentic-judgment-conserve-by-default`) so it fires when an agent designs any new judge /
  validate / aggregate pipeline, and may implement the deterministic core as tested code.
- **This pipeline is a discovery FEEDER, not a conservation engine.** Its validated findings flow
  into the existing conservation machinery (PDR-014 `capture → distil → graduate → enforce`,
  embodied in the `consolidate-docs` / `consolidate-until-done` workflows), which homes them in
  PDRs, ADRs, rules, patterns, skills, and guidance. Discovery and conservation are two halves:
  the *feeder* mechanisms vary (corpus analysis, session learnings, curator passes), but the
  *conservation outcome and machinery are shared*. Do not build a bespoke graduation step for any
  one feeder — that re-implements the conservation engine and fragments it.

## Non-goals

- **Not a ban on LLM synthesis.** Qualitative notes, clustering, and prose synthesis are proper
  LLM work; only numbers, thresholds, and dispositions are code's job.
- **Not specific to corpus analysis.** It governs any agentic fan-out→judge→aggregate pipeline —
  review panels, evals, recall calibration, withdrawal/coverage audits.
- **Not a fixed quorum size.** "Diverse-lens quorum" is the invariant; the specific ensemble size
  and the lenses are a per-pipeline configuration, not part of the doctrine.
