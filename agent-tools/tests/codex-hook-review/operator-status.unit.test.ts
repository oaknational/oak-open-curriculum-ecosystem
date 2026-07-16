import { ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  type LocalActivationManifest,
  type RuntimeFingerprint,
} from '../../src/codex-hook-review/activation.js';
import { type LiveBenchmarkContext } from '../../src/codex-hook-review/benchmark-live.js';
import {
  statusHookReviewOperator,
  type StatusCommandDependencies,
} from '../../src/codex-hook-review/operator-status.js';

const fingerprint: RuntimeFingerprint = {
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
};

const enabledManifest: LocalActivationManifest = {
  schemaVersion: 1,
  enabled: true,
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
  fingerprint,
  executables: {
    node: { path: '/private/node', size: 1, mtimeMs: 1 },
    claude: { path: '/private/claude', size: 1, mtimeMs: 1 },
    codex: { path: '/private/codex', size: 1, mtimeMs: 1 },
    gitleaks: { path: '/private/gitleaks', size: 1, mtimeMs: 1 },
  },
  deployment: { entryPath: '/private/hook.mjs', sha256: 'b'.repeat(64) },
};

const context: LiveBenchmarkContext = {
  projectRoot: '/project',
  userHome: '/private/home',
  sourceEnvironment: {},
  executables: {
    node: '/private/node',
    claude: '/private/claude',
    codex: '/private/codex',
    gitleaks: '/private/gitleaks',
  },
};

function dependencies(
  overrides: Partial<StatusCommandDependencies> = {},
): StatusCommandDependencies {
  return {
    readManifest: async () => ok(enabledManifest),
    readHookPresence: async () => ok(true),
    verifyReport: async () => ok(undefined),
    runtimeCurrent: async () => ok(true),
    createContext: async () => ok(context),
    authenticationAvailable: async () => true,
    fingerprintCell: async () => ok(fingerprint),
    ...overrides,
  };
}

async function runStatus(statusDependencies: StatusCommandDependencies) {
  const lines: string[] = [];
  const result = await statusHookReviewOperator(
    {
      projectRoot: '/project',
      environment: {},
      output: { writeLine: (line) => lines.push(line) },
    },
    statusDependencies,
  );
  return { lines, result };
}

describe('Codex hook review status truthfulness', () => {
  it('keeps an active qualified deployment enabled when workspace inputs drift', async () => {
    const { lines, result } = await runStatus(
      dependencies({
        fingerprintCell: async () => ok({ ...fingerprint, corpusSha256: 'changed-corpus' }),
      }),
    );

    expect(result).toStrictEqual(ok(0));
    expect(lines).toStrictEqual([
      'enabled on qualified deployment: spark-low:inline; hook=present; workspace=fingerprint-drift',
    ]);
    expect(lines[0]).not.toContain('disabled');
  });

  it('reports a present active hook and current workspace independently', async () => {
    const { lines, result } = await runStatus(dependencies());

    expect(result).toStrictEqual(ok(0));
    expect(lines).toStrictEqual([
      'enabled on qualified deployment: spark-low:inline; hook=present; workspace=current',
    ]);
  });

  it('reports true deployed runtime drift as disabled', async () => {
    let fingerprintCalls = 0;
    const { lines, result } = await runStatus(
      dependencies({
        runtimeCurrent: async () => ok(false),
        fingerprintCell: async () => {
          fingerprintCalls += 1;
          return ok(fingerprint);
        },
      }),
    );

    expect(result).toStrictEqual(ok(0));
    expect(lines).toStrictEqual(['disabled: runtime-drift; hook=present']);
    expect(fingerprintCalls).toBe(0);
  });

  it('reports an absent hook as disabled without conflating workspace state', async () => {
    let fingerprintCalls = 0;
    const { lines, result } = await runStatus(
      dependencies({
        readHookPresence: async () => ok(false),
        fingerprintCell: async () => {
          fingerprintCalls += 1;
          return ok(fingerprint);
        },
      }),
    );

    expect(result).toStrictEqual(ok(0));
    expect(lines).toStrictEqual(['disabled: hook-missing; hook=absent']);
    expect(fingerprintCalls).toBe(0);
  });

  it('reports a disabled manifest before considering workspace drift', async () => {
    let fingerprintCalls = 0;
    const { lines, result } = await runStatus(
      dependencies({
        readManifest: async () => ok({ ...enabledManifest, enabled: false }),
        fingerprintCell: async () => {
          fingerprintCalls += 1;
          return ok({ ...fingerprint, corpusSha256: 'changed-corpus' });
        },
      }),
    );

    expect(result).toStrictEqual(ok(0));
    expect(lines).toStrictEqual(['disabled: manifest-disabled; hook=present']);
    expect(fingerprintCalls).toBe(0);
  });
});
