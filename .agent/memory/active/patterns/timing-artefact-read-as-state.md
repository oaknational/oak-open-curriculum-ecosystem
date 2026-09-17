---
name: timing-artefact-read-as-state
polarity: anti-pattern
category: agent
use_this_when: >-
  About to mint instrument lore, a failure diagnosis, or a drop/hang/dead
  verdict from a read of an asynchronous or eventually-consistent surface —
  especially a read taken seconds after the write it is checking, or a
  wall-clock deadline that spanned a machine sleep.
proven_in: >-
  Three independent instances across three seats in 36 hours: watcher
  drain-step deadlines crossing machine-sleep windows read as hangs
  (2026-08-13 morning); a sub-minute GitHub timeline-read lag after a
  Copilot review request broadcast as a dead request path, withdrawn on a
  peer's second read (2026-08-11 ~23:3xZ); a review-request re-read seconds
  after firing treated as a silent drop, refuted by the later full timeline
  read (2026-08-13). Conserved in
  .agent/memory/active/archive/napkin-2026-08-14.md.
proven_date: 2026-08-13
related_pattern: observation-that-does-not-bear-on-the-claim
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: >-
    A timing artefact minted as instrument lore ("the request path is dead",
    "the watcher hangs under load") propagates to peers and reshapes fleet
    behaviour around a defect that does not exist.
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to avoid*,
> not a shape to repeat.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

## The failure shape

**A TIMING artefact is read as a STATE fact.** The instrument was healthy;
the read was early, or the clock the deadline measured was not the clock
the process lived on. Two recurring sub-shapes:

- **The too-early read.** An eventually-consistent surface (a GitHub
  timeline, a review list, a freshly-written registry) read within seconds
  of the write it is checking looks identical to a failed write. A too-early
  read of an eventually-consistent surface is a lookalike for a failed
  write — the temporal cousin of query-the-value-never-the-lookalike.
- **The sleep-crossed deadline.** A wall-clock step deadline that spans a
  machine sleep or suspend window fires on wake and reads as a hang; the
  same re-arm then works immediately, which is the tell.

## The cure

Before minting any instrument-failure lore, ask: **"could this be clock,
not state?"** Concretely: after any fire, one short retry on the proof
surface (60–90s for GitHub timeline reads) before a drop verdict; treat a
deadline that fired across a sleep window as a clock artefact until a
same-conditions repro says otherwise; and give freshly-authored
instrument-failure diagnoses the coldest read — in the recorded instances
every wrong diagnosis was authored confidently within a minute of the
observation and every correction came from a later or external read.

## Falsifier

An instance where the short-retry discipline delays recognition of a REAL
drop long enough to cost a lane materially — that would argue for
instrument-side cures (explicit ack surfaces) over read-side patience.
