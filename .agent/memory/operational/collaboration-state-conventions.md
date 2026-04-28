---
fitness_line_target: 150
fitness_line_limit: 220
fitness_char_limit: 12000
fitness_line_length: 100
split_strategy: "Extract per-surface lifecycle detail to companion docs as new state surfaces are installed (conversations/, escalations/); keep this file as the operational guide to all collaboration state."
---

# Collaboration State Conventions

Operational guide to `.agent/state/collaboration/`: where it lives, how it
evolves, and how stale entries are cleaned up. Authority:
[`agent-collaboration.md`][directive], [PDR-035][pdr-035] for agent-work
ownership, and [PDR-029 Family A Class A.3][pdr-029] for the shared git
transaction tripwire. Detailed lifecycle recipes live in
[`collaboration-state-lifecycle.md`][lifecycle].

## Surfaces

All collaboration-state timestamps are UTC ISO 8601 strings with a trailing
`Z`. Owner-local time can be mentioned in prose when useful, but UTC is the
canonical value for stale/fresh calculations and durable state.

| Surface | Shape | Lifecycle | Authority |
| --- | --- | --- | --- |
| [`comms/events/`][comms-events] | One immutable JSON file per communication event | Exclusive-create append; render into the shared log; archive old rendered history rather than deleting it | CSW |
| [`shared-comms-log.md`][log] | Generated markdown read model | Human/agent discovery surface rendered from comms events; legacy rendered history remains preserved during migration | WS0 + CSW |
| [`active-claims.json`][active-claims] | Structured JSON; queryable registry plus `commit_queue` | Mutate through the collaboration-state transaction helper; remove claims after durable close; remove successful queue entries after commit; stale-archive by consolidation | WS1 + queue + CSW |
| [`active-claims.schema.json`][active-claims-schema] | JSON Schema (Draft 2020-12) | Versioned; additive-only within major; major bump = field reduction or breaking shape change | WS1/WS3A |
| [`closed-claims.schema.json`][closed-claims-schema] | JSON Schema (Draft 2020-12) | Versioned; additive-only within major; major bump = field reduction or breaking shape change | WS3A |
| [`closed-claims.archive.json`][closed-claims] | JSON archive preserving claim body plus closure metadata | Append-on-explicit-close, stale archive, or owner-forced close; never deleted; permanent reference for `claim_id` citations | WS1/WS3A |
| [`conversation.schema.json`][conversation-schema] | JSON Schema (Draft 2020-12) | Versioned; additive-only within major; major bump = field reduction or breaking shape change | WS3A/WS3B/joint decisions |
| [`conversations/`][conversations-dir] | Structured per-topic JSON decision threads | Created on decision-thread open; sidebars and joint decisions append entries; closed with a `resolution` when the topic is done | WS3A/WS3B/joint decisions |
| [`escalation.schema.json`][escalation-schema] | JSON Schema (Draft 2020-12) | Versioned; additive-only within major; escalation files close by referencing the conversation entry that resolved them | WS3B |
| [`escalations/`][escalations-dir] | One file per active owner escalation | Created after a conversation entry exists; closed after owner resolution is written back to that conversation | WS3B |

## Schema Provenance

Field-level provenance and lifecycle rationale live in
[`collaboration-state-lifecycle.md`][lifecycle]. This conventions file keeps
the state-surface index compact.

## Default `freshness_seconds = 14400` (rationale)

Four hours errs slightly long, deliberately. Typical sessions on this
branch run ~1–3 hours; a 4-hour budget covers most sessions without
`heartbeat_at` refresh and still cycles well within a day. Premature
staleness is worse than delayed staleness because it creates false noise
during live edits. WS5 evidence is the planned re-evaluation gate.
Commit-window claims intentionally override this to 900 seconds because
staging/commit should be brief.

## Write-Safety Contract

Shared state is intentionally read/write, even when multiple agents touch it.
An active claim on shared-state docs is a coordination signal, not a read-only
lock. Agents should read the current surface, write the needed lifecycle or
handoff update, and use the transaction helpers plus commit queue to make
overlap visible and serializable.

New shared-state writes use the
[`collaboration-state-write-safety`][csw-plan] contract:

- derive identity before mutation; Codex writes with `CODEX_THREAD_ID`
  available must not write as `Codex` / `unknown`;
- append discovery notes as immutable comms events and render
  `shared-comms-log.md` as a read model;
- mutate active claims, commit queue entries, closed claims, conversations,
  and escalations through the transaction helper exposed by
  `pnpm agent-tools:collaboration-state -- ...`;
- keep hooks as later polish. TTL cleanup is the portable baseline.

## Session-Close and Resume Semantics

Live claims belong to the live session that opened or inherited them. The
current terminal-session model does not support reclaiming old live claims on
resume. When a session closes, its claims should close explicitly into
`closed-claims.archive.json`; if the agent misses that closeout, a later
janitor archives the claim as stale/orphaned rather than successful.

TTL is type-specific. Normal active-work claims use the heartbeat freshness
window above; commit-window claims use a short expiry; attention pings and
sidebar response windows may use minutes-scale expiries; known session-close
misses should use a short grace TTL before orphaning. A future SDK-driven
one-turn invocation model may add external shared session-state reclaim, but
that would be a new lifecycle transition, not the default today.

