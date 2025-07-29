# Phase 2 Implementation Plan: Core MCP Implementation

## Objective

Build a functional MCP server with basic Notion read capabilities using strict TDD/BDD approach, emphasizing pure functions and clear architectural boundaries.

## Success Criteria

- All Notion read operations working through MCP protocol
- 100% unit test coverage for pure functions
- All integration points have injectable dependencies
- Zero direct IO in non-E2E tests
- All quality gates passing continuously

## Architectural Overview

### Core Design Principles

1. **Pure Functions First**: Maximum business logic in pure, testable functions
2. **Dependency Injection**: All IO operations must be injectable
3. **Clear Boundaries**: Well-defined interfaces between layers
4. **Test-Driven**: Write tests before implementation
5. **Behavior Focus**: Test what it does, not how it does it

### Layer Architecture

```
┌─────────────────────────────────────────┐
│          MCP Protocol Layer             │
│    (Integration Points: Handlers)       │
├─────────────────────────────────────────┤
│         Business Logic Layer            │
│        (Pure Functions Only)            │
├─────────────────────────────────────────┤
│        Notion Adapter Layer             │
│    (Integration Point: Client)          │
├─────────────────────────────────────────┤
│       Infrastructure Layer              │
│    (Config, Logging, Transport)         │
└─────────────────────────────────────────┘
```

## Implementation Phases

### Phase 2.1: Core Infrastructure (Week 1)

#### 2.1.1 Environment Configuration

**Pure Functions to Create**:

- `validateEnvironmentVariables(env: Record<string, string | undefined>): ValidationResult`
- `parseNotionConfig(apiKey: string): NotionConfig`
- `createMcpServerInfo(config: ServerConfig): McpServerInfo`

**File**: `src/config/environment.ts`

```typescript
// Pure function for validation
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export function validateEnvironmentVariables(
  env: Record<string, string | undefined>,
): ValidationResult {
  const errors: string[] = [];

  if (!env.NOTION_API_KEY) {
    errors.push('NOTION_API_KEY is required');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
```

**Unit Tests First**: `src/config/environment.unit.test.ts`

```typescript
describe('validateEnvironmentVariables', () => {
  it('should return valid when all required variables present', () => {
    const result = validateEnvironmentVariables({
      NOTION_API_KEY: 'secret_abc123',
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should return errors when NOTION_API_KEY missing', () => {
    const result = validateEnvironmentVariables({});

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('NOTION_API_KEY is required');
  });
});
```

#### 2.1.2 Logging Infrastructure

**Pure Functions**:

- `formatLogMessage(level: LogLevel, message: string, context?: any): string`
- `shouldLog(currentLevel: LogLevel, messageLevel: LogLevel): boolean`

**Injectable Logger Interface**:

```typescript
export interface Logger {
  debug(message: string, context?: any): void;
  info(message: string, context?: any): void;
  warn(message: string, context?: any): void;
  error(message: string, context?: any): void;
}
```

#### 2.1.3 Error Handling

**Pure Functions**:

- `classifyNotionError(error: unknown): ErrorClassification`
- `createMcpError(classification: ErrorClassification): McpError`
- `formatErrorForUser(error: McpError): string`

### Phase 2.2: Notion Data Layer (Week 1-2)

#### 2.2.1 Data Transformers (Pure Functions)

**File**: `src/notion/transformers.ts`

**Pure Functions to Create**:

- `transformNotionPageToMcpResource(page: NotionPage): McpResource`
- `transformNotionDatabaseToMcpResource(database: NotionDatabase): McpResource`
- `transformNotionUserToMcpResource(user: NotionUser): McpResource`
- `extractTextFromNotionBlocks(blocks: NotionBlock[]): string`
- `formatNotionRichText(richText: NotionRichText[]): string`

**Unit Tests First**: Write comprehensive unit tests for each transformer

#### 2.2.2 Query Builders (Pure Functions)

**File**: `src/notion/query-builders.ts`

**Pure Functions**:

- `buildDatabaseQuery(filters: McpFilters): NotionDatabaseQuery`
- `validateDatabaseFilters(filters: unknown): ValidationResult<McpFilters>`
- `buildSearchQuery(searchTerm: string, options?: SearchOptions): NotionSearchQuery`

#### 2.2.3 Notion Client Wrapper

**File**: `src/notion/client.ts`

**Integration Point** (Injectable Notion Client):

