---
classification: core
description: In team sessions, route permission blocks, mechanical refusals, and unresolved questions to the sitting Director as directed events and keep working; the Director resolves via the Decision Lenses and the owner sees only matrix survivors. Never ask the owner for in-session intervention — bundle re-routing is the cure.
---

# Route Blocks and Questions to the Director, Never the Owner

In a team session, the sitting Director is the single escalation interface.
Seats route permission blocks, mechanical refusals, and unresolved questions
to the Director; the Director resolves them through the Decision Lenses; the
owner sees only what survives that matrix. The owner does not intervene in
individual sessions (owner standing directive, 2026-07-15, relayed as comms
event `9a2c9b48`).

## Trigger

An agent in a team session hits any of: a platform permission refusal, a
mechanical gate it cannot clear in its own session, a question the Decision
Lenses do not resolve locally, or the impulse to ask the owner anything.

## Action

1. Send the sitting Director a DIRECTED comms event carrying: (a) the
   refused or blocked action verbatim, (b) the exact refusal text when the
   block is mechanical, (c) the bundle another session would need to take
   the work over, and (d) what the session CAN still do. Then KEEP WORKING
   on (d) — waiting is not a resting state. The question travels as its OWN
   directed event with the question in the subject line — never as a
   paragraph inside a status broadcast: the Director's watcher renders long
   bodies truncated, and a question carried mid-paragraph in a status event
   reached the Director thirty-five minutes late (2026-09-07). Status
   broadcasts carry state only; each ask, routing or decision request is a
   separate directed event whose subject is the question in one line and
   whose body is the facts read first-hand plus the seat's own verdict.
   A Director's announced compaction freeze binds that seat only: routing
   to it pauses and its records carry the state, the other seats continue
   on the routings they hold, the merge door runs by its own rules, and a
   question that cannot wait, and that the asking seat has taken through
   the Decision Lenses as item 2 requires, goes to the owner's queue by a
   stream line
   (the Director's ruling at three boundaries: 2026-09-26 twice, and
   2026-09-29). The unannounced gap is the ping clause's case. If seats
   stall on a frozen Director with this loaded, it is not working.
