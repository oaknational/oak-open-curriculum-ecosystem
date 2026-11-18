import { posix } from 'node:path';

import { describe, expect, it } from 'vitest';

import { ARC_METRICS_HELP_TEXT } from './cli-options.js';
import { runArcMetricsCli, type ArcMetricsCliInput } from './cli.js';
import type { ArcMetricsFileSystem } from './file-system.js';

function transcript(sessionSuffix: string): string {
  return [
    JSON.stringify({
      type: 'assistant',
      timestamp: `2026-09-16T10:0${sessionSuffix}:00Z`,
      message: {
        id: `msg_${sessionSuffix}`,
        usage: {
          input_tokens: 10,
          output_tokens: 100,
          cache_creation_input_tokens: 0,
          cache_read_input_tokens: 90,
        },
      },
    }),
    JSON.stringify({
      type: 'user',
      timestamp: `2026-09-16T10:0${sessionSuffix}:30Z`,
      promptSource: 'typed',
      origin: { kind: 'human' },
      message: { content: 'the owner speaks' },
    }),
  ].join('\n');
}

const TRANSCRIPTS: Readonly<Record<string, readonly string[]>> = {
  '/p/one.jsonl': transcript('1').split('\n'),
  '/p/two.jsonl': transcript('2').split('\n'),
};

/** A file system holding the named directories only; any other directory does not exist. */
function fakeFs(files: Readonly<Record<string, readonly string[]>>): ArcMetricsFileSystem {
  return {
    listTranscripts: async (directory) => files[directory],
    readLines: async function* (absolutePath) {
      yield* TRANSCRIPTS[absolutePath] ?? [];
    },
  };
}

/** POSIX path rules on every host, so the paths below mean the same wherever the suite runs. */
const baseInput = (argv: readonly string[], fs: ArcMetricsFileSystem): ArcMetricsCliInput => ({
  argv,
  cwd: '/ws/code/site',
  env: { HOME: '/h' },
  fs,
  resolvePath: posix.resolve,
});

