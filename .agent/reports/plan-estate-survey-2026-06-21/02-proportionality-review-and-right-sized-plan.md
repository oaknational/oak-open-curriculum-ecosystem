# Proportionality Review & Right-Sized Launch Plan — Deep Plan-Estate Survey

> 2026-06-21. Pre-launch gate artefact. Reviewer: `assumptions-expert` (dispatched by
> Hobby wakes Halo, survey orchestrator). Reviews the execution design at
> [`00-method-and-execution-design.md`](./00-method-and-execution-design.md).
> **Verdict: launchable-with-named-adjustments.** This doc conserves the review, the
> orchestrator's critical assessment (all findings input-to-verify), and the recommended
> right-sized design — posted to comms for the owner's firing checkpoint, NOT yet fired.

## Reviewer verdict

Launchable-with-named-adjustments. The method is sound and the per-plan "≥3 independent
reads PLUS a separate verify gate" invariant is correctly preserved
(brief `deep-plan-estate-survey.plan.md:76`, `:94-98`). Four adjustments before firing:
floor over-allocation; an over-scoped adversarial-verify gate; an inconsistent batch table
with last-batch host pressure; and an unaddressed read-agent fabrication risk.

## Orchestrator's critical assessment (findings are input-to-verify)

- **Reviewer's #1 CRITICAL — "1000-agent cap and 16-concurrent ceiling are unvalidated,
  no citable source" — CORRECTED.** The caps ARE citable, from the Workflow-tool contract
  available to the orchestrator but not to the read-only sub-agent: total agents per
  workflow are capped at 1000; concurrent `agent()` calls at `min(16, cores-2)` = 12 here.
  `pipeline()` / `parallel()` are orchestration primitives that do not themselves add to
  the agent count — only `agent()` calls count — so the design's `70 x 4 = 280` arithmetic
  is correct (reviewer concern #2, nested-pipeline counting, is resolved). No dry-run is
  needed to validate the cap. A small smoke-run retains independent merit (validating the
  real pipeline shape, StructuredOutput schema validation, and host behaviour at small
  scale) and is folded in as an optional first sub-batch.
- **Reviewer's #4 — read-agent fabrication risk — VALIDATED first-hand**
  (`parallel-worktree-dispatch-unreliable.md:30-41`, `:54-59`, `:97`). The
  worktree-base-inconsistency leg is N/A (survey agents are read-only, no
  `isolation:"worktree"`; `:97` exempts read-only analysis agents from the write-corruption
  leg). The improvise-don't-halt leg APPLIES: a read-agent that cannot reach its assigned
  plan would invent a plausible finding. Cure adopted.
- Reviewer's #1 (conditional specialist), #3 (scoped verify gate), and the batch rebalance
  are adopted as recommended; sound on their merits.
- Tiering (Sonnet reads / Opus judgment) confirmed: conformance scoring is deterministic
  against the lens (`plan-node-schema.v0.md:546-549`, §9.1), so it is Sonnet-class
  extraction; judgment stays on Opus.

## Adopted adjustments

1. **Conditional third read.** Holistic + conformance-vs-V0 always; the third read is a
   routed specialist IFF a content signal fires (test / architecture / security / type /
   config / docs), else a second-angle generalist read. Preserves ≥3 independent reads on
   every plan; drops the floor-filler specialist on signal-less strategic stubs. ~3.4
   agents/plan.
2. **Scoped adversarial-verify gate.** Hard Opus refutation gate on the high-stakes
   classifications only — complete / superseded / orphaned / duplicate / dead — plus
   cross-plan duplication/contradiction. Mechanical conformance facts (field presence,
   unclassified keys) get a deterministic recompute-check, not a full Opus agent.
3. **HALT-don't-fabricate** in every read-agent brief: "If you cannot read the assigned
   plan file at its path, return `unreadable` and HALT — never produce a plan-shaped
   finding."
4. **Batch rebalance.** Re-derived sizes (first-hand): B1=70, B2=67, B3=67, B4=82 (sum
   286). Rebalance to ≤~75 each (move one mid-size collection from B4 into B2). Correct the
   §4 prose of `00-method-...` to match the listed composition.
5. **Host guard.** Concurrency ≤12; re-check host swap between batches; abort-and-resurvey
   if swap exceeds 85% at a batch boundary (swap is elevated at ~78% per the handoff).
6. **Phase-as-workflow.** Pass 1 (per-document pipeline) runs batched; Pass 2 (cross-cutting
   relational) and Pass 3 (synthesis + completeness critic, loop-until-dry) run as separate
   workflows after Pass 1, with the orchestrator in the loop between phases.

## Right-sized design (the firing plan)

| Lever | Recommended |
| --- | --- |
| Agents/plan | 3 base (holistic + conformance + conditional specialist/2nd-angle) + scoped verify → ~3.4 avg |
| Total Pass-1 agents | ~850–970 (under the 1000 cap, but batched for host pressure + ledger cleanliness) |
| Model tiering | Sonnet 4.6: holistic / conformance / specialist reads. Opus 4.8: adversarial-verify (high-stakes), cross-cutting, synthesis, critic |
| Pass-1 batches | 4, rebalanced to ≤~75 plans each (~250–300 agents/batch) |
| Concurrency | ≤12; re-check host swap between batches; abort if >85% |
| Passes 2 & 3 | Separate workflows after Pass 1; orchestrator-in-the-loop between phases |
| Outputs | 4 dated reports: conformance-and-traceability inventory; cross-cutting pattern findings; taxonomy grounding (V0→V1); coverage ledger |

## Status

Posted to comms for the owner's firing checkpoint (per Director Vesuvius's protocol: the
right-sized plan is posted before any heavy compute fires). NOT fired. Awaiting the owner's
go-ahead; the final adjustments will be encoded into `00-method-...` on the go, then Pass 1
launches.
