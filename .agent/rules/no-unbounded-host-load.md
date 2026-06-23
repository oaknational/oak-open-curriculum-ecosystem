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
   fake timers, deterministic interleaving, injected delays. For timer
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
4. **Host health is a first-class signal.** Check load average against
   core count (and swap pressure) at session bootstrap and before/after
   any load-bearing experiment. A saturated host is a stop-and-surface
   signal — never background noise to work around.

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

- [`never-ignore-signals`](never-ignore-signals.md) — a slow host is a
  signal; investigate, never work around.
- [`check-singleton-per-window`](check-singleton-per-window.md) — the
  sibling discipline for the repo's own heavy gate chains.
- The session operations report §7 — host-health tooling considerations.
