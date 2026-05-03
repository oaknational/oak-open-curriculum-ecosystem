# Agentic Collaboration — Hypothesis, Tests, and Operational Briefs

This directory holds a first-pass hypothesis for how N-agent
collaboration might work on the existing Practice substrate, along
with the falsification criteria, per-experiment briefs and prompts,
and the decision-complete plan that drives running the experiments
in parallel with real work on active threads.

## Priority order — read this first

The function of every session on the active threads is to move toward
a provable mergeable condition so that the upstream API change work
can land in main. **Long-term architectural excellence
([`principles.md § Architectural Excellence Over Expediency`](../../../directives/principles.md#architectural-excellence-over-expediency))
is the priority** — never compromised for any other goal. The
experiment data here should absolutely be gathered and acted on, but
the experiment is a by-product of doing the real work, never a
justification for reshaping it. If experiment instrumentation would
compromise the work, drop the instrumentation and ship the work;
capture observations only insofar as they fall out naturally.

**Read the rest of this README in order depending on what you are about to do.**

## If you are about to coordinate with another agent

Open the active experiment subdirectory under [`experiments/`](experiments/),
find the prompt for your mode, and follow it. The prompts are
ready-to-copy-paste; you do not need to read the hypothesis or
falsification files to coordinate.

For the next session that is currently scheduled:

- Agent 1 (Orchestrator + Executor + Collaborator):
  [`experiments/E1/agent-1-orchestrator.md`](experiments/E1/agent-1-orchestrator.md).
- Agent 2 (Executor + Feedback + Collaborator):
  [`experiments/E1/agent-2-executor.md`](experiments/E1/agent-2-executor.md).

## If you are designing or running an experiment

1. [`hypothesis.md`](hypothesis.md) — the core claim and the 10
   candidate primitives (each with its initial taxonomy where
   applicable).
2. [`falsification-criteria.md`](falsification-criteria.md) — what
   would falsify, weaken, or strengthen each primitive.
3. [`experiments/README.md`](experiments/README.md) — register of
   E1–E5 with status, plus the per-experiment subdirectories.
4. [`.agent/plans/agentic-engineering-enhancements/current/n-agent-collaboration-experiments.plan.md`](../../../plans/agentic-engineering-enhancements/current/n-agent-collaboration-experiments.plan.md)
   — the decision-complete plan with the methodology, ordering
   decisions, capture cadence, analysis cadence, and reflection
   cadence.

## If you are graduating a primitive

A primitive that has accumulated strengthening observations across
multiple sessions and pairings, with zero falsifying observations,
is a candidate for permanent doctrine. Route via
`/jc-consolidate-docs § graduation scan`. Destinations:

- Doctrine-shaped primitives → `.agent/directives/agent-collaboration.md`.
- Enforcement-shaped primitives → a rule under `.agent/rules/`.
- Decision-shaped primitives with rationale worth preserving → ADR or PDR.

## If you are falsifying a primitive

Capture the observation in `.agent/memory/active/napkin.md` tagged
with the experiment ID, amend the primitive's entry in
`falsification-criteria.md`, and propose the replacement (or argue
for removal) via comms event and the next consolidate-docs pass.
See `falsification-criteria.md § Falsification process` and the
plan's *Falsification handling* section.

## Directory map

```text
collaboration/
├── README.md                    (this file)
├── hypothesis.md                (core claim + 10 candidate primitives)
├── falsification-criteria.md    (per-primitive falsify/weaken/strengthen)
└── experiments/
    ├── README.md                (experiments register; E1–E5 status)
    └── E1/
        ├── brief.md             (what is being observed; capture/analysis plan)
        ├── agent-1-orchestrator.md  (copy-paste prompt for Agent 1)
        └── agent-2-executor.md      (copy-paste prompt for Agent 2)
```

The decision-complete plan that drives this directory lives at
[`.agent/plans/agentic-engineering-enhancements/current/n-agent-collaboration-experiments.plan.md`](../../../plans/agentic-engineering-enhancements/current/n-agent-collaboration-experiments.plan.md).

Future experiments (E2–E5) get their own subdirectories when their
prompts are authored — that happens when the work shape produces
the conditions they target.

## Status

**Evidence base**: a single 2-agent session (Pelagic Washing Anchor
↔ Misty Ebbing Pier, 2026-05-03). The hypothesis is coherent enough
to test; not yet validated. The next session running the E1 prompts
is the first observation opportunity, not the function of the session.

**Stance**: hypothesis under test, not design to ship. Validated
primitives graduate; falsified primitives are replaced or removed;
the hypothesis evolves through cycles of testing.
