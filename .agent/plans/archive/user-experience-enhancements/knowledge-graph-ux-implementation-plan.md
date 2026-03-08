# Knowledge Graph UX Enhancements: Implementation Plan

> **Status**: Ready for Implementation
> **Priority**: High
> **Estimated Total Effort**: 8-12 hours across 5 improvements
> **Created**: 2025-12-04

---

## Executive Summary

This plan implements 5 user experience enhancements to the Oak Knowledge Graph widget SVG visualisation. All work follows **TDD at all levels**, maintains the **pure function architecture**, and integrates with the existing build-time SVG generation approach.

### Selected Improvements (Priority Order)

| ID  | Name                     | Effort    | User Impact |
| --- | ------------------------ | --------- | ----------- |
| L2  | Edge Hover Highlighting  | 🟢 Low    | Medium      |
| L3  | Enhanced Tooltip Content | 🟢 Low    | High        |
| L1  | Directional Arrowheads   | 🟢 Low    | High        |
| M3  | Keyboard Navigation      | 🟡 Medium | High        |
| M1  | Legend-Node Linking      | 🟡 Medium | High        |

---

## Foundation Documents (MUST READ BEFORE STARTING)

Before beginning any implementation, read and internalise these documents:

1. **[principles.md](../../directives/principles.md)** — Core development rules, TDD requirements, type safety
2. **[testing-strategy.md](../../directives/testing-strategy.md)** — Test types, TDD at all levels, when to write tests
3. **[schema-first-execution.md](../../directives/schema-first-execution.md)** — Generator-first mindset (applies to M2 if extended later)

### Key Principles to Apply

From **principles.md**:

- **TDD**: Write tests FIRST. Red → Green → Refactor
- **Pure functions first**: All SVG component functions are pure
- **No type shortcuts**: Never use `as`, `any`, `!`
- **Fail fast**: Throw helpful errors for invalid configurations
- **TSDoc everywhere**: Document all functions

From **testing-strategy.md**:

- **Unit tests**: For pure SVG component functions (`*.unit.test.ts`)
- **Integration tests**: For renderer registry coherence (`*.integration.test.ts`)
- **Test behaviour, not implementation**: Tests should survive refactoring

---

## Reference Documentation

### Codebase Files

```
apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/
├── knowledge-graph-renderer.ts      # Main renderer, CSS styles
├── svg-components.ts                 # Pure rendering functions (MODIFY)
├── svg-components.unit.test.ts       # Unit tests (EXTEND)
├── svg-overview-sections.ts          # Overview graph config
├── svg-full-sections.ts              # Full graph config
├── svg-full-edges.ts                 # Full graph edges
├── concept-briefs.ts                 # Tooltip definitions
└── knowledge-graph-renderer.integration.test.ts  # Integration tests
```

### Research Documents

- [world-bank-graphing-demo-svg-patterns.md](../../research/world-bank-graphing-demo-svg-patterns.md)
- [oak-widget-svg-implementation-analysis.md](../../research/oak-widget-svg-implementation-analysis.md)

### Architecture Decision

- [ADR-062: Knowledge Graph SVG Visualization Architecture](../../../docs/architecture/architectural-decisions/062-knowledge-graph-svg-visualization.md)

---

## Quality Gate Commands

Run these commands **after each improvement** (one at a time, from repo root):

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**Rule**: Do not proceed to the next improvement until all gates pass.

---

## Phase 1: CSS-Only Enhancements

### Improvement L2: Edge Hover Highlighting

**Goal**: Add visual feedback when hovering over edges to help users trace relationships.

#### Current State

- Edges display `<title>` tooltip on hover
- No visual change on hover

#### Target State

- Edge stroke brightens to yellow/gold on hover
- Edge outline widens slightly for emphasis
- Smooth CSS transition (150ms)

#### Acceptance Criteria

