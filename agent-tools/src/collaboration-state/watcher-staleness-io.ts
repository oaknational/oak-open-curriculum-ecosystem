/**
 * Production filesystem binding for the `WatcherStalenessIo` seam consumed by
 * `detectStaleWatcher`. Kept as its own module rather than widening
 * `CollaborationStateCliIo` (which deliberately excludes `stat`): only the
 * liveness/presence path needs file mtime, so the dependency stays local.
 *
 * `statMtimeMs` returns the literal `'missing'` for an absent file (the result
 * type IS the absence contract) and rethrows any other error (e.g. EACCES) so
 * an unreadable-but-present heartbeat fails loud rather than masquerading as a
 * watcher that was never started. The mapping is made over an injectable
 * {@link WatcherStalenessFs}, so it is proved without a disk; the production
 * binding wires `node:fs/promises` once, below.
 */
import { readFile, stat } from 'node:fs/promises';

import { isErrnoCode } from './errno.js';
import { type WatcherStalenessIo } from './watcher-staleness.js';

/** The two file reads the binding is made of. */
export interface WatcherStalenessFs {
  /** Reads a whole file as UTF-8 text. */
  readonly readTextFile: (filePath: string) => Promise<string>;
  /** The file's modification time in milliseconds; rejects as `node:fs` does when the file cannot be statted. */
  readonly statMtimeMs: (filePath: string) => Promise<number>;
}

/**
 * Binds the seam over `fs`: text reads pass through; a stat's `ENOENT` reads
 * as `'missing'` and every other failure rethrows.
 */
export function createWatcherStalenessIo(fs: WatcherStalenessFs): WatcherStalenessIo {
  return {
    readTextFile: (filePath) => fs.readTextFile(filePath),
    statMtimeMs: async (filePath) => {
      try {
        return await fs.statMtimeMs(filePath);
      } catch (error) {
        if (isErrnoCode(error, 'ENOENT')) {
          return 'missing';
        }
        throw error;
      }
    },
  };
}

export const productionWatcherStalenessIo: WatcherStalenessIo = createWatcherStalenessIo({
  readTextFile: (filePath) => readFile(filePath, 'utf8'),
  statMtimeMs: async (filePath) => (await stat(filePath)).mtimeMs,
});
