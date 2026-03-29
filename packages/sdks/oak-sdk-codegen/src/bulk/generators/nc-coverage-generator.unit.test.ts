/**
 * Unit tests for the NC coverage graph generator.
 *
 * @remarks
 * Tests the generation of National Curriculum coverage graph data
 * from extracted NC statements. The graph helps curriculum planners
 * ensure NC coverage and identify gaps.
 */
import { describe, expect, it } from 'vitest';

import type { ExtractedNCStatement } from '../extractors/index.js';

import {
  generateNCCoverageGraphData,
  serializeNCCoverageGraph,
  type NCCoverageGraph,
  type NCStatementNode,
} from './nc-coverage-generator.js';

/**
 * Creates a test NC statement.
 */
function createNCStatement(overrides: Partial<ExtractedNCStatement> = {}): ExtractedNCStatement {
  return {
    statement: 'Identify and describe the functions of different parts of flowering plants',
    unitSlug: 'plants-unit',
    unitTitle: 'Plants and Their Functions',
    subject: 'science',
    keyStage: 'ks2',
    ...overrides,
  };
}

describe('generateNCCoverageGraphData', () => {
  it('returns an NCCoverageGraph structure', () => {
    const statements: readonly ExtractedNCStatement[] = [createNCStatement()];

    const result = generateNCCoverageGraphData(statements, '2025-12-26');

    expect(result).toBeDefined();
    expect(result.version).toBe('1.0.0');
    expect(result.generatedAt).toBeDefined();
    expect(result.sourceVersion).toBe('2025-12-26');
    expect(result.stats).toBeDefined();
    expect(result.nodes).toBeDefined();
    expect(result.seeAlso).toBeDefined();
  });

  it('includes all statements as nodes', () => {
    const statements: readonly ExtractedNCStatement[] = [
      createNCStatement({ statement: 'Statement 1' }),
      createNCStatement({ statement: 'Statement 2' }),
      createNCStatement({ statement: 'Statement 3' }),
    ];

    const result = generateNCCoverageGraphData(statements, '2025-12-26');

    expect(result.nodes).toHaveLength(3);
    expect(result.stats.totalStatements).toBe(3);
  });

  it('preserves statement text', () => {
    const statements: readonly ExtractedNCStatement[] = [
      createNCStatement({
        statement: 'Understand the process of photosynthesis',
      }),
    ];

    const result = generateNCCoverageGraphData(statements, '2025-12-26');

    const node = result.nodes[0];
    expect(node?.statement).toBe('Understand the process of photosynthesis');
  });

  it('preserves unit context', () => {
    const statements: readonly ExtractedNCStatement[] = [
      createNCStatement({
        unitSlug: 'my-unit-slug',
        unitTitle: 'My Unit Title',
      }),
    ];

    const result = generateNCCoverageGraphData(statements, '2025-12-26');

    const node = result.nodes[0];
    expect(node?.unitSlug).toBe('my-unit-slug');
    expect(node?.unitTitle).toBe('My Unit Title');
  });

  it('tracks subject and key stage', () => {
    const statements: readonly ExtractedNCStatement[] = [
      createNCStatement({ subject: 'maths', keyStage: 'ks3' }),
    ];

    const result = generateNCCoverageGraphData(statements, '2025-12-26');

    const node = result.nodes[0];
    expect(node?.subject).toBe('maths');
    expect(node?.keyStage).toBe('ks3');
  });

  it('calculates statistics by subject', () => {
    const statements: readonly ExtractedNCStatement[] = [
      createNCStatement({ subject: 'science' }),
      createNCStatement({ subject: 'science' }),
      createNCStatement({ subject: 'maths' }),
    ];

    const result = generateNCCoverageGraphData(statements, '2025-12-26');

    expect(result.stats.bySubject['science']).toBe(2);
    expect(result.stats.bySubject['maths']).toBe(1);
  });

  it('calculates statistics by key stage', () => {
    const statements: readonly ExtractedNCStatement[] = [
      createNCStatement({ keyStage: 'ks2' }),
      createNCStatement({ keyStage: 'ks2' }),
      createNCStatement({ keyStage: 'ks3' }),
    ];

    const result = generateNCCoverageGraphData(statements, '2025-12-26');

    expect(result.stats.byKeyStage['ks2']).toBe(2);
    expect(result.stats.byKeyStage['ks3']).toBe(1);
  });

  it('lists subjects covered', () => {
    const statements: readonly ExtractedNCStatement[] = [
      createNCStatement({ subject: 'science' }),
      createNCStatement({ subject: 'maths' }),
      createNCStatement({ subject: 'english' }),
    ];

    const result = generateNCCoverageGraphData(statements, '2025-12-26');

    expect(result.stats.subjectsCovered).toContain('science');
    expect(result.stats.subjectsCovered).toContain('maths');
    expect(result.stats.subjectsCovered).toContain('english');
    expect(result.stats.subjectsCovered).toHaveLength(3);
  });

  it('tracks unique units per statement', () => {
    const statements: readonly ExtractedNCStatement[] = [
      createNCStatement({ unitSlug: 'unit-1' }),
      createNCStatement({ unitSlug: 'unit-2' }),
    ];

    const result = generateNCCoverageGraphData(statements, '2025-12-26');

    expect(result.stats.uniqueUnits).toBe(2);
  });
});

describe('NCStatementNode type', () => {
  it('has all required fields', () => {
    const statements: readonly ExtractedNCStatement[] = [createNCStatement()];

    const result = generateNCCoverageGraphData(statements, '2025-12-26');

    expect(result.nodes[0]).toBeDefined();
    const node = result.nodes[0];
    if (!node) {
      throw new Error('Expected node');
    }

    const typedNode: NCStatementNode = node;
    expect(typeof typedNode.statement).toBe('string');
    expect(typeof typedNode.unitSlug).toBe('string');
    expect(typeof typedNode.unitTitle).toBe('string');
    expect(typeof typedNode.subject).toBe('string');
    expect(typeof typedNode.keyStage).toBe('string');
  });
});

describe('NCCoverageGraph type', () => {
  it('has all required fields', () => {
    const statements: readonly ExtractedNCStatement[] = [createNCStatement()];

    const result: NCCoverageGraph = generateNCCoverageGraphData(statements, '2025-12-26');

    expect(result.version).toBeDefined();
    expect(result.generatedAt).toBeDefined();
    expect(result.sourceVersion).toBeDefined();
    expect(result.stats).toBeDefined();
    expect(result.stats.totalStatements).toBeDefined();
    expect(result.stats.uniqueUnits).toBeDefined();
    expect(result.stats.bySubject).toBeDefined();
    expect(result.stats.byKeyStage).toBeDefined();
    expect(result.stats.subjectsCovered).toBeDefined();
    expect(Array.isArray(result.nodes)).toBe(true);
    expect(result.seeAlso).toBeDefined();
  });
});

describe('serializeNCCoverageGraph', () => {
  it('does not emit eslint-disable directives in generated output', () => {
    const graph = generateNCCoverageGraphData([createNCStatement()], '2025-12-26');

    const serialized = serializeNCCoverageGraph(graph);

    expect(serialized).toContain('export const ncCoverageGraph: NCCoverageGraph = {');
    expect(serialized).not.toContain('eslint-disable');
  });
});
