import { describe, expect, it } from 'vitest';

import { formatAnnotations, formatSummaryTable, parseTurboSummary } from './ci-turbo-report.mjs';

function createValidTurboSummaryJson() {
  return {
    execution: {
      attempted: 2,
      success: 1,
      failed: 1,
      cached: 1,
      exitCode: 1,
    },
    tasks: [
      {
        taskId: '@oak/pkg-a#build',
        task: 'build',
        package: '@oak/pkg-a',
        execution: {
          exitCode: 0,
        },
        cache: {
          status: 'HIT',
          timeSaved: 1234,
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
    ],
  };
}

function createParsedSummary() {
  return {
    attemptedCount: 2,
    passedCount: 1,
    failedCount: 1,
    cachedCount: 1,
    totalTimeSavedMs: 1234,
    exitCode: 1,
    tasks: [
      {
        taskId: '@oak/pkg-a#build',
        taskName: 'build',
        packageName: '@oak/pkg-a',
        exitCode: 0,
        cacheStatus: 'HIT',
        timeSavedMs: 1234,
        logFile: 'packages/pkg-a/.turbo/turbo-build.log',
      },
      {
        taskId: '@oak/pkg-b#test',
        taskName: 'test',
        packageName: '@oak/pkg-b',
        exitCode: 1,
        cacheStatus: 'MISS',
        timeSavedMs: 0,
        logFile: 'packages/pkg-b/.turbo/turbo-test.log',
      },
    ],
  };
}

describe('parseTurboSummary', () => {
  it('returns a typed summary for valid Turbo JSON', () => {
    const result = parseTurboSummary(createValidTurboSummaryJson());

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw result.error;
    }

    expect(result.value).toStrictEqual(createParsedSummary());
  });

  it('computes pass and cache counts from task exit codes instead of top-level success', () => {
    const result = parseTurboSummary({
      execution: {
        attempted: 2,
        success: 1,
        failed: 0,
        cached: 2,
        exitCode: 0,
      },
      tasks: [
        {
          taskId: '@oak/pkg-a#lint',
          task: 'lint',
          package: '@oak/pkg-a',
          execution: {
            exitCode: 0,
          },
          cache: {
            status: 'HIT',
            timeSaved: 120,
          },
          logFile: 'packages/pkg-a/.turbo/turbo-lint.log',
        },
        {
          taskId: '@oak/pkg-a#test',
          task: 'test',
          package: '@oak/pkg-a',
          execution: {
            exitCode: 0,
          },
          cache: {
            status: 'HIT',
            timeSaved: 240,
          },
          logFile: 'packages/pkg-a/.turbo/turbo-test.log',
        },
      ],
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw result.error;
    }

    expect(result.value.passedCount).toBe(2);
    expect(result.value.cachedCount).toBe(2);
    expect(result.value.failedCount).toBe(0);
  });

  it('accepts tasks with a null log file', () => {
    const result = parseTurboSummary({
      execution: {
        attempted: 1,
        success: 1,
        failed: 0,
        cached: 0,
        exitCode: 0,
      },
      tasks: [
        {
          taskId: '@oak/pkg-a#smoke:dev:stub',
          task: 'smoke:dev:stub',
          package: '@oak/pkg-a',
          execution: {
            exitCode: 0,
          },
          cache: {
            status: 'MISS',
            timeSaved: 0,
          },
          logFile: null,
        },
      ],
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw result.error;
    }

    expect(result.value.tasks[0].logFile).toBeNull();
  });

  it('accepts tasks with a missing log file', () => {
    const result = parseTurboSummary({
      execution: {
        attempted: 1,
        success: 1,
        failed: 0,
        cached: 0,
        exitCode: 0,
      },
      tasks: [
        {
          taskId: '@oak/pkg-a#smoke:dev:stub',
          task: 'smoke:dev:stub',
          package: '@oak/pkg-a',
          execution: {
            exitCode: 0,
          },
          cache: {
            status: 'MISS',
            timeSaved: 0,
          },
        },
      ],
    });

    expect(result.ok).toBe(true);

    if (!result.ok) {
      throw result.error;
    }

    expect(result.value.tasks[0].logFile).toBeNull();
  });

  it('returns an error result for invalid Turbo JSON', () => {
    const result = parseTurboSummary({
      execution: {
        attempted: 1,
        success: 1,
        failed: 0,
        cached: 1,
        exitCode: 0,
      },
      tasks: 'not-an-array',
    });

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error('Expected parseTurboSummary to fail.');
    }

    expect(result.error.message).toContain('Turbo summary field "tasks" must be an array.');
  });
});

describe('formatSummaryTable', () => {
  it('formats a zero-task summary', () => {
    const table = formatSummaryTable({
      attemptedCount: 0,
      passedCount: 0,
      failedCount: 0,
      cachedCount: 0,
      totalTimeSavedMs: 0,
      exitCode: 0,
      tasks: [],
    });

    expect(table).toContain('## Turbo Task Summary');
    expect(table).toContain('| _No tasks_ | - | - | 0ms |');
    expect(table).toContain(
      '| **Totals** | **0 passed / 0 failed / 0 attempted** | **0 cached** | **0ms** |',
    );
  });

  it('formats pass and fail tasks with cache status and totals', () => {
    const table = formatSummaryTable(createParsedSummary());

    expect(table).toContain('| @oak/pkg-a#build | PASS | HIT | 1.2s |');
    expect(table).toContain('| @oak/pkg-b#test | FAIL | MISS | 0ms |');
    expect(table).toContain(
      '| **Totals** | **1 passed / 1 failed / 2 attempted** | **1 cached** | **1.2s** |',
    );
  });
});

describe('formatAnnotations', () => {
  it('formats GitHub error annotations only for failed tasks', () => {
    const annotations = formatAnnotations(createParsedSummary());

    expect(annotations).toBe(
      '::error file=packages/pkg-b/.turbo/turbo-test.log::@oak/pkg-b#test failed',
    );
  });

  it('returns an empty string when all tasks passed', () => {
    const annotations = formatAnnotations({
      attemptedCount: 1,
      passedCount: 1,
      failedCount: 0,
      cachedCount: 1,
      totalTimeSavedMs: 50,
      exitCode: 0,
      tasks: [
        {
          taskId: '@oak/pkg-a#lint',
          taskName: 'lint',
          packageName: '@oak/pkg-a',
          exitCode: 0,
          cacheStatus: 'HIT',
          timeSavedMs: 50,
          logFile: 'packages/pkg-a/.turbo/turbo-lint.log',
        },
      ],
    });

    expect(annotations).toBe('');
  });

  it('omits the file property when a failed task has no log file', () => {
    const annotations = formatAnnotations({
      attemptedCount: 1,
      passedCount: 0,
      failedCount: 1,
      cachedCount: 0,
      totalTimeSavedMs: 0,
      exitCode: 1,
      tasks: [
        {
          taskId: '@oak/pkg-a#smoke:dev:stub',
          taskName: 'smoke:dev:stub',
          packageName: '@oak/pkg-a',
          exitCode: 1,
          cacheStatus: 'MISS',
          timeSavedMs: 0,
          logFile: null,
        },
      ],
    });

    expect(annotations).toBe('::error::@oak/pkg-a#smoke:dev:stub failed');
  });
});
