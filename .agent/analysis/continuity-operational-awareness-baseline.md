# Continuity and Operational Awareness Baseline

**Captured**: 2026-04-19
**Purpose**: Baseline for separating the repo's canonical continuity contract,
workstream resumption state, and thread-aware tactical awareness into distinct
surfaces.

**Related broader baseline**:
[agentic-mechanism-inventory-baseline.md](./agentic-mechanism-inventory-baseline.md)
captures the wider operating-model, signal, and control mechanisms surfaced by
the workbench topology note. This file stays focused on the continuity and
operational-awareness slice of that broader estate.

## Core Diagnosis

The current continuation prompt grew because it was useful, not because it was
careless.

In real use it accumulated three jobs:

| Job | Why it landed there | Why it now collides |
| --- | --- | --- |
| Canonical continuity contract | The prompt was the most visible repo-local session entry surface | Contract material now competes with lane detail and tactical noise |
| Workstream resumption brief | Resuming agents needed one place to recover short-horizon state quickly | Workstream detail expands faster than a compact contract should |
| Shared tactical state surface | Parallel tracks needed somewhere to record active branch, blockers, and handoff notes | Multiple writers and historical notes make hygiene and expiry hard |

The problem is therefore a **scope collision created by utility**. The repo
found a real missing operational layer, then used the continuation prompt to
host it.

## Current Surface Classification

| Surface | Primary job today | Horizon | Authority | Expiry expectation | Concurrency risk | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `.agent/prompts/session-continuation.prompt.md` | Continuity contract, workstream brief, tactical state | Current session to a few sessions | Mixed; contract is intended canonical, other state is incidental | Should stay short-lived, but currently accumulates | High | Single shared mutable surface; now carries historical blocks and parallel-track notes |
| Active plan(s) | Scope, sequencing, acceptance criteria, validation | Days to weeks | Canonical for execution scope | Archive on completion | Medium | Strong on execution truth, heavier than ideal for ordinary resume |
| `.agent/commands/session-handoff.md` | Lightweight closeout workflow | Session boundary | Canonical workflow, not canonical state | No persistent state | Medium | Refreshes continuity but has no dedicated tactical-awareness surface to target |
| `.agent/skills/go/shared/go.md` | Mid-session re-grounding workflow | In-session | Canonical workflow, not canonical state | No persistent state | Low | Depends on continuity and plans remaining legible |
| `.agent/memory/napkin.md` | Raw surprise and correction capture | Current rotation window | Canonical for raw capture | Rotates at threshold | Medium | Correct home for learning signals, not for day-to-day tactical coordination |
| `.agent/memory/distilled.md` | Refined cross-session learnings | Cross-session | Canonical for refined learnings | Extract on consolidation when stable | Low | Learning layer, not tactical state |
| `docs/governance/continuity-practice.md` + ADR-150 | Normative continuity doctrine | Permanent | Canonical doctrine | None | Low | Defines the three continuity types and split-loop model |
| `.agent/plans/agentic-engineering-enhancements/future/cross-vendor-session-sidecars.plan.md` | Future broad sidecar strategy | Strategic | Non-authoritative for current repo state | Promotion-trigger based | Low | Valuable adjacent concept, but intentionally broader than the repo-local need |

## Findings

### 1. The continuation prompt is doing three jobs at once

That shape was locally rational. It let the repo keep moving while the missing
operational-awareness layer remained unnamed.

The cost shows up now as:

- inflated prompt size
- mixed authority inside one surface
- difficulty keeping history, live state, and contract distinct
- shared-writer hygiene problems when multiple agents are active

### 2. Thread-aware hygiene is now a first-class requirement

The repo is no longer operating as a single-writer system. Parallel agent
tracks mean that any live mutable state surface must answer:

- who writes this surface
- who reads this surface
- when does it expire
- what gets promoted into the learning loop

The current continuation prompt does not provide that boundary cleanly.

### 3. The gap is operational awareness, not a replacement memory doctrine

The existing continuity split still holds:

- operational continuity
- epistemic continuity
- institutional continuity

What is missing is a short-horizon, thread-aware, multi-agent
**awareness plane**. It should sit between plans and learning
surfaces rather than replacing either.

### 4. The sidecars plan is adjacent, not the default answer

The future sidecars plan is intentionally broader:

- cross-vendor
- hook/wrapper/importer aware
- durable structured metadata
- canonical store design

That is useful, but it should not force this repo to jump straight to a local
database or a vendor-spanning state system before proving the narrower repo
need.

## Baseline Requirements Created by This Audit

1. Keep exactly one canonical continuity contract.
2. Reframe the continuation prompt as a behavioural entry surface rather than
   the main mutable state host.
3. Add one tracked workstream brief per active lane for short-horizon resume
   state.
4. Add one gitignored tactical track card per active agent or thread for
   thread-aware coordination.
5. Route promotable signals from tactical or workstream state into the existing
   learning loop: `capture -> distil -> graduate -> enforce`.

## Recommended Direction

Adopt a **markdown-first, repo-local** architecture:

- tracked canonical continuity surface
- tracked workstream brief surface
- gitignored tactical track-card surface

Treat that as a **portable candidate**, not as Practice Core doctrine yet. If
the repo-local pilot proves insufficient under real parallel-agent pressure,
promote the adjacent sidecars plan rather than stretching the markdown surfaces
into an accidental opaque memory system.
