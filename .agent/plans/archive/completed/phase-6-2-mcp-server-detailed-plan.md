# Phase 6.2: MCP Server Implementation - Detailed Plan

**Status**: READY TO IMPLEMENT  
**Prerequisites**: Phase 6.1 SDK ✅ COMPLETED  
**Location**: `ecosystem/psycha/oak-curriculum-mcp`  
**Architecture**: Biological (Chorai/Organa/Psychon)

## 🎯 Objectives

1. Create MCP server that wraps Oak Curriculum SDK
2. Follow biological architecture patterns from oak-notion-mcp
3. Implement 5 core curriculum tools
4. Enable multi-server coexistence
5. Maintain runtime isolation principles

## 📐 Architecture Overview

```text
ecosystem/psycha/oak-curriculum-mcp/
├── src/
│   ├── chorai/                 # Pervasive fields (plural, matching oak-notion-mcp)
│   │   ├── stroma/             # Types and contracts
│   │   │   ├── curriculum-contracts/  # Operation contracts
│   │   │   ├── curriculum-types/      # Type definitions
│   │   │   ├── mcp-contracts/         # MCP-specific contracts
│   │   │   └── index.ts               # Stroma membrane
│   │   ├── aither/             # Logging
│   │   │   └── index.ts
│   │   ├── phaneron/           # Configuration
│   │   │   ├── curriculum-config/
│   │   │   └── index.ts
│   │   └── eidola/             # Test mocks (if needed)
│   │       └── index.ts
│   ├── organa/                 # Business logic organs
│   │   ├── curriculum/         # Main curriculum organ
│   │   │   ├── operations/    # Business operations
│   │   │   ├── transformers/  # Data transformations
│   │   │   ├── errors/        # Error handling
│   │   │   └── index.ts       # Organ membrane
│   │   └── mcp/               # MCP protocol organ
│   │       ├── tools/         # Tool definitions
│   │       ├── handlers/      # Tool handlers
│   │       └── index.ts
│   └── psychon/                # Wiring layer
│       ├── server.ts           # MCP server setup
│       ├── wiring.ts          # Dependency injection
│       └── index.ts           # Entry point
├── e2e-tests/
│   └── server.e2e.test.ts
├── vitest.e2e.config.ts
└── package.json
```

## 📝 Implementation Steps

### Step 1: Project Setup (30 mins)

```bash
# Already exists but needs configuration
cd ecosystem/psycha/oak-curriculum-mcp
```

**Tasks**:

1. ✅ Directory already created
2. [ ] Update package.json with dependencies
3. [ ] Configure TypeScript and build tools
4. [ ] Set up test infrastructure

**Dependencies to add**:

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.26.0",
    "@oaknational/oak-curriculum-sdk": "workspace:*",
    "@oaknational/mcp-moria": "workspace:*",
    "@oaknational/mcp-histos-logger": "workspace:*",
    "@oaknational/mcp-histos-env": "workspace:*",
    "dotenv": "^17.2.1",
    "zod": "^3.23.8",
    "zod-to-json-schema": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^24",
    "vitest": "^3.2.4"
  },
  "scripts": {
    "build": "tsup && tsc --emitDeclarationOnly --project tsconfig.build.json",
    "lint": "eslint .",
    "test": "vitest",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  }
}
```

### Step 2: Chorai Layer - Pervasive Fields (1 hour)

#### 2.1 Stroma (Types and Contracts)

**File**: `src/chorai/stroma/curriculum-contracts/operations.ts`

```typescript
// Operation contracts for curriculum domain
import type { Lesson, Programme, Unit } from '@oaknational/oak-curriculum-sdk';

export interface CurriculumOperations {
  searchLessons(params: SearchLessonsParams): Promise<Lesson[]>;
  getLesson(slug: string): Promise<Lesson>;
  listProgrammes(): Promise<Programme[]>;
  getUnit(slug: string): Promise<Unit>;
  browseCurriculum(params: BrowseParams): Promise<CurriculumStructure>;
}

export interface SearchLessonsParams {
  subject?: string;
  keyStage?: string;
  limit?: number;
}

export interface BrowseParams {
  subject?: string;
  keyStage?: string;
}

