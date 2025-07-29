# High Level Architecture

## Overview

The Oak Notion MCP Server follows a clean, layered architecture designed for testability, maintainability, and safety. The system provides read-only access to Notion workspaces through the Model Context Protocol (MCP), enabling AI assistants to query and analyze Notion content.

## Core Design Principles

1. **Pure Functions First**: Maximum business logic implemented as pure, side-effect-free functions
2. **Dependency Injection**: All I/O operations are injected, making the system highly testable
3. **Clear Boundaries**: Well-defined interfaces between architectural layers
4. **Test-Driven Development**: Tests written before implementation
5. **Type Safety**: Strict TypeScript with no `any` types, validated boundaries using Zod
6. **Fail-Safe Defaults**: Read-only operations by default, write operations require explicit confirmation

## System Architecture

```
┌─────────────────────────────────────────┐
│            MCP Client                   │
│    (Claude Desktop, Roo Cline, etc)     │
└────────────────┬────────────────────────┘
                 │ stdio (JSON-RPC)
┌────────────────┴────────────────────────┐
│          MCP Protocol Layer             │
│      Request/Response Handlers          │
│    ┌─────────────────────────────┐      │
│    │ Resources │ Tools │ Prompts │      │
│    └─────────────────────────────┘      │
├─────────────────────────────────────────┤
│         Business Logic Layer            │
│        (Pure Functions Only)            │
│    ┌─────────────────────────────┐      │
│    │ Transformers │ Validators   │      │
│    │ Builders     │ Formatters   │      │
│    └─────────────────────────────┘      │
├─────────────────────────────────────────┤
│        Notion Adapter Layer             │
│         (Integration Point)             │
│    ┌─────────────────────────────┐      │
│    │    NotionClientWrapper      │      │
│    └─────────────────────────────┘      │
├─────────────────────────────────────────┤
│       Infrastructure Layer              │
│    ┌─────────────────────────────┐      │
│    │ Config │ Logging │ Errors   │      │
│    └─────────────────────────────┘      │
└─────────────────────────────────────────┘
                 │
┌────────────────┴────────────────────────┐
│           External Systems              │
│         (Notion API, File I/O)          │
└─────────────────────────────────────────┘
```

## Layer Responsibilities

### MCP Protocol Layer

- **Purpose**: Handle MCP protocol communication and request routing
- **Components**:
  - Request handlers for resources, tools, and prompts
  - Response formatters
  - Protocol-specific error handling
- **Dependencies**: Business Logic Layer
- **Key Principle**: Thin layer that delegates to business logic

### Business Logic Layer

- **Purpose**: Core application logic implemented as pure functions
- **Components**:
  - Data transformers (Notion → MCP format)
  - Query builders
  - Validators
  - Text formatters and extractors
- **Dependencies**: None (pure functions)
- **Key Principle**: No side effects, fully testable with unit tests

### Notion Adapter Layer

- **Purpose**: Abstract Notion API interactions behind a clean interface
- **Components**:
  - `NotionClientWrapper` interface
  - Factory function for creating clients
  - Retry logic and error handling
- **Dependencies**: External Notion SDK
- **Key Principle**: All Notion API calls go through this single point

### Infrastructure Layer

- **Purpose**: Cross-cutting concerns and system utilities
- **Components**:
  - Environment configuration and validation
  - Logging abstraction
  - Error classification and formatting
  - Server initialization
- **Dependencies**: None (provides services to other layers)
- **Key Principle**: Injectable dependencies for all I/O operations

## Data Flow

### Read Operation Example (Tool: notion-search)

```
1. MCP Client → MCP Server: Tool request "notion-search" with query
2. Protocol Layer: Validates request format
3. Business Logic: Validates input with Zod schema
4. Business Logic: Builds Notion search query (pure function)
5. Notion Adapter: Executes search via Notion API
6. Business Logic: Transforms results to MCP format (pure function)
7. Protocol Layer: Formats MCP response
8. MCP Server → MCP Client: Returns search results
```

## Key Components

### Resources

Provide access to Notion content through URI-based addressing:

- `notion://pages/{pageId}` - Individual page content
- `notion://databases/{databaseId}` - Database schema and entries
- `notion://workspace` - Workspace information

### Tools

Enable operations on Notion content:

- `notion-search` - Full-text search across workspace
- `notion-list-databases` - List accessible databases
- `notion-query-database` - Query database with filters
- `notion-get-page` - Retrieve specific page content
- `notion-list-users` - List workspace users

### Prompts

Pre-configured interaction templates:

- Database query builder
- Page content analyzer

## Testing Architecture

### Test Pyramid

