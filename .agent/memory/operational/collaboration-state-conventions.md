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
how-it-works-in-practice companion.

## Surfaces

| Surface | Shape | Lifecycle | Authority |
| --- | --- | --- | --- |
| [`log.md`][log] | Schema-less append-only markdown | Append-only; no rotation, no archive, no schema | WS0 |
| [`active-claims.json`][active-claims] | Structured JSON; queryable registry | Append-on-claim; remove after durable close; stale-archive by consolidation | WS1 |
| [`active-claims.schema.json`][active-claims-schema] | JSON Schema (Draft 2020-12) | Versioned; additive-only within major; major bump = field reduction or breaking shape change | WS1/WS3A |
| [`closed-claims.schema.json`][closed-claims-schema] | JSON Schema (Draft 2020-12) | Versioned; additive-only within major; major bump = field reduction or breaking shape change | WS3A |
| [`closed-claims.archive.json`][closed-claims] | JSON archive preserving claim body plus closure metadata | Append-on-explicit-close, stale archive, or owner-forced close; never deleted; permanent reference for `claim_id` citations | WS1/WS3A |
| [`conversation.schema.json`][conversation-schema] | JSON Schema (Draft 2020-12) | Versioned; additive-only within major; major bump = field reduction or breaking shape change | WS3A |
| [`conversations/`][conversations-dir] | Structured per-topic JSON decision threads | Created on decision-thread open; closed with a `resolution`; open/stale state reported by consolidation | WS3A |
| `escalations/` (forward) | One file per active owner-escalation | Deferred to WS3B; do not create until owner direction or decision-thread evidence promotes the sibling plan | WS3B paused |

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
| `sidebar_open` (boolean default false) | First-principles | Forward-reference field for WS3 sidebar mechanism |
| `closure.kind` | Observed + first-principles | Explicit close and stale archival are observed; owner-forced close is reserved for owner intervention |
| `closure.closed_at` / `closed_by` | First-principles | Claim history needs time and actor for durable closure provenance |
| `closure.evidence[]` | Observed | WS5 showed claim outcomes need durable refs to logs, claims, plans, napkin, and thread records |

Decision-thread fields reuse the same PDR-027 `agent_id` shape and
`evidence_ref` enum from `active-claims.schema.json`. The v1.0.0
conversation schema keeps its surface deliberately narrow: `message`,
`claim_update`, `decision_request`, `decision`, `resolution`, and
`evidence` entries only. It contains no sidebar, timeout, or escalation
fields.

## Default `freshness_seconds = 14400` (rationale)

Four hours errs slightly long, deliberately. Typical sessions on this
branch run ~1–3 hours; a 4-hour budget covers most sessions without
`heartbeat_at` refresh and still cycles well within a day. Premature
staleness is worse than delayed staleness because it creates false noise
during live edits. WS5 evidence is the planned re-evaluation gate.
Commit-window claims intentionally override this to 900 seconds because
staging/commit should be brief.

## Lifecycle

### Open a claim

1. Apply the
   [`register-active-areas-at-session-open`][register-rule] rule:
   list intended areas, scan `active-claims.json` for overlap, decide
   how to coordinate.
2. Append a new entry under `claims[]` with a fresh `claim_id` (UUID v4
   recommended), the agent's PDR-027 identity block, the thread slug,
   the area list, `claimed_at` (now), and a brief `intent` line. Leave
   `heartbeat_at` and `notes` unset unless useful.
3. The default `freshness_seconds` (14400 = 4 hours) is appropriate for
   most slices. Long sessions either set a larger value at open time or
   refresh `heartbeat_at` periodically.
4. Before staging or committing, open a short-lived `git:index/head` claim
   with `freshness_seconds: 900`, append a shared-log note, and close it
   immediately after success, failure, or abort with the SHA or reason.

### Refresh during work

`heartbeat_at` is set to `now()` to extend a claim's freshness. Use this
for long sessions where the original 4-hour budget would expire mid-work.
The refreshed window is `heartbeat_at + freshness_seconds`, not
`claimed_at + freshness_seconds`.

### Close at session end

Copy the active claim into `closed-claims.archive.json`, add
`archived_at` plus `closure.kind: "explicit"`, `closure.closed_at`,
`closure.closed_by`, `closure.summary`, and one or more
`closure.evidence[]` references, then remove the active entry. Removal
without a closed-claim record silently erases lifecycle history.

