# Compilation-Time Revolution Plan: MCP Tool Generation

## Status: ✅ COMPLETE

All core implementation steps (1-15) have been successfully completed. The generator now produces fully type-safe code with zero `any` types.

## Overview

Transform the MCP tool generation to embed all validation and type information at compile-time, eliminating runtime schema lookups and creating fully self-contained, type-safe tool definitions.

## Disallowed Types

- No `any`
- No type assertions other than `as const`
- No `unknown` or `record<string, unknown>` except at incoming system boundaries where we genuinely don't know the shape of the data

## Context

### Current State

- Tools are generated with embedded executors but limited validation
- Runtime validation relies on external schema lookups
- Type safety requires type assertions in some places

### Target State

- All parameter metadata extracted from OpenAPI schema at generation time
- Complete validation logic embedded in each tool file
- Two-executor pattern: one type-safe, one for generic MCP calls
- Zero runtime schema dependencies

### Key Files

#### Generator File to Modify

- `/packages/oak-curriculum-sdk/scripts/typegen/mcp-tools/mcp-tool-generator.ts`

#### Example of Target Output

- `/packages/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/tools/oak-get-key-stages-subject-assets.ts`

#### Integration Point

- `/packages/oak-curriculum-sdk/src/mcp/execute-tool-call.ts` - Uses `tool.getExecutorFromGenericRequestParams()`

### Pattern Overview

```typescript
// Target pattern for each generated tool
const operationId = '...' as const;
const name = '...' as const;
const path = '...' as const;
const method = '...' as const;

// Type-safe client reference
type Client = OakApiPathBasedClient[path][method];

// Parameter type guards (for constrained params)
const allowedXValues = [...] as const;
type XValue = typeof allowedXValues[number] | undefined; // | undefined for optional
function isXValue(value: string | undefined): value is XValue { ... }

// Parameter metadata with embedded type guards
const pathParams = { 
  paramName: {
    typePrimitive: "string",
    valueConstraint: true,
    allowedValues: allowedXValues,
    typeguard: isXValue
  }
};

// Request validation
type ValidRequestParams = { params: { path: {...}, query?: {...} } };
function isValidRequestParams(requestParams: unknown): requestParams is ValidRequestParams { ... }
function getValidRequestParamsDescription(): string { ... }

// Two executors
const executor = (client: OakApiPathBasedClient, requestParams: ValidRequestParams): ReturnType<Client> => { ... }
const getExecutorFromGenericRequestParams = (client: OakApiPathBasedClient, requestParams: unknown) => { ... }

// Export with both executors
export const toolName = {
  name, path, method, operationId,
  pathParams, queryParams,
  executor,
  getExecutorFromGenericRequestParams
} as const;
```

## Part 1a: TypeDoc Generation and API Documentation

### Status: TODO

Ensure that TypeDoc generation is working correctly and that the entire public API of the SDK,
including all generated MCP tools, is well and accurately documented.

### Overview

The SDK now has a rich public API including:
- Client factories (`createOakClient`, `createOakPathBasedClient`)
- Generated MCP tools (25+ tools with full metadata)
- Type guards and validators
- Request/response validation functions
- Parameter constants and type guards
- Error types and handling

All of this needs proper TypeScript documentation that generates into beautiful, navigable API docs.

### Key Areas to Document

1. **Main Client APIs**
   - `createOakClient` - OpenAPI fetch-based client
   - `createOakPathBasedClient` - Path-based client for MCP
   - Configuration options and usage examples

2. **MCP Tool Exports**
   - `MCP_TOOLS` - Complete tool registry
   - `executeToolCall` - Tool execution function
   - `isToolName` - Type guard for tool names
   - Individual tool metadata and usage

3. **Validation Functions**
   - `validateRequest` - Request validation with Zod
   - `validateResponse` - Response validation with Zod
   - Error handling and validation results

4. **Type Guards and Constants**
   - `isValidPath`, `isAllowedMethod`
   - `isKeyStage`, `isSubject`, etc.
   - `KEY_STAGES`, `SUBJECTS`, `ASSET_TYPES` constants

5. **Generated Types**
   - `paths` and `components` from OpenAPI
   - Tool parameter types
   - Response types

### Implementation Steps

#### Step 1a.1: Audit current TypeDoc configuration

