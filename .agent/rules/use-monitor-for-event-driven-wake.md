# Use Monitor for Event-Driven Wake-Ups

For any long-running command whose output should drive agent
wake-ups (comms events, log lines, CI status, file-system change
streams), arm the harness **Monitor** tool with `persistent: true`
and a line-buffered filter on the meaningful lines. **Do not** use
Bash `run_in_background` for the same purpose.

## The Invariant

Event-driven work — where each new line on a stream should produce
an agent reaction — runs on Monitor. Polling work — where the
agent must intermittently re-check a surface — does not have a
Monitor equivalent and remains the agent's responsibility, subject
to the periodic-comms-check cadence rule.

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
   `<task-notification>`; if it does not, the filter is wrong or
   the source is not flushing line-buffered.

## Reference Shape (Comms Watcher)

```bash
pnpm agent-tools:collaboration-state -- comms watch \
  --comms-dir .agent/state/collaboration/comms \
  --seen-file ".agent/state/collaboration/comms-seen/<agent-name>.json" \
  --platform <claude|codex|cursor> --model <model-id> 2>&1
```

Run via Monitor `persistent: true`, **pipe-less** — the `comms watch`
CLI already self-excludes and emits only relevant events, so no grep
filter is needed or wanted. Each emitted event is a multi-line block
whose **first line is `--- NEW [<CHANNEL>] EVENT ---`**: the channel tag
sits MID-line, after the `--- NEW` prefix, NOT as a leading `[`. A naive
`grep -E '^\['` filter therefore matches nothing and **silently swallows
every event** while the watcher process stays healthy (drain + markSeen
advance, heartbeat fresh) — a silent blinding (worked instance
2026-06-21, owner-caught after ~50 min / ~10 missed events). If you must
filter for noise, anchor on the real emit
(`grep --line-buffered -E '^--- NEW|WATCHER ERROR|kind=timeout'`) and
**test it against one real held-back event first** (the
`comms-all-channels-watcher.md` "test your filter against one event of
each shape" discipline). The canonical invocation lives in
[`comms-all-channels-watcher.md`](comms-all-channels-watcher.md).

## Why This Is a Rule, Not a Preference

A single instance landed as a behavioural surface
(`oak-start-right-team` SKILL §0 defaults to Monitor), but the
underlying choice — *which harness wrapper to use for any
event-driven stream* — generalises beyond comms watching. Treating
it as a general rule prevents the same Bash-background reflex from
recurring at every new event-driven surface.
