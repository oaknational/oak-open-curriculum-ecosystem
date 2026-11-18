/**
 * Readers for the untracked-by-design collaboration state files
 * (ADR-199 / PDR-094). On a fresh checkout or new worktree these files do
 * not exist, so first contact meets ENOENT; the readers convert exactly
 * that case into an `Err` carrying the complete seed content from
 * `state-file-seeds.ts` — instructions sufficient on their own to cure the
 * failure. Absence is never a silent empty registry (a wrong path would
 * masquerade as "no claims" — the F-41 decoy-path class), and every OTHER
 * `Error` failure (permissions, invalid content) flows out as an `Err`
 * carrying its original self — the throw happens only at the result
 * package's single sanctioned edge on unwrap, loud and with the cause
 * chain intact. The one exception is a non-`Error` throwable: that is the
 * system reporting a problem and it crashes at detection rather than
 * entering the Result channel (owner rulings, 2026-07-20).
 *
 * The text-read seam is injectable per ADR-078 so tests prove the
 * behaviour with simple fakes and no real IO; production uses the
 * default disk binding.
 */
import { readFile } from 'node:fs/promises';

import { err, type Result } from '@oaknational/result';

import { failureAsError } from '../core/failure-as-error.js';
import {
  isLegacyActiveClaimsText,
  migrateLegacyActiveClaimsFile,
} from './active-claims-legacy-migration.js';
import { isErrnoCode } from './errno.js';
import {
  EMPTY_ACTIVE_CLAIMS_REGISTRY_JSON,
  EMPTY_CLOSED_CLAIMS_ARCHIVE_JSON,
  missingStateFileError,
} from './state-file-seeds.js';
import { parseClosedClaimsArchive, parseCollaborationRegistry } from './state-parsers.js';
import { type ClosedClaimsArchive, type CollaborationRegistry } from './types.js';

/**
 * The injectable text-read seam (ADR-078). Production binds the disk;
 * tests inject fakes that resolve text or reject with errno-shaped
 * failures.
 */
export type ReadTextFile = (path: string) => Promise<string>;

const readTextFileFromDisk: ReadTextFile = (path) => readFile(path, 'utf8');

/**
 * The injectable legacy-migration seam: production rewrites the file via
 * {@link migrateLegacyActiveClaimsFile}; tests inject fakes so the hook is
 * provable without real IO.
 */
export type MigrateLegacyActiveClaims = (input: {
  readonly activePath: string;
  readonly nowIso: string;
}) => Promise<void>;

/**
 * Read and parse the active claims registry. See the module doc for the
 * failure contract; callers behind the CLI's exception boundary unwrap
 * with `unwrapOrThrow`.
 *
 * A legacy 1.3.0 file (still carrying the flat `commit_queue` array) is
 * migrated ONCE on first contact — live queue entries to the per-intent
 * store, expired dropped, claims rewritten in the new shape — then re-read.
 * TTL liveness at this hook is judged against the wall clock: migration is
 * an IO-boundary act on the real store, not a view over a caller's `--now`.
 */
export async function readActiveClaimsFile(
  activePath: string,
  readTextFile: ReadTextFile = readTextFileFromDisk,
  migrateLegacy: MigrateLegacyActiveClaims = migrateLegacyActiveClaimsFile,
): Promise<Result<CollaborationRegistry, Error>> {
  const parseWithMigration = async (
    text: string,
  ): Promise<Result<CollaborationRegistry, Error>> => {
    if (!isLegacyActiveClaimsText(text)) {
      return parseCollaborationRegistry(text);
    }
    await migrateLegacy({ activePath, nowIso: new Date().toISOString() });
    return parseCollaborationRegistry(await readTextFile(activePath));
  };

  return readStateFile(activePath, parseWithMigration, readTextFile, {
    label: 'active-claims registry',
    seedJson: EMPTY_ACTIVE_CLAIMS_REGISTRY_JSON,
  });
}

/**
 * Read and parse the closed claims archive. Failure contract as per the
 * module doc.
 */
export async function readClosedClaimsFile(
  closedPath: string,
  readTextFile: ReadTextFile = readTextFileFromDisk,
): Promise<Result<ClosedClaimsArchive, Error>> {
  return readStateFile(closedPath, parseClosedClaimsArchive, readTextFile, {
    label: 'closed-claims archive',
    seedJson: EMPTY_CLOSED_CLAIMS_ARCHIVE_JSON,
  });
}

async function readStateFile<T>(
  path: string,
  parse: (text: string) => Result<T, Error> | Promise<Result<T, Error>>,
  readTextFile: ReadTextFile,
  seed: { readonly label: string; readonly seedJson: string },
): Promise<Result<T, Error>> {
  // Owner ruling 2026-07-20: every failure flows out as an `Err` carrying
  // the ORIGINAL failure (ENOENT alone is enriched with the seed message);
  // the throw itself happens only at the result package's single
  // sanctioned edge when a caller unwraps — loud, destructive, cause
  // chain intact. No throw statements live here. The parse leg needs no
  // translate since story 2b: the parsers are Err-channel themselves.
  let text: string;
  try {
    text = await readTextFile(path);
  } catch (error) {
    // Crash-at-detection FIRST: a non-Error throwable never enters the Err
    // channel, even one carrying an ENOENT-shaped code.
    const failure = failureAsError(error, 'the state-file read boundary');
    return err(
      isErrnoCode(failure, 'ENOENT')
        ? missingStateFileError({
            label: seed.label,
            path,
            seedJson: seed.seedJson,
            cause: failure,
          })
        : failure,
    );
  }
  return parse(text);
}
