# Directed Routing Requires an Absorption Ack

A directed comms event that carries routing or an ask is a bounded
challenge, and its content-bearing reply is the only sound external
certification that the coordination was absorbed
([PDR-133](../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md)
§6 instrument 2: `ABSORB` is never-self-certifiable, and every presence
signal — heartbeat, watcher health, cursor movement — is a proxy that
reads green straight through an absorption failure). This rule makes
that instrument routine instead of exceptional, so a delivery-dark seat
becomes distinguishable from a working one within minutes rather than
by a hand-delivered unblock. Origin: three dated absorption-dark
instances on 2026-07-29 (each heartbeat-fresh, each cured by hand);
ticket MCP-393; delivery plan
`.agent/plans/delivery/mcp-393-delivery-signal.plan.md`.

## Trigger

A team session is active (the same window as
[`comms-all-channels-watcher`](comms-all-channels-watcher.md)), and a
directed comms event is being SENT that carries routing or an ask the
sender needs absorbed — or has been RECEIVED and absorbed.
Pure-FYI directed events and broadcast traffic are out of scope: the
convention prices absorption evidence only where a non-reply would
mislead routing.

## Action — sender side

Include the literal token `ACK-REQUESTED` in the directed event's
subject. The token marks the event as a bounded challenge: the sender
may treat a missing ack as meaningful (see §Reading for absorption),
which is exactly what generic silence never is — back-tested over the
live corpus at plan-author time, silence-based delivery-dark signatures
fire ~70 times per true instance, because quiet heads-down work
dominates.

## Action — receiver side

On absorbing an `ACK-REQUESTED` event, reply with a content-bearing ack
that threads the antecedent machine-readably. Every comms ack verb now
carries the threading edge:

```bash
# Broadcast ack (narrative — the whole fleet sees the absorption):
pnpm agent-tools:collaboration-state -- comms send \
  --platform <p> --model <m> \
  --title "ACK (threaded): <engage the ask in your own words>" \
  --in-response-to <antecedent-event-id> \
  --body "<what was absorbed and what happens next>"

# Point-to-point ack (directed — quieter; sender-only routing):
pnpm agent-tools:collaboration-state -- comms direct \
  ... --to-* <sender tuple> ... \
  --subject "ACK (threaded): <engage the ask in your own words>" \
  --in-response-to <antecedent-event-id> \
  --body "<what was absorbed and what happens next>"
```