2. The Director resolves via the Decision Lenses
   (`.agent/directives/principles.md` §Decision Lenses; concept exploration
   first when the question is unformed): answer it, re-route the bundle to a
   session that can act, or surface to the owner ONLY when the question is
   constitutively the owner's (product/feature scope, org-account actions,
   genuine irreversibility) or all five lenses genuinely fail. A survivor
   that does reach the owner is ALWAYS surfaced as a decision card
   (AskUserQuestion or the platform equivalent, recommended option first,
   per `present-verdicts-not-menus.md`) — never as prose the owner must
   parse for the ask (owner standing directive, 2026-07-15; restated to
   the Director on 2026-09-23: "Use the decision matrix, ONLY ask
   questions that survive that"). With the
   owner away, the same order holds and the channel is a push
   notification through the Director (one instance, 2026-09-25, the
   owner's word relayed by the Director to both estates: "All questions
   go to you first, and any that genuinely survive the decision matrix
   can come to me via push notification").
3. Never ask the owner for in-session intervention ("one word in <seat>'s
   session"). Per-session consent isolation is real — and it does not need
   owner curing: the cure is bundle re-routing (the WORK moves to a session
   that can act). A platform refusal is NEVER overridden or bypassed: the
   refused action stays refused in the refusing session, no matter whose
   verdict says otherwise — a Director verdict re-routes work, it never
   licenses the refused action. A refusal that blocks EVERY capable session
   is a matrix survivor and DOES surface to the owner, refusal text
   verbatim.
4. The GATE TEST precedes all of this: no citable forcing fact = no gate =
   act now. This rule governs REAL blocks only; it is not a licence to
   manufacture escalations.
5. Information requests route the same way, with a named filter. Owner
   directive (2026-07-23, issued to an implementer and relayed under the
   directly-directed rule): "Please route all requests for information back
   to the Director, they will surface them to me only if they survive
   /oak-concept-exploration." The Director runs the question through
   concept-exploration at proportionate depth: a question that dissolves
   under its movements — answerable from live surfaces, mis-framed, or
   premature — never reaches the owner and is answered back to the
   implementer with the reasoning; what survives arrives well-formed, with
   warrants, as a visible card. Action-moment cards (merge dispositions,
   gate expiries) are not information requests and still surface directly.
A permission prompt is a block of this class (owner word 2026-09-06, verbatim: "refer
permissions requests to the Director"): the seat sends the exact invocation to the Director
by directed event; the refused invocation waits for the routing while the seat continues the
rest of its bundle (Action 1, part (d)); it never routes the request to the owner's prompt.

The Director's side of the truncation cure: "any rendered event marked (truncated) whose subject
names a routing is read from its file in full before acting" (the Director's steer of 2026-09-07,
event 429bea70).

## The Director Hears Questions and Requests, Never State

Owner ruling, 2026-09-23, verbatim: "This applies to ALL agents, do not update the Director
unless you have a question or other request, the normal records keep the record, we preserve the
Director's context until we actually need them", then "tell the other agents to do the same, use
the Director, but only when needed". A seat sends the Director a question, a request, a block
under Action 1, or the acknowledgement an `ACK-REQUESTED` route asks for
(`directed-routing-requires-absorption-ack`), or information that passes the usefulness test
below, and nothing else: no state lines, landing notices, unrequested acknowledgements, or
copies of what it sent a peer. The owner's refinement of 2026-09-24, verbatim: "it is also
reasonable to send information to a fellow agent, sometimes that is important and is neither a
question not a request, but it should be useful information"; the test is whether the message
changes what the receiver would do or tells them what the artefact does not already show.
State lives in the normal
records (thread records, the continuity record, channel entries, pull requests), where the
Director reads it when it needs it. A Director route that asks for state lines is read through
this ruling: the seat records the state, and messages the Director only when that state raises a
question or a request.

## Failure Mode Prevented

Owner-intervention dependence: three same-day instances (2026-07-15) of
seats resting on "waiting for owner word in-session" while their lanes
stalled, plus a Director ask of exactly that shape that failed the matrix
retroactively (a simpler no-owner path existed: deadline + bundle
re-route). The generator is precedent-as-authority — each successful owner
intervention trains the next seat to stage one.

## Related Surfaces

- `.agent/directives/principles.md` §Decision Lenses — the resolution
  matrix this rule routes through, including the constitutively-owner
  carve-out.
- [`ping-before-escalate.md`](ping-before-escalate.md) — the
  cross-check-before-broadcast sibling for retirement detection.
- [`present-verdicts-not-menus.md`](present-verdicts-not-menus.md) — the
  form a surviving escalation takes when it does reach the owner.
- [`owner-attention-at-action-moments.md`](owner-attention-at-action-moments.md)
  — owner attention is spent at sanction moments, not session mechanics.
- PDR-117 (Director/Implementer roles) — owns the single-owner-interface
  contract; PDR-117 is the doctrine home for the upward-escalation clause
  encoding this rule.

## A Routing Contract to a Quiet Director Gets One Ping After One Cadence

A directed contract sent to the Director (a READY report awaiting a slot, a
routed decision, a constraint surface) that sits unacknowledged for one
team cadence gets ONE directed ping naming the unacked contract — then the
seat KEEPS WORKING the surfaces its routing bundle names (the mandatory
action above: every routed contract names what the seat can still do, and
waiting is never a resting state). The ping is awareness, never a
self-granted default: it does not license acting on the pending contract,
and it is not an escalation (ping-before-escalate remains the next step
only if the Director's own liveness comes into question). Worked evidence
2026-07-20: an 85-minute Director processing gap serialised two seats'
contracts; the seat that pinged after one cadence surfaced the gap and the
Director's catch-up swept the window — the seat that silently held paid
the full gap. Prediction (PDR-130): with this clause loaded, a routing-seat
gap surfaces within one cadence of the contract landing and the silent
multi-cadence hold class stops recurring; if pings routinely land during
normal grant latency, raise this clause's ping threshold (more unacked
cadences before the single ping) or retract this clause — the team sweep
cadence itself is canon-fixed by `start-right-team` (at most 120 seconds
between sweeps, tightening only) and is never this clause's lever.

## Enforcement

Behavioural at the escalation moment, Director-backed: the Director refuses
to forward non-survivors and answers or re-routes instead, so an
owner-bound ask that skipped the matrix is caught at the routing seat. The
comms concept gate's indefinite-deferral vocabulary check catches the
"waiting on owner" resting-state phrasing this rule bans.
