import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  type CiFileSystem,
  findLatestSummaryFile,
  runCiTurboReport,
} from '../src/ci/ci-turbo-report.js';

interface RawTurboTask {
  taskId: string;
  task: string;
  package: string;
  execution: { exitCode: number };
  cache: { status: string; timeSaved: number };
  logFile?: string | null;
}

function createTurboSummaryJson(tasks: RawTurboTask[]): unknown {
  const failedCount = tasks.filter((task) => task.execution.exitCode !== 0).length;
  const cachedCount = tasks.filter((task) => task.cache.status === 'HIT').length;

  return {
    execution: {
      attempted: tasks.length,
      success: Math.max(tasks.length - cachedCount - failedCount, 0),
      failed: failedCount,
      cached: cachedCount,
      exitCode: failedCount === 0 ? 0 : 1,
    },
    tasks,
  };
}

/** In-memory file entry for {@link makeMemoryFs}. */
interface MemoryEntry {
  content: string;
  mtimeMs: number;
}

/** Build an in-memory CiFileSystem fake from a path-keyed map. */
function makeMemoryFs(files: Record<string, MemoryEntry>): CiFileSystem {
  const sep = path.sep;
  return {
    readdir: (dir) => {
      const prefix = dir.endsWith(sep) ? dir : `${dir}${sep}`;
      const names = Object.keys(files)
        .filter((p) => p.startsWith(prefix) && !p.slice(prefix.length).includes(sep))
        .map((p) => path.basename(p));
      return Promise.resolve(names);
    },
    stat: (filePath) => {
      const entry = files[filePath];
      if (entry === undefined) {
        return Promise.reject(new Error(`ENOENT: ${filePath}`));
      }
      return Promise.resolve({ mtimeMs: entry.mtimeMs });
    },
    readFile: (filePath, encoding) => {
      if (encoding !== 'utf8') {
        return Promise.reject(new Error(`Unsupported encoding: ${encoding}`));
      }
      const entry = files[filePath];
      if (entry === undefined) {
        return Promise.reject(new Error(`ENOENT: ${filePath}`));
      }
      return Promise.resolve(entry.content);
    },
  };
}

const FAKE_DIR = path.join('/fake', 'turbo-runs');

describe('findLatestSummaryFile', () => {
  it('returns the most recent JSON file in the runs directory', async () => {
    const olderPath = path.join(FAKE_DIR, 'older.json');
    const newerPath = path.join(FAKE_DIR, 'newer.json');

    const fakeFs = makeMemoryFs({
      [olderPath]: { content: '{}', mtimeMs: new Date('2026-03-29T10:00:00Z').getTime() },
      [newerPath]: { content: '{}', mtimeMs: new Date('2026-03-29T11:00:00Z').getTime() },
    });

    await expect(findLatestSummaryFile(FAKE_DIR, fakeFs)).resolves.toBe(newerPath);
  });

  it('throws a helpful error when the runs directory contains no JSON files', async () => {
    const fakeFs = makeMemoryFs({});

    await expect(findLatestSummaryFile(FAKE_DIR, fakeFs)).rejects.toThrow(
      'No Turbo summary JSON files were found',
    );
  });
});

