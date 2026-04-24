---
name: "Practice and Process — Structural Improvements"
overview: >
  Fill structural gaps in the Practice's guidance system
  revealed by distilled.md graduation analysis. Supports a
  Practice-first execution mode: create the collaboration directive,
  confirm the Planning handoff, complete non-Planning distilled
  graduation, and land agent artefact portability remediation while
  deferring Planning expert artefacts and bulk/codegen DRY work to
  their owning plans.
todos:
  - id: behavioural-directive
    content: "Create behavioural/collaboration directive"
    status: completed
  - id: planning-discipline
    content: "Confirm planning-discipline handoff to planning specialist plan"
    status: completed
  - id: portability-pdr
    content: "Amend portability PDR (genotype) and ADR (phenotype)"
    status: completed
  - id: distilled-final-graduation
    content: "Graduate non-planning distilled process entries to new homes"
    status: completed
isProject: false
---

# Practice and Process — Structural Improvements

## Source Strategy

- Distilled.md graduation analysis (2026-04-22 consolidation)
- Owner feedback on systemic gaps in guidance categories
- [Planning specialist capability](planning-specialist-capability.plan.md) —
  canonical owner for the Planning reviewer / skill / rule triplet
- [Portability remediation plan](agent-infrastructure-portability-remediation.plan.md) —
  Phase 5 (ADR-125 amendments) is a dependency for the
  portability PDR/ADR work here

## Context

Distilled.md graduation exposed that several categories of
guidance have no proper permanent home in the Practice. Items
resisted classification not because they were edge cases but
because the bucket system has structural gaps. This plan fills
those gaps so knowledge flows to permanent homes instead of
accumulating in the refinement layer.

The owner's framing: "The question is not 'what should we do
with these individual cases' — it is 'where are there
conceptual tensions and gaps in the systems of the Practice
and its application.'"

## Execution Setting: Practice-First

Current owner direction allows this plan to execute the Practice
enhancement work while deferring Planning expert implementation.
That means:

- **Do now**: Phase 1 (collaboration directive) and the
  collaboration-specific parts of Phase 4 (distilled graduation
  into the new Practice home).
- **Do only as handoff**: keep the planning-discipline gap and
  source material routed to
  [Planning specialist capability](planning-specialist-capability.plan.md).
- **Do after dependency**: Phase 3 (portability PDR/ADR) waits for
  the portability-remediation documentation/adapter dependency, unless
  it is executed deliberately in parallel with that plan.
- **Do not do in this pass**: create or edit the Planning reviewer,
  Planning skill, Planning invocation rule, or plan-template
  references to a Planning skill.

Practice-first remediation completion is valid when the collaboration
directive, Planning handoff, portability remediation, non-Planning
distilled graduation, and explicit bulk/codegen deferral are landed.
Planning specialist artefacts remain deferred to their owning plan.
Bulk/codegen DRY remediation remains deferred to the SDK codegen
decomposition plan for a separate session.

---

## Phase 1: Behavioural/Collaboration Directive

**Gap**: No directive covers the agent-human collaboration
model. Behavioural norms (scope discipline, risk
classification, dialogue model, discovery-based onboarding)
are scattered in distilled.md as "User Preferences" — a lazy
category that fails to recognise what they are.

**Deliverable**: `.agent/directives/collaboration.md` — the
agent-human working model.

**Content** (drawn from distilled + owner feedback):

- **Collaboration model**: dialogue and questions, not
  authority hierarchy. The agent constructively challenges
  what seems wrong. The owner typically wants communication,
  not compliance. Overrides are rare, not default.
- **Scope discipline**: respect stated boundaries precisely.
  Surface follow-on work; never silently expand scope.
- **Risk classification**: agents classify severity and
  describe impact; agents do not accept risks or defer items
  on behalf of the owner. Risk acceptance is a human decision.
- **Feedback model**: apply feedback fully when given, but
  do not blindly follow something believed to be wrong or
  damaging. The correct approach is discussion.
- **Discovery-based onboarding**: README-only start,
  motivation-described personas.