```typescript
export interface NotionClientWrapper {
  getPage(pageId: string): Promise<NotionPage>;
  getDatabase(databaseId: string): Promise<NotionDatabase>;
  queryDatabase(databaseId: string, query: NotionDatabaseQuery): Promise<NotionPage[]>;
  search(query: NotionSearchQuery): Promise<NotionSearchResult>;
  listUsers(): Promise<NotionUser[]>;
}

// Factory function for real client
export function createNotionClient(apiKey: string): NotionClientWrapper {
  const client = new Client({ auth: apiKey });

  return {
    async getPage(pageId: string): Promise<NotionPage> {
      // Wrap Notion SDK calls
    },
    // ... other methods
  };
}
```

**Integration Tests**: `src/notion/client.integration.test.ts`

- Test with mocked Notion SDK responses
- Verify error handling
- Test retry logic

### Phase 2.3: MCP Protocol Implementation (Week 2)

#### 2.3.1 Resource Handlers

**File**: `src/mcp/resources/handlers.ts`

**Integration Points** (Request Handlers):

```typescript
export function createResourceHandlers(deps: {
  notionClient: NotionClientWrapper;
  logger: Logger;
}) {
  return {
    async handleListResources(): Promise<McpResourceList> {
      // Implementation
    },

    async handleReadResource(uri: string): Promise<McpResource> {
      // Parse URI, fetch from Notion, transform
    },
  };
}
```

**Resource URI Parsing (Pure Functions)**:

- `parseResourceUri(uri: string): ResourceIdentifier`
- `validateResourceUri(uri: string): ValidationResult`
- `buildResourceUri(type: ResourceType, id: string): string`

#### 2.3.2 Tool Implementations

**File**: `src/mcp/tools/handlers.ts`

**Tool Handlers** (Integration Points):

```typescript
export function createToolHandlers(deps: { notionClient: NotionClientWrapper; logger: Logger }) {
  return {
    'notion-search': createSearchTool(deps),
    'notion-list-databases': createListDatabasesTool(deps),
    'notion-query-database': createQueryDatabaseTool(deps),
    'notion-get-page': createGetPageTool(deps),
    'notion-list-users': createListUsersTool(deps),
  };
}
```

**Input Validation (Pure Functions)**:

- Use Zod schemas for each tool's input
- Create validators that return typed results

#### 2.3.3 Prompt Templates

**File**: `src/mcp/prompts/templates.ts`

**Pure Functions**:

- `createDatabaseQueryPrompt(databaseSchema: DatabaseSchema): McpPrompt`
- `createPageAnalysisPrompt(pageType: PageType): McpPrompt`

### Phase 2.4: Server Assembly (Week 2-3)

#### 2.4.1 Main Server Setup

**File**: `src/server.ts`

```typescript
export function createMcpServer(deps: {
  notionClient: NotionClientWrapper;
  logger: Logger;
  config: ServerConfig;
}): Server {
  const server = new Server(createMcpServerInfo(deps.config), {
    capabilities: {
      resources: { subscribe: false },
      tools: {},
      prompts: {},
    },
  });

  // Wire up handlers
  const resourceHandlers = createResourceHandlers(deps);
  const toolHandlers = createToolHandlers(deps);
  const promptHandlers = createPromptHandlers(deps);

  // Register with server
  server.setRequestHandler(ListResourcesRequestSchema, resourceHandlers.handleListResources);
  // ... more registrations

  return server;
}
```

#### 2.4.2 Application Entry Point

**File**: `src/index.ts`

```typescript
export async function main(): Promise<void> {
  // Load and validate environment
  const env = process.env;
  const validation = validateEnvironmentVariables(env);

  if (!validation.valid) {
    console.error('Configuration errors:', validation.errors);
    process.exit(1);
  }

  // Create dependencies
  const logger = createConsoleLogger();
  const notionClient = createNotionClient(env.NOTION_API_KEY!);
  const config = { name: 'oak-notion-mcp', version: '0.1.0' };

  // Create and start server
  const server = createMcpServer({ notionClient, logger, config });
  const transport = new StdioServerTransport();

  await server.connect(transport);
  logger.info('MCP server started');
}
```

### Phase 2.5: E2E Testing (Week 3)

#### 2.5.1 E2E Test Infrastructure

**File**: `e2e-tests/setup.ts`

