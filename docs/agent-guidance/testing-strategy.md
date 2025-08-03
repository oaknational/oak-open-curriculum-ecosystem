# Testing and Development Strategy

## Philosophy

- ALWAYS test behaviour, NEVER test implementation
- Prefer pure functions and unit tests
- Always use TDD
- Prefer unit tests over integration tests
- Prefer integration tests over E2E tests
- ALL IO MUST BE MOCKED, except in E2E tests
- NEVER create complex mocks, use simple mocks passed as arguments to the function under test. Complex mocks 1) result in testing the mocks, 2) indicate a refactor is required.
- ALL mocks MUST be simple fakes, passed as arguments to the function under test.
- NEVER test external functionality, that is not under our control
- NEVER add complex logic to tests - it risks testing the test code rather than the code under test
- Always ask what a test is proving - it should prove something useful about the code under test
- Each proof should happen ONCE - repeated proofs are fragile and waste time

## Definitions

### System Architecture Components

- Pure function: A function that has no side effects and returns the same result for the same input. Pure functions are the building blocks of all code. Pure functions have unit tests.
- Integration point: A point in the code where multiple units are brought together to effect change in the larger system. Typically this is where IO interfaces are injected as arguments to functions, and where other configuration occurs. Integration points define boundaries of responsibility. Integration points have integration tests.
- System: The complete MCP server exposed via stdio transport. Systems have E2E tests.

### Test Types

#### In-process tests

In-process tests are tests that validate code imported into the test process. They are fast, specific, and do not produce side effects.

- Unit test: A test that verifies the behaviour of a single PURE function in isolation. Unit tests DO NOT trigger IO, have NO side effects, and contain NO MOCKS. Unit tests are automatically run in CI/CD.
- Integration test: A test that verifies the behaviour of a collection of units. Integration tests DO NOT trigger IO, have NO side effects and can contain SIMPLE mocks which must be injected as arguments to the function under test. Integration tests are automatically run in CI/CD and include MCP protocol compliance testing.

#### Out-of-process tests

Out-of-process tests are tests that validate a running _system_, the tests and the system run in _separate processes_. They are slower, are less specific in the causes of issues but cast a wider net, and may produce side effects locally and in external systems.

- E2E test: A test that verifies the behaviour of a running system. E2E tests DO trigger IO, have side effects, and DO NOT contain mocks in many cases. E2E tests are NOT automatically run, because they produce side effects, and because they can induce costs.

### Design Approaches

- Test Driven Development (TDD): Write UNIT tests before writing code. Unit tests PROVE engineering correctness. Unit tests can ONLY test pure functions with no side effects.
- Behaviour Driven Development (BDD): Write integration tests before writing code. Integration tests PROVE we are creating the **desired behaviour and impact** at the integration point level and above.

## Development

- ALWAYS USE TDD and BDD in parallel
- Use Vitest for all tests
- Use the MCP client SDK for E2E tests
- Use the canonical mocking approaches for the testing tools in use for a given test.
- Tests live next to to code they test, not in a `test` directory.
  - Unit tests live next to the pure function file containing the functions they test. They MUST end in `*.unit.test.ts`.
  - Integration tests live next to the integration point file containing the integration points they test. They MUST end in `*.integration.test.ts`.
  - E2E tests are an exception and live in the `e2e-tests` directory. This is because they test a running _system_ rather than importing code to test. They MUST end in `*.e2e.test.ts`.
