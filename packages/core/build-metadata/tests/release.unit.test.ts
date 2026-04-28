import { describe, expect, it } from 'vitest';

import { resolveRelease, type AppBuildIdentity, type ReleaseInput } from '../src/release.js';

const FULL_SHA = 'c8b666485ecb08b5dc27e428737b4077c0531f57';
const SHORT_SHA = FULL_SHA.slice(0, 7);
const APP_VERSION_FIXTURE = '1.5.0';
// VERCEL_BRANCH_URL is a hostname (no scheme) per
// https://vercel.com/docs/environment-variables/system-environment-variables#VERCEL_BRANCH_URL
// Captured shape from a real Vercel preview build (commit b0c565b4):
//   poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements.vercel.thenational.academy
const BRANCH_URL_FEAT_X = 'feat-x-poc-oak.vercel.thenational.academy';
const BRANCH_URL_LABEL_FEAT_X = 'feat-x-poc-oak';

function env(overrides: Partial<ReleaseInput> = {}): ReleaseInput {
  return overrides;
}

describe('resolveRelease — projection from canonical build identity', () => {
  it('projects local development build identity into the Sentry release value', () => {
    const buildIdentityInput = {
      buildIdentity: {
        value: 'local-dev',
        buildContext: 'local',
        targetEnvironment: 'development',
        branch: 'other',
      } satisfies AppBuildIdentity,
    } satisfies ReleaseInput;

    const result = resolveRelease(buildIdentityInput);

    expect(result).toEqual({
      ok: true,
      value: {
        value: 'local-dev',
        source: 'build_identity',
        environment: 'development',
      },
    });
  });

  it('rejects build identity values that are not valid Sentry release names', () => {
    const result = resolveRelease({
      buildIdentity: {
        value: 'local/dev',
        buildContext: 'local',
        targetEnvironment: 'development',
        branch: 'other',
      },
    });

    expect(result).toEqual({
      ok: false,
      error: {
        kind: 'invalid_build_identity',
        message:
          'Cannot project app build identity "local/dev" to a Sentry release. ' +
          'Expected a Sentry-safe release name (no slash or backslash, no ' +
          'newlines or tabs, not "." / ".." / single space, length 1-200).',
      },
    });
  });

  it('uses Sentry context for the effective release environment', () => {
    const result = resolveRelease({
      buildIdentity: {
        value: 'branch-build',
        buildContext: 'vercel',
        targetEnvironment: 'production',
        branch: 'other',
      },
      VERCEL_ENV: 'production',
      VERCEL_GIT_COMMIT_REF: 'feature/build-identity',
    });

    expect(result).toEqual({
      ok: true,
      value: {
        value: 'branch-build',
        source: 'build_identity',
        environment: 'preview',
      },
    });
  });
});

