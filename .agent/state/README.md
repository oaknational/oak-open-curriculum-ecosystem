# Agent State

This directory holds **live, ephemeral, signal-like state** that describes
*what is happening now* in the working tree. It is distinct from
[`.agent/memory/`](../memory/), which holds **durable lessons-learned**
that describe *truth across time*.

## State vs Memory

| Aspect | `.agent/state/` (this directory) | `.agent/memory/` |
| --- | --- | --- |
| Lifecycle | Ephemeral; entries archived or expire | Durable; entries survive across sessions |
| Shape | Signal-like (claims, heartbeats, embryo notes) | Lessons-learned (patterns, distilled rules, executive cards) |
| Truth | Truth-of-now | Truth-across-time |
| Update cadence | Per-session, per-edit | Per-graduation through the capture→distil→graduate flow |
| Audit | At consolidation: archive stale entries, surface anomalies | At consolidation: extract napkin observations into distilled rules |

The two surfaces feed each other. Live coordination state in `.agent/state/`
generates evidence; that evidence is captured in the napkin and graduates
into `.agent/memory/` lessons when patterns earn promotion. Lessons in
`.agent/memory/` shape how state surfaces are designed and used.

## Current Sub-Surfaces

### `.agent/state/collaboration/`

Installed by WS0 of the
[`multi-agent-collaboration-protocol`](../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md)
plan.

- [`log.md`](collaboration/log.md) — embryonic discovery log
  (schema-less, append-only, eventually-consistent). Discovery surface
  for sequential agents at session-open. Coexists with structured
  surfaces installed by later workstreams.

WS1, WS3, and WS4 introduce additional structured surfaces alongside the
embryo log: `active-claims.json` (WS1), `closed-claims.archive.json`
(WS1), `conversations/` (WS3), and `escalations/` (WS3). Each surface has
its own schema and lifecycle, documented at the point of introduction.

## Authority

This directory is governed by:

- [`.agent/directives/agent-collaboration.md`](../directives/agent-collaboration.md)
  — agent-to-agent working model.
- [`.agent/rules/respect-active-agent-claims.md`](../rules/respect-active-agent-claims.md)
  — area-consultation tripwire.
- [`.agent/rules/use-agent-comms-log.md`](../rules/use-agent-comms-log.md)
  — embryo-log usage discipline.

## Lifecycle Discipline

- **Append-only on the embryo log** — chronological appending; no
  rotation, no archive at WS0; no schema other than "use this."
- **Sign every entry with the PDR-027 agent identity** — `agent_name`,
  `platform`, `model`, `session_id_prefix` (or `unknown`).
- **Stale entries become noise to be audited at consolidation**, not
  blockers — see
  [`.agent/commands/consolidate-docs.md`](../commands/consolidate-docs.md)
  for the audit step (WS1 introduces archival of stale claims to
  `closed-claims.archive.json`).
