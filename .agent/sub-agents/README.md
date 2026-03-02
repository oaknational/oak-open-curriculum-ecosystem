# Sub-agent Prompt Architecture

This directory uses a three-layer structure to keep prompts simple, DRY, and maintainable.

## Layers

1. `components/` - small, reusable prompt building blocks.
2. `templates/` - assembled workflows composed from components.
3. Consumer prompt files (for example `.cursor/agents/*.md`) - thin wrappers that load templates and apply agent-specific persona/lens.

### Components Structure

- `components/principles/` - shared principles and guardrails.
- `components/architecture/` - shared architecture-team guidance.
- `components/behaviours/` - shared execution and review behaviour guidance.
  - includes `subagent-identity.md`, which templates must include so each sub-agent declares name, purpose, and a short purpose summary.

## Dependency Rules

- Components are leaf nodes: they MUST NOT depend on other components.
- Templates may depend on components.
- Consumer prompts should prefer templates over direct component wiring.
- If direct component usage is required, keep it explicit and minimal.

## Design Principles

- DRY: keep shared guidance in components/templates, not duplicated across agent prompts.
- YAGNI: only introduce abstractions/components that solve real, current duplication.

## Template Consistency Checklist

Before finalising changes to templates or wrappers:

- [ ] Mandatory reading requirements are explicit where needed for quality and consistency.
- [ ] Templates include the shared identity declaration component (`.agent/sub-agents/components/behaviours/subagent-identity.md`).
- [ ] Shared governance references are present and current (`.agent/directives/AGENT.md`, `.agent/directives/rules.md`).
- [ ] Domain-specific references are explicit and all paths resolve.
- [ ] Legacy generic agent names are not used in active guidance (for example, `architecture-reviewer`).
- [ ] Architecture reviewer wrapper descriptions are distinct and lens-specific.
- [ ] Standard quality roster and specialist on-demand roster are clearly separated in coordination docs.
- [ ] Consumer wrappers keep template loading as the first action.
- [ ] Components remain leaf nodes and templates remain the composition layer.
