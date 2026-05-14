---
status: EXPLORATION
classification: future
created: 2026-05-14
session_id: 019e22
threads:
  - agentic-engineering-enhancements
related_work:
  - start-right-team
  - ADR-181
  - team-start-ritual-and-action-trace research note
  - jc-session-handoff
  - agent-collaboration directive
  - cost-of-collaboration P8 controller session
  - coordinator-role-as-allocator-not-gatekeeper PDR candidate
---

# Team Handoff Routing And Action Log Exploration

**Status**: exploratory note, not an executable plan. The first low-risk slice
has been expressed as `start-right-team` plus proposed ADR-181 and the focused
research note. Promote only after owner review chooses the next slice and
confirms whether it belongs in `session-handoff`, collaboration-state tooling,
a new action-log surface, or a combination.

## Problem

`jc-session-handoff` was designed around an individual contributor closing a
session. In a team window, every agent running the full ritual creates
redundant continuity edits, repeated identity-summary churn, duplicated
consolidation-gate judgments, and extra comms/state residue for the controller
to absorb.

The real impact is not "less paperwork". The impact is preserving context,
experience, understanding, and knowledge without making every participant act
as if they own the whole session boundary.

Separately, the team needs an auditable action log: a trace of brief intent,
reasoning, action, and evidence. That surface is related to handoff because it
can feed closeout synthesis, but it is not the same as comms. Comms is a
two-way coordination channel; an action log is a one-way audit and
understanding trail.

## First-Principles Questions

1. What boundary is each agent actually closing?
2. Which context must be captured at source, before memory decays?
3. Which synthesis should happen once by the controller?
4. Which facts need auditability over longer reading timescales?
5. How do we avoid turning roles into a static menu that agents obey instead of
   reasoning from the live work shape?

## Candidate Role Classes

Use these as candidate routing labels, not as a fixed ontology yet.

- `controller`: owns team route, final synthesis, next safe step, and canonical
  continuity updates.
- `implementer`: owns a source bundle, claims, tests, commit evidence, and
  implementation surprises.
- `reviewer`: owns a bounded GO/BLOCK challenge and evidence, with no source
  ownership unless separately routed.
- `marshal`: owns shared scarcity such as git/index/queue facts during a commit
  window.
- `scout`: owns read-only next-slice shape, risks, and proposed test surface.
- `standby`: owns liveness, inbox monitoring, and "no work assigned" evidence.
- `consolidator`: owns cross-session synthesis when `consolidate-docs` is
  explicitly in scope.

The classification question is whether these should become skill routing modes
or remain examples under a simpler `boundary_owned` field.

## Approaches To Explore

### A. Controller-Only Full Handoff

Only the controller runs full `jc-session-handoff`. Team members send short
role-scoped closeout notes to the controller.

**Shape**: team members report outcome, evidence, blockers, surprises, and
next-role handoff; controller synthesises into repo-continuity, thread record,
pending-graduations, and napkin.

**Benefits**: lowest redundancy; one canonical next safe step; simpler
consolidation-gate ownership.

**Risks**: controller can miss subjective or technical nuance; team-member
context depends on the quality of short notes.

### B. Handoff Routing Inside The Skill

`jc-session-handoff` starts by asking which boundary the agent owns:
controller, implementer, reviewer, marshal, scout, standby, or consolidator.
Each mode has a different required output.

**Benefits**: keeps one skill name; avoids every agent running the full ritual;
teaches the distinction at the point of use.

**Risks**: a role ontology can become premature topology; agents may choose a
label mechanically instead of thinking from the work.

**Possible cure**: route by `boundary_owned` first, role label second. Example:
`session`, `source-bundle`, `review-verdict`, `git-window`,
`next-slice-scout`, `liveness-only`, `cross-session-synthesis`.

### C. Shared Team Journal Plus Controller Synthesis

Every agent writes small journal entries as work happens. At closeout, each
agent signs off with a short synthesis. The controller reads the journals and
writes the canonical handoff.

**Benefits**: captures context before memory decay; preserves subjective and
technical observations without forcing every agent to edit canonical surfaces.

