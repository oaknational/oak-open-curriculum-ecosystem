# Comms All-Channels Watcher

Communication is the absolute heart of multi-agent work. Before any other
team-bootstrap step — before registering presence, before naming
coordination pressure, before opening any claim — every participating agent
must have a persistent watcher running over the **entire** comms event
stream at `.agent/state/collaboration/comms/`.

The comms event stream is the canonical truth. Public (broadcast), group
(narrative with `audience` including the agent), direct (`directed` kind,
and narrative with `addressed_to` matching the agent), observed
(cross-traffic and audience-mismatch events the agent witnesses but is not
responsible for), and lifecycle messages are all valid views onto the same
stream, and all are important. A watcher that filters to a single view
(e.g. directed-only filters, manual `ls -t` polling) discards the others
and will miss vital coordination.

## Trigger

A team session is bootstrapping (`start-right-team` SKILL First Moves move
`1`) or an existing team session is being rejoined after compaction or
handoff. This rule fires before any other team-bootstrap move — before
heartbeat cron, before team-start broadcast, before any source claim.

## Action

Run one event-driven watcher over the full
`.agent/state/collaboration/comms/` directory, emitting one notification
per new event, with **self-exclusion plus, where the seat's economics
justify it, the sanctioned `--exclude-tag` mechanism** (§"Sanctioned
tag exclusion" below) — filter out events authored by the agent's own
PDR-076a routing identity through the canonical `sameAgentRoutingKey`
comparator (per
[`.agent/reference/comms-watch-mechanism.md`](../reference/comms-watch-mechanism.md)
§"Identity discipline") and emit everything else. Apply relevance triage
in agent reasoning, not at the watcher boundary — **hand-rolled filters
at the watcher boundary remain forbidden** (twice bitten: the 2026-06-10
muting-filter and 2026-07-02 mute/leak instances); the CLI's tested
exclusion surface is the only sanctioned narrowing.

### Sanctioned tag exclusion (F-146) — awareness/reserve-seat configuration

`comms watch --exclude-tag <tag>` (repeatable, ADR-183 namespace tags
only, boundary-validated) suppresses emission of events whose EVERY tag
is excluded. The mechanism's tested guarantees: excluded events still
mark seen (no backlog replay when the filter lifts); `directed` and
`group` events always surface whatever their tags; a multi-tag event
with any non-excluded tag leaks through (a failure-mode capture that
also carries `heartbeat` still emits); excluded events never consume
the `--max-events-per-drain` batch bound and never count toward the
watcher's `emitted_count`.

**The proven standby/quiet-pause configuration** (owner-priced 2026-08-02: a
warm-paused seat's full watcher was delivering ~15 empty heartbeat ticks per hour
into context, and the owner asked for "just enough for the Director to wake
you"). The shape that satisfied both this rule and the economy:

- `comms watch --exclude-tag heartbeat` — `directed` and `group` always surface
  whatever their tags, so an activation still arrives instantly; and
- the mandatory F-75 pairing run as a **diff-only anomaly poll**: peer-liveness
  every ~10 minutes with its **baseline seeded at arm time**, so already-retired
  seats never emit and only *newly* degraded peers do.

Measured result: zero empty ticks, and a directed activation reached the seat
immediately. Falsifier for the configuration: a quiet-configured standby that
misses coordination a full watcher would have delivered — the exposure is
heartbeat-borne information only, which the poll covers by construction. Reserve-
seat freshness is load-bearing economics, not a nicety: a standby that burns
context on a heartbeat firehose shortens the very tenure the bench exists to
extend.

**Excluding `heartbeat` MANDATORILY pairs with the F-75
`comms peer-liveness` poll** (see
[`liveness-heartbeat-cron` §Surfacing peer heartbeat-silence](liveness-heartbeat-cron.md))
as the seat's retirement-detection consumer — heartbeat exclusion
removes the seat's only event-borne retirement signal, and the poll is
the absence-detector that event-watching structurally cannot be. A seat
running `--exclude-tag heartbeat` without the paired poll is blind to
peer retirement and out of contract.

### Canonical invocation — the `agent-tools` CLI

```bash
# Replace <agent-codename>/<platform>/<model> below.
# Omit --comms-dir and --seen-file together: the CLI resolves the PRIMARY
# coordination home and derives the cursor from the exact display name.
# Two F-101 guards stop a gone-away watcher orphaning (and writing a false F-95
# heartbeat): (1) `--supervisor-pid "$PPID"` — the watcher self-exits when the agent
# process dies, the PRIMARY cure incl. the crash/SIGKILL path; (2) the GNU
# `timeout`/`gtimeout` prefix (default 3600s) — the backstop. A live agent re-arms on the
# Monitor exit-notification; a dead one does not. Build the argv first, then prepend the
# timeout only if present — zsh-safe, portable, graceful (runs un-guarded if coreutils is
# absent). Do NOT use `${VAR:+$VAR 3600} cmd`: zsh does not word-split it, so it tries to
# exec "timeout 3600".
# --max-events-per-drain bounds each drain pass (batch size), never the
# watcher's lifetime — each successful pass advances the seen-file cursor
# and the watcher keeps running (migration notes for the retired
# --max-events flag live in the CLI help).
cd <repo-root> || exit 1
set -- pnpm agent-tools:collaboration-state -- comms watch \
  --platform <claude|codex|cursor> \
  --model <model-id> \
  --supervisor-pid "$PPID" \
  --step-timeout-ms 120000 \
  --max-events-per-drain 100
TIMEOUT_BIN="$(command -v timeout || command -v gtimeout || true)"
[ -n "$TIMEOUT_BIN" ] && set -- "$TIMEOUT_BIN" 3600 "$@"
exec "$@"
```

`--comms-dir` and `--seen-file` are one atomic override pair: omit both for
the worktree-safe default, or supply both for a deliberate alternate target.
When omitted, the CLI resolves the PRIMARY coordination home (or the home
selected by `--repo-root`), uses its canonical `comms/` directory, and derives
`comms-seen/<exact display name>.json`. When supplied, both values are
preserved verbatim. In either mode the CLI creates the comms directory and the
seen-file's parent before watching.

Two composing guards bound every watcher's lifetime so an orphaned or agent-less
watcher self-terminates rather than lingering and writing a false-liveness
heartbeat:

- **`--supervisor-pid "$PPID"`** (the F-101 cure) — the watcher checks the
  supervising process (the agent session that spawned it; `$PPID` at the
  invocation) once per poll cycle and self-exits within one cycle of that pid
  disappearing. This closes the crash / SIGKILL orphan path that a process-group
  kill-tree misses: GNU `timeout` isolates the watcher in its own process group,
  so on a harsh agent death no signal reaches the watcher — but the pid probe
  sees the supervisor gone and terminates the otherwise-immortal watcher. This
  **supersedes** the previously-deferred Stay-alive-`Stop`-hook lease follow-up,
  which is no longer needed for the orphan problem.
- **The `timeout`/`gtimeout` prefix** (default 3600 s, tunable) — the backstop:
  on a clean teardown (Monitor `TaskStop`, SIGTERM, or expiry) `timeout`
  group-kills the whole tree, and on any path the supervisor-pid probe missed
  the watcher cannot outlive the timeout.

A healthy watcher under a live supervisor never exits on its own — the batch
bound is per-pass, never a lifetime budget (MCP-229). The exits that exist,
and how each announces itself: supervisor death (final line
`--- WATCHER EXIT --- reason=supervisor-gone emitted_count=<n>`, exit 0); a
fatal step ruling (its WATCHER ERROR line, then `reason=fatal-step` — only
reachable when a composing layer wires `onError`; the CLI does not); a step
deadline (`kind=timeout` WATCHER ERROR, non-zero exit, NO exit line); and
the composing `timeout` backstop or any harsh kill (NO exit line — SIGTERM
never runs JS). The supervising Monitor/cron re-arms on the primitive's own
**exit notification** — the `--seen-file` cursor means the restart misses no
events, only delays them. The EXIT line is REASON ATTRIBUTION for that
notification, never itself a re-arm trigger: a process can emit its
diagnostic line and still fail to die (the F-43 zombie class — co-writers on
one seen-file), so re-arming on the line risks two live watchers on one
cursor. `reason=supervisor-gone` arriving while the seat is demonstrably
live is a probe misfire to investigate, not a routine re-arm.
`--supervisor-pid` is MANDATORY, not a hardening option: without it AND
without the `timeout` prefix the watcher has no ORDERLY exit path of its
own — only a fatal step, a step deadline, or an external kill ends it.

The CLI emits every relevant event with self-exclusion (plus any
sanctioned `--exclude-tag` narrowing per §"Sanctioned tag exclusion")
against the identity tuple it derives from the platform-specific session-id env var
(`PRACTICE_AGENT_SESSION_ID_CLAUDE`, `PRACTICE_AGENT_SESSION_ID_CURSOR`,
`PRACTICE_AGENT_SESSION_ID_CODEX`, or `CODEX_THREAD_ID`) — one of these
MUST be set in the shell, or the CLI exits with `missing collaboration
identity seed`. Each event is tagged `[BROADCAST]` / `[GROUP]` /
`[DIRECTED]` / `[OBSERVED]` / `[LIFECYCLE]` on its first line so the agent
knows the channel at a glance. `[OBSERVED]` means incidental visibility
of cross-traffic, not a new work contract (event shape:
[`agent-tools/src/collaboration-state/schemas/comms-event.schema.json`](../../agent-tools/src/collaboration-state/schemas/comms-event.schema.json)).

Run the command via the platform's persistent background-task mechanism:
Claude Code uses the `Monitor` tool with `persistent: true`; Cursor and
Codex use their equivalent notification paths. Codex keeps this canonical
root-identity watcher for its F-95 heartbeat and adds the distinct
relay-identity notification watcher described by the relay-child procedure in
[`use-monitor-for-event-driven-wake`](use-monitor-for-event-driven-wake.md#codex-notify-session-relay).
**Start every arm with an
explicit `cd <repo-root> || exit 1`**: the platform's background-task
primitive inherits the interactive shell's PERSISTENT cwd, so an arm
issued while the shell sits in a scratchpad or sub-directory runs the
watcher there — `pnpm` resolves the wrong workspace, verify-deps churns
whatever tree it lands in, and the "watcher" watches nothing (worked
instance 2026-07-20: a re-arm from a scratchpad clone auto-installed the
clone and observed zero events).

### Worktree residency blocks the arm — arm from the primary, before EnterWorktree

Platform worktree isolation (Claude Code `EnterWorktree`) makes the PRIMARY
coordination home non-writable from a worktree-resident session and refuses
compound arm commands it cannot prove stay inside the worktree ("This
session is isolated in the worktree …" — the refusal recorded in-repo
2026-08-06 in the mutation-evidence mechanics report; three seats hit it
independently 2026-08-13 and first read it as a fleet regression). The
watcher, the F-75 poll, and the heartbeat loop therefore arm while the
session is PRIMARY-resident — at session open, before any `EnterWorktree`
— and persist across later residency switches (armed monitors keep
running; a full worktree lane phase can run under a primary-armed
watcher). A session already worktree-resident that needs an arm exits to
the primary first (`ExitWorktree` action keep), arms, and re-enters.
Worktree-resident sessions route primary-surface WRITES (comms sends, ARC
channel entries, shared memory files) through the commit-warden's intent
surface or a cross-session send — the same isolation refuses those writes
directly, by design, and the refusal is the platform's, not this repo's
hook policy.

**After arming the watcher, run ONE foreground comms sweep covering the
window from BEFORE session open.** An event landing between session-open
and watcher-arm is otherwise absorbed into the watcher's baseline and
never notified (two instances in one day, 2026-06-10; owner-approved
2026-06-11). The same sweep fires after ANY watcher restart, covering
the restart's gap window. Use an inbox-shaped read, never `ls -t |
head`.

### Hardened against silent hangs

The watch loop fails loud rather than muting silently. Each `drain`, `emit`,
and `markSeen` step runs under a per-step deadline (`--step-timeout-ms`,
default 60 s); a step that exceeds it emits a `kind=timeout` WATCHER ERROR
line and the watcher exits non-zero, so the supervising Monitor/cron sees the
death and can restart it. The directory-change wait (the loop's `waitForChange`
step) carries no deadline — it is poll-bounded by construction: a
`setTimeout(pollMs)` fallback runs alongside
the `fs.watch` subscriptions, so a dropped FSEvents subscription delays a wake
by at most `pollMs` instead of stalling forever. The liveness self-check below
covers any residual hang path that a deadline cannot reach (a hung process
cannot exit-non-zero if the hang sits where no deadline is armed).

Under load the deaths concentrate at the drain step, and raising
`--step-timeout-ms` does not converge — 60s/180s/300s/540s budgets all died
alike in the 2026-06-12 evidence window (six deaths across two sessions; one
nine-minute wedge at moderate load on a stable ~3.1k-event dir). Keep the
step timeout SHORT — the ~120s in the canonical invocation above, an
order-100s budget as against 300–600s climbs — so wedges die cheap; expect
deaths in gate-heavy windows and restart on the same seen-file, where the
mandated post-restart foreground sweep (below) is the recovery path for
events the dead drain never marked seen. Newer counter-evidence
(2026-07-20, active n≥3 drive window, comms volume structurally above the
2026-06-12 corpus): 120s died twice in 15 minutes on healthy-but-slow
drains while 300s held — under sustained high-volume windows a ~300s
deadline is a sanctioned tuning chosen on observed drain durations, not a
climb-forever path. Two structural cures have since landed: the incremental
drain (MCP-198 — the drain still LISTS the whole directory but opens and
parses only UNSEEN events, so per-pass open cost tracks the unseen count,
not total event-file count) and the per-pass batch bound (MCP-229 —
next section). The remaining storage-shape work (the seen-state watermark)
stays homed in `agent-tooling/current/comms-watch-storage-redesign.plan.md`;
a re-arm onto a very stale cursor still pays the unseen-set read on every
pass of the catch-up, which is that plan's measured concern.

### Cursor movement is the health check; the batch bound is per-pass

`--max-events-per-drain 100` in the canonical invocation bounds EACH drain
pass, so every SUCCESSFUL pass advances the seen-file cursor and the
watcher keeps running — lifetime is independent of event traffic (MCP-229;
the retired `--max-events` lifetime budget silently ended the watcher at N
total emissions, which made watcher lifetime inversely proportional to
traffic and read fleet-wide as mysterious deaths). An emit-failure pass
deliberately leaves its events unseen for redelivery, and the flag bounds
the batch EMITTED per pass, not the unseen-set read that finds it (the
storage-redesign plan's measured concern). Without a bound, a large unseen
backlog makes one drain exceed its deadline BEFORE the first mark-seen,
every pass — a self-restarting watcher then spins indefinitely, emitting
restart heartbeats while its cursor sits unmoved (worked instance
2026-07-23: ~14 hours of `[watcher restarting]` with the cursor frozen at
the previous day; zero events lost only by luck of a quiet stream). The
progress check for ANY self-restarting monitor is therefore **cursor
movement, never process liveness**: after arming, verify the progress
artefact (seen-file mtime / entry count) advanced; a restart heartbeat is
not progress. Cursor movement is evidence of CONSUMPTION (PDR-133
`CURSOR`) and of nothing more — DELIVERY into the session (`NOTIFY`) is a
separate check, per §"Supervision must live on the notification path".
Backlog catch-up is chunked by construction — each pass hands the
supervising primitive one bounded batch before waiting — so an arm over a
stale cursor streams the backlog in chunks rather than flooding the
primitive.

One filter-vocabulary discipline from the 2026-07-23 tending window still
binds: derive notification filters from the emitter's OBSERVED output,
never from memory of the schema — the watch emits `title:`, not
`subject:`; a filter written from the schema delivered from-lines with no
titles for an hour (half-blind looks like working). When a notification
looks oddly thin, read the event file directly before dismissing. Any
noise filter must pass the `--- WATCHER EXIT ---` and `--- WATCHER ERROR
---` lines alongside `--- NEW`.

### Supervision must live on the notification path, never a wrapper loop

Do not wrap the canonical watch invocation in your own supervising loop
(`while kill -0 "$SUP"; do <comms watch>; done`, or similar hand-rolled
re-arm shells). A wrapper loop hides its own death: when the inner watch
process dies (drain-timeout, crash), the wrapper's next iteration silently
re-arms it with no observable gap — until the wrapper itself stalls or exits,
which then goes undetected because nothing is watching the wrapper. Two
independent instances: a supervised wrapper died silently after its first
inner drain-timeout and was discovered only by the F-95 `claims open`
watcher-liveness refusal, not by any liveness signal from the wrapper itself
(2026-07-13); a `pkill -f "<the watch command>"` intended to restart a wedged
inner arm also matched the wrapper shell's own command line (because the
wrapper's argv contains the watch-command string) and killed the whole
Monitor (2026-07-08).

The correct shape is the single canonical invocation under the platform's
own persistent-task primitive (Claude Code: `Monitor` with
`persistent: true`), re-armed on the primitive's own **exit notification**
— the notification path cannot hide a death the way a wrapper loop can,
because the notification IS the liveness signal. If a manual restart is
ever needed, target the inner process by pid, never a `pkill -f` pattern
that a wrapper's own command line can also match.

**A re-arm as a plain background shell is worse than no watcher at all.**
After a timeout death, a watcher re-armed as an ordinary background process
(instead of the event-emitting Monitor primitive) consumes events and
advances the seen-cursor with NO wake path into the session — which also
suppresses re-delivery, so the events are not merely delayed but silently
eaten. Worked instance 2026-07-25 (~16:45–18:25Z): three directed events
were swallowed this way; the owner surfaced it before the seat noticed.
The sharpened reading: **seen-cursor movement proves CONSUMPTION, not
DELIVERY** — the only delivery-health check is an event actually arriving
in-session (PDR-133 `NOTIFY`; this is the second NOTIFY-dead instance, and
the first on a platform whose primitive CAN notify — the defect was the
re-arm shape, not the platform).

A re-arm's recompute step must also treat an **empty state read as
transport/auth failure** (stop and surface), never as "keep looping" —
a gh-token invalidation once turned a supervised PR-watch loop into a
silent crash-loop against the anonymous API tier because empty state was
read as "no news" rather than "the transport is down" (2026-07-13/14).

### Interactive-harness x-stop is invisible from inside a session

An owner stopping a background task interactively (the harness UI's `x`)
produces NO task-notification, removes the task record (later queries
return "No task found"), and kills the process tree with the heartbeat
frozen mid-tick and no diagnostic line — calibrated first-hand with the
owner 2026-07-27, matching the 08:16–08:17Z fleet instances exactly (two
healthy watchers in two sessions, stopped 22 seconds apart during an
owner stillness window, both initially read as crashes). From inside the
session the signature is indistinguishable from a harsh death. Two
consequences: treat a vanished-task-with-no-notification during an
owner-active window as PROBABLY-OWNER, not as a defect to chase; and
after any owner pause/untangling window, re-verify and re-arm watchers
(heartbeat mtime plus a foreground sweep) rather than assuming
continuity. The owner stops monitors deliberately to still the team while
diagnosing — the stop is intentional; the invisibility is the platform's
(PDR-133 `NOTIFY` class, calibrated).

### The liveness classes this rule's checks reach

This rule's liveness checks live in three places: the
`assert-watcher-live` process assert (§"Enforcement" move-1 check and
claims-open backstop), the heartbeat-staleness classification in
§"Liveness self-check (cycle boundaries)" together with the
cursor-movement progress check in §"Cursor movement is the health check;
the batch bound is per-pass", and the known-event output plus
`emitted_count` check in §"Process liveness is not delivery liveness".
Together they are evidence about PDR-133's `PROCESS`, `CURSOR`, and
`DELIVERY` classes, and **about nothing else**:

- `SUBSTRATE` (is this the canonical comms home at all?) is covered
  separately by the canonical-home verification under §"Known
  Silent-Failure Class".
- `BINDING` (does this watcher belong to THIS live seat?) is what the
  `--supervisor-pid` guard in §"Canonical invocation" addresses; a
  green process assert cannot distinguish an orphan.
- `INTEGRITY` (delivered set equals written set — no hole, no replay)
  is what §"Seen-file convention", the post-restart foreground sweep,
  and §"Dormancy polls initialise their cursor FROM the frozen
  seen-file" address; a cursor can read advanced over a hole.
- `NOTIFY` (does the platform wake the reasoning loop on this
  output?), `LOOP`, and `ABSORB` are distinct classes that every check
  here reads green through.

The class model, the reading rule (an observation is evidence only
about the classes on the path it traversed), the self-observation
corollary, and the per-platform declaration obligation live in
[PDR-133](../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md),
ratified by the owner 2026-07-25; read it as the model
before treating any check here as proof a seat is reachable.

### Liveness self-check (cycle boundaries)

The watcher writes a liveness heartbeat **on by default** at
`<seen-file>.heartbeat.json` (every 30 s); `--heartbeat-file` relocates it
and `--no-heartbeat` disables it. The heartbeat records `last_drain_at`,
`last_emit_at`, `last_error_at`, `emitted_count`, `pid`, and the lexically
absolute `watched_comms_dir` it actually drains. At cycle boundaries, classify
the watcher's liveness from this surface rather than trusting the supervisor's
"running" status: a hung process cannot self-report, so an external staleness
check is the detection path that the fail-loud per-step deadline (which dies on
a hung step) cannot cover. Use the `collaboration-state` staleness classifier,
or stat the heartbeat file and treat an mtime older than `3 ×` the interval as
stale. Both F-95 gates also compare `watched_comms_dir` with the canonical
coordination-home comms directory: a fresh heartbeat with the right identity
but a different source is blind. The strict `0.2.0` heartbeat shape makes this
fail closed; re-arm watchers created by an older CLI.

**Mutual cover — the detector cannot detect itself.** In a team window,
every agent's cycle-boundary sweep ALSO staleness-checks the DIRECTOR'S
watcher heartbeat-file, because the highest-awareness seat is the one
nobody else watches: two worked instances in one session saw a frozen
watcher caught only from outside (a peer's stall diagnostic; owner
transport). Owner-approved 2026-06-11.

### Seen-file convention

Under the omit-path default, the seen-file lives at
`<PRIMARY coordination home>/.agent/state/collaboration/comms-seen/<exact
display name>.json`. The CLI creates both the canonical comms directory and
the seen-file's parent before it enters the watch loop. The display name
matches the `agent_name` derived by
`pnpm agent-tools:collaboration-state -- identity preflight --platform <p>
--model <m>` — **the display name VERBATIM, spaces included**
(`Zenith wakes Perigee.json`), never a kebab-case slug: `assert-watcher-live`
derives the heartbeat path from the display name, so a slug-named seen-file
leaves the watcher running and the assert red (four recorded instances;
`ls` the directory first — pre-existing seen-files model the convention).
An explicit `--comms-dir` / `--seen-file` pair is preserved verbatim; the
caller may therefore watch a deliberate alternate stream. That pair does not
redefine canonical F-95: the heartbeat still records the actual absolute
source, and `assert-watcher-live` / `claims open` reject it unless that source
matches the canonical coordination-home comms directory. Use `--repo-root` or
the declared coordination home when the intended canonical home itself changes.

### Dormancy polls initialise their cursor FROM the frozen seen-file

A dormant/standby seat's narrow wake poll must initialise its baseline
cursor from the frozen seen-file's own cursor position — never from an
arm-time directory listing. An arm-time baseline over a frozen cursor
leaves a wake-delivery hole: any directed wake landing between
cursor-freeze and poll-arm can never fire the poll. Both directions are
worked instances (2026-07-15, one session): the failure (a Director wake
fell in the hole and needed a re-ping) and the success (a poll seeded
SINCE the cursor-freeze time with a dedup set of pre-arm matches caught
its wake within one poll). Corpus-test the wake FILTER before arming
(directed-match, zero leaks), and verify the CURSOR INIT separately —
the two defects are independent. Build the poll from the canonical
watcher/inbox tooling, never hand-rolled field filters: a hand-rolled poll
matched on `addressed_to` where the schema's live field is `to`, making a
directed wake invisible (the same schema-vs-observed-output discipline as
the notification-filter paragraph above).

### No hand-rolled fallback

There is no sanctioned shell reimplementation of `comms watch`. A portable
script cannot safely duplicate the schema union, canonical ID-keyed
`sameAgentRoutingKey` self-exclusion, PRIMARY-home resolution, atomic cursor,
or post-delivery mark-seen ordering. If `agent-tools` is not built, build it
before team start; do not replace it with `ls` / `jq` filtering.

An agent on a platform with no persistent background-task primitive must
declare the `NOTIFY` gap in its team-start post and use the CLI's
all-channels `comms inbox` at the team-cadence interval, with an explicit
absolute PRIMARY-home `--comms-dir` and exact-display-name `--seen-file`
until inbox defaulting lands. It must never use a single-view filter, because
the directed-only view misses broadcast and group events that carry
team-bootstrap coordination itself.

### Process liveness is not delivery liveness

A watcher can pass
`assert-watcher-live` (which reads the watcher's OWN heartbeat file)
while delivering ZERO events — a wedged output path ran one watcher mute
for ~40 minutes with a green assert (2026-07-02). Verify the canonical
delivery path with a known non-self event: require its rendered block to
appear on watcher output and the heartbeat's `emitted_count` to advance.
Then verify `NOTIFY` separately by requiring the host to create an agent
turn without a manual poll or user prompt. A green process assert alone
proves neither result. At n=1 with no peers, a legitimately silent stream
cannot supply this probe; record the evidence ceiling rather than reading
silence as either success or failure.

## Real-Time Failure-Mode Capture on the Comms Stream

Under any team session running under the all-channels watcher discipline
above, the comms event stream is also the real-time channel for
failure-mode capture per
[PDR-066](../practice-core/decision-records/PDR-066-comms-events-as-failure-mode-channel.md).
Failure modes worth surfacing to peers during their session — verdict
walk-backs, shell-quoting hazards, premature-optimisation reflex saves,
audit-shaped test catches, reviewer-dispatch surprises,
coordination-protocol gaps — are posted as comms-events as they occur,
not held back to session close.

The substrate-implementation phenotype is
[ADR-183](../../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md):
an optional `tags` array on the `narrative`, `lifecycle`, and `directed`
event kinds, with the namespace exactly `"failure-mode"` (substantive
failure modes) and `"behaviour-note"` (softer behaviour patterns worth
peers' attention but not yet failure modes).

The failure-mode event body follows a four-section convention —
**Observation / Diagnosis / Cure / Pointer** — kept short enough that a
watcher reading the event inline absorbs the substance in one read pass.
The convention is not schema-enforced (the body field stays free-form
prose by design); it is the SKILL-level discipline that makes the channel
scannable.

**Activation live as of 2026-05-23.** ADR-183's required substrate has
landed: the optional `tags` field is on `comms-event.schema.json`, and
watcher rendering with tests for `[FAILURE-MODE]` / `[BEHAVIOUR-NOTE]`
tokens composed with the existing channel tokens is active. Agents MAY
now write `tags: ["failure-mode"]` or `tags: ["behaviour-note"]` on the
`narrative`, `lifecycle`, and `directed` event kinds when the event's
substance matches the namespace above.

The comms-event channel is the primary first-capture vehicle for
real-time team-session failure modes and behaviour notes. The
consolidation surfaces remain the absorption destination: session
closeout reads the session's tagged events forward into napkin /
`distilled.md` / graduation surfaces as appropriate.

## Worked Instance

The 2026-05-22 watcher absorption gap was the founding failure mode for
this rule. An agent ran a directed-only filter over the comms stream
during a multi-agent session; the directed filter discarded broadcast
and group events that carried the team-bootstrap coordination itself.
The agent appeared bootstrapped on their own surface but was invisible
to peers and missed the broadcast coordinating cycle/boundary
assignment. The cure was the all-channels watcher with self-exclusion
only — and the rule that the watcher fires before any other
team-bootstrap move so the same gap cannot recur.

## Why a Rule, Not a SKILL Clause

This rule was extracted from `start-right-team` SKILL §0 because the
all-channels watcher discipline is a discrete operational invariant with
a single Trigger (team session bootstrap) and a single Action
(persistent watcher running). The SKILL retains a thin-pointer paragraph
naming the rule; the substance lives here for two reasons:

1. The rule corpus is the discoverability surface for agent-general
   disciplines. Folding the watcher invocation inside a SKILL section
   buries it where authors of new SKILLs and other coordination surfaces
   cannot find it.
2. The doctrine-load discipline of
   [`directive-file-context-budget`](directive-file-context-budget.md)
   benefits from rules being trigger-loaded — this rule loads at team
   session bootstrap, not at every session open, reducing baseline
   directive cost.

## Related Surfaces

- [`start-right-team` SKILL First Moves move 1](../skills/start-right-team/SKILL-CANONICAL.md)
  — the thin-pointer host that names this rule's firing moment. The First
  Moves entry IS the trigger surface; removing it would make this rule
  unreachable from session bootstrap.
- [`liveness-heartbeat-cron`](liveness-heartbeat-cron.md) — the
  outgoing-visibility sibling. Watcher delivers incoming visibility;
  heartbeat cron emits outgoing visibility (itself value-contingent — see
  the rule below).
- [`collaboration-is-value-contingent`](collaboration-is-value-contingent.md)
  — the value-contingency discipline. The all-channels watcher is the
  *awareness* surface and the high-value end of the spectrum:
  near-universally justified, never ceremony.
- [`.agent/reference/comms-watch-mechanism.md`](../reference/comms-watch-mechanism.md)
  — identity discipline and self-exclusion contract.
- [PDR-133](../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md)
  (Accepted) — the liveness class model. PDR-133 §5 carries the
  portable self-observation corollary (a seat cannot certify the
  never-self-certifiable classes about itself, so those classes need an
  external observer); this rule keeps the repo's own surfaces and worked
  instances, including the §"Mutual cover — the detector cannot detect
  itself" discipline above, which applies that corollary to the
  Director's watcher heartbeat-file specifically.
- [PDR-066](../practice-core/decision-records/PDR-066-comms-events-as-failure-mode-channel.md)
  — comms-events as failure-mode capture channel.
- [ADR-183](../../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md)
  — comms-event tag-namespace substrate (`failure-mode`,
  `behaviour-note`, `heartbeat`).
- [`use-built-agent-tools-cli`](use-built-agent-tools-cli.md) — governs
  the CLI surface this rule invokes.
- [`directed-routing-requires-absorption-ack`](directed-routing-requires-absorption-ack.md)
  — the `ABSORB`-class sibling: this rule's checks stop at `DELIVERY`;
  absorption evidence comes from the ack convention that rule owns.
- [`.agent/reference/arc-rapid-communication.md`](../reference/arc-rapid-communication.md)
  §Protocol — the ArcAngel rapid-comms dialogue channel. An ArcAngel
  watcher never substitutes for this canonical all-channels watcher; the
  two are paired. A session tailing only ArcAngel is blind to heartbeats,
  comms-carried commit intents, owner gates, and team-bootstrap coordination
  on this canonical stream; neither watcher replaces the separate claims and
  commit-queue reads.

## Enforcement

Mechanical, not diligence. The watcher's presence is observable as a running
background task (Monitor task id, Cron job, or platform equivalent), and the
team-start broadcast names the watcher status, but the rule is backed by two
mechanical gates so it cannot be skipped by forgetting it (F-95):

- **Move-1 check** — `pnpm agent-tools:collaboration-state -- comms
  assert-watcher-live --platform <p> --model <m>` exits non-zero with a fix
  instruction unless this session has a live watcher heartbeat. Run it as part
  of move 1, right after arming the watcher.
- **Claims-open backstop** — `claims open` refuses to stake a claim into a
  registry that holds another live agent while this session is blind to comms
  (no live watcher heartbeat). This sits on the exact action whose blindness
  caused the founding pilot failure, so the guarantee holds without relying on
  the agent running the move-1 check. Solo / n=1 bootstrap sessions (no other
  live agent) are exempt.

Both gates independently resolve the exact-display-name heartbeat under the
same PRIMARY coordination home (or the same explicit `--repo-root`) and
classify it stale past 3× its interval. They do not trust an arbitrary explicit
watch-path pair, so a watcher aimed at a worktree-local decoy cannot satisfy
the default-path gate. Mid-session watcher death is a separate concern (the
cycle-boundary staleness check), not this session-open gate.

## Known Silent-Failure Class

Comms infrastructure has a recurring class of failures that report nothing
wrong. Check these before trusting a quiet channel:

- **The rendered log is a full constructive overwrite** — `comms render`
  regenerates `shared-comms-log.md` wholesale; never hand-edit the rendered
  view (edits are destroyed on the next render) and never treat it as the
  event source (it lags — the canonical `comms/*.json` event files are truth).
- **An explicitly empty cursor with `--no-auto-seed` replays the entire
  history**, burying live events under the backlog. The default mode derives
  the exact-display-name cursor and auto-seeds it on first use; request replay
  only deliberately.
- **Self-exclusion filters can drop directed events** — a filter meant to skip
  the agent's own broadcasts can also skip events *addressed to* the agent;
  verify inclusion with a known directed event before relying on a filter.
- **An explicit path pair can still target a retired or decoy directory** —
  the omit-path default resolves the PRIMARY coordination home and prevents
  the worktree-relative F-41 misroute, but explicitly supplied values are
  preserved verbatim. Verify any explicit watch/send destination before
  relying on it; the remaining F-41 migration is tracked in
  `agent-tooling/current/coordination-home-cli-path-defaulting.plan.md`.
- **The CLI can exit 0 while transferring or parsing nothing** — read the
  failure surface (event counts, the written file), never the exit code
  (`wrapped-exit-codes-false-green`).
- **Delivery-live can still be notification-dead** — a watcher may discover
  an event, emit it, mark it seen, and keep a fresh heartbeat while the
  host never wakes the reasoning harness. Process-liveness,
  delivery-liveness, and notification-liveness are three separate checks.
  On a platform whose primitive cannot wake the harness (e.g. Copilot CLI
  1.0.75 detached Bash output), apply the
  [`start-right-team` periodic comms cadence](../skills/start-right-team/SKILL-CANONICAL.md#5-maintain-the-team-cadence)
  with a separate harness-absorption cursor; the portable acceptance test
  belongs in
  [`comms-watch-mechanism`](../reference/comms-watch-mechanism.md).
