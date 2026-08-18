# The comms landscape — three channels compared

Durable reference for the comms-channels skill (this directory's
sibling skill entry — the link-free naming survives byte-identical
projection beside either entry filename). Provenance: the
owner-directed comms-landscape analysis of 2026-08-11 (authored at the
Director seat after cross-session messaging arrived in Claude Code
v2.1.224 and its first live estate use), adjudicated into the skill's
behaviours on the owner's 2026-08-12 word. This reference carries the
durable comparison; the skill body carries the operational rules.

## The comparison

| | s2s (SendMessage) | ARC (rapid-comms channel files) | Stream (comms events) |
| --- | --- | --- | --- |
| Latency | seconds (wakes the receiver) | seconds (~15s tail worst case, per the ARC protocol) | event-driven delivery to watching seats; pickup waits on the receiving harness's wake |
| Durability | none — receiver's transcript only | thread-durable until folded | event files, folded to durable homes |
| Audience | one live Claude session — local by default, other machines when Remote Control connects them | named seats on a shared thread | whole estate, including absent and FUTURE agents (gap sweep) |
| Platform | Claude Code only | any agent that writes files | any agent (CLI) |
| Identity | harness session name | self-declared PDR-027 name + session prefix in entries | registry-integrated (PDR-027 seed, claims, liveness) |
| Observability | invisible to watchers and to everyone but the receiver | tailable, human-readable in place | the watched surface; tags and threading |
| Ceremony | near zero | low (append + tail) | highest (CLI flags, identity seeds) |

Verdict at analysis time, holding since: **all three earn their
place** — the latency × durability × audience split is not covered by
any single channel, so retiring one would either slow unblocking
(without s2s), flatten working narratives into event soup (without
ARC), or lose the only surface future agents can read (without the
stream).

## s2s contract facts (vendor's word, at adoption)

Source: the official cross-session messaging documentation,
<https://code.claude.com/docs/en/cross-session-messaging> (capability
arrived with Claude Code v2.1.224). `ListAgents` discovers live
sessions — local ones by default, sessions on the user's other
machines when Remote Control connects them; `SendMessage` delivers
TEXT ONLY to one of them by name. The receiver gets sender name and a
reply address — never context, files, or permissions. An incoming
message cannot approve a permission request or change settings (the
platform's own guard against permission laundering), and inbound
delivery can be held for approval. Delivery is to LIVE sessions only:
nothing lands anywhere for an absent, future, or non-Claude agent.
Re-verify these facts against the source above when the capability
changes underfoot.

## What the channels learn from each other

- **s2s learns record discipline from the stream**: ping over s2s,
  durable record on the stream, the ping naming where the record
  lands — the pattern the first live estate use modelled unprompted,
  now the skill's mirroring obligation.
- **s2s learns the SHA-prefix discipline from ARC**: ephemeral
  channels still make claims that get acted on; pin repo state
  exactly.
- **The stream learns latency from s2s**: pairing a stream event with
  an s2s nudge ("event <id> on the stream for you") gives
  seconds-latency WITH a record. A thin `comms ping` affordance doing
  both in one step would make the good pattern the easy one —
  tooling candidate, adopted-on-demand.
- **ARC learns liveness from s2s**: an ARC append can carry an s2s
  nudge to the counterpart when both are live Claude seats.
