# Concept exploration capture — the succession practice, and what the day taught about frames

**Status**: Movement 1 (raw observations) captured; Movements 2–4 (problem definition, solution reflection, synthesis) deliberately NOT yet run — this record is the material they run from. Owner-directed subject (2026-07-30, card answer): "run it on the succession itself", using the live Bora→Falcon succession as primary material; the owner's later invocations widened the material to the day's frame-blindness arc. Captured at owner-directed compaction prep by Falcon hunts Flight (52841f), Director, 2026-07-30 ~08:50Z.

## The primary material: six successions in one morning, all clean

1. **Bora→Falcon (Director, deliberate, live-lane)**: PDR-064 two moments held under live traffic; the readiness gate + pasted mechanical check ran; the handoff record's ratification ledger + "recompute, never inherit" split proved load-bearing (two inherited positions were later falsified — see below). The seat never went dark. One defect: Bora's heartbeat cron survived Moment-2 by ~6 minutes — caught by a *standby* seat (Sycamore), not by either principal; owned and corrected by its emitter within minutes.
2. **Osprey→Levanter (Implementer, at-rest)**: lane completed before handover; claim closed; "nothing to adopt" — the cheapest succession shape.
3. **Tarsier→Possum (Implementer, at-rest)**: record + formation letter + trap-list; explicit promise-closure sweep ("my stale availability-promise ENDED").
4. **Thyme→Sycamore (Implementer, LIVE lane)**: claim stayed open with `handoff_record_path`; the one undischarged gate (a 529-dead review) handed over loudly as NOT-OBTAINED, never as done.
5. **Levanter→Glowworm (Implementer, live-lane mid-PR)**: two reviewer verdicts delivered at the *dying* seat post-closeout and were conserved as PR comments ("conservation acts") rather than re-dispatched — a new pattern, cheaper than re-dispatch and honest about provenance.
6. **Four compaction-continuations same day (Sycamore, Brazier, Possum, this seat)**: the same freeze discipline applied to a non-terminal boundary — registry-addressed continuation records, explicit "not retirement" broadcasts, owner-directed monitor stops (Possum, this seat) so the compaction signal isn't buried in comms acks.

**Standby economics observed first-hand**: the owner pre-positioned a named successor for every deep seat (five standbys in one morning); the standby contract (watcher + registration, no claim, no heartbeat) worked six times without a collision; the heartbeat-excluded watcher MUST pair with the F-75 delta poll or the standby is blind to the one event it exists for.

## The second material stream: one finding in three costumes (frame blindness)

