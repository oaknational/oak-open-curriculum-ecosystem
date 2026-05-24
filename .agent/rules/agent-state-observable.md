# Agent State That Affects Other Agents Must Be Observable

Operationalises
[PDR-056 (Inter-Agent Collaboration Protocol)](../practice-core/decision-records/PDR-056-inter-agent-collaboration-protocol.md)
and
[ADR-150 (Continuity Surfaces, Session Handoff, and Surprise Pipeline)](../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md).
Composes with the comms-event-stream-as-canonical-truth principle in
[`follow-agent-collaboration-practice.md`](follow-agent-collaboration-practice.md)
§"Inter-Agent Comms Is First-Class And Parallel-Default".

## Rule

**Agent state that affects another agent's next action MUST be expressed as an observable artefact (comms-event, claim, conversation entry, or other durable surface), not held only in the agent's session reasoning.**

The structural property: if state-X-of-agent-A determines action-Y-of-agent-B, then state-X cannot live only in A's head. B can only act on what A surfaces.

## Common applications

### Queue-wait dependency

When agent A is blocked behind agent B's commit-queue intent, A emits a directed comms-event:

- `kind: directed`
- `to: <agent B's identity tuple>`
- `subject`: `Waiting on intent <intent-id>`
- `body`: A's own intent ID, A's claimed files, A's expected wait condition (e.g. "until cf39fd43 phase: completed OR expires at <iso>").

Once ADR-183 substrate lands, the event carries `tags: ['queue-wait']` for first-class classification.

Without this signal, A's wait is invisible — if A crashes (compaction, network), B never knows A was waiting; if a third agent C arrives, C cannot see A is queued.

### Long-running sub-agent dispatch

When agent A has dispatched a sub-agent (code-expert, type-expert, etc.) and the dispatch is expected to take >120s, A emits a progress event naming the dispatch's purpose, the sub-agent type, and the absorb-by deadline. If A crashes mid-dispatch, peers and owner know what's outstanding.

### Blocked-on-owner-direction

When agent A has surfaced an owner-class question via `AskUserQuestion` or directed comms and is waiting on response, A emits a brief broadcast naming the question, the surface (chat / directed comms), and the expected continuation.

### Holding the gate-runner role

Per the check-singleton-per-window invariant: when agent A is running `pnpm check` (or another whole-repo gate sweep), A emits a broadcast naming the gate, the started-at timestamp, and the expected finish window. Other agents observe and do not start a parallel run.

## Forbidden shapes

- **Silent polling**: A polls B's queue / claim / file state every N seconds with no observable signal that A is waiting. Forbidden because A's wait is invisible to peers and owner.
- **Reasoning-only state**: A's session reasons "I'm waiting on B" but never emits an event. Forbidden because reasoning evaporates at compaction or crash.
- **Polling without surface**: even when polling is the right tactic, the wait state itself must be observable.

## What does NOT need surfacing

- Internal sub-agent dispatches that return within the team-cadence interval (≤120s).
- Local file operations that do not affect other agents.
- Reasoning that does not gate any inter-agent action.

The rule is "state that affects another agent's next action", not "all agent state". The triage is local.

## Source attribution

Graduated 2026-05-22 from `.agent/memory/operational/pending-graduations.md` candidate `queue-wait-observable-signal`, broadened from queue-wait-specific to general agent-state-observability. Worked instance: Mistbound Slipping Night blocked behind Stormbound's queue intent (timestamped 2026-05-22T15:33Z) with no observable signal — wait state lived only in Mistbound's reasoning; would have been silent polling if Stormbound had committed rather than abandoned.

## Cross-references

- Composes with [`follow-agent-collaboration-practice.md`](follow-agent-collaboration-practice.md) §"Inter-Agent Comms Is First-Class And Parallel-Default" — the channel principle.
- Composes with [`handoff-messages-self-contained.md`](handoff-messages-self-contained.md) — when the observed state requires receiver action, the surfacing message must be self-contained.
- Adjacent to [PDR-064 coordinator handoff two moments](../practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md) — coordinator-role transitions are an instance of this rule (the role state IS observable via the two events).
