# Implement Universal Widget Renderers

## Context

The Oak Curriculum MCP server exposes 26 tools to ChatGPT via the OpenAI Apps SDK. All tools output to a shared widget (`ui://widget/oak-json-viewer.html`), but currently only 3 data shapes have rich rendering - the rest fall back to raw JSON display.

This task implements **tool-name-routed renderers** with **generic renderer patterns** for all tool output types, providing a polished UX for educators using the MCP server in ChatGPT.

## Required Reading (Re-read at each phase)

Before starting ANY work, read and internalise these foundational documents:

1. **Rules**: `.agent/directives/principles.md`
   - TDD at ALL levels (unit, integration, E2E)
   - Pure functions first
   - No type shortcuts (`as`, `any`, `!`)
   - Fail fast with helpful errors

2. **Testing Strategy**: `.agent/directives/testing-strategy.md`
   - Write tests FIRST (RED → GREEN → REFACTOR)
   - Unit tests for pure functions (no IO, no mocks)
   - Integration tests for code units working together
   - E2E tests for running systems (Playwright)

3. **Schema-First**: `.agent/directives/schema-first-execution.md`
   - Generator-first mindset
   - Types flow from OpenAPI schema
   - No hand-authored type widening

4. **Implementation Plan**: `.agent/plans/sdk-and-mcp-enhancements/11-widget-universal-renderers-plan.md`
   - Full architecture and phase breakdown
   - Tool→renderer mappings
   - File structure
   - Acceptance criteria

## The Task

Implement the tool-name-routed widget renderer system as specified in Plan 11.

### Architecture Summary

```
render()
  → getToolName() → tool name from metadata/input
  → getRendererForTool(toolName) → renderer from TOOL_RENDERER_MAP
  → renderer.render(data) → HTML string
  → or → JSON fallback for unknown tools
```

**Key Design Decisions**:

1. **Tool name routing** (not shape detection): Use `toolName` from `window.openai.toolInput` or `toolResponseMetadata` to deterministically select renderers
2. **Generic renderers (~7 new)**: Reusable patterns that handle multiple tools
3. **Hand-authored mapping**: Tool→renderer map in widget code (presentation-layer concern)

### Generic Renderers

| Renderer                | Description                                    | Tools Handled |
| ----------------------- | ---------------------------------------------- | ------------- |
| `quizRenderer`          | Quiz questions with correct/distractor marking | 3 tools       |
| `entitySummaryRenderer` | Single entity detail (lesson/unit/subject)     | 3 tools       |
| `entityListRenderer`    | Generic list of curriculum entities            | ~12 tools     |
| `transcriptRenderer`    | Transcript with VTT                            | 1 tool        |
| `assetsRenderer`        | Downloadable assets                            | 4 tools       |
| `changelogRenderer`     | Version history                                | 2 tools       |
| `rateLimitRenderer`     | Rate limit status                              | 1 tool        |
| `helpContentRenderer`   | Server help (existing)                         | 1 tool        |
| `searchResultsRenderer` | Search results (existing)                      | 1 tool        |
| `fetchResultRenderer`   | Fetch results (existing)                       | 1 tool        |

### Tool→Renderer Mapping

```typescript
const TOOL_RENDERER_MAP = {
  // Quiz tools → quizRenderer
  'get-lessons-quiz': 'quiz',
  'get-key-stages-subject-questions': 'quiz',
  'get-sequences-questions': 'quiz',

  // Summary tools → entitySummaryRenderer
  'get-lessons-summary': 'entitySummary',
  'get-units-summary': 'entitySummary',
  'get-subject-detail': 'entitySummary',

  // List tools → entityListRenderer
  'get-key-stages': 'entityList',
  'get-subjects': 'entityList',
  'get-key-stages-subject-lessons': 'entityList',
  'get-key-stages-subject-units': 'entityList',
  'get-sequences-units': 'entityList',
  'get-threads': 'entityList',
  'get-threads-units': 'entityList',
  // ... etc

  // Transcript → transcriptRenderer
  'get-lessons-transcript': 'transcript',

  // Assets → assetsRenderer
  'get-lessons-assets': 'assets',
  'get-key-stages-subject-assets': 'assets',
  'get-sequences-assets': 'assets',

  // Changelog → changelogRenderer
  'get-changelog': 'changelog',
  'get-changelog-latest': 'changelog',

  // Rate limit → rateLimitRenderer
  'get-rate-limit': 'rateLimit',
} as const;
```

