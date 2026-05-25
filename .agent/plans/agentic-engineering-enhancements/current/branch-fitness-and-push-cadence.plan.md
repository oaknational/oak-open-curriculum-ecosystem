---
name: "Branch Fitness And Push Cadence — Small-PR Enabling Protocol"
overview: >
  Sixteen-cycle executable plan landing the protocol substrate that
  shifts this repo from bursty-large-trunk-pushes to many-small-PRs-in-
  parallel. Covers (a) branch-fitness measurement CLI extending
  `pnpm practice:fitness`, (b) pre-commit + pre-push hooks giving SOFT/
  HARD/CRITICAL feedback on reviewable-LOC + push-payload + files-
  touched + commits-ahead axes, (c) PR-state + Sonar-state observers
  emitting state-changed comms events, (d) push-authz policy ADR and
  marshal-role-evolution PDR resolving the marshal-as-bottleneck risk
  surfaced by the parallel-worktree shape. Source substrate:
  `.agent/memory/active/napkin.md` Capture H + 🔆 HIGHLIGHT. Owner
  direction (paused-state, ratified at post-compaction-5 resume):
  "create protocols and guidance around committing, pushing, PR state
  monitoring and Sonar state monitoring, including a preference towards
  small commits, pushing often, monitoring GH state for PRs, monitoring
  Sonar state for PR, and measuring the total number of files touched
  on a branch and the total number of changes made on a branch as
  reported by git, and setting soft, hard and critical feedback for
  them, in an automated way, probably a hook, with the goal of keeping
  PRs small enough to be easily reviewed by a human, and simple to
  reason about." Ships at SOFT-only initially; HARD/CRITICAL escalation
  is a separate empirical decision after observation window.
