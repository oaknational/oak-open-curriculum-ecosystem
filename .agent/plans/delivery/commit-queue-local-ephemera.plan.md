---
id: commit-queue-local-ephemera
node_type: delivery
name: "Commit queue as machine-local ephemera — per-intent files, 1-hour TTL, list-as-view"
overview: >-
  Re-shape the commit queue per the owner's four-point ruling: queue state is
  local-machine ephemera that never enters version control; it leaves the
  flat active-claims.json for per-intent event files (the comms-store shape)
  with a 1-hour TTL, and list/status become views over the directory.
status: sketch
serves: coordination-substrate
impact_areas:
  - practice-and-estate
tickets:
  - MCP-612
depends_on: []
owner_gates: []
last_updated: 2026-08-17
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
3. The legacy blob's verification read at landing confirms zero live
   (unexpired) entries were lost, then its disposition goes to the
   owner. Proof: owner-held.

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
   legacy-blob verification read and owner disposition (acceptance 3).

## Amendment trail

- Born sketch 2026-08-17, executing immediately at the owner's
  "carry it out now" (ticket MCP-612 carries execution state, In
  Progress).
