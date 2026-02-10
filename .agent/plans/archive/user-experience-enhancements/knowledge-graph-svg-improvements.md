# Knowledge Graph SVG Improvements Plan

> **Status**: Draft
> **Priority**: Medium
> **Foundation Documents**: [rules.md](../../directives/rules.md), [testing-strategy.md](../../directives/testing-strategy.md)
> **Research Sources**:
>
> - [world-bank-graphing-demo-svg-patterns.md](../../research/world-bank-graphing-demo-svg-patterns.md)
> - [oak-widget-svg-implementation-analysis.md](../../research/oak-widget-svg-implementation-analysis.md)

## Context

The Oak knowledge graph widget currently renders curriculum concept relationships as static SVG with CSS-only interactivity. Based on analysis of the world-bank-graphing-demo patterns and our current implementation, this document identifies **low to medium effort improvements** that enhance user experience while maintaining architectural integrity.

### Guiding Principles

From the foundation documents:

1. **First Question**: Could it be simpler without compromising quality?
2. **TDD**: All changes must be test-first (Red → Green → Refactor)
3. **Pure functions**: Maintain the pure function component architecture
4. **No compatibility layers**: Replace old approaches, don't create parallel versions
5. **Fail fast**: Improve error feedback, not silent failures

### Constraints

- **Static SVG generation**: Build-time rendering, not runtime D3
- **Sandbox limitations**: ChatGPT widget may not support complex JavaScript
- **Bundle size**: SVG is embedded as string literals

---

## Improvement Categories

### 🟢 Low Effort (1-2 hours each)

### 🟡 Medium Effort (2-4 hours each)

---

## 🟢 L1: Improve Edge Visibility with Arrowheads

**User Impact**: High — clearer directional relationships
**Developer Impact**: Low — pure function addition, no architecture change

### Current State

Edges are undirected lines. Users must infer direction from relationship names in tooltips.

### Proposed Change

Add SVG `<marker>` definitions for arrowheads on relationship edges.

```typescript
// New pure function
function createArrowMarker(id: string, colour: string): string {
  return `<marker id="${id}" markerWidth="6" markerHeight="6" 
    refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
    <path d="M0,0 L0,6 L6,3 z" fill="${colour}"/>
  </marker>`;
}

// Updated createEdge
function createEdge(config: EdgeConfig): string {
  // ... existing code ...
  return `<g>
    <title>${relationship}</title>
    <line class="${outlineClass}" ... marker-end="url(#arrow-outline)"/>
    <line class="${lineClass}" ... marker-end="url(#arrow)"/>
  </g>`;
}
```

### TDD Approach

1. **RED**: Write test for `createArrowMarker` output structure
2. **GREEN**: Implement function
3. **REFACTOR**: Extract marker IDs to constants

---

## 🟢 L2: Add Edge Hover Highlighting

**User Impact**: Medium — easier to trace relationships
**Developer Impact**: Low — CSS only, no JS required

### Current State

Edges show tooltip on hover but no visual feedback.

### Proposed Change

Add CSS hover effects for edges:

```css
/* Edge hover enhancement */
g:has(> line.edge):hover line.edge {
  stroke: #ffeb3b; /* Yellow highlight */
  stroke-width: 5;
}

g:has(> line.edge):hover line.edge-outline {
  stroke-width: 10;
}

/* Dashed edges */
g:has(> line.edge-dashed):hover line.edge-dashed {
  stroke: #ffeb3b;
}
```

**Note**: `:has()` is supported in modern browsers. Fallback: use data attributes.

### TDD Approach

1. Unit test: CSS string contains edge hover rules
2. Visual verification via `pnpm widget:preview`

---

## 🟢 L3: Improve Tooltip Content Structure

**User Impact**: High — better understanding of concepts
**Developer Impact**: Low — string formatting change

### Current State

Tooltips show: `Label: Brief description`

### Proposed Change

Add relationship context to edge tooltips:

