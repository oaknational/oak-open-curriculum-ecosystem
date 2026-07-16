import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { deactivateHookReviewState } from '../../src/codex-hook-review/operator-deactivation.js';
import { CLAUDE_LOCAL_SETTINGS } from '../../src/codex-hook-review/settings-file.js';
import { CodexHookReviewRealFileSystem } from '../test-helpers/codex-hook-review-real-filesystem.js';

const fileSystem = new CodexHookReviewRealFileSystem();

afterEach(async () => fileSystem.cleanup());

describe('hook review deactivation', () => {
  it.each(['clear', 'disable'] as const)(
    'does not create Claude settings in a clean project for %s disposition',
    async (disposition) => {
      const projectRoot = await fileSystem.temporaryRoot('codex-hook-deactivation-');

      const result = await deactivateHookReviewState(projectRoot, disposition);

      expect(result).toStrictEqual({ ok: true, value: undefined });
      expect(await fileSystem.entries(projectRoot)).toStrictEqual([]);
    },
  );

  it('preserves marker-free settings byte-for-byte', async () => {
    const projectRoot = await fileSystem.temporaryRoot('codex-hook-deactivation-');
    const claudeDirectory = join(projectRoot, '.claude');
    const settingsPath = join(projectRoot, CLAUDE_LOCAL_SETTINGS);
    const original =
      '{ "retained":true, "hooks": { "PostToolBatch": [{ "matcher":"Read", "hooks":[] }] } }\n\n';
    await fileSystem.createDirectory(claudeDirectory);
    await fileSystem.writeText(settingsPath, original);

    const result = await deactivateHookReviewState(projectRoot, 'clear');

    expect(result).toStrictEqual({ ok: true, value: undefined });
    expect(await fileSystem.readText(settingsPath)).toBe(original);
  });
});