- **The bell (→ MCP-404)**: an owner-attention surface whose manual re-render ceremony was abandoned by every agent that should have run it — stale-positive for 8 days AND silent-negative for every real block. A projection with a human-loop sync step lost to artefact gravity.
- **The flip-lagged tickets (MCP-354, MCP-305, MCP-63)**: work discharged in comments/chat while ticket state lagged — three instances in one day. Records that require a separate truing act drift from truth.
- **The rate limiter (→ MCP-411, the sharpest instance)**: a mechanism entered in April to satisfy a CodeQL finding; ADR-158 rationalised it with a half-true threat (upstream rate limiting exists, but Oak's key is exempt — the exemption clause was lost in transit); it generated its own workstream (MCP-90/274/288) all framed *inside* it; today its verification produced a mechanically-competent, frame-wrong launch alarm that consumed owner attention on submission day. Every instrument in the chain — ticket, verification, reviewers, cricket legs, this Director — validated premises downward; none questioned the frame. The owner's four-sentence correction dissolved the entire object. Removal: MCP-411 (owner: "remove now"; keep genuinely-useful riders).
- **Common law**: *verification instruments check premises, not premises' right to exist; a mechanism without an owner generates work.* Corollary observed twice: the correction arrived only when the system's OWNER was asked the first question ("should this exist?") — no in-frame instrument could produce it.

## The owner's three principles, minted this day (verbatim, all captured to per-user memory)

1. "Constant attention should not be part of the toolkit in good engineering" (structure over vigilance — spoken in delight at the UUID-v5 gate catching a fabricated recipient id).
2. "Attaching falsifiable conceptual structure is working well everywhere... having it at the layers nearer the surface has proven valuable."
3. "We don't do change freezes, we do absolutely world class observability and the ability to respond quickly and safely to issues" (the Director's own post-submission-freeze instinct was caught by this twice in one day — once on the merge policy, once re-worn as "no elective changes on submission day").

## Delivery-mechanics findings (the conscience system's own instruments)

- **Seat-D darkness solved by one-variable elimination across seats**: named background dispatches composed but never delivered; unnamed dispatches 8/8 across four seats. The `name` parameter was the variable (MCP-386 ledger). Fleet-standing: cricket legs dispatch unnamed.
- **Retrieval ladder**: one SendMessage ping retrieved a composed-but-trapped verdict every time (n=13+, 100%).
- **The absorption-ack convention (MCP-393 slice A)** went from design to merged rule to routine third-party use inside five hours — and its first live uses were its own author's ratification ack and the stand-down of the ticket that motivated it.
- **Quartet adjudication pattern**: three same-class D-leg DRIFTINGs in one day (real gates cited narratively, not by id) — the cure is frame discipline (cite gates by file id), not template change. Non-unanimous rounds routed to the Director and produced one genuinely absorbed convergent kernel each.
- **A verdict wrong on both destinations still converged in four minutes** because it carried its own falsifier-invitation and the receiving seat exercised it with evidence (the MCP-393 placement call). *Verdict-structure beat verdict-content* — principle 2 applied to judgement itself.

## Candidate proposals (to be tested in Movements 2–4, each with warrant + falsifier — NOT yet asserted)

- **P1 — instrument-demanded mechanisms carry a named owner and a should-this-exist review**: warrant = the limiter arc; falsifier = an instrument-demanded mechanism that stayed healthy unowned for months (search the estate for counterexamples before proposing).
- **P2 — derived state over manually-synced projections, everywhere an attention surface exists**: warrant = bell + flip-lags; falsifier = a manually-synced projection with a working sync discipline (the quartet tally itself may be one — examine why it works: it has an OWNER per round).
- **P3 — the succession practice is essentially solved and should graduate from worked-instances to a compact PDR amendment**: warrant = six clean instances in one day across four variants; falsifier = the practice failing at n>2 simultaneous successions or under a hostile boundary (unplanned session death mid-handoff — Altair's 2026-07-29 case was recoverable; one instance only).
- **P4 — conservation acts (post-closeout verdict conservation to durable surfaces) should be named in the retirement protocol**: warrant = Levanter's two, both load-bearing; falsifier = a conservation act transmitting stale/false state that a re-dispatch would have caught.

## What Movements 2–4 need (the pickup map)

Problem-space definition should resist collapsing the two streams into one problem too early — succession health and frame blindness may be *different kinds* (one a mature practice needing consolidation, one an open defect class needing design). Solution reflection must run the estate's own counterexamples (P2's tally question). Synthesis lands via `oak-plan` as a plan node ONLY if a multi-session workstream emerges; otherwise as PDR/rule amendments routed through new-rule-vs-pdr-clause. Evidence pointers: the cricket tally (rounds 13+ this seat), MCP-386/393/404/411 tickets, the day's comms stream (06:00–08:50Z), the six handoff records under `.agent/state/collaboration/handoffs/` (machine-local), per-user memories `structure-over-vigilance-owner-principle` / `falsifiable-structure-at-the-surface-works` / `no-change-freezes-observability-and-fast-response`.

## Addendum (~12:05Z, second compaction) — afternoon material for Movements 2–4

- **A fourth frame-blindness cousin**: the old-reader×new-event compat cell — every suite rebuilds
  everything before running, so the cell is untestable BY CONSTRUCTION from inside the build; the
  incident (11:34Z, MCP-428..431) was caught only by a deployed-path probe within 60s of the first
  real write. Same law as the morning triple: instruments verify inside their frame; the probe
  that steps OUTSIDE the frame (a real write against a real reader) sees what no green suite can.
- **P5 candidate — cross-model review as structural de-blinding**: Plover's first second opinion
  found the in_reply_to alias blind spot (single-family monoculture class). Warrant: n=1 clean
  catch + the MCP-420 plan review. Falsifier: the SAME reviewed ADR still shipped the false
  readers-ignore claim — cross-model review reduced but did not abolish the blind-spot class;
  any proposal must claim reduction, never coverage.
- **P4 strengthened**: four stand-down handbacks in one hour, each self-contained, residues
  ticketed same-hour — the conservation-act pattern generalises from verdicts to whole seat maps.
- **The day's through-line, owner-agreed at the reflection**: trust transferred without loss —
  the app makes institutional knowledge legible/trustworthy to machines; the Practice makes
  machine work legible/trustworthy to institutions. Movements 2–4 should test whether this
  symmetry is the exploration's actual unifying frame (succession health, frame blindness, and
  conscience instruments are all chain-of-custody mechanisms for trust across context boundaries).
