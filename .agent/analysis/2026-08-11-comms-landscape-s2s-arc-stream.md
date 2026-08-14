# The comms landscape after session-to-session messaging (2026-08-11)

Owner-directed reflection (2026-08-11 morning): Claude Code's new
cross-session messaging (s2s) arrived in the estate's practice
unannounced — the Director used it, correctly, to unblock a fold
ceremony in minutes. The owner encourages its use, wants the comms
landscape adjusted deliberately (does each channel earn its place, what
do they learn from each other, what behaviours does s2s need — e.g.
around recording decisions), and wants the non-Claude-agent implications
faced. Routed to the Director for the practice decision; this document
is the analysis.

## The new arrival, on the vendor's word

Cross-session messaging shipped in Claude Code v2.1.224 (2026-08-08,
macOS/Linux; this estate runs 2.1.226). Official documentation:
<https://code.claude.com/docs/en/cross-session-messaging>. Contract
facts that matter to the practice: `ListAgents` discovers live local
sessions, `SendMessage` delivers TEXT ONLY to one of them by name;
the receiver gets sender name + reply address, never context, files,
or permissions; an incoming message cannot approve a permission
request or change settings (the platform's own guard against
permission laundering, which its tool contract names explicitly).
Delivery is to LIVE sessions only, with a real queue: messages to a
busy session enqueue and drain at its next tool round — but nothing
lands anywhere for an absent, future, or non-Claude agent. The
owner's own listing (2026-08-11) confirmed the reach: sessions across
DIFFERENT repositories and workspaces appear side by side with
busy/idle states — liveness the Practice currently buys with PDR-078
heartbeat ceremony, here for free.

## The three channels, compared where they actually differ

| | s2s (SendMessage) | ARC (rapid-comms channel files) | Stream (comms events) |
| --- | --- | --- | --- |
| Latency | seconds (wakes the receiver) | minutes (Monitor tail) | minutes (watcher cadence) |
| Durability | none — receiver's transcript only | thread-durable until folded | event files, folded to durable homes |
| Audience | one live Claude session — CROSS-REPO and cross-workspace; cross-machine via cloud sessions or Remote Control | named seats on a shared thread | whole estate, including absent and FUTURE agents (gap sweep) |
| Platform | Claude Code only | any agent that writes files | any agent (CLI) |
| Identity | harness session name | self-declared in entries (SHA-prefix discipline) | registry-integrated (PDR-027 seed, claims, PDR-078 liveness) |
| Observability | invisible to watchers and to everyone but the receiver | tailable, human-readable in place | the watched surface; tags/threading (ADR-183/186) |
| Ceremony | near zero | low (append + tail) | highest (CLI flags, identity seeds) |

**Verdict: all three earn their place**, on a latency × durability ×
audience split that no single channel covers:

