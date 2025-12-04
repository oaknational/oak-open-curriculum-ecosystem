# ADR-062: Knowledge Graph SVG Visualization Architecture

## Status

Accepted

## Context

ADR-059 established the **schema-level knowledge graph** as a data structure capturing concept TYPE relationships. The graph data serves AI agents via tools and resources. However, there is also a need to **visualize** this graph for human understanding — in documentation, debugging, and the MCP widget.

### The Visualization Challenge

The knowledge graph contains approximately 28 concepts and 45 edges organized into 6 categories:

| Category  | Concepts | Examples                                  |
| --------- | -------- | ----------------------------------------- |
| Structure | 4        | Subject, Sequence, Unit, Lesson           |
| Content   | 6        | Quiz, Question, Answer, Asset, Transcript |
| Context   | 3        | Phase, Key Stage, Year Group              |
| Taxonomy  | 2        | Thread, Category                          |
| KS4       | 5-6      | Programme, Tier, Pathway, Exam Board      |
| Metadata  | 9        | Keyword, Misconception, Teacher Tip, etc. |

Visualizing this as a static SVG requires solving several problems:

1. **Layout composition** — Positioning 28 nodes and 45 edges in a readable layout
2. **Maintainability** — Making layout changes trivial without cascading coordinate updates
3. **Testability** — Ensuring visual components can be unit tested
4. **Interactivity** — Supporting hover states, tooltips, and relationship discovery
5. **Dual graphs** — Supporting both a simplified overview (18 concepts) and full graph (28 concepts)

### Previous Approach

The initial implementation used a monolithic SVG string with **absolute coordinates** for every element:

```typescript
// Fragile: moving Subject requires updating all connected edges
const svg = `
  <rect x="30" y="160" width="100" height="40" .../>
  <line x1="80" y1="180" x2="200" y2="180" .../>  <!-- Edge to Sequence -->
  <line x1="80" y1="180" x2="80" y2="100" .../>   <!-- Edge to Phase -->
`;
```

This approach had significant problems:

- **Cascading updates**: Moving one node required manually updating all connected edge coordinates
- **No reusability**: Each node was a unique code block with hardcoded positions
- **Difficult to test**: The monolithic string couldn't be unit tested at the component level
- **Error-prone**: Edge coordinates could drift from node centers due to manual calculation

## Decision

Implement a **component-based, pure function architecture** for SVG rendering with the following principles:

### 1. SVG Groups with Relative Positioning

Use nested `<g>` groups with `transform="translate(x, y)"` for relative positioning:

```typescript
// Section group positions all its children relative to section origin
<g id="core-structure-section" transform="translate(28, 145)">
  // Label at (0, 63) relative to section
  <g transform="translate(0, 63)">...</g>
  // Nodes at positions relative to section
  <g id="node-subject" transform="translate(2, 15)">...</g>
  <g id="node-sequence" transform="translate(172, 15)">...</g>
</g>
```

**Benefit**: Moving a section moves all its children. Layout changes are localized.

### 2. Pure Function Components

Each visual element is created by a pure function with typed configuration:

```typescript
interface NodeConfig {
  readonly id: string;
  readonly label: string;
  readonly width: number;
  readonly height: number;
  readonly position: Position;
  readonly cssClass: string;
  readonly brief?: string; // Tooltip definition
}

function createNode(config: NodeConfig): string {
  const { id, label, width, height, position, cssClass, brief } = config;
  const title = brief ? `<title>${label}: ${brief}</title>` : '';
  return `<g id="${id}" transform="translate(${x}, ${y})">
    ${title}
    <rect class="${cssClass}" width="${width}" height="${height}" rx="${rx}"/>
    <text class="label" x="${textX}" y="${textY}">${label}</text>
  </g>`;
}
```

**Functions provided**:

| Function                 | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `createNode`             | Lozenge-style concept node with optional tooltip |
| `createSectionLabel`     | Auto-sized label with centered text              |
| `createEdge`             | Line with outline and relationship tooltip       |
| `createSection`          | Composes label and nodes into positioned group   |
| `getNodeCenter`          | Calculates absolute center from section + node   |
| `findNodeInSections`     | Looks up node by ID across all sections          |
| `createEdgeBetweenNodes` | Creates edge with dynamic center calculation     |

