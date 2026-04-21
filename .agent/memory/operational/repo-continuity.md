# Repo Continuity

**Last refreshed**: 2026-04-21 (Session 4 of the staged doctrine-
consolidation plan landed — Family-A Class-A.1 + Class-A.2 tripwires
installed; Family-B meta-tripwires installed; cross-plane path rules
installed; observability thread next-session record migrated from
legacy singular path to `threads/`; platform-agnostic commit skill
installed; **PDR-029 Amendment Log entry authored mid-session** after
owner metacognition intervention surfaced a platform-coupling bias in
the original script-based shape for Class-A.2 Layers 2 and 3 — the
amendment codifies that "active" tripwire layers are satisfied by
markdown-ritual steps naming authoritative sources, not by code
execution. Tasks 4.2.b/c/3 reshaped documentation-first. Seven Due
register items moved to Graduated. Practice Core CHANGELOG updated;
roadmap synced. Sessions 5 [outgoing triage per PDR-007] and 6
[holistic fitness exploration with `--strict-hard` closure] remain.)
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
[`threads/README.md`](threads/README.md) and ratified in
[PDR-027](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md).

**This table IS the right-now active-agent register** per PDR-029 (as
amended 2026-04-21). The `Active identities` column summarises each
thread's current participating identities in `platform / model /
agent_name / role / last_session` form — a compact readable register
any agent on any platform can read. Per-thread full identity tables
live in each thread's next-session record; this column carries the
most recent session's identities for at-a-glance continuity.

| Thread | Purpose | Next-session record | Workstream brief | Active identities |
| --- | --- | --- | --- | --- |
| `observability-sentry-otel` | Product — Sentry/OTel public-alpha integration | [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) | [`workstreams/observability-sentry-otel.md`](workstreams/observability-sentry-otel.md) | *unattributed* / *unknown* / *unknown* / executor / 2026-04-21 (retro for `f9d5b0d2`); `claude-code` / `claude-opus-4-7-1m` / Samwise / migration-maintenance / 2026-04-21 (S4 Task 4.5 file migration; not substantive thread work) |
| `memory-feedback` | Practice — feedback loops across three-mode memory taxonomy; emergent-whole observation; doctrine landing | [`threads/memory-feedback.next-session.md`](threads/memory-feedback.next-session.md) | (none yet — arguably `workstreams/operational-awareness-continuity.md` covers it loosely; dedicated brief is a Phase 0 artefact of the memory-feedback execution plan) | `claude-code` / `claude-opus-4-7-1m` / `Samwise` / drafter/initiator/executor / 2026-04-21 |

**Identity discipline**: sessions joining an active thread **add**
identity rows to each thread's next-session record; they do not
overwrite or rename existing ones. See
[`threads/README.md`](threads/README.md) and
[PDR-027](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md).

**Refresh cadence**: the `Active identities` column is refreshed as
part of [`/session-handoff` step 7b](../../commands/session-handoff.md) —
every session that touches a thread updates both the thread's own
next-session record (full identity table) and this summary column
(compact per-thread view).

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

Session 4 of the staged doctrine-consolidation plan LANDED
2026-04-21 with two PDR-029 Amendment Log entries, two new rules,
two documentation walkthroughs, doctrine-index sweeps, cross-plane
path rules, observability-thread migration, Practice Core
CHANGELOG + roadmap sync. Owner honest-question intervention at
close (*"are we building a valuable system or throwing energy
into theatre?"*) surfaced three theatre symptoms: doctrine
velocity greatly exceeded empirical firing evidence; Session 4
agent missed an authoritative linked workstream brief
(`operational-awareness-continuity.md`) despite the thread record
citing it; six pattern candidates generated in one session. Owner
direction at close: *"there is no alternative thread, we need
this work to be FINISHED, properly, carefully, fully, choosing
long-term architectural excellence at every point."*

Session 5 opens on the `memory-feedback` thread with a **mandatory
evaluate-and-simplify first stage**:

1. Close OAC Phase 4 (overdue 2026-04-20; has pilot-evidence
   artefact).
2. Simplification pass with delete-bias against recently-added
   doctrine surfaces (thread-vs-workstream collapse; PDR-029
   consolidating revision; six Session-4 pattern candidates;
   Family-A tripwire retention; Session-4 register entries).
3. Answer the thread/workstream/track first-principles check
   (three sub-items in the Due register).

Stage 2 (outgoing triage + decomposition) runs only after stage
1 closes cleanly; moves to Session 6 otherwise. The thread does
not switch. The `observability-sentry-otel` thread waits.

## Decisions in force — pointer to proper artefact homes

**Per PDR-029's second 2026-04-21 Amendment Log entry**: there is no
dedicated "standing-decisions" surface. "Standing" is not a category; it is
a default property of any ratified artefact. Decisions that govern current
and future sessions live in their proper homes and are read at session
open via the grounding order.

**Where ratified decisions live**:

- **Architectural decisions** → [ADR index](../../../docs/architecture/architectural-decisions/README.md).
- **Practice-governance decisions** → [PDR index](../../practice-core/decision-records/) (portable doctrine).
- **Always-applied procedural rules** → [`.agent/rules/`](../../rules/) tier.
- **Meta-principles** → [`.agent/directives/principles.md`](../../directives/principles.md).
- **Plan-local meta-decisions** (scope, shape, fitness tolerance,
  session counts, deferrals) → the owning plan body itself.

Session 4 (2026-04-21) removed the prior `standing-decisions.md` misc
bucket after owner-metacognition surfaced that every item in it had a
proper home (or needed one authored). Decomposition items tracked under
the Deep consolidation status register as Due items for Session 5 /
next consolidation authoring.

**Repo-wide invariants that read as decisions** (e.g. cardinal rule, owner-
beats-plan, docs-as-DoD, `--no-verify` fresh authorisation) live below
at [§ Repo-wide invariants / non-goals](#repo-wide-invariants--non-goals).
Their long-term home is per classification in the list above; invariants
already documented in `principles.md`, PDRs, or rules carry citations
forward from those homes.

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
- **Misleading docs are blocking** (introduced 2026-04-21, Session 4
  late revision after owner directive; enforced against the same
  session's own plan body). When a decision, design, or doctrine
  amendment invalidates a passage in a plan, ADR, PDR, rule, or
  other durable document, the document MUST be updated in the
  same landing — not deferred to CHANGELOG/roadmap-sync work.
  Stale prescriptive text is how inherited framing propagates; in
  agentic engineering, documentation IS infrastructure.
  PDR-authoring candidate for Session 5 / next consolidation.

Non-goals for next session:

- Do NOT amend ADR-163 §6 prose yet; that is the §L-8 migration's
  WS3 task (atomic with WS2).
- Do NOT delete bespoke orchestrator code yet; the §L-8 migration's
  WS2 task handles deletion.
- Do NOT re-open the tsup-vs-esbuild decision. Owner decision
  stands: esbuild. Any plan non-goal that contradicts this is wrong
  per the owner-beats-plan invariant.

## Next safe step

**Continue the `memory-feedback` thread to completion** per owner
direction (2026-04-21 Session 4 late close): *"there is no
alternative thread, we need this work to be FINISHED, properly,
carefully, fully, choosing long-term architectural excellence at
every point."* Session 5 opens with the **evaluate-and-simplify
stage** as mandatory first step — not as an option alongside the
original Session 5 scope. Full framing at
[`threads/memory-feedback.next-session.md`](threads/memory-feedback.next-session.md)
§ Next landing target.

Session 5 stage 1 (mandatory, run first): close OAC Phase 4;
simplification pass with delete-bias against Session-4 doctrine
additions; answer the thread/workstream/track first-principles
check. Session 5 stage 2 (runs only if stage 1 closes with budget
remaining): outgoing triage + decomposition. If stage 2 cannot
fit Session 5, it moves to Session 6 alongside or replacing parts
of holistic fitness exploration.

**The `observability-sentry-otel` thread** remains alive (§L-8
Vercel acceptance probe still the named next step on that thread
per
[`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md))
but is **not an alternative to `memory-feedback` Session 5**. It
is a separate thread that waits until the `memory-feedback` arc
closes. PDR-026 per-thread-per-session applies — `memory-feedback`
is the current thread until the arc finishes.

