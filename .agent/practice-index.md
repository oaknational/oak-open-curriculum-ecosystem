# Practice Index

This file bridges the portable Practice Core files and this repo's local
artefacts. It is **not** part of the travelling Practice Core package — it is
created during hydration and stays in the repo. The baseline content model is
specified by `practice-core/practice-bootstrap.md`, but local sections can be
split more explicitly when that improves discoverability.

In this repo, the Practice is the reusable plain-text framework, philosophy,
and commitment that lets agents from major vendors collaborate on Oak's open
curriculum infrastructure, learn from each session, and keep institutional and
operational knowledge in the repository where future agents and humans can use
it. Its specification layer is a portability tool: Practice Core carries
implementation-agnostic concepts, while this bridge points to the repo-local
bindings and instances.

For the Practice Core files and their roles, see [practice-core/index.md](practice-core/index.md).

## Directives

| Directive                                                         | Purpose                                                   |
| ----------------------------------------------------------------- | --------------------------------------------------------- |
| [AGENT.md](directives/AGENT.md)                                   | Operational entry point for agents                        |
| [principles.md](directives/principles.md)                         | Authoritative rules — must be followed at all times       |
| [user-collaboration.md](directives/user-collaboration.md)         | Agent-to-owner working model                              |
| [agent-collaboration.md](directives/agent-collaboration.md)       | Agent-to-agent working model                              |
| [testing-strategy.md](directives/testing-strategy.md)             | TDD at all levels                                         |
| [schema-first-execution.md](directives/schema-first-execution.md) | Types flow from the OpenAPI schema                        |
| [metacognition.md](directives/metacognition.md)                   | Reflective thinking before planning                       |
| [orientation.md](directives/orientation.md)                       | Layering contract: directives / memory / reference / practice-core; authority order |
| [definition-of-delivery.md](directives/definition-of-delivery.md) | What counts as delivered — value received by a named beneficiary; LANDED vs RELEASED |

(The reviewer invocation matrix previously listed here has moved to
[`memory/executive/invoke-code-experts.md`](memory/executive/invoke-code-experts.md)
as executive memory — it is operational reference, not doctrine.)

### Architecture Guidance (docs/agent-guidance/)

| Document                                                                                  | Purpose                                              |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| [semantic-search-architecture.md](../docs/agent-guidance/semantic-search-architecture.md) | Structure is the foundation, transcripts are a bonus |

### Rules and Hooks Surface

The governance layer is larger than a single file:

- The canonical rules live in [`.agent/rules/`](rules/) (the
  authoritative count is `RULES_INDEX.md`; this file does not
  duplicate it to avoid drift)
- Thin platform adapters live in [`.cursor/rules/`](../.cursor/rules/) and
  [`.claude/rules/`](../.claude/rules/) plus portable wrappers in
  [`.agents/rules/`](../.agents/rules/)
- The canonical hook policy lives in [`.agent/hooks/policy.json`](hooks/policy.json)
- The narrative hook explainer lives in [`.agent/hooks/README.md`](hooks/README.md)
- The live platform-support map lives in
  [`.agent/memory/executive/cross-platform-agent-surface-matrix.md`](memory/executive/cross-platform-agent-surface-matrix.md)

Representative rules:

| Rule                                                       | Purpose                                               |
| ---------------------------------------------------------- | ----------------------------------------------------- |
| [follow-the-practice.md](rules/follow-the-practice.md)     | Keep work aligned with the full Practice system       |
| [follow-collaboration-practice.md](rules/follow-collaboration-practice.md) | Follow the agent-human working model |
| [follow-agent-collaboration-practice.md](rules/follow-agent-collaboration-practice.md) | Follow the agent-to-agent working model |
| [use-agent-comms-log.md](rules/use-agent-comms-log.md) | Announce non-trivial intent in the shared communication log |
| [capture-practice-tool-feedback.md](rules/capture-practice-tool-feedback.md) | Capture Practice and host-local tooling feedback in the napkin |
| [register-active-areas-at-session-open.md](rules/register-active-areas-at-session-open.md) | Register active work areas before edits and commit-window claims before staging/commit |
| [respect-active-agent-claims.md](rules/respect-active-agent-claims.md) | Consult, decide, and log before overlapping another active claim or commit window |
| [validate-full-target-estate.md](rules/validate-full-target-estate.md) | Validate ignored or excluded estates completely |
| [read-diagnostic-artefacts-in-full.md](rules/read-diagnostic-artefacts-in-full.md) | Read complete diagnostic output before hypothesising |
| [consolidate-at-third-consumer.md](rules/consolidate-at-third-consumer.md) | Canonicalise duplicated shapes at the third consumer |
| [tdd-for-refactoring.md](rules/tdd-for-refactoring.md)     | Enforce RED → GREEN → REFACTOR during refactoring     |
| [no-type-shortcuts.md](rules/no-type-shortcuts.md)         | Prevent type-erasing shortcuts and assertion drift    |
| [invoke-code-experts.md](rules/invoke-code-experts.md) | Require the reviewer matrix after non-trivial changes |

### Collaboration State Surface

