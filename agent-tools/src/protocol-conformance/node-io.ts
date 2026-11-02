import { resolve } from 'node:path';

import { nodeSyncFileSystem, type SyncFileSystem } from '../core/sync-file-system.js';
import { type ConformanceIo } from './types.js';

/** The file-system reads the adapter is made of; the process's own by default. */
export type ConformanceFileSystem = Pick<
  SyncFileSystem,
  'exists' | 'readText' | 'list' | 'isDirectory'
>;

/**
 * The file-system adapter for the conformance IO seam, over `fs`. Read
 * failures map to `undefined` (an unreadable artefact is an absent artefact to
 * the detectors, which then fail loud with the artefact named) — never a
 * throw, so one broken path cannot mask the rest of the report. The
 * directory probe is the one the coordination-home resolver uses, so the
 * detector certifies the resolver's own contract.
 */
export function buildConformanceNodeIo(
  repoRoot: string,
  env: Readonly<Record<string, string | undefined>>,
  fs: ConformanceFileSystem = nodeSyncFileSystem,
): ConformanceIo {
  return {
    fileExists: (relPath) => fs.exists(resolve(repoRoot, relPath)),
    readTextFile: (relPath) => {
      try {
        return fs.readText(resolve(repoRoot, relPath));
      } catch {
        return undefined;
      }
    },
    listDir: (relPath) => {
      try {
        return fs.list(resolve(repoRoot, relPath));
      } catch {
        return undefined;
      }
    },
    absoluteDirectoryExists: (path) => fs.isDirectory(path),
    env,
  };
}
