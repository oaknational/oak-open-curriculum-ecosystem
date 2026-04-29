# ADR-127: Documentation as Foundational Infrastructure

**Status**: Accepted
**Date**: 2026-03-07
**Related**: [ADR-125 (Agent Artefact Portability)](125-agent-artefact-portability.md), [ADR-124 (Practice Propagation Model)](124-practice-propagation-model.md), [ADR-058 (Context Grounding)](058-context-grounding-for-ai-agents.md), [ADR-060 (Tool Metadata System)](060-agent-support-tool-metadata-system.md)

## Context

This repository's documentation system is not supplementary text — it is the infrastructure that makes the repository function. Agent guidance, long-term memory, discovery modes, and operational workflows all depend on documentation paths resolving correctly. Without this infrastructure, the repository would not operate: agents could not ground themselves, rules would not propagate, and quality governance would have no mechanism for enforcement.

A concrete naming collision exposed this dependency. Three layers all used "rules":

| Layer                | Path                                        | Purpose                              |
| -------------------- | ------------------------------------------- | ------------------------------------ |
| Foundation directive | `.agent/directives/principles.md`           | Comprehensive engineering principles |
| Canonical rule files | `.agent/rules/*.md` (18 files)              | Individual enforceable extractions   |
| Platform adapters    | `.claude/rules/*.md`, `.cursor/rules/*.mdc` | Thin wrappers for IDE activation     |

When a canonical rule said `See .agent/directives/principles.md`, an agent could confuse it with `.agent/rules/` entries. When an instruction said "read the rules", three valid interpretations existed — the foundation document, the individual rule cards, or the platform adapters. This is not ambiguity; it is a routing defect in foundational infrastructure.

## Decision

### 1. Documentation is foundational infrastructure

Documentation in this repository encompasses complex, interacting systems of agent guidance, long-term memory, modes of discovery, and operational workflows. It must be treated with the same rigour as code:

- **Naming collisions are functional bugs**, not cosmetic issues
- **Cross-references are links in the infrastructure** — stale references are broken imports
- **Path clarity is a routing concern** — agents navigate by name, not institutional knowledge
- **Renames require the same discipline as code renames**: find all references, update all, verify with quality gates and specialist reviewers

### 2. Three-layer governance naming hierarchy

Adopt distinct names at each layer to make the hierarchy self-documenting:

| Layer          | Name        | Location                                    | Function                                                          |
| -------------- | ----------- | ------------------------------------------- | ----------------------------------------------------------------- |
| **Principles** | Foundation  | `.agent/directives/principles.md`           | The _why_ — authoritative engineering principles                  |
| **Rules**      | Enforcement | `.agent/rules/*.md`                         | The _what_ — individual enforceable items derived from principles |
| **Adapters**   | Activation  | `.claude/rules/*.md`, `.cursor/rules/*.mdc` | The _where_ — platform-specific thin wrappers                     |

### 3. Rename `.agent/directives/principles.md` → `.agent/directives/principles.md`

The foundation document is renamed to eliminate the three-way naming collision. All ~296 references across ~215 files are updated. The file's content is unchanged — only its name and heading change.

### 4. Automated enforcement

The portability validation script (`scripts/validate-portability.ts`) enforces that every canonical rule in `.agent/rules/` has adapters on all supported platforms. This was added as Check 7 in a prior change and prevents future orphaned rules.

## Rationale

### Why `principles.md`

Five alternatives were evaluated:

| Option           | Verdict    | Reasoning                                                                                                 |
| ---------------- | ---------- | --------------------------------------------------------------------------------------------------------- |
| `principles.md`  | **Chosen** | Cleanest hierarchy: principles → rules → adapters. Zero semantic overlap. Well-understood in engineering. |
| `policies.md`    | Rejected   | "Policy" leans organisational/business. The content is engineering-focused.                               |
| `standards.md`   | Rejected   | Collides with `eslint-plugin-standards` in the same repo.                                                 |
| `foundations.md` | Rejected   | Too vague — could mean anything.                                                                          |
| Do nothing       | Rejected   | Does not fix the functional routing defect.                                                               |

`principles.md` creates a hierarchy where an agent can reason about the distinction by name alone: principles define _why_ something matters, rules define _what_ must be done, adapters define _where_ enforcement happens.

### Why this warrants an ADR

The rename itself is mechanical. The conceptual shift is not. Establishing documentation as foundational infrastructure — with the same quality expectations as code — is an architectural decision that affects how every contributor and agent interacts with the repository. Without this framing, documentation naming is treated as cosmetic, and the same class of routing defect will recur.

## Consequences

### Positive

- **Unambiguous path resolution**: Agents can no longer confuse the foundation document with individual rule files or platform adapters
- **Self-documenting hierarchy**: The names _principles_, _rules_, and _adapters_ communicate the layer's function without requiring institutional knowledge
- **Documentation-as-infrastructure precedent**: Future documentation changes will be held to the same standard as code changes — naming precision, cross-reference integrity, quality-gate verification
- **Portability validation**: Automated enforcement ensures the adapter layer stays complete

### Negative

- **~296 references across ~215 files**: The rename touches canonical rules, skills, commands, ADRs, plans, prompts, sub-agents, practice docs, research files, memory, and archived content
- **External references break**: Any bookmarks or external links to `.agent/directives/principles.md` will break (mitigated by git history and the rename being within a private repository)

### Neutral

- **File content unchanged**: The principles document retains all its content — only the filename, heading, and first sentence change
- **Platform adapter directories unaffected**: `.claude/rules/` and `.cursor/rules/` are platform conventions; they retain the name "rules" because they contain individual enforceable items, which is semantically correct
- **No runtime impact**: This is a documentation-only change with no effect on TypeScript, tests, or build artifacts
