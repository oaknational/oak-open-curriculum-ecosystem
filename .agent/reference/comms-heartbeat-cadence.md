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

- Primary source: the WS2 corpus survey (an OCE report of 2026-06-12, in that
  estate's `.agent/reports/agentic-engineering/`),
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

## Window 2026-08-14 → 2026-09-25 (first-hand recount, 2026-09-25)

Recounted at the 2026-09-25 dedicated consolidation over the live corpus before the
heartbeat archive move of that pass (`jq` over `tags`, per-seat inter-event deltas in
Python; the raw series was not kept).

| Figure | 2026-09-25 |
| --- | ---: |
| Events in the stream and the archive together (2026-08-14T06:38:22Z → 2026-09-25T11:17:35Z) | 4,844 |
| Heartbeat-tagged events | 3,559 |
| Non-heartbeat events | 1,285 |
| Seats emitting tagged heartbeats | 25 |

- One window and one population: the four figures above come from one count over the
  stream and the archive together, heartbeat meaning the tag, recomputed 2026-09-25 16:1xZ
  after a fold review found the earlier row's parts not summing to its total. The earlier
  row counted the live stream alone at 11:25Z, a snapshot the harness's 48-hour heartbeat
  archiving and the day's sweep have since moved, so it cannot be re-taken; the consolidation
  pass's 1,266 non-heartbeat corpus was that live selection at 11:17Z. The share is higher than
  the live-only reading because archived heartbeats are in the population.
- **Tagged share ≈ 73 %** of the stream and the archive together (3,559 / 4,844), up from 47 % at the
  2026-06-14 refresh: the multi-seat days of 2026-09-06 to 10 and 2026-09-24 each ran
  four to eight seats at once.
- **Median inter-event delta 241 to 244 s for thirteen of the fifteen seats** (the PDR-078
  4-minute contract), with p90 at 242 to 253 s. Two seats differ: Luna stirs Radiance
  (01a0d3, a Codex seat) at a median of 404 s and p90 of 558 s over 86 events; Sandpiper
  weaves Updraft (a96287) at 212 s over five events.
- **Each seat's largest gap is a single interval**, from 4 minutes (Blazar lifts Corona,
  Zephyr guards Leeward, Cricket weaves Burrow) to 42.6 hours (Altair spins Umbra); the
  seats' own records name pauses and compactions in those spans, which this recount did
  not verify gap by gap.
- Longest-running seats by span: Altair spins Umbra 62.5 h (282 events), Juno seeks
  Apogee and Flounder turns Estuary 38.6 h (300 and 227), Finch binds Sundog 22.8 h (264),
  Swallow holds Drift 21.7 h (71, across two rests), Marten mends Shadow 20.9 h (319).

## What this artefact licenses — and what it does NOT preserve

- **Licenses**: heartbeat-class events older than the ADR-199 §6 48h tier may be
  archive-moved/deleted; their aggregate cadence, volume, share, and convention
  signal is conserved above (Inv-1 satisfied for the class).
- **Does NOT preserve**: the per-event **raw cadence series** (per-agent
  inter-event deltas). If a future deep-dive needs the raw series — e.g. to
  diagnose the cadence anomalies above — recompute from the live corpus
  **before** the archive-move, or from `comms-archive/` after. The named anomaly
  agent-tuples are the pointers for that recompute.
