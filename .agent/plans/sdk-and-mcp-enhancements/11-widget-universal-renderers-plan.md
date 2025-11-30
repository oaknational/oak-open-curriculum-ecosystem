# Plan 11: Universal Widget Renderers for All Tool Outputs

**Created**: 2025-11-30  
**Updated**: 2025-11-30  
**Status**: 📋 PLANNED  
**Priority**: MEDIUM  
**Estimated Duration**: 6-8 hours  
**Focus**: Tool-name-routed rendering with generic renderers for all MCP tool outputs in the ChatGPT widget

---

## Overview

Enhance the Oak JSON Viewer widget to provide rich, type-specific rendering for all 26 tool outputs instead of falling back to raw JSON. Uses **tool name routing** with **generic renderers** that handle multiple tools with similar output patterns.

### Goals

1. **Tool name routing**: Use `toolName` from metadata to deterministically select renderers (no duck typing)
2. **Generic renderers**: Fewer, reusable renderer patterns (~7 new) that handle multiple tools
3. **Rich rendering**: Provide formatted, human-readable output for all curriculum entities
4. **Graceful fallback**: Unknown tools still render as formatted JSON
5. **TDD throughout**: All renderers developed test-first

### Key Design Decisions

1. **Tool name routing** (not shape detection): Deterministic, no property presence checking
2. **Generic renderers**: `entityListRenderer` handles lessons, units, subjects, threads, etc.
3. **Hand-authored mapping**: Tool→renderer map in widget code (presentation-layer concern, not schema data)

### Foundational Commitment

Before beginning any task, re-read and recommit to:

- `.agent/directives-and-memory/rules.md` - TDD, schema-first, simplicity
- `.agent/directives-and-memory/testing-strategy.md` - Test types, TDD at all levels
- `.agent/directives-and-memory/schema-first-execution.md` - Generator-first mindset

---

## Architecture

### Current Widget Rendering Flow

```
render()
  → getFullResults() → data object
  → if (help shape) → renderHelpContent()
  → else if (search shape) → renderSearchResults()
  → else if (fetch shape) → renderFetchResult()
  → else → JSON fallback
```

### Target Architecture (Tool Name Routing)

```
render()
  → getToolName() → tool name from metadata/input
  → getRendererForTool(toolName, TOOL_RENDERER_MAP) → renderer
  → if (found) → renderer.render(data)
  → else → JSON fallback
```

### Registry Structure

```typescript
/**
 * Tool name → renderer ID mapping.
 *
 * Presentation-layer concern - maps each tool to its renderer.
 */
const TOOL_RENDERER_MAP = {
  'get-lessons-quiz': 'quiz',
  'get-key-stages-subject-questions': 'quiz',
  'get-sequences-questions': 'quiz',
  'get-lessons-summary': 'entitySummary',
  'get-units-summary': 'entitySummary',
  'get-subject-detail': 'entitySummary',
  'get-key-stages': 'entityList',
  'get-subjects': 'entityList',
  // ... etc
} as const;

/**
 * Renderer implementations keyed by ID.
 */
const RENDERERS = {
  quiz: quizRenderer,
  entitySummary: entitySummaryRenderer,
  entityList: entityListRenderer,
  transcript: transcriptRenderer,
  assets: assetsRenderer,
  changelog: changelogRenderer,
  rateLimit: rateLimitRenderer,
  help: helpContentRenderer,
  search: searchResultsRenderer,
  fetch: fetchResultRenderer,
} as const;

/**
 * Gets the renderer for a given tool name.
 */
function getRendererForTool(toolName: string): WidgetRenderer | undefined {
  const rendererId = TOOL_RENDERER_MAP[toolName];
  return rendererId ? RENDERERS[rendererId] : undefined;
}
```

---

## Renderer Inventory

### Generic Renderers (~7 new + 3 existing)

