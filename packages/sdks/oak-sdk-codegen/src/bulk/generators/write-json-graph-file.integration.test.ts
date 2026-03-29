import { execFile } from 'child_process';
import { mkdtemp, readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { promisify } from 'util';

import { describe, expect, it } from 'vitest';

import type { PrerequisiteGraph } from './prerequisite-graph-generator.js';
import { writePrerequisiteGraphAsJson } from './write-json-graph-file.js';

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
  seeAlso: 'get-prerequisite-graph',
} satisfies PrerequisiteGraph;

describe('writePrerequisiteGraphAsJson', () => {
  it('writes data.json, types.ts, and index.ts into a prerequisite-graph directory', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'oak-prerequisite-graph-'));

    try {
      const outputDir = await writePrerequisiteGraphAsJson(sampleGraph, tempDir);

      expect(outputDir).toBe(join(tempDir, 'prerequisite-graph'));

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
        seeAlso: 'get-prerequisite-graph',
      });
      expect(typesModule).toContain('export interface PrerequisiteGraph');
      expect(indexModule).toContain("import { createRequire } from 'node:module';");
      expect(indexModule).toContain('const require = createRequire(import.meta.url);');
      expect(indexModule).toContain("const data: JsonPrerequisiteGraph = require('./data.json');");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('loads under plain Node ESM and restores explicit undefined years', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'oak-prerequisite-graph-runtime-'));

    try {
      const outputDir = await writePrerequisiteGraphAsJson(sampleGraph, tempDir);
      const moduleUrl = pathToFileURL(join(outputDir, 'index.ts')).href;
      const { stdout } = await execFileAsync(process.execPath, [
        '--experimental-strip-types',
        '--input-type=module',
        '-e',
        `import(${JSON.stringify(moduleUrl)}).then(({ prerequisiteGraph }) => {
          const firstNode = prerequisiteGraph.nodes[0];
          const firstEdge = prerequisiteGraph.edges[0];
          console.log(JSON.stringify({
            graph: prerequisiteGraph,
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
          seeAlso: 'get-prerequisite-graph',
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
