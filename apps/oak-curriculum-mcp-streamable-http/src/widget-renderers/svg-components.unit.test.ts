/**
 * Unit tests for SVG component pure functions.
 *
 * These tests verify BEHAVIOR: each component function produces correct SVG
 * output with proper structure, coordinates, and attributes.
 *
 * TDD: These tests are written FIRST, before the implementation.
 *
 * @see svg-components.ts - Source module
 * @see testing-strategy.md - Unit test definitions
 */

import { describe, it, expect } from 'vitest';
import {
  createNode,
  createSectionLabel,
  createEdge,
  createSection,
  getNodeCenter,
  findNodeInSections,
  createEdgeBetweenNodes,
} from './svg-components.js';
import type { SectionConfig, NodeConfig } from './svg-components.js';

describe('createNode', () => {
  const baseConfig = {
    id: 'node-subject',
    label: 'Subject',
    width: 100,
    height: 40,
    position: { x: 20, y: 30 },
    cssClass: 'node-core',
  } as const;

  it('wraps output in <g> with id and transform for position', () => {
    const svg = createNode(baseConfig);

    expect(svg).toContain('<g id="node-subject"');
    expect(svg).toContain('transform="translate(20, 30)"');
  });

  it('creates <rect> with correct width, height, and rx = height/2 for pill shape', () => {
    const svg = createNode(baseConfig);

    expect(svg).toContain('width="100"');
    expect(svg).toContain('height="40"');
    // rx = height / 2 = 20 for pill shape
    expect(svg).toContain('rx="20"');
  });

  it('applies the cssClass to the rect', () => {
    const svg = createNode(baseConfig);

    expect(svg).toContain('class="node-core"');
  });

  it('creates <text> with x at width/2 for horizontal centering', () => {
    const svg = createNode(baseConfig);

    // x = width / 2 = 50
    expect(svg).toContain('x="50"');
    expect(svg).toContain('>Subject</text>');
  });

  it('is a pure function: same input produces same output', () => {
    const result1 = createNode(baseConfig);
    const result2 = createNode(baseConfig);

    expect(result1).toBe(result2);
  });
});

describe('createSectionLabel', () => {
  it('calculates background width with symmetric padding (5 + length * 10 + 5)', () => {
    // "Context" = 7 chars => 5 + 7 * 10 + 5 = 80
    const svg = createSectionLabel({
      text: 'Context',
      position: { x: 0, y: 0 },
    });

    expect(svg).toContain('width="80"');
  });

  it('produces correct width for "Core Structure" (14 chars)', () => {
    // 14 chars => 5 + 14 * 10 + 5 = 150
    const svg = createSectionLabel({
      text: 'Core Structure',
      position: { x: 0, y: 0 },
    });

    expect(svg).toContain('width="150"');
  });

  it('wraps output in <g> with transform for position', () => {
    const svg = createSectionLabel({
      text: 'Test',
      position: { x: 10, y: 20 },
    });

    expect(svg).toContain('transform="translate(10, 20)"');
  });

  it('centers text horizontally using text-anchor:middle', () => {
    // "Test" = 4 chars => width = 5 + 4*10 + 5 = 50, center = 25
    const svg = createSectionLabel({
      text: 'Test',
      position: { x: 0, y: 0 },
    });

    expect(svg).toContain('x="25"');
    expect(svg).toContain('text-anchor:middle');
  });

  it('applies correct CSS classes for background and text', () => {
    const svg = createSectionLabel({
      text: 'Test',
      position: { x: 0, y: 0 },
    });

    expect(svg).toContain('class="group-label-bg"');
    expect(svg).toContain('class="group-label"');
  });
});

describe('createEdge', () => {
  const solidEdge = {
    from: { x: 100, y: 50 },
    to: { x: 200, y: 150 },
    relationship: 'hasSequences',
    isDashed: false,
  } as const;

  const dashedEdge = {
    from: { x: 100, y: 50 },
    to: { x: 200, y: 150 },
    relationship: 'belongsTo (inferred)',
    isDashed: true,
  } as const;

  it('includes <title> with relationship text for tooltip', () => {
    const svg = createEdge(solidEdge);

    expect(svg).toContain('<title>hasSequences</title>');
  });

  it('uses "edge" and "edge-outline" classes for solid edges', () => {
    const svg = createEdge(solidEdge);

    expect(svg).toContain('class="edge-outline"');
    expect(svg).toContain('class="edge"');
  });

  it('uses "edge-dashed" and "edge-dashed-outline" classes for dashed edges', () => {
    const svg = createEdge(dashedEdge);

    expect(svg).toContain('class="edge-dashed-outline"');
    expect(svg).toContain('class="edge-dashed"');
  });

  it('renders outline BEFORE colored line for proper layering', () => {
    const svg = createEdge(solidEdge);

    const outlineIndex = svg.indexOf('edge-outline');
    const lineIndex = svg.indexOf('"edge"');

    expect(outlineIndex).toBeLessThan(lineIndex);
  });

  it('sets correct x1, y1, x2, y2 coordinates from from/to positions', () => {
    const svg = createEdge(solidEdge);

    expect(svg).toContain('x1="100"');
    expect(svg).toContain('y1="50"');
    expect(svg).toContain('x2="200"');
    expect(svg).toContain('y2="150"');
  });
});

