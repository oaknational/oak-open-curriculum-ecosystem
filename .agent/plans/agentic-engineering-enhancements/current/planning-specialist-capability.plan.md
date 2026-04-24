# Planning Specialist Capability — Strategic Plan

**Status**: QUEUED
**Domain**: Agentic Engineering Enhancements
**Pattern**: [ADR-129 (Domain Specialist Capability Pattern)](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)
**Promoted**: 2026-04-20 — owner approved promotion after plan-surface
integration session demonstrated specialist-level plan-routing complexity
**Reconciled**: 2026-04-24 with
[Practice and Process — Structural Improvements](practice-and-process-structural-improvements.plan.md).
This plan is the canonical owner for the Planning expert triplet;
the structural-improvements plan supplies process-discipline
content and does not create a parallel `.agent/skills/planning/`
skill.

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
- Process discipline captured from distilled learning: discoverability plus
  actionability, narrative-first sequencing, narrative drift checks,
  parent-child reconciliation, CLI-first enumeration, local proof before owner
  asks, client-compatibility split-out, and dry-run workflow staging

### Out of scope

- Content of plans (architecture reviewers, domain specialists own correctness)
- Code quality within plan-driven work (code-reviewer owns this)
- ADR content and format (docs-adr-reviewer owns this)
- Creating a second generic planning skill at `.agent/skills/planning/`

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

The skill in item 2 is the only canonical Planning skill. It absorbs the
planning-discipline content listed below and is the surface templates should
reference when they need active planning guidance.

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

## Planning Discipline Scope Expansion

The structural-improvements plan identified planning discipline as a permanent
home gap in the Practice. This capability absorbs that content into the
Planning expert triplet:

- **Discoverable and actionable plans**: plans must be linked from the
  collection README, roadmap, and relevant session entry surface, and must carry
  status tracking, completion checklists, and deterministic validation.
- **Narrative-first sequencing**: on multi-workstream initiatives, write the
  ADR/README/narrative before the factory/infrastructure lane, then add
  consumers.
- **Narrative drift checks**: inspect body status prose, decision tables, and
  current-state descriptions, not just frontmatter todos and checkbox state.
- **Parent-child reconciliation**: if a child plan changes runtime truth,
  reconcile the parent plan and closure proof in the same session.
- **CLI-first enumeration**: when workstream sizing depends on repo-level
  mechanisms, search the repo and generic CLI surfaces before asking owner
  questions.
- **Local proof before owner asks**: produce locally reproducible evidence
  before requiring owner action for deployment or external validation lanes.
- **Split compatibility from validation**: client-specific compatibility issues
  discovered during deployment validation spin into their own follow-up plan.
- **Dry-run accumulated workflows**: run multi-step workflow recipes against the
  current accumulated state before committing to a staging order.

Boundary with `assumptions-reviewer`: assumptions review challenges
proportionality, blocking relationships, and whether a plan should exist in its
chosen shape. Planning review challenges lifecycle fit, discoverability,
template compliance, integration routing, and whether planning knowledge is in
the right permanent home. A complex plan may need both.

## Next Execution Trigger

Promote to `active/` when the next available execution slot opens
(after OAC Phase 4 or in parallel if the agent artefact layer has
capacity).