```
        ┌─────┐
        │ E2E │ Manual execution, real Notion API
        ├─────┤
        │ API │ Automated, mocked external calls
        ├─────┤
        │ Int │ Automated, simple mocks only
        ├─────┤
        │Unit │ Automated, no mocks, pure functions
        └─────┘
```

### Test Types by Layer

1. **Unit Tests** (Business Logic Layer)
   - Test pure functions in isolation
   - No mocks, no I/O
   - Fast, reliable, comprehensive

2. **Integration Tests** (Adapter & Protocol Layers)
   - Test component integration
   - Simple mocks for external dependencies
   - Verify error handling and retries

3. **API Tests** (Full Protocol Stack)
   - Test MCP protocol compliance
   - Mock Notion API responses
   - Verify end-to-end request handling

4. **E2E Tests** (Complete System)
   - Test against real Notion workspace
   - Manual execution only
   - Verify actual API behavior

## Security Architecture

### API Key Management

- API keys stored in environment variables
- Never committed to version control
- Validated on startup

### Access Control

- Read-only operations by default
- No write operations in Phase 2
- Future write operations require explicit confirmation

### Input Validation

- All external inputs validated with Zod schemas
- Type-safe boundaries between layers
- Sanitized error messages to prevent information leakage

## Error Handling Strategy

### Error Classification

```typescript
type ErrorClass =
  | 'ValidationError' // Invalid input
  | 'NotFoundError' // Resource doesn't exist
  | 'PermissionError' // Insufficient access
  | 'RateLimitError' // API quota exceeded
  | 'NetworkError' // Connection issues
  | 'InternalError'; // Unexpected errors
```

### Error Flow

1. Errors caught at boundary (Notion Adapter)
2. Classified by error type
3. Converted to MCP-compliant error format
4. Logged with appropriate detail level
5. User-friendly message returned to client

## Deployment Architecture

### Package Structure

```
oak-notion-mcp/
├── dist/               # Bundled ESM output
│   ├── index.js       # Entry point
│   └── index.d.ts     # TypeScript declarations
├── src/               # Source code
│   ├── mcp/           # Protocol layer
│   ├── notion/        # Adapter layer
│   ├── config/        # Infrastructure
│   └── index.ts       # Main entry
└── e2e-tests/         # E2E test suite
```

### Runtime Requirements

- Node.js 22+ (ESM support)
- Environment variables for configuration
- Notion API key with appropriate permissions

### MCP Client Integration

```json
{
  "mcpServers": {
    "notion": {
      "command": "node",
      "args": ["/path/to/oak-notion-mcp/dist/index.js"],
      "env": {
        "NOTION_API_KEY": "${NOTION_API_KEY}"
      }
    }
  }
}
```

## Performance Considerations

### Caching Strategy (Future)

- Resource metadata cached with TTL
- Search results cached for identical queries
- Cache invalidation on write operations

### Rate Limiting

- Respect Notion API rate limits
- Exponential backoff on 429 errors
- Queue management for batch operations

### Resource Optimization

- Lazy loading of page content
- Pagination for large result sets
- Streaming responses for large documents

## Future Architecture Extensions

### Phase 3: Write Operations

- Confirmation UI component
- Audit log storage
- Rollback tracking
- Two-phase commit pattern

### Phase 4: Advanced Features

- WebSocket support for real-time updates
- Plugin architecture for custom tools
- Multi-workspace support
- OAuth flow for user authentication

## Architecture Decision Records (ADRs)

### ADR-001: ESM-Only Package

**Decision**: Build and distribute as ESM-only
**Rationale**: Modern Node.js standard, simpler build process, better tree-shaking
**Consequences**: Requires Node.js 22+, may need migration guides for CJS users

### ADR-002: Pure Functions First

**Decision**: Maximize pure functions, minimize integration points
**Rationale**: Enables comprehensive unit testing, easier reasoning about code
**Consequences**: More explicit dependency injection, clear separation of concerns

### ADR-003: Zod for Validation

**Decision**: Use Zod for runtime type validation at boundaries
**Rationale**: Type-safe validation, good error messages, works well with TypeScript
**Consequences**: Additional dependency, need to maintain schemas

### ADR-004: No Direct Notion SDK Usage

**Decision**: Wrap Notion SDK behind interface
**Rationale**: Isolates API changes, enables testing, provides upgrade path
**Consequences**: Additional abstraction layer, need to maintain wrapper

## Monitoring and Observability

### Logging Levels

- `ERROR`: Unrecoverable errors requiring attention
- `WARN`: Recoverable issues (retries, fallbacks)
- `INFO`: Key operations (server start, connections)
- `DEBUG`: Detailed operation flow (development only)

### Metrics (Future)

- Request count by tool/resource
- Response times
- Error rates by classification
- Notion API usage statistics

### Health Checks

- Startup validation of configuration
- Notion API connectivity test
- Runtime health endpoint (future)
