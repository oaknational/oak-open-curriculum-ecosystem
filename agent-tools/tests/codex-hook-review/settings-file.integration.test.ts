import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  readClaudeLocalSettings,
  writeClaudeLocalSettings,
} from '../../src/codex-hook-review/settings-file.js';
import { CodexHookReviewRealFileSystem } from '../test-helpers/codex-hook-review-real-filesystem.js';

const fileSystem = new CodexHookReviewRealFileSystem();

afterEach(async () => {
  await fileSystem.cleanup();
});

describe('Claude local settings file safety', () => {
  it('rejects a linked Claude directory for reads and writes', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-settings-');
    const outside = await fileSystem.temporaryRoot('codex-review-settings-target-');
    await fileSystem.createSymbolicLink(outside, join(root, '.claude'));

    const read = await readClaudeLocalSettings(root);
    const written = await writeClaudeLocalSettings(root, { hooks: {} });

    expect(read).toStrictEqual({ ok: false, error: { kind: 'invalid' } });
    expect(written).toStrictEqual({ ok: false, error: { kind: 'write-failed' } });
    expect(await fileSystem.entries(outside)).toEqual([]);
  });

  it('rejects a linked settings file without modifying its target', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-settings-');
    const outside = await fileSystem.temporaryRoot('codex-review-settings-target-');
    const claudeDirectory = join(root, '.claude');
    const target = join(outside, 'target.json');
    await fileSystem.createDirectory(claudeDirectory);
    await fileSystem.writeText(target, '{"unchanged":true}\n');
    await fileSystem.createSymbolicLink(target, join(claudeDirectory, 'settings.local.json'));

    const read = await readClaudeLocalSettings(root);
    const written = await writeClaudeLocalSettings(root, { hooks: {} });

    expect(read).toStrictEqual({ ok: false, error: { kind: 'read-failed' } });
    expect(written).toStrictEqual({ ok: false, error: { kind: 'write-failed' } });
    expect(await fileSystem.readText(target)).toBe('{"unchanged":true}\n');
  });
});