```typescript
// Current: "hasSequences"
// Proposed: "Subject → Sequence (hasSequences)"

function createEdge(
  config: EdgeConfig & {
    fromLabel?: string;
    toLabel?: string;
  },
): string {
  const { from, to, relationship, fromLabel, toLabel } = config;
  const tooltip =
    fromLabel && toLabel ? `${fromLabel} → ${toLabel} (${relationship})` : relationship;
  // ...
}
```

### TDD Approach

1. **RED**: Test that edge title contains arrow notation when labels provided
2. **GREEN**: Implement
3. **REFACTOR**: Consider extracting tooltip formatting

---

## 🟢 L4: Add Visual Grouping Backgrounds

**User Impact**: Medium — clearer section boundaries
**Developer Impact**: Low — add rect to section component

### Current State

Sections are visually grouped only by label and proximity.

### Proposed Change

Add subtle background rectangles to sections:

```typescript
function createSectionBackground(width: number, height: number): string {
  return `<rect class="section-bg" width="${width}" height="${height}" rx="12"/>`;
}
```

```css
.section-bg {
  fill: rgba(255, 255, 255, 0.03);
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1;
}
```

### TDD Approach

1. Unit test: Section includes background rect
2. Test: Background uses correct dimensions

---

## 🟡 M1: Legend-Node Bidirectional Highlighting

**User Impact**: High — powerful discovery mechanism
**Developer Impact**: Medium — requires data attributes + CSS

### Current State

Legend and nodes are visually separate with no interaction link.

### Proposed Change

Add `data-category` attributes to nodes and use CSS sibling selectors:

```typescript
// In createNode
`<g id="${id}" data-category="${category}" ...>`
// In legend items
`<g id="legend-${category}" class="legend-item" ...>`;
```

```css
/* When hovering legend item, highlight matching nodes */
#legend-core:hover ~ g[data-category='core'] rect,
g[data-category='core']:hover ~ #legend-core rect {
  stroke: #fff;
  stroke-width: 4;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
}
```

### Limitation

CSS sibling selectors require specific DOM order. May need SVG restructuring to place legend before sections.

### TDD Approach

1. Test: Nodes include `data-category` attribute
2. Test: Legend items have matching IDs
3. Visual verification via preview

---

## 🟡 M2: Concept Brief Source Consolidation

**User Impact**: Low (indirect) — consistency
**Developer Impact**: High — single source of truth for tooltips

### Current State

`concept-briefs.ts` duplicates definitions from the SDK's knowledge graph data.

### Proposed Change

Generate `concept-briefs.ts` from the SDK knowledge graph at type-gen time, eliminating duplication.

```typescript
// In type-gen templates
// Read KNOWLEDGE_GRAPH_CONCEPTS from SDK
// Generate concept-briefs.ts with CONCEPT_BRIEFS map
```

### Architectural Alignment

This aligns with the **Cardinal Rule**: all type-related information flows from the schema via `pnpm type-gen`.

### TDD Approach

1. Test: Generated briefs match SDK concept definitions
2. Test: All node IDs have corresponding briefs
3. Test: Generator produces valid TypeScript

---

## 🟡 M3: Keyboard Navigation Support

**User Impact**: High — accessibility improvement
**Developer Impact**: Medium — requires minimal JS in sandbox

### Current State

Graph is mouse-only. No keyboard navigation.

### Proposed Change

Add `tabindex` to nodes and basic focus styles:

```typescript
function createNode(config: NodeConfig): string {
  // Add tabindex for keyboard focus
  return `<g id="${id}" tabindex="0" role="button" 
    aria-label="${label}: ${brief}" ...>`;
}
```

```css
g[id^='node-']:focus rect {
  stroke: #fff;
  stroke-width: 4;
  outline: 2px solid #4a90d9;
  outline-offset: 2px;
}
```

### Accessibility Benefits

- Screen reader announces concept name and description
- Tab navigation through nodes
- Focus visible indicator

### TDD Approach

1. Test: Nodes have `tabindex="0"`
2. Test: Nodes have `aria-label` with brief
3. Test: CSS includes focus styles

---

## 🟡 M4: Edge Routing for Overlapping Lines

**User Impact**: Medium — clearer when edges overlap
**Developer Impact**: Medium — geometry calculations

### Current State

