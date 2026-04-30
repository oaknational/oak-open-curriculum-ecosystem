import { describe, expect, it } from 'vitest';
import { createSentryBuildEnvironment } from './sentry-build-environment.js';

describe('createSentryBuildEnvironment', () => {
  it('projects APP_VERSION from the canonical application-version resolver', () => {
    const result = createSentryBuildEnvironment({
      APP_VERSION_OVERRIDE: '1.2.3',
      APP_VERSION: '9.9.9',
      VERCEL_GIT_COMMIT_REF: 'main',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.APP_VERSION).toBe('1.2.3');
    expect(result.value.APP_VERSION_SOURCE).toBe('APP_VERSION_OVERRIDE');
  });

  it('does not let a raw APP_VERSION env value own the build contract', () => {
    const result = createSentryBuildEnvironment({
      APP_VERSION_OVERRIDE: '2.0.0',
      APP_VERSION: '1.0.0',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.APP_VERSION).toBe('2.0.0');
  });

  it('preserves VERCEL_GIT_COMMIT_REF for production attribution', () => {
    const result = createSentryBuildEnvironment({
      APP_VERSION_OVERRIDE: '3.4.5',
      VERCEL_GIT_COMMIT_REF: 'main',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.VERCEL_GIT_COMMIT_REF).toBe('main');
  });

  it('projects Sentry deployment identity vars (org, project, repoSlug)', () => {
    const result = createSentryBuildEnvironment({
      APP_VERSION_OVERRIDE: '1.0.0',
      SENTRY_ORG: 'my-org',
      SENTRY_PROJECT: 'my-project',
      SENTRY_REPO_SLUG: 'me/my-repo',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.SENTRY_ORG).toBe('my-org');
    expect(result.value.SENTRY_PROJECT).toBe('my-project');
    expect(result.value.SENTRY_REPO_SLUG).toBe('me/my-repo');
  });

  it('projects Vercel git-repo system vars used to derive repoSlug', () => {
    const result = createSentryBuildEnvironment({
      APP_VERSION_OVERRIDE: '1.0.0',
      VERCEL_GIT_REPO_OWNER: 'oaknational',
      VERCEL_GIT_REPO_SLUG: 'oak-open-curriculum-ecosystem',
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.VERCEL_GIT_REPO_OWNER).toBe('oaknational');
    expect(result.value.VERCEL_GIT_REPO_SLUG).toBe('oak-open-curriculum-ecosystem');
  });
});
