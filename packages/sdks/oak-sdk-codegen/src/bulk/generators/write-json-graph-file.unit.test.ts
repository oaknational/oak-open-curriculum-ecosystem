import { describe, expect, it } from 'vitest';

import { serializeDatasetToJson } from './write-json-dataset.js';
import type { PriorKnowledgeGraph } from './prior-knowledge-graph-generator.js';
import { priorKnowledgeGraphDescriptor } from './write-json-graph-file.js';

const sampleGraph = {
  version: '1.0.0',
  generatedAt: '2026-03-29T12:00:00Z',
  sourceVersion: 'test-v1',
  stats: {
    unitsWithPrerequisites: 2,
    totalEdges: 1,
    subjectsCovered: ['maths'],
  },
  nodes: [
    {
      unitSlug: 'fractions-year-2',
      unitTitle: 'Fractions Year 2',
      subject: 'maths',
      keyStage: 'ks1',
      year: 2,
      priorKnowledge: [],
      threadSlugs: ['number-fractions'],
    },
    {
      unitSlug: 'fractions-all-years',
      unitTitle: "Fractions Year 3's",
      subject: 'maths',
      keyStage: 'ks2',
      year: undefined,
      priorKnowledge: ['fractions-year-2'],
      threadSlugs: ['number-fractions'],
    },
  ],
  edges: [
    {
      from: 'fractions-year-2',
      to: 'fractions-all-years',
      rel: 'prerequisiteFor',
      source: 'thread',
    },
  ],
  seeAlso: 'get-prior-knowledge-graph',
} satisfies PriorKnowledgeGraph;

const expectedJsonGraph = {
  version: '1.0.0',
  generatedAt: '2026-03-29T12:00:00Z',
  sourceVersion: 'test-v1',
  stats: {
    unitsWithPrerequisites: 2,
    totalEdges: 1,
    subjectsCovered: ['maths'],
  },
  nodes: [
    {
      unitSlug: 'fractions-year-2',
      unitTitle: 'Fractions Year 2',
      subject: 'maths',
      keyStage: 'ks1',
      year: 2,
      priorKnowledge: [],
      threadSlugs: ['number-fractions'],
    },
    {
      unitSlug: 'fractions-all-years',
      unitTitle: "Fractions Year 3's",
      subject: 'maths',
      keyStage: 'ks2',
      priorKnowledge: ['fractions-year-2'],
      threadSlugs: ['number-fractions'],
    },
  ],
  edges: [
    {
      from: 'fractions-year-2',
      to: 'fractions-all-years',
      rel: 'prerequisiteFor',
      source: 'thread',
    },
  ],
  seeAlso: 'get-prior-knowledge-graph',
};

describe('serializeDatasetToJson with prior knowledge graph', () => {
  it('produces valid JSON from the graph data', () => {
    const json = serializeDatasetToJson(sampleGraph);
    const parsed: unknown = JSON.parse(json);

    expect(parsed).toStrictEqual(expectedJsonGraph);
  });

  it('preserves special characters in titles without manual escaping', () => {
    const json = serializeDatasetToJson(sampleGraph);

    expect(json).toContain('"Fractions Year 3\'s"');
  });

  it('omits undefined fields so the loader can restore them explicitly', () => {
    const json = serializeDatasetToJson(sampleGraph);
    const parsed: unknown = JSON.parse(json);

    expect(parsed).toStrictEqual(expectedJsonGraph);
  });

  it('produces formatted JSON rather than a minified blob', () => {
    const json = serializeDatasetToJson(sampleGraph);

    expect(json).toContain('\n');
    expect(json.split('\n').length).toBeGreaterThan(5);
  });
});

describe('priorKnowledgeGraphDescriptor.typesModuleContent', () => {
  it('contains the published prior knowledge graph interfaces', () => {
    const content = priorKnowledgeGraphDescriptor.typesModuleContent;

    expect(content).toContain('export interface PriorKnowledgeEdge');
    expect(content).toContain('export interface PriorKnowledgeNode');
    expect(content).toContain('export interface PriorKnowledgeGraphStats');
    expect(content).toContain('export interface PriorKnowledgeGraph');
  });

  it('preserves the published prior knowledge graph contract', () => {
    const content = priorKnowledgeGraphDescriptor.typesModuleContent;

    expect(content).toContain("readonly rel: 'prerequisiteFor';");
    expect(content).toContain("readonly source: 'thread' | 'priorKnowledge';");
    expect(content).toContain('readonly year: number | undefined;');
  });

  it('retains readonly structure for arrays and properties', () => {
    const content = priorKnowledgeGraphDescriptor.typesModuleContent;

    expect(content).toContain('readonly nodes: readonly PriorKnowledgeNode[];');
    expect(content).toContain('readonly threadSlugs: readonly string[];');
  });

  it('does not contain eslint-disable directives', () => {
    const content = priorKnowledgeGraphDescriptor.typesModuleContent;

    expect(content).not.toContain('eslint-disable');
  });
});

describe('priorKnowledgeGraphDescriptor.indexModuleContent', () => {
  it('imports from types.js and data.json', () => {
    const content = priorKnowledgeGraphDescriptor.indexModuleContent;

    expect(content).toContain("from 'node:module'");
    expect(content).toContain("from './types.js'");
    expect(content).toContain('const require = createRequire(import.meta.url);');
    expect(content).toContain("const data: JsonPriorKnowledgeGraph = require('./data.json');");
  });

  it('normalises JSON data into the published graph shape and re-exports the local types', () => {
    const content = priorKnowledgeGraphDescriptor.indexModuleContent;

    expect(content).toContain('function createPriorKnowledgeEdge');
    expect(content).toContain('function createPriorKnowledgeNode');
    expect(content).toContain('function createPriorKnowledgeGraph');
    expect(content).toContain(
      'export const priorKnowledgeGraph: PriorKnowledgeGraph = createPriorKnowledgeGraph(data);',
    );
    expect(content).toContain('PriorKnowledgeNode');
    expect(content).toContain('PriorKnowledgeEdge');
    expect(content).toContain('PriorKnowledgeGraphStats');
  });

  it('does not contain eslint-disable directives or type assertions', () => {
    const content = priorKnowledgeGraphDescriptor.indexModuleContent;

    expect(content).not.toContain('eslint-disable');
    expect(content).not.toMatch(/\bas\b/);
  });
});