## Deep consolidation status

**Session 1 of the staged doctrine-consolidation plan landed
2026-04-21 at 6/6; Session 2 in flight (napkin rotation complete;
this register schema formalised). Plan Session 4 scope expanded
to Class A.2 agent-registration / identity tripwires with platform
parity after owner question. Sessions 3–6 remain queued; all
outstanding items still owned by the plan; Phase 0 owner decisions
recorded above under Standing decisions.**

**Consolidation-gate check at 2026-04-21 (Session 3 close)**:
NOT DUE as an independent trigger. The Session 3 bundle is
itself the consolidation pass's doctrine-landing stage
(capture → distil → **graduate** via the Staged Doctrine
Consolidation plan). Napkin still fresh (Session 2 rotation
stands; Session 3 close adds one entry below); distilled
unchanged this session; Practice Core CHANGELOG updated with
the Session 3 bundle entry; register refreshed (seven Due items
moved to Graduated). Next firing: Session 4 of the staged plan
(Family A + Family B tripwire installation).
Discharged across the 2026-04-20/21 arc: prompt-fitness pressure
(1628 → 145 lines dissolution); documentation drift on the
`docs/foundation/` boundary; PDR-011 alignment (plus 2026-04-21
thread-scope amendment); PDR-026 landing-commitment doctrine
(plus 2026-04-21 per-thread-per-session amendment); orientation
directive; memory taxonomy restructure; reviewer catalogue
re-homed to executive memory; thread-as-continuity-unit
codified as PDR-027; executive-memory feedback loop codified as
PDR-028; perturbation-mechanism bundle with platform-parity
load-bearing codified as PDR-029; plane-tag vocabulary codified
as PDR-030.

The overdue backlog + the new doctrine bundle are sequenced by the
**Staged Doctrine Consolidation and Graduation** plan:

