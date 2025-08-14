# Testing and Development Strategy

## Tooling

- Vitest
- TypeScript
- Supertest if needed

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

- **TDD** - ALWAYS use TDD, prefer pure functions and unit tests. Write tests **FIRST**. Red (failing *test*), Green (passing test, because product code is created at this point, *not before*), Refactor (improve the product code implementation, know that the *behaviour* at the interface will remain proven by the test)
- **Test real behaviour, not implementation details** - We should be able to change *how* something works without breaking the test that proves *that* it works.
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

Out-of-process tests are tests that validate a running *system*, the tests and the system run in *separate processes*. They are slower, are less specific in the causes of issues but cast a wider net, and may produce side effects locally and in external systems.

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

### Workspace Architecture Components (Moria/Histoi/Psycha)

- **Moria (Molecules/Atoms)**: Pure abstractions (zero dependencies) - Test with unit tests only, no IO or mocks allowed
  - *Example*: `Logger` interface, `StorageProvider` interface, pure sorting algorithms
  
- **Histoi (Tissues/Matrices)**: Runtime-adaptive connective tissues that bind organisms - Test with unit tests for pure logic, integration tests for runtime adaptation
  - *Example*: Adaptive logger that uses `console` in browser but `pino` in Node.js, storage tissue that uses `localStorage` in browser but `fs` in Node.js
  
- **Psycha (Living Organisms)**: Complete applications - Test with integration tests for assembly, E2E tests for full behaviour
  - *Example*: `oak-notion-mcp` server, `github-mcp` server - complete MCP applications

### Psychon Architecture Components (Within Each Organism)

- **Chora/Morphai (Forms)**: Hidden forms and Platonic ideals - Test with unit tests for pure patterns
  - *Example*: Abstract `ToolExecutor` pattern, `RequestHandler` interface that all tools implement
  
- **Chora/Stroma (Support/Foundation)**: Types and contracts (compile-time only) - Test with TypeScript compiler, no runtime tests needed
  - *Example*: `NotionBlock` type, `MCPRequest` interface, `ToolResult` type
  
- **Chora/Aither (Air/Essence)**: Logging and events (pervasive flows) - Test with unit tests for pure transformations, integration tests for flow behaviour
  - *Example*: Logger that flows through all layers, event bus for tool execution events
  
- **Chora/Phaneron (Manifestation)**: Configuration and perceivable environment - Test with integration tests for validation and defaults
  - *Example*: `.env` configuration, runtime feature flags, API keys management
  
- **Organa (Organs)**: Discrete business logic organs - Test with unit tests for pure functions, integration tests at organ boundaries
  - *Example*: Notion search organ, database query organ, page creation organ
  
- **Psychon (Soul/Living Whole)**: The wiring layer - Test with integration tests to verify proper assembly and dependency injection
  - *Example*: Main application class that wires all organs together, dependency injection container

### Design Approaches

- Test Driven Development (TDD): Write UNIT tests before writing code. Unit tests PROVE engineering correctness. Unit tests can ONLY test pure functions with no side effects.
- Behaviour Driven Development (BDD): Write integration tests before writing code. Integration tests PROVE we are creating the **desired behaviour and impact** at the integration point level and above.

## Testing Workspace Architecture (Moria/Histoi/Psycha)

### Testing Moria (Pure Abstractions)

**Key Principle**: Zero dependencies, pure abstractions only, test-first development

```typescript
// ecosystem/moria/@oaknational/mcp-moria/src/interfaces/logger.test.ts
describe('Logger interface', () => {
  it('defines logging contract', () => {
    // Test that interface can be implemented
    const mockLogger: Logger = {
      trace: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };
    // Verify contract completeness
  });
});

// ecosystem/moria/@oaknational/mcp-moria/src/algorithms/sort.test.ts
describe('pure sorting algorithm', () => {
  it('sorts arrays deterministically', () => {
    // Test pure algorithm with no dependencies
  });
});
```

### Testing Histoi (Runtime-Adaptive Tissues)

**Key Principle**: Test runtime adaptation, conditional exports, tree-shaking

```typescript
// ecosystem/histoi/logger/src/adapter.unit.test.ts
describe('logger adapter', () => {
  it('selects console logger in browser', () => {
    // Test pure selection logic
  });
});

// ecosystem/histoi/logger/src/index.integration.test.ts
describe('logger tissue integration', () => {
  it('adapts to runtime environment', () => {
    // Test with mocked runtime detection
  });
});
```

### Testing Psycha (Complete Organisms)

```typescript
// ecosystem/psycha/oak-notion-mcp/psychon.integration.test.ts
describe('Oak Notion MCP assembly', () => {
  it('wires all components from moria and histoi', () => {
    // Verify proper assembly of all layers
  });
});

// e2e-tests/oak-notion-mcp.e2e.test.ts
describe('Oak Notion MCP E2E', () => {
  it('responds to MCP protocol requests', () => {
    // Test complete system behaviour
  });
});
```

## Testing Psychon Architecture (Within Each Organism)

### Testing Chorai (Pervasive Fields)

**Chora/Morphai (Foundational Structures)**:

```typescript
// psychon/chora/morphai/transform.unit.test.ts
describe('foundational transformations', () => {
  it('transforms data structures purely', () => {
    // Test pure transformation logic
  });
});
```

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
    // Test pervasive behaviour with simple mocks
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
    // Test public API behaviour
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
// ❌ DON'T add dependencies to moria packages
// ecosystem/moria/@oaknational/mcp-moria/src/uses-external-lib.ts

// ❌ DON'T test implementation details in moria
// Only test that interfaces can be implemented

// ❌ DON'T import psycha from histoi
// Histoi must remain transplantable between organisms

// ❌ DON'T test cross-organ communication directly
// organa/mcp/mcp-calls-notion.test.ts

// ❌ DON'T test chora implementations in organ tests
// organa/notion/tests-logging.test.ts

// ❌ DON'T create complex mocks of other organs
// Instead, use simple interfaces injected as dependencies
```

## Development

- ALWAYS USE TDD
- Use Vitest for all tests
- Use the MCP client SDK for E2E tests
- Use the canonical mocking approaches for the testing tools in use for a given test.
- Tests live next to to code they test, not in a `test` directory.
  - Unit tests live next to the pure function file containing the functions they test. They MUST end in `*.unit.test.ts` or `*.test.ts` for moria packages (which contain only unit tests).
  - Integration tests live next to the integration point file containing the integration points they test. They MUST end in `*.integration.test.ts`.
  - E2E tests are an exception and live in the `e2e-tests` directory. This is because they test a running *system* rather than importing code to test. They MUST end in `*.e2e.test.ts`.
