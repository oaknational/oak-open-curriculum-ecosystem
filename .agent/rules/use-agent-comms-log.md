# Use the Shared Communication Log

Before starting work on any non-trivial edit, append a timestamped comms
event that renders into
[`.agent/state/collaboration/shared-comms-log.md`](../state/collaboration/shared-comms-log.md),
naming what you intend to touch and signing with your agent identity.
Use UTC ISO 8601 timestamps with a trailing `Z` for shared log headings and
structured collaboration state. Read recent entries first to discover what
other agents have been working on.

The owner is currently in the Europe/London timezone. Agents may mention
owner-local time in prose when it helps human coordination, but UTC is the
canonical timestamp for claims, queues, conversations, escalations, archives,
and stale/fresh calculations.

## Related surfaces, distinct purposes

The shared communication log, structured claims registry, and decision
threads are sibling state surfaces with distinct purposes:

- **Claims-of-area live in
  [`active-claims.json`](../state/collaboration/active-claims.json)** —
  structured, queryable, freshness-tracked. Use this for *what I am
  working on right now*. Registration is governed by the
  [`register-active-areas-at-session-open`](register-active-areas-at-session-open.md)
  rule.
- **Free-form discussion lives in immutable comms events rendered to
  `shared-comms-log.md`**. Use this for narrative context, observations,
  coordination notes, open questions, and anything that does not fit the claim
  schema. Append events when announcing a session start, declaring a
  non-trivial change of direction, or leaving notes for whoever reads next.
- **Structured async decisions live in
  [`conversations/`](../state/collaboration/conversations/)** —
  versioned decision-thread JSON. Use this when coordination needs a
  concrete `decision_request`, sidebar, joint decision, `decision`,
  `resolution`, or evidence bundle.
- **Owner escalations live in
  [`escalations/`](../state/collaboration/escalations/)** — one
  schema-backed file per unresolved owner-facing case. Use this only after
  a conversation entry exists; write the owner resolution back to the
  conversation and close the escalation by reference.

These surfaces coexist. Registering a claim does not replace appending
to the log; opening a decision thread does not replace either. The log
is the discovery narrative, the registry is the working roster, and a
decision thread is the structured async record for a specific topic.
If those responsibilities start to blur, capture that as a domain-model
signal in the napkin or an active plan rather than adding another
ad-hoc field to an existing surface.

## Event Authoring Contract

The rendered `shared-comms-log.md` is a generated view, not an authoring
surface. Do not edit it directly. Author narrative comms by writing a schema-
valid event under `.agent/state/collaboration/comms/`, normally through
`pnpm agent-tools:collaboration-state -- comms append`, then render the shared
log from those events. A direct markdown append can be overwritten by the next
render and may create a false handoff claim that no peer can actually read.

## Coordinated-session comms cadence (non-blocking)

Single team protocol: keep discoverability warm without turning comms into a
gate on implementation.

This discipline applies to every in-session agent, including in-IDE Cursor
agents — the foreground Cursor chat agent and any in-IDE Cursor worker
subagents — on equal footing with platform-isolated sessions (Codex,
Claude Code, etc.). In-IDE Cursor agents perform comms passes
**event-driven, between tool batches, at the checkpoints below** — never on
a fixed wall-clock loop. Any continuous wall-clock polling cadence (e.g. a
30-second `sleep` loop) belongs only to the dedicated sidecar / coordinator
monitor process running under the coordinator's identity; in-IDE agents
must not block their own work on such a timer.

When a session joins a coordinated team with an identified coordinator, its
first comms-log write MUST be a concise introduction addressed to that
coordinator before non-trivial work begins. This introduction requirement
applies identically to in-IDE Cursor agents (foreground and any in-IDE
worker subagents); each in-IDE agent's first non-trivial comms write must
be its own introduction. For the current coordinated team, address the
introduction to **Wooded Spreading Thicket** and include: agent
identity/name; role or scope; claimed paths, or `none` if no claim is held;
expected update cadence; and how the agent will respond to coordinator
messages.

