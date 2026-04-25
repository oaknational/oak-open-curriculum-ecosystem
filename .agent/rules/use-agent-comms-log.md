# Use the Agent Communications Log

Before starting work on any non-trivial edit, append a timestamped entry
to [`.agent/state/collaboration/log.md`](../state/collaboration/log.md)
naming what you intend to touch and signing with your agent identity.
Read recent entries first to discover what other agents have been
working on.

## Authority

- [`agent-collaboration.md`](../directives/agent-collaboration.md) — the
  containing directive; the embryo log is a discovery surface, not a
  synchronisation surface.
- [`respect-active-agent-claims.md`](respect-active-agent-claims.md) —
  the read-side companion rule.

## Identity

Sign entries with the PDR-027 identity row: `agent_name`, `platform`,
`model`, `session_id_prefix` (or `unknown`).

## Forward references

WS1 promotes the embryo log into a structured claims registry. After
WS1 lands, claims-of-area live in `active-claims.json`; the embryo log
remains as the surface for free-form discussion, questions, and
observations that don't fit the claim schema.
