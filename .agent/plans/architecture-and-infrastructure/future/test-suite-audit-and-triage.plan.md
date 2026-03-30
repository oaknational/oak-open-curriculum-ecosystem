---
name: "Test Suite Audit and Triage"
overview: "Deep audit of ALL tests across the repo to identify and remediate accumulated entropy: tests that prove nothing useful, test implementation not behaviour, spawn child processes, duplicate lint/type-check coverage, or are self-referential."
todos:
  - id: inventory
    content: "Inventory all test files by type (unit/integration/E2E/smoke), workspace, and line count."
    status: pending
  - id: process-spawning-audit
    content: "Find and triage all tests that spawn child processes (spawn, exec, execFile, fork from child_process)."
    status: pending
  - id: behaviour-vs-implementation-audit
    content: "Audit tests for implementation coupling: tests that break on config changes, test internal wiring, or assert on values they themselves computed."
    status: pending
  - id: value-audit
    content: "Audit tests for value: does each test prove something useful about product code? Delete tests that only test test harnesses, mocks, or framework behaviour."
    status: pending
  - id: type-check-overlap-audit
    content: "Identify tests that duplicate what TypeScript or ESLint already enforces (type shape assertions, import structure tests, config value assertions)."
    status: pending
  - id: remediate
    content: "Delete or rewrite tests identified in the audit. Track count before and after."
    status: pending
  - id: report
    content: "Produce a summary report with before/after metrics and patterns to avoid."
    status: pending
---

# Test Suite Audit and Triage

**Created**: 2026-03-30
**Last Updated**: 2026-03-30
**Status**: Strategic brief — not yet executable
**Sibling plan**: `quality-gate-hardening.plan.md` (the ESLint rule and
Stryker work depend on a healthy test suite)

## Problem

The test suite has accumulated significant entropy. Recurring patterns
observed during the `feat/mcp_app` branch work:

1. **Process-spawning tests** — `cli-exit.e2e.test.ts` (deleted),
   `benchmark-cli.e2e.test.ts`, `bulk-retry-cli.e2e.test.ts` all spawn
   `npx`/`pnpm` child processes. The first was the sole CI failure on
   PR #70.
2. **Implementation-coupled tests** — widget `_meta.ui` tests broke
   when the allowlist was legitimately emptied. They tested a config
   choice, not the mechanism.
3. **Self-referential tests** — filter for tools that have a value,
   then assert the value exists. Proves nothing.
4. **Tests that should be lint/type-checks** — asserting structural
   properties the compiler already enforces.
5. **Tests that test test code** — complex harnesses where the test
   infrastructure is more complex than the behaviour being proved.

These patterns create false confidence, block legitimate changes, waste
CI time, and will undermine Stryker mutation testing (mutants in
useless tests produce misleading survival rates).

## Relationship to Other Plans

- **Quality Gate Hardening** (`quality-gate-hardening.plan.md`):
  - The `no-child-process-in-tests` ESLint rule prevents future
    process-spawning violations. This plan triages existing ones.
  - Stryker mutation testing is most valuable after the test suite is
    healthy. Run this audit before enabling Stryker to avoid wasting
    mutation budget on tests that prove nothing.
  - `consistent-type-assertions` remediation (~218 warnings) overlaps
    with the test fakes section of this audit.
- **eslint-disable remediation** (`eslint-disable-remediation.plan.md`):
  - Test fakes with `eslint-disable` for `consistent-type-assertions`
    will be addressed by narrow DI interfaces — same fix as this audit's
    implementation-coupling findings.

## Audit Categories

### 1. Process Spawning

Find all `child_process` imports in test files. Each is a violation of
the testing strategy. Triage: delete (if the test proves nothing
useful), rewrite as in-process test (if the behaviour can be tested by
importing and calling directly), or convert to a standalone script (if
process-level behaviour genuinely needs verification outside the test
runner).

Known files:
- `apps/oak-search-cli/e2e-tests/benchmark-cli.e2e.test.ts`
- `apps/oak-search-cli/e2e-tests/bulk-retry-cli.e2e.test.ts`

### 2. Implementation Coupling

Tests that break when implementation changes but behaviour stays the
same. Signals: hardcoded tool names, specific config values, internal
method spies, structural assertions that duplicate type definitions.

### 3. Value Assessment

For each test, ask: "What product behaviour does this prove? Could a
real user be affected if this test were deleted?" If the answer is no,
the test is a candidate for deletion.

### 4. Type/Lint Overlap

Tests that assert type shapes, import structures, or config schemas
that TypeScript or ESLint already enforces. These create maintenance
burden without catching bugs the toolchain wouldn't catch.

### 5. Self-Referential Tests

Tests that compute the expected value from the same source as the
actual value. The test can never fail unless the framework breaks.

## Execution Approach

Use the `test-reviewer` sub-agent across each workspace in parallel.
Focus on the five categories above. Produce a workspace-level report
with specific delete/rewrite/keep recommendations.

## Acceptance Criteria

1. All process-spawning tests are deleted or converted
2. No test breaks on a legitimate config change
3. Every remaining test proves a product behaviour
4. Test count may decrease — fewer, better tests is the goal
5. Stryker baseline run produces meaningful survival rates

## Promotion Trigger

Promote to `current/` when:

1. The `feat/mcp_app` branch is merged to `main`
2. The `no-child-process-in-tests` ESLint rule is in place
3. Team has capacity for a focused audit sprint

## References

- `.agent/directives/testing-strategy.md` — authoritative test rules
- `.agent/directives/principles.md` — "test real behaviour, not
  implementation details"
- `quality-gate-hardening.plan.md` — sibling plan (ESLint rule, Stryker)
- `eslint-disable-remediation.plan.md` — overlapping test fakes scope
