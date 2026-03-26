---
title: "Check Driven Development: TDD Beyond Test Files"
thesis: "TDD's assertion mechanism should match the gap being proved — type-check, lint, grep, knip, or any quality gate can serve as the RED signal, not just test files."
status: stub
tags: [tdd, check-driven-development, quality-gates, typescript]
---

# Check Driven Development: TDD Beyond Test Files

## Core Argument

Test-Driven Development is usually taught as "write a failing test, make it
pass, refactor." But in a strongly-typed codebase with a rich quality gate
suite, test files are only one assertion mechanism. The type checker is a test
runner. The linter is a test runner. `knip` (unused code detection) is a test
runner. `depcruise` (dependency graph validation) is a test runner.

**Check Driven Development** (CDD) generalises TDD's RED/GREEN/REFACTOR cycle
to any quality gate: pick the tool that proves the gap most directly, then make
it pass.

## The Catalyst

During Phase 2 (RED) of a simplification plan, the initial approach was to write
runtime property-existence checks (`expect(tool).toHaveProperty('registrationConfig')`)
to avoid breaking `pnpm type-check`. This was wrong: it bent the tool usage to
fit a narrow definition of "test." A missing TypeScript import that fails
type-check IS the RED signal. The type system is the correct tool for proving a
shape gap.

The correction led to a cleaner design: import the non-existent module, let
type-check fail, let lint fail, let test fail — the entire quality gate suite
becomes the assertion framework.

## When to Use Which Tool

| Gap to prove | Best assertion tool |
| --- | --- |
| Missing module/export | `pnpm type-check` (TS2307, TS2305) |
| Unused code after refactor | `pnpm knip` |
| Circular dependency introduced | `pnpm depcruise` |
| Behavioural contract (user-observable) | `pnpm test` (Vitest) |
| Mutation coverage gap | Stryker |
| Code pattern presence/absence | `rg` / grep |
| Lint rule compliance | `pnpm lint` |

## Implications

1. **Pre-commit hooks need a TDD mode.** If all quality gates run on commit,
   RED-phase code can never be committed. Either hooks need a bypass for
   intentional RED states, or the workflow needs to accommodate RED→GREEN in a
   single commit.

2. **eslint-disable is never the answer.** If lint fails because a module
   doesn't exist, that IS the RED signal. Suppressing it with eslint-disable
   hides the gap you're trying to prove. The correct response is to let lint
   fail and document why.

3. **The quality gate suite is the test harness.** Think of `pnpm type-check`,
   `pnpm lint`, `pnpm test`, `pnpm knip`, `pnpm depcruise` as a unified
   assertion framework. Each gate asserts different invariants. TDD means
   picking the right gate for each invariant.

## Evidence

- Phase 2 RED tests in Oak MCP Ecosystem: `pnpm type-check` fails on
  `TS2307: Cannot find module './universal-tools/projections.js'`
- `pnpm lint` fails on `import-x/no-unresolved` and cascading
  `no-unsafe-assignment`
- `pnpm test` fails on missing function behaviour
- All three are valid RED signals for the same gap
- Zero eslint-disable comments in the final code

## Open Questions

- Should CI distinguish between "intentional RED" and "broken code"? A
  label/tag system for RED-phase branches?
- How does CDD interact with trunk-based development where main must always be
  green?
- Is there a formal relationship between CDD and property-based testing?