**Risks**: another hot shared surface; journals can become a second comms log
unless the audience and lifecycle are clear.

**Open design**: append-only markdown, JSON events with rendered views, or
per-agent local files aggregated by the controller.

### D. Event-Driven Action Log With Rendered Views

Add a first-class action-log event stream distinct from comms. Each event
records brief intent, reasoning, action, evidence, and affected artefacts.
Rendered views support audit, handoff synthesis, and later learning-loop
consolidation.

**Benefits**: strong traceability; supports "why did this happen?" without
reading chat transcripts; can feed session handoff automatically.

**Risks**: can become noisy, performative, or duplicative with comms unless the
schema is small and the audience is distinct.

**Audience**: future agents, reviewers, auditors, and consolidators. Not the
live peer coordination channel.

**Timescale**: longer than comms. Useful days or weeks later when reconstructing
intent and decision paths.

### E. Hybrid: Action Log Feeds Team Handoff

Team members write action-log events during work. At closeout they add one
role-scoped synthesis event. The controller runs full handoff from the rendered
action-log view plus comms.

**Benefits**: separates live coordination from durable trace; reduces handoff
redundancy; keeps controller synthesis grounded in auditable source events.

**Risks**: requires tooling before it is ergonomic; if manual, it may increase
burden instead of reducing it.

### F. Minimal Patch First

Amend `jc-session-handoff` with a short "team-member mode" warning before any
new tooling:

- If you are not the controller, do not update repo-continuity or thread-wide
  next safe step unless delegated.
- Write a role-scoped closeout note: outcome, evidence, blockers, surprises,
  and handoff needs.
- The controller owns canonical synthesis.

**Benefits**: smallest change; can validate behaviour before designing action
log infrastructure.

**Risks**: guidance-only cures may decay under pressure; may need a mechanical
prompt or template to fire reliably.

## Action Log Sketch

Minimal event fields:

- `event_id`
- `timestamp`
- `agent_id`
- `thread`
- `role_or_boundary`
- `intent`
- `brief_reasoning`
- `action`
- `affected_artifacts`
- `evidence`
- `result`
- `handoff_relevance`

The log should avoid long chain-of-thought. The target is brief reasoning and
intent sufficient for auditability: why this action was taken, what evidence
was consulted, and how a future agent can verify the result.

Candidate event types:

- `intent`
- `decision`
- `action`
- `verification`
- `blocker`
- `handoff-note`
- `role-synthesis`

Rendered views to explore:

- per-thread chronological view
- per-agent session view
- per-artifact change-intent view
- controller closeout summary view
- consolidation-candidate view

## Open Questions

1. Is "role" the right routing primitive, or should the skill route by boundary
   owned?
2. Should team journals be human-authored markdown, structured JSON events, or
   action-log events rendered as markdown?
3. Which handoff facts must be captured by every agent, and which must be
   synthesised once?
4. Should action-log writing be required for every meaningful action or only at
   decision and verification boundaries?
5. What is the minimum schema that gives traceability without creating a
   performative burden?
6. Where should the action log live relative to `.agent/state/collaboration/`?
7. Can existing comms events be extended, or does the audience/timescale
   difference justify a new event family?
8. Which rendered view would make the first measurable difference to the P8
   operator experience?

## Suggested First Exploration Slice

Do not start with a complete ontology. The first skill-level experiment is now
captured in `start-right-team`:

1. Require shared start-right grounding for every team member.
2. Route by `boundary_owned`, with role labels as examples.
3. Provide short templates: controller, implementer, reviewer/scout/
   marshal.
4. In the next multi-agent session, require team members to use the short
   template and let only the controller run full handoff.
5. Compare residue, missed context, and controller synthesis quality against
   the 2026-05-13 P8 controller session.

Parallel exploration: design the action-log event schema as a separate
agent-tools future slice, but do not couple it to the first skill amendment.

## Promotion Triggers

Promote this exploration when one of these happens:

- owner chooses a first slice;
- another team session repeats the full-handoff redundancy;
- P8 attention/action-state work needs audit-log semantics;
- a consolidation pass decides the role-routing lesson is ready for a PDR or
  skill amendment.
