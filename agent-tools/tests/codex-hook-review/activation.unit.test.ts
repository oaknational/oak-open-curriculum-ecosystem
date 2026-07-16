import { describe, expect, it } from 'vitest';

import { evaluateLocalActivation } from '../../src/codex-hook-review/activation';

type Manifest = Parameters<typeof evaluateLocalActivation>[0];
type Fingerprint = Parameters<typeof evaluateLocalActivation>[1];

const FINGERPRINT = {
  adapterBuildSha256: 'adapter',
  nodeBinarySha256: 'node-binary',
  nodeVersion: 'node-version',
  claudeBinarySha256: 'claude-binary',
  claudeVersion: '1',
  codexBinarySha256: 'binary',
  codexVersion: '2',
  modelConfigurationSha256: 'model',
  authMode: 'chatgpt',
  invocationSha256: 'invocation',
  instructionAssetSha256: 'instructions',
  outputSchemaSha256: 'schema',
  effectivePromptSha256: 'prompt',
  gitleaksBinarySha256: 'gitleaks',
  gitleaksVersion: '3',
  gitleaksConfigSha256: 'config',
  corpusSha256: 'corpus',
  benchmarkVersion: 'v1',
} as const satisfies Fingerprint;

const MANIFEST = {
  schemaVersion: 1,
  enabled: true,
  selectedCellId: 'spark-low:inline',
  benchmarkReport: {
    reportSha256: 'report',
    winnerCellId: 'spark-low:inline',
    qualified: true,
    concernDetectionRate: 0.8,
    falseAlertRate: 0.1,
    p50LatencyMs: 2_000,
    p95LatencyMs: 3_000,
  },
  fingerprint: FINGERPRINT,
  executables: {
    node: { path: '/opt/node', size: 10, mtimeMs: 1 },
    claude: { path: '/opt/claude', size: 10, mtimeMs: 1 },
    codex: { path: '/opt/codex', size: 10, mtimeMs: 1 },
    gitleaks: { path: '/opt/gitleaks', size: 10, mtimeMs: 1 },
  },
  deployment: { entryPath: '/private/hook.mjs', sha256: 'a'.repeat(64) },
} as const satisfies Manifest;

describe('local activation manifest', () => {
  it('enables only the qualified winner under an unchanged fingerprint', () => {
    expect(evaluateLocalActivation(MANIFEST, FINGERPRINT)).toStrictEqual({
      enabled: true,
      selectedCellId: 'spark-low:inline',
    });
  });

  it('reports every drifted activation input and disables the hook', () => {
    const current = { ...FINGERPRINT, codexVersion: '2.1', corpusSha256: 'new-corpus' };

    expect(evaluateLocalActivation(MANIFEST, current)).toStrictEqual({
      enabled: false,
      reason: 'fingerprint-drift',
      mismatches: [
        { field: 'codexVersion', expected: '2', actual: '2.1' },
        { field: 'corpusSha256', expected: 'corpus', actual: 'new-corpus' },
      ],
    });
  });

  it('disables a manifest whose selected cell differs from its benchmark winner', () => {
    const manifest = { ...MANIFEST, selectedCellId: 'spark-low:skill' } as const;

    expect(evaluateLocalActivation(manifest, FINGERPRINT)).toStrictEqual({
      enabled: false,
      reason: 'winner-mismatch',
      mismatches: [],
    });
  });
});
