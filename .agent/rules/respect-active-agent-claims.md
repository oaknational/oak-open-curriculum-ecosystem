# Respect Active Agent Claims

Operationalises the area-consultation tripwire from
[`agent-collaboration.md`](../directives/agent-collaboration.md) §Scope
Discipline Across Agent Boundaries.

## Rule

**Before operating in an area another agent has named in a recent
shared-communication-log entry or in an active claim entry in
[`active-claims.json`](../state/collaboration/active-claims.json),
consult the surface and decide how to coordinate. Document your decision
on your own claim entry or as a shared-communication-log note. Do not
proceed until you have consulted, decided, and logged.**

The substance of the decision is yours. Available options:

- **proceed with caution** — register your own claim, document the
  overlap decision in `notes`, and proceed;
- **ping the other agent via the shared communication log** — append a directed note
  citing the other agent's `claim_id`;
- **open or append a decision thread** — create or cite
  `.agent/state/collaboration/conversations/<id>.json` when the overlap
  needs structured async questions, decisions, resolutions, or evidence;
- **request a sidebar** — deferred WS3B mechanism; do not use unless the
  owner explicitly promotes it or decision-thread evidence proves async
  coordination insufficient;
- **ask the owner** — `AskUserQuestion` for hard-blocking sync
  (always available).

This rule **does not refuse entry** to claimed areas. It fires as a
tripwire — *consult, decide, log* — not as a refusal — *do not enter*.
The logged decision is the artefact that proves consultation.

Mechanical refusal is explicitly out of scope per
[`agent-collaboration.md`](../directives/agent-collaboration.md) §Knowledge
and Communication, Not Mechanical Refusals.

## Definition of "area"

Any file path, plan, ADR, workspace, or git transaction surface currently
named in another agent's recent shared-communication-log entry or in an active
claim entry in
[`active-claims.json`](../state/collaboration/active-claims.json).

For shared-communication-log entries, "recent" is bounded by the 24-hour
concrete-now bridge — entries older than 24 hours are noise to be
audited at consolidation, not blockers. For active claims, freshness is
authoritative: the `freshness_seconds` field (default 14400 = 4 hours)
plus optional `heartbeat_at` define the active window; expired claims
are archived by `consolidate-docs § 7e` to
[`closed-claims.archive.json`](../state/collaboration/closed-claims.archive.json)
with `closure.kind: "stale"`. Normal and owner-forced closes use the
same archive with `closure.kind: "explicit"` or `"owner_forced"`.

A fresh claim with `areas.kind: "git"` and `patterns: ["index/head"]`
means another agent is in the short-lived staging/commit window. Do not race
that window; coordinate through the shared log, decision thread, or owner
question. This is not a second mechanical lock, but the default judgement is
to avoid concurrent commit attempts.

## Discovery surfaces

- **Structured claims** — read
  [`active-claims.json`](../state/collaboration/active-claims.json)
  first; this is the queryable roster of who is working where right
  now. The
  [`register-active-areas-at-session-open`](register-active-areas-at-session-open.md)
  rule installs the registration discipline.
- **Free-form discussion** —
  [`.agent/state/collaboration/shared-comms-log.md`](../state/collaboration/shared-comms-log.md)
  remains the narrative surface for context, questions, and
  coordination notes that do not fit the claim schema. The
  [`use-agent-comms-log.md`](use-agent-comms-log.md) rule installs the
  write side of this discipline.
- **Decision threads** —
  [`.agent/state/collaboration/conversations/`](../state/collaboration/conversations/)
  holds structured async decision-thread files when overlap needs concrete
  `decision_request`, `decision`, `resolution`, or evidence entries.

## Forward references

WS3A introduces decision-thread files for structured async peer exchange.
WS3B keeps sidebar, timeout, and owner-escalation mechanics paused until
owner direction or real decision-thread evidence promotes them.

## Bootstrap fast-path

If `active-claims.json` has no entries other than yours and the shared
communication log has no recent (≤ 24 hour) entries from other agents, log
"no other agents present" to the shared communication log and proceed
without further coordination overhead.

## Cross-references

- Containing directive:
  [`agent-collaboration.md`](../directives/agent-collaboration.md).
- Structured-claims registration rule:
  [`register-active-areas-at-session-open.md`](register-active-areas-at-session-open.md).
- Companion write-side rule:
  [`use-agent-comms-log.md`](use-agent-comms-log.md).
- Identity discipline:
  [`register-identity-on-thread-join.md`](register-identity-on-thread-join.md)
  (sibling tripwire pattern).
- Operational guide:
  [`collaboration-state-conventions.md`](../memory/operational/collaboration-state-conventions.md).
- Decision-thread schema:
  [`conversation.schema.json`](../state/collaboration/conversation.schema.json).
