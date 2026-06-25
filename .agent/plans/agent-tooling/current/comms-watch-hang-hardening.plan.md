---
name: "Comms-watch hang-but-run hardening"
overview: "Harden the canonical agent-tools `comms watch` CLI against the observed hang-but-run failure mode (2026-06-10): per-step deadlines so a hung step dies loud instead of silently muting the watcher; the existing watcher-heartbeat liveness surface promoted from opt-in to default-on so an external consumer can classify staleness; regression tests pinning the wait step's poll-bound invariant. Pickup-ready for any implementer; one small PR."
plan_id: comms-watch-hang-hardening
type: executable
status: current
thread: eef
date: 2026-06-10
related:
  - "../../../rules/comms-all-channels-watcher.md (carries the interim known-failure-mode caution this plan retires)"
  - "../../../state/collaboration/comms/ event 2026-06-10T14:29:30Z (Abyssal Swimming Mast failure-mode capture — the worked instance)"
todos:
  - id: c1-per-step-deadlines-fail-loud
    content: "c1 (one TDD cycle, one commit): per-step deadlines in the watch loop. Wrap the drain, emit, and markSeen awaits in `watchCommsLoop` (agent-tools/src/collaboration-state/comms-watch-loop.ts) with a configurable deadline (default generous, e.g. 60s; flag `--step-timeout-ms`). A step exceeding its deadline is a NEW WatcherErrorKind ('timeout' carrying the step name): emit the WATCHER ERROR line, then EXIT NON-ZERO (fail-loud — a timed-out step is always fatal; the supervising Monitor/cron then surfaces the death and can restart). Tests describe: a never-resolving emit (and separately drain, markSeen) causes loop termination with the timeout error surfaced within the deadline, using fake timers — no real waits in tests. The waitForChange step needs NO deadline: it is already poll-bounded by construction (setTimeout(pollMs) fallback alongside fs.watch, DEFAULT_POLL_MS=500 — verified in cli-runtime.ts waitForAnyDirectoryChange)."
    status: pending
  - id: c2-liveness-default-on
    content: "c2 (DONE — landed in 0a1e07d71, 2026-06-10): the watcher-heartbeat liveness surface is default-on. resolveHeartbeatFile (cli-comms-watch.ts) derives `<seen-file>.heartbeat.json` whenever `--no-heartbeat` is absent, so the canonical invocation writes a schema-valid heartbeat each interval; the staleness classifier (watcher-staleness.ts, 3× threshold, five-state result) consumes it. F-95 (fix-before-team-session-tooling) is its first production consumer (comms assert-watcher-live + the claims-open precondition) and synced the rule's §Enforcement to the present-truth gate. The cycle-boundary consumer staleness check (a hung process cannot self-report) remains the detection path c1's loud death does not cover."
    status: completed
  - id: c3-regression-pin-and-rule-retire
    content: "c3 (one TDD cycle, one commit): regression-pin the wait invariant + retire the interim rule caution. Test describes waitForAnyDirectoryChange's bound: with fs.watch never firing (dropped FSEvents subscription — the macOS suspect), the wait resolves within pollMs via the timer (fake timers; both the fires and never-fires paths). Then rewrite the rule's 'Known failure mode (observed 2026-06-10)' paragraph (.agent/rules/comms-all-channels-watcher.md) from interim-caution form to the hardened contract: per-step deadlines fail loud (c1), liveness on by default with the consumer staleness check (c2). Present-truth form, no remediation narrative (no-tombstones)."
    status: pending
    depends_on: [c1-per-step-deadlines-fail-loud, c2-liveness-default-on]
---

# Comms-watch hang-but-run hardening

## Problem and intent

**End goal**: an agent depending on the rule-prescribed all-channels watcher can never again go
blind to coordination for 16 minutes while every external surface reports the watcher healthy.

