---
name: patterns
classification: passive
description: >-
  Check .agent/practice-core/patterns/ (general abstractions) and
  .agent/memory/patterns/ (repo-local instances) for known solutions
  to recurring design problems before inventing a new approach.
  Triggered when facing code, architecture, process, testing, or
  agent infrastructure decisions.
---

# Patterns

When you identify a design problem -- whether it involves type-safety, system boundaries, engineering workflows, test design, or agent infrastructure -- check the pattern surfaces for known solutions before inventing a new approach.

**Two surfaces, distinct roles** (per PDR-007):

- **`.agent/practice-core/patterns/`** — general, ecosystem-agnostic abstract patterns that travel with the Practice Core. Read here first: if a general pattern already names your class of problem, it prevents re-inventing the abstraction.
- **`.agent/memory/patterns/`** — specific, ecosystem-grounded pattern instances proven in this repo (TypeScript, Zod, Vitest, MCP, etc.). Read here second: instances show how the general pattern is expressed concretely in this stack.

**Not here**: Practice-governance patterns (review discipline, planning discipline, reviewer authority, etc.) live as PDRs in `.agent/practice-core/decision-records/`, not in either patterns directory. If your question is about how the Practice itself operates, consult the PDR index.

## When to Use

- You are about to write an `as` cast or type assertion
- You are designing a validation boundary
- You see a runtime conversion that mirrors a compile-time type
- You encounter a function returning a claimed type for unvalidated data
- A reviewer flags assertion pressure or type widening
- You are deciding how to structure module boundaries or re-exports
- You are evaluating whether to adopt a library or roll your own
- You are designing agent infrastructure (skills, rules, commands, platform adapters)
- You are writing tests and considering mock or fake strategies
- You are structuring a plan, README, or documentation artefact

## Steps

1. Read `.agent/practice-core/patterns/README.md` first for general abstractions that travel with the Core.
2. Read `.agent/memory/patterns/README.md` for repo-local instances.
3. Match the current problem against each pattern's `use_this_when` field.
4. If a pattern matches, read its full file and apply the approach. When a specific instance matches but the general form also exists, the general pattern names the principle; the instance shows one concrete expression.
5. If the question is about how the Practice itself operates (review, planning, reviewer authority, etc.), consult `.agent/practice-core/decision-records/README.md` instead — Practice-governance substance is PDR-shaped, not pattern-shaped.
6. If nothing matches, proceed normally -- do not force a fit.

## Important

This skill is not always-active. It triggers when an engineer or agent encounters a design problem across any of the five pattern categories (code, architecture, process, testing, agent). It is a discovery mechanism, not a mandate.