| Renderer                | Description                                    | Tools Handled                                                                                       |
| ----------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `quizRenderer`          | Quiz questions with correct/distractor marking | get-lessons-quiz, get-key-stages-subject-questions, get-sequences-questions                         |
| `entitySummaryRenderer` | Single entity detail view                      | get-lessons-summary, get-units-summary, get-subject-detail                                          |
| `entityListRenderer`    | Generic list of curriculum entities            | get-key-stages, get-subjects, get-_-lessons, get-_-units, get-threads, etc. (~12 tools)             |
| `transcriptRenderer`    | Transcript with VTT                            | get-lessons-transcript                                                                              |
| `assetsRenderer`        | Downloadable assets                            | get-lessons-assets, get-key-stages-subject-assets, get-sequences-assets, get-lessons-assets-by-type |
| `changelogRenderer`     | Version history                                | get-changelog, get-changelog-latest                                                                 |
| `rateLimitRenderer`     | Rate limit status                              | get-rate-limit                                                                                      |
| `helpContentRenderer`   | Server help (existing)                         | get-help                                                                                            |
| `searchResultsRenderer` | Search results (existing)                      | search                                                                                              |
| `fetchResultRenderer`   | Fetch results (existing)                       | fetch                                                                                               |

### Tool→Renderer Mapping

```typescript
const TOOL_RENDERER_MAP = {
  // Quiz tools
  'get-lessons-quiz': 'quiz',
  'get-key-stages-subject-questions': 'quiz',
  'get-sequences-questions': 'quiz',

  // Entity summary tools
  'get-lessons-summary': 'entitySummary',
  'get-units-summary': 'entitySummary',
  'get-subject-detail': 'entitySummary',

  // Entity list tools (the workhorse)
  'get-key-stages': 'entityList',
  'get-subjects': 'entityList',
  'get-subjects-key-stages': 'entityList',
  'get-subjects-years': 'entityList',
  'get-subjects-sequences': 'entityList',
  'get-key-stages-subject-lessons': 'entityList',
  'get-key-stages-subject-units': 'entityList',
  'get-sequences-units': 'entityList',
  'get-threads': 'entityList',
  'get-threads-units': 'entityList',
  'get-search-lessons': 'entityList',
  'get-search-transcripts': 'entityList',

  // Transcript
  'get-lessons-transcript': 'transcript',

  // Assets
  'get-lessons-assets': 'assets',
  'get-lessons-assets-by-type': 'assets',
  'get-key-stages-subject-assets': 'assets',
  'get-sequences-assets': 'assets',

  // Changelog
  'get-changelog': 'changelog',
  'get-changelog-latest': 'changelog',

  // Rate limit
  'get-rate-limit': 'rateLimit',

  // Existing (help, search, fetch handled by existing renderers)
  'get-help': 'help',
} as const;
```

---

## Implementation Plan

### Phase 1: Foundation (1-2 hours)

#### 1.1: Create Registry and Tool Mapping

**File**: `apps/oak-curriculum-mcp-streamable-http/src/widget-renderer-registry.ts` (new)

```typescript
/**
 * Widget renderer registry with tool name routing.
 *
 * Uses tool name from metadata to select appropriate renderer.
 * No shape detection / duck typing.
 */

interface WidgetRenderer {
  readonly id: string;
  render(data: unknown): string;
}

const TOOL_RENDERER_MAP = { ... } as const;

function getRendererForTool(toolName: string): WidgetRenderer | undefined
```

**TDD Steps**:

1. RED: Write tests for `getRendererForTool` with mock renderers
2. GREEN: Implement lookup function
3. REFACTOR: Ensure types are correct

#### 1.2: Migrate Existing Renderers to Registry

Move existing renderers from inline code to registry format:

- `helpContentRenderer`
- `searchResultsRenderer`
- `fetchResultRenderer`

**TDD Steps**:

1. RED: Write tests that existing behaviour is preserved
2. GREEN: Migrate to registry structure
3. REFACTOR: Remove duplication

---

### Phase 2: Core Renderers (2-3 hours)

#### 2.1: Quiz Renderer

**Handles**: get-lessons-quiz, get-key-stages-subject-questions, get-sequences-questions

**Rendering**:

- Section for Starter Quiz with question count badge
- Section for Exit Quiz with question count badge
- Each question shows: question text, answer options with correct/distractor marking
- Colour coding: correct answers in green, distractors in neutral

**TDD Steps**:

1. RED: Write test with `stubGetLessonsQuizResponse` data
2. GREEN: Implement `quizRenderer`
3. REFACTOR: Extract reusable `renderQuestion()` helper

#### 2.2: Entity Summary Renderer

