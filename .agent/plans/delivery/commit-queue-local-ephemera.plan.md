---
id: commit-queue-local-ephemera
node_type: delivery
name: "Commit queue as machine-local ephemera — per-intent files, 1-hour TTL, list-as-view"
overview: >-
  Re-shape the commit queue per the owner's four-point ruling: queue state is
  local-machine ephemera that never enters version control; it leaves the
  flat active-claims.json for per-intent event files (the comms-store shape)
  with a 1-hour TTL, and list/status become views over the directory.
status: ratified
ratified_by: Jim Cresswell (owner)
ratified_date: 2026-09-08
ratified_where: "PR #85 (2026-09-08), whose body quotes the owner's card answer verbatim: 'Ratify 22, 23 and 25; hold 21 and 24'"
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets:
  - MCP-612
depends_on: []
owner_gates: []
last_updated: 2026-09-08
---

# Commit queue as machine-local ephemera

## Why this node exists

The owner's ruling, 2026-08-17, four points (verbatim intent, rulings
ledger row QUEUE-LOCAL): commit queues are local-machine state and should
never be in version control; split them out with a 1-hour TTL, individual
event files like the comms store, `list` as a view; the queue is
hardly used now that work happens in worktrees; and the flat blob was
blocking useful state data — "split it now and plan the work now and
carry it out now". The trigger measurement: 226 abandoned intents
(~19KB each) filled 99 percent of a 4.4MB active-claims.json while live
claims totalled 3.7KB, and every claims/comms CLI call re-read the full
file.

The interim split executed the same hour, ahead of this plan: the queue
array moved loss-free to the gitignored local archive, the live file
dropped to 4KB with claims byte-preserved, and both CLI readers were
validated across an atomic candidate swap.

## Goal

The queue's storage matches its nature: ephemeral, machine-local,
per-intent. No queue byte can reach version control; no dead intent
outlives its hour; the claims file carries claims only; and every
existing consumer behaves identically at its surface.

## Design (closed decisions, from the ruling)

1. **Store**: one JSON file per intent at
   `.agent/state/collaboration/commit-queue/<intent-id>.json`, directory
   gitignored (extend the existing collaboration-state ignore file — the
   never-in-VC property is enforced by the ignore, and the portability
   validator family is the natural home for a guard that it stays so).
2. **TTL**: entries expire 1 hour after their last write
   (`updated_at`). Expired files are swept lazily — any queue write
   operation deletes expired files it encounters; reads treat them as
   absent. Deletion is correct here by owner definition: TTL-expired
   queue state is ephemera, not work.
3. **Views**: `list` and `status` enumerate the directory and derive
   exactly the shapes they print today; `show` reads one file; `enqueue`
   and lifecycle writes create/rewrite one file.
4. **Claims file**: `active-claims.json` drops the `commit_queue` key
   (schema version bump). Readers REPLACE, never bridge: the new reader
   accepts the new shape; on meeting a legacy file that still carries a
   queue array it migrates once — live entries (unexpired by TTL) to
   per-intent files, everything else dropped as expired — then rewrites
   the claims file in the new shape. The seed text in the
   registry-not-found error changes to match.
5. **Consumers hold their contracts**: the claims-open comms-visibility
   gate, the comms `direct` identity disagreement check (which reads
   queue identity fields), and the commit skill's ceremony all keep
   their observable behaviour; only their storage reads change. The
   commit skill's text is trued by the Director in the same landing
   (practice-core edit).

## Acceptance criteria

1. Full agent-tools suite green with the queue store re-backed; new
   behaviour tests pin: per-intent file round-trip, TTL expiry at the
   boundary (59m59s live, 60m01s expired), lazy sweep on write, view
   parity for list/status/show, legacy-file one-time migration, and the
   never-in-VC guard (the ignore covers the directory). Proof:
   repo-safe.
2. The live estate runs the new shape: primary rebuilt, a real enqueue
   round-trips, `git status` shows no queue file as trackable. Proof:
   repo-safe, recorded in this plan's amendment trail.
3. The legacy blob's verification read confirms zero live (unexpired)
   entries at the instant the pre-split copy was taken and zero at
   landing; the blob then stays as machine-local ephemera under the
   collaboration state's ignore rule. Proof: repo-safe — the read is
   recorded in this plan's amendment trail (decided by the seat at the
   2026-09-06 consolidation, Director ruling 1f67ddd7; no owner act).

## Out of scope