- Plan: [`../../plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md`](../../plans/agentic-engineering-enhancements/current/staged-doctrine-consolidation-and-graduation.plan.md)
- Dry-run analysis preserved: [`../../reference/agentic-engineering/consolidation-design/consolidation-dry-run-2026-04-21.md`](../../reference/agentic-engineering/consolidation-design/consolidation-dry-run-2026-04-21.md)

### Pending-graduations register

The register tracks candidates that have been *captured* (in
napkin, distilled, workstream briefs, or elsewhere) and are
awaiting *graduation* to a durable home (pattern, PDR, ADR, rule,
Practice Core, infrastructure artefact). Schema per item:

- `captured-date` (YYYY-MM-DD) — when the candidate was first recorded.
- `source-surface` — where the candidate lives now (`napkin`,
  `napkin-archive`, `distilled`, `workstream brief`,
  `executive surface`, `practice-core`, `session opener`, etc.).
- `graduation-target` — one of: `pattern | PDR | ADR | rule |
  practice-md | infrastructure | other`.
- `trigger-condition` — concrete signal that moves the item to `due`.
- `status` — one of: `pending | due | overdue | graduated`.

A candidate is `pending` until its trigger-condition fires
(typically a second/third independent instance, a scheduled
drafting slot, or explicit consumption by a plan task). On trigger
fire, status moves to `due`. If `due` persists through a
consolidation without action, it becomes `overdue`. On graduation,
status moves to `graduated` and the entry records the destination.

**Orphan-item signal** (Family B Layer 2 meta-tripwire per PDR-029):
items carrying `graduation-target: other` that remain unrefined
across two consecutive consolidations are a **taxonomy seam
signal** — the register's graduation-target vocabulary either
needs a new concrete value or the item naturally spans planes and
should route through the cross-plane channel (PDR-028 +
`cross_plane: true` per PDR-030). Surface accumulated
`graduation-target: other` items at `/jc-consolidate-docs` step 5
and raise with owner when three or more persist across
consolidations. Items graduated via a new concrete
`graduation-target:` value (e.g. `taxonomy-review`,
`workflow-amendment`) close the signal.

The register is reviewed and refreshed at every `/session-handoff`
(new items added; trigger conditions re-evaluated) and is named as
an input at `consolidate-docs` step 7 (graduation scan) and step 5
(orphan-item + cross-plane scan).

#### Graduated (Session 1, 2026-04-21)

- **`inherited-framing-without-first-principles-check`** — captured-date: 2026-04-20; source-surface: napkin; graduation-target: pattern; trigger-condition: six instances across 2026-04-20/21 (repeats bar reached); status: **graduated** → [`../active/patterns/inherited-framing-without-first-principles-check.md`](../active/patterns/inherited-framing-without-first-principles-check.md).
- **`passive-guidance-loses-to-artefact-gravity`** — captured-date: 2026-04-21; source-surface: napkin; graduation-target: pattern; trigger-condition: three instances reached 2026-04-21; status: **graduated** → [`../active/patterns/passive-guidance-loses-to-artefact-gravity.md`](../active/patterns/passive-guidance-loses-to-artefact-gravity.md).
- **Plan-body first-principles-check rule** (Family-A Class A.1, first tripwire layer) — captured-date: 2026-04-21; source-surface: napkin (via `inherited-framing` pattern); graduation-target: rule; trigger-condition: front-loaded to cover Sessions 2–3 of the staged plan; status: **graduated** → [`../../rules/plan-body-first-principles-check.md`](../../rules/plan-body-first-principles-check.md) with Claude + Cursor adapters.
- **`practice.md` Artefact Map — three-mode memory refresh** — captured-date: 2026-04-20; source-surface: practice-core; graduation-target: practice-md; trigger-condition: memory taxonomy restructure required the Artefact Map to reflect three modes; status: **graduated** (Session 1 Task 1.5; Practice Core CHANGELOG entry recorded; owner-approved per PDR-003).

#### Graduated (Session 2 extended scope, 2026-04-21)

- **`AGENT.md § RULES` cites the `.agent/rules/` tier** — captured-date: 2026-04-21; source-surface: onboarding-reviewer audit this session; graduation-target: other (directive amendment); trigger-condition: onboarding-reviewer flagged that Codex + Gemini agents discover `principles.md` via `AGENT.md` but not the `.agent/rules/` tier, making Session 1's landed plan-body-first-principles-check rule invisible to non-loader platforms; status: **graduated** → `.agent/directives/AGENT.md § **RULES**` now names the always-applied rule tier and explicitly instructs Codex/Gemini to read every file in `.agent/rules/` at session open.

#### Graduated (Session 3 doctrine bundle, 2026-04-21)