**Handles**: get-lessons-summary, get-units-summary, get-subject-detail

**Rendering**:

- Detect title property (lessonTitle, unitTitle, subjectTitle)
- Render key learning points, keywords, prior knowledge
- Handle optional sections (misconceptions, teacher tips, national curriculum)

**TDD Steps**:

1. RED: Write test with `stubGetLessonsSummaryResponse` data
2. GREEN: Implement `entitySummaryRenderer`
3. REFACTOR: Extract common patterns

#### 2.3: Entity List Renderer (Workhorse)

**Handles**: ~12 tools returning arrays of curriculum entities

**Rendering**:

- Count badge
- Cards with title (detect: lessonTitle, unitTitle, subjectTitle, threadTitle, slug, title)
- Metadata row (subject, key stage, year)
- Links to Oak website where canonicalUrl available

**TDD Steps**:

1. RED: Write test with `stubGetKeyStagesResponse` data
2. GREEN: Implement `entityListRenderer`
3. REFACTOR: Extract `renderEntityCard()` helper

---

### Phase 3: Auxiliary Renderers (1-2 hours)

#### 3.1: Transcript Renderer

**Handles**: get-lessons-transcript

**Rendering**:

- Transcript text in readable format
- Collapsible VTT section

#### 3.2: Assets Renderer

**Handles**: get-lessons-assets, get-lessons-assets-by-type, get-key-stages-subject-assets, get-sequences-assets

**Rendering**:

- Asset type icons
- Download links
- Attribution section

#### 3.3: Changelog Renderer

**Handles**: get-changelog, get-changelog-latest

**Rendering**:

- Version/date header with badge
- Changes list

#### 3.4: Rate Limit Renderer

**Handles**: get-rate-limit

**Rendering**:

- Progress bar visualisation
- Remaining/limit counts
- Reset time

---

### Phase 4: Integration (1 hour)

#### 4.1: Update Widget Script

**File**: `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`

Replace inline render logic with registry lookup:

```typescript
function render() {
  updateToolName();
  updateActions();
  const fullData = getFullResults();
  const toolName = getToolName(); // from input/metadata

  const renderer = toolName ? getRendererForTool(toolName) : undefined;
  if (renderer) {
    c.innerHTML = renderer.render(fullData);
  } else if (Object.keys(fullData).length > 0) {
    c.innerHTML = '<pre>' + esc(JSON.stringify(fullData, null, 2)) + '</pre>';
  } else {
    c.innerHTML = '<div class="empty">Loading...</div>';
  }

  restoreScrollPosition();
}

function getToolName(): string | undefined {
  const input = window.openai?.toolInput;
  const meta = window.openai?.toolResponseMetadata;
  return meta?.toolName || input?.toolName;
}
```

#### 4.2: Update Playwright Tests

Add tests for each new renderer using stub data fixtures.

---

## Testing Strategy

### Unit Tests (Pure Functions)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/widget-renderer-registry.unit.test.ts`

```typescript
describe('getRendererForTool', () => {
  it('returns quiz renderer for get-lessons-quiz', () => { ... });
  it('returns entityList renderer for get-key-stages', () => { ... });
  it('returns undefined for unknown tool', () => { ... });
});

describe('quizRenderer', () => {
  describe('render', () => {
    it('renders starter quiz section', () => { ... });
    it('renders exit quiz section', () => { ... });
    it('marks correct answers with green styling', () => { ... });
    it('marks distractors with neutral styling', () => { ... });
  });
});

describe('entityListRenderer', () => {
  describe('render', () => {
    it('renders count badge', () => { ... });
    it('renders cards with detected title property', () => { ... });
    it('renders metadata row', () => { ... });
  });
});
```

### Integration Tests (Registry with Real Renderers)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/widget-renderer-registry.integration.test.ts`

```typescript
describe('renderer registry integration', () => {
  it('routes get-lessons-quiz to quizRenderer and renders correctly', () => { ... });
  it('routes get-lessons-summary to entitySummaryRenderer and renders correctly', () => { ... });
  it('routes get-key-stages to entityListRenderer and renders correctly', () => { ... });
});
```

### E2E Tests (Playwright)

**File**: `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-renderers.spec.ts`

