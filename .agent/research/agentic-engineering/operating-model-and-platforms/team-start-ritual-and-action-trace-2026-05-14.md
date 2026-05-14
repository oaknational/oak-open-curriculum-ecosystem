# Team Start Ritual and Action-Trace Research Note

**Date**: 2026-05-14
**Status**: focused research note
**Thread**: `agentic-engineering-enhancements`
**Related artefacts**:
[`start-right-team`](../../../skills/start-right-team/SKILL-CANONICAL.md),
[ADR-181](../../../../docs/architecture/architectural-decisions/181-agent-team-start-and-action-log.md),
[`team-handoff-routing-and-action-log-exploration.plan.md`](../../../plans/agentic-engineering-enhancements/future/team-handoff-routing-and-action-log-exploration.plan.md)

## Research Frame

The current question is how an agent team should start, coordinate, preserve
experience, and leave an auditable account without copying human organisation
structures by default.

The working hypothesis is:

- all agents need the same shared start-right immersion as individual sessions;
- the team then needs a second, short ritual that names current coordination
  pressure and temporary responsibilities;
- team handoff should capture every participant's knowledge without making
  every participant edit canonical continuity surfaces;
- action trace belongs near comms and handoff, but has a different audience and
  timescale.

## Observed Pattern

The P8 collaboration worked when responsibilities emerged from live pressure.
Useful signals included implementation ownership, reviewer GO/BLOCK, marshal
verification of git/index/queue state, scout-only next-slice shaping, and
controller synthesis.

The team did not need permanent roles. It needed bounded responsibilities with
clear evidence, a next decision point, and a route for changed understanding.

The strongest quality event was a narrow reviewer BLOCK on human-visible text.
The strongest coordination event was marshal ownership of shared scarcity
during commit windows. The closeout weakness was redundancy: multiple agents
running individual handoff instincts can produce repeated state and synthesis
work.

## Candidate Principles

1. **Foundation before team shape**: every participant must complete the shared
   start-right grounding before receiving work.
2. **Pressure before role**: name the coordination pressure before choosing a
   responsibility label.
3. **Boundary before identity**: a role label is weaker than the boundary owned
   and the evidence expected.
4. **Roles are leases**: any role can expire, dissolve, or transfer as the
   work changes.
5. **One canonical handoff owner**: team members contribute boundary-scoped
   syntheses; one closeout owner performs full session synthesis.
6. **Trace intent, not inner monologue**: audit records need brief reasoning,
   evidence, and result, not private chain-of-thought.

## Start-Right-Team Experiment

The first experiment is a skill-level intervention rather than a tooling
system:

- require shared start-right foundation;
- collect a team-start report from each agent;
- name the coordination pressure;
- assign temporary responsibilities with evidence and expiry;
- reserve full session handoff for one closeout owner;
- ask all other agents for boundary-scoped closeout.

Success signals:

- fewer duplicate continuity edits at closeout;
- clearer assignment of implementation, review, marshal, and scout work;
- faster detection of stale claims, queue pressure, directed-thread pressure,
  or needs-attention signals;
- better next-session opener because the closeout owner reads focused
  participant syntheses.

## Action-Trace Research

The proposed action trace is not a comms replacement.

| Surface | Primary audience | Timescale | Shape |
| --- | --- | --- | --- |
| Comms | active peer agents | minutes to hours | two-way coordination |
| Claims / queue | active peer agents and commit hooks | minutes to hours | current ownership |
| Action trace | future agents, reviewers, consolidators | days to weeks | one-way audit events |
| Handoff | next session owner | next session | synthesis |

Minimal event candidates:

- `intent`
- `decision`
- `action`
- `verification`
- `blocker`
- `handoff-note`
- `role-synthesis`

Minimal fields:

- timestamp;
- agent identity;
- thread;
- boundary owned;
- intent;
- brief reasoning;
- action;
- affected artefacts;
- evidence;
- result;
- handoff relevance.

The trace should have rendered views rather than requiring humans to read raw
events:

- per-thread chronological view;
- per-agent session view;
- per-artifact intent view;
- controller closeout view;
- consolidation-candidate view.

## Role Ontology Caution

A predefined menu is useful as memory support, but dangerous as topology. It
can make agents choose from human-looking nouns instead of reasoning from the
work. The current safer primitive is `boundary_owned`, with role labels treated
as examples.

Possible future classification dimensions:

- boundary type: source, review, git-window, scout, liveness, synthesis;
- authority type: peer decision, owner decision, advisory-only;
- duration: one action, one slice, one commit window, one session;
- evidence type: tests, diff, comms, queue, claim, screenshot, plan update;
- interaction type: independent, paired, directed, standby.

This is deliberately not yet an ontology. It is a search space.

## Open Questions

1. Should `session-handoff` gain an explicit team-member mode, or should
   `start-right-team` provide the only team closeout routing?
2. Should action trace events be generated by existing comms tooling or by a
   separate collaboration-state topic?
3. What event threshold avoids noise while preserving auditability?
4. Can rapid consensus or voting help agent teams, or does bounded default
   action remain the better primitive?
5. Which rendered action-trace view would most improve P8 operator value?

## Next Experiment

Use `start-right-team` in the next multi-agent session. At closeout, compare:

- number of duplicate continuity edits;
- whether each participant's synthesis was enough for the controller;
- whether temporary responsibilities shifted cleanly;
- whether missing action-trace events made any decision hard to reconstruct.