- **Threads, Sessions, and Agent Identity PDR** — captured-date: 2026-04-21; source-surface: napkin + [`threads/README.md`](threads/README.md) (proposed rule); graduation-target: PDR (portable per Standing decision 2); trigger-condition: Session 3 Task 3.1 drafting slot; status: **graduated** → [`../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md`](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md).
- **Executive-Memory Feedback Loop PDR** — captured-date: 2026-04-20; source-surface: memory-feedback execution plan Phase 6; graduation-target: PDR (portable per Standing decision 2); trigger-condition: Session 3 Task 3.2 drafting slot; status: **graduated** → [`../../practice-core/decision-records/PDR-028-executive-memory-feedback-loop.md`](../../practice-core/decision-records/PDR-028-executive-memory-feedback-loop.md).
- **Perturbation-Mechanism Bundle PDR** (active-tripwire design covering Family A Classes A.1 + A.2) — captured-date: 2026-04-20; source-surface: napkin (perturbation mechanisms); expanded 2026-04-21 to two-class Family A; graduation-target: PDR (portable per Standing decision 2); trigger-condition: Session 3 Task 3.3 drafting slot; status: **graduated** → [`../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md`](../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md).
- **PDR-011 thread-scope amendment** — captured-date: 2026-04-21; source-surface: napkin (workflow-scope alignment; threads insight); graduation-target: PDR amendment; trigger-condition: Session 3 Task 3.4 drafting slot; status: **graduated** → [`../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md`](../../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md) (2026-04-21 entry in Amendment Log).
- **PDR-026 per-thread-per-session amendment** — captured-date: 2026-04-21; source-surface: napkin (landing-commitment per-thread framing); graduation-target: PDR amendment; trigger-condition: Session 3 Task 3.5 drafting slot; status: **graduated** → [`../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md`](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md) (2026-04-21 entry in Amendment Log; Notes/Graduation-intent structural refactor applied in same landing).
- **`platform-parity-as-probe-prerequisite`** (design principle) — captured-date: 2026-04-21; source-surface: napkin + distilled; graduation-target: PDR (absorbed into Perturbation-Mechanism Bundle PDR); trigger-condition: Session 3 Task 3.3 drafting slot; status: **graduated** → PDR-029 §Platform parity (load-bearing).
- **`workflow-scope-alignment-to-continuity-unit-scope`** — captured-date: 2026-04-21; source-surface: napkin + distilled; graduation-target: PDR (absorbed into PDR-011 amendment); trigger-condition: Session 3 drafting slot; status: **graduated** → PDR-011 2026-04-21 amendment §Thread-scoped at the upper lifecycle.
- **Plane-tag vocabulary PDR** — captured-date: 2026-04-21; source-surface: docs-adr-reviewer pass (OWNER-DECISION 1); graduation-target: PDR (portable per Standing decision 2); trigger-condition: owner decision mid-bundle to codify immediately rather than defer; status: **graduated** → [`../../practice-core/decision-records/PDR-030-plane-tag-vocabulary.md`](../../practice-core/decision-records/PDR-030-plane-tag-vocabulary.md).

#### Graduated (Session 4 tripwire install + PDR-029 amendment, 2026-04-21)

