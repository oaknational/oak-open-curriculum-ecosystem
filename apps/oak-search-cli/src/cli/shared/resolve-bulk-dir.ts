/**
 * Pure resolution and validation of the `--bulk-dir` CLI argument.
 *
 * Resolves relative paths against the app root, checks existence,
 * and verifies the directory contains JSON files. FS predicates are
 * injected for testability (ADR-078).
 *
 * Called BEFORE resource creation (`withEsClient`) so that invalid
 * paths fail fast without opening TCP connections.
 *
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import { resolve, isAbsolute } from 'node:path';
import { ok, err, type Result } from '@oaknational/result';

/** Error from bulk directory resolution or validation. */
export interface BulkDirError {
  readonly type: 'bulk_dir_not_found' | 'bulk_dir_empty';
  readonly message: string;
}

/** Injected filesystem predicates for testability. */
export interface FsPredicates {
  readonly existsSync: (path: string) => boolean;
  readonly readdirSync: (path: string) => string[];
}

/**
 * Resolve and validate a bulk download directory path.
 *
 * @param rawPath - The `--bulk-dir` value from the CLI (absolute or relative)
 * @param appRoot - Application root directory for resolving relative paths
 * @param fs - Injected FS predicates (use real `existsSync`/`readdirSync` in production)
 * @returns `ok(resolvedPath)` on success, or `err(BulkDirError)` with actionable message
 */
export function resolveBulkDir(
  rawPath: string,
  appRoot: string,
  fs: FsPredicates,
): Result<string, BulkDirError> {
  if (rawPath.trim() === '') {
    return err({
      type: 'bulk_dir_not_found',
      message: '--bulk-dir cannot be empty. Specify a path to the bulk download directory.',
    });
  }
  const resolvedPath = isAbsolute(rawPath) ? rawPath : resolve(appRoot, rawPath);

  if (!fs.existsSync(resolvedPath)) {
    return err({
      type: 'bulk_dir_not_found',
      message:
        `Bulk download directory not found: ${resolvedPath}\n` +
        'Run "pnpm bulk:download" first to fetch the bulk data.',
    });
  }

  const jsonFiles = fs.readdirSync(resolvedPath).filter((f) => f.endsWith('.json'));
  if (jsonFiles.length === 0) {
    return err({
      type: 'bulk_dir_empty',
      message:
        `Bulk download directory is empty (no JSON files): ${resolvedPath}\n` +
        'Run "pnpm bulk:download" first to fetch the bulk data.',
    });
  }

  return ok(resolvedPath);
}
