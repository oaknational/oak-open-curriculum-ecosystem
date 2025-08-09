# Phase 6: Oak Curriculum API MCP Implementation Plan

**Status**: PLANNING  
**Start Date**: 2025-01-09  
**Estimated Duration**: 3-5 days  
**Dependencies**: Phase 5 ✅ COMPLETED

## 🎯 Executive Summary

Phase 6 adds the Oak Curriculum API as a new MCP organism, providing AI assistants with access to Oak National Academy's educational content. This will be implemented as a separate Psycha organism that can run alongside the Notion MCP server.

## 📋 Objectives

1. **Create Oak API MCP Server**: New organism at `ecosystem/psycha/oak-curriculum-mcp`
2. **Implement API Integration**: Connect to Oak's curriculum API endpoints
3. **Provide Educational Tools**: Search lessons, units, programmes, and resources
4. **Maintain Architecture**: Follow Moria/Histoi/Psycha patterns established in Phase 5
5. **Enable Multi-Server**: Support running both Notion and Oak API servers concurrently

## 🏗️ Architecture Design

### Package Structure

```text
ecosystem/
├── moria/                           # ✅ Existing (no changes)
├── histoi/                          # ✅ Existing (no changes)
└── psycha/
    ├── oak-notion-mcp/              # ✅ Existing Notion server
    └── oak-curriculum-mcp/          # 🆕 NEW Oak API server
        ├── src/
        │   ├── chora/               # Infrastructure layers
        │   │   ├── stroma/          # Types & contracts
        │   │   ├── aither/          # Logging & errors
        │   │   ├── phaneron/        # Configuration
        │   │   └── eidola/          # Test mocks
        │   ├── organa/              # Business logic
        │   │   ├── oak-api/         # Oak API client
        │   │   └── mcp/             # MCP handlers
        │   └── psychon/             # Application wiring
        ├── tests/
        └── package.json
```

### Key Components

#### 1. Oak API Client (`organa/oak-api`)

- Curriculum search
- Lesson fetching
- Unit/Programme navigation
- Resource downloading
- Response caching

#### 2. MCP Tools (`organa/mcp/tools`)

- `oak-search-lessons`: Search for lessons by subject/key stage
- `oak-get-lesson`: Get detailed lesson content
- `oak-list-units`: List units in a programme
- `oak-get-programme`: Get programme overview
- `oak-search-resources`: Search teaching resources

#### 3. MCP Resources (`organa/mcp/resources`)

- `lesson://{id}`: Individual lesson content
- `unit://{id}`: Unit overview and lessons
- `programme://{subject}/{keystage}`: Programme structure
- `resource://{type}/{id}`: Teaching resources

## 📊 Implementation Plan

### Sub-phase 6.1: Project Setup

**Duration**: 2 hours  
**Priority**: CRITICAL

1. Create package structure
2. Set up TypeScript configuration
3. Configure ESLint and Prettier
4. Set up test infrastructure
5. Add to workspace

### Sub-phase 6.2: Oak API Client

**Duration**: 4 hours  
**Priority**: HIGH

1. Define API types and interfaces
2. Implement HTTP client with retry logic
3. Add response caching layer
4. Create error handling
5. Write integration tests

### Sub-phase 6.3: MCP Tool Implementation

**Duration**: 6 hours  
**Priority**: HIGH

1. Create tool schemas
2. Implement search tools
3. Implement content retrieval tools
4. Add pagination support
5. Write unit tests

### Sub-phase 6.4: MCP Resource Handlers

**Duration**: 4 hours  
**Priority**: MEDIUM

1. Design URI scheme
2. Implement resource discovery
3. Create resource readers
4. Add content formatting
5. Write integration tests

### Sub-phase 6.5: Server Integration

**Duration**: 3 hours  
**Priority**: HIGH

1. Wire up MCP server
2. Configure transport (STDIO)
3. Add startup logic
4. Implement graceful shutdown
5. Create CLI entry point

### Sub-phase 6.6: Testing & Documentation

**Duration**: 3 hours  
**Priority**: MEDIUM

1. End-to-end testing
2. Performance testing
3. Create README
4. Add usage examples
5. Update main docs

### Sub-phase 6.7: Multi-Server Support

**Duration**: 2 hours  
**Priority**: LOW

1. Update Claude configuration examples
2. Test concurrent server operation
3. Document multi-server setup
4. Add troubleshooting guide

## 🔧 Technical Specifications

### API Endpoints