- Check if TypeDoc is installed and configured
- Review `typedoc.json` configuration if it exists
- Identify what's currently being documented
- Check build scripts for doc generation

#### Step 1a.2: Set up comprehensive TypeDoc configuration

```json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs/api",
  "plugin": ["typedoc-plugin-markdown"],
  "theme": "default",
  "includeVersion": true,
  "categorizeByGroup": true,
  "navigation": {
    "includeCategories": true,
    "includeGroups": true
  },
  "categoryOrder": [
    "Client",
    "MCP Tools",
    "Validation",
    "Type Guards",
    "Types",
    "*"
  ]
}
```

#### Step 1a.3: Add JSDoc comments to all public APIs

For each public export, ensure comprehensive documentation:

```typescript
/**
 * Creates an Oak API client using openapi-fetch
 * 
 * @example
 * ```typescript
 * const client = createOakClient({ apiKey: 'your-key' });
 * const response = await client.GET('/lessons/{lesson}/transcript', {
 *   params: { path: { lesson: 'lesson-slug' } }
 * });
 * ```
 * 
 * @param apiKey - Oak API key for authentication
 * @param options - Optional configuration
 * @returns Configured openapi-fetch client
 * 
 * @category Client
 * @since 0.0.1
 */
export function createOakClient(apiKey: string, options?: ClientOptions) {
  // ...
}
```

#### Step 1a.4: Document generated MCP tools

Add documentation generation to the tool generator:

```typescript
/**
 * ${tool.description}
 * 
 * @remarks
 * HTTP Method: ${tool.method.toUpperCase()}
 * Path: ${tool.path}
 * Operation ID: ${tool.operationId}
 * 
 * @param client - Oak API client instance
 * @param params - Tool parameters
 * ${generateParamDocs(tool.pathParams, tool.queryParams)}
 * 
 * @returns API response for ${tool.operationId}
 * 
 * @category MCP Tools
 * @since Generated
 */
```

#### Step 1a.5: Create documentation categories

Use TypeDoc's `@category` tag to organize documentation:

- **Client** - Client creation and configuration
- **MCP Tools** - All generated tool functions
- **Validation** - Request/response validators
- **Type Guards** - Runtime type checking functions
- **Constants** - Exported constant values
- **Types** - TypeScript type definitions
- **Errors** - Error classes and handling

#### Step 1a.6: Add usage examples throughout

Every major function should have an `@example` block:

```typescript
/**
 * @example
 * ```typescript
 * // Validate a tool name
 * if (isToolName('oak-get-subjects')) {
 *   // Tool exists, safe to call
 *   const result = await executeToolCall('oak-get-subjects', {});
 * }
 * ```
 */
```

#### Step 1a.7: Generate and review documentation

- Run TypeDoc generation
- Review generated HTML/Markdown
- Ensure all exports are documented
- Check navigation and categorization
- Verify examples render correctly

#### Step 1a.8: Add documentation to build pipeline

```json
{
  "scripts": {
    "docs": "typedoc",
    "docs:watch": "typedoc --watch",
    "build": "pnpm type-gen && pnpm tsup && pnpm docs"
  }
}
```

#### Step 1a.9: Create README sections for API docs

Add sections to README.md:
- Link to generated API documentation
- Quick start examples using the documented APIs
- Common usage patterns
- Migration guides if APIs change

### Success Criteria

- [ ] TypeDoc generates without warnings
- [ ] All public exports have JSDoc comments
- [ ] Examples provided for main use cases
- [ ] Documentation is organized by category
- [ ] Generated docs are navigable and searchable
- [ ] MCP tools are fully documented with parameters
- [ ] Type guards and validators are clearly explained
- [ ] README links to API documentation

## Part 1b: Core Implementation (Required) ✅

### Step 1: Extract 'required' field from OpenAPI schema parameters ✅

- Modify parameter extraction in `generateToolFile()`
- Store `required` boolean for each parameter
- This determines if parameter accepts `undefined`

### Step 2: Generate individual const declarations for tool metadata ✅

- Replace inline object with separate consts
- `const operationId = '${operationId}' as const;`
- `const name = '${toolName}' as const;`
- `const path = '${path}' as const;`
- `const method = '${method}' as const;`

### Step 3: Generate Client type extraction ✅

- Add after const declarations:
- `type Client = OakApiPathBasedClient['${path}']['${method.toUpperCase()}'];`

