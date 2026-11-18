import { readFile } from 'node:fs/promises';

import { err, ok, unwrapOrThrow, type Result } from '@oaknational/result';

import {
  isLegacyActiveClaimsText,
  migrateLegacyActiveClaimsFile,
} from '../collaboration-state/active-claims-legacy-migration.js';
import {
  commitQueueDirForActivePath,
  deleteCommitQueueEntry,
  readCommitQueueEntries,
  sweepExpiredCommitQueueEntries,
  writeCommitQueueEntry,
} from '../collaboration-state/commit-queue-store.js';
import { validateCollaborationJsonFileText } from '../collaboration-state/collaboration-json-validation.js';
import { isErrnoCode } from '../collaboration-state/errno.js';
import {
  runJsonStateTransaction,
  writeJsonFileWithinTransaction,
} from '../collaboration-state/transaction.js';
import { type ReadTextFile } from '../collaboration-state/state-file-readers.js';
import { failureAsError } from '../core/failure-as-error.js';
import {
  EMPTY_ACTIVE_CLAIMS_REGISTRY_JSON,
  missingStateFileError,
} from '../collaboration-state/state-file-seeds.js';

import { parseRegistryText } from './claims-file-parser.js';
import { type CommitIntent, type CommitQueueRegistry, type JsonObject } from './types.js';

export { parseRegistry, parseRegistryText } from './claims-file-parser.js';

const readTextFileFromDisk: ReadTextFile = (path) => readFile(path, 'utf8');

interface ReadRegistryOptions {
  readonly readTextFile?: ReadTextFile;
  /**
   * View clock for store-read TTL liveness; defaults to the wall clock.
   * It reaches {@link readCommitQueueEntries} — a pure view — and NOTHING
   * else: the legacy migration on the same read path takes the wall clock
   * inline (see {@link readClaimsFileText}).
   */
  readonly nowIso?: string;
}

/**
 * Read the composed commit-queue registry: the claims FILE (claims only
 * since schema 1.4.0) plus the live entries of the per-intent store beside
 * it. The claims file's IO, JSON-syntax, and contract failures arrive on the
 * `Err` arm (ADR-088). IO failures mirror the owner-ruled state-file readers
 * (rulings 2026-07-20): ENOENT enriches into verify-then-seed instructions,
 * any other `Error` flows out as ITSELF, a non-Error throwable crashes at
 * detection. Injectable read seam per ADR-078.
 *
 * The per-intent store beside it is a throwing IO layer, deliberately: a
 * corrupt intent file, a filename that disagrees with its `intent_id`, and
 * a migration write that fails all THROW at detection rather than arriving
 * here as `Err`, because each names machine-local state an operator must
 * repair by hand and no caller has a recovery for it inside a transaction.
 * A caller branching on `result.ok` therefore also handles a rejection.
 *
 * A legacy flat-queue file migrates once on first contact (live entries to
 * the store, expired dropped, claims rewritten new-shape) and is re-read.
 */
export async function readRegistry(
  registryPath: string,
  options: ReadRegistryOptions = {},
): Promise<Result<CommitQueueRegistry, Error>> {
  const nowIso = options.nowIso ?? new Date().toISOString();
  const content = await readClaimsFileText(
    registryPath,
    options.readTextFile ?? readTextFileFromDisk,
  );
  if (!content.ok) {
    return content;
  }

  const claimsFile = parseRegistryText(content.value, registryPath);
  if (!claimsFile.ok) {
    return claimsFile;
  }
  const entries = await readCommitQueueEntries({
    queueDir: commitQueueDirForActivePath(registryPath),
    nowIso,
  });

  return ok({
    ...claimsFile.value,
    commit_queue: entries.map((entry) => ({ ...entry })),
  });
}

/**
 * Read the claims-file text, enriching ENOENT into the verify-then-seed
 * instructions and routing a legacy flat-queue file through the one-time
 * migration before re-reading.
 *
 * TTL liveness at this hook is judged against the wall clock, mirroring the
 * sibling hook in `state-file-readers.ts`: migration is an IO-boundary act
 * on the real store, not a view over a caller's `--now`. The clock is taken
 * inline rather than accepted as a parameter, so a read-only view clock
 * cannot reach the one destructive step on this path — a far-future `--now`
 * would otherwise judge every live legacy row expired and DELETE it. The
 * leak is unrepresentable, not merely unused.
 */
