import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { type WorkspaceDepFsIo } from './bootstrap-helpers.js';
import { missingDistArtifacts } from './dist-witnesses.js';

describe('missingDistArtifacts', () => {
  const depDir = '/repo/packages/core/config';
  /** A seam over files that exist at the given paths; every other path reads missing. */
  const filesAt = (paths: readonly string[]): WorkspaceDepFsIo => ({
    statMtimeMs: (filePath) => (paths.includes(filePath) ? 1 : 'missing'),
    dirExists: () => false,
    readDirEntries: () => [],
  });

  it('names each witness a finished build did not write, in declaration order', () => {
    const io = filesAt([join(depDir, 'dist', 'tsup.base.js')]);

    expect(
      missingDistArtifacts(depDir, ['tsup.base.d.ts', 'tsup.base.js', 'client/*.js'], io),
    ).toStrictEqual([join(depDir, 'dist', 'tsup.base.d.ts'), join(depDir, 'dist', 'client/*.js')]);
  });

  it('names none when the build wrote every witness', () => {
    const io = filesAt([join(depDir, 'dist', 'index.js'), join(depDir, 'dist', 'index.d.ts')]);

    expect(missingDistArtifacts(depDir, ['index.js', 'index.d.ts'], io)).toStrictEqual([]);
  });
});
