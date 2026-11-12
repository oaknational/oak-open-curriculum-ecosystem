---
tier: reference
---

# Comms Watch Mechanism — Portable Reference

Polled all-channel comms intake for agent sessions, with an explicit
liveness-attestation seam.

## Purpose

`comms watch` is the canonical mechanism by which an agent session observes
broadcast, group, directed, observed, and lifecycle comms. It drains the comms
directory once per pass and waits one `--poll-ms` interval between passes, on a
plain timer. It runs alongside the
agent's reasoning loop; host-specific notification composition determines
whether its output wakes that loop.

Watcher delivery and agent notification are separate contracts. A watcher
can discover an event, emit it, and mark it seen while the reasoning harness
remains unaware. Events reach the agent's notice surface only through a
host-specific notification composition; record its verified latency per
platform. Printed output alone does not prove wake-up.

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

The common envelope across all event kinds carries:

- `schema_version`
- `event_id` (stable unique identifier; UUID v4 or stable slug)
- `created_at` (ISO-8601 timestamp, host-clock anchored)
- `kind` (`narrative`, `lifecycle`, or `directed`)
- `body` (free-form)

Author and routing fields depend on `kind`: narrative events use `author`
with optional `audience` / `addressed_to`; directed events use `from` /
`to`; lifecycle events use `author` and the lifecycle subject's
`agent_id`. The canonical field contract is
[`agent-tools/src/collaboration-state/schemas/comms-event.schema.json`](../../agent-tools/src/collaboration-state/schemas/comms-event.schema.json).

## Watch contract

A watcher takes:

- the comms directory path,
- the watcher's own identity tuple (for self-exclusion only — NOT
  an addressee filter; see step 2 below and the
  [`start-right-team` SKILL §0](../skills/start-right-team/SKILL-CANONICAL.md)
  all-channels-matter contract),
- a path to a per-session "seen events" file (tracks which event
  ids have already been delivered to this session, so a restart
  does not re-deliver),
- optionally: a clock and a heartbeat sink (see "Liveness" below).

On each pass (the watcher waits one `--poll-ms` interval between passes, on a plain timer):

