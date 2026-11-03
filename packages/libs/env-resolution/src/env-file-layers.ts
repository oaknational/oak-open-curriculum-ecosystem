/**
 * The `.env` file layers of the resolution pipeline: discovery of the
 * repository and app roots from a start directory, and the four-layer
 * merge of the files found there. Kept apart from validation so each
 * side stays a single concern.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as dotenvParse } from 'dotenv';
import { findRepoRoot, findAppRoot } from './repo-root.js';

/**
 * Parses a `.env` file into a key-value record without mutating `process.env`.
 *
 * @param filePath - Absolute path to the `.env` file
 * @returns Parsed key-value pairs, or empty object if the file does not exist
 */
function parseEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) {
    return {};
  }
  return dotenvParse(readFileSync(filePath, 'utf-8'));
}

/**
 * The four `.env` layers discovery finds walking up from `startDir`,
 * merged lowest-precedence first (repo `.env`, repo `.env.local`, app
 * `.env`, app `.env.local`). When the app root and repo root are the same
 * directory the app layer is skipped to avoid double-loading; where no
 * marker exists (a serverless filesystem) every layer is empty.
 */
export function loadEnvFileLayers(startDir: string): Record<string, string> {
  const repoRoot = findRepoRoot(startDir);
  const appRoot = findAppRoot(startDir);
  const repoDotEnv = repoRoot ? parseEnvFile(join(repoRoot, '.env')) : {};
  const repoDotEnvLocal = repoRoot ? parseEnvFile(join(repoRoot, '.env.local')) : {};
  const appIsDistinct = appRoot !== undefined && appRoot !== repoRoot;
  const appDotEnv = appIsDistinct ? parseEnvFile(join(appRoot, '.env')) : {};
  const appDotEnvLocal = appIsDistinct ? parseEnvFile(join(appRoot, '.env.local')) : {};
  return { ...repoDotEnv, ...repoDotEnvLocal, ...appDotEnv, ...appDotEnvLocal };
}
