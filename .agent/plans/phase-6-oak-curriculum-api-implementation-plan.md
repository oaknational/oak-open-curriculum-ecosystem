# Phase 6: Oak Curriculum API Implementation Plan

**Last Updated**: 2025-01-10  
**Status**: IN PROGRESS  
**Lead Developer**: Claude  
**Dependencies**: Phase 5 ✅ COMPLETED | Phase 5.5 🚧 MITIGATED

## 🎯 Executive Summary

Implement Oak National Academy's Curriculum API as both a reusable SDK and an MCP server, demonstrating multi-organism coexistence in our biological architecture ecosystem. The SDK will be a conventional TypeScript package, while the MCP server follows our biological patterns.

## 🏗️ Architecture Overview

```text
packages/
└── oak-curriculum-sdk/          # Conventional TypeScript SDK
    ├── src/
    │   ├── types/
    │   │   └── generated/       # OpenAPI-generated types (NEVER edit)
    │   ├── client/              # API client with boundary isolation
    │   ├── adapters/            # Runtime adapters (Node.js specific)
    │   └── index.ts             # Clean public API
    └── scripts/
        └── typegen.ts           # Type generation from OpenAPI

ecosystem/psycha/
└── oak-curriculum-mcp/          # Biological architecture MCP server
    ├── src/
    │   ├── chorai/              # Pervasive fields (plural)
    │   │   ├── stroma/          # Types and contracts
    │   │   ├── aither/          # Logging and events
    │   │   └── phaneron/        # Configuration
    │   ├── organa/
    │   │   └── curriculum/      # Curriculum organ wrapping SDK
    │   └── psychon/             # Wiring and integration
    └── e2e-tests/               # End-to-end MCP tests
```

## 📋 Implementation Phases

### Sub-phase 6.1: SDK Foundation

#### 6.1.1 Type Generation Setup ✅ COMPLETED

**Objective**: Copy original's complete type generation pipeline using `openapi-typescript` PLUS custom processing

**Principle**: The ONLY manual step when API changes is running type generation. Everything else is automatic.

**Implementation Completed**:

1. **Copied Complete Type Generation Pipeline** ✅
   - Copied `typegen-core.ts` and `typegen.ts` from reference
   - Installed `openapi-typescript` package
   - The pipeline works in TWO stages:
     a. `openapi-typescript` generates base types from OpenAPI spec
     b. Custom processing extracts runtime values, type guards, and mappings

2. **What Gets Generated Automatically**:

   ```typescript
   // STAGE 1: openapi-typescript generates:
   // api-paths-types.ts - Complete paths & operations
   export interface paths {
     "/lessons/{lesson}/summary": {
       get: operations["getLessonSummary"];
     };
     // ... ALL endpoints
   }
   
   // STAGE 2: Custom processing creates:
   // api-schema.ts - Runtime schema object
   export const schema = { /* Full OpenAPI spec */ } as const;
   
   // path-parameters.ts - Extracted constants, types, and guards
   export const KEY_STAGES = ["ks1", "ks2", "ks3", "ks4"] as const;
   export type KeyStage = typeof KEY_STAGES[number];
   export function isKeyStage(value: string): value is KeyStage { /*...*/ }
   
   export const SUBJECTS = ["english", "maths", "science"] as const;
   export type Subject = typeof SUBJECTS[number];
   export function isSubject(value: string): value is Subject { /*...*/ }
   
   // Path return type mappings
   export type PathReturnTypes = {
     [P in ValidPath]: {
       "get": Paths[P]["get"]["responses"][200]["content"]["application/json"];
     }
   };
   
   // Valid path combinations
   export const VALID_PATHS_BY_PARAMETERS = { /*...*/ };
   ```

3. **Future Zod Integration** (Phase 6.1.4):
   - Add Zod generation to the same pipeline
   - Generate validators alongside types from same OpenAPI spec
   - Everything remains automatic

3. **API Source Configuration**
   - Primary: `https://open-api.thenational.academy/api/v0/swagger.json`
   - Use `.env` API key for fetching latest schema
   - Cache locally for offline development

