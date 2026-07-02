---
lineage:
  serves_thread: agentic-engineering-enhancements
  serves_stream: continuity-memory-and-knowledge-flow
  strategic_choice: agent-as-thinker capabilities are Practice substance (PDR-035)
  derives_from: .agent/reports/agentic-engineering/large-corpus-analysis-runbook-design-2026-06-29.md
todos:
  - id: author-runbook-draft
    content: Method captured in the design report (single home until proven); no separate reference doc yet
    status: completed
  - id: run-discovery-napkins
    content: "DONE (2026-06-29, Wren stirs Rainbow). First Discovery pass ran over 100 files / 14 token-balanced windows. Substance: research/.../napkin-discovery-pass-1-2026-06-29.md; metadata: curator-passes/2026-06-29-wren-napkin-discovery-pass.md."
    status: completed
  - id: calibrate-and-assess
    content: "DONE. Verdict refine-and-rerun: machinery sound, apophenia gate functioning (9/19 killed, all principled), but recall below threshold (corrected 0.28 strict / 0.56 lenient — the run's self-reported 0.72 was a meta-arithmetic defect caught first-hand). Misses all out-of-remit single-window defects."
    status: completed
    depends_on: [run-discovery-napkins]
  - id: refine-method
    content: "DONE — folded into the v2 design report (large-corpus-analysis-runbook-v2-design-2026-06-29.md): deterministic aggregation, full Tier 0+1+2 ensemble, typed within-remit recall, real-world-signal close, cost gate. Build sequenced in the v2 implementation plan."
    status: completed
    depends_on: [calibrate-and-assess]
  - id: graduate-or-decide
    content: "RELOCATED to large-corpus-analysis-v2-implementation.plan.md (graduate-or-decide todo). Graduation to a PDR-120 reference runbook + adopting PDR (PDR-035) stays gated on a PASSING v2 rerun — v1 did not clear the threshold."
    status: pending
    depends_on: [refine-method]
---

# Large-corpus analysis runbook — build and prove

> **CHAIN ORIGIN (generation 1); framing re-rooted 2026-06-30 (Linnet binds Leeward).** This plan
> centres a *trustworthy, reusable capability proven on a real corpus* — capability-first, with the
> napkin run as the proving instance and recall-against-baseline as the promotion gate. The owner
> re-rooted that: the napkin corpus is the real **subject**, the **discovery and conservation of its
> understanding is the end**, and the reusable capability + golden-baseline recall are the **means**
> (tuning the pipeline so its genuine discoveries — recurring *and* longitudinal — are trustworthy;
> the capability also travels to the comms-events and possibly planning corpora). The live carrier of
> intent is [`napkin-corpus-discovery-run.plan.md`](./napkin-corpus-discovery-run.plan.md) (which
> supersedes the interim `large-corpus-analysis-v3-extraction-grain.plan.md`).
> v1's run, calibration, and refine (todos below) executed; retained as history, not rewritten.

Bounded arc to take a designed-but-unproven corpus-analysis method to a proven,
correctly-homed Practice capability. The method, cost model, governance decision,
and turnkey first-run configuration are authoritative in the design report:
[`../../../reports/agentic-engineering/large-corpus-analysis-runbook-design-2026-06-29.md`](../../../reports/agentic-engineering/large-corpus-analysis-runbook-design-2026-06-29.md).
This plan does not restate them; it sequences the work to prove the method and home
it.

## End goal

A trustworthy, reusable capability for analysing oversized document corpora on a
timeseries — Discovery, Surprises, and Directed modes on one substrate — proven on
a real corpus and homed as a reference runbook with an adopting PDR. If the proving
run instead reveals defects, those defects are named and routed to a fix-and-rerun
iteration or to an owner decision to discontinue the capability — there is no
holding state.

## Mechanism

The method's load-bearing warrant is "critiqued compression preserves the insight
that matters." A first Discovery run on the napkin corpus tests that warrant
directly: its calibration step measures recall against patterns the existing
syntheses already found, and its adversarial step proves apophenia is defeated.
A method that passes its own self-calibration on a real corpus has earned
promotion; one that fails has told us so before any doctrine was minted.