describe('createSection', () => {
  const sectionConfig = {
    id: 'context-section',
    label: 'Context',
    position: { x: 20, y: 40 },
    labelPosition: { x: 0, y: 0 },
    nodes: [
      {
        id: 'node-phase',
        label: 'Phase',
        width: 100,
        height: 35,
        position: { x: 0, y: 25 },
        cssClass: 'node-context',
      },
      {
        id: 'node-keystage',
        label: 'Key Stage',
        width: 130,
        height: 35,
        position: { x: 175, y: 25 },
        cssClass: 'node-context',
      },
    ],
  } as const;

  it('wraps output in <g> with id and transform for section position', () => {
    const svg = createSection(sectionConfig);

    expect(svg).toContain('<g id="context-section"');
    expect(svg).toContain('transform="translate(20, 40)"');
  });

  it('includes section label from createSectionLabel', () => {
    const svg = createSection(sectionConfig);

    // The label "Context" should be present
    expect(svg).toContain('>Context</text>');
    expect(svg).toContain('class="group-label-bg"');
  });

  it('includes all nodes nested inside section group', () => {
    const svg = createSection(sectionConfig);

    // Both nodes should be present
    expect(svg).toContain('id="node-phase"');
    expect(svg).toContain('id="node-keystage"');
    expect(svg).toContain('>Phase</text>');
    expect(svg).toContain('>Key Stage</text>');
  });

  it('creates correct number of node groups for nodes array', () => {
    const svg = createSection(sectionConfig);

    // Count node groups - should have 2 nodes
    const nodeMatches = svg.match(/id="node-/g);
    expect(nodeMatches).toHaveLength(2);
  });
});

describe('getNodeCenter', () => {
  it('calculates absolute center from section position and node config', () => {
    const sectionPosition = { x: 20, y: 40 };
    const nodeConfig: NodeConfig = {
      id: 'node-test',
      label: 'Test',
      width: 100,
      height: 40,
      position: { x: 10, y: 25 },
      cssClass: 'node-core',
    };

    const center = getNodeCenter(sectionPosition, nodeConfig);

    // x = 20 + 10 + 100/2 = 80
    // y = 40 + 25 + 40/2 = 85
    expect(center.x).toBe(80);
    expect(center.y).toBe(85);
  });
});

describe('findNodeInSections', () => {
  const testSections: readonly SectionConfig[] = [
    {
      id: 'section-a',
      label: 'Section A',
      position: { x: 10, y: 20 },
      labelPosition: { x: 0, y: 0 },
      nodes: [
        {
          id: 'node-alpha',
          label: 'Alpha',
          width: 100,
          height: 35,
          position: { x: 5, y: 30 },
          cssClass: 'node-core',
        },
        {
          id: 'node-beta',
          label: 'Beta',
          width: 100,
          height: 35,
          position: { x: 120, y: 30 },
          cssClass: 'node-core',
        },
      ],
    },
    {
      id: 'section-b',
      label: 'Section B',
      position: { x: 300, y: 100 },
      labelPosition: { x: 0, y: 0 },
      nodes: [
        {
          id: 'node-gamma',
          label: 'Gamma',
          width: 80,
          height: 40,
          position: { x: 0, y: 25 },
          cssClass: 'node-content',
        },
      ],
    },
  ];

  it('finds node in first section and returns node with section position', () => {
    const result = findNodeInSections('node-alpha', testSections);

    expect(result).not.toBeNull();
    expect(result?.node.id).toBe('node-alpha');
    expect(result?.sectionPosition).toEqual({ x: 10, y: 20 });
  });

  it('finds node in second section', () => {
    const result = findNodeInSections('node-gamma', testSections);

    expect(result).not.toBeNull();
    expect(result?.node.id).toBe('node-gamma');
    expect(result?.sectionPosition).toEqual({ x: 300, y: 100 });
  });

  it('returns null for non-existent node', () => {
    const result = findNodeInSections('node-nonexistent', testSections);

    expect(result).toBeNull();
  });
});

describe('createEdgeBetweenNodes', () => {
  const testSections: readonly SectionConfig[] = [
    {
      id: 'section-a',
      label: 'Section A',
      position: { x: 0, y: 0 },
      labelPosition: { x: 0, y: 0 },
      nodes: [
        {
          id: 'node-from',
          label: 'From',
          width: 100,
          height: 40,
          position: { x: 0, y: 0 },
          cssClass: 'node-core',
        },
      ],
    },
    {
      id: 'section-b',
      label: 'Section B',
      position: { x: 200, y: 100 },
      labelPosition: { x: 0, y: 0 },
      nodes: [
        {
          id: 'node-to',
          label: 'To',
          width: 80,
          height: 40,
          position: { x: 0, y: 0 },
          cssClass: 'node-content',
        },
      ],
    },
  ];

  it('creates edge config with calculated node center positions', () => {
    const edge = createEdgeBetweenNodes('node-from', 'node-to', 'hasRelation', false, testSections);

    // From node center: x=0+0+100/2=50, y=0+0+40/2=20
    // To node center: x=200+0+80/2=240, y=100+0+40/2=120
    expect(edge.from).toEqual({ x: 50, y: 20 });
    expect(edge.to).toEqual({ x: 240, y: 120 });
    expect(edge.relationship).toBe('hasRelation');
    expect(edge.isDashed).toBe(false);
  });

  it('creates dashed edge when isDashed is true', () => {
    const edge = createEdgeBetweenNodes('node-from', 'node-to', 'inferred', true, testSections);

    expect(edge.isDashed).toBe(true);
  });

  it('throws error when from node not found', () => {
    expect(() =>
      createEdgeBetweenNodes('nonexistent', 'node-to', 'rel', false, testSections),
    ).toThrow('Node not found: nonexistent');
  });

  it('throws error when to node not found', () => {
    expect(() =>
      createEdgeBetweenNodes('node-from', 'nonexistent', 'rel', false, testSections),
    ).toThrow('Node not found: nonexistent');
  });
});

describe('createEdgeBetweenNodes with FULL_SECTIONS', () => {
  // Use actual FULL_SECTIONS data to verify edge calculations
  // These tests document the expected coordinates for critical edges

  // FULL_CORE_STRUCTURE_SECTION: position { x: 18, y: 118 }
  // node-lesson: position { x: 602, y: 12 }, size 100x40
  // Expected lesson center: (18+602+50, 118+12+20) = (670, 150)

  // FULL_CONTENT_SECTION: position { x: 618, y: 218 }
  // node-quiz: position { x: 2, y: 32 }, size 100x35
  // Expected quiz center: (618+2+50, 218+32+17.5) = (670, 267.5)

  const FULL_CORE_STRUCTURE_SECTION: SectionConfig = {
    id: 'core-structure-section',
    label: 'Core Structure',
    position: { x: 18, y: 118 },
    labelPosition: { x: 0, y: 60 },
    nodes: [
      {
        id: 'node-lesson',
        label: 'Lesson',
        width: 100,
        height: 40,
        position: { x: 602, y: 12 },
        cssClass: 'node-core',
      },
    ],
  };

  const FULL_CONTENT_SECTION: SectionConfig = {
    id: 'content-section',
    label: 'Content',
    position: { x: 618, y: 218 },
    labelPosition: { x: 0, y: 0 },
    nodes: [
      {
        id: 'node-quiz',
        label: 'Quiz',
        width: 100,
        height: 35,
        position: { x: 2, y: 32 },
        cssClass: 'node-content',
      },
    ],
  };

  const FULL_METADATA_SECTION: SectionConfig = {
    id: 'metadata-section',
    label: 'Metadata',
    position: { x: 808, y: 518 },
    labelPosition: { x: 0, y: 0 },
    nodes: [
      {
        id: 'node-keyword',
        label: 'Keyword',
        width: 120,
        height: 35,
        position: { x: 2, y: 32 },
        cssClass: 'node-metadata',
      },
    ],
  };

  const testSections: readonly SectionConfig[] = [
    FULL_CORE_STRUCTURE_SECTION,
    FULL_CONTENT_SECTION,
    FULL_METADATA_SECTION,
  ];

  it('calculates correct lesson center at (670, 150)', () => {
    const edge = createEdgeBetweenNodes(
      'node-lesson',
      'node-quiz',
      'hasQuizzes',
      false,
      testSections,
    );
    // Lesson center: 18 + 602 + 100/2 = 670, 118 + 12 + 40/2 = 150
    expect(edge.from).toEqual({ x: 670, y: 150 });
  });

  it('calculates correct quiz center at (670, 267.5)', () => {
    const edge = createEdgeBetweenNodes(
      'node-lesson',
      'node-quiz',
      'hasQuizzes',
      false,
      testSections,
    );
    // Quiz center: 618 + 2 + 100/2 = 670, 218 + 32 + 35/2 = 267.5
    expect(edge.to).toEqual({ x: 670, y: 267.5 });
  });

  it('calculates correct keyword center for hasKeywords edge', () => {
    const edge = createEdgeBetweenNodes(
      'node-lesson',
      'node-keyword',
      'hasKeywords',
      false,
      testSections,
    );
    // Keyword center: 808 + 2 + 120/2 = 870, 518 + 32 + 35/2 = 567.5
    expect(edge.from).toEqual({ x: 670, y: 150 }); // same lesson center
    expect(edge.to).toEqual({ x: 870, y: 567.5 });
  });
});