```typescript
export interface E2ETestContext {
  notionApiKey: string;
  testWorkspaceId: string;
  testPageId: string;
  testDatabaseId: string;
}

export function setupE2ETests(): E2ETestContext {
  // Load from .env.test
  const context = {
    notionApiKey: process.env.NOTION_TEST_API_KEY!,
    testWorkspaceId: process.env.NOTION_TEST_WORKSPACE_ID!,
    testPageId: process.env.NOTION_TEST_PAGE_ID!,
    testDatabaseId: process.env.NOTION_TEST_DATABASE_ID!,
  };

  // Validate all required
  return context;
}
```

#### 2.5.2 E2E Test Scenarios

**File**: `e2e-tests/read-operations.e2e.test.ts`

```typescript
describe('E2E: Read Operations', () => {
  let server: ChildProcess;
  let client: McpClient;

  beforeAll(async () => {
    const context = setupE2ETests();
    // Start server process
    // Connect client
  });

  it('should list available resources', async () => {
    const resources = await client.listResources();
    expect(resources).toContainEqual(
      expect.objectContaining({
        uri: expect.stringMatching(/^notion:\/\/pages\//),
      }),
    );
  });

  // More E2E tests...
});
```

## Testing Strategy

### Test Execution Order

1. **Unit Tests First** (TDD)
   - Write unit tests for pure functions before implementation
   - Focus on behavior and edge cases
   - No mocks, no IO

2. **Integration Tests Second** (BDD)
   - Test integration points with simple mocks
   - Verify error handling and retries
   - Mock only external dependencies (Notion SDK)

3. **E2E Tests Last**
   - Run against real Notion test workspace
   - Verify full system behavior
   - Manual execution only

### Mocking Strategy

**Simple Mock Example**:

```typescript
// For integration tests
const mockNotionClient: NotionClientWrapper = {
  async getPage(pageId: string) {
    if (pageId === 'test-page-id') {
      return {
        id: 'test-page-id',
        // ... minimal valid response
      };
    }
    throw new Error('Page not found');
  },
  // ... other methods
};
```

## Implementation Checklist

### Week 1

- [ ] Environment configuration with tests
- [ ] Logging infrastructure with tests
- [ ] Error handling utilities with tests
- [ ] Notion data transformers with tests
- [ ] Query builders with tests

### Week 2

- [ ] Notion client wrapper with integration tests
- [ ] MCP resource handlers with tests
- [ ] MCP tool implementations with tests
- [ ] Input validation with tests

### Week 3

- [ ] Server assembly
- [ ] Main entry point
- [ ] E2E test infrastructure
- [ ] E2E test scenarios
- [ ] Documentation updates

## Quality Gates

Run after each implementation:

1. `pnpm test:run` - All tests passing
2. `pnpm type-check` - No TypeScript errors
3. `pnpm lint` - No linting issues
4. `pnpm format` - Consistent formatting
5. `pnpm build` - Successful build

## Dependencies to Add

```bash
# None needed - all core dependencies installed in Phase 1
# (@modelcontextprotocol/sdk, @notionhq/client, zod, dotenv)
```

## Architecture Decisions

### Why This Structure?

1. **Pure Functions Maximize Testability**
   - Business logic is easily unit tested
   - No side effects make tests reliable
   - Fast test execution

2. **Dependency Injection Enables Testing**
   - All IO is mockable
   - Integration tests stay fast
   - Clear boundaries between layers

3. **Separate E2E Tests**
   - Real API calls isolated
   - Can run against test workspace
   - Won't affect CI/CD pipeline

### Key Patterns

1. **Factory Functions for Dependencies**

   ```typescript
   export function createNotionClient(apiKey: string): NotionClientWrapper;
   ```

2. **Handler Functions Accept Dependencies**

   ```typescript
   export function createResourceHandlers(deps: Dependencies): Handlers;
   ```

3. **Pure Transform Functions**
   ```typescript
   export function transformNotionPageToMcpResource(page: NotionPage): McpResource;
   ```

## Risk Mitigation

1. **Notion API Changes**
   - Wrapper interface isolates changes
   - Transformers handle version differences
   - Integration tests catch breaking changes

2. **MCP Protocol Updates**
   - Follow SDK patterns closely
   - Keep handlers thin
   - Business logic in pure functions

3. **Type Safety**
   - Zod validation at boundaries
   - No `any` types
   - Strict TypeScript config

## Success Metrics

- Zero TypeScript errors
- 100% unit test coverage for pure functions
- All integration points tested
- E2E tests demonstrate all features
- Clean architecture maintained
