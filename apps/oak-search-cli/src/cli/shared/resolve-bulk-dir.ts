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
interface BulkDirError {
  readonly type: 'bulk_dir_not_found' | 'bulk_dir_empty';
  readonly message: string;
}

/** Injected filesystem predicates for testability. */
export interface FsPredicates {
  readonly existsSync: (path: string) => boolean;
  readonly readdirSync: (path: string) => string[];
}

/** Inputs for resolving bulk dir from CLI/env precedence. */
interface ResolveBulkDirFromInputs {
  /** Optional `--bulk-dir` CLI flag value. */
  readonly bulkDirFlag: string | undefined;
  /** Optional `BULK_DOWNLOAD_DIR` env value. */
  readonly bulkDirFromEnv: string | undefined;
  /** App root used to resolve relative paths. */
  readonly appRoot: string;
  /** Injected filesystem predicates. */
  readonly fs: FsPredicates;
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

  let entries: string[];
  try {
    entries = fs.readdirSync(resolvedPath);
  } catch {
    return err({
      type: 'bulk_dir_not_found',
      message:
        `Bulk download directory is not readable: ${resolvedPath}\n` +
        'Check path permissions and run "pnpm bulk:download" if the directory is missing.',
    });
  }
  const jsonFiles = entries.filter((f) => f.endsWith('.json'));
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

/** Workspace-relative default bulk-download directory name. */
const DEFAULT_BULK_DIR_NAME = 'bulk-downloads';

/**
 * Resolve bulk directory using CLI-over-env-over-default precedence and validate it.
 *
 * Precedence:
 * 1. `--bulk-dir` CLI flag (when non-empty after trim).
 * 2. `BULK_DOWNLOAD_DIR` env value (when non-empty after trim).
 * 3. Workspace-relative default `<appRoot>/bulk-downloads`.
 *
 * `appRoot` is the oak-search-cli workspace root (computed in
 * `pass-through.ts` from `import.meta.url`), so the default resolves
 * to `<repoRoot>/apps/oak-search-cli/bulk-downloads` regardless of the
 * invocation directory. Empty-string and whitespace-only flag/env
 * values are treated as not configured and fall through to the default.
 */
export function resolveBulkDirFromInputs(
  input: ResolveBulkDirFromInputs,
): Result<string, BulkDirError> {
  const fromFlag = input.bulkDirFlag?.trim();
  if (fromFlag && fromFlag.length > 0) {
    return resolveBulkDir(fromFlag, input.appRoot, input.fs);
  }

  const fromEnv = input.bulkDirFromEnv?.trim();
  if (fromEnv && fromEnv.length > 0) {
    return resolveBulkDir(fromEnv, input.appRoot, input.fs);
  }

  return resolveBulkDir(DEFAULT_BULK_DIR_NAME, input.appRoot, input.fs);
}
