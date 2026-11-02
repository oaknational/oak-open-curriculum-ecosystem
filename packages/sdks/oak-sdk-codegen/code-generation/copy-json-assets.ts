/**
 * Copies the JSON assets under `src/` into `dist/` after the build, so the
 * generated data files ship beside the compiled loaders that import them.
 *
 * @remarks
 * The two functions take a {@link FileSystemPort}; the entry block at the
 * bottom wires the real one when this module is the script being run
 * (`principles.md` §Testing; ADR-078).
 */

import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { FileSystemPort } from '../src/io/file-system-port.js';
import { nodeFileSystem } from '../src/io/node-file-system.js';

/**
 * Finds JSON assets under a source directory.
 *
 * @param sourceRoot - Directory to scan recursively
 * @param fs - The file system to read through
 * @returns Sorted absolute paths to JSON files
 */
export async function findJsonAssets(
  sourceRoot: string,
  fs: FileSystemPort,
): Promise<readonly string[]> {
  const entries = await fs.readdir(sourceRoot);
  const nestedPaths = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(sourceRoot, entry.name);

      if (entry.kind === 'directory') {
        return findJsonAssets(entryPath, fs);
      }

      if (entry.kind === 'file' && entry.name.endsWith('.json')) {
        return [entryPath];
      }

      return [];
    }),
  );

  return nestedPaths.flat().sort((a, b) => a.localeCompare(b));
}

/**
 * Copies JSON assets from a source tree into a destination tree.
 *
 * @param sourceRoot - Source directory to scan
 * @param destinationRoot - Destination directory to mirror into
 * @param fs - The file system to copy through
 * @returns Absolute destination paths for copied files
 */
export async function copyJsonAssets(
  sourceRoot: string,
  destinationRoot: string,
  fs: FileSystemPort,
): Promise<readonly string[]> {
  const jsonFiles = await findJsonAssets(sourceRoot, fs);
  const copiedFiles = await Promise.all(
    jsonFiles.map(async (sourcePath) => {
      const destinationPath = join(destinationRoot, relative(sourceRoot, sourcePath));
      await fs.mkdir(dirname(destinationPath));
      await fs.copyFile(sourcePath, destinationPath);
      return destinationPath;
    }),
  );

  return copiedFiles.sort((a, b) => a.localeCompare(b));
}

const entrypointPath = process.argv[1];
const modulePath = fileURLToPath(import.meta.url);

if (entrypointPath !== undefined && resolve(entrypointPath) === modulePath) {
  const packageRoot = fileURLToPath(new URL('../', import.meta.url));
  await copyJsonAssets(join(packageRoot, 'src'), join(packageRoot, 'dist'), nodeFileSystem);
}
