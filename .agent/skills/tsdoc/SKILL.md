---
name: tsdoc
classification: passive
description: Write and audit canonical TSDoc plus the adjacent README or ADR updates that belong with a code change.
---

# TSDoc

## Use When

Apply this skill when you are:

- adding or changing public TypeScript APIs
- fixing `tsdoc/syntax` warnings or TypeDoc issues
- refactoring code with non-obvious intent, constraints, or trade-offs
- updating a workspace README or ADR alongside code changes

## Source of Truth

Read these before making documentation changes:

1. `tsdoc.json`
2. `.agent/directives/principles.md`
3. `.agent/directives/testing-strategy.md` when documenting test-facing behaviour
4. `docs/engineering/tooling.md` for the repository's TSDoc enforcement layers

## Canonical Constraints

Follow `.agent/rules/tsdoc-and-documentation-hygiene.md` for the canonical tag, syntax, and comment-style rules.

## Documentation Boundary

- TSDoc explains API shape, intent, invariants, examples, and cross-references close to the code.
- Workspace `README.md` files explain how to use or operate the workspace.
- ADRs capture significant architectural decisions and boundary changes.
- Do not duplicate the same explanation across TSDoc, README, and ADR. Put each concern in its canonical home and link across surfaces where helpful.

## Checklist

1. Remove non-TSDoc tags such as `@module`.
2. Replace stale names in TSDoc when symbols or concepts are renamed.
3. Check whether the code change also requires a README or ADR update.
4. For non-trivial public APIs, document `@param`, `@returns`, and an `@example` where it materially helps usage.
5. Run the relevant lint and docs gates after editing.
