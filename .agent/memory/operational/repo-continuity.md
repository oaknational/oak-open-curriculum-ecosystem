# Repo Continuity

**Last refreshed**: 2026-04-21 (Session 2 of the staged doctrine-
consolidation plan landed at 3/3 + extended scope — napkin rotated
[1611 → `archive/napkin-2026-04-21.md`]; distilled merged with 5
new entries; pending-graduations register schema formalised in
`§ Deep consolidation status` with four status bands
[graduated / due / pending / infrastructure] and ~36 items;
`session-handoff` step 7 added for register refresh + thread-record
identity update; `consolidate-docs` step 7 preamble names the
register as a graduation-scan input; owner assigned agent name
`Samwise` to the continuing identity on the `memory-feedback`
thread; agent-names registry captured as
`graduation-target: infrastructure` for Session 4 Task 4.2
consumption. Extended scope: onboarding-reviewer audit surfaced
discoverability gaps that would make Session 2's installs unreliable
for a fresh agent; urgent `AGENT.md § **RULES**` amendment landed
naming the `.agent/rules/` tier [fixes Session 1's plan-body rule
discoverability on Codex/Gemini]; five reviewer-finding register
items added to the register [Due band]; staged plan Session 4 Tasks
4.2.a/b/c amended with start-right-quick + start-right-thorough
amendments, structural thread enumeration in session-handoff:check,
sixth probe check, legacy next-session-opener.md handling, passive-
guidance pattern citation surface additions.)
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
| `memory-feedback` | Practice — feedback loops across three-mode memory taxonomy; emergent-whole observation; doctrine landing | [`threads/memory-feedback.next-session.md`](threads/memory-feedback.next-session.md) | (none yet — arguably `workstreams/operational-awareness-continuity.md` covers it loosely; dedicated brief is a Phase 0 artefact of the memory-feedback execution plan) | `claude-code` / `claude-opus-4-7-1m` / `Samwise` / drafter / 2026-04-21 |

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

Session 2 of the staged doctrine-consolidation plan closed
cleanly at 3/3. Next-session focus is owner-directed: either
Session 3 of the staged plan (doctrine-bundle drafting — three
PDRs + two amendments, owner-gated per PDR-003) OR resumption
of the `observability-sentry-otel` thread's §L-8 Vercel
acceptance probe (branch-primary). PDR-026 landing commitment
is per-thread-per-session; pick one per next session.

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

**Session 1 of the staged doctrine-consolidation plan landed
2026-04-21 at 6/6; Session 2 in flight (napkin rotation complete;
this register schema formalised). Plan Session 4 scope expanded
to Class A.2 agent-registration / identity tripwires with platform
parity after owner question. Sessions 3–6 remain queued; all
outstanding items still owned by the plan; Phase 0 owner decisions
recorded above under Standing decisions.**

**Consolidation-gate check at 2026-04-21 (Session 2 close)**:
NOT DUE as an independent trigger. Napkin freshly rotated (60
lines); distilled refined with 5 new entries (over hard limit by
standing decision 3 tolerance); register formalised and refreshed
this session; Practice-box incoming/outgoing not changed this
session; documentation drift addressed (AGENT.md § RULES tier
citation). Next firing: Session 3 of the staged plan (doctrine
bundle drafting).
Discharged across the 2026-04-20/21 arc: prompt-fitness pressure
(1628 → 145 lines dissolution); documentation drift on the
`docs/foundation/` boundary; PDR-011 alignment; PDR-026 landing-
commitment doctrine; orientation directive; memory taxonomy
restructure; reviewer catalogue re-homed to executive memory.

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

The register is reviewed and refreshed at every `/session-handoff`
(new items added; trigger conditions re-evaluated) and is named as
an input at `consolidate-docs` step 7 (graduation scan).

#### Graduated (Session 1, 2026-04-21)

