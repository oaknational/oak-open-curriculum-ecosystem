import { describe, expect, it } from 'vitest';

import { loadScopedContentBlocks } from '../../hook-policy/policy-loader.js';
import { type ScopedContentBlockGroup } from '../../hook-policy/types.js';

import {
  findMachineLocalPathHits,
  scanForMachineLocalPaths,
  selectMachineLocalBlock,
  type ScanFile,
} from './validate-no-machine-local-paths-helpers.js';

/** Load the live machine-local block so the controls run against the real pattern set. */
async function loadBlock(): Promise<ScopedContentBlockGroup> {
  const block = selectMachineLocalBlock(await loadScopedContentBlocks());
  if (block === undefined) {
    throw new Error('machine-local-path block missing from .agent/hooks/policy.json');
  }
  return block;
}

describe('findMachineLocalPathHits', () => {
  it('reports the line and column of a hit', () => {
    const hits = findMachineLocalPathHits('f.md', 'ok\nsee /Users/alice/x here\nok', [
      '/Users/[A-Za-z0-9_-]+',
    ]);
    expect(hits).toStrictEqual([{ file: 'f.md', line: 2, column: 5, text: '/Users/alice' }]);
  });

  it('records at most one hit per line', () => {
    const hits = findMachineLocalPathHits('f', '/Users/alice and /Users/bob', [
      '/Users/[A-Za-z0-9_-]+',
    ]);
    expect(hits).toHaveLength(1);
  });
});

describe('machine-local-path patterns (live policy.json set)', () => {
  it('flags user-home and machine-temp absolute paths (positive controls)', async () => {
    const block = await loadBlock();
    const positives = [
      '/Users/alice/code/oak',
      '/home/user/project',
      String.raw`C:\Users\dev\repo`,
      '~/.claude/projects/-Users-alice-code-oak/memory', // flattened Claude project id
      '.cursor/projects/Users-alice-code-oak/transcripts', // flattened Cursor project id
      '/private/tmp/scratch',
      '/var/folders/ab/cd',
    ];
    for (const value of positives) {
      expect(findMachineLocalPathHits('f', value, block.patterns), value).not.toStrictEqual([]);
    }
  });

  it('does NOT flag portable system paths, placeholders, or repo-relative paths (negative controls)', async () => {
    const block = await loadBlock();
    const negatives = [
      '/usr/bin/git', // the S4036 fix — must never be flagged
      '/opt/homebrew/bin/git',
      '/usr/local/bin/git',
      '/tmp/scratch',
      '/Users/<user>/code', // teaching placeholder
      '/Users/<name>/x',
      '~/.claude/projects/<project>/memory', // flattened-id placeholder
      '~/.cache/oak',
      'agent-tools/src/foo.ts',
    ];
    for (const value of negatives) {
      expect(findMachineLocalPathHits('f', value, block.patterns), value).toStrictEqual([]);
    }
  });
});

describe('scanForMachineLocalPaths', () => {
  it('flags an in-scope file but skips a file matched by exclude_paths', async () => {
    const block = await loadBlock();
    const files: ScanFile[] = [
      { path: 'docs/example.md', content: 'path: /Users/alice/x' },
      { path: '.agent/rules/no-machine-local-paths.md', content: 'forbidden: /Users/alice/x' },
    ];
    const hits = scanForMachineLocalPaths(files, block);
    expect(hits.map((hit) => hit.file)).toStrictEqual(['docs/example.md']);
  });
});
