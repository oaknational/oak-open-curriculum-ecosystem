---
fitness_line_target: 500
fitness_line_limit: 750
fitness_char_limit: 150000
fitness_line_length: 300
lifecycle_model: 'queue — empties as substance graduates; depth proportional to cross-session-wait accumulation, not to file-permanence concerns'
access_pattern: 'consolidation-pass-only — read at consolidations and drain sessions; not loaded every session by every agent'
split_strategy: 'Graduate items to PDRs/ADRs/rules/permanent docs; archive resolved items to dated archive snapshots; keep pending and recently-graduated items here'
fitness_rationale: 'Limits calibrated to working queue depth (currently ~86 entries × ~12-25 lines/entry, with index + per-entry metadata + schema preamble headroom), not to a permanent-doc shape. Raised 2026-05-07 (Pelagic Rolling Harbour) per owner direction: principles.md is loaded every session and must stay small; this register has a fundamentally different access rhythm — multi-session cross-wait accumulation under cross-session-wait pressure — and its limits should reflect that lifecycle. Recalibration is the substance-led structural fix per the substance > destination boundary.'
merge_class: mostly-append-register
---

# Pending-Graduations Register

The structured queue of doctrine candidates awaiting graduation per
the capture → distil → graduate → enforce pipeline (ADR-150, PDR-011).
Each entry carries `captured-date`, `source-surface`,
`graduation-target`, `trigger-condition`, and `status`.

Items with `status: due` or `status: overdue` are the primary
graduation candidates for the next consolidation pass. Items with
`status: pending` are reviewed at each consolidation to see whether
their trigger condition has fired since last consolidation. Items
with `status: graduated` are kept here briefly for audit trail before
being archived to `archive/repo-continuity-session-history-*.md`.

This register lives in its own file (split out from
`repo-continuity.md` § Deep Consolidation Status on 2026-04-30 by
Briny Lapping Harbor under owner direction, when accumulated rich
register content was contributing the bulk of repo-continuity's
HARD fitness state). Doctrine references that previously pointed to
`repo-continuity.md § Deep consolidation status` now point here.

## Per-entry metadata schema (2026-05-07)