describe('runArcMetricsCli', () => {
  it('measures every transcript in the directory derived from the launch directory', async () => {
    const fs = fakeFs({ '/h/.claude/projects/-ws-code-site': ['/p/one.jsonl'] });

    const result = await runArcMetricsCli(baseInput(['--vendor', 'claude'], fs));

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('sessions 1');
    expect(result.stdout).toContain('owner 1');
  });

  it('measures several named project directories, as an arc across working directories needs', async () => {
    const fs = fakeFs({
      '/h/.claude/projects/-a': ['/p/one.jsonl'],
      '/h/.claude/projects/-b': ['/p/two.jsonl'],
    });

    const result = await runArcMetricsCli(
      baseInput(
        [
          '--vendor',
          'claude',
          '--project-dir',
          '/h/.claude/projects/-a',
          '--project-dir',
          '/h/.claude/projects/-b',
        ],
        fs,
      ),
    );

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('sessions 2');
  });

  it('measures a directory once, however often and however it is named', async () => {
    const fs = fakeFs({
      '/h/.claude/projects/-a': ['/p/one.jsonl'],
      '/h/.claude/projects/-a/': ['/p/one.jsonl'],
    });

    const result = await runArcMetricsCli(
      baseInput(
        [
          '--vendor',
          'claude',
          '--project-dir',
          '/h/.claude/projects/-a',
          '--project-dir',
          '/h/.claude/projects/-a',
          '--project-dir',
          '/h/.claude/projects/-a/',
        ],
        fs,
      ),
    );

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('sessions 1');
  });

  it('refuses a named project directory that does not exist, naming it, before it reads any transcript', async () => {
    const directories: Readonly<Record<string, readonly string[]>> = {
      '/h/.claude/projects/-a': ['/p/one.jsonl'],
    };
    const fs: ArcMetricsFileSystem = {
      listTranscripts: async (directory) => directories[directory],
      readLines: async function* () {
        yield* [];
        throw new Error('a transcript was read before every directory was checked');
      },
    };

    const result = await runArcMetricsCli(
      baseInput(
        [
          '--vendor',
          'claude',
          '--project-dir',
          '/h/.claude/projects/-a',
          '--project-dir',
          '/h/.claude/projects/-typo',
        ],
        fs,
      ),
    );

    expect(result).toEqual({
      exitCode: 2,
      stdout: '',
      stderr: 'no such project directory: /h/.claude/projects/-typo\n',
    });
  });

  it('reports no sessions when the launch directory has never held one', async () => {
    const fs = fakeFs({});

    const result = await runArcMetricsCli(baseInput(['--vendor', 'claude'], fs));

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('sessions 0');
  });

  it("reports each session's cache reads in its own text row", async () => {
    const fs = fakeFs({ '/h/.claude/projects/-ws-code-site': ['/p/one.jsonl'] });

    const result = await runArcMetricsCli(baseInput(['--vendor', 'claude'], fs));

    const row = result.stdout.split('\n').find((line) => line.startsWith('  one '));
    expect(row).toContain('cache-read 90');
  });

  it('emits JSON with the totals and the threshold when asked', async () => {
    const fs = fakeFs({ '/h/.claude/projects/-ws-code-site': ['/p/one.jsonl'] });

    const result = await runArcMetricsCli(
      baseInput(['--vendor', 'claude', '--gap-minutes', '5', '--json'], fs),
    );

    const parsed: unknown = JSON.parse(result.stdout);
    expect(parsed).toMatchObject({
      vendor: 'claude',
      gapSeconds: 300,
      totals: { sessions: 1, apiCalls: 1, ownerMessages: 1 },
    });
  });

  it('refuses an unsupported vendor, naming the flag, the value and the supported set, with the help', async () => {
    const fs = fakeFs({});

    const result = await runArcMetricsCli(baseInput(['--vendor', 'cursor'], fs));

    expect(result).toEqual({
      exitCode: 2,
      stdout: '',
      stderr: `--vendor does not support cursor (supported: claude)\n\n${ARC_METRICS_HELP_TEXT}\n`,
    });
  });

  it('refuses a non-numeric active-time threshold, naming the value, with the help', async () => {
    const fs = fakeFs({});

    const result = await runArcMetricsCli(
      baseInput(['--vendor', 'claude', '--gap-minutes', 'soon'], fs),
    );

    expect(result).toEqual({
      exitCode: 2,
      stdout: '',
      stderr: `--gap-minutes expects a positive whole number of minutes (got soon)\n\n${ARC_METRICS_HELP_TEXT}\n`,
    });
  });

  it.each(['0x10', '1e1', '5.0', '0', '-5', '99999999999999999999', '9007199254740989'])(
    'refuses the active-time threshold %s, which is not a positive whole number it can hold exactly',
    async (threshold) => {
      const fs = fakeFs({});

      const result = await runArcMetricsCli(
        baseInput(['--vendor', 'claude', '--gap-minutes', threshold], fs),
      );

      expect(result.exitCode).toBe(2);
      expect(result.stderr).toContain(`got ${threshold}`);
    },
  );

  it('refuses an empty HOME as an input error rather than reporting from the filesystem root', async () => {
    const fs = fakeFs({ '/.claude/projects/-ws-code-site': ['/p/one.jsonl'] });

    const result = await runArcMetricsCli({
      argv: ['--vendor', 'claude'],
      cwd: '/ws/code/site',
      env: { HOME: '' },
      fs,
    });

    expect(result.exitCode).toBe(2);
    expect(result.stdout).toBe('');
  });

  it('reports a listing failure as exit code 1 with the directory named', async () => {
    const fs: ArcMetricsFileSystem = {
      listTranscripts: async () => {
        throw new Error('permission denied');
      },
      readLines: async function* () {
        yield '';
      },
    };

    const result = await runArcMetricsCli(baseInput(['--vendor', 'claude'], fs));

    expect(result).toEqual({
      exitCode: 1,
      stdout: '',
      stderr: 'failed to list /h/.claude/projects/-ws-code-site: permission denied\n',
    });
  });

  it('reports a transcript that cannot be read as exit code 1 with the file named', async () => {
    const fs: ArcMetricsFileSystem = {
      listTranscripts: async () => ['/p/one.jsonl'],
      readLines: async function* () {
        yield* [];
        throw new Error('input/output error');
      },
    };

    const result = await runArcMetricsCli(baseInput(['--vendor', 'claude'], fs));

    expect(result).toEqual({
      exitCode: 1,
      stdout: '',
      stderr: 'failed to read /p/one.jsonl: input/output error\n',
    });
  });

  it('refuses to run without a vendor', async () => {
    const fs = fakeFs({});

    const result = await runArcMetricsCli(baseInput([], fs));

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('--vendor is required');
  });

  it('prints help without reading anything', async () => {
    const unreadable: ArcMetricsFileSystem = {
      listTranscripts: async () => {
        throw new Error('help read the filesystem');
      },
      readLines: async function* () {
        yield* [];
        throw new Error('help read a transcript');
      },
    };

    const result = await runArcMetricsCli(baseInput(['--help'], unreadable));

    expect(result).toEqual({ exitCode: 0, stdout: `${ARC_METRICS_HELP_TEXT}\n`, stderr: '' });
  });
});
