---
name: values-enter-by-first-hand-right-frame-read
polarity: pattern
category: agent
use_this_when: >-
  About to type a full identifier (sha, UUID, event id, claim id), a timestamp,
  a count, or an exit code into a command, filter, record, or prose narration —
  or about to build anything downstream of such a value.
proven_in: >-
  2026-08-08 one-seat arc (five instances in one day: invented UUID tail;
  blind comms filters built on an assumed clock; piped exit read as green;
  local tool time copied as UTC; a mis-narrated sha in prose), plus
  independent same-class instances at three other seats (hand-extended sha
  drawing a pinned-merge 409, 2026-08-07 and again 2026-08-12; a claim-id
  tail typed from memory at a pickup, 2026-08-10). Conserved with full
  detail in .agent/memory/active/archive/napkin-2026-08-14.md (2026-08-08
  entries).
proven_date: 2026-08-08
related_pattern: observation-that-does-not-bear-on-the-claim
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: >-
    An absolute value typed from memory, an assumed clock, a piped exit, or a
    wrong-frame copy silently poisons everything built on it — a blind filter
    reads as "no events", a fabricated tail dangles a thread pointer, a
    wrong-frame timestamp manufactures false interval verdicts downstream.
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure
> mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern)
> for the polarity discipline.

## The law

**An absolute value enters the work only from a first-hand, right-frame read
in the same block** — never memory, never an assumed clock, never a piped
exit, never a wrong-frame copy. "The work" means commands, filters, records,
AND prose narration: a mis-narrated sha in a status report misleads exactly
as a mis-typed one in a merge call.

Mechanically:

- **Identifiers** (shas, UUIDs, event ids, claim ids) enter whole, by command
  substitution from the surface that owns them (`$(git rev-parse …)`,
  `$(ls … | grep ^prefix)`), or by copy from a tool result visible in the
  current context. An 8-char prefix in prose is fine (render convention); a
  full identifier whose tail is not on screen is a STOP. A prefix is never a
  handle to complete from memory.
- **Timestamps** in records come only from `date -u` run in the same block.
  A copied value must also be in the RIGHT FRAME: tool output timestamps
  carry unknown timezones — first-hand but wrong-frame is still wrong.
- **Exit codes** run bare on their own line, echo on the next line, no pipe
  anywhere on the line ([`exit-codes-in-band-never-piped`](../../../rules/exit-codes-in-band-never-piped.md)
  is the rule surface; the pattern here is why it must bite at COMPOSE time).
- **Filters** are built from one observed row of the surface being filtered,
  never from memory of the schema or an assumed baseline.

## Why a written cure was not enough

The first cure ("resolve the pin first-hand before the call") did not bite,
and the same seat repeated the class within fourteen hours — because at call
time a fabrication does not FEEL like fabrication; it feels like recall. A
cure phrased as intent still routes through memory at the moment of typing.
The cure that held for the rest of the arc is mechanical, with no
self-assessment in the loop: the value is produced by the command itself,
in the same block, or the write stops.

## Falsifier

Any full identifier, timestamp, count, or exit code in a command or record
whose provenance is not visible in the same block or the current context
window. A seat that has read this pattern and still types one is evidence
that passive capture has failed for this class — route via
[PDR-098](../../../practice-core/decision-records/PDR-098-doctrine-traction-firing-detection-response.md)
toward an action-time gate.

## Related

- [`observation-that-does-not-bear-on-the-claim`](observation-that-does-not-bear-on-the-claim.md)
  — the claim-construction sibling: that pattern governs whether an
  observation supports a claim; this one governs whether a value was ever
  observed at all.
- [`exit-codes-in-band-never-piped`](../../../rules/exit-codes-in-band-never-piped.md)
  — the rule surface for the exit-code instance.
- [`verify-dont-trust`](../../../rules/verify-dont-trust.md) §Name the
  Instrument — the durable-surface gate this pattern feeds.