- [ ] **AC-L2.1**: When user hovers over a solid edge, the edge stroke changes to `#ffeb3b` (yellow)
- [ ] **AC-L2.2**: When user hovers over a dashed edge, the dashed edge stroke changes to `#ffeb3b`
- [ ] **AC-L2.3**: CSS includes `transition` property for smooth effect
- [ ] **AC-L2.4**: Unit test verifies `SVG_STYLES` contains edge hover rules
- [ ] **AC-L2.5**: Visual verification in `pnpm widget:preview` shows hover effect

#### Implementation Steps (TDD)

**Step 1: Write failing test (RED)**

File: `svg-components.unit.test.ts` (or new test in `knowledge-graph-renderer.unit.test.ts`)

```typescript
describe('SVG_STYLES edge hover', () => {
  it('includes hover rule for solid edges', () => {
    expect(SVG_STYLES).toContain('line.edge');
    expect(SVG_STYLES).toContain(':hover');
  });

  it('includes hover rule for dashed edges', () => {
    expect(SVG_STYLES).toContain('line.edge-dashed');
  });

  it('uses yellow highlight colour on hover', () => {
    expect(SVG_STYLES).toContain('#ffeb3b');
  });
});
```

Run test → FAILS (no hover rules exist)

**Step 2: Implement CSS (GREEN)**

File: `knowledge-graph-renderer.ts`

Add to `SVG_STYLES`:

```css
/* Edge hover highlighting */
g:has(> line.edge):hover line.edge {
  stroke: #ffeb3b;
  stroke-width: 5;
  transition:
    stroke 0.15s,
    stroke-width 0.15s;
}
g:has(> line.edge):hover line.edge-outline {
  stroke-width: 10;
}
g:has(> line.edge-dashed):hover line.edge-dashed {
  stroke: #ffeb3b;
  stroke-width: 4;
}
g:has(> line.edge-dashed):hover line.edge-dashed-outline {
  stroke-width: 9;
}
```

Run test → PASSES

**Step 3: Refactor**

- Extract hover colour to CSS variable if needed
- Ensure consistent transition timing

**Step 4: Run quality gates**

```bash
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint -- --fix
pnpm format:root && pnpm test
```

**Step 5: Visual verification**

```bash
pnpm widget:preview
# Navigate to http://localhost:4580/widget/knowledge-graph
# Hover over edges, verify yellow highlight appears
```

---

### Improvement L3: Enhanced Tooltip Content

**Goal**: Improve edge tooltips to show source → target with relationship name.

#### Current State

- Edge tooltip shows only: `hasSequences`

#### Target State

- Edge tooltip shows: `Subject → Sequence (hasSequences)`

#### Acceptance Criteria

- [ ] **AC-L3.1**: `EdgeConfig` interface extended with optional `fromLabel` and `toLabel` properties
- [ ] **AC-L3.2**: `createEdge` function formats tooltip as `{fromLabel} → {toLabel} ({relationship})` when labels provided
- [ ] **AC-L3.3**: `createEdge` function falls back to `{relationship}` when labels not provided
- [ ] **AC-L3.4**: Unit tests verify both tooltip formats
- [ ] **AC-L3.5**: `createEdgeBetweenNodes` updated to pass node labels

#### Implementation Steps (TDD)

**Step 1: Write failing tests (RED)**

File: `svg-components.unit.test.ts`

```typescript
describe('createEdge tooltip formatting', () => {
  it('formats tooltip with arrow notation when labels provided', () => {
    const config = {
      from: { x: 0, y: 0 },
      to: { x: 100, y: 100 },
      relationship: 'hasSequences',
      isDashed: false,
      fromLabel: 'Subject',
      toLabel: 'Sequence',
    };
    const svg = createEdge(config);
    expect(svg).toContain('<title>Subject → Sequence (hasSequences)</title>');
  });

  it('uses relationship only when labels not provided', () => {
    const config = {
      from: { x: 0, y: 0 },
      to: { x: 100, y: 100 },
      relationship: 'hasSequences',
      isDashed: false,
    };
    const svg = createEdge(config);
    expect(svg).toContain('<title>hasSequences</title>');
  });
});
```

