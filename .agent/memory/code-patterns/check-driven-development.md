---
name: "Check Driven Development"
use_this_when: "Writing TDD RED-phase assertions in a codebase with multiple quality gates"
category: process
proven_in: "packages/sdks/oak-curriculum-sdk/src/mcp/canonical-descriptor.unit.test.ts"
proven_date: 2026-03-26
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Bending tool usage to fit a narrow definition of TDD (e.g. using runtime toHaveProperty checks to avoid breaking type-check, or adding eslint-disable to avoid breaking lint)"
  stable: true
---

# Check Driven Development

## Pattern

When writing RED-phase assertions in TDD, use the quality gate that proves the
gap most directly. The test runner is not the only assertion mechanism — the type
checker, linter, unused-code detector, and dependency graph validator are all
assertion tools.

## Anti-Pattern

Writing runtime property-existence checks (`expect(x).toHaveProperty('foo')`) or
adding `eslint-disable` comments to avoid breaking `pnpm type-check` or
`pnpm lint`. This bends the tool usage to fit a narrow definition of "test" and
hides the RED signal behind a suppression.

## Application

| Gap to prove | Best assertion tool |
| --- | --- |
| Missing module/export | Type checker (`pnpm type-check`) |
| Unused code after refactor | Dead-code detector (`pnpm knip`) |
| Circular dependency | Dependency graph validator (`pnpm depcruise`) |
| Behavioural contract | Test runner (`pnpm test`) |
| Code pattern presence/absence | Grep (`rg`) |
| Lint rule compliance | Linter (`pnpm lint`) |

## Implication

Pre-commit hooks that enforce all gates pass will block RED-phase commits. This
is a workflow tension that must be resolved per-team (e.g. `--no-verify` for
intentional RED, or RED+GREEN in single commit).
