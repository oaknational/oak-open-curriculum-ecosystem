# Oak Curriculum API Deep Dive Analysis

## Executive Summary

This report presents a comprehensive analysis of the Oak Curriculum API reference implementation and provides architectural recommendations for implementing Phase 6 of the oak-mcp-ecosystem project. The analysis reveals a sophisticated, production-ready TypeScript SDK that demonstrates best-in-class patterns for building type-safe API clients.

## Reference Implementation Analysis

### Architecture Overview

The reference implementation (`reference/oak-curriculum-api-client/`) is a well-architected TypeScript SDK with these key characteristics:

1. **Type-Safe API Client**: Uses `openapi-fetch` for type-safe API calls with full TypeScript integration
2. **Generated Types**: Automated type generation from OpenAPI schema at `https://open-api.thenational.academy/api/v0`
3. **Dual Client Architecture**: Offers both method-based (performance) and path-based (convenience) clients
4. **Environment-Agnostic Design**: Never accesses environment variables directly, requires explicit API key injection
5. **Bearer Token Authentication**: Clean middleware pattern for auth header injection

### API Endpoints Analysis

The Oak Curriculum API provides comprehensive access to educational content:

#### Core Endpoints
- `/subjects` - List all subjects
- `/key-stages` - List key stages
- `/lessons/{lesson}/*` - Lesson content, transcripts, quizzes, assets
- `/units/{unit}/summary` - Unit summaries
- `/sequences/{sequence}/*` - Sequence units and assets
- `/search/lessons` - Search lessons by query
- `/search/transcripts` - Search lesson transcripts

#### Authentication
- Bearer token authentication required for all endpoints
- API key passed via `Authorization: Bearer {apiKey}` header
- Clean middleware pattern prevents credential leakage

### Code Quality Assessment

**Strengths:**
- Excellent TypeScript meta-programming in type generation
- Clean separation between generated and hand-written code
- Comprehensive validation strategy (strict for enums, graceful for open parameters)
- Modern build tooling with proper incremental compilation
- Factory pattern implementation hides complexity from consumers

**Patterns to Adapt (Not Adopt Wholesale):**
- Global state management risk with shared `_apiKey` variable - we'll use instance properties instead
- Limited to ESM format only - we may want dual format support
- Integration test patterns - we'll implement comprehensive testing
- Error handling - we'll create specific error classes for our use cases

### Key Patterns to Adopt

1. **Factory Pattern with Dependency Injection**
```typescript
export function createOakClient(apiKey: string): OakApiClient {
  // Never access process.env inside the SDK core
  const authMiddleware = createAuthMiddleware(apiKey);
  const client = createClient<paths>({ baseUrl: apiUrl });
  client.use(authMiddleware);
  return client;
}
```

2. **Type Generation Pipeline**
- Use `openapi-typescript` for initial generation
- Build custom tooling for parameter extraction
- Generate both static types and runtime validators

3. **Dual Client Architecture**
- Method-based: `client.GET('/lessons/{lesson}/summary', { params: { path: { lesson } } })`
- Path-based: `client['/lessons/{lesson}/summary'].GET({ params: { path: { lesson } } })`

## Proposed Architecture

### 1. Oak Curriculum SDK (`packages/oak-curriculum-sdk`)

**Type**: Standard Package (no biological architecture)

**Key Design Decisions:**
- Simple, focused wrapper around Oak API
- Environment-agnostic factory pattern
- Type-safe with generated OpenAPI types
- Pure functions for data transformation
- No biological dependencies (conventional package)

**Core Components:**
```typescript
// src/client.ts
export class OakCurriculumClient {
  private readonly apiClient: OpenApiClient<paths>;
  
  constructor(config: { apiKey: string; baseUrl?: string }) {
    // Implementation following reference patterns
  }
  
  // High-level methods wrapping API calls
  async searchLessons(params: SearchParams): Promise<Lesson[]>
  async getLesson(id: string): Promise<LessonDetails>
  async getUnitLessons(unitId: string): Promise<Lesson[]>
}
```

**Dependencies:**
- `openapi-fetch` - Type-safe HTTP client
- `zod` - Runtime validation (if needed)
- No biological architecture packages

### 2. Oak Curriculum MCP Server (`ecosystem/psycha/oak-curriculum-mcp`)

**Type**: Psycha Organism (full biological architecture)

**Biological Structure:**

#### Chorai (Pervasive Infrastructure)
```
src/chora/
├── morphai/     # Abstract patterns
├── stroma/      # Core types and contracts
│   └── types.ts # CurriculumOperations interface
├── aither/      # Logging infrastructure
│   └── index.ts # Logger abstraction
├── phaneron/    # Configuration
│   └── config.ts # API config types
└── eidola/      # Environment interfaces
```

