# Workstream Brief — Operational Awareness and Continuity

**Last refreshed**: 2026-04-21 (Session 4 post-close update — Phase 4
is STILL PENDING from 2026-04-20; refinements (a) and (b) appear to
have landed in the 2026-04-20/21 arc via separate channels, but (c)
expiry-check helper and (d) napkin-promotion helper remain open;
portability-posture decision and the six-surface doc propagation
of plan Task 4.3 remain open).
**Branch**: `feat/otel_sentry_enhancements` (shared with observability
lane; single-writer per track card convention applies).

**Session-4-surprise observation for the promotion watchlist**
(2026-04-21): the `workstream-brief-is-compact-state-of-resumption`
test item at the bottom of this brief was, in effect, **FAILED in
Session 4**. The `memory-feedback` thread's next-session record at
[`../threads/memory-feedback.next-session.md`](../threads/memory-feedback.next-session.md)
line 40 cites this brief explicitly as *"arguably covers [the
memory-feedback thread] loosely"*. The Session 4 agent (Samwise) read
that line at session open, absorbed the "(none yet — arguably covers
loosely)" framing, and proceeded for the rest of the session without
reading this brief. Owner surfaced the miss late in the session. The
brief itself was compact and correct — the failure was the
"loose-coverage" parenthetical discouraging the read, compounded by
no explicit instruction in the thread-resume ritual to follow
such linked-but-hedged references. Data point: current brief format
can be **linked but not read** when the linking prose hedges. See
also the pattern candidate `new-doctrine-lands-without-sweeping-
indexes` in the pending-graduations register (the same session
missed threads in the operational-memory README index and in
orientation.md — same class of silent discoverability failure).

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
  at `.agent/memory/operational/`, `.agent/memory/operational/tracks/` (commit `ffcad2aa`).
  Workflow doc updates landed in `session-handoff.md`, `GO` skill, and
  (historically) `session-continuation.prompt.md`. Initial pilot-phase
  framing was retired in Phase 4.1; the prompt itself was then
  dissolved later on 2026-04-20 (doctrine to PDR-026 + orientation
  directive; rituals to start-right-quick and session-handoff).
  Operational memory is the sole continuity host.
- **Phase 3** (self-hosted pilot): COMPLETE. Evidence at
  `.agent/analysis/operational-awareness-pilot-evidence.md`.
  Scenarios 1, 4, 5, 6 all PASS. Calibration decision: **PROMOTE**.
  Mid-pilot owner correction inverted the gitignore decision —
  tracks are git-tracked, not gitignored; `<workstream>--<agent>--<branch>.md`
  filename disambiguates multi-writer collaborative tracks.
  Scenarios 2 and 3 deferred to organic triggers (any multi-session
  branch life naturally exercises them).
- **Phase 4** (rollout + portability + doc propagation): PENDING —
  next-session starter. Folds in four pilot-evidence refinements:
  (a) rename repo-continuity "Primary workstream brief" →
  "Branch-primary workstream brief" + add "Current session focus";
  (b) clarify authority order as tiebreaker for same-scope conflict
  not gating-rule for different-scope claims; (c) decide on
  expiry-check helper (optional); (d) decide on napkin-promotion
  helper (optional).
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

Begin Phase 4. Start with doc propagation of the four pilot-evidence
refinements (a) and (b) — both are in-file edits to
`repo-continuity.md`, `.agent/memory/operational/README.md`, and the OAC plan's
Design Contract. Refinements (c) and (d) are optional and can be
recorded as future-work candidates rather than implemented in Phase
4. Close Phase 4 with portability-posture decision and doc
propagation across the six surfaces named in the plan's Task 4.3.

## Active track links

None. The 2026-04-20 session's tactical card was resolved (Phase 3
closed cleanly) and deleted at session close per the rotation rule.

## Promotion watchlist

- **`pilot-evidence-structure-as-decision-template`** — if the pilot
  evidence file format proves useful as a general
  "prove-this-decision-with-evidence" artefact, it is worth extracting
  as a template.
- **`workstream-brief-is-compact-state-of-resumption`** — first
  population of a real workstream brief (this file and the sibling
  observability brief). Observe whether the field set holds under
  actual resume pressure or needs adjustment.
