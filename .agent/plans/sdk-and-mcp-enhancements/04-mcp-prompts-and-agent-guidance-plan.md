# MCP Prompts Type-Gen Enhancement Plan

**Last Updated**: 2025-11-28  
**Status**: 🟡 ENHANCEMENT (NOT A FIX)  
**Scope**: Move MCP prompt definitions to type-gen for architectural consistency; current implementation is working

---

## Context

We are building a "start here" experience for MCP clients that provides AI agents with guidance on how and when to use the Oak Curriculum tools. This includes:

1. **Documentation Resources** - file-like docs (getting-started.md, tools.md, workflows.md)
2. **get-help Tool** - structured guidance the model can query at any time
3. **Prompts** - workflow templates (find-lessons, lesson-planning, progression-map)

### Current State (2025-11-28)

**The prompts are working correctly.** All E2E tests pass:

```
✓ e2e-tests/prompts.e2e.test.ts (8 tests) 54ms
Test Files  1 passed (1)
     Tests  8 passed (8)
```

The current implementation uses:

- `prompt-schemas.ts` in the app (Zod v4 schemas)
- `mcp-prompts.ts` in the SDK (prompt metadata and message generators)
- `register-prompts.ts` wiring them together with `argsSchema`

### Why This Is Now an Enhancement, Not a Fix

The original plan was written when prompts were failing due to argument passing issues. Those issues have been resolved. This plan now represents an **architectural enhancement** to:

1. Move Zod schemas from app to SDK (centralise in single source of truth)
2. Generate prompt definitions at type-gen time (follow cardinal rule more strictly)
3. Reduce app complexity (make app a thinner consumer)

### Architectural Note

While `mcp-prompts.ts` is hand-written, prompts are **not derived from the OpenAPI schema** - they are independent MCP metadata. The cardinal rule specifically targets ensuring that upstream OpenAPI schema changes flow through via `pnpm type-gen`. Prompts don't have this requirement.

However, moving prompts to type-gen would still improve consistency and make future prompt additions simpler.

---

## Key Insight: Zod 3.25.76 Includes Zod v4

The SDK uses Zod 3.25.76. This version **ships with Zod v4 included**:

```typescript
// In SDK (which has zod@3.25.76 installed)
import { z } from 'zod'; // Zod v3 API
import { z } from 'zod/v4'; // Zod v4 API - SAME PACKAGE!
```

This is already proven in `zod-input-schema.ts`:

```typescript
import { z } from 'zod';
import { z as z4 } from 'zod/v4';
```

**Implication**: The SDK's type-gen code can generate Zod v4 schemas using `import { z } from 'zod/v4'`. Apps using Zod v4 consume them directly - **no compatibility layer needed**.

---

## Solution Architecture

### Current (Wrong)

```
SDK (hand-written):
  src/mcp/mcp-prompts.ts  ← Hand-written, violates cardinal rule
    - MCP_PROMPTS array
    - getPromptMessages()
    - NO Zod schemas

App:
  src/register-prompts.ts ← Type assertions, broken arg extraction
  src/prompt-schemas.ts   ← Zod schemas defined in wrong place
```

### Target (Correct)

```
SDK (type-gen):
  type-gen/
    mcp-prompts/
      prompt-definitions.ts  ← Source of truth (config)
      generate-mcp-prompts.ts ← Generator

  src/mcp/generated/
    mcp-prompts.ts  ← GENERATED at type-gen time
      - MCP_PROMPTS array
      - Zod v4 schemas (using 'zod/v4')
      - getPromptMessages()
      - TypeScript types

  public/mcp-tools.ts  ← Exports generated content

App:
  src/register-prompts.ts
    - Imports from SDK (schemas, metadata, getPromptMessages)
    - Uses server.registerPrompt() with imported argsSchema
    - NO local schema definitions
    - NO type assertions
```

### Testing Strategy (from testing-strategy.md)

