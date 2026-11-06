import { err } from '@oaknational/result';

import { appendDebugLogEntry, debugLogLine } from '../../src/claude/statusline-debug-log';
import { FAKE_OWNER_UID } from '../../src/core/test-helpers/in-memory-fs-state';
import { inMemoryFileSystem } from '../../src/core/test-helpers/in-memory-owner-only-append-fs';

/**
 * The statusline's wiring: its line lands through the owner-only append,
 * owner-only and only at the configured path, and nothing the file system
 * reports makes it throw. The line format is `debugLogLine`'s, unit-tested
 * beside the config resolver; the append's steps and refusals are proven in
 * `src/core/owner-only-append.integration.test.ts`. No IO: an in-memory file
 * system stands in (ADR-078), and the test reads its state afterwards.
 */

const LOG = '/d/s.log';
const NOW = '2026-08-07T15:00:00.000Z';

describe('appendDebugLogEntry', () => {
  it('lands its line owner-only at the configured path and nowhere else, and does not throw when the file system reports a failure', () => {
    const world = inMemoryFileSystem();
    // The close fails after a complete write: the line has landed, and the
    // append still reports a failure the wrapper must swallow.
    const closeFails = { ...world.fs, close: () => err({ code: 'EIO' }) };
    expect(() => appendDebugLogEntry(LOG, '{"a":1}\n', NOW, closeFails)).not.toThrow();
    expect(world.entries.get(LOG)).toEqual({
      kind: 'file',
      mode: 0o600,
      uid: FAKE_OWNER_UID,
      bytes: Buffer.from(debugLogLine('{"a":1}\n', NOW), 'utf8'),
    });
    expect([...world.entries.keys()]).toEqual(['/d', LOG]);
  });
});
