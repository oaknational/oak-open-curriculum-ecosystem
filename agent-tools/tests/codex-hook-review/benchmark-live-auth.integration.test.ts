import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { assertDedicatedCodexAuthentication } from '../../src/codex-hook-review/benchmark-live.js';
import {
  type CodexProcessRequest,
  type CodexProcessRunner,
} from '../../src/codex-hook-review/process-runner.js';
import { ensureReviewRuntimeLayout } from '../../src/codex-hook-review/review-assets.js';
import { CodexHookReviewRealFileSystem } from '../test-helpers/codex-hook-review-real-filesystem.js';

const fileSystem = new CodexHookReviewRealFileSystem();

afterEach(async () => {
  await fileSystem.cleanup();
});

describe('dedicated Codex authentication', () => {
  it('checks private auth with the pinned executable and isolated environment', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-auth-');
    const layout = await ensureReviewRuntimeLayout({ userHome: root, mechanism: 'inline' });
    expect(layout.ok).toBe(true);
    if (!layout.ok) {
      return;
    }
    await fileSystem.writeText(join(layout.value.codexHome, 'auth.json'), '{"auth":true}\n', 0o600);
    const requests: CodexProcessRequest[] = [];
    const processRunner: CodexProcessRunner = {
      run: async (request) => {
        requests.push(request);
        return { kind: 'completed', stdout: 'Logged in', durationMs: 1 };
      },
    };

    const result = await assertDedicatedCodexAuthentication({
      userHome: root,
      sourceEnvironment: { PATH: '/untrusted', LANG: 'en_GB.UTF-8' },
      codexExecutable: '/opt/codex',
      processRunner,
    });

    expect(result).toStrictEqual({ ok: true, value: undefined });
    expect(requests).toMatchObject([
      {
        command: '/opt/codex',
        args: ['-c', 'cli_auth_credentials_store="file"', 'login', 'status'],
        cwd: layout.value.workingDirectory,
        env: {
          HOME: layout.value.homeDirectory,
          CODEX_HOME: layout.value.codexHome,
          LANG: 'en_GB.UTF-8',
        },
        stdin: '',
      },
    ]);
    expect(requests[0]?.env['PATH']).toBeUndefined();
  });

  it.each([
    { kind: 'empty', content: '', mode: 0o600 },
    { kind: 'permissive', content: '{"auth":true}\n', mode: 0o644 },
  ] as const)('rejects a $kind auth file before starting Codex', async ({ content, mode }) => {
    const root = await fileSystem.temporaryRoot('codex-review-auth-');
    const layout = await ensureReviewRuntimeLayout({ userHome: root, mechanism: 'inline' });
    expect(layout.ok).toBe(true);
    if (!layout.ok) {
      return;
    }
    await fileSystem.writeText(join(layout.value.codexHome, 'auth.json'), content, mode);
    let called = false;

    const result = await assertDedicatedCodexAuthentication({
      userHome: root,
      sourceEnvironment: {},
      codexExecutable: '/opt/codex',
      processRunner: {
        run: async () => {
          called = true;
          return { kind: 'completed', stdout: '', durationMs: 0 };
        },
      },
    });

    expect(result).toStrictEqual({ ok: false, error: { kind: 'authentication-missing' } });
    expect(called).toBe(false);
  });

  it('rejects a linked auth file and a failed local login status', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-auth-');
    const outside = await fileSystem.temporaryRoot('codex-review-auth-target-');
    const layout = await ensureReviewRuntimeLayout({ userHome: root, mechanism: 'inline' });
    expect(layout.ok).toBe(true);
    if (!layout.ok) {
      return;
    }
    const target = join(outside, 'auth.json');
    const authPath = join(layout.value.codexHome, 'auth.json');
    await fileSystem.writeText(target, '{"auth":true}\n', 0o600);
    await fileSystem.createSymbolicLink(target, authPath);
    const linked = await assertDedicatedCodexAuthentication({
      userHome: root,
      sourceEnvironment: {},
      codexExecutable: '/opt/codex',
      processRunner: successfulRunner,
    });
    await fileSystem.remove(authPath);
    await fileSystem.writeText(authPath, '{"auth":true}\n', 0o600);
    const failed = await assertDedicatedCodexAuthentication({
      userHome: root,
      sourceEnvironment: {},
      codexExecutable: '/opt/codex',
      processRunner: {
        run: async () => ({ kind: 'failed', reason: 'non-zero-exit', durationMs: 1 }),
      },
    });

    expect(linked).toStrictEqual({ ok: false, error: { kind: 'authentication-missing' } });
    expect(failed).toStrictEqual({ ok: false, error: { kind: 'authentication-missing' } });
  });
});

const successfulRunner: CodexProcessRunner = {
  run: async () => ({ kind: 'completed', stdout: '', durationMs: 0 }),
};
