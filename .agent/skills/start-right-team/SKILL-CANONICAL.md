---
name: start-right-team
classification: active
description: Apply repository start-right grounding plus team bootstrapping for multi-agent sessions. Use when a coordinated team is starting, re-grounding, or choosing temporary collaboration responsibilities.
---

# Start Right (Team)

## Goal

Run the same shared repository foundation as `start-right-quick`, then add the
smallest team protocol needed for a coordinated multi-agent session.

This skill does not replace `start-right-quick` or `start-right-thorough`.
It layers team bootstrapping on top of the shared start-right requirements.

## Non-Negotiable Foundation

1. Read `.agent/skills/start-right-quick/shared/start-right.md` end to end.
2. Follow that workflow's referenced reading order. Do not replace it with a
   smaller subset for team sessions.
3. For Codex, Gemini, or any platform that does not auto-load canonical rules,
   read every `.agent/rules/*.md` file listed in `RULES_INDEX.md` before
   substantive work.
4. Run the live collaboration checks named by the shared workflow: identity
   preflight, active claims, shared comms, active commit queue, active plans,
   and git status/log.
5. If the task is architectural, high-risk, planning-heavy, cross-workspace, or
   explicitly asks for thorough grounding, apply `start-right-thorough` after
   the shared quick foundation and before team routing.

The controller or first registered agent must not assign implementation work
until each participating agent has either reported this foundation complete or
named the blocker preventing completion.

## Team Bootstrap

After the shared foundation is complete, establish a session-local operating
contract. Keep it lightweight and revisable.

### 1. Register Presence

Each agent posts a short team-start report before non-trivial work:

```text
Team start report:
- Identity:
- Foundation: complete / blocked by <path or command>
- Claimed paths: <paths or none>
- Useful capability:
- Constraint or risk:
- Preferred boundary, if any:
```

### 2. Name The Coordination Pressure

Before assigning responsibilities, identify the pressure the team is solving:

- source-bundle parallelism;
- review or challenge coverage;
- git, index, commit queue, or claim scarcity;
- next-slice scouting;
- liveness and inbox monitoring;
- owner-facing decision or escalation routing;
- closeout synthesis.

Do not start from a fixed role menu. Start from the pressure, then choose the
temporary responsibilities that match it.

### 3. Choose Temporary Responsibilities

Responsibilities are session-local, bounded, and allowed to change. Prefer
describing the boundary first and the role label second.

```text
Team route:
- Coordination pressure:
- Operating shape:
- Temporary responsibilities:
- Decision default if silent:
- Evidence expected:
- Expiry or next review point:
- Closeout owner:
```

Useful responsibility labels include `controller`, `implementer`, `reviewer`,
`marshal`, `scout`, `standby`, and `consolidator`, but they are examples rather
than a required ontology.

### 4. Work With Traceability

For every meaningful decision, verification, or coordination-visible action,
leave a brief trace in the appropriate current surface:

- comms for live peer coordination;
- claim and commit-queue entries for current ownership and git order;
- decision threads or escalations for structured async decisions;
- the future action-log surface once one exists.

Use concise audit language:

```text
Intent:
Reason:
Action:
Evidence:
Result:
```

Record intent and brief reasoning, not hidden chain-of-thought.

### 5. Revise The Route As The Work Changes

Roles can dissolve when their pressure disappears. A scout can become an
implementer only after a new route, claim, and evidence expectation are posted.
A marshal role should end when the shared scarcity it owns is clear.

If multiple viable routes remain, use a bounded proposal:

```text
Proposal:
Options considered:
Default if no reply by <UTC timestamp>:
Who must object:
```

Use rapid voting or consensus only as an experiment when the team explicitly
needs it; otherwise choose the lowest-authority resolver that can decide.

## Closeout Contract

Only one agent owns the full session handoff unless the owner says otherwise.
In team sessions this is normally the controller or the agent explicitly named
as closeout owner.

Non-closeout agents provide a boundary-scoped synthesis instead of running the
full `session-handoff` workflow:

```text
Team member closeout:
- Boundary owned:
- Outcome:
- Evidence:
- Claims / queue / git state:
- Surprise or changed understanding:
- Blockers or risks:
- Handoff needed:
```

The closeout owner reads those syntheses, current comms, directed messages,
claims, queue state, git status/log, and the relevant plan before updating
canonical continuity surfaces.

## Failure Handling

If a team member cannot complete the shared start-right foundation, stop that
agent's assignment and route the blocker through comms. If the controller and a
team member disagree about responsibility boundaries, open a focused sidebar or
decision thread rather than widening source ownership silently.