| Concern              | Tool              | Purpose                       |
| -------------------- | ----------------- | ----------------------------- |
| **Behavior**         | Tests (TDD)       | "What does it DO?"            |
| **Type correctness** | `pnpm type-check` | "Are types sound?"            |
| **Code structure**   | `pnpm lint`       | "Does it follow conventions?" |

Tests should NOT validate Zod schema structure - that's what type-check does. Tests prove behavior:

- "When prompts/get is called with arguments, messages contain those argument values"
- "When getPromptMessages() is called, it returns appropriate messages"

---

## Foundation Document Commitment

Before each phase:

1. **Re-read** `rules.md` - Cardinal rule, no type shortcuts
2. **Re-read** `testing-strategy.md` - TDD proves behavior, not types
3. **Re-read** `schema-first-execution.md` - Generator is single source of truth
4. **Ask**: "Is this generated, not hand-written?"
5. **Verify**: No `zod/v3` references outside SDK, no type assertions

---

## Quality Gate Strategy

**After Each Task**:

```bash
pnpm type-check  # Type correctness
pnpm lint        # Code structure
pnpm test        # Behavior
```

**After Each Phase**:

```bash
pnpm build && pnpm type-check && pnpm lint && pnpm test && pnpm test:e2e
```

---

## Resolution Plan

### Phase 0: Create Prompt Definition Source (30 mins)

**Purpose**: Create the source of truth for prompt definitions in the type-gen directory.

#### Task 0.1: Create Prompt Definition Config

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/mcp-prompts/prompt-definitions.ts`

This file defines prompts declaratively. The generator reads this and produces TypeScript/Zod output.

```typescript
/**
 * MCP Prompt Definitions
 *
 * Source of truth for MCP prompts. This file is read by the prompt generator
 * to produce TypeScript code with Zod v4 schemas.
 *
 * @remarks This is INPUT to type-gen, not output. Changes here flow to
 * generated files when `pnpm type-gen` runs.
 */

export interface PromptArgumentDef {
  readonly name: string;
  readonly description: string;
  readonly required: boolean;
}

export interface PromptDef {
  readonly name: string;
  readonly description: string;
  readonly arguments: readonly PromptArgumentDef[];
  readonly messageTemplate: (args: Record<string, string | undefined>) => string;
}

