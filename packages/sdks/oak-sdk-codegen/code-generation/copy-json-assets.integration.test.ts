import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { copyJsonAssets, findJsonAssets } from './copy-json-assets.js';

describe('findJsonAssets', () => {
  it('returns sorted JSON files from nested directories only', async () => {
    const tempDir = mkdtempSync(path.join(os.tmpdir(), 'copy-json-assets-find-'));
    const sourceRoot = path.join(tempDir, 'src');
    const nestedDir = path.join(sourceRoot, 'generated', 'vocab');

    try {
      mkdirSync(nestedDir, { recursive: true });
      writeFileSync(path.join(sourceRoot, 'root.json'), '{"root":true}');
      writeFileSync(path.join(sourceRoot, 'ignore.ts'), 'export {};');
      writeFileSync(path.join(sourceRoot, 'ignore.txt'), 'ignore');
      writeFileSync(path.join(nestedDir, 'graph.json'), '{"graph":true}', {
        flag: 'w',
        encoding: 'utf8',
      });

      const jsonFiles = await findJsonAssets(sourceRoot);

      expect(jsonFiles).toEqual([
        path.join(nestedDir, 'graph.json'),
        path.join(sourceRoot, 'root.json'),
      ]);
    } finally {
      rmSync(tempDir, { force: true, recursive: true });
    }
  });
});

describe('copyJsonAssets', () => {
  it('copies JSON assets into dist while preserving relative paths', async () => {
    const tempDir = mkdtempSync(path.join(os.tmpdir(), 'copy-json-assets-copy-'));
    const sourceRoot = path.join(tempDir, 'src');
    const destinationRoot = path.join(tempDir, 'dist');
    const nestedDir = path.join(sourceRoot, 'generated', 'vocab', 'prerequisite-graph');
    const jsonPath = path.join(nestedDir, 'data.json');
    const sourceIndexPath = path.join(nestedDir, 'index.ts');
    const destinationJsonPath = path.join(
      destinationRoot,
      'generated',
      'vocab',
      'prerequisite-graph',
      'data.json',
    );
    const destinationIndexPath = path.join(
      destinationRoot,
      'generated',
      'vocab',
      'prerequisite-graph',
      'index.ts',
    );

    try {
      mkdirSync(nestedDir, { recursive: true });
      writeFileSync(jsonPath, '{"edges":[]}', { flag: 'w', encoding: 'utf8' });
      writeFileSync(sourceIndexPath, 'export {};', { flag: 'w', encoding: 'utf8' });

      const copiedFiles = await copyJsonAssets(sourceRoot, destinationRoot);

      expect(copiedFiles).toEqual([destinationJsonPath]);
      expect(existsSync(destinationJsonPath)).toBe(true);
      expect(readFileSync(destinationJsonPath, 'utf8')).toBe('{"edges":[]}');
      expect(existsSync(destinationIndexPath)).toBe(false);
    } finally {
      rmSync(tempDir, { force: true, recursive: true });
    }
  });
});
