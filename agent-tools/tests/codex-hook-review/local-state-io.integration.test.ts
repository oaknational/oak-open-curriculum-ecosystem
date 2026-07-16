import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { clearLocalActivationManifest } from '../../src/codex-hook-review/local-state.js';
import { writePrivateAtomic } from '../../src/codex-hook-review/local-state-io.js';
import { CodexHookReviewRealFileSystem } from '../test-helpers/codex-hook-review-real-filesystem.js';

const fileSystem = new CodexHookReviewRealFileSystem();

afterEach(async () => {
  await fileSystem.cleanup();
});

describe('local benchmark state I/O safety', () => {
  it.each([
    { linkedDirectory: '.claude', directories: ['.claude'] },
    { linkedDirectory: 'logs', directories: ['.claude', 'logs'] },
  ] as const)(
    'rejects a linked $linkedDirectory directory',
    async ({ linkedDirectory, directories }) => {
      const root = await fileSystem.temporaryRoot('codex-review-state-');
      const outside = await fileSystem.temporaryRoot('codex-review-state-target-');
      if (linkedDirectory === 'logs') {
        await fileSystem.createDirectory(join(root, '.claude'));
        await fileSystem.createSymbolicLink(outside, join(root, '.claude', 'logs'));
      } else {
        await fileSystem.createSymbolicLink(outside, join(root, '.claude'));
      }

      const written = await writePrivateAtomic(
        { anchor: root, directories, basename: 'state.json' },
        '{}\n',
      );

      expect(written).toStrictEqual({ ok: false, error: { kind: 'write-failed' } });
      expect(await fileSystem.entries(outside)).toEqual([]);
    },
  );

  it('rejects linked manifest and report leaves without modifying their targets', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-state-');
    const outside = await fileSystem.temporaryRoot('codex-review-state-target-');
    const logs = join(root, '.claude', 'logs');
    await fileSystem.createDirectory(logs, { recursive: true });
    const target = join(outside, 'target.json');
    await fileSystem.writeText(target, '{"unchanged":true}\n');
    await fileSystem.createSymbolicLink(target, join(root, '.claude', 'codex-review.local.json'));
    await fileSystem.createSymbolicLink(target, join(logs, 'codex-review-benchmark.json'));

    const manifest = await writePrivateAtomic(
      { anchor: root, directories: ['.claude'], basename: 'codex-review.local.json' },
      '{}\n',
    );
    const report = await writePrivateAtomic(
      {
        anchor: root,
        directories: ['.claude', 'logs'],
        basename: 'codex-review-benchmark.json',
      },
      '{}\n',
    );
    const cleared = await clearLocalActivationManifest(root);

    expect(manifest.ok).toBe(false);
    expect(report.ok).toBe(false);
    expect(cleared.ok).toBe(false);
    expect(await fileSystem.readText(target)).toBe('{"unchanged":true}\n');
  });
});
