# Oak Widget SVG Implementation Analysis

> **Companion to**: [world-bank-graphing-demo-svg-patterns.md](./world-bank-graphing-demo-svg-patterns.md)
> **ADR Reference**: [ADR-062: Knowledge Graph SVG Visualization Architecture](../../docs/architecture/architectural-decisions/062-knowledge-graph-svg-visualization.md)
> **Purpose**: Deep dive into the current Oak MCP knowledge graph widget implementation, comparing patterns with the world-bank-graphing-demo reference.

## Overview

The Oak knowledge graph widget renders curriculum concept relationships as static SVG. Unlike the D3.js-based world-bank-graphing-demo (which is dynamic/interactive), the Oak implementation generates **static SVG strings at build time** that are embedded in the widget JavaScript.

**Key Architectural Choice**: Pre-rendered SVG rather than runtime D3 generation.

| Aspect        | World Bank Demo          | Oak Widget               |
| ------------- | ------------------------ | ------------------------ |
| Library       | D3.js v3                 | None (raw SVG)           |
| Rendering     | Runtime (browser)        | Build time (Node.js)     |
| Interactivity | JS events                | CSS only                 |
| Positioning   | D3 scales + data binding | Pure functions + config  |
| State         | Dynamic data updates     | Static snapshot          |
| Output        | DOM manipulation         | String template literals |

---

## Architecture: Pure Function Component System

### File Organisation

```
widget-renderers/
├── knowledge-graph-renderer.ts    # Main renderer (CSS, SVG composition)
├── svg-components.ts              # Pure rendering functions
├── svg-overview-sections.ts       # 18-concept graph config + edges
├── svg-full-sections.ts           # 28-concept graph config + legend
├── svg-full-edges.ts              # Full graph edge definitions
├── svg-section-data.ts            # Re-exports for clean imports
└── concept-briefs.ts              # Tooltip definitions
```

**Pattern**: Separation of **rendering logic** (svg-components.ts) from **data definitions** (svg-\*-sections.ts).

### Type-Driven Configuration

Every SVG element is configured via typed interfaces:

```typescript
interface Position {
  readonly x: number;
  readonly y: number;
}

interface NodeConfig {
  readonly id: string;
  readonly label: string;
  readonly width: number;
  readonly height: number;
  readonly position: Position;
  readonly cssClass: string;
  readonly brief?: string; // Tooltip
}

interface SectionConfig {
  readonly id: string;
  readonly label: string;
  readonly position: Position;
  readonly labelPosition: Position;
  readonly nodes: readonly NodeConfig[];
}

interface EdgeConfig {
  readonly from: Position;
  readonly to: Position;
  readonly relationship: string;
  readonly isDashed: boolean;
}
```

**Key insight**: All configs use `readonly` and `as const` for immutability and literal type preservation.

---

## SVG Structure: Nested Groups with Transform Positioning

### Pattern: Relative Coordinate System

Like the world-bank-graphing-demo, Oak uses **nested `<g>` groups with `transform="translate(x, y)"`** for hierarchical positioning:

```typescript
// Section contains label + nodes
function createSection(config: SectionConfig): string {
  const { id, label, position, labelPosition, nodes } = config;
  const labelSvg = createSectionLabel({ text: label, position: labelPosition });
  const nodesSvg = nodes.map(createNode).join('');
  return `<g id="${id}" transform="translate(${position.x}, ${position.y})">
    ${labelSvg}${nodesSvg}
  </g>`;
}
```

**Benefits**:

- Moving a section moves all its children
- Nodes are positioned relative to section origin
- Section position changes don't require node coordinate updates

### SVG Output Structure

```xml
<svg viewBox="0 0 960 620">
  <style>/* CSS styles */</style>

  <!-- Edges drawn first (behind nodes) -->
  <g><title>hasSequences</title>
    <line class="edge-outline" x1="..." y1="..." x2="..." y2="..."/>
    <line class="edge" x1="..." y1="..." x2="..." y2="..."/>
  </g>

  <!-- Sections with nested nodes -->
  <g id="core-structure-section" transform="translate(28, 145)">
    <g transform="translate(0, 63)"><!-- Section label --></g>
    <g id="node-subject" transform="translate(2, 15)">
      <title>Subject: Curriculum subject area (maths, history, etc.)</title>
      <rect class="node-core" width="100" height="40" rx="20"/>
      <text class="label" x="50" y="25">Subject</text>
    </g>
    <!-- More nodes... -->
  </g>
</svg>
```

---

## Node Rendering

### Pill-Shaped Nodes (Lozenges)

