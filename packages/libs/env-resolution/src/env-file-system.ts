/**
 * The real filesystem behind the {@link EnvFileSystem} port: Node's
 * synchronous `fs`, composed by default at the pipeline's entry.
 */
import { existsSync, readFileSync } from 'node:fs';
import type { EnvFileSystem } from './types.js';

/** The file's UTF-8 text when a file exists at the path; `undefined` otherwise. */
function readTextIfExists(path: string): string | undefined {
  return existsSync(path) ? readFileSync(path, 'utf-8') : undefined;
}

/** The Node filesystem adapter every production caller composes with by default. */
export const nodeEnvFileSystem: EnvFileSystem = {
  exists: existsSync,
  readText: readTextIfExists,
};
