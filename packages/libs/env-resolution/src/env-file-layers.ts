/**
 * The `.env` file layers of the resolution pipeline: discovery of the
 * repository and app roots from a start directory, and the four-layer
 * merge of the files found there. Kept apart from validation so each
 * side stays a single concern.
 */
import { join } from 'node:path';
import { parse as dotenvParse } from 'dotenv';
import { findRepoRoot, findAppRoot } from './repo-root.js';
import type { EnvFileSystem } from './types.js';

/**
 * Parses a `.env` file into a key-value record without mutating `process.env`.
 *
 * @param filePath - Absolute path to the `.env` file
 * @param fileSystem - The filesystem the file is read through
 * @returns Parsed key-value pairs, or empty object if the file does not exist
 */
function parseEnvFile(filePath: string, fileSystem: EnvFileSystem): Record<string, string> {
  const text = fileSystem.readText(filePath);
  return text === undefined ? {} : dotenvParse(text);
}

/**
 * The four `.env` layers discovery finds walking up from `startDir`,
 * merged lowest-precedence first (repo `.env`, repo `.env.local`, app
 * `.env`, app `.env.local`). When the app root and repo root are the same
 * directory the app layer is skipped to avoid double-loading; where no
 * marker exists (a serverless filesystem) every layer is empty.
 *
 * @param startDir - Directory the root discovery walks up from
 * @param fileSystem - The filesystem the markers and files are read through
 */
export function loadEnvFileLayers(
  startDir: string,
  fileSystem: EnvFileSystem,
): Record<string, string> {
  const repoRoot = findRepoRoot(startDir, fileSystem.exists);
  const appRoot = findAppRoot(startDir, fileSystem.exists);
  const repoDotEnv = repoRoot ? parseEnvFile(join(repoRoot, '.env'), fileSystem) : {};
  const repoDotEnvLocal = repoRoot ? parseEnvFile(join(repoRoot, '.env.local'), fileSystem) : {};
  const appIsDistinct = appRoot !== undefined && appRoot !== repoRoot;
  const appDotEnv = appIsDistinct ? parseEnvFile(join(appRoot, '.env'), fileSystem) : {};
  const appDotEnvLocal = appIsDistinct ? parseEnvFile(join(appRoot, '.env.local'), fileSystem) : {};
  return { ...repoDotEnv, ...repoDotEnvLocal, ...appDotEnv, ...appDotEnvLocal };
}
