---
name: patterns
classification: passive
description: >-
  Check .agent/memory/patterns/ for known solutions to recurring design
  problems before inventing a new approach. Triggered when facing code,
  architecture, process, testing, or agent infrastructure decisions.
---

# Patterns

When you identify a design problem -- whether it involves type-safety, system boundaries, engineering workflows, test design, or agent infrastructure -- check `.agent/memory/patterns/` for known solutions before inventing a new approach.

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

1. Read `.agent/memory/patterns/README.md` to discover available patterns.
2. Match the current problem against each pattern's `use_this_when` field.
3. If a pattern matches, read its full file and apply the approach.
4. If no pattern matches, proceed normally -- do not force a fit.

## Important

This skill is not always-active. It triggers when an engineer or agent encounters a design problem across any of the five pattern categories (code, architecture, process, testing, agent). It is a discovery mechanism, not a mandate.