On 2026-06-10 at ~14:07Z, a live agent's `comms watch` process stalled silently: the process
stayed alive, the supervising Monitor reported "running", emissions stopped, and the seen-file
froze at 3,045 events while the comms dir grew to 3,070. The agent missed a PR-merged broadcast,
a Director status ping, and a GO directive; the stall was detected only by the Director's
heartbeat-only stall diagnostic plus an owner nudge. Full field capture: the failure-mode comms
event of 2026-06-10T14:29:30Z (Abyssal Swimming Mast, b14f60).

## Diagnosis (grounded in source, 2026-06-10)

Verified against the live implementation — an executor re-verifies at execution start:

1. **The loop catches step errors but has NO per-step deadline.**
   `watchCommsLoop` (`agent-tools/src/collaboration-state/comms-watch-loop.ts`) wraps drain /
   emit / markSeen in try/catch and emits `--- WATCHER ERROR ---` lines — but a step that
   **hangs** (a never-resolving await) is not an error: the loop awaits it forever. Prime
   suspects for the worked instance: `emit` writing into a blocked/undrained supervisor pipe, or
   a wedged FS call in `drain`. This is the structural gap; everything else is secondary.
2. **The wait step is NOT the hang site.** `waitForAnyDirectoryChange`
   (`cli-runtime.ts`) runs `setTimeout(pollMs)` (default 500 ms) ALONGSIDE `fs.watch`, so a
   dropped FSEvents subscription delays a wake by at most `pollMs`. The field capture's fs.watch
   hypothesis is therefore largely pre-cured here — c3 pins it with a regression test so it
   stays cured.
3. **A liveness surface already exists but is dead in practice.** The FM-2 cure (2026-05-23)
   added `--heartbeat-file` + `composeHeartbeatTick` + `watcher-staleness.ts` (3× interval
   threshold, five-state classification). It is opt-in, the rule's canonical invocation does not
   pass it, and nothing consumed it during the stall. A frozen tick is exactly what the
   staleness classifier exists to catch — it just was not armed.

## Mechanism

Three small cycles, one commit each, one PR total:

- **c1** converts hang-but-run into die-loud: per-step deadlines make a hung step a fatal,
  supervisor-visible death (restartable, alertable) instead of a silent mute.
- **c2** makes the existing liveness surface default-on so the residual cases (any future hang
  path without a deadline) are externally classifiable by the already-landed staleness detector.
- **c3** regression-pins the one invariant that prevented a worse version of this incident (the
  poll-bounded wait) and retires the rule's interim caution in favour of the hardened contract.

The frontmatter todos carry the full per-cycle content; they are the execution authority.

## Pickup brief (delegation-ready)

- **Owned surfaces**: `agent-tools/src/collaboration-state/{comms-watch-loop,cli-comms-watch,cli-runtime,watcher-staleness}.ts`,
  their colocated tests, and the one rule paragraph named in c3
  (`.agent/rules/comms-all-channels-watcher.md`).
- **Must not touch**: the comms event schema, the seen-file format (the heartbeat path derives
  FROM it, never changes it), the rule's §Fallback shape, any `.agent/state` or `.agent/memory`
  content (Director-owned), and any other team lane's surfaces.
