---
classification: situational
description: In team sessions, choose the channel for every cross-seat message by its audience, lifetime and mechanical consumer — native session messaging for dialogue between two live seats on one machine, Practice comms for state and record (liveness, claims, intents, verdicts, blockers, anything a third seat, the owner or a successor must see), ARC only where native messaging cannot reach. A decision reached over a fast channel lands in its durable home (claim intent, commit message, thread record, plan of record, napkin) when it is acted on. Owner-directed 2026-09-13.
trigger: session:team — every cross-seat send
---

# Channel by Audience, Lifetime and Consumer

Owner direction (2026-09-13, verbatim): "native s2s comms are much, much faster and cheaper
and efficient that Practice comms for communication, Practice comms on the other hand preserve
history and knowledge and institutional understanding which is bought with expensive ceremony,
Arc channel comms are in-between but really only have the advantage in n=2 sessions. So, when
do we use native comms and when Practice comms? Optimise for efficiency where appropriate but
make sure that we do not lose the history of _why_ we do things"; then "add the rules now".

## Trigger

A seat is about to send anything to another seat: a question, a routing bundle, a status, a
verdict, a blocker, a lane assignment. Fires in team sessions (n≥2) on every send.

## The Rule

The channel is chosen by three properties of the message, never by habit or by which channel
is already open:

1. **Audience.** Who must be able to see it? Only the other seat, or also a third seat, the
   owner, or a successor who was not there?
2. **Lifetime.** Is it spent the moment it is acted on, or must it be found later?
3. **Consumer.** Does a mechanism consume it (the claims registry, the commit queue, the
   liveness detector, the curation pipeline's tagged captures)?

- **Native session messaging** (the harness's session-to-session send) carries **dialogue
  between two live seats on one machine**: a question and its answer, a routing bundle, "ready
  for review", "your claim overlaps mine", a pointer to a durable record. Audience: the other
  seat only. Lifetime: the moment. Consumer: none. It is fast and cheap because nothing else
  needs it.
- **Practice comms** (the canonical event stream under `.agent/state/collaboration/comms/`)
  carries **state and record**: liveness, claims and commit intents, team-start and
  retirement, Director verdicts and rulings, blockers and their cure, and anything with a
  third-party or owner audience or a life beyond the moment. The watcher, the TUI, the
  detectors and a successor seat can only see what lands here.
- **An ARC channel** carries dialogue where native messaging cannot: a cross-platform pair, or
  a dialogue whose transcript is itself the record. Where both seats can use native messaging,
  ARC adds ceremony and nothing else.

**The conservation clause.** The history of _why_ is not conserved by the channel; it is
conserved by the durable homes that are already mandatory for every decision: the claim's
intent, the commit message, the thread record, the plan of record, the napkin. **A decision
reached over a fast channel lands in its durable home at the moment it is acted on**, and the
first act on a lane assignment received natively is the claim, so the artefact is observable
even though the conversation was not. A rejected idea whose reason would otherwise live only
in a transcript is a napkin capture owed by the seat that had the dialogue.

## Failure modes prevented

- Ceremony: every question and ping routed as a comms event, each one waking every watcher and
  spending every seat's context on a signal that needed one reader (the 2026-08-02 instance:
  about fifteen empty ticks an hour into a paused seat).
- Loss: a decision or an assignment that lived only in two transcripts, invisible to a third
  seat, the owner, or the successor after the session died.

## Related surfaces

- [`use-agent-comms-log`](use-agent-comms-log.md) — what must land on the comms log regardless
  of how the conversation travelled.
- [`collaboration-is-value-contingent`](collaboration-is-value-contingent.md) — the
  awareness / behaviour / ceremony classifier this rule applies to channel choice.
- [`comms-all-channels-watcher`](comms-all-channels-watcher.md),
  [`liveness-heartbeat-cron`](liveness-heartbeat-cron.md) — liveness stays on the canonical
  stream; native messaging has no liveness semantics the Practice consumes.
- [`handoff-messages-self-contained`](handoff-messages-self-contained.md) — applies on every
  channel.
- `.agent/reference/arc-rapid-communication.md` §Protocol; PDR-082 §What changes at n=2.
