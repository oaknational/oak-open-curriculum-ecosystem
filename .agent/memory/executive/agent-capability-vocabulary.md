---
fitness_line_target: 90
fitness_line_limit: 130
fitness_char_limit: 8500
fitness_line_length: 100
split_strategy: "Keep as vocabulary; detailed platform mechanics live in ADRs/PDRs/plans."
---

# Agent Capability Vocabulary

Stable vocabulary for deciding what kind of agent-readable knowledge surface a
new artefact is. Use this when adding or naming skills, specialist guidance,
Oak developer support, plugin content, MCP guidance, or teacher-facing
curriculum assistance.

## Canonical Categories

### Repo-working Skill

Audience: agents working in this repo.

Governance owner: Practice / repo agentic engineering.

Use for named workflows such as start-right, planning, gates, handoff,
curation, commits, and merge support. Do not use for Oak service usage
guidance or teacher-facing curriculum help.

### Oak Developer Capability

Audience: internal or external developers, and agents helping them.

Governance owner: Oak engineering / developer experience.

Use for guidance around Oak APIs, SDKs, MCP servers, search, graph, data
services, local developer workflows, and package use. Do not use for repo
Practice governance, teacher lesson-planning value, or platform adapter
mechanics.

### Curriculum Assistance Capability

Audience: teachers, educators, and agents serving them.

Governance owner: curriculum/product domain, with engineering support.

Use for lesson planning, curriculum discovery, pedagogical guidance, evidence
use, presentation/playbook support, and teacher-facing explanation. Do not use
for repo contribution workflows, adapter generation, or developer-only service
setup.

## Naming Rules

- Use unqualified **skill** only for repo-working Practice workflows.
- Use **Oak developer capability** for developer-facing service knowledge, even
  when the eventual delivery vehicle is a platform skill or plugin.
- Use **curriculum assistance capability** for teacher or educator-facing
  flows, even when they are implemented through MCP tools, prompts, resources,
  playbooks, or host skills.
- Treat `SKILL.md`, `.agents/skills/`, `.claude/skills/`, and similar host
  surfaces as packaging mechanics. They do not define the conceptual category.
- Qualify mixed surfaces by audience first, then mechanism. For example:
  "Oak developer capability packaged as a Codex skill", not "developer skill"
  unless the local context has already narrowed "skill" to platform packaging.

## Boundary Tests

Ask these before naming or placing a new artefact:

1. **Who benefits directly?** Repo agent, Oak developer, or teacher/educator.
2. **What authority should travel with it?** Practice governance, Oak service
   contract, or curriculum/product guidance.
3. **What is the delivery vehicle?** Skill adapter, plugin, MCP tool, resource,
   prompt, playbook, doc, or package.

If answers 1 and 3 differ, name by answer 1 and document answer 3 as packaging.

## Related Doctrine

- [PDR-051](../../practice-core/decision-records/PDR-051-vendor-agnostic-skills-standardisation.md)
  owns platform skill standardisation and adapter mechanics.
- [PDR-010](../../practice-core/decision-records/PDR-010-domain-specialist-capability-pattern.md)
  owns specialist capability triplets and agent classification.
- [ADR-125](../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
  owns the canonical content / platform adapter model.
- [Curriculum Tools, Guidance and Playbooks][curriculum-tools] owns the current
  deterministic guidance, playbook, and command-registry vocabulary for
  curriculum-facing MCP surfaces.

[curriculum-tools]: ../../../docs/governance/curriculum-tools-guidance-and-playbooks.md
