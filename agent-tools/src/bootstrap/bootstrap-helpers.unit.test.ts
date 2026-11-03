import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  binPathFromManifest,
  interpretSpawnOutcome,
  interpretTscOutcome,
} from './bootstrap-helpers.js';

describe('interpretTscOutcome', () => {
  it('treats a clean exit (status 0, no signal, no error) as success', () => {
    expect(interpretTscOutcome({ error: undefined, signal: null, status: 0 })).toStrictEqual({
      failed: false,
      exitCode: 0,
      reason: undefined,
    });
  });

  it('fails when tsc could not be started (spawn error)', () => {
    const verdict = interpretTscOutcome({ error: new Error('ENOENT'), signal: null, status: null });

    expect(verdict.failed).toBe(true);
    expect(verdict.exitCode).toBe(1);
  });

  it('fails when tsc is killed by a signal — must not coerce a null status to exit 0', () => {
    const verdict = interpretTscOutcome({ error: undefined, signal: 'SIGKILL', status: null });

    expect(verdict.failed).toBe(true);
    expect(verdict.exitCode).toBe(1);
  });

  it('propagates a non-zero tsc exit code', () => {
    expect(interpretTscOutcome({ error: undefined, signal: null, status: 2 })).toMatchObject({
      failed: true,
      exitCode: 2,
    });
  });
});

describe('interpretSpawnOutcome', () => {
  it('names the spawned tool in every failure reason', () => {
    const spawnError = interpretSpawnOutcome('tsup (result)', {
      error: new Error('ENOENT'),
      signal: null,
      status: null,
    });
    const signalKill = interpretSpawnOutcome('tsup (result)', {
      error: undefined,
      signal: 'SIGKILL',
      status: null,
    });
    const nonZero = interpretSpawnOutcome('tsup (result)', {
      error: undefined,
      signal: null,
      status: 2,
    });

    expect(spawnError.reason).toContain('tsup (result)');
    expect(signalKill.reason).toContain('tsup (result)');
    expect(nonZero.reason).toContain('tsup (result)');
  });

  it('treats a clean exit as success with no reason', () => {
    expect(
      interpretSpawnOutcome('tsup (result)', { error: undefined, signal: null, status: 0 }),
    ).toStrictEqual({ failed: false, exitCode: 0, reason: undefined });
  });
});

describe('binPathFromManifest', () => {
  it('resolves a string-shaped bin field relative to the package dir', () => {
    // The product joins with host separators; the expectation derives the same
    // host form so the assertion holds on every platform.
    expect(binPathFromManifest('/pkgs/tsup', { bin: './dist/cli-default.js' }, 'tsup')).toBe(
      join('/pkgs/tsup', 'dist', 'cli-default.js'),
    );
  });

  it('resolves a record-shaped bin field by bin name', () => {
    expect(
      binPathFromManifest('/pkgs/tsup', { bin: { tsup: 'dist/cli-default.js' } }, 'tsup'),
    ).toBe(join('/pkgs/tsup', 'dist', 'cli-default.js'));
  });

  it('returns undefined for a missing bin name so the caller can fail loudly', () => {
    expect(binPathFromManifest('/pkgs/tsup', { bin: { other: 'x.js' } }, 'tsup')).toBeUndefined();
  });

  it('returns undefined for malformed manifests rather than asserting on untrusted JSON', () => {
    expect(binPathFromManifest('/pkgs/tsup', undefined, 'tsup')).toBeUndefined();
    expect(binPathFromManifest('/pkgs/tsup', 42, 'tsup')).toBeUndefined();
    expect(binPathFromManifest('/pkgs/tsup', {}, 'tsup')).toBeUndefined();
    expect(binPathFromManifest('/pkgs/tsup', { bin: { tsup: '' } }, 'tsup')).toBeUndefined();
  });
});
