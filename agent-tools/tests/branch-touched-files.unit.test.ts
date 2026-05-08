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

  it('accepts explicit head and branch aliases', () => {
    expect(parseArgs(['--head', 'HEAD~1', '--branch', 'feature/example'])).toMatchObject({
      baseRef: 'origin/main',
      headRef: 'feature/example',
    });
  });

  it('rejects ambiguous positional and explicit head refs', () => {
    expect(() => parseArgs(['--branch', 'feature/example', 'other-ref'])).toThrow(
      'provide either [branch-or-ref] or --head/--branch, not both',
    );
  });

  it('accepts an explicit git executable path override', () => {
    expect(
      parseArgs(['--git', '/nix/store/git/bin/git', '--branch', 'feature/example']),
    ).toMatchObject({
      gitPath: '/nix/store/git/bin/git',
      headRef: 'feature/example',
    });
  });

  it('ignores a pnpm-forwarded argument separator', () => {
    expect(parseArgs(['--', '--base', 'main'])).toMatchObject({
      baseRef: 'main',
      headRef: 'HEAD',
    });
  });

  it('records help flags without requiring git state', () => {
    expect(parseArgs(['--help'])).toMatchObject({
      help: true,
    });
    expect(parseArgs(['-h'])).toMatchObject({
      help: true,
    });
  });

  it('rejects unknown and valueless options with useful messages', () => {
    expect(() => parseArgs(['--bogus'])).toThrow('unknown option: --bogus');
    expect(() => parseArgs(['--base'])).toThrow('--base requires a value');
  });
});
