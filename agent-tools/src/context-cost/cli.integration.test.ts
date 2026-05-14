import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import type { AgentToolsCliInput } from '../bin/agent-tools-cli-types.js';
import { runContextCostTopic } from '../bin/agent-tools-cli-topics.js';
import type { ContextCostFileSystem } from './file-system.js';
import { runContextCostCli } from './cli.js';

const tokenizedRowSchema = z.object({
  path: z.string(),
  chars: z.number().int(),
  tokens: z.number().int(),
});

const contextCostJsonSchema = z.object({
  rows: z.array(tokenizedRowSchema),
  aggregate: z.object({
    files: z.number().int(),
    chars: z.number().int(),
    tokens: z.number().int(),
  }),
  warnings: z.array(z.object({ glob: z.string(), reason: z.literal('no-matches') })),
});

describe('runContextCostCli', () => {
  it('emits deterministic tab-separated text output', async () => {
    const fixture = fixtureFileSystem();

    await expect(
      runContextCostCli({ argv: ['--glob', '*.md'], cwd: fixture.cwd, fs: fixture.fs }),
    ).resolves.toStrictEqual({
      exitCode: 0,
      stdout: [
        'path\tchars\ttokens',
        'a.md\t4\t1',
        'b.md\t8\t2',
        'c.md\t12\t3',
        '---',
        'total: 3 files, 24 chars, 6 tokens',
        '',
      ].join('\n'),
      stderr: '',
    });
  });

  it('emits stable JSON output', async () => {
    const fixture = fixtureFileSystem();
    const result = await runContextCostCli({
      argv: ['--glob', '*.md', '--json'],
      cwd: fixture.cwd,
      fs: fixture.fs,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe('');
    const parsedJson: unknown = JSON.parse(result.stdout);
    expect(contextCostJsonSchema.parse(parsedJson)).toStrictEqual({
      rows: [
        { path: 'a.md', chars: 4, tokens: 1 },
        { path: 'b.md', chars: 8, tokens: 2 },
        { path: 'c.md', chars: 12, tokens: 3 },
      ],
      aggregate: { files: 3, chars: 24, tokens: 6 },
      warnings: [],
    });
    expect(result.stdout).toBe(
      `${JSON.stringify(
        {
          rows: [
            { path: 'a.md', chars: 4, tokens: 1 },
            { path: 'b.md', chars: 8, tokens: 2 },
            { path: 'c.md', chars: 12, tokens: 3 },
          ],
          aggregate: { files: 3, chars: 24, tokens: 6 },
          warnings: [],
        },
        null,
        2,
      )}\n`,
    );
  });

  it('prints no-match warnings to stderr while keeping stdout cuttable', async () => {
    const fixture = fixtureFileSystem();
    const result = await runContextCostCli({
      argv: ['--glob', '*.md', '--glob', '*.MISSING'],
      cwd: fixture.cwd,
      fs: fixture.fs,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('a.md\t4\t1');
    expect(result.stdout).not.toContain('warning:');
    expect(result.stderr).toBe("warning: glob '*.MISSING' matched no files\n");
  });

  it('prints help without filesystem access', async () => {
    const throwingFs: ContextCostFileSystem = {
      readFileUtf8: async () => {
        throw new Error('read should not run');
      },
      expandGlob: async () => {
        throw new Error('glob should not run');
      },
    };

    const result = await runContextCostCli({
      argv: ['--help'],
      cwd: '/unused',
      fs: throwingFs,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toMatch(/^context-cost --glob <pattern>/);
    expect(result.stderr).toBe('');
  });

  it('returns parser errors with exit code 2', async () => {
    const missingGlob = await runContextCostCli({ argv: [], cwd: '/unused' });
    const unknownOption = await runContextCostCli({
      argv: ['--glob', '*.md', '--bogus'],
      cwd: '/unused',
    });

    expect(missingGlob.exitCode).toBe(2);
    expect(missingGlob.stdout).toBe('');
    expect(missingGlob.stderr).toMatch(/^--glob is required/);
    expect(unknownOption.exitCode).toBe(2);
    expect(unknownOption.stdout).toBe('');
    expect(unknownOption.stderr).toMatch(/^unknown option: --bogus/);
  });

  it('returns read failures with exit code 2', async () => {
    const fs: ContextCostFileSystem = {
      expandGlob: async () => ['/repo/a.md', '/repo/b.md'],
      readFileUtf8: async (absolutePath) => {
        if (absolutePath.endsWith('b.md')) {
          throw new Error('EACCES');
        }
        return '1234';
      },
    };

    const result = await runContextCostCli({ argv: ['--glob', '*.md'], cwd: '/repo', fs });

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain('failed to read /repo/b.md');
  });

  it('registers the topic handler through the unified CLI topic surface', async () => {
    const input: AgentToolsCliInput = {
      argv: [],
      cwd: '/unused',
      env: {},
    };

    const result = await runContextCostTopic(input, ['--help']);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toMatch(/^context-cost --glob <pattern>/);
    expect(result.stderr).toBe('');
  });
});

function fixtureFileSystem(): { readonly cwd: string; readonly fs: ContextCostFileSystem } {
  const files = new Map([
    ['/repo/a.md', '1234'],
    ['/repo/b.md', '12345678'],
    ['/repo/c.md', '123456789012'],
  ]);

  return {
    cwd: '/repo',
    fs: {
      expandGlob: async (_cwd, pattern) =>
        pattern === '*.md' ? ['/repo/c.md', '/repo/a.md', '/repo/b.md'] : [],
      readFileUtf8: async (absolutePath) => {
        const content = files.get(absolutePath);
        if (content === undefined) {
          throw new Error(`missing fixture ${absolutePath}`);
        }
        return content;
      },
    },
  };
}
