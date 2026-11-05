import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { readCore, type CoreReaders } from './read-core.js';

const ROOT = '/repo';
const CORE_A = '.agent/practice-core/decision-records/PDR-001-a.md';
const CORE_B = '.agent/practice-core/README.md';
const OUTSIDE = 'docs/architecture/architectural-decisions/001-a.md';

function readers(overrides: Partial<CoreReaders>): CoreReaders {
  return {
    listTrackedFiles: () => ok([CORE_A, CORE_B, OUTSIDE]),
    // Models the disk read in memory: the root is not consulted (hence the underscore the
    // compiler's unused-parameter check requires), and every path asked for comes back as
    // text, in the order asked.
    readScanFiles: (_repoRoot, paths) => ok(paths.map((path) => ({ path, content: 'text' }))),
    ...overrides,
  };
}

describe('readCore', () => {
  it('returns every tracked Core file as text and nothing outside the Core', () => {
    const result = readCore(ROOT, readers({}));

    expect(result).toEqual(
      ok([
        { path: CORE_A, content: 'text' },
        { path: CORE_B, content: 'text' },
      ]),
    );
  });

  it('refuses when git cannot list the tracked files, naming the failure', () => {
    const result = readCore(
      ROOT,
      readers({
        listTrackedFiles: () => err({ kind: 'git-unavailable', message: 'git is not on PATH' }),
      }),
    );

    expect(result).toEqual(err('cannot list tracked files — git is not on PATH'));
  });

  it('refuses a listing with no tracked Core file rather than passing vacuously', () => {
    const result = readCore(ROOT, readers({ listTrackedFiles: () => ok([OUTSIDE]) }));

    expect(result).toEqual(err('zero tracked Core files found — refusing a vacuous pass'));
  });

  it('refuses when a tracked Core file cannot be read, naming the path and the cause', () => {
    const result = readCore(
      ROOT,
      readers({
        readScanFiles: () => err({ relativePath: CORE_B, cause: new Error('EACCES') }),
      }),
    );

    expect(result).toEqual(err(expect.stringContaining(`cannot read tracked file '${CORE_B}'`)));
    expect(result).toEqual(err(expect.stringContaining('EACCES')));
  });

  it('refuses when the text read drops a Core file, naming the dropped path', () => {
    const result = readCore(
      ROOT,
      readers({ readScanFiles: () => ok([{ path: CORE_A, content: 'text' }]) }),
    );

    expect(result).toEqual(
      err(
        `tracked Core file(s) not scannable as text, so the scan cannot vouch for them: ${CORE_B}`,
      ),
    );
  });
});