export interface CurriculumStructure {
  programmes: Programme[];
  units: Unit[];
  lessons: Lesson[];
}
```

**File**: `src/chorai/stroma/curriculum-types/types.ts`

```typescript
// Import SDK types
import type { Lesson, Programme, Unit, SearchParams } from '@oaknational/oak-curriculum-sdk';

// MCP-specific types
export interface CurriculumToolInput {
  tool: string;
  params: unknown;
}

export interface CurriculumToolOutput {
  success: boolean;
  data?: unknown;
  error?: string;
}
```

#### 2.2 Aither (Logging)

**File**: `src/chorai/aither/index.ts`

```typescript
import { createAdaptiveLogger } from '@oaknational/mcp-histos-logger';

export const logger = createAdaptiveLogger({
  name: 'oak-curriculum-mcp',
  level: process.env.LOG_LEVEL || 'info',
});
```

#### 2.3 Phaneron (Configuration)

**File**: `src/chorai/phaneron/curriculum-config/config.ts`

```typescript
import { z } from 'zod';

// MCP-specific configuration only
// SDK handles its own configuration per ADR-027
const ConfigSchema = z.object({
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  MCP_SERVER_NAME: z.string().default('oak-curriculum-mcp'),
});

export function loadConfig() {
  const result = ConfigSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(`Invalid configuration: ${result.error.message}`);
  }
  return result.data;
}
```

### Step 3: Organa Layer - Business Logic (2 hours)

#### 3.1 Curriculum Organ

**File**: `src/organa/curriculum/operations/search.ts`

```typescript
import type { OakCurriculumClient } from '@oaknational/oak-curriculum-sdk';
import type { Logger } from '@oaknational/mcp-moria';

import { CurriculumOperationError } from '../errors/curriculum-errors';

export async function searchLessons(
  sdk: OakCurriculumClient,
  logger: Logger,
  params: {
    subject?: string;
    keyStage?: string;
    limit?: number;
  },
) {
  logger.info('Searching lessons', params);

  try {
    const results = await sdk.searchLessons(params);
    logger.debug(`Found ${results.length} lessons`);
    return results;
  } catch (error) {
    logger.error('Search failed', error);
    throw new CurriculumOperationError('searchLessons', error, { params });
  }
}
```

**File**: `src/organa/curriculum/errors/curriculum-errors.ts`

```typescript
export class CurriculumOperationError extends Error {
  constructor(
    operation: string,
    cause: unknown,
    public readonly context?: Record<string, unknown>,
  ) {
    super(`Curriculum ${operation} failed: ${String(cause)}`);
    this.name = 'CurriculumOperationError';
  }
}
```

**File**: `src/organa/curriculum/index.ts` (Organ Membrane)

```typescript
import type { OakCurriculumClient } from '@oaknational/oak-curriculum-sdk';
import type { Logger } from '@oaknational/mcp-moria';
import * as operations from './operations';

export interface CurriculumOrganDeps {
  sdk: OakCurriculumClient;
  logger: Logger;
}

import type { CurriculumOperations } from '../../chorai/stroma/curriculum-contracts/operations';

export function createCurriculumOrgan(deps: CurriculumOrganDeps): CurriculumOperations {
  return {
    searchLessons: (params) => operations.searchLessons(deps.sdk, deps.logger, params),
    getLesson: (slug) => operations.getLesson(deps.sdk, deps.logger, slug),
    listProgrammes: () => operations.listProgrammes(deps.sdk, deps.logger),
    getUnit: (slug) => operations.getUnit(deps.sdk, deps.logger, slug),
    browseCurriculum: (params) => operations.browseCurriculum(deps.sdk, deps.logger, params),
  };
}
```

#### 3.2 MCP Organ

**File**: `src/organa/mcp/tools/definitions.ts`

```typescript
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Input validation schemas
export const SearchLessonsSchema = z.object({
  subject: z.string().optional(),
  keyStage: z.string().optional(),
  limit: z.number().int().positive().max(100).default(10),
});

export const GetLessonSchema = z.object({
  lessonSlug: z.string().min(1),
});

