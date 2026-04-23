import { describe, expect, it } from 'vitest';

import {
  resolveBuildTimeRelease,
  type BuildTimeReleaseEnvironmentInput,
} from '../src/build-time-release.js';

const FULL_SHA = 'c8b666485ecb08b5dc27e428737b4077c0531f57';
const SHORT_SHA = FULL_SHA.slice(0, 7);
const ROOT_PACKAGE_VERSION_FIXTURE = '1.5.0';

function env(
  overrides: Partial<BuildTimeReleaseEnvironmentInput> = {},
): BuildTimeReleaseEnvironmentInput {
  return overrides;
}

describe('resolveBuildTimeRelease — SENTRY_RELEASE_OVERRIDE precedence', () => {
  it('uses the override in any environment context', () => {
    const result = resolveBuildTimeRelease(
      env({
        SENTRY_RELEASE_OVERRIDE: 'rehearsal-2026-04-23',
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: {
        value: 'rehearsal-2026-04-23',
        source: 'SENTRY_RELEASE_OVERRIDE',
        environment: 'production',
        gitSha: FULL_SHA,
      },
    });
  });

  it('still derives the effective environment when override is set', () => {
    const result = resolveBuildTimeRelease(
      env({
        SENTRY_RELEASE_OVERRIDE: 'manual-preview',
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: 'feat/x',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.environment).toBe('preview');
  });

  it('rejects an override with whitespace', () => {
    const result = resolveBuildTimeRelease(
      env({
        SENTRY_RELEASE_OVERRIDE: 'has spaces',
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: 'feat/x',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('invalid_release_override');
  });

  it.each(['latest', '.', '..'])('rejects the reserved override "%s"', (reserved) => {
    const result = resolveBuildTimeRelease(
      env({
        SENTRY_RELEASE_OVERRIDE: reserved,
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('invalid_release_override');
  });
});

describe('resolveBuildTimeRelease — production (VERCEL_ENV=production AND ref=main)', () => {
  it('uses the root package.json version', () => {
    const result = resolveBuildTimeRelease(
      env({
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: {
        value: ROOT_PACKAGE_VERSION_FIXTURE,
        source: 'application_version',
        environment: 'production',
        gitSha: FULL_SHA,
      },
    });
  });

  it('honours APP_VERSION_OVERRIDE on production', () => {
    const result = resolveBuildTimeRelease(
      env({
        APP_VERSION_OVERRIDE: '9.9.9',
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.value).toBe('9.9.9');
    expect(result.value.source).toBe('application_version');
  });

  it('returns invalid_application_version for a malformed APP_VERSION_OVERRIDE', () => {
    const result = resolveBuildTimeRelease(
      env({
        APP_VERSION_OVERRIDE: 'not-a-version',
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('invalid_application_version');
    expect(result.error.message).toContain('production');
  });
});

describe('resolveBuildTimeRelease — production-non-main downgrades to preview', () => {
  it('treats VERCEL_ENV=production with non-main branch as preview', () => {
    const result = resolveBuildTimeRelease(
      env({
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'feat/otel_sentry_enhancements',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.environment).toBe('preview');
    expect(result.value.source).toBe('preview_branch_sha');
    expect(result.value.value).toBe(`preview-feat-otel-sentry-enhancements-${SHORT_SHA}`);
  });
});

describe('resolveBuildTimeRelease — preview', () => {
  it('derives preview-<branch-slug>-<shortSha>', () => {
    const result = resolveBuildTimeRelease(
      env({
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: 'feat/otel_sentry_enhancements',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: {
        value: `preview-feat-otel-sentry-enhancements-${SHORT_SHA}`,
        source: 'preview_branch_sha',
        environment: 'preview',
        gitSha: FULL_SHA,
      },
    });
  });

  it('slugifies non-[a-z0-9-] characters and collapses runs', () => {
    const result = resolveBuildTimeRelease(
      env({
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: 'Feat/Mixed_CASE--Branch.Name!!',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.value).toBe(`preview-feat-mixed-case-branch-name-${SHORT_SHA}`);
  });

  it('caps the branch slug length so the release name stays scannable', () => {
    const longBranch = 'a'.repeat(120);
    const result = resolveBuildTimeRelease(
      env({
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: longBranch,
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const [, slug] = result.value.value.split('preview-');
    expect(slug.startsWith('a'.repeat(60))).toBe(true);
  });

  it('returns missing_branch_in_preview when VERCEL_GIT_COMMIT_REF is absent', () => {
    const result = resolveBuildTimeRelease(
      env({
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_SHA: FULL_SHA,
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_branch_in_preview');
  });

  it('returns missing_git_sha when VERCEL_GIT_COMMIT_SHA is absent', () => {
    const result = resolveBuildTimeRelease(
      env({
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: 'feat/x',
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_git_sha');
  });
});

describe('resolveBuildTimeRelease — development (no VERCEL_ENV or development)', () => {
  it('derives dev-<shortSha> from VERCEL_GIT_COMMIT_SHA when explicitly development', () => {
    const result = resolveBuildTimeRelease(
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
        gitSha: FULL_SHA,
      },
    });
  });

  it('treats unset VERCEL_ENV as development', () => {
    const result = resolveBuildTimeRelease(env({ VERCEL_GIT_COMMIT_SHA: FULL_SHA }));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.environment).toBe('development');
    expect(result.value.value).toBe(`dev-${SHORT_SHA}`);
  });

  it('honours GIT_SHA_OVERRIDE in development', () => {
    const result = resolveBuildTimeRelease(
      env({
        GIT_SHA_OVERRIDE: '3ad6f452abc123def4567890abc123def4567890',
      }),
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.value).toBe('dev-3ad6f45');
  });

  it('returns missing_git_sha when no SHA is available in development', () => {
    const result = resolveBuildTimeRelease(env({ VERCEL_ENV: 'development' }));

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('missing_git_sha');
  });
});

describe('resolveBuildTimeRelease — invalid SHA inputs surface as invalid_git_sha', () => {
  it('surfaces invalid_git_sha for a malformed VERCEL_GIT_COMMIT_SHA', () => {
    const result = resolveBuildTimeRelease(
      env({
        VERCEL_ENV: 'preview',
        VERCEL_GIT_COMMIT_REF: 'feat/x',
        VERCEL_GIT_COMMIT_SHA: 'not-a-sha',
      }),
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.error.kind).toBe('invalid_git_sha');
  });
});
