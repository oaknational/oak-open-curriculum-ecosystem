# Comms absorption sweep — 2026-08-07

The recorded PDR-094 absorption sweep over every live non-heartbeat comms event
created after the prior extraction watermark (2026-07-31T07:54Z, the completed
comms-corpus full-journey run). Run at the 2026-08-07 owner-launched dedicated
consolidation (Gull lifts Nimbus, 3da0ae, claim de328d24), at the owner's word
that analysis precedes archive: the goal is curated understanding, with the
archive as the receipt of analysis done.

**Watermark declared by this record: swept through 2026-08-07T16:11Z.** A
future step-3a pass may archive-move events at or before that instant once
their class windows lapse (heartbeat 48h; coordination/directed 7d), citing
this record as the covering sweep.

## Method

- Corpus: all 995 live non-heartbeat events at sweep time, dumped
  chronologically with full bodies and split into 12 time-contiguous windows.
- Map: one `corpus-mapper` leg per window (sonnet/low, schema-forced structured
  output; workflow run `wf_b94ace4d-a3e`, ~1.05M subagent tokens, 12/12 legs
  complete, zero errors). Each leg read its whole window file and extracted
  signals in seven categories: owner-word, routing-decision, failure-mode,
  behaviour-note, knowledge-claim, dead-seat-residue, coordination-fact — each
  with a verbatim quote and the durable home the event itself names (or null).
- Coverage verification: independent `wc -l` per window corroborated each leg's
  claimed line-range coverage. The legs' `eventsRead` self-counts summed 691
  against 995 actual headers — the counts were wrong while the reads were
  complete. **Instrument lesson: a schema-forced count field invites a
  confident wrong tally; line-range coverage against an independent line count
  is the completeness instrument, never the seat's own count.**
- Synthesis and adjudication stayed at the dispatching seat (the vindicated
  fleet-topology finding), with first-hand home verification for every
  adjudicated cluster.

## Findings

481 signals (full set: [`data/signals.json`](data/signals.json)): 107
knowledge-claim, 84 failure-mode, 83 owner-word, 83 coordination-fact, 80
routing-decision, 28 dead-seat-residue, 16 behaviour-note. 295 named their own
durable home (spot-verified); 186 named none and were adjudicated one by one:

- **Landed (genuinely under-homed, two clusters):** the shared-index
  commit-sweep discipline (five instances 2026-08-01→2026-08-07: a bare commit
  takes the whole index; pathspec on the commit itself; untruncated cached-diff
  read before every commit; staged-content inspection before ceremony commits)
  → `stage-by-explicit-pathspec` §The Commit Is Also a Sweep; the owner glance
  surfaces (harness TODO list + heartbeat cycle labels move at real phase
  transitions; owner-worded 2026-07-31 and 2026-08-01) →
  `agent-state-observable`.
- **Verified duplicates (no edit, home named):** suppressed-Copilot harvest
  (`pr-lifecycle`, 7-of-7 measured on one arc), head-N truncation
  (`read-diagnostic-artefacts-in-full`), shared-branch lint contention
  (`worktree-residency` §commit path), coordinator dark-window + autonomous
  emitter (`liveness-heartbeat-cron`, landed this pass), model-unavailability
  fallback (PDR-015), make-it-safe-binds-the-referent
  (`important-state-not-in-temp-files`), population-claim census
  (`validate-full-target-estate` class), worktree-residency owner directive
  (the rule itself).
- **Spent / ephemeral (window-scoped, no home owed):** merged-PR facts, lifted
  gates and embargoes (the Linear embargo lifted 2026-08-06), seat
  freezes/rejoins, succession mechanics — carried by their lane records, thread
  records, and the Director succession maps.
- **Residue routed to the sitting Director (pointers, not re-homed):**
  `practice:substrate:check` wired to no CI workflow or hook (the 5.5-week
  stale-pin generator); the unstaffed use_this_when backfill +
  mechanical-prevention obligation and the closeout
  ref-enumeration obligation (both named on the 2026-08-01/02 stream, both
  declined by capacity-constrained seats); the theatre-hypothesis inquiry's
  owner-ordered journey record (verify it exists before the evidence run); the
  cricket tallies for the 2026-08-05 four-leg run and the 2026-08-01 WS-B split
  (verify recorded at occurrence); the freeze→retained-adversary-before-
  external-dispatch review ordering (PDR-015 candidate); the Codex per-user
  vendor-memory corpus audit (owner-priced fleet job; Cursor/Gemini stores
  verified empty).

## Step-3a archive batch (same pass, gates run by hand)

6,045 events moved to the comms archive under the three PDR-094 gates:
5,309 heartbeats past the 48h class window (cadence-aggregate-once discharged
at the prior run's census; supplemental batch aggregate — 37 seats, 5,309
events, span 2026-07-24→2026-08-04) and 736 non-heartbeat events under the
2026-07-31T07:54Z watermark. Verified post-move: zero post-watermark and zero
in-window events in the archive; provenance check green before and after;
rotation notice broadcast before the batch. The live stream holds 1,411
events, all in-window or covered by this record's watermark.
