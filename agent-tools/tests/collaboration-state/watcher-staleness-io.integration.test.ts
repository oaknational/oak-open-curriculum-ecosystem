/**
 * Integration coverage for the production `WatcherStalenessIo` adapter against
 * the real filesystem: `statMtimeMs` returns a numeric mtime for a present file
 * and the literal `'missing'` for an absent one (never throwing on ENOENT), and
 * `readTextFile` returns the file contents.
 */
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { productionWatcherStalenessIo } from '../../src/collaboration-state/watcher-staleness-io';

describe('productionWatcherStalenessIo', () => {
  let dir = '';

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'watcher-staleness-io-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('returns a numeric mtime for a present file', async () => {
    const file = join(dir, 'heartbeat.json');
    await writeFile(file, '{}', 'utf8');

    const mtime = await productionWatcherStalenessIo.statMtimeMs(file);

    expect(typeof mtime).toBe('number');
    expect(mtime).toBeGreaterThan(0);
  });

  it("returns 'missing' for an absent file rather than throwing", async () => {
    const result = await productionWatcherStalenessIo.statMtimeMs(join(dir, 'no-such-file.json'));

    expect(result).toBe('missing');
  });

  it('reads the text contents of a present file', async () => {
    const file = join(dir, 'seen.json');
    await writeFile(file, 'hello watcher', 'utf8');

    expect(await productionWatcherStalenessIo.readTextFile(file)).toBe('hello watcher');
  });

  it('rethrows a non-ENOENT stat error rather than reporting it as missing', async () => {
    // Statting THROUGH a regular file yields ENOTDIR (not ENOENT): the file
    // exists but the path is unusable, so the adapter must fail loud, not
    // masquerade as a watcher that was never started.
    const file = join(dir, 'not-a-dir');
    await writeFile(file, 'x', 'utf8');

    await expect(
      productionWatcherStalenessIo.statMtimeMs(join(file, 'child.json')),
    ).rejects.toThrow();
  });
});