Collaboration state lives under
[`state/collaboration/`](state/collaboration/). It is this repo's local
operational instance of Practice-owned coordination concepts: shared log
entries, active claims, the root `commit_queue`, closed claim history,
decision threads, sidebars, joint decisions, and escalations. The
at-a-glance channel register lives in
[`memory/executive/agent-collaboration-channels.md`](memory/executive/agent-collaboration-channels.md).
`start-right` reads collaboration state before edits, the commit skill
opens/closes `git:index/head` claims before staging or committing,
`session-handoff` closes the agent's own active state, and
`consolidate-docs` audits stale or unresolved entries.

Operational questions that are non-urgent, not cheaply answerable, and not
already owned by a plan, ADR, or PDR route to
[`memory/operational/open-questions.md`](memory/operational/open-questions.md).
That register is sibling to pending-graduations: pending-graduations captures
candidate doctrine or patterns, while open-questions captures unresolved
decision-shapes for consolidation-time drain or owner surfacing.

PDR-049 keeps the portable merge semantics in Practice Core. This host's
concrete active-claims registry is
[`state/collaboration/active-claims.json`](state/collaboration/active-claims.json).
If per-file `merge_class` metadata stops being sufficient, the host-local
merge policy surface belongs under operational memory and must be linked from
this bridge index and the substrate contract, not from Practice Core.

Hook support:

| Surface                       | Location                                                                                                      | Current status                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Canonical hook policy         | [`.agent/hooks/policy.json`](hooks/policy.json)                                                               | Source of truth                                                                                                         |
| Hook explainer                | [`.agent/hooks/README.md`](hooks/README.md)                                                                   | Human-readable scope and porting notes                                                                                  |
| Native Claude activation      | [`.claude/settings.json`](../.claude/settings.json)                                                           | Tracked Claude Code project settings; wires `PreToolUse` on fresh checkout, with additive local overrides in `.claude/settings.local.json` |
| Cross-platform support matrix | [`.agent/memory/executive/cross-platform-agent-surface-matrix.md`](memory/executive/cross-platform-agent-surface-matrix.md) | Records supported vs unsupported surfaces                                                                               |

## Architectural Decisions

ADRs referenced by the Practice Core files. The full index is at `docs/architecture/architectural-decisions/`.

| ADR                                                                                                              | Subject                                                                            |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [ADR-114](../docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md) | Layered sub-agent prompt composition architecture                                  |
| [ADR-117](../docs/architecture/architectural-decisions/117-plan-templates-and-components.md)                     | Plan templates and components                                                      |
| [ADR-119](../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)                      | Agentic engineering practice — naming and conceptual boundary                      |
| [ADR-124](../docs/architecture/architectural-decisions/124-practice-propagation-model.md)                        | Practice propagation — Core package contract, self-containment, practice-index bridge (contract expanded to files + required directories by PDR-007) |
| [ADR-125](../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)                        | Agent artefact portability — three-layer model for skills, commands, and rules     |
| [ADR-127](../docs/architecture/architectural-decisions/127-documentation-as-foundational-infrastructure.md)      | Documentation as foundational infrastructure                                       |
| [ADR-131](../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md)                 | Self-reinforcing improvement loop — host-side architecture for the Practice's improvement-loop concept; portable form is in PDR-028 + PDR-038 + PDR-039 |
| [ADR-144](../docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md)                       | Three-zone fitness model — host-side concrete instantiation of the structural-health diagnostic concept used across the Practice Core |
| [ADR-150](../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md) | Continuity surfaces, session handoff, and surprise pipeline — host-side companion to portable PDR-011 |
| [ADR-152](../docs/architecture/architectural-decisions/152-provenance-uuid-migration.md)                        | Provenance UUID migration — `index` → `id` in travelling provenance chains        |
| [ADR-159](../docs/architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md)                | Per-workspace vendor CLI ownership — instance of PDR-019 ADR-by-reusability       |
| [ADR-162](../docs/architecture/architectural-decisions/162-observability-first.md)                               | Product-observability five-axis model (Observability First) — host-side closure-property bridge between substrate-vs-axis convention (PDR-037) and quality-gate-dismissal application boundary (PDR-025) |
| [ADR-165](../docs/architecture/architectural-decisions/165-agent-work-practice-phenotype-boundary.md)             | Agent-work Practice phenotype boundary for this repo's local implementation surfaces |
| [ADR-169](../docs/architecture/architectural-decisions/169-pin-github-actions-to-maintainer-latest-sha.md)       | Pin GitHub Actions to maintainer-Latest SHA — host-side adoption of portable PDR-040 |
| [ADR-172](../docs/architecture/architectural-decisions/172-rush-impulse-three-structural-cues-adoption.md)       | Rush-impulse three structural cues — host-side adoption of portable PDR-043 |

### Practice-Core concept ↔ ADR map

Practice-Core PDRs name portable concepts; this repo's ADRs record the
host-side adoption. The map below lets a Core reader find the local
adoption from the Core concept name.

