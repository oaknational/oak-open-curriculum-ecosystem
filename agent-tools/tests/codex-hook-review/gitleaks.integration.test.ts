import { join } from 'node:path';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  scanOutboundPayload,
  type GitleaksProcessRunner,
} from '../../src/codex-hook-review/gitleaks.js';
import { CodexHookReviewRealFileSystem } from '../test-helpers/codex-hook-review-real-filesystem.js';

const fileSystem = new CodexHookReviewRealFileSystem();

afterEach(async () => {
  await fileSystem.cleanup();
});

describe('Gitleaks isolated cwd policy', () => {
  it.each(['.gitleaks.toml', '.gitleaksignore'] as const)(
    'fails closed when %s exists in the scanner cwd',
    async (basename) => {
      const cwd = await fileSystem.temporaryRoot('codex-review-gitleaks-');
      await fileSystem.writeText(join(cwd, basename), 'ambient');
      const run = vi.fn<GitleaksProcessRunner['run']>();

      const outcome = await scanOutboundPayload({
        payload: '{"version":1}',
        isolatedCwd: cwd,
        env: {},
        executable: '/opt/gitleaks',
        runner: { run },
      });

      expect(outcome).toStrictEqual({ kind: 'skipped', reason: 'ambient-config' });
      expect(run).not.toHaveBeenCalled();
    },
  );
});