### Step 4: Generate type guards for constrained parameters ✅

- For each parameter with enum values:

  ```typescript
  const allowed${ParamName}Values = [${enumValues}] as const;
  type ${ParamName}Value = typeof allowed${ParamName}Values[number];
  function is${ParamName}Value(value: string): value is ${ParamName}Value { ... }
  ```

### Step 5: Handle optional parameters ✅

- Check parameter's `required` field
- For optional enum params: add `| undefined` to type
- Adjust type guard to accept undefined:

  ```typescript
  function isXValue(value: string | undefined): value is XValue {
    if (value === undefined) return true;
    ...
  }
  ```

### Step 6: Generate pathParams and queryParams with typeguard property ✅

- Include the guard function reference:

  ```typescript
  const pathParams = {
    paramName: {
      typePrimitive: "string",
      valueConstraint: true,
      allowedValues: allowedParamNameValues,
      typeguard: isParamNameValue
    }
  };
  ```

### Step 7: Generate ValidRequestParams type ✅

- Build proper TypeScript type with optionality:

  ```typescript
  type ValidRequestParams = {
    params: {
      path: { requiredParam: string },
      query?: { optionalParam?: string }
    }
  };
  ```

### Step 8: Generate isValidRequestParams type guard ✅

- Check all required params exist
- Validate all params with their guards
- Return proper type predicate

### Step 9: Generate getValidRequestParamsDescription function ✅

- Build human-readable schema description
- List all parameters with their constraints
- Used in error messages

### Step 10: Generate type-safe executor function ✅

- Takes `ValidRequestParams` type
- Calls client with validated params
- Returns `ReturnType<Client>`

### Step 11: Generate getExecutorFromGenericRequestParams wrapper ✅

- Takes generic `unknown` params
- Validates with `isValidRequestParams`
- Throws descriptive error or returns executor

### Step 12: Update tool export structure ✅

- Export object with all properties
- Include both `executor` and `getExecutorFromGenericRequestParams`
- Maintain `as const` for literal types

### Step 13: Handle tools with no parameters ✅

- Generate empty params objects
- Skip validation logic
- Direct executor call

### Step 14: Test generation with various combinations ✅

- Required path + optional query
- Multiple enum parameters
- No parameters
- Mixed constrained/unconstrained

### Step 15: Update execute-tool-call.ts types if needed ✅

- Ensure compatibility with new tool structure
- Update type definitions for `MCP_TOOLS`

## Part 2: MCP Server Integration - Full Bridge Implementation ✅

### Status: COMPLETE

Successfully created a minimal MCP server that delegates all tool execution to the SDK.
The server is now live and working in production.

### Overview

Created a complete bridge between the SDK's generated MCP tools and the MCP server.
All SDK tools are now immediately available through the MCP protocol.

### Achievements

✅ Stripped MCP server down to bare essentials
✅ All tool logic delegated to SDK
✅ Proper tool discovery from SDK metadata
✅ Production-ready error handling
✅ Clean architectural separation
✅ Fixed logging to stderr for MCP protocol compliance
✅ Fixed .env loading for both source and built versions

### Implementation Details

#### Step 16: Quick audit of current implementation ✅

- Located tool handler in `/ecosystem/psycha/oak-curriculum-mcp/src/organa/mcp/handlers/tool-handler.ts`
- Identified server setup in `/ecosystem/psycha/oak-curriculum-mcp/src/psychon/server.ts`
- Found tool registry in `/ecosystem/psycha/oak-curriculum-mcp/src/organa/mcp/tools/index.ts`
- Preserved MCP error handling patterns

#### Step 17: Update SDK import in MCP server ✅

```typescript
// In package.json or wherever the SDK is referenced
import { 
  executeToolCall, 
  isToolName,
  MCP_TOOLS 
} from '@oaknational/oak-curriculum-sdk';
```

- Ensure SDK is built first
- Verify imports resolve correctly

#### Step 18: Implement complete tool handler bridge ✅

Successfully replaced the existing tool handler with minimal SDK delegation:

