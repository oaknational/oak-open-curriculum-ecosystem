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

## Continuation Pointer Contract

When invoked as `start-right-team continue <thread>` or with equivalent
continuation language, treat the opener as a pointer and hypothesis, not as the
source of volatile truth.

1. Resolve the named thread through
   `.agent/memory/operational/threads/<thread-slug>.next-session.md`.
2. Read the continuation record before choosing a team route. It owns the
   current branch, controlling plan, next safe step, live acceptance bar, and
   any thread-specific team expectation.
3. Recompute current facts from live grounding surfaces before acting:
   identity preflight, active claims, shared comms, active commit queue, active
   plans, and git status/log.
4. Treat any team shape in the continuation record as a hint unless it is an
   owner instruction or live coordination has already assigned it. Solo work is
   valid when no team has registered; a team may self-organise only after live
   presence and coordination pressure are clear.
5. Keep volatile facts out of chat openers and permanent skill text. The skill
   owns routing behaviour; the continuation record owns current thread facts.

## Team Bootstrap

After the shared foundation is complete, establish a session-local operating
contract. Keep it lightweight and revisable.

### 0. Start The All-Channels Comms Monitor (non-negotiable)

**Communication is the absolute heart of multi-agent work.** Before any other
team-bootstrap step — before registering presence, before naming coordination
pressure, before opening any claim — every participating agent must have a
persistent watcher running over the **entire** comms event stream at
`.agent/state/collaboration/comms/`.

The comms event stream is the canonical truth. Public (broadcast), group
(narrative with `audience` or `addressed_to`), direct (`directed` kind, and
narrative with `addressed_to` matching the agent), and lifecycle messages are
all valid views onto the same stream, and **all are important**. A watcher
that filters to a single view (e.g. `comms watch` in its current
directed-only shape, or manual `ls -t` polling of the shared dir) discards
the others and will miss vital coordination.

The required shape is **one event-driven watcher** over the full directory,
emitting one notification per new event, with **self-exclusion only** —
filter out events authored by the agent's own
`(agent_name, platform, session_id_prefix)` identity tuple (per
[`.agent/reference/comms-watch-mechanism.md`](../../reference/comms-watch-mechanism.md)
§"Identity discipline") and emit everything else. The agent applies any
relevance triage in their own reasoning, not at the watcher boundary.

Reference shape (run via the harness Monitor / equivalent persistent
mechanism):

```bash
SEEN=/tmp/<agent>-comms-seen.txt
ls .agent/state/collaboration/comms | sort > "$SEEN"
while true; do
  ls .agent/state/collaboration/comms | sort > /tmp/now.txt
  for f in $(comm -13 "$SEEN" /tmp/now.txt); do
    jq -r --arg self "$SELF_SESSION_PREFIX" '
      if (.author.session_id_prefix // .from.session_id_prefix // "") == $self
      then empty
      else "[" + .created_at + "] "
           + ((.author.agent_name // .from.agent_name // "?") + "/"
              + (.author.session_id_prefix // .from.session_id_prefix // "?"))
           + " -> " + (
               if (.to // null) != null
               then (.to.agent_name // "?") + "/" + (.to.session_id_prefix // "?")
               elif (.addressed_to // null) != null then .addressed_to
               elif (.audience // null) != null
               then "GROUP(" + (.audience | join(",")) + ")"
               else "BROADCAST"
               end
             )
           + " :: " + (.title // .subject // "?")
      end' ".agent/state/collaboration/comms/$f"
  done
  mv /tmp/now.txt "$SEEN"
  sleep 5
done
```

A participating agent that cannot run such a watcher (platform without a
persistent background-task primitive) must declare the gap in their team
presence post and adopt a polling cadence that sweeps the full directory at
the team-cadence interval, never a single-view filter.

The `agent-tools` CLI surfaces (`comms watch`, `comms inbox`) default to
all-channels behaviour when available; a `--only-directed` flag opts into
the narrow view. If the local CLI build still filters to directed-only by
default, treat that as a known gap and use the script form above until the
build catches up.

