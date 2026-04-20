# Repo Continuity

**Last refreshed**: 2026-04-20 (final session — metacognitive report
revision deepening the progress-and-direction report; OAC and
observability lanes unchanged from earlier closeout)
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

Current substantive work inside that lane is the §L-8 esbuild-native
migration: replace the ~900-line L-7 bespoke Sentry release/commits/
deploy orchestrator by switching the MCP app's build tool from tsup
to raw esbuild and registering `@sentry/esbuild-plugin` directly. The
2026-04-20 drafted `sentry-esbuild-plugin-migration` plan (commit
`4cbc8843`) carried a tsup-retention frame that is known-broken at
runtime (see napkin entry 2026-04-20 evening — the combination of
`@sentry/esbuild-plugin` with `tsup` fails via open
`sentry-javascript-bundler-plugins` issues 608 + 614 plus tsup issue
1260). The standalone plan was deleted and an attempted
fold under the wrong frame has been reverted. A fresh plan must be
authored from the esbuild decision as the standing starting point.

## Current session focus

Documentation report revision — not a registered workstream.
This session deepened the progress-and-direction report
([`.agent/reports/oak-ecosystem-progress-and-direction-2026-04-20.md`](../reports/oak-ecosystem-progress-and-direction-2026-04-20.md))
via a metacognitive examination of the repo, surfacing novel
mechanisms and underconveyed depth across all four achievement
arenas. Quantitative search-quality claims (MRR figures) were
replaced with qualitative descriptions per owner direction that the
ground-truth and evaluation systems are still being refined.

No workstream lanes were advanced this session.

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
- **Owner's word beats plan. Always.** When a plan's non-goals,
  design decisions, scope, or any other drafted framing contradicts
  a statement by the owner (in conversation or recorded memory), the
  owner wins without argument. Non-goals are especially suspect —
  they are where prior agent sessions' sunk-cost reasoning most
  often hides. Any session executing against a plan with non-goals
  MUST re-read them against recent owner direction and surface
  contradictions before acting. (Installed 2026-04-20 after a
  three-day drift where multiple agent sessions resisted the owner's
  standing decision to switch from tsup to esbuild because the
  drafted plan's non-goals ruled it out. See napkin entry of the
  same date for the full mechanism analysis and perturbation-
  mechanism candidates.)

Non-goals for next session:

- Do NOT amend ADR-163 §6 prose yet; that is the §L-8 migration's
  WS3 task.
- Do NOT delete bespoke orchestrator code yet; the §L-8 migration's
  WS2 task handles deletion.
- Do NOT start §L-8 execution before the clean re-plan (authored
  this session) has passed plan-time reviewers.
- Do NOT re-open the tsup-vs-esbuild decision. The decision is
  esbuild. Any plan non-goal that contradicts this is wrong per the
  owner-beats-plan invariant above.

## Next safe step

**Begin §L-8 execution at WS1 RED** once this session's clean re-plan
has landed and plan-time reviewers have approved it. The re-plan is
authored this session under the esbuild-native decision; no
implementation work happens this session.

## Deep consolidation status

**Due — partially discharged; full pass still pending.**
Discharges so far: Fitness-pressure from the 1628-line continuation
prompt (retired to ~145 lines behavioural-only via OAC Phase 4.1);
documentation drift on the `docs/foundation/` boundary (timeless-only
structure landed; ~17 active surfaces redirected); PDR-011 alignment
(amended in OAC Phase 4.3 commit `d876506c`).

Outstanding triggers:

- Governance change — guardrails installed `4bccba71` need PDR
  graduation assessment.
- Repeated surprise pattern — the three-day tsup-vs-esbuild drift has
  graduated the owner-beats-plan invariant into repo-continuity; still
  to do is a PDR/rule drafting pass for the **perturbation mechanism**
  candidates named in the 2026-04-20 evening napkin entry (non-goal
  re-ratification ritual, standing-decision register, first-principles
  metacognition prompt). Picking one and landing it is the single
  highest-value governance output of the next consolidation pass.
- Sunk-cost detector second-instance and the tracks-gitignored /
  menu-ification corrections from the earlier napkin.

Per `session-handoff` boundary discipline, this session does not
escalate into `jc-consolidate-docs`; the deeper loop is well-scoped
to a dedicated governance session.