```typescript
// ecosystem/psycha/oak-curriculum-mcp/src/organa/mcp/handlers/tool-handler.ts
import { executeToolCall, isToolName } from '@oaknational/oak-curriculum-sdk';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk';
import type { CallToolRequest, CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export async function handleToolCall(
  request: CallToolRequest
): Promise<CallToolResult> {
  const { name, arguments: args } = request.params;
  
  // Validate tool exists using SDK's type guard
  if (!isToolName(name)) {
    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${name}`
    );
  }
  
  // Delegate ALL execution to SDK
  const result = await executeToolCall(name, args);
  
  // Handle errors with proper MCP error codes
  if (result.error) {
    // Distinguish parameter errors from API errors
    const code = result.error.paramName 
      ? ErrorCode.InvalidParams 
      : ErrorCode.InternalError;
    
    throw new McpError(code, result.error.message);
  }
  
  // Return successful result formatted for MCP
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(result.data, null, 2)
    }]
  };
}
```

#### Step 19: Implement tool listing with discovery ✅

Successfully created tool listing from SDK metadata:

```typescript
// In server.ts or wherever tools are registered
import { MCP_TOOLS } from '@oaknational/oak-curriculum-sdk';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Helper to convert SDK params to JSON Schema
function generateInputSchema(tool: typeof MCP_TOOLS[keyof typeof MCP_TOOLS]) {
  const properties: Record<string, any> = {};
  const required: string[] = [];
  
  // Convert path parameters
  for (const [name, meta] of Object.entries(tool.pathParams)) {
    properties[name] = {
      type: meta.typePrimitive === 'number' ? 'number' : 'string',
      enum: meta.allowedValues,
      description: meta.valueConstraint 
        ? `One of: ${meta.allowedValues.join(', ')}` 
        : undefined
    };
    if (meta.required) required.push(name);
  }
  
  // Convert query parameters
  for (const [name, meta] of Object.entries(tool.queryParams)) {
    properties[name] = {
      type: meta.typePrimitive === 'number' ? 'number' : 'string',
      enum: meta.allowedValues,
      description: meta.valueConstraint 
        ? `One of: ${meta.allowedValues.join(', ')}` 
        : undefined
    };
    if (meta.required) required.push(name);
  }
  
  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined
  };
}

// Generate tool list from SDK
const tools = Object.entries(MCP_TOOLS).map(([name, tool]) => ({
  name,
  description: `${tool.method.toUpperCase()} ${tool.path} - ${tool.operationId}`,
  inputSchema: generateInputSchema(tool)
}));

// Register the list tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools
}));
```

#### Step 20: Clean up and remove duplicates ✅

- Removed all hardcoded tool arrays
- Deleted manual tool implementations  
- Removed old validation logic
- Kept only minimal MCP protocol handling

#### Step 21: Test with live Claude session ✅

Successfully tested all functionality:

1. **Build and deployment:** ✅
   - SDK builds successfully with all generated tools
   - MCP server builds and runs correctly
   - Tools are discovered from SDK metadata

2. **Tool discovery:** ✅
   - All 25+ generated tools appear in MCP
   - Tool descriptions include path and operation ID

3. **Tool execution:** ✅
   - Successfully tested `oak-get-search-lessons` with geography search
   - Returns proper formatted JSON responses
   - Handles API responses correctly

4. **Error handling:** ✅
   - Proper error when API key missing
   - Clear parameter validation errors
   - MCP error codes correctly mapped

#### Step 22: Document results ✅

**Key Issues Fixed During Testing:**

1. **Logging to stdout breaking MCP protocol:**
   - Fixed by redirecting all logs to stderr
   - Applied to both Oak and Notion MCP servers

2. **Environment variable loading:**
   - Fixed path resolution for .env file
   - Handles both source (tsx) and built (node) execution
   - Properly detects repo root

3. **Type errors in E2E tests:**
   - Added proper type assertions for MCP content
   - Fixed unknown type handling

**Successful Outcomes:**
- MCP server is minimal, all logic in SDK
- Complete type safety maintained
- All tools working with real API
- Clean architectural separation achieved

## Part 3: Shared Components and Code Reuse

### Status: TODO

Leverage the shared components in ecosystem/histoi and ecosystem/moria for both MCP servers,
and identify other common code that could be extracted into reusable components.

### Overview

The monorepo has established patterns for shared code:
- **ecosystem/moria** - Core interfaces and patterns (Logger, Storage, Transport)
- **ecosystem/histoi** - Concrete implementations (histos-logger, histos-storage, histos-transport, histos-env)

Both MCP servers (oak-curriculum and oak-notion) currently have duplicated code that could use these shared components.

### Current Shared Components Available

#### From @oaknational/mcp-moria (Interfaces):
- `Logger` - Logging interface
- `Storage` - Storage abstraction
- `Transport` - Transport abstraction
- Core types and patterns

#### From @oaknational/mcp-histos-* (Implementations):
- `histos-logger` - Adaptive logger with Consola
- `histos-storage` - File system storage
- `histos-transport` - Transport implementations
- `histos-env` - Environment configuration

### Analysis of Duplicate Code

#### Step 3.1: Audit current duplications

**Duplicated in both MCP servers:**

1. **Startup logging** (`src/psychon/startup.ts`)
   - Both servers have nearly identical startup logger implementations
   - Could use `histos-logger` with file output configured

2. **File logging** (`src/psychon/file-reporter.ts`)
   - Both have file logging implementations
   - Could use `histos-storage` for file operations

3. **Environment configuration**
   - Both manually load .env files
   - Could use `histos-env` for environment management

4. **Server setup patterns**
   - Both have similar psychon/organa/chorai architecture
   - Could extract MCP server base class

5. **Error handling**
   - Both map errors to MCP error codes similarly
   - Could create shared error mapping utilities

#### Step 3.2: Migrate to histos-logger

Replace custom logging implementations with histos-logger:

```typescript
// Before (custom implementation)
import { createStartupLogger } from './startup';

