---
name: "Claim Before Check"
polarity: anti-pattern
category: agent
use_this_when: "About to state a status, mechanism, size, population or board fact to a peer, the owner, a PR record or a ticket — 'pushed', 'merged', 'the gate is released', 'the fleet is N seats', 'that plan is an unsanctioned sketch', 'the client should still complete' — and the state that would confirm it has not been read in the last few minutes."
proven_in: "Nine grounded instances across five consecutive napkin windows, every catch external: 'commit pushed' told to the Director while the push had exited 128 (2026-07-28); a merge broadcast declaring a design-lane gate released (2026-08-01); fleet population claims transmitted without a census (2026-08-03); four mechanism claims narrated past their instruments in one day, the day the pattern was named (2026-08-04); six-plus instances in one Director tenure with two variants named (2026-08-06/07); a freeze broadcast's 'full gates green' false at utterance because the CI run had already failed (2026-08-09); four falsified premises in freshly authored claim-bearing text in one day (2026-08-11); a ratified, executed review fleet reported to the owner as an unsanctioned sketch (2026-08-13); a prediction dressed as a proof (2026-09-01). Kept by the 2026-09-02 adversarial quorum as an all-window recurrence; conserved in the 2026-09-02 historical napkin synthesis."
proven_date: 2026-08-04
related_patterns:
  - falsification-cost-determines-claim-quality
  - observation-that-does-not-bear-on-the-claim
  - values-enter-by-first-hand-right-frame-read
  - query-the-value-never-the-lookalike
  - surface-that-misinforms-without-failing
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "A claim transmitted before the confirming read spends a peer's or the owner's attention on a non-fact; the correction arrives from outside, later, at full cost, and the seat's next confident claim is discounted."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to avoid*,
> not a shape to repeat. Named by the update-lane seat on 2026-08-04 after
> four instances in one day; the enforcing clause is
> [`verify-dont-trust` §Name the Instrument](../../../rules/verify-dont-trust.md),
> and this file is that clause's concept node: the shape, its variants, and the
> longitudinal evidence that it recurs despite the clause.

## The shape

A seat states a fact about the world — a push landed, a merge happened, a gate
released, a fleet has so many seats, a plan is unsanctioned, a client will still
complete — and the statement reaches a durable or attention-bearing surface
(a broadcast, an owner message, a PR comment, a ticket, a freeze record) before
the seat has read the state that would confirm it. The story is coherent, so it
ships. The correction is always external: a reviewer, a peer, a validator, the
owner's browser. No instance in the five-window corpus was self-caught at the
moment of composition.

## Two variants the basic tripwire does not catch

- **Target versus actual.** The seat probes whether a value *would be accepted*
  and reports that as what the system *sends* — the probe answered a different
  question than the claim, about the same string (2026-08-07).
- **Recorded then believed.** The original observation was true when made; the
  decay is in a later re-reading that cites it as current (2026-08-07, 2026-08-13).
  The tripwire therefore fires at citation time, not only at authoring time:
  naming the instrument is a check on quoting yourself.

## Why it survives its own cure

A coherent story is cheaper and faster than a check, and it arrives fluently
(the metacognition directive's fluency-as-warning). The variable that decides
whether the class fires is access and cost, not care: on a day when the
authoritative surface was unreadable a wrong theory survived thirty minutes and
cut a release; on the next day, with every check reachable, every wrong claim
died within minutes (2026-08-03 to 04). Seats that had read the rule the same
morning recommitted the class the same afternoon (2026-08-13, 2026-09-01). The
recurrence is measured across five windows with the rule in force throughout,
which places this class in the action-time-interrupt family: prose cures do not
move its rate.

## The cure that works

Before a claim about status, mechanism, size or severity reaches a colleague or
a durable surface, name the instrument that proved it, in the same breath. If
the answer is "reasoning", the claim is a prediction: say so and gate it, so
being wrong costs nothing. Restore access to the authoritative surface rather
than reasoning around its absence. Recompute at the moment of citation, not
only at the moment of authoring. Structural forms that have held: the
settlement-verdict instrument as the only source of PR-state declarations; a
CI-green claim that names the concluded run; a freeze record that quotes the
timestamped artefact rather than a narrative clock.

## Falsifier

A napkin window in which a claim-before-check instance is caught by its author
at composition, before any external reader, would show the class is now held as
habit rather than knowledge; a window with zero instances after a structural
tripwire lands would show the class extinguished. Neither has been observed;
the corpus records recurrence after every cure so far.
