# Repo Continuity

**Last refreshed**: 2026-04-21 (memory-feedback execution plan
landed — metacognition file + execution plan authored in the
`agentic-engineering-enhancements` collection; prior refresh
covered §L-8 WS1 RED pause and §L-8 WS1+WS2+WS3.1 atomic landing
at `f9d5b0d2`)
**Status**: Authoritative for the fields below. Operational memory
is the sole continuity-state host. Session orientation doctrine lives
in [`orientation.md`](../../directives/orientation.md); landing
commitment doctrine lives in
[PDR-026](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md);
rituals live in `start-right-quick` + `session-handoff`.

## Active threads

A **thread** is the continuity unit — a named stream of work that
persists across sessions and agents. A *session* is a time-bounded
agent occurrence that participates in one or more threads.
Convention and identity schema documented at
[`threads/README.md`](threads/README.md) (proposed 2026-04-21;
PDR candidate at next consolidation).

| Thread | Purpose | Next-session record | Workstream brief | Active identities |
| --- | --- | --- | --- | --- |
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`next-session-opener.md`](next-session-opener.md) (legacy singular path; migrates to `threads/observability-sentry-otel.next-session.md` at next consolidation) | [`workstreams/observability-sentry-otel.md`](workstreams/observability-sentry-otel.md) | (identity attribution retroactive for `f9d5b0d2` is a gap; see napkin 2026-04-21 meta-surprise) |
| `memory-feedback` | Practice — feedback loops across three-mode memory taxonomy; emergent-whole observation; doctrine landing | [`threads/memory-feedback.next-session.md`](threads/memory-feedback.next-session.md) | (none yet — arguably `workstreams/operational-awareness-continuity.md` covers it loosely; dedicated brief is a Phase 0 artefact of the memory-feedback execution plan) | `claude-code` / `claude-opus-4-7-1m` / agent-name unassigned / drafter / 2026-04-21 |

**Identity discipline**: sessions joining an active thread **add**
identity rows to the thread's next-session record; they do not
overwrite or rename existing ones. See
[`threads/README.md § Proposed rule`](threads/README.md).

## Active workstreams (lane-state briefs)

The workstream briefs below are long-lived "where are we in this
lane" surfaces; they remain authoritative for lane state.

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

**Dispatch three reviewers on the simplified §L-8 WS1 shape, then
revise the plan body and execute.** Per the 2026-04-21 napkin
entry, the three-integration-test shape prescribed by §L-8 WS1
asserts vendor / configuration behaviour, not Oak-authored product
behaviour — a testing-strategy violation caught before code was
written. Revised shape: one pure-function unit test over the
env-to-plugin-config translator + canonical `@sentry/esbuild-plugin`
wiring in `esbuild.config.mjs` + smoke evidence at WS4 / WS5 via a
Vercel preview deployment showing the expected Sentry UI state.

Reviewers to dispatch in parallel as intent-review:
`test-reviewer`, `architecture-reviewer-betty`,
`assumptions-reviewer`. Synthesise findings; amend §L-8 WS1 in the
maximisation plan; then resume execution against the revised shape.

After §L-8 closes, the alpha-gate emitter work (Phase 3a: L-1 + L-2
+ L-3, all schema-independent, can land in parallel) brings the MCP
server to diagnostic-grade Sentry. Events-workspace + L-4b + Phase 4
siblings + L-15 + L-EH final remain for public-beta gate. L-9, L-12,
L-13, L-14 are deferred to public beta with specific reopen
conditions documented in the maximisation plan.

## Deep consolidation status

**Due — pattern graduation still overdue; memory-feedback execution
plan now queued and owner-gated at Phase 0; dedicated consolidation
pass required.** Discharged across the 2026-04-20/21 arc: prompt-
fitness pressure (1628 → 145 lines dissolution); documentation
drift on the `docs/foundation/` boundary; PDR-011 alignment;
PDR-026 landing-commitment doctrine; orientation directive; memory
taxonomy restructure; reviewer catalogue re-homed to executive
memory.

Outstanding (must land at next consolidation pass):

