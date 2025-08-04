# High Level Architecture

## Overview

The Oak Notion MCP Server follows a clean, layered architecture designed for testability, maintainability, and safety. The system provides read-only access to Notion workspaces through the Model Context Protocol (MCP), enabling AI assistants to query and analyze Notion content.

The architecture is based on a complete biological model with multiple scales - from pure functions (organelles) to complete applications (organisms) that can form ecosystems. This approach is mathematically grounded in complex systems theory, with proven stability properties validated across neuroscience, ecology, and machine learning (Meena et al., 2023; Scheffer et al., 2009).

## Core Design Principles

1. **Pure Functions First**: Maximum business logic implemented as pure, side-effect-free functions
2. **Dependency Injection**: All I/O operations are injected, making the system highly testable
3. **Clear Boundaries**: Well-defined interfaces between architectural layers
4. **Test-Driven Development**: Tests written before implementation
5. **Type Safety**: Strict TypeScript with no `any` types, validated boundaries using Zod
6. **Fail-Safe Defaults**: Read-only operations by default, write operations require explicit confirmation
7. **Privacy by Design**: Automatic PII scrubbing for sensitive data (emails)
8. **Complete Biological Architecture**: Systems (pervasive infrastructure) vs Organa (discrete business logic)
9. **Substrate Foundation**: Shared types and contracts form the "physics" of the system
10. **Multi-Scale Design**: Organelles → Cells → Tissues → Systems/Organa → Organism → Ecosystem
11. **Operating at Criticality**: Like the brain, we aim for the edge of chaos - stable enough for reliability, flexible enough for evolution
12. **Mathematical Grounding**: Architecture decisions based on proven complex systems principles

## System Architecture

### Current Layered Architecture

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

### Complete Biological Architecture (Phase 3 - In Progress)

Our architecture follows a complete biological model with multiple scales and types of components:

```text
┌─────────────────────────────────────────────────────────┐
│                    Ecosystem (Future)                    │
│          (Multiple Organisms Interacting)                │
└────────────────┬────────────────┬───────────────────────┘
                 │                │
┌────────────────▼────────┐  ┌───▼─────────────────────────┐
│  oak-notion-mcp       │  │  Future: oak-github-mcp     │
│  (Current Focus)      │  │  (Using oak-mcp-core)       │
└────────────┬───────────┘  └─────────────────────────────┘
             │
┌────────────▼────────────────────────────────────────────┐
│           Current Implementation Status                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │         Substrate (Foundation) ✅ COMPLETED          │ │
│ │   • types/: LogLevel, core types                    │ │
│ │   • contracts/: Logger, Config, EventBus,           │ │
│ │                 NotionOperations                     │ │
│ │   • event-schemas/: Event type definitions          │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ ┌─────────────────┐  ┌────────────────────────────────┐ │
│ │Systems ✅ DONE   │  │    Organa ✅ DONE              │ │
│ │ ┌───────────────┐ │ │ ┌────────────────────────────┐│ │
│ │ │Logging System │ │ │ │    Notion Organ            ││ │
│ │ │(2 levels max) │ │ │ │ • Transformers             ││ │
│ │ └───────────────┘ │ │ │ • Formatters               ││ │
│ │ ┌───────────────┐ │ │ │ • Public API via index.ts  ││ │
│ │ │Event System   │ │ │ └────────────────────────────┘│ │
│ │ │(Edge-compat)  │ │ │ ┌────────────────────────────┐│ │
│ │ └───────────────┘ │ │ │     MCP Organ              ││ │
│ │ ┌───────────────┐ │ │ │ • Tool handlers            ││ │
│ │ │Config System  │ │ │ │ • Resource handlers        ││ │
│ │ │(From systems) │ │ │ │ • Uses dependency injection││ │
│ │ └───────────────┘ │ │ └────────────────────────────┘│ │
│ └─────────────────┘ │ └────────────────────────────────┘ │
│                                                          │
│ ⏳ Next: organism.ts to wire everything together         │
└──────────────────────────────────────────────────────────┘

                    Detail: Cell Structure
┌─────────────────────────────────────────────────────────┐
│                    Cell (Module)                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │            Cell Membrane (index.ts)               │  │
│  │         Public API - Controls Access              │  │
│  └─────────────────────────────────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐    │
│  │ Organelle:  │  │ Organelle:  │  │ Organelle:   │    │
│  │ Pure Func 1 │  │ Pure Func 2 │  │ Pure Func 3  │    │
│  └─────────────┘  └─────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────┘
```

