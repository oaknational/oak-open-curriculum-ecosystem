---
name: "Practice and Process — Structural Improvements"
overview: >
  Fill structural gaps in the Practice's guidance system
  revealed by distilled.md graduation analysis. Creates
  missing directive, skill, and PDR/ADR surfaces so that
  process knowledge has proper permanent homes instead of
  accumulating in distilled.md.
todos:
  - id: behavioural-directive
    content: "Create behavioural/collaboration directive"
    status: pending
  - id: planning-discipline
    content: "Create planning discipline skill and update templates"
    status: pending
  - id: portability-pdr
    content: "Author portability PDR (genotype) and ADR (phenotype)"
    status: pending
  - id: distilled-final-graduation
    content: "Graduate remaining distilled process entries to new homes"
    status: pending
isProject: false
---

# Practice and Process — Structural Improvements

## Source Strategy

- Distilled.md graduation analysis (2026-04-22 consolidation)
- Owner feedback on systemic gaps in guidance categories
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
- Platform rule adapters created (`.claude/rules/`,
  `.cursor/rules/`, `.agents/rules/`)
- Distilled §User Preferences and §Fitness Management entries
  graduate to the new directive
- `pnpm portability:check` passes

## Phase 2: Planning Discipline

**Gap**: Plan templates provide structural guidance (what a
plan looks like) but no process guidance (how to plan well).
No planning skill exists. No planning specialist sub-agent
exists.

**Deliverable**: Three artefacts:

1. `.agent/skills/planning/SKILL.md` — planning discipline
   skill covering:
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

2. **Plan template updates** — add process guidance section
   to active-atomic and feature-workstream templates

3. **Planning expert sub-agent** (optional, assess need) —
   a specialist that reviews plan structure, sequencing, and
   discoverability. Assess whether the existing
   `assumptions-reviewer` covers this or a dedicated agent
   adds value.

**Acceptance**:

- Skill exists with platform adapters
- Templates reference the skill
- Distilled §Process entries that describe planning discipline
  graduate to the skill
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

**Deliverables**:

1. **PDR** in `.agent/practice-core/decision-records/` —
   general portability principles:
   - Canonical content in a single location
   - Thin platform adapters everywhere else
   - Validation must be bidirectional (forward + reverse)
   - Thin-wrapper form must be enforced, not just existence
   - Cross-platform standard directories (`.agents/`) are
     adapter targets, not canonical locations

2. **ADR amendment or companion** — this repo's application:
   - `.agent/` is canonical, `.agents/` / `.claude/` /
     `.cursor/` / `.codex/` / `.gemini/` are adapters
   - 7+ adapter types per new artefact
   - `pnpm portability:check` is the enforcement gate
   - Codex adapter descriptions must match exactly
   - Platform-neutral inputs for cross-platform probes
   - Self-applying acceptance for tripwire installs

**Acceptance**:

- PDR authored, accepted, indexed
- ADR-125 amended or companion ADR created
- Distilled §Architecture (Agent Infrastructure) entries
  graduate to the PDR/ADR
- `pnpm portability:check` passes

## Phase 4: Final Distilled Graduation

After Phases 1-3 create the new homes, graduate the remaining
distilled entries:

- §User Preferences → Phase 1 collaboration directive
- §Process planning entries → Phase 2 planning skill
- §Process operational entries → assess for rules, testing
  strategy, or principles
- §Architecture (Agent Infrastructure) → Phase 3 PDR/ADR
- §Build System "verify fixes on disk" → assess: rule
  candidate or general principle
- §Repo-Specific "generators duplication" → remains until
  the decomposition plan executes (active known issue)

**Target**: distilled.md contains only entries that are
genuinely still validating or have no natural permanent home
yet — the refinement layer, not a destination.

---

## Sequencing

Phases 1-3 can proceed in parallel (independent deliverables).
Phase 4 depends on Phases 1-3.

## Relationship to Other Plans

- [Portability remediation](agent-infrastructure-portability-remediation.plan.md) —
  Phase 3 here depends on/extends Phase 5 there
- [sdk-codegen-workspace-decomposition](../../architecture-and-infrastructure/codegen/future/sdk-codegen-workspace-decomposition.md) —
  the generator duplication entry in distilled remains until
  that plan executes
- [Aggregated tool result-type remediation](../../sdk-and-mcp-enhancements/aggregated-tool-result-type-remediation.plan.md) —
  split out as independent MCP product work