Each entry carries an inline metadata tag line at the top of its
body (immediately under the bullet's title line). The tag is a
single-line key/value list, pipe-separated, designed for both
human skim and grep navigation. Pre-2026-05-07 entries predate
this discipline and are being backfilled across consolidation
passes; new entries from 2026-05-07 onward MUST carry the tag.

Tag shape:

```text
[captured: YYYY-MM-DD | source: <surface> | target: <type>:<id-or-name> |
 trigger: <type> | size: <S|M|L|XL> | status: <state>]
```

Field definitions:

| Field      | Values                                                                                                                                                        | Meaning                                                                                                                                                                                                                                                                                    |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `captured` | ISO date                                                                                                                                                      | When the candidate was first registered.                                                                                                                                                                                                                                                   |
| `source`   | `napkin` / `experience/<file>` / `comms-log` / `napkin-archive/<file>` / `owner-direction` / `pattern-emergence`                                              | Which capture surface seeded the entry.                                                                                                                                                                                                                                                    |
| `target`   | `pdr:<id-or-draft-name>` / `adr:<id-or-draft-name>` / `rule:<name>` / `pattern:<filename>` / `plan:<plan-name>` / `doc-amend:<doc>` / `multi:<list>` / `none` | Where the substance lands when graduated. `multi:` for entries with mandatory multiple targets. `none` is a sentinel for entries with no graduation target (e.g. quarantined entries pending rethink). Inside `multi:` lists, every component MUST follow the `<type>:<id-or-name>` shape. |
| `trigger`  | `second-instance` / `owner-direction` / `n>=3-validation` / `plan-execution-gated` / `candidate` / `vaporware-gated`                                          | What unblocks promotion. `vaporware-gated` flags structural sequenced-deferral failure shape per `distilled.md` §Sequenced-Deferral Discipline.                                                                                                                                            |
| `size`     | `S` (single small edit) / `M` (multi-file but single artefact) / `L` (multi-artefact, single domain) / `XL` (multi-artefact + cross-domain + directive-shape) | Work-shape at graduation time; informs whether entry can drain opportunistically (`S`) or needs a dedicated session (`L`/`XL`).                                                                                                                                                            |
| `status`   | `pending` / `due` / `overdue` / `partially-graduated` / `graduated` / `quarantined` / `withdrawn`                                                             | Lifecycle state. **Note**: `vaporware-gated` is a `trigger` facet, NOT a `status` value — the index groups vaporware-gated entries separately for navigation while their lifecycle status remains explicit on the entry.                                                                   |

**Composite values**: `source` and `trigger` accept `+`-joined
composites (e.g. `napkin+distilled.md`, `n>=3-validation+owner-implicit`)
when multiple capture surfaces or trigger conditions co-apply, and
parenthetical `(scope)` qualifiers (e.g.
`vaporware-gated(WS11.3-execution)`) to name the specific gate.
The closed-vocabulary tokens above are the building blocks; composite
shapes are honest about real-world multi-source / multi-condition
entries.

Original schema fields (`captured-date`, `source-surface`,
`graduation-target`, `trigger-condition`, `status`) remain valid
inside the entry body for full prose context — the inline tag is
a navigation accelerator, not a replacement.

`consolidate-docs` uses this register as the live queue. Graduated
and merged history is preserved in git and the archived register
snapshots in [`archive/`](archive/) — most recent is
[`pending-graduations-archive-2026-05-06.md`](archive/pending-graduations-archive-2026-05-06.md)
(8 entries: 7 graduated, 1 withdrawn).

## Index

Regenerated 2026-05-12 by Twigged Growing Glade during the conservation-first
pending-graduations consolidation drain. Entries are listed by status then by
captured-date (most recent first). Line numbers are advisory hints; grep by
status field for authoritative position.

Per the [`fabricated-gate-as-avoidance`](../active/patterns/fabricated-gate-as-avoidance.md)
pattern instance, future consolidation passes read each entry's
substance before its inline metadata tag — gate vocabulary is a tag,
not a verdict.

### `due` (current body candidates)

The body contains **0** due entries after the 2026-05-12 conservation-first
drain. The former due items were not compressed or discarded; each now has a
specific disposition below and in its body entry.

### 2026-05-12 due-entry disposition log (Twigged Growing Glade)

| Entry                                                               | Disposition                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getSkillPermissionIssues` dead parameter + missing live-path tests | Retained pending as an implementation cleanup triggered by next touch of `agent-tools/scripts/validate-portability-helpers.ts`; not ADR/PDR-shaped.                                                                                            |
| `shouldInspectFile` single-positive-example coverage                | Retained pending as a focused test-cycle cleanup triggered by next touch of the `validate-fitness-vocabulary` suite; not ADR/PDR-shaped.                                                                                                       |
| Cross-agent sweep-bundling prohibition                              | Retained pending as an owner/implementation decision because PDR-054/PDR-059 and P3 guard work already carry the doctrine backbone; remaining question is harder-to-bypass enforcement across all commit paths.                                |
| R4-new native git pre-commit hook                                   | Retained pending with corrected target: not a native pre-stage hook, because Git/Husky have no native pre-stage lifecycle; the live home is the cost-of-collaboration hard-to-bypass enforcement tail.                                         |
| Commit-queue UX as structural cure surface                          | Retained pending in the cost-of-collaboration P5/P8/P6 tail; P-Foundation/P1-P4 reduced friction but did not settle the full UX doctrine.                                                                                                      |
| Pre-commit hook must gate staged content only                       | Graduated to the completed P0 quality-gate rebalance: staged-only file-content scanners plus preserved whole-repo broken-code guards, recorded in `cost-of-collaboration.plan.md` and `.husky/pre-commit`.                                     |
| Peer-pair sidebar beats coordinator+helpers for design work         | Partially graduated: `agent-collaboration.md` carries the coordinator-role boundary and `inter-agent-sidebar-with-default-action.md` carries a claim-conflict sidebar instance, but the design-collaboration shape still needs a durable home. |

### 2026-05-12 remaining-queue disposition review (Twigged Growing Glade)

After the due queue was emptied, the remaining live entries were reviewed as a
register, not as a compression target. Their content is retained unless an
entry already had a durable home or carried stale lifecycle wording.

| Queue slice                                          | Disposition                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plan- or implementation-gated lanes                  | Retained pending with explicit carrier plans/triggers, including cost-of-collaboration P5/P8/P6, graph-stack follow-ons, SDK codegen workspace decomposition, workspace-topology ADR sequencing, validation/TDD restructure, scripts-validator migration, PR lifecycle, Vercel warning elimination, and older tooling/domain plans.               |
| First-instance or second-instance pattern candidates | Retained pending; the register is the correct waiting room until corroboration, owner direction, or a named implementation slot fires.                                                                                                                                                                                                            |
| Owner-facing decisions                               | Retained pending where the entry asks for an owner choice (for example schema/directory projection choices, topology naming, optionality rule siblings, destructive-operation hook ideas, or generated-insight artefact methodology).                                                                                                             |
| Existing graduated audit trails                      | Kept as audit-trail bodies until the next archive snapshot; stale prose was corrected where it still said `due` or `ready for promotion` despite a resolved home.                                                                                                                                                                                 |
| Stale target/status corrections applied              | Older whole-tree pre-commit gate scope now points at the completed P0 gate rebalance; old CLI first-touch friction now points at PDR-055/ADR-178 plus the cost-of-collaboration lane; observability WS8.6/8.7 and inter-agent protocol prose no longer describe themselves as due; `pending-audit` was normalised to `pending (audit-triggered)`. |

### Status Corrections Applied 2026-05-12

These body entries still carried due metadata, but the register already
records their durable homes in the 2026-05-10 graduation log. This pass only
corrects stale status metadata; it does **not** silently promote new doctrine.

| Entry                                                    | Existing durable home                                                                  |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Agent-tools CLI affordance set + build isolation         | PDR-055 + ADR-178                                                                      |
| No-moving-targets hook tightening                        | `agent-tools/scripts/check-blocked-content.ts` prose-vs-data distinction + rule update |
| Invoke doc-and-onboarding experts on significant changes | `.agent/rules/invoke-doc-and-onboarding-experts-on-significant-changes.md`             |
| Observability orthogonal axes                            | ADR-171 + amendments to ADR-116/143/162/163                                            |
| Inter-agent collaboration protocol gaps                  | PDR-056, preserving hypothesis-status evidence                                         |

### 2026-05-12 graduation log (Secret Vanishing Moth — P3 enforcement handoff)

| Entry                                                         | Graduated to                                                                      | Evidence   |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------- |
| Advisory protocols decay under pressure; enforcement required | `commit-queue guard` implementation + `cost-of-collaboration.plan.md` P3 evidence | `c083a1ab` |

### 2026-05-22 graduation log (Tempestuous Spiralling Thermal — substrate-completion graduation pass)

| Entry                                                 | Graduated to                                                                                                                   | Evidence                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Partial / slice-scoped coordinator transfer           | PDR-064 §"Partial / Slice-Scoped Coordinator Transfer" amendment                                                               | three in-session instances (Flamebright→Ferny, Ferny→Blustery full transfers + Ferny slice-coord assignment); PDR anchors at §Moment 2 and §Cron / cadence boundary now point to the landed amendment                                                                                                          |
| Coordinator-must-delegate-sub-agent-launches          | `start-right-team` SKILL §"Choose Temporary Responsibilities" — _"Coordinator delegates sub-agent launches"_ amendment         | two in-session owner corrections (Ferny on subagent dispatch; Blustery on architecture-expert-fred re-verify self-dispatch); Blustery self-flagged candidate; doctrine target named in original entry                                                                                                          |
| CLI body backtick-shell-substitution cure pattern     | `agent-tools/README.md` §"CLI Norms" → §"Comms body input: `--body` vs `--body-file`" (already-landed substrate at `675bb83b`) | three+ cross-session instances (Cirrus 2026-05-21, Ferny 2026-05-22 event 0ce0b26b, Foamy 2026-05-22 reply --body parse failure); cure mechanism (--body-file flag) shipped in `675bb83b`; README section documents the cure shape                                                                             |
| Hook-policy substring-matching in instructive content | new rule `.agent/rules/hook-policy-substring-discipline.md` + Claude + Cursor adapters + RULES_INDEX entry                     | three+ cross-session instances (Midnight 2026-05-22, Torrid 2026-05-21, Charcoal 2026-05-21, Ferny + Flamebright 2026-05-22); cure (b) — content-authoring discipline using descriptive language — is the portable immediate cure; cure (a) — context-aware hook parsing — remains a separate upstream concern |

### 2026-05-22 graduation log (Wooded Swaying Thicket — substrate-landing graduation pass)

| Entry                                                          | Graduated to                                                                                                                                                                            | Evidence                                                                                                  |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Coordinator-handoff: pre-positioning vs active-acknowledgement | PDR-064 + `start-right-team` SKILL §"Coordinator Handoff (Two Moments)"                                                                                                                 | `c4bacfc5` (SKILL amendment); three in-session instances captured in Foamy 2026-05-22 napkin entry        |
| §1a inherited-tree gate-runner default scope is per-workspace  | `start-right-team` SKILL §1a "Running the gates" (per-workspace promoted to first listed option)                                                                                        | distilled.md 2026-05-21 §"Per-workspace inherited-tree gates are the default for workspace-scoped dirt"   |
| Mid-cycle retirement protocol for token-bounded agents         | PDR-063 + ADR-182 Tranche 1 (handoffs dir + `handoff_record_path` claim field + `mid-cycle-handoff` `message_kind`) + `start-right-team` SKILL §"Mid-Cycle Retirement"                  | `c4bacfc5` (substrate land)                                                                               |
| Grounding-cost amortisation under rotating-cast operation      | PDR-065                                                                                                                                                                                 | Foamy Snorkelling Jetty draft 2026-05-22                                                                  |
| Comms-event stream as real-time failure-mode capture channel   | PDR-066 + ADR-183 Tranche 1 (`tags` array on event kinds; namespace `failure-mode` / `behaviour-note`) + `start-right-team` SKILL §"Real-time failure-mode capture on the comms stream" | `c4bacfc5` (substrate land); ADR-183 Tranche 2 CLI rendering deferred per the ADR's tranche ordering rule |

### `partially-graduated`

2 body entries remain partially graduated: the stage-by-explicit-pathspec
asymmetric-cure entry and the peer-pair design-collaboration sidebar entry. They
are retained because later commit-boundary variants route through PDR-054/PDR-059
plus the live cost-of-collaboration workstreams, while the design sidebar still
needs a durable pattern or directive clause for numbered turns, append-only
shared file, and joint-decision closure.

### `quarantined`

(empty — apply-don't-ask / stop-inventing-optionality reformulations
graduated 2026-05-10 to PDR-057 + PDR-058; quarantine cleared)

### `pending` (~77 body markers — second-instance or owner-direction gated)

The bulk of the queue. Reviewed at every consolidation; most stay
pending until trigger fires. Grep `status: pending` for the full
list; entry-level summary index is intentionally omitted to avoid
duplicating entry-body substance and to keep the index honest as
the queue churns.

### 2026-05-22 — Cycle decomposition that produces wrong-layer scaffolding tests is the load-bearing shape (testing-strategy amendment OR pattern)

`[captured: 2026-05-22 | source: starlit/commit-queue-intent-scope-discipline arc closeout via metacognition pass | target: pattern:where-system-state-is-observable-at-plan-author-time OR amendment:testing-strategy.md-or-tdd-as-design.md | trigger: second instance from a different plan OR owner direction to author | size: S | status: pending]`

Substance summary: the commit-queue-intent-scope-discipline arc was originally decomposed into three TDD cycles each describing an internal seam (Cycle 1.1 record-staged read seam; Cycle 1.2 verify-staged read seam; Cycle 1.3 commit invocation). Each cycle's tests reached past the workflow into the read mechanism, producing implementation-coupled scaffolding tests (`fakeRunGitFor` re-implementing git argv parsing; assertions on argv-derived strings) that violated `testing-strategy.md` §"NEVER create complex mocks" + §"Test real behaviour, not implementation details". The metacognition pass at Cycle 1.3 surfaced that the system state was one state (commit-queue commit honours intent.files scope across peer staging drift) takes one describing surface at the workflow seam, not three at internal read mechanisms. Cycle 1.3 reshape: workflow-level invariants in `commit-workflow.unit.test.ts` via capture-list pattern on injected deps; two scaffolding test files deleted; one cycle of test-and-product co-design where the system state finally gets described at the right layer.

**Underlying pattern**: when planning multi-cycle structural changes, ask at plan-author time **where the system state will be observable**. If the answer is "at one boundary" (e.g. the workflow seam), every cycle's tests should describe that one surface. Intermediate scaffolding tests written for the implementer's confidence in internal-seam correctness do not earn ongoing maintenance cost.

**Cure shape options**:

1. **Pattern candidate**: capture as `.agent/memory/active/patterns/where-system-state-is-observable-at-plan-author-time.md` with the worked instance (commit-queue-intent-scope-discipline arc) and the diagnostic prompt at plan-authoring.
2. **`testing-strategy.md` amendment**: add §"Cycle-decomposition and the describing-surface boundary" naming that scaffolding tests at the wrong layer are an anti-pattern and pointing at workflow-seam capture-list patterns as the cure.
3. **`tdd-as-design.md` amendment**: extend the foundational definition with "one system state takes one describing surface; cycle decomposition must respect that boundary".

**Why pending**: 1 instance, one author, one arc. Second instance from a different plan / different author would confirm the pattern's generality. Owner direction to author can fire earlier.

Falsifiability: a future plan that decomposes into multiple cycles each describing an internal seam, lands scaffolding tests that subsequently need retirement, is the failure mode this entry would cure. A future plan that explicitly identifies the describing-surface boundary at plan-author time and constrains all cycles' tests to that surface is the success.

### 2026-05-22 — "Structurally-identical-new-function" pre-authoring drop pattern (PDR-shaped or skill-amendment-shaped)

`[captured: 2026-05-22 | source: stormbound/commit-queue-intent-scope-discipline plan, Cycles 1.1 + 1.2 | target: pdr-or-skill:structurally-identical-function-pre-authoring-drop | trigger: third instance OR owner direction to author | size: S | status: pending]`

Substance summary: two cycles in a row in the same plan (Cycle 1.1 + Cycle 1.2 of `commit-queue-intent-scope-discipline.plan.md`) planned to introduce a NEW "scoped" variant of an existing function (`createScopedStagedBundleFingerprint`, `verifyScopedStagedBundle`). In both cases, pre-authoring reviewer dispatch (code-expert gateway + type-expert) converged on "structurally identical to the existing function" — the existing function accepts already-scoped data through its existing parameter shape; no new function is required. The scope enforcement is upstream at the staged-read; downstream verify/fingerprint logic doesn't need scope-awareness at all. Both new-function proposals dropped at pre-authoring; both cycles landed simpler than planned.

**Underlying pattern**: when a plan proposes a NEW parallel function (`fooScoped`, `fooV2`, `fooEnhanced`, etc.) that mirrors an existing function's signature, that's a signal the migration is purely on the read seam (or some other upstream concern), not on the downstream function. Pre-authoring reviewer dispatch can surface this BEFORE any code is written, dropping the duplicate.

**Cure shape options**:

1. **PDR candidate**: "Pre-authoring scope check — does the proposed new function's signature differ structurally from the existing one?" If no, the migration is on the seam, not on the function. Drop the new function before authoring.
2. **Skill amendment**: add this check to `oak-plan` skill's pre-authoring + `pre-execution-code-expert-review-per-loop-cycle` rule's gateway checklist.
3. **Inline pattern note**: capture as a pattern in `.agent/memory/active/patterns/` and let the third instance trigger formal graduation.

**Why pending**: 2 instances same plan, same author. Third instance from a different author / different plan would confirm the pattern's generality before formal graduation. Owner direction to author can fire earlier.

Falsifiability: a future plan that proposes a NEW parallel function and lands it without pre-authoring drop, then has the new function flagged as a duplicate post-delivery, is the failure mode this entry would cure. A future plan that proposes a NEW parallel function and drops it at pre-authoring is the success.

### 2026-05-22 — Check-runner singleton claim (rule-shaped or coordination-state-schema-amendment-shaped)

`[captured: 2026-05-22 | source: owner-direction (Stormbound session-handoff window) | target: rule:check-singleton-per-window OR adr:coordination-state-schema-add-gate-sweep-area-kind | trigger: owner-direction (already fired) — author the structural cure when bandwidth allows | size: S | status: pending]`

Substance summary: owner-stated direction 2026-05-22 during Stormbound's session-handoff: _"only one agent needs to run check, and one agent already is, so stop check, and record that invariant, and note that we need some kind of record of who is running check when"_. The session-handoff SKILL §11 currently directs every closing agent to run `pnpm check`; in an N-agent window this produces N concurrent invocations duplicating ~30s+ of work per run and providing no marginal signal. The team has no observable surface for "who is running check (or other whole-repo gate sweep) when".

**Underlying invariant**: only ONE agent runs `pnpm check` (or equivalent whole-repo gate sweep like `pnpm test`, large `turbo` invocations) per coordination window. Multiple parallel runs are wasteful at best and can collide on advisory-orchestrator file outputs at worst.

**Cure shape options** (to be designed at graduation):

1. **Rule + observable surface**: new rule `check-singleton-per-window` referencing a new `area-kind: gate-sweep` (or `whole-repo-gate`) in the active-claims schema. An agent opens the claim with pattern `pnpm-check` (or similar) before invoking `pnpm check`; peers observe the claim and defer. Closes when the run completes with the result evidence (green/red + SHA at run time).
2. **Lightweight broadcast convention**: short-lived "Lane X running pnpm check, ETA 30s" broadcast convention with a corresponding "Lane X check completed: green/red" follow-up. No schema change; relies on the comms event stream as the singleton-coordination surface. Less rigorous than (1) but lower-friction.
3. **Session-handoff SKILL §11 amendment**: the SKILL itself names the check-singleton invariant and tells agents to observe peer activity first. Without (1) or (2) the invariant has no observable surface; could be a starting point that names the gap and stages the fuller cure.

**Why pending**: structural cure design depends on whether (a) the active-claims schema absorbs a new area-kind (PDR/ADR-shaped decision), (b) a broadcast convention suffices (rule-shaped + SKILL amendment), or (c) something else. Owner direction has fired (this is the trigger); the design moment is on the next bandwidth window. Likely shape: rule + schema amendment together, but the trade-off design needs a focused pass.

**Lifecycle note**: captured as standing memory `feedback_check_singleton_per_window` in Stormbound's per-user Claude memory same session (so the rule applies immediately even before the structural cure lands). Standing-memory pre-empts the cure; the cure makes the invariant observable to peers rather than purely-agent-recalled.

Falsifiability: a future session-handoff sequence in an N-agent window where every closing agent independently runs `pnpm check` is the failure mode this entry warns about. A session where the first agent opens a check-runner claim (or broadcast), runs check, posts the result, and the other agents defer to that result is the success.

### 2026-05-22 — Rule/skill topology fragmentation (PDR-shaped, recovered from .remember buffer)

`[captured: 2026-05-22 | source: .remember/today-2026-05-15.md ("55k rule tokens fragmented; rule-topology + skills PDR → post-collab-lane queue") | target: pdr:rule-skill-topology | trigger: owner-direction or rule-topology slice opens | size: M | status: pending]`

Substance summary: at 2026-05-15, the cumulative token-load of `.agent/rules/*.md` was measured at ~55k tokens — a fragmentation signal flagged by the authoring session as a PDR candidate, with the lane queued _"post-collab-lane"_ (i.e., after the multi-agent collaboration substrate work completed). The substance was captured only in the `.remember/` plugin buffer and never drained into `distilled.md` or `pending-graduations.md` during the subsequent week's consolidations, because the plugin lifecycle stalled when the v0.5.0 install was scoped to a different project (re-installed as v0.7.2 at 2026-05-22T13:49Z scoped to this project, restoring the drainage path).

**Underlying substance**: rule files are loaded into context at session-open via CLAUDE.md / equivalent platform entry points. 55k tokens of rule load is large relative to the 80k reliably-loaded context budget (memory `project_80k_reliably_loaded_context_budget.md`). Fragmentation across ~60+ rule files multiplies surface-discovery cost without proportionate substance-density gain. The PDR candidate would author the topology: which substance lives where, fitness signals for rule files individually and as a load surface, the rules ↔ skills boundary, and the criteria for promoting/demoting/merging rules.

**Why pending**: forward-looking restructuring substance; no current plan absorbs the topology question. The closest active surface is the standing memory entry on the 80k budget (which sets the constraint) but does not author the cure. **Trigger to watch**: owner-direction to author a rule/skill-topology PDR, OR the moment a rule-topology consolidation lane opens (would absorb this as its design input).

Falsifiability: a future rule-topology consolidation that proceeds without measuring rule load against the 80k budget, or without authoring criteria for rule promotion/demotion/merging, is the failure mode. An implementation that measures the load and authors the criteria is the success.

**Lifecycle note**: this entry is **first-instance recovery from .remember buffer drainage**; if a second instance of the rule-topology fragmentation signal appears in a future session, that strengthens the PDR case from candidate → ratification-ready.

### 2026-05-22 — Behaviour-nudge pressure-score design constraints (design-note / PDR-shaped, captured for future P8/P9 surface)

`[captured: 2026-05-22 | source: comms-events 2026-05-12T19:49:35Z + 19:54:15Z (Verdant Foraging Copse, P5 queue-pressure window) extracted from .agent/state/collaboration/comms/ before §3a retention deletion | target: pdr-or-plan:behaviour-nudge-pressure-architecture | trigger: owner-direction or behaviour-nudge implementation slice opens | size: M | status: pending]`

Substance summary: owner design prompt during 2026-05-12 P5 queue-pressure window proposed weighting collaboration events by **occurrence frequency** and **immediacy** to nudge group behaviour. Two-event capture from Verdant Foraging Copse (peer expansion on owner prompt):

**Note 1 (frequency-immediacy weighting)**: treat repeated recent classes of friction as escalating signals, not hard scheduling authority. Example signals observed in the source window: repeated git:index/head holds, active commit-queue pressure, downstream pnpm-lock blocking, directed-message pressure, hook-green blockers. Proposed nudge messages: _"queue pressure is rising; pause new staging"_, _"lockfile dependency is blocking downstream work"_, _"same blocker has appeared three times in ten minutes; ask coordinator for route."_ Keep owner/coordinator decisions explicit; the score makes patterns visible and timely, never silently reorders work.

**Note 2 (anti-panic damping safeguards)**: if pressure-to-act builds as an exponential function convolved with urgency, it can improve group cohesion on pressing blockers but also create group panic. Design constraints:

1. Pressure scores must be **explainable, damped, capped, and expressed as reversible prompts** rather than automatic action.
2. Candidate safeguards: **decay with cooldown**, **require evidence citations**, **separate urgency from importance**, **suppress duplicate-herd amplification**, **expose uncertainty**, **prefer 'ask coordinator' over 'act now' at high pressure**, and **let humans/coordinators override or mute a pressure class.**
3. Constructive target: collective attention on current blockers, not emotional contagion or unreviewed auto-reordering.

**Why pending**: forward-looking design substance about behaviour-nudge architecture; no current plan absorbs it. The `closure-pressure-remediation-design-space.plan.md` covers a different surface (closure-rationalisation failure mode at session-close). The P8 token-remediation-parallel-program plan is sequence-execution, not behaviour-nudge architecture. **Trigger to watch**: owner-direction to author a behaviour-nudge PDR, OR the moment a behaviour-nudge implementation slice opens (would absorb these constraints as design inputs).

Falsifiability: a future behaviour-nudge implementation that proceeds without these safeguards (silent reordering, hard scheduling authority, no decay) is the failure mode this entry warns about; an implementation that adopts the safeguards in shape is the success.

### 2026-05-22 — Dispatch PENDING reviewers at session-close, not next-session-open (session-handoff SKILL amendment)

`[captured: 2026-05-22 | source: napkin §"Insight: pending reviewer dispatches at session-end are cheap" (Charcoal evening session) | target: skill-amend:session-handoff (new sub-step or step-6b extension) | trigger: second-instance(PENDING reviewer marker persists across ≥2 sessions for the same plan) | size: S | status: pending]`

Substance: when a plan's `Reviewer Dispatch Log` carries PENDING reviewer markers AND the current session has touched that plan's body, dispatching the pending reviewers at session-close (parallel sub-agent calls, ~60s each) is dramatically cheaper than deferring them to "the next implementer". The next implementer's session-open then opens with the reviewers' verdicts already absorbed, the plan body internally coherent, and the MUST-NOT-BEGIN gate cleared. Worked instance this session: `type-expert` + `assumptions-expert` carried PENDING markers across Stormbound's 2026-05-22 afternoon session and Velvet's evening review-only session; Charcoal dispatched them in parallel at session-close (single-message Agent tool calls), absorbed verdicts in ~60s, and landed `2adeccec`. Cycle 1.3 went from "blocked on reviewer dispatch" to "ready for TDD authoring" without the next implementer paying any reviewer-dispatch cost.

Why pending: single instance with full cure executed. A second instance — a thread record carrying PENDING reviewer markers, a session touching that thread's plan, but the closing agent defers the dispatch to the next implementer — would cross the trigger. The cure shape is a small addition to `session-handoff/SKILL-CANONICAL.md` step 6 (or step 9 consolidation gate): "If the current thread record's plan carries PENDING reviewer markers AND this session touched the plan's body, dispatch the pending reviewers as a session-close move before declaring handoff complete. Absorb verdicts; flip markers; commit."

Falsifiability: a future session-handoff where PENDING reviewer markers persist across the handoff despite the session having touched the plan is the failure mode this entry warns about. A handoff that dispatches and absorbs is the success shape.

### 2026-05-22 — Routing broadcast vs claim release distinction (rule-shaped or PDR-shaped)

`[captured: 2026-05-22 | source: comms-events bfa99e61 (routing broadcast) + b67a3240 (sidebar discovering overlap) + 23afa78a (explicit release) | target: pdr:routing-vs-claim-release-distinction OR rule:routing-requires-claim-release | trigger: second-instance(routing precedes release without explicit release-action) | size: S | status: pending]`

Substance: a routing broadcast naming a file as another agent's lane does NOT release the routing agent's claim on that file. The claim is the binding ownership marker; the broadcast is a recommendation. Worked instance this session: Wooded held claim `d26e453f` covering `distilled.md`; broadcast at 14:47Z "Task #13 distilled.md fitness-pressure graduation is properly Tempestuous's OUTPUT lane, not mine. Routed"; continued to edit distilled.md under direct owner direction; commit `2389ff5e` landed at 14:54Z. Tempestuous opened claim `02eadf52` at 14:51Z based on the routing broadcast. Collision discovered when Tempestuous's Edit failed with "file has been modified since read" — the binding state was the still-open claim, not the routing broadcast. Coordination resolved when Wooded sent a directed event explicitly releasing the area.

Cure shape (candidate doctrine): when routing a file to a peer, simultaneously either (a) close the claim that covers it, or (b) edit the claim to narrow its file pattern list (drop the routed file). The broadcast surface and the claim surface are not coupled — claim release requires an action on the claim surface.

Why pending: single instance so far. If a second instance arises in subsequent multi-agent sessions, it crosses the trigger and becomes graduation-ready. The cure shape (claim-surface action paired with routing broadcast) is a small structural amendment to the routing convention; could land as a rule (`.agent/rules/routing-requires-claim-release.md`) or as a PDR amendment to existing claim-discipline doctrine.

Falsifiability: a future routing broadcast that fails to pair with an action on the claim surface (close OR narrow) is the failure mode this entry warns about; routing-with-paired-claim-action is the success shape.

### 2026-05-21 — Moment-of-decision heuristic consolidation (PDR-shaped or directive-shaped)

`[captured: 2026-05-21 | source: napkin.md §"Observation: moment-of-decision is the natural locus..." | target: pdr-or-directive:moment-of-decision-heuristic-consolidation | trigger: third-instance-or-owner-direction | size: M | status: pending]`

Substance summary: rules / skills / invariants are currently
decomposed by **topic** (replace-don't-bridge,
present-verdicts-not-menus, no-fallbacks, schema-first, apply-don't-ask,
stop-inventing-optionality, plan-body-first-principles-check, etc.).
Decomposition by **temporal/structural locus** would group rules by
_when they should fire_. The moment of decision is the densest locus.
A single decision-time heuristic — **at every decision point, the
question is which shape gives long-term architectural excellence** —
candidate to subsume many rules' verdicts at that locus, with the
rules themselves carrying the _reasoning content_ behind the verdict
rather than acting as triggered fan-out at decision time.

Empirical first instance this session: WS1.6 namedNode-vs-literal
verdict — five load-bearing rules (replace-don't-bridge, no-aliases,
no-fallbacks, verdict-vs-menu, schema-first) all converged on the
same answer (route every entry through DataFactory.namedNode()) when
the long-term-architectural-excellence frame was applied at the
moment of decision. Owner has stated the underlying framing twice
in two days (2026-05-20 closure-pressure metacognition; 2026-05-21
WS1.6 verdict). Falsifiability: future decision points where
multiple rules fire should produce verdicts that converge under the
heuristic; divergence names rules the heuristic doesn't cover yet.

Trigger to watch: third explicit instance, or owner-direction
graduation request, or successful empirical test against a corpus
of past decisions. Not graduating as a single-instance observation.

### 2026-05-21 — Citation-as-reasoning at the moment of verdict (pattern-shaped or PDR-shaped)

`[captured: 2026-05-21 | source: napkin.md §"Failure: citation-as-reasoning at the moment of verdict" | target: pattern-or-pdr:citation-as-reasoning-at-verdict | trigger: second-instance-or-owner-direction | size: M | status: pending]`

Substance summary: at the moment of producing a verdict on a
decision, citing a plan body / memory entry / prior agreement as a
"reason" feels like reasoning but is reference. Three of four
"reasons" in a verdict this session were citations dressed as
reasons; owner correction named the pattern. Each citation was
truthful (the plan really does say X; the memory really does
record Y) but truthfulness is orthogonal to whether the citation
is evidence. Reference closes inquiry by pointing at past closure;
reasoning continues inquiry by pointing at current substance.

This is the counterpart to the moment-of-decision heuristic
candidate (above): the heuristic is what _should_ happen at the
moment of verdict; the anti-pattern is what often happens instead.

Diagnostic test: each "reason" in a verdict should be auditable as
substantive reasoning or as citation; if citation, it must be
recharacterised as a flag-to-verify, or substituted with substantive
reasoning, or removed. Verdicts that cannot survive that audit are
dogma-shaped.

Trigger to watch: second observed instance (in another agent's
output or my own) or owner-direction graduation request. Promotion
target: `.agent/memory/active/patterns/` (specific instance) AND/OR
PDR with `pdr_kind: pattern` (general form, after ≥2 instances).

### 2026-05-21 — Dogma vocabulary closes inquiry (rule-shaped)

`[captured: 2026-05-21 | source: napkin.md §"Failure: citation-as-reasoning at the moment of verdict" | target: rule:dogma-vocabulary-closes-inquiry | trigger: second-instance-or-owner-direction | size: S | status: pending]`

Substance summary: vocabulary like _preferred_, _forbidden_,
_required_, _established_ silently does authority work that the
agent has not asked it to do. The words feel natural; that is their
function. Once named as dogma, they become visible as a layer that
smuggles authority into what should be substance-led reasoning.
Adjacent to but distinct from
[`no-hedging-vocabulary`](../../rules/no-hedging-vocabulary.md)
(which targets weak vocabulary that softens claims). This candidate
targets strong vocabulary that closes inquiry.

Owner-named this session at the moment of the dispatch-shape verdict:
"it moves into the language of dogma rather than reason, and that has
its own issues".

Trigger to watch: second observed instance or owner-direction
graduation request. Promotion target: new rule at
`.agent/rules/no-dogma-vocabulary.md` (parallel to `no-hedging-vocabulary`)
OR amendment to `no-hedging-vocabulary.md` extending it bidirectionally.

### 2026-05-21 — Coordinator-handoff: pre-positioning vs active-acknowledgement (PDR-shaped or pattern-shaped)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at [PDR-064](../../practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md) (Proposed) + `start-right-team` SKILL §"Coordinator Handoff (Two Moments)". Three independent in-session instances (Foamy 2026-05-22 napkin entry) + Mistbound Tranche 1 commit `c4bacfc5` SKILL amendment satisfied the second-instance-or-owner-direction trigger.

### 2026-05-21 — Coordinator-as-slice-runner when team capacity is short by 1 (pattern-shaped)

`[captured: 2026-05-21 | source: napkin.md §"Insight: coordinator-as-slice-runner is workable when team capacity is short by 1" | target: pattern:coordinator-as-slice-runner-short-by-one | trigger: second-instance-or-owner-direction | size: S | status: pending]`

Substance summary: when a team session has N peers against N+1
file-disjoint slices (a capacity shortfall of 1), the coordinator
taking the smallest/freshest slice as a concurrent responsibility
is preferable to forcing a peer to double up. Forces file-disjoint
discipline to hold; preserves load balance.

Risk shape: a larger slice (e.g. one with inherited partial edits
requiring diff-verify) is the wrong choice. The pattern requires
the COORDINATOR PICKING THE SMALLEST / FRESHEST SLICE, not a
complex one.

First instance this session: Charcoal Searing Ember closed out
before the routing brief reached them; 4-peer pool minus Charcoal
= 3 peers against 4 slices. Stratospheric Gusting Squall took
Slice B (graph-stack.plan.md, smallest/freshest) and ran it
concurrently with coordinator routing. Total ~2 edits; coordinator
load remained manageable because other slices were parallel and
slice-completion events were event-driven.

Trigger to watch: second observed instance in a different team
session. Promotion target: pattern entry at
`.agent/memory/active/patterns/` with the smallest/freshest
constraint named.

### 2026-05-21 — §1a inherited-tree gate-runner default scope is per-workspace (skill-amendment-shaped)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at `start-right-team` SKILL §1a "Running the gates" — per-workspace gates now the first listed option ("If the dirty files are scoped to specific workspaces, run the per-workspace gates against those workspaces"); tree-wide reserved for unclear-scope cases. Distilled to `distilled.md` 2026-05-21 §"Per-workspace inherited-tree gates are the default for workspace-scoped dirt".

### 2026-05-21 — Mid-cycle retirement protocol for token-bounded agents (PDR-shaped or skill-amendment-shaped)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at [PDR-063](../../practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md) (Proposed) + [ADR-182](../../../docs/architecture/architectural-decisions/182-mid-cycle-handoff-record-substrate.md) Tranche 1 (handoffs directory + `handoff_record_path` claim field + `mid-cycle-handoff` `message_kind`) + `start-right-team` SKILL §"Mid-Cycle Retirement" five-step protocol. Substrate landed in Mistbound Tranche 1 commit `c4bacfc5`.

### 2026-05-21 — Grounding-cost amortisation under rotating-cast operation (PDR-shaped)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at [PDR-065](../../practice-core/decision-records/PDR-065-grounding-cost-amortisation-under-rotation.md) (Proposed). PDR drafted by Foamy Snorkelling Jetty 2026-05-22; fast-bootstrap mode + eligibility constraints codified at the target home.

### 2026-05-21 — Comms-event stream as real-time failure-mode capture channel (PDR-shaped)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at [PDR-066](../../practice-core/decision-records/PDR-066-comms-events-as-failure-mode-channel.md) (Proposed) + [ADR-183](../../../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md) Tranche 1 (`tags` array on narrative/lifecycle/directed event kinds with `"failure-mode"` / `"behaviour-note"` namespace) + `start-right-team` SKILL §"Real-time failure-mode capture on the comms stream". ADR-183 Tranche 2 (CLI rendering update) deferred per ADR-183 §"Landing tranche" — agents do NOT write `tags`-bearing events until both tranches land. Substrate Tranche 1 landed in Mistbound commit `c4bacfc5`.

### 2026-05-17 — Surface classification for fitness-response routing (PDR-shaped)

`[captured: 2026-05-17 | source: distilled.md §"Surface classification routes fitness response" | target: pdr:surface-classification-for-fitness-response | trigger: owner-direction | size: S | status: pending]`

Substance summary: four surface kinds in the knowledge-flow pipeline
(memory / state / buffer / doctrine) route fitness signals to
different correct responses. The "Learning Preservation" rule applies
to memory and state, not buffers. Trigger to watch: owner-direction
at next consolidation. Full doctrine drafted at the target home, not
here.

### 2026-05-17 — Pipeline back-pressure as structural-cure signal (PDR-shaped)

`[captured: 2026-05-17 | source: distilled.md §"Pipeline back-pressure is information" | target: pdr:pipeline-back-pressure-is-structural-cure-signal | trigger: owner-direction | size: S | status: pending]`

Substance summary: a full buffer with fitness alarms means the
upstream consumer is bottlenecked. The cure targets producer or
consumer rate, never the buffer's envelope. Four candidate bottlenecks
named in source. Trigger to watch: owner-direction at next
consolidation, ideally paired with surface-classification PDR.

### 2026-05-17 — Metacognition has two modes (retrospective + generative) (PDR-shaped)

`[captured: 2026-05-17 | source: distilled.md §"Metacognition has two modes — retrospective and generative" | target: pdr:metacognition-two-modes | trigger: second-instance-or-owner-direction | size: S | status: pending]`

Substance summary: metacognition has retrospective (cure
doctrine-by-analogy on correction signal) and generative (cure
purpose-by-default on non-trivial brief / strategic fork / recurring
systems vocabulary) modes; both share pre-action action-to-impact
ratification reflex; success test is "produces correct moves next
time without same intervention." Routing: directive already names
both modes implicitly; PDR could ratify the model explicitly.

### 2026-05-17 — Platform-specific per-user memory is a buffer with drainage contract (PDR-shaped)

`[captured: 2026-05-17 | source: distilled.md §"Platform-specific per-user memory is a buffer, not a personal store" | target: pdr:per-user-memory-is-a-buffer | trigger: owner-direction | size: S | status: pending]`

Substance summary: Claude/Cursor/Codex per-user memory surfaces are
platform-specific buffers that drain into in-repo canonical surfaces
(napkin / distilled / rules / PDRs) per session-handoff step 6 +
consolidate-docs step 3. Cross-cutting substance written there must
be integrated; declaring the sweep done without performing it is the
failure mode. Routing: workflows already name this; PDR would ratify
the buffer-with-drainage-contract framing and make the recurrence
detectable.

### 2026-05-17 — Doctrine-first vs first-principles diversity in agent-owner pairs (PDR-shaped)

`[captured: 2026-05-17 | source: distilled.md §"Doctrine-first vs first-principles is cognitive-approach diversity" | target: pdr:cognitive-approach-diversity-in-agent-owner-pairs | trigger: second-instance-or-owner-direction | size: M | status: pending]`

Substance summary: agent baselines doctrine-first reasoning; owner
baselines first-principles reasoning; the pair compounds when both
present, but agent operating alone falls into doctrine-by-analogy
failure mode. Cure: pre-action surface-classification checkpoint;
recurring signals route to upstream-cause diagnosis. Trigger to
watch: second instance of the recurring-signal shape, or owner
direction.

### 2026-05-17 — Gates hide gates — failure surface is a stack

`[captured: 2026-05-17 | source: distilled.md §"Recently Distilled — 2026-05-17 Solar Orbiting Asteroid gate-green cascade" §"Gates hide gates" | target: pattern:gates-hide-gates | trigger: second-instance | size: S | status: pending]`

Substance: `pnpm check`'s serial chain (each gate's `&&` means
downstream gates do not run while an upstream gate is red) shields
each failed gate from the next. The shielding holds at test-level
too. **Diagnostic discipline**: when a gate clears, expect the next
downstream gate to surface a previously hidden problem. Treat each
green gate as a magnifying glass aimed at the next. Worked instance
2026-05-17 (Solar Orbiting Asteroid): knip clearing surfaced a
parallel-load MCP e2e flake; the e2e deletions surfaced a missing
Playwright binary; installing the binary surfaced two pre-existing
circular type imports in depcruise that had been latent for weeks.
Falsifiability: a `pnpm check --continue` mode would reveal the
full latent stack at once. Second-instance trigger: any future
consolidation observing the same cascade-on-clear shape graduates
this to a pattern in `.agent/memory/active/patterns/`.

### 2026-05-17 — Supertest classification conflict (doc-amend)

`[captured: 2026-05-17 | source: distilled.md §"Recently Distilled — 2026-05-17 Solar Orbiting Asteroid gate-green cascade" §"Supertest tests are integration by classification, not e2e" | target: doc-amend:testing-patterns | trigger: owner-direction | size: S | status: pending]`

Substance: `testing-strategy.md` §Test Types (authoritative) defines
classification by behaviour shape: _"A test that imports product
code into the test process is an integration test even if named
`.e2e.test.ts`."_ `docs/engineering/testing-patterns.md` currently
classifies supertest as E2E in §"Test File Classification". Direct
doctrinal conflict with the authoritative directive. Worked instance
2026-05-17: two MCP supertest files filed under `e2e-tests/` were
identified as integration tests by classification and deleted as
duplicates of existing unit/integration coverage (commit `96fd3e61`).
Routing: amend `testing-patterns.md` to align with the strategy
doc, or amend `testing-strategy.md` if the patterns doc's
classification is the corrected position. Owner decides direction
at next consolidation.

### 2026-05-17 — `pnpm check` cleanliness gate in session-handoff (skill-amend)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at the target home named in the entry.

### 2026-05-17 — Hook-bypass equivalence in `--no-verify` rule (rule-amend)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at the target home named in the entry.

### 2026-05-14 — Agents default to no gender unless self-declared (second-instance evidence)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at the target home named in the entry.

### 2026-05-14 — Conduct-rule graduation discipline (PDR-shaped meta)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at the target home named in the entry.

### 2026-05-14 — Cross-thread program artefact shape (first-instance trigger captured)

`[captured: 2026-05-14 | source: napkin.md §"2026-05-14 — Cross-thread program artefact shape (first observed instance)" | target: pdr-or-rule-on-cross-thread-program-artefact-shape | trigger: second-cross-thread-program-emergence | size: M | status: pending]`

Substance: multi-session sequences crossing two or more threads have
no canonical artefact shape in this Practice. The 2026-05-14
`token-remediation-p8-parallel-program.plan.md` is the first observed
instance; its anti-decay clauses (advancement rule, owner-redirection
clause, evidence threshold, interrupt log, anti-decay handoff clause)
are proposed structural cures against ten documented multi-session
decay modes. If a second cross-thread program emerges, the
artefact-shape itself graduates to a PDR (Practice-portable) or rule
(always-applied behavioural cure when an agent encounters such a
sequence). Watch for: owner naming a sequence with ≥3 steps spanning
multiple plans; owner naming a sequence that explicitly crosses
thread boundaries; owner using language like "then", "after that",
"then back to" linking work on different threads.

### 2026-05-14 — Shape-selection-by-vehicle-weight failure mode (first-instance trigger captured)

`[captured: 2026-05-14 | source: napkin.md §"2026-05-14 — Shape-selection-by-vehicle-weight is a recurring failure" | target: rule-or-pdr-on-shape-selection-by-function | trigger: second-shape-selection-by-weight-correction | size: S | status: pending]`

Substance: when proposing graduation shapes (rule / ADR / PDR / new
file / amendment), the function test must be applied first, not the
vehicle-weight ranking. Today's Batch A failure: presented three
shape options ranked by lightness, recommended the lightest, ignored
the entry's own prior function-test argument. Owner intervention
named the diagnostic: _"rules, ADRs, PDRs all have functions, this
choice is not arbitrary."_ Existing per-user memory ("never surface
a cheap-cure option") is operational but not always-applied as a
repo rule. If a second instance fires, graduate to a rule that names
the failure shape directly and forces the function-test framing.

### 2026-05-14 — Skill text vs continuation record distinction (single-instance, PDR-shape candidate)

`[captured: 2026-05-14 | source: distilled.md §"Continuation surfaces" first bullet (Sylvan distillation) | target: pdr:skill-text-vs-continuation-record | trigger: second-instance-stability | size: S | status: pending]`

Substance: skill text carries durable routing behaviour; continuation
records carry volatile facts. Branch, plan, next-step, commit ids,
team expectation — every fact that changes between sessions belongs
in the thread record, not in the skill body. The skill's job is to
fire the routing on arrival; the record's job is to provide the
current state for that routing to act on. Function-test verdict:
PDR-shape (Practice-meta design distinction). Currently single-
instance evidence (Sylvan's distillation 2026-05-14). Holds until a
second session corroborates or contradicts the distinction.

### 2026-05-14 — Repo-continuity Active Threads identity column structural refactor (fitness-loop signal)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at the target home named in the entry.

### 2026-05-05 — Agent tooling friction is first-class user feedback (standing direction)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at the target home named in the entry.

### 2026-05-10 graduations log (Sylvan Fruiting Glade — knowledge graduation session)

| Entry                                            | Graduated to                                                                                           | Lines      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ---------- |
| 30% context budget for directive-file processing | PDR-052                                                                                                | L494–539   |
| invoke-doc-and-onboarding-reviewers rule         | `.agent/rules/invoke-doc-and-onboarding-experts-on-significant-changes.md` (re-route option exercised) | L1485–1506 |
| pattern surface needs polarity discipline        | PDR-014 amendment + bulk sweep across ~93 pattern files                                                | L436–492   |
| orchestrator-vs-gate structural cure             | PDR-053 + ADR-176 + script rename + commit-skill SKILL update                                          | L891–919   |
| agent-tools CLI affordance set + build isolation | PDR-055 + ADR-178                                                                                      | L951–985   |
| no-moving-targets hook tightening                | `agent-tools/scripts/check-blocked-content.ts` prose-vs-data distinction + rule update                 | L1085–1116 |
| stage-by-explicit-pathspec asymmetric-cure       | PDR-054 + ADR-177 (rule already landed)                                                                | L1135–1198 |
| observability orthogonal axes                    | ADR-171 + amendments to ADR-116/143/162/163                                                            | L1508–1544 |
| inter-agent collaboration protocol gaps          | PDR-056 (ten cures, hypothesis-status preserved)                                                       | L1556–1632 |

### 2026-05-10 graduations log (Quiet Lurking Mask — QUAR-1 reformulation)

| Entry                                                               | Graduated to | Lines                         |
| ------------------------------------------------------------------- | ------------ | ----------------------------- |
| apply-don't-ask reformulation (empirical-answerability)             | PDR-057      | L1988–2036 (quarantine entry) |
| stop-inventing-optionality reformulation (three-tier decomposition) | PDR-058      | L1988–2036 (quarantine entry) |

### Entry Counts (2026-05-12 — post-index reconciliation)

| Status                 | Count   | Notes                                                                                                                                                                                 |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| due                    | 0       | former due entries disposed 2026-05-12 without trimming substance                                                                                                                     |
| overdue                | 0       | no body entry currently uses overdue metadata                                                                                                                                         |
| partially-graduated    | 2       | stage-by-explicit-pathspec asymmetric-cure family plus peer-pair design-collaboration sidebar residual                                                                                |
| quarantined            | 0       | unchanged                                                                                                                                                                             |
| held-pending-plan      | 1       | SDK codegen generator-duplication pointer                                                                                                                                             |
| pending                | ~76     | grep count of explicit `status: pending` markers after retaining implementation-shaped and owner-shaped former due entries; prose-only older entries may still need metadata backfill |
| **active queue total** | **~79** | excludes graduated-history bodies retained for audit until the next archive snapshot                                                                                                  |

### 2026-05-11 graduations log (Fronded Flowering Seed — graduation-candidates-drain session)

| Entry                                                  | Graduated to                                                                                                                                                                                       | Reviewers                                                                                                                                                                            |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hook-chain re-staging absorbs files post-verify-staged | PDR-059 (regenerator-output-classification) + ADR-177 amendment (2026-05-11) + PDR-054 §Related cross-ref                                                                                          | architecture-expert-betty GO WITH CONDITIONS (2 doctrine edits applied); docs-adr-expert GO; assumptions-expert GO WITH CONDITIONS (2 plan-level pre-conditions recorded in ADR-177) |
| ADR-041 amendment needed: top-level workspace tiers    | ADR-041 amendment (2026-05-11) — `agent-tools/` + `agent-graphs/` tiers added; 8 × 8 dependency-direction matrix; D-4a closed in graph-mvp-arc.plan.md:732; ADR-173 §Open Questions:1 cross-linked | architecture-expert-fred GO; architecture-expert-betty GO WITH CONDITIONS (2 matrix-cell precision edits applied); docs-adr-expert GO WITH CONDITIONS (3 housekeeping items applied) |

## Entries

- 2026-05-21; **Comms event stream as canonical truth (PDR candidate)**.
  `[captured: 2026-05-21 | source: napkin+owner-direction+agent-tools-cli-landing | target: pdr:comms-event-stream-canonical-truth-views-derived | trigger: second-instance(of-contestation-or-extension) | size: M | status: pending]`
  Substance already landed in three artefacts this session: (a) the
  all-channels CLI defaults at commit `a9d0b8cf`
  (`drainRelevantEvents` + `classifyEventForAgent`), (b) the
  `start-right-team` SKILL §0 amendment making the all-channels
  monitor non-negotiable for team sessions, (c) the auto-memory entry
  `feedback_comms_event_stream_canonical_truth`. The PDR slot is the
  **Practice governance ratification** of the principle as the
  multi-agent coordination doctrine — _the comms event stream is the
  canonical truth; broadcast, group, directed, lifecycle, and (when
  schema supports) sync are all valid views; all matter; views are
  derived at the watcher boundary by classification with self-exclusion
  only_. Trigger for promotion: second instance of the principle being
  either contested (someone proposes returning to a single-view
  default) or extended (e.g. when the sync kind lands in the schema, or
  when a platform-specific watcher adapter needs to deviate from the
  reference shape). Owner-stated standing direction is recorded;
  further codification awaits empirical extension or contestation.
- 2026-05-21; **Sync-kind / urgency flag in comms schema (ADR candidate)**.
  `[captured: 2026-05-21 | source: owner-direction+agent-tools-cli-landing | target: adr:comms-sync-urgency-representation | trigger: owner-direction | size: M | status: pending]`
  Owner direction 2026-05-21: _sync messages for high urgency decisions
  are a valid view onto the event stream; sync messages must have at
  least two participants._ The current schema (`agent-tools/src/
collaboration-state/types.ts`) has only three top-level kinds:
  `narrative`, `lifecycle`, `directed`. There is no `sync` kind and no
  `urgency` flag. Today, urgency must be inferred at the agent
  reasoning layer from title/body conventions — the watcher boundary
  cannot expose `[SYNC]` as a first-class view because it has no
  syntactic signal to classify against. ADR work: decide between a
  new `sync` top-level kind versus an `urgency: 'sync' | 'normal'`
  flag on narrative + directed kinds. The trade-off is granularity
  (urgency flag composes with view type) vs simplicity (separate kind
  is easier to validate). Then write-side validation enforces the
  two-participant invariant: a sync event must have at least two
  agents in scope (sender + addressee/audience), refusing self-only
  sync. Trigger: owner direction to start the schema work. Slot in the
  `comms-relevant-events.ts` `EventView` enum is already reserved by
  the doctrine — the line `'broadcast' | 'group' | 'directed' |
'lifecycle'` extends to include `'sync'` without other change.
- 2026-05-21; **Two-participant invariant write-side validator (rule candidate)**.
  `[captured: 2026-05-21 | source: owner-direction+agent-tools-cli-landing+honest-scope-flag | target: rule:comms-write-refuses-self-addressed | trigger: owner-direction | size: S | status: pending]`
  Owner direction 2026-05-21: _private messages must have at least two
  participants_. Today the `classifyEventForAgent` classifier handles
  the read-side correctly (a `directed`-kind event from `self.to.self`
  passes self-exclusion before to-match runs because the author is
  self). The write-side does NOT currently refuse a narrative event
  whose `addressed_to === author.agent_name`, nor a directed event
  whose `from === to`. The structural cure is a write-side validator
  in `agent-tools/src/collaboration-state/comms-messages.ts` (and
  wherever narrative events are constructed) that refuses self-only
  addressing at write time. Trigger: owner-direction to land the
  validator. Size S — single validator function plus unit tests.
- 2026-05-21; **Cycle-collision rule tertiary tie-break for clock skew (rule refinement candidate)**.
  `[captured: 2026-05-21 | source: reviewer-finding+docs-adr-expert | target: rule:start-right-team-cycle-collision-tertiary | trigger: second-instance(of-clock-skew-tie) | size: S | status: pending]`
  The `start-right-team` SKILL §1 cycle-collision rule (added 2026-05-21,
  commit `dc67d0fb`) resolves contested cycles by _"earliest team-start
  `created_at` wins"_. Source authority is the comms event's `created_at`
  field. Two agents on different physical hosts (e.g. Codex GPT-5 on
  OpenAI infrastructure vs Claude Code on the user's laptop) may have
  divergent host clocks; sub-second collisions are possible. The current
  rule has no tertiary tie-break beyond "earliest timestamp wins" and
  pure clock-skew ties (< 1s apart from different hosts) are not
  addressed. Candidate refinement: ties break by `event_id` lexicographic
  order as a deterministic fallback. Trigger: second instance of an
  empirical clock-skew tie or near-tie observed in a real session.
  Today's session (instance count = 0 of empirical clock-skew ties)
  is not the trigger.
- 2026-05-21; **Identity-seed precondition error message in CLI (code refinement candidate)**.
  `[captured: 2026-05-21 | source: reviewer-finding+code-expert | target: code:agent-tools/src/collaboration-state/identity.ts | trigger: owner-direction | size: S | status: pending]`
  The `agent-tools` comms `watch` and `inbox` commands require one of
  `PRACTICE_AGENT_SESSION_ID_CLAUDE` / `PRACTICE_AGENT_SESSION_ID_CURSOR`
  / `PRACTICE_AGENT_SESSION_ID_CODEX` / `CODEX_THREAD_ID` to be set in
  the shell. When unset, `deriveCollaborationIdentity` throws the generic
  message `"missing collaboration identity seed; set a Practice session
id or CODEX_THREAD_ID"`. The `start-right-team` SKILL §0 documents
  this precondition as skill-side prose, but the prose duplicates what
  the error message itself could carry. Candidate refinement: extend the
  error message to enumerate the specific env vars expected per
  platform, and (optionally) detect a probable-platform from the shell
  context to make the message platform-specific. Trigger: owner
  direction to land the CLI-side fix. Size S — single function
  edit + unit test. Routing this through pending-graduations rather
  than a commit-message follow-up note per owner direction 2026-05-21:
  forward-action notes do not live in commit messages.
- 2026-05-21; **Multi-agent shared-checkout collaboration as distinct empirical class (memory-clarification + memory-graduation candidate)**.
  `[captured: 2026-05-21 | source: napkin+session-evidence | target: memory:feedback_worktree_isolation_unreliable+pdr:multi-agent-collaboration-classes | trigger: second-instance | size: S | status: pending]`
  Today's two-agent session (Fiery + Foamy, both claude opus-4-7-1m,
  shared physical checkout on base `40129940`) confirms the
  shared-checkout shape WORKS for disjoint workspace-tree cycles.
  The standing memory `feedback_worktree_isolation_unreliable` is
  scoped to Agent-tool `isolation: "worktree"` sub-agent dispatch —
  shared-checkout multi-main-session collaboration is a distinct
  empirical class. Memory-clarification edit: add the scope note to
  the existing entry. Graduation candidate: a PDR/doctrine ratifying
  the empirical-class distinction so future cohorts don't conflate
  the two shapes. Trigger: second instance of the shared-checkout
  shape being run (today is instance 1).
- 2026-05-13; **Coordinator-role-as-allocator-not-gatekeeper (PDR candidate)**
  (Coppery Kindling Anvil — three-napkin synthesis F2; Ferny's original
  candidate plus cross-rotation evidence).
  `[captured: 2026-05-13 | source: napkin+napkin-archive/napkin-2026-05-12.md+napkin-archive/napkin-2026-05-12b.md+research:historical-napkin-synthesis-2026-05-13 | target: pdr:coordinator-role-as-allocator-not-gatekeeper | trigger: n>=3-validation(start-right-team-experiment)+owner-direction | size: M | status: pending]`
  Three corpus instances of one root cause across two failure modes:
  Wooded Spreading Thicket (over-write — sidebar file broke own gatekeeper
  sweep), Brazen Stoking Ash (over-write — dispatcher coordination
  artefacts generated friction the dispatcher then documented), Ferny
  Regrowing Leaf (under-write — coordinator caution misread as licence to
  do nothing while idle peers stood by). Both modes share root: the
  coordinator role lacks a clean boundary between coordination outputs
  and the work being coordinated. Companion to PDR-053/ADR-176
  (orchestrator-vs-gate distinction); positive doctrine still missing on
  _how a coordinator allocates work without becoming the gate that
  serialises it_. Candidate substance: coordinator's job is allocation
  and routing; gating is owned by mechanical hooks and per-implementer
  re-verification; coordination artefacts route to a write-isolated
  surface (separate branch/worktree/gitignored) so the coordinator does
  not pollute the repo-wide gates they're trying to manage. Trigger:
  owner direction; corpus already has N=3 instances. Promotion target:
  PDR with companion pattern instances kept in `memory/active/patterns/`.
  2026-05-14 P8 controller evidence adds the positive case: roles selected
  from live pressure points worked when each role had a handoff proof
  (implementer exact bundle, reviewer GO/BLOCK challenge, marshal
  git/index/queue facts, scout next-slice shape). Static role menus remain
  useful as prompts, but should not become canonical topology.
  Follow-up on 2026-05-14 turned the first low-risk slice into
  `start-right-team`, proposed ADR-181, a focused operating-model research
  note, and a conditional team branch in `session-handoff`. The PDR candidate
  remains pending because the stable portable doctrine for coordinator
  allocation vs gating has not yet been written.

  **Owner direction 2026-05-14 (Verdant Swaying Glade)**: hold this
  candidate back from promotion; the coordinator/marshal/reviewer/scout/
  standby role-set is _the first possibly naive approach we tried_ and a
  durable PDR on agent roles must not give it extra weight before the
  upcoming self-assigned-roles experiment has produced cross-session
  evidence. Eventual graduation target is broader than just "coordinator":
  it is a PDR on agent roles, of which coordinator is one role.

  **Co-tested companion hypothesis** (already operational and accumulating
  evidence): the n-agent collaboration `hypothesis.md` § P1 — _Modes, not
  roles_ — claims agents occupy _functions_ for _units of work_, not
  territorial roles. P1 was confirmed across all three E1 pairings on
  2026-05-03 (Pelagic+Misty, Woodland+Prismatic, Salty+Tidal); see
  [`E1/closure.md`](../../prompts/agentic-engineering/collaboration/experiments/E1/closure.md).
  The current self-assigned-roles experiment runs P1 forward through
  [`start-right-team`](../../skills/start-right-team/SKILL-CANONICAL.md)
  ("pressure before role" / "boundary before identity") and the proposed
  [ADR-181](../../../docs/architecture/architectural-decisions/181-agent-team-start-and-action-log.md)
  team-start ritual. The team-start research note is at
  [`team-start-ritual-and-action-trace-2026-05-14.md`](../../research/agentic-engineering/operating-model-and-platforms/team-start-ritual-and-action-trace-2026-05-14.md).

  **Why holding matters**: this PDR candidate names _concrete role labels_
  (coordinator, marshal, reviewer, implementer, scout, standby) as the
  positive doctrine substrate. P1 + ADR-181 + start-right-team treat those
  same labels as _examples, not a required ontology_ — the canonical field
  is the boundary owned and the pressure being addressed. If we graduate
  this PDR before the experiment matures, we risk three failure modes:
  (1) calcifying transient labels into territorial roles (the exact
  failure mode P1 was designed to prevent); (2) pre-empting falsification
  evidence (P1 strengthens when role labels emerge from live pressure and
  dissolve when the pressure ends; the PDR's positive role-set assumes
  those labels are stable enough to write permanent doctrine about);
  (3) encoding a possibly-naive cure into Practice Core (PDRs are
  portable; entrenching the first menu of labels propagates it to the
  next Practice-bearing repo before validation).

  **Updated trigger condition**: do NOT graduate until the
  start-right-team experiment has accumulated **N≥3 multi-agent sessions**
  across at least two thread/work-shape contexts, AND the
  [P1 falsification criteria](../../prompts/agentic-engineering/collaboration/falsification-criteria.md#p1--modes-not-roles)
  show either (a) strengthening evidence that role labels remain bounded
  to live pressure (in which case the PDR can be reframed around the
  _pressure-to-role mapping protocol_ rather than the role labels
  themselves), or (b) falsifying evidence that one or more labels
  consistently re-emerge across changing pressure shapes (in which case
  the PDR can graduate naming exactly those persistent labels with their
  empirical justification). Owner direction also remains as a co-trigger.

  **Experimental notes capture surface**: per
  [`falsification-criteria.md § Falsification process`](../../prompts/agentic-engineering/collaboration/falsification-criteria.md#falsification-process),
  observations during start-right-team sessions land in `napkin.md` tagged
  with the experiment ID and the affected primitive. P1 falsification
  criteria amendment in this same closeout adds an explicit observation
  hook for label-calcification vs label-dissolution as a strengthening or
  weakening signal. When the experiment matures, the consolidation pass
  reading those napkin observations decides whether to graduate this PDR
  candidate as currently framed, reframe it, or remove it.

- 2026-05-13; **Commit-window mutual mechanical verification +
  hook-output authority (agent-collaboration.md amendment candidate)**
  (Coppery Kindling Anvil — three-napkin synthesis F4).
  `[captured: 2026-05-13 | source: napkin-archive/napkin-2026-05-12b.md+research:historical-napkin-synthesis-2026-05-13 | target: doc-amend:agent-collaboration | trigger: owner-direction | size: S | status: pending]`
  Two companion observations from Brazen's dispatcher session: (a) the
  pre-commit hook is uninterruptible by design, so STOP signal chains
  cannot prevent a commit that has entered the hook window — the cure
  is mutual mechanical verification (gatekeeper AND implementer both
  re-run the gate immediately before `git commit`); (b) independent
  gate probes vs hook-invoked gate probes can disagree under racing
  landings (`pnpm knip` red on independent probe, then green inside
  Lofty's hook window seconds later) — hook output is authoritative.
  Both belong as a single amendment to
  `agent-collaboration.md § Treat Commit as a Short-Lived Shared
Transaction Surface`. Already partially graduated: peer-pair review
  is not commit authorship (line 196); pathspec discipline (lines
  199-204). Candidate is the small focused addition naming the
  authoritative-surface vs signal-chain distinction. Trigger: owner
  direction; corpus has N=3 instances of the cluster.

- 2026-05-13; **Boundary-design strictness rule candidate (owner
  four-part doctrine)**
  (Coppery Kindling Anvil — three-napkin synthesis F10; Quiet Stalking
  Mirror's owner-stated capture).
  `[captured: 2026-05-13 | source: napkin+research:historical-napkin-synthesis-2026-05-13 | target: rule:boundary-design-strictness | trigger: second-instance | size: S | status: pending]`
  Owner-stated doctrine on 2026-05-13 during WS1.5 design review:
  "no aliases, no fallbacks, fail fast and hard with helpful error
  message, replace old with new". The four parts already exist
  separately in `principles.md` (lines 159, 187, 268, 350). What is
  new is the positive four-part formulation as a coherent
  boundary-design discipline at first-derivative moments (new
  wrapper, new adapter, new schema, new public API). Applied
  immediately to WS1.5 canon wrapper design. Candidate destinations
  in preference order: (1) new rule
  `.agent/rules/boundary-design-strictness.md` operationalising the
  four `principles.md` anchors as a positive boundary-design check;
  (2) amendment to `apply-architectural-principles.md` adding the
  four-part discipline as a worked operational instance; (3)
  amendment to existing `replace-dont-bridge.md` to absorb the other
  three parts. Adopter scope: next contributor in this repo who
  designs a new boundary — ADR-shaped (rule), not PDR-shaped.
  Trigger: second observation across a different boundary (next time
  owner reiterates or applies this doctrine to a different surface).
  Corpus has N=1.

- 2026-05-13; **Thread-record routing-surfaces drift after coordinator
  closeout (amendment candidate)**
  (Coppery Kindling Anvil — three-napkin synthesis F5; Solar Gliding
  Twilight's twin observations).
  `[captured: 2026-05-13 | source: napkin+research:historical-napkin-synthesis-2026-05-13 | target: doc-amend:agent-collaboration+doc-amend:start-right-quick | trigger: second-instance | size: S | status: pending]`
  Two independent drift instances within 24 hours from the same agent on
  the same thread substrate: (a) live HEAD had WS1.6/WS1.4/coordination-
  closeout landed while `repo-continuity.md`, the connecting thread
  record, and the active graph plan still described WS1.4 as
  pending/next; (b) the connecting thread record's top correctly named
  next graph choices, but the cold-start opener block still routed
  fresh sessions to completed WS1.2. Cure: treat all routing surfaces
  in a thread record as live; coordinator closeouts must refresh them
  all together; session opener must search for stale completed-work
  identifiers before declaring the handoff current. Trigger:
  second-agent observation (currently same agent twice within 24h).
  Promotion target: amendment to `agent-collaboration.md` Cleanup
  Ethics section + amendment to `start-right-quick` live-state
  reading order naming both summary AND cold-start surfaces as live.

- 2026-05-13; **Identity routing-tuple insufficient under shared Codex
  prefix (P4 follow-on tooling backlog)**
  (Coppery Kindling Anvil — three-napkin synthesis F7).
  `[captured: 2026-05-13 | source: napkin+napkin-archive/napkin-2026-05-12.md+napkin-archive/napkin-2026-05-12b.md+research:historical-napkin-synthesis-2026-05-13 | target: plan:cost-of-collaboration-p4-followon | trigger: plan-execution-gated | size: M | status: pending]`
  Corpus has N≥10 sessions across three Codex prefixes (`019e1d`:
  Fiery + Dim + Verdant + Solar + Mossy + Uplifted + Luminous + Umbral;
  `019e1c`: Lofty + Shaded + Radiant + Penumbral + Secret;
  `019e1b`: Galactic + Coastal + Lush + Hushed + Twigged etc.).
  Ferny's coordinator observation: "coordinator can't tell from claims
  surface alone whether three names = one session or three sessions."
  P4 landed `claims active-agents` but did not solve rename-within-
  session shape. Candidate cures: session-aware identity discipline
  (one name per session even on rename), OR explicit "rename within
  session" comms-event class so the coordinator sees `Fiery → Dim →
Verdant` as one session, OR richer claims surface aggregating by
  `session_id_prefix`. Implementation work, not new doctrine; route
  to cost-of-collaboration P4-followon when that lane reopens.

- 2026-05-13; **Long-running monitor loop dual-timestamp discipline
  (first instance)**
  (Coppery Kindling Anvil — three-napkin synthesis F8; Umbral Masking
  Silhouette's observation).
  `[captured: 2026-05-13 | source: napkin+research:historical-napkin-synthesis-2026-05-13 | target: doc-amend:collaboration-state-conventions | trigger: second-instance | size: S | status: pending]`
  Sorting comms JSON by embedded `created_at` missed freshly written
  message files whose timestamps were earlier than the current tail.
  Cure: long-running monitors must combine semantic timestamp reads
  with an mtime/file-freshness pass before reporting "no new messages."
  First-instance; not yet at trigger. Promotion target when triggered:
  `collaboration-state-conventions.md` operational note in the comms-
  monitor section.

- 2026-05-14; **Value-proxy-independence discipline for measurement tools
  (rule or PDR candidate)**
  (Sylvan Budding Forest — 2026-05-14 consolidation pass; first instance:
  Luminous Glowing Moon `context-cost-cli.plan.md` acceptance lane caught
  by `assumptions-expert` readiness review).
  `[captured: 2026-05-14 | source: napkin-archive/napkin-2026-05-14.md+distilled.md | target: rule:value-proxy-independence-discipline OR pdr:value-proxy-independence | trigger: second-instance | size: S | status: pending]`
  Acceptance value-proxies for a measurement tool MUST compare against an
  independent ground-truth measure, not against a method-equivalent
  historical artefact. Initial draft pinned `acc-cli-baseline-parity` as
  reproducing the `~42,125 tokens` baseline `±5%`; that baseline was itself
  produced by chars/4 over an older fileset, so the new chars/4 CLI agreeing
  with it ±5% proves nothing and may fail under normal file churn.
  Reviewer reframed as `acc-cli-live-parity` against `wc -c` in the same
  shell session (method-independent ground truth; the chars/4 division is
  then mechanical). The pattern shape is _"a proxy that reproduces a
  method-equivalent baseline is tautological; only a method-independent
  comparand validates the tool."_ Reinforces but extends `jc-plan` proof-
  contract requirements (outcome-not-activity acceptance, generally). First
  instance only. Trigger: second observed instance, OR an owner-direction
  decision to land the discipline ahead of corroboration. Promotion target
  in preference order: (1) new rule `.agent/rules/value-proxy-independence-
discipline.md` operationalising the pattern as a plan-author check; (2)
  amendment to `plan-body-first-principles-check.md` adding tautological-
  baseline as a named first-principles failure mode; (3) new PDR if the
  pattern proves cross-ecosystem at N≥2.

- 2026-05-13; **Lockfile-in-flux without coordination-layer declaration
  (start-right grounding amendment)**
  (Coppery Kindling Anvil — three-napkin synthesis F9; Quiet Stalking
  Mirror's WS1.5 hold).
  `[captured: 2026-05-13 | source: napkin+research:historical-napkin-synthesis-2026-05-13 | target: doc-amend:start-right-quick | trigger: owner-direction | size: S | status: pending]`
  The dependency refresh slice (43 files: pnpm@10.33.4→@11.1.1, every
  workspace package.json, lockfile, SDK codegen artefacts) was visible
  only via `repo-continuity.md § Next Safe Steps`, not via
  `active-claims.json` or `shared-comms-log.md`. WS1.5 was correctly
  held on lockfile-collision grounds, but the held could have been
  avoided. Cure: "if `active-claims.json` shows no claim on a dirty
  slice, cross-check `repo-continuity.md § Next Safe Steps` for
  owner-direction landing notes before treating the dirty slice as
  orphaned." Single one-line addition to `start-right-quick`'s
  live-state reading order. First-instance; trigger: owner direction
  to land the cheap addition (no second-instance theatre needed for a
  one-line grounding amendment).

- 2026-05-12; **Commit-boundary peer-pair governance refinements**
  (Volcanic Charring Furnace distilled-stage processing of
  `napkin-2026-05-12b.md` learning).
  `[captured: 2026-05-12 | source: distilled.md+napkin-archive/napkin-2026-05-12b.md | target: multi:pdr:commit-window-coordination+rule:stage-by-explicit-pathspec+skill:commit | trigger: n>=3-validation+owner-direction | size: L | status: pending]`
  The 2026-05-12 peer-triple/dispatcher window produced a coherent
  commit-boundary governance bundle. Landed during this distilled-stage pass:
  peer-pair review is not peer-pair commit authorship (`agent-collaboration.md`);
  current-session memory/state should land or be named as residue while
  peer-session state is
  not default-includable (`agent-collaboration.md` with a cross-reference to
  `respect-active-agent-claims.md`); queue intents are exact file-list
  contracts (`commit/SKILL-CANONICAL.md`); new durable files require claim
  expansion before further edits (`respect-active-agent-claims.md`).
  Still pending: gatekeeper GO needs the named gate's evidence; unify that with
  the landed clauses, PDR-054/PDR-059/ADR-177, and the live commit-skill
  protocol after the collaboration hardening tail has another validation pass,
  so the PDR/ADR layer carries the complete three-direction commit-boundary
  model without hiding the in-session promotions already made.

- 2026-05-12; **Collaboration tooling operator UX backlog**
  (Volcanic Charring Furnace distilled-stage processing of
  `napkin-2026-05-12b.md` learning).
  `[captured: 2026-05-12 | source: distilled.md+napkin-archive/napkin-2026-05-12b.md | target: plan:cost-of-collaboration-p5-p8 | trigger: plan-execution-gated | size: L | status: pending]`
  Operator friction from the P5/P8 collaboration-tooling work belongs in the
  implementation backlog rather than staying as durable distilled prose. The
  candidate bundle: every collaboration-state verb that requires `--active`
  must advertise it or safely default to canonical paths; directed-message
  targeting needs discoverable presence from fresh claims and recent comms;
  shared-log mentions must either become inbox-visible or be replaced by
  directed messages; `comms send`, `direct`, and `append` need
  `--body-file`/`--subject-file` for long content (second-instance evidence
  2026-05-21 Celestial Glimmering Moon `46d23a`: ~3300-char `--body`
  triggered `[ERR_PNPM_RECURSIVE_EXEC_FIRST_FAIL] Command "agent-tools:
collaboration-state" not found` despite the script being present and
  working before/after on short bodies; root cause is shell argv corruption
  from auto-escaped `'"'"'` apostrophe sequences in long directly-quoted
  multi-line `--body` values; CLI never reached; CLI's own
  fail-fast-with-helpful-error discipline confirmed sound on
  missing-required-option test; `--body-file` would eliminate this entire
  failure class); agents need a
  protocol-position command reporting current intent, phase, and next action;
  missing `--seen-file` should mean an empty seen set; built-CLI smoke must
  cover help paths and real read/write paths; missing or stale built output
  should produce an operator message, not a Node stack. Trigger: drain through
  the cost-of-collaboration P5/P8 implementation lane or split into separate
  tool tickets if the lane narrows.

- 2026-05-12; **Detached collaboration monitor lifecycle contract**
  (Volcanic Charring Furnace distilled-stage processing of
  `napkin-2026-05-12b.md` learning).
  `[captured: 2026-05-12 | source: distilled.md+napkin-archive/napkin-2026-05-12b.md | target: multi:doc-amend:collaboration-state-conventions+pdr:monitor-lifecycle-if-recurs | trigger: second-instance | size: M | status: pending]`
  Background collaboration monitors that keep writing after the responsible
  session ends are a protocol defect, not harmless telemetry. The candidate
  contract needs explicit owner, start, stop, expiry, and owner-visible status;
  a continuity note saying "monitor stopped" is not proof if fresh monitor
  events continue afterwards. This pass amended the conventions surface with
  the current lifecycle requirement; promote to a PDR or hard rule only after
  a second monitor lifecycle failure or after monitor tooling becomes a
  long-lived operator surface.

- 2026-05-12; **Quality-gate profiling and built-surface proof backlog**
  (Volcanic Charring Furnace distilled-stage processing of
  `napkin-2026-05-12b.md` learning).
  `[captured: 2026-05-12 | source: distilled.md+napkin-archive/napkin-2026-05-12b.md | target: multi:plan:cost-of-collaboration+doc-amend:build-system | trigger: plan-execution-gated | size: M | status: pending]`
  Profiling and gate-topology lessons are implementation evidence, not
  standalone doctrine yet. Preserve these as backlog checks: speed work must
  not redefine the trigger's purpose; root `pnpm check` and dry profiling
  graphs must stay in lockstep; profiling records should preserve environment
  setup failures; temporary Git indexes can time dirty-tree hooks without
  touching the real index, but sandbox object-write failures require a
  non-sandbox rerun; root workspaces with no source logic still need explicit
  Knip shape; dispatcher-first agent-tools unification is a valid landing;
  forwarded legacy bins need help-path smoke; and `agent-tools` command-boundary
  Vitest tests belong under `agent-tools/tests/` unless config intentionally
  changes.

- 2026-05-12; **Skill and documentation surface audit follow-ups**
  (Volcanic Charring Furnace distilled-stage processing of
  `napkin-2026-05-12b.md` learning).
  `[captured: 2026-05-12 | source: distilled.md+napkin-archive/napkin-2026-05-12b.md | target: multi:plan:skills-audit+doc-amend:AGENT-practice-index | trigger: plan-execution-gated | size: M | status: pending]`
  The skill-audit lessons are mostly workflow-maintenance backlog rather than
  PDR-shaped doctrine. Candidate checks: canonical skill bodies are the review
  target and wrappers remain pointers; command-topology drift should be audited
  for retired command paths, retired adapter paths, mutating proof commands,
  and stale workspace CLI invocations; redundant workflow skills should retire
  into always-fired homes; parallel-agent decomposition is plan hygiene rather
  than a narrow skill; guidance methodologies are not automatically skills;
  portability validation failures found during docs work are real
  infrastructure findings and should be fixed.

- 2026-05-12; **Multi-agent orchestration and planning-shape candidates**
  (Volcanic Charring Furnace distilled-stage processing of
  `napkin-2026-05-12b.md` learning).
  `[captured: 2026-05-12 | source: distilled.md+napkin-archive/napkin-2026-05-12b.md | target: multi:pdr:multi-agent-orchestration+pattern:plan-gate-grounding | trigger: second-instance | size: M | status: pending]`
  Architecture and planning lessons from the same napkin are preserved here
  rather than silently promoted. Candidate substance: multi-agent
  orchestration should use unified contracts with platform-native invocation;
  the shared layer coordinates contracts, comms, and claims without forcing
  every platform to look like Codex. Cross-platform peer review caught errors
  single-agent authoring missed in Codex guidance: JSONL shape, sandbox,
  timeout, and co-authoring details. After two cycles land, re-plan the
  remaining workstream backwards from the end-goal; the graph-stack pass found
  five substantive remaining-cycle shape changes after WS1.1 and WS1.2.
  Plan-body gate definitions drift; landed hooks are authoritative for
  implementation cycles. Reviewer nits aligned with the next planned consumer
  should be absorbed immediately, as with `TripleTerm.value: ''` before the
  RDF/JS Data Model consumer arrived.

- 2026-05-12; **Graph-stack implementation pattern candidates**
  (Volcanic Charring Furnace distilled-stage processing of
  `napkin-2026-05-12b.md` learning).
  `[captured: 2026-05-12 | source: distilled.md+napkin-archive/napkin-2026-05-12b.md | target: multi:pattern:per-kind-union-dispatch+pattern:retrospective-deferral-tripwire | trigger: second-instance | size: M | status: pending]`
  Several graph-stack implementation lessons look pattern-shaped but need a
  second context or implementation proof before becoming permanent pattern
  files. Candidate shapes: for equality across large discriminated unions, use
  per-kind checker-array dispatch so TypeScript does not have to correlate two
  union values from an equality guard; when a concept is deferred to a later
  increment, attach a retrospective review tripwire to that later increment so
  earlier surfaces can be collapsed, reshaped, removed, or kept with evidence.
  The sub-path export lesson graduated to
  `static-analysis-registration-with-scaffold.md` during the distilled-stage
  processing pass. Related planning lessons retained here for validation:
  metacognition can reveal a better layer question than the inherited frame;
  explicit open questions are design artefacts; minimal primitives can land when
  wrappers fight the discipline; friction-ratchet thresholds should summon
  assumptions review before richer tooling resumes.

- 2026-05-11; **ADR-041 amendment needed: top-level workspace tiers**
  (Dusky Masking Cloak 2026-05-11, surfaced by `assumptions-expert`
  during graph execution-prep step 1 D-4 verification).
  `[captured: 2026-05-11 | graduated: 2026-05-11 (Fronded Flowering Seed) | source: thread:connecting-oak-resources | target-resolved: amend:ADR-041-2026-05-11 | trigger-fired: blocks:ADR-173-ratification | size: M | status: graduated]`
  Resolution details: `agent-tools/` + `agent-graphs/` tiers added; matrix
  expanded to 8 rows x 8 columns; status Accepted (Revised); D-4a closed in
  `graph-mvp-arc.plan.md`; ADR-173 §Open Questions:1 cross-linked.
  Reviewers: architecture-expert-fred GO; architecture-expert-betty
  GO-WITH-CONDITIONS (2 precision edits applied); docs-adr-expert
  GO-WITH-CONDITIONS (3 housekeeping items applied).
  ADR-041 (workspace structure) enumerates exactly five tiers: `apps/`,
  `packages/core/`, `packages/libs/`, `packages/sdks/`, `packages/design/`
  with an importer/importee matrix. The repo has already shipped a
  sixth top-level tier (`agent-tools/`, referenced by ADR-165 / ADR-168 /
  ADR-178 without amending ADR-041 — a latent gap). ADR-173 adds a
  seventh top-level tier (`agent-graphs/`) for `agent-graphs/practice-graph/`.
  Before ADR-173 can move from Proposed to Accepted, ADR-041 must be
  amended to (a) add `agent-graphs/` as a top-level tier with permitted
  importer/importee rows in the dependency-direction matrix, and (b)
  regularise the already-shipped `agent-tools/` tier in the same matrix
  (closing the latent gap). ADR-041 status update: "Accepted (Revised)"
  with a dated revision note. No new ADR number required. Recorded as
  D-4a in `graph-mvp-arc.plan.md § Open Decisions`. Trigger: blocks ADR-173
  ratification — must land before graph-stack moves to ACTIVE.

- 2026-05-11; **Opener-vs-substrate divergence — planning artefacts
  can be overtaken by execution before deferral closes**
  (Dusky Masking Cloak 2026-05-11, observed during graph execution-prep
  step 1 BLOCKER verification).
  `[captured: 2026-05-11 | source: napkin-2026-05-11 | target: candidate-pattern:.agent/memory/active/patterns/ OR amend:start-right-quick OR amend:PDR-026 | trigger: second-instance | size: S | status: pending]`
  The 2026-05-11 execution-prep opener prescribed "absorb topology
  BLOCKERs into graph-stack.plan.md before ACTIVE." Verification at
  session open showed both BLOCKERs already remediated in-place by the
  2026-05-10 graph-stack edit — opener was authored presuming outstanding
  work; substrate had moved past it. Pattern shape: _"when an opener
  prescribes 'amend X to absorb Y from review Z', the first action of
  the next session must be to verify whether Y has already been absorbed
  into the canonical surface, then reshape the step accordingly."_ The
  "Ground state before constructing plans" feedback memory already
  applies; this is a planning-artefact-specific instance. Cure observed
  in this session: re-read the source-of-truth review artefact directly
  (not via the opener summary) and dispatch reviewers to attest closure
  — surfaced a real third concern (D-4a above) the inspection-only path
  would have missed. Graduation-target: candidate pattern note (with
  second instance) or amendment to start-right-quick to add an opener-
  verification step. Trigger: second instance observed.

- 2026-05-11; **Different-lens reviewers catch different gaps —**
  _Graduated 2026-05-11 (Fronded Flowering Seed consolidate-docs pass)_
  to repo-local pattern instance at
  `.agent/memory/active/patterns/different-lens-reviewer-divergence.md`.
  Substance-ripeness evidence: graduation-candidates-drain session ran
  6 multi-reviewer dispatches (3 per phase) and observed zero
  finding-overlap across pairs — each lens (betty/fred boundary +
  principles, assumptions-expert premises, docs-adr-expert documentation
  quality) caught structurally distinct gaps. Original capture below
  preserved for provenance:
- 2026-05-11; **Different-lens reviewers catch different gaps —
  multi-reviewer dispatch is not redundancy** (Dusky Masking Cloak
  2026-05-11, observed during graph execution-prep step 2 Inc.1
  decomposition).
  `[captured: 2026-05-11 | source: napkin-2026-05-11 | target: candidate-pattern:.agent/memory/active/patterns/ OR amend:invoke-code-experts | trigger: second-instance OR owner-direction | size: S | status: pending]`
  Opener prescribed `architecture-expert-betty + code-expert` for Inc.1
  decomposition review. Betty returned CLOSED with a minor follow-up
  (WS4.2 earliest-start nuance — boundary-correctness lens). `code-expert`
  independently surfaced a structurally distinct finding: WS2.1+WS3.1
  scaffold pair is NOT parallel-safe (root-file write conflicts on
  `pnpm-workspace.yaml`, root `tsconfig.json`, root `package.json`) —
  file-conflict-surface lens. The plan body had masked this by grouping
  WS2.1+WS3.1 alongside WS2.2+WS3.2 / WS2.3+WS3.3 in the "parallel-safe
  pairs" list. Pattern shape: _"when reviewers operate with different
  lenses (boundary correctness vs file-conflict surface), each surfaces
  gaps the other does not see; treat multi-reviewer dispatch as
  multi-lens coverage, not redundant validation."_ Already partly captured
  in 2026-05-07 napkin "two reviewers converged on the same BLOCKER" —
  that was about convergence as deeper-signal marker; this is the
  divergence corollary. Graduation-target: candidate pattern note or
  amendment to `invoke-code-experts` doctrine. Trigger: second instance
  OR owner direction.

- 2026-05-11; **Value-articulation can be wrong while structural shape
  is right** (Blooming Growing Thicket 2026-05-11, observed during
  graph MVP arc reshape).
  `[captured: 2026-05-11 | source: napkin-2026-05-11 | target: candidate-pattern:.agent/memory/active/patterns/ OR amend:PDR-026 OR new-PDR | trigger: second-instance | size: S | status: pending]`
  Pre-reshape, the MVP arc's 4-slice structure was correct; the wrong
  thing was the per-slice "user value triplet" framing (teacher-asks-X)
  that was retrofitted onto substrate-and-shape-learning slices. My
  first instinct was to collapse slices 2 + 3a into substrate
  increments; owner clarified substrate-building IS the value. The
  reframe was value-articulation, not structural. Pattern shape:
  _"when a plan's structure resists trimming, check whether the
  value-articulation layer is the actual defect before reshaping the
  work."_ Graduation-target: candidate pattern note (with second
  instance) or PDR-026 amendment naming this as a planning anti-
  pattern. Trigger: second instance observed.

- 2026-05-11; **Downstream-consumer cross-reference preserves
  forcing-function when scope splits between plans** (Blooming Growing
  Thicket 2026-05-11, observed during graph-stack Inc.3 cross-ref to
  combinatorial-arc plan).
  `[captured: 2026-05-11 | source: napkin-2026-05-11 | target: candidate-pattern:.agent/memory/active/patterns/ OR new-rule | trigger: second-instance OR owner-direction | size: S | status: pending]`
  When a downstream consumer (slice 3b) moves out of an upstream plan
  (MVP arc), the upstream-producing artefact (graph-stack Inc.3) loses
  its named forcing function unless the new consumer-plan's pointer is
  installed reciprocally on the producer. Without it, the producer
  becomes "design pressure-less work" and risks indefinite deferral.
  Cure observed: `architecture-expert-betty` Condition 2 forced the
  Inc.3 row to carry `graph-combinatorial-arc.plan.md` as the named
  downstream consumer. Pattern shape: _"when splitting scope across
  plans, install the consumer-pointer reciprocally on the producer or
  lose the forcing function."_ Graduation-target: candidate pattern
  note (with second instance) or new rule. Trigger: second instance OR
  owner direction.

- 2026-05-11; **Practice-adopting repos exhibit an elevated skill-
  listing budget floor by construction** (Burnished Crackling Pyre
  2026-05-11, observed during Claude `skillListingBudgetFraction` bump
  from 1% → 3%).
  `[captured: 2026-05-11 | source: napkin-2026-05-11 | target: amend:practice.md OR amend:PDR-051 | trigger: owner-direction OR second-platform-instance | size: S | status: pending]`
  The Practice's vendor-agnostic strategy deliberately uses platform
  skill surfaces (and equivalents) as the canonical integration point
  per PDR-009 (canonical-first cross-platform architecture) and PDR-051
  (vendor-agnostic skills standardisation). Repos adopting the Practice
  will therefore exhibit a structurally higher skill count than
  platform defaults assume. Claude's default `skillListingBudgetFraction`
  is 1%; this repo bumped to 3% in `.claude/settings.json` 2026-05-11
  (commit `9547bb69`). Graduation-target: a one-line note in
  `practice.md` (adoption section) or in PDR-051 stating that
  per-platform skill-listing budgets may need raising on Practice
  adoption, with Claude's 3% as the current reference. The existing
  feedback rule `feedback_skill_load_budget.md` governs the _ceiling_
  (skill-load context budget is real); this entry names the _floor
  implied by the architecture_ — they are complementary, not duplicate.
  Trigger: a second platform exhibits the same need (Cursor / Codex
  equivalent budget hits), OR owner direction to land the practice.md /
  PDR-051 amendment.

- 2026-05-09; **`src/bulk/generators/` and `vocab-gen/generators/`
  duplication routed to SDK codegen workspace decomposition plan**
  (Woodland Sheltering Glade 2026-05-09; converted from `distilled.md`
  routing-pointer entry during focused consolidation pass).
  `[captured: 2026-05-09 | source: distilled.md (graduated/removed) | target: sdk-codegen-workspace-decomposition.plan | trigger: plan-promotion-to-current | size: L | status: held-pending-plan]`
  The duplication exists between the bulk generator pipeline in
  `src/bulk/generators/` and the vocab-gen generator pipeline in
  `vocab-gen/generators/`. Cleanup is plan-shaped, not consolidation-
  shaped — depends on the SDK codegen workspace decomposition that
  has been planned but not promoted to `current/`. Held in this
  register (not in `distilled.md`) so the pointer survives consolidation
  cycles without occupying steady-read distillation surface. Trigger:
  the SDK codegen workspace decomposition plan promotes to `current/`
  and reaches a phase that consumes this duplication.

- 2026-05-09; **pre-commit gate scope (whole-tree vs staged-set)
  imposes a coordination tax on multi-agent work** (Luminous Twinkling
  Dawn 2026-05-09, observed during workflow-doc edit landing).
  `[captured: 2026-05-09 | source: napkin-2026-05-09 | target-resolved: plan:cost-of-collaboration.plan.md P0 + .husky/pre-commit staged file-content scanners | trigger-fired: owner-direction+multi-agent-deadlock-evidence | size: M | status: graduated]`
  The pre-commit hook runs `prettier --check .` and `markdownlint --dot .`
  over the _entire_ working tree, not the staged set. Any working-tree
  noise from any agent (concurrent session WIP, abandoned partial edits,
  in-progress test fixtures) breaks every commit until that noise is
  cleaned. Observed instance: a clean 2-file workflow-doc edit could
  not land because (a) commit attempt 1 failed on a parallel agent's
  earlier-commit MD038 issue in `repo-continuity.md` line 405, and (b)
  commit attempt 2 failed on prettier in
  `agent-tools/tests/skills-adapter-generate/fixtures/lock-malformed.json`
  — an untracked WIP fixture from a concurrent session's WS1 work that
  is not in the staged set. The architectural property: gate-scope
  mismatch with commit-scope produces silent coordination failures
  between agents whose changes don't even touch the same files.
  Source-surface:
  [`napkin.md § 2026-05-09 Surprise: pre-commit gate scope is whole-tree, not staged-set`](../active/napkin.md).
  Disposition 2026-05-12: graduated through the completed P0 quality-gate
  rebalance. The selected shape narrows file-content scanners to staged paths
  while retaining the whole-repo broken-code guard before commit; the later
  2026-05-11 load-bearing entry below preserves the stronger multi-agent
  evidence and final wording.

- 2026-05-09; **fitness-validator output should print the
  non-reactive-response discipline reminder inline at non-healthy
  zones** (doctor-safe-merge tooling-feedback 2026-05-07; corpus
  recurrence confirmed 2026-05-09).
  `[captured: 2026-05-09 | source: historical-napkin-synthesis-2026-05-09 | target: tool-amend:scripts/validate-practice-fitness.ts | trigger: tooling-implementation OR owner-direction OR second-instance | size: S | status: pending]`
  Three corpus-window instances of agents reflexively trimming
  substance when fitness signals fire (Embered 05-06, Pelagic 05-07,
  doctor-safe-merge 05-07) prove the doctrine is doctrine-resistant
  under context pressure. Reading the rule once is verifiably not
  enough. The cure: fitness validator output (`pnpm
practice:fitness:informational`) should print the discipline
  reminder text inline at every non-healthy (`soft` / `hard` /
  `critical`) zone — _"Preserve substance first. Do not delete, trim,
  compress, or weaken memory or Practice Core content to make this
  report greener. Treat fitness as a routing signal: home, graduate,
  split, refine real redundancy, review the limit, or open an
  explicit remediation lane."_ This is sibling cure to the
  lifecycle-aware fitness model (see entry above); both graduate
  together. Source-surface:
  [`archive/napkin-2026-05-07-doctor-safe-merge.md`](../active/archive/napkin-2026-05-07-doctor-safe-merge.md)
  §Practice-tooling-feedback `agent-tools:practice-fitness`. Source
  finding:
  [`historical-napkin-synthesis-2026-05-09.md`](../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md)
  §F1. Graduation-target: `scripts/validate-practice-fitness.ts`
  output amendment to print discipline-reminder when any zone is
  non-healthy. Trigger: tooling-implementation OR owner direction.
  Status: pending.

- 2026-05-09; **verify reviewer text-claims against the diff
  before applying corrections** (Pelagic Rolling Harbour 2026-05-07,
  first instance).
  `[captured: 2026-05-09 | source: historical-napkin-synthesis-2026-05-09 | target: rule-or-pattern | trigger: second-instance | size: S | status: pending]`
  Reviewer cited specific text the diff did not contain (PDR-026
  §Sequenced-deferral discipline citation that was actually in
  procedural-text-not-diff). `git diff | grep` would have caught the
  conflation cheaply. The reviewer's substance was load-bearing even
  when the textual claim was wrong; trust-but-verify on textual
  claims saves wrong-direction edits. First-instance evidence; capture
  awaiting second-instance to promote. Source-surface:
  [`archive/napkin-2026-05-07-graph-mvp-planning.md`](../active/archive/napkin-2026-05-07-graph-mvp-planning.md)
  Pelagic §Surprise-2 + same content in
  [`archive/napkin-2026-05-07-doctor-safe-merge.md`](../active/archive/napkin-2026-05-07-doctor-safe-merge.md).
  Source finding:
  [`historical-napkin-synthesis-2026-05-09.md`](../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md)
  §F3b. Graduation-target: rule (`.agent/rules/verify-reviewer-text-claims-against-diff.md`)
  OR pattern instance under category `agent`. Trigger: second-instance.
  Status: pending — first instance.

- 2026-05-09; **reviewer convergence points at a conceptual root
  deeper than either reviewer named directly** (Breezy Navigating
  Sail 2026-05-07, first instance, named in the originating napkin
  as a candidate process pattern).
  `[captured: 2026-05-09 | source: historical-napkin-synthesis-2026-05-09 | target: pattern:patterns/reviewer-convergence-points-at-conceptual-root.md | trigger: second-instance | size: S | status: pending]`
  Two independent reviewers converged on the same BLOCKER through
  different reasoning (code-reviewer flagged "slice 3b composes by
  name"; assumptions-reviewer flagged "compose by name violates
  substrate-only design principle"). The convergence pointed at a
  deeper conceptual mistake than either reviewer named — composing
  OTHER MCP TOOLS at runtime when the correct model was composing
  underlying graph data through the SDK substrate. The "by name"
  phrasing appeared in 4 places across slices 2, 3a, 3b — all
  symptoms of one wrong mental model. Diagnostic: when reviewers
  converge through different reasoning paths, grep all related
  surfaces for the symptomatic phrase before fixing only the cited
  spots. Originating napkin already named this as candidate
  pattern. Source-surface:
  [`archive/napkin-2026-05-07-graph-mvp-planning.md`](../active/archive/napkin-2026-05-07-graph-mvp-planning.md)
  Breezy §Surprise-1. Source finding:
  [`historical-napkin-synthesis-2026-05-09.md`](../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md)
  §F3c. Graduation-target: pattern instance
  `.agent/memory/active/patterns/reviewer-convergence-points-at-conceptual-root.md`
  (polarity: pattern; category: process). Trigger: second-instance.
  Status: pending — first instance.

- 2026-05-09; **owner-bounded reviewer scope can collapse a
  multi-session arc into single-session closure without quality
  regression** (Breezy Navigating Sail 2026-05-07, first instance).
  `[captured: 2026-05-09 | source: historical-napkin-synthesis-2026-05-09 | target: pattern-instance | trigger: second-instance | size: S | status: pending]`
  Owner directed _"reduce reviewers to code-reviewer +
  assumptions-reviewer; have a specialist do the topology review in
  parallel; finish the planning this session"_ — collapsed a
  proposed 5-reviewer / 4-session pass to a 2 + 1 / 1-session pass.
  All five planning phases landed cleanly with BLOCKERs surfaced AND
  remediated AND captured for next-session, no quality regression.
  Substance: "comprehensive review" was over-scoped relative to the
  session-bounded landing target. The proportional reviewer set for
  the arc's specific BLOCKER-surfacing job was 2 + 1, not 5. Owner-
  set when there is a hard landing commitment. Sibling to the
  comprehensive-cataloguing-drift anti-pattern (proportionality
  question is the substrate). Source-surface:
  [`archive/napkin-2026-05-07-graph-mvp-planning.md`](../active/archive/napkin-2026-05-07-graph-mvp-planning.md)
  Breezy §Surprise-2. Source finding:
  [`historical-napkin-synthesis-2026-05-09.md`](../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md)
  §F10. Graduation-target: pattern instance under category `process`,
  positive polarity (the cure-shape, not the failure mode); cross-
  reference comprehensive-cataloguing-drift.md. Trigger:
  second-instance. Status: pending — first instance.

- 2026-05-07; **sequence-or-admit-not-doing doctrine — never use
  "deferred" as a bare status; sequence (gate-relative or tripwire-
  based) or admit not-doing** (Windward Darting Horizon, owner
  correction during MVP-arc spine authoring).
  `[captured: 2026-05-07 | source: owner-direction | target: rule:never-use-bare-deferred-status OR directive-amend:principles.md | trigger: second-instance OR owner-direction | size: S | status: pending]`
  Owner direction: _"we never mark anything as deferred, we sequence
  things properly or we admit we are not going to do them. Sequencing
  can include 'when these specific tripwires fire'."_ I had added an
  unsequenced `mvp_arc_status: deferred` YAML annotation. Existing
  `sentry-observability-maximisation-mcp.plan.md` correctly uses the
  word "deferred" only as a modifier on a stated reopen tripwire (e.g.
  _"Deferred to public beta 2026-04-20; reopen when X"_); the doctrine
  is: bare-status `*: deferred` is the violation, not the word itself.
  Source-surface: napkin
  [`napkin.md § 2026-05-07 Doctrine — sequence-or-admit-not-doing`](../active/napkin.md).
  Graduation-target: (a) new rule
  `.agent/rules/never-use-bare-deferred-status.md` with canonical-plus-
  adapters triple; (b) extend `no-moving-targets-in-permanent-docs.md`
  with a deferred-as-bare-status clause; (c) directive amendment to
  `.agent/directives/principles.md`. Trigger: second-instance
  observed OR owner direction at promotion. **Status (2026-05-09):
  three corpus-window instances confirmed via historical-napkin-synthesis
  (Windward spine 2026-05-07; Briny vaporware-cited deferral 2026-05-06;
  PDR-051 plan §Out-of-scope 2026-05-09); promotion is now owner-gated**
  per [`historical-napkin-synthesis-2026-05-09.md`](../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md)
  §F11. Originally captured to honour the moment per PDR-048.

- 2026-05-07; **spine drift via comprehensive cataloguing — when a
  coordination spine starts enumerating "things adjacent that the
  spine doesn't ship", the spine has shifted from coordination tool
  to roadmap and is over-claiming authority** (Windward Darting
  Horizon, owner correction during MVP-arc spine authoring; same
  session as the sequence-or-admit-not-doing doctrine).
  `[captured: 2026-05-07 | source: owner-direction | target: pattern:patterns/spine-drift-via-comprehensive-cataloguing.md | trigger: second-instance | size: M | status: pending]`
  Owner correction: _"the NC work is explicitly NOT part of the MVP,
  you have clearly become confused"_. Sequence: I authored an MVP-arc
  spine, then at the doctrine correction (entry above) I treated the
  NC SKOS taxonomy plan as an "out-of-arc item" the spine should
  sequence — generating a `## Out-of-MVP-Arc Items` section + per-
  slice resolution todos + `mvp_arc_sequencing` YAML field on the NC
  plan. All wrong. The NC plan was never IN the spine's scope; "cuts"
  and "out-of-arc resolution" were category errors. The spine should
  track ONLY what's IN the spine's commitment; adjacent plans own
  their own sequencing. Source-surface: napkin
  [`napkin.md § 2026-05-07 Surprise — boundary error: spine should not track non-MVP plans`](../active/napkin.md).
  Graduation-target: anti-pattern in `.agent/memory/active/patterns/`
  named `spine-drift-via-comprehensive-cataloguing.md` (polarity:
  anti-pattern); template signal for spine authoring: when tempted to
  enumerate "things outside the spine" inside the spine, stop and ask
  whether the spine has become a roadmap. Trigger: second-instance
  observed (could come from any coordination-spine plan author).
  **Status: partially graduated 2026-05-09** — historical-napkin-synthesis
  found three corpus-window instances (spine, reviewer-pass, rule-extension)
  and authored the broader anti-pattern as
  [`comprehensive-cataloguing-drift.md`](../active/patterns/comprehensive-cataloguing-drift.md).
  This entry's spine-specific instance evidence is preserved by the broader
  pattern's spine-instance section; entry remains as historical capture.
  Source: [`historical-napkin-synthesis-2026-05-09.md`](../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md) §F2.

- 2026-05-06; **branch PR Sonar is a regression guard, not the backlog source
  for a branch opened to fix existing main/project Sonar debt** (Owner
  correction during Ethereal Ascending Twilight's
  main-critical-sonar-remediation handoff). Failure mode: after opening draft
  PR #97 to trigger remote Sonar, the session treated PR-scoped new issues and
  duplication as the remediation worklist, then chased a generated MCP executor
  duplication refactor. Owner correction: a branch cannot be opened to fix its
  own Sonar issues because branch-scoped issues only exist after branch work
  exists; the authoritative backlog for this lane is the current main/project
  HIGH issues and security hotspots. PR Sonar verifies that the remediation
  branch does not introduce regressions. Source surface: napkin 2026-05-06
  Ethereal Ascending Twilight surprise + corrected plan
  `.agent/plans/architecture-and-infrastructure/current/main-critical-sonar-rebuild-from-updated-main.plan.md`.
  Graduation-target: rule or planning-process amendment naming backlog-source
  discipline for quality-remediation branches. Trigger: second instance of an
  agent using branch/PR analysis as the primary worklist when the branch purpose
  is an existing main/project backlog, or owner direction. Status: pending.

- 2026-05-07; **fitness limits encode an implicit access-rhythm
  theory; recalibration must name the lifecycle, not just bump
  numbers** (Pelagic Rolling Harbour, owner-direction reframe of
  the pending-graduations HARD-persists framing).
  `[captured: 2026-05-07 | source: owner-direction | target: multi:doc-amend:fitness-validator-doc+pdr:fitness-lifecycle-axis | trigger: second-instance | size: M | status: pending]`
  I had
  treated the persisting HARD on this register as a load-bearing
  signal and surfaced three response options (enlarge / split /
  cadence) as "owner direction". Owner reframed: the limit was
  arbitrarily calibrated against a frame that doesn't fit this
  file's lifecycle. `principles.md` is loaded every session by
  every agent — small _is_ the quality signal. This register is
  accessed at consolidation passes only and grows with cross-
  session-wait substance — its limits should reflect a queue
  lifecycle, not a permanent-doc shape. The deeper insight:
  every fitness-tracked file implicitly encodes an access-rhythm
  theory in its limit shape; the schema should make that explicit
  so recalibration is principled rather than ad-hoc. Source-
  surface: this session's owner-direction turn after the
  2026-05-07 dedicated drain.
  Graduation-target: (a) extend the fitness validator and/or its
  documentation in `scripts/validate-practice-fitness.ts` and the
  ADR-144 narrative to name `lifecycle_model` and `access_pattern`
  as recommended (or required) frontmatter fields with a closed
  vocabulary (`loaded-every-session` / `read-on-demand` /
  `consolidation-pass-only` / `archive-only`); (b) sweep existing
  fitness-tracked files to declare their access pattern; (c) PDR
  capturing the doctrine ("limits encode access-rhythm theory")
  if it generalises across Practice-bearing repos. Trigger:
  second instance OR owner direction at promotion. The first
  instance is this session's recalibration. Status: pending —
  capture to honour the moment per PDR-048 (insight capture at
  moment of occurrence); promotion when accumulation or owner
  direction warrants. **Cross-reference (2026-05-09)**:
  historical-napkin-synthesis confirms the recurrence of fitness-as-trim
  impulse across three corpus-window instances and identifies this
  lifecycle-aware-fitness recalibration as one of two structural cures
  (sibling cure: active inline discipline-reminder text in fitness output
  at non-healthy zones — separate entry below). Source:
  [`historical-napkin-synthesis-2026-05-09.md`](../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md)
  §F1.

- 2026-05-06; **`/doctor` is session-local evidence, not a shell-
  invocable validation gate** (Briny Plumbing Fjord, owner
  correction during urgent skill-load pressure relief).
  `[captured: 2026-05-06 | source: napkin-archive/2026-05-06-evening-graduation-pass | target: doc-amend:development-practice.md OR rule:plan-authoring | trigger: second-instance | size: S | status: pending]`
  I had
  framed blocked evidence as "Codex cannot get non-interactive
  `claude doctor` output", treating shell `claude doctor` as a
  validation gate. Owner sharpened: `/doctor` reports on skills
  loaded into the active Claude Code _session_, so command-line
  invocation cannot prove the session skill surface anyway.
  Behaviour change: plans must not make shell `claude doctor` a
  validation gate. Treat `/doctor` counts as optional owner-
  supplied session-local evidence; validate settings changes
  through repo-local gates and explicit settings/plugin diffs.
  Source-surface: napkin
  [`archive/napkin-2026-05-06-evening-graduation-pass.md`](../active/archive/napkin-2026-05-06-evening-graduation-pass.md)
  Briny session §Correction. Graduation-target options: (a) bullet
  in [`docs/governance/development-practice.md`](../../../docs/governance/development-practice.md)
  § Documentation Practice naming "shell-invoked session-state
  commands as validation gates" as a plan-authoring anti-pattern;
  (b) extend an existing plan-authoring rule with the same. The
  framing is small but precise; single bullet likely sufficient.
  Trigger-condition: second instance OR owner direction at
  promotion. Status: `pending` — single first-class instance,
  small substance, captured for graduation when accumulation or
  direction warrants.

- 2026-05-05; **pattern surface needs polarity discipline** —
  graduated 2026-05-10 (Sylvan Fruiting Glade) to PDR-014
  amendment + bulk sweep across ~93 pattern files +
  `.agent/memory/active/patterns/README.md` §Polarity. Audit-
  trail body archived to
  [`archive/pending-graduations-archive-2026-05-10.md`](archive/pending-graduations-archive-2026-05-10.md).
  Status: graduated 2026-05-10.

- 2026-05-05; **30% context budget for directive-file processing** —
  graduated 2026-05-10 (Sylvan Fruiting Glade) to
  [PDR-052 (Directive-File Context Budget)](../../practice-core/decision-records/PDR-052-directive-file-context-budget.md).
  Audit-trail body archived to
  [`archive/pending-graduations-archive-2026-05-10.md`](archive/pending-graduations-archive-2026-05-10.md).
  Status: graduated 2026-05-10.

- 2026-05-05; **cyclical learning-loop maintenance is a full-time
  process even at small N** (Owner-stated meta-observation during
  Opalescent Threading Nebula's promotion pass): _"note the
  cyclical nature, even with only two agents running, managing
  the learning loop is a full time process"_. Today's evidence:
  Opalescent's session and Dawnlit's session both contributed
  substance to the same napkin in <2 hours; both surfaced the
  same orchestrator-vs-hook conflation; both required owner
  correction; substance produced _about the loop_ accumulated
  alongside substance produced _by the loop_. The loop does not
  asymptote — every pass discovers new candidate-substance for
  future passes. Operational implication: loop maintenance is the
  substrate that future feature work runs on; its cost is
  _baseline_, not overhead. At N=2 the cost is already a full-time
  process; scales superlinearly with N because cross-agent
  coordination substance accumulates faster than any single
  agent's substance graduates. Source surface: owner direction
  this session; distilled.md §Process entry. Graduation-target
  options: (a) PDR in `practice-core/decision-records/` covering
  Practice operational scaling (adopter scope: every multi-agent
  Practice-bearing repo); (b) amendment to PDR-014 (consolidation
  flow) naming the loop's full-time-baseline character. Trigger:
  second instance OR owner direction. Status: pending — single
  observation today; substance grows across more passes.

- 2026-05-05; **eager rounding-off on partial structures under
  failure pressure** (Opalescent Threading Nebula, host pattern
  authored 2026-05-05): the deeper disposition that drives the
  orchestrator-vs-hook conflation. Under failure pressure, agents
  round partial structures into whole structures and act on the
  rounded-off whole; the information gap is often zero. Five-step
  rounding chain: pre-screen → gate → blocking gate → commit
  refused → bypass needed. Three observed instances all in this
  repo's commit flow on 2026-05-05 (Ethereal, Dawnlit, Opalescent).
  Source surface:
  `.agent/memory/active/patterns/eager-rounding-off-on-partial-structures.md`
  (host pattern, anti-pattern polarity, agent-tier). Graduation-
  target: promotion to Practice-Core PDR with `pdr_kind: pattern`
  or amendment to an existing PDR after second-context
  manifestation outside commit flow (release pipeline, deploy
  pipeline, schema migration gate, or any other layered enforcement
  context). Trigger: second-context manifestation OR owner
  direction. Status: pending — single-context evidence (all 3
  instances are orchestrator-vs-hook conflation in commit flow);
  promoting to Practice Core on single-context evidence would be
  generalising from one context, exactly the rounding-off failure
  the pattern names.

- 2026-05-05; **owner-initiated execution as bypass-by-trust-boundary
  is a fourth mechanism shape for the structural-enforcer recursive-
  exclusion pattern** (Ethereal Transiting Comet, encountered during
  graduation pass commit attempt). The `git --no-verify`
  PreToolUse bash hook block fired on the very pattern being
  landed; agent-tool layer cannot bypass the hook even with owner
  authorisation, but owner-side execution via the `!` prefix runs
  in owner's shell, bypassing the agent-tool hook chain. This is
  distinct from the three mechanism shapes the pattern's
  worked-instances table now names (explicit `exclude_paths`;
  per-line context exclusion; self-exclusion by placement) — those
  cure the enforcer's path-scope problem; this fourth shape cures
  via shifted-execution-trust-boundary. Source surface: napkin
  §Surprise 1 (this date), experience file
  `2026-05-05-ethereal-the-pattern-fired-on-its-own-commit.md`,
  pattern file `structural-enforcer-recursive-exclusion.md` (table
  carries three mechanism shapes; this would be the fourth row).
  Graduation-target: amendment to the pattern's worked-instances
  table adding the trust-boundary-shifted-execution row, OR
  separate dedicated pattern if the trust-boundary shape recurs in
  non-`--no-verify` contexts (e.g. owner-side credential reads,
  owner-side destructive operations gated by deny-list, owner-side
  network actions blocked from agent-tool layer). Trigger: second
  instance of agent-tool-hook firing on owner-authorised action
  where owner can execute the same action directly. Status:
  `pending` — single-instance.

- 2026-05-05; **severity is not urgency** (Ethereal Transiting Comet,
  owner-corrected at session open). Owner direction: _"remember,
  critical means important, but it does not mean rush, if anything
  even more care and thoughtfulness is needed"_. Severity-tier
  labels (CRITICAL, HARD, P1, escalation-tier any other system)
  name importance, not urgency. The response to severity is more
  care, more thoughtfulness, slower processing — not faster action.
  Sharpening of `feedback_no_speed_pressure.md` saved at moment of
  correction. Substance: the failure mode is "CRITICAL → drive
  action" framing, which is the same impulse no-speed-pressure
  names dressed in escalation-tier vocabulary. Source surface:
  user-memory `feedback_no_speed_pressure.md` (refined this date),
  napkin §Surprise 3 (this date), experience file
  `2026-05-05-ethereal-the-pattern-fired-on-its-own-commit.md`
  §Three things I am taking from this. Graduation-target: amendment
  to `.agent/rules/no-speed-pressure.md` adding the severity-vs-
  urgency distinction with worked instance, OR PDR amendment if
  the framing crosses repos (severity-vs-urgency conflation is
  unlikely to be host-specific). Trigger: SECOND INSTANCE of an
  agent framing an escalation-tier label as a haste driver in any
  context. Status: `pending` — single first-class instance with
  user-memory refinement; rule extension follows on second instance
  per register-on-substance-not-instance-count discipline only when
  substance is multi-instance.

- 2026-05-05; **Inter-agent communication is a first-class coordination
  primitive** (Lacustrine Navigating Rudder, owner-named after the
  Gnarled-Lacustrine sub-2-min-roundtrip resolution).
  Source-surface: user-memory `feedback_inter_agent_comms_first_class.md`,
  napkin §Surprise 4 (this date).
  Graduation-target: extend [`.agent/rules/use-agent-comms-log.md`](../../rules/use-agent-comms-log.md)
  to make explicit the workflow ("when another agent's state blocks
  yours and they may still be active: post comms-event with deadline
  - default-action; poll briefly; escalate to owner only if no
    response inside the deadline window"). Possible PDR candidate
    encoding the more general principle: agent-to-agent coordination
    is direct unless the decision is owner-owned. Possibly an ADR
    amendment to ADR-150 (Continuity Surfaces) since comms live
    in that surface.
    Trigger-condition: second instance of agent-to-agent coordination
    resolving without owner mediation (this Gnarled-Lacustrine round
    is the worked example; second instance graduates from feedback to
    rule).
    Status: `pending`.

- 2026-05-05; **ADRs are permanent and outlive plans; plans cite ADRs,
  never the reverse** (Lacustrine Navigating Rudder, owner correction
  during BF-2/BF-4 doc cleanup).
  Source-surface: user-memory `feedback_adrs_permanent_plans_ephemeral.md`,
  napkin §Surprise 3 (this date).
  Graduation-target: extend
  [`.agent/rules/no-moving-targets-in-permanent-docs.md`](../../rules/no-moving-targets-in-permanent-docs.md)
  with the directionality principle (currently the rule covers SHAs
  / counts / tool versions; the directionality "permanent ↛ ephemeral"
  is a coarser-grained framing that subsumes the SHA case). Could
  alternatively be a new rule
  `.agent/rules/no-ephemeral-pointers-in-permanent-docs.md` if the
  framing benefits from its own surface. Possible PDR candidate on
  the broader directionality principle ("permanent records cite
  permanent records; ephemeral records may cite up").
  Trigger-condition: rule-text update at next doctrine-enforcement
  pass on the no-moving-targets rule, OR second instance of the
  ADR↛plan reverse-citation failure mode in a separate ADR/runbook.
  Status: `pending`.

- 2026-05-05; **Entry-point contract: default + named extensions
  framing is forward-compatible by design** (Lacustrine Navigating
  Rudder, owner-named during AGENTS.md drift incident).
  Source-surface: `.agent/commands/session-handoff.md` step 6d (this
  date), napkin entries on this session.
  Graduation-target: pattern-tier — the design move generalises:
  _write the default contract such that a new participant joining
  without specific accommodation gets compatible behaviour first,
  then add named extensions only where the participant's behaviour
  requires it_. Possible pattern entry at
  `.agent/memory/active/patterns/default-plus-named-extensions-for-forward-compatibility.md`
  applicable beyond entry-point files (e.g. config schemas, plugin
  contracts, multi-platform adapter pairs, even API design).
  Trigger-condition: second instance of the pattern (recognise it
  in another design context — e.g. in MCP transport adapters, or in
  a config-schema decision — graduates from session-local note to
  pattern entry).
  Status: `pending`.

- 2026-05-05; **Moments of correction are high-bandwidth signals
  worth capturing regardless of whether the correction is technical
  or relational** (Lacustrine Navigating Rudder, surfaced by reading
  Gnarled's two 2026-05-05 experience files together, per
  consolidate-docs §4c emergent-cross-experience scan).
  Source-surface: `.agent/experience/2026-05-05-gnarled-the-header-was-the-contract.md`
  - `.agent/experience/2026-05-05-gnarled-the-asymmetry-was-the-path.md`
    read as a pair.
    Graduation-target: pattern-tier — both files capture the texture
    of a _being-corrected_ moment; the first is technical
    (markdown-direct vs JSON-event contract), the second is relational
    (receiving an apology across the asymmetric agent/human boundary).
    The pattern observation: the correction itself, regardless of
    domain, is the high-leverage signal — and the experience surface
    is precisely where it lands rather than dispersing as
    unstructured affect. Possible pattern entry at
    `.agent/memory/active/patterns/correction-as-experience-signal.md`
    OR a PDR amendment to PDR-048 (insight-capture-at-moment-of-occurrence)
    noting that _correction_ is a specific shape of insight-moment that
    deserves named capture.
    Trigger-condition: second cross-experience pair surfacing the
    same correction-as-signal observation (likely on a different
    thread or platform) graduates from session-local register
    observation to pattern entry / PDR amendment.
    Status: `pending`.

- 2026-05-05; **Two-tier authorisation chain for sensitive index
  actions** (Lacustrine Navigating Rudder, observed during option-2
  unstage of Gnarled's pre-staged files).
  Source-surface: napkin §Surprise 5 (this date).
  Graduation-target: pattern entry
  `.agent/memory/active/patterns/two-tier-authorisation-claim-holder-plus-owner.md`
  capturing: when an action affects another agent's claimed state,
  obtaining the affected agent's authorisation (e.g. via comms
  reply) is necessary but not sufficient if the original deferral
  was owner-directed; the owner's separate authorisation is also
  required. Affects the
  [`respect-active-agent-claims`](../../rules/respect-active-agent-claims.md)
  rule's interaction model. Possible PDR amendment if the principle
  surfaces in second-instance form.
  Trigger-condition: second instance of two-tier-authorisation in a
  different context (e.g. another agent's branch / config / shared
  state) graduates from session-local pattern candidate to pattern
  entry.
  Status: `pending`.

continuity snapshots.

- 2026-05-05; **`use-agent-comms-log` rule must name the JSON-event-only
  authoring contract explicitly** (Gnarled Climbing Bark, post-handoff
  discovery via owner's _"check your messages please"_ prompt).
  Source-surface: `napkin.md` 2026-05-05 §Surprise 5 + experience file
  `experience/2026-05-05-gnarled-the-header-was-the-contract.md`.
  Specific instance: I edited `shared-comms-log.md` directly during
  session-handoff to post a heads-up to Moonlit Shimmering Comet about
  the OAuth proxy test gate. The file is generated from
  `.agent/state/collaboration/comms/*.json` (its own header
  documents this via `> Generated from ...`); regeneration overwrote
  my manual append, the heads-up never reached the rendered log, and
  my session-handoff summary claimed it had. Discovered when owner
  prompted _"check your messages please"_ and a fresh real comms-event
  from Lacustrine Navigating Rudder appeared at the bottom of the
  rendered log addressed to me with a 2-minute deadline. Cure
  applied this session: re-posted the Moonlit heads-up as a proper
  JSON event (`ce5cc169-491f-45fe-9f7a-b97bdb67f002.json`) and the
  Lacustrine reply as a proper JSON event
  (`4ec85e69-5ee3-4dfb-a74f-09456ef7bf6d.json`).
  Graduation-target: extend
  [`.agent/rules/use-agent-comms-log.md`](../../rules/use-agent-comms-log.md)
  to state explicitly _"the rendered `shared-comms-log.md` is generated;
  do not edit it directly — author comms as JSON files under
  `.agent/state/collaboration/comms/<uuid>.json` only"_.
  Currently the rule references _"timestamped comms event that renders
  into shared-comms-log.md"_ without naming that direct edits are
  reverted by regeneration. The discipline is implicit in the generator
  script's existence; making it explicit at rule-tier closes the
  exposure window. Trigger-condition: SECOND INSTANCE of an agent
  editing the rendered log directly under the wrong-write-surface
  assumption — the cost (lost message; falsely-confident handoff
  summary) is high enough that single-instance graduation may be
  warranted; owner direction at promotion supersedes. Status: pending.

- 2026-05-05; **comms-event authoring CLI helper to reduce latency under
  time-bounded coordination windows** (Gnarled Climbing Bark, real-time
  coordination with Lacustrine Navigating Rudder under 2-minute
  deadline). Source-surface: `napkin.md` 2026-05-05 §Surprise 6 +
  experience file
  `experience/2026-05-05-gnarled-the-header-was-the-contract.md` §Eight
  seconds. Specific instance: Lacustrine's question event arrived with
  a deadline 2 minutes out; I read it ~30 seconds in; substance settled
  immediately but the JSON-event ceremony (UUID, ISO timestamp, four
  identity fields, title + body, heredoc-quoted into a file) took
  ~1 minute. Reply landed at 08:39:50Z, 8 seconds before the
  08:39:58Z deadline. Under a tighter pressure profile (deadline
  measured in tens of seconds) the ceremony would have been the
  bottleneck. Graduation-target: an `agent-tools` CLI subcommand,
  e.g. `pnpm agent-tools:collaboration-state -- comms-event new
--title "..." --body "..."` (or `pnpm agent-tools:comms-event new
...`). The CLI fills boilerplate (UUID, ISO timestamp), runs identity
  preflight, validates schema, writes the JSON. Substance stays in
  agent's hands; ceremony is automated. Trigger-condition: SECOND
  INSTANCE of time-bounded comms coordination where ceremony latency
  meaningfully reduces the response window — OR owner direction.
  Status: pending.

- 2026-05-05; **trust-the-artefact's-stated-provenance pattern: read the
  artefact's self-documentation before treating it as a write target**
  (Gnarled Climbing Bark, comms-log direct-edit failure mode).
  Source-surface: experience file
  `experience/2026-05-05-gnarled-the-header-was-the-contract.md` §What
  shifted. Pattern shape: a markdown file whose first lines say
  _"Generated from ..."_ is exactly what it says it is — a derived
  view, not a write target. A directory containing schema-conforming
  JSON event files is the canonical ingest. The artefact's
  self-documentation IS the contract; its file extension and editor-
  openability are not. Generalises beyond comms-log: applies to any
  generated index, any rendered view, any derived state surface in the
  repo. Graduation-target: pattern candidate at
  `.agent/memory/active/patterns/trust-the-artefacts-stated-provenance.md`
  (or similar) capturing the failure mode + cure + adjacent instances.
  The shape is structurally similar to
  `passive-guidance-loses-to-artefact-gravity` (an artefact's natural
  affordances dominate stated discipline) but in the opposite
  direction: here the artefact's stated discipline (_Generated
  from ..._) is precisely what dominates if read, but is silently
  ignored when not read. Trigger-condition: SECOND INSTANCE of a
  generated/derived surface being treated as a write target.
  Status: pending.

- 2026-05-05; **agent-initiated `--no-verify` is forbidden, even when the
  doctrinal pre-existing-violations exception applies** (Gnarled
  Climbing Bark, owner correction on commit-skill orchestrator hard
  fail). Source-surface: `napkin.md` 2026-05-05 §Surprise 2 + user-
  memory `feedback_no_verify_fresh_permission.md` (refined). Owner
  direction 2026-05-05: _"stop asking for `--no-verify`, just because I
  can give permission doesn't mean I will... I will tell you when it is
  appropriate to use, not the other way around"_. The framing of
  `--no-verify` as one-of-three-options _itself_ is the failure mode —
  by surfacing it the agent reframes hook failures as request
  opportunities rather than as questions about working-tree state.
  Graduation-target: amend
  [`.agent/rules/no-verify-requires-fresh-authorisation.md`](../../rules/no-verify-requires-fresh-authorisation.md)
  to encode the asymmetry directly (owner-initiated only; agents do not
  propose / request / surface / ask). Trigger-condition: SECOND
  INSTANCE of an agent surfacing `--no-verify` as an option after this
  refinement is captured (the user-memory feedback file is now updated;
  the rule extension follows on second instance per
  register-on-substance-not-instance-count discipline only when
  substance is multi-instance — currently single-instance). Status:
  pending.

- 2026-05-05; **PDR-027 amendment — identity routing must use (name, prefix) pair**
  (Twilit Beaming Aurora → Ashen Banking Bellows session, `7cf730`,
  observability-sentry-otel coordinator role). Owner-stated:
  _"the name might change, but the session prefix will not, maybe the
  routing should use them as a pair. They are not 1:1, the name can change
  without the prefix changing, and the prefix can change if an identity is
  preserved across multiple sessions... but still, we have additional
  information we could use to at least request further information or
  discuss options"_. Same prefix + different name = drift signal, name
  attribution suspect. Same name + different prefix = returning agent under
  same identity. Different both = standard new identity. Source-surface:
  `feedback_identity_routing_uses_name_and_prefix_pair.md` plus napkin
  Surprise 3 (live drift this session). Graduation-target: amendment to
  PDR-027 (threads-sessions-and-agent-identity) adding §Identity Routing
  rules; possibly companion amendment to `register-identity-on-thread-join`
  rule. Trigger-condition: drafting slot reached (substance is single-
  instance live but generalisable). Status: pending.

- 2026-05-05; **PDR candidate — coordinator role as named pattern**
  (Twilit Beaming Aurora → Ashen Banking Bellows session, full-time
  coordinator role under owner direction _"I need all sessions to complete
  their work, this has been going on far too long"_ + observation
  _"the introduction of a full time coordinator agent (you) unblocked
  progress, it did not render the process smooth or efficient, that is
  not criticism, it is an observation on the limits of the current
  approaches"_). The role emerged from substrate gaps: 7-agent session
  exceeded current tooling capacity; the coordinator pattern is a
  proportionate behavioural cure for what should be substrate-level
  affordances. Source-surface: experience file `2026-05-05-twilit-ashen-
coordinator-7agent-arc.md` plus napkin Surprises 1, 2, 9. Graduation-
  target: PDR (a) defining when a coordinator role is appropriate;
  (b) naming coordinator authority (cross-claim landing under owner
  authorisation; peer-claim archival under owner-forced-close;
  doctrine-coaching of stuck peers); (c) naming when coordinator-role is
  the right cure vs when substrate work is the right cure (the latter
  reduces the former). Trigger-condition: single instance with rich
  texture; second instance would be diagnostic. Status: pending —
  observe whether next multi-agent session needs a coordinator;
  graduate to PDR if yes.

- 2026-05-05; **PDR candidate — orchestrator-vs-gate structural cure** —
  graduated 2026-05-10 (Sylvan Fruiting Glade) to
  [PDR-053 (Orchestrator-vs-Gate Structural Cure)](../../practice-core/decision-records/PDR-053-orchestrator-vs-gate-structural-cure.md)
  - ADR-176 + script rename
    (`scripts/check-commit-skill-gates.ts` → `scripts/check-commit-skill-advisories.ts`)
  - commit-skill SKILL update. Audit-trail body archived to
    [`archive/pending-graduations-archive-2026-05-10.md`](archive/pending-graduations-archive-2026-05-10.md).
    Status: graduated 2026-05-10.

- 2026-05-05; **PDR candidate — cross-lane repair pattern (do-the-repair-
  leave-unstaged-post-heads-up)**. Source: Asteroid → Fronded interaction
  during the takeover-bundle commit attempt; Asteroid hit lint failures in
  Fronded's collaboration-cli-gaps lane (Fronded-owned files), did the
  minimal fix (split file to clear max-lines, shape adjustment, Prettier),
  explicitly DID NOT stage the repair, posted heads-up event `c9dff8f1`
  so Fronded could absorb. Cure-asymmetric counterpart to foreign-stage
  absorption: protects the lane being repaired by leaving it owner-able.
  Source-surface: napkin Surprise 5. Graduation-target: pattern file at
  `.agent/memory/active/patterns/cross-lane-repair-leave-unstaged.md`;
  possibly amendment to `stage-by-explicit-pathspec.md` rule's cure-
  asymmetry section. Trigger: pattern-shaped (single rich instance with
  named cure); second-instance preferred but not required given the
  shape clarity. Status: pending.

- 2026-05-05; **PDR candidate — owner-authorised coordinator-driven
  cross-claim landing**. Named precedent at `368e5aff`: coordinator
  re-enqueued under own intent*id citing peer's identity, verified
  staged_bundle_fingerprint matched peer's recorded fingerprint exactly,
  committed via explicit pathspec filter with body attributing substance
  to original authors. Authorised by owner statement*"authorised"\_ in
  reply to coordinator escalation event. Continuity action; preserves
  substance under correct attribution rather than abandoning bundle.
  Source-surface: napkin Surprise 4 + commit `368e5aff` body. Graduation-
  target: PDR (a) naming when this action is appropriate (peer queue
  expired, peer non-responsive, ready bundle); (b) naming the
  authorisation requirement (explicit owner statement, not implied);
  (c) naming the discipline (fingerprint verification, explicit pathspec,
  attribution body). Trigger: drafting slot reached. Status: pending.

- 2026-05-05; **PDR/ADR candidate — agent-tools CLI affordance set + build
  isolation**.
  `[captured: 2026-05-05 | graduated: 2026-05-10 (Sylvan Fruiting Glade) | source: napkin+feedback-memories | target-resolved: PDR-055 + ADR-178 + agent-tooling plan routing | trigger-fired: owner-direction+multi-instance | size: XL | status: graduated]`
  Friction observed throughout the 7-agent coordinator
  session: (a) no `comms list/show/watch` commands; (b) no `claims
list/show` filtered by prefix/name/thread/kind; (c) no `commit-queue
list/show` filtered by phase or agent; (d) flag-name discoverability
  (`--summary` not `--closure-summary` for `claims close`; `--file`
  vs `--area-pattern` ambiguity for `claims open`); (e) `comms render`
  fragile — single malformed event JSON blocks regeneration repo-wide;
  (f) build-on-each-CLI-invocation creates identity drift under in-flight
  tooling refactor; (g) help-on-flag-failure not consistently applied.
  Owner standing direction: _"all invocations of ALL agent tools with
  improper flags MUST print the FULL help text"_. Owner cure: _"all
  agents use only the built agent tools, so that development work can
  happen on them without causing this issue again"_. Owner suggestion:
  optional non-blocking `comms watch` streaming CLI for platforms with
  background services; bare polling JSON list for platforms without.
  Source-surface: napkin Surprise 7 + feedback memories
  `feedback_use_built_agent_tools_only`,
  `feedback_agent_tool_help_on_invalid_flags`,
  `feedback_periodic_comms_check`. Graduation-target: ADR (build
  isolation discipline), PDR (CLI affordance set + non-blocking-by-design
  - portable substrate), and a concrete agent-tools enhancement plan.
    Trigger: graduation-ready (multiple worked instances + owner-stated
    cures). Status: graduated 2026-05-10 to PDR-055 + ADR-178.
    **Historical sequenced-deferral pointer (2026-05-07, Pelagic Rolling
    Harbour)**: dedicated multi-artefact authoring
    session — Phase 1: ADR (build isolation); Phase 2: PDR (CLI
    affordance set / portable substrate); Phase 3: concrete
    agent-tools enhancement plan in
    `.agent/plans/agent-tooling/`. ADR + PDR + plan = three
    directive-shape artefacts; exceeds this drain session's context
    budget; sequenced for next agent-tooling work slot. Owner
    standing direction (full-help on improper flags) and built-CLI
    discipline operate immediately as separate user-memory rules.

- 2026-05-05; **turbo cache invalidation by an unrelated peer can expose
  a pre-existing latent test failure mid-commit, gating both sessions**
  (Gnarled Climbing Bark, peer interaction with Moonlit Shimmering
  Comet's smoke-tests retirement). Source-surface: `napkin.md`
  2026-05-05 §Surprise 1 + shared-comms-log 2026-05-05T08:25:00Z.
  Specific instance: `apps/oak-curriculum-mcp-streamable-http#test`
  cache invalidated by Moonlit's documentation/test edits in same
  workspace; my session's full uncached test run revealed
  `oauth-proxy-routes.integration.test.ts:309` failing (test source
  unchanged from HEAD, latent since PR #87/PR #90 era). Coordination
  shape: cache-invalidation-by-unrelated-peer => shared-blocker on
  whatever the freshly-run gate finds. Graduation-target: pattern
  candidate (could become an entry in `.agent/memory/active/patterns/`)
  describing the cache-invalidation-as-coordination-signal shape; OR a
  coordination rule about when peer-edits should ping running sessions.
  Trigger-condition: SECOND INSTANCE of the same shape — another peer
  cache invalidation surfacing a latent gate failure that gates two
  sessions simultaneously. Status: pending.

- 2026-05-04; **the PDR shape forces the rationale to surface that
  the capture surface did not have to** (Ferny Spreading Petal,
  Layer-2 second pass, drafting PDR-046): the napkin entry that
  became PDR-046's source named the principle, the layer stack,
  the three failure modes, and two of three cures — but did not
  name the alternatives the rule rejects. The PDR's Rationale
  section forced two alternatives into view ("apply the per-write
  rule recursively per layer and stop there"; "treat fitness
  diagnostics as the primary signal and re-shape work around
  them"), neither of which had appeared at capture time. This is
  structural complementarity between the capture surface and the
  decision-record surface, not redundancy: the napkin captures
  what the moment teaches; the PDR forces the question _what
  would the rule have been if we believed the alternative
  instead?_ — a question only fully answerable at graduation
  time. Source surface: napkin entry under archive
  `napkin-2026-05-04-evening.md` (Ferny § Worked-instance lessons
  from drafting PDR-046, lesson 2). Graduation-target options:
  (a) PDR-014 amendment naming "alternatives must be enumerated
  and rejected at graduation, even if not at capture" as a
  decision-record-authoring discipline; (b) new pattern in
  `memory/active/patterns/` naming the capture-vs-decision-record
  surface complementarity. Trigger-condition: second instance OR
  owner direction. Status: pending — first instance.

- 2026-05-04; **cross-Core PDR↔PDR connective tissue is
  load-bearing, not decorative** (Ferny Spreading Petal, Layer-2
  second pass, drafting PDR-046): PDR-046's Related list cites
  eight cross-Core PDRs (PDR-014, PDR-022, PDR-026, PDR-028,
  PDR-029, PDR-038, PDR-043, PDR-045). Every link is structural —
  a future reader can navigate from any one cited PDR to the
  composition picture. The Practice-Core portability constraint
  explicitly preserves cross-Core references as internal
  connective tissue (per `decision-records/README.md § Portability
Constraint`); the constraint targets host-leakage, not
  intra-Core navigation. Observation: a PDR with three or fewer
  Related citations is more likely to drift in isolation; PDR-045
  cited five, PDR-046 cited eight, both authored under the
  layered-processing methodology — the connective-tissue density
  may be a Layer-2 maturity signal worth tracking. Source surface:
  napkin entry under archive `napkin-2026-05-04-evening.md`
  (Ferny § Worked-instance lessons from drafting PDR-046, lesson
  3). Graduation-target options: (a) PDR-007 amendment naming
  cross-Core connective tissue as a portability-preserved
  first-class citation class with a density signal; (b) entry in
  `decision-records/README.md § Shape of a PDR` naming the
  Related-list shape as a maturity indicator. Trigger-condition:
  second instance OR owner direction. Status: pending — first
  instance.

- 2026-05-04; **frontmatter-limit revision is the substance-led cure
  when graduation lands new substance at a receiving doc whose
  limits were sized for an earlier configuration** (Ferny Spreading
  Petal, Layer-2 second pass — applied to two surfaces in the same
  session). PDR-046 §Move 3 says "graduate substance upward, not
  by compression"; this pattern is the next move after the
  graduation lands: the receiving doc's `fitness_line_limit` /
  `fitness_char_limit` may need to grow to reflect the doc's new
  role. Two surfaces in this session: `pending-graduations.md`
  (1000/1400/90000 from 350/500/40000) absorbed continuing
  candidate registration as the register's actual sustainable
  size; `development-practice.md` (200/280/16000 from 150/200/12000)
  absorbed gate-taxonomy + worked failure-mode example relocated
  from `principles.md`. The pattern is distinct from Move 3 itself
  (which is about graduation direction) — this names the
  consequence at the receiving end. Per `consolidate-docs §9e`,
  only the owner can raise hard limits; this pattern names what
  to surface for owner authorisation when the substance-led cure
  requires it. Source surfaces: this session's commits 54560f84
  - c73bf9f8 (the latter for the experience file capturing the
    pattern's logic). Graduation-target options: (a) PDR-046
    amendment (§Move 3 sub-rule on at-rest receiving-doc limits);
    (b) entry in `consolidate-docs.md §9` naming the receiving-doc
    limit revision as a substance-led structural fix; (c) standalone
    PDR if the pattern generalises beyond consolidation flow.
    Trigger-condition: second instance OR owner direction. Status:
    pending — first instance (two surfaces in one session count as
    one instance of the pattern, since they're the same arc).

- 2026-05-04; **hook tightening for no-moving-targets-in-permanent-docs:
  distinguish prose-narrative from code-block backtick contexts**
  (Vining Spreading Seed, owner-directed at session close after
  the WS3/WS4/WS6 + rules-and-index landing arc).
  `[captured: 2026-05-04 | graduated: 2026-05-10 (Sylvan Fruiting Glade) | source: owner-direction | target-resolved: agent-tools/scripts/check-blocked-content.ts + rule:no-moving-targets-in-permanent-docs | trigger-fired: owner-direction | size: L | status: graduated]`
  The WS4
  scoped*block's `excludes_inline_code` rule strips backticked
  spans from each line before the regex test, which correctly
  excludes data-shape SHAs in YAML/JSON code blocks but
  incorrectly excludes prose-context backticked SHAs (the
  *"see commit `abc1234`"_shape). The repo's permission system
  surfaced this gap by rejecting the first-draft rule files,
  which themselves embedded backticked session-commit SHAs.
  Owner direction is to tighten the hook, not accept the
  rule-vs-hook gap as optionality. Implementation cue:
  distinguish \_code-block data context_ (line is inside a
  fenced block, or the line is predominantly code-shaped) from
  _prose-narrative context_ (a backticked token inside a
  sentence — should fire). Source surface: napkin §
  "Owner direction (2026-05-04, end of session)". Graduation-
  target: refinement workstream extending
  `agent-tools/scripts/check-blocked-content.ts` regex matcher and updating
  `.agent/rules/no-moving-targets-in-permanent-docs.md` to
  remove the now-stale "either/or" framing. Trigger-condition:
  ready now (owner-directed). Status: graduated 2026-05-10 to the
  prose-vs-data hook distinction and rule update. **Historical
  sequenced-deferral pointer (2026-05-07, Pelagic Rolling Harbour)**: dedicated
  hook-tightening session — Phase 1: TDD-RED on the regex matcher
  with prose-narrative SHA fixture; Phase 2: implement
  prose-vs-code-block distinction in
  `agent-tools/scripts/check-blocked-content.ts`; Phase 3: rule body rewrite
  removing either/or framing. Implementation + tests + rule edit
  out of scope for this drain session.

- 2026-05-04; **session-handoff §6d "canonical-pointer-only" rule
  is too absolute for AGENTS.md** (Vining Spreading Seed,
  owner-corrected mid-session). The session-handoff command's
  step 6d names "heading + one-line pointer to AGENT.md" as the
  canonical entry-point shape and labels anything else as drift.
  Applied literally this session, I attempted to strip the
  `See [RULES_INDEX.md](RULES_INDEX.md) for the canonical rules
list.` line from `AGENTS.md` as drift. Owner correction: the
  line is there on purpose (deliberate Codex/AGENTS-platform
  discoverability aid). The §6d rule needs softening to
  distinguish _canonical-pointer-only_ (must) from _carefully-
  curated additional pointers to canonical surfaces_ (allowed
  with explicit owner-blessed content). Source surface:
  in-session owner correction. Graduation-target: amendment to
  `.agent/commands/session-handoff.md §6d`. Trigger-condition:
  amendment authored next session. Status: `pending`.

- 2026-05-04 (status flipped 2026-05-05); **`git commit --
<pathspec>` cure is asymmetric — one-sided application does
  not prevent absorption by peers who do not apply it; three
  observed instances of foreign-stage absorption now justify
  structural enforcement** (Vining Spreading Seed initial;
  Lacustrine→Moonlit `8fa339f4` 2026-05-04 second; Ethereal→Dawnlit
  `36102937` 2026-05-05 third).
  `[captured: 2026-05-04 | source: napkin+commit-history | target: multi:rule:stage-by-explicit-pathspec(landed)+adr:asymmetric-cure-enforcement+pdr:asymmetric-cure-followup | trigger: n>=3-validation | size: L | status: partially-graduated]`
  The cure as currently written
  is operator-applied prose at `stage-by-explicit-pathspec.md
§Peer-Index Note`. Each instance: a peer's `git commit`
  without `-- <pathspec>` filter swept staged content authored
  by another agent into the peer's commit. Substance preserved
  in all cases; commit-message attribution distorted; reviewer
  evidence (when present) applies to the absorbed diff. The
  third instance (Ethereal→Dawnlit) was particularly clean: the
  absorbed-from agent had reviewer chain on the diff
  pre-absorption (architecture-reviewer-fred CLEAN +
  code-reviewer APPROVED WITH SUGGESTIONS); review evidence
  intact; only the commit subject misleads. Asymmetry insight
  (added 2026-05-05): a cure that protects the agent who
  applies it but does not prevent the failure mode in agents
  who don't apply it is not really a structural cure — it is a
  behavioural commitment one side keeps on the other side's
  behalf. Source surfaces: napkin "Peer-staged renames in the
  index bleed into your staging area via `git add`" entry
  (2026-05-04); Ethereal's comms-event acknowledgement at
  2e2bfb5a (2026-05-05); Dawnlit's experience file
  `2026-05-05-dawnlit-the-screen-and-the-gate.md` (2026-05-05).
  Graduation-target: structural enforcement candidate for owner
  direction. Candidate shapes: (a) pre-commit hook refuses
  `git commit` without explicit pathspec when staged set
  contains files outside the agent's queued bundle; (b)
  commit-queue layer detects fingerprint-of-staged-set diverging
  from queued-intent and aborts at `verify-staged`; (c) shared
  pre-commit gate requiring `--include` or pathspec matching
  the active commit-queue intent. Each is a distinct design
  decision; owner-direction-shaped, not consolidation-shaped.
  Trigger-condition: third instance now observed; promotes to
  due. Status: `partially graduated 2026-05-05` (Opalescent
  Threading Nebula). Asymmetric-cure observation graduated to
  `.agent/rules/stage-by-explicit-pathspec.md § Cure Asymmetry —
One-Sided Application Does Not Prevent Absorption` with the
  3-instance evidence table and the three named candidate shapes.
  Two follow-ups remain queued:
  - **ADR-shaped follow-up** (host structural-enforcement choice):
    pending owner direction on which of the three candidate shapes
    (pre-commit hook refusal of implicit pathspec; commit-queue
    fingerprint-divergence detection; shared pre-commit pathspec-
    matching gate) to implement. The choice is host-architectural
    (trades off friction, false-positive rate, operational
    complexity); ADR is the right home for the decision once
    direction lands.
  - **PDR-shaped follow-up** (Practice-governance principle):
    "asymmetric-cure failure mode — a cure that protects only the
    applier is not really a structural cure" is plausibly portable
    Practice governance. Promotion to PDR awaits a second-context
    manifestation of the same asymmetric-cure shape outside `git
commit -- <pathspec>` (e.g. shared lockfile discipline,
    shared-state-file write discipline, shared-comms-log authoring
    discipline). Single-context evidence (3 instances all `git
commit`) is insufficient for Practice-Core promotion per
    consolidate-docs §7a (PDR adopter test).

- 2026-05-04; **subagent briefs must include
  halt-on-environment-mismatch instructions; parallel
  `isolation:"worktree"` dispatch is unreliable for shared-state
  work** (Pearly Snorkelling Reef, captured from the
  doctrine-enforcement-quick-wins dispatch incident on 2026-05-04).
  Three concurrent worktree subagents in one `Agent` batch produced
  inconsistent bases (one matched parent HEAD, two were on an older
  `main` commit predating the plan). The two wrong-base subagents
  improvised on the missing-plan environment rather than halting,
  and crossed worktree boundaries by writing to absolute paths in
  the main repo. Source surface: napkin §"Parallel
  isolation:worktree dispatch produced inconsistent bases".
  Graduation-target options: (a) a portable rule
  `.agent/rules/subagent-environment-mismatch-halt.md` requiring
  briefs to instruct halt-and-report when grounding cannot find
  cited artefacts; (b) a PDR refining subagent-dispatch discipline
  (parallel-dispatch-only-when-state-isolation-is-real); (c) an
  amendment to an existing collaboration or subagent-architecture
  PDR. Trigger-condition: a second cross-session instance of
  parallel-worktree dispatch failure or wrong-base-improvisation,
  OR three sessions where a subagent brief explicitly added
  halt-on-environment-mismatch language and the discipline proved
  load-bearing. Status: `pending`. Durable lesson held outside
  this register at
  `~/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_worktree_isolation_unreliable.md`.

- 2026-05-04; **deferrals must be sequenced (or have their
  sequencing sequenced)** (Verdant Sprouting Leaf, owner-stated
  sharpening of PDR-026 §Deferral-honesty discipline at session
  close): _deferrals must either be explicitly sequenced in a plan
  (strongly preferred), or have their sequencing sequenced in a
  plan (acceptable only in very unusual cases). Anything else is
  a declaration that something will not happen, wrapped in
  obscuring language which hides a useful signal. Sometimes not
  doing something is the best possible option, but it needs to be
  visible, and in some cases discussed._ The existing PDR-026
  §Deferral-honesty rule forbids convenience phrasings (_for
  later_, _next session_, _ran out of time_); this sharpening adds
  the positive form: a legitimate deferral points to a specific
  plan + phase, or to a decision point sequenced in a specific
  plan + phase. Three modes: (1) sequenced deferral (preferred),
  (2) sequencing-sequenced deferral (rare), (3) hidden declaration
  of non-action (forbidden — it conceals the choice). Non-action
  can be the architecturally correct answer; it must be visible,
  explicit, and sometimes discussed. Source-surface: napkin
  2026-05-04 §"Three owner asides at session close". Graduation-
  target: PDR-026 amendment §"Sequenced-deferral discipline" with
  positive-form requirement. Trigger-condition: enforcement
  surface ready (per the PDR-038 §2026-05-04 maturity gate). The
  natural enforcement candidate is a doctrine-scanner fingerprint
  detecting deferrals lacking plan + phase pointers, plus a plan-
  reviewer check at promotion time. Both extend the
  doctrine-scanner CLI work proposed in
  `future/memetic-immune-system-and-progressive-disclosure.plan.md`.
  Status: pending — PDR-026 amendment defers to post-quick-wins
  lane until enforcement surface lands; an amendment landed without
  enforcement would itself be the failure mode the amendment
  describes (un-enforced sharpening = visibility-only, no
  structural cure for the recurring shape). The deferral of _this_
  amendment is itself sequenced — it lands when the doctrine-
  scanner CLI lands.

- 2026-05-04; **memory classifications and systems review**
  (Verdant Sprouting Leaf, owner-flagged future-session item at
  session close): assess the three memory planes (`active/`,
  `operational/`, `executive/`) plus their sub-surfaces (napkin,
  distilled, patterns, threads, comms, claims, escalations,
  conversations, pending-graduations) for what works well, what
  can be improved, gaps, and beneficial restructure options. The
  seam-review concept exists in PDR-029 Family-B Layer-1 as a
  `taxonomy-review` candidate trigger; ≥3 such candidates in a
  single consolidation or ≥5 across consecutive consolidations
  signal a full taxonomy-review session is owed. Source-surface:
  napkin 2026-05-04 §"Three owner asides at session close".
  Graduation-target: dedicated taxonomy-review session with
  output: a memory-architecture audit report + any reorganisation
  proposals as PDR candidates against PDR-007/PDR-024/PDR-028. The
  assessment is multi-session in scope and benefits from the
  structural-foundation work landing first (the doctrine-scanner
  quick wins + practice trio activation create natural
  observation points for what the memory system _enables_ vs
  _obstructs_). Trigger-condition: post-quick-wins evidence + owner
  direction, OR ≥2 additional taxonomy-review candidates
  accumulating before then. Status: pending — first instance, awaiting
  evidence base.

- 2026-05-04; **first-question at every elaboration boundary, not
  only at plan-author time** (Verdant Sprouting Leaf, surfaced
  during /jc-consolidate-docs napkin extraction; substance from Salty
  Navigating Jetty 2026-05-03 session-spiral diagnosis): PDR-043 cue 3
  ("first-principles framing question — what would the path look like
  with no closure pressure?") is currently scoped to "when proposing
  any change". The sharpening from Salty's session: the cue must fire
  at _every elaboration boundary_ — plans-creating-plans, arc-
  justifying-arcs, prerequisite-justifying-prerequisites. The three-
  day observability spiral (2026-05-01 through 2026-05-03) was
  internally coherent at every plan-authoring step but never re-asked
  the first-question at the level of _should this whole arc exist?_.
  Salty's diagnosis: _plan-following can disguise rush-impulse if
  the principles' first-question is not re-applied at every
  elaboration boundary_. Source-surface: napkin 2026-05-03 (Salty)
  §"Session-spiral diagnosis"; complementary to PDR-018 §Beneficial
  prerequisites must not block (which provides the prerequisite-
  classification cure) and PDR-043 cue 3 (which provides the per-
  change cure but not the per-elaboration-boundary cure). Graduation-
  target: PDR-043 amendment §"Cue 3 fires at every elaboration
  boundary" OR PDR-018 amendment §"First-question discipline at
  elaboration boundaries". Trigger-condition: second instance OR
  owner direction. Salty's session is the first instance; Tidal
  Flowing Reef's "framing-trap" entry on the same date is closely
  related but expresses the same shape (option A vs option B between
  two violations is the wrong frame; the question is _how do we adopt
  our new insights?_). Status: pending — awaiting second instance or
  owner direction. **Enforcement note (per PDR-038 §2026-05-04
  amendment)**: at maturity, doctrine without enforcement is
  liability. The structural enforcement candidate for this principle
  is a planning-discipline check at plan-authoring time + plan-
  reviewer dispatch — both of which would naturally extend the
  doctrine-scanner CLI work proposed in
  `future/memetic-immune-system-and-progressive-disclosure.plan.md`.

- 2026-05-04; **insight capture degrades exponentially after the
  moment of occurrence** (Verdant Sprouting Leaf, owner-stated
  mid-session principle): _the only valid time to capture an insight
  is when it occurs; every moment after that degrades exponentially._
  Stated in the post-/insights reflection round mid-authoring of
  option (c). This is the active-memory analogue of architectural-
  excellence-over-expediency: the cheap answer ("note it for next
  session") burns the load-bearing detail; the architecturally
  correct answer (capture now in napkin / PDR / plan) costs minutes
  and preserves the substance. Source-surface: napkin 2026-05-04
  entry. Graduation-target: addition to
  `.agent/directives/principles.md` as a one-line principle, with
  the napkin/PDR/plan capture pipeline as its own structural
  enforcement (the principle is self-enforcing — its enforcement
  surface is the act of capture itself, which already exists as
  infrastructure). The discipline formalises what was already done
  in this session; promotion is recording what is true. Trigger-
  condition: second instance OR owner direction. The owner-stated
  framing is itself the first instance and is load-bearing for the
  three insights captured in same turn during this session. Status:
  pending — awaiting second instance or owner direction.

- 2026-05-04; **tests describe the system to itself** (Dewy Shedding
  Glade, owner-led doctrinal arc): foundational reframing of TDD
  landed in `tdd-as-design.md`. _A test does not verify code; a test
  describes a system state, and product code is the path that guides
  the system into that state. Test and product code are two halves
  of one act of design. Writing them separately, in either order, is
  a category error._ Adopter scope: every Practice-bearing repo —
  this is a Practice-governance decision about the role of tests, not
  a host-repo architectural choice. Source-surface: napkin
  2026-05-04 entry; current home: `tdd-as-design.md` directive.
  Graduation-target: PDR in `practice-core/decision-records/`
  capturing the load-bearing definition + the atomic-landing
  invariant + the describe-vs-audit blade as portable Practice
  governance. The host directive `tdd-as-design.md` already operates
  the host-local consequence; the PDR records the decision so it
  travels with the Core. Trigger-condition: second instance OR
  owner direction (owner-led arc this session is the first instance;
  the framing is stable and load-bearing for the entire
  validation-and-tdd-doctrine-restructure arc). Status: pending —
  awaiting either second instance or owner direction.

- 2026-05-04; **reviewers carry doctrine, not just audit it** (Dewy
  Shedding Glade, owner direction §6 of the arc): the test-reviewer
  refresh elevated the reviewer from structural auditor to doctrinal
  carrier with mandatory recipe/pattern read path and citation
  requirement on every suggestion. The shift is measurable: the
  reviewer's _first question_ is now "does this test describe an
  interface or audit one?" rather than "does it pass". Source-surface:
  `.agent/sub-agents/templates/test-reviewer.md` rewrite; companion
  surfaces `.claude/agents/test-reviewer.md`,
  `.cursor/agents/test-reviewer.md`, `.codex/agents/test-reviewer.toml`.
  Graduation-target: PDR in `practice-core/decision-records/`
  capturing reviewer-as-doctrine-carrier as a general
  reviewer-authority discipline (sibling to PDR-007 reviewer
  lineage). Trigger-condition: second instance — when one further
  reviewer (architecture-reviewer-fred is already shaped this way;
  candidates are type-reviewer, security-reviewer, sentry-reviewer)
  is similarly upgraded to the doctrine-carrier shape. Status:
  pending — first instance landed this session.

- 2026-05-04; **forcing-function read path: reviewer carries the
  recipes the doctrine cites** (Dewy Shedding Glade, derived from §5
  of the arc): the test-reviewer's mandatory read path now includes
  `docs/engineering/testing-tdd-recipes.md` and
  `docs/engineering/testing-patterns.md`, with a citation requirement
  on every suggestion (cite recipe/pattern by section heading).
  The general shape: when a doctrine references companion recipes
  or patterns, the reviewer that operationalises the doctrine becomes
  the forcing function that keeps the recipes load-bearing. Without
  this forcing function, recipes drift from doctrine because no one
  reads them. Source-surface: test-reviewer template Reading
  Requirements + Step 7 (suggestion mode); companion surface: the
  recipe and pattern files themselves. Graduation-target: pattern in
  `.agent/memory/active/patterns/` capturing the
  reviewer-as-forcing-function shape; promote to general
  Practice-Core PDR with `pdr_kind: pattern` once a second
  reviewer-recipe pairing follows in another domain. Trigger-condition:
  second instance — security-reviewer citing security-review-recipes,
  type-reviewer citing type-flow-patterns, etc. Status: pending —
  first instance landed this session.

- 2026-05-04; **validation strategy as umbrella; testing strategy as
  one leaf** (Dewy Shedding Glade, owner direction §2 of the arc):
  host-repo architectural decision about the directive topology.
  The current sprawling `testing-strategy.md` mixes test-type
  taxonomy, TDD methodology, recipe-level configuration, and
  cross-cutting validation surfaces. The arc proposes a three-document
  split: `validation-strategy.md` (umbrella; right-tool-for-each-job;
  gate inventory), `testing-strategy.md` (slimmed to test types and
  multi-level interaction), `tdd-as-design.md` (foundational TDD
  doctrine, landed this session). Source-surface: index plan
  `validation-and-tdd-doctrine-restructure.plan.md`. Graduation-target:
  ADR-121 refresh (P4 in the index plan) — the existing "Quality
  Gate Surfaces" ADR is the natural carrier for the topology
  decision once the new umbrella exists. Trigger-condition: P1
  (validation-strategy umbrella) lands; ADR refresh happens
  immediately afterwards. Status: pending — sequenced behind P1
  in the index plan.

- 2026-05-03; **autonomous .git/index.lock interaction is forbidden,
  including wait loops** (Prismatic Illuminating Eclipse, owner
  intervention mid-A1-commit): the existing 2026-04-30 distilled.md
  entry "Never delete .git/index.lock" addressed the destructive
  shape (`rm` on a foreign lock). This session surfaced a softer
  failure mode that compounds in the same direction: an autonomous
  polling wait loop (`until [ ! -e .git/index.lock ]; do sleep 2;
done && echo "lock cleared"`). Even though the loop only OBSERVED
  the lock disappearing (Woodland's parallel commit completed
  naturally), the "lock cleared" echo conditioned the agent to treat
  lock-clearing as an action it takes rather than a state it
  observes, and any future evolution of the loop (timeout-then-rm
  fallback) would be a small step away from the catastrophic action.
  Owner direction: any contact with `.git/index.lock` requires owner
  authorisation, including the wait shape; surface foreign locks to
  the user with diagnostic + wait-vs-handoff options rather than
  running a wait loop. **Graduation target**: extend the existing
  distilled.md "Never delete .git/index.lock" entry to "Never
  autonomously interact with .git/index.lock at all — including wait
  loops"; consider promoting to a `.agent/rules/` rule given the
  destructive-blast-radius of the failure mode. Status: pending —
  owner direction has fired in part (specific incident this
  session); deliberate next-session shape required for the
  distilled.md amendment + rule-authoring decision (PDR-038
  structural-enforcement reasoning applies here too). Captured to
  platform memory at
  `~/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/memory/feedback_no_lock_wait_loops.md`
  for immediate effect; doctrine-level capture queued here for
  graduation through the proper consolidation pipeline. Companion
  entry: 2026-04-30 `feedback_no_delete_git_lock` is the destructive
  shape; this is the autonomous-observation shape; both are
  instances of _avoid actions that compound silently in destructive
  directions even when each individual step looks safe_.

- 2026-05-03; **session-close housekeeping ownership** (Woodland
  Sprouting Glade + Prismatic Illuminating Eclipse parallel-lane
  session, owner-stated experiment observation): at session-close some
  housekeeping is **agent-specific** (own observations in napkin,
  identity-row last_session, claim close, subjective experience file)
  and can ONLY be done by the originating agent — no other agent has
  the in-memory context. Other housekeeping is **NOT agent-specific**
  (refresh repo-continuity.md, refresh pending-graduations register,
  sweep platform entry points, commit prior-session leftover continuity
  files, run consolidation gate) — any agent could do it, which means
  without explicit ownership none of them does and work is lost or
  stale. **Cure shape**: when an Orchestrator role is assigned for a
  session, the Orchestrator owns shared / not-agent-specific
  housekeeping. When no Orchestrator is assigned, the
  **last-to-leave** rule applies (final committing agent picks up the
  shared housekeeping). Agent-specific housekeeping remains the
  originating agent's responsibility regardless. **First instance
  (live)**: this 2026-05-03 handoff — the prior Pelagic session ended
  with five continuity files modified-but-uncommitted; without the
  rule, every subsequent agent assumed someone else owned them. Owner
  direction at session-handoff fixed it. Source-surface: napkin §"E1
  Parallel two-agent execution" 2026-05-03 + experiment-plan §P11
  candidate; graduation-target: P11 in N-agent collaboration
  hypothesis (`hypothesis.md`) plus a Practice-Core PDR amendment to
  PDR-018 (Planning discipline) or a new dedicated PDR if the cure
  shape stabilises across N≥3; trigger-condition: validation across
  N≥3 sessions with no falsifying observation; status: candidate
  (single instance; not yet graduation-ripe; falsification criteria
  named in napkin entry).

- 2026-05-02; observability multi-sink + fixtures plan WS10 — owner
  doctrine _"for all significant documentation or Practice changes
  — and this is always true — we need reviews from the documentation
  reviewer and the onboarding reviewer"_;
  `[captured: 2026-05-02 | graduated: 2026-05-10 (Sylvan Fruiting Glade) | source: owner-direction | target-resolved: rule:invoke-doc-and-onboarding-experts-on-significant-changes | trigger-fired: re-route-available | size: M | status: graduated]`
  trigger condition: this
  doctrine is now load-bearing for every plan that mutates docs or
  Practice surfaces; graduation target: a permanent rule (likely
  `.agent/rules/invoke-doc-and-onboarding-reviewers-on-significant-changes.md`
  OR an amendment block in `invoke-code-reviewers.md`) plus a
  `distilled.md § Process` graduation pointer plus matrix update in
  `invoke-code-reviewers.md`; queued as plan WS11.3 deliverable;
  status: graduated 2026-05-10 by direct re-route to the rule surface.
  **Historical vaporware-trigger
  flag (2026-05-07, Pelagic Rolling Harbour)**: trigger is gated on
  unmet WS11.3 plan execution, which is the sequenced-deferral
  vaporware shape per `distilled.md` §Sequenced-Deferral Discipline.
  Substance is owner-standing-doctrine and is already in operational
  effect (multi-reviewer dispatch is current practice). Re-route
  option: land directly as
  `.agent/rules/invoke-doc-and-onboarding-reviewers-on-significant-changes.md`
  in next agent-rules pass without WS11.3 gating. Decision surfaced
  for owner direction.

- 2026-05-02; observability multi-sink + fixtures plan WS8.6 —
  orthogonal axes shape (`OBSERVABILITY_SINKS` typed list +
  `OBSERVABILITY_FIXTURES` orthogonal fixture-as-tee boolean) is a
  reusable architectural decision per PDR-019 (ADR scope by
  reusability).
  `[captured: 2026-05-02 | graduated: 2026-05-10 (Sylvan Fruiting Glade) | source: plan-WS-amendment | target-resolved: ADR-171+adr-amend:116/143/162/163 | trigger-fired: owner-direction | size: L | status: graduated]`
  Applies to every future sink and every future
  capability that emits; graduation target: a new
  `docs/architecture/architectural-decisions/NNN-observability-configuration-orthogonality.md`
  ADR (NEW). **2026-05-03 amendment (Moonlit Drifting Nebula)**:
  the plan body originally scheduled this as ADR-165, but ADR-165
  is already taken — the next available number must be chosen
  before WS8.6 starts. Plus amendments to ADR-116 (warnings
  channel), ADR-143 (registry shape, fixture-as-tee), ADR-162
  (Open Question close on `ServerInstrumenter` port — partially
  addressed in WS1 RED via the type definition; final closure
  rides at WS6 when the HTTP composition root consumes the port),
  ADR-163 (build-time scope clarification — D7a verification
  confirmed structural orthogonality; WS4 cleanup is the
  follow-on); queued as plan WS8.6/WS8.7 deliverable. **2026-05-03
  ADR-number resolved (Woodland Sprouting Glade ARC B0, c0d17634)**:
  ARC A4 ADR is **170** (smoke harness shape, parent plan); orthogonality
  ADR is **171** (this plan, WS8.6). Verified by
  `ls docs/architecture/architectural-decisions/ | sort -n | tail -5`
  — 165-169 already present, 170/171 next available. All cross-plan
  references updated; re-verify pre-authoring guards added at three
  locations. Status: graduated 2026-05-10 to ADR-171 and amendments.
  **Historical vaporware-
  trigger flag (2026-05-07, Pelagic Rolling Harbour)**: trigger is
  gated on WS8.6/WS8.7 plan execution; sequenced-deferral
  vaporware shape per `distilled.md` §Sequenced-Deferral
  Discipline. ADR authoring is itself directive-shape work
  requiring its own context budget. Disposition 2026-05-12: the entry
  is already graduated to ADR-171 and amendments; keep here only as
  audit-trail until archival. Carrier-plan progress, not this register,
  is the live signal.

- 2026-05-02; observability multi-sink + fixtures plan WS0 —
  near-miss surprise: almost spawned a duplicate
  `cross-app-distributed-tracing-mcp-and-search-cli.plan.md` stub
  before checking the existing `future/` directory; caught when
  listing during WS0 promotion. Trigger: second instance of new-plan-
  stub-spawn-without-future-survey; graduation target: distilled.md
  § Process entry naming "directory survey before plan-stub spawning"
  OR amendment to `consolidate-at-third-consumer.md`; status: pending
  (single instance; capture-only until second instance accumulates).

- 2026-05-03; **inter-agent collaboration protocol gaps surfaced
  by Pelagic ↔ Misty Task M1 round-trip**.
  `[captured: 2026-05-03 | graduated: 2026-05-10 (Sylvan Fruiting Glade) | source: experience+napkin | target-resolved: PDR-056 with hypothesis-status preserved | trigger-fired: owner-direction+knowledge-graduation | size: XL | status: graduated]`
  **Status reframed 2026-05-03 (Misty session-handoff metacognition)**:
  these cures are now structured as candidate amendments to the N-agent
  collaboration hypothesis at
  [`.agent/prompts/agentic-engineering/collaboration/hypothesis.md`](../../prompts/agentic-engineering/collaboration/hypothesis.md),
  with per-cure falsification criteria at
  [`falsification-criteria.md`](../../prompts/agentic-engineering/collaboration/falsification-criteria.md)
  and proposed validation experiments at
  [`experiments.md`](../../prompts/agentic-engineering/collaboration/experiments.md).
  Cures graduate to permanent doctrine **after** empirical validation
  at N≥3, not before. The CLI ergonomics plan remains the natural
  carrier for cure (v) tooling work, but the four protocol-amendment
  cures (i)-(iv) and the five worker-perspective addenda (vi)-(x)
  graduate via the hypothesis-evolution loop, not via direct
  promotion to PDR. The original five structural cures
  named in the session's reflection log
  ([`experience/2026-05-03-pelagic-two-way-agent-communication-reflection.md`](../../experience/2026-05-03-pelagic-two-way-agent-communication-reflection.md))
  and a tactical 10-point next-session guide in napkin (same date,
  Pelagic Washing Anchor). Specific candidates: (i) **out-of-band
  brief acknowledgement** — when an agent acts on owner direction
  received outside the comms log, first comms event must cite the
  out-of-band source explicitly (cure for the temporal-anomaly
  reading of Misty's pre-existing claim); (ii) **read/write claim
  mode field** — extend `active-claims.json` schema with
  `mode: 'read' | 'write' | 'mutual-exclusive'` so non-conflicting
  modes coexist on overlapping paths (cure for the
  smoke-tests-workspace path overlap); (iii) **heartbeat-or-die
  enforcement** — claims past `claimed_at + ETA * 1.5` without
  heartbeat are stale; orchestrator reclaims, escalates, or asks
  owner (cure for the ETA decay observed); (iv) **overflow
  protocol in task offers** — task issuers must include _"if the
  spec is too tight, do X; do not unilaterally Y"_ up front (cure
  for the round-trip cost on Misty's hybrid-vs-inline question);
  (v) **`comms` CLI ergonomics** — `comms reply` (auto-populates
  `in_response_to`, inverts `audience`); `comms watch` (tail
  events directory); `comms pending` (events awaiting my reply);
  `comms heartbeat <claim_id>` (cure for event_id mismatch
  Misty made when inferring from title rather than copying from
  source body, plus the discipline failures naming inertia of
  manual JSON authoring). Routes to the existing
  [`agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](../../plans/agent-tooling/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md)
  as concrete worked instances strengthening the existing
  promotion case (already at fourth-instance evidence; this is a
  fifth). Trigger: owner direction has fired in the request for
  the reflection itself; CLI ergonomics plan promotion (already
  named in `agentic-engineering-enhancements.next-session.md`)
  is the natural carrier; the four protocol-amendment candidates
  (i)-(iv) graduate to a single PDR or amendment to the existing
  agent-collaboration directive at consolidation. **Worker-
  perspective addenda from Misty Ebbing Pier (2026-05-03 napkin
  entry "Worker-perspective addenda to Pelagic's collaboration
  suggestions")** — five additional cures: (vi) **wall-clock
  authority** (`date -u` from host shell as the canonical source
  of `created_at`, distinct from the out-of-band-ack cure (i)
  which addresses sequence reconstruction by readers); (vii)
  **render conversation threading** (promote `audience` and
  `in_response_to` to canonical schema and surface in render so
  the log is a conversation tree, not flat dump); (viii)
  **asymmetric ground-truth — worker initiates on empirical
  surface** (assumption-breaking discoveries mid-task MUST surface
  via comms event before worker continues; orchestrator MUST poll
  that signal); (ix) **defer commit until task-close + counterparty
  acknowledgement** (premature commits would have made this
  session's self-correction expensive); (x) **wait-for-ack on
  deadlined-defaults** (task-acceptor counterpart to overflow
  protocol (iv)). Disposition 2026-05-12: the entry is already
  graduated to PDR-056 with hypothesis-status preserved; the historical
  due marker is stale. **Vaporware-trigger flag
  (2026-05-07, Pelagic Rolling Harbour)**: trigger gated on unmet
  "next CLI ergonomics plan execution slice"; sequenced-deferral
  vaporware shape per `distilled.md` §Sequenced-Deferral
  Discipline. The (i)-(x) cures are protocol amendments awaiting
  empirical validation at N≥3 per the entry's own framing — they
  should not graduate to permanent doctrine before validation
  regardless of CLI carrier. Stays here as audit-trail; carrier-
  plan progress is the live signal.

- 2026-05-03; **PDR-043 cue 2 sharpening: vocabulary is not the
  trigger, intent is** — owner direction this session: "there is
  no semantic difference between _carve out_, _carve around_,
  _exception_, _honest framing for external X_, _permitted
  variant_, _for these arcs_, or any other wording that means 'I
  know the rule always applies, but this situation is special'".
  PDR-043 currently frames cue 2 around the vocabulary trip-list;
  the sharpening: substance that reads "the rule doesn't apply
  here" is the trigger, regardless of vocabulary. Substance:
  amend PDR-043 §"Cue 2 — Conditional-discipline check before
  proposing structure" to include the intent-based reading
  alongside the vocabulary-based one. Trigger: second instance OR
  owner direction. Status: pending. Captured: 2026-05-03 (Lush
  Spreading Seed). Source surface: this session's iterative
  cleanup, where multiple non-"carve" hedging shapes (`Permitted:
exception`, "honest framing for external", "exception for E2E
  tests", "C7 carve-outs ratified") all needed removal.
  Graduation target: PDR-043 amendment + principles.md three-cues
  paragraph wording update.

- 2026-05-03; **atomic, independent cycles for optional
  parallel-agent dispatch** — new planning discipline landed this
  session in `.agent/commands/plan.md` requirement 3,
  `.agent/plans/templates/components/tdd-phases.md`
  §"Atomic, independent cycles for parallel dispatch", and
  `.agent/plans/templates/feature-workstream-template.md` §"Cycle
  Dependencies and Parallelisation". Substance: where the work
  shape allows, cycles should be made independent of each other
  (separate file scopes, executable acceptance, self-contained
  briefs) so each can be handed to a parallel agent without
  mid-work coordination. Declared via optional `depends_on: []`
  field on the YAML todo plus prose markers in the cycle body
  (Parallel-safety, Starting state, File scope, File scope NOT
  to touch). Plan-author discipline: do not invent serial
  dependencies the work shape does not require. Trigger: second
  Practice-bearing repo adopts the same discipline OR owner
  direction. Status: pending (single-instance — graduates as a
  PDR candidate when N≥2 host repos pick it up, or when owner
  directs). Captured: 2026-05-03 (Lush Spreading Seed). Source
  surface: this session's plan-template restructure following
  the TDD-as-pairs landing. Graduation target: a new PDR in
  `.agent/practice-core/decision-records/` covering atomic
  cycles + dependency declaration + parallel dispatch as a
  portable Practice-governance principle, with this repo's
  adoption already evidenced in the planning-template surfaces.

- 2026-04-29; PR-90 closure session — `scripts/validate-*` family is
  structural drift relative to ADR-041 / §Separate-Framework-from-Consumer /
  owner-direction "complex-with-tests must live in workspace"; 4 parallel
  architecture reviewers convergent; future + executable plans authored
  ([`current/scripts-validator-family-workspace-migration.plan.md`](../../plans/architecture-and-infrastructure/current/scripts-validator-family-workspace-migration.plan.md));
  Phase 0 of the executable plan graduates the owner-direction rule to
  `.agent/rules/no-workspace-evading-scripts.md` and authors ADR delta or
  peer ADR via docs-adr-reviewer; trigger: owner directs Phase 0 OR third
  validator class accumulated; status: pending.
- 2026-04-29; PR-90 closure session — testing-strategy.md §Test Types named
  "validation scripts that require external resources should be standalone
  scripts, not tests" caught my Phase 4 misclassification (vitest-as-
  validator-harness). The principle is sound but lives in one paragraph;
  worth elaborating in `docs/engineering/testing-tdd-recipes.md` with the
  contrast pattern (validator script + helper unit tests vs integration test
  on real-FS repo state); trigger: second similar misclassification OR
  owner direction; status: pending.
- 2026-04-29; PR-90 closure session — Vercel build emits 2 warning classes
  (pnpm `@humanfs/node` bin defect; 3 env vars not in `turbo.json`).
  Captured in
  [`future/vercel-build-warning-elimination.plan.md`](../../plans/architecture-and-infrastructure/future/vercel-build-warning-elimination.plan.md).
  Trigger: third warning class accumulates OR owner direction; status:
  pending (future plan).
- 2026-04-29; owner-requested PR lifecycle skill note;
  `.agent/skills/pr-lifecycle/SKILL.md` plus possible PDR amendment for
  gate-honest PR stewardship; trigger: first real PR shepherding run using
  the skill OR second repeated PR feedback / CI / Sonar / reviewer-wait
  friction instance; status: pending. Evidence:
  [`pr-lifecycle-skill.plan.md`](../../plans/agentic-engineering-enhancements/future/pr-lifecycle-skill.plan.md).
- 2026-04-24; napkin + `.remember/` wiring commits; PDR-011 amendment for
  plugin-managed ephemeral capture surfaces; trigger: second
  plugin-managed in-repo capture surface or owner direction; status:
  pending.
- 2026-04-23; ADR-163 release/version boundary and vendor passthrough
  audit; trigger: observability-thread consolidation audit; status:
  pending (audit-triggered).
- 2026-04-23; session-handoff entrypoint sweep; PDR-014 amendment for
  platform-specific entry points as homing substance; trigger: second
  drift instance and owner request; status: pending.
- 2026-04-25; multi-agent protocol WS architecture; pattern candidate
  `operational-seed-per-workstream`; trigger: second protocol-plan
  instance or owner direction; status: pending.
- 2026-04-25; collaboration protocol self-application evidence;
  `infrastructure-alive-at-install`; trigger: one instance from a
  different lane or owner direction; status: pending.
- 2026-04-26; OpenAPI/OOC issues boundary; rule with teeth for API-only
  consumer data boundary; trigger: second near-violation or owner
  direction; status: pending.
- 2026-04-26; observability validation correction; alignment check
  before per-system claim validation; trigger: second skipped-alignment
  instance or owner direction; status: pending.
- 2026-04-26; WS3A closeout; protocol observability by consolidation
  audit before new visible surfaces; trigger: second protocol slice with
  the same shape or owner direction; status: pending.
- 2026-04-28; CLI first-touch friction on the collaboration-state CLI
  (`--help` self-rejects; dispatch keys undiscoverable; `--platform`
  redundant when env-derived; claim file-list verbose; no `whoami`);
  future strategic plan candidate for promotion to `current/`; trigger:
  second instance OR owner direction; **status: graduated into PDR-055,
  ADR-178, and the cost-of-collaboration agent-tools lane**
  (both triggers fired 2026-04-30 — owner observed warnings during
  Verdant Sheltering Glade session, AND the session itself accumulated
  new evidence). Second-instance evidence (2026-04-30):
  `pnpm agent-tools:agent-identity` does not inherit
  `PRACTICE_AGENT_SESSION_ID_CLAUDE` through `pnpm --filter` (forcing
  --seed); `comms append` requires `--comms-dir`, `--now`,
  `--created-at` with no discoverable defaults; `claims open` requires
  `--active`, `--thread`, `--area-kind` (with `--area-kind` rejecting
  intuitive values like `shared-state` — only `files`/`workspace`/`plan`/
  `adr`/`git` are accepted); `comms render` uses `--output` not
  `--output-file`. Each error is a single iteration cost but they
  compound to ~5–8 round-trips per session-open. Evidence + plan:
  [`agent-coordination-cli-ergonomics-and-request-correlation.plan.md`](../../plans/agent-tooling/future/agent-coordination-cli-ergonomics-and-request-correlation.plan.md).
  **Third-instance evidence (2026-05-01, Vining Whispering Root,
  Increment 1 promotion-materials commit `b3d4c041`)** — six
  frictions in one end-to-end run of the always-active commit skill:
  (i) `commit-queue enqueue` rejects a placeholder claim*id with
  `unknown claim_id: <uuid>` — chicken-and-egg; the queue requires a
  claim to exist, but step ordering at the CLI surface is the inverse
  of the skill's documented step ordering; (ii) `collaboration-state
claims open --help` errors `flag '--help' requires a value` —
  help is unreachable; (iii) `--active "$PRACTICE_AGENT_SESSION_ID_CLAUDE"`
  produces `ENOENT: no such file or directory, open '<UUID>'` — the
  flag interprets the UUID as a path; (iv) `pnpm
agent-tools:agent-identity` does not inherit env vars through `pnpm
--filter`, requiring `--seed` despite the parent shell having the
  variable set; (v) `collaboration-state claims` (no action) prints
  only the top-level usage line, not the list of available actions
  (`open`, `close`, etc.); (vi) `--area-kind` accepts a closed
  enum (`files`/`workspace`/`plan`/`adr`/`git`) but rejects
  intuitive values like `shared-state` without listing the accepted
  set in the error. Compound effect: the agent abandoned the queue
  workflow and fell back to plain explicit-pathspec staging — the
  substance of the discipline survived (validation + pathspec) but
  the audit-trail value of the queue was lost. Routing-around is
  itself a Practice failure mode: a queue that exists but is
  habitually bypassed under friction is worse than no queue. Strong
  case to promote the future plan to `current/` and execute its
  ergonomics-fix slice next consolidation. **Disposition 2026-05-12:
  graduated for doctrine/routing purposes into PDR-055, ADR-178, and the
  current cost-of-collaboration implementation lane; remaining concrete
  frictions stay as implementation backlog under the newer operator UX entry.**
  **Fourth-instance evidence (2026-05-01, Deep
  Navigating Stern, day-arc continuity commits `514838c9` +
  `bc6cd2e6`)** — eight distinct frictions in one ceremony pair
  produced ~60 seconds of pure flag-discovery and recovery
  overhead per commit: (i) `agent-tools:agent-identity` first-call
  build failure (transient, retry succeeded); (ii) `claims open
--help` rejected (unchanged); (iii) `claims open` required-flag
  discovery by error iteration over **5 round-trips**
  (`--platform`, `--model`, `--active`, `--now`); (iv) `claims
close` required another **3 round-trips** (`--closed` path,
  `--summary` not `--closure-summary`, identity quartet); (v)
  identity quartet repeated across every CLI call (`--platform`,
  `--model`, `--agent-name`, `--seed`); (vi) commit-queue
  `enqueue` records subject at enqueue time with no `update-subject`
  subcommand — over-length subject required abandon-and-re-enqueue
  cycle, leaving an `abandoned` row in `commit_queue`; (vii) `comms
append` uses `--body` while SKILL.md vocabulary suggested
  `--message`; (viii) markdownlint `--fix` corrupted prose-`+` at
  column 0 into a list marker, requiring two manual rephrasings.
  Concrete fixes for the ergonomics slice to prioritise: subject-
  correction subcommand; identity-quartet env defaults inside the
  CLI binary (bypass `pnpm --filter` propagation gap); `--help`
  acceptable without value; subcommand discovery; `comms append`
  flag rename; required-flag enumeration on first error.
  Adjacent: napkin 2026-05-01 fourth-instance entry surfaces an
  \_agent-authored prose interacts surprisingly with markdown
  linters under wrap* observation as small operational discipline,
  not a separate candidate.
- 2026-05-01; **rule visibility under friction is uneven** — the
  always-active `capture-practice-tool-feedback` rule exists and is
  loaded every session via `CLAUDE.md`, but in this session the agent
  hit six tooling frictions in one commit attempt and did not pause
  to capture until the user asked. The rule fired on owner prompt,
  not on the friction itself. Candidate structural cue: when an agent
  uses an `agent-tools:*` command and encounters an unexpected error,
  that should be a structural prompt to write a napkin entry — not a
  sometimes-yes-sometimes-no judgement call. Recursive: this very
  candidate is a meta-instance of the same shape (a rule existed but
  did not fire under friction; the user had to ask). Trigger for
  graduation: second instance of "rule existed but didn't fire under
  friction" OR owner direction. Status: pending.
- 2026-04-28; cross-thread comms event request/response correlation gap
  (no `audience`, no `in_response_to`, no TTL/escalation timer);
  minimal correlation primitive on the comms event schema as recommended
  first promotion slice; trigger: second silently-rotted cross-thread
  request OR owner direction; status: pending.
- 2026-04-28; stance-staleness within a single conversation
  (parallel-agent state moves between forming a stance and reporting it);
  doctrine candidate for `agent-collaboration.md` and start-right
  skills; trigger: second instance OR owner direction; status: pending.
- 2026-04-28; PR-87 Phase 2 pre-phase security review surfaced
  X-Forwarded-For spoofing on Vercel as MUST-FIX; pattern candidate
  `pre-phase-adversarial-review-expands-cluster-scope`; trigger: second
  cross-session instance OR owner direction; status: pending.
- 2026-04-29; small-work bypass of coordination surfaces; rule or
  continuity-practice amendment binding session-open registration to
  _first edit_ rather than to thread join; trigger: owner-flagged AND
  named for separate investigation; status: pending. Cross-reference:
  [`passive-guidance-loses-to-artefact-gravity`](../active/patterns/passive-guidance-loses-to-artefact-gravity.md).
- 2026-04-29; test misnaming as exemption mechanism (a `.e2e.test.ts`
  suffix used as filename certificate to escape in-process restrictions);
  testing-strategy amendment to classify tests by behaviour shape, not
  by filename suffix; trigger: second observed instance OR owner
  direction; status: pending.
- 2026-04-29; agent-infrastructure failure visibility (non-blocking
  agentic-platform hooks fail silently by default); PDR candidate
  extracting the canonical contract from
  [ADR-167](../../../docs/architecture/architectural-decisions/167-hook-execution-failures-must-be-observable.md)
  to Practice Core; trigger: second platform implementing a thin
  wrapper, OR owner direction; status: pending.
- 2026-04-29; recurring myopia patterns at every signal surface
  (reviewer-as-prosthetic; confirmation-reading-vs-exploration;
  hook-as-obstacle; fitness-as-constraint; sed-bypass); pattern
  candidate or PDR amendment for "tool-error-as-question" meta-pattern;
  trigger: third surface OR owner direction; status: pending. Evidence:
  [`hook-as-question-not-obstacle.md`](../active/patterns/hook-as-question-not-obstacle.md);
  [`ground-before-framing.md`](../active/patterns/ground-before-framing.md).
- 2026-04-29; scope-as-goal anti-pattern (treating instrumental work as
  terminal because the work-list was full; reviewer "GO WITH CONDITIONS"
  reading as green light when arc-scope ≠ branch-scope); pattern or
  PDR-018 amendment about reviewer-scope-equals-prompted-scope;
  trigger: second cross-session instance OR owner direction; status:
  pending. Evidence: napkin 2026-04-29 Verdant Regrowing Pollen
  session-end summary in
  [`archive/napkin-2026-04-29.md`](../active/archive/napkin-2026-04-29.md).
- 2026-04-29; reviewer-scope-equals-prompted-scope (a reviewer's
  "GO WITH CONDITIONS" reads as green only if reviewer scope ≡ branch
  merge-gate scope; brief reviewers with full merge gate when
  gating merge); PDR-015 amendment OR new pattern; trigger: second
  cross-session instance OR owner direction; status: pending. Evidence:
  napkin 2026-04-29 Verdant Regrowing Pollen Surprise 4.
- 2026-04-29; experience-audit emergent patterns (medium strength,
  ≥3 instances each, surfaced by 2026-04-29 deep consolidation pass);
  pattern candidates for promotion at second-instance OR owner
  direction; status: pending. Evidence: experience-audit report
  in 2026-04-29 deep consolidation closeout. Six candidates:
  - **silent-degradation-in-green-systems** — tests pass while
    running system is broken (tsx vs dist, characterisation tests
    that never ran, mapping promises a builder never delivers).
  - **plans-are-load-bearing-and-age** — plans encode world-state
    at authoring time and drift; mischaracterisations have the same
    structural risk as bugs.
  - **verify-the-premise-before-solving** — reviewer findings are
    hypotheses about the system, not facts; the fact lives in code.
    Pairs with `ground-before-framing`.
  - **complexity-cascade-feels-productive** — over-engineering
    feels like progress; the simple solution is invisible while in
    the spiral. Pairs with `workaround-gravity`.
  - **bridging-language-smuggles-old-shapes** — "deprecated notice",
    "follow-up", "compatibility layer", "stretch goal" perform
    preservation while preventing the new shape from existing.
  - **fix-the-producer-not-the-consumer** — when a consumer cannot
    use a type/function/structure correctly, the fix is in the
    producer; one template fix → 24 generated files cleaned.
- 2026-04-29; doctrine-tests-itself-on-the-session-of-its-landing
  (the strongest test of a newly-authored rule is whether the
  session that authored it obeys it; corollary: install-session
  self-application is the acid test); PDR candidate (sibling of
  PDR-029 / install-session-blind-to-cold-start-gaps); trigger:
  owner direction (≥4 cross-session instances already documented);
  status: pending. Evidence: experience-audit report; instance
  patterns include 2026-04-22-the-rule-tested-itself,
  2026-04-21-the-recursive-session,
  2026-04-25-fresh-prince-the-protocol-applied-to-itself,
  2026-04-21-installing-a-tripwire-i-cannot-test.
- 2026-04-29; open-up-the-value-early (when extra work closes a
  coordination gap that the surrounding decisions would otherwise
  ship with, the move is to open up that value within the current
  arc rather than ship the original arc and defer); PDR candidate
  (strategic test about composability of surrounding decisions,
  distinct from "do it now"); trigger: owner direction OR fourth
  cross-session instance; status: pending. Evidence: experience-
  audit report; instance patterns include
  2026-04-21-session-3-doctrine-bundle-opening-up-value-early
  (canonical naming), 2026-04-22-the-rule-tested-itself,
  2026-04-18-observability-as-principle.
- 2026-04-29; sentry-observability-maximisation-mcp.plan.md displaced
  doctrine (build-vs-buy attestation + six metacognition guardrails);
  PDR creation candidate ("Build-vs-Buy Attestation as Plan Authoring
  Discipline"), plus ADR-163 §6 amendment to outcome-not-CLI form;
  trigger: owner direction (PDR creation needs explicit approval per
  PDR-003 care-and-consult posture); status: pending. Evidence:
  displaced-doctrine sub-agent report from 2026-04-29 deep
  consolidation pass.
- 2026-04-29; multi-agent-collaboration-protocol.plan.md concept-home
  refinement; doctrine has graduated to canonical surfaces
  (agent-collaboration directive, respect-active-agent-claims rule,
  distilled.md, consolidate-docs §7e, PDR-029 Family A.3); plan body
  still narrates the doctrine alongside execution status; the work is
  routing each section to its canonical home (or keeping it as
  plan-scoped substance), not a size-target trim — line count falls
  because duplication is removed; trigger: owner direction (preserves
  audit-trail role for WS5 evidence harvest); status: pending. Evidence:
  displaced-doctrine sub-agent report from 2026-04-29 deep consolidation
  pass; child plan at
  [`multi-agent-collaboration-protocol-concept-home-refinement.plan.md`](../../plans/agent-tooling/current/multi-agent-collaboration-protocol-concept-home-refinement.plan.md).
- 2026-04-29; trinity Active Principles + bootstrap structural
  extensions for the five 2026-04-29 doctrine sharpenings (knowledge-
  preservation absolute, shared-state always-writable, tool-error-as-
  question, scope-as-goal, behaviour-shape testing classification);
  amendments queue for `practice.md` §Philosophy + Collaboration,
  `practice-lineage.md` Active Principles, `practice-bootstrap.md`
  §Napkin + §Sub-agents, `practice-verification.md` shared-state
  smoke-test addition; trigger: owner direction (per PDR-003 care-
  and-consult; sub-agent assessed as healthy-lag, not silent rot);
  status: pending. Evidence: trinity-drift sub-agent report from
  2026-04-29 deep consolidation pass.
- 2026-04-30; graduation-trigger criteria too restrictive — owner
  observation at session close (Verdant Sheltering Glade): the
  default "trigger: second instance OR owner direction" criteria
  used across most Pending-Graduations Register entries is too
  restrictive in practice. Strong candidates with one robust instance
  - clear principle articulation can wait sessions for a second
    instance that may never come, while owner direction is a synchronous
    cost. Future session needed to: (a) audit the trigger criteria
    shape across the register; (b) propose alternative criteria
    (single-instance-with-evidence-density, principle-articulation
    quality test, structural-coverage check); (c) update consolidate-docs
    §7a guidance. Trigger: future session with owner appetite for
    flow refinement; status: pending. Evidence: this session graduated
    PDR-036/037/038/039 on owner direction after the candidates had
    been pending for sessions despite stable doctrine and worked
    instances.
- 2026-04-30; commit-bundle-leakage-from-wildcard-staging — wildcard
  `git add -A` (or moral equivalent) over a working tree containing
  another session's WIP produces a commit whose message is true for one
  slice of the diff and silent about the rest. Surfaced 2026-04-30 by
  the `75ac6b75` post-mortem (51 lines of legitimate continuity work
  bundled with 372 lines of parallel Practice-thread plan work plus 3
  lines of unrelated `.claude/settings.json` plugin enable). Corrective
  shape: stage by explicit pathspec from the queued intent; verify
  staged-bundle-matches-intent before commit; treat
  files-outside-the-named-intent as a coordination event. Already
  partially in distilled.md § Process; trigger for full graduation
  (rule + commit-skill amendment): second cross-session instance OR
  owner direction. Status: pending. Evidence:
  [`experience/2026-04-30-verdant-the-bundle-was-the-signal.md`](../../experience/2026-04-30-verdant-the-bundle-was-the-signal.md).
- 2026-04-29; pre-2026-02-15 experience corpus extraction backlog
  (~80 files dating from 2025-01 through 2026-02-15 contain
  inline doctrine, code blocks, principle catalogues that displace
  the subjective register; healthy post-2026-02-15 corpus shows
  the audit discipline now works as intended); one-time extraction
  task; trigger: owner direction; status: pending. Evidence:
  experience-audit report. Recommended extraction approach:
  preserve subjective texture, strip technical content, link to
  canonical homes; group by similar source files (phase-\* cluster,
  2025-01 cluster, 2025-08 cluster) for batch processing.

- 2026-05-01; **`stop inventing optionality` / apply-don't-ask
  (QUAR-1)** — graduated 2026-05-10 (Quiet Lurking Mask) to
  [PDR-057 (empirical-answerability)](../../practice-core/decision-records/PDR-057-empirical-answerability.md)
  - [PDR-058 (three-tier optionality decomposition)](../../practice-core/decision-records/PDR-058-three-tier-optionality-decomposition.md).
    Quarantine cleared at
    [`quarantine/apply-dont-ask-doctrine.md`](quarantine/apply-dont-ask-doctrine.md)
    (preserved as historical evidence of the 2026-05-01 destructive
    incident). Audit-trail body archived to
    [`archive/pending-graduations-archive-2026-05-10.md`](archive/pending-graduations-archive-2026-05-10.md).
    Status: graduated 2026-05-10.

- 2026-05-10; **design optionality** (per PDR-058 §Surface 2) —
  routing label for the standalone rule sibling. Impact: erodes
  types, bakes in fragility, mints maintenance load. Diagnostic:
  surface being authored or reviewed admits a configurable /
  optional / extensible shape with no concrete second instantiation
  in scope. Cure: the closed-shape rule — author the closed shape
  the known instances need; defer extensibility until a real second
  instance forces decomposition. Status: pending. Trigger: second
  named instance with concrete cure draft, OR owner direction. Source:
  PDR-058 §Surface 2.

- 2026-05-10; **outcome optionality** (per PDR-058 §Surface 3) —
  routing label for the standalone rule sibling. Impact: produces
  unfalsifiable plans; shoehorns value-claims into infrastructure
  that cannot carry them. Diagnostic: a plan, ADR, acceptance
  criterion, or test conditions its outcome on a fork that has a
  determinate answer or on infrastructure not currently in the
  repo. Cure: the falsifiability rule — outcome must name a single
  observable signal that distinguishes success from failure;
  if infrastructure to observe is absent, the plan says so and
  ships structural enforcement. Sibling: _don't shoehorn a value-
  claim_ candidate (2026-04-30 entry below) — may merge or remain
  distinct depending on evidence. Status: pending. Trigger: second
  named instance with concrete cure draft, OR owner direction. Source:
  PDR-058 §Surface 3.
- 2026-04-30; **don't shoehorn a value-claim into infrastructure that
  cannot carry it** — when the right way to verify something does not
  exist yet, the honest plan says so and ships the structural enforcement
  that does exist; it does not invent brittle tests or fantasy operational
  protocols to fill the gap. Sense-check: "if this stopped existing
  tomorrow, who would know? how?" If the answer is "no one, because the
  infrastructure for knowing doesn't exist", do not pretend the
  infrastructure exists. Status: pending. Trigger: second instance OR
  owner direction. Evidence: Iridescent's session-close napkin (LLM-
  graded outcome conditions in EEF plan removed under owner direction).

- 2026-05-01; **rush impulse as system-level entropy generator + three
  structural cues** — owner-named at the close of the 2026-05-01
  consolidation turn, in response to two rush failures within that turn
  (the _bootstrap fast-path_ candidate; the _informational not actioned_
  defer-shape on napkin CRITICAL fitness). Substance: most named fences
  in the codebase (replace-don't-bridge, stop-inventing-optionality,
  stage-by-explicit-pathspec, learning-preservation-overrides-fitness,
  hook-failures-are-questions, no-underscore-rename, no-sed-bypass,
  session-handoff hard gate, PDR-026 deferral-honesty, PDR-042 signal-
  distinguishing) all fight the same generator from different angles;
  fence accumulation without naming the generator is microstate
  proliferation around an unchanged macrostate. Three structural cues
  forward as a cohesive defence rather than separate fences: (1)
  vocabulary trip-list at output time — _fast path_, _quick fix_,
  _informational not actioned_, _defer_, _light pass exempts_, _for
  later_, _out of scope_, _next session_; (2) conditional-discipline
  check before proposing structure — does the candidate introduce a
  "case where the rule doesn't apply"?; (3) first-principles framing
  question — what would the path look like with no closure pressure?
  Graduation target candidates: PDR-shaped (Practice-governance about
  doctrine-evolution discipline, sibling of PDR-042); PDR with
  `pdr_kind: pattern` after a synthesis with the existing fences it
  ties together; or amendment to PDR-042. Trigger: owner direction
  has fired in part (the framing was named explicitly this session);
  graduation requires a deliberate next-session shape not mid-turn
  closure (per the very discipline being captured). Evidence: napkin
  2026-05-01 metacognition entry (Deep Navigating Stern); experience
  file at
  [`experience/2026-05-01-deep-the-rush-was-the-fix.md`](../../experience/2026-05-01-deep-the-rush-was-the-fix.md).
  Status: pending — first articulation; second cross-session
  articulation OR explicit owner authorisation of PDR/pattern shape
  required before promotion.

- 2026-05-01; **markdown shared-state writes have no collision
  safety** — captured 2026-05-01 by Deep Navigating Stern after an
  unrelated agent silently overwrote `repo-continuity.md` Last
  refreshed entry + Active identities column + Deep consolidation
  status, AND `threads/agentic-engineering-enhancements.next-session.md`
  Last refreshed entry + identity-table row, between handoff-close and
  stage. The napkin, pending-graduations register, experience file,
  and `~/.claude.json` MCP swap survived intact because their shapes
  are naturally collision-resistant (per-session append heading;
  structured per-item additive entries; per-session-per-agent named
  file; user-scope file outside any agent's standard write path).
  **Substance**: JSON shared-state has transaction safety since
  `11f0320f` (the collaboration-state-write-safety landing); markdown
  shared-state has no equivalent. Single-slot Last refreshed prose
  surfaces are the only collision class — every concurrent
  session-handoff walks through this hazard. Five prevention shapes
  considered (full table in napkin), strongest combination:
  (a) **convergent write-surfaces (additive design)** — make Last
  refreshed entries append-only by structure, eliminating the
  collision class as the thread record's identity table already does
  per PDR-027; (b) **handoff-window claim** — direct analogue of the
  `git:index/head` commit-window claim, with new `area_kind: handoff`
  on the active-claims schema. Intermediate detection-only mitigation:
  post-write `stat` of touched files at handoff-close, ALERT if
  `mtime > handoff-start`. Graduation target: extend write-safety
  doctrine from JSON state to markdown shared-state surfaces;
  concretely (a) Last refreshed surface redesign in
  `commands/session-handoff.md` + the two affected files'
  conventions, (b) `area_kind: handoff` on the active-claims schema
  - queue/claim integration, OR (c) a PDR amendment to the
    collaboration-state-domain-model plan family that names the
    collision-class structurally. Routes to existing
    [`collaboration-state-domain-model-and-comms-reliability.plan.md`](../../plans/agent-tooling/future/collaboration-state-domain-model-and-comms-reliability.plan.md)
    as the future-plan home for shared-state collision analysis.
    **Trigger**: owner direction has fired in part (the request _"any
    prevention or additional signal would be very welcome"_ names the
    prevention question directly); a deliberate next-session shape is
    required for design-and-implementation work — installing prevention
    mid-handoff would be the rush impulse the prior register entry
    just named. Evidence: napkin 2026-05-01 _markdown shared-state
    writes have no collision safety_ entry (Deep Navigating Stern);
    this very session's revert-and-re-apply of the two affected files
    recorded in the in-place note inside both. Adjacent: the 2026-04-30
    _commit-bundle leakage from wildcard staging_ distilled entry names
    a sibling-but-distinct mechanism (single-agent action consumes
    peer's WIP) — the present mechanism is the inverse (concurrent
    independent writes overwrite each other on a shared single-slot
    surface). Status: pending.

- 2026-05-01; **retired threads need explicit retirement signal in
  the file itself, plus a consolidation-time hygiene check** — owner
  observation 2026-05-01 (Deep Navigating Stern session): the
  `pr-90-build-fix-landing.next-session.md` thread has been complete
  for several days but the file in `threads/` shows no retirement
  banner; an agent browsing the directory sees a file shaped like
  an active thread record. Retirement is documented only in
  `repo-continuity.md` prose (_"The pr-90-build-fix-landing thread
  retired 2026-04-30 (PR #90 merged 2026-04-29T20:43:22Z). Thread
  record retained ... for audit-trail value."_); the file itself
  carries no signal. Owner reframing: _"we need a thread hygiene
  prompt, perhaps in the document consolidation workflow."_ Two
  distinct hygiene shapes that compose: (a) **per-file retirement
  banner** — add a frontmatter status field (`status: retired`,
  `retired_at: <date>`, `retirement_reason: <one-line>`,
  `audit_trail_retained: true|false`) plus a top-of-file banner
  pointing to the canonical record of why; (b) **`consolidate-docs`
  step 7c thread-hygiene check** — extend the existing six-check
  audit with a seventh: enumerate `threads/*.next-session.md` files
  AND compare to the `Active threads` table; flag any thread file
  not listed in Active threads (signals retirement-without-banner)
  AND any retired-banner file whose retirement age exceeds a
  threshold (signals time-to-archive to `threads/archive/`). (a)
  makes retirement self-evident at the file level; (b) catches
  retirement-without-(a) and prompts archival cadence. Substance
  routes naturally to a PDR-027 amendment (thread identity surface)
  plus a `consolidate-docs.md` step 7c amendment. Trigger: owner
  direction has fired in the request itself; graduation requires
  deliberate next-session work for the doctrine + workflow change
  - retroactive banner application to the one currently-retired
    thread record. Status: pending. Evidence: this session's owner
    observation; the
    [`pr-90-build-fix-landing.next-session.md`](threads/pr-90-build-fix-landing.next-session.md)
    thread record itself; the corresponding prose retirement note
    in `repo-continuity.md`.

- 2026-05-01; **idea (pre-candidate): hook-layer safety net for
  destructive operations** — owner-recorded after the 2026-05-01
  destructive `git checkout --` incident. Concept: a `PreToolUse`
  hook (or equivalent) that intercepts the named destructive Bash
  operations (`git push --force*`, `git reset --hard*`, `git rebase*`,
  `git clean -f*`, `git branch -D*`, `git checkout --*`,
  `git restore*`, `git stash*`, `git revert*`, `git commit --amend*`,
  `git push*`, `rm -rf*`) and either blocks or forces explicit fresh
  authorisation per call. Operates as an active firing layer — the
  shape that the recall-dependent-principles PDR (owner-authorised
  2026-05-01) names as the structural cure for safety rules whose
  passive-prose form does not survive flow-state pressure. Pairs
  with the `.claude/settings.json` `permissions.deny` / `permissions.ask`
  proposal (separate decision; settings are a coarser layer, hooks
  give per-call surfacing in chat with reasoning context).
  **Status: idea, not yet a doctrine candidate.** Not subject to any
  trigger condition; recorded for future structural-cure design
  rather than promotion through the candidate pipeline. Owner
  decision required to activate.

- 2026-05-05–06; **fat-baton handoff — session-handoff events should
  inline the current diagnostic state when the receiver will need it**
  (Ashen Banking Bellows `7cf730`, comms event
  `dfdea3f7-7968-4557-9a08-9890c8d2c7f3`, 2026-05-05T13:52:04Z,
  15182-char body; captured this pass by Riverine Fishing Rudder
  `b89da0`). Observed: Ashen's handoff event to Vining Growing Meadow
  inlined the full `practice:fitness:strict-hard` orchestrator output
  verbatim (line counts, char counts, zone markers) rather than naming
  the diagnostic state by reference only. Vining did not have to
  re-run the orchestrator to anchor in-flight fitness state.
  Asymmetry: one extra orchestrator invocation at handoff-authorship
  time; one avoided re-run per receiver (low fan-out; one-to-one
  handoff). Behaviour change: when authoring a session-handoff event
  whose receiver is named and whose intake will require diagnostic
  state, paste the diagnostic output verbatim into the body.
  Discriminator: receiver is named (one-to-one, not broadcast); the
  diagnostic state is ephemeral and decays between author's
  measurement and receiver's measurement. Composes with PDR-048
  (insight capture at moment of occurrence — the diagnostic state is
  exactly the insight that decays without verbatim capture) and
  PDR-046 §Move 3 (inlined diagnostic is graduation of the
  orchestrator's signal into the handoff record, not loss-compression).
  Source-surface: comms event `dfdea3f7`; Step 2 Surprise A in
  archive `napkin-2026-05-06.md`.
  Graduation-target: coordination-cure pattern at
  `.agent/memory/active/patterns/fat-baton-handoff-inline-diagnostic.md`
  naming the pattern shape with discrimination criteria (named
  receiver; ephemeral diagnostic; one-to-one).
  Trigger-condition: second worked instance of a named-receiver
  handoff event that inlines diagnostic state the receiver confirms
  was used at intake.
  Status: pending — single first-class instance.

- 2026-05-05–06; **workflow gaps directly relevant to an in-flight
  consolidation session can be patched in-session rather than
  deferred to a later session** (Vining Growing Meadow `92cb10`,
  session-handoff §6a refinement commit `84879230`; captured this
  pass by Riverine Fishing Rudder `b89da0`). Observed: Vining
  discovered that `session-handoff.md §6a` listed napkin buffers as
  source collection for session-close recordings but did not name
  comms as an auxiliary source. The gap was directly relevant
  to the in-flight consolidation work (Step 2 required comms
  as its primary read source). Vining patched the workflow file
  within the same session that exposed the gap — not in a later
  session. The default Practice cadence is capture-in-one-session /
  graduate-in-later-session (PDR-014 + PDR-046 layering); this
  instance refines the boundary: the "later" is not mandatory when
  (a) the consolidation session itself is the natural graduation
  moment for the gap, (b) the gap is directly relevant to the
  in-flight work, (c) the patch is a single coherent edit, and (d)
  reviewer dispatch fires before commit. The 30%-context rule still
  gates directive-file edits; non-directive workflow files (commands,
  skills, permanent docs) are not gated.
  Source-surface: comms events `dfdea3f7` (Ashen handoff listing
  buffers without comms) → `8170aad1` (Vining arrival
  reply noting the gap) → commit `84879230`; Step 2 Surprise B in
  archive `napkin-2026-05-06.md`.
  Graduation-target: amendment to PDR-014 (consolidation flow)
  adding the in-session-patch discriminator criteria for workflow-gap
  substance discovered during consolidation, OR new entry in
  `distilled.md §Process` naming the consolidation/capture-boundary
  refinement.
  Trigger-condition: second worked instance of an in-session workflow
  patch on a gap directly relevant to the consolidation in flight,
  where reviewer dispatch also fired; OR owner direction.
  Status: pending — single first-class instance.

- 2026-05-05–06; **cross-thread git-history advances are observable
  coordination signals; peer agents can adapt without exchanging
  messages** (Opalescent Glowing Constellation `019df9`, comms
  events `9d1b26c0` → `9ad379a7` → `eecb8de8` → `f4d5adaf`,
  2026-05-05T20:27Z–20:45Z; captured this pass by Riverine Fishing
  Rudder `b89da0`). Observed: Constellation opened on the
  observability-sentry-otel thread, performed PR-93 remote
  verification, detected that Riverine's Step 1 commit had advanced
  the local branch head to a new SHA mid-session, re-ran the
  verification against the new head, and posted a fresh completion
  event — all without any comms exchange between the two threads.
  The shared substrate (immutable comms ordered by
  `created_at` + git history) was sufficient context for cross-thread
  adaptation. Behaviour change: treat git-history advances on a
  shared branch as observable cross-thread coordination signals; a
  cross-thread peer re-running their verification against a new head
  SHA is correct substrate use, not a violation of thread isolation.
  Thread-scoped identity (PDR-027) does not preclude cross-thread
  substrate observation; the active-areas registry, comms,
  and git history are all shared observable surfaces.
  Source-surface: comms events `9d1b26c0`, `9ad379a7`, `eecb8de8`,
  `f4d5adaf`; Step 2 Surprise C in archive `napkin-2026-05-06.md`.
  Graduation-target: amendment to PDR-027 §Thread and Session Scope
  adding a note that thread-scoped identity does not exclude
  cross-thread substrate observation (git history, active-areas
  registry, comms), OR new `distilled.md §Agent-Coordination`
  entry naming the shared observable surfaces.
  Trigger-condition: second instance of a cross-thread adaptation
  driven by git-history observation without explicit comms exchange;
  OR owner direction.
  Status: pending — single first-class instance.

- **Inventory-as-output, not as-document** — captured-date 2026-05-06.
  Source-surface: `agent-artefact-portability-audit-2026-05-06.report.md`
  §6 graduation-candidate list; live evidence: ADR-125 inventory
  tables drifted by +17 rules / +17 Cursor triggers / +1 skill since
  2026-04-28 amendment despite no contract change. The pattern: count
  tables in permanent docs decay; the right shape is to emit counts
  from a verifier and reference the regenerable inventory, not to
  embed counts. Refines the existing
  no-moving-targets-in-permanent-docs memory rule with the structural
  observation that **emission-vs-embedding** is the load-bearing
  distinction (the rule already names plans as an acceptable home for
  moving counts).
  Graduation-target: PDR-009 amendment under
  §"Many-to-one trigger consolidation" or a new §"Inventory emission"
  block; OR ADR-125 amendment paired with the count-table strip.
  Trigger-condition: Phase 8 of `agent-artefact-lifecycle-cli.plan.md`
  reaches ADR-125 amendment; OR a second permanent-doc count drift
  surfaces independently of this audit.
  Status: pending — first-class instance with structural justification.

- 2026-05-09; **workspace topology ADR superseding ADR-108 — pipeline stages
  S0–S6 and stage×workspace matrix** (Fronded Bending Blossom / cursor /
  Composer / `60775a`; strategic plan
  `architecture-and-infrastructure/future/monorepo-workspace-topology-adr-and-canonical-plan.plan.md`).
  Owner-refined direction: avoid treating “codegen” as one concept; separate
  definition acquisition (**S0**), primitive emission — types, constants,
  predicates (**S1**), optional derived/mining (**S2**), library composition
  from primitives (**S3**), package build (**S4**), runtime assembly
  (**S5**), execution (**S6**); classify every workspace by stage tags;
  **multi-stage membership outside substrate** is a boundary-review signal;
  **substrate** (`packages/core/*` first) may span stages with explicit allow
  rules. Aligns superseding ADR with ADR-154 thin leaves (generic **S3** +
  **S1/S2** vs named wiring).
  `[captured: 2026-05-09 | source: owner-direction+plan | target: adr:supersedes-108-workspace-topology | trigger: owner-direction OR plan-promoted-to-draft | size: L | status: pending]`
  Graduation-target: new `docs/architecture/architectural-decisions/*.md`
  superseding ADR-108, **Related** ADR-154/117/031/030; one canonical topology
  narrative per ADR-117; supersession notice on ADR-108.
  Trigger-condition: owner confirms or revises **S0–S6** names and substrate
  exception rules; OR executable promotion of `draft-adr-supersedes-108` todo.
  **Sequencing (owner 2026-05-09)**: do not start drafting until after the
  **graph MVP implementation** tranche; this item stays `pending` for that gap.
  Status: pending — substance lives in the strategic plan until drafting slot.

### deferred-at-write-time decisions are unmade load-bearing decisions

When a plan defers a substantive structural decision into "decide at
write time" (e.g. WS2.3 of skills-standardisation: import-from-workspace
vs duplicate-XOR), the deferral is not flexibility — it is the plan
owner declining to make a load-bearing decision, leaving the cycle
author to make it under implementation pressure. WS0 (2026-05-09)
turned the deferral into a structural choice (subprocess delegation)
before any code was written, and the reshape applied cleanly to the
paired sibling cycle (WS2.4) at no extra cost.
`[captured: 2026-05-09 | source: napkin | target: pattern OR rule | trigger: second instance observed in a different plan | size: S | status: pending]`
Graduation-target: pattern under `.agent/memory/active/patterns/` or
rule under `.agent/rules/` (deferred-decisions-are-unmade-decisions);
consider folding into a broader plan-shape rule alongside
consolidate-at-third-consumer.
Trigger-condition: a second instance of "decide at write time" surfaces
in any plan during the next session window OR the next consolidation
pass evaluates the substance.

### Insight-Report 2026-05-10 Candidates

Eight borderline candidates surfaced during disposition of the 30
useful-content items in the 2026-05-10 Claude insight report
(`.agent/reference-local/claude-insight-reports/2026-05-10-full-corpus/`,
observational, gitignored). Authoritative analysis lives in
`.agent/plans/agentic-engineering-enhancements/current/claude-insight-report-2026-05-10-disposition.plan.md`
§Disposition Ledger. Items registered as a single batch because the
source artefact is one observational snapshot and the entries share
the same trigger discipline (need corroboration across more than one
regeneration window before graduation, except where named otherwise).
`[captured: 2026-05-10 | source: experience/insight-report-2026-05-10 | target: multi:see-per-item | trigger: candidate | size: L | status: pending]`

- **Item 10 — Affirmation phrase corpus** (paired complement to the
  course-correct vocabulary pattern). Owner-side affirmation phrases
  ("exactly", "great", "perfect") read as confirmation that the prior
  framing landed correctly; the question is whether weighting agent
  state-change on these affirmations needs a documented discipline.
  Source: `08-communication-style.md` §Signals that mean "you got it
  right".
  `[captured: 2026-05-10 | source: experience/insight-report-2026-05-10 | target: pattern:owner-affirmation-vocabulary | trigger: second-instance(regeneration-window) | size: S | status: pending]`
  Graduation-target: companion pattern at
  `.agent/memory/active/patterns/owner-affirmation-vocabulary.md`,
  paired with the just-landed `owner-course-correct-vocabulary.md`.
  Trigger-condition: a second insight-report regeneration confirms the
  affirmation set, OR an in-session observation surfaces a misread of
  affirmation-as-instruction.
  Withdrawal-trigger: if the next regeneration shows the affirmation
  set has shifted materially (different phrases, different meanings),
  withdraw and re-derive.

- **Item 12 — Cross-repo sibling list** (Oak ecosystem).
  Static cross-repo map naming sibling repositories (oak-curriculum,
  oak-ontology, etc.) and their relationship to this repo. Source:
  `01-user-profile.md` and `04-domain-and-stack.md`. Verification owed
  against `.agent/practice-core/practice-lineage.md` before any
  graduation decision: if `practice-lineage.md` already carries a
  cross-repo sibling map, this is a DISCARD.
  `[captured: 2026-05-10 | source: experience/insight-report-2026-05-10 | target: doc-amend:practice-lineage.md OR none | trigger: candidate(verification-owed) | size: S | status: pending]`
  Graduation-target: amendment to `practice-lineage.md` with a sibling
  list section, OR a new `docs/engineering/sibling-repos.md`-paired
  pointer if `sibling-repos.md` is the canonical home.
  Trigger-condition: verification confirms `practice-lineage.md` does
  NOT already carry the sibling map.
  Withdrawal-trigger: verification confirms it does — DISCARD with
  rationale; OR the sibling list churns within a release window such
  that any static map is stale on arrival, regardless of where it
  lands.

- **Item 16 — Memory/skills key-terms glossary** (Distillation, Napkin
  rotation, Adapter-only skill). Phase 0 audit (Windswept Sweeping
  Gale, 2026-05-10) confirmed the three terms are pervasive in context
  across `.agent/memory/` and `.agent/skills/` but absent as glossary
  entries in `practice-index.md` (navigation surface) and
  `templates/README.md` (planning vocabulary, not memory/skills
  vocabulary). The candidate question is whether a memory/skills
  glossary surface is warranted, distinct from the planning glossary.
  Source: `05-doctrine-substrate.md`.
  `[captured: 2026-05-10 | source: experience/insight-report-2026-05-10 | target: doc-amend:memory-readme-or-new-glossary | trigger: candidate(structural) | size: M | status: pending]`
  Graduation-target: `.agent/memory/README.md` amendment with a §Key
  terms section, OR a new `.agent/memory/glossary.md` file scoped to
  memory and skills vocabulary. Decision deferred to graduation time.
  Trigger-condition: a second instance of agent confusion or
  inconsistent term usage across `.agent/memory/` surfaces, OR owner
  direction that a glossary surface is warranted.
  Withdrawal-trigger: terms become self-defining in context to a
  degree that an explicit glossary adds no clarity.

- **Items 19 + 21 — Reply preferences and default reply shape**
  (paired). Item 19: compact table of owner reply preferences
  (direct answers vs hedging; concise updates vs trailing summaries;
  specific paths vs generic descriptions). Item 21: the four-step
  default reply shape (lead with answer; one sentence of evidence;
  one-line next step if action; one or two sentences on what changed
  if completion). Phase 0 audit confirmed
  `.agent/directives/user-collaboration.md` does not carry either
  explicitly; §Working Model partially overlaps. Source:
  `08-communication-style.md` §What Jim wants in replies and §Reply
  shape (default).
  `[captured: 2026-05-10 | source: experience/insight-report-2026-05-10 | target: doc-amend:user-collaboration.md OR pattern:owner-reply-shape | trigger: candidate | size: S | status: pending]`
  Graduation-target: amendment to `user-collaboration.md` §Working
  Model adding a §Reply shape subsection, OR pattern at
  `.agent/memory/active/patterns/owner-reply-shape.md` paired with
  the just-landed `owner-course-correct-vocabulary.md`.
  Trigger-condition: a second observation across regeneration windows
  OR owner direction.
  Withdrawal-trigger: owner direction that the implicit doctrine in
  §Working Model is sufficient.

- **Item 26 — Ten cures ranked by recurrence**. The
  `09-agent-action-rules.md` §"The ten cures" lists corrections
  ordered by observed recurrence. Recurrence-ranking is observational
  synthesis; the candidate question is whether the ranking itself
  informs `pending-graduations.md` weighting (more frequently-cited
  cures escalate faster).
  Source: `09-agent-action-rules.md` §The ten cures.
  `[captured: 2026-05-10 | source: experience/insight-report-2026-05-10 | target: doc-amend:pending-graduations-or-distilled-weighting | trigger: candidate(synthesis) | size: M | status: pending]`
  Graduation-target: amendment to this register's lifecycle prose, OR
  to `distilled.md`, naming recurrence-rank as a weighting input for
  graduation-readiness.
  Trigger-condition: a second insight-report regeneration confirms a
  stable rank ordering across at least two windows.
  Withdrawal-trigger: ranks shift materially between regenerations
  (rank-instability falsifies the weighting claim).

- **Items 29 + 30 — Decay model and honesty discipline for generated
  insight artefacts** (paired; both scoped to any future
  agent-generated insight artefact in this repo). Item 29: the
  cadence-vs-friction decay split (cadence/topic/branch decays
  week-scale; friction/communication decays month+) names which
  sections of a generated artefact go stale fastest. Item 30: the
  evidence-vs-interpretation honesty split distinguishes direct
  evidence (counts in the relevant file) from interpretation (grounded
  in curated surfaces, not invented). Both are methodological framing
  rather than substance; they govern HOW future generated artefacts
  shape themselves.
  Source: `00-INDEX.md` §Decay & refresh and §Honesty notes.
  `[captured: 2026-05-10 | source: experience/insight-report-2026-05-10 | target: pattern:generated-insight-artefact-discipline OR rule:no-moving-targets-amendment | trigger: candidate(structural) | size: S | status: pending]`
  Graduation-target: pattern at
  `.agent/memory/active/patterns/generated-insight-artefact-discipline.md`
  carrying both splits, OR amendment to
  `.agent/rules/no-moving-targets-in-permanent-docs.md` naming the
  cadence-vs-friction split as a load-bearing distinction.
  Trigger-condition: a second generated insight artefact is created in
  this repo and either split applies usefully.
  Withdrawal-trigger: a second artefact's decay shape contradicts the
  cadence-vs-friction split, OR the honesty discipline collapses to
  "honest documentation" with no marginal value over existing
  principles.

### 2026-05-10 commands-retirement follow-ups (Tempestuous Darting Zephyr)

Five follow-ups surfaced during the .agent/commands retirement that
were tracked as out-of-branch-scope; recording here for the next
consolidation to triage.

1. **Pre-commit hook gap for skills/portability gates.** Neither
   `pnpm portability:check` nor `pnpm skills:check` runs in
   `.husky/pre-commit` today; both gates are only reachable via the
   full `pnpm check` or manual invocation. The .agent/commands
   retirement shifted skill-adapter drift detection entirely onto
   `pnpm skills:check`, amplifying the gap. Config-expert P1.
   `[captured: 2026-05-10 | source: reviewer:config-expert | target:
rule:pre-commit-hook-coverage OR ADR-121-amendment | trigger:
adapter-drift slips past pre-commit OR owner-direction to fix |
size: S | status: pending]`

2. **`getSkillPermissionIssues` dead parameter + missing live-path
   tests.** Post-retirement, `claudeCommandFiles` is always `[]`;
   existing unit tests exercise the dead `claudeCommandFiles` path
   while the live `claudeSkillDirs` path has zero unit coverage.
   `[captured: 2026-05-10 | source: reviewer:test-expert+code-expert
| target: code-cleanup + test-cycle | trigger: next touch on
agent-tools/scripts/validate-portability-helpers.ts | size: S | status: pending]`
   Retained 2026-05-12: implementation cleanup, not a doctrine graduation.
   Keep it with the next touch of the helper so test and product code land as
   one focused cycle.

3. **Unit-coverage gap for `evaluateParityChecks`.** The two remaining
   parity evaluators (`evaluateReviewerAdapterParity`,
   `evaluateReviewerRegistrationParity`) have no unit tests; exercised
   only at integration level via `pnpm portability:check`. The
   `evaluateCommandAdapterParity` deletion made this gap visible but
   did not introduce it. Test-expert finding.
   `[captured: 2026-05-10 | source: reviewer:test-expert | target:
test-cycle | trigger: next touch on agent-tools/src/core/health-probe-parity.ts
| size: M | status: pending]`

4. **`shouldInspectFile` single-positive-example coverage.** The
   `inspects live markdown files` test exercises one `.agent/skills/…`
   path; a stub that special-cases that exact path would pass. Add a
   second positive example to demonstrate the rule applies to the
   class of paths, not one instance. Test-expert finding.
   `[captured: 2026-05-10 | source: reviewer:test-expert | target:
test-cycle | trigger: next touch on validate-fitness-vocabulary
suite | size: XS | status: pending]`
   Retained 2026-05-12: focused test-cycle cleanup, not a doctrine
   graduation. Keep it with the next touch of the validator suite.

5. **Cross-agent sweep-bundling prohibition (PATTERN — 5th instance).**
   Mask-bundle pattern: parallel agent's `git commit` absorbs another
   session's staged work between the staging agent's `git add` and the
   committing agent's `git commit`. Five observed instances across
   2026-05-04 → 2026-05-10. Cure shape: refuse cross-agent
   sweep-bundling when any non-trivial test or product code change is
   included. Source for graduation: test-expert atomic-landing
   observation + four prior foreign-stage absorption instances.
   `[captured: 2026-05-10 | source: reviewer:test-expert+napkin | target:
PDR:cross-agent-commit-bundling-discipline OR rule:never-bundle-foreign-staged-work
| trigger: implementation-tail+owner-decision | size: M |
status: pending]`
   Graduation-target: portable Practice PDR governing commit-window
   coordination + intent-to-commit lifecycle.
   Retained 2026-05-12: PDR-054/PDR-059 and the P3 guard now carry the doctrine
   backbone. The remaining decision is harder-to-bypass enforcement across all
   commit paths, not another prose prohibition. Withdrawal-trigger: the
   cost-of-collaboration enforcement tail absorbs the discipline, or owner
   direction asks for a separate PDR/rule anyway.

### 2026-05-11 — Cross-schema events in single directory (without discriminator)

The `comms/` directory carries two schemas simultaneously
without a discriminator: append-only-narrative log events
(`created_at / author / title / body`) and inter-agent directed
messages (`timestamp / from / to / subject / kind / schema_version`).
`renderComms` reads ALL events through `parseCommsEvent` (narrative
schema), so the 2 message-shape events trip the parser. B-01 was
misdiagnosed for an entire session because of this. Cure shape
choices (one architecturally-excellent option to be picked):
**split directories** (`comms/` for narrative,
`comms/` for directed messages), **widen the parser with a
discriminator field**, or **deprecate the directed-message schema**
in favour of narrative.

`[captured: 2026-05-11 | source: investigation:B-01-corrected-diagnosis |
target: ADR-or-PDR:cross-schema-directory-discriminator-discipline OR
rule:single-schema-per-directory | trigger: owner-direction needed on
fix shape, then second instance lands the doctrine | size: S |
status: pending — owner-direction required for fix shape first]`

Graduation-target: doctrine on single-schema-per-directory OR
explicit-discriminator-field-when-mixed. Withdrawal-trigger: the chosen
fix shape (split / widen / deprecate) lands and the pattern doesn't
recur in any other directory.

### 2026-05-11 — Owner re-decision loop on evidence-refuted premise

Pattern: owner direction → reviewer evidence-check at the next phase
boundary → re-surface with corrected evidence → owner re-decide. Two
instances this session (ORD-1 Path α premise refuted at 98% JSON
coverage → owner picked Path β; ORD-2 R4a Bash hook found 6 critical
bypasses → owner picked Shape B drops R4a). Architectural shape is
healthy: owner authority preserved, evidence-honouring preserved, no
silent override. The reviewer must surface the refuted premise as an
explicit re-decide item, never silently re-shape the design.

`[captured: 2026-05-11 | source: session:Deciduous-Twining-Dew | target:
PDR:owner-re-decision-on-evidence-refuted-premise OR
rule:re-surface-don't-override-on-evidence-correction | trigger: second
distinct instance in a different review type | size: S | status: pending]`

Graduation-target: portable Practice PDR on the re-decision protocol;
sibling to `inter-agent-decisions-belong-to-agents` feedback memory.
Withdrawal-trigger: the protocol is named in `principles.md` §Owner
Direction Beats Plan amendment OR a second instance fails to surface
the refuted premise cleanly.

### 2026-05-11 — Pre-flight fingerprint scan before shape decisions

`[captured: 2026-05-11 | source: session:Smouldering-Crackling-Pyre |
target: rule:pre-flight-fingerprint-scan-before-shape-decisions OR
pattern:fingerprint-the-data-before-shaping-the-fix | trigger: second
distinct instance where a stated premise about a data corpus is
refuted at execution time | size: S | status: pending]`

Worked instance 2026-05-11 (Smouldering Crackling Pyre): R1 plan
landed in plan mode with a two-family premise (narrative + directed).
At pre-flight, a 30-second `jq + awk` fingerprint scan returned
**three families with five accreted optional-field variants**. Owner
re-directed Shape B → Shape A′ before any code landed. Generalisation:
any bug-fix or migration plan resting on a premise about _what's in
the data_ must run a fingerprint pass BEFORE shape decision, reviewer
dispatch, or owner direction — not after. Cost is trivial; value is
catching premise errors upstream.

Graduation-target: portable rule
`pre-flight-fingerprint-scan-before-shape-decisions` OR pattern
`fingerprint-the-data-before-shaping-the-fix`. Withdrawal-trigger:
second instance.

### 2026-05-11 — Schema-as-protocol-authority-with-directory-projection

`[captured: 2026-05-11 | source: session:Smouldering-Crackling-Pyre |
target: PDR:schema-as-protocol-authority-with-directory-projection
OR pattern:single-schema-multiple-applications | trigger: second
distinct multi-kind event-stream instance | size: M | status: pending]`

Owner-articulated framing 2026-05-11: _"single source of truth for
the communication protocol, that is not the same as only having a
single application for that protocol"_. Names a clean architectural
shape — ONE canonical schema file holds the protocol contract; multiple
physical projections (directories) hold the applications. Worked
instance: `comms-event.schema.json` with three `$defs`
(narrative / lifecycle / directed) projected to three sibling
directories. Parsers stay single-schema; new kinds add additively.
Withdrawal-trigger: second instance (claim-event vs claim-history,
escalation vs sidebar, etc.).

### 2026-05-11 — R4-new commit-boundary enforcement (pending, was due)

`[captured: 2026-05-11 | source: session:Smouldering-Crackling-Pyre |
target: cost-of-collaboration hard-to-bypass commit-boundary enforcement
(native pre-stage hook wording superseded) | trigger: implementation-tail |
size: M | status: pending]`

Retained 2026-05-12 with corrected target: Git/Husky have no native
pre-stage lifecycle, so "native git pre-commit hook" is not the right
implementation home. Live worked instance 2026-05-11 (Smouldering Crackling
Pyre): peer agent `Dusky Masking Cloak` / `c5ff7f` was committing in parallel
on the graph thread. Their pre-staged handoff files appeared in my index when I
ran explicit-pathspec `git add`. `verify-staged` caught the foreign stage (3
extra files, 0 missing); cure was `git commit -F - -- <pathspec>`. R4-new's
authorship is no longer hypothetical. Graduation-target: the
cost-of-collaboration enforcement tail must make the guard harder to bypass
than ordinary `git add`, then record the decision in the existing PDR/ADR chain
if new doctrine remains. Withdrawal-trigger: the guard or replacement
enforcement passes the adversarial probe.

Older graduated entries (PDR-018, PDR-026, PDR-029, PDR-033, PDR-034,
ADR-153, ADR-164, etc.) are preserved in
[`archive/repo-continuity-session-history-2026-04-29.md`](archive/repo-continuity-session-history-2026-04-29.md)
and earlier archive files for full audit trail.

### 2026-05-11 — Peer-commit absorption (third-direction failure mode)

`[captured-date: 2026-05-11 | source-surface: comms-event
e0a17465-fd5a-4c7d-979d-89696247de0a + napkin entry | graduation-
target: PDR amendment to PDR-054 / PDR-059 OR new PDR for peer-
commit-direction asymmetric-cure failure mode | trigger: third
observed instance of asymmetric-cure failure at the commit boundary,
in a structurally new direction beyond the husky-chain
(PDR-059) and pre-hook foreign-stage (PDR-054) directions | size:
M | status: pending]`

Mistbound Watching Lantern's commit `67885e3f` (2026-05-11) used
non-pathspec staging and swept six of Soaring Darting Kite's
session-lifecycle working-tree files into Mistbound's commit. Same
root cause as PDR-054 / PDR-059 (non-pathspec staging); same cure
(mechanical pathspec enforcement at the commit boundary); different
direction of damage (peer's commit absorbs my files, vs husky-chain
absorbing peer files into my commit, vs my pre-stage absorbing
peer's index). The three-direction symmetry is the new substance.
Graduation-target should name the three directions and a single
unified cure: commit-queue verify-staged enforcement at the husky
boundary, refusing any commit whose staged set extends beyond the
queued bundle regardless of which agent invoked. The Wave 3
commit-queue UX work + R4-new pre-commit hook in
[`2026-05-12-collaboration-protocol-hardening-r1b-opener.md`](../../plans/agentic-engineering-enhancements/current/2026-05-12-collaboration-protocol-hardening-r1b-opener.md)
implements this cure; the graduation closes when both land and the
Wilma four-probe matrix passes.

### 2026-05-11 — Commit-queue UX as a structural cure surface

`[captured-date: 2026-05-11 | source-surface: this session's
friction profile (R1.b atomic commit bypassed queue; verify-staged
exit-code conflation; CLI on separate binary not surfaced in
collaboration-state --help; six-command lifecycle; claim-close-cycle
recursion) | graduation-target: cost-of-collaboration P5/P8/P6 tail,
with a later PDR/ADR amendment only if the implementation leaves new
doctrine uncaptured | trigger: cost-of-collaboration P5/P8/P6 tail
settles the UX/enforcement doctrine | size: L (multi-session arc) |
status: pending]`

The friction profile names five concrete deficiencies (discoverability;
ease-of-use; verify-staged error-message clarity; harder-to-bypass
hook integration; claim-close-cycle recursion). Each is a structural
property the commit-queue could carry; today the discipline is
documented-but-bypassable. Wave 3 of the tail plan owns the
implementation; this graduation entry tracks the doctrine that
emerges from that implementation work. Withdrawal-trigger: Wave 3
landed + retrospective PDR/ADR captures the doctrine.

Retained 2026-05-12: P-Foundation, P1, P2, P3, and P4 landed meaningful
surface area, but the reviewer synthesis in `cost-of-collaboration.plan.md`
keeps the UX/enforcement doctrine open. Session evidence update 2026-05-11:
Embered Burning Magma landed the first Wave 3 implementation slice at
`e298723c` (`commit-queue list` / `show` read inspection plus strict time
validation). The entry stays pending: read inspection closes F-11 but does not
yet settle the doctrine for discoverability, lifecycle ergonomics,
harder-to-bypass enforcement, or claim-close-cycle recursion.

### 2026-05-12 — Agent-tools CLI architectural overhaul (P-Foundation)

`[captured-date: 2026-05-12 | source-surface: napkin Wooded 5c8f3c +
owner direction + plan cost-of-collaboration P-Foundation |
graduation-target: adr:agent-tools-cli-unified-entrypoint + rule:no-new-bins-in-agent-tools |
trigger: P-Foundation implementation lands and doctrine emerges from the
implementation work | status: pending | size: XL]`

The agent-tools "CLI" is currently a collection of bin files with
`pnpm -s build` triggered before every invocation, defeating both
the stability point of using built artefacts (rebuilding on every
call means the bin DOES change between calls from caller's own edits)
and the centralisation point of having a CLI (each topic bin has its
own option parsing, error shape, help text, logging — no shared
plumbing). Landed as P-Foundation workstream in
`cost-of-collaboration.plan.md` between P0 and P1 (commit `6b88a3bf`)
with the standing constraint "No new bins; land new CLI surface in
the unified entrypoint." Graduation target: an ADR capturing the
architectural decision (single bin entrypoint + topic+action
dispatch + build-once semantics) plus a rule enforcing the
no-new-bins constraint going forward. Withdrawal trigger:
P-Foundation lands and the post-implementation retrospective
either confirms the doctrine or names a different lesson learned.

### 2026-05-12 — Exploration candidates E-1 (advisory hooks) + E-2 (agent-tools git passthrough)

`[captured-date: 2026-05-12 | source-surface: owner direction + plan
cost-of-collaboration Exploration candidates section | graduation-target:
plan:cost-of-collaboration P-Foundation follow-on workstream OR new
workstream after scoping | trigger: scoping pass produces decision-
complete acceptance criteria | status: pending | size: M-to-L
combined]`

Two exploration candidates captured 2026-05-12 in the cost-of-
collaboration plan: **E-1** (advisory-only agent hooks that detect
when an agent is about to bypass an agent-tools system and surface a
non-blocking reminder) and **E-2** (`agent-tools git` CLI passthrough
that wraps `git` with checks and balances — commit-queue enforcement
on `git add`, comms-event auto-post on `git commit`, claim-aware
`git push`, proof-of-observed-behaviour gate). Both are not yet
decision-complete and need a scoping pass before promotion to
P-workstreams. E-2 explicitly depends on P-Foundation (the unified
CLI surface is its host). E-1 and E-2 likely compose into a single
workstream — E-2 hosts the checks, E-1 detects when an agent is
about to bypass them. Withdrawal trigger: scoping pass produces
either decision-complete workstreams or names them as not-worth-
doing with rationale.

### 2026-05-11 — Pre-commit hook must gate staged content only (load-bearing)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at the target home named in the entry.

### 2026-05-11 — Peer-pair sidebar > coordinator+helpers for design work

`[captured-date: 2026-05-11 | source-surface: napkin Wooded 5c8f3c +
feedback_peer_sidebar_beats_coordinator_helpers + experience file
2026-05-11-coordinator-deadlock-and-peer-sidebar.md |
graduation-target: partial:directive:agent-collaboration coordinator-role
boundary + pattern:inter-agent-sidebar-with-default-action; residual-target:
pattern:peer-pair-design-collaboration-sidebar OR directive:agent-collaboration
design-sidebar clause | trigger: owner-observed convergent evidence in same
session ("the intense partner sidebar is going a lot better than the coordinator
and helpers topology"); status: partially-graduated | retained-residual:
2026-05-12 (Twigged Growing Glade reviewer correction); size: M]`

Partially graduated 2026-05-12: `agent-collaboration.md` frames the coordinator
role as an opt-in affordance that appears only when super-linear coordination
chains become visible, and `inter-agent-sidebar-with-default-action.md` carries a
claim-conflict sidebar shape. The design-collaboration shape remains without a
durable home: for design and decision work, peer-pair sidebars in a shared append-
only markdown file produce materially better collaboration than
coordinator+helpers hub-and-spoke topology. Helpers are for parallel
execution of decided work; design needs dialogue between comparable
agents. Numbered turns + single shared file + joint-decision closure
section. Cursor Multitask single-message handoff is the helper-pool
delivery shape (see [[cursor-multitask-single-message-handoff]]); the
peer sidebar is the design-collaboration shape. Reopen for graduation when a
sibling pattern or directive clause carries that design-collaboration shape.

### 2026-05-11 — Coordination-artefact isolation from gate-visible state

`[captured-date: 2026-05-11 | source-surface: napkin Wooded 5c8f3c

- experience file 2026-05-11-coordinator-deadlock-and-peer-sidebar.md |
  graduation-target: adr:coordination-artefact-isolation +
  plan:cost-of-collaboration.plan.md P6 | trigger: same-session evidence
  that coordinator role is structurally the largest source of timing-
  coupled gate trips; status: pending | size: L]`

The coordinator role necessarily writes coordination artefacts
(broadcasts, briefs, comms, sidebars, monitor telemetry).
Under repo-wide pre-commit gates these become the role's largest
source of timing-coupled gate trips. Iteration 3 of the 2026-05-11
deadlock was triggered by the coordinator's own sidebar file. Fix
shape: isolate coordination artefacts from gate-visible repo state
(separate branch/worktree, gitignored space, or directory-blind gate
config). ADR captures the architectural choice. Trigger to graduate:
cost-of-collaboration P0 landed (so the immediate cure is in place)
AND a second-instance observation that confirms the isolation shape
under the new gate regime.

### 2026-05-11 — Advisory protocols decay under pressure; enforcement required

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at the target home named in the entry.

### 2026-05-11 — Gatekeeper green-light stale-sweep race

`[captured-date: 2026-05-11 | source-surface: comms-message
29f9761c-7181-47b3-a6e2-6c2b2b60cffa + napkin entry
Galactic-019e18 | graduation-target: PDR amendment to PDR-059 OR
new PDR for commit-window freeze/isolation discipline | trigger:
third serial ambient-gate failure after a coordinator-side clean
gate sweep; status: pending | size: M]`

Gatekeeper specialisation reduced duplicate full-tree gate runs but did not
solve the commit-window race: Wooded ran the repo-wide gate set cleanly, then
the team authored a new sidebar markdown file, and Flamebright's markdown-only
commit failed on that post-sweep file's markdownlint errors. The new doctrine
candidate is not merely "one gatekeeper"; it is "green-light implies a
write-freeze, isolation surface, or controlled post-sweep refresh before the
peer commit retries." This should graduate only after B-02/B-03/T-R4-new or an
equivalent commit-window cure makes the rule mechanically actionable.

### 2026-05-12 — Re-plan after second cycle lands (Clouded Vaulting Squall)

`[CANDIDATE: re-plan-after-cycle-pair-lands | captured: 2026-05-12 |
source: napkin + connecting-oak-resources thread re-plan session |
graduation-target: new PDR for workstream-evolution cadence | trigger:
second instance of holistic re-plan finding 3+ substantive verdicts
after only two cycles landed; status: pending | size: M]`

After WS1.2 of graph-stack Inc.1a landed (the second cycle of the
workstream), owner directed a holistic re-examination of the
remaining 12 cycles. Five substantive verdicts emerged (V1 new
parallel-safe pair; V2 collapse of two cycles sharing file scope; V3
YAGNI deferral of a speculative ergonomic surface; V4 over-constrained
scaffold `depends_on`; V5 sharpened scope to avoid surface duplication).
12 → 10 cycles. The drift was discoverable only by walking the
dependency chain backwards from the workstream's end-goal and asking
of each remaining cycle: "what does the immediate downstream consumer
of this cycle actually need?" — a question the original plan-writing
session could not answer with the same precision because no cycle had
yet pushed back against any definition. Candidate doctrine: after the
second cycle in a workstream lands, before opening the third, run a
backwards-walk re-plan pass.

### 2026-05-12 — Deferral with retrospective-review tripwire (Clouded Vaulting Squall)

`[CANDIDATE: deferral-with-retrospective-review-tripwire | captured:
2026-05-12 | source: connecting-oak-resources thread, V3 owner
direction during graph-stack Inc.1a re-plan | graduation-target: new
rule or new PDR on cross-increment scope deferral | trigger: second
instance of an owner-set retrospective-review tripwire attached to a
defer-to-later-increment decision; status: pending | size: S]`

When V3 deferred WS1.8 GraphDocument from Inc.1 to Inc.2, owner did
not accept silent deferral — they required a verdict-binding
retrospective-review tripwire on Inc.2's row: the Inc.2 plan that
takes ownership of GraphDocument MUST design-review Inc.1 surfaces
(WS1.3 Dataset + DataFactory, WS1.4 jsonld processor, WS1.5 canon,
WS1.6 vocab, WS2 graph-ingest, WS3 graph-project, WS4
graph-corpus-sdk) to identify what could be (a) expressed more
efficiently, (b) collapsed/removed, or (c) reshaped through
GraphDocument. The review's verdict is binding on Inc.2 scope.
Candidate doctrine: every defer-to-a-later-increment decision MUST
record a verdict-binding retrospective-review obligation on the
receiving plan, naming the surfaces to examine and the criteria for
collapse/reshape/keep. Without the tripwire, deferral becomes pure
accumulation — the deferred concept arrives bolted on top of the
inherited shape and the opportunity to reshape is missed.

### 2026-05-19 — Plan-portfolio leaf-to-root reachability invariant (Shaded Passing Candle)

`[CANDIDATE: plan-portfolio-reachability-invariant | captured: 2026-05-19 |
source: napkin 2026-05-19 + .agent/plans/README.md §Reachability Invariant |
graduation-target: ADR amendment (or new ADR) ratifying the leaf-to-root
invariant plus the obligated CI validator | trigger: validator implementation
slice ready, OR second collection-level orphan instance, OR owner-direct
promotion; status: pending | size: S]`

Audit on 2026-05-19 found three collections absent from the root README's
Plan Collections table (`notes/`, `observability/`, `user-experience/`),
five orphan plans below the lifecycle layer, and two collections missing
lifecycle READMEs entirely (`observability/{active,current,future}/`,
`security-and-privacy/future/`). Plus three top-level graph coordination
spines unindexed at the root (remediated in-line). The invariant — every
plan is a leaf node reachable from `.agent/plans/README.md` via
collection-and-lifecycle indexes — is now documented at
`.agent/plans/README.md § Reachability Invariant — Leaf-To-Root`. The
remediation plan
`.agent/plans/agentic-engineering-enhancements/current/plan-index-reachability-remediation.plan.md`
captures the validator obligation as Phase 4. ADR ratification follows
when the validator implementation slice opens.

### 2026-05-19 — Portable-reference-arrives-without-plan-slot pattern (Shaded Passing Candle)

`[CANDIDATE: portable-reference-arrives-without-plan-slot | captured:
2026-05-19 | source: napkin 2026-05-19 | graduation-target: pattern card
in memory/active/patterns/ after second instance | trigger: second
observation of a portable reference doc arriving into .agent/reference/
without an owning plan; status: pending | size: S]`

`.agent/reference/comms-watch-mechanism.md` arrived as a portable substrate
spec with no owning plan, no workstream pointer, and no decision-complete
trigger to integrate. The reasonable response was a three-question
grounding pass (substrate / thread / delta) before drafting integration
scope. Going straight to drafting is guesswork dressed as readiness.
Pattern card material once a second instance is observed.

### 2026-05-20 — Closure-pressure rationalisation failure mode (Stormy Plumbing Atoll)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at the target home named in the entry.

### 2026-05-20 — PDR-044 refusal-vs-approval mechanism choice (Stormy Plumbing Atoll)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at the target home named in the entry.

### 2026-05-20 — Over-correction during reviewer-finding absorption (Shaded Creeping Cloak)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at the target home named in the entry.

### 2026-05-20 — Review-of-completed-work surfaces lessons and fixes, never re-decisions (Shaded Creeping Cloak)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at the target home named in the entry.

### Cross-session observation: absorption-adjacent failure-mode family (Shaded Creeping Cloak / Stormy Plumbing Atoll)

**Graduated — body archived 2026-05-22**. See [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md) for the verbatim entry body. Status: graduated; substance lives at the target home named in the entry.

### 2026-05-22 — Partial / slice-scoped coordinator transfer (Foamy Snorkelling Jetty)

**Graduated 2026-05-22 (Tempestuous Spiralling Thermal)** — body archived to [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md). Substance lives at PDR-064 §"Partial / Slice-Scoped Coordinator Transfer" amendment subsection.

`[captured: 2026-05-22 | graduated: 2026-05-22 (Tempestuous Spiralling Thermal) | source: PDR-064 drafting + worked instance Ferny→Blustery slice-coord assignment + comms event 9670c08f behaviour-note | target-resolved: PDR-064 §"Partial / Slice-Scoped Coordinator Transfer" | trigger-fired: 3rd instance observed in one session | size: S | status: graduated]`

### 2026-05-22 — Coordinator-must-delegate-sub-agent-launches-not-self-dispatch (Foamy Snorkelling Jetty)

**Graduated 2026-05-22 (Tempestuous Spiralling Thermal)** — body archived to [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md). Substance lives at `start-right-team` SKILL §"Choose Temporary Responsibilities" — _"Coordinator delegates sub-agent launches"_ amendment.

`[captured: 2026-05-22 | graduated: 2026-05-22 (Tempestuous Spiralling Thermal) | source: owner correction to Ferny + owner correction to Blustery + Blustery self-flagged graduation candidate | target-resolved: skill-amend:start-right-team §"Choose Temporary Responsibilities" | trigger-fired: 2-instance owner direction in one session | size: S | status: graduated]`

### 2026-05-22 — Practice-Core portability rule applies at PDR drafting, not at review (Foamy Snorkelling Jetty)

`[CANDIDATE: practice-core-portability-at-drafting | captured: 2026-05-22 | source: assumptions-expert verdict on PDR-063..066 (event 6cdd7501) flagged portability hook-blocker on 3 of 4 PDRs | graduation-target: amendment to PDR-drafting checklist surface (start-right-team SKILL §"Decide PDR vs addendum-amendment shape" OR a new dedicated PDR-drafting reference doc) + cross-link from .agent/practice-core/README.md | trigger: 1st explicit instance — fires when a 2nd PDR-drafting session repeats the same defect, OR when owner promotes by direct route | status: pending | size: S]`

Three of four PDRs drafted this session (PDR-063, PDR-065, PDR-066)
embedded repo paths (`.agent/state/collaboration/...`,
`active-claims.schema.json`, the `pnpm agent-tools:collaboration-state`
CLI command) in their §Required and §Decision sections. The standing
rule "Anything under .agent/practice-core/ must have NO repo paths,
ADR refs, or commit refs; only outgoing link allowed is to
.agent/practice-index.md" (durable user-memory entry
`feedback_practice_core_portability_strict`) is unambiguous. The drafting
agent (me) knew the rule but did not apply it during drafting —
treated portability as a review-time concern rather than a
drafting-time invariant. The cure shape: portability check moves into
the PDR drafting checklist _before first edit_, alongside trigger-
evidence and proportionality checks. The empirical observation worth
graduating is the _category-of-rule_ observation: portability is a
structural rule applied at drafting, not a stylistic rule caught at
review. Land as a PDR-drafting reference doc cross-linked from
practice-core/README.md.

### 2026-05-22 — Sonar MCP `show_security_hotspot` audit-trail visibility gap (Ferny Swaying Leaf)

`[CANDIDATE: sonar-mcp-changelog-not-comments | captured: 2026-05-22 | source: Ferny + Midnight independent observations on PR-108 Cycle 2/3 dispositions; both passed comment strings to change_security_hotspot_status, both verified via show_security_hotspot which returned comments: [] | graduation-target: amendment to docs/governance/sonar-disposition-policy.md §Hotspot review (cite REST /api/hotspots/show?hotspot=KEY | jq .changelog as the rationale-verification path, NOT MCP show_security_hotspot.comments) OR new ADR if the Sonar MCP server upstream cannot be relied on to expose changelog | trigger: 1st explicit instance; fires when a 2nd consolidation pass cites the same MCP/REST asymmetry OR when an auditor reviews PR-108 rationale trail and finds the comments-field empty | status: pending | size: S]`

Sonar MCP `change_security_hotspot_status` accepts a `comment`
parameter; mutation succeeds and returns `success: true,
newStatus: REVIEWED, newResolution: SAFE`. Subsequent
`show_security_hotspot` on the same hotspot returns `comments: []`
and does not expose a `changelog` field. The rationale text is
stored Sonar-side (the mutation accepted it) but is invisible
through the MCP read surface. The plan's deterministic-validation
block cites the public REST `/api/hotspots/show` endpoint returning
a `changelog` field — the MCP tool does NOT expose `changelog`,
only the `comments` thread which is a different concept (free-text
comment thread vs status-change-history). An auditor relying on
MCP `show_security_hotspot.comments` would incorrectly conclude no
rationale was filed. Not blocking the QG (the disposition itself
gates `new_security_hotspots_reviewed = 100%`), but worth
amending the policy doc with the REST-verification path. May also
deserve an ADR if cross-cutting (e.g. multiple Sonar MCP read
surfaces are similarly asymmetric vs REST).

### 2026-05-22 — CLI body backtick-shell-substitution cure pattern is a 3+ instance cross-session shape (Ferny Swaying Leaf)

**Graduated 2026-05-22 (Tempestuous Spiralling Thermal)** — body archived to [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md). Substance lives at `agent-tools/README.md` §"CLI Norms" → §"Comms body input: `--body` vs `--body-file`" (already-landed substrate at `675bb83b`).

`[captured: 2026-05-22 | graduated: 2026-05-22 (Tempestuous Spiralling Thermal) | source: 3+ independent cross-session instances | target-resolved: doc-amend:agent-tools/README.md §"Comms body input" + --body-file CLI flag landed at 675bb83b | trigger-fired: 3rd instance + cure mechanism shipped | size: M | status: graduated]`

### 2026-05-22 — Hook-policy substring-matching in instructive content is a recurring blocker (Ferny Swaying Leaf via cross-session pattern scan)

**Graduated 2026-05-22 (Tempestuous Spiralling Thermal)** — body archived to [`archive/pending-graduations-archive-2026-05-22.md`](archive/pending-graduations-archive-2026-05-22.md). Substance lives at the new rule `.agent/rules/hook-policy-substring-discipline.md` (cure b — content-authoring discipline). Cure (a) — context-aware hook parsing — remains a separate upstream concern.

`[captured: 2026-05-22 | graduated: 2026-05-22 (Tempestuous Spiralling Thermal) | source: 3+ cross-session instances across multiple agents | target-resolved: rule:hook-policy-substring-discipline + RULES_INDEX entry + Claude + Cursor adapters | trigger-fired: 3+ instance evidence across sessions | size: M | status: graduated]`

### 2026-05-22 — Canonical tool definitions belong code-adjacent, not in `.agent/reference/` (Shaded Whispering Dusk)

`[CANDIDATE: canonical-tool-definitions-code-adjacent | captured: 2026-05-22 | source: napkin (Shaded Whispering Dusk worked-instance + Blustery Lifting Plume earlier instance same session); coordination-watcher-canonicalisation plan body | graduation-target: multi:plan-execution:coordination-watcher-canonicalisation + doc-amend:.agent/reference/README.md (state folder scope as external materials only) + rule:canonical-tool-definitions-code-adjacent (or absorb into existing portability/practice-core rule) | trigger: second-instance fired 2026-05-22 (Blustery missing-seen-file + Shaded JSON-format-seen-file are same shape — SKILL invocation example as fragile authority); plan-execution-gated for graduation | status: due | size: L]`

The SKILL invocation example for the comms watcher (at
`.agent/skills/start-right-team/SKILL-CANONICAL.md:139` with
`<agent-codename>.json` extension) is the only documentation surface
that carries a complete watch invocation. Today two distinct agents in
the same session hit two facets of the same defect class: Blustery's
missing-seen-file backfill flood (file did not exist when the CLI
expected it) and Shaded's wrong-format-seen-file backfill flood (file
existed but in JSON instead of the plain-text-one-id-per-line shape the
CLI's `cli-runtime.ts:130-142` requires). Both stem from the SKILL
example carrying authority it cannot durably hold — there is no
mechanism that prevents drift between the example, the README at
`agent-tools/README.md:348` (which uses `.txt`), and the CLI source.

The structural cure has three layers, captured in
`.agent/plans/agent-tooling/future/coordination-watcher-canonicalisation.plan.md`:

- (a) move the canonical home out of `.agent/reference/` (which is for
  external materials we consult) to code-adjacent
  (`agent-tools/src/collaboration-state/README.md`);
- (b) introduce an executable `coord how-to-start` CLI that emits the
  canonical invocation parameterised by identity, so the SKILL stops
  carrying an example and points at a command that cannot drift;
- (c) extend watcher scope from comms-only to multi-surface
  (active-claims, conversations, escalations, handoffs) so the
  ad-hoc `/loop` polyfill can shrink to its proper role
  (agent-reasoning ticks, not surface-sweep).

The doctrine substance for graduation is broader than just the
watcher cure: **canonical tool definitions belong code-adjacent,
ideally executable; `.agent/reference/` is for external materials
only**. The graduation lands when the plan executes; the plan body
records the doctrine inline so it persists if the plan archives.

### 2026-05-22 — Pre-execution code-expert review catches design-time bugs static gates cannot (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed promotion)** — substance ratified
into `.agent/rules/pre-execution-code-expert-review-per-loop-cycle.md`
as the implicit justification for the rule's existence (the rule
already exists; this worked-instance reinforces the rule's value via
its source-attribution amendment). The standalone pattern-instance
file under `memory/active/patterns/` is NOT created: the substance is
already enforcement-surface; a pattern instance would be redundant.

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed) | source: napkin | target-resolved: .agent/rules/pre-execution-code-expert-review-per-loop-cycle.md (source-attribution evidence) | trigger-fired: owner-directed promotion | size: S | status: graduated]`

The t12-citation-shape cycle's pre-execution code-expert verdict
surfaced `Citation.source: 'EEF Teaching and Learning Toolkit'`
literal field collision with the canonical `EEF_ATTRIBUTION`
constant at `oak-curriculum-sdk/src/mcp/source-attribution.ts`.
The bug would NOT have surfaced at type-check, lint, or vitest —
the literal string field is structurally well-typed and Zod would
have accepted the EEF_ATTRIBUTION constant's string value at parse
time. Code-expert read across two files (plan + existing attribution
constant) and named the architectural-intent collision. Static gates
catch syntactic problems; pre-execution review catches design-intent
collisions.

Adjacent existing pattern: `pre-implementation-plan-review.md`.
Distinct shape: that pattern covers plan-review (whole plans);
this candidate covers cycle-review (single-cycle scope) with a
specific class of finding (cross-file architectural collisions).

### 2026-05-22 — Workspace bootstrap fragility — implicit build-order graph (Mistbound Slipping Night)

**Retained pending** — owner-directed promotion targeted the
five-coordination-cures + framing-direction discipline. This
candidate is a tooling-config issue requiring an active design
choice between three cure shapes (bootstrap script, dev-condition
exports, onboarding docs); owner-direction not yet given for the
shape. Substance preserved here until that direction lands.

`[CANDIDATE: workspace-bootstrap-build-order-fragility | captured: 2026-05-22 | source: napkin (Mistbound lint failure cascade: eslint-plugin-standards + sdk-codegen subpath exports + result + type-helpers all unbuilt on fresh checkout) | graduation-target: multi:(a) script:pnpm-bootstrap-build-order OR (b) doc-amend:onboarding/CONTRIBUTING.md OR (c) producer-workspace conditional-exports development-condition | trigger: owner-direction (this is a tooling-config issue requiring active design choice) | size: M | status: pending]`

Consumer-workspace lint, type-check, and test commands fail at
config-load time on a fresh checkout because producer workspaces ship
no `dist/` until explicitly built. The implicit build-order graph
(eslint-plugin-standards → curriculum-sdk lint; sdk-codegen → many
consumers; result + type-helpers → many consumers) is invisible to
new agents. Error mode is opaque (`exports main defined` errors at
jiti config-load time, before any file is touched).

Cure-shape options:

- (a) `pnpm bootstrap` script that runs `build:libs` in dependency
  order — discoverable + idempotent + invokable on demand.
- (b) Producer-workspace `package.json` exports add a `development`
  condition resolving to `src/` (the curriculum-sdk shows this
  pattern) — would let consumers resolve without dist/.
- (c) Onboarding documentation prescribing the explicit build
  sequence — least structural cure; depends on agent reading docs
  before running commands.

This is a tooling-config issue, not a product-code bug. Surfaces
poorly because it only bites the cold-start path. Scales poorly
with team size (every new agent hits it).

### 2026-05-22 — Graceful intent abandonment via `intent.notes` as coordination infrastructure (Mistbound Slipping Night)

**Retained pending** — owner-directed promotion targeted the
coordination-cures-and-framing-direction set; this is an adjacent
pattern about the commit-queue substrate specifically and benefits
from a second-instance confirmation before graduating to a pattern
instance.

`[CANDIDATE: intent-notes-as-abandonment-coordination | captured: 2026-05-22 | source: napkin (Stormbound's cf39fd43 abandonment after detecting Mistbound's foreign-staged files) | graduation-target: pattern:intent-notes-for-abandonment-rationale (memory/active/patterns/) — adjacent to peer-commit-absorption-third-direction.md and the commit-queue-intent-scope-discipline plan | trigger: second-instance(of-an-agent-using-intent.notes-to-record-abandonment-rationale-for-peer-readability) | size: S | status: pending]`

Stormbound's intent `cf39fd43` transitioned to `phase: abandoned`
when their `record-staged` step detected Mistbound's staged files
already in the index. The `notes` field carried the substantive
explanation: _"Foreign-staged Mistbound citation-shape files
detected before record-staged; abandoning to avoid sweep of peer
work-in-progress (the very failure mode Cycle 1.1 cures)."_ This
is durable peer-readable coordination — every subsequent committer
reading the queue surface sees the rationale inline.

This is more durable than a comms-event for abandonment-rationale
because it lives in the queue surface that every peer must already
read to commit. Comms-events live in a different surface that peers
may not poll.

### 2026-05-22 — Inter-reviewer conflict resolution: more-restrictive-Practice-rule wins (Mistbound Slipping Night)

**Retained pending** — adjacent to existing
`different-lens-reviewer-divergence.md` pattern; benefits from a
second-instance confirmation that the resolution discipline (not
just the divergence observation) generalises.

`[CANDIDATE: more-restrictive-practice-rule-wins-on-reviewer-conflict | captured: 2026-05-22 | source: napkin (Mistbound t12-citation-shape: type-expert recommended standalone expectTypeOf type-only tests; test-expert invoked test-immediate-fails item 19 against pure type-only tests) | graduation-target: pattern:more-restrictive-practice-rule-wins-on-reviewer-conflict (memory/active/patterns/) — adjacent to different-lens-reviewer-divergence.md (which covers WHY they diverge) | trigger: second-instance(of-two-mandatory-reviewers-conflicting-where-one-cites-a-named-Practice-rule-and-the-other-cites-domain-best-practice) | size: S | status: pending]`

When type-expert (domain-best-practice for tuple invariants) and
test-expert (Practice rule against type-only tests) conflicted on
the t12 cycle's test shape, the resolution was to apply the
more-restrictive Practice rule (test-expert's item-19 immediate-fail
took precedence over type-expert's standalone expectTypeOf
recommendation). The Practice rule has Practice-governance scope;
the domain recommendation has cycle-specific scope. When they
conflict, the broader scope wins.

Adjacent existing pattern: `different-lens-reviewer-divergence.md`
covers HOW different lenses diverge (architecture vs assumptions
vs type vs test). This candidate covers the RESOLUTION discipline
WHEN they do — the more-restrictive Practice-level rule wins.

### 2026-05-22 — Framing-direction (session-forward vs impact-backward) determines graduation destination (Mistbound Slipping Night, metacognition pass)

**Graduated 2026-05-22 (owner-directed promotion)** — substance landed
at PDR-014 §"Amendment Log: 2026-05-22 — Framing-direction discipline
at the capture edge". The amendment names the two framing directions,
their natural homes, and the three moments where the discipline
applies (session-handoff step 6a, consolidate-docs step 7a/7b,
owner-direction reframing).

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed) | source: napkin | target-resolved: PDR-014 amendment 2026-05-22 (framing-direction discipline at the capture edge) | trigger-fired: owner-directed promotion | size: M | status: graduated]`

When surfacing insights for graduation, the question is "what
coordination surface does this cure?" not "where did this
observation come from?" Session-forward framing's natural home is
the experience file (subjective texture). Impact-backward framing's
natural home is the rule / PDR / schema surface (durable substrate).
Same substance, different destination, based purely on framing.

Worked instance this session: I surfaced five insights at session-end
framed forward-from-session. Owner reframed them as topology-
independent coordination cures. The reframing made them eligible for
graduation as structural cure candidates (rules / PDR amendments /
schema additions) rather than session-anecdotes confined to napkin.

The cure shape: amend PDR-014 (capture → distil → graduate → enforce
pipeline) to name the framing-direction discipline at the capture
edge. Or, if PDR-014 is too high-level for this, a new PDR naming
the framing-direction rule for graduation candidates. The
substance: impact-backward framing is the more durable framing
because it travels across the session boundary that produced the
observation; session-forward framing is correct for experience-file
texture but produces graduation-resistant substance for rules.

### 2026-05-22 — Continuity-surface drift is structurally orphaned from cycle commits (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed promotion)** — substance landed
at `.agent/rules/continuity-surface-commits-as-orphans.md` (canonical
rule + .claude + .cursor forwarders + RULES_INDEX entry).

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed) | source: napkin | target-resolved: rule:continuity-surface-commits-as-orphans | trigger-fired: owner-directed promotion | size: M | status: graduated]`

Continuity-surface edits (napkin, thread records, repo-continuity,
pending-graduations, experience files) are structurally produced
AFTER the cycle's product code. They cannot ride with the cycle
commit because they don't exist when the cycle commits. They sit
in the working tree unowned, waiting for someone to sweep them.

This is structural orphaning, not procedural drift. Continuity
commits ratify an OBSERVATION about the session; cycle commits
ratify a TESTED CHANGE. Different acceptance criteria; bundling
obscures both.

The cure shape: a rule naming that continuity-surface edits land
as their own session-end commit (`chore(continuity): land
<YYYY-MM-DD> <agent> session reflection`) — committed by the
closing agent at session-end OR explicitly handed off to a follow-on
agent. Topology-independent — applies to solo (the agent who
closes commits), hub-and-spoke (the coordinator at session-end),
peer-primary (each agent at their close), cursor-multitask (the
main brief at close).

Adjacent: the current `session-handoff` SKILL step 11 (`pnpm check`
cleanliness gate) and the check-singleton-per-window candidate.
Continuity-orphan-commit pattern would land as a new step OR as
amendment to existing step 8 (close collaboration lifecycle).

### 2026-05-22 — Reviewer dispatch has two shapes: fan-from-brief vs fan-from-verdict (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed promotion)** — substance landed
as amendment to `.agent/rules/pre-execution-code-expert-review-per-loop-cycle.md`
§"Two dispatch shapes — fan-from-brief vs fan-from-verdict", with
named decision rule (plan-named reviewer set → fan-from-brief;
contingent → fan-from-verdict).

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed) | source: napkin | target-resolved: rule-amendment:pre-execution-code-expert-review-per-loop-cycle §"Two dispatch shapes" | trigger-fired: owner-directed promotion | size: S | status: graduated]`

The current pre-execution review rule prescribes fan-from-verdict:
brief code-expert, absorb verdict, dispatch any specialists they
name. This is correct for unknown scopes where the reviewer set
must be discovered.

For named-set cycles (plan-named per-cycle reviewer set), code-
expert is rubber-stamping the named set rather than discovering it.
The serialised hop adds wall-clock without adding signal.

The cure shape: amend the pre-execution review rule to distinguish:

- **Fan-from-brief**: named-set cycles. All plan-named reviewers
  dispatched in parallel from cycle-open. Code-expert runs alongside
  as architectural reviewer, not as router.
- **Fan-from-verdict**: unknown-scope cycles. Code-expert briefed
  first; specialists named in their verdict; specialists dispatched
  after verdict absorbed.

Decision rule: check the plan's per-cycle reviewer set. If
named, fan-from-brief. If contingent/unknown, fan-from-verdict.

Topology-independent. Saves ~one wall-clock hop per named-set
cycle; compounds over sessions.

### 2026-05-22 — Handoff messages must be self-contained (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed promotion)** — substance landed
at `.agent/rules/handoff-messages-self-contained.md` (canonical rule

- .claude + .cursor forwarders + RULES_INDEX entry). The rule names
  the forbidden patterns, the receiver-cannot-read-transcript principle,
  and the compaction-boundary self-handoff case explicitly.

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed) | source: napkin | target-resolved: rule:handoff-messages-self-contained | trigger-fired: owner-directed promotion | size: M | status: graduated]`

Receiving agents (peer agents, future self after compaction,
cross-platform agents) cannot read the sending agent's transcript.
The handoff message IS the entire information transfer. Without
an explicit rule, the discipline is implicit and inconsistent
across agents.

The cure shape: a rule "handoff-messages-self-contained" enforcing:

- Every fact the receiver needs to act NAMED in the message.
- Every decision NAMED with WHO + WHEN.
- Every artefact named by FILE PATH (not "the earlier discussion").
- Receiver should be able to act WITHOUT a clarifying question back.

Topology-independent. Particularly acute for:

- Cross-platform handoffs (Claude → Codex, etc.).
- Compaction-boundary self-handoffs (my future self cannot read
  current transcript reliably).
- Cross-session peer handoffs (the queue-pickup case).

Adjacent: `start-right-team` SKILL §Continuation Pointer Contract
covers the continuation-record-as-pointer case; the cure here is
broader (every handoff message, not just start-right-team
continuations) and could either amend that section or land as a
distinct rule.

Distinct from "comms event stream canonical truth" (about the
channel) — this is about the substance carried.

### 2026-05-22 — Queue-wait dependency state should be observable (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed promotion, broadened scope)** —
substance landed at `.agent/rules/agent-state-observable.md` (canonical
rule + .claude + .cursor forwarders + RULES_INDEX entry). The rule
broadens the queue-wait-specific case to the general principle "agent
state that affects another agent's next action must be observable",
with queue-wait, long-running sub-agent dispatch, blocked-on-owner,
and gate-runner-role as named applications.

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed, broadened) | source: napkin | target-resolved: rule:agent-state-observable (broader principle; queue-wait is one named application) | trigger-fired: owner-directed promotion | size: S → M (broadened) | status: graduated]`

When agent A is blocked behind agent B's commit-queue intent,
A's wait state lives only in A's session reasoning. No external
observable. If A crashes (compaction, network), the wait state
vanishes — B doesn't know A was waiting. If a third agent
arrives, they cannot see A is queued.

The cure shape: when an agent enters "waiting on intent X"
state, emit a directed comms-event to the upstream agent +
audience addition for awareness:

- kind: `directed` (current schema supports it)
- subject: "Waiting on intent X"
- body: my intent ID, my files, expected wait condition
- (eventually) tags: `['queue-wait']` once ADR-183 substrate lands

Makes the dependency graph observable to peers and owner.

Topology-independent. The intent-scope-discipline plan reduces
queue waits structurally; until that lands, the waits exist and
should be visible.

### 2026-05-22 — Owner attention is gated at action-moments (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed experiment)** — substance landed
at `.agent/rules/owner-attention-at-action-moments.md` (canonical rule

- .claude + .cursor forwarders + RULES*INDEX entry) under provisional
  status. Owner direction at promotion:*"if the framing is useful let's
  try it, if it doesn't work we can always change it"\_. Rule is in
  force; friction observed in practice routes back through the
  graduation pipeline for amendment or retirement.

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed experiment) | source: napkin §"Insight (9th)" surfaced as question; owner answered to try the framing | target-resolved: rule:owner-attention-at-action-moments (provisional status) | trigger-fired: owner-directed experimental promotion | size: M | status: graduated]`

### 2026-05-22 — Post-compaction resumption needs explicit "did prior edits land?" validation (Mistbound Slipping Night)

**Graduated 2026-05-22 (owner-directed promotion)** — substance landed
at PDR-063 §"Receiving agent's pickup contract" amendment + new
§"Discontinuity-boundary validation step". The amendment names four
validation checks (prior-edit landing, claim-closure, queue-state,
sub-agent transcript recovery) and makes them mandatory before the
receiver's acknowledgement event. Topology-independence named:
applies to solo session resumption, mid-cycle peer pickup,
compaction-boundary self-resumption, and post-crash recovery.

`[captured: 2026-05-22 | graduated: 2026-05-22 (owner-directed) | source: napkin | target-resolved: PDR-063 amendment 2026-05-22 (discontinuity-boundary validation step) | trigger-fired: owner-directed promotion | size: M | status: graduated]`

Compaction-boundary (and any session-reentry — solo resumption,
mid-cycle pickup, cross-session handoff) is a discontinuity. Prior-
session reasoning is summarised; volatile facts (working-tree state,
recent peer activity) are stale.

My napkin handoff had 7 resumption first-moves. None was "verify
my prior session's edits actually landed somewhere." I assumed
loss; only by grepping file content did I discover prior edits had
been swept into a peer commit. Avoidable redo of work.

The cure shape: extend PDR-063's mid-cycle pickup contract (step 5
in the canonical SKILL "First Moves" section) with a pre-action
validation step:

- If you had staged content at boundary: `git log --since "<boundary>" -- <files>` to check for commits during pause.
- If you had open claims at boundary: check closed-claims archive for closures during pause.
- If you had queued intents at boundary: check queue status for phase transitions during pause.
- If you had pending sub-agent dispatches: check transcript recovery path (per `feedback_subagent_transcript_recovery`).

Topology-independent. Applies to solo resumption (your future self
cannot trust their assumed prior state), mid-cycle peer pickup
(the receiver inherits a stale working tree picture), and
compaction-boundary self-resumption (you are the receiver).
