# Workstream Brief — Operational Awareness and Continuity

**Last refreshed**: 2026-04-20 (OAC Phase 3 pilot — first population)
**Branch**: `feat/otel_sentry_enhancements` (shared with observability
lane; single-writer per track card convention applies).

## Owning plan(s)

- [`operational-awareness-and-continuity-surface-separation.plan.md`](../../plans/agentic-engineering-enhancements/active/operational-awareness-and-continuity-surface-separation.plan.md)
  — lane-level execution authority (ACTIVE, promoted 2026-04-20).

## Current objective

Complete OAC Phase 3 pilot scenarios 1, 6, 4, 5 (scenarios 2 and 3
require organic multi-agent parallelism and are deferred). Close
Phase 3 with explicit promote / adjust / reject decision. Then Phase
4 rollout + portability decision + doc propagation.

## Current state

- **Phase 0** (baseline): COMPLETE. Baseline at
  `.agent/analysis/continuity-operational-awareness-baseline.md`
  with 2026-04-20 addendum covering bespoke-to-plugin pivot context,
  guardrail installation (commit `4bccba71`), and
  deep-consolidation-due status.
- **Phase 1** (state-surface contract): COMPLETE. Design Contract
  in-plan plus
  `.agent/reference/agentic-engineering/deep-dives/operational-awareness-and-state-surfaces.md`
  cover three-surface model, authority order, mandatory field
  contracts, loop model.
- **Phase 2** (workflow integration): COMPLETE. Scaffolding created
  at `.agent/state/`, `.agent/runtime/tracks/` (commit `ffcad2aa`).
  Workflow doc updates landed in `session-handoff.md`, `GO` skill,
  `session-continuation.prompt.md` with pilot-phase framing.
- **Phase 3** (self-hosted pilot): IN PROGRESS. Pilot evidence at
  `.agent/analysis/operational-awareness-pilot-evidence.md` (to be
  populated this session).
- **Phase 4** (rollout + portability + doc propagation): PENDING
  Phase 3 decision.
- **`pnpm check`** exit 0 at session close.

## Blockers / low-confidence areas

- **Scenarios 2 and 3 require multi-agent parallelism**. Neither is
  runnable from a single session. Both are deferred to organic
  triggers — the next session that spawns a parallel agent or
  worktree naturally exercises the surfaces.
- **Phase 3 decision rigor**: the promote / adjust / reject decision
  must cite pilot evidence per scenario, not preference. Evidence
  artefact format matters.

## Next safe step

Run scenarios 1, 6, 4, 5 on the new surfaces in this session.
Document each in the pilot evidence file. Then flip Phase 3 todo and
make the calibration decision.

## Active track links

- [`tracks/operational-awareness-continuity--claude-opus-4-7--feat-otel-sentry-enhancements.md`](../../runtime/tracks/operational-awareness-continuity--claude-opus-4-7--feat-otel-sentry-enhancements.md)
  — current session's tactical card (gitignored).

## Promotion watchlist

- **`pilot-evidence-structure-as-decision-template`** — if the pilot
  evidence file format proves useful as a general
  "prove-this-decision-with-evidence" artefact, it is worth extracting
  as a template.
- **`workstream-brief-is-compact-state-of-resumption`** — first
  population of a real workstream brief (this file and the sibling
  observability brief). Observe whether the field set holds under
  actual resume pressure or needs adjustment.