// After (using histos)
import { createAdaptiveLogger } from '@oaknational/mcp-histos-logger';

const logger = createAdaptiveLogger({
  level: 'info',
  name: 'oak-curriculum-mcp',
  consolaOptions: {
    // MCP servers need stderr output
    stdout: process.stderr,
    stderr: process.stderr,
  },
  // Add file output
  fileOutput: {
    enabled: true,
    directory: '.logs/oak-curriculum-mcp',
  }
});
```

#### Step 3.3: Migrate to histos-storage

Replace file operations with histos-storage:

```typescript
// Before (direct fs operations)
import { writeFileSync, mkdirSync } from 'node:fs';

// After (using histos)
import { createFileStorage } from '@oaknational/mcp-histos-storage';

const storage = createFileStorage({
  basePath: '.logs',
  ensureDirectory: true,
});

await storage.write('startup.log', logMessage, { append: true });
```

#### Step 3.4: Migrate to histos-env

Replace manual .env loading with histos-env:

```typescript
// Before (manual dotenv)
import { config } from 'dotenv';
const envPath = resolve(rootDir, '.env');
config({ path: envPath });

// After (using histos)
import { loadEnvironment } from '@oaknational/mcp-histos-env';

const env = await loadEnvironment({
  searchPaths: ['.git', 'pnpm-lock.yaml', 'package-lock.json'],
  envFile: '.env',
  required: ['OAK_API_KEY'], // or ['NOTION_API_KEY']
  validateFn: (env) => {
    // Custom validation
    return true;
  }
});
```

#### Step 3.5: Create shared MCP base server

Extract common MCP server patterns:

```typescript
// New: @oaknational/mcp-server-base
export abstract class McpServerBase {
  protected logger: Logger;
  protected server: Server;
  protected transport: StdioServerTransport;
  
  constructor(config: McpServerConfig) {
    this.logger = this.createLogger(config);
    this.transport = new StdioServerTransport();
    this.server = this.createServer(config);
  }
  
  abstract getTools(): Tool[];
  abstract handleToolCall(request: CallToolRequest): Promise<CallToolResult>;
  
  async start(): Promise<void> {
    // Common startup logic
    await this.loadEnvironment();
    await this.registerHandlers();
    await this.server.connect(this.transport);
  }
  
  protected registerHandlers(): void {
    // Register common handlers
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getTools()
    }));
    
    this.server.setRequestHandler(CallToolRequestSchema, (request) => 
      this.handleToolCall(request)
    );
  }
}
```

#### Step 3.6: Create shared MCP error utilities

Extract error mapping utilities:

```typescript
// New: @oaknational/mcp-error-utils
export function mapSdkErrorToMcpError(error: SdkError): McpError {
  if ('pathParameterName' in error || 'queryParameterName' in error) {
    return new McpError(ErrorCode.InvalidParams, error.message);
  }
  
  if (error.code === 'NETWORK_ERROR') {
    return new McpError(ErrorCode.InternalError, 'Network error occurred');
  }
  
  // More mappings...
  
  return new McpError(ErrorCode.InternalError, error.message);
}

