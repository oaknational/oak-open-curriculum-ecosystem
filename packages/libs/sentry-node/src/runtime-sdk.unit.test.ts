import { describe, expect, it } from 'vitest';
import { createSentryInitOptions } from './runtime-sdk.js';
import type { SentryLiveConfig } from './types.js';

// ADR-163 §2 — OTel `code.git.commit.sha` tag convention lives on
// `initialScope.tags` via the `git.commit.sha` key. These tests prove the
// SDK init-options boundary emits the rename cleanly without
// depending on the sibling `createSentryConfig` factory.

function liveConfig(overrides: Partial<SentryLiveConfig> = {}): SentryLiveConfig {
  return {
    mode: 'sentry',
    dsn: 'https://key@example.ingest.sentry.io/123',
    environment: 'production',
    environmentSource: 'SENTRY_ENVIRONMENT_OVERRIDE',
    release: 'release-123',
    releaseSource: 'SENTRY_RELEASE_OVERRIDE',
    tracesSampleRate: 0.5,
    enableLogs: false,
    sendDefaultPii: false,
    debug: false,
    ...overrides,
  };
}

describe('createSentryInitOptions — initialScope.tags carries OTel git.commit.sha key', () => {
  it('emits git.commit.sha when gitSha is present on the config', () => {
    const initOptions = createSentryInitOptions(
      liveConfig({ gitSha: 'abcdef1234567', gitShaSource: 'GIT_SHA_OVERRIDE' }),
      { serviceName: 'oak-http' },
    );
    const tags =
      initOptions.initialScope && 'tags' in initOptions.initialScope
        ? initOptions.initialScope.tags
        : undefined;

    expect(tags).toMatchObject({ 'git.commit.sha': 'abcdef1234567' });
    expect(tags).not.toHaveProperty('git_sha');
  });

  it('omits git.commit.sha when gitSha is absent', () => {
    const initOptions = createSentryInitOptions(liveConfig(), { serviceName: 'oak-http' });
    const tags =
      initOptions.initialScope && 'tags' in initOptions.initialScope
        ? initOptions.initialScope.tags
        : undefined;

    expect(tags).not.toHaveProperty('git.commit.sha');
    expect(tags).not.toHaveProperty('git_sha');
  });

  it('includes service, environment, release alongside git.commit.sha', () => {
    const initOptions = createSentryInitOptions(
      liveConfig({
        environment: 'production',
        release: 'release-123',
        gitSha: 'fedcba9876543',
        gitShaSource: 'GIT_SHA_OVERRIDE',
      }),
      { serviceName: 'oak-http' },
    );
    const tags =
      initOptions.initialScope && 'tags' in initOptions.initialScope
        ? initOptions.initialScope.tags
        : undefined;

    expect(tags).toEqual({
      service: 'oak-http',
      environment: 'production',
      release: 'release-123',
      'git.commit.sha': 'fedcba9876543',
    });
  });
});

// L-IMM Sub-item 2 — SDK-side allow-list scaffold. Sentry's own
// ignoreErrors / denyUrls run BEFORE beforeSend, so they drop events
// at the SDK boundary without consuming downstream pipeline budget.
// These tests assert the option pass-through shape; the seed
// allow-lists are deliberately empty in alpha (no known production
// noise yet), but the scaffold must be in place so future PRs can
// add patterns without touching the type.
describe('createSentryInitOptions — ignoreErrors / denyUrls allow-list scaffold (L-IMM Sub-item 2)', () => {
  it('passes ignoreErrors through to NodeOptions when configured', () => {
    const ignoreErrors = ['ResizeObserver loop limit exceeded', /^NetworkError/u] as const;
    const initOptions = createSentryInitOptions(liveConfig({ ignoreErrors }), {
      serviceName: 'oak-http',
    });

    expect(initOptions.ignoreErrors).toEqual(ignoreErrors);
  });

  it('passes denyUrls through to NodeOptions when configured', () => {
    const denyUrls = ['https://noisy.third-party.example/', /\/static\/legacy\//u] as const;
    const initOptions = createSentryInitOptions(liveConfig({ denyUrls }), {
      serviceName: 'oak-http',
    });

    expect(initOptions.denyUrls).toEqual(denyUrls);
  });

  it('omits both fields when neither is configured', () => {
    const initOptions = createSentryInitOptions(liveConfig(), { serviceName: 'oak-http' });

    expect(initOptions.ignoreErrors).toBeUndefined();
    expect(initOptions.denyUrls).toBeUndefined();
  });
});