- **`inherited-framing-without-first-principles-check`** — captured-date: 2026-04-20; source-surface: napkin; graduation-target: pattern; trigger-condition: six instances across 2026-04-20/21 (repeats bar reached); status: **graduated** → [`../active/patterns/inherited-framing-without-first-principles-check.md`](../active/patterns/inherited-framing-without-first-principles-check.md).
- **`passive-guidance-loses-to-artefact-gravity`** — captured-date: 2026-04-21; source-surface: napkin; graduation-target: pattern; trigger-condition: three instances reached 2026-04-21; status: **graduated** → [`../active/patterns/passive-guidance-loses-to-artefact-gravity.md`](../active/patterns/passive-guidance-loses-to-artefact-gravity.md).
- **Plan-body first-principles-check rule** (Family-A Class A.1, first tripwire layer) — captured-date: 2026-04-21; source-surface: napkin (via `inherited-framing` pattern); graduation-target: rule; trigger-condition: front-loaded to cover Sessions 2–3 of the staged plan; status: **graduated** → [`../../rules/plan-body-first-principles-check.md`](../../rules/plan-body-first-principles-check.md) with Claude + Cursor adapters.
- **`practice.md` Artefact Map — three-mode memory refresh** — captured-date: 2026-04-20; source-surface: practice-core; graduation-target: practice-md; trigger-condition: memory taxonomy restructure required the Artefact Map to reflect three modes; status: **graduated** (Session 1 Task 1.5; Practice Core CHANGELOG entry recorded; owner-approved per PDR-003).

#### Graduated (Session 2 extended scope, 2026-04-21)

- **`AGENT.md § RULES` cites the `.agent/rules/` tier** — captured-date: 2026-04-21; source-surface: onboarding-reviewer audit this session; graduation-target: other (directive amendment); trigger-condition: onboarding-reviewer flagged that Codex + Gemini agents discover `principles.md` via `AGENT.md` but not the `.agent/rules/` tier, making Session 1's landed plan-body-first-principles-check rule invisible to non-loader platforms; status: **graduated** → `.agent/directives/AGENT.md § **RULES**` now names the always-applied rule tier and explicitly instructs Codex/Gemini to read every file in `.agent/rules/` at session open.

#### Due (trigger fired; awaiting action this arc)

