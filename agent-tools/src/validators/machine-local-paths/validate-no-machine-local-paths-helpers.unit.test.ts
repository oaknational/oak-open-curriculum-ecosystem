import { describe, expect, it } from 'vitest';

import { loadScopedContentBlocks } from '../../hook-policy/policy-loader.js';
import { type ScopedContentBlockGroup } from '../../hook-policy/types.js';

import {
  findMachineLocalPathHits,
  scanForMachineLocalPaths,
  selectMachineLocalBlock,
  type ScanFile,
} from './validate-no-machine-local-paths-helpers.js';

/**
 * An inert stand-in used ONLY when the live block is absent: its pattern can
 * never match, so every dependent live-set test fails visibly alongside the
 * existence guard below — absence is loud, and no helper throws
 * (no-throw-statement).
 */
const INERT_BLOCK: ScopedContentBlockGroup = {
  concept: 'machine-local-path-missing',
  patterns: ['(?!never-matches)$never'],
  include_paths: ['**'],
  citation: 'placeholder — the existence guard test reds when this is in use',
};

/** The live machine-local block, or the inert stand-in when absent. */
async function loadBlockOrInert(): Promise<ScopedContentBlockGroup> {
  return selectMachineLocalBlock(await loadScopedContentBlocks()) ?? INERT_BLOCK;
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
  it('the live machine-local-path block exists in policy.json', async () => {
    expect(selectMachineLocalBlock(await loadScopedContentBlocks())).toBeDefined();
  });

  it('flags user-home and machine-temp absolute paths (positive controls)', async () => {
    const block = await loadBlockOrInert();
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
    const block = await loadBlockOrInert();
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
    const block = await loadBlockOrInert();
    const files: ScanFile[] = [
      { path: 'docs/example.md', content: 'path: /Users/alice/x' },
      {
        path: '.agent/rules/important-state-not-in-temp-files.md',
        content: 'forbidden: /Users/alice/x',
      },
    ];
    const hits = scanForMachineLocalPaths(files, block);
    expect(hits.map((hit) => hit.file)).toStrictEqual(['docs/example.md']);
  });
});
