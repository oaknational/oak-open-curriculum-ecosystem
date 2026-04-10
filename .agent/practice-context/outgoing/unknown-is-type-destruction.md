---
title: "unknown is type destruction"
category: principles
target: practice-core
status: approved-for-promotion
approved_by: user (2026-04-06)
source_rule: ".agent/rules/unknown-is-type-destruction.md"
---

# `unknown` Is Type Destruction

## Proposal

Promote the `unknown-is-type-destruction` rule to Practice Core as a
universal TypeScript principle.

## Content

`unknown` is the destruction of hard-won type understanding. It is
permitted only at incoming external boundaries from third-party
systems. Using `unknown`, `z.unknown()`, or hand-crafted shadow
schemas where generated or library types exist is a violation.

This applies to all TypeScript repos. The principle:

1. Data from external boundaries starts as `unknown`
2. Validate immediately to the exact known shape (Zod, type guard)
3. After validation, the type system owns the shape — never widen back
4. Generated types are exhaustive — never shadow them with `unknown`
5. `z.unknown()` is type destruction in Zod, just as `unknown` is in
   TypeScript

## Rationale

User approved this for Practice Core promotion on 2026-04-06. "This
is very important, although it mostly applies to TypeScript, many of
our repos are TypeScript so including it is a good idea."

The rule was extracted from a type-correctness audit where the
type-reviewer recommended `z.unknown()` (which is type destruction)
and a hand-crafted shadow schema (which is entropy). Both were caught
by human review and led to the canonical rule.