## Lifecycle Summary

Detailed recipes live in [`collaboration-state-lifecycle.md`][lifecycle].
This file keeps the operational index compact.

| Action | State surface | Durable outcome |
| --- | --- | --- |
| Open / refresh active work | `active-claims.json` | Fresh claim with `claimed_at`, optional `heartbeat_at`, and visible areas |
| Queue commit intent | `active-claims.json` root `commit_queue` | FIFO advisory entry with files, subject, phase, expiry, and staged-bundle fingerprint |
| Close active work | `closed-claims.archive.json` | Claim copied with `closure.kind: "explicit"` and evidence refs |
| Archive stale work | `closed-claims.archive.json` | Expired claim preserved with `closure.kind: "stale"` |
| Open structured coordination | `conversations/<id>.json` | Decision-thread event list with concrete entries and evidence |
| Request sidebar | `conversations/<id>.json` | `sidebar_*` entries grouped by `sidebar_id`; timeout is reporting only |
| Record joint commitment | `conversations/<id>.json` | `joint_decision*` entries with decider, recorder, actor, ack, and evidence |
| Escalate to owner | `escalations/<id>.json` + conversation | Live case closes only after owner resolution is written back to conversation |
| Consolidate observability | `consolidate-docs § 7e` | Active/stale claims, queue entries, threads, sidebars, decisions, escalations, and malformed state reported |

## Trusted-Agents Threat Model

The protocol assumes trusted agents acting in good faith: honest claims,
honest closures, and honest build-breakage reports. Misbehaving or
hostile agents are out of scope and become an owner / future-PDR issue if
that trust assumption breaks. The doctrinal framing lives in
[`agent-collaboration.md`][directive].

## Refinement Discipline

WS5 of the [multi-agent-collaboration-protocol][p] plan
harvests evidence across at least three real parallel sessions and
drives refinement amendments. Refinements may add, remove, or reshape
fields:

- **Adding a field or enum value** lands as a minor-version bump
  (`schema_version: "1.1.0"` etc.). Older agents preserve unrecognised
  fields and opaque enum values on write-back; maintained schemas narrow
  older-version validation where an enum shape changed.
- **Removing a field** lands as a major-version bump
  (`schema_version: "2.0.0"` etc.). Agents reading older-major files
  bail out with an error pointing at the protocol upgrade. Migration
  is deliberate, not silent.
- **Adding a strength gradient** (the WS1 single-level claim model
  reframed in light of evidence) lands as a major-version bump because
  the absence of an exclusivity flag was load-bearing in v1.

## Cross-references

- [`agent-collaboration.md`][directive] — agent-to-agent working model
  (doctrinal authority).
- [`collaboration-state-lifecycle.md`][lifecycle] — detailed lifecycle
  recipes for claims, conversations, sidebars, joint decisions, and
  escalations.
- [`register-active-areas-at-session-open.md`][register-rule] —
  session-open tripwire rule.
- [`use-agent-comms-log.md`][log-rule] — shared-communication-log usage rule.
- [`respect-active-agent-claims.md`][respect-rule] — scope-discipline
  rule.
- [`conversation.schema.json`][conversation-schema] and
  [`conversations/`][conversations-dir] — decision-thread contract and
  examples.
- [`escalation.schema.json`][escalation-schema] and
  [`escalations/`][escalations-dir] — owner-escalation contract and live
  case directory.
- [`consolidate-docs.md § 7e`][consolidate-7e] — stale-claim audit
  step.
- [`parallel-track-pre-commit-gate-coupling.md`][founding-pattern] —
  founding pattern that motivated the protocol.

[directive]: ../../directives/agent-collaboration.md
[pdr-035]: ../../practice-core/decision-records/PDR-035-agent-work-capabilities-belong-to-the-practice.md
[pdr-029]: ../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md
[lifecycle]: collaboration-state-lifecycle.md
[log]: ../../state/collaboration/shared-comms-log.md
[comms-events]: ../../state/collaboration/comms/events/
[active-claims]: ../../state/collaboration/active-claims.json
[active-claims-schema]: ../../state/collaboration/active-claims.schema.json
[closed-claims-schema]: ../../state/collaboration/closed-claims.schema.json
[closed-claims]: ../../state/collaboration/closed-claims.archive.json
[conversation-schema]: ../../state/collaboration/conversation.schema.json
[conversations-dir]: ../../state/collaboration/conversations/
[escalation-schema]: ../../state/collaboration/escalation.schema.json
[escalations-dir]: ../../state/collaboration/escalations/
[register-rule]: ../../rules/register-active-areas-at-session-open.md
[log-rule]: ../../rules/use-agent-comms-log.md
[respect-rule]: ../../rules/respect-active-agent-claims.md
[consolidate-7e]: ../../commands/consolidate-docs.md#stale-claim-audit
[founding-pattern]: ../collaboration/parallel-track-pre-commit-gate-coupling.md
[p]: ../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md
[csw-plan]: ../../plans/agentic-engineering-enhancements/current/collaboration-state-write-safety.plan.md
