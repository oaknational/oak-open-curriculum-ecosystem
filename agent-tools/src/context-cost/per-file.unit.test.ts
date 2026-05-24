import { describe, expect, it } from 'vitest';

import { charsOverFourTokenizer } from './tokenizer.js';
import { ContextCostFileReadError, type ContextCostFileSystem } from './file-system.js';
import { tokenizeFile } from './per-file.js';

function fakeFileSystem(content: string | Error): ContextCostFileSystem & {
  readonly readCalls: string[];
  readonly expandCalls: string[];
} {
  const readCalls: string[] = [];
  const expandCalls: string[] = [];

  return {
    readCalls,
    expandCalls,
    readFileUtf8: async (absolutePath) => {
      readCalls.push(absolutePath);
      if (content instanceof Error) {
        throw content;
      }
      return content;
    },
    expandGlob: async (cwd, pattern) => {
      expandCalls.push(`${cwd}:${pattern}`);
      return [];
    },
  };
}

describe('tokenizeFile', () => {
  it('returns a deterministic row for a readable file', async () => {
    const fs = fakeFileSystem('hello, world');

    await expect(
      tokenizeFile('docs/example.md', '/repo/docs/example.md', fs, charsOverFourTokenizer),
    ).resolves.toStrictEqual({
      path: 'docs/example.md',
      chars: 12,
      tokens: 3,
    });

    expect(fs.readCalls).toStrictEqual(['/repo/docs/example.md']);
    expect(fs.expandCalls).toStrictEqual([]);
  });

  it('counts empty content as zero chars and zero tokens', async () => {
    const fs = fakeFileSystem('');

    await expect(
      tokenizeFile('docs/example.md', '/repo/docs/example.md', fs, charsOverFourTokenizer),
    ).resolves.toStrictEqual({
      path: 'docs/example.md',
      chars: 0,
      tokens: 0,
    });
  });

  it('wraps read failures with the absolute path', async () => {
    const fs = fakeFileSystem(new Error('ENOENT'));
    const failure = tokenizeFile(
      'docs/example.md',
      '/repo/docs/example.md',
      fs,
      charsOverFourTokenizer,
    );

    await expect(failure).rejects.toHaveProperty('absolutePath', '/repo/docs/example.md');
    await expect(failure).rejects.toThrow('failed to read /repo/docs/example.md');
    await expect(failure).rejects.toBeInstanceOf(ContextCostFileReadError);

    expect(fs.readCalls).toStrictEqual(['/repo/docs/example.md']);
    expect(fs.expandCalls).toStrictEqual([]);
  });
});
