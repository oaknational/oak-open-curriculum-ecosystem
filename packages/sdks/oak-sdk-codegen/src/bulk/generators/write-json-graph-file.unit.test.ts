import { describe, expect, it } from 'vitest';

import { serializeDatasetToJson } from './write-json-dataset.js';
import type { PrerequisiteGraph } from './prerequisite-graph-generator.js';
import { prerequisiteGraphDescriptor } from './write-json-graph-file.js';

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
  seeAlso: 'get-prerequisite-graph',
} satisfies PrerequisiteGraph;

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
  seeAlso: 'get-prerequisite-graph',
};

describe('serializeDatasetToJson with prerequisite graph', () => {
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

describe('prerequisiteGraphDescriptor.typesModuleContent', () => {
  it('contains the published prerequisite graph interfaces', () => {
    const content = prerequisiteGraphDescriptor.typesModuleContent;

    expect(content).toContain('export interface PrerequisiteEdge');
    expect(content).toContain('export interface PrerequisiteNode');
    expect(content).toContain('export interface PrerequisiteGraphStats');
    expect(content).toContain('export interface PrerequisiteGraph');
  });

  it('preserves the published prerequisite graph contract', () => {
    const content = prerequisiteGraphDescriptor.typesModuleContent;

    expect(content).toContain("readonly rel: 'prerequisiteFor';");
    expect(content).toContain("readonly source: 'thread' | 'priorKnowledge';");
    expect(content).toContain('readonly year: number | undefined;');
  });

  it('retains readonly structure for arrays and properties', () => {
    const content = prerequisiteGraphDescriptor.typesModuleContent;

    expect(content).toContain('readonly nodes: readonly PrerequisiteNode[];');
    expect(content).toContain('readonly threadSlugs: readonly string[];');
  });

  it('does not contain eslint-disable directives', () => {
    const content = prerequisiteGraphDescriptor.typesModuleContent;

    expect(content).not.toContain('eslint-disable');
  });
});

describe('prerequisiteGraphDescriptor.indexModuleContent', () => {
  it('imports from types.js and data.json', () => {
    const content = prerequisiteGraphDescriptor.indexModuleContent;

    expect(content).toContain("from 'node:module'");
    expect(content).toContain("from './types.js'");
    expect(content).toContain('const require = createRequire(import.meta.url);');
    expect(content).toContain("const data: JsonPrerequisiteGraph = require('./data.json');");
  });

  it('normalises JSON data into the published graph shape and re-exports the local types', () => {
    const content = prerequisiteGraphDescriptor.indexModuleContent;

    expect(content).toContain('function createPrerequisiteEdge');
    expect(content).toContain('function createPrerequisiteNode');
    expect(content).toContain('function createPrerequisiteGraph');
    expect(content).toContain(
      'export const prerequisiteGraph: PrerequisiteGraph = createPrerequisiteGraph(data);',
    );
    expect(content).toContain('PrerequisiteNode');
    expect(content).toContain('PrerequisiteEdge');
    expect(content).toContain('PrerequisiteGraphStats');
  });

  it('does not contain eslint-disable directives or type assertions', () => {
    const content = prerequisiteGraphDescriptor.indexModuleContent;

    expect(content).not.toContain('eslint-disable');
    expect(content).not.toMatch(/\bas\b/);
  });
});
