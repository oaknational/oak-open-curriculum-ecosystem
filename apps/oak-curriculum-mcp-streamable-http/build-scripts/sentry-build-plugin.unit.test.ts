/**
 * Unit tests for the Sentry build-plugin intent factory.
 *
 * @remarks Proves the Oak-authored boundary between ADR-163 §3 policy
 * (`@oaknational/sentry-node`) + the canonical release-name resolver
 * (`@oaknational/build-metadata`'s `resolveRelease`) and
 * `@sentry/esbuild-plugin`. Cases drive the meaningful permutations of
 * the policy truth table, the three release-derivation contexts
 * (production / preview / development), and the warn-vs-throw
 * fail-policy split.
 *
 * Post-collapse: `APP_VERSION` is supplied in the env snapshot (no
 * more ROOT_PACKAGE_VERSION side-channel); preview uses the
 * `VERCEL_BRANCH_URL` leftmost-host-label derivation.
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
// VERCEL_BRANCH_URL is a hostname (no scheme) per
// https://vercel.com/docs/environment-variables/system-environment-variables#VERCEL_BRANCH_URL
// — "The domain name of a Generated Deployment URL". Captured shape
// from a real Vercel preview build of this repo.
const BRANCH_URL = 'feat-otel-poc-oak.vercel.thenational.academy';
const BRANCH_URL_LABEL = 'feat-otel-poc-oak';

function env(overrides: Partial<SentryBuildEnvironment> = {}): SentryBuildEnvironment {
  return {
    VERCEL_GIT_COMMIT_SHA: COMMIT_SHA,
    APP_VERSION,
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
    throw new Error(`expected configured intent, got ${result.value.kind}`);
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
    expect(inputs.sourcemaps.filesToDeleteAfterUpload).toEqual(['dist/server.js.map']);
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

  it('exposes the resolved release on the configured intent for persistence', () => {
    const result = createSentryBuildPlugin(productionMain(), IDENTITY);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.kind).toBe('configured');
    if (result.value.kind !== 'configured') {
      return;
    }
    expect(result.value.release.value).toBe(APP_VERSION);
    expect(result.value.release.source).toBe('application_version');
    expect(result.value.release.environment).toBe('production');
  });

  it('exposes the resolved gitSha on the configured intent for persistence', () => {
    const result = createSentryBuildPlugin(productionMain(), IDENTITY);
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    if (result.value.kind !== 'configured') {
      return;
    }
    expect(result.value.gitSha).toEqual({
      value: COMMIT_SHA,
      source: 'VERCEL_GIT_COMMIT_SHA',
    });
  });
});

describe('createSentryBuildPlugin — preview environment', () => {
  const preview = (): SentryBuildEnvironment =>
    env({
      VERCEL_ENV: 'preview',
      VERCEL_GIT_COMMIT_REF: 'feat/otel_sentry_enhancements',
      VERCEL_BRANCH_URL: BRANCH_URL,
    });

  it('emits configured intent with deploy.env="preview"', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(preview(), IDENTITY));
    expect(inputs.release.deploy.env).toBe('preview');
  });

  it('derives release name as the leftmost label of VERCEL_BRANCH_URL hostname', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(preview(), IDENTITY));
    expect(inputs.release.name).toBe(BRANCH_URL_LABEL);
  });
});

describe('createSentryBuildPlugin — production env on non-main branch (downgraded)', () => {
  it('emits configured intent with deploy.env="preview" (env identity is downgraded)', () => {
    const result = createSentryBuildPlugin(
      env({
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'feature/x',
        VERCEL_BRANCH_URL: BRANCH_URL,
      }),
      IDENTITY,
    );
    const inputs = expectConfigured(result);
    expect(inputs.release.deploy.env).toBe('preview');
    expect(inputs.release.name).toBe(BRANCH_URL_LABEL);
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

describe('createSentryBuildPlugin — fail-policy split', () => {
  it('skips on preview when SENTRY_AUTH_TOKEN is missing (warn-and-continue)', () => {
    const result = createSentryBuildPlugin(
      env({
        SENTRY_AUTH_TOKEN: undefined,
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: 'feat/x',
        VERCEL_BRANCH_URL: BRANCH_URL,
      }),
      IDENTITY,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.kind).toBe('skipped');
    if (result.value.kind !== 'skipped') {
      return;
    }
    expect(result.value.reason).toBe('auth_token_missing');
    expect(result.value.release.environment).toBe('preview');
  });

  it('skips on development+override when SENTRY_AUTH_TOKEN is missing (warn-and-continue)', () => {
    const result = createSentryBuildPlugin(
      env({
        SENTRY_AUTH_TOKEN: undefined,
        VERCEL_ENV: 'development',
        SENTRY_RELEASE_REGISTRATION_OVERRIDE: '1',
        SENTRY_RELEASE_OVERRIDE: 'rehearsal',
      }),
      IDENTITY,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.kind).toBe('skipped');
  });

  it('throws on production when SENTRY_AUTH_TOKEN is missing (vital identity)', () => {
    const result = createSentryBuildPlugin(
      env({
        SENTRY_AUTH_TOKEN: undefined,
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
      }),
      IDENTITY,
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_auth_token_on_production');
  });

  it('treats whitespace-only SENTRY_AUTH_TOKEN as missing', () => {
    const result = createSentryBuildPlugin(
      env({
        SENTRY_AUTH_TOKEN: '   ',
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: 'feat/x',
        VERCEL_BRANCH_URL: BRANCH_URL,
      }),
      IDENTITY,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.kind).toBe('skipped');
  });
});

describe('createSentryBuildPlugin — vital-identity errors propagate from policy', () => {
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

  it('returns err when no git SHA is available on a preview build', () => {
    const result = createSentryBuildPlugin(
      env({
        VERCEL_GIT_COMMIT_SHA: undefined,
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: 'feat/x',
        VERCEL_BRANCH_URL: BRANCH_URL,
      }),
      IDENTITY,
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_commit_sha_in_registered_environment');
  });
});
