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
});
