---
name: "Interface Segregation for Test Fakes"
use_this_when: "Test fakes cannot satisfy a complex generated type without type assertions"
category: testing
proven_in: "apps/oak-curriculum-mcp-streamable-http (widget renderer contracts, tool execution tests)"
proven_date: 2026-02-22
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Assertion pressure from complex generated types leaking into test code"
  stable: true
---

# Interface Segregation for Test Fakes

## Problem

Generated types (from OpenAPI schemas, Zod validators, or similar) are
often large, with many fields. Test fakes that must satisfy the full type
require populating dozens of irrelevant fields, creating pressure to use
type assertions (`as`) to bypass the compiler.

## Pattern

Extract a narrowed interface containing only the fields consumed by the
code under test. The test fake satisfies the narrow interface; the
production code accepts the narrow interface rather than the full
generated type.

```typescript
interface ToolExecutionDeps {
  readonly name: string;
  readonly execute: (args: unknown) => Promise<CallToolResult>;
}

const fakeTool: ToolExecutionDeps = {
  name: 'test-tool',
  execute: async () => ({ content: [{ type: 'text', text: 'ok' }] }),
};
```

## Anti-Pattern

```typescript
const fakeTool = {
  name: 'test-tool',
  execute: async () => ({ content: [{ type: 'text', text: 'ok' }] }),
} as FullGeneratedToolDescriptor; // assertion hides missing fields
```

## Why It Works

The assertion tells the compiler "trust me" — but the missing fields may
matter at runtime or in future refactors. The narrowed interface tells
the compiler "I only need these fields" — which is both true and
verifiable. When the generated type changes, the narrowed interface
either still compiles (fields are present) or fails at the interface
definition (not scattered across dozens of test files).

## Related

- [ADR-078: Dependency Injection for Testability](../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md)
- [TypeScript Practice: Interface Segregation for Testability](../../docs/governance/typescript-practice.md#interface-segregation-for-testability)