```typescript
function createNode(config: NodeConfig): string {
  const { id, label, width, height, position, cssClass, brief } = config;
  const textX = width / 2; // Horizontal center
  const textY = height / 2 + 5; // Vertical center with offset
  const rx = height / 2; // Pill shape: rx = height/2

  const title = brief !== undefined ? `<title>${label}: ${brief}</title>` : '';

  return `<g id="${id}" transform="translate(${position.x}, ${position.y})">
    ${title}
    <rect class="${cssClass}" width="${width}" height="${height}" rx="${rx}"/>
    <text class="label" x="${textX}" y="${textY}">${label}</text>
  </g>`;
}
```

**Visual features**:

- Pill/lozenge shape via `rx="height/2"`
- Centered text via `text-anchor: middle` (in CSS) + `x="width/2"`
- Tooltip via `<title>` element (native browser tooltip on hover)

### Comparison with World Bank Demo

| Feature     | World Bank           | Oak Widget                 |
| ----------- | -------------------- | -------------------------- |
| Shape       | Circle (`<circle>`)  | Pill (`<rect rx="h/2">`)   |
| Sizing      | Radius from Z scale  | Fixed width/height config  |
| Colours     | D3 ordinal scale     | CSS classes                |
| Positioning | D3 transform + scale | Direct translate transform |
| Tooltips    | Custom SVG tooltip   | Native `<title>` element   |

---

## Edge Rendering

### Dynamic Centre Calculation

Oak uses the **same pattern** as the world-bank-graphing-demo for calculating edge endpoints:

```typescript
function getNodeCenter(sectionPosition: Position, nodeConfig: NodeConfig): Position {
  return {
    x: sectionPosition.x + nodeConfig.position.x + nodeConfig.width / 2,
    y: sectionPosition.y + nodeConfig.position.y + nodeConfig.height / 2,
  };
}

function createEdgeBetweenNodes(
  fromNodeId: string,
  toNodeId: string,
  relationship: string,
  isDashed: boolean,
  sections: readonly SectionConfig[],
): EdgeConfig {
  const fromResult = findNodeInSections(fromNodeId, sections);
  const toResult = findNodeInSections(toNodeId, sections);

  if (fromResult === null || toResult === null) {
    throw new Error(`Node not found: ${fromNodeId} or ${toNodeId}`);
  }

  const from = getNodeCenter(fromResult.sectionPosition, fromResult.node);
  const to = getNodeCenter(toResult.sectionPosition, toResult.node);

  return { from, to, relationship, isDashed };
}
```

**Key benefit**: Moving a section automatically updates all connected edges.

### Edge Visual Design

Edges use a **double-line technique** for visibility on any background:

```typescript
function createEdge(config: EdgeConfig): string {
  const { from, to, relationship, isDashed } = config;
  const outlineClass = isDashed ? 'edge-dashed-outline' : 'edge-outline';
  const lineClass = isDashed ? 'edge-dashed' : 'edge';

  return `<g>
    <title>${relationship}</title>
    <line class="${outlineClass}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>
    <line class="${lineClass}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"/>
  </g>`;
}
```

**CSS styling**:

```css
.edge {
  stroke: #fff;
  stroke-width: 4;
  fill: none;
}
.edge-outline {
  stroke: #1b3d1c;
  stroke-width: 8;
  fill: none;
}
.edge-dashed {
  stroke: #fff;
  stroke-width: 3;
  stroke-dasharray: 8 5;
}
.edge-dashed-outline {
  stroke: #1b3d1c;
  stroke-width: 7;
  stroke-dasharray: 8 5;
}
```

The outline is rendered **first** (wider, darker) and the main line **second** (narrower, lighter), creating a visible contrast effect.

---

## Colour Design

### Category-Based Colour Palette

Oak uses a **semantic colour scheme** based on concept category:

```css
.node-core {
  fill: #287d3c;
  stroke: #1b3d1c;
} /* Green - Structure */
.node-context {
  fill: #5da0d9;
  stroke: #2d5a7b;
} /* Blue - Context */
.node-content {
  fill: #d97d5d;
  stroke: #7b3d2d;
} /* Orange - Content */
.node-taxonomy {
  fill: #9b7dcf;
  stroke: #5d4a7b;
} /* Purple - Taxonomy */
.node-ks4 {
  fill: #cfab5d;
  stroke: #7b6a2d;
} /* Gold - KS4 */
.node-metadata {
  fill: #7a9e7a;
  stroke: #3d5a3d;
} /* Sage - Metadata */
```

**Pattern comparison**:

| Aspect         | World Bank          | Oak Widget             |
| -------------- | ------------------- | ---------------------- |
| Palette source | ColorBrewer         | Custom semantic        |
| Stroke         | `D3.rgb().darker()` | Hardcoded darker shade |
| Application    | JS ordinal scale    | CSS classes            |

### Contrast and Readability

Both approaches use darker strokes for depth, but Oak pre-calculates them rather than using D3's `darker()` method.

