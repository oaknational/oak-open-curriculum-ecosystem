# Phase 6: Oak Curriculum API Implementation Plan (v2)

**Last Updated**: 2025-08-12  
**Status**: 🚧 Phase 6.5 IN PROGRESS  
**Lead Developer**: Claude  
**Dependencies**: Phase 5 ✅ COMPLETED

## 🎯 Executive Summary

Implement Oak National Academy's Curriculum API as both a reusable SDK and a comprehensive MCP server with full tool coverage, demonstrating multi-organism coexistence in our biological architecture ecosystem.

## ✅ Completed Achievements (Condensed)

### Sub-phase 6.1-6.4: Foundation Complete ✅

**SDK Implementation**:
- ✅ Type generation pipeline with openapi-typescript
- ✅ Client implementation using openapi-fetch pattern
- ✅ Multi-entry point build configuration (tsup)
- ✅ Full E2E test suite (17 tests passing)
- ✅ API documentation created

**MCP Server Implementation**:
- ✅ Biological architecture (chorai/organa/psychon)
- ✅ Basic tool implementation (4 tools)
- ✅ TDD remediation (complexity <8, functions <50 lines)
- ✅ 38 tests passing (unit + integration)
- ✅ Startup script with proper env loading
- ✅ File logging to root .logs directory
- ✅ Successfully connected to Claude

**Key Achievement**: Production-ready foundation with zero technical debt, all quality gates passing.

## 🚀 Sub-phase 6.5: Full MCP Tool Implementation

### Objective
Expand from 4 basic tools to comprehensive coverage of all 25+ API endpoints, including composite convenience tools.

### Current vs Target State

| Category | Current | Target |
|----------|---------|--------|
| Tool Coverage | 4/25 endpoints | 25/25 endpoints + composites |
| Critical Tools | Missing transcript, quiz | Full lesson content access |
| Search | Basic lesson search | Transcript search, filtering |
| Navigation | List only | Full CRUD navigation |
| Assets | None | Complete asset management |

### Implementation Plan

#### Phase 6.5.1: Tool Architecture Refactoring (Day 1 Morning)

**Restructure for Scale**:
```
organa/
├── curriculum/
│   └── operations/
│       ├── lessons/
│       │   ├── get-transcript.ts    # Pure function
│       │   ├── get-summary.ts       # Pure function
│       │   ├── get-quiz.ts          # Pure function
│       │   └── index.ts
│       ├── subjects/
│       ├── units/
│       ├── sequences/
│       ├── assets/
│       └── composite/
└── mcp/
    └── tools/
        ├── lesson-tools.ts     # Tool definitions
        ├── subject-tools.ts
        └── registry.ts         # Tool registry pattern
```

**Key Changes**:
1. Modular operation files (pure functions)
2. Domain-grouped tool definitions
3. Tool registry for automatic discovery
4. Proper separation of concerns

#### Phase 6.5.2: Critical Content Tools (Day 1 Afternoon)

**Priority 1 - Lesson Content** (Enables full lesson access):
- `oak-get-lesson-transcript` - Get video transcript
- `oak-get-lesson-summary` - Get lesson summary
- `oak-get-lesson-quiz` - Get quiz questions
- `oak-get-lesson-assets` - Get downloadable resources

**Priority 2 - Navigation** (Enables discovery):
- `oak-get-subject` - Get subject details
- `oak-list-lessons-by-stage-subject` - Browse lessons
- `oak-list-units-by-stage-subject` - Browse units
- `oak-get-unit-summary` - Unit overview

#### Phase 6.5.3: Search and Discovery Tools (Day 2 Morning)

**Enhanced Search**:
- `oak-search-transcripts` - Search within video transcripts
- Add pagination support to existing search tools
- Implement result filtering options

**Sequence and Thread Navigation**:
- `oak-list-sequence-units` - Get sequence structure
- `oak-list-subject-sequences` - Browse sequences
- `oak-list-threads` - Get learning threads
- `oak-list-thread-units` - Thread structure

#### Phase 6.5.4: Asset and Question Tools (Day 2 Afternoon)

**Asset Management**:
- `oak-get-lesson-asset-by-type` - Specific asset types
- `oak-list-assets-by-stage-subject` - Browse assets
- `oak-list-sequence-assets` - Sequence resources

**Question Banks**:
- `oak-list-questions-by-stage-subject` - Question discovery
- `oak-list-sequence-questions` - Sequence questions

#### Phase 6.5.5: Convenience and Metadata Tools (Day 3 Morning)

**Composite Tools** (Reduce round-trips):
- `oak-get-lesson-complete` - Lesson + transcript + quiz + assets
- `oak-get-subject-overview` - Subject + key stages + units
- `oak-get-unit-complete` - Unit + lessons + resources

**Administrative Tools**:
- `oak-get-changelog` - API changes
- `oak-get-latest-changelog` - Recent updates
- `oak-get-rate-limit` - Usage information

