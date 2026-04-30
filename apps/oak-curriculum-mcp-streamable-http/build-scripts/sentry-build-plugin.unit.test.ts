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
 * Identity resolution: no `IDENTITY` literal exists in source. Org,
 * project, and `repoSlug` are read from the env snapshot at the boundary
 * by `resolveSentryBuildPluginIdentity`. Tests inject them via the env
 * factory, mirroring how Vercel populates them at build time.
 */

import { describe, expect, it } from 'vitest';
import { resolveSentryBuildPluginIdentity } from './sentry-build-plugin-identity.js';
import {
  createSentryBuildPlugin,
  type SentryBuildEnvironment,
  type SentryBuildPluginInputs,
} from './sentry-build-plugin.js';

const SENTRY_ORG = 'oak-national-academy';
const SENTRY_PROJECT = 'oak-open-curriculum-mcp';
const REPO_OWNER = 'oaknational';
const REPO_SLUG = 'oak-open-curriculum-ecosystem';
const FULL_REPO_SLUG = `${REPO_OWNER}/${REPO_SLUG}`;

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
    SENTRY_ORG,
    SENTRY_PROJECT,
    VERCEL_GIT_REPO_OWNER: REPO_OWNER,
    VERCEL_GIT_REPO_SLUG: REPO_SLUG,
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
    const result = createSentryBuildPlugin(productionMain());
    expectConfigured(result);
  });

  it('uses APP_VERSION as the release name', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain()));
    expect(inputs.release.name).toBe(APP_VERSION);
  });

  it('binds setCommits.commit to VERCEL_GIT_COMMIT_SHA', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain()));
    expect(inputs.release.setCommits.commit).toBe(COMMIT_SHA);
  });

  it('binds setCommits.repo to the resolved identity repoSlug', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain()));
    expect(inputs.release.setCommits.repo).toBe(FULL_REPO_SLUG);
  });

  it('sets deploy.env to "production"', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain()));
    expect(inputs.release.deploy.env).toBe('production');
  });

  it('disables vendor telemetry', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain()));
    expect(inputs.telemetry).toBe(false);
  });

  it('targets dist sourcemaps for post-upload deletion', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain()));
    expect(inputs.sourcemaps.filesToDeleteAfterUpload).toEqual(['dist/server.js.map']);
  });

  it('passes through SENTRY_AUTH_TOKEN to the plugin inputs', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain()));
    expect(inputs.authToken).toBe(AUTH_TOKEN);
  });

  it('passes through identity (org, project) from the env boundary', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(productionMain()));
    expect(inputs.org).toBe(SENTRY_ORG);
    expect(inputs.project).toBe(SENTRY_PROJECT);
  });

  it('exposes the resolved release on the configured intent for persistence', () => {
    const result = createSentryBuildPlugin(productionMain());
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
    const result = createSentryBuildPlugin(productionMain());
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
    const inputs = expectConfigured(createSentryBuildPlugin(preview()));
    expect(inputs.release.deploy.env).toBe('preview');
  });

  it('derives release name as the leftmost label of VERCEL_BRANCH_URL hostname', () => {
    const inputs = expectConfigured(createSentryBuildPlugin(preview()));
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
    );
    const inputs = expectConfigured(result);
    expect(inputs.release.deploy.env).toBe('preview');
    expect(inputs.release.name).toBe(BRANCH_URL_LABEL);
  });
});

describe('createSentryBuildPlugin — development without override', () => {
  it('emits disabled intent (registration_disabled_by_policy)', () => {
    const result = createSentryBuildPlugin(env({ VERCEL_ENV: 'development' }));
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value).toEqual({
      kind: 'disabled',
      reason: 'registration_disabled_by_policy',
    });
  });

  it('tolerates missing identity vars when registration is disabled (fork-friendly)', () => {
    // Local dev / fork checkout: no SENTRY_ORG, no SENTRY_PROJECT, no
    // VERCEL_GIT_REPO_*. Build still succeeds because identity is resolved
    // lazily, only on the configured path.
    const result = createSentryBuildPlugin({
      VERCEL_ENV: 'development',
      APP_VERSION,
      VERCEL_GIT_COMMIT_SHA: COMMIT_SHA,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.kind).toBe('disabled');
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
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_commit_sha_in_registered_environment');
  });
});

describe('createSentryBuildPlugin — identity resolution on the configured path', () => {
  it('returns err when SENTRY_ORG is missing on a registered build', () => {
    const result = createSentryBuildPlugin(
      env({
        SENTRY_ORG: undefined,
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_sentry_org');
  });

  it('returns err when SENTRY_PROJECT is missing on a registered build', () => {
    const result = createSentryBuildPlugin(
      env({
        SENTRY_PROJECT: undefined,
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_sentry_project');
  });

  it('returns err when neither SENTRY_REPO_SLUG nor the Vercel repo pair are available', () => {
    const result = createSentryBuildPlugin(
      env({
        SENTRY_REPO_SLUG: undefined,
        VERCEL_GIT_REPO_OWNER: undefined,
        VERCEL_GIT_REPO_SLUG: undefined,
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_sentry_repo_slug');
  });

  it('treats whitespace-only identity vars as missing', () => {
    const result = createSentryBuildPlugin(
      env({
        SENTRY_ORG: '   ',
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_sentry_org');
  });
});

describe('resolveSentryBuildPluginIdentity — repoSlug derivation precedence', () => {
  it('prefers an explicit SENTRY_REPO_SLUG over the Vercel repo pair', () => {
    const result = resolveSentryBuildPluginIdentity(
      env({
        SENTRY_REPO_SLUG: 'fork-owner/fork-repo',
        VERCEL_GIT_REPO_OWNER: 'oaknational',
        VERCEL_GIT_REPO_SLUG: 'oak-open-curriculum-ecosystem',
      }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.repoSlug).toBe('fork-owner/fork-repo');
  });

  it('derives repoSlug from the Vercel repo pair when SENTRY_REPO_SLUG is unset', () => {
    const result = resolveSentryBuildPluginIdentity(
      env({
        SENTRY_REPO_SLUG: undefined,
        VERCEL_GIT_REPO_OWNER: 'oaknational',
        VERCEL_GIT_REPO_SLUG: 'oak-open-curriculum-ecosystem',
      }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.repoSlug).toBe('oaknational/oak-open-curriculum-ecosystem');
  });

  it('returns err when only one half of the Vercel repo pair is available', () => {
    const result = resolveSentryBuildPluginIdentity(
      env({
        SENTRY_REPO_SLUG: undefined,
        VERCEL_GIT_REPO_OWNER: 'oaknational',
        VERCEL_GIT_REPO_SLUG: undefined,
      }),
    );
    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_sentry_repo_slug');
  });

  it('returns the typed identity when all three vars are explicit', () => {
    const result = resolveSentryBuildPluginIdentity(
      env({
        SENTRY_ORG: 'my-org',
        SENTRY_PROJECT: 'my-project',
        SENTRY_REPO_SLUG: 'me/my-repo',
      }),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value).toEqual({
      org: 'my-org',
      project: 'my-project',
      repoSlug: 'me/my-repo',
    });
  });
});