- Any change to claims semantics, freshness, or heartbeats.
- Comms-store changes (it is the pattern source, not a target).
- Queue feature work (F-116's label handling stays as-is; the queue is
  legacy-use by the owner's word).

## Todos

1. Builder: store module + TTL sweep + views + migration + tests
   (worktree lane, TDD).
2. Director: commit-skill text true-up (practice-core), reviews
   (code-expert, test-expert), atomic landing.
3. PR; merge at trustworthy checks (GitHub incident caveat stands
   2026-08-17); primary rebuild; live verification (acceptance 2);
   legacy-blob verification read (acceptance 3, done 2026-09-06).

## Follow-ups from the landing (PR #38, fork `engraph`)

Pointers, not specifications (each line: defect / file / falsifying scenario), dispositioned on
PR #38's review replies and named on its lane-closed comms event of 2026-09-04; mirrored here
at the consolidation fold of 2026-09-06 because that event is untracked. The next seat that
touches the queue store, its migration, or the live-report scan picks these up first.

1. Dead `expired` queue status in the TUI and the active-agents view /
   `agent-tools/src/collaboration-state/active-agents.ts`, `tui/snapshot.ts`,
   `tui/operator-value.ts`, `tui/panes.tsx`, `tui/entry-types.ts` / no store read ever yields an
   expired entry, so the classification, count and attention copy cannot fire.
2. Migration safe by call order, not by construction /
   `agent-tools/src/collaboration-state/active-claims-legacy-migration.ts` / an in-lock read
   meeting legacy text would spin about 9.6 s and throw could-not-acquire, unreachable today
   only because every caller migrates pre-transaction.
3. Real-IO test tier and the temp-collaboration-state helper's allowlist /
   `agent-tools/tests/collaboration-state/*.integration.test.ts` / integration-tier suites do
   real filesystem IO through an allowlisted helper invisible to the lint rule.
4. Wedged claims file / `active-claims-legacy-migration.ts`, `state-io-write-validators.ts` / a
   legacy claim row that reads today but fails the Ajv write gate blocks migration permanently
   with no in-tool recovery path.
5. Duplicate `queued_seq` / `agent-tools/src/collaboration-state/commit-queue-store.ts`
   (`compareQueueOrder`), `state-integrity.ts` / two hand-edited live files sharing a sequence
   tie and fall to directory order.
6. Sweep per write / `agent-tools/src/commit-queue/registry.ts` (`reconcileQueueStore`) / N live
   intents cost N rewrites and N×N directory reads per composed operation.
7. Retired-path scan home, TTL and ENOENT / `agent-tools/src/practice-substrate/live-report.ts`,
   `live-retired-paths.ts`, `live-retired-path-lifecycle.ts` / from a linked worktree the scan
   never sees claims, comms or the queue at the coordination home; an expired-unswept intent
   naming a retired path counts as live evidence; a queue file deleted between the listing and
   the unconditional read throws ENOENT and reports a blocking live-reader-failure.
8. Migration replace overwrite / `active-claims-legacy-migration.ts` / a restored 1.3.0
   registry beside a populated store overwrites a newer intent file with the older row.
9. Phase transition on an expired intent / `agent-tools/src/commit-queue/core.ts`
   (`updateCommitIntentPhase`), `commit-workflow.ts` / an intent expiring between `loadIntent`
   and the phase write no-ops silently and the commit proceeds.

Items named at the same close, re-trued at the consolidation of 2026-09-06 (Director ruling
1f67ddd7): the two CodeQL `js/http-to-file-access` alerts (#12, #31) are not dismissed by
anyone — the owner refused a blanket dismissal on 2026-09-06 and the `code-scanning-alerts-to-zero`
node (a sketch; its unit 3 is future work) prescribes the cure in the tree (the analyser's
barrier model for the schema cache; a closed vocabulary for the drift check), so the alerts
close when that unit lands; the superseded ratified plan `commit-queue-front-door-cleanup`
was archived by the owner's rulings fold of 2026-09-06 (PR #56); the two nested
`.claude/worktrees/*` registrations stay under the prune rule's platform-managed clause
(removing them is a rules-process amendment carrying evidence that the harness tolerates
removal, not an owner item).

## Amendment trail

- Born sketch 2026-08-17, executing immediately at the owner's
  "carry it out now" (ticket MCP-612 carries execution state, In
  Progress).
- 2026-09-04: the work landed on the fork's `engraph` as PR #38, merge commit `05ee4f092`
  (head `f373cded1`), by the merge bot. Acceptance 2, with its three probes: the primary
  was rebuilt before the first touch (the migrating reader is the new store's code), under
  which the live registry migrated from 1.3.0 to 1.4.0 — a comms append at 19:46Z, before
  any archive copy of that day's file was taken; real enqueue round-trips through the store
  on 2026-09-06 (intents `f9f62f39` and `4fdd0659`, enqueued, staged, fingerprinted and
  committed by the queue's own commit workflow); and on the primary checkout no store file
  is tracked and every one is ignored by the collaboration state's own rule
  (`commit-queue/*` in `.agent/state/collaboration/.gitignore`), read with `git ls-files`
  and `git check-ignore -v` on 2026-09-06. Acceptance 3 cannot be met for the 2026-09-04
  file (no pre-migration copy
  exists); the 2026-08-17 pre-split archive remains the owner's disposition item. The status
  field stays the owner's to change.
- 2026-09-06: the nine follow-up pointers and the owner items above mirrored from the
  lane-closed comms event into this tracked record (consolidation fold).
- 2026-09-06: acceptance 3 decided at the consolidation (Director ruling 1f67ddd7 returned it
  to the seat), by comparing every entry of the 2026-08-17 pre-split archive blob (the
  gitignored copy taken at the interim split) with the copy's own instant: 227 entries, the
  newest expiry 2026-08-14T08:05Z against a copy taken 2026-08-17T14:30Z, so zero entries
  were live when the copy was taken and zero at the 2026-09-04 landing; nothing could have
  been lost at either moment. The blob stays as machine-local ephemera under the
  collaboration state's ignore rule and needs no owner act; the criterion and todo 3 above
  are re-trued to that reading. The 2026-09-04 file has no pre-migration copy, as recorded
  above.
