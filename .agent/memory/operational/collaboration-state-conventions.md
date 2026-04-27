---
fitness_line_target: 150
fitness_line_limit: 220
fitness_char_limit: 12000
fitness_line_length: 100
split_strategy: "Extract per-surface lifecycle detail to companion docs as new state surfaces are installed (conversations/, escalations/); keep this file as the operational guide to all collaboration state."
---

# Collaboration State Conventions

Operational guide to the live state in `.agent/state/collaboration/`:
where it lives, how it evolves, and how stale entries are cleaned up. The
doctrinal authority is
[`agent-collaboration.md`][directive]; this file is the
how-it-works-in-practice companion. Detailed lifecycle recipes live in
[`collaboration-state-lifecycle.md`][lifecycle].

## Surfaces

| Surface | Shape | Lifecycle | Authority |
| --- | --- | --- | --- |
| [`shared-comms-log.md`][log] | Schema-less append-only markdown | Append-only; no rotation, no archive, no schema | WS0 |
| [`active-claims.json`][active-claims] | Structured JSON; queryable registry plus `commit_queue` | Append-on-claim and append-on-queue; remove claims after durable close; remove successful queue entries after commit; stale-archive by consolidation | WS1 + queue |
| [`active-claims.schema.json`][active-claims-schema] | JSON Schema (Draft 2020-12) | Versioned; additive-only within major; major bump = field reduction or breaking shape change | WS1/WS3A |
| [`closed-claims.schema.json`][closed-claims-schema] | JSON Schema (Draft 2020-12) | Versioned; additive-only within major; major bump = field reduction or breaking shape change | WS3A |
| [`closed-claims.archive.json`][closed-claims] | JSON archive preserving claim body plus closure metadata | Append-on-explicit-close, stale archive, or owner-forced close; never deleted; permanent reference for `claim_id` citations | WS1/WS3A |
| [`conversation.schema.json`][conversation-schema] | JSON Schema (Draft 2020-12) | Versioned; additive-only within major; major bump = field reduction or breaking shape change | WS3A/WS3B/joint decisions |
| [`conversations/`][conversations-dir] | Structured per-topic JSON decision threads | Created on decision-thread open; sidebars and joint decisions append entries; closed with a `resolution` when the topic is done | WS3A/WS3B/joint decisions |
| [`escalation.schema.json`][escalation-schema] | JSON Schema (Draft 2020-12) | Versioned; additive-only within major; escalation files close by referencing the conversation entry that resolved them | WS3B |
| [`escalations/`][escalations-dir] | One file per active owner escalation | Created after a conversation entry exists; closed after owner resolution is written back to that conversation | WS3B |

## Schema-Field Provenance

The active-claims schema is informed by what real shared-communication-log usage
showed agents needed, plus the small set of fields the registry shape
requires that the log shape did not. Transparency on which is which
matters because fields drawn from observation are battle-tested; fields
drawn from first principles are more likely to be reshaped by WS5
evidence.

| Field | Source | Notes |
| --- | --- | --- |
| `agent_id` block (`agent_name`, `platform`, `model`, `session_id_prefix`) | Observed | Every shared-communication-log entry carried this; reuses PDR-027 identity schema unchanged |
| `claimed_at` | Observed | Every entry timestamped ISO 8601 |
| `intent` (free-form prose) | Observed | Every entry carried an action / intent line |
| `areas` (kind + patterns) | Observed | Every entry used a nested **Areas touched** list with path patterns; v1.2.0 adds `git:index/head` for commit windows |
| `notes` (optional prose) | Observed | Every entry carried a *Coordination note* paragraph |
| `claim_id` (uuid) | First-principles | Registry needs entry identity; the log was append-only and did not need this |
| `thread` (slug) | First-principles | Cross-thread visibility requires explicit thread reference; log entries were implicitly within their working session |
| `freshness_seconds` (default 14400) | First-principles | Liveness signal for stale-audit; 4 hours is the starting default (rationale below) |
| `heartbeat_at` (optional) | First-principles | Long-session freshness refresh |
| `sidebar_open` (boolean default false) | First-principles | Whether a sidebar is currently open against this claim |
| `commit_queue` (root array) | Observed + owner-directed | Owner-directed response to staged-bundle clash evidence; FIFO advisory commit turn order |
| `intent_to_commit` (claim pointer) | First-principles | Convenience pointer from a claim to its active queue entry; queue remains authoritative |
| `closure.kind` | Observed + first-principles | Explicit close and stale archival are observed; owner-forced close is reserved for owner intervention |
| `closure.closed_at` / `closed_by` | First-principles | Claim history needs time and actor for durable closure provenance |
| `closure.evidence[]` | Observed | WS5 showed claim outcomes need durable refs to logs, claims, plans, napkin, and thread records |

Conversation fields reuse the same PDR-027 `agent_id` shape and
`evidence_ref` enum from `active-claims.schema.json`. The v1.0.0
conversation schema keeps its surface deliberately narrow: `message`,
`claim_update`, `decision_request`, `decision`, `resolution`, and
`evidence` entries only. The v1.1.0 schema adds sidebar entries and
joint-decision entries while preserving the same append-only event-list
model. Escalations are separate live case files and must write owner
resolution back into the referenced conversation.

## Default `freshness_seconds = 14400` (rationale)

Four hours errs slightly long, deliberately. Typical sessions on this
branch run ~1–3 hours; a 4-hour budget covers most sessions without
`heartbeat_at` refresh and still cycles well within a day. Premature
staleness is worse than delayed staleness because it creates false noise
during live edits. WS5 evidence is the planned re-evaluation gate.
Commit-window claims intentionally override this to 900 seconds because
staging/commit should be brief.

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
[lifecycle]: collaboration-state-lifecycle.md
[log]: ../../state/collaboration/shared-comms-log.md
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
