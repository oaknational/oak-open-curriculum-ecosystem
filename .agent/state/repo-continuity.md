# Repo Continuity

**Last refreshed**: 2026-04-20 (session close, OAC Phase 3 closed)
**Status**: Authoritative for the fields below. The prompt's `Live
continuity contract` section is legacy as of OAC Phase 3 PROMOTE
decision; Phase 4 formally retires that prompt section. In the
interim, if the prompt and this file conflict, **this file wins**.

## Active workstreams

- [`observability-sentry-otel`](workstreams/observability-sentry-otel.md)
  — primary on branch `feat/otel_sentry_enhancements`.
- [`operational-awareness-continuity`](workstreams/operational-awareness-continuity.md)
  — parallel lane. Executing in this session; Phase 3 pilot active.

## Primary workstream brief

[`workstreams/observability-sentry-otel.md`](workstreams/observability-sentry-otel.md).

Current substantive work inside that lane is the
`sentry-esbuild-plugin-migration` plan (task #22, drafted 2026-04-20
at commit `4cbc8843`, pending plan-time reviewer dispatch before
execution).

> **Known refinement deferred to OAC Phase 4**: this field's name
> will be renamed to "Branch-primary workstream brief" and a separate
> "Current session focus" field added, per pilot evidence scenario 1.

## Repo-wide invariants / non-goals

Invariants in force for any session regardless of workstream (the
set is additive; previous invariants still apply):

- **Cardinal rule**: `pnpm sdk-codegen && pnpm build` brings all
  workspaces into alignment with an upstream OpenAPI schema change.
- **No compatibility layers, no backwards compatibility** — replace,
  don't bridge. See `.agent/directives/principles.md`.
- **TDD at all levels** — tests first, fail-green-refactor.
- **Strict boundary validation** only — product code does not read
  `process.env`; boundary validation is schema-driven.
- **Tests never touch global state** — no `process.env` read/write
  in any test type; pass explicit literal inputs via DI.
- **Clerk is canonical user-ID provider through public alpha.**
- **`--no-verify` requires fresh per-commit owner authorisation** —
  no carry-forward.
- **Build-vs-buy attestation required pre-ExitPlanMode** for any
  vendor-integration plan (installed 2026-04-20, commit `4bccba71`).
  Sunk-cost reasoning is not a valid "why bespoke" answer.
- **Friction-ratchet counter** — 3+ independent friction signals
  against the same shape escalates to `assumptions-reviewer` for
  solution-class review, not another tactical fix (installed
  `4bccba71`).
- **ADRs state WHAT, not HOW** — argv shapes, per-step postures, and
  file paths belong in the realising plan, not the ADR (installed
  `4bccba71`).
- **Reviewer phases aligned** — plan-time (solution-class) →
  mid-cycle (solution-execution) → close (coherence). Close-only
  scheduling is the anti-pattern (installed `4bccba71`).
- **Runtime tactical track cards are git-tracked** — not gitignored.
  Multi-agent + multi-location collaboration flows through git.
  Single-writer-per-card; multiple cards per collaborative track
  disambiguate via `<workstream>--<agent>--<branch>.md` filename.
  (Corrected 2026-04-20; initial Phase 2 design treated cards as
  gitignored session-local state.)

Non-goals for next session:

- Do NOT amend ADR-163 §6 prose yet; that is the sentry-esbuild-plugin
  migration plan's WS3 task.
- Do NOT delete bespoke orchestrator code yet; the migration plan's
  WS2 task handles deletion.
- Do NOT start plugin-migration WS1 before WS0 (plan-time
  `assumptions-reviewer` + `sentry-reviewer` dispatch) completes.
- Do NOT start Phase 4 rollout before deciding the plan-density-
  invariant resolution for the plugin-migration plan (fold vs
  pair-archive).

## Next safe step

Pick one of two next-session openers, owner's call:

1. **Resolve plan-density-invariant tension on the plugin-migration
   plan** (fold into maximisation §L-8 vs retain standalone with
   pair-archive), then dispatch plugin-migration WS0 reviewers
   (`assumptions-reviewer` + `sentry-reviewer`) PRE-ExitPlanMode per
   the `4bccba71` guardrails.
2. **Begin OAC Phase 4** (rollout + portability decision + doc
   propagation) with the four pilot-evidence refinements folded in.

Option 1 unblocks real code motion (plugin migration execution);
Option 2 completes the OAC lane and lifts the pilot-phase framing
from workflow docs.

## Deep consolidation status

**Due — deferred to OAC Phase 4 Task 4.3 as natural carrier; not
well-bounded for this closeout.** Triggers firing: governance change
(guardrails installed `4bccba71` need PDR graduation assessment),
repeated surprise pattern (L-7 sunk-cost reinforced by the tracks-
gitignored and menu-ification corrections logged in the 2026-04-20
evening napkin entry), fitness pressure (branch at 20+ commits this
session window; session-continuation prompt at 1545+ lines).
Consolidation pass lands in OAC Phase 4 Task 4.3 alongside doc
propagation.
