import { describe, expect, it } from 'vitest';

import { createInMemoryFileSystem } from '../src/io/test-helpers/in-memory-file-system.js';
import { copyJsonAssets, findJsonAssets } from './copy-json-assets.js';

describe('findJsonAssets', () => {
  it('returns sorted JSON files from nested directories only', async () => {
    const fs = createInMemoryFileSystem({
      '/pkg/src/root.json': '{"root":true}',
      '/pkg/src/ignore.ts': 'export {};',
      '/pkg/src/ignore.txt': 'ignore',
      '/pkg/src/generated/vocab/graph.json': '{"graph":true}',
    });

    const jsonFiles = await findJsonAssets('/pkg/src', fs);

    expect(jsonFiles).toEqual(['/pkg/src/generated/vocab/graph.json', '/pkg/src/root.json']);
  });
});

describe('copyJsonAssets', () => {
  it('copies JSON assets into dist while preserving relative paths', async () => {
    const fs = createInMemoryFileSystem({
      '/pkg/src/generated/vocab/prerequisite-graph/data.json': '{"edges":[]}',
      '/pkg/src/generated/vocab/prerequisite-graph/index.ts': 'export {};',
    });

    const copiedFiles = await copyJsonAssets('/pkg/src', '/pkg/dist', fs);

    expect(copiedFiles).toEqual(['/pkg/dist/generated/vocab/prerequisite-graph/data.json']);
    expect(fs.files.get('/pkg/dist/generated/vocab/prerequisite-graph/data.json')).toBe(
      '{"edges":[]}',
    );
    expect(fs.files.has('/pkg/dist/generated/vocab/prerequisite-graph/index.ts')).toBe(false);
  });
});
