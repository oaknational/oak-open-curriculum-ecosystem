/**
 * Integration tests for the prior knowledge graph JSON writer.
 *
 * @remarks
 * Tests actual filesystem output: directory creation and file content.
 * The runtime-loading test (child process) lives in the E2E tier at
 * `e2e-tests/generators/write-json-graph-file.e2e.test.ts`.
 */
import { mkdtemp, readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { describe, expect, it } from 'vitest';

import type { PriorKnowledgeGraph } from './prior-knowledge-graph-generator.js';
import { writePriorKnowledgeGraphAsJson } from './write-json-graph-file.js';

const sampleGraph = {
  version: '1.0.0',
  generatedAt: '2026-03-29T12:00:00Z',
  sourceVersion: 'test-v1',
  stats: {
    unitsWithPrerequisites: 1,
    totalEdges: 1,
    subjectsCovered: ['maths'],
  },
  nodes: [
    {
      unitSlug: 'fractions-all-years',
      unitTitle: 'Fractions All Years',
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

describe('writePriorKnowledgeGraphAsJson', () => {
  it('writes data.json, types.ts, and index.ts into a prior-knowledge-graph directory', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'oak-prior-knowledge-graph-'));

    try {
      const outputDir = await writePriorKnowledgeGraphAsJson(sampleGraph, tempDir);

      expect(outputDir).toBe(join(tempDir, 'prior-knowledge-graph'));

      const dataJson = await readFile(join(outputDir, 'data.json'), 'utf-8');
      const typesModule = await readFile(join(outputDir, 'types.ts'), 'utf-8');
      const indexModule = await readFile(join(outputDir, 'index.ts'), 'utf-8');

      expect(JSON.parse(dataJson)).toStrictEqual({
        version: '1.0.0',
        generatedAt: '2026-03-29T12:00:00Z',
        sourceVersion: 'test-v1',
        stats: {
          unitsWithPrerequisites: 1,
          totalEdges: 1,
          subjectsCovered: ['maths'],
        },
        nodes: [
          {
            unitSlug: 'fractions-all-years',
            unitTitle: 'Fractions All Years',
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
      });
      expect(typesModule).toContain('export interface PriorKnowledgeGraph');
      expect(indexModule).toContain("import { createRequire } from 'node:module';");
      expect(indexModule).toContain('const require = createRequire(import.meta.url);');
      expect(indexModule).toContain(
        "const data: JsonPriorKnowledgeGraph = require('./data.json');",
      );
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
