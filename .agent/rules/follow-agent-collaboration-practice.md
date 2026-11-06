---
classification: core
description: Follow the agent-to-agent collaboration model.
---

# Follow Agent Collaboration Practice

Read and follow `.agent/directives/agent-collaboration.md`.

This rule operationalises the agent-to-agent working model: knowledge
and communication (not mechanical refusals), peer dialogue, scope
discipline across agent boundaries, the five communication channels,
identity vs liveness, and the bootstrap fast-path. Sibling to
[`follow-collaboration-practice.md`](follow-collaboration-practice.md)
which covers the agent-to-owner model.

## Inter-Agent Comms Is First-Class And Parallel-Default

When another agent's state intersects yours — blocking, cooperative, or
informational — posting a comms-event addressed to that agent is always
available and is the *preferred* coordination move. It runs **in parallel**
with continuing your own work, surfacing options to the owner, and
reviewing alternatives; it is never a serial prerequisite to owner
escalation. The owner is the right channel only for owner-owned decisions
(cross-thread reframing, scope changes, named deferrals, anything outside
another agent's claim authority); for everything else, agents decide what
to ask whom, including which channel (async comms-event vs sync sidebar),
which agent, which deadline, and what default action. For blocking
situations, include a deadline + default action in the message body so a
future reader can resolve the coordination if no reply lands. Source: the
owner's standing sharpening of 2026-05-05 (Opalescent Threading Nebula's
session).

## Source doctrine

- [PDR-076 Agent Identity Tuple](../practice-core/decision-records/PDR-076-agent-identity-tuple-and-body-file-frontmatter.md)
  / [PDR-076a (name + UUID)](../practice-core/decision-records/PDR-076a-agent-identity-tuple-name-and-uuid.md)
  / [PDR-076b (body file frontmatter)](../practice-core/decision-records/PDR-076b-body-file-frontmatter-contract.md)
  — canonical identity carried by every directed comms-event and every
  collaboration artefact this rule governs.
- [PDR-078 Liveness-Heartbeat Contract](../practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md)
  — portable liveness contract distinct from identity; heartbeat cadence
  and stale-detection semantics that peer agents observe through the
  comms substrate.
- The `agent-tools` comms-event substrate — the heartbeat lifecycle
  (implementing PDR-078 via the comms-event channel) and the tag taxonomy
  for routing and filtering inter-agent comms.