Run tests → FAIL

**Step 2: Update interface and function (GREEN)**

File: `svg-components.ts`

```typescript
/** Configuration for an edge connecting two points. */
export interface EdgeConfig {
  readonly from: Position;
  readonly to: Position;
  readonly relationship: string;
  readonly isDashed: boolean;
  /** Label of source node for enhanced tooltip. */
  readonly fromLabel?: string;
  /** Label of target node for enhanced tooltip. */
  readonly toLabel?: string;
}

/** Creates an edge between two points with relationship tooltip. */
export function createEdge(config: EdgeConfig): string {
  const { from, to, relationship, isDashed, fromLabel, toLabel } = config;

  // Format tooltip with arrow notation if labels provided
  const tooltipText =
    fromLabel !== undefined && toLabel !== undefined
      ? `${fromLabel} → ${toLabel} (${relationship})`
      : relationship;

  const outlineClass = isDashed ? 'edge-dashed-outline' : 'edge-outline';
  const lineClass = isDashed ? 'edge-dashed' : 'edge';
  // ... rest of implementation
  return `<g><title>${tooltipText}</title>...`;
}
```

**Step 3: Update `createEdgeBetweenNodes` to pass labels**

```typescript
export function createEdgeBetweenNodes(
  fromNodeId: string,
  toNodeId: string,
  relationship: string,
  isDashed: boolean,
  sections: readonly SectionConfig[],
): EdgeConfig {
  const fromResult = findNodeInSections(fromNodeId, sections);
  const toResult = findNodeInSections(toNodeId, sections);

  // ... existing null checks ...

  const from = getNodeCenter(fromResult.sectionPosition, fromResult.node);
  const to = getNodeCenter(toResult.sectionPosition, toResult.node);

  return {
    from,
    to,
    relationship,
    isDashed,
    fromLabel: fromResult.node.label,
    toLabel: toResult.node.label,
  };
}
```

Run tests → PASS

**Step 4: Run quality gates**

**Step 5: Visual verification**

- Hover over edges in preview
- Verify tooltip shows `Subject → Sequence (hasSequences)` format

---

## Phase 2: SVG Structure Enhancements

### Improvement L1: Directional Arrowheads

**Goal**: Add arrowheads to edges to show relationship direction.

#### Current State

- Edges are undirected lines

#### Target State

- Edges have arrowheads pointing to target node
- Arrowheads match edge colour (white with dark outline)
- Dashed edges also have arrowheads

#### Acceptance Criteria

- [ ] **AC-L1.1**: New pure function `createArrowMarkers()` generates SVG `<defs>` with marker definitions
- [ ] **AC-L1.2**: Unit test verifies marker structure (id, markerWidth, markerHeight, path)
- [ ] **AC-L1.3**: `createEdge` adds `marker-end` attribute referencing marker
- [ ] **AC-L1.4**: SVG output includes `<defs>` section with arrow markers
- [ ] **AC-L1.5**: Arrowheads visible on edges in preview

#### Implementation Steps (TDD)

**Step 1: Write failing tests (RED)**

File: `svg-components.unit.test.ts`

```typescript
describe('createArrowMarkers', () => {
  it('creates defs element with marker definitions', () => {
    const svg = createArrowMarkers();
    expect(svg).toContain('<defs>');
    expect(svg).toContain('</defs>');
  });

  it('creates marker for solid edges', () => {
    const svg = createArrowMarkers();
    expect(svg).toContain('id="arrow"');
    expect(svg).toContain('markerWidth=');
    expect(svg).toContain('<path');
  });

  it('creates marker for edge outlines', () => {
    const svg = createArrowMarkers();
    expect(svg).toContain('id="arrow-outline"');
  });
});

describe('createEdge with arrowheads', () => {
  it('includes marker-end attribute', () => {
    const config = {
      /* ... */
    };
    const svg = createEdge(config);
    expect(svg).toContain('marker-end="url(#arrow)"');
  });
});
```

**Step 2: Implement functions (GREEN)**

