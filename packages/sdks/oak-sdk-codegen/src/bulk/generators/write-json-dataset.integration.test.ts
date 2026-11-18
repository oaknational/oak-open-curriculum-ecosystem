/**
 * Integration tests for the generic JSON dataset writer: the three-file
 * layout and the verbatim content, written through the in-memory file system.
 */
import { describe, expect, it } from 'vitest';

import { createInMemoryFileSystem } from '../../io/test-helpers/in-memory-file-system.js';
import { writeJsonDataset, type JsonDatasetDescriptor } from './write-json-dataset.js';

const sampleTypesContent = [
  'export interface TestNode {',
  '  readonly id: string;',
  '  readonly label: string;',
  '}',
  '',
].join('\n');

const sampleIndexContent = [
  "import type { TestNode } from './types.js';",
  '',
  "const dataUrl = new URL('./data.json', import.meta.url);",
  'export { dataUrl };',
  "export type { TestNode } from './types.js';",
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
  it('creates the named subdirectory and writes data.json, types.ts and index.ts into it', async () => {
    const fs = createInMemoryFileSystem();

    const outputDir = await writeJsonDataset(sampleDescriptor, sampleData, '/out', fs);

    expect(outputDir).toBe('/out/test-dataset');
    expect(fs.directories.has('/out/test-dataset')).toBe(true);
    expect(JSON.parse(fs.files.get('/out/test-dataset/data.json') ?? '')).toStrictEqual(sampleData);
    expect(fs.files.get('/out/test-dataset/types.ts')).toBe(sampleTypesContent);
    expect(fs.files.get('/out/test-dataset/index.ts')).toBe(sampleIndexContent);
    expect(fs.files.size).toBe(3);
  });
});
