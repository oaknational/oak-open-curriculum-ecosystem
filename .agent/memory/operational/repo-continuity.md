# Repo Continuity

**Last refreshed**: 2026-04-20 (memory-taxonomy restructure + prompt
dissolution landed; operational memory is now the sole state host)
**Status**: Authoritative for the fields below. The continuation
prompt has been dissolved; its doctrine moved to
[PDR-026](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md)
+ [`orientation.md`](../../directives/orientation.md); its rituals
moved to `start-right-quick` and `session-handoff`. State lives in
this file, `workstreams/<slug>.md`, and `tracks/*.md`.

## Active workstreams

- [`observability-sentry-otel`](workstreams/observability-sentry-otel.md)
  — branch-primary on `feat/otel_sentry_enhancements`.
- [`operational-awareness-continuity`](workstreams/operational-awareness-continuity.md)
  — parallel lane. Phase 4 rollout remains pending as the next
  deliberate OAC session.

## Branch-primary workstream brief

[`workstreams/observability-sentry-otel.md`](workstreams/observability-sentry-otel.md).

Current substantive work inside that lane is the §L-8 esbuild-native
migration now authored directly inside
`sentry-observability-maximisation-mcp.plan.md`: replace the ~900-line
L-7 bespoke Sentry release/commits/deploy orchestrator by switching
the MCP app's build tool from tsup to raw esbuild and registering
`@sentry/esbuild-plugin` directly. The earlier standalone
`sentry-esbuild-plugin-migration` plan was deleted after its tsup-
retention frame was identified as wrong. The active plan now contains
the corrected L-8 body, WS0 plan-time `assumptions-reviewer` findings
have been applied in place, and the next execution step is WS1 RED.

## Current session focus

Documentation iteration and audience-calibration — not a registered
workstream. This session produced several work-to-date artefacts while
trying to match the owner's intended audience and shape. The final
preferred artefact is
([`.agent/reference/work-to-date/oak-ecosystem-work-to-date-summary-2026-04-20.md`](../reference/work-to-date/oak-ecosystem-work-to-date-summary-2026-04-20.md)),
which returns closely to the original note's structure and folds in
only a few high-signal additions from the longer report. The fourth,
more audience-shaped update remains on the outward reader routes in
`README.md` and `docs/foundation/README.md`; no reroute was requested
in this session.

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
- Do NOT reopen §L-8 planning as though WS0 were still outstanding.
  The corrected L-8 body is already authored and the plan-time
  `assumptions-reviewer` pass is complete; resume at WS1 RED.
- Do NOT re-open the tsup-vs-esbuild decision. The decision is
  esbuild. Any plan non-goal that contradicts this is wrong per the
  owner-beats-plan invariant above.

## Next safe step

**Begin §L-8 execution at WS1 RED** in
`sentry-observability-maximisation-mcp.plan.md`. The corrected L-8
body is already authored inside the active plan, the WS0
`assumptions-reviewer` pass returned ACCEPT WITH NOTES, and those
notes are already applied. No separate current migration plan remains.

## Deep consolidation status

**Due — pre-existing governance triggers still stand; this handoff
does not bound them tightly enough to escalate.** Outstanding reasons:

- Governance change — guardrails installed `4bccba71` still need PDR
  graduation assessment.
- Repeated surprise pattern — the three-day tsup-vs-esbuild drift
  still points at a perturbation-mechanism bundle (non-goal
  re-ratification, standing-decision register, first-principles
  metacognition prompt) for the next dedicated consolidation pass.
- Repeated corrections around document form vs intended audience have
  now been captured in napkin entries, but are not yet clearly
  bounded enough to graduate beyond capture.

Per `session-handoff` boundary discipline, this handoff does not
escalate into `jc-consolidate-docs`.
