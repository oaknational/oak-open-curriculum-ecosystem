---
plan_kind: strategic
lifecycle: future
collection: agent-tooling
title: Skills classification taxonomy
created: 2026-06-03
status: strategic
execution_note: |
  This is a strategic taxonomy brief. It defines the audience and governance
  split to preserve during later implementation, packaging, or plugin work.
  It is not an executable adapter-generation or platform-integration plan.
---

# Skills Classification Taxonomy

## Problem And Intent

The repo uses **skills** as a Practice workflow term, but adjacent work now
needs vocabulary for two different audiences: developers using Oak technical
services, and educators or teachers using Oak curriculum support. Platform
packaging also uses `SKILL.md`, which can make the host mechanism look like
the concept.

The intent is to keep those axes separate:

- **Repo-working skills** are Practice-governed workflows for agents working in
  this repo.
- **Oak developer capabilities** help agents or developers use Oak APIs, MCP,
  SDKs, search, graph, and data services correctly.
- **Curriculum assistance capabilities** help agents serve teachers and
  educators through curriculum discovery, lesson planning, guidance,
  playbooks, evidence, or pedagogical explanation.

The taxonomy exists to prevent Practice-governance vocabulary leaking into
external developer or teacher-facing contexts, while still allowing any of the
three categories to be packaged as platform skills later.

## Mechanism And Means

The durable vocabulary home is
[`agent-capability-vocabulary.md`](../../../memory/executive/agent-capability-vocabulary.md).
It is executive memory because agents look it up when deciding where a new
agent-readable knowledge surface belongs.

Future execution should:

1. Audit existing uses of "skill", "capability", "developer", "teacher",
   "educator", "MCP", "search", and "curriculum" across live docs and plans.
2. Apply the executive vocabulary to ambiguous docs by replacing mechanism-led
   wording with audience-led wording.
3. Cross-reference related doctrine rather than duplicating it:
   [PDR-051][pdr-051] for platform skills, [PDR-010][pdr-010] for specialist
   capabilities, and [ADR-125][adr-125] for canonical/adapter mechanics.
4. Preserve the boundary between this taxonomy and Antigravity or other host
   integration work. Host support can constrain packaging, not the category
   names.

[pdr-051]: ../../../practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md
[pdr-010]: ../../../practice-core/decision-records/PDR-010-domain-specialist-capability-pattern.md
[adr-125]: ../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md

## Dependencies And Non-Goals

**Blocking prerequisite:** owner acceptance of the three-category vocabulary in
the executive contract.

**Beneficial prerequisite:** a later platform-integration pass may discover
host-specific naming constraints. The minimum shippable taxonomy still stands
without that pass: platform constraints are recorded as packaging notes only.

**Non-goals:**

- No changes to MCP tool schemas, SDK types, runtime behaviour, or package
  exports.
- No Antigravity, Claude, Codex, Cursor, or Gemini adapter implementation.
- No rename of existing repo-working skills.
- No merge into the sub-agent classification taxonomy; that plan classifies
  agents, while this one classifies audience-facing knowledge and workflow
  categories.

## Acceptance Criteria

- Existing docs can describe a new agent-readable surface without using
  unqualified "skills" outside repo-working Practice workflows.
- Developer-facing Oak service guidance is nameable without implying it is part
  of repo Practice governance.
- Teacher or educator-facing curriculum assistance is nameable without exposing
  repo, platform, or Practice implementation mechanics.
- Platform `SKILL.md` support is treated as packaging unless it reveals a real
  audience or governance constraint.
- The future plan index points at this plan as the owner of the taxonomy lane.

## Promotion Trigger

Promote this plan to `current/` when a concrete doc, plugin, MCP guidance, or
agent-facing package needs the taxonomy applied across multiple files, or when
owner direction asks for a repo-wide terminology pass.
