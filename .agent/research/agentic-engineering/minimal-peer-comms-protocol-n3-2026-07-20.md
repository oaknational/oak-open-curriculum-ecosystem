# Minimal peer comms protocol (historical n=3 example)

This is a preserved design example from the former web-app-deconstruction
research workspace, not an active protocol for this repository. It shows how a
three-agent sibling estate reduced OCE's collaboration doctrine to one
append-only channel and an explicit scale boundary. The accompanying channel
log and session state were intentionally not retained.

The example was a deliberately small adaptation of the
[OCE agent-collaboration practice](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/directives/agent-collaboration.md)
and the Resonance rapid-comms (ARC) channel shape, scoped to **at most three
concurrent agents**. One channel file plus this protocol is the whole system.
If the team ever grows past three, graduate to OCE's fuller protocol (structured
claims registry, decision threads, escalations, coordinator role) rather than
stretching this one.

## Working model

Agents here are **reasoning peers**, not constrained subjects. There is no
orchestrator and no peer with veto power. The **owner is the final tiebreaker**,
reached by leaving an owner-addressed note in the channel when peer agreement
does not converge.

Every rule below is a **tripwire, not a lock**. A claim on an area is a
coordination signal — _"I am working here, consult me before you also do"_ — never
a mechanical refusal. Locks are the wrong tool for reasoning peers; they get
routed around at the cost of quality. Consult the surface, then use judgement.

## The one file in the original workspace

The original channel was a single append-only `comms-log.md` file.

- **Tail it**, append turns, never edit prior turns.
  ```bash
  tail -n 0 -F .agent/collaboration/comms-log.md
  ```
- It is **fast comms, not a durable record.** Anything durable — a settled
  finding, a decision, a hypothesis change — is conserved to its canonical home
  (`docs/`, or `.agent/memory/`) separately. The log points at durable homes; it
  does not become a parallel source of truth.

## Identity

Sign every entry with the OCE PDR-027 identity row:
`agent_name · platform · model · session_id_prefix`.

- `session_id_prefix` is the first six hex characters of your session id and is
  the stable identity anchor; `agent_name` is a convenience handle (a session may
  keep it short, e.g. `fable-e8e2f4`).
- Names derive from the session, not the model, so two agents on the same model
  stay distinguishable.

## When to read (arm the tail, then read the whole file once)

Before your first non-trivial edit, and again before entering an area a peer has
named:

1. **Arm the tail, then immediately read the whole file once.** A tail armed with
   `-n 0` shows only _future_ lines; a peer's earlier hold sits invisible until you
   also read the existing content. Arm, then read from the top once. _(This is OCE
   fleet-design pattern 13 — the single most common comms-coordination miss.)_
2. Read the newest entries until recent peer intent is clear; expand older only
   when overlap is plausible.

## When to write

Append a short, signed entry when you:

- **join** — announce session start, your scope, and the paths you intend to touch
  (or `none`);
- **claim** — declare an area before a non-trivial edit (`claiming: <paths>`);
- **change direction** — a non-trivial change from what you last announced;
- **hand off** — leave the next agent a self-contained note (what is done, what is
  live, what is next, where the durable record is);
- **close a turn** — only if this turn touched shared state or overlap-risk paths.

Do **not** insert an entry after every tool batch inside your own declared scope.
Keep bodies tight: a few sentences or bullets.

## Claims (lightweight)

At n=3 there is no separate claims registry. A claim is just a channel entry:

```text
## [<name> <prefix>] <UTC-ISO-8601-Z> — claiming
claiming: docs/current-state/database-tools/**
intent: verify H004 bearing; ~1 session
```

Before editing paths another agent has an open claim on, read their entry and
**coordinate in the channel first**. Overlapping is allowed when the work needs it
— surface it, explain why, let the peer respond. A claim is stale once its author
has handed off or gone quiet for a session; note that you are treating it as stale
rather than silently overriding.

## Timestamps

Use **UTC ISO 8601 with a trailing `Z`** for entry headings (the owner is in
Europe/London; mention local time in prose only if it helps a human). UTC is
canonical for ordering and staleness.

## Scale rule

This protocol assumes **n ≤ 3 and no coordinator role**. The moment a fourth
concurrent agent joins, or a session needs a binding cross-agent decision record,
stop and adopt the OCE structured surfaces instead — do not add ad-hoc fields to
this file.

## Provenance

Adapted 2026-07-20 from OCE
[`use-agent-comms-log`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/rules/use-agent-comms-log.md),
[`agent-collaboration`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/directives/agent-collaboration.md)
and the Resonance rapid-comms channel form. Kept minimal on purpose: one file, one
protocol, tripwires not locks, durable substance conserved elsewhere.