- **Platform-agnostic commit skill** — captured-date: 2026-04-21; source-surface: session-3-close owner observation; graduation-target: infrastructure (resolved to canonical `.agent/commands/commit.md` per repo's `jc-*`-as-command convention enforced by `pnpm portability:check`); trigger-condition: Session 4 Task 4.0 (tooling prerequisite); status: **graduated** → [`../../commands/commit.md`](../../commands/commit.md) with Claude + Cursor + Codex adapters and AGENT.md Commit Discipline citation.
- **`start-right-quick-missing-threads-step`** — captured-date: 2026-04-21; source-surface: onboarding-reviewer audit; graduation-target: other (workflow amendment); trigger-condition: Session 4 Task 4.2.a; status: **graduated** → `start-right-quick` Ground First step 4 now reads `threads/README.md` + `threads/<slug>.next-session.md`; `start-right-thorough` Foundation Documents extended similarly; AGENT.md Memory and Patterns cites `threads/`. (A `standing-decisions.md` citation was initially added and subsequently removed late Session 4 per PDR-029's second Amendment Log entry — see the retraction register entry below.)
- **`session-handoff-check-must-enumerate-threads`** — captured-date: 2026-04-21; source-surface: onboarding-reviewer audit; graduation-target: other — **reshape mid-session 2026-04-21** per PDR-029 Amendment Log: resolved as documentation-first walkthrough, not a script; trigger-condition: Session 4 Task 4.2.b; status: **graduated** → [`../../commands/session-handoff.md`](../../commands/session-handoff.md) step 7c names `repo-continuity.md § Active threads` as the structural source and walks the agent through enumeration; no `pnpm session-handoff:check` (script shape rejected as platform-coupling).
- **`observability-thread-legacy-singular-path`** — captured-date: 2026-04-21; source-surface: onboarding-reviewer audit; graduation-target: other (file migration); trigger-condition: Session 4 Task 4.5; status: **graduated** → next-session record moved to [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md) with thread identity block and participating agent identities table added; all inbound references updated.
- **`stale-identity-probe-sixth-check`** — captured-date: 2026-04-21; source-surface: onboarding-reviewer audit; graduation-target: other (probe-check scope) — **reshape mid-session 2026-04-21** per PDR-029 Amendment Log: resolved as documentation-first checklist, not a scanner module; trigger-condition: Session 4 Task 4.2.c; status: **graduated** → [`../../commands/consolidate-docs.md`](../../commands/consolidate-docs.md) step 7c six-check audit walkthrough (sixth check is the Active-threads ↔ next-session-file correspondence).
- **`passive-guidance-pattern-citation-in-distilled-and-start-right`** — captured-date: 2026-04-21; source-surface: onboarding-reviewer audit; graduation-target: other (distilled entry + workflow citation); trigger-condition: Session 4 Task 4.2.a / 4.5; status: **graduated** → pattern now cited in [`../active/distilled.md`](../active/distilled.md) Architecture (Agent Infrastructure) section and in `start-right-quick` Learning-loop surfaces.
- **PDR-029 Amendment Log entry (*"active means markdown-ritual, not code"*)** — captured-date: 2026-04-21 (mid-Session-4, owner metacognition intervention); source-surface: napkin Session 4 mid-session entry; graduation-target: PDR amendment; trigger-condition: Session 4 Task 4.2.b/c/3 scope revision; status: **graduated** → [`../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md`](../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md) 2026-04-21 Amendment Log entry. Related register items: pattern candidates `active-means-ritual-moment-not-code-execution` and `plan-body-framing-outlives-five-reviewers` now on watchlist (first instance; promotion-ready on second).
- **"Misleading docs are blocking" decision** — captured-date: 2026-04-21 (mid-Session-4, owner directive); source-surface: owner; graduation-target: PDR (Practice-governance, documentation discipline — relisted as Due below for Session 5 authoring); trigger-condition: immediate for enforcement, next consolidation for PDR authoring; status: **in force** (operating as an invariant; PDR authoring pending). Provisionally carried in `repo-continuity.md § Repo-wide invariants / non-goals` until PDR authored.

#### Due (trigger fired; awaiting action this arc)

- **Thread ↔ workstream ↔ track decomposition first-principles check** — captured-date: 2026-04-21 (Session 4 late close, owner metacognition on operational-memory surfaces); source-surface: owner question; graduation-target: **multiple** (see sub-items below); trigger-condition: **Session 5 open** — both questions need owner-directed resolution before the 1:1 state drifts further or the track-naming pattern hardens around a workstream-only scope; status: **due**.
  - **Thread-vs-workstream collapse question** — at current scale (two active threads; each with 0 or 1 workstream) the thread↔workstream mapping is 1:1. PDR-027 envisions 1:N (a thread contains one or more workstreams). The question: is the 1:1 empirical state evidence that the two surfaces should collapse into one, or evidence we simply haven't seen a multi-lane thread yet? **Recommended framing for owner decision**: keep separate if the concerns are genuinely distinct (identity/continuity vs lane-state) even at 1:1; collapse if the separation is paying only a naming cost without delivering structural value. Current lean (not a decision): keep separate — concerns are distinct; 1:N is plausible on future threads (e.g. a "search-ux" thread spanning index-migration + query-rewrite + frontend workstreams).
  - **Track-naming-scope question** — tracks use `<workstream>--<agent>--<branch>.md`. If threads are the continuity unit but tracks are workstream-scoped, a tactical task that spans two workstreams within one thread has no clean filename. Does the pattern need to accommodate thread-level tracks (e.g. `<thread>--<workstream>--<agent>--<branch>.md` or `<thread-or-workstream>--<agent>--<branch>.md` with disambiguation convention), or is workstream-scoping the correct structural answer because tracks are lane-tactical by design? Owner decides at Session 5 open.
  - **Naming-collision discipline** — current state permits same slug for thread and workstream (e.g. `observability-sentry-otel` is both). Is this acceptable overlap (the surfaces are distinct and collisions are safe), or does it need explicit disambiguation (e.g. a naming rule that thread slugs and workstream slugs cannot be identical)? Fold into the thread-vs-workstream-collapse decision — if we keep separate, disambiguate; if we collapse, moot.
- **Decomposition of the retracted `standing-decisions.md` contents into proper artefact homes** — captured-date: 2026-04-21 (Session 4 late revision); source-surface: napkin Session 4 late revision + PDR-029 second 2026-04-21 Amendment Log entry; graduation-target: **multiple** (see sub-items below); trigger-condition: **Session 5 or next consolidation** — the items named in the retraction must reach their proper homes to close the decomposition; status: **due**.
  - **`--no-verify-requires-fresh-authorisation`** → rule candidate at `.agent/rules/`; graduation-target: rule.
  - **`owner-word-beats-plan`** → principle addition to `.agent/directives/principles.md`; graduation-target: principle. (Already partially present in repo-wide invariants; consolidate to principles as canonical home.)
  - **`build-vs-buy-attestation-required-pre-exitplanmode`** → PDR candidate (Practice-governance, planning discipline); graduation-target: PDR.
  - **`friction-ratchet-counter-3-plus-signals-escalates-to-assumptions-reviewer`** → PDR candidate (Practice-governance, reviewer discipline, possible PDR-015 amendment); graduation-target: PDR or PDR amendment. **Session 5 first-principles check (per Barney close review)**: new PDR vs PDR-015 amendment is currently either/or — that is a smell. Decide which at Session 5 open on reusability-test grounds (does the friction-ratchet substance live alongside reviewer-phase-alignment in PDR-015, or does it name a distinct concern deserving its own PDR?).
  - **`adrs-state-what-not-how`** → PDR candidate (Practice-governance, ADR discipline; check PDR-023 coverage); graduation-target: PDR or PDR-023 amendment.
  - **`reviewer-phases-aligned-plan-time-mid-cycle-close`** → PDR-015 amendment candidate; graduation-target: PDR amendment.
  - **`runtime-tactical-track-cards-git-tracked`** → **Session 5 first-principles check required (per Barney close review)**: flagged as mis-assignment risk. The item describes a repo-local operational convention (where track files live; git-tracked vs not) — it may be adopter-test-local to this repo and not re-derivable across Practice-bearing repos. Candidate destinations: ADR (architectural boundary — where operational artefacts live in the repo structure), workspace README (pure repo-local operational doc), or PDR (only if substance is cross-repo Practice governance). Session 5 decides on reusability-test grounds.
  - **`docs-as-definition-of-done-on-every-lane`** → PDR candidate (Practice-governance, close discipline); graduation-target: PDR.
  - **`misleading-docs-are-blocking`** (raised mid-Session-4) → PDR candidate (Practice-governance, documentation discipline); graduation-target: PDR. **Overdue trigger**: the invariant is carried in `repo-continuity.md § Repo-wide invariants` until the PDR lands. If the PDR is not authored by Session 6 close, the invariant's placement in operational memory (low-permanence surface) is itself a friction signal — promote to `overdue` and escalate to `assumptions-reviewer` for solution-class review per the friction-ratchet invariant.
  - **Clerk canonical user-ID provider through public alpha** → check existing ADR coverage; ADR candidate if not present; graduation-target: ADR.
  - Items already in proper homes (three-plane taxonomy in PDR-028/PDR-030; staged-execution / fitness-not-blocking / experience-scan-deferred / session-break-points in plan body) are **complete** — no further authoring.
- **`in-place-supersession-markers-at-section-anchors`** — captured-date: 2026-04-19; source-surface: napkin-archive (2026-04-19b watchlist); graduation-target: pattern; trigger-condition: three instances reached 2026-04-19; status: due — next consolidation or standalone pattern authoring.
- **`fork-cost-surfaces-in-doc-discipline-layer`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: three instances reached 2026-04-19; status: due.
- **`E2E-flakiness-under-parallel-pnpm-check-load`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: ADR (test-stability-lane) or pattern; trigger-condition: three cross-session instances reached 2026-04-19; status: due — needs a test-stability-lane authoring decision.
- **`reviewer-catches-plan-blind-spot`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: ≥2 instances reached; status: due.
- **`reviewer-findings-applied-in-close-not-deferred`** (PDR-012 amendment) — captured-date: 2026-04-19; source-surface: distilled; graduation-target: PDR amendment (PDR-012); trigger-condition: three cross-session instances reached 2026-04-19; status: due — Session 3 doctrine bundle may absorb.
- **`plan-body-framing-outlives-reviewers`** — captured-date: 2026-04-21 (Session 4 three-instance surfacing); source-surface: napkin + PDR-029 second Amendment Log entry; graduation-target: pattern; trigger-condition: three instances reached in Session 4 (scripts-for-tripwires; docs-as-second-class-review-target; standing-decisions-as-category); status: **due** — pattern authoring at Session 5 or next consolidation. Definition: plan-body inherited *framings* (not just shapes) propagate through reviewer intent-review unchanged because each reviewer optimises within the frame rather than questioning it. The plan-body-first-principles-check rule's shape clause catches shape mismatches; it does not catch the frame behind the shape.
- **`new-doctrine-lands-without-sweeping-indexes`** — captured-date: 2026-04-21 (Session 4 post-close owner question on operational-memory surface decomposition); source-surface: napkin; graduation-target: pattern; trigger-condition: three instances reached this session (PDR-029 adding "standing-decision register surface" without sweeping — now retracted; PDR-029 script-shape prescription without sweeping downstream plan body — now revised; PDR-027 adding threads without sweeping `operational/README.md` + `orientation.md`); status: **due** — pattern authoring at Session 5 or next consolidation. Definition: PDR/rule/pattern/skill doctrine additions that introduce a new artefact class leave the doctrine-index files stale unless sweeping the indexes is an explicit acceptance criterion of the landing. Counter-measure candidate: make "sweep downstream indexes" a required acceptance criterion on any PDR that adds or removes a memory surface, rule class, skill class, or directive tier. Related to `misleading-docs-are-blocking` (index-layer manifestation) and to `plan-body-framing-outlives-reviewers` (reviewer-coverage blind spot).

#### Pending (single-instance; awaiting repeat for promotion)

- **`doctrine-velocity-exceeds-impact-signal`** — captured-date: 2026-04-21 (Session 4 post-close owner honest-question diagnostic); source-surface: napkin; graduation-target: pattern; trigger-condition: second instance of a session producing substantial doctrine (rules + amendments + pattern candidates + index sweeps) with zero firing evidence; status: pending. Counter-measure candidate at authoring: at session open, require an explicit answer to *"which piece of accumulated doctrine will this session exercise, and what will count as evidence it fired?"*
- **`hedged-link-in-ritual-is-read-as-none`** — captured-date: 2026-04-21 (Session 4 post-close — agent missed `operational-awareness-continuity.md` workstream brief despite thread-record link hedged as *"arguably covers loosely"*); source-surface: napkin; graduation-target: pattern; trigger-condition: second instance of a hedged link in an operational/ritual surface leading to the linked content being unread; status: pending. Counter-measure candidate: at ritual-surface authoring time, either remove the hedge OR explicitly say *"read this on arrival anyway"*.
- **`owner-honest-question-as-critical-signal`** — captured-date: 2026-04-21 (Session 4 close, theatre-vs-value question); source-surface: napkin; graduation-target: pattern; trigger-condition: second instance of owner asking an *"is this earning its keep?"* / theatre-vs-value framing question and that framing driving a posture shift for the next session; status: pending. Counter-measure: treat such questions as first-order structural signals requiring concrete diagnostic response + likely simplification cycle, not as clarification.
- **`treating-owner-concern-as-information-rather-than-direction`** — captured-date: 2026-04-21 (Session 4 close — agent reframed owner's theatre-vs-value concern as "choice point" between two postures rather than as direction to simplify-first; owner corrected); source-surface: napkin; graduation-target: pattern; trigger-condition: second instance of agent drafting optionality around owner direction; status: pending. Counter-measure: when owner raises a direction concern, reframe work as mandatory sequence with the direction baked in, not as a choice with the direction as "recommended". The hedge *"recommended per analysis"* IS the failure mode.
- **`durable-doctrine-states-the-why-not-only-the-what`** — captured-date: 2026-04-21; source-surface: napkin + distilled; graduation-target: pattern; trigger-condition: second rationale-free rule produces re-derivation drift; status: pending.
- **`dry-run-before-recipe-against-accumulated-backlog`** — captured-date: 2026-04-21; source-surface: napkin + distilled; graduation-target: pattern; trigger-condition: second accumulated-backlog workflow dry-run before execution; status: pending.
- **`self-applying-acceptance-for-tripwire-installs`** — captured-date: 2026-04-21; source-surface: napkin + distilled; graduation-target: pattern; trigger-condition: third instance (two already scheduled in Session 4 Tasks 4.2.a and 4.2.b); status: pending.
- **`defer-decisions-must-live-where-the-candidate-lives`** — captured-date: 2026-04-20; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second deferred candidate whose trigger condition was discovered missing from its home artefact; status: pending.
- **`when-deleting-a-doc-sweep-active-plans-for-prescriptions-not-just-links`** — captured-date: 2026-04-20; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second deletion where a prescription survived a link-only pass; status: pending.
- **`collaboration-shape-is-an-unexamined-assumption-in-new-artefact-types`** — captured-date: 2026-04-20; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second design where collaboration shape surfaced as mid-cycle correction; status: pending.
- **`ask-the-minimum-not-the-maximum-when-direction-is-clear`** — captured-date: 2026-04-20; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second moment where a 3-option question is better served by a declarative *"next I'll do X"*; status: pending.
- **`decision-complete-adr-enumerates-implied-questions`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second instance where an explicit adjudication-question list left downstream decisions unnamed; status: pending.
- **`prefer-webfetch-for-doc-citation-prefer-agent-for-judgement`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second instance calibrating agent-vs-WebFetch choice; status: pending.
- **`amend-not-honour-when-simplification-surfaces-post-decision`** — captured-date: 2026-04-19; source-surface: napkin-archive (2026-04-19b); graduation-target: PDR (strong candidate on 2nd instance); trigger-condition: second instance of ADR amendment driven by broader-view simplification; status: pending.
- **`work-stream-dissolution-via-upstream-fix`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: second instance of upstream fix absorbing downstream work stream; status: pending.
- **`reviewer-matrix-completeness-is-not-absolute`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern or PDR-015 addendum; trigger-condition: second session where discretionary reviewer dispatch against a plan-listed matrix was correct; status: pending.
- **`turbo-cache-hides-prettier-drift-until-pre-commit`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern (repo-specific) or workspace README; trigger-condition: second instance of cached `format:root` false-clean; status: pending.

Additional single-instance watchlist observations carried forward
from the 2026-04-19 rotation (`core-tier-means-primitive-not-just-
dependency-pure`, `safety-layers-stack-not-nest`, `git-status-is-
a-snapshot`, `closure-principles-absorb-cardinality-changes`,
`reviewer-as-option-cartographer-not-decision-maker`, `date-
suffixed-frontmatter-is-a-smell`, `tier-scope-must-be-explicit-
for-shared-vocabulary-invariants`, `code-embodied-policy-without-
explicit-ruling-needs-tsdoc-pointer`, `forward-pointing-planning-
references-need-planned-markers`, `convergent-direction-across-
multiple-research-cuts-is-stronger-evidence`, `practice-five-file-
package-is-conceptually-a-plugin`, `reviewer-systems-cluster-is-
the-densest-uplift-cluster`, `assumptions-reviewer-pre-pass-
shrinks-fan-out-and-tightens-fences`, `symbolication-key-vs-ui-
association-are-separate-concerns`, `prefer-one-form-over-both-
work-drift-avoidance`) all carry captured-date 2026-04-19, source-
surface napkin-archive, graduation-target pattern, trigger-condition
*"second independent instance"*, status pending. Full descriptions
live in [`../active/archive/napkin-2026-04-19b.md`](../active/archive/napkin-2026-04-19b.md);
promote individually to this register on first second-instance.

#### Infrastructure (new artefacts scheduled for authoring)

- **Agent-names registry** — captured-date: 2026-04-21; source-surface: session opener (owner direction, this session); graduation-target: infrastructure; trigger-condition: consumed by Session 4 Task 4.2 identity-rule install; status: pending. Scope: approximately 1000 well-distributed names across geography, culture, and time period; sources to be researched from multiple durable public-domain or open-data lists (Unicode CLDR, SSA corpora, international registries, historical-figure lists, etc.); no LLM-generation (distribution would skew to training-data prevalence and risk stereotyping). Source research is part of Session 4 prep.
- **External pointer-surface integration (Linear; possibly GitHub Projects)** — captured-date: 2026-04-21; source-surface: session opener (Linear-mechanism exploration arc this session); graduation-target: infrastructure (gitignored `.agent/local/linear.{local,example}.json` + AGENTS.md/CLAUDE.md pointer + `threads/README.md` schema field + `session-handoff.md` step 7c firing surface + `pnpm session-handoff:check` extension + PDR-027 amendment OR new external-pointer-surface PDR per Phase 0.5); trigger-condition: Phase 0 owner ratification of the parent plan AND `observability-thread-legacy-singular-path` Due item resolved AND Session 4 of the Staged Doctrine Consolidation plan closed (Phase 0.4 recommended sequencing; owner override permitted); status: pending. Parent plan: [`../../plans/agentic-engineering-enhancements/future/external-pointer-surface-integration.plan.md`](../../plans/agentic-engineering-enhancements/future/external-pointer-surface-integration.plan.md). Owner-ratified directives this turn: (1) long-term architectural excellence is the guiding principle; (2) threads must surface and never collapse, owner-preferred mechanism is **labels on issues within the existing OOC project** (architecturally correct because thread-lifetime is indefinite and Linear-issue-lifetime is finite, so threads-as-labels and landings-as-issues is structurally honest); (3) infrastructure not ritual — passive Document plus active firing surface plus health probe (PDR-029 two-complementary-layers); (4) capture-only this turn. GitHub Projects assessed as marginal value given the org-internal visibility goal already covered by repo + Linear; deferred unless a public-roadmap need surfaces. No PII in version control (Linear IDs, user IDs live only in gitignored `.agent/local/linear.local.json`). One-way sync only: repo authoritative; Linear is a peer pointer-surface, not a mirror. Cadence: per-session-close on landing (PDR-026 emission event), matching Cursor's "visible without spam" principle.

### Plan structure (for continuity)

The six-session staged plan summary:

1. ✅ **Session 1 — LANDED 2026-04-21 at 6/6.** Two patterns authored; first Family-A tripwire rule installed; `practice.md` Artefact Map refreshed; Standing decisions extended; brief experience entry. (Graduated items listed above.)
2. **Session 2 — IN FLIGHT 2026-04-21.** Napkin rotation (1611 → `archive/napkin-2026-04-21.md`); distilled merge-and-prune; pending-graduations register schema formalised (this section); register-to-workflow binding.
3. **Session 3** — Draft three new PDRs + two amendments (per Due section above). Owner-gated per PDR-003. Bundle rhythm is the default; sequential allowed if an earlier PDR materially changes a later one.
4. **Session 4 (EXPANDED 2026-04-21)** — Install Family A tripwires across both classes. Class A.1: plan-body rule forward-reference cleared; standing-decision register surface installed. Class A.2: session-open identity-registration rule with full platform parity (Claude + Cursor + AGENT.md citation); session-close identity gate in `/session-handoff` (hard gate) with `pnpm session-handoff:check` and unit tests; platform-neutral stale-identity health probe with five checks and unit coverage; derivable active-agent-register view as a named CLI subcommand. Consumes agent-names registry (Infrastructure item above). Install Family B tripwires; cross-plane path rules; Practice Core CHANGELOG; roadmap sync.
5. **Session 5** — Outgoing triage (PDR-007 enforcement on 10+ files, 1481 lines); promote or delete each.
6. **Session 6** — Holistic fitness exploration as final meta-consolidation; owner-decides compress / raise / restructure / split per file; `pnpm practice:fitness --strict-hard` passes.

**Deferred after arc**: experience-scan (dedicated session with
future plan after Session 6 closes).

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
  [`threads/observability-sentry-otel.next-session.md`](threads/observability-sentry-otel.next-session.md). Landing
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
