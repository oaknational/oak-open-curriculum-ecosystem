# Agentic Judgment: Conserve by Default

Operationalises
[PDR-122 (Agentic Judgment Pipelines)](../practice-core/decision-records/PDR-122-agentic-judgment-pipelines.md)
invariant 2 (conserve by default; corroborate the irreversible disposition),
with invariants 1 and 3–6 as the surrounding construction doctrine.

## Trigger

Designing, building, or amending any agentic pipeline that judges, validates,
filters, scores, or adjudicates items — corpus analysis, review panels,
evaluation harnesses, recall calibration, candidate triage, withdrawal or
coverage audits. The rule fires at design time and again at any change to a
pipeline's disposition logic.

This rule is **always-on** rather than trigger-loaded: ad-hoc judging and
filtering ("drop these findings", "keep the top N") happens constantly without
being named "pipeline design", and the harm class it guards — irreversible,
silent discard of grounded knowledge — offers no observable firing moment for
a loader to hook.

## The Rule

1. **No irreversible disposition rests on a single voter.** A discard / kill /
   withdrawal is the irreversible, silent error class: a false keep is visible
   and prunable; a false kill vanishes and silently drops recall. A discard
   requires a **diverse-lens quorum** (distinct lenses, so votes are
   uncorrelated); absent that quorum, **conserve** — keep, or hold for review
   and surface for human judgment. Never silently drop.
2. **An LLM never computes the aggregate it is judging inside.** Per-item
   judgments come from the model; every count, fraction, threshold, verdict,
   and routing decision is deterministic code over those judgments
   (PDR-122 invariant 1). Empirical base: a meta agent self-reported ~0.72
   recall while its own per-item judgments summed to ~0.28 strict; a lone
   adversary's terminal kills showed an ~80% false-kill rate under quorum
   re-validation.
3. **Rigour sits on the irreversible side.** Optimising a gate to make kills
   cheap and keeps expensive inverts the risk-tiering of `principles.md`
   §Agentic Quality. When tuning, measure the false-kill rate against known
   answers before trusting any kill (PDR-122 invariant 6: calibrate before
   scaling spend).

## Failure mode this prevents

Grounded knowledge silently discarded by an uncalibrated or single-voter
gate — discovered only when a recall check against known answers finds the
finding was *found, then killed* (2026-07-02: a regime change killed 11 of 18
known-real baselines the run had correctly found).

## Related surfaces

- [PDR-122](../practice-core/decision-records/PDR-122-agentic-judgment-pipelines.md) —
  the full six-invariant construction doctrine.
- [`validation-strategy.md`](../directives/validation-strategy.md) — the
  assurance frame this risk-tiering instantiates.
- `agent-tools/src/corpus-analysis/` — the deterministic aggregation layer
  implementing the invariants for the corpus pipelines.
