---
name: "Peer Heartbeat-Silence Alerting — detect a silently-retired peer (F-75)"
overview: >
  Add an optional, standard surface that fires when a tracked peer's heartbeat
  goes silent, so a silently-retired peer (heartbeat stops, no explicit close) is
  detected without a bespoke poll loop. Deferred from the AX umbrella plan: it is
  a new awareness affordance, not a validator or safety guard, and shares no seam
  with that plan's drain-fix / path-safety work.
status: future
type: developer-experience
related_frictions:
  - "F-75 (.agent/plans/agent-tooling/frictions-register.md)"
  - "F-44 (freshness must read the heartbeat stream to be correct)"
related_plans:
  - "../current/agent-experience-improvement.plan.md"
  - "../current/comms-watch-hang-hardening.plan.md"
related_doctrine:
  - ".agent/rules/liveness-heartbeat-cron.md"
  - ".agent/rules/ping-before-escalate.md"
last_updated: 2026-06-21
isProject: false
---

# Peer Heartbeat-Silence Alerting (F-75)

**Status**: 🔵 FUTURE — strategic brief, queued. Deferred from
[`agent-experience-improvement.plan.md`](../current/agent-experience-improvement.plan.md)
to keep that plan tight on the drain-fix and safety classes.

## Problem and intent

`comms watch` emits a line per *event*, never on *absence*. There is no standard
mechanism that fires when a peer's heartbeat goes silent, so detecting a
silently-retired peer (heartbeat stops, no explicit close) needs a manual re-check
or a bespoke poll loop — the exact gap that tempts an agent to fork
(`use-built-agent-tools-cli`). In a multi-agent window an undetected retirement
leads to a colliding claim or a stalled handoff.

## End goal · Mechanism · Means

- **End goal**: an agent in a multi-agent window is alerted when a tracked peer's
  most-recent heartbeat exceeds a staleness multiple of its interval, without
  hand-rolling a poll loop.
- **Mechanism**: a staleness-watch affordance over the heartbeat event stream — a
  `comms watch --alert-stale-peers` mode (or a `claims`/heartbeat-aware monitor)
  that emits when a tracked peer goes silent past a configurable multiple.
- **Means**: read the heartbeat stream the same way F-44's freshness fix must;
  surface absence as a typed alert line; reuse the watch loop's fail-loud +
  heartbeat parity from `comms-watch-hang-hardening`.

## Domain boundaries and non-goals

- **In**: the absence-alert affordance over the existing heartbeat stream.
- **Out**: the freshness-computation correctness fix itself (F-44 — that belongs
  with `claims list` freshness); the watcher hang/zombie hardening
  (`comms-watch-hang-hardening`).
- **Non-goal**: a new heartbeat substrate — this consumes the existing stream.

## Dependencies and sequencing

- **Blocking**: none for a minimal poll-based alert.
- **Beneficial**: F-44 (freshness reads the heartbeat stream) and the watcher
  hang-hardening landed, so the alert shares one correct liveness source of truth.
  Minimum shippable shape without them: a standalone staleness poll over the
  heartbeat events directory.

## Strategic acceptance criteria and success signals

- A tracked peer whose heartbeat stops past the configured staleness multiple
  produces exactly one alert (not a per-poll flood), with the peer's identity
  (name + session-id prefix) named.
- A peer that closes explicitly produces no stale-peer alert.
- The affordance is optional and degrades to a documented manual re-check on
  platforms without background services.

## Risks and unknowns

- **Identity keying**: a stale-peer alert must key on name + session-id prefix
  (PDR-027), not name alone, or a name collision mis-attributes silence.
- **Threshold tuning**: too tight floods on normal heartbeat jitter; too loose
  misses a real retirement. Default to a multiple of the peer's declared interval.

## Promotion trigger

Promote to `current/` on a second worked instance of a missed silent-retirement,
or owner direction, or when F-44 lands and makes the shared heartbeat-stream read
available to build on.
