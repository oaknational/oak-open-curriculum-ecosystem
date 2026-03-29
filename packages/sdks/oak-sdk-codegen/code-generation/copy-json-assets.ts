import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Finds JSON assets under a source directory.
 *
 * @param sourceRoot - Directory to scan recursively
 * @returns Sorted absolute paths to JSON files
 */
export async function findJsonAssets(sourceRoot: string): Promise<readonly string[]> {
  const entries = await readdir(sourceRoot, { withFileTypes: true });
  const nestedPaths = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = join(sourceRoot, entry.name);

      if (entry.isDirectory()) {
        return findJsonAssets(entryPath);
      }

      if (entry.isFile() && entry.name.endsWith('.json')) {
        return [entryPath];
      }

      return [];
    }),
  );

  return nestedPaths.flat().sort();
}

/**
 * Copies JSON assets from a source tree into a destination tree.
 *
 * @param sourceRoot - Source directory to scan
 * @param destinationRoot - Destination directory to mirror into
 * @returns Absolute destination paths for copied files
 */
export async function copyJsonAssets(
  sourceRoot: string,
  destinationRoot: string,
): Promise<readonly string[]> {
  const jsonFiles = await findJsonAssets(sourceRoot);
  const copiedFiles = await Promise.all(
    jsonFiles.map(async (sourcePath) => {
      const destinationPath = join(destinationRoot, relative(sourceRoot, sourcePath));
      await mkdir(dirname(destinationPath), { recursive: true });
      await copyFile(sourcePath, destinationPath);
      return destinationPath;
    }),
  );

  return copiedFiles.sort();
}

const entrypointPath = process.argv[1];
const modulePath = fileURLToPath(import.meta.url);

if (entrypointPath !== undefined && resolve(entrypointPath) === modulePath) {
  const packageRoot = fileURLToPath(new URL('../', import.meta.url));
  await copyJsonAssets(join(packageRoot, 'src'), join(packageRoot, 'dist'));
}