export const PROMPT_DEFINITIONS: readonly PromptDef[] = [
  {
    name: 'find-lessons',
    description:
      'Find curriculum lessons on a specific topic. Searches across all subjects and key stages.',
    arguments: [
      {
        name: 'topic',
        description: 'The topic or concept to search for (e.g., "photosynthesis", "fractions")',
        required: true,
      },
      {
        name: 'keyStage',
        description: 'Optional: Filter by key stage (e.g., "ks1", "ks2", "ks3", "ks4")',
        required: false,
      },
    ],
    messageTemplate: (args) => {
      const topic = args.topic ?? 'the topic';
      const keyStage = args.keyStage;
      const keyStageNote = keyStage ? ` Focus on ${keyStage} content.` : '';
      return `I want to find lessons about "${topic}".${keyStageNote}

Please:
1. Use the search tool to find lessons matching this topic${keyStage ? ` with keyStage: "${keyStage}"` : ''}
2. Review the results and identify the most relevant lessons
3. For the top 3-5 lessons, provide a brief summary of what each covers
4. Suggest which lesson might be best for different learning objectives`;
    },
  },
  {
    name: 'lesson-planning',
    description:
      'Gather materials for planning a lesson on a topic, including objectives, transcript, quiz questions, and resources.',
    arguments: [
      {
        name: 'topic',
        description: 'The topic for the lesson (e.g., "adding fractions", "the water cycle")',
        required: true,
      },
      {
        name: 'year',
        description: 'The year group (e.g., "Year 4", "Year 9")',
        required: true,
      },
    ],
    messageTemplate: (args) => {
      const topic = args.topic ?? 'the topic';
      const year = args.year ?? 'the year group';
      return `I'm planning a lesson on "${topic}" for ${year}. Please help me gather materials.

Steps:
1. Search for lessons on "${topic}" that are appropriate for ${year}
2. Select the most relevant lesson
3. Get the lesson summary for learning objectives and keywords
4. Get the lesson transcript to understand the content delivery
5. Get quiz questions for assessment ideas
6. Get available assets (slides, worksheets)

Please provide:
- Learning objectives from the lesson
- Key vocabulary/keywords
- A summary of the lesson structure
- Quiz questions that could be used for assessment
- Links to any downloadable resources`;
    },
  },
  {
    name: 'progression-map',
    description:
      'Map how a concept develops across years in a subject, showing progression from early learning to GCSE.',
    arguments: [
      {
        name: 'concept',
        description: 'The concept thread to explore (e.g., "number", "forces", "grammar")',
        required: true,
      },
      {
        name: 'subject',
        description: 'The subject area (e.g., "maths", "science", "english")',
        required: true,
      },
    ],
    messageTemplate: (args) => {
      const concept = args.concept ?? 'the concept';
      const subject = args.subject ?? 'the subject';
      return `I want to understand how the concept of "${concept}" develops across years in ${subject}.

Please:
1. Use get-threads to find threads related to "${concept}" in ${subject}
2. Use get-threads-units to get the units in the relevant thread
3. Map out the progression showing:
   - What is taught at each stage
   - How concepts build on previous learning
   - Key prerequisites and dependencies
4. Identify any gaps or jumps in the progression
5. Suggest how to scaffold learning for students who need support`;
    },
  },
] as const;
```

**Acceptance Criteria**:

1. ✅ File created at `type-gen/mcp-prompts/prompt-definitions.ts`
2. ✅ All three prompts defined with arguments and message templates
3. ✅ Clear interface definitions for prompt structure
4. ✅ Comprehensive JSDoc documentation
5. ✅ `pnpm type-check` passes

---

#### Task 0.2: Create Prompt Generator

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/mcp-prompts/generate-mcp-prompts.ts`

This generator reads `prompt-definitions.ts` and emits TypeScript code.

```typescript
/**
 * MCP Prompt Generator
 *
 * Generates TypeScript code for MCP prompts including:
 * - MCP_PROMPTS array (prompt metadata)
 * - Zod v4 schemas for prompt arguments
 * - getPromptMessages() function
 * - TypeScript types
 *
 * @remarks Uses 'zod/v4' import so generated schemas are Zod v4 compatible.
 * Apps using Zod v4 can consume these directly.
 */

import { PROMPT_DEFINITIONS, type PromptDef } from './prompt-definitions.js';

function generateZodSchema(prompt: PromptDef): string {
  const fields = prompt.arguments.map((arg) => {
    const base = `z.string().describe('${arg.description.replace(/'/g, "\\'")}')`;
    return arg.required ? `  ${arg.name}: ${base},` : `  ${arg.name}: ${base}.optional(),`;
  });
  return `{\n${fields.join('\n')}\n}`;
}

function generateMessageFunction(prompt: PromptDef): string {
  // Extract the function body as a string template
  const funcStr = prompt.messageTemplate.toString();
  // This is simplified - actual implementation would be more robust
  return funcStr;
}

