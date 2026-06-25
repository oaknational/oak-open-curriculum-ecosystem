/**
 * Production {@link CiFileSystem} implementation backed by the real Node.js
 * filesystem.
 *
 * @remarks
 * Extracted from the `ci-turbo-report` entry module so the orchestration there
 * stays within its module line budget. This is the single place the reporter
 * touches the real filesystem; tests inject an in-memory {@link CiFileSystem}
 * instead.
 *
 * @packageDocumentation
 */

import { realpathSync } from 'node:fs';
import fsPromises from 'node:fs/promises';

import type { CiFileSystem } from './ci-turbo-report-types.js';

/**
 * The default {@link CiFileSystem} backed by the real Node.js `fs/promises`
 * module, plus `realpathSync` for path containment.
 *
 * @remarks
 * `readdir` filters to plain files only so that subdirectories are never
 * mistaken for JSON summary candidates.
 */
export const nodeCiFileSystem: CiFileSystem = {
  readdir: (dir) =>
    fsPromises
      .readdir(dir, { withFileTypes: true })
      .then((entries) => entries.filter((e) => e.isFile()).map((e) => e.name)),
  stat: (filePath) => fsPromises.stat(filePath),
  readFile: (filePath, encoding) => fsPromises.readFile(filePath, encoding),
  realpath: (filePath) => realpathSync(filePath),
};