```typescript
describe('Widget renderer integration', () => {
  test('renders quiz data with question cards', async ({ page }) => {
    await injectToolOutput(page, { toolName: 'get-lessons-quiz', ...QUIZ_FIXTURE });
    await page.goto(`${serverUrl}/widget`);
    await expect(page.getByText('Starter Quiz')).toBeVisible();
    await expect(page.getByText('Exit Quiz')).toBeVisible();
  });

  test('renders entity list with cards', async ({ page }) => {
    await injectToolOutput(page, { toolName: 'get-key-stages', ...KEY_STAGES_FIXTURE });
    await page.goto(`${serverUrl}/widget`);
    await expect(page.getByText('Key Stage 1')).toBeVisible();
  });
});
```

---

## File Structure

```
apps/oak-curriculum-mcp-streamable-http/src/
├── widget-renderer-registry.ts           # NEW: Registry + tool mapping
├── widget-renderer-registry.unit.test.ts # NEW: Unit tests
├── widget-renderers/                      # NEW: Renderer implementations
│   ├── index.ts                          # Exports all renderers
│   ├── quiz-renderer.ts                  # Quiz questions
│   ├── entity-summary-renderer.ts        # Lesson/unit/subject details
│   ├── entity-list-renderer.ts           # Generic entity lists (workhorse)
│   ├── transcript-renderer.ts            # Lesson transcript
│   ├── assets-renderer.ts                # Download assets
│   ├── changelog-renderer.ts             # API changelog
│   ├── rate-limit-renderer.ts            # Rate limit status
│   └── helpers.ts                        # Shared rendering helpers
├── widget-renderers.ts                   # EXISTING: Move to registry
├── widget-script.ts                      # MODIFY: Use registry
└── widget-styles.ts                      # MODIFY: Add styles for new renderers

tests/widget/
├── fixtures.ts                           # MODIFY: Add fixtures for each renderer
└── widget-renderers.spec.ts              # NEW: Playwright tests
```

---

## Acceptance Criteria

### Functional

- [ ] All 26 tool outputs render with appropriate formatting
- [ ] Quiz questions show correct/incorrect answers clearly
- [ ] Entity summaries show key learning points and keywords
- [ ] Entity lists show cards with title, metadata, links
- [ ] Assets show download links
- [ ] Transcripts are readable
- [ ] Unknown tools fall back to JSON

### Quality

- [ ] All unit tests pass (RED → GREEN → REFACTOR for each renderer)
- [ ] All integration tests pass
- [ ] All Playwright tests pass
- [ ] Lint clean
- [ ] Type-check clean
- [ ] No accessibility violations (axe-core)

### Performance

- [ ] Widget renders within 100ms for typical data
- [ ] No jank when switching between renderers

---

## Verification Commands

```bash
# Unit tests
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test -- --run

# Playwright tests
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:ui

# Full validation
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http lint
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http type-check
```

---

## Dependencies

- Existing widget infrastructure (`aggregated-tool-widget.ts`, `widget-script.ts`)
- Stub data from generated tools (for test fixtures)
- Playwright for E2E testing
- axe-core for accessibility

---

## Risks and Mitigations

| Risk                                | Mitigation                                        |
| ----------------------------------- | ------------------------------------------------- |
| Tool name not available in metadata | Fall back to shape detection or JSON; log warning |
| Breaking existing renderers         | Migrate incrementally with behaviour tests        |
| Widget performance                  | Keep renderers simple; profile if needed          |
| Accessibility regressions           | axe-core tests for all renderers                  |

---

## Future Enhancements

1. **Collapsible sections**: Allow long content to be expanded/collapsed
2. **Copy to clipboard**: Add copy buttons for code/IDs
3. **Deep linking**: Link to related tools from rendered content
4. **Theming**: Support light/dark mode per renderer
5. **Interactive elements**: Expand quiz answers, toggle transcript timestamps

---

## References

- [Widget Script](../../apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts)
- [Widget Renderers](../../apps/oak-curriculum-mcp-streamable-http/src/widget-renderers.ts)
- [Stub Data](../../packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/stubs/tools/)
- [Testing Strategy](../../.agent/directives-and-memory/testing-strategy.md)
- [Rules](../../.agent/directives-and-memory/rules.md)