- **Archive discipline**: archive docs are historical records
  — never update them.

**Acceptance**:

- Directive exists and is referenced from AGENT.md
- Platform rule adapters created for current validated surfaces
  (`.claude/rules/`, `.cursor/rules/`)
- `.agents/rules/` parity remains owned by the portability
  remediation plan unless full `.agents/rules/` coverage lands first
- Collaboration-specific distilled §User Preferences and
  §Fitness Management entries graduate to the new directive
- `pnpm portability:check` passes

## Phase 2: Planning Discipline Handoff

**Gap**: Plan templates provide structural guidance (what a
plan looks like) but no process guidance (how to plan well).
The missing planning skill and specialist are already captured
by the dedicated Planning specialist capability plan. In
Practice-first mode this phase is a handoff boundary, not an
implementation phase.

**Reconciled ownership**: this plan owns the structural gap
analysis and the graduation route for planning discipline. The
dedicated [Planning specialist capability](planning-specialist-capability.plan.md)
plan owns creation of the ADR-129 expert triplet:
`.agent/sub-agents/templates/planning-reviewer.md`,
`.agent/skills/planning-expert/SKILL.md`, and
`.agent/rules/invoke-planning-reviewer.md`. Do not create a
parallel `.agent/skills/planning/SKILL.md`.

**Practice-first deliverable**: the handoff is complete when this
plan and the Planning specialist capability plan agree on ownership,
scope, and deferral. No Planning artefact creation is required here.

**Deferred deliverables owned by the Planning specialist plan**:

1. Extend the `planning-expert` skill scope so it covers:
   - Plans must be discoverable (linked from README, roadmap)
     AND actionable (status tracking, completion checklists)
   - Lead with narrative, not infrastructure (WS-0 narrative
     → WS-1 factory → WS-2+ consumers)
   - Narrative sections drift first — check prose, not just
     checkboxes
   - Reconcile parent when child changes runtime truth
   - CLI-first enumeration before sizing workstreams
   - Validation closures: produce locally-producible evidence
     first
   - Split client-compatibility out of deployment-validation
   - Dry-run multi-step workflows against accumulated state

2. Add process guidance to plan templates after the Planning skill
   exists and has one canonical path.

3. Record the expert boundary: `assumptions-reviewer` challenges
   proportionality and blocking legitimacy, while
   `planning-reviewer` reviews plan architecture, lifecycle,
   discoverability, and integration routing. The two are
   complementary, not substitutes.

**Acceptance**:

- Planning specialist plan names this plan as the source of the
  process-discipline expansion
- The only Planning skill path is
  `.agent/skills/planning-expert/SKILL.md`
- This plan does not create `.agent/skills/planning/SKILL.md`
- Practice-first execution does not create or edit
  `.agent/skills/planning-expert/SKILL.md`,
  `.agent/sub-agents/templates/planning-reviewer.md`,
  `.agent/rules/invoke-planning-reviewer.md`, or plan-template
  references to the Planning skill
- Distilled §Process entries that describe planning discipline
  remain routed to the Planning specialist plan until that plan
  executes
- Remaining process entries (pre-commit hooks, reviewer
  dispositions, paginated artefacts, reference model
  tightening, package-local vs root-gate, repeated
  rationalisation, gate-pass distinction) assessed for proper
  homes: some are operational rules (→ `.agent/rules/`), some
  are testing doctrine (→ testing-strategy.md), some are
  general principles (→ principles.md)

## Phase 3: Portability PDR and ADR

**Gap**: Cross-platform agent infrastructure principles exist
only as distilled entries. The general principles need a PDR
(genotype — portable across Practice-bearing repos); the
repo-specific application needs an ADR (phenotype — how those
principles manifest in this repo).

**Dependency**: The portability remediation plan Phase 5
(ADR-125 amendments) should land first or in parallel — the
ADR here extends ADR-125 or creates a companion.

**Resolved route (2026-04-24)**: no new PDR or ADR was needed. The
scope was adjacent to existing doctrine, so PDR-009 and ADR-125 were
amended directly.