## Means

1. **Method captured** (done) — held in the design report as the single home until
   proven, per PDR-032 (fresh material does not enter the reference tier).
2. **Run Discovery** on the full napkin corpus, uniform coverage, per the report's
   turnkey config. Re-derive the file set/count at run time (it drifts — 99 → 100
   during design) and partition by **token budget** into ~13–14 balanced windows,
   NOT by file count (9-file windows ranged ~60k–141k at audit). Requires a
   writeable, execution-authorised session (~1.3M-token harness Workflow:
   partition → map → reduce → validate → meta).
3. **Calibrate and assess** — confirm the run re-finds the known-present baseline.
   THREE attested arcs only — claims-doctrine evolution, collaboration-protocol shifts,
   validation/TDD — the **comms-research arc is a phantom and is dropped** (it appears
   in the prior syntheses only as a 2026-05-29 processing-exclusion note, never as a
   kept validated pattern). The v1 run enumerated **18** discrete baselines (4 / 9 / 5),
   above the original "~16" floor. Record the recall discount; confirm every reported
   pattern is grounded and survived the null. (DONE for v1; see the curator-pass.)
4. **Refine** — fold first-run lessons (window size, leaf schema, critic depth)
   back into the method section.
5. **Graduate or decide** — if proven, graduate the method to a reference runbook
   homed per **PDR-120** (a section in an operations/governance doc, listed in the
   runbook index at `docs/operations/README.md#runbook-index` — NOT the
   `.agent/reference/` tier, which PDR-032 reserves for read-to-learn library
   material), and author the adopting PDR citing this run as its first worked
   instance (the PDR-046 birth pattern). If the run reveals defects, record them with
   evidence
   and route to a fix-and-rerun iteration (named gate: the defect is fixed and the
   run repeats) or to an owner decision to discontinue.

## Acceptance criteria (outcome-level)

- The Discovery run produces validated emergent patterns, each grounded to napkin
  date/SHA, at a **recall against the known-present baseline at or above a
  threshold set at calibration time** (default ~85%; tune at first run).
- The run states its fidelity/recall discount and the *kind* of content its
  machinery drops.
- Every reported pattern survived the apophenia gate (grounded, beat base rate,
  survived the null, visible in raw entries).
- A dated run-record exists in operational memory (curator-passes shape).
- The graduate-or-decide outcome is recorded with evidence.

## Prerequisites

- **Blocking:** a writeable, execution-authorised session for the run (this design
  session was read-only and correctly did not launch it).
- **Beneficial:** owner confirmation of full-corpus versus calibration-slice-first.
  Minimum shippable without it: full-corpus Discovery as configured.

## Non-goals

- No plan per invocation — invocations are parameter-sets plus run-records.
- No skill yet — PDR-120 triage: a rare trigger is a reference runbook, not a
  loaded skill.
- No PDR before the proving run.
- No trimming, rotation, or restructuring of napkin content — analysis is read-only
  over the corpus (PDR-046 preserve-first).

## Risks

| Risk | Mitigation |
| --- | --- |
| Apophenia — manufactured patterns | The adversarial gate (ground / base-rate / null / artefact) is the run's centre of gravity, not an add-on |
| Tail compression drops the decisive thing | Recall calibration against the prior syntheses; abort if below threshold |
| Premature promotion to reference/PDR | Graduate only after the proving run; this plan gates it |
| Cost blowout | Map on Sonnet; reduce/validate on Opus; estimate ~1.3M; full-corpus is owner-confirmable |

## Lineage

Serves the `agentic-engineering-enhancements` thread, continuity/memory/knowledge-flow
stream. Derives from the design report (above). The capability is an agent-as-thinker
capability and therefore Practice substance (PDR-035); it composes with PDR-046
(layered knowledge processing — a corpus analysis is a Layer-0 read whose output may
feed a later graduation) and the executive-memory loop (PDR-028).
