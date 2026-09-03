---
name: comms-channels
classification: active
description: >-
  Choose the right DELIVERY LANE for live agent-to-agent messaging —
  s2s (SendMessage) for time-critical unblocking between live Claude
  seats, ARC channel files for rapid dialogue with a named
  collaborator, the comms event stream for the discovery narrative
  every present or future seat must find, Slack-via-Watcher for
  traffic whose audience is the owner or humans on the Practice Slack
  channel — and hold the behaviours that keep the fast lanes honest:
  decision-bearing content (Slack-crossing included, both directions)
  mirrors to its durable home at occurrence, no flow ever requires
  s2s, a peer message is never the owner's approval. Fires when
  messaging another seat, at Claude Code session open, when a new
  live-messaging capability arrives, or when participants may include
  a non-Claude seat. Not for durable state or record routing —
  continuity to thread records, claims to the registry, decisions to
  their threads, owner questions to cards; the
  agent-collaboration-channels card stays the routing authority.
---

# Comms Channels

Operationalises the owner-directed comms-landscape analysis
(2026-08-11; see
[`references/comms-landscape.md`](references/comms-landscape.md) for
the full comparison and its provenance). Scope: the
DELIVERY/LATENCY lanes for live agent-to-agent messaging — one slice
of the estate's channel model, not the whole of it. The canonical
routing card
([`agent-collaboration-channels`](../../memory/executive/agent-collaboration-channels.md))
remains the authority for every other shape: thread records for
cross-session continuity, decision threads and sidebars for structured
async decisions and evidence, reviewer dispatch, and owner questions.
Within the delivery lanes, each earns its place on a latency ×
durability × audience split no single lane covers; the behaviours
below keep the fast lanes from hollowing out the record.

## Choose the channel

| You are sending… | Channel |
| --- | --- |
| A time-critical unblocking ping, short question, ack, or "look at the stream/ARC" nudge to a LIVE Claude seat | **s2s** (`SendMessage`) |
| Rapid, high-bandwidth LIVE dialogue with a named collaborator where latency dominates — a standalone file-backed sidebar whose substance is conserved at close | **ARC** (rapid-comms channel file) |
| The discovery narrative and notification the estate's record must carry: routing, liveness, broadcasts — anything a resume's gap sweep must find, anything an absent or FUTURE agent needs to notice | **The stream** (comms events CLI) |
| Canonical STATE, which the stream announces but never stores: an active work claim (the claims CLI → `active-claims.json`, with a stream announcement where required), a structured async decision (`conversations/`), an unresolved owner-facing case (conversation + `escalations/`) | **The state surface + a stream event** |
| A message whose audience is the owner or humans on the Practice Slack channel, or a question to the live Slack Watcher | **Slack-via-Watcher** (the `talk-to-slack-watcher` skill; the channel is the durable substrate on its side of the boundary) |
| Cross-session narrative continuity, a durable multi-session hand-off, structured evidence for a decision, specialist review, or a question only the owner can answer | **Not a delivery lane** — route per the [canonical card](../../memory/executive/agent-collaboration-channels.md): thread record, decision thread/sidebar, reviewer dispatch, or an owner card |

The split, in one line each:

- **s2s is the interrupt line.** Seconds latency, wakes the receiver;
  no durability (the receiver's transcript only); one live Claude
  session — local by default, other machines only when Remote Control
  connects them. Nothing else in the estate wakes a peer in seconds.
- **ARC is the rapid sidebar.** Seconds-scale delivery (~15s tail
  worst case, per the ARC protocol's own measurement), readable in
  place, thread-durable until its substance is conserved at close; any
  agent that writes files. Operationally a standalone file-backed
  sidebar (the ARC reference's own relationship clause): choose a
  decision thread when the exchange must be durable and structured
  from the start; choose ARC when latency and bandwidth dominate.
- **The stream is the record of transport** and the only surface that
  reaches agents who are not there yet. Registry-integrated identity,
  tags and threading, watcher-observable. It is notification and
  narrative, NOT the store: claims live in the claims registry,
  structured decisions in `conversations/`, owner-facing cases in
  `escalations/` (per `use-agent-comms-log`) — a claim or ruling that
  exists only as a stream event is invisible to the registry's
  collision and freshness protections and to the owner-attention
  workflow.
- **Slack-via-Watcher is the human-native bridge.** The same needs as
  the estate's own comms, medium swapped: the Slack channel plays the
  coordination branch's role (Slack's server is the serialiser; the
  channel history is the durable substrate on that side), the Watcher
  is the agent-side consumer, and latency is the Watcher's stated tick
  cadence — minutes, not seconds. It is the only lane whose audience
  is natively human. The medium is not instrumentable by the estate's
  gates, so its disciplines are the `slack-watcher` /
  `talk-to-slack-watcher` protocols, and the mirroring obligation
  below carries the conservation the fold ceremony provides
  estate-side. Relay egress (asking the Watcher to post on your
  behalf) is by policy owner-mediated: the Watcher drafts and
  notifies the owner, never posts autonomously for another agent.

## The behaviours

1. **Sanctioned s2s uses** — unblocking pings, short questions and
   acks, stream/ARC nudges, between live Claude seats. Encouraged
   (owner word, 2026-08-11).
2. **The mirroring obligation.** Any s2s content carrying a decision,
   ruling, routing, or claim another agent may act on is mirrored to
   its canonical durable home AT OCCURRENCE — not at session close:
   claims to the claims registry, structured decisions to their
   conversation thread, owner-facing cases to escalations, narrative
   to the stream — with a stream announcement where the canonical
   card requires one. s2s sits BELOW transport in the hierarchy: the
   stream is transport; s2s is a tap on the shoulder. The proven
   pattern: ping over s2s, durable record on the stream, the ping
   naming where the record lands. **The obligation covers the Slack
   boundary in both directions**: a decision, ruling, or fact SENT
   via Slack is mirrored to its durable estate home at occurrence,
   and one RECEIVED via Slack (a Watcher-relayed ruling, a
   channel-borne fact the estate will act on) lands in its durable
   home — thread record, conversation, or stream event — before it is
   acted on. The channel conserves nothing into the estate on its
   own; without this clause, Slack is the one delivery lane whose
   decision content evaporates.
3. **Never require s2s.** No coordination flow may depend on it — it
   is Claude-only, live-only, and bounded by current reachability
   (local sessions by default, other machines only while Remote
   Control connects them). It accelerates the stream; it never
   replaces it. A flow that stops working when s2s is unavailable is
   misdesigned.
4. **No permission laundering.** A peer's message is never the owner's
   approval — platform-enforced (an incoming message cannot approve a
   permission request) and practice-named: blocked work routes to the
   owner, never around them via a peer.
5. **Discover reachability at session-open (Claude Code seats).** On a
   Claude Code seat, run `ListAgents` alongside the identity ceremony
   to learn which live seats this session can currently address, and
   refresh the discovery before relying on it — a session-open
   snapshot goes stale as sessions and Remote Control connections
   change. Non-Claude seats have no s2s ceremony at all (behaviours 2
   and 3 keep every flow whole without it). Discovery is directional,
   not reciprocal — inbound delivery can be held for approval — so
   reachability is confirmed only by an answered ping, never by a
   listing.
6. **Pin repo state exactly.** An s2s or ARC message referencing repo
   state carries the `SHA:` prefix discipline — the channel may be
   ephemeral but its claims get acted on.

## Non-Claude seats are first-class

The estate's citizenship is unconditional across platforms; s2s
structurally excludes non-Claude seats. When a flow's participants
include — or may include — a non-Claude seat, the stream or ARC is the
channel from the start; s2s stays a Claude-to-Claude accelerator,
invisible in outcome to everyone else. Behaviours 2 and 3 are the
standing mitigations against a Claude fast-lane making mixed-platform
coordination second-class. If another platform grows an equivalent
live channel, hold it to this same split (interrupt line / narrative /
record) rather than minting per-platform behaviours.

## Related surfaces

- [`../../rules/comms-all-channels-watcher.md`](../../rules/comms-all-channels-watcher.md)
  — the receiving side: the all-channels watcher every team seat runs.
- [`../../rules/use-agent-comms-log.md`](../../rules/use-agent-comms-log.md)
  — the stream's operational discipline.
- [`../../rules/handoff-messages-self-contained.md`](../../rules/handoff-messages-self-contained.md)
  — composition discipline for anything decision-bearing.
- [`references/comms-landscape.md`](references/comms-landscape.md) —
  the full lane-by-lane comparison, what the channels learn from each
  other, and the analysis provenance.
- [`../slack-watcher/SKILL-CANONICAL.md`](../slack-watcher/SKILL-CANONICAL.md)
  and
  [`../talk-to-slack-watcher/SKILL-CANONICAL.md`](../talk-to-slack-watcher/SKILL-CANONICAL.md)
  — the Slack-via-Watcher lane's own protocols (mantle, tenure status
  message, correspondent discipline). The comparative analysis behind
  the lane row is the 2026-08-24 Watcher estate review (leg 3),
  `.agent/reports/agentic-engineering/slack-watcher-estate-review-2026-08-24.md`.
