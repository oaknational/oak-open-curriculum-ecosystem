# Plan: MCP Testing Toolkit (Icebox)

**Status:** Icebox - Not Yet Needed  
**Created:** 2024-11-16  
**Priority:** Low  
**Effort:** TBD when needed  
**Trigger:** When we have 2+ OAuth-enabled MCP servers to test

---

## Why This Is In The Icebox

Per @principles.md:

> **YAGNI** - You Aren't Gonna Need It

**Current state:**

- We have 3 MCP servers in this monorepo
- Only 1 uses OAuth (oak-curriculum-mcp-streamable-http)
- The stdio one doesn't need OAuth testing
- The Notion one might, but that's speculative

**When to build this:**

- When we have a SECOND OAuth-enabled MCP server
- When we need to test OAuth discovery repeatedly
- When the cost of NOT having automation exceeds the cost of building it

**Until then:**

- Use Inspector CLI manually
- One-off validation is sufficient
- Don't build infrastructure for hypothetical needs

---

## Problem This Would Solve (Eventually)

**If we had multiple OAuth-enabled MCP servers**, we'd want:

1. Consistent testing approach across servers
2. Reusable harness for Inspector CLI
3. Automated OAuth discovery validation
4. Regression testing for MCP protocol compliance

**But we don't have that problem yet.**

---

## Goals (When This Becomes Relevant)

### Primary Goals

1. **Reusable Inspector Harness** - Pure functions that wrap Inspector CLI
2. **Transport-Agnostic** - Works with stdio, SSE, Streamable HTTP
3. **Respects Test Boundaries** - Clear about what tests where
4. **TDD-Friendly** - Pure functions with unit tests

### Non-Goals

- ❌ Replace Inspector CLI entirely
- ❌ Test external services (Clerk, etc.)
- ❌ Build custom MCP client implementation

---

## Design Principles (When We Build This)

### Follow @principles.md and @testing-strategy.md

**Pure Functions First:**

```typescript
// Pure function - testable with unit tests
export interface InspectorCommand {
  serverUrl: string;
  transport: 'stdio' | 'sse' | 'http';
  method: string;
  headers?: Record<string, string>;
  timeout?: number;
}

// Pure function that builds command string
export function buildInspectorCommand(config: InspectorCommand): string {
  const parts = [
    'npx',
    '@modelcontextprotocol/inspector',
    '--cli',
    config.serverUrl,
    '--transport',
    config.transport,
    '--method',
    config.method,
  ];

  if (config.headers) {
    for (const [key, value] of Object.entries(config.headers)) {
      parts.push('--header', `${key}: ${value}`);
    }
  }

  return parts.join(' ');
}
```

**Unit test:**

```typescript
// apps/oak-curriculum-mcp-streamable-http/smoke-tests/lib/inspector-harness.unit.test.ts
import { describe, it, expect } from 'vitest';
import { buildInspectorCommand } from './inspector-harness';

describe('buildInspectorCommand', () => {
  it('builds basic command without headers', () => {
    const result = buildInspectorCommand({
      serverUrl: 'http://localhost:3333',
      transport: 'http',
      method: 'tools/list',
    });

    expect(result).toBe(
      'npx @modelcontextprotocol/inspector --cli http://localhost:3333 --transport http --method tools/list',
    );
  });

  it('includes headers when provided', () => {
    const result = buildInspectorCommand({
      serverUrl: 'http://localhost:3333',
      transport: 'http',
      method: 'tools/list',
      headers: { 'X-Test': 'value' },
    });

    expect(result).toContain('--header X-Test: value');
  });

  // Pure function, no mocks, no IO - proper unit test
});
```

**Integration with side effects (separate):**

```typescript
// This function has side effects - NOT a pure function
// Would need integration or E2E testing approach
export async function executeInspectorCommand(
  command: string,
): Promise<{ stdout: string; stderr: string }> {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);

  return execAsync(command);
}
```

### Test Boundaries

**Unit Tests (Pure Functions):**

- ✅ Command building logic
- ✅ Config validation
- ✅ Output parsing (if pure)
- ❌ No execution
- ❌ No network calls

**Integration Tests:**

- ✅ Command execution with mock Inspector
- ✅ Error handling
- ✅ Output parsing from mock responses
- ❌ No real Inspector calls
- ❌ No network calls

**E2E Tests (When Needed):**

- ✅ Real Inspector execution
- ✅ Against test MCP servers only
- ❌ NO calls to external services (Clerk, etc.)
- Note: These would NOT be run in CI due to complexity

**Smoke Tests (Manual/On-Demand):**

- ✅ Real Inspector against real servers
- ✅ Can make network calls (manual validation)
- ❌ NOT automated in CI

---

## Proposed Architecture (When We Build This)

### Pure Functions Layer

```typescript
// packages/libs/mcp-testing/src/inspector/command-builder.ts

/**
 * Pure function that builds Inspector CLI command
 */
export function buildInspectorCommand(config: InspectorCommand): string;

/**
 * Pure function that validates Inspector output structure
 */
export function validateInspectorOutput<T>(output: string): Result<T, Error>;

/**
 * Pure function that parses Inspector JSON output
 */
export function parseInspectorJSON<T>(json: string): Result<T, Error>;
```