async function readClaimsFileText(
  registryPath: string,
  readTextFile: ReadTextFile,
): Promise<Result<string, Error>> {
  let content: string;
  try {
    content = await readTextFile(registryPath);
  } catch (error) {
    // Crash-at-detection first: non-Error throwables never enter the Err channel.
    const failure = failureAsError(error, 'the state-file read boundary');
    return err(
      isErrnoCode(failure, 'ENOENT')
        ? missingStateFileError({
            label: 'active-claims registry',
            path: registryPath,
            seedJson: EMPTY_ACTIVE_CLAIMS_REGISTRY_JSON,
            cause: failure,
          })
        : failure,
    );
  }

  if (!isLegacyActiveClaimsText(content)) {
    return ok(content);
  }
  await migrateLegacyActiveClaimsFile({
    activePath: registryPath,
    nowIso: new Date().toISOString(),
  });
  return ok(await readTextFile(registryPath));
}

/**
 * Transactionally update the composed registry: the transform sees claims
 * plus live queue entries; the write-back decomposes — claims (and any
 * unrecognised top-level fields, preserved) to the claims file, queue
 * changes reconciled onto the per-intent store, and expired store files
 * swept (the lazy sweep every queue write operation owes).
 */
export async function updateRegistry(
  registryPath: string,
  transform: (registry: CommitQueueRegistry) => CommitQueueRegistry,
  nowIso: string = new Date().toISOString(),
): Promise<void> {
  // Pre-transaction read: the fresh-checkout seed error, not a bare ENOENT (as state-io.ts).
  unwrapOrThrow(await readRegistry(registryPath, { nowIso }));
  await runJsonStateTransaction({
    filePaths: [registryPath],
    operation: async () => {
      const before = unwrapOrThrow(await readRegistry(registryPath, { nowIso }));
      const after = transform(before);
      await writeJsonFileWithinTransaction({
        filePath: registryPath,
        value: claimsFileValue(after),
        validateText: (text) => validateCollaborationJsonFileText(registryPath, text),
      });
      await reconcileQueueStore({
        queueDir: commitQueueDirForActivePath(registryPath),
        before: before.commit_queue,
        after: after.commit_queue,
        nowIso,
      });
    },
  });
}

/**
 * The claims-file half of a composed registry: every top-level field except
 * the store-backed `commit_queue` (unrecognised fields survive write-back).
 */
function claimsFileValue(registry: CommitQueueRegistry): JsonObject {
  const { commit_queue: removedQueue, ...file } = registry;
  return removedQueue === undefined ? registry : file;
}

async function reconcileQueueStore(input: {
  readonly queueDir: string;
  readonly before: readonly CommitIntent[];
  readonly after: readonly CommitIntent[];
  readonly nowIso: string;
}): Promise<void> {
  const beforeIds = new Set(input.before.map((entry) => entry.intent_id));
  const afterIds = new Set(input.after.map((entry) => entry.intent_id));
  for (const entry of input.before) {
    if (!afterIds.has(entry.intent_id)) {
      await deleteCommitQueueEntry({
        queueDir: input.queueDir,
        intentId: entry.intent_id,
        nowIso: input.nowIso,
      });
    }
  }
  for (const entry of input.after) {
    // Create vs replace is decided by the PRE-TRANSFORM registry, not by
    // diffing before against after: an id the transform found already in
    // the queue is an update of a file that exists, and only a genuinely
    // new id may claim its path exclusively.
    await writeCommitQueueEntry({
      queueDir: input.queueDir,
      entry,
      nowIso: input.nowIso,
      publish: beforeIds.has(entry.intent_id) ? 'replace' : 'create',
    });
  }
  // A transform that only removed entries still owes the lazy sweep.
  await sweepExpiredCommitQueueEntries({ queueDir: input.queueDir, nowIso: input.nowIso });
}
