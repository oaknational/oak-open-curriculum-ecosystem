# Component: TDD Phase Structure

Every workstream follows the RED/GREEN/REFACTOR cycle at all
levels (unit, integration, E2E).

## RED Phase

Write tests that specify the desired behaviour. Run them.
They MUST fail. If they pass, the tests are wrong — they are
not testing what you think.

**Deliverables**: Failing tests with clear assertions.
**Exit criterion**: All new tests fail for the expected reason.

## GREEN Phase

Write the minimal implementation to make the tests pass. No
more. No less. Do not optimise. Do not refactor. Do not add
features the tests do not require.

**Deliverables**: Passing tests, minimal implementation.
**Exit criterion**: All tests pass. No new tests added.

## REFACTOR Phase

Improve the implementation without changing behaviour.
Extract helpers, rename for clarity, add TSDoc, update
documentation, clean up imports. Tests MUST remain green.

**Deliverables**: Cleaner code, documentation, updated cross-references.
**Exit criterion**: All tests still pass. Code review would approve.

## Deterministic Validation

Every task includes shell commands with expected outputs:

```bash
# Example: verify no prohibited patterns exist
grep -r "as unknown" src/
# Expected: NO MATCHES (exit code 1)

# Example: verify tests pass
pnpm test --filter @oaknational/curriculum-sdk
# Expected: exit 0, all tests pass
```

This makes validation reproducible, unambiguous, and self-documenting.
