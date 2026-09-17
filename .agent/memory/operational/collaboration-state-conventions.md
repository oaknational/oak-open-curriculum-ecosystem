---
fitness_line_target: 150
fitness_line_limit: 220
fitness_char_limit: 12000
fitness_line_length: 100
split_strategy: 'Extract per-surface lifecycle detail to companion docs as new state surfaces are installed (conversations/, escalations/); keep this file as the operational guide to all collaboration state.'
merge_class: index-narrative-tables
---

# Collaboration State Conventions

Operational index for `.agent/state/collaboration/`: where it lives, how it
evolves, and where to find lifecycle recipes. Authority:
[`agent-collaboration.md`][directive], [PDR-035][pdr-035] for agent-work
ownership, and [PDR-029 Family A Class A.3][pdr-029] for the shared git
transaction tripwire. Detailed lifecycle recipes live in
[`collaboration-state-lifecycle.md`][lifecycle]. Substance-kind placement
across this surface family is governed by the
[placement contract][placement-contract].

## Vocabulary

Four-term taxonomy used across this surface family:

- **stale** — past `freshness_seconds` TTL; archivable. Noise, not a blocker.
- **fresh-but-quiet** — within TTL, no recent `heartbeat_at`. Informational
  only; next staleness threshold archives automatically.
- **orphaned** — a fresh-but-quiet claim whose owning session is known or
  suspected to have ended. Cleanup ethics in
  [`agent-collaboration.md`][directive] §d.
- **expired** — wall-clock past `expires_at` (commit_queue entries and
  sidebars). Stale-reporting only; never auto-resolves.

`closure.kind: "stale"` is the archive label for any claim leaving through
staleness, including orphan archival.

## Surfaces

All collaboration-state timestamps are UTC ISO 8601 strings with a trailing
`Z`. Owner-local time can be mentioned in prose when useful, but UTC is the
canonical value for staleness and freshness calculations and durable state.

| Surface                                             | Shape                                                    | Lifecycle                                                                                                                                                                  | Authority                 |
| --------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| [`comms-events/`][comms-events]                     | One immutable JSON file per communication event          | Exclusive-create append; render into the shared log; archive old rendered history rather than deleting it                                                                  | CSW                       |
| [`shared-comms-log.md`][log]                        | Generated markdown read model                            | Human/agent discovery surface rendered from comms events; legacy rendered history remains preserved during migration                                                       | WS0 + CSW                 |
| [`active-claims.json`][active-claims]               | Structured JSON; queryable registry plus `commit_queue`  | Mutate through the collaboration-state transaction helper; remove claims after durable close; remove successful queue entries after commit; stale-archive by consolidation | WS1 + queue + CSW         |
| [`active-claims.schema.json`][active-claims-schema] | JSON Schema (Draft 2020-12)                              | Versioned; additive-only within major; major bump = field reduction or breaking shape change                                                                               | WS1/WS3A                  |
| [`closed-claims.schema.json`][closed-claims-schema] | JSON Schema (Draft 2020-12)                              | Versioned; additive-only within major; major bump = field reduction or breaking shape change                                                                               | WS3A                      |
| [`closed-claims.archive.json`][closed-claims]       | JSON archive preserving claim body plus closure metadata | Append-on-explicit-close, stale archive, or owner-forced close; never deleted; permanent reference for `claim_id` citations                                                | WS1/WS3A                  |
| [`conversation.schema.json`][conversation-schema]   | JSON Schema (Draft 2020-12)                              | Versioned; additive-only within major; major bump = field reduction or breaking shape change                                                                               | WS3A/WS3B/joint decisions |
| [`conversations/`][conversations-dir]               | Structured per-topic JSON decision threads               | Created on decision-thread open; sidebars and joint decisions append entries; closed with a `resolution` when the topic is done                                            | WS3A/WS3B/joint decisions |
| [`escalation.schema.json`][escalation-schema]       | JSON Schema (Draft 2020-12)                              | Versioned; additive-only within major; escalation files close by referencing the conversation entry that resolved them                                                     | WS3B                      |
| [`escalations/`][escalations-dir]                   | One file per active owner escalation                     | Created after a conversation entry exists; closed after owner resolution is written back to that conversation                                                              | WS3B                      |

## Schema Provenance

Field-level provenance lives in the state schemas via
`$comment_provenance`. The schemas carry field metadata; this file keeps the
surface index compact and [`collaboration-state-lifecycle.md`][lifecycle]
keeps operational recipes.

