import { describe, expect, it } from 'vitest';

import { smokeTestFiles, summariseSmokeRun, type SmokeSuiteSummary } from './smoke-suite.js';

/**
 * The smoke suite is derived from the directory: every `*.smoke.ts` runs, in
 * a stable order, and the verdict is the conjunction of every run.
 */

/** The report line that names a file, so assertions read the report's content, not its layout. */
function lineFor(summary: SmokeSuiteSummary, file: string): string {
  const line = summary.lines.find((candidate) => candidate.includes(file));
  if (line === undefined) {
    throw new Error(`no report line names ${file}: ${JSON.stringify(summary.lines)}`);
  }
  return line;
}

describe('smokeTestFiles', () => {
  it('keeps only the smoke files, in code-unit order, whatever else the directory holds', () => {
    // 'A' sorts before 'a' by code unit; a locale sort would interleave them.
    // The near-miss names carry the suffix inside, not at the end.
    expect(
      smokeTestFiles([
        'b.smoke.ts',
        'README.md',
        'A.smoke.ts',
        'x.smoke.ts.orig',
        'a.smoke.ts',
        'c.smoke.tsx',
        'helper.ts',
      ]),
    ).toStrictEqual(['A.smoke.ts', 'a.smoke.ts', 'b.smoke.ts']);
  });
});

describe('summariseSmokeRun', () => {
  it('is green when every smoke exited 0, and names each smoke', () => {
    const summary = summariseSmokeRun([
      { file: 'a.smoke.ts', status: 0, signal: null },
      { file: 'b.smoke.ts', status: 0, signal: null },
    ]);

    expect(summary.ok).toBe(true);
    expect(lineFor(summary, 'a.smoke.ts')).not.toContain('FAIL');
    expect(lineFor(summary, 'a.smoke.ts')).toContain('exit 0');
    expect(lineFor(summary, 'b.smoke.ts')).not.toContain('FAIL');
    expect(summary.lines.some((line) => line.includes('2 passed'))).toBe(true);
  });

  it('names every failure wherever it falls, counts each one, and reads a signal death as a failure', () => {
    const summary = summariseSmokeRun([
      { file: 'a.smoke.ts', status: 2, signal: null },
      { file: 'b.smoke.ts', status: 0, signal: null },
      { file: 'c.smoke.ts', status: null, signal: 'SIGTERM' },
      { file: 'd.smoke.ts', status: 0, signal: null },
    ]);

    expect(summary.ok).toBe(false);
    expect(lineFor(summary, 'a.smoke.ts')).toContain('FAIL');
    expect(lineFor(summary, 'a.smoke.ts')).toContain('exit 2');
    expect(lineFor(summary, 'b.smoke.ts')).not.toContain('FAIL');
    expect(lineFor(summary, 'c.smoke.ts')).toContain('FAIL');
    expect(lineFor(summary, 'd.smoke.ts')).not.toContain('FAIL');
    expect(summary.lines.some((line) => line.includes('2 of 4 failed'))).toBe(true);
  });

  it('reports a signal death by its signal, never as an exit code', () => {
    const summary = summariseSmokeRun([{ file: 'a.smoke.ts', status: null, signal: 'SIGTERM' }]);

    expect(lineFor(summary, 'a.smoke.ts')).toContain('SIGTERM');
    expect(lineFor(summary, 'a.smoke.ts')).not.toMatch(/exit \d/u);
  });

  it('reads an empty suite as a failure, never a pass', () => {
    const summary = summariseSmokeRun([]);

    expect(summary.ok).toBe(false);
    expect(summary.lines.some((line) => line.includes('no smoke tests'))).toBe(true);
  });
});
