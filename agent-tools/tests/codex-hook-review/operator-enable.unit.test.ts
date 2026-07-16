import { join } from 'node:path';

import { err } from '@oaknational/result';
import { afterEach, describe, expect, it } from 'vitest';

import { type LocalActivationManifest } from '../../src/codex-hook-review/activation.js';
import { completePreparedEnable } from '../../src/codex-hook-review/operator-enable.js';
import { CODEX_HOOK_MARKER } from '../../src/codex-hook-review/settings.js';
import { CLAUDE_LOCAL_SETTINGS } from '../../src/codex-hook-review/settings-file.js';
import { CodexHookReviewRealFileSystem } from '../test-helpers/codex-hook-review-real-filesystem.js';

const fileSystem = new CodexHookReviewRealFileSystem();

afterEach(async () => fileSystem.cleanup());

const manifest: LocalActivationManifest = {
  schemaVersion: 1,
  enabled: false,
  selectedCellId: 'spark-low:inline',
  benchmarkReport: {
    reportSha256: 'a'.repeat(64),
    winnerCellId: 'spark-low:inline',
    qualified: true,
    concernDetectionRate: 0.8,
    falseAlertRate: 0.1,
    p50LatencyMs: 1,
    p95LatencyMs: 2,
  },
  fingerprint: {
    adapterBuildSha256: 'adapter',
    nodeBinarySha256: 'node',
    nodeVersion: '1',
    claudeBinarySha256: 'claude',
    claudeVersion: '1',
    codexBinarySha256: 'codex',
    codexVersion: '1',
    modelConfigurationSha256: 'model',
    authMode: 'chatgpt',
    invocationSha256: 'invocation',
    instructionAssetSha256: 'instructions',
    outputSchemaSha256: 'schema',
    effectivePromptSha256: 'prompt',
    gitleaksBinarySha256: 'gitleaks',
    gitleaksVersion: '1',
    gitleaksConfigSha256: 'config',
    corpusSha256: 'corpus',
    benchmarkVersion: 'v1',
  },
  executables: {
    node: { path: '/private/node', size: 1, mtimeMs: 1 },
    claude: { path: '/private/claude', size: 1, mtimeMs: 1 },
    codex: { path: '/private/codex', size: 1, mtimeMs: 1 },
    gitleaks: { path: '/private/gitleaks', size: 1, mtimeMs: 1 },
  },
  deployment: { entryPath: '/private/hook.mjs', sha256: 'b'.repeat(64) },
};

const unrelatedHook = {
  matcher: 'Read',
  hooks: [{ type: 'command', command: '/private/unrelated', args: [] }],
};

const originalSettings = {
  retained: true,
  hooks: { SessionStart: [], PostToolBatch: [unrelatedHook] },
};

async function projectWithUnrelatedSettings(): Promise<{
  readonly projectRoot: string;
  readonly settingsPath: string;
}> {
  const projectRoot = await fileSystem.temporaryRoot('codex-hook-enable-');
  const settingsPath = join(projectRoot, CLAUDE_LOCAL_SETTINGS);
  await fileSystem.createDirectory(join(projectRoot, '.claude'));
  await fileSystem.writeText(settingsPath, `${JSON.stringify(originalSettings)}\n`);
  return { projectRoot, settingsPath };
}

describe('prepared enable transaction', () => {
  it('removes the installed hook when manifest persistence fails', async () => {
    const { projectRoot, settingsPath } = await projectWithUnrelatedSettings();

    const result = await completePreparedEnable(projectRoot, manifest, {
      persistEnabledManifest: async () => err({ kind: 'write-failed' }),
    });

    expect(result).toStrictEqual(
      err({
        kind: 'manifest-write-failed',
        message: 'Unable to enable the activation manifest; installed hook was removed',
      }),
    );
    const settings: unknown = JSON.parse(await fileSystem.readText(settingsPath));
    expect(settings).toStrictEqual(originalSettings);
    expect(JSON.stringify(settings)).not.toContain(CODEX_HOOK_MARKER);
  });

  it('returns a bounded typed failure when hook rollback also fails', async () => {
    const { projectRoot, settingsPath } = await projectWithUnrelatedSettings();

    const result = await completePreparedEnable(projectRoot, manifest, {
      persistEnabledManifest: async () => err({ kind: 'write-failed' }),
      rollbackOwnedHook: async () =>
        err({ kind: 'settings-write-failed', message: 'private rollback detail' }),
    });

    expect(result).toStrictEqual(
      err({
        kind: 'enable-rollback-failed',
        message: 'Unable to enable the activation manifest and unable to remove the installed hook',
      }),
    );
    const settings: unknown = JSON.parse(await fileSystem.readText(settingsPath));
    const serializedSettings = JSON.stringify(settings);
    expect(settings).toMatchObject({ retained: true });
    expect(serializedSettings).toContain('/private/unrelated');
    expect(serializedSettings).toContain(CODEX_HOOK_MARKER);
    expect(JSON.stringify(result)).not.toContain('private rollback detail');
  });
});
