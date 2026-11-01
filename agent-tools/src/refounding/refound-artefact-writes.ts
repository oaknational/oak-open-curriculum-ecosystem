import { lstat, rm, writeFile } from 'node:fs/promises';

import { err, ok, type Result } from '@oaknational/result';

/**
 * All-or-nothing writes for a run's flat artefact set: the freeze
 * rollback's no-ambiguous-partial-state discipline
 * (`refound-freeze-rollback.ts`) applied to paired artefacts like
 * `inventory.v1.jsonl` + `net-diff.v1.report.json` and the challenge
 * stream + key set. A failure on any write best-effort removes every path
 * this run attempted — including the failed, possibly partially-written,
 * file — so a half-paired artefact set never survives a failed run.
 *
 * @packageDocumentation
 */

/** One artefact write: the absolute destination and its full content. */
export interface ArtefactWrite {
  readonly absPath: string;
  readonly content: string;
}

const asMessage = (cause: unknown): string =>
  cause instanceof Error ? cause.message : String(cause);

/** True when this run's failed write left a (possibly partial) FILE behind. */
async function leftPartialFile(failedPath: string): Promise<boolean> {
  try {
    return (await lstat(failedPath)).isFile();
  } catch {
    return false; // ENOENT (or unreadable): nothing provably ours to remove.
  }
}

/**
 * Best-effort per-path removal — one stubborn path must never strand the
 * others. The failed write's own destination is removed only when it is a
 * file (a partial write); a pre-existing directory there was never this
 * run's to delete. Returns the paths that could not be removed.
 */
async function rollBackAttempted(
  written: readonly string[],
  failedPath: string,
): Promise<readonly string[]> {
  const stubborn: string[] = [];
  for (const abandoned of written) {
    try {
      await rm(abandoned, { force: true });
    } catch {
      stubborn.push(abandoned);
    }
  }
  if (await leftPartialFile(failedPath)) {
    try {
      await rm(failedPath, { force: true });
    } catch {
      stubborn.push(failedPath);
    }
  }
  return stubborn;
}

/**
 * Write the set in order; on any failure, roll back what this run wrote.
 * The error names the failed write and the rollback outcome, so a failed
 * run either leaves nothing of itself or names exactly what remains.
 */
export async function writeArtefactSet(
  writes: readonly ArtefactWrite[],
): Promise<Result<void, Error>> {
  const written: string[] = [];
  for (const write of writes) {
    try {
      await writeFile(write.absPath, write.content, 'utf8');
      written.push(write.absPath);
    } catch (error: unknown) {
      const stubborn = await rollBackAttempted(written, write.absPath);
      if (stubborn.length > 0) {
        return err(
          new Error(
            `artefact write failed (${asMessage(error)}); rollback incomplete — remove ` +
              `manually: ${stubborn.join(', ')}`,
          ),
        );
      }
      return err(
        new Error(
          `artefact write failed (${asMessage(error)}); the partial set was rolled back — ` +
            'nothing of this run remains',
        ),
      );
    }
  }
  return ok(undefined);
}
