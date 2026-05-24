# ADR-181: Agent Team Start Ritual and Action-Trace Surface

**Status**: Accepted 2026-05-14 (Verdant Swaying Glade session, owner direction)
**Date**: 2026-05-14
**Related**:
[ADR-119](119-agentic-engineering-practice.md) - agentic engineering practice;
[ADR-125](125-agent-artefact-portability.md) - canonical skill and adapter
topology;
[ADR-131](131-self-reinforcing-improvement-loop.md) - learning loop;
[ADR-135](135-agent-classification-taxonomy.md) - agent capabilities and modes;
[ADR-150](150-continuity-surfaces-session-handoff-and-surprise-pipeline.md) -
continuity and handoff surfaces.

## Acceptance (2026-05-14)

Decisions 1–3 are operational at acceptance time:

- **Decision 1** (`start-right-team` skill): canonical at
  [`.agent/skills/start-right-team/SKILL-CANONICAL.md`](../../../.agent/skills/start-right-team/SKILL-CANONICAL.md)
  with platform adapters under `.agents/skills/oak-start-right-team/SKILL.md`
  and `.claude/skills/start-right-team/SKILL.md`. Landed at commit
  `bfa26e01`.
- **Decision 2** (route by live pressure, temporary responsibility):
  operational through the canonical skill body (`§ Pressure-First
Routing`, `§ Temporary Responsibilities With Expiry`). Live empirical
  validation runs through the _self-assigned roles_ experiment scoped
  in [`.agent/prompts/agentic-engineering/collaboration/falsification-criteria.md` § Primitive 1 — Modes, not roles](../../../.agent/prompts/agentic-engineering/collaboration/falsification-criteria.md);
  see also the related coordinator-PDR deferral in
  [`.agent/memory/operational/pending-graduations.md` § coordinator-role-as-allocator-not-gatekeeper (PDR candidate)](../../../.agent/memory/operational/pending-graduations.md).
  The ADR's meta-shape (route by pressure; name boundary; expire on
  completion) is upstream of any specific role label set; the
  experiment's outcomes feed PDR-shaped doctrine downstream of this
  ADR, not back-pressure on this ADR's acceptance.
- **Decision 3** (separate team handoff from individual handoff):
  operational through the team-aware
  [`session-handoff` SKILL-CANONICAL.md `§ Team-Member Handoff Mode`](../../../.agent/skills/session-handoff/SKILL-CANONICAL.md).
  Landed at commit `498edcc2`.

Decision 4 (action-trace event surface) remains explicitly proposed-only,
as the ADR text states. Schema design and rendered-view design are
tracked as a separate collaboration-state slice, listed under §Follow-up
below. Acceptance of decisions 1–3 does not commit to a specific
action-trace schema; that decision is deferred to the slice that delivers
it.

Acceptance authority: owner direction in the 2026-05-14 Verdant Swaying
Glade session ("1 and 3 in this session" — graduation pass plus ADR-181
status flip). Companion graduation pass landed in the same session; see
[`.agent/memory/active/distilled.md` § Graduations Log — 2026-05-14 Verdant Swaying Glade Route C-iv](../../../.agent/memory/active/distilled.md).

## Context

Recent multi-agent P8 work showed that a team can move faster and safer when
agents take temporary responsibilities based on live pressure: implementation
bundle, reviewer challenge, shared git/index marshal, scout, standby, or
controller synthesis. The value came from the bounded responsibility and the
signal each role produced, not from a permanent organisation chart.

The same session also exposed two gaps:

1. Existing start-right skills ground a single agent well, but they do not
   establish a team-level operating contract before work is allocated.
2. `session-handoff` is session-scoped. When every team member runs the full
   handoff ritual, the team produces redundant continuity edits and extra
   state for the controller to reconcile.

In parallel, the team needs an auditable action trace that is distinct from
comms. Comms is a two-way coordination channel for current work. An action
trace is a one-way audit and understanding trail: it helps future agents,
reviewers, and consolidators reconstruct why meaningful actions happened.

## Decision

This ADR proposes three related decisions.

### 1. Add `start-right-team` as the team entry ritual

Create a canonical `.agent/skills/start-right-team/SKILL-CANONICAL.md` skill
with thin platform adapters under `.agents/skills/` and `.claude/skills/`.

The skill must first point every participant at
`.agent/skills/start-right-quick/shared/start-right.md`. Team sessions inherit
the same durable directives, rules, identity checks, claims/comms checks, plan
checks, and git-state checks as existing start-right sessions. Team guidance is
an additional layer, not a shortcut.

### 2. Route by live pressure and temporary responsibility

Team roles are not fixed for a whole session. The team names the coordination
pressure first, then assigns temporary responsibilities with explicit evidence,
expiry, and decision defaults.

Candidate labels such as controller, implementer, reviewer, marshal, scout,
standby, and consolidator are examples, not a mandatory ontology. The canonical
field is the boundary owned: source bundle, review verdict, git/index window,
next-slice scouting, liveness, owner escalation, or session synthesis.

### 3. Separate team handoff from individual handoff

Only one agent should own the full session handoff in a team session unless the
owner directs otherwise. Non-closeout agents provide boundary-scoped syntheses:
outcome, evidence, claims/queue/git state, changed understanding, blockers,
and handoff needs.

The closeout owner synthesises those notes with live comms, directed messages,
claims, queue state, git status/log, and the relevant plan before updating
canonical continuity surfaces.

### 4. Explore a dedicated action-trace event surface

The action trace is proposed as a future event stream, not implemented by this
ADR. Each meaningful event should capture:

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

The trace should avoid hidden chain-of-thought. The target is auditability:
enough reasoning and evidence for a future agent to understand and verify the
action.

## Consequences

### Positive

- Team sessions start from the same grounded requirements as individual
  start-right sessions.
- Roles remain emergent and reversible, reducing the risk of importing human
  organisation structures that do not fit agent teams.
- Full session handoff happens once, while each participant still contributes
  boundary-specific context.
- The proposed action-trace surface gives audit and learning-loop readers a
  clearer record than comms alone.

### Negative / trade-offs

- `start-right-team` adds another ritual surface. It must stay small enough to
  help teams move, not become ceremony before work.
- Avoiding a fixed role ontology makes machine enforcement harder. The first
  version relies on agents naming boundaries honestly.
- An action trace can become performative or noisy if required for every tiny
  action. Tooling should focus on decisions, verifications, blockers, and
  coordination-visible state changes.

### Follow-up

- Test `start-right-team` in the next multi-agent session and compare route
  clarity, duplicate closeout residue, and missed context against the P8 team
  session.
- Decide whether `session-handoff` needs an explicit team-member mode after the
  first trial.
- Design the action-trace schema and rendered views as a separate
  collaboration-state slice.
