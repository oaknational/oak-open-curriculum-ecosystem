# Repo Continuity

**Last refreshed**: 2026-04-20 (session close — memory taxonomy +
prompt dissolution + §L-8 esbuild-native re-plan landed; deferrals
recorded; wiring review applied)
**Status**: Authoritative for the fields below. Operational memory
is the sole continuity-state host. Session orientation doctrine lives
in [`orientation.md`](../../directives/orientation.md); landing
commitment doctrine lives in
[PDR-026](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md);
rituals live in `start-right-quick` + `session-handoff`.

## Active workstreams

- [`observability-sentry-otel`](workstreams/observability-sentry-otel.md)
  — branch-primary on `feat/otel_sentry_enhancements`.
- [`operational-awareness-continuity`](workstreams/operational-awareness-continuity.md)
  — parallel agentic-engineering lane; OAC Phase 4 landed;
  post-Phase-4 structural changes (memory taxonomy + prompt
  dissolution) also landed this session.

## Branch-primary workstream brief

[`workstreams/observability-sentry-otel.md`](workstreams/observability-sentry-otel.md).
§L-8 esbuild-native migration is re-planned and ready for
execution; next session begins at WS1 RED.

## Current session focus

No next-session focus held by this contract — the session has
closed. Next-session statement lives in the handoff note at the
bottom of this session's final commit message and in the
[next-session opening statement](#next-session-opening-statement)
below.

## Repo-wide invariants / non-goals

Invariants in force for any session regardless of workstream (the
set is additive; previous invariants still apply):

- **Cardinal rule**: `pnpm sdk-codegen && pnpm build` brings all
  workspaces into alignment with an upstream OpenAPI schema change.
- **No compatibility layers, no backwards compatibility** — replace,
  don't bridge. See `.agent/directives/principles.md`.
- **TDD at all levels** — tests first, fail-green-refactor.
- **Tests prove product behaviour, not configuration** — never
  assert on file structure, section headings, or field names when
  what you need to prove is the system's observable behaviour. See
  `.agent/directives/testing-strategy.md`.
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
  Cards now live at `.agent/memory/operational/tracks/`.
- **Owner's word beats plan. Always.** When a plan's non-goals,
  design decisions, scope, or any other drafted framing contradicts
  a statement by the owner (in conversation or recorded memory), the
  owner wins without argument. Non-goals are especially suspect —
  they are where prior agent sessions' sunk-cost reasoning most
  often hides. Any session executing against a plan with non-goals
  MUST re-read them against recent owner direction and surface
  contradictions before acting.
- **Docs-as-definition-of-done on every lane** — no separate final-
  docs phase. Every lane's REFACTOR gate includes per-loop TSDoc,
  ADR index entries, runbook propagation, `docs-adr-reviewer` close
  review, and a `documentation-sync-log.md` entry. Docs drift is
  not permitted between lanes.

Non-goals for next session:

- Do NOT amend ADR-163 §6 prose yet; that is the §L-8 migration's
  WS3 task (atomic with WS2).
- Do NOT delete bespoke orchestrator code yet; the §L-8 migration's
  WS2 task handles deletion.
- Do NOT re-open the tsup-vs-esbuild decision. Owner decision
  stands: esbuild. Any plan non-goal that contradicts this is wrong
  per the owner-beats-plan invariant.

## Next safe step

**Begin §L-8 execution at WS1 RED** in
`observability/active/sentry-observability-maximisation-mcp.plan.md`.
The re-plan is complete; plan-time `assumptions-reviewer` pass
returned ACCEPT WITH NOTES and findings are applied. No separate
migration plan exists.

After §L-8 closes, the alpha-gate emitter work (Phase 3a: L-1 + L-2
+ L-3, all schema-independent, can land in parallel) brings the MCP
server to diagnostic-grade Sentry. Events-workspace + L-4b + Phase 4
siblings + L-15 + L-EH final remain for public-beta gate. L-9, L-12,
L-13, L-14 are deferred to public beta with specific reopen
conditions documented in the maximisation plan.

## Deep consolidation status

**Partially discharged this session; one dedicated pass remains.**
Discharged: prompt-fitness pressure (1628 → 145 lines dissolution);
documentation drift on the `docs/foundation/` boundary; PDR-011
alignment; PDR-026 landing-commitment doctrine; orientation
directive; memory taxonomy restructure; reviewer catalogue re-homed
to executive memory.

Outstanding: perturbation-mechanism PDR/rule drafting (napkin logs
all three candidates — non-goal re-ratification, standing-decision
register, first-principles metacognition — as complementary layers
to land as a bundle). Next consolidation pass owns this.

## Next-session opening statement

See the dedicated section below this file — landed as part of this
session's close.
