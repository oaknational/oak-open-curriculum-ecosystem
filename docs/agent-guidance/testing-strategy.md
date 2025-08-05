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

### Biological Architecture Components

- **Chora/Stroma**: Types and contracts (compile-time only) - Test with TypeScript compiler, no runtime tests needed
- **Chora/Aither**: Logging and events (pervasive flows) - Test with unit tests for pure transformations, integration tests for flow behavior
- **Chora/Phaneron**: Configuration (visible state) - Test with integration tests for validation and defaults
- **Organa**: Discrete business logic organs - Test with unit tests for pure functions, integration tests at organ boundaries
- **Psychon**: The wiring layer - Test with integration tests to verify proper assembly and dependency injection

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

## Testing Biological Architecture

### Testing Chorai (Pervasive Fields)

**Chora/Stroma (Types/Contracts)**:

- No runtime tests needed - TypeScript compiler validates
- Test type exports are accessible from other layers

**Chora/Aither (Logging/Events)**:

```typescript
// chora/aither/logging/formatter.unit.test.ts
describe('log formatter', () => {
  it('formats log entries consistently', () => {
    // Test pure formatting logic
  });
});

// chora/aither/logging/logger.integration.test.ts
describe('logger integration', () => {
  it('flows through all layers when injected', () => {
    // Test pervasive behavior with simple mocks
  });
});
```

**Chora/Phaneron (Configuration)**:

```typescript
// chora/phaneron/config/validator.unit.test.ts
describe('config validator', () => {
  it('validates required fields', () => {
    // Test pure validation logic
  });
});
```

### Testing Organa (Discrete Organs)

**Key Principle**: Test organs in isolation, mock dependencies from other organs

```typescript
// organa/notion/search/transform.unit.test.ts
describe('search result transformer', () => {
  it('transforms Notion responses to our format', () => {
    // Pure transformation, no mocks needed
  });
});

// organa/notion/index.integration.test.ts
describe('Notion organ integration', () => {
  it('exposes operations through public API', () => {
    const mockLogger = createMockLogger();
    const mockConfig = { notionApiKey: 'test' };
    const notion = createNotionOperations({ logger: mockLogger, config: mockConfig });
    // Test public API behavior
  });
});
```

### Testing Psychon (The Whole)

```typescript
// psychon.integration.test.ts
describe('Psychon assembly', () => {
  it('wires all components correctly', () => {
    const psychon = new Psychon();
    // Verify all organs receive correct dependencies
    // Verify no cross-organ imports exist
  });
});
```

### Testing Anti-Patterns to Avoid

```typescript
// ❌ DON'T test cross-organ communication directly
// organa/mcp/mcp-calls-notion.test.ts

// ❌ DON'T test chora implementations in organ tests
// organa/notion/tests-logging.test.ts

// ❌ DON'T create complex mocks of other organs
// Instead, use simple interfaces injected as dependencies
```

## Development

- ALWAYS USE TDD and BDD in parallel
- Use Vitest for all tests
- Use the MCP client SDK for E2E tests
- Use the canonical mocking approaches for the testing tools in use for a given test.
- Tests live next to to code they test, not in a `test` directory.
  - Unit tests live next to the pure function file containing the functions they test. They MUST end in `*.unit.test.ts`.
  - Integration tests live next to the integration point file containing the integration points they test. They MUST end in `*.integration.test.ts`.
  - E2E tests are an exception and live in the `e2e-tests` directory. This is because they test a running _system_ rather than importing code to test. They MUST end in `*.e2e.test.ts`.
