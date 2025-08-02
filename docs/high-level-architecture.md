# High Level Architecture

## Overview

The Oak Notion MCP Server follows a clean, layered architecture designed for testability, maintainability, and safety. The system provides read-only access to Notion workspaces through the Model Context Protocol (MCP), enabling AI assistants to query and analyze Notion content.

The architecture now includes a generic MCP framework (oak-mcp-core) that provides reusable components for building MCP servers, with the Notion-specific implementation (oak-notion-mcp) built on top of this foundation.

## Core Design Principles

1. **Pure Functions First**: Maximum business logic implemented as pure, side-effect-free functions
2. **Dependency Injection**: All I/O operations are injected, making the system highly testable
3. **Clear Boundaries**: Well-defined interfaces between architectural layers
4. **Test-Driven Development**: Tests written before implementation
5. **Type Safety**: Strict TypeScript with no `any` types, validated boundaries using Zod
6. **Fail-Safe Defaults**: Read-only operations by default, write operations require explicit confirmation
7. **Privacy by Design**: Automatic PII scrubbing for sensitive data (emails)

## System Architecture

```text
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
  - PII scrubbing utilities
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

```text
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

- `notion://discovery` - Workspace discovery with summary of users, pages, and databases
- `notion://users/{userId}` - Individual user information (with email scrubbing)
- `notion://pages/{pageId}` - Individual page content
- `notion://databases/{databaseId}` - Database schema and metadata

### Tools

Enable operations on Notion content:

- `notion-search` - Full-text search across workspace
- `notion-list-databases` - List accessible databases
- `notion-query-database` - Query database with filters
- `notion-get-page` - Retrieve specific page content
- `notion-list-users` - List workspace users

### Prompts

Not implemented in Phase 2. The team decided to use examples in documentation instead of prompt templates.

## Testing Architecture

### Test Pyramid

```text
        ┌─────┐
        │ E2E │ Manual execution, real Notion API
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
   - 100% coverage for pure functions

2. **Integration Tests** (Adapter & Protocol Layers)
   - Test component integration
   - Simple mocks for external dependencies
   - Verify error handling and retries
   - Test MCP protocol compliance with mocked Notion API

3. **E2E Tests** (Complete System)
   - Test against real Notion workspace
   - Manual execution only (not in CI/CD)
   - Verify actual API behavior
   - Includes real MCP client connection tests

## Security Architecture

### API Key Management

- API keys stored in environment variables
- Never committed to version control
- Validated on startup with Zod
- Keys never logged or exposed in errors

### Access Control

- Read-only operations by default
- No write operations in Phase 2
- Future write operations require explicit confirmation

### Privacy Protection

- Automatic PII scrubbing for email addresses
- Emails displayed as `abc...@domain.com` format
- Applied consistently across all user data
- Implemented as pure function for testability

### Input Validation

- All external inputs validated with Zod schemas
- Type-safe boundaries between layers
- Sanitized error messages to prevent information leakage
- Request validation before any processing

## Error Handling Strategy

### Error Classification

The `ErrorHandler` class provides centralized error handling with proper classification:

- **Validation Errors**: Invalid input, missing required fields
- **Not Found Errors**: Resources that don't exist
- **Permission Errors**: Insufficient access rights
- **Rate Limit Errors**: API quota exceeded
- **Network Errors**: Connection issues
- **Internal Errors**: Unexpected errors

### Error Flow

1. Errors caught at boundaries (Notion Adapter, MCP handlers)
2. Classified by `ErrorHandler.handle()` method
3. Converted to MCP-compliant error format with appropriate codes
4. Logged with context but without exposing sensitive data
5. User-friendly message returned to client
6. Stack traces only included in development mode

## Deployment Architecture

### Package Structure

```text
oak-notion-mcp/
├── dist/               # Bundled ESM output
│   ├── index.js       # Entry point
│   └── index.d.ts     # TypeScript declarations
├── src/               # Source code
│   ├── oak-mcp-core/  # Generic MCP framework (~3,050 LoC)
│   │   ├── errors/    # Error handling framework
│   │   ├── logging/   # Logging abstraction
│   │   ├── protocol/  # MCP protocol implementation
│   │   ├── runtime/   # Runtime abstractions
│   │   ├── types/     # Core TypeScript types
│   │   └── index.ts   # Single public API export
│   ├── oak-notion-mcp/ # Notion-specific implementation (<1,000 LoC)
│   │   ├── adapters/  # Notion API adapters
│   │   ├── resources/ # Notion resource definitions
│   │   ├── tools/     # Notion-specific tools
│   │   └── index.ts   # Notion MCP server entry
│   └── index.ts       # Main application entry
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

