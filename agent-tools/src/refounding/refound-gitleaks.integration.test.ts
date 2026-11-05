import type { SpawnSyncReturns } from 'node:child_process';

import { ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { probeGitleaksVersion } from './refound-gitleaks.js';

/**
 * The gitleaks version probe (the freeze run's attestation seam) over an
 * injected runner: what the probe reports for each way gitleaks can answer.
 */

const REPO_ROOT = '/repo';

function spawnResult(fields: Partial<SpawnSyncReturns<string>>): SpawnSyncReturns<string> {
  return { pid: 1, output: [], stdout: '', stderr: '', status: 0, signal: null, ...fields };
}

describe('probeGitleaksVersion', () => {
  it("reports gitleaks's self-reported version, trimmed", () => {
    const version = probeGitleaksVersion(REPO_ROOT, () =>
      spawnResult({ stdout: 'fake-gitleaks 0.0.0-test\n' }),
    );
    expect(version).toStrictEqual(ok('fake-gitleaks 0.0.0-test'));
  });

  it('refuses when gitleaks cannot be started', () => {
    const version = probeGitleaksVersion(REPO_ROOT, () =>
      spawnResult({ status: null, error: new Error('spawnSync gitleaks ENOENT') }),
    );
    expect(version.ok).toBe(false);
    expect(version.ok ? undefined : version.error.message).toContain('ENOENT');
  });

  it('refuses when gitleaks starts but exits non-zero, carrying its exit code and stderr', () => {
    const status = 126;
    const stderr = 'No version is set for command gitleaks';
    const version = probeGitleaksVersion(REPO_ROOT, () => spawnResult({ status, stderr }));
    expect(version.ok).toBe(false);
    const message = version.ok ? undefined : version.error.message;
    expect(message).toContain(`exit ${String(status)}`);
    expect(message).toContain(stderr);
  });
});