## Default `freshness_seconds = 14400` (rationale)

Four hours errs slightly long: it covers most live work without heartbeat
noise while still cycling within a day. Premature staleness creates false
coordination noise; WS5 evidence is the re-evaluation gate. Commit-window
claims intentionally override this to 900 seconds because staging/commit
should be brief.

## Claims Are Provenance (Immutable Undertakings)

The registry ROW is operationally mutable (heartbeat refresh, handoff-record
pointer, close/adopt through the transaction helper), but the claim's
UNDERTAKING — its boundary, intent, and role as staked at open — is immutable
provenance of what the seat took on (owner ruling, July 2026, homed by the
2026-07-31 comms-corpus run). A changed lane CLOSES the claim and opens a new
one; editing scope or intent in place rewrites history and breaks the
`claim_id` citation chain that closed-claims archiving exists to preserve.
`claims adopt` is the one sanctioned in-place identity rewrite (mid-cycle
pickup, PDR-063), and it deliberately preserves the undertaking unchanged.

## Write-Safety Contract

Shared state is intentionally read/write. An active claim on shared-state docs
is a coordination signal, not a read-only lock; agents read the current
surface, write the needed lifecycle or handoff update, and use transaction
helpers plus the commit queue to make overlap visible and serializable.

New shared-state writes use the
[`collaboration-state-write-safety`][csw-plan] contract:

- derive identity before mutation;
- append discovery notes as immutable comms events and render the shared log;
- mutate claims, queue entries, conversations, and escalations through
  `pnpm agent-tools:collaboration-state -- ...`;
- keep lifecycle writes sequential unless the helper provides a transaction;
- keep hooks as later polish. TTL cleanup is the portable baseline.

**CLI body-writes: reflex `--body-file`, never inline `--body`, for any body
carrying backticks, `$`, brackets, or angle-brackets.** The shell runs
command-substitution inside a double-quoted ``--body "…`id`…"`` and silently
STRIPS the backticked tokens (worst case observed: claim IDs stripped from an
adoption instruction, 2026-07-01) — and unquoted metacharacters exit 2. The
`--body-file` argument must be a REAL readable file at an ABSOLUTE path: process
substitution (`<(printf …)`), `/dev/stdin` heredocs, and repo-root-relative
traversals into a scratchpad all fail. Resolve every referenced event id from
the artefact (`ls` the comms dir), never from recall — neither
`append`/`send --in-response-to` nor `direct --in-response-to` validates
its antecedent
(frictions F-121; `comms reply` is the one verb that resolves-or-fails).

Further `comms send` argv traps (recorded 2026-07-31): `--body` caps around
1,500 characters, so `--body-file` is the only path for substantive events;
an inline body with shell-hazard characters exits 2 and a trailing
`| tail` pipe EATS that exit; the drain timeout is 600s; sends are rejected
on an identity-tuple mismatch (heartbeat-tagged sends bypass that guard);
and `comms direct` needs the recipient's FULL identity tuple, not a display
name.

Threading field: `in_response_to` is CANONICAL and `in_reply_to` does not
exist (corpus check 2026-07-30: 114 uses vs 0) — a reader or filter written
against `in_reply_to` silently matches nothing.

Two commit-tooling traps, live until their tickets cure them (recorded
2026-07-31): `git commit -- <paths>` commits from the TREE while the
commit-workflow's record/verify-staged steps checksum the INDEX — staged
DELETIONS can silently drop from the commit while every ceremony check
passes (MCP-334; 326 staged deletions dropped in the founding instance) —
after any pathspec commit that includes deletions, verify the commit's
name-status against the intent; and queue-mediated commits stage only the
ENQUEUED file list, so a late-staged file silently misses the commit while
local gates run green on the full index (MCP-417) — re-verify the staged
set against the intent immediately before the commit window closes.

The canonical communication-event directory is
`.agent/state/collaboration/comms/`. Merges reconcile any legacy-era event
fragments as `exclusive-create-fragments`.

Comms-event rotation is the class-tiered, extraction-gated archive pass
(PDR-094 v4, owner-worded 2026-07-26: full extraction first; the archive
then ENABLES future mining and is never a hedge — it lowers no extraction
bar). Events past their class window AND covered by a recorded pass-level
absorption watermark archive-move to `comms-archive/` behind the
provenance check; nothing in-window moves; no per-event ledger; the
archive carries no curation obligation — see `consolidate-docs` step 3a
for the operative gates.