### 1. Register Presence

Each agent posts a short team-start report **before any source claim** and
before non-trivial work:

```text
Team start report:
- Identity:
- Foundation: complete / blocked by <path or command>
- Intended boundary: <files / paths / behaviour the agent expects to own>
- Claim status: none yet / pending team rendezvous / open <claim_id>
- Useful capability:
- Constraint or risk:
- Preferred boundary, if any:
```

`Intended boundary` is a non-binding declaration of *where* the agent expects
to work; `Claim status` reports the live registry state. Role labels in the
sections below are examples, not doctrine — describe the boundary first and
pick a label that fits.

**Singleton-lane rendezvous rule** (added 2026-05-20 per singleton-lane
remediation plan §WS1). When the owner has launched identical
`start-right-team` prompts to multiple agents AND the next safe step on the
relevant thread is a narrow single-owner source slice (a singleton lane),
the team-start report is the rendezvous surface, not the claim. Concretely:

- An empty `active-claims.json` at session open means *"no team visible
  yet"*, NOT *"safe solo ownership of the singleton slice"*. Other
  identically-prompted agents may be in the same window and have not yet
  reached the registration step.
- Each agent posts presence with `Claim status: none yet / pending team
  rendezvous` before opening any source claim on the singleton lane.
- An agent may open a source claim on the singleton lane only after one of:
  (a) all participating agents have posted presence and exactly one has
  been routed to the source slice (the first-overlap response is pending
  WS1 completion — see thread record); (b) a documented team-routing
  lease exists (claim with `team_routing_required: false`, see WS2); or
  (c) sufficient time has elapsed that the agent reasonably concludes no
  team is present — the silent default, used with care because the failure
  mode is duplicate parallel claims.

Normal solo work and broad parallelisable work (where overlapping claims
are safe because the surfaces don't conflict) are unaffected by this rule;
the rendezvous contract applies only to singleton-lane work.

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

### 5. Maintain The Team Cadence

Once a team session is active, every participating agent must check for new
messages of any type at least once every 120 seconds until they close out or
are explicitly released from the team route. Use a tighter cadence when the
owner or controller sets one.

The message sweep must cover every live surface that can carry session
coordination:

- owner chat for current-turn direction;
- directed inbox / directed comms addressed to the agent;
- shared comms for team-wide updates;
- active claims and active commit queue for ownership or git-order changes;
- relevant conversations, sidebars, joint decisions, and escalations when the
  current route depends on structured async coordination.

Each participating agent must also report progress at least once every 120
seconds. A progress report can be a brief owner-facing update, a shared-comms
entry, or a directed reply, depending on the team route. It should name the
current state, any blocker, and the next action. Silence is only acceptable
after the agent has been explicitly released, closed out, or told to stop
reporting.

### 6. Revise The Route As The Work Changes

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

Every participating agent must close their own team presence explicitly before
leaving the session, even when they did not own the full handoff. At minimum,
they tell the other agents that their session is complete, name whether any
work remains in their boundary, and state the claim disposition.

The default closeout state is **no active claims retained**. Relinquish every
claim the session opened before leaving. Keep a claim active only when there is
a specific handoff reason for a follow-on agent, and make that reason explicit
in the closeout message: which claim remains, what boundary it protects, who or
what session should pick it up, and when it should be released if the follow-on
does not arrive.

When a later agent picks up a session, claim, or boundary that was retained for
handoff, they must notify the other agents before acting. The pickup message
must name the retained claim or boundary, confirm whether they are continuing,
closing, or replacing that claim, and state their next coordination-visible
action.

Non-closeout agents provide a boundary-scoped synthesis instead of running the
full `session-handoff` workflow:

```text
Team member closeout:
- Boundary owned:
- Outcome:
- Evidence:
- Claims / queue / git state:
- Session complete announcement:
- Retained claims, if any, and handoff reason:
- Pickup notification required for follow-on agent:
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
