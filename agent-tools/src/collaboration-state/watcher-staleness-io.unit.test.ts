/**
 * The `WatcherStalenessIo` binding's one piece of logic: an absent file reads
 * as `'missing'`, and every other stat failure escapes as itself.
 */
import { describe, expect, it } from 'vitest';

import { createWatcherStalenessIo, type WatcherStalenessFs } from './watcher-staleness-io.js';

/** An error carrying the errno `code` Node's fs attaches. */
function errnoError(code: string): Error {
  return Object.assign(new Error(`${code}: fixture failure`), { code });
}

/** A file system whose stat answers from the table and whose reads return the path. */
function fsStatting(outcomes: Readonly<Record<string, number | Error>>): WatcherStalenessFs {
  return {
    readTextFile: (filePath) => Promise.resolve(`contents of ${filePath}`),
    statMtimeMs: (filePath) => {
      const outcome = outcomes[filePath];
      if (outcome === undefined) {
        return Promise.reject(errnoError('ENOENT'));
      }
      return outcome instanceof Error ? Promise.reject(outcome) : Promise.resolve(outcome);
    },
  };
}

describe('createWatcherStalenessIo', () => {
  it('returns the modification time of a present file', async () => {
    const io = createWatcherStalenessIo(fsStatting({ '/state/heartbeat.json': 1_700_000_000_000 }));

    expect(await io.statMtimeMs('/state/heartbeat.json')).toBe(1_700_000_000_000);
  });

  it("returns 'missing' for an absent file rather than throwing", async () => {
    const io = createWatcherStalenessIo(fsStatting({}));

    expect(await io.statMtimeMs('/state/no-such-file.json')).toBe('missing');
  });

  it('reads the text of a file through the seam unchanged', async () => {
    const io = createWatcherStalenessIo(fsStatting({}));

    expect(await io.readTextFile('/state/seen.json')).toBe('contents of /state/seen.json');
  });

  it('rethrows a stat failure that is not ENOENT rather than reporting it as missing', async () => {
    // A present-but-unusable path (ELOOP, EACCES) must fail loud, not
    // masquerade as a watcher that was never started.
    const io = createWatcherStalenessIo(fsStatting({ '/state/loop': errnoError('ELOOP') }));

    await expect(io.statMtimeMs('/state/loop')).rejects.toMatchObject({ code: 'ELOOP' });
  });
});