todos:
  - id: cycle-1-substrate-capture
    content: >
      Cycle 1: Capture napkin Capture H + 🔆 HIGHLIGHT substrate into
      durable thread record at
      `.agent/memory/operational/threads/branch-fitness-and-push-cadence.next-session.md`
      and register in `repo-continuity.md § Active Threads`. One commit.
      Tree green at end.
    status: in_progress
  - id: cycle-2-pdr-doctrine
    content: >
      Cycle 2: Author PDR-NNN (branch-fitness doctrine: small-PR cadence;
      push-often discipline; two-axis metric — reviewable-LOC excluding
      substrate + push-payload total; parallel-worktree as enabling
      shape). Reviewer dispatch (docs-adr-expert + architecture-expert-fred
      + assumptions-expert). One commit. Tree green at end.
    status: pending
    depends_on: [cycle-1-substrate-capture]
  - id: cycle-3-adr-phenotype
    content: >
      Cycle 3: Author ADR-NNN (branch-fitness phenotype: CLI + pre-commit
      + pre-push + observer pattern; SOFT-only initial thresholds; named
      threshold defaults sourced from common-practice + repo empirical
      calibration). Reviewer dispatch (docs-adr-expert +
      architecture-expert-fred + security-expert for hook boundary). One
      commit. Tree green at end.
    status: pending
    depends_on: [cycle-2-pdr-doctrine]
  - id: cycle-4-cli-scaffold
    content: >
      Cycle 4: Scaffold `pnpm practice:fitness:branch` extending the
      existing `pnpm practice:fitness` shape. CLI lives in
      `@oaknational/agent-tools` at `agent-tools/src/branch-fitness/`
      (per architecture-expert-fred verdict 2026-05-24: existing
      practice-fitness lives in agent-tools, not packages/libs;
      `packages/libs/practice-fitness` was a fiction). Test-first:
      failing test asserts `branch` subcommand exists and returns
      Zod-schema-validated JSON. Reviewer dispatch (code-expert +
      type-expert + test-expert). One commit. Tree green at end.
    status: pending
    depends_on: [cycle-3-adr-phenotype]
  - id: cycle-5-cli-two-axis
    content: >
      Cycle 5: Implement two-axis measurement — reviewable-LOC (source
      files only; substrate excluded per
      `.gitattributes`-driven classification) + push-payload (total LOC
      including substrate). Test-first: failing tests on a fixture
      repo state asserting axis values. Reviewer dispatch (code-expert +
      test-expert). One commit. Tree green at end.
    status: pending
    depends_on: [cycle-4-cli-scaffold]
  - id: cycle-6-cli-files-commits
    content: >
      Cycle 6: Implement files-touched + commits-ahead-of-base axes
      measured branch-vs-main with override flag for branch-vs-base. Test-
      first: failing tests on fixture state. Reviewer dispatch (code-expert
      + test-expert). One commit. Tree green at end.
    status: pending
    depends_on: [cycle-5-cli-two-axis]
  - id: cycle-7-cli-soft-thresholds
    content: >
      Cycle 7: Wire SOFT-only threshold bands with named defaults
      (reviewable-LOC SOFT=500/HARD=1000/CRITICAL=2000; files-touched
      SOFT=10/HARD=30/CRITICAL=50; thresholds emit but do not enforce).
      One-line summary output format for hook consumption. Test-first.
      Reviewer dispatch (code-expert + test-expert + assumptions-expert
      on threshold defaults). One commit. Tree green at end.
    status: pending
    depends_on: [cycle-6-cli-files-commits]
  - id: cycle-8-precommit-hook
    content: >
      Cycle 8: Add husky pre-commit hook step invoking `pnpm
      practice:fitness:branch --format=summary` (single-line output).
      Advisory at all bands; never blocks. Output format keeps to one
      line per signal class to respect ~80k reliable-context budget.
      Reviewer dispatch (code-expert + security-expert for hook
      boundary + assumptions-expert on hook-output budget). One commit.
      Tree green at end.
    status: pending
    depends_on: [cycle-7-cli-soft-thresholds]
  - id: cycle-9-prepush-hook
    content: >
      Cycle 9: Add husky pre-push hook step invoking CLI. Advisory at
      SOFT/HARD; CRITICAL behaviour deferred to owner-resolved gap-
      question 1 (advisory vs blocking). Hook emits comms event tagged
      `branch-fitness` on every push so the marshal-monitoring surface
      sees fitness signal regardless of push-authz path. Reviewer
      dispatch (code-expert + security-expert + assumptions-expert).
      One commit. Tree green at end.
    status: pending
    depends_on: [cycle-8-precommit-hook]
  - id: cycle-10-pr-observer
    content: >
      Cycle 10: PR-state observer as a thin shim — `gh pr checks --watch
      --fail-fast` already streams check transitions per
      assumptions-expert verdict 2026-05-24. Cycle 10 ships the ≤30-LOC
      wrapper that pipes `gh pr checks --watch` JSON into a comms-event
      emitter tagged `pr-state-changed` (per ADR-183 namespace; not a
      new CLI workspace). Lives at `agent-tools/src/pr-watch/`. Zod
      schema validates `gh` JSON before emission per ADR-003 + ADR-032.
      Test-first against mocked `gh` shell output. Reviewer dispatch
      (code-expert + test-expert). One commit. Tree green at end.
    status: pending
    depends_on: [cycle-9-prepush-hook]
  - id: cycle-11-sonar-observer
    content: >
      Cycle 11: Sonar-state observer as a sibling polling loop under
      the same `agent-tools/src/pr-watch/` module. SonarCloud has no
      native --watch on PR quality-gate, so this is a real poller.
      Verify endpoint shape via sonarqube MCP tool first; do not assume.
      Emit comms events tagged `sonar-state-changed` (per ADR-183) on
      transitions. **Independent failure paths mandatory** (Betty
      2026-05-24): PR-state polling MUST continue to emit if Sonar
      polling errors, and vice versa. Zod-schema-validated boundary
      per ADR-003 + ADR-032. Reviewer dispatch (code-expert +
      assumptions-expert + security-expert for Sonar-token boundary).
      One commit. Tree green at end.
    status: pending
    depends_on: [cycle-10-pr-observer]
  - id: cycle-12-marshal-integration
    content: >
      Cycle 12: Marshal-cycle integration — emit comms event tagged
      `branch-fitness` summarising current branch fitness on each
      marshal commit. Establishes the marshal-monitoring surface
      named in napkin 🔆 HIGHLIGHT. Reviewer dispatch (architecture-
      expert-fred on marshal-role-boundary impact + assumptions-
      expert). One commit. Tree green at end.
    status: pending
    depends_on: [cycle-7-cli-soft-thresholds]
  - id: cycle-13-adr-push-authz
    content: >
      Cycle 13: Author ADR-NNN (push-authz policy) + enforcement.
      **Policy text in new ADR; enforcement code as `--gate` CLI flag
      on branch-fitness CLI; thin `.husky/pre-push` wrapper only**
      (Fred 2026-05-24: policy logic must not live in `.husky/` shell
      scripts per ADR-121 thin-wrapper pattern).
      **Fail-closed contract MANDATORY** (Betty 2026-05-24): if the
      fitness CLI errors during push-authz evaluation, the precondition
      MUST be treated as unresolved (push blocked), not as implicit-OK.
      Codifies when push is implicitly authorised (default candidate:
      green local
      gates + green branch-fitness + reviewer-approved + within
      SOFT/HARD bounds) vs when it requires explicit owner authz
      (default candidate: over CRITICAL threshold OR atomic-M1-pause-
      class OR push to main). Depends on owner-resolved gap-question 4
      (push-authz moves with this protocol or stays owner-gated).
      Reviewer dispatch (docs-adr-expert + architecture-expert-fred +
      architecture-expert-wilma for adversarial push-safety + security-
      expert). One commit. Tree green at end.
    status: pending
    depends_on: [cycle-2-pdr-doctrine]
  - id: cycle-14-pdr-marshal-evolution
    content: >
      Cycle 14: Author PDR-NNN (marshal role per-worktree shape).
      Resolves the marshal-monitoring extension as the same artefact
      as branch-fitness viewed from the role-evolution angle. Three
      candidate shapes named in napkin: per-worktree marshal,
      self-marshal-with-cross-worktree-discovery, dissolves-into-
      hook-driven-gates-plus-monitoring-role. **Betty 2026-05-24
      verdict: shape (c) dissolves-into-hooks+monitoring-role has best
      cohesion + decoupling + change cost; carry this as starting
      hypothesis.** **Fred 2026-05-24: brief must first answer
      PDR-027-amendment-vs-new-PDR question — marshal as role
      attribute on existing identity tuple does NOT expand PDR-027;
      worktree-scoped identities WOULD expand PDR-027 and require
      amendment instead of new PDR.** Reciprocal-amendment
      enumeration (per docs-adr-expert verdict 2026-05-24): PDR-063
      (mid-cycle-retirement), PDR-064 (coordinator-two-moments),
      PDR-071 (coordinator-allocates-without-gating), PDR-080
      (coordination-event-absorption-signal-driven). Owner-resolved
      gap-questions 5 + 7 + 8 + 9 feed the decision. Reviewer dispatch
      (docs-adr-expert + architecture-expert-fred + architecture-
      expert-betty + assumptions-expert). One commit. Tree green at end.
    status: pending
    depends_on: [cycle-2-pdr-doctrine, cycle-12-marshal-integration]
  - id: cycle-15-observation-window
    content: >
      Cycle 15: SOFT-only observation window — define exit criteria
      for HARD/CRITICAL escalation decision (e.g., ≥10 push events
      with fitness signal recorded; ≥3 PRs landed under the new
      cadence; signal recorded for variance analysis). Add observation
      log surface at `.agent/state/branch-fitness/observation-log.md`
      with entry-per-push schema. Reviewer dispatch (assumptions-
      expert on observation-design proportionality). One commit. Tree
      green at end.
    status: pending
    depends_on: [cycle-9-prepush-hook, cycle-12-marshal-integration]
  - id: cycle-16-threshold-escalation
    content: >
      Cycle 16: Empirical threshold-escalation decision cycle. Run
      `pnpm practice:fitness:branch --analyse-observation-log` to
      surface SOFT-band exceedance frequency + reviewable-LOC
      distribution + push-payload distribution. Owner-resolved
      decision on escalating SOFT → HARD (advisory red) and
      introducing CRITICAL (blocking, gap-question 1). Update
      thresholds in ADR-NNN amendment. Reviewer dispatch (docs-adr-
      expert + assumptions-expert on empirical-evidence sufficiency).
      One commit. Tree green at end.
    status: pending
    depends_on: [cycle-15-observation-window]
