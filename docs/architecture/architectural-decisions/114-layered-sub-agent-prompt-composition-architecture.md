# ADR-114: Layered Sub-agent Prompt Composition Architecture

**Status**: Accepted
**Date**: 2026-02-21
**Related**: [ADR-060 (Agent Support Metadata System)](060-agent-support-metadata-system.md), [ADR-065 (Turbo Task Dependencies)](065-turbo-task-dependencies.md)

## Context

Sub-agent prompts in `.cursor/agents/` grew through incremental change. Shared review logic, principles, and workflow guidance were duplicated across multiple files. This created three recurring problems:

1. **Drift risk**: equivalent instructions diverged over time.
2. **High update cost**: one policy change required editing many prompt files.
3. **Unclear dependency shape**: no explicit boundary between reusable prompt parts and final agent wrappers.

The repository needed a structure that preserves current behaviour while reducing duplication and keeping future prompt evolution simple.

## Decision

Adopt a three-layer prompt composition architecture in `.agent/sub-agents/`:

1. **Components** (`.agent/sub-agents/components/`)
   - Small, reusable prompt building blocks.
   - Must be leaf nodes: **components do not depend on other components**.

2. **Templates** (`.agent/sub-agents/templates/`)
   - Canonical, full workflow prompts assembled from components.
   - May depend on components.

3. **Consumer sub-agent files** (`.cursor/agents/*.md`)
   - Thin wrappers containing agent identity, trigger metadata, and model selection.
   - Should load templates as first-class source.
   - Direct component use is allowed only when explicitly necessary.

This structure is documented in `.agent/sub-agents/README.md`.

## Dependency Rules

- `components/*` -> no local dependencies.
- `templates/*` -> may reference `components/*`.
- `.cursor/agents/*` -> should reference `templates/*` (preferred).

This creates a simple, acyclic relationship tree and makes prompt reuse explicit.

## Scope of Migration

- Canonical prompt content moved into `.agent/sub-agents/templates/*`.
- Shared DRY/YAGNI guidance moved to `.agent/sub-agents/components/principles/dry-yagni.md`.
- Shared architecture reviewer team guidance moved to `.agent/sub-agents/components/architecture/reviewer-team.md`.
- `.cursor/agents/*.md` simplified into thin wrappers that reference templates.
- Compatibility aliases removed; canonical references are:
  - `.agent/sub-agents/templates/code-reviewer.md`
  - `.agent/sub-agents/components/principles/dry-yagni.md`

## Rationale

### Why this design

- **DRY**: shared content lives once in templates/components.
- **YAGNI**: only two foundational component types introduced (principles, architecture team) based on real duplication.
- **Operational simplicity**: most edits now happen in one template file rather than many wrappers.
- **Safety**: wrappers remain stable identity/model entry points while canonical behaviour is centralised.

### Why not alternatives

- **Directly duplicating in wrappers**: rejected due to drift and maintenance overhead.
- **Component-only system without templates**: rejected as too granular for daily editing and slower to reason about.
- **Runtime prompt assembly tooling**: rejected as unnecessary complexity for current needs.

## Consequences

### Positive

- Faster, safer updates to shared agent behaviour.
- Lower risk of prompt inconsistency.
- Clear separation between identity/dispatch (`.cursor/agents`) and canonical logic (`templates`).
- Easier onboarding for contributors editing sub-agents.

### Trade-offs

- Requires maintainers to understand one extra abstraction layer.
- Path references must remain accurate between wrappers, templates, and components.

## Guardrails

- Prefer template changes over wrapper duplication.
- Add new components only when current, concrete duplication exists.
- Keep wrappers thin and identity-focused.
- Keep component dependencies flat (leaf-only).

## References

- `.agent/sub-agents/README.md`
- `.agent/sub-agents/components/principles/dry-yagni.md`
- `.agent/sub-agents/components/architecture/reviewer-team.md`
- `.agent/sub-agents/templates/`
- `.cursor/agents/`