File: `svg-components.ts`

```typescript
/** Marker configuration for arrow definitions. */
interface ArrowMarkerConfig {
  readonly id: string;
  readonly colour: string;
  readonly size: number;
}

/** Creates SVG marker definitions for arrowheads. */
export function createArrowMarkers(): string {
  const markers: readonly ArrowMarkerConfig[] = [
    { id: 'arrow', colour: '#fff', size: 6 },
    { id: 'arrow-outline', colour: '#1b3d1c', size: 8 },
  ];

  const markersSvg = markers
    .map(({ id, colour, size }) => {
      const refX = size;
      const refY = size / 2;
      return `<marker id="${id}" markerWidth="${size}" markerHeight="${size}" refX="${refX}" refY="${refY}" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,${size} L${size},${refY} z" fill="${colour}"/></marker>`;
    })
    .join('');

  return `<defs>${markersSvg}</defs>`;
}
```

Update `createEdge`:

```typescript
export function createEdge(config: EdgeConfig): string {
  // ... existing code ...
  const markerEnd = 'url(#arrow)';
  const markerEndOutline = 'url(#arrow-outline)';

  return `<g><title>${tooltipText}</title><line class="${outlineClass}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="${markerEndOutline}"/><line class="${lineClass}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="${markerEnd}"/></g>`;
}
```

**Step 3: Update renderer to include defs**

File: `knowledge-graph-renderer.ts`

```typescript
import { createArrowMarkers } from './svg-components.js';

