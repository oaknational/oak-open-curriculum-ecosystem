import { describe, expect, it } from 'vitest';

import {
  buildPreToolUseDenyResponse,
  loadScopedContentBlocks,
  runPreToolUseContentGuard,
} from './check-blocked-content.js';

describe('runPreToolUseContentGuard', () => {
  it('writes a deny payload when new content introduces a blocked pattern', async () => {
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    async function* stdin(): AsyncGenerator<Buffer> {
      yield Buffer.from(
        JSON.stringify({
          tool_input: {
            new_string: 'code with secret-marker added',
            old_string: 'original code without marker',
          },
        }),
      );
    }

    const result = await runPreToolUseContentGuard({
      stdin: stdin(),
      stdout: {
        write: (text: string) => {
          stdoutChunks.push(text);
        },
      },
      stderr: {
        write: (text: string) => {
          stderrChunks.push(text);
        },
      },
      blockedPatterns: ['secret-marker'],
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stderrChunks).toStrictEqual([]);
    expect(JSON.parse(stdoutChunks.join(''))).toStrictEqual(
      buildPreToolUseDenyResponse('secret-marker'),
    );
  });

  it('produces no output when the pattern already existed in prior content', async () => {
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    async function* stdin(): AsyncGenerator<Buffer> {
      yield Buffer.from(
        JSON.stringify({
          tool_input: {
            new_string: 'code with existing-marker still',
            old_string: 'code with existing-marker here',
          },
        }),
      );
    }

    const result = await runPreToolUseContentGuard({
      stdin: stdin(),
      stdout: {
        write: (text: string) => {
          stdoutChunks.push(text);
        },
      },
      stderr: {
        write: (text: string) => {
          stderrChunks.push(text);
        },
      },
      blockedPatterns: ['existing-marker'],
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdoutChunks).toStrictEqual([]);
    expect(stderrChunks).toStrictEqual([]);
  });

  it('uses an injected prior-content reader for Write payloads', async () => {
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    async function* stdin(): AsyncGenerator<Buffer> {
      yield Buffer.from(
        JSON.stringify({
          tool_input: {
            content: 'code with existing-marker still',
            file_path: '/repo/src/example.ts',
          },
        }),
      );
    }

    const result = await runPreToolUseContentGuard({
      stdin: stdin(),
      stdout: {
        write: (text: string) => {
          stdoutChunks.push(text);
        },
      },
      stderr: {
        write: (text: string) => {
          stderrChunks.push(text);
        },
      },
      blockedPatterns: ['existing-marker'],
      readPriorContent: () => 'code with existing-marker already',
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdoutChunks).toStrictEqual([]);
    expect(stderrChunks).toStrictEqual([]);
  });

  it('returns exitCode 2 and writes to stderr on error', async () => {
    const stderrChunks: string[] = [];

    async function* stdin(): AsyncGenerator<Buffer> {
      yield Buffer.from('not valid json {{{');
    }

    const result = await runPreToolUseContentGuard({
      stdin: stdin(),
      stdout: { write: () => {} },
      stderr: {
        write: (text: string) => {
          stderrChunks.push(text);
        },
      },
      blockedPatterns: ['irrelevant'],
    });

    expect(result).toStrictEqual({ exitCode: 2 });
    expect(stderrChunks.length).toBe(1);
    expect(stderrChunks[0]).toContain('Claude PreToolUse hook input was not valid JSON:');
  });

  it('writes a scoped-block deny payload when hedging vocabulary is added on a doctrine path', async () => {
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    async function* stdin(): AsyncGenerator<Buffer> {
      yield Buffer.from(
        JSON.stringify({
          tool_input: {
            new_string: 'we will carve out an allowance for this case',
            old_string: 'we will not yet decide',
            file_path: '/repo/.agent/plans/example.plan.md',
          },
        }),
      );
    }

    const result = await runPreToolUseContentGuard({
      stdin: stdin(),
      stdout: {
        write: (text: string) => {
          stdoutChunks.push(text);
        },
      },
      stderr: {
        write: (text: string) => {
          stderrChunks.push(text);
        },
      },
      blockedPatterns: [],
      scopedBlocks: [
        {
          pattern: 'carve out',
          include_paths: ['**/*.plan.md'],
          citation: 'PDR-044; principles.md §Architectural Excellence Over Expediency',
        },
      ],
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stderrChunks).toStrictEqual([]);
    expect(JSON.parse(stdoutChunks.join(''))).toStrictEqual(
      buildPreToolUseDenyResponse(
        'carve out',
        'PDR-044; principles.md §Architectural Excellence Over Expediency',
      ),
    );
  });

  it('does not deny scoped-block hedging vocabulary on out-of-scope paths', async () => {
    const stdoutChunks: string[] = [];

    async function* stdin(): AsyncGenerator<Buffer> {
      yield Buffer.from(
        JSON.stringify({
          tool_input: {
            new_string: 'we will carve out an allowance for this case',
            old_string: 'we will not yet decide',
            file_path: '/repo/src/index.ts',
          },
        }),
      );
    }

    const result = await runPreToolUseContentGuard({
      stdin: stdin(),
      stdout: {
        write: (text: string) => {
          stdoutChunks.push(text);
        },
      },
      stderr: { write: () => {} },
      blockedPatterns: [],
      scopedBlocks: [
        {
          pattern: 'carve out',
          include_paths: ['**/*.plan.md', '.agent/practice-core/'],
          citation: 'PDR-044',
        },
      ],
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdoutChunks).toStrictEqual([]);
  });
});

describe('canonical policy: hedging-vocabulary trip-list (WS3)', () => {
  const expectedCitation = 'PDR-044; principles.md §Architectural Excellence Over Expediency';

  it('the canonical policy registers a hedging-vocabulary trip-list scoped to doctrine surfaces', async () => {
    const blocks = await loadScopedContentBlocks();

    const patterns = blocks.map((block) => block.pattern);
    expect(patterns).toEqual(
      expect.arrayContaining([
        'carve out',
        'carve-out',
        'carve around',
        'an exception to',
        'with the exception of',
        'for these arcs',
        'honest framing for',
        'permitted variant',
        'land it then iterate',
        'cheap cure',
        'good enough',
        'quick fix',
      ]),
    );

    for (const block of blocks) {
      expect(block.citation).toBe(expectedCitation);
      expect(block.include_paths.length).toBeGreaterThan(0);
    }
  });
});
