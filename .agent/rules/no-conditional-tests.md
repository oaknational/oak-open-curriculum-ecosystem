---
classification: situational
description: No conditional tests. They are a symptom of architectural failure.
trigger: surface:test-authoring
globs:
  - "**/*.test.ts"
---

# No Conditional Tests

Operationalises [`testing-strategy.md`](../directives/testing-strategy.md) §Rules, which also governs the sibling skip and pending mechanisms. Its cures apply the dependency-injection pattern in [`testing-patterns.md` §In-Process Tests with Dependency Injection](../../docs/engineering/testing-patterns.md#in-process-tests-with-dependency-injection).

## Rule

**Conditional tests are a symptom of architectural failure. Remove them, investigate where the ambiguity arose in the product code, remove the ambiguity at the source, and write clear, deterministic, behaviour-proving tests that do not constrain implementation.**

A conditional test is any test whose registration, execution, or assertion depends on a runtime condition. Tests must be deterministic across all environments in which the suite runs.

## Enforcement

`skipIf` and `runIf` are enforced at the lint gate by the estate's ESLint
plugin's `no-conditional-tests` rule (in jimcresswell.net since 2026-09-11), alongside
`vitest/no-disabled-tests` for `.skip` and `vitest/no-focused-tests` for `.only`.

Until that rule existed this clause was prose only, and the gap had a cost: a
succession record instructed a seat to mark four tests
`it.skipIf(process.platform === 'win32')` so a host-dependent expectation would
not run on Windows, and nothing at the gate would have refused it. Proven with a
negative control at the time — `it.skip(...)` failed lint, the identical
`it.skipIf(...)` passed. The remaining forbidden mechanisms below (conditional
registration, runtime branching, conditional assertions and fixtures,
assertion-swallowing try/catch) are still reviewer-enforced, because their shapes
are not mechanically distinguishable from legitimate test-internal control flow;
`test-expert` carries them.

## Forbidden mechanisms

- **`it.skipIf(cond)` / `describe.skipIf(cond)`** — vitest skip-when API. *Lint-enforced.*
- **`it.runIf(cond)` / `describe.runIf(cond)`** — vitest run-when API. *Lint-enforced.*
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
2. **Runtime-detected configuration** — product code reads `process.env`, `process.platform`, file presence, or current working directory and behaves differently. Fix: hoist the detection to a single composition root; downstream code receives the resolved value as a parameter and is unconditionally testable. See [`no-global-state-in-tests.md`](no-global-state-in-tests.md) and `docs/engineering/testing-patterns.md` §In-Process Tests with Dependency Injection.
3. **External-resource gating** — "skip if API key missing" patterns. Fix: a proof that needs an external resource is not a test at all (tests never use or create IO; `testing-strategy.md` §Philosophy). It is a smoke or E2E check, a validation surface outside the in-process test run, and it fails fast with a helpful error when the resource is absent. Nothing silently skips in the in-process suite.
4. **Test author hedging against an unstable surface** — `if (response.status === 200)` because the upstream sometimes returns 500. Fix: the surface under test is non-deterministic; either inject a deterministic fake or prove it as a validation check outside the in-process test run.
5. **Shape-narrowing guard that reads as proof** — `if (shape ok) { expect(...) }` is unfalsifiable for exactly the case it guards: when the shape is wrong the assertion never runs, so the test passes silently while reading as proof. The tell is usually self-erased types upstream — a loose recording fake fighting the real seam (an overload type error is the signal). Fix: delete the capture test and prove the behaviour where it is real (e2e through the real transport, a Zod `.parse` as the fail-loud record check, deterministic enumeration). Where a guard is genuinely needed to narrow, the sanctioned shape is the **message-bearing expect-guard** (`expect(shape, 'diagnostic message').toBe(ok)` before the narrowed assertions — it FAILS rather than skips, satisfying this rule's dividing-line test with identical pass/fail behaviour and test count on every machine), never an if-guard. The Result-seam lift and the Zod boundary parse are the preferred structural cures where available. (Amended 2026-08-02 by owner-carded ruling: this sentence previously prescribed a throw-guard, which collides with the `no-throw-statement` lint whose retrofit plan forbids rule weakening; the expect-guard ends the four-cures re-litigation. An expect-guard is not a licence for try/catch around assertions, which stays forbidden above.)

In every case the fix lives in **product code or test architecture**, not in adding a guard around the assertion.

## Corrective workflow

1. Delete the conditional from the test.
2. Read the product code the test was exercising. Identify the ambiguity that prompted the conditional.
3. Remove the ambiguity at the source — split modes, inject configuration, hoist detection, or reshape the boundary so the unit under test has exactly one observable behaviour given its inputs.
4. Write a deterministic test (or set of `it.each` rows) that proves the new, unambiguous behaviour through the public interface. The test must not encode the implementation choice that resolved the ambiguity.
5. Run the full suite — every test in every environment runs and either passes or fails deterministically.

If step 3 reveals that the ambiguity is intentional and load-bearing, that is a design conversation, not a test conversation. Surface it via the agent collaboration log or escalate to the owner before adding any test.

## Reviewer cadence

- `test-expert` enforces this rule on every test-touching diff. Conditional execution of any kind is an immediate fail; see [`test-immediate-fails.md`](test-immediate-fails.md).
- `code-expert` flags conditional test patterns and routes to `test-expert`.
- `architecture-expert` flags product-code shapes that *force* test authors toward conditionals — multiple-mode functions, env-detection inside libraries, ambient-state coupling — as architectural-failure signals at the source.

## Cross-references

- Authority: [`testing-strategy.md`](../directives/testing-strategy.md) §Rules — "No conditional tests" bullet.
- Sibling discipline: [`testing-strategy.md`](../directives/testing-strategy.md) §Rules "No skipped tests" bullet — skip and pending mechanisms.
- Sibling rule: [`no-global-state-in-tests.md`](no-global-state-in-tests.md) — `process.env` reads/writes, `vi.stubGlobal`, `vi.mock`, `vi.doMock`, `vi.useFakeTimers`, `vi.setSystemTime`.
- Sibling rule: [`never-disable-checks.md`](never-disable-checks.md) — quality gates are never disabled; conditioning a test is the test-surface instance of the same anti-pattern.
- Operational checklist: [`test-immediate-fails.md`](test-immediate-fails.md) — fast-gate rejection list for test-expert.
