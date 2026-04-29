import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { findLatestSummaryFile, runCiTurboReport } from './ci-turbo-report.js';

function createTurboSummaryJson(tasks) {
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

describe('findLatestSummaryFile', () => {
  it('returns the most recent JSON file in the runs directory', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'turbo-runs-'));

    try {
      const olderPath = path.join(tempDir, 'older.json');
      const newerPath = path.join(tempDir, 'newer.json');

      await fs.writeFile(olderPath, '{}');
      await fs.writeFile(newerPath, '{}');
      await fs.utimes(
        olderPath,
        new Date('2026-03-29T10:00:00Z'),
        new Date('2026-03-29T10:00:00Z'),
      );
      await fs.utimes(
        newerPath,
        new Date('2026-03-29T11:00:00Z'),
        new Date('2026-03-29T11:00:00Z'),
      );

      await expect(findLatestSummaryFile(tempDir)).resolves.toBe(newerPath);
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('throws a helpful error when the runs directory contains no JSON files', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'turbo-runs-'));

    try {
      await expect(findLatestSummaryFile(tempDir)).rejects.toThrow(
        'No Turbo summary JSON files were found',
      );
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });
});

describe('runCiTurboReport', () => {
  it('writes markdown to stdout and annotations to stderr for an explicit summary file', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'turbo-report-'));

    try {
      const summaryPath = path.join(tempDir, 'summary.json');
      const stdoutChunks: string[] = [];
      const stderrChunks: string[] = [];

      await fs.writeFile(
        summaryPath,
        JSON.stringify(
          createTurboSummaryJson([
            {
              taskId: '@oak/pkg-a#build',
              task: 'build',
              package: '@oak/pkg-a',
              execution: {
                exitCode: 0,
              },
              cache: {
                status: 'HIT',
                timeSaved: 1500,
              },
              logFile: 'packages/pkg-a/.turbo/turbo-build.log',
            },
            {
              taskId: '@oak/pkg-b#test',
              task: 'test',
              package: '@oak/pkg-b',
              execution: {
                exitCode: 1,
              },
              cache: {
                status: 'MISS',
                timeSaved: 0,
              },
              logFile: 'packages/pkg-b/.turbo/turbo-test.log',
            },
          ]),
        ),
      );

      const result = await runCiTurboReport({
        summaryFilePath: summaryPath,
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
      });

      expect(result).toStrictEqual({ exitCode: 0 });
      expect(stdoutChunks.join('')).toContain('## Turbo Task Summary');
      expect(stdoutChunks.join('')).toContain('@oak/pkg-b#test');
      expect(stderrChunks.join('')).toContain(
        '::error file=packages/pkg-b/.turbo/turbo-test.log::@oak/pkg-b#test failed',
      );
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('finds the latest summary file when no explicit path is provided', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'turbo-report-'));

    try {
      const olderPath = path.join(tempDir, 'older.json');
      const newerPath = path.join(tempDir, 'newer.json');
      const stdoutChunks: string[] = [];
      const stderrChunks: string[] = [];

      await fs.writeFile(
        olderPath,
        JSON.stringify(
          createTurboSummaryJson([
            {
              taskId: '@oak/pkg-a#lint',
              task: 'lint',
              package: '@oak/pkg-a',
              execution: {
                exitCode: 0,
              },
              cache: {
                status: 'MISS',
                timeSaved: 0,
              },
              logFile: 'packages/pkg-a/.turbo/turbo-lint.log',
            },
          ]),
        ),
      );
      await fs.writeFile(
        newerPath,
        JSON.stringify(
          createTurboSummaryJson([
            {
              taskId: '@oak/pkg-b#test',
              task: 'test',
              package: '@oak/pkg-b',
              execution: {
                exitCode: 0,
              },
              cache: {
                status: 'HIT',
                timeSaved: 900,
              },
              logFile: 'packages/pkg-b/.turbo/turbo-test.log',
            },
          ]),
        ),
      );

      await fs.utimes(
        olderPath,
        new Date('2026-03-29T10:00:00Z'),
        new Date('2026-03-29T10:00:00Z'),
      );
      await fs.utimes(
        newerPath,
        new Date('2026-03-29T11:00:00Z'),
        new Date('2026-03-29T11:00:00Z'),
      );

      const result = await runCiTurboReport({
        runsDir: tempDir,
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
      });

      expect(result).toStrictEqual({ exitCode: 0 });
      expect(stdoutChunks.join('')).toContain('@oak/pkg-b#test');
      expect(stdoutChunks.join('')).not.toContain('@oak/pkg-a#lint');
      expect(stderrChunks).toStrictEqual([]);
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('returns exitCode 0 and writes a warning when it cannot find a summary file', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'turbo-report-'));

    try {
      const stderrChunks: string[] = [];
      const stdoutChunks: string[] = [];

      const result = await runCiTurboReport({
        runsDir: tempDir,
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
      });

      expect(result).toStrictEqual({ exitCode: 0 });
      expect(stdoutChunks).toStrictEqual([]);
      expect(stderrChunks.join('')).toContain('::warning::Unable to generate Turbo summary:');
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('returns exitCode 0 and writes a warning when the summary file contains invalid JSON', async () => {
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'turbo-report-'));

    try {
      const summaryPath = path.join(tempDir, 'summary.json');
      const stderrChunks: string[] = [];
      const stdoutChunks: string[] = [];

      await fs.writeFile(summaryPath, '{"execution":');

      const result = await runCiTurboReport({
        summaryFilePath: summaryPath,
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
      });

      expect(result).toStrictEqual({ exitCode: 0 });
      expect(stdoutChunks).toStrictEqual([]);
      expect(stderrChunks.join('')).toContain('::warning::Unable to generate Turbo summary:');
    } finally {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });
});