- **Starting state**: cut a branch off `origin/main`; no dependency on any in-flight team PR.
- **Stop-or-escalate**: if the hang reproduces somewhere the deadline design cannot cover (e.g.
  inside Node's stdout write with no abort path), stop and surface the finding — do not widen
  scope into supervisor/harness changes.
- **Reintegration**: one small pure-diff PR; Director-serialised merge; reviewer dispatch per
  `invoke-code-experts` (code-expert gateway; test-expert on the fake-timer tests).

## Acceptance criteria

1. **No silent hang (c1)**: with a never-resolving drain, emit, or markSeen, the process
   terminates non-zero with a step-named timeout diagnostic within the deadline — proven at
   `unit` level by fake-timer tests (command: `pnpm --filter @oaknational/agent-tools test`).
2. **Liveness default-on (c2)**: the rule's canonical invocation (no extra flags) writes a
   schema-valid heartbeat at the derived default path each interval — proven at `unit` level;
   the rule names the consumer staleness check.
3. **Wait bound pinned (c3)**: the dropped-fs.watch path resolves within `pollMs` — proven at
   `unit` level with fake timers.
4. **Rule updated (c3)**: the interim known-failure-mode caution is replaced by the hardened
   contract, present-truth form — proven `non-code` (the paragraph reads as contract, not
   remediation history).
5. **Full gate chain green at every commit** (`pnpm check` aggregate; pre-commit/pre-push hooks).

## Risks

| Risk | Mitigation |
| --- | --- |
| Deadline false-positives on slow filesystems | Generous default (60s vs the 500 ms poll), flag-configurable; timeout is step-scoped, not loop-scoped |
| Emit deadline interacts badly with supervisor pipe semantics | c1 tests cover the blocked-emit path explicitly; stop-or-escalate rule fires if Node offers no abortable write |
| Default heartbeat file surprises existing invocations | Path derives from the seen-file (always agent-scoped); `--no-heartbeat` opt-out; explicit flag unchanged |
| Plan drift vs source between authoring and pickup | Diagnosis section is dated; executor re-verifies the three numbered facts at execution start |

## Non-goals

- No comms event schema or seen-file format changes.
- No supervisor/harness (Monitor, cron) changes — the cure is CLI-side loud death + classifiable
  liveness, which existing supervisors already surface.
- No replacement of the rule's §Fallback shape portable loop (it stays the no-CLI fallback).
- Not a general watcher framework: exactly the comms-watch path.

## Foundation alignment and plan-body first-principles check

`principles.md`: never-ignore-signals (the stall is a signal; the cure is structural, not a
restart habit); no-warning-toleration (hang-but-run is the warning made silent — fail loud).
`testing-strategy.md` / `tdd-as-design.md`: each cycle lands failing test + product code
atomically; tests describe loop-termination and liveness **states**, not implementation seams;
fake timers keep them deterministic. The `plan-body-first-principles-check` fires on: the shape
(three cycles sized to the verified gaps — the wait step needs no work, so none is planned); the
landing path (one small PR, gates green per commit); vendor-literal clauses (the fs.watch/timer
behaviour is asserted from read source, not vendor docs — re-verified at execution start).

## Learning Loop and lifecycle triggers

Per the [lifecycle-triggers component](../../templates/components/lifecycle-triggers.md): claim
the owned surfaces before the first edit; session-handoff at boundaries; on completion, run
`oak-consolidate-docs` — the napkin already carries the 2026-06-10 capture (hang-but-run mode +
Director-side detection tell); completion mines it forward and retires the interim rule caution
(c3 does the rule edit; consolidation confirms nothing else cites the stall as live).

## Routed evidence from the comms-corpus research (2026-06-13)

From the synthesis
([`.agent/reports/agentic-engineering/2026-06-13-ws6-comms-corpus-synthesis.md`](../../../reports/agentic-engineering/2026-06-13-ws6-comms-corpus-synthesis.md)
§5, §3.3).

- **S1/S2 — watcher stall + drain-death are FH-confirmed; the size→health link is
  NOT.** The dramatic swap→0 evidence that once implied "corpus size kills the
  watcher" was **retracted** (reboot-confounded, `kern.boottime`). The evidenced
  death mechanisms are load-starvation and an intermittent fs-contention blocking
  stall, not size. The proven cure path is this plan's interval-poll + fail-loud
  hardening — rotation (ADR-199) shrinks the dir as hygiene but is **not** a watcher
  cure; do not let either plan claim the other's job.
- **"The cure became the killer" (emergent caution).** The fail-loud hardening
  written to stop silent stalls began killing *healthy* watchers (exit-nonzero on
  transient conditions). Operational inversion from the corpus: keep budgets SHORT
  (fail fast + restart) because a long budget extends blindness without saving a
  wedged drain. Treat this as a design constraint on the hardening, not a budget
  raise.