#### Phase 6.5.6: Testing and Integration (Day 3-4)

**Testing Strategy**:

1. **Unit Tests** (Per Operation):
   ```typescript
   describe('getLessonTranscript', () => {
     it('transforms API response to transcript format', () => {
       const apiResponse = { /* mock data */ };
       const result = transformTranscriptResponse(apiResponse);
       expect(result).toHaveProperty('content');
       expect(result).toHaveProperty('duration');
     });
   });
   ```

2. **Integration Tests** (Per Tool Domain):
   ```typescript
   describe('Lesson Tools Integration', () => {
     it('registers all lesson tools correctly', () => {
       const tools = getLessonTools();
       expect(tools).toHaveLength(8);
       expect(tools[0].name).toBe('oak-get-lesson-transcript');
     });
   });
   ```

3. **E2E Tests** (Critical Paths):
   ```typescript
   describe('Lesson Discovery Journey', () => {
     it('search → get lesson → get transcript', async () => {
       // Test complete user journey
     });
   });
   ```

### Implementation Guidelines

#### Tool Implementation Pattern

Each tool follows strict patterns:

```typescript
// 1. Pure Operation Function (organa/curriculum/operations)
export function getLessonTranscript(
  apiResponse: ApiTranscriptResponse
): TranscriptResult {
  // Pure transformation, no I/O
  return {
    content: apiResponse.transcript,
    duration: apiResponse.duration_seconds,
    timestamps: mapTimestamps(apiResponse.timestamps),
  };
}

// 2. SDK Integration (organa/curriculum)
export async function fetchLessonTranscript(
  client: OakApiClient,
  lessonSlug: string
): Promise<TranscriptResult> {
  const result = await client.GET('/lessons/{lesson}/transcript', {
    params: { path: { lesson: lessonSlug } }
  });
  
  if (result.error) {
    throw new CurriculumOperationError(
      `Failed to fetch transcript: ${result.error.message}`
    );
  }
  
  return getLessonTranscript(result.data);
}

// 3. Tool Definition (organa/mcp/tools)
export const lessonTranscriptTool: ToolDefinition = {
  name: 'oak-get-lesson-transcript',
  description: 'Get the video transcript for a lesson',
  inputSchema: {
    type: 'object',
    properties: {
      lessonSlug: {
        type: 'string',
        description: 'Unique lesson identifier',
      },
    },
    required: ['lessonSlug'],
  },
};
```

### Success Metrics

**Coverage Metrics**:
- [ ] 100% of SDK endpoints have MCP tools
- [ ] All tools have unit tests
- [ ] Integration tests for each tool domain
- [ ] E2E tests for critical user journeys

**Quality Metrics**:
- [ ] Zero ESLint warnings
- [ ] TypeScript strict mode
- [ ] Complexity < 8
- [ ] Functions < 50 lines
- [ ] No eslint-disable comments
- [ ] No type assertions

**Documentation**:
- [ ] Each tool has clear description
- [ ] Input schemas are self-documenting
- [ ] Error messages are helpful
- [ ] Usage examples provided

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| API Rate Limits | Implement rate limit tool, add throttling |
| Large Responses | Pagination support, filtering options |
| Tool Discovery | Logical naming, comprehensive descriptions |
| Maintenance | Modular structure, comprehensive tests |

### Timeline

- **Day 1**: Architecture refactoring + Critical tools (8 tools)
- **Day 2**: Search/Discovery + Assets/Questions (10 tools)
- **Day 3**: Convenience tools + Metadata (7 tools)
- **Day 4**: Testing, documentation, refinement

### Next Actions

1. ✅ Create implementation plan
2. ✅ Update Phase 6 documentation
3. 🔄 Review plan with sub-agents
4. ⏳ Begin tool implementation
5. ⏳ Continuous testing
6. ⏳ Documentation updates

## 📊 Phase Summary

| Sub-phase | Status | Description |
|-----------|--------|-------------|
| 6.1 SDK Foundation | ✅ COMPLETED | Type generation, client implementation |
| 6.2 MCP Server Base | ✅ COMPLETED | Biological architecture, 4 tools |
| 6.3 Build Configuration | ✅ COMPLETED | Multi-entry tsup config |
| 6.4 Pagination | ✅ VERIFIED | Already supported by API |
| **6.5 Full Tool Coverage** | **🚧 IN PROGRESS** | **25+ tools implementation** |

## 🎯 Overall Phase 6 Goal

Create a production-ready Oak Curriculum ecosystem with:
- Type-safe SDK for direct API access
- Comprehensive MCP server for AI assistant integration
- Full coverage of curriculum content and resources
- Zero technical debt, comprehensive testing
- Clear documentation and examples

The completion of Phase 6.5 will provide Claude and other AI assistants with complete access to Oak National Academy's educational content, enabling rich educational interactions and lesson planning capabilities.