```typescript
interface OakAPIEndpoints {
  search: '/api/v1/search';
  lesson: '/api/v1/lessons/{id}';
  unit: '/api/v1/units/{id}';
  programme: '/api/v1/programmes/{subject}/{keystage}';
  resources: '/api/v1/resources';
}
```

### Tool Schemas

```typescript
// Example: Search Lessons Tool
{
  name: 'oak-search-lessons',
  description: 'Search Oak curriculum for lessons',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      subject: { type: 'string', enum: ['maths', 'english', ...] },
      keyStage: { type: 'string', enum: ['ks1', 'ks2', 'ks3', 'ks4'] },
      limit: { type: 'number', default: 10 }
    }
  }
}
```

### Configuration

```typescript
interface OakAPIConfig {
  apiKey?: string;        // Optional API key
  baseUrl: string;        // API base URL
  timeout: number;        // Request timeout
  retries: number;        // Retry attempts
  cacheSize: number;      // Response cache size
  cacheTTL: number;       // Cache TTL in seconds
}
```

## 📈 Success Criteria

### Functional Requirements

- [ ] Search lessons by subject and key stage
- [ ] Retrieve full lesson content
- [ ] Navigate curriculum structure
- [ ] Cache API responses
- [ ] Handle API errors gracefully

### Non-Functional Requirements

- [ ] Response time < 2 seconds
- [ ] Cache hit rate > 80%
- [ ] 100% test coverage for core logic
- [ ] Zero dependency violations
- [ ] All quality gates passing

### Integration Requirements

- [ ] Works with Claude Desktop
- [ ] Works with Claude Code
- [ ] Runs alongside Notion MCP
- [ ] Proper error messages
- [ ] Comprehensive logging

## 🚀 Quick Start Commands

```bash
# Development
cd ecosystem/psycha/oak-curriculum-mcp
pnpm dev

# Testing
pnpm test
pnpm test:e2e

# Building
pnpm build

# Running
CLAUDE_API_KEY=xxx pnpm start
```

## ⚠️ Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| API Rate Limits | HIGH | Implement caching and backoff |
| API Changes | MEDIUM | Version lock and monitoring |
| Large Responses | MEDIUM | Pagination and streaming |
| Auth Complexity | LOW | Start with public endpoints |

## 📚 Dependencies

### Required Histoi Tissues

- `@oaknational/mcp-histos-logger` ✅
- `@oaknational/mcp-histos-env` ✅
- `@oaknational/mcp-histos-storage` ✅
- `@oaknational/mcp-histos-transport` ✅

### External Dependencies

- `@modelcontextprotocol/sdk` (MCP SDK)
- `node-fetch` or native fetch (HTTP client)
- `zod` (Schema validation)

## 🔄 Future Enhancements (Phase 7+)

1. **AI-Enhanced Features**
   - Lesson plan generation
   - Content summarization
   - Difficulty adjustment

2. **Advanced Caching**
   - Distributed cache
   - Predictive prefetching
   - Offline mode

3. **Analytics**
   - Usage tracking
   - Popular content metrics
   - Performance monitoring

4. **Content Enhancement**
   - Resource downloads
   - Video transcripts
   - Interactive elements

## 📋 Implementation Checklist

### Day 1: Foundation

- [ ] Create package structure
- [ ] Set up build configuration
- [ ] Define API types
- [ ] Implement basic HTTP client

### Day 2: Core Features

- [ ] Build Oak API client
- [ ] Implement caching layer
- [ ] Create search tools
- [ ] Add content retrieval

### Day 3: MCP Integration

- [ ] Wire up MCP server
- [ ] Implement tool handlers
- [ ] Add resource handlers
- [ ] Create CLI entry

### Day 4: Testing & Polish

- [ ] Write comprehensive tests
- [ ] Add documentation
- [ ] Performance optimization
- [ ] Error handling improvements

### Day 5: Deployment

- [ ] Final testing
- [ ] Update main docs
- [ ] Create release
- [ ] Announce completion

## 🎯 Definition of Done

Phase 6 is complete when:

- [ ] Oak Curriculum MCP server is fully functional
- [ ] All tools and resources are implemented
- [ ] Comprehensive tests pass (>90% coverage)
- [ ] Documentation is complete
- [ ] Server works with Claude Desktop/Code
- [ ] Can run alongside Notion MCP
- [ ] All quality gates passing
- [ ] Performance targets met
- [ ] Released and published

## 📝 Notes

- Focus on read-only operations initially
- Prioritize most-used curriculum areas
- Consider teacher vs student perspectives
- Ensure accessibility compliance
- Plan for internationalization