function buildOverviewSvg(): string {
  const defs = createArrowMarkers();
  const edges = createOverviewEdges().map(createEdge).join('');
  const sections = OVERVIEW_SECTIONS.map(createSection).join('');
  return `<svg viewBox="0 0 960 620" ...><style>${SVG_STYLES}</style>${defs}${edges}${sections}</svg>`;
}
```

**Step 4: Run quality gates**

**Step 5: Visual verification**

- Verify arrowheads point to target nodes
- Verify arrows visible on both solid and dashed edges

---

## Phase 3: Accessibility Enhancement

### Improvement M3: Keyboard Navigation

**Goal**: Enable keyboard navigation through graph nodes for accessibility.

#### Current State

- Nodes are mouse-only
- No keyboard focus support
- No screen reader labels

#### Target State

- Nodes are focusable via Tab key
- Focus indicator visible (white stroke + blue outline)
- Screen readers announce node label and description
- ARIA attributes present

#### Acceptance Criteria

- [ ] **AC-M3.1**: `NodeConfig` interface accepts optional `tabIndex` (defaults to 0)
- [ ] **AC-M3.2**: `createNode` outputs `tabindex="0"` attribute
- [ ] **AC-M3.3**: `createNode` outputs `role="button"` attribute
- [ ] **AC-M3.4**: `createNode` outputs `aria-label` with label and brief
- [ ] **AC-M3.5**: CSS includes `:focus` styles for nodes
- [ ] **AC-M3.6**: Unit tests verify all accessibility attributes
- [ ] **AC-M3.7**: Tab navigation works in browser preview

#### Implementation Steps (TDD)

**Step 1: Write failing tests (RED)**

File: `svg-components.unit.test.ts`

```typescript
describe('createNode accessibility', () => {
  const config = {
    id: 'node-subject',
    label: 'Subject',
    width: 100,
    height: 40,
    position: { x: 0, y: 0 },
    cssClass: 'node-core',
    brief: 'Curriculum subject area',
  };

  it('includes tabindex for keyboard focus', () => {
    const svg = createNode(config);
    expect(svg).toContain('tabindex="0"');
  });

  it('includes role="button" for screen readers', () => {
    const svg = createNode(config);
    expect(svg).toContain('role="button"');
  });

  it('includes aria-label with label and brief', () => {
    const svg = createNode(config);
    expect(svg).toContain('aria-label="Subject: Curriculum subject area"');
  });

  it('includes aria-label with only label when no brief', () => {
    const configNoBrief = { ...config, brief: undefined };
    const svg = createNode(configNoBrief);
    expect(svg).toContain('aria-label="Subject"');
  });
});
```

**Step 2: Update createNode (GREEN)**

File: `svg-components.ts`

```typescript
export function createNode(config: NodeConfig): string {
  const { id, label, width, height, position, cssClass, brief } = config;
  const textX = width / 2;
  const textY = height / 2 + 5;
  const rx = height / 2;
  const x = String(position.x);
  const y = String(position.y);

  const title = brief !== undefined ? `<title>${label}: ${brief}</title>` : '';
  const ariaLabel = brief !== undefined ? `${label}: ${brief}` : label;

  return `<g id="${id}" transform="translate(${x}, ${y})" tabindex="0" role="button" aria-label="${ariaLabel}">${title}<rect class="${cssClass}" width="${String(width)}" height="${String(height)}" rx="${String(rx)}"/><text class="label" x="${String(textX)}" y="${String(textY)}">${label}</text></g>`;
}
```

**Step 3: Add focus CSS**

File: `knowledge-graph-renderer.ts`

Add to `SVG_STYLES`:

```css
/* Keyboard focus styles */
g[id^='node-']:focus {
  outline: none;
}
g[id^='node-']:focus rect {
  stroke: #fff;
  stroke-width: 4;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
}
g[id^='node-']:focus-visible rect {
  outline: 2px solid #4a90d9;
  outline-offset: 2px;
}
```

**Step 4: Run quality gates**

**Step 5: Manual testing**

- Open preview in browser
- Press Tab to navigate through nodes
- Verify focus indicator appears
- Test with screen reader (VoiceOver/NVDA) if available

---

## Phase 4: Interactive Discovery

### Improvement M1: Legend-Node Bidirectional Highlighting

**Goal**: Highlight matching nodes when hovering legend items, and vice versa.

#### Current State

- Legend and nodes are visually separate
- No interaction between legend and nodes

#### Target State

- Hovering legend category highlights all nodes of that category
- Hovering a node highlights its corresponding legend item
- Uses `data-category` attribute for linking

#### Acceptance Criteria

- [ ] **AC-M1.1**: `NodeConfig` extended with `category` property
- [ ] **AC-M1.2**: `createNode` outputs `data-category` attribute
- [ ] **AC-M1.3**: Legend items have `id="legend-{category}"` format
- [ ] **AC-M1.4**: CSS includes sibling selector rules for bidirectional highlight
- [ ] **AC-M1.5**: Unit tests verify `data-category` attribute present
- [ ] **AC-M1.6**: Hovering legend "Structure" highlights all green nodes
- [ ] **AC-M1.7**: Hovering a node highlights corresponding legend item

#### Implementation Steps (TDD)

**Step 1: Write failing tests (RED)**

File: `svg-components.unit.test.ts`

```typescript
describe('createNode with category', () => {
  it('includes data-category attribute when category provided', () => {
    const config = {
      id: 'node-subject',
      label: 'Subject',
      width: 100,
      height: 40,
      position: { x: 0, y: 0 },
      cssClass: 'node-core',
      category: 'core',
    };
    const svg = createNode(config);
    expect(svg).toContain('data-category="core"');
  });
});
```

**Step 2: Update interfaces and functions (GREEN)**

File: `svg-components.ts`

```typescript
export interface NodeConfig {
  readonly id: string;
  readonly label: string;
  readonly width: number;
  readonly height: number;
  readonly position: Position;
  readonly cssClass: string;
  readonly brief?: string;
  /** Category for legend linking (e.g., 'core', 'context', 'content'). */
  readonly category?: string;
}