describe('resolveRelease — SENTRY_RELEASE_OVERRIDE precedence', () => {
  it('uses the override in any environment context', () => {
    const result = resolveRelease(
      env({
        SENTRY_RELEASE_OVERRIDE: 'rehearsal-2026-04-23',
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
        APP_VERSION: APP_VERSION_FIXTURE,
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: {
        value: 'rehearsal-2026-04-23',
        source: 'SENTRY_RELEASE_OVERRIDE',
        environment: 'production',
      },
    });
  });

  it('still derives the effective environment when override is set', () => {
    const result = resolveRelease(
      env({
        SENTRY_RELEASE_OVERRIDE: 'manual-preview',
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: 'feat/x',
        VERCEL_BRANCH_URL: BRANCH_URL_FEAT_X,
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.environment).toBe('preview');
  });

  it('accepts "latest" as a valid override (Sentry docs do not reserve it)', () => {
    const result = resolveRelease(
      env({
        SENTRY_RELEASE_OVERRIDE: 'latest',
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        APP_VERSION: APP_VERSION_FIXTURE,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.value).toBe('latest');
  });

  it.each([
    ['.', 'single dot'],
    ['..', 'double dot'],
    ['has/slash', 'forward slash'],
    [String.raw`has\backslash`, 'backslash'],
    ['has\nnewline', 'newline'],
    ['has\ttab', 'tab'],
  ])('rejects the denied override "%s" (%s)', (invalidOverride) => {
    const result = resolveRelease(
      env({
        SENTRY_RELEASE_OVERRIDE: invalidOverride,
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        APP_VERSION: APP_VERSION_FIXTURE,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('invalid_release_override');
  });

  it('rejects an override longer than 200 characters', () => {
    const result = resolveRelease(
      env({
        SENTRY_RELEASE_OVERRIDE: 'a'.repeat(201),
        APP_VERSION: APP_VERSION_FIXTURE,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('invalid_release_override');
  });
});

describe('resolveRelease — production (VERCEL_ENV=production AND ref=main)', () => {
  it('uses APP_VERSION as a stable semver', () => {
    const result = resolveRelease(
      env({
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
        APP_VERSION: APP_VERSION_FIXTURE,
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: {
        value: APP_VERSION_FIXTURE,
        source: 'application_version',
        environment: 'production',
      },
    });
  });

  it('returns missing_application_version when APP_VERSION is absent on production', () => {
    const result = resolveRelease(
      env({
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_application_version');
  });

  it('returns invalid_application_version for a non-semver APP_VERSION', () => {
    const result = resolveRelease(
      env({
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        APP_VERSION: 'not-a-version',
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('invalid_application_version');
    expect(result.error.message).toContain('production');
  });

  it('rejects a pre-release APP_VERSION on main', () => {
    const result = resolveRelease(
      env({
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        APP_VERSION: '1.2.3-rc.1',
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('invalid_application_version');
    expect(result.error.message).toContain('pre-release');
  });
});

describe('resolveRelease — production-non-main downgrades to preview', () => {
  it('treats VERCEL_ENV=production with non-main branch as preview', () => {
    const result = resolveRelease(
      env({
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'feat/otel_sentry_enhancements',
        VERCEL_BRANCH_URL: BRANCH_URL_FEAT_X,
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
        APP_VERSION: APP_VERSION_FIXTURE,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.environment).toBe('preview');
    expect(result.value.source).toBe('vercel_branch_url');
    expect(result.value.value).toBe(BRANCH_URL_LABEL_FEAT_X);
  });
});

describe('resolveRelease — preview (branch-URL-host derivation)', () => {
  it('derives the leftmost label of VERCEL_BRANCH_URL as the release name', () => {
    const result = resolveRelease(
      env({
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: 'feat/otel_sentry_enhancements',
        VERCEL_BRANCH_URL: BRANCH_URL_FEAT_X,
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: {
        value: BRANCH_URL_LABEL_FEAT_X,
        source: 'vercel_branch_url',
        environment: 'preview',
      },
    });
  });

  it('returns missing_branch_url_in_preview when VERCEL_BRANCH_URL is absent', () => {
    const result = resolveRelease(
      env({
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: 'feat/x',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_branch_url_in_preview');
  });

  it('rejects scheme-prefixed inputs (Vercel populates a hostname, not a URL)', () => {
    const result = resolveRelease(
      env({
        VERCEL_ENV: 'preview',
        VERCEL_BRANCH_URL: 'https://feat-x-poc-oak.vercel.thenational.academy',
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_branch_url_in_preview');
    expect(result.error.message).toContain('must be a hostname, not a full URL');
  });

  it('returns missing_branch_url_in_preview for a hostname with disallowed characters', () => {
    const result = resolveRelease(
      env({
        VERCEL_ENV: 'preview',
        VERCEL_BRANCH_URL: 'host with space.example.com',
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_branch_url_in_preview');
  });

  it('returns missing_branch_url_in_preview for an IPv4 literal host', () => {
    const result = resolveRelease(
      env({
        VERCEL_ENV: 'preview',
        VERCEL_BRANCH_URL: '127.0.0.1',
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_branch_url_in_preview');
  });

  it('returns missing_branch_url_in_preview for an IPv6 literal host', () => {
    const result = resolveRelease(
      env({
        VERCEL_ENV: 'preview',
        VERCEL_BRANCH_URL: '[::1]',
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_branch_url_in_preview');
  });

  it('accepts the captured real Vercel preview shape', () => {
    // Captured from build dpl_7ABBkZstCUKCqWXfmABCEpJjo3P3 (commit f1f28e85),
    // 2026-04-25. This is the literal value Vercel injects on preview deploys
    // of this repo's branches.
    const realVercelHostname =
      'poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements.vercel.thenational.academy';
    const result = resolveRelease(
      env({
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: 'feat/otel_sentry_enhancements',
        VERCEL_BRANCH_URL: realVercelHostname,
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.value).toBe('poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements');
    expect(result.value.source).toBe('vercel_branch_url');
    expect(result.value.environment).toBe('preview');
  });
});

describe('resolveRelease — development (no VERCEL_ENV, or VERCEL_ENV=development)', () => {
  it('derives dev-<shortSha> from VERCEL_GIT_COMMIT_SHA when explicitly development', () => {
    const result = resolveRelease(
      env({
        VERCEL_ENV: 'development',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: {
        value: `dev-${SHORT_SHA}`,
        source: 'development_short_sha',
        environment: 'development',
      },
    });
  });

  it('treats unset VERCEL_ENV as development', () => {
    const result = resolveRelease(env({ VERCEL_GIT_COMMIT_SHA: FULL_SHA }));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.environment).toBe('development');
    expect(result.value.value).toBe(`dev-${SHORT_SHA}`);
  });

  it('prefers VERCEL_BRANCH_URL host label over SHA when both are set locally', () => {
    const result = resolveRelease(
      env({
        VERCEL_BRANCH_URL: BRANCH_URL_FEAT_X,
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.value).toBe(BRANCH_URL_LABEL_FEAT_X);
    expect(result.value.source).toBe('vercel_branch_url');
    expect(result.value.environment).toBe('development');
  });

  it('falls back to SHA when VERCEL_BRANCH_URL is malformed', () => {
    const result = resolveRelease(
      env({
        VERCEL_BRANCH_URL: 'host with space.example.com',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.value).toBe(`dev-${SHORT_SHA}`);
  });

  it('falls back to SHA when VERCEL_BRANCH_URL is scheme-prefixed', () => {
    const result = resolveRelease(
      env({
        VERCEL_BRANCH_URL: 'https://feat-x-poc-oak.vercel.thenational.academy',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.value).toBe(`dev-${SHORT_SHA}`);
  });

  it('returns missing_git_sha when neither VERCEL_GIT_COMMIT_SHA nor branch URL are usable', () => {
    const result = resolveRelease(env({ VERCEL_ENV: 'development' }));

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_git_sha');
  });
});
