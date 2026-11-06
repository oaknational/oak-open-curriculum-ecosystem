---
classification: core
description: The host is a shared substrate — no unbounded background load, ever. Spawns are bounded, owned, and reaped with a verified census; host-level load needs proportionality and announcement; check host health at bootstrap.
---

# No Unbounded Host Load

The host machine is a shared substrate: the owner's computer, every live
agent session, every gate chain, and every monitor run on it together.
Saturating it is a denial of service against all of them at once — and the
damage is invisible to agents, who watch comms, git, and PRs but not the
host, so the symptoms get misattributed to tooling.

**Owner directive (2026-06-11, maximum severity): this must never happen
again.**

## Rule

1. **No experiment gets host-level load by default.** Before spawning ANY
   synthetic load, ask whether the effect can be provoked in-process —
   an injected clock or scheduler, deterministic interleaving, injected
   delays. For timer
   races and scheduling flakes the in-process route almost always
   suffices; ambient host load is the wrong instrument and was not shown
   necessary even in the founding instance.
2. **Any spawned process is bounded, owned, and reaped — by construction.**
   - *Bounded*: a lifetime limit built into the invocation — GNU
     `timeout <seconds> <cmd>` where available; on macOS (which ships no
     `timeout` — the founding incident's own platform) use the repo's
     documented substitute `perl -e 'alarm <seconds>; exec @ARGV' -- <cmd>`
     (see `codex-helper` SKILL §timeouts). Never an open-ended loop the
     spawner promises to remember.
   - *Owned*: the spawn is recorded (pid captured) at the moment it
     happens.
   - *Reaped with proof*: the spawning step ends with a process census —
     `ps` evidence of zero survivors — not an assumption. A reaping
     intention that lives only in prose does not count; the day's evidence
     is that prose discipline does not fire under context pressure.
3. **Proportionality if load is genuinely required**: bounded duration,
   `nice`d below interactive priority, never per-core saturation of the
   shared host, and announced (a comms event naming the load, its bound,
   and its purpose) so peers can attribute slowdowns correctly.
4. **Host health is a first-class signal — read it with platform-correct
   signals.** Check host saturation at session bootstrap and before/after any
   load-bearing experiment. A genuinely saturated host is a stop-and-surface
   signal — never background noise to work around. **But read the right signal
   for the platform**, or a healthy host reads as a starved one. On Linux,
   load-average-vs-core-count plus swap pressure is the reading. **On macOS that
   reading over-reads and false-positives**: macOS load-average counts
   I/O-blocked / uninterruptible threads, so it sits well above core count on a
   healthy machine, and a large `vm.swapusage` "used" figure is normal proactive
   paging of inactive pages, not memory exhaustion. The macOS-correct saturation
   signals are **CPU idle %** (`top -l1`, Activity Monitor) and the
   **memory-pressure colour** (green / yellow / red) — not load-avg-vs-cores or
   raw swap-used. Read the host with the workflow's instrument, never with a
   number carried in a note: a hold on "1-minute load under 12", taken from a
   handover note, cost ten minutes (2026-09-24), and a frame that held every
   remote write on "load 29.16" was caught by two Crickets reading this item
   (2026-09-24); a hold's sensor comes from the rule the hold cites, and the
   check runs inside the act, not before it. Owner-evidenced 2026-06-28: a session-long ~16–22/14 "load" +
   ~5 GB swap-used, read as host pressure by more than one agent, was shown
   healthy by Activity Monitor (CPU idle 67.7 %, memory-pressure green) — a
   Linux-shaped misread. The founding worked instance below was a *genuine*
   host-load DoS, so the rule's force is unchanged; what changes is that on
   macOS load-avg and swap-used alone do not establish saturation, and a related
   symptom — watcher drain-step deaths in a busy multi-agent window — is
   comms-volume cost, not host starvation.

5. **Heavy chains on a shared host: read before starting, two
   consecutive readings, diagnose kill-collateral.** When a seat starts a
   heavy gate chain beside peer chains on one host (item 6 sets how many
   may run at once):
   - The load read must COMPLETE before the chain starts or any message
     states the host's load — read-then-act, never act-then-read (a
     window-OPEN posted in the same turn as the `uptime` call read back
     26.5 on 8 cores and needed a retraction).
   - A single low reading rebounds under active peer chains: require TWO
     consecutive sub-threshold readings ~30 s apart before starting the
     chain (three worked instances across two seats, 2026-07-07 —
     oscillation at the bar is real).
   - Killing a shared-host chain kills OTHER chains' gate legs: a directed
     `pkill -f "turbo run"` also killed an innocent in-flight pre-commit's
     turbo gate, producing a phantom red on a one-line commit. Diagnose
     kill-collateral before treating any post-kill red as real.
   - Kill by the pids recorded at launch, never by command text: a
     process kill matched on the text of a sleep command matches every
     session on the machine (2026-09-23), and a peer's `tail` read as this
     seat's stray was a Codex process, found by tracing its parent before
     any kill (2026-09-24).