export function createNode(config: NodeConfig): string {
  const { id, label, width, height, position, cssClass, brief, category } = config;
  // ...
  const categoryAttr = category !== undefined ? ` data-category="${category}"` : '';

  return `<g id="${id}" transform="translate(${x}, ${y})"${categoryAttr} tabindex="0" role="button" aria-label="${ariaLabel}">...`;
}
```

**Step 3: Update section configs to include category**

File: `svg-overview-sections.ts` and `svg-full-sections.ts`

Update the `n` helper function:

```typescript
const n = (
  id: string,
  label: string,
  w: number,
  h: number,
  x: number,
  y: number,
  cssClass: string,
  category: string,
) => ({
  id,
  label,
  width: w,
  height: h,
  position: { x, y },
  cssClass,
  brief: getConceptBrief(id),
  category,
}) as const;

// Usage:
n('node-subject', 'Subject', 100, 40, 2, 15, 'node-core', 'core'),
n('node-phase', 'Phase', 100, 35, 2, 30, 'node-context', 'context'),
```

**Step 4: Update legend rendering**

File: `knowledge-graph-renderer.ts`

Update `buildLegend()` to add IDs:

```typescript
function buildLegend(): string {
  // ...
  for (const item of items) {
    const legendId = `legend-${item.cssClass.replace('node-', '')}`;
    l += `<g id="${legendId}"><rect class="${item.cssClass}" x="${String(item.x)}" .../>`;
    // ...
  }
}
```

**Step 5: Add bidirectional CSS**

Note: CSS sibling selectors require legend to appear before nodes in DOM order. The current structure has edges → sections → legend. We may need to adjust or use `:has()` selectors.

```css
/* Legend hover → highlight nodes */
g[id^='legend-']:hover {
  cursor: pointer;
}

/* Using :has() for reverse selection (legend before nodes) */
/* This may require SVG structure adjustment */
svg:has(#legend-core:hover) g[data-category='core'] rect {
  stroke: #fff;
  stroke-width: 4;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
}

/* Node hover → highlight legend (requires JS or specific structure) */
```

**Step 6: Consider SVG structure adjustment**

If pure CSS doesn't work due to DOM order, document this limitation and either:

1. Restructure SVG to place legend before sections
2. Accept CSS-only limitation (legend → nodes works, but not reverse)
3. Note as future enhancement requiring minimal JS

**Step 7: Run quality gates**

**Step 8: Visual verification**

---

## Summary Checklist

### Phase 1 Complete When:

- [ ] L2: Edge hover highlighting works (CSS only)
- [ ] L3: Edge tooltips show `Source → Target (relationship)` format
- [ ] All quality gates pass

### Phase 2 Complete When:

- [ ] L1: Arrowheads visible on all edges
- [ ] Arrow direction indicates relationship direction
- [ ] All quality gates pass

### Phase 3 Complete When:

- [ ] M3: Tab navigation through nodes works
- [ ] Focus indicator visible
- [ ] ARIA attributes present
- [ ] All quality gates pass

### Phase 4 Complete When:

- [ ] M1: Legend hover highlights matching nodes
- [ ] `data-category` attributes present on all nodes
- [ ] All quality gates pass

---

## Post-Implementation

### Update Documentation

After all improvements are complete:

1. Update [ADR-062](../../../docs/architecture/architectural-decisions/062-knowledge-graph-svg-visualization.md) with new features
2. Update component TSDoc in `svg-components.ts`
3. Add accessibility notes to widget documentation

### Final Quality Gate Run

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

---

## Rollback Plan

If any improvement causes issues:

1. Git revert the specific commits for that improvement
2. Run quality gates to confirm clean state
3. Document issue in improvement's section for future reference

---

## Appendix: File Locations

| Purpose         | File Path                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------ |
| CSS Styles      | `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/knowledge-graph-renderer.ts` |
| Pure Functions  | `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/svg-components.ts`           |
| Unit Tests      | `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/svg-components.unit.test.ts` |
| Overview Config | `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/svg-overview-sections.ts`    |
| Full Config     | `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/svg-full-sections.ts`        |
| Full Edges      | `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/svg-full-edges.ts`           |
| Concept Briefs  | `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/concept-briefs.ts`           |

---

_Created: 2025-12-04_
_Plan for: Knowledge Graph UX Enhancements (L2, L3, L1, M3, M1)_