### Integration Layer (Side Effects)

```typescript
// packages/libs/mcp-testing/src/inspector/executor.ts

/**
 * Executes Inspector CLI command
 * Has side effects - requires integration testing
 */
export async function executeInspectorCommand(
  command: string,
  options?: ExecutionOptions,
): Promise<Result<InspectorResult, Error>>;
```

### High-Level API

```typescript
// packages/libs/mcp-testing/src/inspector/api.ts

/**
 * High-level API for testing MCP servers with Inspector
 */
export async function testMcpServer(config: McpServerTestConfig): Promise<TestResult>;
```

---

## File Structure (When We Build This)

```text
packages/libs/mcp-testing/
├── src/
│   ├── inspector/
│   │   ├── command-builder.ts              ← Pure functions
│   │   ├── command-builder.unit.test.ts    ← Unit tests
│   │   ├── parser.ts                       ← Pure functions
│   │   ├── parser.unit.test.ts             ← Unit tests
│   │   ├── executor.ts                     ← Side effects
│   │   ├── executor.integration.test.ts    ← Integration tests
│   │   └── api.ts                          ← High-level API
│   ├── types/
│   │   └── inspector.ts                    ← Type definitions
│   └── index.ts                            ← Public API
├── package.json
├── tsconfig.json
└── README.md
```

---

## TDD Approach (When We Build This)

### Step 1: Pure Functions with Unit Tests

```typescript
// RED: Write test first
describe('buildInspectorCommand', () => {
  it('builds command for HTTP transport', () => {
    const result = buildInspectorCommand({
      serverUrl: 'http://localhost:3333',
      transport: 'http',
      method: 'tools/list',
    });

    expect(result).toBe(
      'npx @modelcontextprotocol/inspector --cli http://localhost:3333 --transport http --method tools/list',
    );
  });
});

// GREEN: Implement to make test pass
export function buildInspectorCommand(config: InspectorCommand): string {
  return [
    'npx',
    '@modelcontextprotocol/inspector',
    '--cli',
    config.serverUrl,
    '--transport',
    config.transport,
    '--method',
    config.method,
  ].join(' ');
}

// REFACTOR: Improve implementation if needed
```

### Step 2: Integration Tests with Simple Mocks

```typescript
// RED: Write test first
describe('executeInspectorCommand', () => {
  it('returns parsed output on success', async () => {
    const mockExec = async (cmd: string) => ({
      stdout: '{"tools": []}',
      stderr: '',
    });

    const result = await executeInspectorCommand(
      'npx @modelcontextprotocol/inspector --cli ...',
      { exec: mockExec }, // Simple mock injected as argument
    );

    expect(result.ok).toBe(true);
    expect(result.value.tools).toEqual([]);
  });
});

// GREEN: Implement
// REFACTOR: Improve
```

---

## Acceptance Criteria (When We Build This)

### Must Have

- [ ] Pure functions with unit tests (NO IO, NO mocks)
- [ ] Integration tests with simple mocks (injected as arguments)
- [ ] Respects test boundaries per @testing-strategy.md
- [ ] TDD approach throughout
- [ ] All quality gates pass
- [ ] Used by 2+ MCP servers

### Nice to Have

- [ ] Support for all MCP transports (stdio, SSE, HTTP)
- [ ] Helper for OAuth discovery validation
- [ ] Helper for tool listing validation
- [ ] CLI for manual testing

---

## When To Build This

### Triggers

1. **Second OAuth-enabled MCP server** - Primary trigger
2. **Repeated manual testing pain** - When manual Inspector calls become burdensome
3. **Regression concerns** - When we need continuous validation

### Don't Build If

1. **Only one server** - Current state
2. **Manual testing is fine** - No pain yet
3. **External tools work** - Inspector CLI is sufficient

---

## References

### Project Standards

- `.agent/directives/principles.md` - TDD, pure functions, YAGNI
- `.agent/directives/testing-strategy.md` - Test types and boundaries

### Tools

- [MCP Inspector](https://github.com/modelcontextprotocol/inspector) - What we'd wrap
- [MCP Inspector CLI Docs](https://github.com/modelcontextprotocol/inspector#cli-mode)

### Related Plans

- `remove-oauth-proxy-endpoint.md` - Where this toolkit would have been premature

---

## Key Principles

1. **YAGNI** - Don't build until you have 2+ use cases
2. **Pure functions first** - Unit testable, no side effects
3. **TDD always** - Tests first, implementation second
4. **Respect test boundaries** - Clear about what tests where
5. **Simple mocks only** - Injected as arguments, integration level

---

**Status: Waiting for second OAuth-enabled MCP server**

**Check back when:** We're building another OAuth-protected MCP server and find ourselves copy-pasting Inspector CLI commands.

---

**END OF PLAN**