**Deliverables**:

1. **PDR amendment** in `.agent/practice-core/decision-records/` —
   general portability principles:
   - Canonical content in a single location
   - Thin platform adapters everywhere else
   - Validation must be bidirectional (forward + reverse)
   - Thin-wrapper form must be enforced, not just existence
   - Cross-platform standard directories (`.agents/`) are
     adapter targets, not canonical locations

2. **ADR amendment** — this repo's application:
   - `.agent/` is canonical, `.agents/` / `.claude/` /
     `.cursor/` / `.codex/` / `.gemini/` are adapters
   - 7+ adapter types per new artefact
   - `pnpm portability:check` is the enforcement gate
   - Codex adapter descriptions must match exactly
   - Platform-neutral inputs for cross-platform probes
   - Self-applying acceptance for tripwire installs

**Acceptance**:

- PDR-009 amended
- ADR-125 amended
- Distilled §Architecture (Agent Infrastructure) entries
  graduate to the PDR/ADR
- `pnpm portability:check` passes

## Phase 4: Distilled Graduation

After the Practice-first homes exist, graduate the non-planning
distilled entries:

- §User Preferences → Phase 1 collaboration directive
- §Process operational entries → assess for rules, testing
  strategy, or principles
- §Architecture (Agent Infrastructure) → Phase 3 PDR/ADR
- §Build System "verify fixes on disk" → assess: rule
  candidate or general principle
- §Repo-Specific "generators duplication" → routed to the
  decomposition plan for a separate session; this plan does not
  touch bulk/codegen DRY remediation

**Deferred planning entries**: §Process planning entries remain
routed to the Planning specialist plan. They graduate to the
Planning expert skill and/or template guidance only when that plan
executes.

**Practice-first target**: distilled.md contains only entries that
are still validating, have no natural permanent home yet, or are
explicitly deferred to the Planning specialist plan. After the
Planning specialist plan lands, rerun this phase for the deferred
planning entries.

**Completion note (2026-04-24)**: collaboration-specific entries
graduated to the collaboration directive; operational process entries
graduated to rules and existing doctrine; portability entries
graduated to PDR-009 and ADR-125; build-system entries graduated to
`docs/engineering/build-system.md`; repo-specific generator duplication
is explicitly routed to the SDK codegen decomposition plan.

**Review note (2026-04-24)**: no reviewer or sub-agent dispatch was
performed because this Codex session did not have explicit user
authorisation for reviewer dispatch. Manual checks covered scope
discipline, Planning/bulk-codegen exclusions, portability validator
coverage, ADR/PDR/doc routing, Sentry-session preservation, and quality
gate output. Residual gap: no independent assumptions/docs-ADR specialist
review was run.

---

## Sequencing

Phase 1 and Phase 2 are complete. Phase 3 was deliberately paired with
portability remediation. Phase 4 is complete for all non-Planning
entries.

Remaining closures are outside this plan:

- **Full planning graduation** depends on the Planning specialist
  capability plan creating the canonical Planning skill before any
  template references are edited.
- **Bulk/codegen DRY remediation** depends on the SDK codegen
  decomposition plan and must happen in a separate implementation
  session.
- **Practice fitness size consolidation** remains a separate doctrine
  compression task. Fitness warnings must be analysed and routed, not
  addressed by opportunistic trimming during this remediation slice.

## Relationship to Other Plans

- [Planning specialist capability](planning-specialist-capability.plan.md) —
  owns the Planning expert triplet and deferred planning-discipline
  implementation; this plan supplies the source material and
  prevents a duplicate Planning skill from forming
- [Portability remediation](agent-infrastructure-portability-remediation.plan.md) —
  executed alongside Phase 3 here; this plan now extends that closure
- [sdk-codegen-workspace-decomposition](../../architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md) —
  owns the deferred generator duplication work; no bulk/codegen DRY
  edits are part of this plan
- [Aggregated tool result-type remediation](../../sdk-and-mcp-enhancements/aggregated-tool-result-type-remediation.plan.md) —
  split out as independent MCP product work