---

# Branch Fitness And Push Cadence — Small-PR Enabling Protocol

**Lifecycle**: `current/` (Cycle 1 substrate capture opened; pending
validation and marshal/commit disposition before completion).
**Lane**: executable plan with TDD cycles.
**Collection**: `agentic-engineering-enhancements`.
**Author**: Mistbound Hiding Threshold / claude / claude-opus-4-7 / `0e27cc`
(commit marshal, branch-fitness-plan author).
**Date authored**: 2026-05-24 (post-compaction-5, post-M1-merge resume).

## End goal

PRs become **small enough to be reviewable by humans and simple to
reason about**, with **automated fitness measurement** providing SOFT/
HARD/CRITICAL feedback on every commit and push, enabling **many
small PRs landing in parallel** through the worktree model. The
protocol shifts the repo from the M1-Pause shape (bursty 50+-commit
trunk pushes; 93-file bundles) to a small-PR-default shape where
every PR has empirical fitness data driving its review tractability.

## Mechanism — why these means produce the goal

1. **Measurement before enforcement** — a CLI surfaces the metric
   first. Without empirical data, threshold defaults are
   invent-from-thin-air (violates `feedback_no_moving_targets_in_permanent_docs`).
   Cycles 4–7 ship the CLI at SOFT-only; HARD/CRITICAL escalation is
   a separate empirical decision (Cycle 16).