4. **Generated Files Structure** (matching original):

   ```text
   src/types/generated/api-schema/
   ├── api-schema.json       # Cached OpenAPI spec
   ├── api-schema.ts         # Runtime schema object
   ├── api-paths-types.ts    # Complete paths & operations (from openapi-typescript)
   └── path-parameters.ts    # Extracted parameter values
   ```

**TDD Approach (Write These Tests FIRST)**:

```typescript
// Step 1: Write FAILING test for pure transformation
// scripts/typegen.unit.test.ts
describe('Type Generation Pure Functions', () => {
  it('transforms OpenAPI schema to TypeScript types', () => {
    // Given: OpenAPI schema object (not fetched, just data)
    const schema = {
      components: {
        schemas: {
          Lesson: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' }
            }
          }
        }
      }
    };
    
    // When: Transform to TypeScript
    const result = transformSchemaToTypes(schema);
    
    // Then: Verify TypeScript output
    expect(result).toContain('export interface Lesson {');
    expect(result).toContain('id: string;');
    expect(result).toContain('title: string;');
  });
});

// Step 2: Implement MINIMUM code to pass
export function transformSchemaToTypes(schema: OpenAPISchema): string {
  // Implementation added AFTER test is written
}

// Step 3: Integration test with simple injected mock
describe('Type Generation Integration', () => {
  it('generates types with injected fetcher', async () => {
    const mockFetcher = () => Promise.resolve(mockSchema);
    const result = await generateTypes(mockFetcher);
    expect(result).toBeDefined();
  });
});
```

#### 6.1.2 SDK Core Implementation ✅ COMPLETED

**Objective**: Copy and adapt reference implementation with minimal changes

**Implementation Completed**:

1. **Removed Incompatible Custom Implementation** ✅
   - Deleted custom type generation scripts
   - Removed manual transform functions
   - Deleted custom HTTP adapter pattern
   - Cleaned up all files that didn't align with openapi-fetch pattern

2. **Copied Reference Client Pattern** ✅
   - **BaseApiClient** (`oak-base-client.ts`): Direct copy from reference
     - Uses `createClient<paths>()` from openapi-fetch
     - Implements auth middleware injection
     - Provides both method-based and path-based clients

   - **Auth Middleware** (`middleware/auth.ts`): Direct copy
     - Adds Bearer token to all requests
     - Environment-agnostic design

   - **Factory Functions** (`client/index.ts`): Adapted from reference
     - `createOakClient()` - returns typed OpenAPI client
     - `createOakPathBasedClient()` - returns path-based proxy client

3. **Configuration** (`config/index.ts`) ✅
   - Copied reference's configuration pattern
   - Default API URLs with environment override capability
   - Maintains environment-agnostic core with optional env var support

**Key Achievement**: The SDK now uses the EXACT same pattern as the reference implementation. When the API changes, we only need to regenerate types - everything else is automatic.

#### 6.1.3 Testing & Quality Gates ✅ COMPLETED

**Objective**: Ensure SDK meets all quality standards

**Completed**:

- ✅ Created integration tests for client creation
- ✅ All TypeScript types compile correctly
- ✅ ESLint configuration updated to ignore generated files
- ✅ Prettier formatting applied
- ✅ Build process includes automatic type generation
- ✅ All quality gates pass:
  - `pnpm format` ✅
  - `pnpm type-check` ✅
  - `pnpm lint` ✅
  - `pnpm test` ✅
  - `pnpm build` ✅
  - Preserve API client patterns that work with generated paths
  - Use `openapi-fetch` or similar to consume generated types

2. **Adapt for Our Architecture**
   - Keep dependency injection for HTTP adapter
   - Maintain boundary isolation (Node.js deps only in adapters)
   - Remove any direct fs/path usage from core