---

## Highlighting and Interactivity

### CSS-Only Hover Effects

Oak uses pure CSS for hover states (no JavaScript):

```css
g[id^='node-']:hover rect {
  stroke: #fff;
  stroke-width: 4;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
  cursor: pointer;
}
```

**Key features**:

- `g[id^="node-"]` selector targets all node groups
- White stroke + glow effect on hover
- CSS `transition` on node classes for smooth effect
- No bidirectional highlighting (legend ↔ node) unlike world-bank-graphing-demo

### Missing World Bank Patterns

| Feature                    | World Bank | Oak Widget | Reason                        |
| -------------------------- | ---------- | ---------- | ----------------------------- |
| Bidirectional highlight    | ✓          | ✗          | No legend-data connection     |
| nodeToTop() z-index fix    | ✓          | ✗          | Static SVG, no overlap issues |
| Custom tooltip positioning | ✓          | ✗          | Uses native `<title>`         |
| Animation playback         | ✓          | ✗          | Static snapshot               |

---

## Label Auto-Sizing

### Character Width Approximation

Section labels auto-size their background based on text length:

```typescript
const CHAR_WIDTH = 10; // Approximate monospace width
const PADDING_X = 5;

function createSectionLabel(config: SectionLabelConfig): string {
  const { text, position } = config;
  const width = PADDING_X + text.length * CHAR_WIDTH + PADDING_X;
  const textX = width / 2; // Center position

  return `<g transform="translate(${position.x}, ${position.y})">
    <rect class="group-label-bg" width="${width}" height="20" rx="4"/>
    <text class="group-label" x="${textX}" y="15" style="text-anchor:middle">${text}</text>
  </g>`;
}
```

**Trade-off**: Simple calculation but may not be pixel-perfect for proportional fonts.

---

## Build-Time vs Runtime Rendering

### Oak's Static Generation Pattern

```typescript
// Build-time: Generate SVG strings
function buildOverviewSvg(): string {
  const edges = createOverviewEdges().map(createEdge).join('');
  const sections = OVERVIEW_SECTIONS.map(createSection).join('');
  return `<svg viewBox="0 0 960 620" ...><style>${SVG_STYLES}</style>${edges}${sections}</svg>`;
}

// Pre-compute at module load
const KNOWLEDGE_GRAPH_OVERVIEW_SVG = buildOverviewSvg();
const KNOWLEDGE_GRAPH_FULL_SVG = buildFullSvg();

// Embed in renderer function (runs in ChatGPT sandbox)
export const KNOWLEDGE_GRAPH_RENDERER = `
const KNOWLEDGE_GRAPH_OVERVIEW_SVG = \`${KNOWLEDGE_GRAPH_OVERVIEW_SVG}\`;
const KNOWLEDGE_GRAPH_FULL_SVG = \`${KNOWLEDGE_GRAPH_FULL_SVG}\`;

function renderKnowledgeGraph(data) {
  // ... returns HTML with embedded SVG literals
}
`;
```

**Key insight**: SVG is a **compile-time constant**, not computed from data at runtime.

### Implications

| Aspect         | Build-Time SVG           | Runtime D3                 |
| -------------- | ------------------------ | -------------------------- |
| Bundle size    | Larger (SVG embedded)    | Smaller (library + config) |
| Initial render | Instant                  | DOM manipulation required  |
| Data updates   | Rebuild required         | Dynamic                    |
| Testing        | Unit test pure functions | Need DOM/jsdom             |
| Dependencies   | None                     | D3.js                      |

---

## Tooltip Integration

### Curriculum Ontology Connection

Tooltips are sourced from a concept briefs module that mirrors the knowledge graph data:

```typescript
// concept-briefs.ts
const CONCEPT_BRIEFS: Readonly<Record<string, string>> = {
  'node-subject': 'Curriculum subject area (maths, history, etc.)',
  'node-sequence': 'Internal API grouping of units across years',
  'node-unit': 'Topic of study with ordered lessons',
  'node-lesson': 'Teaching session with 8 standard components',
  // ... all 28 concepts
};

