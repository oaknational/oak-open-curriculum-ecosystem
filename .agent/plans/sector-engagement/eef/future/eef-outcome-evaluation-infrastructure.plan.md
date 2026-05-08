---
name: "EEF Outcome Evaluation Infrastructure"
overview: "Follow-on evaluation harness for measuring whether EEF caveats, data coverage, and citation attribution survive LLM-mediated lesson-plan or strategy-review outputs, and for deciding whether teacher-trust or SENCO workflow outcomes need a separate human-outcome evaluation plan."
type: evaluation-infrastructure
status: future
thread: eef
related_plans:
  - "../current/eef-evidence-corpus.plan.md"
  - "../../../graph-mvp-arc.plan.md"
isProject: false
todos:
  - id: define-rubric-and-owner
    content: "Name the rubric owner, evaluation cadence, pass/fail classes, and review workflow for LLM/outcome evaluation outside Vitest."
    status: pending
  - id: fixture-sampling-protocol
    content: "Commit the prompt-output fixture protocol, including recommendation and prompt-output samples, sampling cadence, and data-version pinning."
    status: pending
  - id: attribution-failure-classes
    content: "Define citation-attribution critical failures, caveat/data-coverage preservation thresholds, and acceptable manual adjudication process."
    status: pending
  - id: human-outcome-split-decision
    content: "Decide whether teacher-trust measurement and SENCO workflow-time measurement belong in this rubric or in a separate named human-outcome evaluation plan before EEF ACTIVE promotion."
    status: pending
---

# EEF Outcome Evaluation Infrastructure

This is the named follow-on for outcome questions intentionally kept out of
`eef-evidence-corpus.plan.md` T19.

Slice 1 proves structural source fidelity at the tool boundary. This future
plan measures a different thing: whether LLM-mediated lesson-plan or
strategy-review outputs preserve caveats, data coverage, evidence strength, and
citation attribution after the structured tool result has been used. It also
owns the pre-ACTIVE decision about whether teacher-trust measurement and SENCO
workflow-time measurement can be fairly handled by this rubric or need a
separate human-outcome evaluation plan.

It must run outside Vitest. Promotion requires a rubric owner, stable fixture
sampling, explicit pass thresholds, and zero-tolerance critical failure classes
for citation attribution.
