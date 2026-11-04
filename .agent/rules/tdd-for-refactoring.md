---
classification: core
description: Refactoring stays under red-green-refactor
---

# TDD for Refactoring

Refactoring is not an exception to TDD. Prove the current or intended behaviour
first, then refactor with green tests preserving that behaviour; if the proof
is missing, add or repair it before changing implementation.

For refactoring that changes signatures: update test call sites FIRST. Compiler
errors from signature changes are the RED phase for signature refactors — they
prove the tests reference the new contract before the implementation exists.
For type-derivation fixes, `satisfies` serves as the compile-time RED phase.
Existing tests are the safety net: they run green before and after.

See `.agent/directives/testing-strategy.md` and
`.agent/directives/tdd-as-design.md`.
