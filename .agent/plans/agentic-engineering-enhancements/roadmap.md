# Agentic Engineering Enhancements Roadmap

**Status**: ✅ Phase 0 complete; ES specialist ✅ complete; Sentry specialist 🔄 active; MCP specialist ✅ complete; continuity adoption ✅ complete; operational-awareness separation 🔄 active; governance-concept integration ✅ complete; incoming Practice integration ✅ complete; multi-agent lifecycle integration ✅ complete; intent-to-commit queue ✅ complete; reviewer gateway ⏭️ queued; learning-loop negative-feedback tightening ⏭️ queued; planning specialist ⏭️ queued; practice/process structural improvements ⏭️ queued; agent infrastructure portability remediation ⏭️ queued; practice-graph payoff-peak pilot ⏭️ queued; agentic corpus discoverability ✅ complete; Codex parity ✅ complete; Practice convergence ✅ complete; graph-memory exploration 📋 strategic; collaboration-state domain model 📋 strategic; operating-model mechanism taxonomy 📋 strategic; MCP governance deep dive 📋 future; Phase 1 ready to start
**Last Updated**: 2026-04-28
**Session Entry**: [start-right-quick.md](../../commands/start-right-quick.md)

---

## Purpose

This roadmap is the strategic phase sequence for the
`agentic-engineering-enhancements` collection while keeping detail in lifecycle
lanes:

- `active/` — now
- `current/` — next
- `future/` — later
- `archive/completed/` — historical evidence

Lane indexes:

1. [active/README.md](active/README.md)
2. [current/README.md](current/README.md)
3. [future/README.md](future/README.md)

Strategic source plans remain authoritative for intent/rationale; active plans
are authoritative for execution tasks.

