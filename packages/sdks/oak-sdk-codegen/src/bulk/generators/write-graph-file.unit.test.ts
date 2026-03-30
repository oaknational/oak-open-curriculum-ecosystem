import { describe, expect, it } from 'vitest';

import { serializePrerequisiteGraph, serializeThreadProgressionGraph } from './write-graph-file.js';
import type { PrerequisiteGraph } from './prerequisite-graph-generator.js';
import type { ThreadProgressionGraph } from './thread-progression-generator.js';

function createThreadProgressionGraph(): ThreadProgressionGraph {
  return {
    version: '1.0.0',
    generatedAt: '2026-03-29T15:00:00.000Z',
    sourceVersion: '2026-03-29',
    stats: {
      threadCount: 1,
      subjectsCovered: ['maths'],
    },
    threads: [
      {
        slug: 'fractions',
        title: 'Fractions',
        subjects: ['maths'],
        firstYear: 2,
        lastYear: 6,
        unitCount: 2,
        units: ['unit-1', 'unit-2'],
      },
    ],
    seeAlso:
      'Use get-curriculum-model for complete orientation (includes property graph). Use get-prerequisite-graph for unit dependencies.',
  };
}

function createPrerequisiteGraph(): PrerequisiteGraph {
  return {
    version: '1.0.0',
    generatedAt: '2026-03-29T15:00:00.000Z',
    sourceVersion: '2026-03-29',
    stats: {
      unitsWithPrerequisites: 1,
      totalEdges: 1,
      subjectsCovered: ['maths'],
    },
    nodes: [
      {
        unitSlug: 'unit-2',
        unitTitle: 'Equivalent Fractions',
        subject: 'maths',
        keyStage: 'ks2',
        year: 4,
        priorKnowledge: ['Understand simple fractions'],
        threadSlugs: ['fractions'],
      },
    ],
    edges: [
      {
        from: 'unit-1',
        to: 'unit-2',
        rel: 'prerequisiteFor',
        source: 'thread',
      },
    ],
    seeAlso:
      'Use get-curriculum-model for complete orientation (includes property graph). Use get-thread-progressions for learning paths.',
  };
}

describe('serializeThreadProgressionGraph', () => {
  it('does not emit eslint-disable directives in generated output', () => {
    const serialized = serializeThreadProgressionGraph(createThreadProgressionGraph());

    expect(serialized).toContain('export const threadProgressionGraph = {');
    expect(serialized).not.toContain('eslint-disable');
  });
});

describe('serializePrerequisiteGraph', () => {
  it('does not emit eslint-disable directives in generated output', () => {
    const serialized = serializePrerequisiteGraph(createPrerequisiteGraph());

    expect(serialized).toContain('export const prerequisiteGraph: PrerequisiteGraph = {');
    expect(serialized).not.toContain('eslint-disable');
  });
});