### 3. Dynamic Edge Calculation

Edges are defined by node IDs, not hardcoded coordinates. The system calculates actual center positions at render time:

```typescript
// Edge definition by node IDs
const edge = createEdgeBetweenNodes(
  'node-subject', // from
  'node-sequence', // to
  'hasSequences', // relationship
  false, // isDashed
  OVERVIEW_SECTIONS, // section data for coordinate lookup
);

// Implementation calculates centers dynamically
function createEdgeBetweenNodes(fromId, toId, relationship, isDashed, sections) {
  const fromResult = findNodeInSections(fromId, sections);
  const toResult = findNodeInSections(toId, sections);

  const from = getNodeCenter(fromResult.sectionPosition, fromResult.node);
  const to = getNodeCenter(toResult.sectionPosition, toResult.node);

  return { from, to, relationship, isDashed };
}
```

**Benefit**: Moving a section automatically updates all edges connected to its nodes.

### 4. Separated Data and Rendering

Section configurations are separated from the rendering logic:

```text
svg-components.ts        → Pure rendering functions
svg-overview-sections.ts → Overview graph section data + edge factory
svg-full-sections.ts     → Full graph section data
svg-full-edges.ts        → Full graph edge definitions
svg-section-data.ts      → Re-exports for clean imports
concept-briefs.ts        → Tooltip definitions from ontology
knowledge-graph-renderer.ts → CSS styles, SVG composition, widget integration
```

### 5. CSS-Based Styling with Hover Effects

Styles are defined once and applied via CSS classes:

```css
/* Node type colors */
.node-core {
  fill: #287d3c;
  stroke: #1b3d1c;
  stroke-width: 2;
}
.node-context {
  fill: #5da0d9;
  stroke: #2d5a7b;
  stroke-width: 2;
}
/* ... etc */

/* Interactive hover state */
g[id^='node-']:hover rect {
  stroke: #fff;
  stroke-width: 4;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
  cursor: pointer;
}
```

### 6. Label Auto-Sizing with Centered Text

Section labels automatically size their background based on text length:

```typescript
const CHAR_WIDTH = 10;
const PADDING_X = 5;

function createSectionLabel(config: SectionLabelConfig): string {
  const width = PADDING_X + text.length * CHAR_WIDTH + PADDING_X;
  const textX = width / 2; // Center position
  return `<g transform="translate(${x}, ${y})">
    <rect width="${width}" height="20" rx="4"/>
    <text x="${textX}" style="text-anchor:middle">${text}</text>
  </g>`;
}
```

### 7. Tooltip Integration via Concept Briefs

Node tooltips pull definitions from the curriculum ontology:

```typescript
// concept-briefs.ts
const CONCEPT_BRIEFS = {
  'node-lesson': 'Teaching session with 8 standard components',
  'node-unit': 'Topic of study with ordered lessons',
  // ... all 28 concepts
};

// Node helper includes brief lookup
const n = (id, label, w, h, x, y, cssClass) => ({
  id,
  label,
  width: w,
  height: h,
  position: { x, y },
  cssClass,
  brief: getConceptBrief(id), // Auto-lookup from ontology
});
```

## Rationale

### Why Component-Based Architecture?

1. **Single Responsibility**: Each function does one thing well
2. **Testability**: Pure functions can be unit tested with deterministic inputs/outputs
3. **Composability**: Functions compose to build complex layouts from simple parts
4. **Type Safety**: TypeScript interfaces catch configuration errors at compile time

### Why Relative Positioning?

1. **Localized Changes**: Moving a section is a single coordinate change
2. **Hierarchical Layout**: Sections contain nodes, nodes contain text — position inheritance
3. **Maintainable**: No need to recalculate absolute coordinates when layout changes

### Why Dynamic Edge Calculation?

1. **Always Correct**: Edges always connect to actual node centers
2. **Refactoring Safe**: Moving nodes doesn't require edge coordinate updates
3. **Single Source of Truth**: Node dimensions defined once, used for edge calculation