1. **Three checkpoints only** — run one **comms pass** (read sequence below)
   capped at **90 seconds**: **(a)** after identity rows are current per
   [`register-identity-on-thread-join`](register-identity-on-thread-join.md)
   and before the first non-trivial edit; **(b)** immediately before
   delegating work to another agent, opening a commit or staging window outside
   your claim bundle, or editing paths another peer names in a fresh log
   heading or active claim; **(c)** at turn-close **only when** this turn
   mutated collaboration state (claims, comms events, `commit_queue`,
   conversations, escalations) or chose overlap-risk paths. Do **not** insert a
   pass after every tool batch during uninterrupted work inside your declared
   scope.

2. **Read order (every pass)** — (1)
   [`active-claims.json`](../state/collaboration/active-claims.json)
   (includes advisory root `commit_queue`); (2) the newest slice of
   [`shared-comms-log.md`](../state/collaboration/shared-comms-log.md) until
   recent peer intent is clear (typically the latest handful of headings,
   expanding into bodies only when overlap is plausible); (3) **only if** the
   next action depends on structured async coordination — the specific thread
   file under [`conversations/`](../state/collaboration/conversations/) or
   [`escalations/`](../state/collaboration/escalations/), not a directory-wide
   crawl.

3. **Write minimum** — append one rendered log entry when you discover
   overlap, change coordination intent, complete a coordination-visible
   milestone, or exercise the coordinator role; keep the body short (tight
   prose or a few bullets); sign with the PDR-027 identity row per §Identity
   below.

4. **Coordinator vs worker** — workers follow 1–3. An agent claiming the
   coordinator role uses the same checkpoints but **also** posts
   bounded-deadline comms and ordering signals (`commit_queue`, pause/resume
   notes) as defined in [`agent-collaboration.md`](../directives/agent-collaboration.md)
   §Coordinator Role; workers respond once when addressed, then resume unless a
   deadline pause applies.

   During selective pauses, owner or coordinator unblock hints apply only to
   the named audience. A paused agent may resume only when the hint names them,
   names all paused agents, or explicitly says the signal is general. If scope
   is ambiguous, stay paused and ask whether the unblock applies to you instead
   of self-routing from a hint aimed at another agent.

## Comms-system tooling improvements route as proposals

Improvements to the comms-system tooling — the agent-tools
`collaboration-state` CLI surface, its supporting state schemas, and the
sidecar / monitor patterns that wrap them — are proposed to the active
coordinator as candidate additions, not implemented unilaterally. Author a
narrative comms event addressed to the coordinator that names the proposed
CLI shape (command + key flags), its inputs and outputs, the recurring
manual step it replaces, and a status line marking each item as proposed
(not approved). Await coordinator approval before opening an implementation
claim, a branch, or any source edit under `agent-tools/src/collaboration-state/`.
The coordinator may accept, reject, sequence, or batch the proposal; the
worker takes the implementation slice only after the verdict lands.

## Authority

- [`agent-collaboration.md`](../directives/agent-collaboration.md) — the
  containing directive; the shared communication log is a discovery surface, not a
  synchronisation surface.
- [`respect-active-agent-claims.md`](respect-active-agent-claims.md) —
  the read-side companion rule for area consultation.
- [`register-active-areas-at-session-open.md`](register-active-areas-at-session-open.md)
  — the structured-claims rule that complements this one.
- [`conversation.schema.json`](../state/collaboration/conversation.schema.json)
  — decision-thread schema authority.
- [`escalation.schema.json`](../state/collaboration/escalation.schema.json)
  — owner-escalation schema authority.
- [`collaboration-state-write-safety.plan.md`](../plans/agent-tooling/current/collaboration-state-write-safety.plan.md)
  — current comms-event and transaction-helper implementation plan.

## Identity

Sign entries with the PDR-027 identity row: `agent_name`, `platform`,
`model`, `session_id_prefix` (or `unknown`).

When `CODEX_THREAD_ID` exists, Codex entries must use
`pnpm agent-tools:collaboration-state -- identity preflight ...` or an
equivalent wrapper so `agent_name` and `session_id_prefix` are deterministic,
not `Codex` / `unknown`.
