---
fitness_line_target: 180
fitness_line_limit: 260
fitness_char_limit: 16000
fitness_line_length: 100
split_strategy: "Split by state surface if lifecycle recipes grow beyond a single operational reference"
---

# Collaboration State Lifecycle

Detailed lifecycle recipes for `.agent/state/collaboration/`. The compact
state index is [`collaboration-state-conventions.md`](collaboration-state-conventions.md);
the doctrinal authority is
[`agent-collaboration.md`](../../directives/agent-collaboration.md) and
[PDR-029 Family A Class A.3][pdr-029].

## Claims

### Open a Claim

1. Apply the
   [`register-active-areas-at-session-open`][register-rule] rule: list
   intended areas, scan `active-claims.json` for overlap, decide how to
   coordinate.
2. Append a new entry under `claims[]` with a fresh `claim_id` (UUID v4
   recommended), the agent's PDR-027 identity block, the thread slug,
   the area list, `claimed_at` (now), and a brief `intent` line.
3. Use the default `freshness_seconds` (14400 = 4 hours) for most
   slices. Long sessions either set a larger value at open time or
   refresh `heartbeat_at`.
4. Before staging or committing, open a short-lived `git:index/head`
   claim with `freshness_seconds: 900`, append a shared-log note when
   useful, post a `commit_queue` entry for the intended bundle, and close it
   immediately after success, failure, or abort.

## Commit Queue

`active-claims.json` v1.3.0 carries a root `commit_queue` array. The array is
FIFO and advisory: agents use it to decide whose commit turn is next, but it
does not mechanically refuse work. PDR-029 defines the queue as the
observable artefact for the shared git transaction / authorial-bundle
tripwire; this file records the operational recipe.

Use `pnpm agent-tools:commit-queue --` through the commit skill:

1. `enqueue` before staging with the active claim id, exact repo-relative
   files, and draft commit subject.
2. `phase --phase staging`, then stage explicit files only.
3. `record-staged` after staging. This records `git diff --cached
   --name-status` and a SHA-256 fingerprint over name-status plus
   `git diff --cached --full-index --binary`.
4. `verify-staged` immediately before commit. It requires: no fresh FIFO entry
   ahead, staged file set equals queued files exactly, subject equals queued
   subject, and fingerprint has not changed.
5. `complete` after a successful commit. This removes the queue entry and
   clears the claim pointer. A successful git commit is the durable record.
6. `phase --phase abandoned` if the attempt stops before success.

`expires_at` is a wall-clock stale-reporting timestamp. Expiry never
auto-removes a queue entry and never blocks another agent by itself.
`session_counter` is intentionally absent from v1.3.0.

### Refresh During Work

Set `heartbeat_at` to `now()` to extend a claim's freshness. Use this
for long sessions where the original 4-hour budget would expire mid-work.
The refreshed window is `heartbeat_at + freshness_seconds`, not
`claimed_at + freshness_seconds`.

### Close at Session End

Copy the active claim into `closed-claims.archive.json`, add
`archived_at` plus `closure.kind: "explicit"`, `closure.closed_at`,
`closure.closed_by`, `closure.summary`, and one or more
`closure.evidence[]` references, then remove the active entry. Removal
without a closed-claim record silently erases lifecycle history.

### Archive Stale Claims

`consolidate-docs § 7e` walks `active-claims.json`, computes
`claimed_at + freshness_seconds` (or `heartbeat_at + freshness_seconds`
if newer), and archives any expired entry to `closed-claims.archive.json`
with `archived_at` and `closure.kind: "stale"`. Stale claims are
*noise*, not *blockers*. The system does not strand agents waiting on a
peer's forgotten claim.

Fresh but quiet claims are informational only: possible crashed session,
not a block. The next staleness threshold archives the entry
automatically.

## Decision Threads

Open `.agent/state/collaboration/conversations/<id>.json` when an overlap
or protocol question needs more structure than the shared communication log.
Good reasons include a concrete `decision_request`, a claim scope change
that needs peer acknowledgement, or evidence that should stay attached to
a resolution.

Close a decision thread by appending a `decision` entry when the route is
chosen, then a `resolution` entry with `outcome` and `body`, setting
`status: "closed"`, and adding `closed_at`. Cite the thread from related
claim closures or log entries when it explains the route taken. Do not
copy the body into the thread record.

## Sidebars

Append `sidebar_request` when a short focused exchange is needed inside an
existing conversation. It requires `sidebar_id`, `author`,
`target_participants`, `body`, `response_due_at`, and `expires_at`.
Default workflow timing is wall-clock: `expires_at = created_at + 30
minutes`. The 10 turn-pair limit is advisory; a turn-pair is one
requester sidebar message followed by at least one target reply before
the next requester message.

Timeout never auto-resolves. Append `sidebar_resolution` deliberately with
`outcome: "expired"` if the expired sidebar should be closed as expired.

## Joint Decisions

Append `joint_decision` when agents need a shared commitment rather than a
one-way signal. Roles are `discusser`, `decider`, `recorder`, and
`actor`; at least one decider is required, and the owner may be the
decider. Proposed joint decisions use explicit `ack_due_at` timestamps
(workflow default: `created_at + 24 hours`). Unacknowledged proposals are
not settled commitments.

Completion requires evidence. Role handoff uses
`joint_decision_state: "role_handoff"`, `handoff_to`, and either
`evidence` or `next_action`.

## Escalations

Open `.agent/state/collaboration/escalations/<id>.json` only after a
conversation exists. The escalation must cite `conversation_id` and
`originating_entry_id`; it is a live owner-facing unresolved case record,
not the durable decision.

When the owner resolves the case, write the durable result back into the
conversation as a `decision`, `joint_decision`, or `resolution` entry,
then close the escalation with `resolution_conversation_entry_id`.

## Protocol Observability

`consolidate-docs § 7e` reports active/stale claims, commit queue entries,
recent closures, open/stale decision threads, unresolved decision requests,
open/stale sidebars, unacknowledged or evidence-missing joint decisions,
active escalations, and malformed state.

Non-trivial protocol claims should carry a small evidence bundle:

- claim statement;
- claim class (`lifecycle`, `coordination`, `policy`, or `validation`);
- evidence refs using the shared enum;
- verification status (`verified`, `partial`, or `needs-owner`);
- next action or owner.

[register-rule]: ../../rules/register-active-areas-at-session-open.md
[pdr-029]: ../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md