`comms reply` threads to its source **by construction** (it resolves the
antecedent from `--to-event-id`, refusing an unknown id and a caller who
is not the source's recipient) — reply is the one verb that structurally
cannot produce an unthreaded or dangling ack, and for this rule's own
trigger (a directed antecedent addressed to you) it is therefore the
preferred verb; it resolves directed sources only, so `comms direct
--in-response-to` covers the cases reply cannot reach. On `comms send`
and `comms direct` the edge is **opt-in and the author's obligation**: a
`comms direct` without `--in-response-to` is exactly the prose-ack the
2026-07-30 drift instances demonstrated, so dropping the flag drops the
convention. The threading rationale is recorded at
`agent-tools/src/collaboration-state/cli-comms-commands.ts` (the F-77
comment — a narrative append threads to an antecedent of any kind) and
at `agent-tools/src/collaboration-state/cli-comms-messages.ts` (the
directed twin): the same machine-readable edge a PDR-064 Moment-2
acknowledgement uses. This convention is that existing shape applied
to routing events, not a new invention.

Two further constraints, each load-bearing:

- **The ack's TITLE/SUBJECT carries a human-readable back-reference** to
  the antecedent (as the templates above do). The watcher renderer
  prints titles but never prints `in_response_to`, so without the
  back-reference the threading edge is invisible at the notification
  surface and only mechanical readers see it.
- **Content-bearing, not bare.** A bare "ACK" is weak evidence (PDR-133
  §6: it may be produced without absorption); engaging the ask's
  specific content is what certifies. The convention's first live ack
  ran end-to-end through the comms concept gates on 2026-07-30 (the
  ratification exchange on the MCP-393 lane; event identifiers live in
  the dated ledger named below); an antecedent whose subject would trip
  the gates on quoting may need rewording rather than verbatim
  quotation.
- **Derive the antecedent id from the event store, never from memory of
  watcher output.** The watcher renders titles without event ids, so an
  id recalled from a notification is a guess — a live 2026-07-30
  instance threaded an ack to a wrong id remembered this way and needed
  a correction event. Read the id from the event file or `comms list`
  before referencing it; a wrong antecedent is worse than a prose one,
  because mechanical readers trust it.

**Choosing the ack channel**: a narrative ack is broadcast-by-construction
(`comms send` exposes no audience narrowing), which is the right shape
when the absorption itself is fleet-relevant coordination — a route
accepted, a blocker adjudicated. A directed ack reaches the sender
alone, which is the right shape for routine acknowledgements that would
otherwise tax every watcher's stream. Both carry the identical
machine-readable edge; scannability pressure is a channel-choice
question, never a reason to skip the ack or drop the threading.

## Reading for absorption at routing and stall-diagnosis moments

The observer half, for any seat reading another's liveness — the
Director at routing moments, and every seat before a stall diagnosis or
takeover input:

- Before diagnosing a seat as stalled or dark, check outstanding
  `ACK-REQUESTED` events addressed to it for threading replies.
  An unanswered challenge past ~10 minutes is **absorb-absent evidence
  — an input to verify, never a verdict**: it feeds
  [`ping-before-escalate`](ping-before-escalate.md) and the PDR-133 §9
  both-instruments absence conjunction (deliverable movement on remote
  surfaces must ALSO be checked; a seat can be comms-silent and
  substantively active).
- Read threading from the event files (or a mechanical read surface
  over them), not from watcher output — the renderer does not print
  `in_response_to`.
- Name the classes your evidence actually reached (PDR-133 §4 reading
  rule): an absent ack is evidence about `ABSORB` on that send's path;
  it licenses no conclusion about `NOTIFY` versus `LOOP`, whose failure
  signatures are identical from outside.

## Worked instances

- **The founding misses**: three absorption-dark windows on 2026-07-29
  (~16:34Z; ~17:07–17:40Z; 20:47–21:04Z) — seats EMIT-fresh on 240s
  heartbeats while coordination went unabsorbed 17–40+ minutes, each
  cured by a hand-delivered unblock. The first two were unabsorbed
  DIRECTED events, the shape this convention reaches; the third was an
  unabsorbed BROADCAST (a merge announcement), which the convention
  deliberately does not reach — that shape is covered by the
  consumer-side discipline of deriving lane state from PR/merge truth
  rather than from any seat's signals. The dated ledger rows, with
  verbatim event identifiers, live in the
  [cross-platform matrix](../memory/executive/cross-platform-agent-surface-matrix.md)
  §Platform Liveness Declaration (MCP-393 is the cure lane).
- **The first live ack**: 2026-07-30, on the MCP-393 lane itself — a
  narrative ack threading the Director's ratification event, written
  with the existing CLI, zero code, through the concept gates; its
  identifiers are recorded in the same ledger section. It evidences the
  RECEIVER half only — its antecedent predates the convention and
  carried no `ACK-REQUESTED` token, so the sender-side worked instance
  is still to come.

## Why a Rule, Not a PDR Clause

PDR-133 §Mechanism disclaims procedure ("the taxonomy is the model, the
rules are the procedures") and its §Cascade names three host rules
carrying class fragments — the watcher rule (assigned the
`SUBSTRATE`–`DELIVERY` fragment range there; the rule's own checks
reach the narrower `PROCESS`/`CURSOR`/`DELIVERY` set, a pre-existing
scope difference between the two sources), the heartbeat rule
(`EMIT`/`REGISTRY`/`PROGRESS`), and the wake rule (`NOTIFY`). `ABSORB` had no host-rule home; this rule is that home. The
convention is an always-fired discipline at every routing send and
absorption, which is rule-tier by the `new-rule-vs-pdr-clause`
classifier; its substance (a subject token, a CLI verb, a wire-schema
fact) is repo phenotype that portable-core records must not carry.

## Related Surfaces

- [PDR-133](../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md)
  — the class model; §6 instrument 2 is what this rule operationalises.
- [`comms-all-channels-watcher`](comms-all-channels-watcher.md) — the
  incoming delivery path this rule sits above; its checks certify
  `PROCESS`/`CURSOR`/`DELIVERY` and nothing here changes that.
- [`liveness-heartbeat-cron`](liveness-heartbeat-cron.md) — the
  outgoing emit path; heartbeat semantics are untouched by this rule
  (the ack is a separate, added signal).
- [`use-monitor-for-event-driven-wake`](use-monitor-for-event-driven-wake.md)
  — the `NOTIFY` home; an ack certifies the whole path a send traversed,
  which includes the wake this rule's sibling owns.
- [`ping-before-escalate`](ping-before-escalate.md) — the escalation
  discipline an absent ack feeds; never bypassed by this rule.
- [Cross-platform matrix](../memory/executive/cross-platform-agent-surface-matrix.md)
  §Platform Liveness Declaration — the dated per-platform ledger.

## Enforcement

Behavioural at adoption: the convention is observable on the comms
stream (the `ACK-REQUESTED` token and the threaded acks — narrative or
directed — are all permanent events). The observer discipline is manual by default —
the ten-minute threshold is read from event timestamps, tool-computed,
UTC-vs-UTC. No mechanical read surface over outstanding challenges
exists: MCP-393 retired its own on 2026-07-30 and MCP-404 carries the
projection as a design input. Any surface that later lands composes
with, never replaces, the manual discipline.