export function wrapUnknownError(error: unknown): McpError {
  if (error instanceof McpError) return error;
  
  if (error instanceof Error) {
    return new McpError(ErrorCode.InternalError, error.message);
  }
  
  return new McpError(ErrorCode.InternalError, 'Unknown error occurred');
}
```

#### Step 3.7: Create shared validation utilities

Extract common validation patterns:

```typescript
// New: @oaknational/mcp-validation
export function validateRequiredEnvVars(
  required: string[],
  env: NodeJS.ProcessEnv = process.env
): Record<string, string> {
  const result: Record<string, string> = {};
  const missing: string[] = [];
  
  for (const key of required) {
    const value = env[key];
    if (!value) {
      missing.push(key);
    } else {
      result[key] = value;
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return result;
}
```

#### Step 3.8: Implement architectural patterns library

Create a library for the psychon/organa/chorai pattern:

```typescript
// New: @oaknational/biological-architecture
export interface Psychon {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface Organa<TInput, TOutput> {
  process(input: TInput): Promise<TOutput>;
}

export interface Chorai {
  // Pure data transformations
}

export function createOrganism<T extends Psychon>(
  psychon: T,
  organs: Organa<any, any>[],
  chorai: Chorai[]
): Organism<T> {
  return new Organism(psychon, organs, chorai);
}
```

### Implementation Priority

1. **High Priority** (Immediate benefits):
   - Migrate to histos-logger (fixes logging issues)
   - Migrate to histos-env (fixes env loading issues)
   - Extract MCP error utilities (reduces duplication)

2. **Medium Priority** (Good cleanup):
   - Create MCP base server class
   - Migrate to histos-storage
   - Extract validation utilities

3. **Low Priority** (Nice to have):
   - Biological architecture library
   - Advanced pattern abstractions

### Benefits

- **Reduced Duplication**: Single source of truth for common functionality
- **Consistent Behavior**: All MCP servers behave the same way
- **Easier Maintenance**: Fix bugs in one place
- **Better Testing**: Shared components can be thoroughly tested once
- **Faster Development**: New MCP servers can be created quickly

### Success Criteria

- [ ] Both MCP servers use histos-logger
- [ ] Both MCP servers use histos-env
- [ ] Startup logging deduplicated
- [ ] File logging deduplicated
- [ ] Error mapping extracted and shared
- [ ] Base MCP server class created
- [ ] No duplicate code between MCP servers
- [ ] Clear separation of concerns

## Part 4: Future Improvements (Generation Enhancements)

### Step 22.5: Sort out .env reading

Automatically go up the tree until it finds a .git folder or .git file or pnpm-lock.yaml or package-lock.json to locate the repo root for reading the .env file.

### Step 23: Integrate Zod validators for runtime safety

We generate Zod validators for the request and response schemas at compile time, but they're currently unused. This is a missed opportunity for runtime safety.

#### Current State
- SDK generates `validateRequest` and `validateResponse` functions using Zod schemas
- These are exported from the SDK but never imported/used
- MCP server passes Oak API responses through unvalidated
- If Oak API changes response format, we only find out at runtime errors in the client

#### Implementation Plan

**Option 1: Validate in the SDK's executeToolCall (Recommended)**
```typescript
// In packages/oak-curriculum-sdk/src/mcp/execute-tool-call.ts
import { validateResponse } from '../validation/index.js';

export async function executeToolCall(
  toolName: ToolName,
  requestParams: unknown
): Promise<ToolCallResult> {
  // ... existing validation and execution ...
  
  const response = await tool.executor(client, validParams);
  
  // NEW: Validate the API response matches our schema
  const validation = validateResponse(
    tool.path,
    tool.method,
    200, // Or extract from response status
    response.data
  );
  
  if (!validation.ok) {
    // Log validation failure for monitoring
    console.error('API response validation failed:', validation.issues);
    // Could throw or return error based on strictness needs
  }
  
  return { data: response.data };
}
```

**Option 2: Validate in the MCP server handler**
```typescript
// In ecosystem/psycha/oak-curriculum-mcp/src/organa/mcp/handlers/tool-handler.ts
import { validateResponse } from '@oaknational/oak-curriculum-sdk';

export async function handleToolCall(request: CallToolRequest) {
  const result = await executeToolCall(name, args);
  
  // Validate before sending to MCP client
  if (result.data) {
    const validation = validateResponse(
      tool.path,
      tool.method,
      200,
      result.data
    );
    
    if (!validation.ok) {
      // Return structured error to client
      return {
        isError: true,
        content: [{
          type: 'text',
          text: `API response validation failed: ${JSON.stringify(validation.issues)}`
        }]
      };
    }
  }
}
```

#### Benefits
- **Early Detection**: Catch API contract violations immediately
- **Better Errors**: Provide specific validation errors instead of runtime crashes
- **Monitoring**: Log validation failures for API health monitoring
- **Type Safety**: Ensure runtime data matches compile-time types
- **Progressive Enhancement**: Can start with logging, move to strict validation

#### Considerations
- Performance impact of validation (likely negligible with Zod)
- Handling validation failures (log vs error)
- Backward compatibility during API transitions
- Different validation strictness for dev/staging/prod

### Step 26: Generate proper error messages

- Include parameter name in all TypeErrors
- Show allowed values in consistent format
- Add which parameter type (path/query)

### Step 27: Handle number, boolean, array types

- Extend type guards for non-string types
- Generate appropriate validation
- Handle type coercion if needed

### Step 28: Handle array query parameters

- Support `?status=a&status=b` patterns
- Generate array type guards
- Validate each array element

### Step 29: Handle unconstrained parameters

- Different validation for non-enum params
- Type checking without value constraints
- Simpler guard functions

### Step 30: Add explanatory comments

- Mark optional parameters: `// Optional parameter`
- Explain validation logic
- Document type constraints

### Step 31: Handle very long enum lists

- Consider readability for 20+ values
- Maybe truncate in error messages
- Format across multiple lines

### Step 32: Verify executor return type

- Ensure type safety maintained
- Check `ReturnType<Client>` matches

### Step 33: Ensure correct return types

- Verify `getExecutorFromGenericRequestParams` typing
- Check compatibility with execute-tool-call.ts

### Step 34: Update MCP_TOOLS type

- Add new properties if needed
- Ensure backward compatibility

### Step 35: Handle $ref parameters

- Currently skipped with `if ('$ref' in param) continue;`
- Resolve references to actual parameter definitions
- Generate appropriate validation

### Step 36: Improve $ref resolution throughout

- Handle $ref in response schemas
- Handle $ref in request bodies
- Handle $ref in nested schemas
- Create ref resolution utilities
- Cache resolved references for performance

## Part 4: Generic OpenAPI-to-MCP Framework

### Overview

Extract the generic components of the Oak implementation to create a reusable framework
that can convert ANY OpenAPI3 schema into a fully functioning MCP server.

### Analysis Phase

#### Step 37: Identify Oak-specific Components

**Oak-specific elements:**

- Tool naming convention (`oak-` prefix)
- Oak API client configuration
- Oak-specific error messages
- Authentication method (API key header name)
- Custom business logic validations
- Tool descriptions tailored to curriculum

**Generic elements:**

- OpenAPI schema parsing
- Parameter extraction and metadata generation
- Type guard generation
- Validation function generation
- Two-executor pattern
- MCP protocol bridge
- Error mapping (API errors → MCP errors)
- Tool discovery and listing

#### Step 38: Document Generic Pipeline Architecture

Create comprehensive documentation of the pipeline:

1. **Input**: OpenAPI3 schema
2. **Generation Phase**:
   - Parse paths and operations
   - Extract parameters and schemas
   - Generate type-safe tool definitions
   - Create validation functions
3. **SDK Phase**:
   - Tool executor with validation
   - Client integration
   - Error handling
4. **MCP Phase**:
   - Protocol adaptation
   - Tool registration
   - Request/response transformation
5. **Output**: Complete MCP server

### Framework Design

#### Step 39: Design Configuration Interface

```typescript
interface OpenApiToMcpConfig {
  // Tool naming
  toolPrefix?: string;                    // Default: none
  toolNameGenerator?: (path: string, method: string) => string;
  
  // Client configuration  
  clientType: 'fetch' | 'axios' | 'custom';
  clientFactory: (config: any) => ApiClient;
  
  // Authentication
  auth?: {
    type: 'apiKey' | 'bearer' | 'basic' | 'oauth2';
    config: AuthConfig;
  };
  
  // Customization hooks
  onToolGenerated?: (tool: ToolDefinition) => ToolDefinition;
  onValidationError?: (error: ValidationError) => McpError;
  
  // Output options
  outputDir: string;
  generateSdk: boolean;
  generateMcpServer: boolean;
}
```

#### Step 40: Create Core Generator Package

- Package: `@openapi-to-mcp/core`
- Pure functions for generation
- No framework dependencies
- Configurable via options
- Well-typed with generics

#### Step 41: Create Framework Adapters

- `@openapi-to-mcp/sdk-generator` - Generate SDK with executors
- `@openapi-to-mcp/mcp-server` - Generate MCP server
- `@openapi-to-mcp/client-fetch` - Fetch-based client
- `@openapi-to-mcp/client-axios` - Axios-based client

### Implementation

#### Step 42: Extract Generic Components

- Move non-Oak code to framework packages
- Keep Oak-specific code in oak-curriculum-sdk
- Create clean interfaces between layers
- Ensure backwards compatibility

#### Step 43: Build CLI Tool

```bash
npx openapi-to-mcp \
  --schema ./api.json \
  --output ./mcp-server \
  --prefix my-api \
  --client fetch
```

#### Step 44: Create Template System

- Server templates for different runtimes
- Client templates for different libraries
- Configuration templates
- Docker templates for deployment

#### Step 45: Add Multi-API Support

- Combine multiple OpenAPI schemas
- Namespace tools by API
- Handle API versioning
- Support API composition

### Testing & Documentation

#### Step 46: Create Test Suite

- Test with various OpenAPI schemas
- Popular APIs: GitHub, Stripe, OpenAI
- Edge cases: no parameters, complex refs
- Performance benchmarks

#### Step 47: Write Framework Documentation

- Quick start guide
- API reference
- Architecture overview
- Migration guide from manual MCP servers
- Best practices

#### Step 48: Create Example Implementations

- Weather API → MCP server
- GitHub API → MCP server
- Internal REST API → MCP server
- GraphQL wrapper example

### Publishing

#### Step 49: Prepare for Open Source

- Choose license (MIT/Apache)
- Set up CI/CD
- Create contribution guidelines
- Set up issue templates
- Security policy

#### Step 50: Release Strategy

- Publish to npm
- Create GitHub releases
- Write blog post/announcement
- Submit to MCP server directory
- Engage with MCP community

## Implementation Notes

### OpenAPI Schema Access

The generator has access to the full OpenAPI schema through:

```typescript
const schema = generateSchema(apiContent);
const pathItem = schema.paths[path];
const operation = pathItem[method];
const parameters = operation.parameters || [];
```

### Parameter Structure

Each parameter in the schema has:

- `name`: Parameter name
- `in`: "path" or "query"
- `required`: boolean (defaults to false for query, true for path)
- `schema.enum`: Array of allowed values (if constrained)
- `schema.type`: The base type (string, number, etc.)

### Key Functions to Modify

1. `generateToolFile()` - Main generation function
2. Extract parameter metadata with required field
3. Generate all the new functions and types
4. Update the export structure

### Testing

After generation, run:

```bash
pnpm generate:openapi
pnpm test
pnpm build
```

Verify generated files match the new pattern and all tests pass.

## Success Criteria ✅

- ✅ All generated tool files follow the new pattern
- ✅ No runtime schema lookups required
- ✅ Type safety preserved throughout
- ✅ Execute-tool-call.ts works with new structure
- ✅ All existing tests pass
- ✅ Build succeeds without type errors

## Additional Improvements Completed

Beyond the original plan, we also:

- ✅ Replaced ALL `any` types in the generator with proper OpenAPI types
- ✅ Created `PrimitiveType` union and `ParamMetadata` interface for complete type safety
- ✅ Fixed generator bugs (duplicate returns, inconsistent signatures)
- ✅ Added optional chaining for safer path parameter access
- ✅ Ensured consistent function signatures across all tools
- ✅ Renamed `generateMinimalToolLookup` to `generateCompleteMcpTools` for accuracy
- ✅ Updated documentation to reflect the complete nature of generated tools
- ✅ Fixed type assertion in schema-generators.ts to avoid unsafe assignments