Edges are straight lines from center to center. Overlapping edges are indistinguishable.

### Proposed Change

Detect overlapping edges and add slight curvature using quadratic Bézier curves:

```typescript
function createCurvedEdge(config: EdgeConfig, offset: number): string {
  const { from, to } = config;
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  // Perpendicular offset for curve control point
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy);
  const perpX = (-dy / len) * offset;
  const perpY = (dx / len) * offset;

  const ctrlX = midX + perpX;
  const ctrlY = midY + perpY;

  return `<path d="M${from.x},${from.y} Q${ctrlX},${ctrlY} ${to.x},${to.y}" .../>`;
}
```

### TDD Approach

1. Test: Pure function calculates correct control point
2. Test: Path `d` attribute has correct format
3. Test: Overlapping edge detection

---

## 🟡 M5: Minimap for Full Graph

**User Impact**: High — navigation aid for large graph
**Developer Impact**: Medium — render scaled-down version

### Current State

Full graph (28 concepts) requires scrolling in small viewports.

### Proposed Change

Generate a minimap SVG showing the full graph at reduced scale with a viewport indicator:

```typescript
function createMinimap(sections: SectionConfig[], scale: number): string {
  const width = 1250 * scale;
  const height = 950 * scale;

  return `<svg class="minimap" viewBox="0 0 1250 950" 
    width="${width}" height="${height}">
    ${sections.map((s) => createMinimapSection(s)).join('')}
    <rect class="viewport-indicator" .../>
  </svg>`;
}
```

### Implementation Considerations

- Minimap nodes are simple rectangles (no text for clarity)
- Minimap updates viewport indicator based on scroll (requires JS)
- Could be CSS-only positioned in corner

### TDD Approach

1. Test: Minimap contains all section positions
2. Test: Minimap scales correctly
3. Test: Viewport indicator positioned correctly

---

## Implementation Priorities

Based on **user impact** and **effort**:

| Priority | Improvement             | Effort    | User Impact | Notes                            |
| -------- | ----------------------- | --------- | ----------- | -------------------------------- |
| 1        | L2: Edge Hover          | 🟢 Low    | Medium      | Quick win, CSS only              |
| 2        | L3: Tooltip Content     | 🟢 Low    | High        | Better understanding             |
| 3        | L1: Arrowheads          | 🟢 Low    | High        | Clearer direction                |
| 4        | M3: Keyboard Nav        | 🟡 Medium | High        | Accessibility                    |
| 5        | M1: Legend Linking      | 🟡 Medium | High        | Discovery UX                     |
| 6        | L4: Section BGs         | 🟢 Low    | Medium      | Visual clarity                   |
| 7        | M2: Brief Consolidation | 🟡 Medium | Low         | Architecture hygiene             |
| 8        | M4: Edge Routing        | 🟡 Medium | Medium      | Only if overlaps are problematic |
| 9        | M5: Minimap             | 🟡 Medium | High        | Only if scrolling is issue       |

---

## Quality Gate Verification

After implementing any improvement:

```bash
# From repo root, one at a time
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm format:root
pnpm test
pnpm widget:preview  # Visual verification
```

---

## Non-Goals (Out of Scope)

The following would require significant architectural changes and are **not** recommended:

| Feature                    | Reason to Exclude                             |
| -------------------------- | --------------------------------------------- |
| Runtime D3.js              | Conflicts with static SVG generation approach |
| Node click-to-expand       | Sandbox JS limitations unclear                |
| Zoom/pan controls          | Requires complex JS, viewBox handles scaling  |
| Animation playback         | Not relevant (static schema, not time-series) |
| Custom tooltip positioning | Native `<title>` is simpler and reliable      |

---

## Re-Reading Foundation Documents

Before starting implementation, re-read:

1. [rules.md](../../directives/rules.md) — TDD, pure functions, no shortcuts
2. [testing-strategy.md](../../directives/testing-strategy.md) — Test-first at all levels
3. [schema-first-execution.md](../../directives/schema-first-execution.md) — For M2 (brief consolidation)

---

_Created: 2025-12-04_
_Based on research from world-bank-graphing-demo analysis and Oak widget implementation review_