### Architectural Scales

1. **Substrate** (Foundation)
   - Types, contracts, event schemas
   - The "physics" of our application
   - Compile-time only, no runtime

2. **Organelles** (Pure Functions)
   - Smallest units of functionality
   - No side effects, no I/O
   - Highly testable

3. **Cells** (Modules)
   - Self-contained units with clear boundaries
   - Public API via index.ts (membrane)
   - Contains organelles

4. **Tissues** (Domain Groups)
   - Related cells working together
   - Shared purpose within domain
   - Local coordination

5. **Systems** (Pervasive Infrastructure)
   - Distributed throughout organism
   - Cross-cutting concerns (logging, events)
   - Like nervous or circulatory systems

6. **Organa** (Discrete Business Logic)
   - Complete functional units
   - Clear boundaries
   - Business-specific (Notion, MCP)

7. **Organism** (Application)
   - Complete application
   - Coordinates systems and organa
   - Single process

8. **Ecosystem** (Multiple Applications)
   - Multiple organisms interacting
   - Communicate via contracts
   - Distributed system

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
  - NotionClientWrapper with injected Notion SDK client
  - Request builders
  - Response mappers
- **Dependencies**: Notion SDK (injected)
- **Key Principle**: Single point of integration with external API

### Infrastructure Layer

- **Purpose**: Cross-cutting system concerns
- **Components**:
  - Configuration management
  - Logging with OpenTelemetry support
  - Error handling and recovery
  - Event transport
- **Dependencies**: External libraries (dotenv, consola, etc.)
- **Key Principle**: Pervasive systems that flow throughout the application

## Security Model

### Read-Only by Default

- All operations are read-only
- No write, update, or delete operations exposed
- API key requires only read permissions

### Data Privacy

- Automatic email scrubbing in all text content
- Configurable PII detection patterns
- No caching of sensitive data
- Clear audit trail through logging

### Input Validation

- All inputs validated with Zod schemas
- Type-safe boundaries between layers
- Explicit error messages for invalid inputs

## Testing Strategy

The system uses different testing approaches at each architectural scale:

| Level      | Testing Approach                             |
| ---------- | -------------------------------------------- |
| Substrate  | Compile-time type checking                   |
| Organelles | Pure unit tests, no mocks                    |
| Cells      | Integration tests with injected dependencies |
| Tissues    | Domain integration tests                     |
| Systems    | Infrastructure tests with test doubles       |
| Organa     | Business logic tests with mocked systems     |
| Organism   | E2E tests with real I/O                      |
| Ecosystem  | Contract tests between organisms             |

## Error Handling

### Fail-Fast Principle

- Validate inputs early
- Clear, actionable error messages
- No silent failures

### Error Propagation

- Errors bubble up through layers
- Each layer can add context
- MCP protocol layer formats for client

### Recovery Strategies

- Retry logic for transient failures
- Circuit breakers for external services
- Graceful degradation where possible

## Performance Considerations

### Caching Strategy

- No caching in current implementation
- Future: Response caching at MCP layer
- Cache invalidation via Notion webhooks

### Pagination

- Built-in support for Notion's pagination
- Transparent to MCP clients
- Configurable page sizes

### Resource Limits

- Memory-efficient streaming where possible
- Bounded concurrency for API calls
- Request timeout configuration

## Future Enhancements

### oak-mcp-core Extraction

Extract generic MCP server components:

- Protocol handlers
- Tool/Resource registration
- Transport abstractions
- Common utilities

### Multi-Organism Ecosystem

- Separate indexing service
- Search optimization service
- Analytics and monitoring service
- Each as independent organism

### Enhanced Security

- OAuth support for user-specific access
- Fine-grained permission models
- Audit logging for compliance

### Performance Optimizations

- Response caching layer
- Query optimization
- Parallel request processing

## Architectural Decisions

Key decisions are documented in ADRs:

- [ADR-006: Cellular Architecture Pattern](architectural-decisions/006-cellular-architecture-pattern.md)
- [ADR-018: Complete Biological Architecture](architectural-decisions/018-complete-biological-architecture.md)
- [All ADRs](architectural-decisions/)

## References

- [Tissue and Organ Interfaces](tissue-and-organ-interfaces.md)
- [MCP Specification](https://modelcontextprotocol.io)
- [Notion API Documentation](https://developers.notion.com)
