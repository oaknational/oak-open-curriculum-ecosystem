# The comms landscape — the delivery lanes compared

Durable reference for the comms-channels skill (this directory's
sibling skill entry — the link-free naming survives byte-identical
projection beside either entry filename). Provenance: the
owner-directed comms-landscape analysis of 2026-08-11 (authored at the
Director seat after cross-session messaging arrived in Claude Code
v2.1.224 and its first live estate use), adjudicated into the skill's
behaviours on the owner's 2026-08-12 word; the Slack-via-Watcher lane
consolidated 2026-08-24 from the Watcher estate review's leg-3
analysis under the owner's comparative frame (Watcher needs are the
estate's comms needs, medium swapped). This reference carries the
durable comparison; the skill body carries the operational rules.

## The comparison

| | s2s (SendMessage) | ARC (rapid-comms channel files) | Stream (comms events) | Slack-via-Watcher |
| --- | --- | --- | --- | --- |
| Latency | seconds (wakes the receiver) | seconds (~15s tail worst case, per the ARC protocol) | event-driven delivery to watching seats; pickup waits on the receiving harness's wake | minutes — the Watcher's stated tick cadence |
| Durability | none — receiver's transcript only | thread-durable until folded | event files, folded to durable homes | channel history durable on Slack's side; conserves NOTHING into the estate without the mirroring obligation |
| Audience | one live Claude session — local by default, other machines when Remote Control connects them | named seats on a shared thread | whole estate, including absent and FUTURE agents (gap sweep) | the owner and humans natively; agents via the Watcher |
| Platform | Claude Code only | any agent that writes files | any agent (CLI) | any agent with the Slack MCP; humans with Slack |
| Identity | harness session name | self-declared PDR-027 name + session prefix in entries | registry-integrated (PDR-027 seed, claims, liveness) | prose attribution marker in message text (shared credential); nothing validates it |
| Observability | invisible to watchers and to everyone but the receiver | tailable, human-readable in place | the watched surface; tags and threading | human-native; agent-side via the Watcher's tick reads and tenure status message |
| Ceremony | near zero | low (append + tail) | highest (CLI flags, identity seeds) | correspondent: low (address + poll); mantle: the slack-watcher protocol |

Verdict at analysis time, holding since: **every lane earns its
place** — the latency × durability × audience split is not covered by
any single channel, so retiring one would either slow unblocking
(without s2s), flatten working narratives into event soup (without
ARC), lose the only surface future agents can read (without the
stream), or leave owner-and-human-audience traffic with no lane at
all (without Slack-via-Watcher, the one natively human lane).

The Slack lane's structural difference, from the 2026-08-24 review:
the estate's media are instrumentable (gates, CLIs, and validators run
on git files) and Slack is not, so every mechanism that is
instrument-backed estate-side degrades to prose discipline when its
counterpart crosses the boundary — identity validation becomes a text
marker, the claims registry becomes the mantle protocol, heartbeat
machinery becomes the tenure status message, and the fold ceremony has
no analogue at all, which is why the skill's mirroring obligation
carries the conservation on this lane. Slack's server does provide
serialisation for free (the coordination branch's role with no merge
races). Full need-by-need analysis: the Watcher estate review report,
leg 3 (`.agent/reports/agentic-engineering/slack-watcher-estate-review-2026-08-24.md`).

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
- **Slack-via-Watcher learns the deadman from the stream's watcher
  discipline**: the tenure status message is a heartbeat file in
  Slack's native shape (one edited message = deadman + cursor +
  fallback observable), the 2026-08-24 review's transfer of
  `silence-is-never-liveness` into a medium the estate's instruments
  cannot reach.
- **The estate lanes learn a serialisation lesson from Slack**: a
  server-ordered channel gives fold-free serialisation — ordering,
  not immutability: edits and deletions mutate Slack history (the
  tenure status message is edited every tick; race-voided vacancy
  posts may be deleted) — while the coordination branch pays ceremony
  for the same ordering property.
