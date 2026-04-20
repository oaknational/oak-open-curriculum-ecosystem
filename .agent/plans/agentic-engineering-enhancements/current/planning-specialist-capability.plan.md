# Planning Specialist Capability — Strategic Plan

**Status**: QUEUED
**Domain**: Agentic Engineering Enhancements
**Pattern**: [ADR-129 (Domain Specialist Capability Pattern)](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)
**Promoted**: 2026-04-20 — owner approved promotion after plan-surface
integration session demonstrated specialist-level plan-routing complexity

## Problem and Intent

This repo has a sophisticated planning architecture: strategic plans, execution
plans, roadmaps, collection READMEs, milestone tracking, documentation sync
logs, and a plan lifecycle (future → current → active → archive). Agents
frequently:

- Create plans that don't follow the established structure
- Miss required sections (validation blocks, completion rules, phase gates)
- Put execution detail in strategic plans or strategy in execution plans
- Forget discoverability updates (roadmap, collection README, session prompts)
- Leave stale cross-references after plan moves
- Don't follow the plan-as-execution-instruction / docs-as-permanent-knowledge
  separation

## Scope

### In scope

- Plan architecture: strategic vs execution plans, lifecycle stages
- Plan templates and required sections
- Collection structure (README, roadmap, active/, current/, future/, archive/)
- Discoverability requirements (every plan reachable from at least 3 surfaces)
- Documentation sync requirements (ADR/directive updates before phase closure)
- Cross-reference maintenance after plan moves
- Plan fitness and scope (avoiding plan bloat, keeping plans executable)
- Milestone alignment and dependency tracking
- The `jc-consolidate-docs` workflow and when/how to apply it
- Evidence bundle requirements for non-trivial claims

### Out of scope

- Content of plans (architecture reviewers, domain specialists own correctness)
- Code quality within plan-driven work (code-reviewer owns this)
- ADR content and format (docs-adr-reviewer owns this)

## Doctrine Hierarchy

1. **Plan templates** — `.agent/plans/templates/` are the primary authority
   for plan structure
2. **Collection READMEs** — each collection's README defines the document
   roles and read order
3. **Practice documents** — `.agent/practice-core/practice.md` defines the
   knowledge flow and plan lifecycle
4. **Consolidation workflow** — `.agent/commands/consolidate-docs.md` defines
   the consolidation checklist
5. **Existing well-structured plans** — evidence of the pattern in practice

## Deliverables

1. Canonical reviewer template: `.agent/sub-agents/templates/planning-reviewer.md`
2. Canonical skill: `.agent/skills/planning-expert/SKILL.md`
3. Canonical situational rule: `.agent/rules/invoke-planning-reviewer.md`
4. Platform adapters (Claude, Cursor, Codex)
5. Discoverability updates
6. Validation

## Review Checklist (Draft)

1. **Structure**: Does the plan follow the correct template for its type?
2. **Lifecycle**: Is the plan in the right stage (future/current/active/archive)?
3. **Discoverability**: Is the plan linked from roadmap, collection README,
   and session prompt?
4. **Separation**: Does the plan contain execution only (no permanent docs)?
5. **Validation**: Does the plan have deterministic validation blocks?
6. **Completion rules**: Are phase gates and done-criteria explicit?
7. **Cross-references**: Are all internal links correct after any moves?
8. **Documentation sync**: Does the plan reference which ADRs/docs to update?
9. **Scope**: Is the plan focused and executable, not bloated?
10. **Dependencies**: Are dependencies and sequencing explicit?

## Promotion Evidence (2026-04-20)

All three promotion criteria are met:

1. **Plan quality issues are recurring** — the plan-surface integration
   session (2026-04-20) required routing 8 candidates across a 60-artefact
   surface, classifying each across 5 disposition types, updating 7 files,
   archiving 2 plans, creating 1 new plan, and recording a durable routing
   register. Owner observed this is the level of complexity that justifies
   a specialist. The `docs-adr-reviewer` handles documentation quality but
   lacks the plan-architecture lens (lifecycle stages, promotion triggers,
   scope-and-sequencing, density invariants, absorption-vs-new-plan
   decisions). Additionally, this session produced a new pattern candidate
   (`defer-decisions-must-live-where-the-candidate-lives`) that a planning
   specialist would catch structurally.
2. **Planning architecture has stabilised** — ADR-117 lifecycle, roadmap +
   active/current/future structure, status legend, documentation sync
   discipline are all stable and exercised across multiple collections.
3. **No conflicting work in progress** — the agent artefact layer is
   stable; the OAC plan is the only active plan and does not touch the
   specialist triplet surface.

## Scope Expansion: Plan-Surface Integration Routing

In addition to the original review checklist, the planning specialist
should cover:

11. **Integration routing**: When direction-of-travel or research work
    produces uplift candidates, does the routing register exist and is
    each candidate correctly classified (absorb / new plan / record-and-
    defer / route out)?
12. **Trigger condition durability**: For deferred candidates, is the
    trigger condition recorded co-located with the candidate (not only
    in a session plan or conversation)?
13. **Archival hygiene**: Are completed plans moved to `archive/completed/`
    promptly? Are their README entries updated?
14. **Backlog health**: Is the `future/` queue growing faster than items
    are being promoted or pruned?

## Next Execution Trigger

Promote to `active/` when the next available execution slot opens
(after OAC Phase 4 or in parallel if the agent artefact layer has
capacity).
