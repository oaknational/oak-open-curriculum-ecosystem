# Cricket quartet tally — 2026-08-11, Director-seat allocation ("are we doing the right things?")

Panel shape: the effort-inversion quartet, both stances (8 legs), dispatched in
one parallel wave on one identical frame. Invoker: Plover lifts Troposphere
(b10c37), Director seat. Frame: the seat's post-compaction-resume allocation
(16:35→19:45Z) — review convergence held on external reviewer clocks, authoring
arcs deliberately held, two owner-raised High bug tickets (MCP-545/546)
Backlog/unassigned ~8.5h, one executor seat idle since 18:50Z. Commissioned by
the owner's direct word: "run Cricket, are we doing the right things?"

## Legs

| Stable role | Stance | Verdict | Tokens | Tool uses | Runtime |
| --- | --- | --- | --- | --- | --- |
| `cricket-judgement-low` | normal | DRIFTING | 29,120 | 1 | 15.4s |
| `cricket-judgement-medium` | normal | DRIFTING | 29,558 | 2 | 25.2s |
| `cricket-judgement-high` | normal | WRONG-PRIORITY | 33,112 | 2 | 47.3s |
| `cricket-procedure-xhigh` | normal | WRONG-PRIORITY | 32,865 | 2 | 164.8s |
| `cricket-judgement-low` | adversarial | WRONG-PRIORITY | 29,193 | 1 | 18.7s |
| `cricket-judgement-medium` | adversarial | WRONG-PRIORITY | 29,589 | 2 | 24.9s |
| `cricket-judgement-high` | adversarial | DRIFTING | 33,682 | 2 | 56.1s |
| `cricket-procedure-xhigh` | adversarial | WRONG-PRIORITY | 22,371 | 1 | 121.1s |

All eight returned; measured figures from the dispatch path's usage metering
(the 2026-08-10 gap — no metering surfaced — did not recur on this path).
Total ≈ 239,490 tokens; wall-clock dispatch-to-last-leg ≈ 3 minutes. Model
bindings per the standing quartet mapping (effort-inversion; the agent
definitions carry them — not re-verified per-leg this run).

Final: 5 WRONG-PRIORITY / 3 DRIFTING / 0 ON-TRACK.

## Reading

Non-unanimous on the token, unanimous on the substance. All eight legs —
every stance, every tier, judgement and procedure alike — named the SAME
finding and the SAME redirection: MCP-545 (300s function ceiling, ~1,700
runtime error events/day against beta users) and MCP-546, raised High at the
owner's word ~11:27Z, sat Backlog/unassigned with no executor routed, while
Forge idled comms-responsive from 18:50Z. The routes-not-executes seat shape
was uniformly read as sharpening the finding, not excusing it: routing is
the one action fully inside the seat's authority and gated by nothing.

Equally uniform in the other direction: every leg that examined them UPHELD
the seat's holds (authoring arcs held under converge-before-opening-new-
threads and context budget) and the event-driven waits on genuine external
reviewer clocks. The drift was narrow and specific, which is what makes the
panel's convergence strong evidence rather than pile-on.

The occupied-seats defence was correctly time-bounded by three legs: it held
until 18:50Z (every executor seat genuinely occupied) and expired the moment
Forge idled. The seat's error window is therefore ~55 minutes, not 8.5 hours
— but the error class (an owner-priority item with no named gate on its
non-routing, while the seat did self-authored lower-priority work) is real
regardless of window length.

## Adjudication (Director, at occurrence)

Verdict accepted without reservation. Actions taken in the same sitting:

1. MCP-545 (primary) + MCP-546 (behind it) routed as a decline-by-silence
   offer to the sole idle executor (directed event `01b625cf`); durable
   routing-intent comments on both tickets so the route survives seat churn
   (Wren froze for compaction 19:46:55Z mid-panel — the panel's "Wren
   imminent" fact expired during the run, sharpening the route to Forge).
2. The ungrounded flags honestly carried: Forge's fitness assumed reasonable
   (capable general seat) but not verified; the suggested resolutions'
   executability rides the normal card-a-gate machinery.

Routing outcome, minutes later (19:48Z): Forge answered with a premise
correction — not idle; the owner had directed MCP-558 at their seat
in-session just before the panel ran. MCP-545 ACCEPTED next-in-line behind
it, MCP-546 behind that; the owner can reorder at his word. So a SECOND
frame fact (Forge idle) had expired by dispatch. Net state change the panel
actually produced: MCP-545/546 moved from Backlog-unowned-unsequenced to
accepted-with-named-executor-and-sequence — which was the substance of every
leg's redirection, delivered through a different door than the panel assumed.

## Method notes

- One identical frame, its facts first-hand-verified minutes before
  dispatch (the 2026-08-10 contamination lesson applied) — and TWO of
  the load-bearing executor-availability facts nonetheless went stale
  around the run: "Forge idle" had already expired by dispatch (the
  owner had routed MCP-558 minutes earlier; learned at 19:48), and
  "Wren imminent" expired mid-run (their 19:46 freeze). Verification
  bounds staleness; it cannot prevent it — the adjudication section
  carries how each expiry landed.
- No partial-panel reading was transmitted anywhere before leg 8 returned
  (the 2026-08-10 partial-set lesson applied; the intermediate turns said
  only "N of 8, holding").
- One frame fact expired mid-run (Wren's freeze). Unlike 2026-08-10 no
  correction was injected: the fact was not load-bearing for the verdict
  direction (it named a SECOND executor, and its expiry only strengthens
  the surviving redirection). Recorded rather than re-run.
- The procedure legs ran 3–7× the runtime of the judgement legs at
  comparable-or-lower tokens; the adversarial procedure leg was the
  cheapest leg of the panel and still landed the full three-gate analysis.
