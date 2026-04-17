# TDD for Refactoring

Operationalises [ADR-011 (Use Vitest for Testing)](../../docs/architecture/architectural-decisions/011-vitest-for-testing.md) and [ADR-078 (Dependency Injection for Testability)](../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md).

For refactoring that changes signatures: update test call sites FIRST. Compiler errors from signature changes are the RED phase for signature refactors — they prove the tests reference the new contract before the implementation exists. For type-derivation fixes, `satisfies` serves as the compile-time RED phase. Run the full suite before and after. Existing tests ARE the safety net.

See `.agent/directives/testing-strategy.md`.
