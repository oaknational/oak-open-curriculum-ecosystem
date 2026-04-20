/**
 * §L-8 WS1 RED — sentry build-plugin intent factory.
 *
 * @remarks
 * Proves the Oak-authored boundary between ADR-163 §3 policy
 * (`@oaknational/sentry-node`) and `@sentry/esbuild-plugin`: given
 * build-time env + Oak identity literals, what is the registration
 * intent? Cases drive the meaningful permutations of the policy truth
 * table, plus the disabled and override paths.
 *
 * Intentionally NOT tested (vendor or composition-root concerns):
 *
 * - whether the resulting plugin actually emits Debug IDs into dist
 * - whether `sentry-cli` upload succeeds (lives in the Vercel preview
 *   smoke proof, WS4/WS5)
 * - call counts on the policy resolvers (implementation detail)
 *
 * Replaces the three integration tests originally specified in §L-8
 * WS1.1 + WS1.2 — see plan body §L-8 WS1 and the 2026-04-21 napkin
 * entry for the intent-review-driven simplification.
 */

import { describe, expect, it } from 'vitest';
import {
  createSentryBuildPlugin,
  type SentryBuildEnvironment,
  type SentryBuildPluginIdentity,
  type SentryBuildPluginInputs,
} from './sentry-build-plugin.js';

const IDENTITY: SentryBuildPluginIdentity = {
  org: 'oak-national-academy',
  project: 'oak-open-curriculum-mcp',
  repoSlug: 'oaknational/oak-open-curriculum-ecosystem',
};

const COMMIT_SHA = 'abcdef1234567890abcdef1234567890abcdef12';
const APP_VERSION = '1.5.0';
const AUTH_TOKEN = 'sntrys-fake-token';

function env(overrides: Partial<SentryBuildEnvironment> = {}): SentryBuildEnvironment {
  return {
    APP_VERSION,
    VERCEL_GIT_COMMIT_SHA: COMMIT_SHA,
    SENTRY_AUTH_TOKEN: AUTH_TOKEN,
    ...overrides,
  };
}

function expectConfigured(
  result: ReturnType<typeof createSentryBuildPlugin>,
): SentryBuildPluginInputs {
  expect(result.ok).toBe(true);
  if (!result.ok) {
    throw new Error(`expected ok result, got err: ${JSON.stringify(result.error)}`);
  }
  expect(result.value.kind).toBe('configured');
  if (result.value.kind !== 'configured') {
    throw new Error(`expected configured intent, got disabled: ${result.value.reason}`);
  }
  return result.value.inputs;
}

describe('createSentryBuildPlugin — production environment, main branch', () => {
  const productionMain = (): SentryBuildEnvironment =>
    env({ VERCEL_ENV: 'production', VERCEL_GIT_COMMIT_REF: 'main' });

  it('emits a configured intent', () => {
    const result = createSentryBuildPlugin(productionMain(), IDENTITY);
    expectConfigured(result);
  });

  it('uses APP_VERSION as the release name', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain(), IDENTITY));
    expect(inputs.release.name).toBe(APP_VERSION);
  });

  it('binds setCommits.commit to VERCEL_GIT_COMMIT_SHA', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain(), IDENTITY));
    expect(inputs.release.setCommits.commit).toBe(COMMIT_SHA);
  });

  it('binds setCommits.repo to identity.repoSlug', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain(), IDENTITY));
    expect(inputs.release.setCommits.repo).toBe(IDENTITY.repoSlug);
  });

  it('sets deploy.env to "production"', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain(), IDENTITY));
    expect(inputs.release.deploy.env).toBe('production');
  });

  it('disables vendor telemetry', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain(), IDENTITY));
    expect(inputs.telemetry).toBe(false);
  });

  it('targets dist sourcemaps for post-upload deletion', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain(), IDENTITY));
    expect(inputs.sourcemaps.filesToDeleteAfterUpload).toEqual(['dist/**/*.js.map']);
  });

  it('passes through SENTRY_AUTH_TOKEN to the plugin inputs', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain(), IDENTITY));
    expect(inputs.authToken).toBe(AUTH_TOKEN);
  });

  it('passes through identity (org, project)', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain(), IDENTITY));
    expect(inputs.org).toBe(IDENTITY.org);
    expect(inputs.project).toBe(IDENTITY.project);
  });
});

describe('createSentryBuildPlugin — preview environment', () => {
  it('emits configured intent with deploy.env="preview"', () => {
    const result = createSentryBuildPlugin(
      env({ VERCEL_ENV: 'preview', VERCEL_GIT_COMMIT_REF: 'feature/x' }),
      IDENTITY,
    );
    const inputs = expectConfigured(result);
    expect(inputs.release.deploy.env).toBe('preview');
  });
});

describe('createSentryBuildPlugin — production env on non-main branch (downgraded by ADR-163 §3)', () => {
  it('emits configured intent with deploy.env="preview" (env identity is downgraded)', () => {
    const result = createSentryBuildPlugin(
      env({ VERCEL_ENV: 'production', VERCEL_GIT_COMMIT_REF: 'feature/x' }),
      IDENTITY,
    );
    const inputs = expectConfigured(result);
    expect(inputs.release.deploy.env).toBe('preview');
  });
});

describe('createSentryBuildPlugin — development without override', () => {
  it('emits disabled intent (registration_disabled_by_policy)', () => {
    const result = createSentryBuildPlugin(env({ VERCEL_ENV: 'development' }), IDENTITY);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value).toEqual({
      kind: 'disabled',
      reason: 'registration_disabled_by_policy',
    });
  });
});

describe('createSentryBuildPlugin — development with override pair (ADR-163 §4)', () => {
  it('emits configured intent when both override envs are set', () => {
    const result = createSentryBuildPlugin(
      env({
        VERCEL_ENV: 'development',
        SENTRY_RELEASE_REGISTRATION_OVERRIDE: '1',
        SENTRY_RELEASE_OVERRIDE: 'uat-candidate',
      }),
      IDENTITY,
    );
    const inputs = expectConfigured(result);
    expect(inputs.release.name).toBe('uat-candidate');
    expect(inputs.release.deploy.env).toBe('development');
  });
});

describe('createSentryBuildPlugin — configuration errors propagate from policy', () => {
  it('returns err when override flag is set without override value (half-pair)', () => {
    const result = createSentryBuildPlugin(
      env({ VERCEL_ENV: 'development', SENTRY_RELEASE_REGISTRATION_OVERRIDE: '1' }),
      IDENTITY,
    );
    expect(result).toEqual({
      ok: false,
      error: { kind: 'invalid_release_registration_override' },
    });
  });

  it('returns err when commit SHA is invalid in a registered environment', () => {
    const result = createSentryBuildPlugin(
      env({
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: 'not-a-sha',
      }),
      IDENTITY,
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('invalid_git_sha');
  });

  it('returns err when APP_VERSION is missing in a registered environment', () => {
    const result = createSentryBuildPlugin(
      env({
        APP_VERSION: undefined,
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
      }),
      IDENTITY,
    );
    expect(result).toEqual({
      ok: false,
      error: { kind: 'missing_app_version' },
    });
  });
});
