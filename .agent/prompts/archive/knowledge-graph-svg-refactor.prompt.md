# Knowledge Graph SVG Refactor Prompt

## Foundation Documents

Before starting work, read and commit to these foundation documents:

- `.agent/directives/rules.md` - Core rules and architectural principles
- `.agent/directives/testing-strategy.md` - TDD at all levels
- `.agent/directives/schema-first-execution.md` - Schema-first approach

All work MUST align with these documents. Re-read them periodically during implementation.

## Context

The Oak Curriculum MCP server includes a widget that renders tool outputs in ChatGPT. The `get-knowledge-graph` tool displays an SVG visualization of curriculum concept relationships.

### Current State

The SVG implementation in `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/knowledge-graph-renderer.ts` has architectural issues:

1. **Flat absolute coordinates** - All elements use absolute x/y values
2. **Difficult to maintain** - Moving one element requires recalculating many coordinates
3. **Visual issues** - Label backgrounds don't fit text, edges don't connect properly to node centers

### Reference Screenshot

The current state can be viewed by running:

```bash
cd apps/oak-curriculum-mcp-streamable-http
npx tsx scripts/widget-preview-server.ts
```

Then navigate to: http://localhost:4580/widget/knowledge-graph

## Objective

Refactor the SVG to use a **component-based, pure function architecture** that:

1. Makes layout changes trivial (move section by changing one `translate()`)
2. Ensures edges connect to actual node centers
3. Auto-sizes label backgrounds to fit text
4. Is maintainable, testable, and understandable

---

## Plan (from cursor-plan://3a7f16a7-d49a-4510-b75e-2b41da563bf7)

### Problem

The current SVG uses flat absolute coordinates for all elements, making it extremely difficult to:

- Move concept groups without recalculating dozens of coordinates
- Ensure edges connect properly to node centers
- Size label backgrounds to fit their text
- Maintain visual consistency

### Solution Architecture

#### 1. Pure Function Component System

Create pure functions that compose to build the SVG. Each function returns an SVG string and is independently testable.

```typescript
/**
 * Position type for relative positioning within parent groups.
 */
interface Position {
  readonly x: number;
  readonly y: number;
}

/**
 * Node configuration for lozenge-style concept nodes.
 */
interface NodeConfig {
  readonly id: string;
  readonly label: string;
  readonly width: number;
  readonly height: number;
  readonly position: Position;
  readonly cssClass: string;
}

/**
 * Creates an SVG node (lozenge with centered text).
 * Pure function - no side effects, easily testable.
 */
function createNode(config: NodeConfig): string {
  const { id, label, width, height, position, cssClass } = config;
  const textX = width / 2;
  const textY = height / 2 + 5; // Vertical centering adjustment
  return `
    <g id="${id}" transform="translate(${position.x}, ${position.y})">
      <rect class="${cssClass}" width="${width}" height="${height}" rx="${height / 2}"/>
      <text class="label" x="${textX}" y="${textY}">${label}</text>
    </g>`;
}

/**
 * Section label configuration with auto-calculated width.
 */
interface SectionLabelConfig {
  readonly text: string;
  readonly position: Position;
}

/**
 * Creates a section label with auto-sized black background.
 * Width calculated from text length.
 */
function createSectionLabel(config: SectionLabelConfig): string {
  const { text, position } = config;
  const charWidth = 9; // Approximate width per uppercase character
  const padding = 10;
  const width = text.length * charWidth + padding;
  return `
    <g transform="translate(${position.x}, ${position.y})">
      <rect class="group-label-bg" width="${width}" height="20" rx="4"/>
      <text class="group-label" x="5" y="15">${text}</text>
    </g>`;
}

/**
 * Edge configuration for connecting nodes.
 */
interface EdgeConfig {
  readonly from: Position;
  readonly to: Position;
  readonly relationship: string;
  readonly isDashed: boolean;
}

/**
 * Creates an edge between two points with relationship tooltip.
 */
function createEdge(config: EdgeConfig): string {
  const { from, to, relationship, isDashed } = config;
  const outlineClass = isDashed ? 'edge-dashed-outline' : 'edge-outline';
  const lineClass = isDashed ? 'edge-dashed' : 'edge';
  return `
    <g>
      <title>${relationship}</title>
      <line class="${outlineClass}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>
      <line class="${lineClass}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>
    </g>`;
}

/**
 * Section configuration containing multiple nodes.
 */
interface SectionConfig {
  readonly id: string;
  readonly label: string;
  readonly position: Position;
  readonly labelPosition: Position;
  readonly nodes: readonly NodeConfig[];
}

/**
 * Creates a complete section with label and nodes.
 * Composes createSectionLabel and createNode.
 */
function createSection(config: SectionConfig): string {
  const { id, label, position, labelPosition, nodes } = config;
  const labelSvg = createSectionLabel({ text: label, position: labelPosition });
  const nodesSvg = nodes.map(createNode).join('\n');
  return `
    <g id="${id}" transform="translate(${position.x}, ${position.y})">
      ${labelSvg}
      ${nodesSvg}
    </g>`;
}
```

#### 2. SVG Group Structure

Organize by **concept/section** rather than by row:

```svg
<g id="context-section" transform="translate(20, 40)">
  <!-- Section label with auto-sized background -->
  <g class="section-label">
    <rect class="group-label-bg" width="68" height="20" rx="4"/>
    <text class="group-label" x="5" y="15">Context</text>
  </g>
  <!-- Nodes use relative positions within section -->
  <g id="node-phase" transform="translate(0, 25)">
    <rect class="node-context" width="100" height="35" rx="17"/>
    <text class="label" x="50" y="22">Phase</text>
  </g>
  <g id="node-keystage" transform="translate(175, 25)">
    <!-- ... -->
  </g>
</g>
```

