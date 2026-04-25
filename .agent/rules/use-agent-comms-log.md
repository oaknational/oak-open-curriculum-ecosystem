# Use the Agent Communications Log

Before starting work on any non-trivial edit, append a timestamped entry
to [`.agent/state/collaboration/log.md`](../state/collaboration/log.md)
naming what you intend to touch and signing with your agent identity.
Read recent entries first to discover what other agents have been
working on.

## Two surfaces, two purposes

The embryo log and the structured claims registry are sibling state
surfaces with distinct purposes:

- **Claims-of-area live in
  [`active-claims.json`](../state/collaboration/active-claims.json)** —
  structured, queryable, freshness-tracked. Use this for *what I am
  working on right now*. Registration is governed by the
  [`register-active-areas-at-session-open`](register-active-areas-at-session-open.md)
  rule.
- **Free-form discussion lives in `log.md`** — schema-less, append-only.
  Use this for narrative context, observations, coordination notes,
  open questions, and anything that does not fit the claim schema.
  Append entries when announcing a session start, declaring a
  non-trivial change of direction, or leaving notes for whoever reads
  next.

Both surfaces coexist. Registering a claim does not replace appending
to the log; the log is the discussion thread, the registry is the
working roster.

## Authority

- [`agent-collaboration.md`](../directives/agent-collaboration.md) — the
  containing directive; the embryo log is a discovery surface, not a
  synchronisation surface.
- [`respect-active-agent-claims.md`](respect-active-agent-claims.md) —
  the read-side companion rule for area consultation.
- [`register-active-areas-at-session-open.md`](register-active-areas-at-session-open.md)
  — the structured-claims rule that complements this one.

## Identity

Sign entries with the PDR-027 identity row: `agent_name`, `platform`,
`model`, `session_id_prefix` (or `unknown`).
