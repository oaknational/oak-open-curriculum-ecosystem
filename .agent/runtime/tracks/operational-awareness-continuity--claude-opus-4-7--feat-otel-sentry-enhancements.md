# Track Card — OAC lane / claude-opus-4-7 / feat-otel-sentry-enhancements

## Agent or thread

Single main agent, Claude Opus 4.7, this session.

## Branch or worktree

`feat/otel_sentry_enhancements` (primary checkout; no parallel worktree
active).

## Claimed territory

- `.agent/state/*` (populating for first time this session)
- `.agent/runtime/tracks/*` (creating this card)
- `.agent/analysis/operational-awareness-pilot-evidence.md` (to be
  created)
- `.agent/plans/agentic-engineering-enhancements/active/operational-awareness-and-continuity-surface-separation.plan.md`
  (Phase 3 todo flip)

## Current task

Run OAC Phase 3 pilot scenarios 1, 6, 4, 5 on the new state surfaces
created in Phase 2. Document evidence. Reach promote / adjust / reject
decision.

## Blocker

None currently. Scenarios 2 and 3 (multi-agent parallelism) deferred to
organic triggers — not a blocker for this session's pilot closure.

## Handoff note

If this session terminates before Phase 3 closure: the pilot evidence
file at `.agent/analysis/operational-awareness-pilot-evidence.md` will
record which scenarios completed. Resume by reading that file, then
running remaining scenarios, then making the calibration decision.
State surfaces (`repo-continuity.md` + workstream briefs) are already
populated and compose correctly — use them to resume, don't re-read
session-continuation.prompt.md for state recovery (that's part of
the scenario-1 validation).

## expires_at

`2026-04-21T00:00:00Z` — one working-day window. When OAC Phase 3
closes (this session or next), this card rotates: resolve (Phase 3
closed cleanly; delete), promote (new durable observation moves to
workstream brief or napkin), or delete (card outlived usefulness).
The card is git-tracked, so the rotation itself is a commit any
collaborator can follow.

## promotion_needed

Watch-list — pending scenario completion:

- Pilot-evidence artefact format may graduate to a template if it
  proves reusable for other decision-with-evidence moments.
- Whether the two-workstream-brief structure held up during this
  session's work (primary = observability; this lane = active) — a
  signal of whether the compact contract composes with multi-lane
  briefs or needs adjustment.
