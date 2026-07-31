# Use Monitor for Event-Driven Wake-Ups

For any long-running command whose output should drive agent wake-ups
(comms events, log lines, CI status, file-system change streams), use the
host's proven incremental-notification path. On a harness with **Monitor**,
arm it with `persistent: true` and a line-buffered filter on the meaningful
lines. On Codex, use the relay-child composition below for the canonical
comms watcher; other stream types need their own proven notification path.
**Do not** use Bash `run_in_background` for the same purpose.

## The Invariant

Event-driven work — where each new line on a stream should produce an agent
reaction — runs on a notification path proven end to end for that host.
Polling work — where the agent must intermittently re-check a surface — has
no stream to notify from and remains the agent's responsibility, subject to
the periodic-comms-check cadence rule.

## Why

Bash `run_in_background` writes stdout to a file and **delivers no
notifications** — the agent must poll the file to discover new
lines. This is wasteful (the agent burns cycles polling) and
unreliable (the agent's next turn may not include a poll).

Monitor with `persistent: true` streams each stdout line as a
`<task-notification>` that wakes the loop immediately. The agent
reacts to the line, not to a poll interval. The infrastructure
cost is identical (one long-running process); the wake semantics
are fundamentally different.

Falsifiability: if Bash background ever starts delivering per-line
notifications, this distinction becomes moot. Until then, choosing
Bash background for event-driven wake is a named failure mode —
surface it as soon as polling shows up in the design.

## The liveness class this rule owns

This rule is the operational home of the `NOTIFY` class in
[PDR-133](../practice-core/decision-records/PDR-133-liveness-classes-and-platform-declaration.md)
(ratified by the owner 2026-07-25): it owns the wake primitive,
and `NOTIFY` is precisely the class that asks whether the platform
wakes the reasoning loop on a watcher's output. An agent arming a
watcher on a **new platform** reads this rule at exactly the moment
that question is live, so this is where the platform's `NOTIFY`
declaration row gets established — by the acceptance test named in the
§"Discipline When Switching" step 3 shape: send a directed event, and
confirm it creates an agent turn with no manual poll and no user prompt. On a
Monitor-capable host, a `<task-notification>` is the expected notice; on Codex,
the relay child uses `collaboration.send_message` to wake the root. A process
that merely prints the event to a file fails the class, however healthy it
looks.

`NOTIFY` fails independently of the delivery classes beneath it: a
platform whose background primitive signals only when a process
*completes* cannot notify from a persistent watcher at all, even with
every event correctly drained, marked seen, and written to the output
surface. Per PDR-133's reading rule, a green on the delivery path is
evidence about nothing above it — cite the class model there; the
invocation detail, the filter hazards, and the worked instances stay
here.

## When the Rule Fires

- All-channels comms watchers (`pnpm agent-tools:collaboration-state
  -- comms watch …`) for team sessions.
- Long-running test/build streams whose progress events should
  unblock dependent work.
- File-system watchers driving rebuild or re-test loops.
- Any tail-of-log surface where the agent's next reaction is keyed
  to a specific log line.

## When the Rule Does Not Fire

- One-shot "wait until this completes" — use Bash with
  `run_in_background: true` and accept the completion notification
  the harness delivers when the process exits.
- Genuinely periodic checks (poll a remote queue at a fixed cadence,
  re-read a status file every N minutes) — Monitor cannot replace a
  poll because the source surface emits no stream.

## Composition With Existing Rules

- [`agent-state-observable`](agent-state-observable.md) — the
  Monitor surface is itself observable to peers via the comms
  stream the Monitor watches; this rule keeps the wake mechanism
  consistent with the observability invariant.
- Periodic-comms-check cadence (per the periodic-comms-check
  feedback memory) applies *in addition to* Monitor for surfaces
  Monitor cannot watch directly; Monitor is not a substitute for
  the cadence rule on those surfaces.

## Discipline When Switching

The following switch procedure applies to Monitor-capable hosts. Codex uses
the [session relay](#codex-notify-session-relay) instead: do not treat the
relay's `collaboration.send_message` wake as a missing
`<task-notification>`.

When transitioning a long-running command from Bash background to
Monitor:

1. Stop the prior Bash background watcher first — two redundant
   streams duplicate notifications and waste cache.
2. Arm Monitor with the same command. Add a `grep --line-buffered
   <pattern>` ONLY if the source emits genuine every-line noise — and
   then anchor the pattern on the source's ACTUAL line format and test it
   against one real event before relying on it (a wrong anchor silently
   swallows everything; see §Reference Shape). A source that already
   emits only meaningful lines (e.g. the comms-watch CLI) needs no
   filter — pipe-less is correct.
3. Verify the first new event after arming produces a
   `<task-notification>` and creates an agent turn without a manual poll or
   user prompt; if it does not, the filter is wrong, the source is not
   flushing line-buffered, or the host notification path is unproved.

<!-- CODEX_TEAM_ALERT_BOOTSTRAP_SOURCE_START -->
## Codex team-session alert bootstrap

For coordinated Codex work, load `$oak-start-right-team` before claiming and
keep the root watcher live. Then follow the Codex relay procedure at
`.agent/rules/use-monitor-for-event-driven-wake.md#codex-notify-session-relay`.
If the relay child exposes `collaboration.send_message`, use the relay;
otherwise declare NOTIFY degraded and follow that rule's bounded-poll fallback.
Watcher liveness is not proof of reasoning wake, and canonical comms monitoring
does not cover file-only ARC or standards channels.
<!-- CODEX_TEAM_ALERT_BOOTSTRAP_SOURCE_END -->

## Codex NOTIFY: session relay

Codex CLI `0.146.0` has a certified `NOTIFY` composition for the canonical
comms watcher. It adds a distinct collaboration child as a live relay; a
watcher process, cursor, or stdout file owned only by the root does not wake
the root reasoning loop and therefore does not satisfy `NOTIFY`.

The relay is an **additional notification watcher**, not the participating
root's watcher. Keep the root-identity watcher from `start-right-team` armed:
its exact-display-name heartbeat is what `assert-watcher-live` and the
`claims open` F-95 backstop attest. The relay has a different identity and
cursor, so its heartbeat cannot and must not attest the root.

The session-scoped procedure is:

1. The root arms its own canonical watcher under the root identity and passes
   `comms assert-watcher-live`. This watcher owns the root's delivery cursor
   and F-95 heartbeat; it remains live for the whole team session.
2. The root spawns a distinct relay child with its own canonical
   collaboration identity. The child never impersonates the root and never
   reuses the root's seen-file.
3. The relay child starts a second canonical invocation from
   [`comms-all-channels-watcher`](comms-all-channels-watcher.md#canonical-invocation--the-agent-tools-cli),
   using its own identity and exact-display-name cursor. It adds
   `--exclude-tag heartbeat`; because heartbeat events are then absent from
   the stream, it also runs the F-75 `comms peer-liveness` check at least once
   every 60 seconds. Until the remaining comms-read defaulting work lands,
   that check MUST pass the absolute PRIMARY-home comms path exactly as shown
   in
   [`liveness-heartbeat-cron`](liveness-heartbeat-cron.md#surfacing-peer-heartbeat-silence-f-75);
   a cwd-relative path from a linked worktree is a decoy.
4. The relay child owns the watcher's foreground exec session and awaits it
   with `write_stdin` calls whose individual wait is no longer than 30
   seconds. For each emitted non-heartbeat event, the child suppresses
   root-authored events in its reasoning, then forwards every remaining
   external event to `/root` with a `collaboration.send_message` notification.
   Root-authored events are **not** excluded at the watcher boundary: the
   watcher self-excludes only the relay identity, and the relay owns the
   additional root-author suppression.
5. Receipt of that collaboration message by the root is the `NOTIFY` leg.
   Validate it with a directed event from an external observer and require
   the root turn to occur without a root manual poll or user prompt.

The two watcher processes are intentional and never share a cursor: the
root-identity watcher supplies root delivery/liveness custody, while the
relay-identity watcher supplies host notification. The relay is not a daemon.
Its watcher retains the canonical 3600-second backstop and is not
auto-rearmed. If the child, its exec session, or the watcher exits, the bridge
is gone. A deliberate replacement resumes from the same relay cursor and
performs the canonical foreground gap sweep after the restart.

### Degraded fallback when direct send is unavailable

This fallback fires only when the relay child does not expose
`collaboration.send_message`. Do not claim event-driven wake and do not add a
second watcher that cannot notify the root. Keep the canonical root watcher and
its F-95 heartbeat live, retain its foreground exec `session_id`, and declare
`NOTIFY: degraded — bounded foreground polling; idle wake unavailable` in the
team-start message.

The participating root owns the poll:

1. Call the platform `write_stdin` tool on the root watcher's exec session with
   empty `chars`, a `yield_time_ms` no greater than `30000`, and bounded output.
   This reads only output already delivered by the canonical watcher; it is not
   a shell command and it does not prove NOTIFY.
2. Poll at the start of every reasoning turn, after each material tool or gate
   result, and at least once every 60 seconds while the root is actively
   executing team work. A root with no active turn cannot self-wake on this
   fallback; state that gap rather than implying continuous awareness.
3. Apply normal relevance triage to every emitted non-self event and write any
   required content-bearing acknowledgement through canonical comms. The poll
   covers canonical comms only — not file-only ARC, standards files, claims, or
   the commit queue.
4. Stop foreground polling when the team session ends or after a distinct relay
   passes the external directed no-poll NOTIFY/ABSORB challenge. Re-test the
   direct-send capability after a Codex/harness change or in the next fresh
   session; never promote the fallback from degraded without that challenge.

After any watcher start or restart, run the canonical foreground gap sweep
before relying on the next bounded poll.

The dated PDR-133 observation, platform/tool versions, evidence events, and
bounded notification interval live only in the
[`cross-platform-agent-surface-matrix`](../memory/executive/cross-platform-agent-surface-matrix.md#platform-liveness-declaration-pdr-133).
This rule owns the operating procedure, not a second copy of its evidence.

## Reference Shape (Comms Watcher)

This block is a TEACHING EXCERPT — it illustrates the flags this rule
discusses. Arm real watchers from the canonical block in
[`comms-all-channels-watcher.md`](comms-all-channels-watcher.md), which
adds the `cd <repo-root>` guard and the `timeout` backstop this excerpt
omits.

```bash
pnpm agent-tools:collaboration-state -- comms watch \
  --platform <claude|codex|cursor> --model <model-id> --supervisor-pid "$PPID" \
  --step-timeout-ms 120000 \
  --max-events-per-drain 100 2>&1
```

The omitted path pair is intentional: the CLI resolves the PRIMARY
coordination home and derives the exact-display-name cursor. Supply
`--comms-dir` and `--seen-file` only together for a deliberate alternate
target; `--repo-root` overrides the derived home.

`--supervisor-pid "$PPID"` binds the watcher's lifetime to the agent session
that spawned it (the F-101 crash-orphan cure): the watcher self-exits within one
poll cycle of that process disappearing — announcing itself with a final
`--- WATCHER EXIT --- reason=supervisor-gone` line — so a harsh agent death
(crash / SIGKILL, which GNU `timeout`'s group-kill cannot reach) leaves no
orphaned watcher writing a false-liveness heartbeat. The pid is MANDATORY:
without it and without a composing `timeout` the watcher has no ORDERLY
exit path of its own — only a fatal step, a step deadline, or an external
kill ends it. `--max-events-per-drain` bounds each drain pass (never the
lifetime — the watcher keeps running; MCP-229).

On a Monitor-capable host, run with `persistent: true`, **pipe-less** — the
`comms watch` CLI already self-excludes and emits only relevant events, so no
grep filter is needed or wanted. On Codex, use the root watcher plus
[relay-child procedure](#codex-notify-session-relay), not Monitor. Each
emitted event is a multi-line block whose **first line is `--- NEW
[<CHANNEL>] EVENT ---`**: the channel tag sits MID-line, after the `--- NEW`
prefix, NOT as a leading `[`. A naive `grep -E '^\['` filter therefore matches
nothing and **silently swallows every event** while the watcher process stays
healthy (drain + markSeen advance, heartbeat fresh) — a silent blinding
(worked instance 2026-06-21, owner-caught after ~50 min / ~10 missed events).
If you must filter for noise on a Monitor-capable host, anchor on the real emit
(`grep --line-buffered -E '^--- NEW|WATCHER ERROR|WATCHER EXIT|kind=timeout'`
— omitting `WATCHER EXIT` swallows the watcher's own orderly-exit
announcement) and
**test it against one real held-back event first** (the
`comms-all-channels-watcher.md` "test your filter against one event of
each shape" discipline). The canonical invocation lives in
[`comms-all-channels-watcher.md`](comms-all-channels-watcher.md).

Never route a monitor's stderr to `/dev/null`: a monitor that swallows its
own stderr makes its failures undiagnosable — a transient emit failure
surfaces only as a bare `FAILED` line with no cause attached (worked
instance 2026-06-11). Keep `2>&1` (as in the reference shape above) so the
failure cause reaches the output file even when it does not notify.

## Why This Is a Rule, Not a Preference

A single instance landed as a behavioural surface
(`oak-start-right-team` SKILL §0 defaults to Monitor), but the
underlying choice — *which harness wrapper to use for any
event-driven stream* — generalises beyond comms watching. Treating
it as a general rule prevents the same Bash-background reflex from
recurring at every new event-driven surface.
