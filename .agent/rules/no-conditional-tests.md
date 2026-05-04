# No Conditional Tests

Operationalises [ADR-011 (Use Vitest for Testing)](../../docs/architecture/architectural-decisions/011-vitest-for-testing.md), [ADR-078 (Dependency Injection for Testability)](../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md), and [`testing-strategy.md`](../directives/testing-strategy.md) §Rules. Sibling to [`no-skipped-tests.md`](no-skipped-tests.md).

## Rule

**Conditional tests are a symptom of architectural failure. Remove them, investigate where the ambiguity arose in the product code, remove the ambiguity at the source, and write clear, deterministic, behaviour-proving tests that do not constrain implementation.**

A conditional test is any test whose registration, execution, or assertion depends on a runtime condition. Tests must be deterministic across all environments in which the suite runs.

## Forbidden mechanisms

- **`it.skipIf(cond)` / `describe.skipIf(cond)`** — vitest skip-when API.
- **`it.runIf(cond)` / `describe.runIf(cond)`** — vitest run-when API.
- **Conditional registration** — wrapping `it(...)` or `describe(...)` in `if`/`switch`/ternary so the test body only registers under some conditions.
- **Runtime branching inside the test body** — `if (cond) { ... } else { return; }` patterns that change what the test asserts based on ambient state.
- **Conditional assertions** — `if (env === 'X') expect(...).toBe(...)` or `expect(actual)[isProd ? 'toBe' : 'toEqual'](expected)`.
- **Conditional fixtures** — fixture builders or `beforeEach` setup whose shape varies with `process.env`, `process.platform`, the host filesystem, or any other ambient signal.
- **Try/catch that swallows assertion failures** — wrapping assertions in `try { expect(...) } catch { /* tolerate */ }` is conditional execution by another name.

## NOT conditional (allowed)

- **`it.each([...])` over a literal dataset** — deterministic enumeration of cases is normal parameterisation, not conditional execution. Each row runs unconditionally.
- **Parameterised describe blocks driven by literal arrays** — same reasoning as above.
- **Test-internal control flow used to construct deterministic inputs** — building a literal payload via a loop is fine provided every assertion in the test runs unconditionally for every test invocation.

The dividing line: does the suite produce identical pass/fail behaviour, the same registered test count, and the same assertion set on every machine and in every environment? If yes, it is deterministic. If no, it is conditional, and it is forbidden.

## Diagnosis

Conditional tests almost always indicate one of:

1. **Multiple product-code modes** that the test author tried to cover with a single test guarded by a mode check. Fix: split the modes in product code into distinct functions or distinct injected strategies; write one deterministic test per mode against an explicit input.
2. **Runtime-detected configuration** — product code reads `process.env`, `process.platform`, file presence, or current working directory and behaves differently. Fix: hoist the detection to a single composition root; downstream code receives the resolved value as a parameter and is unconditionally testable. See [`no-global-state-in-tests.md`](no-global-state-in-tests.md) and ADR-078.
3. **External-resource gating** — "skip if API key missing" patterns. Fix: external-resource tests live in dedicated smoke or E2E suites that fail fast with a helpful error when the resource is absent. They never silently skip in the in-process suite.
4. **Test author hedging against an unstable surface** — `if (response.status === 200)` because the upstream sometimes returns 500. Fix: the surface under test is non-deterministic; either inject a deterministic fake or move the test out of the in-process suite.

In every case the fix lives in **product code or test architecture**, not in adding a guard around the assertion.

## Corrective workflow

1. Delete the conditional from the test.
2. Read the product code the test was exercising. Identify the ambiguity that prompted the conditional.
3. Remove the ambiguity at the source — split modes, inject configuration, hoist detection, or reshape the boundary so the unit under test has exactly one observable behaviour given its inputs.
4. Write a deterministic test (or set of `it.each` rows) that proves the new, unambiguous behaviour through the public interface. The test must not encode the implementation choice that resolved the ambiguity.
5. Run the full suite — every test in every environment runs and either passes or fails deterministically.

If step 3 reveals that the ambiguity is intentional and load-bearing, that is a design conversation, not a test conversation. Surface it via the agent collaboration log or escalate to the owner before adding any test.

## Reviewer cadence

- `test-reviewer` enforces this rule on every test-touching diff. Conditional execution of any kind is an immediate fail; see [`test-immediate-fails.md`](test-immediate-fails.md).
- `code-reviewer` flags conditional test patterns and routes to `test-reviewer`.
- `architecture-reviewer-fred` (principles-first) flags product-code shapes that *force* test authors toward conditionals — multiple-mode functions, env-detection inside libraries, ambient-state coupling — as architectural-failure signals at the source.

## Cross-references

- Authority: [`testing-strategy.md`](../directives/testing-strategy.md) §Rules — "No conditional tests" bullet.
- Sibling rule: [`no-skipped-tests.md`](no-skipped-tests.md) — skip and pending mechanisms.
- Sibling rule: [`no-global-state-in-tests.md`](no-global-state-in-tests.md) — `process.env` reads/writes, `vi.stubGlobal`, `vi.mock`, `vi.doMock`.
- Sibling rule: [`never-disable-checks.md`](never-disable-checks.md) — quality gates are never disabled; conditioning a test is the test-surface instance of the same anti-pattern.
- Operational checklist: [`test-immediate-fails.md`](test-immediate-fails.md) — fast-gate rejection list for test-reviewer.
- ADR: [`078-dependency-injection-for-testability.md`](../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md).