export function generateMcpPromptsFile(): string {
  const imports = `/**
 * MCP Prompts for Oak Curriculum Server
 * 
 * @generated This file is generated by type-gen. Do not edit manually.
 * @see type-gen/mcp-prompts/prompt-definitions.ts - Source definitions
 */

import { z } from 'zod/v4';
`;

  const schemaExports = PROMPT_DEFINITIONS.map((prompt) => {
    const schemaName = `${toCamelCase(prompt.name)}ArgsSchema`;
    return `/**
 * Zod v4 schema for ${prompt.name} prompt arguments.
 */
export const ${schemaName} = ${generateZodSchema(prompt)};

/**
 * TypeScript type for ${prompt.name} prompt arguments.
 */
export type ${toPascalCase(prompt.name)}Args = z.infer<typeof z.object(${schemaName})>;
`;
  }).join('\n');

  const mcpPromptsArray = `/**
 * MCP prompt metadata for registration with MCP server.
 */
export const MCP_PROMPTS = [
${PROMPT_DEFINITIONS.map(
  (p) => `  {
    name: '${p.name}',
    description: '${p.description.replace(/'/g, "\\'")}',
    arguments: [
${p.arguments.map((a) => `      { name: '${a.name}', description: '${a.description.replace(/'/g, "\\'")}', required: ${a.required} },`).join('\n')}
    ],
  },`,
).join('\n')}
] as const;
`;

  const promptArgsType = `/**
 * Prompt arguments type - allows any string keys with optional string values.
 */
export type PromptArgs = Readonly<Record<string, string | undefined>>;
`;

  const getPromptMessagesFunc = `// ... message generation functions ...`;

  return `${imports}\n${schemaExports}\n${mcpPromptsArray}\n${promptArgsType}\n${getPromptMessagesFunc}`;
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}
```

**Acceptance Criteria**:

1. ✅ Generator created at `type-gen/mcp-prompts/generate-mcp-prompts.ts`
2. ✅ Generates `import { z } from 'zod/v4'` (NOT 'zod' or 'zod/v3')
3. ✅ Generates Zod schemas for each prompt's arguments
4. ✅ Generates MCP_PROMPTS array
5. ✅ Generates getPromptMessages() function
6. ✅ Comprehensive JSDoc in generated output
7. ✅ `pnpm type-check` passes

---

### Phase 1: Integrate Generator into Type-Gen Pipeline (30 mins)

**Purpose**: Wire the prompt generator into the existing type-gen process.

#### Task 1.1: Add Prompt Generation to typegen-core.ts

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen-core.ts`

Add a call to generate prompt files alongside other generated content.

**Acceptance Criteria**:

1. ✅ Prompt generator integrated into `generateSchemaArtifacts()`
2. ✅ Generated file written to `src/mcp/generated/mcp-prompts.ts`
3. ✅ `pnpm type-gen` produces the prompt file
4. ✅ Generated file compiles without errors

---

#### Task 1.2: Update SDK Exports

**File**: `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts`

Export the generated prompt content:

```typescript
// Re-export generated prompt schemas and utilities
export {
  MCP_PROMPTS,
  getPromptMessages,
  findLessonsArgsSchema,
  lessonPlanningArgsSchema,
  progressionMapArgsSchema,
  type PromptArgs,
  type FindLessonsArgs,
  type LessonPlanningArgs,
  type ProgressionMapArgs,
} from '../mcp/generated/mcp-prompts.js';
```

**Acceptance Criteria**:

1. ✅ All prompt schemas exported from SDK public API
2. ✅ All prompt types exported
3. ✅ MCP_PROMPTS and getPromptMessages exported
4. ✅ `pnpm build` succeeds
5. ✅ Apps can import schemas from SDK

---

#### Task 1.3: Delete Hand-Written mcp-prompts.ts

**File to delete**: `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`

Replace with generated version.

**Acceptance Criteria**:

1. ✅ Hand-written `mcp-prompts.ts` deleted
2. ✅ Generated `mcp-prompts.ts` in `generated/` directory
3. ✅ All imports updated to use new path
4. ✅ Existing tests still pass (behavior unchanged)
5. ✅ `pnpm build` succeeds

---

### Phase 2: Update App to Use SDK Exports (30 mins)

**Purpose**: Update app to import Zod schemas from SDK instead of defining locally.

#### Task 2.1: Delete App-Layer prompt-schemas.ts

**File to delete**: `apps/oak-curriculum-mcp-streamable-http/src/prompt-schemas.ts`

