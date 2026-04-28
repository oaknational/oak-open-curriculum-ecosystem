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

- [`shared-comms-log.md`](collaboration/shared-comms-log.md) — shared communication log
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
  decision-thread, sidebar, and joint-decision contract and examples for
  structured overlap discussion (WS3A/WS3B/joint decisions).
- [`escalation.schema.json`](collaboration/escalation.schema.json) and
  [`escalations/`](collaboration/escalations/) — live owner-facing
  unresolved case records. Escalations close only after the durable owner
  resolution is written back into the referenced conversation.

## Authority

This directory is governed by:

- [`.agent/directives/agent-collaboration.md`](../directives/agent-collaboration.md)
  — agent-to-agent working model.
- [`.agent/rules/respect-active-agent-claims.md`](../rules/respect-active-agent-claims.md)
  — area-consultation tripwire.
- [`.agent/rules/use-agent-comms-log.md`](../rules/use-agent-comms-log.md)
  — shared-communication-log usage discipline.
- [`.agent/memory/executive/agent-collaboration-channels.md`](../memory/executive/agent-collaboration-channels.md)
  — at-a-glance register for choosing the right communication channel.
- [`.agent/memory/operational/collaboration-state-conventions.md`](../memory/operational/collaboration-state-conventions.md)
  — operational lifecycle and channel-selection guidance for collaboration
  state.

## Lifecycle Discipline

- **UTC is canonical for collaboration timestamps** — use UTC ISO 8601
  timestamps with a trailing `Z` in shared log headings, claims, queue
  entries, conversations, escalations, and archives. The owner is currently
  in Europe/London; mention owner-local time in prose only when it helps
  human coordination. Freshness and stale calculations use UTC.
- **Shared communication log history is hot-plus-archive** — the current
  surface is still a chronological append-only hot log, but owner direction on
  2026-04-28 requires a rolling archive design so the hot file stays usable
  without abruptly losing past context.
- **Sign every entry with the PDR-027 agent identity** — `agent_name`,
  `platform`, `model`, `session_id_prefix` (or `unknown`).
- **Stale entries become noise to be audited at consolidation**, not
  blockers — see
  [`.agent/commands/consolidate-docs.md`](../commands/consolidate-docs.md)
  for the audit step. It reports active/stale claims, recent closures,
  open/stale decision threads, open/stale sidebars, unresolved decision
  requests, unacknowledged or evidence-missing joint decisions, active
  escalations, and evidence-bundle gaps.
- **Session-close ends live claims by default** — old live claims are not
  currently reclaimed on resume. Agents should explicitly close their own
  claims at session end; missed closes are archived later as stale/orphaned
  after the appropriate type-specific TTL rather than treated as successful
  work.
- **Decision threads own structured coordination** — use them for concrete
  async decisions, sidebars, joint commitments, resolutions, and evidence.
  Use the shared log for lightweight discovery, active claims for live
  ownership and commit windows, escalations for unresolved owner-facing
  cases, the napkin for learning, and thread records for cross-session
  lane state.
- **Use the communication-channel register before guessing** — when the
  right surface is unclear, consult
  [agent-collaboration-channels.md](../memory/executive/agent-collaboration-channels.md)
  before creating a new coordination shape.