## Implementation Phases

### Phase 1: Foundation (TDD)

1. **Create registry and tool mapping**
   - File: `src/widget-renderer-registry.ts`
   - Write unit tests FIRST for `getRendererForTool`
   - Implement the lookup function
   - Define renderer interface

2. **Migrate existing renderers**
   - Move `renderHelpContent`, `renderSearchResults`, `renderFetchResult` to registry format
   - Write tests that preserve existing behaviour
   - Update `widget-script.ts` to use registry

### Phase 2: Core Renderers (TDD)

For each renderer, follow RED → GREEN → REFACTOR:

1. `quizRenderer` - Most complex, highest UX value
2. `entitySummaryRenderer` - Generic single-entity detail
3. `entityListRenderer` - Generic list handler (workhorse)

### Phase 3: Auxiliary Renderers (TDD)

Same TDD cycle for:

- `transcriptRenderer`
- `assetsRenderer`
- `changelogRenderer`
- `rateLimitRenderer`

### Phase 4: Integration

1. Update `widget-script.ts` to use full registry
2. Add Playwright E2E tests for each renderer
3. Verify all quality gates pass

## Test Data Sources

Use stub data from:

```
packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/stubs/tools/
```

These are generated from the OpenAPI schema and represent real API responses.

## File Locations

```
apps/oak-curriculum-mcp-streamable-http/src/
├── widget-renderer-registry.ts           # Registry + tool mapping
├── widget-renderer-registry.unit.test.ts # Unit tests
├── widget-renderers/                      # NEW directory
│   ├── index.ts                          # Exports all renderers
│   ├── quiz-renderer.ts
│   ├── entity-summary-renderer.ts
│   ├── entity-list-renderer.ts
│   ├── transcript-renderer.ts
│   ├── assets-renderer.ts
│   ├── changelog-renderer.ts
│   ├── rate-limit-renderer.ts
│   └── helpers.ts                        # Shared HTML helpers
├── widget-renderers.ts                   # MODIFY: Move to registry
├── widget-script.ts                      # MODIFY: Use registry
└── widget-styles.ts                      # MODIFY: Add styles

tests/widget/
├── fixtures.ts                           # MODIFY: Add fixtures
└── widget-renderers.spec.ts              # NEW: Playwright tests
```

## Quality Gates

After each phase, verify:

```bash
# Unit + Integration tests
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test -- --run

# Playwright E2E
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:ui

# Lint
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint

# Types
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check
```

## Key Constraints

1. **TDD is mandatory** - No production code without failing tests first
2. **Pure functions** - `render()` must be pure (no IO, no side effects)
3. **No type shortcuts** - Use proper type guards, not `as` or `any`
4. **Preserve existing behaviour** - Migration must not break current renderers
5. **Accessibility** - All renderers must pass axe-core WCAG checks
6. **Tool name routing** - No duck typing / shape detection

## Success Criteria

- [ ] All 26 tool outputs render with appropriate formatting
- [ ] Quiz questions show correct/incorrect answers clearly
- [ ] Entity summaries show key learning points and keywords
- [ ] Entity lists render as cards with title, metadata, links
- [ ] All unit tests pass (100% of renderers tested)
- [ ] All Playwright tests pass
- [ ] No accessibility violations
- [ ] Lint and type-check clean

## Starting Point

Begin with Phase 1.1:

1. Read the existing widget code:
   - `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`
   - `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers.ts`

2. Create the registry with unit tests FIRST:
   - Write test file `widget-renderer-registry.unit.test.ts`
   - Write tests for `getRendererForTool` function
   - Run tests - they should FAIL (RED)
   - Implement `getRendererForTool` - tests should PASS (GREEN)
   - Refactor if needed

3. Then migrate existing renderers into the registry format with behaviour tests.

Remember: **The First Question always applies** - Could it be simpler without compromising quality?