- **Threads, Sessions, and Agent Identity PDR** — captured-date: 2026-04-21; source-surface: napkin + [`threads/README.md`](threads/README.md) (proposed rule); graduation-target: PDR (portable per Standing decision 2); trigger-condition: Session 3 Task 3.1 drafting slot; status: due.
- **Executive-Memory Feedback Loop PDR** — captured-date: 2026-04-20; source-surface: memory-feedback execution plan Phase 6; graduation-target: PDR (portable per Standing decision 2); trigger-condition: Session 3 Task 3.2 drafting slot; status: due.
- **Perturbation-Mechanism Bundle PDR** (active-tripwire design covering Family A Classes A.1 + A.2) — captured-date: 2026-04-20; source-surface: napkin (perturbation mechanisms); expanded 2026-04-21 to two-class Family A; graduation-target: PDR (portable per Standing decision 2); trigger-condition: Session 3 Task 3.3 drafting slot; status: due.
- **PDR-011 thread-scope amendment** — captured-date: 2026-04-21; source-surface: napkin (workflow-scope alignment; threads insight); graduation-target: PDR amendment; trigger-condition: Session 3 Task 3.4 drafting slot; status: due.
- **PDR-026 per-thread-per-session amendment** — captured-date: 2026-04-21; source-surface: napkin (landing-commitment per-thread framing); graduation-target: PDR amendment; trigger-condition: Session 3 Task 3.5 drafting slot; status: due.
- **`platform-parity-as-probe-prerequisite`** (design principle) — captured-date: 2026-04-21; source-surface: napkin + distilled; graduation-target: PDR (likely absorbed into Perturbation-Mechanism Bundle PDR); trigger-condition: Session 3 Task 3.3 drafting slot; status: due.
- **`workflow-scope-alignment-to-continuity-unit-scope`** — captured-date: 2026-04-21; source-surface: napkin + distilled; `session-handoff` and `consolidate-docs` headers already carry explicit scope labels from in-flight amendments; graduation-target: PDR (absorbed into PDR-011 amendment, Session 3 Task 3.4); trigger-condition: Session 3 drafting slot; status: due.
- **`in-place-supersession-markers-at-section-anchors`** — captured-date: 2026-04-19; source-surface: napkin-archive (2026-04-19b watchlist); graduation-target: pattern; trigger-condition: three instances reached 2026-04-19; status: due — next consolidation or standalone pattern authoring.
- **`fork-cost-surfaces-in-doc-discipline-layer`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: three instances reached 2026-04-19; status: due.
- **`E2E-flakiness-under-parallel-pnpm-check-load`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: ADR (test-stability-lane) or pattern; trigger-condition: three cross-session instances reached 2026-04-19; status: due — needs a test-stability-lane authoring decision.
- **`reviewer-catches-plan-blind-spot`** — captured-date: 2026-04-19; source-surface: napkin-archive; graduation-target: pattern; trigger-condition: ≥2 instances reached; status: due.
- **`reviewer-findings-applied-in-close-not-deferred`** (PDR-012 amendment) — captured-date: 2026-04-19; source-surface: distilled; graduation-target: PDR amendment (PDR-012); trigger-condition: three cross-session instances reached 2026-04-19; status: due — Session 3 doctrine bundle may absorb.
- **`start-right-quick-missing-threads-step`** — captured-date: 2026-04-21; source-surface: onboarding-reviewer audit; graduation-target: other (workflow amendment); trigger-condition: Session 4 Task 4.2.a (session-open identity rule install) — without this amendment the rule lands as one-failure-mode-wide (agent does not read the rule); status: due. Amendment: `start-right-quick` step 4 and `start-right-thorough` name `threads/README.md` as a read; `AGENT.md` cites the new identity rule path.
- **`session-handoff-check-must-enumerate-threads`** (implementation constraint for Session 4 Task 4.2.b) — captured-date: 2026-04-21; source-surface: onboarding-reviewer audit; graduation-target: other (implementation detail); trigger-condition: Session 4 Task 4.2.b script authoring — self-reporting is not sufficient; the probe must read `repo-continuity.md § Active threads`, enumerate threads, and assert every active thread's `last_session` was updated this date OR the agent explicitly declared non-participation per thread; status: due.
- **`observability-thread-legacy-singular-path`** — captured-date: 2026-04-21; source-surface: onboarding-reviewer audit; graduation-target: other (file migration); trigger-condition: Session 4 install of Class A.2 tripwires — the observability thread's next-session record still lives at the legacy singular path `.agent/memory/operational/next-session-opener.md` (not under `threads/`), so an agent resuming that thread bypasses `threads/README.md § Proposed rule` entirely; status: due. Option: migrate to `threads/observability-sentry-otel.next-session.md` before or during Session 4, or Session 4's session-open identity rule must handle the legacy path.
- **`stale-identity-probe-sixth-check`** (Session 4 Task 4.2.c scope addition) — captured-date: 2026-04-21; source-surface: onboarding-reviewer audit; graduation-target: other (probe-check scope); trigger-condition: Session 4 Task 4.2.c probe authoring — sixth check needed: *"every thread in `§ Active threads` has a `*.next-session.md` file"* (catches the observability legacy-path mismatch and any future thread added to the Active threads table without a next-session file); status: due.

#### Pending (single-instance; awaiting repeat for promotion)

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
- **`passive-guidance-pattern-citation-in-distilled-and-start-right`** — captured-date: 2026-04-21; source-surface: onboarding-reviewer audit; graduation-target: other (distilled entry + workflow citation); trigger-condition: next consolidation pass — the `passive-guidance-loses-to-artefact-gravity` pattern at `.agent/memory/active/patterns/` is not cited from `distilled.md` or `start-right-quick`, so future tripwire-design decisions may not encounter the constraint at design time; status: pending.

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