3. **Integration with Generated Types**

   ```typescript
   import type { paths } from './types/generated/api-schema/api-paths-types';
   import createClient from 'openapi-fetch';
   
   // Client automatically knows ALL endpoints from generated types
   const client = createClient<paths>({ 
     baseUrl: 'https://open-api.thenational.academy/api/v0',
     headers: { Authorization: `Bearer ${apiKey}` }
   });
   
   // Fully typed, automatic endpoint discovery
   const { data, error } = await client.GET('/lessons/{lesson}/summary', {
     params: { path: { lesson: 'intro-to-fractions' } }
   });
   ```

   **SDK validates ALL external data**:

   ```typescript
   // In SDK adapters - validate API responses
   import { z } from 'zod';
   
   const LessonApiSchema = z.object({
     id: z.string(),
     title: z.string(),
     subject_name: z.string(),
     key_stage_slug: z.string()
   });
   
   async function fetchLesson(slug: string): Promise<Lesson> {
     const response = await httpAdapter.request(url);
     const rawData = JSON.parse(response.body);
     
     // SDK validates external API data
     const validated = LessonApiSchema.parse(rawData);
     
     // Transform to internal types
     return transformLesson(validated);
   }
   ```

4. **Dependency Injection Setup**

   ```typescript
   // Pure core with runtime-agnostic types
   interface HttpAdapter {
     request(url: string, options: HttpOptions): Promise<HttpResponse>;
   }
   
   interface HttpOptions {
     method: string;
     headers?: Record<string, string>;
     body?: string;
   }
   
   interface HttpResponse {
     status: number;
     body: string;
     headers: Record<string, string>;
   }
   
   // Pure client with injected adapter
   export function createOakClient(deps: {
     http: HttpAdapter;
     config: { baseUrl: string; apiKey?: string };
   }) {
     // Fail fast validation
     if (!deps.http) throw new Error('HTTP adapter required');
     if (!deps.config.baseUrl) throw new Error('Base URL required');
     
     return {
       searchLessons: (params: SearchParams) => searchLessons(deps, params),
       getLesson: (slug: string) => getLesson(deps, slug)
     };
   }
   
   // Node.js adapter (in adapters/node.ts)
   export const nodeHttpAdapter: HttpAdapter = {
     async request(url, options) {
       const { fetch } = await import('undici');
       const response = await fetch(url, {
         method: options.method,
         headers: options.headers,
         body: options.body
       });
       return {
         status: response.status,
         body: await response.text(),
         headers: Object.fromEntries(response.headers)
       };
     }
   };
   ```

**TDD Approach (Write Test FIRST, Then Implementation)**:

```typescript
// Step 1: UNIT TEST for pure transformation (no mocks needed)
// client.unit.test.ts
describe('Lesson Data Transformation', () => {
  it('transforms API response to internal format', () => {
    // Given: Raw API data (just data, no fetching)
    const apiData = {
      lessons: [
        { id: '1', title: 'Fractions', subject: 'maths' }
      ]
    };
    
    // When: Transform with pure function
    const result = transformLessonData(apiData);
    
    // Then: Verify transformation
    expect(result[0].id).toBe('1');
    expect(result[0].displayName).toBe('Fractions (maths)');
  });
});

// Step 2: INTEGRATION TEST with simple injected function
describe('Search Integration', () => {
  it('integrates HTTP with transformation', async () => {
    // Simple function injection (not complex mock)
    const simpleHttp = (url: string) => 
      Promise.resolve({ status: 200, body: mockJson });
    
    const result = await searchLessons(
      { subject: 'maths' },
      simpleHttp,
      transformLessonData
    );
    
    expect(result).toHaveLength(1);
  });
});
```

#### 6.1.4 Zod Validation Integration (INVESTIGATED - DEFERRED)

**Objective**: Add Zod validation to the type generation pipeline

**Investigation Summary**:

We explored three approaches for adding Zod validation:

1. **OpenAPI → Zod libraries** (`openapi-zod`, `openapi-zod-client`)
   - Would generate Zod schemas directly from OpenAPI spec
   - Requires adding third-party transformation library

2. **TypeScript → Zod transformation** (`ts-to-zod`)
   - Would transform our already-generated TypeScript interfaces
   - Simpler than OpenAPI parsing but still requires external dependency

