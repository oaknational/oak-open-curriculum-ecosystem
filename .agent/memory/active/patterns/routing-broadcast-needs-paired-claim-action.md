---
name: Routing Broadcast Needs Paired Claim Action
polarity: pattern
category: coordination
status: provisional
discovered: 2026-05-22
proven_in: "Single instance 2026-05-22: routing broadcast at 14:47Z stated 'distilled.md is properly Tempestuous's OUTPUT lane, not mine. Routed'. The broadcasting agent continued editing under direct owner direction; commit landed at 14:54Z. Peer opened a claim based on the routing broadcast at 14:51Z. Collision discovered when peer's Edit failed with 'file has been modified since read' — the binding state was the still-open claim, not the routing broadcast. Resolved by an explicit directed release event. Second instance in a different multi-agent session would strengthen the pattern."
---

> **POLARITY: PATTERN.** When routing a file to a peer, the routing broadcast must be paired with an action on the claim surface — close or narrow — or the claim continues to bind ownership.

# Routing Broadcast Needs Paired Claim Action

A routing broadcast naming a file as another agent's lane does
**not** release the routing agent's claim on that file. The claim
is the binding ownership marker; the broadcast is a recommendation
about future ownership. The two surfaces are not coupled — claim
release requires an action on the claim surface.

## The Invariant

When routing a file to a peer, simultaneously **either**:

- **(a)** close the claim that covers the routed file (if the
  claim's entire purpose was that file), **or**
- **(b)** edit the claim to narrow its file pattern list, dropping
  the routed file (if the claim still covers other live work).

The routing broadcast goes on the comms stream; the claim action
goes on the active-claims surface. Both must happen, in the same
window, for the routing to actually bind.

## The Failure Mode

Without the paired claim action, the routing produces a coordination
hazard:

1. **Broadcaster** continues to hold the claim and may continue to
   edit the file (under owner direction, under "just one more
   fix", under any other pressure).
2. **Recipient** opens a new claim based on the broadcast.
3. **Both** are now claim-holders on the same file. The active-
   claims registry shows the overlap; the comms stream shows the
   routing; neither surface alone is the full picture.
4. The first actual edit triggers an Edit-tool conflict
   ("file has been modified since read") or an active-claim
   collision warning. Coordination resolves only after one party
   takes the missing action explicitly.

## Why It Recurs

- **Broadcasts feel binding.** They are public, addressable, and
  observable. The agent feels they have communicated the change.
- **Claim surfaces are heavier.** Editing the claim surface
  requires a tool call beyond the broadcast. The broadcast alone
  feels sufficient.
- **Owner pressure can override the broadcast.** "Just commit
  this one more time before you stop" produces continued edits
  under the original claim without the agent noticing the
  routing was supposed to bind.

## How to Apply

At the moment of broadcasting a routing of a file or area to a
peer:

1. Compose the routing broadcast.
2. **Before sending**, take the paired claim action (close or
   narrow).
3. Send the broadcast.

The ordering matters: the claim action **before** the broadcast
prevents the gap window where the broadcast is live but the
claim still binds. If the claim action fails, the broadcast does
not go out.

## Cross-References

- `.agent/rules/respect-active-agent-claims.md` — the claim
  registry is the binding ownership marker; this pattern names
  one specific way it can drift from the comms stream.
- `.agent/rules/register-active-areas-at-session-open.md` —
  upstream discipline; this pattern is the down-stream pairing
  when ownership transfers mid-session.
- This pattern now carries the live trigger: a second instance of routing
  preceding release without explicit claim action promotes the substance to a
  rule or PDR. The duplicate pending-register body was drained on 2026-05-24
  after this home was verified.
