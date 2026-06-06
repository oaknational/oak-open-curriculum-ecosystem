---
name: "EEF Outcome Evaluation Infrastructure"
overview: "Follow-on evaluation harness for measuring whether EEF caveats, data coverage, and citation attribution survive LLM-mediated lesson-plan or strategy-review outputs, and for deciding whether teacher-trust or SENCO workflow outcomes need a separate human-outcome evaluation plan."
type: evaluation-infrastructure
status: future
thread: eef
related_plans:
  - "../current/eef-graph-tool-completion.plan.md"
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
  - id: remove-flag-post-proof
    content: "Remove the OAK_CURRICULUM_MCP_EEF_ENABLED flag (the release-post-proof stage) once this plan's delivered-value proof passes: the EEF surface becomes unconditionally registered and the env var plus its runtime-config resolution are deleted. Trigger: finishing-plan D7 green (surface already live at release-pre-proof) AND this plan's faithfulness/outcome proof passing. The flag-flip to release-pre-proof is owned by the finishing plan's D7, not here; this todo owns only the final removal. If a successor value-evaluation plan supersedes this one (tracked in the graph-estate consolidation plan), it inherits this trigger."
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

The finishing plan's D7 moves the EEF release flag from pre-release to
release-pre-proof (defaults enabled, with `OAK_CURRICULUM_MCP_EEF_ENABLED=false`
retained as a kill-switch), so the surface ships live for users while this plan's
delivered-value proof is still outstanding. This plan therefore owns the
**release-post-proof** stage: once the proof above passes, the flag is removed and
the EEF surface becomes unconditionally registered. The flip to release-pre-proof
itself belongs to the finishing plan's D7, not here.