| Core concept (portable) | Host adoption (this repo) |
| --- | --- |
| Three-zone fitness model (per `practice.md` §Fitness Functions, `practice-bootstrap.md` §Consolidation Workflow step 6, `practice-lineage.md` §Thresholds (Three-Zone Model), PDR-014, PDR-042) | [ADR-144](../docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md) |
| Continuity surfaces and surprise pipeline (PDR-011) | [ADR-150](../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md) |
| Self-reinforcing improvement loop (PDR-028, PDR-038, PDR-039) | [ADR-131](../docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md) |
| Practice propagation model (PDR-007 supersedes; PDR-024 vital-surfaces) | [ADR-124](../docs/architecture/architectural-decisions/124-practice-propagation-model.md) |
| Agentic engineering practice (PDR-001 origin) | [ADR-119](../docs/architecture/architectural-decisions/119-agentic-engineering-practice.md) |
| Documentation as foundational infrastructure | [ADR-127](../docs/architecture/architectural-decisions/127-documentation-as-foundational-infrastructure.md) |
| ADR-by-reusability (PDR-019) | [ADR-159](../docs/architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md) (proven instance) |
| Substrate-vs-axis-plan categorisation (PDR-037) and quality-gate dismissal application boundary (PDR-025) | [ADR-162](../docs/architecture/architectural-decisions/162-observability-first.md) (closure-property bridge / application-boundary anchor) |
| Pin to maintainer-Latest, not highest tag (PDR-040) | [ADR-169](../docs/architecture/architectural-decisions/169-pin-github-actions-to-maintainer-latest-sha.md) |
| Rush-impulse three structural cues (PDR-043) | [ADR-172](../docs/architecture/architectural-decisions/172-rush-impulse-three-structural-cues-adoption.md) (three-cues paragraph in `principles.md` § Architectural Excellence Over Expediency) |
| Agent-work Practice phenotype boundary (PDR-035 + Practice/repo split) | [ADR-165](../docs/architecture/architectural-decisions/165-agent-work-practice-phenotype-boundary.md) |
| Practice-Core portability is by construction | [`decision-records/README.md` § Portability Constraint](practice-core/decision-records/README.md#portability-constraint) is the Core rule; [`practice-core-portability-strict-enforcement.plan.md`](plans/agentic-engineering-enhancements/current/practice-core-portability-strict-enforcement.plan.md) owns the host enforcement follow-on |
| State and memory substrate contracts (PDR-050) | PDR-050 carries the transferable specification; [`memory-state-substrate-contracts.md`](memory/executive/memory-state-substrate-contracts.md) is the human-facing host-local instance; [`memory-state-substrate-contracts.manifest.json`](memory/executive/memory-state-substrate-contracts.manifest.json) and [`memory-state-substrate-contracts.schema.json`](memory/executive/memory-state-substrate-contracts.schema.json) are the strict local data contract; [`memory-state-substrate-portable-contracts.plan.md`](plans/agentic-engineering-enhancements/current/memory-state-substrate-portable-contracts.plan.md) adopts the portable contract locally; [`memory-state-contract-doctor.plan.md`](plans/agent-tooling/archive/completed/memory-state-contract-doctor.plan.md) owns deterministic host enforcement |

### Decision Record ↔ Substrate ADR Bridge

PDRs name portable principles (genotype); substrate-implementation
ADRs name the concrete repository realisation (phenotype). Each PDR
below cross-references `practice-index.md` for its phenotype; this
table closes that loop. A phenotype may be a SKILL amendment rather
than an ADR, or may be explicitly deferred to first-instance
evidence.

| PDR (portable principle) | Phenotype (host substrate) |
| --- | --- |
| [PDR-063](practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md) — mid-cycle retirement protocol for token-bounded agents | [ADR-182](../docs/architecture/architectural-decisions/182-mid-cycle-handoff-record-substrate.md) — mid-cycle handoff record substrate (handoffs directory, handoff-record JSON schema, active-claim pointer field, comms-event discriminator value, landing-tranche plan) |
| [PDR-064](practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md) — coordinator handoff: pre-positioning vs active-acknowledgement | No phenotype ADR. Substrate is an amendment to the [`start-right-team`](skills/start-right-team/SKILL-CANONICAL.md) SKILL §Closeout / handoff sections; the two-moments boundary lives in the SKILL surface, not in a separate substrate file |
| [PDR-065](practice-core/decision-records/PDR-065-grounding-cost-amortisation-under-rotation.md) — grounding-cost amortisation under rotating-cast operation (Mode A / Mode B) | Phenotype **explicitly deferred** to first-instance evidence. Both load-bearing mechanisms — see PDR-065 §"Doctrine-change visibility under Mode B (deferred mechanism)" and §"Eligibility-signal carriage (deferred)" — are pending the first observed rotating-cast Round 1 instance. A substrate ADR will be authored only when the deferred mechanisms graduate |
| [PDR-066](practice-core/decision-records/PDR-066-comms-events-as-failure-mode-channel.md) — comms-events as real-time failure-mode capture channel | [ADR-183](../docs/architecture/architectural-decisions/183-comms-event-tag-namespace-substrate.md) — comms-event tag namespace substrate (schema `tags` field on `narrative` / `lifecycle` / `directed` event definitions, tag namespace governance, CLI rendering convention, landing tranche) |
| [PDR-077](practice-core/decision-records/PDR-077-marshal-as-cycle-discipline.md) — Commit Marshal as a distinct cycle-discipline role separable from Director and implementer | No standalone phenotype ADR. The substrate is the role itself, composed with the [`start-right-team`](skills/start-right-team/SKILL-CANONICAL.md) SKILL (responsibility labels in §3 already include `marshal`; the SKILL §Closeout discipline carries the marshal-cycle contiguous-execution exemption) and with [ADR-185](../docs/architecture/architectural-decisions/185-comms-event-auto-acceptance-metadata.md) (comms-event auto-acceptance metadata composes with the marshal-as-role observation: throughput improves on multiple axes at once, of which marshal-as-role is one) |
| [PDR-078](practice-core/decision-records/PDR-078-liveness-heartbeat-contract.md) — liveness-heartbeat contract (portable cadence + threshold + redundancy + exemption shape; Accepted) | [ADR-186](../docs/architecture/architectural-decisions/186-comms-event-heartbeat-lifecycle-substrate.md) — comms-event heartbeat lifecycle substrate (`lifecycle` event kind with `event_type='heartbeat'`, tolerate-unknown-event-type render rule, `[HEARTBEAT]` watcher token composed with the existing ADR-183 tag namespace, at-most-once render guarantee, consumer dual-filter contract during migration; Accepted 2026-05-24). PDR-078 ratified Candidate→Accepted at Cycle 8 of [`post-m1-attestation-tidy-up.plan.md`](plans/agentic-engineering-enhancements/current/post-m1-attestation-tidy-up.plan.md) concurrent with the thin `start-right-team` SKILL §0.5 pointer landing |
| [PDR-079](practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md) — the PDR-vs-ADR portability distinction (PDRs are portable content; ADRs are repo-bound; embed-instinct for commit/event identifiers is a misclassification signal) | No standalone phenotype ADR. Substrate is the [`no-moving-targets-in-permanent-docs`](rules/no-moving-targets-in-permanent-docs.md) rule (scope-updated per PDR-079 §Cascade to apply strictly to portable surfaces — PDR files, rule files, pattern files — and explicitly NOT to ADR files) plus the corresponding hook-policy scope-update at [`.agent/hooks/policy.json`](hooks/policy.json) |
| [PDR-083](practice-core/decision-records/PDR-083-director-pure-direction-only-boundary.md) — Director pure-direction-only boundary | No standalone phenotype ADR. Substrate composes with the Director protocol surfaces named by PDR-074 and PDR-075; host adoption is by team-start role practice and future SKILL/rule amendments when a concrete enforcement surface is routed |
| [PDR-084](practice-core/decision-records/PDR-084-owner-action-is-not-a-cure.md) — owner action is evidence to classify, not a cure to copy | No standalone phenotype ADR. Substrate is the consolidation and Director-substrate-writing habit of classifying owner interventions into owner-only decisions versus missing autonomy primitives, then routing the latter to their permanent home |
| [PDR-087](practice-core/decision-records/PDR-087-tdd-as-design.md) — TDD as design: a test describes a system state and product code is the path; the atomic-landing invariant; the describe-vs-audit blade | No standalone phenotype ADR. Substrate is the host [`tdd-as-design.md`](directives/tdd-as-design.md) directive (the foundational definition "TDD" expands to), the test-discipline rule surfaces ([`no-skipped-tests.md`](rules/no-skipped-tests.md), [`no-conditional-tests.md`](rules/no-conditional-tests.md), [`no-global-state-in-tests.md`](rules/no-global-state-in-tests.md)), and the [`test-expert`](sub-agents/templates/test-expert.md) reviewer template carrying the describe-vs-audit blade on every invocation |
| [PDR-088](practice-core/decision-records/PDR-088-reviewers-carry-doctrine.md) — reviewers carry the doctrine they enforce, not just audit against it (forcing-function read-path as the mechanism; cite-by-section as the closing variant) | No standalone phenotype ADR. Substrate is the host reviewer-role definitions whose mandatory read-paths instantiate the pattern — [`test-expert`](sub-agents/templates/test-expert.md) (read-path plus cite-by-section), [`type-expert`](sub-agents/templates/type-expert.md) and [`architecture-expert`](sub-agents/templates/architecture-expert.md) (the read-path floor) |
| [PDR-089](practice-core/decision-records/PDR-089-conservation-reflex-external-check.md) — conservation reflex / frame-capture recurs at every stage; external intent checks are the cure | No standalone phenotype ADR. Substrate is the remediation and review workflow habit of routing frame-sensitive work through owner correction, independent adversarial review, or an intent-versus-letter audit, then sweeping every reference when a correction changes the shape |

### Rules cited by Practice Core

Practice-Core PDRs cite host-local rule files as proven enforcement
surfaces of portable doctrine. The canonical rule files live at
[`.agent/rules/`](rules/) and adapters at `.cursor/rules/`,
`.claude/rules/`, and `.agents/rules/`.

| Rule (canonical) | Cited by Core | Concept enforced |
| --- | --- | --- |
| [`documentation-hygiene.md`](rules/documentation-hygiene.md) | PDR-014 §Composition discipline (`principle + rule` row) | "Misleading docs are blocking" — stale prescriptive text is how inherited framing propagates |
| [`plan-body-first-principles-check.md`](rules/plan-body-first-principles-check.md) | PDR-014 §Composition discipline + §Amendment Log | Plan-body Class A.1 tripwire (firing the first-principles check on plan promotion) |
| [`executive-memory-drift-capture.md`](rules/executive-memory-drift-capture.md) | PDR-028 (operationalising rule) | The `active → executive` memory feedback path |
| [`never-disable-checks.md`](rules/never-disable-checks.md) | PDR-038 (worked instance — gate-off-fix-gate-on) | Quality-gate dismissal discipline |
| [`no-machine-local-paths.md`](rules/no-machine-local-paths.md) | PDR-038 (worked instance — months-stable principle that caught its own author) | Machine-local paths are never durable; principle requires a structural enforcement surface |
| [`subagent-practice-core-protection.md`](rules/subagent-practice-core-protection.md) | PDR-003 (host adoption) | Sub-agent permission rule operationalising the foundational-doc protection doctrine |

### Skills cited by Practice Core

Practice-Core PDRs cite host-local skills as the workflow
implementations of portable doctrine. Canonical files live under
[`.agent/skills/`](skills/); adapters are generated at
`.agents/skills/jc-*/SKILL.md` and `.claude/skills/jc-*/SKILL.md`.

| Workflow (canonical) | Cited by Core | Concept implemented |
| --- | --- | --- |
| [`session-handoff`](skills/session-handoff/SKILL-CANONICAL.md) | PDR-026 §Deferral-honesty discipline (close ritual) | Per-session landing-evidence ritual |
| [`consolidate-docs`](skills/consolidate-docs/SKILL-CANONICAL.md) | PDR-026 §Deferral-honesty discipline + PDR-042 §Decision (the Learning-Preservation doctrine the gate enforces) | Cross-session consolidation workflow that surfaces deferrals and graduates substance |
| [`consolidate-docs § Learning Preservation Overrides Fitness Pressure`](skills/consolidate-docs/SKILL-CANONICAL.md#learning-preservation-overrides-fitness-pressure) | PDR-042 (the doctrine the signal-distinguishing pre-action gate enforces) | Compression of substance to fit fitness limits is forbidden |
| [`start-right-quick`](skills/start-right-quick/shared/start-right.md) | PDR-026 §Notes (target-at-open ritual) | Session-entry workflow carrying landing-target ritual |
| [`session-handoff`](skills/session-handoff/SKILL-CANONICAL.md) | PDR-026 §Notes (landed-at-close ritual) | Session-close workflow carrying landing-evidence ritual |

### Plans cited by Practice Core

Practice-Core PDRs reference host-local plan files as the in-flight
work where portable doctrine is being exercised. Plans live under
[`.agent/plans/`](plans/).

| Plan | Cited by Core | Subject |
| --- | --- | --- |
| [`memory-feedback-and-emergent-learning-mechanisms.execution.plan.md`](plans/agentic-engineering-enhancements/current/memory-feedback-and-emergent-learning-mechanisms.execution.plan.md) | PDR-028 (host adoption) (executive-memory feedback loop installation) | Where the executive-memory drift-detection installation lands |
| [`staged-doctrine-consolidation-and-graduation.plan.md`](plans/agentic-engineering-enhancements/archive/completed/staged-doctrine-consolidation-and-graduation.plan.md) | PDR-027 (host adoption) (identity-rule install schedule) | Eight-session arc that landed the thread / identity / claim doctrine; archived 2026-04-22 |
| [`build-pipeline-composition-safeguards.plan.md`](plans/architecture-and-infrastructure/future/build-pipeline-composition-safeguards.plan.md) | PDR-040 §Evidence + PDR-041 §Evidence | Future plan covering host-side enforcement of pin-to-Latest |
| [`what-the-system-emits-today.md`](plans/observability/what-the-system-emits-today.md) | PDR-026 (host adoption) (observability matrix) | Observability matrix tracked at session-by-session granularity |
| [`substrate-vs-axis-plans` plan-collection component](plans/templates/components/substrate-vs-axis-plans.md) | PDR-037 §Decision (canonical artefact) | Reusable plan-collection component capturing the substrate-vs-axis convention |
| [`doctrine-enforcement-quick-wins.plan.md`](plans/agentic-engineering-enhancements/current/doctrine-enforcement-quick-wins.plan.md) | PDR-044 §Worked Instances + PDR-038 §2026-05-04 amendment + PDR-018 §Beneficial prerequisites | Innate-immunity layer host adoption — six structural enforcement surfaces against named pathogens |
| [`memetic-immune-system-and-progressive-disclosure.plan.md`](plans/agentic-engineering-enhancements/future/memetic-immune-system-and-progressive-disclosure.plan.md) | PDR-044 §Implementation Notes | Strategic roadmap for adaptive-immunity layer, practice trio additive activation, doctrine-scanner CLI consolidation, and triggered rule loading pilot |
| [`memory-state-substrate-portable-contracts.plan.md`](plans/agentic-engineering-enhancements/current/memory-state-substrate-portable-contracts.plan.md) | PDR-050 (host adoption) | Portable substrate-contract adoption across state, memory, generated read models, and immune-layer routing |
| [`memory-state-contract-doctor.plan.md`](plans/agent-tooling/archive/completed/memory-state-contract-doctor.plan.md) | PDR-049 + PDR-050 (host enforcement) | Deterministic doctor for state/memory contract health, generated drift, canonical paths, and merge topology |

### Experience records cited by Practice Core

Practice-Core PDRs cite host-local experience records as subjective-experience
witnesses for the portable doctrine. Experience records live under
[`.agent/experience/`](experience/).

| Experience record | Cited by Core | Subject |
| --- | --- | --- |
| [`2026-04-30-briny-the-frame-was-the-fix.md`](experience/2026-04-30-briny-the-frame-was-the-fix.md) | PDR-041 §Evidence + PDR-042 §Evidence | Subjective-experience witness for composition-obscurity investigation methodology and the signal-distinguishing pre-action gate |

## Agentic Corpus Hub

For concept-driven routing across canon, research, evidence, plans, reflective
sources, and deep dives, use
[`.agent/research/agentic-engineering/README.md`](research/agentic-engineering/README.md).
This is both the lane router and the merged concept-and-deep-dive hub
(consolidated during the Session 8 rehoming pass per
[reference-research-notes-rehoming plan](plans/agentic-engineering-enhancements/archive/completed/reference-research-notes-rehoming.plan.md), archived Session 8);
it routes back to the authoritative ADRs, Practice Core, `/docs/**`
surfaces, and supporting source lanes.

## Skills and Prompts

The execution surface is intentionally split by role:

- **Canonical skills** in [`.agent/skills/`](skills/) (live count
  surfaces in the directory listing — counts in this index drift;
  treat the directory as authoritative). Skills are the sole
  user-and-model-invokable workflow surface; custom command surfaces
  have been retired.
- **Prompt library** in [`.agent/prompts/`](prompts/) with the active index at
  [`.agent/prompts/README.md`](prompts/README.md)

Representative execution surfaces:

| Surface               | Canonical location                                      | Representative entries                                                                                                                                                                                                                                                                                                                                                                          | Purpose                                                       |
| --------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Skills                | [`.agent/skills/`](skills/)                             | [`start-right-quick`](skills/start-right-quick/SKILL-CANONICAL.md), [`start-right-thorough`](skills/start-right-thorough/SKILL-CANONICAL.md), [`go`](skills/go/SKILL-CANONICAL.md), [`session-handoff`](skills/session-handoff/SKILL-CANONICAL.md), [`gates`](skills/gates/SKILL-CANONICAL.md), [`plan`](skills/plan/SKILL-CANONICAL.md), [`consolidate-docs`](skills/consolidate-docs/SKILL-CANONICAL.md), [`metacognition`](skills/metacognition/SKILL-CANONICAL.md), [`napkin`](skills/napkin/SKILL-CANONICAL.md), [`commit`](skills/commit/SKILL-CANONICAL.md), [`chatgpt-report-normalisation`](skills/chatgpt-report-normalisation/SKILL-CANONICAL.md) | User-invoked workflows and on-demand expertise                |
| Session prompts       | [`.agent/prompts/`](prompts/)                           | Domain-specific handover briefs only (e.g. [`gt-review.md`](prompts/gt-review.md), [`semantic-search/semantic-search.prompt.md`](prompts/semantic-search/semantic-search.prompt.md)). General session orientation is no longer prompt-hosted — see [`orientation.md`](directives/orientation.md) and [`start-right-quick`](skills/start-right-quick/SKILL-CANONICAL.md).                                                     | Stateful session entry points tied to active plans or domains |

## Memory and Patterns

Institutional memory accumulates across sessions and distils into
reusable knowledge:

| Artefact | Location | Purpose |
| --- | --- | --- |
| Distilled learnings | [`memory/active/distilled.md`](memory/active/distilled.md) | Refined cross-session lessons — read before every session |
| Collaboration channels | [`memory/executive/agent-collaboration-channels.md`](memory/executive/agent-collaboration-channels.md) | Register of communication options and when to use each |
| Pattern library | [`memory/active/patterns/`](memory/active/patterns/README.md) | Abstract solutions to recurring design problems (live count surfaces in the directory listing) |
| Session napkin | [`memory/active/napkin.md`](memory/active/napkin.md) | Current session observations, written continuously |
| Napkin archive | [`memory/active/archive/`](memory/active/archive/) | Rotated napkins (historical record) |
| Operational continuity | [`memory/operational/repo-continuity.md`](memory/operational/repo-continuity.md) | Repo-wide active-thread register, standing decisions, pending-graduations |

The agent directive teaches agents to check the pattern library before
inventing new approaches.

### Pattern instances cited by Practice Core

Practice Core PDRs routinely cite host-local pattern instances that
prove the portable doctrine. The instances live under
[`memory/active/patterns/`](memory/active/patterns/) and are listed
here as proven instances for Core readers who want the worked
example in this repo:

| Pattern instance | Cited by Core | Concept |
| --- | --- | --- |
| [`tool-error-as-question.md`](memory/active/patterns/tool-error-as-question.md) | PDR-018 §Tool error as question | Treat any non-pass tool result as a question to understand, not an obstacle to bypass |
| [`hook-as-question-not-obstacle.md`](memory/active/patterns/hook-as-question-not-obstacle.md) | PDR-018 §Tool error as question | Pre-commit / pre-tool hooks fire as questions, not as obstacles |
| [`ground-before-framing.md`](memory/active/patterns/ground-before-framing.md) | PDR-018 §Tool error as question | Read the source before drafting an interpretation |
| [`scope-as-goal.md`](memory/active/patterns/scope-as-goal.md) | PDR-015 + PDR-018 §Reviewer scope equals prompted scope | Reviewer brief scope must match the merge-gate scope |
| [`inherited-framing-without-first-principles-check.md`](memory/active/patterns/inherited-framing-without-first-principles-check.md) | PDR-014 §Composition discipline (`pattern + rule` row) | Inherited framing in plan bodies survives reviewers and outlasts evidence |
| [`findings-route-to-lane-or-rejection.md`](memory/active/patterns/findings-route-to-lane-or-rejection.md) | PDR-012 Notes | Reviewer findings route either to an action lane or to a written rejection |
| [`nothing-unplanned-without-a-promotion-trigger.md`](memory/active/patterns/nothing-unplanned-without-a-promotion-trigger.md) | PDR-012 Notes | Future-plan items carry an explicit promotion trigger |
| [`non-leading-reviewer-prompts.md`](memory/active/patterns/non-leading-reviewer-prompts.md) | PDR-012 Notes | Reviewer prompts must avoid leading framings |
| [`pre-implementation-plan-review.md`](memory/active/patterns/pre-implementation-plan-review.md) | PDR-012 Notes | Plan review fires before implementation, not after |
| [`adr-by-reusability-not-diff-size.md`](memory/active/patterns/adr-by-reusability-not-diff-size.md) | PDR-019 Notes | ADR-worthiness is judged by re-derivation reuse, not by diff size |
| [`vendor-doc-review-for-unknown-unknowns.md`](memory/active/patterns/vendor-doc-review-for-unknown-unknowns.md) | PDR-033 (instance pattern) | Plans targeting third-party platforms must schedule a vendor-doc review pass |
| [`cross-session-pattern-emergence.md`](memory/active/patterns/cross-session-pattern-emergence.md) | PDR-014 Notes | Some patterns only become visible across multiple sessions |
| [`substance-before-fitness.md`](memory/active/patterns/substance-before-fitness.md) | PDR-014 Notes | Write at the weight the substance deserves; handle fitness afterwards |
| [`current-plan-promotion.md`](memory/active/patterns/current-plan-promotion.md) | PDR-014 Notes | Plans promote from `future/` to `current/` when both decision-readiness and session-entry-readiness are met |
| [`domain-specialist-final-say.md`](memory/active/patterns/domain-specialist-final-say.md) | PDR-015 (host adoption) | Domain specialists override architecture generalists on vendor-specific behaviour |
| [`route-reviewers-by-abstraction-layer.md`](memory/active/patterns/route-reviewers-by-abstraction-layer.md) | PDR-015 (host adoption) | Multiple reviewers on the same lane produce disjoint findings when routed by layer |
| [`reviewer-widening-is-always-wrong.md`](memory/active/patterns/reviewer-widening-is-always-wrong.md) | PDR-015 (host adoption) | A reviewer recommending `unknown`/widening to satisfy a strictness rule is wrong even when the rule citation is valid |
| [`review-intentions-not-just-code.md`](memory/active/patterns/review-intentions-not-just-code.md) | PDR-015 (host adoption) | Specialist reviewer dispatch fires before implementation, not just after |
| [`verify-before-propagating.md`](memory/active/patterns/verify-before-propagating.md) | PDR-016 (host adoption) | Citation chains drift; verify against the primary source before propagating |
| [`monotonic-counter-is-not-quality-indicator.md`](memory/active/patterns/monotonic-counter-is-not-quality-indicator.md) | PDR-016 (host adoption) | A higher counter value is not evidence of newer or better |
| [`comments-about-externals-degrade.md`](memory/active/patterns/comments-about-externals-degrade.md) | PDR-016 (host adoption) | Negative comments about external library behaviour go stale faster than they get updated |
| [`three-levels-of-reference-quality.md`](memory/active/patterns/three-levels-of-reference-quality.md) | PDR-016 (host adoption) | Opaque pointer / citation chain / exported concept — only exported concepts travel safely |
| [`fix-at-source-not-consumer.md`](memory/active/patterns/fix-at-source-not-consumer.md) | PDR-017 (host adoption) | Fix the producer, not each consumer's workaround |
| [`re-evaluate-removal-conditions.md`](memory/active/patterns/re-evaluate-removal-conditions.md) | PDR-017 (host adoption) | Workarounds whose removal conditions have been met must be re-evaluated, not preserved |
| [`workaround-debt-compounds-through-rationalisation.md`](memory/active/patterns/workaround-debt-compounds-through-rationalisation.md) | PDR-017 (host adoption) | Rationalisation vocabulary covers genuine debt surfaces |
| [`end-goals-over-means-goals.md`](memory/active/patterns/end-goals-over-means-goals.md) | PDR-018 (host adoption) | End-goal-framed plans are smaller and more targeted than means-framed plans |
| [`repair-workflow-contract-clarity.md`](memory/active/patterns/repair-workflow-contract-clarity.md) | PDR-018 (host adoption) | Ambiguous verbs in repair workflows produce divergent outcomes across artefacts |
| [`check-driven-development.md`](memory/active/patterns/check-driven-development.md) | PDR-020 (host adoption) | Use the type checker as the direct assertion, not runtime property-existence checks |
| [`governance-claim-needs-a-scanner.md`](memory/active/patterns/governance-claim-needs-a-scanner.md) | PDR-022 (host adoption) | Every governance claim needs a mechanical scanner; vigilance does not scale |
| [`readme-as-index.md`](memory/active/patterns/readme-as-index.md) | PDR-023 (host adoption) | Directory-level READMEs are indexes; substance lives in the indexed artefacts |
| [`warning-severity-is-off-severity.md`](memory/active/patterns/warning-severity-is-off-severity.md) | PDR-025 §Forbidden + (host adoption) | ESLint `warn` is permitted only as a migration mechanic with a flip-to-error trigger |
| [`tool-output-framing-bias.md`](memory/active/patterns/tool-output-framing-bias.md) | PDR-013 (host adoption) | Tool output's framing biases interpretation; investigate before classifying |
| [`evidence-before-classification.md`](memory/active/patterns/evidence-before-classification.md) | PDR-013 (host adoption) | Classify only after evidence-gathering, not at first read |
| [`circular-test-justification.md`](memory/active/patterns/circular-test-justification.md) | PDR-021 (host adoption) | Tests must not be the only justification for the production code they exercise |
| [`test-claim-assertion-parity.md`](memory/active/patterns/test-claim-assertion-parity.md) | PDR-021 (host adoption) | Test description and assertion must measure the same thing |

## Artefact Directories

| Location                                                                                      | What lives there                                                            |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [`.agent/practice-core/`](practice-core/)                                                     | Portable Practice Core package — trinity + entry points + CHANGELOG + provenance + `decision-records/` (PDRs, including universal patterns with `pdr_kind: pattern`) + `incoming/` (Practice Box). Previous `patterns/` Core directory and `practice-context/` peer companion retired 2026-04-29 (PDR-007 amendment). |
| [`.agent/directives/`](directives/)                                                           | Doctrine — read-and-internalise; sets stance (AGENT.md, principles, collaboration, testing-strategy, schema-first-execution, metacognition, orientation) |
| [`.agent/plans/`](plans/)                                                                     | Work planning — active, paused, archived, and optional supporting templates |
| [`.agent/memory/`](memory/)                                                                   | Three-mode memory: [`active/`](memory/active/) (learning loop — napkin, distilled, patterns, archive), [`operational/`](memory/operational/) (continuity — repo-continuity, workstreams, tracks), [`executive/`](memory/executive/) (contracts — artefact inventory, reviewer catalogue, platform-adapter matrix). See [`memory/README.md`](memory/README.md). |
| [`.agent/state/`](state/)                                                                     | Live coordination state — shared communication log, active claims + `commit_queue`, closed claims, decision threads, sidebars, joint decisions, and escalations |
| [`.agent/experience/`](experience/)                                                           | Experiential records across sessions                                        |
| [`.agent/prompts/`](prompts/)                                                                 | Domain-specific handover prompts — stateful session context                 |
| [`.agent/sub-agents/`](sub-agents/)                                                           | Reviewer prompt architecture (components, templates)                        |
| [`.agent/skills/`](skills/)                                                                   | Canonical skills (platform-agnostic)                                        |
| [`.agent/research/`](research/)                                                               | Research documents and analysis                                             |
| [`.agent/analysis/`](analysis/)                                                               | Investigations and evidence                                                 |
| [`.agent/reports/`](reports/)                                                                 | Promoted formal audits and syntheses                                        |
| [`.agent/reference/`](reference/)                                                             | Supporting reference material, including the cross-platform surface matrix  |
| [`.cursor/`](../.cursor/)                                                                     | Cursor platform adapters (thin wrappers)                                    |
| [`.claude/`](../.claude/)                                                                     | Claude Code platform adapters (thin wrappers)                               |
| [`.gemini/`](../.gemini/)                                                                     | Gemini CLI platform adapters (thin wrappers)                                |
| [`.agents/`](../.agents/)                                                                     | Portable skill, command, and rule adapters (thin wrappers)                  |
| [`.codex/`](../.codex/)                                                                       | Codex project-agent configuration (reviewer sub-agents)                     |
| [`docs/architecture/architectural-decisions/`](../docs/architecture/architectural-decisions/) | Permanent architectural decision records                                    |
