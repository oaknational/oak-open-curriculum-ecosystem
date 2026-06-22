# Watcher-Liveness Self-Heal (resilient monitor hold)

**Status**: Pending idea — awaiting grounding + critical assessment + go/no-go. Do NOT build yet.
**Raised**: 2026-06-14, Clipper wakes Atoll (`de1f79`), from a live "resilient hold" improvised while
waiting on a peer's push across an overnight idle gap (owner flagged: monitors crash over long periods).

## Concept

A small enhancement so an agent holding or waiting across idle gaps never goes *silently* blind when an
awareness monitor dies. Two parts:

1. A one-shot `watch:verify`-style operation: given an agent's expected watch surfaces, check each
   liveness file's staleness, report, and on staleness restart the watcher + run its gap-sweep —
   mechanising the manual cycle-boundary discipline into something runnable.
2. Auto-restart-on-death for the platform Monitor itself: the hardened watcher already fails loud
   (exits non-zero), but on Claude Code a dead Monitor task is not auto-restarted, so it stays dead
   (e.g. overnight) and the agent loses incoming awareness with no signal.

## What already exists (check before building)

The canonical comms-watch CLI is already hardened (`.agent/rules/comms-all-channels-watcher.md`):
per-step deadlines, fail-loud non-zero exit, a liveness heartbeat-file (`<seen-file>.heartbeat.json`),
a staleness classifier, and gap-sweep-on-restart. So this is an ENHANCEMENT that composes existing
pieces (verify-and-heal op + owning the restart), not a greenfield tool. Most of the primitive exists.

## The gap

- The restart step is assumed ("a supervisor can restart it") but unowned on Claude Code — a crashed
  Monitor task stays dead.
- The verify-and-heal step is a manual discipline ("stat the heartbeat file"), not a runnable one-shot.

## Substance caveat (do not over-reach)

Do NOT harden the ArcAngel / rapid-comms tail. The ARC protocol explicitly forbids building mechanism
ahead of named triggers — its zero-ceremony property is load-bearing and its durability cure is
conserve-at-close, not a daemon (`.agent/reference/arc-rapid-communication.md`). This idea targets the
canonical watcher's supervision only.

## Evidence base (this is not a hunch)

The comms-corpus research thread (`agent-collaboration-research`) catalogues this failure class
first-hand: theme 2 (marshal-watcher silent-failure), theme 13 (eight watcher deaths in one session
window), theme 17 (liveness-substrate drift).

## Placement (route here, not greenfield)

- `comms-watch-liveness-floor.plan.md`
- `claim-liveness-crash-reconciliation-and-session-forensics.plan.md`
- the new `session-and-team-state-statusline-icons.plan.md` (watcher-liveness as a register dimension)

## Next step — the go/no-go gate (spend time critically)

1. **Ground**: read the comms-watch CLI liveness code first-hand; confirm the exact restart gap on
   Claude Code (does a dead Monitor task really stay dead?).
2. **Critically assess**: is the existing manual cycle-boundary discipline + staleness classifier
   already enough? Does the documented failure frequency justify the build AND its standing host cost
   (`no-unbounded-host-load`)? A self-healing supervisor is itself a process that can leak/crash.
3. **Go/no-go on deeper planning.** Build ONLY if the value clears the cost. Default = no-build until
   the value is demonstrated.

## References

- `.agent/rules/comms-all-channels-watcher.md` (existing hardened watcher)
- `.agent/reference/arc-rapid-communication.md` (ARC zero-ceremony constraint)
- `.agent/memory/operational/threads/agent-collaboration-research.next-session.md` (themes 2 / 13 / 17)