#### 3. Node Component Pattern

Each node is self-contained with centered text:

- `<g>` wrapper with `transform="translate(x, y)"` for position
- `<rect>` for the lozenge (width/height define size)
- `<text>` with `x` at half-width for centering

#### 4. Edge Calculation

Edges connect node centers. With grouped structure:

- Node center = section transform + node transform + (width/2, height/2)
- Only need to update section `translate()` to move entire sections

#### 5. Label Background Auto-sizing

Use a consistent formula: `width = text.length * charWidth + padding`

### Files to Modify

1. `apps/oak-curriculum-mcp-streamable-http/scripts/widget-preview-server.ts` - Add file watching with chokidar
2. `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/knowledge-graph-renderer.ts` - Restructure SVGs using component functions

### Implementation Steps

#### Step 1: Add File Watching to Preview Server

Use chokidar to watch `src/` directory and reload on changes. This enables a visual feedback loop during iteration.

#### Step 2: Create Component Functions with TDD

Using TDD (Red → Green → Refactor):

1. Write unit tests for `createNode()` - test SVG output structure
2. Write unit tests for `createSectionLabel()` - test auto-width calculation
3. Write unit tests for `createEdge()` - test line coordinates and tooltip
4. Write unit tests for `createSection()` - test composition

#### Step 3: Define Section Data Structures

Create readonly data structures for each section:

- `CONTEXT_SECTION` - Phase, Key Stage, Year Group
- `CORE_STRUCTURE_SECTION` - Subject, Sequence, Unit, Lesson
- `TAXONOMY_SECTION` - Thread, Category
- `CONTENT_SECTION` - Quiz, Asset, Transcript, Question, Answer
- `KS4_SECTION` - Programme, Tier, Pathway, Exam Board, Exam Subject
- `METADATA_SECTION` - All metadata nodes

#### Step 4: Rebuild Overview SVG

Compose section functions to build overview:

```typescript
function buildOverviewSvg(): string {
  const sections = [
    createSection(CONTEXT_SECTION),
    createSection(CORE_STRUCTURE_SECTION),
    createSection(TAXONOMY_SECTION),
    createSection(CONTENT_SECTION),
    createSection(KS4_SECTION),
  ].join('\n');

  const edges = OVERVIEW_EDGES.map(createEdge).join('\n');

  return `<svg viewBox="0 0 960 620">${SVG_STYLES}${edges}${sections}</svg>`;
}
```

#### Step 5: Rebuild Full SVG

Same structure but with all 28 nodes, 45 edges, plus Metadata section and Legend.

#### Step 6: Visual Verification

Screenshot after each section to ensure parity with reference.

### Remaining Visual Issues to Fix

1. Label backgrounds sized to contain text (use calculated widths)
2. Edges connecting to proper node centers (use center calculations)
3. Metadata spacing (stagger vertically to avoid overlaps)
4. Legend spacing (position labels relative to swatches)

---

## Completed Work (for context)

The following has already been completed in previous sessions:

- [x] Enhance TSDoc in widget-cta.ts with extensive documentation
- [x] Update app README to document CTA feature
- [x] Create ADR-061 for Widget CTA System
- [x] Update CTA button styles for theme-adaptive background
- [x] Remove CTA hide-on-click, restore button state after send
- [x] Add 5-minute cooldown via widgetState persistence (later removed)
- [x] Create knowledge graph SVG renderer with CTA
- [x] Register knowledgeGraph renderer in registry and widget script
- [x] Add unit and integration tests for new functionality
- [x] Add 'Oak Knowledge Loaded' success state that shows for 2 seconds
- [x] Remove cooldown feature - widgetState doesn't persist between widgets
- [x] Make SVG lines bold white with black outline
- [x] Remove Graph Statistics section from knowledge graph renderer
- [x] Make Visualize CTA more prominent with accent background
- [x] Fix CTA init - call after render instead of window.load
- [x] Update tests for changed behavior
- [x] Remove visualization CTA button and initKnowledgeGraphCta function
- [x] Add 'Knowledge graph loaded...' text above SVG
- [x] Wrap SVG in details/summary for collapsed view
- [x] Improve SVG visual design to better represent graph
- [x] Add understoodLabel to CTA config and registry
- [x] Implement 10-second timer for Oak Understood state
- [x] Enhance :active CSS state for visible press feedback

---

## Remaining To-dos

- [ ] Add chokidar file watching to preview server for auto-reload
- [ ] Create pure function components with TDD (createNode, createSectionLabel, createEdge, createSection)
- [ ] Define section data structures (CONTEXT_SECTION, CORE_STRUCTURE_SECTION, etc.)
- [ ] Rebuild overview SVG using component composition
- [ ] Rebuild full SVG using component composition
- [ ] Screenshot and verify visual parity, fix any remaining issues

---

## Key Principles

1. **TDD** - Write tests FIRST for each component function
2. **Pure functions** - All SVG generation through pure, composable functions
3. **Visual feedback loop** - Always verify changes with screenshots
4. **Incremental changes** - Make one change, verify, then next
5. **Group by concept** - Not by row or element type
6. **Relative coordinates** - Within groups, use relative positioning
7. **Auto-calculate** - Don't hardcode values that can be computed

## Quality Gates

After completing work, run all quality gates:

```bash
# From repo root, one at a time
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
```

All gates must pass before considering work complete.