// Tool definitions
export const TOOL_DEFINITIONS = {
  'oak-search-lessons': {
    description: 'Search Oak National Academy lessons',
    inputSchema: zodToJsonSchema(SearchLessonsSchema),
  },
  'oak-get-lesson': {
    description: 'Get detailed lesson information',
    inputSchema: zodToJsonSchema(GetLessonSchema),
  },
  'oak-list-programmes': {
    description: 'List all curriculum programmes',
    inputSchema: zodToJsonSchema(z.object({})),
  },
  'oak-get-unit': {
    description: 'Get unit details with lessons',
    inputSchema: zodToJsonSchema(
      z.object({
        unitSlug: z.string().min(1),
      }),
    ),
  },
  'oak-browse-curriculum': {
    description: 'Browse curriculum structure',
    inputSchema: zodToJsonSchema(
      z.object({
        subject: z.string().optional(),
        keyStage: z.string().optional(),
      }),
    ),
  },
};
```

**File**: `src/organa/mcp/handlers/tool-handler.ts`

```typescript
import type { CurriculumOperations } from '../../../chorai/stroma/curriculum-contracts/operations';
import { SearchLessonsSchema, GetLessonSchema } from '../tools/definitions';

// Use interface abstraction, not direct organ coupling
export function createToolHandler(curriculumOps: CurriculumOperations) {
  return async (toolName: string, input: unknown) => {
    switch (toolName) {
      case 'oak-search-lessons': {
        const params = SearchLessonsSchema.parse(input);
        return await curriculumOps.searchLessons(params);
      }
      case 'oak-get-lesson': {
        const { lessonSlug } = GetLessonSchema.parse(input);
        return await curriculumOps.getLesson(lessonSlug);
      }
      // ... other tools
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  };
}
```

### Step 4: Psychon Layer - Wiring (1 hour)

**File**: `src/psychon/wiring.ts`

```typescript
import { createOakClient } from '@oaknational/oak-curriculum-sdk';
import { createCurriculumOrgan } from '../organa/curriculum';
import { createMCPOrgan } from '../organa/mcp';
import { logger } from '../chorai/aither';
import { loadConfig } from '../chorai/phaneron/curriculum-config';

export function wireApplication() {
  // Load configuration
  const config = loadConfig();

  // Create SDK client (SDK handles its own env config per ADR-027)
  const sdk = createOakClient();

  // Create organs with dependencies
  const curriculumOrgan = createCurriculumOrgan({
    sdk,
    logger: logger.child({ module: 'curriculum' }),
  });

  // Pass interface abstraction, not direct organ
  const curriculumOps: CurriculumOperations = curriculumOrgan;

  const mcpOrgan = createMCPOrgan({
    curriculumOps, // Interface abstraction
    logger: logger.child({ module: 'mcp' }),
  });

  return {
    curriculumOrgan,
    mcpOrgan,
    config,
    logger,
  };
}
```

**File**: `src/psychon/server.ts`

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { wireApplication } from './wiring';
import { TOOL_DEFINITIONS } from '../organa/mcp/tools/definitions';

export async function createServer() {
  const { mcpOrgan, logger } = wireApplication();

  const server = new Server(
    {
      name: 'oak-curriculum-mcp',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  // Register tool list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: Object.entries(TOOL_DEFINITIONS).map(([name, def]) => ({
      name,
      description: def.description,
      inputSchema: def.inputSchema,
    })),
  }));

  // Register tool execution handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const result = await mcpOrgan.handleTool(request.params.name, request.params.arguments);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      logger.error('Tool execution failed', error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}
```

### Step 5: Testing Strategy (2 hours)

#### 5.1 Unit Tests (Pure Functions Only)

**File**: `src/organa/curriculum/transformers/lesson-transformer.unit.test.ts`

```typescript
import { transformLesson } from './lesson-transformer';

describe('transformLesson', () => {
  it('transforms SDK lesson to MCP format', () => {
    // Simple input, no complex mocks
    const sdkLesson = {
      slug: 'test-lesson',
      title: 'Test Lesson',
      subject: 'maths',
    };

    const result = transformLesson(sdkLesson);

    expect(result).toEqual({
      id: 'test-lesson',
      name: 'Test Lesson',
      metadata: { subject: 'maths' },
    });
  });
});
```

#### 5.2 Integration Tests (No Mocks)

**File**: `src/organa/curriculum/operations/search.integration.test.ts`

```typescript
import { createCurriculumOrgan } from '../index';
import { createOakClient } from '@oaknational/oak-curriculum-sdk';
import { vi } from 'vitest';

describe('Curriculum Operations Integration', () => {
  it('integrates SDK with error handling', async () => {
    // Simple injected dependencies, not complex mocks
    const sdk = {
      searchLessons: vi.fn().mockResolvedValue([{ slug: 'lesson-1', title: 'Lesson 1' }]),
    };
    const logger = { info: vi.fn(), debug: vi.fn(), error: vi.fn() };

    const organ = createCurriculumOrgan({ sdk, logger });
    const result = await organ.searchLessons({ subject: 'maths' });

    expect(result).toHaveLength(1);
    expect(logger.info).toHaveBeenCalled();
  });
});
```

#### 5.3 E2E Tests (Conditional Execution)

**File**: `e2e-tests/server.e2e.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, type ChildProcess } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

// Skip E2E tests if no real API key available
const shouldRunE2E = process.env.OAK_API_KEY && process.env.RUN_E2E === 'true';

describe.skipIf(!shouldRunE2E)('Oak Curriculum MCP Server E2E', () => {
  let server: ChildProcess;
  let client: Client;

  beforeAll(async () => {
    // Use real environment, not fake keys
    server = spawn('node', ['dist/index.js'], {
      env: process.env,
    });

    const transport = new StdioClientTransport({
      stdin: server.stdin!,
      stdout: server.stdout!,
    });

    client = new Client({ name: 'test-client', version: '1.0.0' }, { capabilities: {} });
    await client.connect(transport);
  });

  afterAll(async () => {
    await client?.close();
    server?.kill();
  });

  it('lists available tools', async () => {
    const response = await client.request({ method: 'tools/list' });
    expect(response.tools).toContainEqual(expect.objectContaining({ name: 'oak-search-lessons' }));
  });
});
```

## 🏁 Success Criteria

### Functional Requirements

- [ ] All 5 tools implemented and working
- [ ] Proper error handling with user-friendly messages
- [ ] Logging at appropriate levels
- [ ] Configuration via environment variables

### Non-Functional Requirements

- [ ] Response time < 2 seconds for all tools
- [ ] Graceful handling of API rate limits
- [ ] Clear separation of concerns (biological architecture)
- [ ] No cross-organ dependencies

### Quality Gates

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] E2E tests passing
- [ ] ESLint rules satisfied (no architecture violations)
- [ ] TypeScript compilation without errors
- [ ] Sub-agent reviews passed

