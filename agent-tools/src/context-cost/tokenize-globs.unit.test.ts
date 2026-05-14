import { describe, expect, it } from 'vitest';

import { charsOverFourTokenizer } from './tokenizer.js';
import type { ContextCostFileSystem } from './file-system.js';
import { tokenizeGlobs } from './tokenize-globs.js';

interface FakeEntry {
  readonly matches: readonly string[];
}

function fakeFileSystem(input: {
  readonly globs: Readonly<Record<string, FakeEntry>>;
  readonly files: Readonly<Record<string, string>>;
}): ContextCostFileSystem {
  return {
    expandGlob: async (_cwd, pattern) => input.globs[pattern]?.matches ?? [],
    readFileUtf8: async (absolutePath) => {
      const content = input.files[absolutePath];
      if (content === undefined) {
        throw new Error(`missing fixture ${absolutePath}`);
      }
      return content;
    },
  };
}

describe('tokenizeGlobs', () => {
  it('returns deterministic rows, aggregate counts, and no warnings for matched files', async () => {
    const fs = fakeFileSystem({
      globs: { '*.md': { matches: ['/repo/c.md', '/repo/a.md', '/repo/b.md'] } },
      files: {
        '/repo/a.md': '1234',
        '/repo/b.md': '12345678',
        '/repo/c.md': '123456789012',
      },
    });

    await expect(
      tokenizeGlobs(['*.md'], '/repo', fs, charsOverFourTokenizer),
    ).resolves.toStrictEqual({
      rows: [
        { path: 'a.md', chars: 4, tokens: 1 },
        { path: 'b.md', chars: 8, tokens: 2 },
        { path: 'c.md', chars: 12, tokens: 3 },
      ],
      aggregate: { files: 3, chars: 24, tokens: 6 },
      warnings: [],
    });
  });

  it('deduplicates repeated absolute paths across globs', async () => {
    const fs = fakeFileSystem({
      globs: {
        'a.md': { matches: ['/repo/a.md'] },
        '*.md': { matches: ['/repo/a.md'] },
      },
      files: { '/repo/a.md': '1234' },
    });

    const result = await tokenizeGlobs(['a.md', '*.md'], '/repo', fs, charsOverFourTokenizer);

    expect(result.rows).toHaveLength(1);
    expect(result.aggregate).toStrictEqual({ files: 1, chars: 4, tokens: 1 });
  });

  it('records no-match warnings per unmatched glob', async () => {
    const fs = fakeFileSystem({
      globs: {
        '*.md': { matches: ['/repo/a.md'] },
        '*.MD': { matches: [] },
      },
      files: { '/repo/a.md': '1234' },
    });

    const result = await tokenizeGlobs(['*.md', '*.MD'], '/repo', fs, charsOverFourTokenizer);

    expect(result.warnings).toStrictEqual([{ glob: '*.MD', reason: 'no-matches' }]);
  });

  it('returns an empty aggregate for no globs', async () => {
    const fs = fakeFileSystem({ globs: {}, files: {} });

    await expect(tokenizeGlobs([], '/repo', fs, charsOverFourTokenizer)).resolves.toStrictEqual({
      rows: [],
      aggregate: { files: 0, chars: 0, tokens: 0 },
      warnings: [],
    });
  });

  it('normalises display paths to forward slashes', async () => {
    const fs = fakeFileSystem({
      globs: { '**/*.md': { matches: ['/repo/nested\\file.md'] } },
      files: { '/repo/nested\\file.md': '1234' },
    });

    const result = await tokenizeGlobs(['**/*.md'], '/repo', fs, charsOverFourTokenizer);

    expect(result.rows).toStrictEqual([{ path: 'nested/file.md', chars: 4, tokens: 1 }]);
  });

  it('is stable across repeated invocations with the same inputs', async () => {
    const fs = fakeFileSystem({
      globs: { '*.md': { matches: ['/repo/b.md', '/repo/a.md'] } },
      files: { '/repo/a.md': '1234', '/repo/b.md': '12345678' },
    });

    const first = await tokenizeGlobs(['*.md'], '/repo', fs, charsOverFourTokenizer);
    const second = await tokenizeGlobs(['*.md'], '/repo', fs, charsOverFourTokenizer);

    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  });
});