#### Organa (Discrete Business Logic)
```
src/organa/
├── curriculum/  # Curriculum operations organ
│   ├── index.ts
│   ├── search.ts
│   ├── content.ts
│   └── cache.ts
└── mcp/        # MCP protocol organ
    ├── index.ts
    ├── tools/   # MCP tool implementations
    └── resources/ # MCP resource implementations
```

#### Psychon (Orchestration Layer)
```
src/psychon/
├── index.ts     # Main wiring
├── server.ts    # MCP server initialization
└── dependencies.ts # Dependency injection setup
```

**MCP Tool Mappings:**

1. **Search Tools**
   - `oak-search-lessons`: Search lessons with filters
   - `oak-search-transcripts`: Search lesson transcripts

2. **Content Tools**
   - `oak-get-lesson`: Retrieve lesson details
   - `oak-get-unit`: Get unit summary and lessons
   - `oak-get-sequence`: Get sequence content

3. **Navigation Tools**
   - `oak-list-subjects`: List available subjects
   - `oak-list-key-stages`: List key stages
   - `oak-browse-curriculum`: Navigate hierarchy

4. **Asset Tools**
   - `oak-get-assets`: Retrieve lesson/unit assets
   - `oak-get-quiz`: Get lesson quiz questions

**MCP Resources:**
- `oak-curriculum://subjects` - Static subject list
- `oak-curriculum://lessons/{id}` - Lesson content
- `oak-curriculum://units/{id}` - Unit content

## Implementation Strategy

### Phase 6.1: SDK Foundation
1. Set up package structure with proper configuration
2. Implement type generation from OpenAPI schema
3. Create base client with authentication middleware
4. Add high-level wrapper methods for common operations
5. Write comprehensive unit tests

### Phase 6.2: MCP Server Structure
1. Create full biological architecture directories
2. Implement chorai infrastructure layers
3. Build curriculum organ with caching
4. Create MCP organ with tool/resource handlers
5. Wire everything through psychon

### Phase 6.3: MCP Integration
1. Map API operations to MCP tools
2. Implement resource providers
3. Add rate limiting and caching
4. Create integration tests

### Phase 6.4: Testing & Documentation
1. Unit tests for pure functions
2. Integration tests for organ interactions
3. E2E tests for MCP protocol compliance
4. Comprehensive documentation

## Key Architectural Principles

### SDK Principles
1. **Simplicity**: Minimal abstraction over API
2. **Type Safety**: Full TypeScript integration
3. **Environment Agnostic**: No env var access
4. **Pure Functions**: Data transformation without side effects
5. **Factory Pattern**: Clean construction and configuration

### MCP Server Principles
1. **Biological Architecture**: Full chorai/organa/psychon structure
2. **Dependency Injection**: No cross-organ imports
3. **Pervasive Infrastructure**: Chorai flow through everything
4. **Discrete Organs**: Clear boundaries between business logic
5. **Adaptive Behavior**: Use histoi tissues for runtime adaptation

## Risk Mitigation

1. **API Rate Limits**: Implement caching in curriculum organ
2. **Authentication Failures**: Clear error messages, no credential leakage
3. **Type Drift**: Automated type generation in CI/CD
4. **Network Reliability**: Retry logic with exponential backoff
5. **Version Compatibility**: Version lock to specific API version

## Success Metrics

1. **Type Coverage**: 100% type safety for API operations
2. **Test Coverage**: >80% unit test coverage
3. **MCP Compliance**: All tools pass protocol validation
4. **Performance**: <100ms overhead for MCP operations
5. **Developer Experience**: Clear documentation and examples

## Recommendations

1. **Start Simple**: Implement basic SDK first, then add MCP layer
2. **Adapt Patterns**: Take inspiration from reference patterns but implement to our standards
3. **Test Foundation**: Build comprehensive test suite for all new functionality
4. **Document Thoroughly**: Clear examples for both SDK and MCP usage
5. **Version Lock**: Pin to specific Oak API version initially

## Important Context

The placeholder implementations in both packages were transplanted from earlier work in a different repository. This code serves as a starting point and will be properly refactored with full test coverage as part of the Phase 6 implementation. The reference implementation provides patterns and inspiration, but our SDK will be built to our own high standards with proper biological architecture where appropriate.

## Conclusion

The Oak Curriculum API reference implementation provides an excellent foundation for our SDK development. By adapting its proven patterns while adding our biological architecture for the MCP server, we can create a robust, type-safe, and maintainable solution that bridges Oak's educational content to AI assistants through the Model Context Protocol.

The dual-package approach (conventional SDK + biological MCP server) ensures clean separation of concerns while maximizing reusability and maintainability. The SDK remains simple and focused, while the MCP server adds the orchestration and protocol adaptation layers needed for AI integration.