## ⏱️ Time Estimates

- **Step 1**: Project Setup - 30 minutes
- **Step 2**: Chorai Layer - 1 hour
- **Step 3**: Organa Layer - 2 hours
- **Step 4**: Psychon Layer - 1 hour
- **Step 5**: Testing - 2 hours
- **Step 6**: Integration & Debugging - 1 hour

**Total**: ~7.5 hours

## 🚨 Risk Mitigation

1. **SDK Integration Issues**
   - Risk: SDK might not work as expected
   - Mitigation: Test SDK independently first
   - Fallback: Create mock SDK for development

2. **MCP Protocol Changes**
   - Risk: Protocol might differ from examples
   - Mitigation: Reference official MCP docs
   - Fallback: Use minimal protocol subset

3. **Rate Limiting**
   - Risk: Oak API might rate limit during testing
   - Mitigation: Cache responses during development
   - Fallback: Use mock data for tests

## 📚 References

- [MCP SDK Documentation](https://modelcontextprotocol.io/docs)
- [Oak Curriculum API Docs](https://open-api.thenational.academy/)
- [Biological Architecture Guide](../../docs/agent-guidance/architecture.md)
- [oak-notion-mcp Reference](../../../ecosystem/psycha/oak-notion-mcp)
- ADRs:
  - [ADR-026: Type Generation](../../docs/architecture/architectural-decisions/026-openapi-type-generation-strategy.md)
  - [ADR-027: Runtime Isolation](../../docs/architecture/architectural-decisions/027-runtime-isolation-strategy.md)
  - [ADR-028: Zod Deferral](../../docs/architecture/architectural-decisions/028-zod-validation-deferral.md)