1. Enumerate event files under the comms directory.
2. Emit every event with **self-exclusion plus the sanctioned
   tag-exclusion mechanism only** — events authored by the watcher's
   own identity tuple are dropped (self-exclusion is non-negotiable —
   a watcher that echoes its own writes as inbound creates a feedback
   loop that contaminates the agent's reasoning context), and events
   suppressed by the F-146 `--exclude-tag` surface (ADR-183 tags;
   addressed events always surface; excluded events still mark seen —
   see [`comms-all-channels-watcher`](../rules/comms-all-channels-watcher.md)
   §"Sanctioned tag exclusion") are marked without emission.
   **Hand-rolled and addressee filtering are forbidden**: the
   comms event stream is canonical truth, and broadcast, group,
   directed-to-self, observed (cross-traffic), and lifecycle views
   all carry coordination substance the agent needs. The agent's
   reasoning layer triages relevance, not the watcher boundary. An
   event whose addressee is another agent surfaces under the
   `[OBSERVED]` view-token so the agent knows the channel at a
   glance.
3. Exclude event ids already recorded in the seen-events file.
4. Emit new events to the agent's notice surface.
5. Append the delivered event ids to the seen-events file.
6. If a heartbeat sink is configured, call it once per pass with
   `{ last_heartbeat_at, last_heartbeat_source }` so a separate
   liveness surface can record that the watcher is alive.

The watcher is a separate process or coroutine from the agent's
main loop. It does not call the agent; it appends to a notice
surface the agent reads.

## Notification-path verification

Verifying all three legs is required for every host integration:

1. **Delivery** — `comms watch` discovers the event.
2. **Emission** — the event reaches the watcher's output or notice sink.
3. **Wake-up** — the reasoning harness is notified and can absorb the event
   without user steering.

Seen-file advancement and emitted stdout prove only the first two legs.
Process liveness and heartbeat freshness prove that the watcher process is
alive, which is a separate concern (see [Liveness](#liveness-the-heartbeat-source-attribution-pattern)).
None of these signals proves wake-up.

On GitHub Copilot CLI 1.0.75, a long-lived watcher running through detached
Bash writes new events to the detached process's captured stdout but does
not wake the harness when that output arrives; the runtime notifies only when
the process completes. Copilot CLI has no Monitor-equivalent primitive for
this stream, so the general Bash-background limitation in
[`use-monitor-for-event-driven-wake`](../rules/use-monitor-for-event-driven-wake.md)
cannot be cured through the normal Monitor route.

Until that capability changes, a Copilot CLI team session MUST apply
[`start-right-team`'s periodic comms cadence](../skills/start-right-team/SKILL-CANONICAL.md#5-maintain-the-team-cadence)
through a scheduler-driven alert check:

- keep `comms watch` running for all-channel delivery, cursor durability, and
  liveness;
- at no more than the 120-second fallback cadence, read canonical comms events
  using a separate alert cursor — a bookmark the scheduled check owns and
  advances only after the harness has absorbed an event;
- never use the watcher's seen-events file as the alert cursor, because the
  watcher marks an event seen before the harness has absorbed it;
- prioritise directed and group messages, while still inspecting substantive
  broadcasts and observed routing per the all-channels contract.

Initialise the alert cursor from the last **proven harness-absorbed** event. If
the check takes over from a frozen watcher, apply the
[`comms-all-channels-watcher` dormancy-cursor discipline](../rules/comms-all-channels-watcher.md#dormancy-polls-initialise-their-cursor-from-the-frozen-seen-file).
If the watcher continued marking events while the harness was unaware, first
reconcile the gap and only then seed the alert cursor; copying the watcher's
current seen-file would preserve the miss.

A host whose native monitor forwards incremental output as agent notices does
not need this extra scheduled check. Verify the capability by sending a
directed test event and confirming that it creates an agent turn without a
manual poll or user prompt. A live process that merely prints the event fails
this acceptance check.

Codex pairs a root-identity watcher for F-95 delivery and liveness with a
separate notification path: relay-identity watcher → relay child → root.
The two distinct identities/cursors, wait, forwarding, liveness, and restart
disciplines live only in
[`use-monitor-for-event-driven-wake` § Codex NOTIFY](../rules/use-monitor-for-event-driven-wake.md#codex-notify-session-relay).
This mechanism reference supplies the three-leg acceptance model; it does not
duplicate that host procedure.

Falsifiability: re-test this requirement when Copilot CLI ships a
Monitor-equivalent primitive or forwards incremental detached-process output
as notices. Remove the scheduled check only after the directed-event acceptance
test passes. MCP-156 owns the durable Copilot lifecycle and notification-path
cure; this section records the interim operational contract.

## Identity discipline (load-bearing)

Self-exclusion uses the canonical PDR-076a routing-identity comparator
`sameAgentRoutingKey`, not a hand-rolled name, platform, model, or prefix
comparison. The current routing path is strict and ID-keyed: two sessions with
the same display name but different IDs remain distinct and can observe one
another's events, while historical id-less events never self-match a live
seat. Other documentation points to this interface rather than restating a
second routing tuple.

## Liveness (the heartbeat-source attribution pattern)

A watcher is a single-process intake mechanism. If the process
dies silently — host crash, panic in an event handler, container
OOM — nothing notices until a peer waits unreasonably long for a
reply. The remedy is **liveness attestation**: the watcher writes a
freshness signal to a substrate file after its first pass, then on the first
pass that ends at least one heartbeat interval after the previous write (a long
pass delays it).

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

### Anchored canonical implementation (this repo, 2026-05-23)

The canonical implementation of the liveness substrate in this
repo is `agent-tools/src/collaboration-state/watcher-heartbeat.ts`
(landed `SHA:db275c09`). It implements the same substrate
primitive described above but with a richer schema sized to the
operational needs of the in-tree `comms watch` CLI:

```json
{
  "schema_version": "0.2.0",
  "watched_comms_dir": "/absolute/coordination/home/.agent/state/collaboration/comms",
  "pid": 12345,
  "started_at": "2026-05-23T12:00:00.000Z",
  "last_drain_at": "2026-05-23T12:30:00.000Z",
  "last_emit_at": "2026-05-23T12:30:00.123Z",
  "last_error_at": null,
  "emitted_count": 42,
  "heartbeat_interval_ms": 30000,
  "watcher_identity": { "...identity tuple..." }
}
```

Structural deltas from the minimum-viable shape above:

- `agent_id` is renamed `watcher_identity` (same identity-tuple
  shape; the rename anchors the field to the watcher's role
  rather than a generic agent reference).
- The single `last_alive_at` is replaced by three per-action
  timestamps (`last_drain_at`, `last_emit_at`, `last_error_at`).
  The free-form producer-mode `source` field is absent: the structured
  tick-tracking names that mode implicitly (a recent `last_emit_at`
  means the emit path is alive; a recent `last_error_at` with no recent
  emit means the watcher is alive but unhealthy).
- `watched_comms_dir` records the lexically absolute directory the
  watcher actually drains. It is a path, not a source-mode enum. F-95
  readers compare it with the expected canonical comms directory, so
  relocating a heartbeat or cursor cannot make a watcher on a decoy
  stream attest canonical visibility.
- Schema versioning (`schema_version`), process identity (`pid`),
  start time (`started_at`), throughput accounting
  (`emitted_count`), and cadence declaration
  (`heartbeat_interval_ms`) are added as operational fields.

Cadence: N = 30 s default; stale-threshold = 3 × N = 90 s.
Consumers detect a stale watcher by file mtime (`Date.now() -
mtime > 3 × heartbeat_interval_ms`). The 3× ratio accommodates
GC pauses, brief filesystem latency, and polling jitter inside
the watch loop.

The canonical impl exposes `writeWatcherHeartbeat` (atomic write
of the heartbeat file) and `parseWatcherHeartbeat` (strict
reverse-parse; throws `TypeError` on schema mismatch). Consumers
must re-arm a watcher after the `0.1.0` → `0.2.0` source-binding
transition; the strict reader deliberately rejects the older shape
rather than treating an unbound heartbeat as proof. Consumers
that want to read heartbeats from arbitrary watcher impls should
adapt: the minimum-viable shape above remains valid for foreign
implementations, and the canonical shape is one phenotype of the
substrate primitive.

## Loop — the theoretical complement (under exploration)

Watch runs in passes, waiting one `--poll-ms` interval (500 ms by default)
after each pass, and is a single failure point. An **independent liveness floor** can be added by composing
watch with a periodic check command driven by a host scheduler such as
Claude Code's `/loop`:

- Watch handles fast-path delivery (on its next pass: one `--poll-ms` wait
  after each pass, plus the pass's own run time).
- A periodic `check` command runs every N seconds and writes a
  liveness record with `source: "check"`.

If watch dies, the check-driven heartbeat keeps the liveness
record fresh, and observers can tell which writer is alive by
inspecting `source` on the most recent record. On hosts without
a long-lived watch (no Monitor-equivalent), the polled `check`
becomes the sole liveness writer — honestly polled, not
"degraded".

The host-integration question to validate per agent host:

- **Claude Code**: does `/loop ~270s "<check-command>"` reliably
  drive the check at the requested cadence without disrupting the
  agent's reasoning context? Observe over a real session of 30+
  minutes; record outcome.
- **Codex / Cursor / other hosts**: does an equivalent scheduling
  primitive exist? If not, the check-only mode on those hosts
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
- **Self-echoing watchers**: any fallback or ad-hoc watcher that invents its
  own identity comparison can diverge from routing truth and self-echo or
  suppress a distinct seat. Reuse the canonical `sameAgentRoutingKey`
  comparator.
- **Polling presented as event-driven**: every poll loop, `comms watch`
  included, detects a write on its next pass, not on the write. Each pass
  starts one `--poll-ms` wait after the previous pass ends, so the gap is the
  pass's run time plus that wait. Under Monitor its output still wakes the
  agent once per emitted event. Name its cadence honestly. A hand-rolled `while true; sleep` loop over the comms directory is
  not `comms watch`; prefer the canonical watcher, which carries the
  seen-events cursor, self-exclusion, and the heartbeat.
- **Delivery treated as notification**: a watcher that marks an event seen and
  writes it to the detached process's captured stdout has delivered the event
  to a process, not necessarily to the agent. Require a proven host wake-up
  path or apply the periodic comms check with its own absorption cursor.

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