### Why CSS for Styling?

1. **Separation of Concerns**: Visual styling separate from structure
2. **Hover States**: CSS handles interactive states without JavaScript
3. **Consistency**: Same class → same appearance across all nodes of that type

## Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────┐
│                     knowledge-graph-renderer.ts                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                       SVG_STYLES (CSS)                       │   │
│  │  .node-core, .node-context, .edge, hover effects, etc.      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────┐  ┌─────────────────────────────────────┐  │
│  │  buildOverviewSvg() │  │           buildFullSvg()            │  │
│  │  - 18 concepts      │  │  - 28 concepts                      │  │
│  │  - 17 edges         │  │  - 45 edges                         │  │
│  │                     │  │  - Legend                           │  │
│  └─────────────────────┘  └─────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ imports
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│ svg-components.ts │  │svg-section-data.ts│  │ concept-briefs.ts │
│                   │  │                   │  │                   │
│ createNode()      │  │ OVERVIEW_SECTIONS │  │ CONCEPT_BRIEFS    │
│ createEdge()      │  │ FULL_SECTIONS     │  │ getConceptBrief() │
│ createSection()   │  │ FULL_EDGES        │  │                   │
│ getNodeCenter()   │  │ LEGEND_CONFIG     │  │ (from ontology)   │
│ createEdgeBetween │  │                   │  │                   │
│   Nodes()         │  │                   │  │                   │
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

## Consequences

### Positive

- **Layout changes are trivial**: Move a section by changing one coordinate
- **Edges automatically follow**: Dynamic calculation keeps edges correct
- **Unit testable**: Pure functions with deterministic outputs
- **Type-safe**: Compile-time validation of node configs, section configs, edge definitions
- **Interactive**: Hover effects and tooltips enhance user understanding
- **Consistent styling**: CSS classes ensure visual consistency
- **Dual graph support**: Same architecture serves overview (18 concepts) and full (28 concepts) graphs

### Negative

- **More files**: Component architecture requires more module files than monolithic approach
- **Indirection**: Edge coordinates are calculated, not visible in source data
- **Character width approximation**: Label auto-sizing uses approximate character widths (10px per character) which may not be pixel-perfect for all fonts

### Mitigations

- **Clear module boundaries**: Each file has a single responsibility, making navigation straightforward
- **Unit tests document behavior**: Tests show expected coordinates for critical edges
- **Symmetric padding**: Centered text with `text-anchor:middle` provides visually balanced labels regardless of exact width calculation

## Testing Strategy

The component-based architecture enables comprehensive unit testing:

```typescript
describe('createNode', () => {
  it('includes tooltip title when brief is provided', () => {
    const svg = createNode({
      id: 'node-lesson',
      label: 'Lesson',
      brief: 'Teaching session with 8 standard components',
      // ... other config
    });
    expect(svg).toContain('<title>Lesson: Teaching session');
  });
});

describe('createEdgeBetweenNodes', () => {
  it('calculates correct center coordinates', () => {
    const edge = createEdgeBetweenNodes('node-subject', 'node-sequence', ...);
    // Coordinates are deterministic based on section/node positions
    expect(edge.from).toEqual({ x: 79, y: 180 });
    expect(edge.to).toEqual({ x: 265, y: 180 });
  });
});
```

## Visual Verification

During development, a preview server with file watching enables rapid visual iteration:

```bash
pnpm widget:preview
# http://localhost:4580/widget/knowledge-graph
```

Changes to component files trigger a browser refresh, enabling a visual feedback loop alongside unit tests.

## Related Decisions

- [ADR-059: Knowledge Graph for Agent Context](059-knowledge-graph-for-agent-context.md) — The data structure this visualization renders
- [ADR-058: Context Grounding for AI Agents](058-context-grounding-for-ai-agents.md) — The widget context where the graph appears
- [ADR-002: Pure Functions First](002-pure-functions-first.md) — The functional architecture pattern

## References

- [SVG Specification: The 'g' element](https://www.w3.org/TR/SVG2/struct.html#GElement)
- [SVG transform attribute](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform)
- [CSS Selectors in SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_and_CSS)