3. **Manual generation from existing data**
   - We have all the data (schema, types, constants)
   - Would require reimplementing complex transformation logic

**Current Validation Capabilities**:

Our existing type generation already provides:
- **Type predicates** for enums: `isKeyStage()`, `isSubject()`, etc.
- **TypeScript compile-time safety** via generated interfaces
- **Path validation** via `isValidPath()` and `isAllowedMethod()`
- **Extracted constants** for runtime checking (KEY_STAGES, SUBJECTS)

**Decision: DEFER ZOD IMPLEMENTATION**

**Rationale**:
- Current type predicates provide basic runtime validation
- TypeScript interfaces ensure compile-time safety
- Adding Zod now would introduce complexity without clear immediate benefit
- MCP server can add Zod validation at its boundaries when needed

**Future Reconsideration Triggers**:
- If API returns malformed data in production
- When implementing MCP server tool input validation
- If runtime validation errors become frequent
- When we need data transformation/coercion capabilities

**If/When We Add Zod**:

The most pragmatic approach would be:
```typescript
// Stage 3: TypeScript → Zod using ts-to-zod
import { generate } from 'ts-to-zod';

await generate({
  input: './src/types/generated/api-schema/api-paths-types.ts',
  output: './src/validators/generated/api-validators.ts'
});
```

This leverages our existing TypeScript generation and maintains type alignment.

#### 6.1.5 Runtime Isolation Assessment (INVESTIGATED)

**Objective**: Assess work needed to isolate Node.js runtime dependencies

**Findings**:

- Only 2 `process.env` uses in `src/config/index.ts`
- No Node.js-specific imports in SDK source (no fs, path, http, etc.)
- SDK already mostly runtime-agnostic
- Node dependencies only in:
  - Scripts folder (type generation - build-time only)
  - Config (2 environment variables)

**Work Required**: ✅ MINIMAL

1. Create runtime adapter interface:

   ```typescript
   interface RuntimeConfig {
     getEnv(key: string): string | undefined;
   }
   ```

2. Inject config at SDK creation:

   ```typescript
   createOakClient(apiKey: string, config?: RuntimeConfig)
   ```

3. Default implementation for Node.js:

   ```typescript
   const nodeConfig: RuntimeConfig = {
     getEnv: (key) => process.env[key]
   };
   ```

**Recommendation**: Can be done incrementally after SDK is working

### Sub-phase 6.2: MCP Server Implementation

#### 6.2.1 MCP Implementation Pattern Research (COMPLETED)

**Objective**: Research official MCP implementations to inform approach

**Findings from Official MCP Servers**:

1. **Repository Structure**: Simple, flat structure
   - Single `index.ts` file for simple servers
   - Helper modules for complex logic
   - Direct tool definitions in main file

2. **Key Dependencies**:
   - `@modelcontextprotocol/sdk/server` - Server implementation
   - `@modelcontextprotocol/sdk/server/stdio` - Transport layer
   - `zod` - Input validation
   - `zod-to-json-schema` - Schema generation

3. **Pattern Example** (from filesystem server):

   ```typescript
   import { Server } from "@modelcontextprotocol/sdk/server/index.js";
   import { z } from "zod";
   
   const server = new Server({
     name: "oak-curriculum",
     version: "1.0.0"
   });
   
   // Define tool schemas with Zod
   const SearchLessonsSchema = z.object({
     subject: z.string().optional(),
     keyStage: z.string().optional()
   });
   
   // Register tools
   server.setRequestHandler(ListToolsRequestSchema, () => ({
     tools: [{
       name: "oak-search-lessons",
       inputSchema: zodToJsonSchema(SearchLessonsSchema)
     }]
   }));
   ```

**How to Apply Biological Architecture**:

- Use official MCP SDK patterns as the foundation
- Wrap SDK logic in organs for separation of concerns
- Keep MCP protocol handling simple and direct
- Biological architecture for internal organisation, not protocol

#### 6.2.2 Biological Architecture Implementation

**Objective**: Create MCP server following biological architecture

**Tasks**:

