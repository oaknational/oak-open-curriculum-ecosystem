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
`(agent_name, platform, session_id_prefix)` identity tuple (per
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
`--max-events` budget.

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
# Two F-101 guards stop a gone-away watcher orphaning (and writing a false F-95
# heartbeat): (1) `--supervisor-pid "$PPID"` — the watcher self-exits when the agent
# process dies, the PRIMARY cure incl. the crash/SIGKILL path; (2) the GNU
# `timeout`/`gtimeout` prefix (default 3600s) — the backstop. A live agent re-arms on the
# Monitor exit-notification; a dead one does not. Build the argv first, then prepend the
# timeout only if present — zsh-safe, portable, graceful (runs un-guarded if coreutils is
# absent). Do NOT use `${VAR:+$VAR 3600} cmd`: zsh does not word-split it, so it tries to
# exec "timeout 3600".
set -- pnpm agent-tools:collaboration-state -- comms watch \
  --comms-dir .agent/state/collaboration/comms \
  --seen-file .agent/state/collaboration/comms-seen/<agent-codename>.json \
  --platform <claude|codex|cursor> \
  --model <model-id> \
  --supervisor-pid "$PPID" \
  --step-timeout-ms 120000
TIMEOUT_BIN="$(command -v timeout || command -v gtimeout || true)"
[ -n "$TIMEOUT_BIN" ] && set -- "$TIMEOUT_BIN" 3600 "$@"
exec "$@"
```

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

The supervising Monitor/cron re-arms a fresh watcher on exit — the `--seen-file`
cursor means the restart misses no events, only delays them by the re-arm.

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
`.agent/state/collaboration/comms-event.schema.json`). `--only-directed`
opts into the legacy narrow view.

Run the command via the platform's persistent background-task mechanism:
Claude Code uses the `Monitor` tool with `persistent: true`; Cursor and
Codex use their equivalent watch primitives.

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
events the dead drain never marked seen. The structural cure —
batched/incremental drain with per-batch deadlines, or moving the scan off
the deadline path — is homed in the
`agent-tooling/current/comms-watch-storage-redesign.plan.md` plan.

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

A re-arm's recompute step must also treat an **empty state read as
transport/auth failure** (stop and surface), never as "keep looping" —
a gh-token invalidation once turned a supervised PR-watch loop into a
silent crash-loop against the anonymous API tier because empty state was
read as "no news" rather than "the transport is down" (2026-07-13/14).

### Liveness self-check (cycle boundaries)

The watcher writes a liveness heartbeat **on by default** at
`<seen-file>.heartbeat.json` (every 30 s); `--heartbeat-file` relocates it
and `--no-heartbeat` disables it. The heartbeat records `last_drain_at`,
`last_emit_at`, `last_error_at`, `emitted_count`, and `pid`. At cycle
boundaries, classify the watcher's liveness from this surface rather than
trusting the supervisor's "running" status: a hung process cannot
self-report, so an external staleness check is the detection path that the
fail-loud per-step deadline (which dies on a hung step) cannot cover. Use the
`collaboration-state` staleness classifier, or stat the heartbeat file and
treat an mtime older than `3 ×` the interval as stale.

**Mutual cover — the detector cannot detect itself.** In a team window,
every agent's cycle-boundary sweep ALSO staleness-checks the DIRECTOR'S
watcher heartbeat-file, because the highest-awareness seat is the one
nobody else watches: two worked instances in one session saw a frozen
watcher caught only from outside (a peer's stall diagnostic; owner
transport). Owner-approved 2026-06-11.

### Seen-file convention

The `<agent-codename>.json` seen-file lives in
`.agent/state/collaboration/comms-seen/` (committed directory). On a fresh
clone or worktree where the directory has not yet been created,
`mkdir -p .agent/state/collaboration/comms-seen` first — the CLI does not
auto-create the seen-file's parent directory and `appendFile` will fail
silently if it is missing, causing the watcher to re-emit every event on
every poll. The codename matches the `agent_name` derived by
`pnpm agent-tools:collaboration-state -- identity preflight --platform <p>
--model <m>` — **the display name VERBATIM, spaces included**
(`Zenith wakes Perigee.json`), never a kebab-case slug: `assert-watcher-live`
derives the heartbeat path from the display name, so a slug-named seen-file
leaves the watcher running and the assert red (four recorded instances;
`ls` the directory first — pre-existing seen-files model the convention).

### Fallback shape — portable script

Use when the `agent-tools` CLI is not yet built locally, or on a platform
without the CLI:

```bash
SEEN=tmp/<agent>-comms-seen.txt
ls .agent/state/collaboration/comms | sort > "$SEEN"
while true; do
  ls .agent/state/collaboration/comms | sort > tmp/now.txt
  for f in $(comm -13 "$SEEN" tmp/now.txt); do
    jq -r --arg self "$SELF_SESSION_PREFIX" '
      if (.author.session_id_prefix // .from.session_id_prefix // "") == $self
      then empty
      else "[" + .created_at + "] "
           + ((.author.agent_name // .from.agent_name // "?") + "/"
              + (.author.session_id_prefix // .from.session_id_prefix // "?"))
           + " -> " + (
               if (.to // null) != null
               then (.to.agent_name // "?") + "/" + (.to.session_id_prefix // "?")
               elif (.addressed_to // null) != null then .addressed_to
               elif (.audience // null) != null
               then "GROUP(" + (.audience | join(",")) + ")"
               else "BROADCAST"
               end
             )
           + " :: " + (.title // .subject // "?")
      end' ".agent/state/collaboration/comms/$f"
  done
  mv tmp/now.txt "$SEEN"
  sleep 5
done
```

An agent on a platform with no persistent background-task primitive must
declare the gap in their team-start post and adopt a polling cadence that
sweeps the full directory at the team-cadence interval, never a
single-view filter — because the directed-only view misses the broadcast
and group events that carry the team-bootstrap coordination itself.

**Before arming ANY hand-written watcher, test its exact filter against
one event of each shape** — directed, untagged narrative, tagged
heartbeat, self-authored. A render path proven only on heartbeats is
unproven for the events that matter: a hand-rolled filter once dropped
every untagged narrative event while rendering heartbeats perfectly,
and the heartbeat volume masked the gap (worked instance 2026-06-10;
owner-approved 2026-06-11). Filter `*.tmp-*` names from poll-loop
listings — the atomic-write rename race produces benign transient
files.

**Process-liveness is not delivery-liveness.** A watcher can pass
`assert-watcher-live` (which reads the watcher's OWN heartbeat file)
while delivering ZERO events — a muting filter or a wedged pipe ran one
watcher mute for ~40 minutes with a green assert; a second agent's
filter had the inverse defect (leaked everything) from the same wrong
render assumption, same day (2026-07-02). The cure pair:

1. **Corpus-test any hand-rolled filter against a real inbox snapshot
   BEFORE arming** — prove the pass/leak counts against the actual
   event corpus (the worked instance proved 381/381 pass + 0/791 leak,
   then armed), never assume them. This mechanises the
   test-each-shape step above.
2. **Check the delivery side, not just the process**: the watcher
   heartbeat records `emitted_count` — at cycle boundaries compare it
   against stream activity in the window (events landed vs events
   emitted). A green process assert with a flat `emitted_count` against
   a moving stream is the mute signature. (Also expected honestly: at
   n=1 with no peers, a silent stream and drain-timeout deaths are
   comms-volume cost, not failure — re-arm and sweep.)

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
- [PDR-066](../practice-core/decision-records/PDR-066-comms-events-as-failure-mode-channel.md)
  — comms-events as failure-mode capture channel.
- [ADR-183](../../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md)
  — comms-event tag-namespace substrate (`failure-mode`,
  `behaviour-note`, `heartbeat`).
- [`use-built-agent-tools-cli`](use-built-agent-tools-cli.md) — governs
  the CLI surface this rule invokes.
- [`.agent/reference/arc-rapid-communication.md`](../reference/arc-rapid-communication.md)
  §Protocol — the ArcAngel rapid-comms dialogue channel. An ArcAngel
  watcher never substitutes for this canonical all-channels watcher; the
  two are paired. A session tailing only ArcAngel is blind to the claims,
  heartbeats, commit intents, owner gates, and team-bootstrap coordination
  that live on this canonical stream.

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

Both gates classify liveness from the watcher's `<seen-file>.heartbeat.json`
(stale past 3× its interval). Mid-session watcher death is a separate concern
(the cycle-boundary staleness check), not this session-open gate.

## Known Silent-Failure Class

Comms infrastructure has a recurring class of failures that report nothing
wrong. Check these before trusting a quiet channel:

- **The rendered log is a full constructive overwrite** — `comms render`
  regenerates `shared-comms-log.md` wholesale; never hand-edit the rendered
  view (edits are destroyed on the next render) and never treat it as the
  event source (it lags — the canonical `comms/*.json` event files are truth).
- **First run without a `--seen-file` replays the entire history**, burying
  live events under the backlog; always pass the seen-file cursor.
- **Self-exclusion filters can drop directed events** — a filter meant to skip
  the agent's own broadcasts can also skip events *addressed to* the agent;
  verify inclusion with a known directed event before relying on a filter.
- **Events can land in a retired or decoy directory** — a worktree-launched
  watcher that resolves a local `.agent/state/collaboration/comms` watches an
  empty decoy (the CLI silently creates it), and writes to a retired dir are
  equally silent. Verify the watch/send dir is the primary coordination home
  (`resolveCoordinationHome`) — the F-41 family; the cure plan is
  `agent-tooling/current/coordination-home-cli-path-defaulting.plan.md`.
- **The CLI can exit 0 while transferring or parsing nothing** — read the
  failure surface (event counts, the written file), never the exit code
  (`wrapped-exit-codes-false-green`).
