# Repo Continuity

**Last refreshed**: 2026-04-20 (OAC Phase 3 pilot — first population)
**Status**: Pilot-populated. The prompt's `Live continuity contract`
section remains the legacy surface but is superseded for the fields
below per OAC Phase 3 scenario 1.

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

Non-goals for this session:

- Do NOT amend ADR-163 §6 prose yet; that is the sentry-esbuild-plugin
  migration plan's WS3 task.
- Do NOT delete bespoke orchestrator code yet; the migration plan's
  WS2 task handles deletion.
- Do NOT pilot beyond scenarios 1, 4, 5, 6 in this session;
  scenarios 2 and 3 require actual multi-agent parallelism and are
  deferred to organic triggers.

## Next safe step

Continue OAC Phase 3 pilot scenarios in order (1, 6, 4, 5). After
pilot evidence populated with four scenarios, close with explicit
promote / adjust / reject decision per the plan's Phase 3 Task 3.2.
Phase 4 rollout begins after that decision.

## Deep consolidation status

**Due — in progress, riding OAC Phase 3 + Phase 4 as natural
carrier.** Triggers firing: governance change (guardrails installed
`4bccba71` need PDR graduation assessment), repeated surprise pattern
(L-7 sunk-cost reinforces build-vs-buy lesson), fitness pressure
(this session already committed 17 times; session-continuation
prompt at 1545+ lines). Consolidation pass lands in OAC Phase 4 Task
4.3 alongside doc propagation.
