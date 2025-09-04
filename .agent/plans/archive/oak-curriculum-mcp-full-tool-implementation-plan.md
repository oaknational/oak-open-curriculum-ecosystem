# Oak Curriculum MCP Full Tool Implementation Plan

**Created**: 2025-08-12  
**Status**: 🚧 DRAFT  
**Purpose**: Implement comprehensive MCP tool coverage for all Oak Curriculum API endpoints

## 🎯 Objective

Transform the Oak Curriculum MCP server from basic functionality (4 tools) to complete API coverage (25+ tools), enabling full access to Oak National Academy's curriculum content through Claude.

## 📊 Current State Analysis

### Existing Tools (4/25)
1. `oak-search-lessons` - Search for lessons ✅
2. `oak-get-lesson` - Get lesson metadata (without transcript) ✅
3. `oak-list-key-stages` - List all key stages ✅
4. `oak-list-subjects` - List all subjects ✅

### SDK Endpoints Requiring MCP Tools (21 remaining)

#### Critical Priority (Most Valuable)
1. `/lessons/{lesson}/transcript` - **Get lesson transcript** ⭐
2. `/lessons/{lesson}/summary` - Get lesson summary
3. `/lessons/{lesson}/quiz` - Get lesson quiz questions
4. `/subjects/{subject}` - Get specific subject details
5. `/key-stages/{keyStage}/subject/{subject}/lessons` - List lessons by key stage and subject

#### High Priority (Frequently Useful)
6. `/key-stages/{keyStage}/subject/{subject}/units` - Get units for key stage/subject
7. `/units/{unit}/summary` - Get unit summary
8. `/search/transcripts` - Search within transcripts
9. `/lessons/{lesson}/assets` - Get lesson assets (presentations, worksheets)
10. `/subjects/{subject}/key-stages` - Get key stages for a subject

#### Medium Priority (Specialised Use)
11. `/sequences/{sequence}/units` - Get sequence units
12. `/subjects/{subject}/sequences` - Get subject sequences
13. `/subjects/{subject}/years` - Get subject years
14. `/threads` - Get threads
15. `/threads/{threadSlug}/units` - Get thread units
16. `/key-stages/{keyStage}/subject/{subject}/questions` - Get questions
17. `/sequences/{sequence}/questions` - Get sequence questions

#### Low Priority (Administrative/Metadata)
18. `/changelog` - Get changelog
19. `/changelog/latest` - Get latest changelog
20. `/rate-limit` - Get rate limit info
21. `/key-stages/{keyStage}/subject/{subject}/assets` - Get assets by key stage/subject
22. `/sequences/{sequence}/assets` - Get sequence assets
23. `/lessons/{lesson}/assets/{type}` - Get specific asset type

### Convenience Tools (New)
24. `oak-get-lesson-complete` - Get lesson metadata + transcript + quiz (composite tool)

## 🏗️ Implementation Architecture

### Organ Structure Enhancement

```
ecosystem/psycha/oak-curriculum-mcp/
├── src/
│   ├── chorai/
│   │   └── stroma/
│   │       ├── tool-definitions.ts     # Expanded tool schemas
│   │       └── api-mappings.ts         # Endpoint to tool mappings
│   ├── organa/
│   │   ├── curriculum/
│   │   │   ├── operations/
│   │   │   │   ├── lessons.ts          # Enhanced with transcript/quiz/assets
│   │   │   │   ├── subjects.ts         # Existing, needs expansion
│   │   │   │   ├── units.ts            # NEW: Unit operations
│   │   │   │   ├── sequences.ts        # NEW: Sequence operations
│   │   │   │   ├── assets.ts           # NEW: Asset operations
│   │   │   │   ├── changelog.ts        # NEW: Changelog operations
│   │   │   │   └── composite.ts        # NEW: Composite operations
│   │   │   └── index.ts                # Export all operations
│   │   └── mcp/
│   │       ├── tools/
│   │       │   ├── lesson-tools.ts     # Enhanced lesson tools
│   │       │   ├── subject-tools.ts    # Subject-related tools
│   │       │   ├── unit-tools.ts       # NEW: Unit tools
│   │       │   ├── asset-tools.ts      # NEW: Asset tools
│   │       │   ├── search-tools.ts     # Search operations
│   │       │   ├── metadata-tools.ts   # NEW: Changelog, rate-limit
│   │       │   └── composite-tools.ts  # NEW: Convenience tools
│   │       └── handlers/
│   │           └── tool-handler.ts     # Expanded tool dispatch
│   └── psychon/
│       └── wiring.ts                    # Wire new operations
```

## 📝 Implementation Steps

### Phase 1: Foundation (Day 1)
1. **Restructure tool organisation**
   - Create modular tool files by domain
   - Update tool definitions schema
   - Implement tool registry pattern

2. **Enhance curriculum organ**
   - Add missing operation modules
   - Implement pure functions for data transformation
   - Ensure proper error handling

### Phase 2: Critical Tools (Day 1-2)
3. **Implement transcript operations**
   - `oak-get-lesson-transcript` tool
   - Integration with SDK client
   - Unit tests for transcript parsing