### Stale entries — automatic archival

`consolidate-docs § 7e` walks `active-claims.json`, computes
`claimed_at + freshness_seconds` (or `heartbeat_at + freshness_seconds`
if newer), and archives any expired entry to `closed-claims.archive.json`
with `archived_at` and `closure.kind: "stale"`. Stale claims are
*noise*, not *blockers*. The system does not strand agents waiting on a
peer's forgotten claim.

### Unclosed-but-fresh entries

If a claim is fresh (within `freshness_seconds`) but its agent has not
registered any subsequent thread-record activity, this is an
informational signal — possibly a crashed session. The owner reviews at
consolidation. The next staleness threshold archives the entry
automatically; no special intervention is required.

### Open a decision thread

Open `.agent/state/collaboration/conversations/<id>.json` when an
overlap or protocol question needs more structure than the shared
communication log. Good reasons include a concrete `decision_request`, a
claim scope change that needs peer acknowledgement, or evidence that
should stay attached to a resolution. Keep ordinary discovery notes in
`log.md`; keep live area ownership in `active-claims.json`.

### Close a decision thread

Append a `decision` entry when the route is chosen, then a `resolution`
entry with `outcome` and `body`, set `status: "closed"`, and add
`closed_at`. Cite the decision thread from related claim closures or log
entries when it explains the route taken. Do not copy the body into the
thread record; thread records carry cross-session lane state and may cite
the decision-thread file by path.

### Protocol observability and evidence bundles

`consolidate-docs § 7e` reports active/stale claims, recent closures,
open/stale decision threads, unresolved decision requests, and malformed
state. Non-trivial protocol claims should carry a small evidence bundle:
claim statement, claim class (`lifecycle`, `coordination`, `policy`, or
`validation`), evidence refs using the shared enum, verification status
(`verified`, `partial`, or `needs-owner`), and next action / owner.

## Trusted-Agents Threat Model

The protocol assumes **trusted agents** acting in good faith. This means:

- **Honest claims** — claims describe real intent and real areas of
  work; agents do not over-claim to lock peers out.
- **Honest closures** — agents close their claims at session end (or
  let staleness archive them naturally) with closure evidence; agents do
  not falsify activity.
- **Honest build-breakage reports** — agents declare known build
  breakage in the shared communication log rather than committing through a green
  gate they know is wrong.

Misbehaving agents (excessive scope claims, never-released claims,
fabricated entries, cooperative deceit) are **out of scope**. The owner
detects and resolves these cases at consolidation. A hostile-agent
threat model — claim integrity, signed entries, tamper detection — is
a future PDR if the trust assumption breaks down.

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
- [`register-active-areas-at-session-open.md`][register-rule] —
  session-open tripwire rule.
- [`use-agent-comms-log.md`][log-rule] — shared-communication-log usage rule.
- [`respect-active-agent-claims.md`][respect-rule] — scope-discipline
  rule.
- [`conversation.schema.json`][conversation-schema] and
  [`conversations/`][conversations-dir] — decision-thread contract and
  examples.
- [`consolidate-docs.md § 7e`][consolidate-7e] — stale-claim audit
  step.
- [`parallel-track-pre-commit-gate-coupling.md`][founding-pattern] —
  founding pattern that motivated the protocol.

[directive]: ../../directives/agent-collaboration.md
[log]: ../../state/collaboration/log.md
[active-claims]: ../../state/collaboration/active-claims.json
[active-claims-schema]: ../../state/collaboration/active-claims.schema.json
[closed-claims-schema]: ../../state/collaboration/closed-claims.schema.json
[closed-claims]: ../../state/collaboration/closed-claims.archive.json
[conversation-schema]: ../../state/collaboration/conversation.schema.json
[conversations-dir]: ../../state/collaboration/conversations/
[register-rule]: ../../rules/register-active-areas-at-session-open.md
[log-rule]: ../../rules/use-agent-comms-log.md
[respect-rule]: ../../rules/respect-active-agent-claims.md
[consolidate-7e]: ../../commands/consolidate-docs.md#stale-claim-audit
[founding-pattern]: ../collaboration/parallel-track-pre-commit-gate-coupling.md
[p]: ../../plans/agentic-engineering-enhancements/current/multi-agent-collaboration-protocol.plan.md