This file is wrong - schemas should come from SDK.

**Acceptance Criteria**:

1. ✅ `prompt-schemas.ts` deleted from app
2. ✅ No Zod schema definitions in app for prompts

---

#### Task 2.2: Rewrite register-prompts.ts

**File**: `apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts`

Import schemas from SDK and use with registerPrompt():

```typescript
/**
 * MCP Prompts Registration
 *
 * Registers workflow prompts with the MCP server using schemas
 * generated by the SDK at type-gen time.
 *
 * @remarks Prompt schemas are generated in the SDK using Zod v4 (via 'zod/v4').
 * This app uses Zod v4, so schemas are directly compatible.
 *
 * @see @oaknational/oak-curriculum-sdk - Generated prompt schemas
 * @module register-prompts
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  MCP_PROMPTS,
  getPromptMessages,
  findLessonsArgsSchema,
  lessonPlanningArgsSchema,
  progressionMapArgsSchema,
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';

/**
 * Map of prompt names to their Zod v4 argument schemas.
 * Schemas are imported from SDK (generated at type-gen time).
 */
const PROMPT_SCHEMAS = {
  'find-lessons': findLessonsArgsSchema,
  'lesson-planning': lessonPlanningArgsSchema,
  'progression-map': progressionMapArgsSchema,
} as const;

/**
 * Registers MCP prompts for common curriculum workflows.
 *
 * @param server - MCP server instance
 */
export function registerPrompts(server: McpServer): void {
  for (const prompt of MCP_PROMPTS) {
    const schema = PROMPT_SCHEMAS[prompt.name as keyof typeof PROMPT_SCHEMAS];

    server.registerPrompt(
      prompt.name,
      {
        description: prompt.description,
        argsSchema: schema,
      },
      (args) => {
        const messages = getPromptMessages(prompt.name, args);
        return {
          messages: messages.map((m) => ({
            role: m.role,
            content: { type: 'text' as const, text: m.content.text },
          })),
        };
      },
    );
  }
}
```

**Acceptance Criteria**:

1. ✅ Imports schemas from SDK, not local file
2. ✅ No `as unknown as` or type assertions
3. ✅ No `zod` or `zod/v3` imports in app's register-prompts.ts
4. ✅ Uses `server.registerPrompt()` with `argsSchema`
5. ✅ `extractArgsFromExtra` workaround removed
6. ✅ `pnpm type-check` passes
7. ✅ `pnpm lint` passes (no type assertion errors)

---

#### Task 2.3: Verify E2E Tests Pass (GREEN)

**Purpose**: TDD - the existing E2E tests specify behavior. Implementation must make them pass.

**Acceptance Criteria**:

1. ✅ All prompts E2E tests pass
2. ✅ Arguments correctly passed through to messages
3. ✅ No fallback values in test output
4. ✅ `pnpm test:e2e` exits 0

---

### Phase 3: Cleanup and Validation (20 mins)

#### Task 3.1: Fix Prettier Errors

Remove trailing newlines from flagged files.

**Acceptance Criteria**:

1. ✅ `pnpm lint` passes with 0 errors

---

#### Task 3.2: Run Full Quality Gates

```bash
pnpm build && pnpm type-check && pnpm lint && pnpm test && pnpm test:e2e
```

**Acceptance Criteria**:

1. ✅ All gates pass
2. ✅ No regressions

---

#### Task 3.3: Foundation Document Compliance

Verify compliance with foundation documents:

- [ ] **rules.md - Cardinal Rule**: Prompts generated at type-gen time, flow from SDK
- [ ] **rules.md - No Type Shortcuts**: No `as`, `any`, `Record<string, unknown>`
- [ ] **rules.md - No Zod v3 outside SDK**: App has no `zod/v3` imports
- [ ] **testing-strategy.md - TDD**: E2E tests specified behavior; implementation made them pass
- [ ] **testing-strategy.md - Tests prove behavior**: Tests don't validate Zod schema structure
- [ ] **schema-first-execution.md**: Generator is source of truth

