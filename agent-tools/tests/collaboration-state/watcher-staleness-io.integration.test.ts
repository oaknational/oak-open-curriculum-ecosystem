/**
 * Integration coverage for the production `WatcherStalenessIo` adapter against
 * the real filesystem: `statMtimeMs` returns a numeric mtime for a present file
 * and the literal `'missing'` for an absent one (never throwing on ENOENT), and
 * `readTextFile` returns the file contents.
 */
import { mkdtemp, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { productionWatcherStalenessIo } from '../../src/collaboration-state/watcher-staleness-io';
import { removeDirectory } from '../test-helpers/temp-collaboration-state';

describe('productionWatcherStalenessIo', () => {
  let dir = '';

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'watcher-staleness-io-'));
  });

  afterEach(async () => {
    await removeDirectory(dir);
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
    // Statting a self-referential link yields ELOOP (not ENOENT) on every
    // platform: the path exists but is unusable, so the adapter must fail
    // loud, not masquerade as a watcher that was never started. Created as a
    // 'junction' so no privilege is needed on Windows; the type argument is
    // ignored on POSIX, and lstat-style loop detection fires either way.
    const loop = join(dir, 'loop');
    await symlink(loop, loop, 'junction');

    // Pin the rethrow class, not just "it threw": the escaping error must be
    // an errno-carrying failure that is NOT the missing-file class — ENOENT
    // is the one code the adapter maps to 'missing' instead of throwing.
    const failure: unknown = await productionWatcherStalenessIo.statMtimeMs(loop).then(
      () => undefined,
      (cause: unknown) => cause,
    );
    expect(failure).toBeInstanceOf(Error);
    const code = failure instanceof Error && 'code' in failure ? failure.code : undefined;
    expect(code).toBeDefined();
    expect(code).not.toBe('ENOENT');
  });
});