export function getConceptBrief(nodeId: string): string | undefined {
  return CONCEPT_BRIEFS[nodeId];
}
```

### Node Helper with Auto-Lookup

```typescript
// In section config files
const n = (id, label, w, h, x, y, cssClass) => ({
  id,
  label,
  width: w,
  height: h,
  position: { x, y },
  cssClass,
  brief: getConceptBrief(id), // Auto-lookup
});
```

---

## Dual Graph Support

### Overview Graph (18 concepts, 17 edges)

Simplified view focusing on core curriculum structure:

- Context: Phase, Key Stage, Year Group
- Structure: Subject, Sequence, Unit, Lesson
- Content: Quiz, Asset, Transcript, Question, Answer
- Taxonomy: Thread, Category
- KS4: Programme, Tier, Pathway, Exam Board

### Full Graph (28 concepts, 45 edges)

Complete ontology including:

- All overview concepts
- Metadata: Keyword, Misconception, Content Guidance, Key Learning Point, Teacher Tip, Supervision Level, Prior Knowledge, National Curriculum
- Additional KS4: Exam Subject

### Viewbox Sizing

```typescript
// Overview: 960 × 620
`<svg viewBox="0 0 960 620" ...>`
// Full: 1250 × 950 (larger to accommodate metadata section + legend)
`<svg viewBox="0 0 1250 950" ...>`;
```

---

## Testing Strategy

### Unit Tests: Pure Function Behaviour

```typescript
describe('createNode', () => {
  it('wraps output in <g> with id and transform for position', () => {
    const svg = createNode(baseConfig);
    expect(svg).toContain('<g id="node-subject"');
    expect(svg).toContain('transform="translate(20, 30)"');
  });

  it('creates <rect> with rx = height/2 for pill shape', () => {
    const svg = createNode(baseConfig);
    expect(svg).toContain('rx="20"'); // height=40, rx=20
  });

  it('is a pure function: same input produces same output', () => {
    const result1 = createNode(baseConfig);
    const result2 = createNode(baseConfig);
    expect(result1).toBe(result2);
  });
});
```

### Integration Tests: Registry Coherence

```typescript
describe('Knowledge Graph renderer integration', () => {
  it('all mappings are consistent from tool to render function', () => {
    const toolName = 'get-knowledge-graph';
    const rendererId = TOOL_RENDERER_MAP[toolName];
    expect(rendererId).toBe('knowledgeGraph');

    const functionName = RENDERER_FUNCTION_NAMES[rendererId];
    expect(functionName).toBe('renderKnowledgeGraph');

    expect(WIDGET_RENDERER_FUNCTIONS).toContain(`function ${functionName}(`);
  });
});
```

---

## Patterns Adopted from World Bank Demo

| Pattern                         | Application in Oak                           |
| ------------------------------- | -------------------------------------------- |
| **Transform-based positioning** | ✓ Sections and nodes use `translate()`       |
| **Dynamic edge calculation**    | ✓ `getNodeCenter()` + `findNodeInSections()` |
| **CSS class-based styling**     | ✓ `.node-core`, `.edge-dashed`, etc.         |
| **Category colour mapping**     | ✓ Via CSS classes (not D3 scale)             |
| **Darker stroke for depth**     | ✓ Pre-calculated in CSS                      |
| **Tooltip via title element**   | ✓ SVG `<title>` for native tooltips          |
| **Edge outline for visibility** | ✓ Double-line rendering pattern              |

## Patterns Not Adopted

| Pattern                        | Reason                                             |
| ------------------------------ | -------------------------------------------------- |
| **D3.js dependency**           | Build-time generation doesn't need runtime library |
| **Bidirectional highlighting** | No legend-data-point connection needed             |
| **nodeToTop() z-index**        | Static SVG doesn't need dynamic stacking           |
| **Quadrant-aware tooltips**    | Native `<title>` handles positioning               |
| **Responsive breakpoints**     | Fixed viewBox with responsive width                |
| **Animation/transitions**      | Static snapshot, not time-series                   |
| **Data enter-update-exit**     | Pre-computed, not data-bound                       |

---

## Potential Improvements

Based on world-bank-graphing-demo patterns:

### 1. Enhanced Tooltips

Replace native `<title>` with custom positioned tooltips for richer content:

```typescript
// Could add tooltip group like world-bank-graphing-demo
// With quadrant-aware positioning for better UX
```

### 2. Legend-Node Linking

Add bidirectional highlighting between legend items and nodes:

```css
/* Add data attributes and hover rules */
g[id="legend-core"]:hover ~ g[id^="node-"][data-category="core"] rect { ... }
```

### 3. Edge Label Positioning

World-bank-graphing-demo positions tooltips relative to circle radius. Oak edges could benefit from similar smart positioning.

### 4. Click-to-Expand

Add JavaScript handlers for node clicks to show expanded information (if the ChatGPT sandbox supports it).

---

## Summary

The Oak widget implementation adopts the **core architectural patterns** from world-bank-graphing-demo (transform positioning, dynamic edge calculation, CSS styling) while adapting for the **static, build-time context**. The pure function approach enables excellent testability and maintainability, trading off some interactivity features that would require runtime JavaScript.

The architecture is well-suited to the constraint of rendering in a sandboxed ChatGPT widget where complex JavaScript execution may not be reliable.

---

_Generated: 2025-12-04_
_Companion to: world-bank-graphing-demo-svg-patterns.md_