- **`inherited-framing-without-first-principles-check` pattern
  extraction** to `.agent/memory/active/patterns/`. **Six instances
  now documented in napkin** (three on 2026-04-20; the 4th, 5th,
  and 6th on 2026-04-21 — caught by owner mid-flight, pre-commit
  hook rejection, and type-check failure respectively). Well past
  the repeats bar.
- **Perturbation-mechanism bundle** as a PDR plus three lightweight
  artefacts: non-goal re-ratification ritual, standing-decision
  register, first-principles metacognition prompt. All three are
  complementary layers; landing them as a bundle is the design.
  Note 2026-04-21 napkin observation: the three as currently
  installed are *passive guidance*; none fired before the 4th, 5th,
  or 6th inherited-framing instances. The PDR should include at
  least one *active tripwire* layer (rule / pre-commit hook / skill)
  alongside the passive layers — see the `passive-guidance-loses-
  to-artefact-gravity` pattern candidate.
- **`passive-guidance-loses-to-artefact-gravity` pattern
  candidate** (single instance, 2026-04-21). Promotion-ready when a
  second documented-but-not-enforced guardrail produces a third
  missed catch. Meta-evidence also observed 2026-04-21 by the
  memory-feedback-plan session: the authoritative
  `next-session-opener.md` was bypassed by a chat-text opener
  drafted from stale continuity fields. Second instance may already
  be present; owner review at next consolidation.
- **`practice.md` Artefact Map refresh** to reflect the three-mode
  memory taxonomy.
- **Portability decision** on the three-mode taxonomy (portable
  Practice doctrine via PDR, or explicitly host-local). **Now
  load-bearing**: Phase 0.2 of the memory-feedback execution plan
  branches on this answer.
- **Thread / session / identity doctrine bundle** (new, 2026-04-21
  memory-feedback-plan session): PDR candidate *"Threads, Sessions,
  and Agent Identity"* + rule candidate *"Additive thread
  identity"* + amendment candidates to PDR-011 (thread-scope
  extension) and PDR-026 (per-thread landing clarification).
  Installed lightweight this session at
  [`threads/`](threads/) (README + `memory-feedback.next-session.md`);
  formal doctrine awaits ratification. See napkin entry
  *"Session vs thread; identity should be tracked and additive"*
  for rationale.
- **Retroactive identity attribution gap**: the product thread's
  `f9d5b0d2` landing has no recorded session identity. Owner
  decides at next consolidation whether to backfill an approximate
  identity (platform + model + date window) or to accept the gap
  and start attribution from 2026-04-22 forward.

The broader gap — feedback loops across memory planes, emergent-
whole observation, executive-memory drift detection — has been
promoted from strategic brief to executable plan:

- Strategic brief: [`agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.plan.md`](../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.plan.md)
- Metacognition (first- and second-pass): [`agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md`](../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md)
- Execution plan (queued in `current/`, owner-gated at Phase 0): [`agentic-engineering-enhancements/current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md`](../../plans/agentic-engineering-enhancements/current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md)

Phase 0 of the execution plan carries two owner-gated decisions
(ratification of the three-plane frame; portability decision).
Phase 1 graduates the four overdue items listed above as its
first move. The plan does not start until Phase 0 answers exist.

## Next-session opening statements (per thread)

There is no single next-session opener. The continuity unit is the
thread; each active thread holds its own next-session record. Pick
the thread the session is picking up before reading the opener.

- **`observability-sentry-otel` thread** (product): see
  [`next-session-opener.md`](next-session-opener.md). Landing
  target: §L-8 WS1 Vercel preview acceptance probe (per the
  authoritative file; supersedes any earlier "WS1 RED" text on
  this page). Standing decisions (owner-beats-plan) and session
  shape specified in the opener.
- **`memory-feedback` thread** (Practice): see
  [`threads/memory-feedback.next-session.md`](threads/memory-feedback.next-session.md).
  Landing target: Phase 0 owner-gated decisions (three-plane
  ratification + portability). Thread-scoped identity table and
  grounding order specified in the file.

**PDR-026 landing-commitment discipline**: a single session
commits to landing *one* thread's target, not multiple. Cross-
thread spread in the same session is anti-pattern.