**Design constraint — every shared memory/state surface assumes
parallel-session reality.** Surfaces are versioned, append/merge-tolerant,
and multi-slot; a single-session-baton design (one slot handed between
sessions, consumed on read) is a proven failure shape — write-clobber,
consume-wipe, and wrong-project scoping retired the `.remember` plugin
(owner-directed, 2026-06-04) in favour of the versioned multi-slot canonical
surfaces this file indexes.

## Session-Close and Resume Semantics

Live claims belong to the session that opened or inherited them. Terminal
resume does not reclaim old claims; close live claims explicitly, or a later
janitor archives missed closeouts as stale rather than successful. Type-
specific TTLs and orphan recipes live in
[`collaboration-state-lifecycle.md`](collaboration-state-lifecycle.md)
§Claims.

Detached monitors are owned lifecycle actors with an owner session, start
condition, stop condition, expiry, and owner-visible status. The event stream
is the reality signal if handoff prose and fresh monitor events disagree.

## Lifecycle Summary

Detailed recipes live in [`collaboration-state-lifecycle.md`][lifecycle].
This file keeps the operational index compact.

| Action                       | State surface                            | Durable outcome                                                                                             |
| ---------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Open / refresh active work   | `active-claims.json`                     | Fresh claim with `claimed_at`, optional `heartbeat_at`, and visible areas                                   |
| Queue commit intent          | `active-claims.json` root `commit_queue` | FIFO advisory entry with files, subject, phase, expiry, and staged-bundle fingerprint                       |
| Close active work            | `closed-claims.archive.json`             | Claim copied with `closure.kind: "explicit"` and evidence refs                                              |
| Archive stale work           | `closed-claims.archive.json`             | Stale claim preserved with `closure.kind: "stale"`                                                          |
| Open structured coordination | `conversations/<id>.json`                | Decision-thread event list with concrete entries and evidence                                               |
| Request sidebar              | `conversations/<id>.json`                | `sidebar_*` entries grouped by `sidebar_id`; timeout is reporting only                                      |
| Record joint commitment      | `conversations/<id>.json`                | `joint_decision*` entries with decider, recorder, actor, ack, and evidence                                  |
| Escalate to owner            | `escalations/<id>.json` + conversation   | Live case closes only after owner resolution is written back to conversation                                |
| Consolidate observability    | `consolidate-docs § 7e`                  | Active/stale claims, queue entries, threads, sidebars, decisions, escalations, and malformed state reported |

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
  (`schema_version: "1.1.0"` etc.). The bump moves the schema, the
  parsers, and every writer together (latest-only support, owner ruling
  2026-08-01): on runtime-pinned surfaces (the claims registry and the
  closed-claims archive) agents support exactly the current version once
  it lands; schema-only surfaces (conversations, escalations) carry no
  runtime pin and validate the versions their schema enumerates.
- **Removing a field** lands as a major-version bump
  (`schema_version: "2.0.0"` etc.). On runtime-pinned surfaces, agents
  reading a file at any other version bail out with an error pointing at
  the protocol upgrade. Migration is deliberate, not silent.
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
[log]: ../../state/README.md
[comms-events]: ../../state/README.md
[active-claims]: ../../state/README.md
[active-claims-schema]: ../../../agent-tools/src/collaboration-state/schemas/active-claims.schema.json
[closed-claims-schema]: ../../../agent-tools/src/collaboration-state/schemas/closed-claims.schema.json
[closed-claims]: ../../state/README.md
[conversation-schema]: ../../../agent-tools/src/collaboration-state/schemas/conversation.schema.json
[conversations-dir]: ../../state/collaboration/conversations/
[escalation-schema]: ../../../agent-tools/src/collaboration-state/schemas/escalation.schema.json
[escalations-dir]: ../../state/collaboration/escalations/
[register-rule]: ../../rules/register-active-areas-at-session-open.md
[log-rule]: ../../rules/use-agent-comms-log.md
[respect-rule]: ../../rules/respect-active-agent-claims.md
[consolidate-7e]: ../../skills/knowledge/consolidate-docs/SKILL-CANONICAL.md#stale-claim-audit
[founding-pattern]: ../collaboration/parallel-track-pre-commit-gate-coupling.md
[p]: ../../plans-backlog-2026-07/agent-tooling/current/multi-agent-collaboration-protocol.plan.md
[csw-plan]: ../../plans-backlog-2026-07/agent-tooling/current/collaboration-state-write-safety.plan.md
[placement-contract]: ../executive/collaboration-state-placement-contract.md
