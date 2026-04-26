# Agent State

This directory holds **live, ephemeral, signal-like state** that describes
*what is happening now* in the working tree. It is distinct from
[`.agent/memory/`](../memory/), which holds **durable lessons-learned**
that describe *truth across time*.

## State vs Memory

| Aspect | `.agent/state/` (this directory) | `.agent/memory/` |
| --- | --- | --- |
| Lifecycle | Ephemeral; entries archived or expire | Durable; entries survive across sessions |
| Shape | Signal-like (claims, heartbeats, coordination notes) | Lessons-learned (patterns, distilled rules, executive cards) |
| Truth | Truth-of-now | Truth-across-time |
| Update cadence | Per-session, per-edit | Per-graduation through the capture→distil→graduate flow |
| Audit | At consolidation: archive stale entries, surface anomalies | At consolidation: extract napkin observations into distilled rules |

The two surfaces feed each other. Live coordination state in `.agent/state/`
generates evidence; that evidence is captured in the napkin and graduates
into `.agent/memory/` lessons when patterns earn promotion. Lessons in
`.agent/memory/` shape how state surfaces are designed and used.

## Current Sub-Surfaces

### `.agent/state/collaboration/`

Installed by WS0 onward of the
[`multi-agent-collaboration-protocol`](../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md)
plan.

- [`log.md`](collaboration/shared-comms-log.md) — shared communication log
  (schema-less, append-only, eventually-consistent). Discovery surface
  for sequential agents at session-open. Coexists with structured
  surfaces installed by later workstreams.
- [`active-claims.json`](collaboration/active-claims.json) — live "I am
  touching this area or the git index/head commit window now" registry
  (WS1 + commit-window refinement).
- [`closed-claims.archive.json`](collaboration/closed-claims.archive.json)
  — durable claim-closure history for explicit, stale, and owner-forced
  closes (WS3A).
- [`conversation.schema.json`](collaboration/conversation.schema.json) and
  [`conversations/`](collaboration/conversations/) — lightweight async
  decision-thread contract and examples for structured overlap discussion
  (WS3A).

WS3B sidebar, timeout, and owner-escalation surfaces remain
evidence-gated. Do not create `.agent/state/collaboration/escalations/`
unless the owner explicitly promotes the sibling plan or real
decision-thread evidence proves async coordination insufficient.

## Authority

This directory is governed by:

- [`.agent/directives/agent-collaboration.md`](../directives/agent-collaboration.md)
  — agent-to-agent working model.
- [`.agent/rules/respect-active-agent-claims.md`](../rules/respect-active-agent-claims.md)
  — area-consultation tripwire.
- [`.agent/rules/use-agent-comms-log.md`](../rules/use-agent-comms-log.md)
  — shared-communication-log usage discipline.
- [`.agent/memory/operational/collaboration-state-conventions.md`](../memory/operational/collaboration-state-conventions.md)
  — operational lifecycle and channel-selection guidance for collaboration
  state.

## Lifecycle Discipline

- **Append-only on the shared communication log** — chronological appending; no
  rotation, no archive at WS0; no schema other than "use this."
- **Sign every entry with the PDR-027 agent identity** — `agent_name`,
  `platform`, `model`, `session_id_prefix` (or `unknown`).
- **Stale entries become noise to be audited at consolidation**, not
  blockers — see
  [`.agent/commands/consolidate-docs.md`](../commands/consolidate-docs.md)
  for the audit step. It reports active/stale claims, recent closures,
  open/stale decision threads, unresolved decision requests, and
  evidence-bundle gaps.
- **Decision threads stay narrow** — use them for concrete async
  decisions and evidence. Use the shared log for lightweight discovery,
  active claims for live ownership and commit windows, the napkin for
  learning, and thread records for cross-session lane state.