4. **Implement lesson detail tools**
   - `oak-get-lesson-summary`
   - `oak-get-lesson-quiz`
   - `oak-get-lesson-assets`

5. **Implement navigation tools**
   - `oak-get-subject`
   - `oak-list-lessons-by-stage-subject`
   - `oak-list-units-by-stage-subject`

### Phase 3: Search and Discovery (Day 2)
6. **Enhance search capabilities**
   - `oak-search-transcripts`
   - Add pagination support to existing search
   - Implement filtering options

7. **Implement unit operations**
   - `oak-get-unit-summary`
   - `oak-list-sequence-units`

### Phase 4: Convenience and Composite (Day 3)
8. **Create composite tools**
   - `oak-get-lesson-complete` (metadata + transcript + quiz)
   - `oak-get-subject-overview` (subject + key stages + units)

9. **Implement metadata tools**
   - `oak-get-changelog`
   - `oak-get-rate-limit`

### Phase 5: Testing and Integration (Day 3-4)
10. **Comprehensive testing**
    - Unit tests for all pure functions
    - Integration tests for MCP protocol compliance
    - E2E tests for critical user journeys

11. **Documentation**
    - Update MCP tool documentation
    - Create usage examples
    - Document composite tool patterns

## 🧪 Testing Strategy

### Unit Tests (Per Tool)
- Pure transformation functions
- Error handling
- Parameter validation
- Response formatting

### Integration Tests (Per Domain)
- Tool registration
- Handler dispatch
- SDK client integration
- Protocol compliance

### E2E Tests (Critical Paths)
- Search → Get Lesson → Get Transcript
- List Subjects → Get Subject → List Lessons
- Composite tool functionality

## 📋 Tool Implementation Template

Each tool follows this pattern:

```typescript
// 1. Define tool schema (stroma)
export const getLessonTranscriptTool: ToolDefinition = {
  name: 'oak-get-lesson-transcript',
  description: 'Get the transcript for a specific lesson',
  inputSchema: {
    type: 'object',
    properties: {
      lessonSlug: {
        type: 'string',
        description: 'The unique slug identifier for the lesson',
      },
    },
    required: ['lessonSlug'],
  },
};

// 2. Implement operation (organa/curriculum)
export async function getLessonTranscript(
  client: OakApiClient,
  lessonSlug: string,
): Promise<TranscriptResult> {
  const result = await client.GET('/lessons/{lesson}/transcript', {
    params: { path: { lesson: lessonSlug } },
  });
  
  if (result.error) {
    throw new CurriculumOperationError(
      `Failed to fetch transcript: ${result.error.message}`,
    );
  }
  
  return transformTranscriptResponse(result.data);
}

// 3. Wire to handler (organa/mcp)
case 'oak-get-lesson-transcript':
  return await curriculumOrgan.getLessonTranscript(
    args.lessonSlug as string,
  );
```

## 🎯 Success Criteria

### Functional Requirements
- [ ] All 25 SDK endpoints have corresponding MCP tools
- [ ] Composite convenience tools for common workflows
- [ ] Proper error handling with helpful messages
- [ ] Type-safe parameter validation

### Quality Requirements
- [ ] 100% unit test coverage for pure functions
- [ ] All tools pass MCP protocol compliance tests
- [ ] Zero ESLint warnings or errors
- [ ] TypeScript strict mode compliance
- [ ] Functions under 50 lines (complexity < 8)

### Documentation Requirements
- [ ] Each tool has clear description
- [ ] Input schemas are self-documenting
- [ ] Usage examples for common patterns
- [ ] Error scenarios documented

## 🚀 Benefits

### For Users
- Complete access to Oak curriculum content
- Efficient composite tools for common tasks
- Reliable transcript access for lesson analysis
- Rich search capabilities

### For Development
- Modular, maintainable tool structure
- Clear separation of concerns
- Comprehensive test coverage
- Foundation for future enhancements

## ⚠️ Risks and Mitigations

### Risk: API Rate Limiting
**Mitigation**: Implement rate limit checking tool, add throttling guidance

### Risk: Large Response Sizes
**Mitigation**: Implement pagination, provide filtering options

### Risk: Complex Tool Discovery
**Mitigation**: Logical naming conventions, comprehensive descriptions

### Risk: Maintenance Burden
**Mitigation**: Modular structure, comprehensive tests, clear patterns

## 📅 Timeline

- **Day 1**: Foundation + Critical tools (5-6 tools)
- **Day 2**: Search + Navigation tools (6-8 tools)
- **Day 3**: Remaining tools + Composite tools (8-10 tools)
- **Day 4**: Testing, documentation, refinement

## 🔄 Next Steps

1. Review and approve this plan
2. Begin Phase 1 implementation
3. Iterative development with regular sub-agent reviews
4. Continuous testing throughout
5. Final integration and documentation

## 📝 Notes

- Priority given to tools that unlock lesson content (transcript, quiz)
- Composite tools reduce round-trips for common workflows
- Modular structure enables parallel development if needed
- Testing strategy ensures reliability without over-testing