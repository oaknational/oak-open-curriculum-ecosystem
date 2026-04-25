# Respect Active Agent Claims

Operationalises the area-consultation tripwire from
[`agent-collaboration.md`](../directives/agent-collaboration.md) §Scope
Discipline Across Agent Boundaries.

## Rule

**Before operating in an area another agent has named in a recent
embryo-log entry, consult the surface and decide how to coordinate.
Document your decision in the embryo log. Do not proceed until you
have consulted, decided, and logged.**

The substance of the decision is yours. Available options at WS0:

- **proceed with caution** — log your decision and proceed (WS0);
- **ping the other agent via the embryo log** — append a directed note
  asking for clarification (WS0);
- **request a sidebar** — short-lived focused exchange by mutual
  agreement *(available from WS3)*;
- **ask the owner** — `AskUserQuestion` for hard-blocking sync
  (always available).

This rule **does not refuse entry** to claimed areas. It fires as a
tripwire — *consult, decide, log* — not as a refusal — *do not enter*.
The logged decision is the artefact that proves consultation.

Mechanical refusal is explicitly out of scope per
[`agent-collaboration.md`](../directives/agent-collaboration.md) §Knowledge
and Communication, Not Mechanical Refusals.

## Provisional definition of "area"

Any file path, plan, ADR, or workspace currently named in another
agent's recent embryo-log entry. From WS1 onwards, this expands to
include any entry in `.agent/state/collaboration/active-claims.json`.

"Recent" is intentionally fuzzy at WS0 — the embryo log has no TTL or
freshness signal. **Concrete-now bridge: treat any entry from the past
24 hours as recent.** Older entries are noise to be audited at
consolidation, not blockers. WS1 replaces this fuzz with the
`freshness_seconds` field (default 14400 = 4 hours) on structured
claims.

## Discovery surface (WS0)

`.agent/state/collaboration/log.md` — schema-less, append-only,
eventually-consistent. Read recent entries before non-trivial edits;
write your own entry naming what you intend to touch.

The
[`use-agent-comms-log.md`](use-agent-comms-log.md) rule installs the
write side of this discipline.

## Forward references

- **WS1** introduces structured claims at
  `.agent/state/collaboration/active-claims.json` with a
  freshness-seconds field. The
  [`register-active-areas-at-session-open`](register-active-areas-at-session-open.md)
  rule (forward reference) implements the structured tripwire and
  subsumes much of this rule's surface.
- **WS3** introduces conversation files and the sidebar mechanism for
  structured peer exchange when overlap warrants it.

## Bootstrap fast-path

If the embryo log has no recent entries from other agents (and, from
WS1, `active-claims.json` has no entries other than yours), log "no
other agents present" to the embryo log and proceed without further
coordination overhead.

## Cross-references

- Containing directive:
  [`agent-collaboration.md`](../directives/agent-collaboration.md).
- Companion write-side rule:
  [`use-agent-comms-log.md`](use-agent-comms-log.md).
- Identity discipline:
  [`register-identity-on-thread-join.md`](register-identity-on-thread-join.md)
  (sibling tripwire pattern).