describe('runCiTurboReport', () => {
  it('writes markdown to stdout and annotations to stderr for an explicit summary file', async () => {
    const summaryPath = path.join(FAKE_DIR, 'summary.json');
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    const fakeFs = makeMemoryFs({
      [summaryPath]: {
        content: JSON.stringify(
          createTurboSummaryJson([
            {
              taskId: '@oak/pkg-a#build',
              task: 'build',
              package: '@oak/pkg-a',
              execution: { exitCode: 0 },
              cache: { status: 'HIT', timeSaved: 1500 },
              logFile: 'packages/pkg-a/.turbo/turbo-build.log',
            },
            {
              taskId: '@oak/pkg-b#test',
              task: 'test',
              package: '@oak/pkg-b',
              execution: { exitCode: 1 },
              cache: { status: 'MISS', timeSaved: 0 },
              logFile: 'packages/pkg-b/.turbo/turbo-test.log',
            },
          ]),
        ),
        mtimeMs: Date.now(),
      },
    });

    const result = await runCiTurboReport({
      summaryFilePath: summaryPath,
      stdout: {
        write: (text) => {
          stdoutChunks.push(text);
        },
      },
      stderr: {
        write: (text) => {
          stderrChunks.push(text);
        },
      },
      fs: fakeFs,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdoutChunks.join('')).toContain('## Turbo Task Summary');
    expect(stdoutChunks.join('')).toContain('@oak/pkg-b#test');
    expect(stderrChunks.join('')).toContain(
      '::error file=packages/pkg-b/.turbo/turbo-test.log::@oak/pkg-b#test failed',
    );
  });

  it('finds the latest summary file when no explicit path is provided', async () => {
    const olderPath = path.join(FAKE_DIR, 'older.json');
    const newerPath = path.join(FAKE_DIR, 'newer.json');
    const stdoutChunks: string[] = [];
    const stderrChunks: string[] = [];

    const fakeFs = makeMemoryFs({
      [olderPath]: {
        content: JSON.stringify(
          createTurboSummaryJson([
            {
              taskId: '@oak/pkg-a#lint',
              task: 'lint',
              package: '@oak/pkg-a',
              execution: { exitCode: 0 },
              cache: { status: 'MISS', timeSaved: 0 },
              logFile: 'packages/pkg-a/.turbo/turbo-lint.log',
            },
          ]),
        ),
        mtimeMs: new Date('2026-03-29T10:00:00Z').getTime(),
      },
      [newerPath]: {
        content: JSON.stringify(
          createTurboSummaryJson([
            {
              taskId: '@oak/pkg-b#test',
              task: 'test',
              package: '@oak/pkg-b',
              execution: { exitCode: 0 },
              cache: { status: 'HIT', timeSaved: 900 },
              logFile: 'packages/pkg-b/.turbo/turbo-test.log',
            },
          ]),
        ),
        mtimeMs: new Date('2026-03-29T11:00:00Z').getTime(),
      },
    });

    const result = await runCiTurboReport({
      runsDir: FAKE_DIR,
      stdout: {
        write: (text) => {
          stdoutChunks.push(text);
        },
      },
      stderr: {
        write: (text) => {
          stderrChunks.push(text);
        },
      },
      fs: fakeFs,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdoutChunks.join('')).toContain('@oak/pkg-b#test');
    expect(stdoutChunks.join('')).not.toContain('@oak/pkg-a#lint');
    expect(stderrChunks).toStrictEqual([]);
  });

  it('returns exitCode 0 and writes a warning when it cannot find a summary file', async () => {
    const stderrChunks: string[] = [];
    const stdoutChunks: string[] = [];

    const fakeFs = makeMemoryFs({});

    const result = await runCiTurboReport({
      runsDir: FAKE_DIR,
      stdout: {
        write: (text) => {
          stdoutChunks.push(text);
        },
      },
      stderr: {
        write: (text) => {
          stderrChunks.push(text);
        },
      },
      fs: fakeFs,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdoutChunks).toStrictEqual([]);
    expect(stderrChunks.join('')).toContain('::warning::Unable to generate Turbo summary:');
  });

  it('returns exitCode 0 and writes a warning when the summary file contains invalid JSON', async () => {
    const summaryPath = path.join(FAKE_DIR, 'summary.json');
    const stderrChunks: string[] = [];
    const stdoutChunks: string[] = [];

    const fakeFs = makeMemoryFs({
      [summaryPath]: { content: '{"execution":', mtimeMs: Date.now() },
    });

    const result = await runCiTurboReport({
      summaryFilePath: summaryPath,
      stdout: {
        write: (text) => {
          stdoutChunks.push(text);
        },
      },
      stderr: {
        write: (text) => {
          stderrChunks.push(text);
        },
      },
      fs: fakeFs,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(stdoutChunks).toStrictEqual([]);
    expect(stderrChunks.join('')).toContain('::warning::Unable to generate Turbo summary:');
  });
});