---

## Testing Strategy

### What Tests Prove (Behavior)

| Level           | Proves                                                                     |
| --------------- | -------------------------------------------------------------------------- |
| **E2E**         | "When prompts/get is called with args, response contains those arg values" |
| **Integration** | "When registerPrompts() runs, server has prompts registered"               |
| **Unit**        | "When getPromptMessages('name', args) is called, returns correct messages" |

### What Tests Do NOT Prove

- Zod schema structure (type-check validates this)
- Code formatting (lint validates this)
- Type definitions (type-check validates this)

### Test Changes

- **No new tests needed** - existing E2E tests already specify correct behavior
- **Existing tests will pass** - once implementation is correct

---

## Success Criteria

### Phase 0 (Source Definition)

- ✅ Prompt definitions in type-gen directory
- ✅ Generator produces Zod v4 schemas via `zod/v4` import

### Phase 1 (Type-Gen Integration)

- ✅ `pnpm type-gen` produces prompt file
- ✅ SDK exports generated schemas
- ✅ Hand-written mcp-prompts.ts deleted

### Phase 2 (App Update)

- ✅ App imports schemas from SDK
- ✅ No local schema definitions
- ✅ No type assertions
- ✅ E2E tests pass

### Phase 3 (Validation)

- ✅ All quality gates pass
- ✅ Foundation document compliance verified

---

## Key Architectural Decisions

### 1. Zod v4 via `zod/v4` Import

The SDK's Zod 3.25.76 includes Zod v4 accessible via `import { z } from 'zod/v4'`. Generated schemas use this import, making them natively Zod v4.

**No compatibility layer needed** - apps using Zod v4 consume SDK schemas directly.

### 2. Generated, Not Hand-Written

Prompt definitions are **input** to type-gen (in `type-gen/mcp-prompts/`). The **output** is generated TypeScript (in `src/mcp/generated/`).

This follows the cardinal rule: all static data structures flow from type-gen.

### 3. SDK Exports Schemas

Unlike the previous approach where app defined schemas, now:

- SDK generates Zod v4 schemas
- SDK exports them via public API
- App imports and uses them

### 4. Tests Prove Behavior Only

Tests validate:

- "Does it work correctly?" (behavior)

Type-check validates:

- "Are types correct?" (structure)

Lint validates:

- "Does code follow conventions?" (style)

---

## References

- **Source definitions**: `type-gen/mcp-prompts/prompt-definitions.ts`
- **Generator**: `type-gen/mcp-prompts/generate-mcp-prompts.ts`
- **Generated output**: `src/mcp/generated/mcp-prompts.ts`
- **App registration**: `apps/.../src/register-prompts.ts`
- **E2E tests**: `apps/.../e2e-tests/prompts.e2e.test.ts`
- **Zod pattern example**: `src/mcp/zod-input-schema.ts` (shows `zod/v4` import)

### Foundation Documents

- `rules.md` - Cardinal rule, no type shortcuts
- `testing-strategy.md` - TDD proves behavior
- `schema-first-execution.md` - Generator is source of truth

---

## Notes

### Why This Matters

**Immediate Fix**:

- Prompts work with arguments (E2E tests pass)
- No type assertions (lint passes)

**Architectural Correctness**:

- Follows cardinal rule (generated, not hand-written)
- SDK is source of truth
- App is a thin consumer

**Future Extensibility**:

- Add new prompts by updating `prompt-definitions.ts`
- Run `pnpm type-gen` - everything flows through
- No app changes needed for new prompts

### Risk Mitigation

- **Incremental**: Each phase validates before proceeding
- **TDD**: E2E tests already specify correct behavior
- **Proven pattern**: Generator approach matches MCP tools implementation
- **Reversible**: Can run type-gen again if issues arise