6. **Concurrent full local gates are bounded at two, ceiling three — by a
   mechanism, never a declaration.** Owner ruling (2026-09-07, verbatim):
   "the local machine can only support two, max three simultaneous full
   local gates because they are compute intensive. None of this is about
   ceremony or declarations, it is ALL about engineering." The commit
   queue exists to stop git operations colliding on one index, which
   separate worktrees do not need; the scarce resource its estate-wide
   FIFO was accidentally protecting is the host's capacity for concurrent
   full gates (four refusals and a sixteen-minute stall across three
   worktrees, 2026-09-06). The bound belongs at the gate's spawn path — a
   host-wide semaphore the full local gate acquires, limit 2, hard ceiling
   3, with a test — never a comms announcement, a claim role, or a
   declared window. That semaphore is built: `agent-tools gate-slot`
   holds a host slot around each hook's turbo step (in JC.net from
   2026-09-24, in OCE from 2026-09-29), so on a POSIX host a push's turbo
   step waits at the bound while the hook's other checks run outside the
   slot (a native Windows host has no process groups to signal and is
   refused), and
   `pnpm agent-tools:gate-slot status` is the reading, in place of
   counting processes. Owner ruling (2026-09-20, verbatim): "two parallel
   gate runs are fine as long as they are in different work trees". So
   seats on one host run their gates side by side, each in its own
   worktree, up to this item's bound; inside one worktree gate runs are
   sequential. The general move: when a coordination mechanism
   serialises the wrong resource, ask which resource is actually scarce
   and bound that.
7. **A gate refusal that names a path not in the diff, or a fork or
   `EAGAIN` line, is a host reading, not a content defect** (2026-09-29):
   stray ignored entries under a validated surface (a statusline's `.logs`
   directories under `.agent/rules/`) fail a portability check, and a
   process burst fails a spawn. Relocate the stray entries to the session
   scratchpad, never delete them, and read the process family
   (`ps -o pid,ppid,comm`) before any kill; a kill by name can take a
   peer's gate. List by pid and command name, never the full command
   line: `pgrep -fl` printed another tool's credentials (2026-09-28);
   read the arguments of the seat's own processes only.

## Worked Instance (founding)

2026-06-11: an agent investigating a timer-race flake spawned 14 per-core
`node -e "for(;;){…}"` busy-loops inline at 08:38Z and never reaped them.
Orphaned to launchd, they pegged every core for seven hours, drove ~26 GB
of swap, degraded every concurrent session, and corrupted the day's
diagnostics — watcher drain-timeout deaths were misattributed to
comms-directory scale until a host audit found the loops. The owner's
review doubts the load was necessary at all: the race class is provocable
in-process. Full analysis: the session operations report
(`graph-team-session-operations-and-experience-2026-06-10-11.md`, host-load
addendum).

## Enforcement

- The innate-immunity hook (`.agent/hooks/policy.json`) blocks the
  unambiguous busy-loop and load-tool shapes in commands (`for(;;)`,
  `while(1)`, fork bombs, `stress-ng`) with a reappraisal pointing here.
  The hook is a tripwire for the worst shapes, not the boundary of the
  rule: bounded-owned-reaped applies to every spawn.
- `start-right` bootstrap includes the host-health check; a hot host at
  session open is surfaced before work starts.
- Monitors and heartbeat loops under platform supervision (`Monitor`,
  cron) are compliant by construction when they sleep between ticks and
  die with the session — this rule does not forbid them; it forbids
  unbounded *load* and unsupervised orphans.

## Related Surfaces

- `never-ignore-signals` (`never-ignore-signals.md`) — a slow host is a
  signal; investigate, never work around.
- [`check-singleton-per-window`](check-singleton-per-window.md) — the
  sibling discipline for the repo's own heavy gate chains.
- The session operations report §7 — host-health tooling considerations.