Status token definitions are standardised in
[README.md](README.md#status-legend).

Authoritative active execution sources:

1. ~~phase-0-templates-and-components-foundation.md~~ (archived)
2. [phase-1-hallucination-guarding-execution.md](active/phase-1-hallucination-guarding-execution.md)
3. [phase-2-evidence-based-claims-execution.md](active/phase-2-evidence-based-claims-execution.md)
4. [phase-3-architectural-enforcement-execution.md](active/phase-3-architectural-enforcement-execution.md)
5. ~~phase-4-cross-agent-standardisation-execution.md~~ **Superseded** by Agent Artefact Portability plan (ADR-125) (archived)
6. [phase-5-mutation-testing-execution.md](active/phase-5-mutation-testing-execution.md)

Active adjacent execution sources:

1. ~~elasticsearch-specialist-capability.execution.plan.md~~ ✅ Complete (archived in `archive/completed/` for reference)
2. ~~codex-platform-parity.execution.plan.md~~ ✅ Complete (deleted)
3. [phase-0-baseline-metrics.plan.md](active/phase-0-baseline-metrics.plan.md) (HC-0: harness-concepts baseline)
4. Clerk specialist capability — ✅ Complete (no execution plan needed; single-session delivery)
5. ~~continuity-and-surprise-practice-adoption.plan.md~~ ✅ Complete (archived in `archive/completed/` for reference)
6. ~~practice-convergence.plan.md~~ ✅ Complete (deleted; backup trees removed, all workstreams done)
7. [agentic-corpus-discoverability-and-deep-dive-hub.execution.plan.md](active/agentic-corpus-discoverability-and-deep-dive-hub.execution.plan.md) (agentic corpus discoverability hub — ✅ complete)
8. [governance-concepts-and-agentic-mechanism-integration.execution.plan.md](active/governance-concepts-and-agentic-mechanism-integration.execution.plan.md) (governance-concept routing closeout — ✅ complete)

---

## Explicit Goal 0

Create and maintain a well-structured `.agent/plans/templates/components`
ecosystem with useful, reusable templates that reduce plan drift and improve
execution quality.

---

## Documentation Synchronisation Requirement

No phase can be marked complete until documentation updates have been handled
for:

1. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
2. `docs/architecture/architectural-decisions/124-practice-propagation-model.md`
3. `.agent/practice-core/practice.md`
4. any additionally impacted ADRs, `/docs/` pages, or README files

Each phase must either:

- update impacted documents directly, or
- record an explicit no-change rationale in
  [documentation-sync-log.md](documentation-sync-log.md)

Before phase closure, apply the
[`jc-consolidate-docs` workflow](../../commands/consolidate-docs.md)
to ensure no settled documentation remains trapped in plans/prompts.

---

## Milestone Context

This roadmap aligns to:

- **Milestone 2**: hallucination/evidence guards, architectural enforcement,
  cross-agent standardisation
- **Milestone 3**: mutation testing rollout and optimisation
- **Adjacent capability work**: Elasticsearch specialist (✅), Clerk specialist
  (✅), Sentry specialist (🔄), MCP upgrade (✅), continuity adoption (✅),
  operational-awareness separation (⏭️), governance-concept integration (✅),
  incoming Practice integration (✅), learning-loop negative-feedback tightening
  (⏭️), practice/process structural improvements (⏭️), agent infrastructure
  portability remediation (⏭️), practice-graph payoff-peak pilot (⏭️), Reviewer
  Gateway upgrade (⏭️), Planning specialist (⏭️), Express specialist (📋),
  Cyber security specialist (📋), Web/API security specialist (📋), Privacy
  specialist (📋), Web/API GDPR specialist (📋), Oak Open Curriculum Ecosystem
  specialist (📋), Graph memory exploration (📋), TDD specialist (📋), Developer
  experience specialist (📋), Repair workflow wording hazard detection (📋),
  Cross-vendor session sidecars (📋), Collaboration-state domain model (📋),
  Adapter generation (📋), operating-model mechanism taxonomy (📋), specialist
  operational tooling layer (ADR-137, strategic), External pointer-surface
  integration (📋)
- **Expert expansion coordination**: Planning specialist owns the Planning
  reviewer/skill/rule triplet; practice/process structural improvements feeds
  planning discipline and other permanent-home gaps into the right doctrine
  surfaces; agent infrastructure portability remediation keeps the growing
  expert/skill/rule estate portable and validated.

See [high-level-plan.md](../high-level-plan.md) for cross-collection context.

---

## Execution Order

```text
Phase 0: Planning system and template hardening      ✅ COMPLETE
Phase 1: Hallucination guarding rollout              📋 PLANNED
Phase 2: Evidence-based claims rollout               📋 PLANNED
Phase 3: Architectural enforcement execution         📋 PLANNED
Phase 4: Cross-agent standardisation execution       ⛔ SUPERSEDED (ADR-125)
Phase 5: Mutation testing execution                  📋 PLANNED

Adjacent:
  ES:   Elasticsearch specialist capability          ✅ COMPLETE
  CLK:  Clerk specialist capability                  ✅ COMPLETE
  CX:   Codex platform parity                       ✅ COMPLETE
  HC-0: Harness concepts baseline metrics            📋 PLANNED
  CTY:  Continuity/session-handoff adoption          ✅ COMPLETE
  OAW:  Operational awareness separation             ⏭️ QUEUED
  GCM:  Governance-concept integration               ✅ COMPLETE
  PCI:  Incoming Practice integration                ✅ COMPLETE
  PC:   Practice convergence closeout                ✅ COMPLETE
  SNT:  Sentry specialist capability                 🔄 ACTIVE
  LFT:  Learning-loop negative-feedback tightening   ⏭️ QUEUED
  PPS:  Practice/process structural improvements     ⏭️ QUEUED
  APR:  Agent infrastructure portability remediation ⏭️ QUEUED
  MCP+: MCP specialist upgrade (triplet + ext-apps)  ✅ COMPLETE
  EXP:  Express specialist capability                📋 PLANNED
  CYB:  Cyber security specialist capability         📋 PLANNED
  WAS:  Web/API security specialist capability       📋 PLANNED
  PRV:  Privacy specialist capability                📋 PLANNED
  WGD:  Web/API GDPR specialist capability           📋 PLANNED
  OOCE: Oak Open Curriculum Ecosystem specialist     📋 PLANNED
  GME:  Graph memory exploration                     📋 STRATEGIC
  PLN:  Planning specialist capability               ⏭️ QUEUED
  TDD:  TDD specialist capability                    📋 PLANNED
  DVX:  Developer experience specialist              📋 PLANNED
  RWD:  Repair workflow wording hazard detection     📋 PLANNED
  GW:   Reviewer gateway upgrade                     ⏭️ QUEUED
  SSC:  Cross-vendor session sidecars                📋 STRATEGIC
  CSD:  Collaboration-state domain model             📋 STRATEGIC
  ICQ:  Intent-to-commit queue                       ✅ COMPLETE
  AGN:  Manifest-driven adapter generation           📋 PLANNED
  ACT:  Agent classification taxonomy                📋 STRATEGIC
  OMT:  Operating-model mechanism taxonomy           📋 STRATEGIC
  OPS:  Specialist operational tooling layer         📋 STRATEGIC (ADR-137)
  EPS:  External pointer-surface integration         📋 STRATEGIC
```

---

## Phase Details

### Phase 0 — Planning System and Template Hardening

- Active plan: ~~phase-0-templates-and-components-foundation.md~~ (archived)
- Status: ✅ Complete (2026-02-24)
- Done when:
  - templates/components inventory is intentionally structured and documented
  - useful templates exist for feature, quality-fix, adoption, and roadmap work
  - this collection has roadmap + atomic active plans for all phases
  - documentation synchronisation contract and tracking log are present
- Dependencies: none

### Phase 1 — Hallucination Guarding Rollout

- Active plan:
  [phase-1-hallucination-guarding-execution.md](active/phase-1-hallucination-guarding-execution.md)
- Source strategy:
  [hallucination-and-evidence-guard-adoption.plan.md](current/hallucination-and-evidence-guard-adoption.plan.md)
- Done when:
  - non-trivial claim classes and verification contract are implemented in
    prompts/review workflow
  - pilot baseline is captured with evidence
  - documentation sync log records updates/no-change rationale for Phase 1
- Dependencies: Phase 0 complete

### Phase 2 — Evidence-Based Claims Rollout

- Active plan:
  [phase-2-evidence-based-claims-execution.md](active/phase-2-evidence-based-claims-execution.md)
- Source strategy:
  [hallucination-and-evidence-guard-adoption.plan.md](current/hallucination-and-evidence-guard-adoption.plan.md)
- Done when:
  - evidence bundle usage is standardised across target workflows
  - merge-readiness checks enforce evidence requirements
  - documentation sync log records updates/no-change rationale for Phase 2
- Dependencies: Phase 1 complete

### Phase 3 — Architectural Enforcement Execution

- Active plan:
  [phase-3-architectural-enforcement-execution.md](active/phase-3-architectural-enforcement-execution.md)
- Source strategy:
  [architectural-enforcement-adoption.plan.md](current/architectural-enforcement-adoption.plan.md)
- Convergence update (2026-03-04):
  - Strictness-specific ESLint convergence tasks (`no-console`, shared-config promotion work) are executed in
    [devx-strictness-convergence.plan.md](../developer-experience/active/devx-strictness-convergence.plan.md)
  - Directory-complexity supporting constraints, depcruise/knip/`pnpm check` integration, and staged `max-files-per-dir` activation are executed in
    [directory-complexity-enablement.execution.plan.md](../developer-experience/current/directory-complexity-enablement.execution.plan.md)
- Done when:
  - enforcement phases 0-5 are delivered with deterministic validation
  - evidence-backed claims exist for enforcement outcomes
  - documentation sync log records updates/no-change rationale for Phase 3
- Dependencies:
  - documentation boundary corrections already complete
  - Phase 2 claim/evidence workflow available

### Phase 4 — Cross-Agent Standardisation Execution

> **SUPERSEDED**: All cross-agent standardisation work has been absorbed into [ADR-125 (Agent Artefact Portability)](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md).

### Phase 5 — Mutation Testing Execution

- Active plan:
  [phase-5-mutation-testing-execution.md](active/phase-5-mutation-testing-execution.md)
- Source strategy:
  [mutation-testing-implementation.plan.md](current/mutation-testing-implementation.plan.md)
- **Milestone context**: Stryker is already a devDependency with a
  `pnpm mutate` turbo task and config inputs. It was briefly used and now
  needs proper integration. **Blocks public beta (M3), not public alpha
  (M1).** However, it remains a high-impact quality gateway that is not
  yet being used — proper integration is a priority for M3.
  (Source: onboarding simulation R27, owner disposition 2026-02-26.)
- Done when:
  - mutation phases 0-3 delivered (with rollout evidence and CI posture)
  - documentation sync log records updates/no-change rationale for Phase 5
- Dependencies:
  - Phase 2 evidence workflow available
  - Phase 3 enforcement baseline stable

### Adjacent — Elasticsearch Specialist Capability

- Active plan:
  [archive/completed/elasticsearch-specialist-capability.execution.plan.md](archive/completed/elasticsearch-specialist-capability.execution.plan.md)
- Source strategy:
  [elasticsearch-specialist-capability.plan.md](current/elasticsearch-specialist-capability.plan.md)
- Goal:
  - add a canonical Elasticsearch reviewer, skill, and situational rule
  - require live consultation of official Elastic documentation as primary authority
  - treat Elastic Serverless as the default deployment context
- Status: ✅ Complete
- Notes:
  - intentionally outside the numbered phase sequence
  - collection-owned because it extends the agent capability model rather than the product runtime directly

### Adjacent — Codex Platform Parity

- Active plan:
  ~~codex-platform-parity.execution.plan.md~~ (deleted)
- Status: ✅ Complete
- Done when:
  - Codex agent configuration exists with appropriate tool access and constraints
  - AGENTS.md is present and consistent with AGENT.md directives
  - portability validation covers Codex artefacts
- Notes:
  - intentionally outside the numbered phase sequence
  - extends platform coverage to OpenAI Codex alongside Cursor and Claude Code

### Adjacent — Continuity, Session Handoff, and Surprise Pipeline Adoption

- Strategic plan:
  [continuity-and-surprise-practice-adoption.plan.md](archive/completed/continuity-and-surprise-practice-adoption.plan.md)
- Goal:
  - treat continuity as a repo engineering property rather than a vague memory
    claim
  - replace `wrap-up` with lightweight `session-handoff`
  - keep `consolidate-docs` as conditional deep convergence
  - revive `GO` as a mid-session cadence
  - use the MCP App lane as the evidence source
- Status: ✅ Complete (archived reference)
- Notes:
  - intentionally outside the numbered phase sequence
  - Wave 1 closed with an explicit `promote` decision on 2026-04-03
- the outgoing portable note and same-day follow-on Practice Core promotion
    both landed after the evidence window closed

### Adjacent — Operational Awareness and Continuity Surface Separation

- Active plan:
  [operational-awareness-and-continuity-surface-separation.plan.md](archive/completed/operational-awareness-and-continuity-surface-separation.plan.md)
- Goal:
  - separate the canonical continuity contract, workstream resumption state,
    and thread-aware tactical coordination into distinct repo-local surfaces
  - keep the continuation prompt as a behavioural entry surface only
  - prove a markdown-first model before promoting any broader sidecar-store
    design
  - define portability criteria without mutating Practice Core in the initial
    lane
- Status: 🔄 ACTIVE (promoted `current/` → `active/` on 2026-04-20)
- Notes:
  - adjacent to the completed continuity-adoption lane and the future
    cross-vendor sidecars plan
  - the default proof path is repo-local first, portable candidate second
  - initial non-goals explicitly exclude SQLite sidecars, AGENT changes, and
    blind prompt trimming

### Adjacent — Governance Concepts and Agentic Mechanism Integration

- Active plan:
  [governance-concepts-and-agentic-mechanism-integration.execution.plan.md](active/governance-concepts-and-agentic-mechanism-integration.execution.plan.md)
- Source strategy:
  [governance-concepts-and-agentic-mechanism-integration.plan.md](current/governance-concepts-and-agentic-mechanism-integration.plan.md)
- Goal:
  - extract governance-plane, boundary, authority, supervision, and
    signal-routing concepts from a compared governance corpus using fully local
    naming
  - record a baseline, deep dive, and formal report without copying source
    names or wording
  - route each concept to an existing plan, future plan, reference lane,
    report lane, doctrine candidate, or explicit reject/defer decision
  - identify high-impact next-step candidates without prematurely mutating
    Practice Core, ADRs, or PDRs
- Status: ✅ Complete
- Notes:
  - complements the operational-awareness and reviewer-gateway lanes instead of
    replacing them
  - the evidence lane now owns the attempt -> observed outcome -> proven
    result split
- the future mechanism-taxonomy lane now holds the remaining boundary-model,
    signal-ecology, residual-risk, and governance-plane abstraction debt
  - doctrine-adjacent canon was reviewed and intentionally left unchanged in
    this closeout

### Adjacent — Learning-Loop Negative-Feedback Tightening

- Strategic plan:
  [learning-loop-negative-feedback-tightening.plan.md](current/learning-loop-negative-feedback-tightening.plan.md)
- Findings report:
  [learning-loops-and-balancing-feedback-report.md](../../reports/agentic-engineering/deep-dive-syntheses/learning-loops-and-balancing-feedback-report.md)
- Goal:
  - instantiate PDR-028 drift-detection sections on the three live
    executive-memory surfaces
  - make `consolidate-docs` step 9 record explicit memory-quality
    dispositions for governed files outside `healthy`
  - strengthen balancing power without new validators, new memory layers, or
    broad Practice Core rewrites
- Status: ⏭️ Queued
- Notes:
  - intentionally narrow follow-on, not a learning-loop redesign
  - complements reference-tier curation and ADR-144 fitness without changing
    thresholds or blocking behaviour

### Adjacent — Multi-Agent Collaboration Protocol (MAC)

- Strategic plan:
  [multi-agent-collaboration-protocol.plan.md](current/multi-agent-collaboration-protocol.plan.md)
- Split execution plans:
  - [multi-agent-collaboration-decision-thread-and-claim-history.plan.md](archive/completed/multi-agent-collaboration-decision-thread-and-claim-history.plan.md)
    — WS3A: evidence provision, protocol observability, durable
    claim-closure history, and lightweight decision threads; complete
    and archived 2026-04-26
  - [multi-agent-collaboration-sidebar-and-escalation.plan.md](current/multi-agent-collaboration-sidebar-and-escalation.plan.md)
    — WS3B: sidebar, timeout, and owner-escalation mechanics;
    implemented 2026-04-26 alongside joint-decision integration
- Goal:
  - install structural infrastructure for parallel agents working on
    the same repo without clashing — by *seeing* what each other is
    doing and *talking* about overlap when it matters
  - protocol is advisory not enforcing: knowledge and communication,
    not mechanical refusals
  - protocol is platform independent by design: platform-native
    agent-team features may help build it, but repo-owned markdown/JSON/
    rules/commands/skills/hooks surfaces must remain sufficient to
    operate it
- Status: ✅ WS3B-IMPLEMENTED; WS5 paused on post-WS4A/WS3B observation
  (refreshed 2026-04-26)
- Landings:
  - WS0 (vocabulary + shared communication log + foundational rules) —
    `63c66c88` 2026-04-25
  - WS1 (structured claims registry + tripwire rule + stale-claim
    audit + start-right wiring) — `a5d33519` 2026-04-25
  - WS2 (collaboration memory class + founding pattern graduation) —
    `293742cd` 2026-04-25
  - WS3A decision-thread / claim-history / observability slice —
    uncommitted 2026-04-26; complete
  - WS4A lifecycle integration —
    uncommitted 2026-04-26; start-right, session-handoff,
    consolidate-docs, plan templates, and Practice / ADR surfaces now
    recognise WS0-WS3A collaboration state
  - WS3B sidebar/escalation + joint-decision integration —
    uncommitted 2026-04-26; conversation schema v1.1.0,
    escalation schema, fixtures, and workflow reporting installed
- Evidence gates:
  - Original WS3 evidence inspection: ≥ 3 real parallel-session
    coordination events using the WS0 + WS1 surfaces. Owner-directed
    harvest completed on 2026-04-26 and split WS3. WS3A is now complete.
  - WS4A was then owner-authorised and completed as a narrow
    lifecycle-integration pass.
  - Three-agent phase-transition evidence and owner direction satisfied the
    WS3B promotion gate on 2026-04-26; owner-approved implementation
    landed the same day.
  - Remaining WS5 scope is post-WS4A observation / seed harvest across
    real sessions.
- Notes:
  - intentionally outside the numbered phase sequence
  - split workstreams: WS3A (decision-thread / claim-history /
    observability; complete), WS3B (sidebar / escalation; complete), WS4A
    (lifecycle integration; complete), WS5 (harvest/refinement evidence;
    paused)
  - while WS5 is paused, evidence accumulates passively from any session
    that uses the WS0/WS1 surfaces — no active session is required
  - inspection points: `consolidate-docs § 7e`, napkin rotation

### Adjacent — Practice and Process Structural Improvements

- Strategic plan:
  [practice-and-process-structural-improvements.plan.md](current/practice-and-process-structural-improvements.plan.md)
- Goal:
  - create permanent homes for process knowledge currently stranded in
    `distilled.md`
  - add a user-collaboration directive for the agent-to-owner working model,
    scope discipline, risk classification, feedback, onboarding, and archive
    discipline (the multi-agent collaboration protocol's WS0 has since
    landed both `user-collaboration.md` and `agent-collaboration.md`)
  - feed Planning discipline into the dedicated Planning specialist capability
    plan instead of creating a duplicate generic planning skill
  - author portability PDR/ADR doctrine after, or in parallel with, the ADR-125
    documentation work in the portability remediation plan
  - graduate remaining distilled entries only after the destination surfaces
    exist
- Status: ⏭️ Queued (`current/`)
- Notes:
  - this is a structural doctrine plan, not another expert-capability plan
  - Phase 2 is the reconciliation point with the Planning specialist capability
  - Phase 3 depends on
    [agent-infrastructure-portability-remediation.plan.md](current/agent-infrastructure-portability-remediation.plan.md)
    Phase 5

### Adjacent — Agent Infrastructure Portability Remediation

- Strategic plan:
  [agent-infrastructure-portability-remediation.plan.md](current/agent-infrastructure-portability-remediation.plan.md)
- Goal:
  - canonicalise vendor-installed skills into `.agent/skills/`
  - add missing thin wrappers across `.agents/`, `.claude/`, and `.cursor/`
  - harden `pnpm portability:check` with reverse validation and thin-wrapper
    form checks
  - update ADR-125, the artefact inventory, and the cross-platform matrix so
    the expanding expert/skill/rule estate has accurate creation guidance
  - add a repo-owned skill install/update workflow so external skill updates do
    not overwrite tracked platform adapters
- Status: ⏭️ Queued (`current/`)
- Notes:
  - this plan is the adapter and validator scaling prerequisite for a larger
    expert collection
  - its Phase 5 documentation update is the direct dependency for the
    portability PDR/ADR work in the structural-improvements plan
  - it should be considered before adding further manual specialist adapters

### Adjacent — Practice Graph Payoff-Peak Pilot

- Source plan:
  [practice-graph-payoff-peak-pilot.plan.md](current/practice-graph-payoff-peak-pilot.plan.md)
- Strategic parent:
  [graphify-and-graph-memory-exploration.plan.md](future/graphify-and-graph-memory-exploration.plan.md)
- Goal:
  - build the highest-value/effort first slice of a derived Practice graph
  - keep the graph advisory, local, deterministic, and read-only
  - land the work in repo-native shape: TypeScript only, esbuild for new
    workspaces, thin CLI surface through `agent-tools`
- Status: ⏭️ Queued
- Notes:
  - bounded to an explicit pilot corpus spanning Practice, ADRs, onboarding,
    and selected live plans
  - dedicated internal app/service surface is intentionally deferred
  - Graphify remains an inspiration source with explicit acknowledgement, not
    an adopted runtime

### Adjacent — Agentic Corpus Discoverability Hub

- Active plan:
  [agentic-corpus-discoverability-and-deep-dive-hub.execution.plan.md](active/agentic-corpus-discoverability-and-deep-dive-hub.execution.plan.md)
- Source strategy:
  [agentic-corpus-discoverability-and-deep-dive-hub.plan.md](current/agentic-corpus-discoverability-and-deep-dive-hub.plan.md)
- Goal:
  - add an index-only hub under `.agent/reference/agentic-engineering/` (relocated 2026-04-22 to `.agent/research/notes/agentic-engineering/` per [PDR-032](../../practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md); merged into the lane README at `.agent/research/agentic-engineering/README.md` during the Session 8 rehoming pass per [rehoming plan](future/reference-research-notes-rehoming.plan.md))
  - create named research and reports lanes with reciprocal README links
  - make selected `/docs/**` entry points route into the wider source corpus
    without changing canon location
  - seed five deep-dive extracts that route back to canon, evidence, and
    source lanes
- Status: ✅ Complete
- Notes:
  - intentionally outside the numbered roadmap phase sequence
  - analysis remains the authoritative investigation/evidence lane; reports are
    formal promoted outputs only
  - final workspace gate caveat was external to this lane: `pnpm check`
    reached `knip` and then failed on an unrelated `estree` dependency issue
    in the concurrent `oak-eslint` change set

### Adjacent — Incoming Practice Context Integration and Write-Back

- Archived plan:
  [agent-collaboration-incoming-practice-context-integration.plan.md](archive/completed/agent-collaboration-incoming-practice-context-integration.plan.md)
- Goal:
  - integrate the incoming `agent-collaboration` Practice Context batch below
    Practice Core
  - capture the net-new gate/workspace-adoption doctrine in local pattern and
    engineering-doc surfaces
  - repair the concrete workspace task-export gap that the incoming analysis
    exposed
  - create a focused repo-targeted write-back pack under
    `.agent/practice-context/outgoing/agent-collaboration/`
- Status: ✅ Complete (archived reference)
- Notes:
  - most hydration/self-sufficiency material was already promoted locally, so
    this round intentionally keeps Practice Core unchanged
  - consolidation confirmed no further Practice Core or ADR promotion was
    needed, so the plan was archived on 2026-04-05

### Adjacent — Cross-Vendor Session Sidecars

- Strategic plan:
  [cross-vendor-session-sidecars.plan.md](future/cross-vendor-session-sidecars.plan.md)
- Goal:
  - define a local-first canonical sidecar model for structured session
    metadata across hook, wrapper, and importer adapters
  - keep vendor adapters thin and treat injected session context as derived,
    not authoritative
  - support durable repo labels, plan refs, workflow checkpoints, and handoff
    artefacts without depending on vendor-native session titles
- Status: 📋 Strategic reference (`future/`)
- Notes:
  - complements hooks portability rather than replacing it
  - not yet queued; promote when concrete multi-vendor session ergonomics
    justify executable work
  - adjacent to adapter generation, but not blocked on it

### Adjacent — External Pointer-Surface Integration (EPS)

- Strategic plan:
  [external-pointer-surface-integration.plan.md](future/external-pointer-surface-integration.plan.md)
- Goal:
  - treat Linear (and possibly GitHub Projects) as a peer pointer-surface to
    the repo's authoritative thread + landing model — not a mirror, not a
    duplicate plan store
  - structurally honest mapping: thread → Linear label (lifetime indefinite),
    landing → Linear issue (lifetime finite), repo → Linear project,
    navigation map → one Linear Document
  - infrastructure not ritual: passive Document plus active firing surface
    in `session-handoff.md` step 7c (four-step documentation walkthrough
    per PDR-029 as amended 2026-04-21 — *active means markdown-ritual,
    not code execution*) plus six-check stale-identity audit walkthrough
    in `/jc-consolidate-docs` step 7c (PDR-029 two-complementary-layers)
  - PII stays out of version control via gitignored
    `.agent/local/linear.local.json` with committed `.example.json` schema
- Status: 📋 Strategic reference (`future/`) — capture-only; Phase 0
  owner-gated decisions must ratify before promotion
- Captured: 2026-04-21 (Session opener arc; owner-ratified directives:
  long-term architectural excellence; threads must surface and never collapse;
  infrastructure not ritual; capture-only this turn)
- Notes:
  - intentionally outside the numbered phase sequence
  - one-way sync only: repo authoritative; Linear is derived
  - cadence: per-session-close on landing (PDR-026 emission event), matching
    Cursor's "visible without spam" principle
  - GitHub Projects assessed as marginal value given the org-internal
    visibility goal already covered by repo + Linear; deferred unless a
    public-roadmap need surfaces
  - PDR-027 amendment vs new external-pointer-surface PDR is a Phase 0
    decision (recommended: amend PDR-027)
  - register pointer:
    [`repo-continuity.md § Pending-graduations register § Infrastructure`](../../memory/operational/repo-continuity.md)

### Adjacent — Sentry Specialist Capability

- Strategic plan:
  [sentry-specialist-capability.plan.md](current/sentry-specialist-capability.plan.md)
- Goal:
  - add a canonical Sentry/OpenTelemetry reviewer, skill, and situational rule (ADR-129 triplet)
  - require live consultation of official Sentry and OpenTelemetry documentation as primary authority
  - scope includes Sentry SDK integration, OpenTelemetry instrumentation, distributed tracing, error tracking, MCP Insights, alerting, and performance monitoring
  - treat Vercel (Node.js) + `@sentry/node` as the default deployment context
- Status: 🔄 Active reference (`current/`)
- Notes:
  - third instantiation of the domain specialist triplet pattern (ADR-129)
  - intentionally outside the numbered phase sequence
  - collection-owned because it extends the agent capability model
  - must be created before or as the very first step of the Sentry integration
    ([sentry-otel-integration.execution.plan.md](../architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md))
    — so agents can review Sentry SDK usage as it's being written

### Adjacent — MCP Specialist Upgrade (MCP+)

- Strategic plan:
  [mcp-specialist-upgrade.plan.md](archive/completed/mcp-specialist-upgrade.plan.md)
- Goal:
  - upgrade existing `mcp-reviewer` from a general reviewer to a full ADR-129
    triplet (add skill, situational rule, live-spec-first doctrine)
  - include `@modelcontextprotocol/ext-apps` coverage (App Extensions, widget
    preview, iframe/CSP, host-specific behaviour)
  - require live consultation of the MCP specification and ext-apps docs
  - the MCP spec evolves rapidly — agents need current guidance, not cached knowledge
- Status: ✅ COMPLETE (current/, reference)
- Delivered:
  - `.agent/skills/mcp-expert/SKILL.md` — canonical active workflow skill with doctrine hierarchy, tiered context, capability routing
  - `.cursor/skills/mcp-expert/SKILL.md` and `.agents/skills/mcp-expert/SKILL.md` — platform wrappers
  - MCP quick-triage (#9) and worked example added to `invoke-code-reviewers.md`
  - Full wrapper parity audit across Cursor/Claude/Codex surfaces
  - Validation evidence: `subagents:check`, `portability:check`, `markdownlint:root` all passing
- Notes:
  - unlike ES/Clerk/Sentry, this upgraded an existing reviewer rather than creating from scratch
  - ext-apps remains within MCP specialist scope
  - intentionally outside the numbered phase sequence

### Adjacent — Express Specialist Capability

- Strategic plan:
  [express-specialist-capability.plan.md](future/express-specialist-capability.plan.md)
- Goal:
  - add a canonical Express reviewer, skill, and situational rule (ADR-129 triplet)
  - require live consultation of official Express 5.x documentation
  - Express 5 has breaking changes from v4 — agents frequently apply v4 patterns
  - scope includes middleware patterns, error handling, routing, req/res typing,
    and Vercel deployment specifics
  - treat Express 5.x on Vercel as the default deployment context
- Status: 📋 PLANNED (future/)
- Notes:
  - fourth instantiation of the domain specialist triplet pattern (ADR-129)
  - intentionally outside the numbered phase sequence
  - Vercel deployment context may warrant Vercel-specific subsections in the
    review checklist

### Adjacent — Cyber Security Specialist Capability

- Strategic plan:
  [cyber-security-specialist-capability.plan.md](future/cyber-security-specialist-capability.plan.md)
- Goal:
  - add a canonical cyber security reviewer, skill, and situational rule
    (ADR-129 triplet)
  - broad-remit security capability for threat models, defence in depth,
    supply-chain posture, secret lifecycle, and cross-system security trade-offs
  - explicitly complements rather than replaces the existing
    `security-reviewer`, which remains the practical default security specialist
- Status: 📋 PLANNED (future/)
- Notes:
  - intentionally outside the numbered phase sequence
  - broad-remit vs narrow-remit is a scope distinction, not a review-depth
    distinction
  - complements `security-reviewer` by taking the deeper doctrine and posture
    lens rather than the default exploitability-first pass

### Adjacent — Web/API Security Specialist Capability

- Strategic plan:
  [web-api-security-specialist-capability.plan.md](future/web-api-security-specialist-capability.plan.md)
- Goal:
  - add a canonical web/API security reviewer, skill, and situational rule
    (ADR-129 triplet)
  - narrow-remit security capability for HTTP trust boundaries, endpoint
    security, callbacks, sessions, CORS/CSRF, and API attack surfaces
  - explicitly complements the broad cyber security specialist, the practical
    `security-reviewer`, and framework specialists such as Express, Clerk, and
    MCP
- Status: 📋 PLANNED (future/)
- Notes:
  - intentionally outside the numbered phase sequence
  - narrow-remit does not imply shallow review; this specialist may still need
    deep reasoning and live-docs consultation
  - forms the security-boundary half of the planned security/privacy cluster

### Adjacent — Privacy Specialist Capability

- Strategic plan:
  [privacy-specialist-capability.plan.md](future/privacy-specialist-capability.plan.md)
- Goal:
  - add a canonical privacy reviewer, skill, and situational rule
    (ADR-129 triplet)
  - broad-remit privacy capability for privacy by design, minimisation,
    retention, redaction, and trust posture
  - establish a privacy lens that is distinct from exploitability-focused
    security review
- Status: 📋 PLANNED (future/)
- Notes:
  - intentionally outside the numbered phase sequence
  - broad-remit vs narrow-remit is a scope distinction, not a review-depth
    distinction
  - complements `security-reviewer` by taking privacy-governance correctness as
    the primary lens

### Adjacent — Web/API GDPR Specialist Capability

- Strategic plan:
  [web-api-gdpr-specialist-capability.plan.md](future/web-api-gdpr-specialist-capability.plan.md)
- Goal:
  - add a canonical web/API GDPR reviewer, skill, and situational rule
    (ADR-129 triplet)
  - narrow-remit capability for personal-data obligations at web/API boundaries:
    consent/preference semantics, deletion/export flows, retention signalling,
    and data-rights surfaces
  - complement both the broad privacy specialist and the narrow web/API
    security specialist
- Status: 📋 PLANNED (future/)
- Notes:
  - intentionally outside the numbered phase sequence
  - narrow-remit does not imply shallow review; this specialist may still need
    deep reasoning and live-docs consultation
  - forms the privacy-boundary half of the planned security/privacy cluster

### Adjacent — Oak Open Curriculum Ecosystem Specialist Capability (OOCE)

- Strategic plan:
  [ooce-specialist-capability.plan.md](future/ooce-specialist-capability.plan.md)
- Goal:
  - add a canonical Oak Open Curriculum Ecosystem reviewer, skill, and
    situational rule (ADR-129 triplet) — the avatar of the repo itself
  - specialist in the repo's own internal library contracts, composition
    patterns, and how the workspaces fit together
  - scope includes: `@oaknational/result` (Result<T, E>), `@oaknational/logger`
    (sink architecture, OTel format), `@oaknational/env` and `env-resolution`
    (env contracts), `@oaknational/type-helpers`, `@oaknational/sdk-codegen`
    (generated types, vocab generation), `@oaknational/curriculum-sdk` and
    `@oaknational/oak-search-sdk` (public API surface), and
    `@oaknational/eslint-plugin-standards` (custom lint rules)
  - enforce correct usage patterns: "use Result, not try/catch"; "inject Logger,
    don't construct"; "env contracts resolve at startup, not at call site"
  - authority source is the README and source of each internal package, not
    external documentation
- Status: 📋 PLANNED (future/)
- Notes:
  - the repo's own avatar — knows every internal package, every pattern,
    every gotcha, and how they compose
  - different from architecture reviewers (who care about boundaries and
    dependency direction) — this specialist cares about correct usage of
    internal APIs and patterns
  - intentionally outside the numbered phase sequence
  - the must-read tier will reference each internal package's README
  - scope boundary: "Are you using our libraries correctly?" vs
    architecture reviewers: "Is the dependency direction correct?"

### Adjacent — Planning Specialist Capability

- Strategic plan:
  [planning-specialist-capability.plan.md](current/planning-specialist-capability.plan.md)
- Goal:
  - add a canonical planning reviewer, skill, and situational rule (ADR-129 triplet)
  - specialist in plan architecture, lifecycle, discoverability, integration
    routing, and documentation sync requirements
  - enforce: correct template usage, required sections, phase gates, cross-reference
    maintenance, plan-vs-docs separation, integration routing register durability,
    archival hygiene, backlog health
  - authority source is plan templates, collection READMEs, and practice-core docs
- Status: ⏭️ QUEUED (promoted from future/ 2026-04-20)
- Promotion evidence:
  - plan-surface integration session (2026-04-20) required routing 8 candidates
    across a 60-artefact surface — specialist-level plan-routing complexity
  - planning architecture is stable (ADR-117, status legend, sync discipline)
  - owner approved promotion
- Notes:
  - intentionally outside the numbered phase sequence
  - complements docs-adr-reviewer (which owns ADR content) — this specialist
    owns plan structure and lifecycle

### Adjacent — TDD Specialist Capability

- Strategic plan:
  [tdd-specialist-capability.plan.md](future/tdd-specialist-capability.plan.md)
- Goal:
  - add a canonical TDD reviewer, skill, and situational rule (ADR-129 triplet)
  - multi-level TDD guidance scaled to task size: unit → integration → E2E →
    UI → smoke → contract
  - refined test level definitions aligned with industry terminology while
    keeping the "if it runs in CI, no IO" rule
  - the skill guides the testing approach at the START of work; the existing
    test-reviewer audits the result AFTER
  - covers the Red-Green-Refactor sequence at every level, anti-patterns
    (vi.mock, vi.stubGlobal, skipped tests), and test-level selection
- Status: 📋 PLANNED (future/)
- Notes:
  - intentionally outside the numbered phase sequence
  - refines and operationalises `.agent/directives/testing-strategy.md`
  - relationship to test-reviewer: TDD specialist guides approach,
    test-reviewer audits compliance
  - includes a **mutation testing sub-specialist** (Stryker JS) — focused on
    surviving mutant triage and remediation through better architecture and
    better tests, NOT through mutation-specific test hacks
  - prerequisite: terminology standardisation audit and remediation must
    complete before the triplet is created

### Adjacent — Developer Experience Specialist Capability (DVX)

- Strategic plan:
  [devx-specialist-capability.plan.md](future/devx-specialist-capability.plan.md)
- Goal:
  - add a canonical developer experience reviewer, skill, and situational rule
    (ADR-129 triplet)
  - four broad areas: working with the code (readability, error messages, naming),
    working with the repo (onboarding friction, script consistency, config
    ergonomics), working with the SDKs (API design, type ergonomics, progressive
    disclosure), working with the CLIs (flags, help text, progress, error output)
  - distinct lens from OOCE: OOCE asks "is it correct?", DevX asks "does it
    feel good to use?"
  - AI agent DX is a first-class concern (clear errors, structured output,
    deterministic behaviour)
- Status: 📋 PLANNED (future/)
- Notes:
  - intentionally outside the numbered phase sequence
  - complements OOCE (correctness) and onboarding-reviewer (first-time
    journey) with an ongoing daily friction lens
  - the repo's users include both humans and AI agents — DX applies to both

### Adjacent — Reviewer Gateway Upgrade (GW)

- Strategic plan:
  [reviewer-gateway-upgrade.plan.md](current/reviewer-gateway-upgrade.plan.md)
- Goal:
  - upgrade `code-reviewer` from a code quality reviewer that also triages
    to a Reviewer Gateway that also does baseline code quality
  - redesign the triage model from a flat checklist to a layered model
    (change category → domain signal → cross-cutting concerns) that scales
    to 20+ specialists
  - integrate review depth selection (deep vs focused per specialist)
  - add review coverage tracking across a session
  - rename directive, rule, and adapters (coordinated with taxonomy plan)
- Status: ⏭️ QUEUED (current/)
- Notes:
  - the gateway's role has outgrown its `code-reviewer` name
  - execution shares rename mechanics with the Agent Classification Taxonomy
    plan — should be coordinated
  - triage model redesign can be drafted independently of the rename

### Adjacent — Manifest-Driven Adapter Generation (AGN)

- Strategic plan:
  [adapter-generation.plan.md](future/adapter-generation.plan.md)
- Goal:
  - replace manual platform adapter maintenance with a manifest-driven
    generation script
  - single `specialist-manifest.yaml` defines each agent's platform-specific
    properties; `pnpm generate:adapters` produces all wrapper files
  - eliminates drift between canonical templates and platform adapters
  - reduces new specialist creation from 4–6 files to 1 manifest entry
  - makes the taxonomy rename (WS3) trivial — update manifest, regenerate
- Status: 📋 PLANNED (future/)
- Notes:
  - prerequisite optimisation for the taxonomy rename
  - at 25 specialists × 4 platforms = 100+ adapter files, manual maintenance
    is unsustainable
  - `portability:check` evolves from existence check to freshness check

### Adjacent — Agent Classification Taxonomy

- Strategic plan:
  [agent-classification-taxonomy.plan.md](future/agent-classification-taxonomy.plan.md)
- ADR: [ADR-135](../../../docs/architecture/architectural-decisions/135-agent-classification-taxonomy.md)
- Goal:
  - introduce `classification` field (`domain_expert`, `process_executor`, `specialist`) to all agents
  - add operational modes (`explore`, `advise`, `review`) as composable components
  - full rename of all agents (drop `-reviewer` suffix)
  - create Practice domain trio (`practice`, `practice-core`, `practice-applied`)
  - update validation, documentation, and platform adapters across all four platforms
  - define review depth dimension (deep/Opus vs focused/Haiku-Sonnet) with explicit selection criteria
  - integrate all specialist improvements into Practice Core documentation
- Status: 📋 Strategic (future/)
- Notes:
  - executes on a dedicated feature branch
  - success criterion: zero stale references to old names anywhere in repo
  - WS6 (review depth) and WS7 (Practice Core integration) added 2026-03-13

### Adjacent — Clerk Specialist Capability

- Status: ✅ Complete (2026-03-13)
- Goal:
  - add a canonical Clerk reviewer, skill, and situational rule (ADR-129 triplet)
  - require live consultation of official Clerk documentation as primary authority
  - treat Vercel (Express) + shared Clerk instance as the default deployment context
- Notes:
  - second instantiation of the domain specialist triplet pattern (ADR-129)
  - intentionally outside the numbered phase sequence
  - collection-owned because it extends the agent capability model

### Adjacent — Specialist Operational Tooling Layer

- ADR: [ADR-137](../../../docs/architecture/architectural-decisions/137-specialist-operational-tooling-layer.md)
- Goal:
  - extend domain specialist triplets with an optional fourth layer: agent-accessible CLI/MCP tools for live system interaction
  - Elasticsearch: extend search CLI with inspect/suggest commands
  - Clerk: adopt official `clerk/cli` or build custom CLI on `@clerk/backend`
- Status: 📋 Strategic (ADR accepted, no execution plan yet)
- Notes:
  - applies to any domain specialist with a live external system
  - design principles: structured JSON output, read-safe by default, reviewer-compatible findings
  - execution plans will be created per-domain when work is scheduled

### Adjacent — Harness Concepts Baseline Metrics (HC-0)

- Active plan:
  [active/phase-0-baseline-metrics.plan.md](active/phase-0-baseline-metrics.plan.md)
- Source strategy:
  [harness-concepts-adoption.plan.md](current/harness-concepts-adoption.plan.md)
- Goal:
  - evaluate harness-engineering concepts (docs freshness, entropy cleanup, quality scoring)
  - capture baseline metrics for adoption candidates
- Status: 📋 PLANNED
- Done when:
  - baseline metrics captured for docs freshness, entropy, and quality scoring
  - adoption/rejection decision recorded for each harness concept
  - documentation sync log records updates/no-change rationale
- Dependencies: Phase 0 complete

### Adjacent — Staged Doctrine Consolidation and Graduation ✅ ARC CLOSED

- Archived plan:
  [archive/completed/staged-doctrine-consolidation-and-graduation.plan.md](archive/completed/staged-doctrine-consolidation-and-graduation.plan.md)
- Final shape: eight-session arc (originally six; reshaped 6→7 at
  Session 6 close per PDR-026 §Deferral-honesty when reference-tier
  reformation became load-bearing; reshaped 7→8 at Session 7 close
  to separate rehoming from final arc-close). All 8 sessions landed.
- Status: ✅ CLOSED 2026-04-22 Session 8 (Merry / cursor / claude-opus-4-7)
- Landings of note across the arc:
  - 5 new portable PDRs: PDR-027 (Threads / Sessions / Identity);
    PDR-028 (Executive-Memory Feedback Loop); PDR-029 (Perturbation-
    Mechanism Bundle); PDR-030 (Plane-Tag Vocabulary); PDR-031
    (Build-vs-Buy Attestation Pre-ExitPlanMode); PDR-032 (Reference
    Tier as Curated Library)
  - PDR amendments: PDR-005 (source-side preservation); PDR-011
    (continuity surfaces); PDR-012 (reviewer-findings disposition
    discipline); PDR-014 (graduation-target routing); PDR-015 ×2
    (friction-ratchet + reviewer phases); PDR-019 (ADRs state WHAT);
    PDR-026 (per-session landing + deferral-honesty + landing-target
    definition); PDR-027 (workstream-collapse amendment)
  - ADR amendments: ADR-053; ADR-150
  - Rules: `no-verify-requires-fresh-authorisation`;
    `register-identity-on-thread-join`; `executive-memory-drift-capture`;
    `plan-body-first-principles-check`; `documentation-hygiene`
  - Principles: "Owner Direction Beats Plan"; "Misleading docs are
    blocking"; "Cardinal rule"
  - Reference tier reformation (PDR-032): 35 files relocated en
    bloc; rehoming first-drain pass executed Session 8 (22 MOVED + 4
    DELETED + 1 KEPT) — see archived
    [reference-research-notes-rehoming.plan.md](archive/completed/reference-research-notes-rehoming.plan.md)
  - Pattern graduations: `feel-state-of-completion-preceding-evidence-of-completion` (3/3 Sessions 4 + 5 + 7); inherited-framing-bias; passive-guidance; plus several outgoing-triage absorptions
  - Outgoing triage closed: `practice-context/outgoing/` contains
    only `README.md`
- Owner amendments at close (Session 7): `pnpm practice:fitness --strict-hard`
  exits-0 DoD requirement DROPPED for the arc; current fitness state
  HARD (4 hard, 10 soft) explicitly accepted as not-blocking; four
  directive files (`principles.md`, `AGENT.md`, `testing-strategy.md`,
  `continuity-practice.md`) carried forward as Due-but-not-blocking
  pending-graduations register entry, owner-appetite-triggered (no SLA)
- Dependencies: none

---

## Gap Analysis — Tech Stack vs Specialist Coverage (2026-03-14)

Full tech-stack inventory cross-referenced against the specialist roster.
Routing decisions are locked in — concerns are assigned to existing or planned
specialists, not deferred.

### Routed to existing/planned specialists

| Concern | Routed To | Rationale |
|---------|-----------|-----------|
| Zod 4.x patterns (env, OpenAPI, SDK, CLI) | OOCE | Internal validation pattern, not external service |
| Codegen pipeline (OpenAPI → types → Zod → SDK → vocab → MCP) | OOCE | Internal composition pattern |
| TypeDoc API doc generation | OOCE | Generated files concern |
| CI/CD config (GitHub Actions, semantic-release) | config-reviewer | CI config is tooling config |
| Vercel deployment specifics | Express specialist | Already in Express scope |
| Broad security posture and threat modelling | Cyber security specialist | Distinct from exploitability-first security review |
| HTTP/API boundary hardening | Web/API security specialist | Narrow trust-boundary and attack-surface expertise |
| Broad privacy-by-design posture | Privacy specialist | Distinct from exploitability-focused security review |
| Personal-data obligations at API boundaries | Web/API GDPR specialist | Narrow data-rights and retention-semantics expertise |
| Secrets lifecycle/rotation | security-reviewer | Security concern |
| Commander CLI framework | DevX specialist | CLI ergonomics (area 4) |

### No specialist needed

| Concern | Rationale |
|---------|-----------|
| Redis/ioredis caching | Surface area too small (few files in one CLI) |
| Hono framework | Pinned override, not actively used. Monitor. |
| Feature flags | Not used, not planned |
| Database migrations | No persistent DB |
| Message queues | Not used |
| Rate limiting | Not implemented; Express specialist when added |
| Analytics/telemetry | Not in repo scope |
| IaC/Terraform | Managed externally |
| Load/performance testing | No tooling exists yet; assess when introduced |

### Full specialist roster (target state)

**Important modelling note (2026-03-14)**:

- **Remit breadth** (`broad-remit` vs `narrow-remit`) is a different dimension
  from **engagement depth** (`deep` vs `focused`)
- agents are **not** synonymous with reviewers — the future taxonomy also
  supports advisory, research, and process-enabling roles
- the four new security/privacy additions are best understood as additive
  future specialist capabilities, not replacements for `security-reviewer`

**Always-on (invoked for every non-trivial change):**

- Reviewer Gateway (upgraded from code-reviewer)

**Standard roster (invoked when change profile matches):**

- type-reviewer, test-reviewer, docs-adr-reviewer, config-reviewer,
  security-reviewer, architecture reviewers (fred/barney/betty/wilma)

**Domain specialists (ADR-129 triplets, invoked on domain signal):**

- elasticsearch-reviewer ✅, clerk-reviewer ✅, mcp-reviewer ✅ (triplet complete),
  sentry specialist 🔄, express specialist 📋, cyber security specialist 📋,
  web/API security specialist 📋, privacy specialist 📋,
  web/API GDPR specialist 📋, ooce specialist 📋

**Practice/process specialists (invoked on methodology signal):**

- planning specialist ⏭️, tdd specialist 📋, devx specialist 📋

**Expansion support lanes (scale and coherence for the roster):**

- reviewer gateway upgrade ⏭️, practice/process structural improvements ⏭️,
  agent infrastructure portability remediation ⏭️, adapter generation 📋,
  agent classification taxonomy 📋

**Situational (on-demand, not tied to change profile):**

- release-readiness-reviewer, ground-truth-designer, subagent-architect,
  onboarding-reviewer

---

## Deferred Safety Work (Not in current phase sequence)

- Sandboxed execution rollout
- Prompt-injection red-team automation

These remain intentionally deferred until hallucination/evidence controls are
stable across at least two delivery cycles.

---

## Quality Gates

Use the canonical repository gate commands from repo root:

```bash
pnpm check
pnpm fix
```
