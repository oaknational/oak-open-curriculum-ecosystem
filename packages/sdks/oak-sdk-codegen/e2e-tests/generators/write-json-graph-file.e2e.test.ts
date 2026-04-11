/**
 * E2E test for JSON graph file runtime loading.
 *
 * @remarks
 * Spawns a child process to verify the generated prior-knowledge-graph
 * loader works under plain Node ESM. This proves the three-file output
 * (data.json, types.ts, index.ts) loads correctly at runtime, not just
 * at compile time.
 *
 * This test is E2E (not integration) because it spawns a child process.
 * See testing-strategy.md: "Test code MUST NOT spawn child processes"
 * in in-process tests.
 */
import { execFile } from 'child_process';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { promisify } from 'util';

import { describe, expect, it } from 'vitest';

import type { PriorKnowledgeGraph } from '../../src/bulk/generators/prior-knowledge-graph-generator.js';
import { writePriorKnowledgeGraphAsJson } from '../../src/bulk/generators/write-json-graph-file.js';

const execFileAsync = promisify(execFile);

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

describe('writePriorKnowledgeGraphAsJson runtime loading', () => {
  it('loads under plain Node ESM and restores explicit undefined years', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'oak-prior-knowledge-graph-runtime-'));

    try {
      const outputDir = await writePriorKnowledgeGraphAsJson(sampleGraph, tempDir);
      const moduleUrl = pathToFileURL(join(outputDir, 'index.ts')).href;
      const { stdout } = await execFileAsync(process.execPath, [
        '--experimental-strip-types',
        '--input-type=module',
        '-e',
        `import(${JSON.stringify(moduleUrl)}).then(({ priorKnowledgeGraph }) => {
          const firstNode = priorKnowledgeGraph.nodes[0];
          const firstEdge = priorKnowledgeGraph.edges[0];
          console.log(JSON.stringify({
            graph: priorKnowledgeGraph,
            firstNodeHasYear: Object.prototype.hasOwnProperty.call(firstNode, 'year'),
            firstNodeYearType: typeof firstNode.year,
            firstEdgeRel: firstEdge?.rel,
            firstEdgeSource: firstEdge?.source,
          }));
        });`,
      ]);

      const payload: unknown = JSON.parse(stdout);

      expect(payload).toStrictEqual({
        graph: {
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
        },
        firstNodeHasYear: true,
        firstNodeYearType: 'undefined',
        firstEdgeRel: 'prerequisiteFor',
        firstEdgeSource: 'thread',
      });
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
