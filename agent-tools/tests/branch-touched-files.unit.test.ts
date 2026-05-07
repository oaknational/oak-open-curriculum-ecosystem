import { describe, expect, it } from 'vitest';

import { parseArgs } from '../src/branch-touched-files/cli';
import {
  classifyTouchedFileCount,
  createBranchTouchedFileReport,
  formatBranchTouchedFileReport,
  guidanceForSeverity,
} from '../src/branch-touched-files';

describe('branch touched files report', () => {
  it.each([
    [0, 'ok'],
    [49, 'ok'],
    [50, 'soft'],
    [99, 'soft'],
    [100, 'hard'],
    [149, 'hard'],
    [150, 'critical'],
  ] as const)('classifies %i touched files as %s', (count, severity) => {
    expect(classifyTouchedFileCount(count)).toBe(severity);
  });

  it('deduplicates and sorts files before counting', () => {
    expect(
      createBranchTouchedFileReport({
        baseRef: 'origin/main',
        headRef: 'feature/example',
        mergeBase: 'abc123',
        files: ['b.ts', 'a.ts', 'b.ts'],
      }),
    ).toStrictEqual({
      baseRef: 'origin/main',
      headRef: 'feature/example',
      mergeBase: 'abc123',
      files: ['a.ts', 'b.ts'],
      count: 2,
      severity: 'ok',
    });
  });

  it('formats report output with guidance and optional file list', () => {
    expect(
      formatBranchTouchedFileReport(
        {
          baseRef: 'origin/main',
          headRef: 'HEAD',
          mergeBase: 'abc123',
          files: ['a.ts'],
          count: 1,
          severity: 'ok',
        },
        { showFiles: true },
      ),
    ).toBe(
      [
        'branch touched files: 1',
        'severity: ok (<50)',
        'base: origin/main',
        'head: HEAD',
        'merge-base: abc123',
        '',
        'ok: below the soft warning threshold.',
        '',
        'files:',
        '  a.ts',
        '',
      ].join('\n'),
    );
  });

  it('names the critical response as split-plan work', () => {
    expect(guidanceForSeverity('critical')).toContain('owner-visible split plan');
  });
});

describe('branch touched files CLI args', () => {
  it('defaults to origin/main and HEAD', () => {
    expect(parseArgs([])).toStrictEqual({
      baseRef: 'origin/main',
      headRef: 'HEAD',
      json: false,
      showFiles: false,
      help: false,
    });
  });

  it('accepts a positional branch and base override', () => {
    expect(
      parseArgs(['feature/example', '--base', 'main', '--json', '--show-files']),
    ).toStrictEqual({
      baseRef: 'main',
      headRef: 'feature/example',
      json: true,
      showFiles: true,
      help: false,
    });
  });

  it('ignores a pnpm-forwarded argument separator', () => {
    expect(parseArgs(['--', '--base', 'main'])).toMatchObject({
      baseRef: 'main',
      headRef: 'HEAD',
    });
  });
});
