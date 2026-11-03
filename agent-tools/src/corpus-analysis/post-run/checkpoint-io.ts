import { readFile } from 'node:fs/promises';

import { err, type Result } from '@oaknational/result';
import { assertPathWithinBase, type AssertPathWithinBaseOptions } from '@oaknational/safe-path';

/** Reads and strictly re-parses one committed checkpoint envelope, anchored at the repo root. */
export type CheckpointReader = <T>(
  filePath: string | undefined,
  label: string,
  parse: (value: unknown) => Result<T, Error>,
) => Promise<Result<T, Error>>;

/** Injectable seams for {@link makeCheckpointReader} (testing + composition). */
export interface CheckpointReaderOptions extends AssertPathWithinBaseOptions {
  /** Reads the anchored file as UTF-8 text. Defaults to `node:fs/promises` `readFile`. */
  readonly readTextFile?: (path: string) => Promise<string>;
}

/**
 * Make a checkpoint reader anchored at the given repo root, for a corpus driver.
 *
 * @remarks
 * Checkpoint envelopes are committed repo artefacts; anchoring the flag-supplied path
 * inside the repo root blocks `../` traversal and symlink escapes from a faulty CLI
 * invocation (tssecurity:S8707). A RELATIVE flag path resolves against the invocation
 * working directory (documented driver usage: the agent-tools workspace) before the
 * containment check. Shared by the post-run and salvage drivers and the run-artefact
 * builder — the boundary behaviour (anchor, read, strict parse, typed failure) must be
 * identical across the three.
 */
export function makeCheckpointReader(
  repoRoot: string,
  options: CheckpointReaderOptions = {},
): CheckpointReader {
  const readTextFile = options.readTextFile ?? ((path: string) => readFile(path, 'utf8'));
  return async <T>(
    filePath: string | undefined,
    label: string,
    parse: (value: unknown) => Result<T, Error>,
  ): Promise<Result<T, Error>> => {
    if (filePath === undefined) {
      return err(new Error(`Missing required checkpoint flag: ${label}.`));
    }
    try {
      const safePath = assertPathWithinBase(filePath, repoRoot, options);
      return parse(JSON.parse(await readTextFile(safePath)));
    } catch (cause) {
      return err(
        new Error(
          `Cannot read checkpoint ${filePath}: ${cause instanceof Error ? cause.message : String(cause)}`,
          {
            cause,
          },
        ),
      );
    }
  };
}
