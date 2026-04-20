# Repo Continuity

**Last refreshed**: 2026-04-20 (OAC Phase 4 substantially complete —
4.1 + 4.2 + 4.3 landed this session; reviewer findings applied)
**Status**: Authoritative for the fields below. The `Live continuity
contract` section of `.agent/prompts/session-continuation.prompt.md` is
retired. The prompt is now a behavioural entry surface only; state
lives in this file, `workstreams/<slug>.md`, and `../runtime/tracks/*.md`.

## Active workstreams

- [`observability-sentry-otel`](workstreams/observability-sentry-otel.md)
  — branch-primary on `feat/otel_sentry_enhancements`.
- [`operational-awareness-continuity`](workstreams/operational-awareness-continuity.md)
  — parallel lane. Phase 4 rollout in progress this session.

## Branch-primary workstream brief

[`workstreams/observability-sentry-otel.md`](workstreams/observability-sentry-otel.md).

Current substantive work inside that lane is the
`sentry-esbuild-plugin-migration` plan (task #22, drafted 2026-04-20
at commit `4cbc8843`, pending plan-time reviewer dispatch before
execution).

## Current session focus

[`workstreams/operational-awareness-continuity.md`](workstreams/operational-awareness-continuity.md)
— completing OAC Phase 4 (rollout + portability decision + doc
propagation) so the continuation-prompt retirement lands cleanly.

**Note on sequencing**: OAC Phase 4 is not a technical blocker for the
sentry-esbuild-plugin migration WS0 reviewers. The plugin-migration
plan's stated dependency is OAC Phase 2 scaffolding (already landed
at commit `ffcad2aa`). Phase 4 is being finished first as an
in-flight-drift-reduction choice, not because it gates downstream
work. Owner-set order: OAC Phase 4 close → plugin migration WS0/WS1
→ Sentry integration value.

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

## Next safe step

**Resolve plan-density-invariant tension on the plugin-migration
plan** (`.agent/plans/observability/current/sentry-esbuild-plugin-migration.plan.md`)
— decide fold into maximisation §L-8 vs retain standalone with
pair-archive — then dispatch plugin-migration WS0 reviewers
(`assumptions-reviewer` + `sentry-reviewer`) PRE-ExitPlanMode per the
`4bccba71` guardrails. OAC Phase 4 is substantially complete this
session; only PDR-011 alignment + deep-consolidation pass remain as
housekeeping behind the next Phase-4 closeout commit.

## Deep consolidation status

**Due — partially discharged by OAC Phase 4.3 doc propagation this
session; full pass still pending.** Fitness-pressure signal from the
1628-line continuation prompt is now discharged (prompt is ~145 lines
behavioural-only). Remaining triggers: governance change (guardrails
installed `4bccba71` need PDR graduation assessment), repeated surprise
pattern (L-7 sunk-cost + the tracks-gitignored and menu-ification
corrections from 2026-04-20 evening), and PDR-011 alignment flagged by
`assumptions-reviewer` during this session's Phase 4.3 closeout. A
deliberate consolidation pass should land before the plugin-migration
WS0 gate opens, or be explicitly scheduled after.