1. **Chorai Layer (Pervasive Fields)**
   - `stroma/`: Import SDK types, define MCP contracts
   - `aither/`: Logging setup with adaptive logger from histoi
   - `phaneron/`: Configuration for API keys and endpoints
   - Each chora has membrane (index.ts) for clear boundaries

2. **Organa Layer (Business Logic)**
   - `curriculum/`: Organ that wraps SDK and transforms for MCP
   - Has membrane (index.ts) exposing only public interface
   - No cross-organ imports (follows biological rules)
   - Receives chorai via dependency injection

3. **Psychon Layer (Wiring)**
   - Dependency injection container with fail-fast validation
   - MCP server initialization
   - Tool registration with proper error handling
   - **Zod validation at MCP boundaries** for all tool inputs

**Structure**:

```typescript
// organa/curriculum/index.ts
export function createCurriculumOrgan(deps: {
  sdk: OakCurriculumClient;
  logger: Logger;
}) {
  return {
    searchLessons: async (params) => {
      deps.logger.info('Searching lessons', params);
      return deps.sdk.searchLessons(params);
    }
  };
}

// psychon/index.ts
const sdk = new OakCurriculumClient(httpAdapter, config);
const organ = createCurriculumOrgan({ sdk, logger });
const server = new MCPServer({ organs: { curriculum: organ } });
```

#### 6.2.3 MCP Tool Definitions

**Objective**: Define MCP tools for curriculum operations

**Tools to Implement**:

```typescript
// MCP validates tool inputs only - SDK handles API response validation
import { z } from 'zod';

// Tool input schemas for MCP protocol validation
const searchLessonsInputSchema = z.object({
  subject: z.string().optional(),
  keyStage: z.string().optional(),
  limit: z.number().int().positive().max(100).default(10)
});

const getLessonInputSchema = z.object({
  lessonSlug: z.string().min(1)
});

// MCP validates tool inputs before passing to SDK
function validateToolInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(`Invalid tool input: ${result.error.message}`);
  }
  return result.data;
}

const tools = {
  'oak-search-lessons': {
    description: 'Search Oak lessons by subject and key stage',
    inputSchema: {
      type: 'object',
      properties: {
        subject: { type: 'string' },
        keyStage: { type: 'string' },
        limit: { type: 'number', default: 10 }
      }
    }
  },
  
  'oak-get-lesson': {
    description: 'Get detailed lesson content',
    inputSchema: {
      type: 'object',
      properties: {
        lessonSlug: { type: 'string' }
      },
      required: ['lessonSlug']
    }
  },
  
  'oak-list-programmes': {
    description: 'List all available programmes',
    inputSchema: { type: 'object' }
  },
  
  'oak-get-unit': {
    description: 'Get unit details with lessons',
    inputSchema: {
      type: 'object',
      properties: {
        unitSlug: { type: 'string' }
      },
      required: ['unitSlug']
    }
  },
  
  'oak-browse-curriculum': {
    description: 'Browse curriculum by subject and key stage',
    inputSchema: {
      type: 'object',
      properties: {
        subject: { type: 'string', optional: true },
        keyStage: { type: 'string', optional: true }
      }
    }
  }
};
```

**Testing Approach**:

```typescript
// tools.integration.test.ts
describe('MCP Tools', () => {
  it('should handle oak-search-lessons tool', async () => {
    const mockSdk = createMockSdk();
    const handler = createToolHandler(mockSdk);
    const result = await handler('oak-search-lessons', { subject: 'maths' });
    expect(result).toMatchSchema(lessonSearchResultSchema);
  });
});
```

### Runtime Validation Architecture

**Clear Separation of Concerns**:

1. **SDK Responsibility**: Validates ALL external data at boundaries
   - API responses validated with Zod before transformation
   - Environment variables validated on initialization
   - Returns trusted, validated TypeScript types to consumers
   - Consumers (like MCP) can trust SDK outputs without re-validation

2. **MCP Responsibility**: Only validates its own protocol inputs
   - Tool inputs from MCP protocol validated with Zod
   - Configuration validated at startup
   - Trusts SDK outputs (already validated by SDK)

