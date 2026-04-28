import { describe, expect, it } from 'vitest';
import {
  assertConfiguredSentryBuildOutput,
  createConfiguredSentryBuildGateEnv,
  REPRESENTATIVE_PREVIEW_GATE_ENV,
} from './sentry-configured-build-gate.js';

describe('createConfiguredSentryBuildGateEnv', () => {
  it('requires SENTRY_AUTH_TOKEN', () => {
    expect(() =>
      createConfiguredSentryBuildGateEnv({
        SENTRY_AUTH_TOKEN: '   ',
      }),
    ).toThrow(/SENTRY_AUTH_TOKEN/);
  });

  it('seeds representative preview-style Vercel env when absent', () => {
    const gateEnv = createConfiguredSentryBuildGateEnv({
      SENTRY_AUTH_TOKEN: ' token-value ',
    });

    expect(gateEnv.SENTRY_AUTH_TOKEN).toBe('token-value');
    expect(gateEnv.VERCEL_ENV).toBe(REPRESENTATIVE_PREVIEW_GATE_ENV.VERCEL_ENV);
    expect(gateEnv.VERCEL_GIT_COMMIT_REF).toBe(
      REPRESENTATIVE_PREVIEW_GATE_ENV.VERCEL_GIT_COMMIT_REF,
    );
    expect(gateEnv.VERCEL_GIT_COMMIT_SHA).toBe(
      REPRESENTATIVE_PREVIEW_GATE_ENV.VERCEL_GIT_COMMIT_SHA,
    );
  });

  it('preserves existing Vercel identity values when they are already set', () => {
    const gateEnv = createConfiguredSentryBuildGateEnv({
      SENTRY_AUTH_TOKEN: 'token-value',
      VERCEL_ENV: 'production',
      VERCEL_GIT_COMMIT_REF: 'main',
      VERCEL_GIT_COMMIT_SHA: 'abcdef1234567890abcdef1234567890abcdef12',
    });

    expect(gateEnv.VERCEL_ENV).toBe('production');
    expect(gateEnv.VERCEL_GIT_COMMIT_REF).toBe('main');
    expect(gateEnv.VERCEL_GIT_COMMIT_SHA).toBe('abcdef1234567890abcdef1234567890abcdef12');
  });
});

describe('assertConfiguredSentryBuildOutput', () => {
  it('accepts output from the configured esbuild-plugin branch', () => {
    expect(() =>
      assertConfiguredSentryBuildOutput(
        [
          '[esbuild.config] build-info written: release=preview-feat-x-0123456 env=preview source=git',
          '[esbuild.config] Sentry plugin enabled: release=preview-feat-x-0123456 env=preview',
        ].join('\n'),
      ),
    ).not.toThrow();
  });

  it('rejects registration_disabled_by_policy output', () => {
    expect(() =>
      assertConfiguredSentryBuildOutput(
        '[esbuild.config] Sentry plugin skipped: registration_disabled_by_policy',
      ),
    ).toThrow(/registration_disabled_by_policy/);
  });

  it('rejects auth_token_missing output', () => {
    expect(() =>
      assertConfiguredSentryBuildOutput(
        '[esbuild.config] Sentry plugin skipped: auth_token_missing',
      ),
    ).toThrow(/auth_token_missing/);
  });

  it('rejects output that never reaches the enabled marker', () => {
    expect(() =>
      assertConfiguredSentryBuildOutput(
        '[esbuild.config] build-info written: release=x env=preview',
      ),
    ).toThrow(/Sentry plugin enabled/);
  });
});
