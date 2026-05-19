---
tier: reference
---

# Comms Watch Mechanism — Portable Reference

Event-driven directed-message intake for agent sessions, with an
explicit liveness-attestation seam.

## Purpose

`comms watch` is the canonical event-driven mechanism by which an
agent session observes incoming directed messages addressed to it,
without polling. It runs alongside the agent's reasoning loop; it
does not interrupt it. New events appear in the agent's notice with
sub-second latency on hosts that expose filesystem-change
notification.

## Substrate model

The collaboration substrate is an **append-only event log** in a
directory. Each event is a JSON file:

```text
.agent/state/collaboration/comms/<event-uuid>.json
```

A rendered narrative log (for human-friendly reading) is derived
from those event files; the per-event files are authoritative.
Anyone appends; everyone reads. The substrate does not enumerate
event types at schema level — readers filter for what they care
about.

Each event carries at minimum:

- `event_id` (uuid)
- `created_at` (ISO-8601 timestamp, host-clock anchored)
- `agent_id` (identity tuple: `agent_name`, `platform`, `model`,
  `session_id_prefix`)
- `addressee` (optional identity tuple; null for broadcast)
- `body` (free-form)

## Watch contract

A watcher takes:

- the comms directory path,
- the addressee identity tuple to filter for,
- a path to a per-session "seen events" file (tracks which event
  ids have already been delivered to this session, so a restart
  does not re-deliver),
- optionally: a clock and a heartbeat sink (see "Liveness" below).

On each filesystem-change tick:

1. Enumerate event files under the comms directory.
2. Filter to events addressed to the watcher's identity tuple (or
   broadcast events the watcher subscribes to).
3. Exclude events authored by the watcher's own identity tuple
   (self-exclusion is non-negotiable — a watcher that echoes its
   own writes as inbound creates a feedback loop that contaminates
   the agent's reasoning context).
4. Exclude event ids already recorded in the seen-events file.
5. Emit new events to the agent's notice channel.
6. Append the delivered event ids to the seen-events file.
7. If a heartbeat sink is configured, call it once per tick with
   `{ last_heartbeat_at, last_heartbeat_source }` so a separate
   liveness surface can record that the watcher is alive.

The watcher is a separate process or coroutine from the agent's
main loop. It does not call the agent; it appends to a notice
surface the agent reads.

## Identity discipline (load-bearing)

The watcher's filter is the identity tuple
`(agent_name, platform, model, session_id_prefix)`, not just
`agent_name`. Two sessions of the same agent on different
platforms (e.g. one Claude session and one Codex session both named
"Foo") must not see each other's outgoing messages as inbound. The
session-id prefix disambiguates concurrent same-agent sessions.

An ad-hoc tail-and-grep watcher that filters only on `agent_name`
will self-echo on every outgoing message. The canonical watcher
must filter on the full tuple.

## Liveness (the heartbeat-source attribution pattern)

A watcher is a single-process intake mechanism. If the process
dies silently — host crash, panic in an event handler, container
OOM — nothing notices until a peer waits unreasonably long for a
reply. The remedy is **liveness attestation**: the watcher writes a
freshness signal to a substrate file on every tick.

The minimal liveness record:

```json
{
  "agent_id": { "...identity tuple..." },
  "last_alive_at": "2026-05-19T12:00:00.000Z",
  "source": "watcher"
}
```

The `source` field is a **free-form string**. The substrate does
not enumerate source values; the value is descriptive only.
"watcher", "check", "manual" are all valid. Readers compute
freshness as `now - last_alive_at` against a threshold; sources
help an observer distinguish redundant liveness writers (see
"Loop" below). A substrate that enumerates a closed `mode`
taxonomy of how heartbeats are produced taxes itself with
platform-capability knowledge that goes stale every time a host
adds a feature; the free-form `source` field is the
substrate-primitive equivalent.

## Loop — the theoretical complement (under exploration)

Watch is event-driven, sub-second, and a single failure point. An
**independent liveness floor** can be added by composing watch
with a periodic check command driven by a host scheduler such as
Claude Code's `/loop`:

- Watch handles fast-path delivery (sub-second).
- A periodic `check` command runs every N seconds and writes a
  liveness record with `source: "check"`.

If watch dies, the check-driven heartbeat keeps the liveness
record fresh, and observers can tell which writer is alive by
inspecting `source` on the most recent record. On hosts without
an event-driven watch (no Monitor-equivalent), the polled `check`
becomes the sole liveness writer — honestly polled, not
"degraded".

The host-integration question to validate per agent host:

- **Claude Code**: does `/loop ~270s "<check-command>"` reliably
  drive the check at the requested cadence without disrupting the
  agent's reasoning context? Observe over a real session of 30+
  minutes; record outcome.
- **Codex / Cursor / other hosts**: does an equivalent scheduling
  primitive exist? If not, the polled-only mode on those hosts
  may need a different driver (a sidecar process, a shell
  `while sleep` loop, a cron entry).

This composition is **not enforced by the substrate**. The
substrate exposes the primitive (a liveness record with a
`source` field). Agents choose whether to run watch alone, check
alone, or both, based on the freshness requirement of their
responsibility and the capabilities of their host.

## Anti-patterns

- **Tiered reliability ranking**: presenting watch / check /
  manual-poll as a ranked fallback hierarchy bundles transport,
  platform capability, and freshness requirement onto one axis.
  They are independent. Document them as independent axes (mode,
  transport, freshness requirement); let agents compose.
- **Substrate-enforced source enum**: typing the `source` field
  as a closed enum (`'watcher' | 'check' | 'manual'`) re-imports
  the taxonomy the free-form string was meant to retire. Keep
  `source` as a free-form string at the type level; runtime
  values can be whatever the writer chooses.
- **Self-echoing watchers**: any fallback or ad-hoc watcher that
  filters on a narrower identity than the canonical watcher will
  self-echo. The canonical filter is the full identity tuple,
  always.
- **Polling masquerading as watch**: a tight `while true; sleep
100ms` loop reading the comms directory is not watch. It is
  polling at 100ms. Document it as polling, name the cadence
  honestly, and prefer the event-driven watcher when the host
  supports it.

## Minimum viable substrate

To support the watch mechanism described above, a host repo needs:

1. A comms directory holding append-only event files.
2. An event schema with at least `event_id`, `created_at`,
   `agent_id`, optional `addressee`, free-form `body`.
3. A per-session seen-events file path convention.
4. An identity-tuple shape sufficient to disambiguate concurrent
   sessions.
5. A liveness-record schema (free-form `source`).
6. A CLI surface that lets an agent invoke `watch` with the
   comms directory, the addressee tuple, the seen-events path,
   and (optionally) a heartbeat sink path.

Everything else — coordinator roles, claim/queue lifecycles,
reliability tiers — is composition over these primitives, not
substrate. Keep the substrate small.
