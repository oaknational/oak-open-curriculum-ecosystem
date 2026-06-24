---
lineage:
  serves_thread: ci-and-test-efficiency
  serves_stream: developer-experience
  derives_from: "2026-06-24 CI-efficiency scan; eslint-plugin-standards test import ~23s"
---

# CI: audit RuleTester type-aware parsing in oak-eslint

**Status**: FUTURE (strategic brief — not executable until promoted)
**Priority**: Medium (targeted test-setup cost)
**Created**: 2026-06-24
**Owner**: Engineering

## Problem and intent

The `@oaknational/eslint-plugin-standards` test suite reported ~23s of module **import**
time in CI. Its rule tests use `RuleTester`; the heavy import is the type-aware
`@typescript-eslint` parser / project service. Rules that are **purely syntactic**
(no type information inspected) load the full TypeScript project for nothing — setup
cost that buys no assurance.

Intent: pay the type-aware parsing cost **only** where a rule actually inspects types.

## End goal · mechanism · means

- **Goal**: lower `eslint-plugin-standards` test import/setup time without losing rule coverage.
- **Mechanism**: a non-type-aware RuleTester parser config skips TS project loading, so
  syntactic-rule tests start fast.
- **Means**: audit each rule test; classify type-aware (inspects types/`parserServices`)
  vs syntactic; switch the syntactic ones to a light parser config; leave type-aware rules
  on the type-aware config.

## Acceptance criteria (outcome, not activity)

- `eslint-plugin-standards` test import/setup time measurably drops.
- Every rule test still passes; type-aware rules retain type-aware parsing.
- No rule's behavioural coverage is reduced (each rule still proves its violations fire).

## Dependencies and sequencing

- Independent (sole scope: oak-eslint rule test configs). Compounds with the vitest-pool
  change. No `ci.yml` or cross-plan overlap.

## Non-goals

- Not removing `RuleTester` (it is the correct tool — testing-strategy.md "ESLint for
  boundary enforcement").
- Not weakening any rule or its test assertions.

## Risks and unknowns

- Misclassifying a type-aware rule as syntactic → its tests fail immediately on the missing
  `parserServices` (caught at once, reversible per file).
- Unknown how many rules are syntactic vs type-aware until the audit — the audit is the work.

## Promotion trigger

Owner greenlights. Lands as its own focused branch scoped to `packages/core/oak-eslint`.

## Foundation alignment

testing-strategy.md (right tool; no useless setup), principles.md (no waste). Same rules,
same coverage — only unnecessary type-aware parsing is removed.
