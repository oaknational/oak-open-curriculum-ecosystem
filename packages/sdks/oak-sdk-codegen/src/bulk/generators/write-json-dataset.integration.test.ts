/**
 * Integration tests for the generic JSON dataset writer.
 *
 * @remarks
 * Tests actual filesystem output: directory creation, file content,
 * and runtime loading of generated modules under Node ESM.
 */
import { mkdtemp, readFile, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { describe, expect, it } from 'vitest';

import { writeJsonDataset, type JsonDatasetDescriptor } from './write-json-dataset.js';

const sampleTypesContent = [
  'export interface TestNode {',
  '  readonly id: string;',
  '  readonly label: string;',
  '}',
  '',
  'export interface TestGraph {',
  '  readonly version: string;',
  '  readonly nodes: readonly TestNode[];',
  '}',
  '',
].join('\n');

const sampleIndexContent = [
  "import { createRequire } from 'node:module';",
  "import type { TestGraph } from './types.js';",
  '',
  'const require = createRequire(import.meta.url);',
  "const data: TestGraph = require('./data.json');",
  '',
  'export const testGraph: TestGraph = data;',
  '',
  "export type { TestGraph, TestNode } from './types.js';",
  '',
].join('\n');

const sampleDescriptor: JsonDatasetDescriptor = {
  directoryName: 'test-dataset',
  typesModuleContent: sampleTypesContent,
  indexModuleContent: sampleIndexContent,
};

const sampleData = {
  version: '1.0.0',
  nodes: [
    { id: 'a', label: 'Alpha' },
    { id: 'b', label: 'Beta' },
  ],
};

describe('writeJsonDataset', () => {
  it('writes data.json, types.ts, and index.ts into a named subdirectory', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'oak-json-dataset-'));

    try {
      const outputDir = await writeJsonDataset(sampleDescriptor, sampleData, tempDir);

      expect(outputDir).toBe(join(tempDir, 'test-dataset'));

      const dataJson = await readFile(join(outputDir, 'data.json'), 'utf-8');
      const typesModule = await readFile(join(outputDir, 'types.ts'), 'utf-8');
      const indexModule = await readFile(join(outputDir, 'index.ts'), 'utf-8');

      expect(JSON.parse(dataJson)).toStrictEqual(sampleData);
      expect(typesModule).toContain('export interface TestNode');
      expect(typesModule).toContain('export interface TestGraph');
      expect(indexModule).toContain("import { createRequire } from 'node:module'");
      expect(indexModule).toContain("const data: TestGraph = require('./data.json')");
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('creates the subdirectory even if it does not exist', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'oak-json-dataset-nested-'));

    try {
      const outputDir = await writeJsonDataset(sampleDescriptor, sampleData, tempDir);

      const dataJson = await readFile(join(outputDir, 'data.json'), 'utf-8');

      expect(JSON.parse(dataJson)).toStrictEqual(sampleData);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  it('does not include eslint-disable directives in any written file', async () => {
    const tempDir = await mkdtemp(join(tmpdir(), 'oak-json-dataset-lint-'));

    try {
      const outputDir = await writeJsonDataset(sampleDescriptor, sampleData, tempDir);

      const typesModule = await readFile(join(outputDir, 'types.ts'), 'utf-8');
      const indexModule = await readFile(join(outputDir, 'index.ts'), 'utf-8');

      expect(typesModule).not.toContain('eslint-disable');
      expect(indexModule).not.toContain('eslint-disable');
    } finally {
      await rm(tempDir, { recursive: true, force: true });
    }
  });
});
