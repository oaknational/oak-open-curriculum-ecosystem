import { afterEach, assert, describe, expect, it } from 'vitest';

import { type RuntimeExecutablePins } from '../../src/codex-hook-review/activation.js';
import { createCodexProcessRequest } from '../../src/codex-hook-review/configuration.js';
import { fingerprintInvocationSha256 } from '../../src/codex-hook-review/invocation-fingerprint.js';
import { prepareProductionReview } from '../../src/codex-hook-review/production.js';
import { ensureReviewRuntimeLayout } from '../../src/codex-hook-review/review-assets.js';
import { MODEL_CONFIGURATIONS } from '../../src/codex-hook-review/tournament-types.js';
import { CodexHookReviewRealFileSystem } from '../test-helpers/codex-hook-review-real-filesystem.js';

const fileSystem = new CodexHookReviewRealFileSystem();
const EXECUTABLES: RuntimeExecutablePins = {
  node: { path: '/opt/node', size: 1, mtimeMs: 1 },
  claude: { path: '/opt/claude', size: 1, mtimeMs: 1 },
  codex: { path: '/opt/codex', size: 1, mtimeMs: 1 },
  gitleaks: { path: '/opt/gitleaks', size: 1, mtimeMs: 1 },
};

afterEach(async () => {
  await fileSystem.cleanup();
});

describe('production review preparation', () => {
  it('accepts the exact fingerprinted invocation and snapshots its allowlisted environment', async () => {
    const userHome = await fileSystem.temporaryRoot('codex-review-production-');
    const sourceEnvironment = {
      LANG: 'en_GB.UTF-8',
      SSL_CERT_FILE: '/private/cert.pem',
      OPENAI_API_KEY: 'must-not-pass',
    };
    const expectedInvocationSha256 = await createInvocationHash(userHome, sourceEnvironment);

    const prepared = await prepareProductionReview(
      'spark-low:inline',
      userHome,
      sourceEnvironment,
      EXECUTABLES,
      expectedInvocationSha256,
    );

    assert(prepared.ok);
    expect(prepared.value.context.sourceEnvironment).toMatchObject({
      LANG: 'en_GB.UTF-8',
      SSL_CERT_FILE: '/private/cert.pem',
    });
    expect(prepared.value.context.sourceEnvironment).not.toHaveProperty('OPENAI_API_KEY');
  });

  it('rejects a current allowlisted environment that differs from benchmark evidence', async () => {
    const userHome = await fileSystem.temporaryRoot('codex-review-production-');
    const expectedInvocationSha256 = await createInvocationHash(userHome, {
      LANG: 'en_GB.UTF-8',
    });

    await expect(
      prepareProductionReview(
        'spark-low:inline',
        userHome,
        { LANG: 'fr_FR.UTF-8' },
        EXECUTABLES,
        expectedInvocationSha256,
      ),
    ).resolves.toStrictEqual({ ok: false, error: { kind: 'runtime-invocation-drift' } });
  });
});

async function createInvocationHash(
  userHome: string,
  sourceEnvironment: Readonly<NodeJS.ProcessEnv>,
): Promise<string> {
  const layout = await ensureReviewRuntimeLayout({ userHome, mechanism: 'inline' });
  assert(layout.ok);
  const request = createCodexProcessRequest({
    payload: '{}',
    modelConfiguration: MODEL_CONFIGURATIONS[0],
    mechanism: 'inline',
    layout: layout.value,
    sourceEnvironment,
    codexExecutable: EXECUTABLES.codex.path,
  });
  assert(request.ok);
  return fingerprintInvocationSha256({
    command: request.value.command,
    args: request.value.args,
    cwd: request.value.cwd,
    env: request.value.env,
  });
}
