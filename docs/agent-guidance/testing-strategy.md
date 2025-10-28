# Testing and Development Strategy

## Tooling

- Vitest
- React Testing Library
- Supertest
- Playwright

## Philosophy

- ALWAYS test behaviour, NEVER test implementation
- Prefer pure functions and unit tests
- Always use TDD
- Prefer unit tests over integration tests
- Prefer integration tests over E2E tests
- ALL IO MUST BE MOCKED, except in E2E tests
- NEVER create complex mocks, use simple mocks passed as arguments to the function under test. Complex mocks result in testing the mocks, and indicate that product code needs refactoring and simplification in order to be easily testable.
- ALL mocks MUST be simple fakes, passed as arguments to the function under test.
- NEVER test external functionality, that is not under our control
- NEVER add complex logic to tests - it risks testing the test code rather than the code under test
- Always ask what a test is proving - it should prove something useful about the code under test
- Each proof should happen ONCE - repeated proofs are fragile and waste time

## Rules

- **TDD** - ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (failing _test_), Green (passing test, because product code is created at this point, _not before_), Refactor (improve the product code implementation, know that the _behaviour_ at the interface will remain proven by the test)
- **Test real behaviour, not implementation details** - We should be able to change _how_ something works without breaking the test that proves _that_ it works.
- **Test to interfaces, not internals** - Tests should be written to the interfaces, not the internals. Closely related to test behaviour not implementation.
- **No useless tests** - Each test must prove something useful about the product code. If a test is only testing the test or mocks, delete it.
- **Do not test types** - Tests are for logic, types are explored through creating tests, but types cannot be tested. If test only tests types, delete it.
- **KISS: No complex logic in tests** - Complexity in tests is a signal that we need to step back and simplify, the code and the test.
- **KISS: No complex mocks** - Mocks should be simple and focused, no complex logic in mocks, or we risk testing the mocks rather than the code. Complex mocks are a signal that we need to step back and simplify the code or our approach.
- **No skipped tests** - Fix it or delete it

## Definitions

### System Architecture Components

- Pure function: A function that has no side effects and returns the same result for the same input. Pure functions are the building blocks of all code. Pure functions have unit tests. Naming convention: `*.unit.test.ts`.
- Integration point: A point in the code where multiple units are brought together to effect change in the larger system. Typically this is where IO interfaces are injected as arguments to functions, and where other configuration occurs. Integration points define boundaries of responsibility. Integration points have integration tests. Naming convention: `*.integration.test.ts`.
- System: The complete MCP server exposed via stdio transport. Systems have E2E tests. Naming convention: `*.e2e.test.ts`.

### Test Types

#### In-process tests

In-process tests are tests that validate **code imported into the test process**. The code under test runs in the same process as the test runner. They are fast, specific, and do not produce side effects. These tests are about testing CODE, not testing RUNNING SYSTEMS.

- **Unit test**: A test that verifies the behaviour of a single PURE function in isolation. Unit tests DO NOT trigger IO, have NO side effects, and contain NO MOCKS. Unit tests are automatically run in CI/CD.
- **Integration test**: A test that verifies the behaviour of a collection of units **working together as code**, NOT a running system. Integration tests still import and test code directly within the test process. They DO NOT trigger IO, have NO side effects and can contain SIMPLE mocks which must be injected as arguments to the function under test. Integration tests are automatically run in CI/CD and include MCP protocol compliance testing. **Important**: Integration tests are NOT about testing a deployed or running system - they test how multiple code units integrate when imported and called directly.

#### Out-of-process tests

Out-of-process tests are tests that validate a running _system_, the tests and the system run in _separate processes_. They are slower, are less specific in the causes of issues but cast a wider net, and may produce side effects locally and in external systems.

- **E2E test**: A test that verifies the behaviour of a running system. E2E tests DO trigger IO, have side effects, and DO NOT contain mocks in many cases. E2E tests are NOT automatically run, because they produce side effects, and because they can induce costs.

#### Common Misconception: Integration Tests

**WRONG Understanding (Common but Incorrect):**

```typescript
// ❌ This is NOT an integration test - it's an E2E test
describe('API Integration Test', () => {
  it('should call the deployed API', async () => {
    const response = await fetch('http://localhost:3000/api/users');
    // Testing a RUNNING SYSTEM over HTTP
  });
});
```

**CORRECT Understanding (Our Definition):**

```typescript
// ✅ This IS an integration test - testing code units working together
import { UserService } from './user-service';
import { DatabaseAdapter } from './database-adapter';

describe('UserService Integration Test', () => {
  it('should retrieve users through the adapter', () => {
    const mockDb = { query: () => [{ id: 1, name: 'Alice' }] };
    const adapter = new DatabaseAdapter(mockDb); // Simple mock injected
    const service = new UserService(adapter);

    const users = service.getAllUsers();
    // Testing how CODE UNITS integrate, not a running system
    expect(users).toHaveLength(1);
  });
});
```

The key distinction: Integration tests import and test code directly. They never spawn processes, make network calls, or test deployed systems.

### Design Approaches

- Test Driven Development (TDD): Write UNIT tests before writing code. Unit tests PROVE engineering correctness. Unit tests can ONLY test pure functions with no side effects.
- Behaviour Driven Development (BDD): Write integration tests before writing code. Integration tests PROVE we are creating the **desired behaviour and impact** at the integration point level and above.

## Development

- ALWAYS USE TDD
- Use Vitest for all tests
- Use the MCP client SDK for E2E tests
- Use the canonical mocking approaches for the testing tools in use for a given test.
- Tests live next to to code they test, not in a `test` directory.
  - Unit tests live next to the pure function file containing the functions they test. They MUST end in `*.unit.test.ts`.
  - Integration tests live next to the integration point file containing the integration points they test. They MUST end in `*.integration.test.ts`.
  - E2E tests are an exception and live in the `e2e-tests` directory. This is because they test a running _system_ rather than importing code to test. They MUST end in `*.e2e.test.ts`.
