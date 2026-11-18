/**
 * The post-build check that a workspace package's build wrote every file its
 * `package.json` entry points name under `dist/`. Pure over the filesystem
 * seam (ADR-078).
 *
 * @packageDocumentation
 */

import path from 'node:path';

import { type WorkspaceDepFsIo } from './bootstrap-helpers.js';

/**
 * The witness paths a finished build did not write. The bootstrap checks this
 * after building a dependency because `workspaceDepDistIsStale` reads a
 * missing witness as stale: a declared target the build never emits (a
 * wildcard subpath, an unemitted condition) would otherwise rebuild the
 * package, without a word, on every install.
 *
 * @param depDir - Absolute directory of the workspace package.
 * @param distArtifacts - Witness paths under the package's `dist/`.
 * @param io - The filesystem seam.
 * @returns The absolute paths still missing, in declaration order.
 */
export function missingDistArtifacts(
  depDir: string,
  distArtifacts: readonly string[],
  io: WorkspaceDepFsIo,
): readonly string[] {
  return distArtifacts
    .map((artifact) => path.join(depDir, 'dist', artifact))
    .filter((artifactPath) => io.statMtimeMs(artifactPath) === 'missing');
}