This separation ensures:

- SDK is a trustworthy source of validated data
- No duplicate validation between layers
- Clear ownership of validation responsibilities

### Sub-phase 6.3: Integration & Multi-Server Support

#### 6.3.1 Multi-Server Configuration

**Objective**: Enable both MCP servers to run simultaneously

**Configuration Example**:

```json
{
  "mcpServers": {
    "oak-notion": {
      "command": "npx",
      "args": ["-y", "@oaknational/oak-notion-mcp"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    },
    "oak-curriculum": {
      "command": "npx",
      "args": ["-y", "@oaknational/oak-curriculum-mcp"],
      "env": {
        "OAK_API_KEY": "${OAK_API_KEY}",
        "OAK_API_BASE_URL": "https://open-api.thenational.academy/api/v0"
      }
    }
  }
}
```

#### 6.3.2 E2E Testing

**Objective**: Validate complete system behaviour

**Test Scenarios**:

```typescript
// server.e2e.test.ts
describe('Oak Curriculum MCP E2E', () => {
  let server: ChildProcess;
  let client: MCPClient;
  
  beforeAll(async () => {
    server = spawn('node', ['dist/index.js']);
    client = new MCPClient();
    await client.connect();
  });
  
  it('should respond to initialization', async () => {
    const response = await client.initialize();
    expect(response.protocolVersion).toBe('0.1.0');
  });
  
  it('should search lessons via MCP protocol', async () => {
    const result = await client.callTool('oak-search-lessons', {
      subject: 'maths',
      keyStage: 'ks3'
    });
    expect(result.lessons).toBeDefined();
  });
  
  it('should handle errors gracefully', async () => {
    const result = await client.callTool('oak-get-lesson', {
      lessonSlug: 'non-existent'
    });
    expect(result.error).toBeDefined();
  });
});
```

## 🧪 Testing Strategy

### Pure Function Extraction Strategy

**Core Principle**: Extract all logic into pure functions (organelles) that can be unit tested without mocks.

#### What to Extract as Pure Functions:

1. **Data Transformations**

   ```typescript
   // Pure: API response → Internal format
   export function transformLesson(apiLesson: ApiLesson): Lesson {
     return {
       id: apiLesson.id,
       title: apiLesson.title,
       subject: apiLesson.subject_name,
       keyStage: apiLesson.key_stage_slug
     };
   }
   ```

2. **Validation Logic**

   ```typescript
   // Pure: Validate search parameters
   export function validateSearchParams(params: unknown): SearchParams {
     if (!params || typeof params !== 'object') {
       throw new Error('Invalid search parameters');
     }
     // Validation logic - no IO
     return params as SearchParams;
   }
   ```

3. **URL Construction**

   ```typescript
   // Pure: Build API URLs
   export function buildSearchUrl(base: string, params: SearchParams): string {
     const query = new URLSearchParams();
     if (params.subject) query.set('subject', params.subject);
     return `${base}/api/v2/search?${query}`;
   }
   ```

4. **Error Formatting**

   ```typescript
   // Pure: Format errors for users
   export function formatApiError(status: number, message: string): UserError {
     if (status === 404) return { type: 'NOT_FOUND', message: 'Resource not found' };
     if (status === 429) return { type: 'RATE_LIMIT', message: 'Too many requests' };
     return { type: 'UNKNOWN', message };
   }
   ```

#### Integration Points (Not Pure):

These receive pure functions as dependencies:

```typescript
// Integration point with injected pure functions
export async function searchLessons(
  params: SearchParams,
  httpFetch: (url: string) => Promise<HttpResponse>,
  validateFn: typeof validateSearchParams,
  buildUrlFn: typeof buildSearchUrl,
  transformFn: typeof transformLesson
): Promise<Lesson[]> {
  const validated = validateFn(params);
  const url = buildUrlFn(BASE_URL, validated);
  const response = await httpFetch(url);
  const data = JSON.parse(response.body);
  return data.lessons.map(transformFn);
}
```

### TDD/BDD Approach

