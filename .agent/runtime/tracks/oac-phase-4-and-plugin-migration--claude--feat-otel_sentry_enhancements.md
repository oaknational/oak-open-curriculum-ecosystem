# Track: Sanitise tsup-framed planning + re-plan §L-8 esbuild-native

**Agent**: Claude (this session, opus-4-7)
**Branch**: `feat/otel_sentry_enhancements`
**Created**: 2026-04-20
**Expires_at**: 2026-04-21

## Claimed territory

- `.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
  — §L-8 re-plan (or re-fold) from the esbuild-native decision.
- `.agent/plans/observability/current/` — plan-density invariant
  resolution (re-fold into §L-8 vs standalone + pair-archive).
- `.agent/state/repo-continuity.md` — keep sanitised; do not
  reintroduce tsup-framing.
- `.agent/runtime/tracks/` — this card; resolved at session close.

## Current task

COMPLETE. §L-8 esbuild-native migration re-plan authored and folded
into `active/sentry-observability-maximisation-mcp.plan.md`.
Plan-time `assumptions-reviewer` dispatched against the draft,
returned ACCEPT WITH NOTES, all four Important findings + three
nits applied to the plan body (attestation completeness, 2.x-vs-5.x
currency, search-CLI dormant `@sentry/cli` cleanup via new WS2.4,
ADR-first-ordering foreclosure, WS1.2 invariant additions,
hidden-source-map divergence note, WS0 re-labelled as process
block).

## Blocker

None. The tsup-retention non-goal from the prior standalone draft was
the mechanical block; it has been removed from `repo-continuity.md`
non-goals and overridden by the owner-beats-plan invariant now in the
authoritative invariants list.

## Handoff note

Prior session work landed cleanly: OAC Phase 4 closed at `d876506c`.
A follow-up fold of the standalone `sentry-esbuild-plugin-migration`
plan into §L-8 proceeded under the wrong frame (tsup-retention),
contradicting the owner's three-day-old standing esbuild decision.
The plugin + tsup path is independently known-broken at runtime
(`sentry-javascript-bundler-plugins` issues 608 + 614 and tsup
issue 1260). §L-8 fold has been reverted via `git checkout HEAD`;
standalone file stays deleted; `repo-continuity.md` sanitised. A
clean re-plan is the next output and the owner-beats-plan invariant
is now authoritative.

## Promotion needed

- **Perturbation-mechanism PDR candidate** (already flagged in the
  2026-04-20 evening napkin entry): pick one of non-goal-
  re-ratification, standing-decision register, or first-principles
  metacognition prompt, and draft as a Practice Core PDR at the next
  consolidation pass. This is the governance output that prevents the
  three-day drift from recurring.
