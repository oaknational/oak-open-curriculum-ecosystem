<!-- markdownlint-disable -->

# Oak Curriculum MCP Tool Generation Refactor

## Vision

Transform Oak Curriculum MCP from runtime tool generation to build-time enriched tool generation, ensuring ADR compliance and adding decorative metadata support.

## Critical Context

### ADR Compliance Requirements

- **ADR-029**: NO manual API data structures (no hardcoded paths/params)
- **ADR-030**: SDK is the ONLY source of truth for API information
- **ADR-031**: Generation happens at BUILD time, not runtime

### Current Architecture Issues

1. **Runtime generation works** but lacks decoration support
2. **Registry files violate ADRs** with hardcoded paths as keys
3. **Two parallel systems** exist:
   - Runtime: `tool-generator.ts` → generates from SDK at runtime ✅
   - Build-time: `generate-enriched-tools.ts` → generates at build time (not integrated)

## Target Architecture

```typescript
// Build-time flow:
SDK (OPERATIONS_BY_ID) + Decorations → Generation Script → enriched-tools.ts → MCP Server

// Decorations (manual, optional):
{
  'getLessonTranscript-getLessonTranscript': {  // operationId as key
    displayName: 'Get Lesson Transcript',
    category: 'content',
    tags: ['transcript'],
    examples: [...]
  }
}
```

## Implementation Phases

### Phase 1: Analysis ✅ COMPLETE

- Documented 26 operationIds from SDK
- Identified ADR violations in registry
- Designed generation-time approach

### Phase 2: Decorative Metadata ✅ COMPLETE

**Status**: All 26 operations now have decorations
**Files**:

- `tool-decorations.ts` - Interface file (34 lines)
- `tool-decorations-data.ts` - Data file (250 lines)
  **ADR Compliance**:
- ✅ ADR-029: No manual API data (decorations only)
- ✅ ADR-030: SDK operationIds as keys
- ✅ ADR-031: Ready for build-time generation

**Implementation Details**:

- Split into two files to meet 250-line limit
- All decorations keyed by operationId from SDK
- Categories: search, content, planning, resources, assessment, metadata
- Includes display names, descriptions, tags, complexity levels
- Runtime validation ensures no path keys

### Phase 3: Generation Script ✅ COMPLETE

- Created `scripts/generate-enriched-tools.ts`
- Generates `src/organa/mcp/generated/enriched-tools.ts`
- Combines SDK operations with decorations
- Deterministic output with proper types

### Phase 4: Integration ✅ COMPLETE (Roberta - 17:20)

**Status**: Complete with proper architecture
**Completed Changes**:

1. ✅ Update `src/organa/mcp/tools/index.ts` to import generated tools
2. ✅ Update `createMcpOrgan` to use SDK directly (no intermediate organ)
3. ✅ Rewrite handlers to call SDK directly using enriched tool metadata
4. ✅ Remove all hardcoded tool names and manual mapping

**Key Innovation**: Handler now directly calls SDK methods using operationId from enriched tools. No manual mapping, no compatibility layers, everything flows from API schema.

### Phase 5: Cleanup ✅ COMPLETE (Roberta - 17:30)

- ✅ Removed registry files with hardcoded paths
- ✅ Removed runtime generation code (tool-generator.ts)
- ✅ Removed dead curriculum organ
- ✅ Updated all imports

### Phase 6: Documentation ✅ COMPLETE (Roberta - 17:35)

- ✅ Updated SDK README with ADR compliance documentation
- ✅ Updated MCP README with direct SDK integration pattern
- ✅ Documented the central contract: API change → SDK rebuild → Done
- ✅ Created clear architectural documentation

## Active Work Status

### Who's Working on What

- **Roberta**: Completed all phases, working on quality gates (17:35)
- **Clyde (Claude Code)**: Available for quality gate fixes

### Completed Work (by inactive agents)

- **Light-Peril Mouse**: Identified Phase 2 expansion needed (17:40) - inactive
- **"Other Roberta"**: Completed Phase 3 generation script (19:00) - inactive
- **Cascade**: Created initial decorations - inactive

### Immediate Priorities

1. ✅ **Phase 2 Complete**: All 26 decorations added, ADR-compliant
2. **Phase 4 Integration**: Switch from runtime to build-time generation (CRITICAL - Next)
3. **Quality Gates**: Tests pass, but lint issues remain in other files

## Success Criteria

- ✅ Zero hardcoded API paths
- ✅ Build-time generation (script exists and works)
- ✅ Full decoration coverage (26/26)
- ✅ Integration complete (SDK-direct approach)
- ❌ Runtime generation removed (files still exist)
- ✅ All new files under 250 lines
- ✅ Handler calls SDK directly (no manual mapping)

## Key Files

### Compliant (Keep)

- `tool-decorations.ts` - ADR-compliant decorations
- `generate-enriched-tools.ts` - Build-time generation script
- `enriched-tools.ts` - Generated output

### Non-Compliant (Remove)

- `registry-metadata-*.ts` - Hardcoded paths
- `tool-generator.ts` - Runtime generation (after Phase 4)

## Testing Strategy

- TDD approach required
- Test behaviour, not implementation
- Pure functions only
- No type assertions

## ADR Compliance Summary

### Full Compliance Achieved

- **tool-decorations.ts & tool-decorations-data.ts**: 100% ADR-compliant
  - No API paths, only operationIds as keys
  - Purely decorative metadata
  - Runtime validation prevents path keys

### Partial Compliance

- **enriched-tools.ts**: Generated file is ADR-compliant
  - All data from SDK
  - Decorations applied at build time
  - But not yet used by server

### Non-Compliant (To Remove)

- **registry-metadata-\*.ts**: Contains hardcoded paths
- **tool-generator.ts**: Runtime generation violates ADR-031

## Next Actions

1. **Quality Gates**: Get all tests passing (SDK and MCP)
2. **E2E Tests**: Ensure E2E tests are green
3. **Final Review**: Validate complete ADR compliance