1. **Unit Tests (TDD)**
   - Write test FIRST for each pure function
   - Test type generation logic
   - Test data transformation functions
   - No mocks, no I/O

2. **Integration Tests (BDD)**
   - Test SDK public API with mock HTTP
   - Test MCP tool handlers with mock SDK
   - Test organ integration with dependencies
   - Simple mocks only, injected as dependencies

3. **E2E Tests**
   - Test full MCP protocol compliance
   - Test multi-server scenarios
   - Test error handling and recovery
   - Real I/O allowed

### Test File Organization

```text
packages/oak-curriculum-sdk/
├── src/
│   ├── client.ts
│   ├── client.unit.test.ts          # TDD unit tests
│   └── client.integration.test.ts   # BDD integration tests

ecosystem/psycha/oak-curriculum-mcp/
├── src/
│   ├── organa/curriculum/
│   │   ├── transform.ts
│   │   └── transform.unit.test.ts
│   └── tools.integration.test.ts
└── e2e-tests/
    └── server.e2e.test.ts
```

## 🔧 Type Generation Strategy

### Automatic Type Synchronization

1. **Build-Time Generation**

   ```json
   {
     "scripts": {
       "prebuild": "npm run generate:types",
       "generate:types": "tsx scripts/typegen.ts",
       "postinstall": "npm run generate:types"
     }
   }
   ```

2. **CI/CD Integration**
   - Generate types on every build
   - Fail build if types can't be generated
   - Cache generated types for speed

3. **Schema Evolution Handling**
   - Types automatically update with schema
   - TypeScript compiler catches breaking changes
   - Tests validate behaviour still correct

### Type and Validation Discipline

#### Generated Code Management

1. **Never manually edit generated files** (types OR validators)
2. **All custom types derive from generated types**
3. **Runtime validation uses generated Zod schemas**
4. **Regeneration is deterministic and automated**

#### Why Programmatic Zod Generation?

The Oak API will evolve over time. By generating Zod validators programmatically from the same OpenAPI schema that produces our TypeScript types:

- **Single source of truth**: OpenAPI schema drives both types and validators
- **Automatic synchronization**: When API changes, both types and validators update
- **No manual drift**: Validators can't get out of sync with types
- **Robust to change**: New fields, removed fields, type changes all handled automatically
- **Type safety**: `z.infer<typeof Schema>` ensures runtime validation matches compile-time types

#### Generation Pipeline

```typescript
// Single generation script produces both outputs
async function generateFromOpenAPI() {
  const schema = await fetchOpenAPISchema();
  
  // Generate TypeScript interfaces
  const types = generateTypeScriptTypes(schema);
  await writeFile('src/types/generated/types.ts', types);
  
  // Generate Zod validators that match exactly
  const validators = generateZodValidators(schema);
  await writeFile('src/types/generated/validators.ts', validators);
  
  // Generate index that exports both
  const index = `
    export * from './types';
    export * from './validators';
  `;
  await writeFile('src/types/generated/index.ts', index);
}
```

#### Type Discipline Rules

1. **Use generated validators at boundaries**
2. **Trust validated data internally**
3. **Prefer type inference over explicit typing**
5. **Use type-only imports for pure type definitions**:

   ```typescript
   // Good: Type-only import for interfaces
   import type { Lesson, Programme, SearchParams } from './types/generated';
   
   // Good: Separate runtime and type imports
   import { z } from 'zod';
   import type { ZodSchema } from 'zod';
   
   // Avoid: Mixed imports when not needed
   import { Lesson, transformLesson } from './types';  // Split these
   ```

## 📈 Success Criteria

### Functional Requirements

- [x] SDK generates types from OpenAPI schema automatically
- [ ] SDK generates Zod validators from OpenAPI schema (planned enhancement)
- [x] Node.js dependencies minimal (only 2 env vars in config)
- [ ] Full runtime isolation with dependency injection (optional)
- [ ] MCP server implements all 5 required tools
- [ ] Both servers can run simultaneously
- [x] SDK core implementation with openapi-fetch pattern
- [x] Type generation pipeline working

