---
name: patterns
classification: passive
description: >-
  Check .agent/memory/active/patterns/ for repo-grounded pattern
  instances and .agent/practice-core/decision-records/ for
  Practice-governance patterns (PDRs with pdr_kind: pattern) before
  inventing a new approach. Triggered when facing code, architecture,
  process, testing, or agent infrastructure decisions.
---

# Patterns

When you identify a design problem -- whether it involves type-safety, system boundaries, engineering workflows, test design, or agent infrastructure -- check the pattern surfaces for known solutions before inventing a new approach.

**Two surfaces, distinct roles** (per PDR-007 as amended 2026-04-29):

- **`.agent/memory/active/patterns/`** — repo-grounded pattern
  instances proven in this stack (TypeScript, Zod, Vitest, MCP,
  etc.). The primary pattern home. Read here first.
- **`.agent/practice-core/decision-records/`** — Practice-governance
  patterns take **PDR shape** with `pdr_kind: pattern` frontmatter.
  General abstract patterns (cross-repo, ecosystem-agnostic) that
  would have been "Core patterns" pre-2026-04-29 retirement now
  graduate as PDRs. Browse the PDR index when looking for the
  general form of a recurring engineering problem.

The previous `.agent/practice-core/patterns/` directory was retired
2026-04-29 (PDR-007 amendment) — no general patterns had been
authored there over its lifetime; all Practice-governance abstractions
matured as PDRs instead. There is no Core-pattern destination.

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

1. Read `.agent/memory/active/patterns/README.md` for repo-grounded pattern instances.
2. Match the current problem against each pattern's `use_this_when` field.
3. If a pattern matches, read its full file and apply the approach.
4. If nothing in `memory/active/patterns/` matches but the problem feels structural / cross-cutting, consult `.agent/practice-core/decision-records/README.md` — Practice-governance patterns and general abstract patterns live there as PDRs (filter for `pdr_kind: pattern` or browse by topic).
5. If nothing matches, proceed normally -- do not force a fit.

## Important

This skill is not always-active. It triggers when an engineer or agent encounters a design problem across any of the five pattern categories (code, architecture, process, testing, agent). It is a discovery mechanism, not a mandate.
