# Continue MCP Prompts Type-Gen Implementation

## Objective

Implement the MCP prompts type-gen architecture as specified in the plan. Move prompt definitions from hand-written SDK code to generated code at type-gen time.

## Essential Context

### Current Problem

MCP prompt arguments are not being passed correctly. E2E tests fail:

```
Expected: 'number'
Received: I want to understand how the concept of "the concept" develops...
```

The current implementation in `apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts` uses banned type assertions (`as unknown as`) to extract arguments, and `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts` is hand-written (violating the cardinal rule).

### Key Architectural Insight

**Zod 3.25.76 includes Zod v4**. The SDK has `zod@3.25.76` installed, which exposes both APIs:

```typescript
import { z } from 'zod'; // Zod v3 API
import { z } from 'zod/v4'; // Zod v4 API - SAME PACKAGE
```

This is already proven in `packages/sdks/oak-curriculum-sdk/src/mcp/zod-input-schema.ts`:

```typescript
import { z } from 'zod';
import { z as z4 } from 'zod/v4';
```

**Implication**: The SDK's type-gen code can generate Zod v4 schemas using `import { z } from 'zod/v4'`. Apps using Zod v4 consume them directly - NO compatibility layer needed.

### Cardinal Rule (from rules.md)

> "ALL static data structures, types, type guards, Zod schemas, Zod validators, and other type related information MUST be generated at compile time ONLY, and so flow from the Open Curriculum OpenAPI schema in the SDK."

Prompt definitions are static data. They MUST be generated at type-gen time, not hand-written.

## Plan Location

**Read the full plan**: `.agent/plans/sdk-and-mcp-enhancements/04-mcp-prompts-and-agent-guidance-plan.md`

## Architecture Summary

### Current (Wrong)

```
SDK (hand-written):
  src/mcp/mcp-prompts.ts  ← WRONG: Hand-written, violates cardinal rule

App:
  src/register-prompts.ts ← WRONG: Type assertions, broken
  src/prompt-schemas.ts   ← WRONG: Schemas defined in app
```

### Target (Correct)

```
SDK (type-gen):
  type-gen/mcp-prompts/
    prompt-definitions.ts     ← Source of truth
    generate-mcp-prompts.ts   ← Generator

  src/mcp/generated/
    mcp-prompts.ts  ← GENERATED with:
      - import { z } from 'zod/v4'
      - Zod v4 schemas
      - MCP_PROMPTS array
      - getPromptMessages()

App:
  src/register-prompts.ts ← Imports from SDK, no local schemas
```

## Phase Summary

| Phase | Purpose                                              | Status      |
| ----- | ---------------------------------------------------- | ----------- |
| **0** | Create prompt definitions + generator in type-gen    | NOT STARTED |
| **1** | Integrate into type-gen pipeline, update SDK exports | NOT STARTED |
| **2** | Update app to import from SDK                        | NOT STARTED |
| **3** | Validation and compliance                            | NOT STARTED |

## Files to Create

1. `packages/sdks/oak-curriculum-sdk/type-gen/mcp-prompts/prompt-definitions.ts`
2. `packages/sdks/oak-curriculum-sdk/type-gen/mcp-prompts/generate-mcp-prompts.ts`

## Files to Delete

1. `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts` (hand-written)
2. `apps/oak-curriculum-mcp-streamable-http/src/prompt-schemas.ts` (wrong location)

## Testing Strategy

Tests prove **behavior**, not types or structure:

- **E2E**: "When prompts/get is called with args, response contains those values"
- **type-check**: Validates types are correct
- **lint**: Validates code structure

Existing E2E tests already specify correct behavior. Implementation must make them pass (TDD).

## Foundation Documents

Read these before starting:

1. `.agent/directives-and-memory/rules.md` - Cardinal rule, no type shortcuts
2. `.agent/directives-and-memory/testing-strategy.md` - TDD proves behavior
3. `.agent/directives-and-memory/schema-first-execution.md` - Generator is source of truth

## Key Constraints

1. **NO `zod/v3` imports outside SDK** - Apps use Zod v4 only
2. **NO type assertions** (`as`, `any`, `!`, `Record<string, unknown>`)
3. **Generated code uses `import { z } from 'zod/v4'`**
4. **App imports schemas from SDK** - No local schema definitions

## Quality Gates

After each task:

```bash
pnpm type-check && pnpm lint && pnpm test
```

After each phase:

```bash
pnpm build && pnpm type-check && pnpm lint && pnpm test && pnpm test:e2e
```

## Existing POC Test

A proof-of-concept integration test exists at:
`apps/oak-curriculum-mcp-streamable-http/src/register-prompts.integration.test.ts`

This confirms that `server.registerPrompt()` with `argsSchema` works correctly with Zod v4. The test passes.

## Starting Point

Begin with **Phase 0, Task 0.1**: Create prompt definitions source file in `type-gen/mcp-prompts/prompt-definitions.ts`.

Reference the existing `mcp-prompts.ts` for the three prompts (find-lessons, lesson-planning, progression-map) and their message templates.

## Commands

```bash
# Run type generation
pnpm type-gen

# Run all quality gates
pnpm build && pnpm type-check && pnpm lint && pnpm test && pnpm test:e2e

# Run prompts E2E tests specifically
pnpm test:e2e --filter=@oaknational/oak-curriculum-mcp-streamable-http -- prompts.e2e.test.ts
```
