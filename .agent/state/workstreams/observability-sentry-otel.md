# Workstream Brief — Observability (Sentry + OTel)

**Last refreshed**: 2026-04-20 (OAC Phase 3 pilot — first population)
**Branch**: `feat/otel_sentry_enhancements`

## Owning plan(s)

- [`sentry-observability-maximisation-mcp.plan.md`](../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
  — lane-level execution authority (ACTIVE).
- [`sentry-esbuild-plugin-migration.plan.md`](../../plans/observability/current/sentry-esbuild-plugin-migration.plan.md)
  — current focus within this workstream; pending plan-time reviewer
  dispatch before WS1 begins.
- [`high-level-observability-plan.md`](../../plans/observability/high-level-observability-plan.md)
  — five-axis MVP framing + wave sequencing.
- [`sentry-otel-integration.execution.plan.md`](../../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md)
  — foundation parent plan; credential/evidence authority.

## Current objective

Replace the ~900-line bespoke Sentry release/commits/deploy
orchestrator (L-7 landed 2026-04-19/20) with `@sentry/esbuild-plugin`
(L-8, un-dropped 2026-04-20). Dispatch plan-time `assumptions-reviewer`
+ `sentry-reviewer` for solution-class challenge before execution
starts.

## Current state

- **L-7 bespoke**: LANDED across `7f3b17e9` + `6f5acd17` + `ecee9801`.
  953 lines across 5 files in
  `apps/oak-curriculum-mcp-streamable-http/build-scripts/`, plus
  `build:vercel` script, `vercel.json.buildCommand` override,
  `@sentry/cli` devDependency, and an eslint-config exception. Being
  torn out.
- **L-8 plugin migration**: plan drafted at
  `.agent/plans/observability/current/sentry-esbuild-plugin-migration.plan.md`
  (commit `4cbc8843`). Plan-density-invariant flag surfaced for
  owner decision (fold into maximisation §L-8 vs retain standalone
  with pair-archive).
- **L-12-prereq**: CLOSED 2026-04-19 by observability-primitives
  consolidation (commit `e09918a8`); `@oaknational/observability`
  owns redaction primitives + JsonValue/JsonObject; sentry-node
  composes directly from observability.
- **L-EH initial**: LANDED 2026-04-19 (ESLint `preserve-caught-error`
  rule at `error` severity in 5 Wave-1 workspaces).
- **L-DOC initial**: LANDED 2026-04-19 (commit `9e1a26b2`).
- **Test totals** (from landing gate): observability 58/58,
  sentry-node 61/61, logger 140/140, oak-search-sdk 262/262,
  oak-curriculum-mcp-streamable-http 615/615, search-cli 1006/1006,
  E2E 161/161 in isolation.
- **`pnpm check`** exit 0 at session close.

## Blockers / low-confidence areas

- **Plan density invariant engagement**: the new
  `sentry-esbuild-plugin-migration.plan.md` triggers the observability
  directory's density rule. Owner decision pending: fold into
  maximisation §L-8 vs retain standalone with pair-archive.
- **Plugin-coverage verification**: `sentry-reviewer` plan-time
  dispatch must confirm `@sentry/esbuild-plugin` handles all four
  bespoke behaviours (release registration, commit attribution,
  sourcemap upload with Debug IDs, deploy-event emission) before WS1
  starts.

## Next safe step

1. Owner decides plan-density-invariant resolution (fold vs
   pair-archive).
2. Dispatch `assumptions-reviewer` + `sentry-reviewer` against the
   migration plan pre-ExitPlanMode.
3. If reviewers accept, start migration plan's WS1.
4. If reviewers refine shape, amend plan, re-dispatch, then WS1.

## Active track links

- [`tracks/observability-sentry-otel--claude-opus-4-7--feat-otel-sentry-enhancements.md`](../../runtime/tracks/observability-sentry-otel--claude-opus-4-7--feat-otel-sentry-enhancements.md)
  — current session's tactical card (gitignored).

## Promotion watchlist

- **`sunk-cost-framing-in-par ked-rationale`** — the L-8 `dropped`
  rationale (2026-04-17) was itself a sunk-cost framing: "shell-script
  is simpler" was protecting the chosen shape, not measuring cost. This
  is a second-instance observation confirming the sunk-cost-phrase-
  detector guardrail. Watch for a third instance.
- **`feature-workstream-template-guardrails-self-test`** — the
  migration plan IS the first self-test of the Build-vs-Buy Attestation
  + Reviewer Scheduling sections. If the reviewers accept cleanly, the
  template works. If they uncover gaps, the template gets amended.
  Outcome graduates to the template's own evidence log.
- **`plan-density-invariant-tension-at-execution-boundary`** — the
  invariant is shaped to prevent planning drift, but bit at the
  boundary where execution of an un-dropped lane required a new plan
  file. Worth watching whether this is a one-off or the invariant
  needs refinement.
