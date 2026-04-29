import { describe, expect, it } from 'vitest';

import { buildPreToolUseDenyResponse, runPreToolUseContentGuard } from './check-blocked-content.js';

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
});