- **s2s** is the interrupt line: time-critical unblocking between two
  live Claude seats ("your staged file is blocking my ceremony, reply
  in minutes"). Nothing else in the estate wakes a peer in seconds.
- **ARC** is the shared working narrative: multi-paragraph technical
  hand-offs and decisions-in-progress between named collaborators on
  one thread, readable in place.
- **The stream** is the record of transport and the only surface that
  reaches agents who are not there yet: routing, liveness, broadcasts,
  anything a resume's gap sweep must find.

## What they learn from each other

- **s2s learns record discipline from the stream**: the Director's
  first live use modelled the right behaviour unprompted — ping over
  s2s, durable record on the stream ("I'll name the successor branch
  there"). That behaviour should be named, not left to taste.
- **s2s learns the SHA-prefix discipline from ARC**: an s2s message
  referencing repo state should pin the SHA exactly as ARC entries do
  — the channel is ephemeral but its claims get acted on.
- **The stream learns latency from s2s**: a directed stream event
  today waits for the receiver's watcher cadence; pairing a stream
  event with an s2s nudge ("event <id> on the stream for you") gives
  seconds-latency WITH a record. A thin `comms ping` affordance that
  does both in one step would make the good pattern the easy one.
- **ARC learns liveness from s2s**: an ARC append can carry an s2s
  nudge to the counterpart when both are live Claude seats.
- **The Practice's liveness question learns from the listing**: the
  busy/idle states in the agents listing are instant corroborating
  evidence for Claude seats in any retirement-detection protocol
  (the F-44 "working vs wedged" residual) — a cheap first check
  before ping-before-escalate.

## Proposed behaviours (for the Director to adjudicate; rule-vs-PDR-clause per practice)

1. **Sanctioned uses**: time-critical unblocking pings, short
   questions and acks, "look at the stream/ARC" nudges — between live
   Claude seats. Encouraged (owner word 2026-08-11).
2. **The mirroring obligation**: any s2s content that carries a
   decision, ruling, routing, or claim another agent may act on is
   mirrored to the stream (or its durable home) AT OCCURRENCE. s2s
   sits BELOW transport in the durability hierarchy — the stream is
   transport; s2s is a tap on the shoulder.
3. **Never require s2s**: no coordination flow may depend on it —
   it is Claude-only, same-machine-only, live-only. It accelerates
   the stream; it never replaces it.
4. **No permission laundering**: platform-enforced and
   practice-named — a peer's message is never the owner's approval,
   and blocked work routes to the owner, never to a peer.
5. **Ease of use**: register reachability at session-open
   (`ListAgents` alongside the existing identity ceremony), and
   consider the `comms ping` wrapper above so the mirrored form is
   cheaper than the unmirrored one.

## Non-Claude agents, and the census illusion

The estate's citizenship is unconditional across platforms
(Cursor, Codex, Gemini seats are first-class), and s2s structurally
excludes them — in BOTH directions, and without advertising it. The
owner demonstrated the hazard first-hand (2026-08-11): a repo with a
live Codex teammate working in it lists, via the platform's agents
listing, as containing no one — the listing is a CLAUDE-SESSION census
presenting with the affordance of an agent census. This is the
recorded error class ("an instrument's silence is a fact about the
instrument's frame, never about the world") built into a tool: the
constraint is real, and unadvertised. The owner's framing, verbatim:
"in some ways these mechanisms are far more constrained than the
Practice, but they don't advertise that, we must remain aware of it."

**The behavioural consequence (proposed behaviour 6): the agents
listing answers "which Claude sessions can I ping", NEVER "who is
working here."** The Practice's claims registry — platform-neutral by
construction — remains the only authoritative census of the working
set, and any liveness or who-is-here reasoning starts there, with the
listing as Claude-side corroboration only (per the F-44 note above). The risk is drift: Claude seats developing an s2s
fast-lane that makes mixed-platform coordination second-class. The
mitigations are behaviours 2 and 3 — the mirroring obligation keeps
the record complete for every reader regardless of platform, and
never-require keeps every flow walkable by every seat. Additionally:
when a flow's participants include (or may include) a non-Claude
seat, the stream or ARC is the channel from the start — s2s stays a
Claude-to-Claude accelerator, invisible in outcome to everyone else.
The comparison also cuts the other way: the owner was planning a
similar CROSS-VENDOR channel and may still build it (owner word,
2026-08-11 — s2s is "a powerful addition to the comms options" that
"in some ways exceeds the Practice": cross-repo reach, latency, the
built-in queue, free liveness). The build-vs-buy shape worth
considering when that returns: the record layer already exists and is
vendor-neutral — the comms stream — so a cross-vendor equivalent is
cheapest as a per-platform NUDGE ADAPTER over the stream (file-watch
wake, or each platform's native interrupt where one exists), not as a
parallel channel. That keeps this analysis's split (interrupt line /
narrative / record) as the shape to hold every platform to, with s2s
simply the Claude-native instance of the interrupt line.

## Routed follow-ups

- Director: adjudicate behaviours 1–6 into the collaboration practice
  (new rule vs PDR clause), fold this analysis's verdicts into the
  comms doctrine at the next quiet window.
- Agent-tooling (on adoption): the `comms ping` wrapper; a
  session-open `ListAgents` step in start-right.
- This document rides PR #846's branch (the coordination branch was
  write-held during the fold rotation when it was written).
