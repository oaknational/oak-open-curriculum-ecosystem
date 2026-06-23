---
tier: reference
---

# Comms Heartbeat-Cadence Aggregate (WS7 rotation survivor)

Durable repo-tier aggregate of the **heartbeat** event class in the
`.agent/state/collaboration/comms/` corpus. It exists so that heartbeat events —
the highest-volume, lowest-per-event-value class — can be archive-moved and
deleted past their retention tier **without losing their aggregate research
signal**.

## Why this file exists (the absorption gate)

ADR-199 §6 assigns heartbeats the shortest retention tier (**48h**) and requires
the **cadence aggregate to be extracted ONCE, before any heartbeat archive-move**.
PDR-094 Inv-1 (no unprocessed signal is deleted; absorption precedes removal)
is therefore satisfied for the heartbeat class **by the existence of this
artefact**. Once this file is committed, the archive-move harness may move
heartbeat events older than the 48h tier into `comms-archive/` (and out of
existence) without violating Inv-1.

It does **not** replace the `comms-provenance-check` fail-closed gate (Inv-3):
any heartbeat event cited by id in a permanent doc is independently protected
by that gate regardless of this aggregate.

## Source and provenance

- Primary source: the WS2 corpus survey
  [`2026-06-12-ws2-corpus-survey.md`](../reports/agentic-engineering/2026-06-12-ws2-corpus-survey.md),
  §"Liveness substrate statistics", §"Convention-emergence timeline", and the
  cross-section figures (first-hand verified during WS2).
- Volume figures refreshed first-hand 2026-06-14 by `jq` over the live corpus
  (a `grep`-based recount was attempted first, produced a line-spanning
  artefact, and was discarded — pretty-printed `tags` arrays cannot be counted
  by single-line `grep`).
- Corpus window: 2026-05-20 → 2026-06-14.

## Volume and share

| Figure | 2026-06-12 (WS2 survey) | 2026-06-14 (first-hand `jq` refresh) |
| --- | ---: | ---: |
| Heartbeat-tagged events (`tags` ∋ `heartbeat`) | 2,245 | 2,502 |
| Heartbeat-titled events (`Heartbeat:` prefix) | 2,324 | 2,577 |
| `Heartbeat-end:` events | 93 | 98 |
| Total corpus events | ~5,014 | 5,343 |

- **Tagged share at refresh ≈ 47%** of all events (2,502 / 5,343).
- **Share trajectory over the corpus life**: 0% (pre-2026-05-24, before the
  PDR-078 contract existed) → ~34–58% (2026-05-24 → 27) → **70–74%** in the
  2026-06-10/11 arc. The liveness substrate increasingly dominates the stream —
  the motivating evidence for theme 13 (corpus growth degrades the watcher) and
  for the shortest retention tier.
- **Median heartbeat body length: 149 chars** (vs narrative 1,679, directed
  1,719) — heartbeats are deliberately low substrate-weight.

## Per-agent cadence (WS2-derived, first-hand verified during WS2)

- **Median heartbeat cadence clusters tightly at 4.0 min**, matching the PDR-078
  contract. Exemplars: Twilit Scattering Twilight 4.01 min, Breezy Anchoring
  Rudder 4.00 min, Sylvan Sprouting Petal 4.02 min.
- **Cadence anomalies** (deep-dive candidates, not yet diagnosed — kept here so
  deletion of the raw events loses no lead):
  - Over-emitting: Pelagic Cresting Pier **1.19 min**, Estuarine Fathoming Sail
    **1.76 min** (~2–3× the contract rate).
  - Under-emitting: Mistbound Hiding Threshold **8.35 min** (~2× slower).
  - Hypothesis space (WS3/WS4 input, not asserted): mis-armed loops vs
    deliberate cadence choices.

## Convention emergence (title-genre first-seen)

| First seen (UTC) | Convention |
| --- | --- |
| 2026-05-23T15:57 | `Heartbeat:` title prefix |
| 2026-05-23T16:20 | `Heartbeat-end:` |
| 2026-05-24T10:18 | first heartbeat-**tagged** event |

- **Convention preceded substrate by ~18h**: the prose `Heartbeat:` title ran
  before the ADR-183 `tags` namespace carried it. ADR-186 names
  `lifecycle + event_type='heartbeat'` as the forward canonical shape; both
  shapes are valid in the migration window — which is why the **tagged** (2,502)
  and **titled** (2,577) populations differ.
- Title-genre dialect: one agent (Ferny Spreading Blossom, 25 events) used their
  own name as the title prefix.

## What this artefact licenses — and what it does NOT preserve

- **Licenses**: heartbeat-class events older than the ADR-199 §6 48h tier may be
  archive-moved/deleted; their aggregate cadence, volume, share, and convention
  signal is conserved above (Inv-1 satisfied for the class).
- **Does NOT preserve**: the per-event **raw cadence series** (per-agent
  inter-event deltas). If a future deep-dive needs the raw series — e.g. to
  diagnose the cadence anomalies above — recompute from the live corpus
  **before** the archive-move, or from `comms-archive/` after. The named anomaly
  agent-tuples are the pointers for that recompute.
