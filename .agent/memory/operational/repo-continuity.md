# Repo Continuity

**Last refreshed**: 2026-04-21 (Session 1 of the staged doctrine-
consolidation plan landed at 6/6 — two patterns authored
[`inherited-framing-without-first-principles-check`,
`passive-guidance-loses-to-artefact-gravity`]; first Family-A
tripwire rule installed at `.agent/rules/plan-body-first-
principles-check.md` with Claude + Cursor adapters; `practice.md`
Artefact Map refreshed for three-mode memory taxonomy;
`repo-continuity.md § Standing decisions` extended with
decisions 5 and 6 of the Phase 0 arc; brief experience entry
written; the plan itself was significantly expanded for Session 4
to add Class A.2 agent-registration / identity-discipline
tripwires with platform parity after owner question. Earlier
same-day refreshes covered the seven plan-authoring improvements
including the front-loaded Family-A tripwire, the
`session-discipline.md` template component, the "Starting a
session on a thread" checklist, the staged plan landing itself,
the dry-run archive, the Standing decisions section, the memory-
feedback execution plan, and the §L-8 atomic landing at
`f9d5b0d2`)
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

Session 1 of the staged doctrine-consolidation plan closed
cleanly at 6/6. Next-session focus is owner-directed: either
Session 2 of the staged plan (napkin rotation + pending-
graduations register schema) OR resumption of the
`observability-sentry-otel` thread's §L-8 Vercel acceptance
probe (branch-primary). PDR-026 landing commitment is per-
thread-per-session; pick one per next session.

## Standing decisions

Standing decisions are durable owner-ratifications that govern
current and future sessions until explicitly superseded. They are
the precursor surface to the formal standing-decision register
that will land in Session 4 of the staged consolidation plan
(see Deep consolidation status). Recording convention: each
decision has `recorded:` (date), `reason:` (short provenance),
and the decision itself as a one-to-three-line statement.

- **Three-plane memory taxonomy RATIFIED as the working frame**,
  with meta-tripwires required to periodically re-evaluate seam
  correctness, missing concepts, and abstraction level. Family B
  tripwires land in Session 4 of the staged consolidation plan.
  - `recorded:` 2026-04-21
  - `reason:` owner decision during dry-run of `/jc-consolidate-docs`
    after the memory-feedback-plan session
- **Three-plane memory taxonomy PORTABLE.** Lands as a Practice-
  Core PDR. Downstream Executive-Memory Feedback Loop PDR and
  Threads/Sessions/Agent-Identity PDR also land as portable PDRs.
  - `recorded:` 2026-04-21
  - `reason:` same owner decision as above