## Oak MCP Core Framework

### Overview

The `oak-mcp-core` framework provides a generic, reusable foundation for building MCP servers. This framework abstracts the common patterns, protocols, and infrastructure needed for MCP implementations, allowing domain-specific servers to focus on their unique logic.

### Framework Design Principles

1. **Zero External Dependencies**: The core framework has no external runtime dependencies
2. **Runtime Abstractions**: Cross-platform support through abstracted I/O operations
3. **Single Public API**: All framework components accessed through `index.ts` barrel export
4. **Type Safety**: Full TypeScript support with strict type checking
5. **Testability**: Dependency injection and pure functions throughout

### Framework Architecture

```text
┌─────────────────────────────────────────┐
│           oak-mcp-core                  │
│        (Generic Framework)              │
├─────────────────────────────────────────┤
│ protocol/     │ Runtime Protocol Impl   │
│ errors/       │ Error Classification    │
│ logging/      │ Logging Abstraction     │
│ runtime/      │ Platform Abstractions   │
│ types/        │ Core TypeScript Types   │
└─────────────────────────────────────────┘
                 │ (implements)
┌─────────────────────────────────────────┐
│         oak-notion-mcp                  │
│      (Domain Implementation)            │
├─────────────────────────────────────────┤
│ adapters/     │ Notion API Integration  │
│ resources/    │ Notion Resource Defs    │
│ tools/        │ Notion-specific Tools   │
└─────────────────────────────────────────┘
```

### Framework Components

#### Core Framework (~3,050 LoC)

- **Protocol Layer**: Complete MCP protocol implementation with request/response handling
- **Error Framework**: Hierarchical error classification and handling system
- **Logging Abstraction**: Platform-agnostic logging with multiple output formats
- **Runtime Abstractions**: Cross-platform I/O, process management, and environment handling
- **Type System**: Comprehensive TypeScript definitions for MCP protocol and framework

#### Notion Implementation (<1,000 LoC)

- **Notion Adapters**: Integration with Notion API through clean interfaces
- **Resource Definitions**: Notion-specific resource types and URI handlers
- **Tool Implementations**: Search, query, and retrieval tools for Notion content
- **Business Logic**: Pure functions for data transformation and validation

### Framework Benefits

1. **Rapid Development**: New MCP servers can be built in hours instead of days
2. **Consistency**: All servers built on the framework follow the same patterns
3. **Maintenance**: Bug fixes and improvements benefit all framework users
4. **Testing**: Framework provides testing utilities and patterns
5. **Documentation**: Common patterns documented once in the framework

### Future Architecture Extensions

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

### Phase 5: Framework Expansion

- Extract oak-mcp-core as standalone npm package
- Additional domain adapters (GitHub, Slack, etc.)
- Visual MCP server builder
- Framework marketplace and ecosystem

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

### ADR-005: Automatic PII Scrubbing

**Decision**: Automatically scrub email addresses in all outputs
**Rationale**: Privacy by design, prevent accidental PII exposure, compliance-ready
**Consequences**: Email addresses shown as `abc...@domain.com`, implemented as pure function

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