2. **Two axes resolve the source-vs-substrate ambiguity** —
   reviewable-LOC counts only source files (the actual human-review
   surface); push-payload counts everything (the real publication
   cost). Single-axis collapses the two failure modes ("substrate
   churn inflates the metric" and "source bloat hides behind small
   total LOC") into one ambiguous signal.
3. **Hooks at both boundaries** — pre-commit surfaces fitness as
   commit-pressure signal so authors see the size accumulating;
   pre-push is the publication gate where SOFT/HARD/CRITICAL feedback
   has real effect. Pre-commit ALONE misses the
   composition-across-commits accumulation; pre-push ALONE misses the
   early-warning that lets authors slice before the branch is large.
4. **Observers feed the marshal-monitoring surface** — `pnpm pr:watch`
   polling `gh pr checks` + SonarCloud emits state-changes to comms.
   This makes PR-state and Sonar-state visible across the team without
   each agent polling, and gives the marshal seat the
   downstream-of-marshal-cycle signal it needs to fulfil the
   monitoring extension named in napkin 🔆 HIGHLIGHT.
5. **Push-authz policy decouples push-frequency from owner-attention** —
   the current shape requires owner authz for every push (bursty
   batching is the symptom, not the goal). A policy ADR codifying
   implicit push-authz under green-gates conditions removes the
   coordination cost without removing the safety net (CRITICAL
   threshold + atomic-pause-class remain explicit-owner).
6. **Marshal-role evolution PDR resolves the bottleneck risk** —
   marshal-as-singleton-serialiser is right for multi-writer index
   races in one worktree; it is wrong for many-small-PRs-in-parallel.
   The role's value must move from "serialise" to "observe + signal";
   the marshal-monitoring surface is where the role retains value
   under the new shape.

## Direct moves (owner-direction analysis-forced, not menus)

Per `feedback_no_question_when_answer_is_forced` and `feedback_no_cheap_cure_option`,
when first-principles analysis leaves only one defensible option,
this plan commits directly rather than surfacing as a menu:

- **Substrate is excluded from reviewable-LOC, included in push-payload**.
  Substrate is not line-by-line reviewed (`.agent/state/collaboration/comms/*.json`
  are append-only event records; `.agent/memory/active/napkin.md` is
  a working buffer). Counting them in reviewable-LOC would inflate
  the metric in ways that do not predict human-review effort.
  Counting them in push-payload is correct because push cost is real.
- **The metric is per-PR**. PRs are the unit of review and the unit of
  merge. Per-worktree is a measurement implementation detail; per-
  branch is ambiguous in a multi-worktree world (per napkin
  ultrathink); per-PR is the unambiguous unit aligned with owner
  intent ("PRs small enough to be easily reviewed").
- **SOFT-only initial ship**. Analogous precedent: `feedback_new_eslint_rules_start_warn`
  ("new ESLint rules start at warn; escalation to error is a separate
  decision after stability + violation surface managed"). Same
  doctrine here — ship measurement, gather empirical signal, escalate
  with evidence.
- **Marshal seat surfaces fitness on every commit**. Named directly
  by owner in napkin 🔆 HIGHLIGHT direction. Cycle 12 implements.
- **Hook output is one line per signal class**. Constrained by the
  ~80k reliable-context budget (per memory `project_80k_reliably_loaded_context_budget`)
  and `feedback_hook_failures_are_questions` ("hook output is a
  question not a nag; threshold framing matters").

## Open architectural decisions (owner sidebar required)

### Proportionality tension (added 2026-05-24 per assumptions-expert)

**3-cycle minimum-shippable vs 16-cycle full-protocol** — open
architectural question for owner:

- **assumptions-expert verdict** (2026-05-24): the proportional shape
  is **3 cycles maximum** — measurement CLI advisory only (no
  thresholds), pre-push observer-hook emitting one comms-event tag,
  observation window. **Defer all PDR/ADR doctrine to a separate
  downstream plan once empirical evidence exists from those 3 cycles.**
  Reasoning: invent-from-thin-air doctrine without empirical signal
  inflates the plan; doctrine downstream of evidence is the
  first-principles correct sequencing.
- **docs-adr-expert + Fred + Betty verdict**: 16-cycle structure is
  workable with corrections (already applied above). Doctrine before
  code is also defensible — PDR + ADR constrain implementation.
- **Owner direction substance**: "create protocols and guidance" —
  implies doctrine is in-scope.

**Plan author position (Mistbound)**: the assumptions-expert critique
is genuine first-principles input. Owner decides between
(a) ship 3 cycles, defer doctrine (assumptions-expert verdict);
(b) ship 16 cycles as revised (current shape).

### Nine gap-questions

These nine gap-questions require owner-only decisions before Cycles 9,
13, and 14 can complete. The plan can ship Cycles 1–8 and 10–12
independently; the dependent cycles will block until resolved.

| # | Question | Affects | Default if owner-silent |
|---|----------|---------|--------------------------|
| 1 | Is CRITICAL blocking or advisory? | Cycle 9 pre-push gate; Cycle 16 escalation | Advisory (cheaper rollback; `--no-verify-requires-fresh-authorisation` provides safety net) |
| 2 | Do substrate writes count toward push-payload axis as a SEPARATE band, or are they invisible to thresholds? | Cycles 5, 7 threshold semantics | Substrate counts toward push-payload axis WITHOUT triggering its thresholds; only its volume is surfaced |
| 3 | Is the metric per-worktree-HEAD vs branch-vs-main vs branch-vs-PR-base? | Cycles 6, 12 measurement boundary | branch-vs-PR-base (the unit owner cares about reviewing); override flag for branch-vs-main |
| 4 | Does push-authz policy move with this protocol or stay owner-gated separately? | Cycle 13 ADR scope | **EXPLICIT-OWNER-ONLY** (no silent default; assumptions-expert 2026-05-24: push-authz is security-boundary doctrine; silently expanding trust-boundary on owner-silent is not defensible) |
| 5 | Does Commit Marshal role transform (single role, expanded scope) or split (Marshal + PR Observer)? | Cycle 14 PDR shape | Single role with expanded scope; PR Observer is a sub-responsibility, not a separate role |
| 6 | ~~Retroactive M1 application?~~ | ~~Cycle 9 hook behaviour~~ | **DIRECT MOVE (no question): forward-only**. M1 Safe Pause push was the protocol's enabling condition; preceding it cannot violate the protocol. Defensible-on-analysis-alone per assumptions-expert 2026-05-24. |
| 7 | If marshal-owned PR-state monitoring: does marshal seat hold across entire push-cycle (commit → push → PR-merged → CI-green → Sonar-green)? | Cycle 14 PDR boundary | Marshal seat holds through PR-merged; CI-green + Sonar-green observed by the observer but not blocking marshal seat |
| 8 | How does marshal-monitoring surface differ between single-canonical-branch (current) and many-small-PRs-parallel (target)? | Cycle 14 PDR shape | Single-branch case: marshal seat fires once per commit; parallel case: per-worktree marshal seat with cross-worktree fitness aggregation at branch-fitness CLI level |
| 9 | What's the observation-window duration / push-count exit criterion for Cycle 15 → Cycle 16 transition? | Cycle 15 acceptance criteria | 14 calendar days OR 20 push events with fitness data, whichever fires first |

Default-if-silent captures the direction the plan assumes if owner
does not explicitly resolve. Owner has the option to confirm-default
("ship with the defaults") or override any subset.

## Acceptance criteria

### Plan-level acceptance (executable)

- All 16 todos `complete`.
- One commit per cycle; tree green at end of each cycle (validated
  by canonical aggregate gate per `quality-gates.md`).
- All cycles' addressable acceptance ids proven via the named proof
  level (unit / integration / e2e / value-proxy / non-code).

### Cycle-level acceptance (per-cycle highlights)

| Cycle | Acceptance signal | Proof level |
|---|---|---|
| 1 | Thread record exists; repo-continuity row present; napkin Capture H pointer updated | non-code |
| 2 | PDR-NNN landed; reviewer verdicts attached; cross-refs from existing PDR-018 (planning discipline) | non-code |
| 3 | ADR-NNN landed; reviewer verdicts attached; threshold defaults cited with sources | non-code |
| 4 | `pnpm practice:fitness:branch` exists; JSON schema test passes | unit |
| 5 | Two-axis fixture test passes | unit |
| 6 | Files-touched + commits-ahead fixture test passes | unit |
| 7 | SOFT-band threshold output fixture test passes | unit |
| 8 | Pre-commit hook installed; husky integration test passes | integration |
| 9 | Pre-push hook installed; husky integration test passes; comms event emitted on push | integration + value-proxy |
| 10 | `pnpm pr:watch` emits PR-state-changed comms event on transition | integration |
| 11 | Sonar-state observer emits sonar-state-changed comms event on transition | integration |
| 12 | Marshal-cycle emits branch-fitness comms event on commit | value-proxy |
| 13 | Push-authz ADR landed; reviewer verdicts attached | non-code |
| 14 | Marshal-evolution PDR landed; reviewer verdicts attached; gap-questions 5/7/8/9 resolved | non-code |
| 15 | Observation log surface exists; entry-schema documented | non-code |
| 16 | Threshold-escalation decision recorded as ADR-NNN amendment; empirical evidence cited | non-code |

### Proof contract for `DECISION-COMPLETE` verdict

The plan reaches `DECISION-COMPLETE` when:

1. All 16 cycles' acceptance ids are proven at named proof level.
2. Readiness reviewers (assumptions-expert + docs-adr-expert +
   architecture-expert-fred) have attached verdicts on the
   doctrine cycles (2, 3, 13, 14).
3. The Cycle 16 threshold-escalation decision has been recorded
   (decision OR explicit "remain at SOFT-only" verdict with
   empirical evidence).

## Prerequisite classification

| Prerequisite | Class | Notes / minimum shippable shape without |
|---|---|---|
| Worktree-isolation reinforcement | **blocking for parallel cycle claims** (revised 2026-05-24 per assumptions-expert + Betty) | Per memory `feedback_worktree_isolation_unreliable` — "**prefer sequential dispatch**". The plan now collapses parallel branches to serial by default; parallel cycle claims require explicit worktree-base verification first. Cycle 14 PDR cites the constraint as a separate work item. |
| Owner resolution of 9 gap-questions | beneficial | Plan ships with defaults for all 9; owner override at any point amends specific cycles. Cycle 9 (CRITICAL behaviour) and Cycles 13–14 (authz + role) are most directly affected. |
| Existing `pnpm practice:fitness` shape understood | blocking | Cycle 4 cannot land without surveying the existing shape per `feedback_check_workspace_packages_before_proposing`. First action of Cycle 4 is the survey. |
| `gh pr checks` shape | blocking for Cycle 10 | Already-known shape from prior work (cited in Charcoal closeout `2250a91f`). Confirm via build-vs-buy check before bespoke poller. |
| SonarCloud PR-scoped API endpoint shape | blocking for Cycle 11 | Verify via sonarqube MCP tool before bespoke poller (per `feedback_build_vs_buy_first`). |

## Non-goals (YAGNI)

- **Cross-repo branch-fitness aggregation**. This plan is repo-local.
- **GitHub-side automation** (custom GH Actions emitting fitness on
  PR-open). Local hooks + observers are the design surface; GH
  Actions amplification is a future enhancement.
- **AI-driven slicing suggestions**. The CLI surfaces fitness; it
  does not suggest where to slice. Slicing remains a human/agent
  judgement call informed by the metric.
- **Retroactive enforcement on the current branch** (`feat/education-evidence-foundational-graphs`).
  Per gap-question 6 default: forward-only.
- **Replacing the marshal role**. The marshal-evolution PDR (Cycle
  14) expands the role's scope to monitoring; it does not retire the
  role.
- **Independent Sonar quality-gate rule changes**. This plan
  surfaces Sonar PR-state to comms; it does not change Sonar rules,
  thresholds, or exclusions.
- **CI capacity expansion**. Many small PRs may multiply CI minute
  burn; surfacing the cost trade-off is in scope; expanding CI is
  out of scope.
- **PR-template changes** or **PR-review-routing changes**. Scope
  is fitness measurement + monitoring; review process changes are
  a separate plan.

## Foundation alignment (revised 2026-05-24 per docs-adr-expert + Fred)

### Existing PDRs cited (verified to exist in repo)

- `PDR-018-planning-discipline.md` — plan-vs-ADR-vs-PDR separation;
  this plan delegates doctrine to PDR/ADR cycles.
- `PDR-019-adr-scope-by-reusability.md` — PDR-vs-ADR portability
  distinction (replaces incorrect prior reference to non-existent
  PDR-079).
- `PDR-027-threads-sessions-and-agent-identity.md` — identity tuple;
  Cycle 14 marshal-evolution PDR must clarify role-attribute-vs-
  identity-dimension boundary (Fred verdict).
- `PDR-063-mid-cycle-retirement-protocol.md` — marshal mid-cycle
  retirement; Cycle 14 reciprocal-amendment candidate.
- `PDR-064-coordinator-handoff-two-moments.md` — coordinator handoff;
  Cycle 14 reciprocal-amendment candidate.
- `PDR-066-comms-events-as-failure-mode-channel.md` — Cycle 9 emits
  branch-fitness comms event; doctrine alignment.
- `PDR-067-surface-classification-for-fitness-response.md` — directly
  governs the substrate-excluded-from-reviewable-LOC decision.
- `PDR-071-coordinator-allocates-without-gating.md` — closest analogue
  for marshal-as-observer shape; Cycle 14 reciprocal-amendment
  candidate.
- `PDR-080-coordination-event-absorption-is-signal-driven.md` —
  Cycle 12 marshal-cycle integration alignment.

### Existing ADRs cited (verified to exist in repo)

- `013-husky-and-lint-staged.md` — hook substrate (Cycles 8, 9).
- `032-external-boundary-validation.md` — Zod at gh/Sonar API
  boundaries (Cycles 10, 11) (also `003-zod-for-...`).
- `041-workspace-structure-option-a.md` — CLI placement in
  `agent-tools/`, not packages/libs/ (Cycle 4 fix).
- `117-plan-templates-and-components.md` — document-hierarchy
  discipline.
- `121-quality-gate-surfaces.md` — pre-commit + pre-push surface
  contract; Cycles 8 + 9 alignment.
- `167-hook-execution-failures-must-be-observable.md` — Cycles 8, 9
  hook design.
- `182-mid-cycle-handoff-record-substrate.md` — Cycle 14
  marshal-evolution context.
- `183-comms-event-tag-namespace-substrate.md` — Cycles 9, 10, 11, 12
  emit new comms-event tags conforming to ADR-183.

### Directives

- `.agent/directives/principles.md` — first-principles before
  inherited shape (Cycle 14 marshal-evolution PDR re-derives the
  role from first principles).
- `.agent/directives/testing-strategy.md` — test-first cycles
  (Cycles 4–11); atomic-landing invariant.
- `.agent/directives/schema-first-execution.md` — CLI output is
  Zod-schema-validated JSON; hook input/output schemas defined
  before implementation.

### Corrections to prior plan-body text

- Prior text referenced "PDR-079" — **does not exist**; corrected to
  PDR-019 (PDR-vs-ADR portability distinction).
- Prior text referenced "ADR-186" + "ADR-187" — **do not exist**;
  highest current ADR is 185. References removed.

## Plan-body first-principles check (per `.agent/rules/plan-body-first-principles-check.md`)

Per the cited rule, before executing plan-prescribed tests or
doctrine, the plan body must surface where the rule fires:

- **Shape clause fires**: at Cycle 4 (CLI scaffold) — confirm the
  measurement shape is the right shape before adding axes. If the
  CLI surface is wrong (e.g., the existing `pnpm practice:fitness`
  shape suggests a different extension point), revise before
  proceeding to Cycle 5.
- **Landing-path clause fires**: at Cycle 8 (pre-commit hook) and
  Cycle 9 (pre-push hook) — confirm husky is the right landing
  surface; explicit decision-point for git native hooks vs husky
  vs lefthook before implementing.
- **Vendor-literal clause fires**: at Cycle 10 (gh pr checks) and
  Cycle 11 (SonarCloud) — confirm vendor APIs work as cited before
  building bespoke poller (per `feedback_build_vs_buy_first` and
  `feedback_platform_features_check_official_docs`).

## Readiness reviewers (per oak-plan SKILL §11)

Dispatched in parallel after plan draft (not now; on plan-readiness
verdict moment per PDR-018):

- **assumptions-expert** — plan-readiness/proportionality:
  is the 16-cycle sequence proportionate to the impact? Are
  prerequisite classifications honest? Are the 9 gap-question
  defaults defensible? Is "ship at SOFT-only" the right minimum
  shippable shape, or under-/over-scoped?
- **docs-adr-expert** — PDR/ADR landings (Cycles 2, 3, 13, 14):
  do the planned PDR/ADR shapes align with PDR-018 + ADR-117
  hierarchy? Are cross-refs appropriate? Are any of these better
  shaped as amendments to existing PDRs/ADRs vs new records?
- **architecture-expert-fred** — boundary discipline:
  does the CLI live in the right workspace? Are hooks in the right
  layer (husky vs git-native)? Does the observer cross any
  boundaries it shouldn't? Does the marshal-evolution PDR respect
  existing architectural ADRs (especially around dependency
  injection and ports/adapters)?
- **architecture-expert-betty** — systems-thinking trade-off for
  Cycle 14 (marshal-evolution): per-worktree marshal vs
  self-marshal-with-discovery vs dissolves-into-hooks. Which
  trade-off has the best long-term change cost?
- **architecture-expert-wilma** — adversarial review of Cycle 13
  push-authz: failure modes of implicit-authz (token theft scenario,
  CRITICAL-bypass scenario, cross-worktree race scenario,
  branch-fitness-CLI-failure-during-push scenario).
- **security-expert** — hook boundary (Cycles 8, 9), Sonar-token
  boundary (Cycle 11), push-authz boundary (Cycle 13). Hooks and
  push-authz are trust boundaries.
- **code-expert** — gateway review at each implementation cycle
  (4–11); will fan to specialists per code-expert doctrine.
- **test-expert** — test-first verification at each TDD cycle (4–11);
  enforce atomic-landing invariant.

## Risks

| Risk | Likelihood | Severity | Mitigation |
|---|---|---|---|
| Threshold defaults wrong; cause friction at SOFT band | Medium | Low | SOFT-only initial; Cycle 15 observation window; Cycle 16 empirical escalation. Documented as `feedback_new_eslint_rules_start_warn` precedent. |
| Hook output verbose; eats context budget | Low | Medium | One-line-per-signal-class constraint baked into Cycle 7/8 acceptance; verified by reviewer. |
| Pre-push hook adds latency to every push | Medium | Low | CLI runs branch-fitness measurement against local git state only (no network); target <500ms. Measured in Cycle 9 acceptance. |
| Marshal-role transformation surfaces conflicts with PDR-027 / PDR-064 | High | Medium | Cycle 14 PDR includes explicit "reciprocal amendments" section per existing pattern (Seaworthy's tidy plan Cycle 8). Reviewer dispatch includes docs-adr-expert specifically for this. |
| Worktree-isolation unreliability undermines parallel premise | High | High | Acknowledged in plan body; Cycle 14 PDR cites the constraint; separate work item for worktree-isolation reinforcement named as beneficial prerequisite. |
| `gh pr checks` rate limit hit by frequent poller | Low | Low | Poller default 30s interval; configurable; respects gh's native rate-limit headers. |
| SonarCloud token scope insufficient for PR-scoped API | Medium | Medium | Cycle 11 first action: verify token scope via sonarqube MCP. If insufficient, fall back to project-scoped polling with PR-extracted summary. |
| CI capacity multiplier from many-small-PRs | High | Low | Surfaced as named risk in PDR; mitigation deferred to separate CI-capacity plan; the cost trade-off is recorded, not solved by this plan. |
| Hook-bypass culture under SOFT-band nag pressure | Medium | High | SOFT-band output is informative not nagging (one-line summary, not multi-line; explicit `feedback_hook_failures_are_questions` framing). Bypass requires `--no-verify` which is fresh-authz per existing rule. |

## Lifecycle triggers

Per `.agent/plans/templates/components/lifecycle-triggers.md`:

- **Plan promotion** `current/` → `active/`: triggered when Cycle 1
  is opened (substrate capture).
- **Cycle landing**: each cycle is a landing unit; emits comms
  event tagged `cycle-landed` summarising the cycle's substance.
- **Mid-cycle pause**: if owner direction interrupts, cycle pauses
  at next clean commit boundary; resume contract recorded per
  PDR-064 two-moments shape.
- **Plan archival**: after Cycle 16 lands AND the threshold-
  escalation ADR amendment is in effect AND the observation log
  shows ≥1 stable observation window, plan moves to `archive/`
  per ADR-117. Permanent documentation: PDR + 2 ADRs + observation-
  log surface.
- **Learning loop**: post-archival consolidation per oak-plan SKILL §12
  — graduate any patterns surfaced during execution to
  `pending-graduations` register.

## Sequencing (revised 2026-05-24 per Betty + assumptions-expert)

**Default sequencing is fully serial** (1 → 16) under unresolved
worktree-isolation risk. Parallel cycle claims are an opt-in
optimisation that requires explicit worktree-base verification first
per `feedback_worktree_isolation_unreliable`. The cycles' file-scope
is naturally non-overlapping, so parallel dispatch is *safe* in
principle but currently *not load-bearing* (per Betty 2026-05-24:
"serial execution is adequate and removes the risk entirely…
parallelisation is an optimisation, not a load-bearing precondition").

`depends_on` in YAML frontmatter is now ascending-numeric serial,
removing the prior parallel-branch claims (cycles 10, 12, 13
previously branched from earlier cycles; revised to depend on the
immediately-prior cycle for sequential dispatch).

## Source substrate trail

The substrate this plan operates on:

- **Thread record** at
  `.agent/memory/operational/threads/branch-fitness-and-push-cadence.next-session.md`
  — Cycle 1 extracted home for Capture H and the marshal-monitoring highlight.
- **Archived source window** at
  `.agent/memory/active/archive/napkin-2026-05-24-pelagic-hard-napkin-window.md`
  lines 70–286 — verbatim outgoing active-napkin evidence for Capture H and the
  marshal-monitoring highlight. The archive is evidence, not the knowledge
  home.
- **Active napkin disposition index** at `.agent/memory/active/napkin.md` —
  current pointer explaining that Capture H routes through the thread record and
  this executable plan.
- **Memory cross-refs**: `feedback_build_vs_buy_first`,
  `feedback_all_quality_gates_blocking_always`,
  `feedback_new_eslint_rules_start_warn`,
  `feedback_no_moving_targets_in_permanent_docs`,
  `feedback_worktree_isolation_unreliable`,
  `feedback_hook_failures_are_questions`,
  `feedback_no_cheap_cure_option`,
  `feedback_no_question_when_answer_is_forced`,
  `feedback_long_term_architectural_excellence_is_always_the_answer`.

## Inline metacognition pass (per `/oak-metacognition`)

Applying the four-question reflection:

1. **What did I inherit here?** The 16-cycle linear-sequence shape of
   Seaworthy's `post-m1-attestation-tidy-up.plan.md` as template
   structure; the SOFT-only-initial discipline from
   `feedback_new_eslint_rules_start_warn`; the build-vs-buy discipline
   from `feedback_build_vs_buy_first`; the substrate-pointer-pattern
   from prior work.
2. **Has the inherited shape been ratified from first principles?**
   Mostly yes, with one tension: Seaworthy's 16-cycle shape is
   sequential by owner direction ("highly focussed, highly linear");
   this plan is parallelisable where work allows. The structural
   similarity is in *cycle granularity*, not in *sequencing*. The
   plan flags parallel branches explicitly to honour the work shape
   the owner pointed at ("many small PRs in parallel"). Verdict:
   structure inherited intentionally; sequencing re-derived from
   first principles.
3. **Does the shape still fit the impact the owner asked for?** The
   owner asked for *protocols + guidance + measurement + hook + soft/
   hard/critical bands + many small PRs in parallel*. The plan ships:
   protocols (PDR Cycle 2), guidance (the plan body itself + ADR
   Cycle 3), measurement (CLI Cycles 4–7), hook (Cycles 8–9), soft/
   hard/critical bands (CLI Cycle 7 + escalation Cycle 16), many
   small PRs in parallel (push-authz ADR Cycle 13 + marshal evolution
   PDR Cycle 14). All five owner-named substance items covered.
4. **What is the bridge from my next action to that impact?** Next
   action is Cycle 1 (substrate capture). Bridge: substrate-in-thread-
   record makes the work discoverable across canonical surfaces
   (per Charcoal's discoverability fix surface-multiplicity pattern);
   substrate-discoverable enables team dispatch; team dispatch makes
   the 16 cycles land at small-PR granularity; small-PR granularity
   *is* the owner-impact. No skipped step in the bridge.

**Insight surfaced by the pass**: the plan's own existence is the
first worked-instance of the protocol it ships. Authoring this plan
under the M1-bundle shape (large absorption commit) was the M1
boundary; landing this plan + its 16 cycles is the *transition*
to the new shape. Each cycle is itself a small-PR-shaped commit
landing one substance unit. The plan is meta-recursive: it ships
the protocol by *being* the protocol.

### Re-pass 2026-05-24 (per assumptions-expert verdict: original pass failed "not a recap" bar)

Original pass confirmed everything ("Lock in"); a genuine pass
surfaces tensions. Surfacing now:

1. **Inherited shape tension**: I inherited "doctrine-before-code" as
   default (PDR/ADR cycles 2–3, 13–14 sequenced before implementation
   cycles 4–11). assumptions-expert proposes "code-before-doctrine"
   (3-cycle shippable; doctrine downstream of evidence). I did NOT
   re-derive doctrine-before-code from first principles — I assumed
   it. **Tension stands; surfaced as open architectural question
   above.**
2. **Inherited substrate citation tension**: I cited napkin lines
   67–281 as load-bearing source. Pelagic curated the napkin mid-
   authoring; the citations became stale. A genuine pre-action
   metacognition pass would have noticed that "load-bearing source
   substrate" + "live curation claim on the same surface" is a race
   condition I had not designed against. **Tension resolved: Pelagic
   absorbed the substrate into the durable thread record + archive;
   plan now points to durable surfaces (per the Source substrate
   trail section).**
3. **Inherited proportionality assumption**: I inherited Seaworthy's
   16-cycle shape because it was visually load-bearing template
   precedent. I did NOT re-derive cycle count from the work-shape
   first principles. assumptions-expert called this directly:
   "structurally inflated… 3 cycles maximum" as alternative shape.
   **Tension surfaced; for owner decision.**
4. **Inherited reviewer-trust assumption**: I dispatched 4 reviewers
   and treated their verdicts as cumulative findings. assumptions-
   expert's substrate-citation-gap (Critical #1) showed reviewers can
   also catch what the author missed by checking primary sources I
   skipped. This is a *strengthening* of the practice, not a tension.

**Verdict: revision triggered.** The plan body is amended at
§"Open architectural decisions" to surface the 3-cycle-vs-16-cycle
proportionality question explicitly; Cycle 4 workspace fixed;
Cycles 10/11/13/14 reviewer-driven; foundation cross-refs corrected;
sequencing collapsed to serial; GQ-4 promoted to explicit-owner-only;
GQ-6 promoted to direct move; worktree-isolation reclassified as
blocking. Marshal-cycle absorption awaits tree-green window.

## Promotion trigger for `active/` move

This plan moves from `current/` to `active/` when:

1. Owner confirms or amends the 9 gap-question defaults.
2. Cycle 1 (substrate capture) is opened by an implementer.

Pelagic opened Cycle 1 on 2026-05-24 under claim
`7e990bf5-8e6e-45ea-9d8a-9b4a457a044d` by extracting the napkin substrate into
the thread record and adding the repo-continuity row. Leave the plan in
`current/` until validation and marshal/commit disposition prove the cycle
complete.

— END —
