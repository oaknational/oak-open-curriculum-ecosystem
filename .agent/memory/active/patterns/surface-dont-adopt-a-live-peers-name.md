---
name: "A Live Peer's agent_name Assigned to Your Fresh Session Is a Collision to Surface, Not Adopt"
polarity: anti-pattern
use_this_when: "Registering a session identity when the owner-assigned or derived agent_name matches a name already live in the claims registry or comms stream."
category: process
proven_in: "2026-06-21 (Aardvark turns Whisper) — rotating-cast name reuse"
proven_date: 2026-06-21
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Two live sessions sharing an agent_name — corrupting the comms-seen cursor, claim attribution, and statusline wing-detection, which key on the name, not the UUID."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** Identity is name + UUID — but the team's
> coordination surfaces key on the **name**, not the UUID. Two live
> sessions sharing a name is corruption, not a harmless coincidence.

## The failure shape

The comms-seen file, the claims registry, and the statusline
wing-detection all key on `agent_name`. So two concurrently-live sessions
with the same name corrupt the seen-cursor (re-emits or misses events),
mis-attribute claims, and confuse wing-detection — even though their
UUIDs differ.

## The cure

When an owner-assigned or derived name matches a name already **live** in
the registry/comms stream, STOP and surface it before registering. Take a
distinct identity. The UUID's distinctness does not save you, because the
surfaces that coordinate the team do not read it. Sibling:
[`feedback_agent_identity_name_plus_uuid`], frictions register F-88.