### Non-Functional Requirements

- [ ] Response time < 2 seconds for API calls
- [ ] Graceful handling of API rate limits
- [ ] Clear error messages for debugging
- [ ] Type-safe throughout the codebase
- [ ] Clean architectural boundaries maintained

### Quality Gates

- [ ] `pnpm format` passes
- [ ] `pnpm lint` passes with architectural rules
- [ ] `pnpm type-check` passes
- [ ] `pnpm test` passes (unit + integration)
- [ ] `pnpm test:e2e` passes
- [ ] Sub-agent reviews pass

## 🚀 Implementation Milestones

### Milestone 1: Type System Foundation ✅ COMPLETED (Core Types)

- [x] Set up type generation from OpenAPI using openapi-typescript
- [x] Implement two-stage pipeline (base types + extracted constants)
- [x] Establish deterministic generation pipeline
- [x] Add generation to build process
- [x] Write tests for generation logic
- [x] Run all quality gates
- [ ] Add Zod validator generation (Stage 3) - OPTIONAL ENHANCEMENT

### Milestone 2: SDK Core Implementation ✅ COMPLETED

- [x] Map reference implementation structure to our architecture
  - [x] Identify pure functions to preserve unchanged
  - [x] List Node.js dependencies to isolate
  - [x] Document which reference modules map to which SDK modules
- [x] Transplant reference implementation
- [x] Integrate generated validators at boundaries
- [x] Isolate Node.js dependencies to adapters
- [x] Write comprehensive unit tests (TDD)
- [x] Write integration tests for public API (BDD)
- [x] Run all quality gates
- [x] Sub-agent review: code-reviewer

### Milestone 3: MCP Server Structure

- [ ] Create biological structure (chorai/organa/psychon)
- [ ] Wrap SDK as curriculum organ
- [ ] Implement 5 MCP tools
- [ ] Write integration tests for tools
- [ ] Configure multi-server support
- [ ] Run all quality gates
- [ ] Sub-agent review: architecture-reviewer

### Milestone 4: System Integration

- [ ] Write E2E tests for full system
- [ ] Test multi-server scenarios
- [ ] Verify validation at all boundaries
- [ ] Add comprehensive error handling
- [ ] Performance testing
- [ ] Run all quality gates
- [ ] Sub-agent review: test-auditor

### Milestone 5: Production Readiness

- [ ] Documentation complete
- [ ] All quality gates passing
- [ ] Generated code deterministic
- [ ] Error messages helpful
- [ ] Final review: config-auditor

## 📝 Notes

### Key Decisions Made

1. **SDK as conventional package** - Not biological, for reusability
2. **ElasticSearch deferred** - Simplifies MVP, can add later
3. **Type generation automated** - Ensures synchronization with API
4. **Reference code transplanted** - Pragmatic reuse of working code
5. **Node.js isolated** - Dependencies only at boundaries

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| API schema changes | Types break | Automated generation catches at compile time |
| Node.js dependencies leak | Architecture violation | Boundary adapters + ESLint rules |
| Reference code quality | Technical debt | Wrap with clean interfaces, refactor incrementally |
| Multi-server conflicts | User confusion | Clear naming, independent configurations |

### Future Enhancements (Post-Phase 6)

1. **ElasticSearch Integration** - Advanced search capabilities (deferred from initial phase)
2. **Caching Layer** - Reduce API calls, improve performance
3. **Browser SDK** - Direct browser usage without Node.js
4. **GraphQL Support** - Alternative query interface
5. **Webhook Support** - Real-time curriculum updates

## 📚 References

- [High-Level Plan](high-level-plan.md) - Overall architecture and phases
- [Oak API Documentation](https://open-api.thenational.academy/) - API reference
- [MCP Specification](https://modelcontextprotocol.io/) - Protocol details
- [Reference Implementation](../../reference/oak-curriculum-api-client/) - Working code to transplant

---

**Remember**: This plan emphasizes pragmatic implementation. Get it working first with transplanted code, then improve incrementally while maintaining clean boundaries.