- **Fitness functions NOT BLOCKING for graduation work in the
  staged consolidation plan's Sessions 1–5.** `pnpm practice:fitness
  --strict-hard` is tolerated to fail at Sessions 1–5 close.
  Session 6 is scoped as a holistic fitness exploration; strict
  closure required there.
  - `recorded:` 2026-04-21
  - `reason:` owner decision to avoid fitness remediation blocking
    the overdue doctrine graduation; holistic exploration is the
    right shape for fitness at this scale
- **Experience scan is a separate session with its own plan.**
  `.agent/experience/` (128 files from 2025-01 onward) is too
  large for step 4 of a single consolidation pass. Queued as
  future plan after the staged consolidation closes.
  - `recorded:` 2026-04-21
  - `reason:` scale exceeds routine consolidation; owner decision
- **Staged execution is the shape** for the overdue consolidation
  arc. Six sessions, each landing a bounded target per PDR-026, no
  shortcuts, no deferred-without-cause. Each session lands its
  target fully or explicitly re-scopes in handoff.
  - `recorded:` 2026-04-21
  - `reason:` owner decision during dry-run; single-pass would
    exceed context or force partial close (dry-run tier analysis)
- **Session break points are explicit and protected.** Every
  session ends with handoff discipline per `session-handoff.md`
  (thread record updated, continuity surface refreshed, napkin
  entries captured, next-session preconditions named). Context
  budget is the primary reason; coherence is the secondary. The
  next session starts cold from memory surfaces, not from
  conversation continuity.
  - `recorded:` 2026-04-21
  - `reason:` owner decision during dry-run; protects the
    continuity unit from drift under context pressure
- **Clerk is canonical user-ID provider through public alpha.**
  Revisit before public beta.
  - `recorded:` prior session (see memory: `project_user_id_clerk_canonical`)
  - `reason:` architectural decision during alpha-gate work
- **`--no-verify` requires fresh per-commit owner authorisation.**
  No carry-forward across commits.
  - `recorded:` prior session
  - `reason:` hook-skipping discipline
- **Owner's word beats plan. Always.** When a plan's non-goals
  or framing contradicts a statement by the owner (in conversation
  or recorded memory), the owner wins without argument.
  - `recorded:` 2026-04-20 (commit `363037af`)
  - `reason:` prior-session agent drift surfaced repeatedly against
    owner's standing decisions

Standing decisions migrate to the formal standing-decision
register artefact when Session 4 of the staged consolidation plan
installs it.

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

**Session 1 of the staged consolidation plan landed 2026-04-21 at
6/6. Plan Session 4 scope expanded to Class A.2 agent-registration
/ identity tripwires with platform parity after owner question.
Sessions 2–6 remain queued; all outstanding items still owned by
the plan; Phase 0 owner decisions recorded above under Standing
decisions.**

**Consolidation-gate check at 2026-04-21 (Session 1 close)**:
NOT DUE. Napkin is above the 500-line rotation threshold but
napkin rotation is explicitly staged to Session 2 of the owning
plan; no other `consolidate-docs` trigger fires independently
of the plan. Next expected gate firing: Session 2 of the staged
plan (napkin rotation + pending-graduations register schema). Discharged across the 2026-04-20/21
arc: prompt-fitness pressure (1628 → 145 lines dissolution);
documentation drift on the `docs/foundation/` boundary; PDR-011
alignment; PDR-026 landing-commitment doctrine; orientation
directive; memory taxonomy restructure; reviewer catalogue re-homed
to executive memory.

The overdue backlog + the new doctrine bundle are now sequenced
by the **Staged Doctrine Consolidation and Graduation** plan:

- Plan: [`../../plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md`](../../plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md)
- Dry-run analysis preserved: [`../../reference/agentic-engineering/consolidation-design/consolidation-dry-run-2026-04-21.md`](../../reference/agentic-engineering/consolidation-design/consolidation-dry-run-2026-04-21.md)

The plan stages the work across six sessions with explicit
break points:

1. **Session 1 — LANDED 2026-04-21 at 6/6.** Standing decisions
   section extended to include decisions 5 (staged execution as
   the shape) and 6 (session break points explicit and
   protected); two patterns authored (`inherited-framing-without-
   first-principles-check`, `passive-guidance-loses-to-artefact-
   gravity`); first Family-A tripwire rule installed at
   `.agent/rules/plan-body-first-principles-check.md` with full
   Claude + Cursor adapter parity and docs-adr-reviewer
   well-formed verdict; `practice.md` Artefact Map refreshed for
   three-mode memory taxonomy (owner-approved per PDR-003);
   Practice Core CHANGELOG entry recorded; brief experience
   entry at `.agent/experience/2026-04-21-installing-a-tripwire-
   i-cannot-test.md`.
2. **Session 2** — Napkin rotation (1324+ → archive); distilled
   merge-and-prune; formalise pending-graduations register schema;
   bind to session workflows.
3. **Session 3** — Draft three new PDRs (Threads/Sessions/Agent
   Identity; Executive-Memory Feedback Loop; Perturbation-Mechanism
   Bundle *with active-tripwire design **covering both Class A.1
   plan-body inherited-framing AND Class A.2 agent-registration /
   identity discipline; platform parity load-bearing***); apply
   two amendments (PDR-011 thread-scope; PDR-026 per-thread).
   Owner-gated per PDR-003.
4. **Session 4 (EXPANDED 2026-04-21)** — Install Family A
   tripwires across both classes. **Class A.1**: plan-body rule
   forward-reference cleared to concrete PDR; standing-decision
   register surface installed. **Class A.2**: session-open
   identity-registration rule with full platform parity (Claude +
   Cursor adapters + AGENT.md citation); session-close identity
   gate in `/session-handoff` (hard gate, not warn) with
   `pnpm session-handoff:check` script and unit tests; platform-
   neutral stale-identity health probe registered in
   `claude-agent-ops health` with five checks and unit coverage;
   derivable active-agent-register view as a named CLI
   subcommand. Install Family B tripwires (memory-taxonomy meta).
   Cross-plane path rules. Practice Core CHANGELOG; roadmap sync.
5. **Session 5** — Outgoing triage (PDR-007 enforcement on 10+
   files, 1481 lines); promote or delete each.
6. **Session 6** — Holistic fitness exploration as final meta-
   consolidation; owner-decides compress/raise/restructure/split
   per file; `pnpm practice:fitness --strict-hard` passes.

**Deferred after arc**: experience-scan (dedicated session with
future plan after Session 6 closes).

**New 2026-04-21 PDR candidate for Session 3 of the staged plan**:
*"Workflow-Scope Alignment to Continuity-Unit Scope"* — doctrine
that session-scoped workflows act on session-scoped artefacts;
thread-scoped workflows act on thread-scoped artefacts; scope is
labelled in every workflow header and every artefact's metadata.
Command amendments applied in-flight 2026-04-21 (`session-handoff`
gained §6b ADR/PDR candidate surfacing and §6c subjective
experience capture; `consolidate-docs` had its step-11 session-
scoped capture removed; both commands carry explicit scope
labels). PDR-011 amendment in Session 3 absorbs this work.

**New 2026-04-21 pattern candidate**:
*`durable-doctrine-states-the-why-not-only-the-what`* — doctrine
that states rules without stating their reasons degrades to
ritual; future sessions cannot re-derive the rule under novel
conditions. Single instance so far (the three-reason experience-
audit rationale, made explicit 2026-04-21 across
`.agent/experience/README.md`, `consolidate-docs` step 4,
`session-handoff` step 6c). Promotion-ready at Session 1 Task 1.3
or a subsequent consolidation when a second rationale-free
rule produces re-derivation drift.

**Retroactive identity attribution for `f9d5b0d2`**: owner accepts
the attribution gap; start forward from 2026-04-22 per the
Standing decisions section above.

**Related memory-feedback artefacts** (partially consumed by the
staged plan; retained for intent and history):

- Strategic brief: [`../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.plan.md`](../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.plan.md)
- Metacognition (first- and second-pass): [`../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md`](../../plans/agentic-engineering-enhancements/future/memory-feedback-and-emergent-learning-mechanisms.metacognition.md)
- Execution plan (Phase 0 resolved; Phases 1–5 absorbed by the
  staged plan; Phase 6 doctrine landing in Session 3 of the
  staged plan): [`../../plans/agentic-engineering-enhancements/current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md`](../../plans/agentic-engineering-enhancements/current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md)

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
  Landing target: Session 1 of the Staged Doctrine Consolidation
  and Graduation plan (record Standing decisions fully; author
  two patterns; refresh `practice.md` Artefact Map; brief
  experience entry). Phase 0 ratifications landed in the Standing
  decisions section above on 2026-04-21. Thread-scoped identity
  table and grounding order specified in the file.

**PDR-026 landing-commitment discipline**: a single session
commits to landing *one* thread's target, not multiple. Cross-
thread spread in the same session is anti-pattern.
